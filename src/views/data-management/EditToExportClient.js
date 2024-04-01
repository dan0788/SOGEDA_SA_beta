import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPen } from "@coreui/icons"
import Search from "src/views/components/Search.js"
import useVariables from "../variables"

const ExportClient = () => {
  const { webRoute } = useVariables()
  const [csvData, setCsvData] = useState([])
  const [clientsNames, setClientsNames] = useState([])
  const [clients, setClients] = useState([])
  const [nutValue, setNutValue] = useState("")
  const [portfolioValues, setPortfolioValues] = useState([])
  const [showNewComponent, setShowNewComponent] = useState(false)
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`${webRoute}/api/data/clients/all`)
        const parents = response.data.result1.filter((element) => element.NUT)
        setClients(parents)
      } catch (error) {
        console.log(error)
      }
    }
    fetchJsonData()
  }, [])

  const handleDataReceived = (data) => {
    setClients(data[0])
  }

  return (
    <div>
      <div className="col-md-12">
        <Search onDataReceived={handleDataReceived} />
      </div>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">NUT</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Civil Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Person Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: "45px" }}></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {clients.map((element, key) => {
                  return (
                    <CTableRow key={key}>
                      <CTableHeaderCell scope="row">{key + 1}</CTableHeaderCell>
                      <CTableDataCell>{element.NUT}</CTableDataCell>
                      <CTableDataCell>{element.Nombre}</CTableDataCell>
                      <CTableDataCell>{element.Estado_Civil}</CTableDataCell>
                      <CTableDataCell>
                        {element.Fecha_Defuncion ? "FALLECIDO" : "VIVO"}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="link"
                          className="p-0 m-0 col-md-12"
                          href={`/generate/excel/client/export/${element.NUT}`}
                        >
                          <CIcon
                            className="col-md-12"
                            icon={cilPen}
                            customClassName="nav-icon"
                            style={{ color: "green" }}
                          />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </div>
  )
}
export default ExportClient
