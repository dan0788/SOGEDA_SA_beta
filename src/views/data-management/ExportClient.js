import React, { useEffect, useState } from "react"
import axios from "axios"
import { CFormSelect } from "@coreui/react"

const ExportClient = () => {
  const [csvData, setCsvData] = useState([])
  const [clientsNames, setClientsNames] = useState([])
  const [nutValue, setNutValue] = useState("")
  const [portfolioValues, setPortfolioValues] = useState([])
  const [showNewComponent, setShowNewComponent] = useState(false)
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/api/data/clients/all`)
        const names = response.data.result1.map((element) => {
          return { label: element.Nombre, value: element.NUT }
        })
        names.unshift("Open this select menu")
        setClientsNames(names)
        console.log("names", names)
      } catch (error) {
        console.log(error)
      }
    }
    fetchJsonData()
  }, [])
  const handleInputChange = async (event) => {
    const nut = event.target.value
    setNutValue(nut)
    console.log("nutValue", event.target.value)
    const response = await axios.get(
      `http://localhost:3003/api/data/portfolio/generate/excel/client/${nut}`,
    )
    console.log("response", response.data[0])
  }
  /* const handleExportClick = () => {

  } */
  /* const NewComponent = () => {
    if (!clientData.all || clientData.all.length === 0) {
      return <CSpinner color="danger"></CSpinner>
    }
    console.log("clientData.all", clientData.all)
    return (
      <div>
        <div className="d-flex justify-content-center">
          <CButton
            color="info"
            size="sm"
            className="mb-2 col-md-2"
            onClick={() => {
              handleExportClick()
            }}
          >
            Export
          </CButton>
        </div>
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
  } */

  return (
    <div>
      <CFormSelect
        aria-label="Default select client"
        options={clientsNames}
        onChange={handleInputChange}
      />
      {/* {showNewComponent && <NewComponent />} */}
    </div>
  )
}
export default ExportClient
