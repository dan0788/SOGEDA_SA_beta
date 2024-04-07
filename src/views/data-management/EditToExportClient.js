import React, { useEffect, useState } from "react"
import PropTypes, { element } from "prop-types"
import axios from "axios"
import {
  CButton,
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

const ExportClient = () => {
  const { webRoute } = useVariables()
  const [clients, setClients] = useState([])
  const [showComponents, setShowComponents] = useState({
    generalCheckCell: false,
    eachDataCell: false,
    allChecked: false,
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
  return (
    <div>
      <div className="col-md-12">
        <Search onDataReceived={handleDataReceived} />
        <div>
          <CInputGroup className="mb-1">
            <CInputGroupText
              id="basic-addon1"
              className="font-black border-transparent"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setShowComponents((prevState) => ({
                  ...prevState,
                  generalCheckCell: true,
                  eachDataCell: true,
                }))
              }
            >
              <CIcon icon={cilList} />
            </CInputGroupText>
          </CInputGroup>
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
                  <CTableHeaderCell scope="col" style={{ width: "45px" }}></CTableHeaderCell>
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
                      <CTableDataCell>
                        <CButton
                          color="link font-green"
                          className="p-0 m-0 col-md-12"
                          href={`/generate/excel/client/export/${element.NUT}`}
                        >
                          <CIcon className="col-md-12" icon={cilPen} customClassName="nav-icon" />
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
