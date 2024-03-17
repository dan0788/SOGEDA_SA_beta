import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { setGroupsOf5Values } from "src/Validator"
import useVariables from "../../variables.mjs"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CButton,
} from "@coreui/react"

const DetailsTable = () => {
  const { clientName } = useParams()
  const [clientData, setClientData] = useState({
    all: [],
    parents: [],
    client: [],
  })
  const [inputsValues, setInputsValues] = useState([])
  const [fields, setFields] = useState([])
  const [grupos, setGrupos] = useState([])
  const [gruposClient, setGruposClient] = useState([])
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/api/data/${clientName}`)
        const parents = response.data.result1.filter(
          (element) => element.NUT && element.Tipo != "TITULAR",
        )
        setClientData({
          all: response.data.result1,
          client: response.data.result1[0],
          parents: parents,
        })
        setFields(response.data.result2)
        const gruposTemp = []
        for (let i = 0; i < response.data.result2.length; i += 5) {
          gruposTemp.push(response.data.result2.slice(i, i + 5))
        }
        setGrupos(gruposTemp)
        const gruposTempC = []
        for (let i = 0; i < Object.values(response.data.result1[0]).length; i += 5) {
          gruposTempC.push(Object.values(response.data.result1[0]).slice(i, i + 5))
        }
        setGruposClient(gruposTempC)
        const values = response.data.result1
          .filter((element) => element.NUT)
          .flatMap((element) => [Object.values(element)])
        setInputsValues(values)
      } catch (error) {
        console.log(error)
      }
    }
    fetchJsonData()
  }, [])
  useEffect(() => {
    //console.log("inputsValues", inputsValues)
  }, [inputsValues])

  const handleUpdateClick = async (clientName) => {
    clientName = clientName.replace(/ /g, "_")
    const fieldsArray = fields
      .filter((element, key) => element.Field)
      .flatMap((element) => [element.Field])
    try {
      const response = await axios.put(`http://localhost:3003/api/data/${clientName}/update`, {
        inputsValues: inputsValues,
        fields: fieldsArray,
      })
      if (response.data) {
        alert("Datos recibidos correctamente front:\n" + response.data)
      }
    } catch (error) {
      alert("Error al enviar los datos:\n", +error)
    }
  }
  const handleInputChange = (event, count, position) => {
    setInputsValues((prevState) => {
      const newInputsValues = [...prevState]
      newInputsValues[position][count] = event.target.value
      return newInputsValues
    })
  }
  return (
    <div>
      <div className="d-flex justify-content-center">
        <CButton
          color="info"
          size="sm"
          className="mb-2 col-md-2"
          onClick={() => {
            handleUpdateClick(clientData.client.Nombre)
          }}
        >
          Save
        </CButton>
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-2">
            <CCardHeader>
              <strong>{clientData.client.Nombre}</strong> <small>Table of description</small>
            </CCardHeader>
            <CCardBody>
              <p className="text-medium-emphasis small">
                This table shows all the descriptions of the client
              </p>
              <CTable bordered small>
                {grupos.map((element, key) => {
                  return (
                    <React.Fragment key={key}>
                      <CTableHead color="info" className="">
                        <CTableRow>
                          {element.map((object, index) => {
                            return (
                              <CTableHeaderCell scope="col" key={index}>
                                {object.Field.replace(/_/g, " ")}
                              </CTableHeaderCell>
                            )
                          })}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody color="success">
                        <CTableRow>
                          {gruposClient[key].map((element1, key1) => {
                            var count = key * 5 + key1 + 1
                            return (
                              <CTableDataCell key={key1}>
                                <CInputGroup className="flex-nowrap">
                                  <CFormInput
                                    aria-label="Username"
                                    aria-describedby="addon-wrapping"
                                    value={inputsValues[0][count - 1]}
                                    name={`input-${clientData.client.Tipo}-${count}`}
                                    onChange={(event) => {
                                      handleInputChange(event, count - 1, 0)
                                    }}
                                  ></CFormInput>
                                </CInputGroup>
                              </CTableDataCell>
                            )
                          })}
                        </CTableRow>
                      </CTableBody>
                    </React.Fragment>
                  )
                })}
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {clientData.parents.map((element, key) => {
        //console.log("element:", element)
        return (
          <CRow key={key}>
            <CCol xs={12}>
              <CCard className="mb-2">
                <CCardHeader>
                  <strong>{element.Nombre}</strong> <small>Table of description</small>
                </CCardHeader>
                <CCardBody>
                  <p className="text-medium-emphasis small">
                    This table shows all the descriptions of the client
                  </p>
                  <CTable bordered small>
                    {grupos.map((element1, key1) => {
                      return (
                        <React.Fragment key={key1}>
                          <CTableHead color="info" className="">
                            <CTableRow>
                              {element1.map((object, index) => {
                                return (
                                  <CTableHeaderCell scope="col" key={index}>
                                    {object.Field.replace(/_/g, " ")}
                                  </CTableHeaderCell>
                                )
                              })}
                            </CTableRow>
                          </CTableHead>
                          <CTableBody color="success">
                            <CTableRow>
                              {setGroupsOf5Values(element)[key1].map((element2, key2) => {
                                var count = key1 * 5 + key2 + 1
                                return (
                                  <CTableDataCell key={key2}>
                                    <CInputGroup className="flex-nowrap">
                                      <CFormInput
                                        aria-label="Username"
                                        aria-describedby="addon-wrapping"
                                        value={inputsValues[key + 1][count - 1]}
                                        name={`input-${element["Tipo"].replace(/ /g, "")}-${count}`}
                                        onChange={(event) => {
                                          handleInputChange(event, count - 1, key + 1)
                                        }}
                                      ></CFormInput>
                                    </CInputGroup>
                                  </CTableDataCell>
                                )
                              })}
                            </CTableRow>
                          </CTableBody>
                        </React.Fragment>
                      )
                    })}
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )
      })}
    </div>
  )
}

export default DetailsTable
