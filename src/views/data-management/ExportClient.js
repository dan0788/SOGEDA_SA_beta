import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import * as XLSX from "xlsx"
import axios from "axios"
import { setGroupsOf5Array } from "src/views/Validator"
import {
  CButton,
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
  CToaster,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CSpinner,
} from "@coreui/react"
import useVariables from "../variables"
import SaveToast from "../components/SaveToast"

const InsertNewClient = () => {
  const navigate = useNavigate()
  const { NUT } = useParams()
  const { toast, setToast, toaster, clientData, setClientData, webRoute } = useVariables()
  const [showNewComponent, setShowNewComponent] = useState(true)
  const [fields, setFields] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.post(
          `${webRoute}/api/data/generate/excel/client/export/${NUT}`,
        )
        setClientData(Object.values(response.data[0][0]))
        setFields(Object.keys(response.data[0][0]))
        clientData.map((el) => {
          console.log(el)
        })
      } catch (error) {
        //setToast(SaveToast("Error al enviar los datos", false, "Now"))
      }
    }
    fetchJsonData()
  }, [])

  const handleExportClick = (clientData) => {
    if (clientData.length === 0) return
    // Transponer la matriz para mostrar los valores en una fila
    const wsData = [fields, clientData]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Client Data")
    XLSX.writeFile(wb, `${clientData[0]}.xlsx`)
  }
  const NewComponent = () => {
    if (!clientData || clientData.length == 0) {
      return <CSpinner color="danger"></CSpinner>
    }
    return (
      <div>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-2">
              <CCardHeader>
                <strong>Management of client</strong>
              </CCardHeader>
              <CCardBody>
                <p className="text-medium-emphasis small">
                  This table shows all the descriptions of the client
                </p>
                <CTable bordered small>
                  {setGroupsOf5Array(fields).map((element, key) => {
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
                            {setGroupsOf5Array(clientData)[key].map((element1, key1) => {
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
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <CButton
          color="info"
          size="sm"
          className="mb-2 col-md-2"
          onClick={() => {
            handleExportClick(clientData)
          }}
        >
          Export
        </CButton>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      </div>
      {showNewComponent && <NewComponent />}
    </div>
  )
}
export default InsertNewClient
