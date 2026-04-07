const express = require('express')
const { Pool } = require('pg')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
if (!dbUrl) {
  console.error('DATABASE_URL or SUPABASE_DB_URL is required')
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
})

const database = {
  nameTableClients: 'clientstest',
  nameTableManage: 'portfolios',
}

function executeQuery(text, params = []) {
  return pool.query(text, params).then((result) => result.rows)
}

function generateSqltoInsert(arrayCampos, arrayValues, datatable) {
  const placeholders = arrayValues.map((_, idx) => `$${idx + 1}`).join(', ')
  const text = `INSERT INTO ${datatable}(${arrayCampos.join(', ')}) VALUES (${placeholders})`
  const values = arrayValues.map((element) => (typeof element === 'string' ? element.replace(/'/g, '"') : element))
  return { text, values }
}

function generateUpdateSql(clientName, inputData, fields) {
  const assignments = fields
    .map((columnName, index) => `${columnName.replace(/ /g, '_')} = $${index + 1}`)
    .join(', ')
  const text = `UPDATE ${database.nameTableClients} SET ${assignments} WHERE Cliente = $${fields.length + 1} AND Tipo = $${fields.length + 2}`
  const values = [...inputData, clientName, inputData[0]]
  return { text, values }
}

function generateUpdatePortfolioSql(inputData, fields) {
  const assignments = fields
    .map((columnName, index) => `${columnName.replace(/ /g, '_')} = $${index + 1}`)
    .join(', ')
  const text = `UPDATE ${database.nameTableManage} SET ${assignments} WHERE CI_TITULAR = $${fields.length + 1}`
  const values = [...inputData, inputData[2]]
  return { text, values }
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/api/data/:clientName', async (req, res) => {
  try {
    const clientName = req.params.clientName
    const sql1 = `SELECT * FROM ${database.nameTableClients} WHERE Cliente = $1`
    const sql2 = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND lower(table_name) = lower($1) ORDER BY ordinal_position`
    const [result1, result2] = await Promise.all([
      executeQuery(sql1, [clientName]),
      executeQuery(sql2, [database.nameTableClients]),
    ])
    res.status(200).json({ result1, result2 })
  } catch (error) {
    console.error('Error /api/data/:clientName', error)
    res.status(500).json({ error: 'Error al obtener datos' })
  }
})

app.get('/api/data/clients/all', async (req, res) => {
  try {
    const sql = `SELECT Tipo, Cliente, NUT, Nombre, Estado_Civil, Fecha_Defunción FROM ${database.nameTableClients} WHERE Tipo = 'TITULAR' ORDER BY Nombre`
    const result1 = await executeQuery(sql)
    res.status(200).json({ result1 })
  } catch (error) {
    console.error('Error /api/data/clients/all', error)
    res.status(500).json({ error: 'Error al enviar datos' })
  }
})

app.post('/api/data/newclient', async (req, res) => {
  try {
    const inputData = req.body
    const [camposArray, titularArray, conyugeArray, padreArray, madreArray, hijo1Array, hijo2Array, hijo3Array, hijo4Array] = inputData.formData
    const queries = [
      generateSqltoInsert(camposArray, titularArray, database.nameTableClients),
      generateSqltoInsert(camposArray, conyugeArray, database.nameTableClients),
      generateSqltoInsert(camposArray, padreArray, database.nameTableClients),
      generateSqltoInsert(camposArray, madreArray, database.nameTableClients),
      generateSqltoInsert(camposArray, hijo1Array, database.nameTableClients),
      generateSqltoInsert(camposArray, hijo2Array, database.nameTableClients),
      generateSqltoInsert(camposArray, hijo3Array, database.nameTableClients),
      generateSqltoInsert(camposArray, hijo4Array, database.nameTableClients),
    ]
    await Promise.all(queries.map((q) => executeQuery(q.text, q.values)))
    res.status(200).json({ message: 'Datos recibidos correctamente back' })
  } catch (error) {
    console.error('Error /api/data/newclient', error)
    res.status(500).json({ error: 'Error al insertar los datos' })
  }
})

app.delete('/api/data/:clientName/delete', async (req, res) => {
  try {
    const sql = `DELETE FROM ${database.nameTableClients} WHERE Cliente = $1`
    await executeQuery(sql, [req.params.clientName])
    res.status(200).json({ message: 'Datos eliminados correctamente' })
  } catch (error) {
    console.error('Error /api/data/:clientName/delete', error)
    res.status(500).json({ error: 'Error al enviar datos' })
  }
})

app.put('/api/data/:clientName/update', async (req, res) => {
  try {
    const clientName = req.params.clientName
    const inputData = req.body.inputsValues
    const fields = req.body.fields
    const query = generateUpdateSql(clientName, inputData, fields)
    await executeQuery(query.text, query.values)
    res.status(200).json({ message: 'Datos actualizados correctamente back' })
  } catch (error) {
    console.error('Error /api/data/:clientName/update', error)
    res.status(500).json({ error: 'Error al insertar los datos' })
  }
})

app.get('/api/data/portfolio/fields/:minRange/:maxRange', async (req, res) => {
  try {
    const sql = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND lower(table_name) = lower($1) ORDER BY ordinal_position`
    const result = await executeQuery(sql, [database.nameTableManage])
    res.status(200).json(result)
  } catch (error) {
    console.error('Error /api/data/portfolio/fields', error)
    res.status(500).json({ error: 'Error al insertar los datos' })
  }
})

app.post('/api/data/portfolio/:NUT/newClient', async (req, res) => {
  try {
    const NUT = req.params.NUT
    const portfolioFields = req.body.portfolioFields.flatMap((element) => [element.Field])
    const emptyArray = new Array(portfolioFields.length).fill('')
    emptyArray[2] = NUT
    const sqlInsert = generateSqltoInsert(portfolioFields, emptyArray, database.nameTableManage)
    const sqlCount = `SELECT COUNT(*) FROM ${database.nameTableManage} WHERE CI_TITULAR = $1`
    const countResult = await executeQuery(sqlCount, [NUT])
    const count = parseInt(countResult[0].count, 10)
    if (count === 0) {
      await executeQuery(sqlInsert.text, sqlInsert.values)
    }
    res.status(200).json({ message: 'Datos recibidos correctamente port' })
  } catch (error) {
    console.error('Error /api/data/portfolio/:NUT/newClient', error)
    res.status(500).json({ error: 'Error al insertar los datos' })
  }
})

app.get('/api/data/portfolio/:NUT', async (req, res) => {
  try {
    const NUT = req.params.NUT
    const sql = `SELECT * FROM ${database.nameTableManage} WHERE CI_TITULAR = $1`
    const results = await executeQuery(sql, [NUT])
    res.status(200).json(results)
  } catch (error) {
    console.error('Error /api/data/portfolio/:NUT', error)
    res.status(500).json({ error: 'Error al obtener los datos' })
  }
})

app.put('/api/data/portfolio/:NUT/:clientName/update', async (req, res) => {
  try {
    const portfolioFieldsAll = req.body.portfolioFieldsAll
    const inputsValues = req.body.inputsValues
    const query = generateUpdatePortfolioSql(inputsValues, portfolioFieldsAll)
    const results = await executeQuery(query.text, query.values)
    res.status(200).json(results)
  } catch (error) {
    console.error('Error /api/data/portfolio/:NUT/:clientName/update', error)
    res.status(500).json({ error: 'Error al obtener los datos' })
  }
})

app.get('/api/data/portfolio/generate/excel/client/:NUT', async (req, res) => {
  try {
    const { NUT } = req.params
    const sql = `SELECT * FROM ${database.nameTableManage} WHERE CI_TITULAR = $1`
    const results = await executeQuery(sql, [NUT])
    res.status(200).json(results)
  } catch (error) {
    console.error('Error /api/data/portfolio/generate/excel/client/:NUT', error)
    res.status(500).json({ error: 'Error al obtener los datos' })
  }
})

module.exports = app
