import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Papa from "papaparse"
import { setGroupsOf5Values, setGroupsOf5Array } from "src/views/Validator"
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
  CInputGroupText,
  CSpinner,
} from "@coreui/react"
import useVariables from "../variables"

const InsertNewClient = () => {
  const navigate = useNavigate()
  const { clientData, setClientData } = useVariables()
  const [showNewComponent, setShowNewComponent] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({})

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]) // Guarda el archivo seleccionado
    setShowNewComponent(true)
    try {
      Papa.parse(event.target.files[0], {
        complete: function (results) {
          console.log("results.data", results.data)
          const parents = results.data.filter(
            (element) => element[2] && element[0] !== "TITULAR" && element[0] !== "Tipo",
          )
          const client = results.data.find((element) => element[0] === "TITULAR")
          setClientData({
            all: results.data,
            parents: parents,
            client: client,
          })
          setFormData(results.data)
        },
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    /* console.log("clientData.all", clientData.all)
    console.log("clientData.parents", clientData.parents)
    console.log("clientData.client", clientData.client) */
  }, [clientData])

  const handleUploadClick = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post("http://localhost:3003/api/data/newclient", {
        formData: formData,
      })
      if (response.data) {
        alert("Datos actualizados correctamente correctamente")
        navigate("/clientstable")
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error)
    }
  }

  const NewComponent = () => {
    if (!clientData.all || clientData.all.length === 0) {
      return <CSpinner color="danger"></CSpinner>
    }
    console.log("clientData.all", clientData.all)
    return (
      <div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-2">
              <CCardHeader>
                <strong>{clientData.client[3]}</strong> <small>Table of description</small>
              </CCardHeader>
              <CCardBody>
                <p className="text-medium-emphasis small">
                  This table shows all the descriptions of the client
                </p>
                <CTable bordered small>
                  {setGroupsOf5Array(clientData.all[0]).map((element, key) => {
                    return (
                      <React.Fragment key={key}>
                        <CTableHead color="info" className="">
                          <CTableRow>
                            {element.map((object, index) => {
                              return (
                                <CTableHeaderCell scope="col" key={index}>
                                  {object.replace(/_/g, " ")}
                                </CTableHeaderCell>
                              )
                            })}
                          </CTableRow>
                        </CTableHead>
                        <CTableBody color="success">
                          <CTableRow>
                            {setGroupsOf5Array(clientData.client)[key].map((element1, key1) => {
                              return (
                                <CTableDataCell key={key1}>
                                  <CInputGroup className="flex-nowrap">
                                    <CFormInput
                                      aria-label="Username"
                                      aria-describedby="addon-wrapping"
                                      value={element1}
                                      disabled
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
          return (
            <CRow key={key}>
              <CCol xs={12}>
                <CCard className="mb-2">
                  <CCardHeader>
                    <strong>{element[3]}</strong> <small>Table of description</small>
                  </CCardHeader>
                  <CCardBody>
                    <p className="text-medium-emphasis small">
                      This table shows all the descriptions of the client
                    </p>
                    <CTable bordered small>
                      {setGroupsOf5Array(clientData.all[0]).map((element1, key1) => {
                        return (
                          <React.Fragment key={key1}>
                            <CTableHead color="info" className="">
                              <CTableRow>
                                {element1.map((object, index) => {
                                  return (
                                    <CTableHeaderCell scope="col" key={index}>
                                      {object.replace(/_/g, " ")}
                                    </CTableHeaderCell>
                                  )
                                })}
                              </CTableRow>
                            </CTableHead>
                            <CTableBody color="success">
                              <CTableRow>
                                {setGroupsOf5Values(element)[key1].map((element2, key2) => {
                                  return (
                                    <CTableDataCell key={key2}>
                                      <CInputGroup className="flex-nowrap">
                                        <CFormInput
                                          aria-label="Username"
                                          aria-describedby="addon-wrapping"
                                          value={element2}
                                          disabled
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

  return (
    <div>
      <CInputGroup className="mb-3">
        <CFormInput type="file" onChange={handleFileInputChange} accept=".csv" />
        <CInputGroupText component="label" onClick={handleUploadClick}>
          Upload
        </CInputGroupText>
      </CInputGroup>
      {showNewComponent && <NewComponent />}
    </div>
  )
}
export default InsertNewClient
