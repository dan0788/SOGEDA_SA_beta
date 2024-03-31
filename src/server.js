const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors') // Importa el middleware cors

const app = express()
const port = 3004
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const database = {
  nameDatabase: "excel",
  nameTableClients: "clientstest",
  nameTableManage: "portfolios",
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Tu usuario de MySQL
  password: '', // Tu contraseña de MySQL
  database: database.nameDatabase, // El nombre de tu base de datos
})

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err)
    throw err
  }
  console.log('Conectado a MySQL correctamente')
})
/* databook registries */
app.get('/api/data/:clientName', (req, res) => {
  const clientName = req.params.clientName
  const sql1 = `SELECT * FROM ${database.nameTableClients} WHERE Cliente = '` + req.params.clientName + `'`
  const sql2 = `SHOW COLUMNS FROM ${database.nameTableClients}`
  Promise.all([executeQuery(sql1, [clientName]), executeQuery(sql2, [clientName])])
    .then((results) => {
      const combinedResults = {
        result1: results[0],
        result2: results[1],
      }
      res.status(200).json(combinedResults)
    })
    .catch((error) => {
      console.error('Error al ejecutar las consultas:', error)
      res.status(500).send('Error al obtener datos')
    })
})

app.get('/api/data/clients/all', (req, res) => {
  const sql =
    `SELECT Tipo, Cliente, NUT, Nombre, Estado_Civil, Fecha_Defuncion FROM ${database.nameTableClients} WHERE Tipo = "TITULAR" ORDER BY Nombre`
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error al insertar datos en MySQL:', err)
      res.status(500).send('Error al enviar datos')
    } else {
      res.status(200).send({ result1: result })
    }
  })
})

app.post('/api/data/search',(req,res)=>{
  const searchValue = req.body.searchValue
  const sql = `SELECT Tipo, Cliente, NUT, Nombre, Estado_Civil, Fecha_Defuncion FROM ${database.nameTableClients} WHERE Tipo = "TITULAR" AND Nombre LIKE '${searchValue}%' ORDER BY Nombre`
  Promise.all([executeQuery(sql, [])])
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log('Error al ejecutar las consultas:', error)
      res.send(500).send('Error al insertar los datos')
    })
})

app.post('/api/data/newclient', (req, res) => {
  const inputData = req.body; console.log(inputData);
  const camposArray = inputData.formData[0]
  const titularArray = inputData.formData[1]
  const conyugeArray = inputData.formData[2]
  const padreArray = inputData.formData[3]
  const madreArray = inputData.formData[4]
  const hijo1Array = inputData.formData[5]
  const hijo2Array = inputData.formData[6]
  const hijo3Array = inputData.formData[7]
  const hijo4Array = inputData.formData[8]
  // Ejecutar las consultas SQL de forma asíncrona
  Promise.all([executeQuery(generateSqltoInsert(camposArray, titularArray, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, conyugeArray, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, padreArray, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, madreArray, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, hijo1Array, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, hijo2Array, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, hijo3Array, database.nameTableClients), []),
  executeQuery(generateSqltoInsert(camposArray, hijo4Array, database.nameTableClients), [])])
    .then((results) => {
      res.send('Datos recibidos correctamente back');
    })
    .catch((error) => {
      console.log('Error al ejecutar las consultas:', error)
      res.status(500).send('Error al insertar los datos')
    })
  //console.log('Datos recibidos back:', sql);
});

app.delete("/api/data/:clientName/delete", (req, res) => {
  const sql = `DELETE FROM ${database.nameTableClients} WHERE Cliente = '${req.params.clientName}'`
  connection.query(sql, (err, result) => {
    if (err) {
      res.send('Error al enviar datos')
    } else {
      res.send("Datos eliminados correctamente")
    }
  })
})

app.put("/api/data/:clientName/update", (req, res) => {
  const clientName = req.params.clientName
  const inputData = req.body.inputsValues
  const fields = req.body.fields
  const arraySqlUpdates = []
  for (let i = 0; i < inputData.length; i++) {
    arraySqlUpdates.push(executeQuery(generateUpdateSql(clientName, inputData[i], fields), []))
  }
  Promise.all(arraySqlUpdates)
    .then((results) => {
      res.status(200).send('Datos actualizados correctamente back');
    })
    .catch((error) => {
      console.log('Error al ejecutar las consultas:', error)
      res.send(500).send('Error al insertar los datos')
    })
})

/* data management */
app.get('/api/data/portfolio/fields/:minRange/:maxRange', (req, res) => {
  const { minRange, maxRange } = req.params
  const sql = `SHOW COLUMNS FROM ${database.nameTableManage}`
  Promise.all([executeQuery(sql, [])])
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      res.status(500).send('Error al insertar los datos')
    })
})
app.post('/api/data/portfolio/:NUT/newClient', (req, res) => {
  const { NUT } = req.params
  const portfolioFields = req.body.portfolioFields.flatMap((element) => [element.Field])
  const emptyArray = new Array(portfolioFields.length).fill("")
  emptyArray[2] = NUT
  const sqlInsert = generateSqltoInsert(portfolioFields, emptyArray, database.nameTableManage)
  const sqlCount = `SELECT COUNT(*) FROM ${database.nameTableManage} WHERE CI_TITULAR = ?`
  Promise.all([executeQuery(sqlCount, [NUT])])
    .then((results) => {
      const count = results[0][0]['COUNT(*)']
      if (count > 0) {
        return null
      } else {
        return executeQuery(sqlInsert, [])
      }
    })
    .then(() => {
      res.send('Datos recibidos correctamente port:\n ');
    })
    .catch((error) => {
      console.log('Error al ejecutar las consultas:', error)
      res.status(500).send('Error al insertar los datos')
    })
})
//verificar si ya existe el cliente en portfolio
app.get('/api/data/portfolio/:NUT', (req, res) => {
  const NUT = req.params.NUT
  const sql = `SELECT * FROM ${database.nameTableManage} WHERE CI_TITULAR='` + NUT + `'`
  Promise.all([executeQuery(sql, [])])
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      res.status(500).send('Error al obtener los datos')
    })
})
//actualizar cada vez que se cambia de página en ManageClient
app.put('/api/data/portfolio/:NUT/:clientName/update', (req, res) => {
  const { NUT, clientName } = req.params
  const portfolioFieldsAll = req.body.portfolioFieldsAll
  const inputsValues = req.body.inputsValues
  console.log("inputsValues", inputsValues);
  /* console.log("portfolioFields", portfolioFields);
  console.log("inputsValues", inputsValues); */
  const sql = generateUpdatePortfolioSql(clientName, inputsValues, portfolioFieldsAll)
  console.log(sql);
  //console.log(sql);
  Promise.all([executeQuery(sql, [])])
    .then((results) => {
      console.log("datos actualizados");
      res.status(200).send(results);
    })
    .catch((error) => {
      res.status(500).send('Error al obtener los datos')
    })
})
app.get('/api/data/portfolio/generate/excel/client/:NUT', (req, res) => {
  const { NUT } = req.params
  const sql = `SELECT * FROM ${database.nameTableManage} WHERE CI_TITULAR = '` + NUT + `'`
  console.log(sql);
  Promise.all([executeQuery(sql, [NUT])])
    .then((results) => {
      console.log("datos actualizados" + results);
      res.status(200).send(results);
    })
    .catch((error) => {
      res.status(500).send('Error al obtener los datos')
    })
})

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`)
})

function executeQuery(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
function generateSqltoInsert(arrayCampos, arrayValues, datatable) {
  var sql = `INSERT INTO ${datatable}(`
  arrayCampos.forEach((element, index) => {
    sql += element
    if (index !== arrayCampos.length - 1) {
      sql += ", "
    }
  });
  sql += ") VALUES ("
  arrayValues.forEach((element, index) => {
    element = element.replace(/'/g, "\"")
    sql += `'${element}'`
    if (index !== arrayValues.length - 1) {
      sql += ", "
    }
  });
  sql += ")"
  return sql
}
function generateUpdateSql(clientName, inputData, fields) {
  let updateSql = `UPDATE ${database.nameTableClients} SET `;
  fields.map((columnName, index) => {
    const value = columnName.replace(/ /g, "_");
    updateSql += `${value} = '${inputData[index]}'`;
    if (index < fields.length - 1) {
      updateSql += ', ';
    }
  });
  updateSql += ` WHERE Cliente = '${clientName}' AND Tipo='${inputData[0]}'`;
  return updateSql;
}
function generateUpdatePortfolioSql(clientName, inputData, fields) {
  let updateSql = `UPDATE portfolios SET `;
  fields.map((columnName, index) => {
    const value = columnName.replace(/ /g, "_");
    updateSql += `${value} = '${inputData[index]}'`;
    if (index < fields.length - 1) {
      updateSql += ', ';
    }
  });
  updateSql += ` WHERE CI_TITULAR = '${inputData[2]}'`;
  return updateSql;
}