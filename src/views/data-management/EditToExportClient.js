import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import * as XLSX from "xlsx"
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CFormCheck,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilList, cilPen } from "@coreui/icons"
import Search from "src/views/components/Search.js"
import useVariables from "../variables"
import Modal from "../components/Modal"
import PopoverTop from "../components/PopoverTop"

const ExportClient = () => {
  const { webRoute } = useVariables()
  const [clients, setClients] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [showComponents, setShowComponents] = useState({
    generalCheckCell: false,
    eachDataCell: false,
    allChecked: false,
    exportAllButton: false,
    tableHeaderCellEdit: true,
  })
  const [eachChecked, setEachChecked] = useState([])
  const [valuesNut, setValuesNut] = useState([])
  const [idNut, setIdNut] = useState([])
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`${webRoute}/api/data/clients/all`)
        const parents = response.data.result1.filter((element) => element.NUT)
        setClients(parents)
        setEachChecked(Array(parents.length).fill(false))
        parents.map((element, key) => {
          setIdNut((prevState) => {
            prevState[`${key}`] = { [key + 1]: element.NUT }
            return prevState
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchJsonData()
  }, [])

  const handleDataReceived = (data) => {
    setClients(data[0])
  }

  useEffect(() => {
    console.log("valuesNut:", valuesNut)
    console.log("eachChecked:", eachChecked)
  }, [valuesNut])

  const handleCheckCheckbox = (event, id) => {
    setEachChecked((prevState) => {
      const eachCheckedValues = [...prevState]
      eachCheckedValues[id] = false
      return eachCheckedValues
    })
    const value = event.target.value
    if (eachChecked[id] === false) {
      setValuesNut((prevState) => {
        let values = [...prevState]
        values.push(value)
        return values
      })
      setEachChecked((prevState) => {
        const eachCheckedValues = [...prevState]
        eachCheckedValues[id] = true
        return eachCheckedValues
      })
    } else {
      setValuesNut((prevState) => {
        let values = [...prevState]
        values = values.filter((element) => element != value)
        return values
      })
      setEachChecked((prevState) => {
        const eachCheckedValues = [...prevState]
        eachCheckedValues[id] = false
        return eachCheckedValues
      })
    }
    const checkbox = document.querySelector(`#flexCheckDefault${id}`)
  }
  const handleClose = () => {
    setModalVisible(false)
  }
  const GeneralCheckCell = () => {
    return (
      <CTableHeaderCell scope="col" style={{ width: "45px" }}>
        <CFormCheck
          id="flexCheckDefault"
          className="border-black"
          onClick={() => {
            setShowComponents((prevState) => ({
              ...prevState,
              allChecked: true,
            }))
          }}
        />
      </CTableHeaderCell>
    )
  }
  const EachDataCell = ({ nut }) => {
    const element = idNut.find((element) => Object.values(element)[0] == nut)
    const id = Object.keys(element)[0]
    return (
      <CTableDataCell>
        <CFormCheck
          id={`flexCheckDefault${id}`}
          className="border-black"
          value={nut}
          checked={eachChecked[id]}
          onChange={(event) => handleCheckCheckbox(event, id)}
        />
      </CTableDataCell>
    )
  }
  EachDataCell.propTypes = {
    nut: PropTypes.string.isRequired,
  }
  const ExportAllButton = () => {
    return (
      <PopoverTop
        content="Export all selected registers"
        placement="left"
        cInside={
          <CButtonGroup className="col-md-1" role="group" aria-label="Basic mixed styles example">
            <CButton
              color="info font-darkgreen h-100"
              className="p-0 m-0 align-self-end"
              onClick={() => setModalVisible(true)}
            >
              Export All
            </CButton>
          </CButtonGroup>
        }
      />
    )
  }
  const handleYesClick = async () => {
    setModalVisible(false)
    try {
      const response = await axios.post(
        `${webRoute}/api/data/generate/excel/clients/export/group`,
        {
          groupNut: valuesNut,
        },
      )
      if (response.data.length === 0) return
      const clientDataObj = response.data.filter((element) => Object.keys(element).length == 1)
      const clientData = clientDataObj.map((element) => {
        return element.flatMap((element1) => [Object.values(element1)])
      })
      let fields = response.data[0].flatMap((element) => [element.Field])
      let array = [fields]
      for (let i = 0; i < clientData.length; i++) {
        array.push(clientData[i][0])
      }
      // Transponer la matriz para mostrar los valores en una fila
      const wsData = array
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Client Data")
      XLSX.writeFile(wb, `Data Clients.xlsx`)
    } catch (error) {
      console.log(error)
    }
  }
  const ConfirmModal = () => {
    const handleClick1 = () => {
      handleYesClick()
    }
    const handleClick2 = () => {
      setModalVisible(false)
    }
    return Modal(
      "¡Precaución!",
      <div>
        ¿Estás seguro de descargar los siguientes registros?
        <CTable borderless>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">NUT</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {valuesNut.map((element, key) => {
              return (
                <CTableRow key={key}>
                  <CTableDataCell>{element}</CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </div>,
      handleClose,
      modalVisible,
      "SI",
      handleClick1,
      "secondary",
      "NO",
      handleClick2,
      "primary",
    )
  }
  const TableHeaderCellEdit = () => {
    return <CTableHeaderCell scope="col" style={{ width: "45px" }}></CTableHeaderCell>
  }
  const TableDataCellEditButton = ({ nut }) => {
    return (
      <CTableDataCell>
        <CButton
          color="link font-green"
          className="p-0 m-0 col-md-12"
          href={`/generate/excel/client/export/${nut}`}
        >
          <CIcon className="col-md-12" icon={cilPen} customClassName="nav-icon" />
        </CButton>
      </CTableDataCell>
    )
  }
  TableDataCellEditButton.propTypes = {
    nut: PropTypes.string.isRequired,
  }
  return (
    <div>
      <div className="col-md-12">
        <Search onDataReceived={handleDataReceived} />
        {<ConfirmModal />}
        <div className="d-flex mb-1">
          <CInputGroup className="mb-1">
            <PopoverTop
              content="Check List"
              placement="top"
              cInside={
                <CInputGroupText
                  id="basic-addon1"
                  className="font-black border-transparent"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setShowComponents((prevState) => ({
                      ...prevState,
                      generalCheckCell: !prevState.generalCheckCell,
                      eachDataCell: !prevState.eachDataCell,
                      exportAllButton: !prevState.exportAllButton,
                      tableHeaderCellEdit: !prevState.tableHeaderCellEdit,
                    }))
                  }
                >
                  <CIcon icon={cilList} />
                </CInputGroupText>
              }
            />
          </CInputGroup>
          {showComponents.exportAllButton && <ExportAllButton />}
        </div>
      </div>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  {showComponents.generalCheckCell && <GeneralCheckCell />}
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">NUT</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Civil Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Person Status</CTableHeaderCell>
                  {showComponents.tableHeaderCellEdit && <TableHeaderCellEdit />}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {clients.map((element, key) => {
                  const element1 = idNut.find(
                    (element1) => Object.values(element1)[0] == element.NUT,
                  )
                  const id = Object.keys(element1)[0]
                  return (
                    <CTableRow key={key}>
                      {showComponents.eachDataCell && <EachDataCell nut={element.NUT} />}
                      <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                      <CTableDataCell>{element.NUT}</CTableDataCell>
                      <CTableDataCell>{element.Nombre}</CTableDataCell>
                      <CTableDataCell>{element.Estado_Civil}</CTableDataCell>
                      <CTableDataCell>
                        {element.Fecha_Defuncion ? "FALLECIDO" : "VIVO"}
                      </CTableDataCell>
                      {showComponents.tableHeaderCellEdit && (
                        <TableDataCellEditButton nut={element.NUT} />
                      )}
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
