import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilArrowBottom, cilBriefcase, cilClipboard, cilPen, cilTrash } from "@coreui/icons"

const ClientTable = () => {
  const [clients, setClients] = useState([])
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`/api/data/clients/all`)
        const parents = response.data.result1.filter((element) => element.NUT)
        setClients(parents)
      } catch (error) {
        console.log(error)
      }
    }
    fetchJsonData()
  }, [])

  const handleDeleteClick = async (client) => {
    console.log("client:", client)
    try {
      const response = await axios.delete(`/api/data/${client}/delete`, {
        formData: client,
      })
      if (response.data) {
        alert("Datos recibidos correctamente front:\n" + response.data)
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error)
    }
  }

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Austro Bank Database</strong> <small>Table of clients</small>
        </CCardHeader>
        <CCardBody>
          <p className="text-medium-emphasis small">
            This table shows all the clients registered in the database
          </p>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">NUT</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Civil Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Person Status</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: "45px" }}></CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: "45px" }}></CTableHeaderCell>
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
                      {element.Fecha_Defunción ? "FALLECIDO" : "VIVO"}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="link"
                        className="p-0 m-0 col-md-12"
                        href={`/clientstable/${element.Cliente}`}
                      >
                        <CIcon
                          className="col-md-12"
                          icon={cilPen}
                          customClassName="nav-icon"
                          style={{ color: "green" }}
                        />
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="link"
                        className="p-0 m-0 col-md-12"
                        //href={`/clientstable/${element.Cliente}/delete`}
                        onClick={() => {
                          handleDeleteClick(element.Cliente)
                        }}
                      >
                        <CIcon
                          className="col-md-12"
                          icon={cilTrash}
                          customClassName="nav-icon"
                          style={{ color: "red" }}
                        />
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="link"
                        className="p-0 m-0 col-md-12"
                        href={`/manage/client/${element.Cliente}/1`}
                      >
                        <CIcon
                          className="col-md-12"
                          icon={cilBriefcase}
                          customClassName="nav-icon"
                          style={{ color: "blue" }}
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
  )
}
export default ClientTable
