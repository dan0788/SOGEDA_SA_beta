import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  setGroupsOf5Array,
  validateMobileNumbers,
  validateFixedNumbers,
  validateEmails,
  getDateString,
  validDoubleIf,
  validateIfStringIsValid,
} from "src/views/Validator"
import useVariables from "../variables.js"
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react"

const ManageClient = () => {
  const { clientName, id } = useParams()
  const {
    range,
    fieldsExoneratedSpecialChar,
    fieldsExoneratedUpper,
    webRoute,
    clientData,
    setClientData,
    inputsValues,
    setInputsValues,
  } = useVariables()
  const [visible, setVisible] = useState(false)
  const [showComponents, setShowComponents] = useState({
    newComponent: true,
    nextButton: true,
    prevButton: false,
    saveButton: false,
    referencesButton: false,
    CIsText: false,
    legacyCommentsButton: false,
    ruc1Button: false,
    ruc2Button: false,
  })
  var portfolioData = []
  const [comments, setComments] = useState("")
  const [portfolioFields, setPortfolioFields] = useState([])
  const [portfolioFieldsAll, setPortfolioFieldsAll] = useState([])
  const [rangePortfolioFields, setRangePortfolioFields] = useState({
    minRange: 0,
    maxRange: 0,
    classBackground: "",
    dataTitle: "",
  })
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`${webRoute}/api/data/${clientName}`)
        const parents = response.data.result1.filter(
          (element) => element.NUT && element.Tipo !== "TITULAR",
        )
        const client = response.data.result1[0]
        const all = response.data.result1
        setClientData((prevData) => ({
          ...prevData,
          all: all,
          client: client,
          parents: parents,
        }))
        handleButtonClick(id)
        let min = 0
        let max = 0
        range.map((element) => {
          if (element.id == parseInt(id)) {
            min = element.minRange
            max = element.maxRange
            setRangePortfolioFields({
              minRange: min,
              maxRange: max,
              classBackground: element.classBackground,
              dataTitle: element.dataTitle,
            })
          }
        })
        const response4 = await axios.get(`${webRoute}/api/data/portfolio/fields/${min}/${max}`)
        setPortfolioFields(
          response4.data[0]
            .filter((element, key) => key >= min && key <= max)
            .flatMap((element) => [element.Field]),
        )
        const response1 = await axios.get(`${webRoute}/api/data/portfolio/fields/0/100`)
        setPortfolioFieldsAll(response1.data[0].flatMap((element) => [element.Field]))
        const response2 = await axios.post(
          `${webRoute}/api/data/portfolio/${response.data.result1[0].NUT}/newClient`,
          {
            portfolioFields: response1.data[0],
          },
        )
        if (id == "3" || id == "4") {
          setShowComponents((prevState) => ({
            ...prevState,
            referencesButton: true,
          }))
        } else {
          setShowComponents((prevState) => ({
            ...prevState,
            referencesButton: false,
          }))
        }
        if (id == "5") {
          setShowComponents((prevState) => ({
            ...prevState,
            CIsText: true,
          }))
        }
        if (id == "6") {
          setShowComponents((prevState) => ({
            ...prevState,
            legacyCommentsButton: true,
            ruc1Button: true,
            ruc2Button: true,
          }))
        }
        //se obtiene los datos del cliente en portfolio
        const response3 = await axios.get(
          `${webRoute}/api/data/portfolio/${response.data.result1[0].NUT}`,
        )
        portfolioData = Object.values(response3.data[0][0])
        setInputsValues(portfolioData)
        //console.log("portfolioData", portfolioData)
        //console.log("parents", parents)
        if (all && all.length > 0) {
          const validatedMobileNumbersT = validateMobileNumbers(all, "TITULAR")
          const validatedFixedNumbersT = validateFixedNumbers(all, "TITULAR")
          const validatedEmailsT = validateEmails(all, "TITULAR")
          const validatedMobileNumbersC = validateMobileNumbers(all, "CONYUGE")
          const validatedFixedNumbersC = validateFixedNumbers(all, "CONYUGE")
          const validatedEmailsC = validateEmails(all, "CONYUGE")
          let conyugeType = ""
          if (parents && parents.length > 0) {
            conyugeType = parents[0].Tipo == "CONYUGE" ? parents[0].Nombre : ""
          }
          let conyugeNUT = ""
          if (parents && parents.length > 0) {
            conyugeNUT = parents[0].Tipo == "CONYUGE" ? parents[0].NUT : ""
          }
          let conyugeRUC = false
          if (parents && parents.length > 0) {
            conyugeRUC = parents[0].Tipo == "CONYUGE" ? true : false
          }
          let addressT = client.Parroquia + " " + client.Dirección
          setInputsValues((prevState) => {
            const newInputsValues = [...prevState]
            newInputsValues[0] = !client.Fecha_Defunción ? "VIVO" : "FALLECIDO"
            newInputsValues[1] = client.Estado_Civil
            newInputsValues[2] = client.NUT
            newInputsValues[3] = validatedFixedNumbersT ? validatedFixedNumbersT[0] : ""
            newInputsValues[4] = validatedMobileNumbersT ? validatedMobileNumbersT[0] : ""
            newInputsValues[5] = validatedEmailsT ? validatedEmailsT[0] : ""
            newInputsValues[6] = ""
            newInputsValues[7] = ""
            newInputsValues[8] = addressT.trim() !== "" ? addressT : ""
            newInputsValues[9] = ""
            newInputsValues[10] = ""
            newInputsValues[11] = client.Provincia
            newInputsValues[12] = client.Cantón
            newInputsValues[13] = client.Parroquia
            newInputsValues[14] = client.Cantón
            newInputsValues[15] = ""
            newInputsValues[16] = conyugeType
            newInputsValues[17] = conyugeNUT
            newInputsValues[18] = validatedFixedNumbersC ? validatedFixedNumbersC[0] : ""
            newInputsValues[19] = validatedFixedNumbersC ? validatedFixedNumbersC[1] : ""
            newInputsValues[20] = validatedMobileNumbersC ? validatedMobileNumbersC[0] : ""
            newInputsValues[21] = validatedMobileNumbersC ? validatedMobileNumbersC[1] : ""
            newInputsValues[22] = validatedEmailsC ? validatedEmailsC[0] : ""
            newInputsValues[49] = fillComments(
              validatedFixedNumbersT,
              validatedEmailsT,
              validatedFixedNumbersC,
              validatedEmailsC,
              parents,
              all,
            )
            //RUC
            newInputsValues[50] = ""
            newInputsValues[51] = ""
            newInputsValues[52] = ""
            newInputsValues[53] = ""
            newInputsValues[54] = ""
            newInputsValues[55] = ""
            newInputsValues[56] = ""
            newInputsValues[57] = ""
            newInputsValues[58] = !conyugeRUC ? "NO HAY DATOS" : newInputsValues[58] //revisar
            newInputsValues[59] = !conyugeRUC ? "NO HAY DATOS" : newInputsValues[59]
            newInputsValues[60] = !conyugeRUC ? "NO HAY DATOS" : newInputsValues[60]
            newInputsValues[61] = ""
            //SRI
            newInputsValues[62] = ""
            newInputsValues[63] = ""
            newInputsValues[64] = ""
            newInputsValues[65] = ""
            newInputsValues[66] = ""
            newInputsValues[67] = ""
            newInputsValues[68] = ""
            newInputsValues[69] = ""
            newInputsValues[70] = ""
            newInputsValues[71] = "NO HAY DATOS"
            newInputsValues[72] = "NO HAY DATOS"
            newInputsValues[73] = "NO HAY DATOS"
            newInputsValues[74] = "NO HAY DATOS"
            newInputsValues[75] = "NO HAY DATOS"
            newInputsValues[76] = ""
            newInputsValues[77] = ""
            newInputsValues[78] = ""
            newInputsValues[79] = ""
            newInputsValues[80] = ""
            newInputsValues[81] = ""
            newInputsValues[82] = ""
            newInputsValues[83] = ""
            newInputsValues[84] = ""
            newInputsValues[85] = ""
            newInputsValues[86] = ""
            newInputsValues[87] = ""
            newInputsValues[88] = ""
            newInputsValues[89] = ""
            newInputsValues[90] = ""
            newInputsValues[91] = ""
            newInputsValues[92] = ""
            newInputsValues[93] = ""
            newInputsValues[94] = ""
            newInputsValues[95] = ""
            newInputsValues[96] = ""
            newInputsValues[97] = ""
            newInputsValues[98] = ""
            return newInputsValues
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchJsonData()
  }, [])

  const fillComments = (
    validatedFixedNumbersT,
    validatedEmailsT,
    validatedFixedNumbersC,
    validatedEmailsC,
    parents,
    all,
  ) => {
    let newComment = ""
    let count = 0
    if (id == "4") {
      for (let i = 1; i <= 4; i++) {
        const existParent = parents.some((object) => object.Tipo == all[i].Tipo && all[i].NUT)
        if (!existParent) {
          if (count == 0) {
            newComment = newComment + "NO REGISTRA " + all[i].Tipo
            count++
          } else if (count > 0) {
            if (i == 4) {
              newComment = newComment + " NI HIJOS "
            } else {
              newComment = newComment + " NI " + all[i].Tipo
            }
          }
        }
      }
      let register =
        validatedFixedNumbersT.length == 0 ? "TITULAR NO REGISTRA NUMEROS FIJOS VALIDOS " : ""
      newComment = newComment + register
      register = validatedEmailsT.length == 0 ? "TITULAR NO REGISTRA CORREOS VALIDOS " : ""
      newComment = newComment + register
      register =
        validatedFixedNumbersC.length == 0 ? "CONYUGE NO REGISTRA NUMEROS FIJOS VALIDOS " : ""
      newComment = newComment + register
      register = validatedEmailsC.length == 0 ? "CONYUGE NO REGISTRA CORREOS VALIDOS " : ""
      newComment = newComment + register
      register = inputsValues[15] == "NO HAY DATOS" ? "NO REGISTRA DIRECCION EXACTA " : ""
      newComment = newComment + register
    }
    return newComment
  }
  const fillCommentsLegacyClick = () => {
    let newComment = ""
    let value = ""
    let demand1 = false
    let demand2 = false
    let addressCompany = false
    if (id == "6") {
      value = document.querySelector('input[name="input-76"]').value
      demand1 = value != "" ? true : false
      value = document.querySelector('input[name="input-87"]').value
      demand2 = value != "" ? true : false
      value = document.querySelector('input[name="input-68"]').value
      addressCompany = value != "" ? true : false
      if (!addressCompany) {
        newComment = "EMPRESA NO REGISTRA DIRECCION EXACTA "
      }
      if (demand1 && !demand2) {
        newComment =
          newComment + "REGISTRA 1 DEMANDA Y SALE COMO 'LA CONSULTA NO DEVOLVIO RESULTADOS'"
      } else if (demand1 && demand2) {
        newComment = newComment + "REGISTRA 2 DEMANDAS"
      } else if (!demand1 && !demand2) {
        newComment =
          newComment +
          "NO REGISTRA NINGUNA DEMANDA Y SALE COMO 'LA CONSULTA NO DEVOLVIO RESULTADOS'"
      }
      setInputsValues((prevState) => {
        const newInputsValues = [...prevState]
        newInputsValues[99] = newComment
        return newInputsValues
      })
      return newComment
    }
  }
  const handleButtonClick = (handleId) => {
    //actualizar datos
    updatePortfolio()
    const next = handleId > 0 && handleId < range.length ? true : false
    const prev = handleId > 1 && handleId <= range.length ? true : false
    const save = handleId === range.length ? true : false
    setShowComponents((prevState) => ({
      ...prevState,
      nextButton: next,
      prevButton: prev,
      saveButton: save,
    }))
  }
  const handleInputChange = (event, count, selectedField) => {
    let value = event.target.value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[áÁ]/g, "A")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[éÉ]/g, "E")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[íÍ]/g, "i")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[óÓ]/g, "O")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[úÚ]/g, "U")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[^\w\sñÑ]/g, "Ñ")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[^\w\s]/g, "")
      : value
    value = !fieldsExoneratedUpper.includes(selectedField) ? value.toUpperCase() : value
    setInputsValues((prevState) => {
      const newInputsValues = [...prevState]
      newInputsValues[count] = value
      return newInputsValues
    })
  }
  const updatePortfolio = async () => {
    try {
      const response = await axios.put(
        `${webRoute}/api/data/portfolio/${clientData.client.NUT}/${clientName}/update`,
        {
          portfolioFieldsAll: portfolioFieldsAll,
          inputsValues: inputsValues,
        },
      )
    } catch (error) {
      console.log(error)
    }
  }
  const FillEmptysButton = () => {
    const array = inputsValues.map((element) =>
      !element || element == "" || element == "undefined" || element == "null"
        ? "NO HAY DATOS"
        : element,
    )
    setInputsValues(array)
  }
  const ruc1Click = () => {
    const validRuc = validateIfStringIsValid(clientData.client.Fecha_Salida)
    const currentYear = new Date().getFullYear()
    const ingressDate = clientData.client.Fecha_Ingreso
    const partes = ingressDate.split("/")
    const admissionYear = partes[2]
    const jobTime = currentYear - admissionYear
    const addressRuc =
      clientData.client.Provincia_1 +
      " " +
      clientData.client.Cantón_1 +
      " " +
      clientData.client.Parroquia_1 +
      " " +
      clientData.client.Dirección_1
    setInputsValues((prevState) => {
      const newInputsValues = [...prevState]
      //SRI
      newInputsValues[62] = !validRuc ? clientData.client.Empresa : "" //nombre empresa
      newInputsValues[63] = !validRuc ? clientData.client.Actividad_1 : "" //actividad
      newInputsValues[64] = !validRuc ? clientData.client.Descripción : "" //descripcion
      newInputsValues[65] = !validRuc ? clientData.client.Cargo : "" //cargo
      newInputsValues[66] = jobTime + " AÑOS" //tiempo
      newInputsValues[67] = !validRuc ? addressRuc : addressRuc.trim() //direccion
      newInputsValues[68] = ""
      newInputsValues[69] = ""
      newInputsValues[70] = "" //telefono
      return newInputsValues
    })
  }
  const ruc2Click = () => {
    const validRucCancellled = validateIfStringIsValid(clientData.client.Fecha_Cancelación)
    const validRucSuspended = validateIfStringIsValid(clientData.client.Fecha_Suspensión)
    if (validRucSuspended == true && validRucCancellled == false) {
      setVisible(true)
    }
    if (validRucCancellled == true) {
      setInputsValues((prevState) => {
        const newInputsValues = [...prevState]
        //SRI
        newInputsValues[62] = "" //nombre empresa
        newInputsValues[63] = "" //actividad
        newInputsValues[64] = "" //descripcion
        newInputsValues[65] = "" //cargo
        newInputsValues[66] = "" //tiempo
        newInputsValues[67] = "" //direccion
        newInputsValues[68] = ""
        newInputsValues[69] = ""
        newInputsValues[70] = "" //telefono
        return newInputsValues
      })
    }
  }
  const Ruc1Button = () => {
    return (
      <CButton color="danger" size="sm" className="mb-2 mx-2 col-md-2" onClick={() => ruc1Click()}>
        Add RUC (Dependency)
      </CButton>
    )
  }
  const Ruc2Button = () => {
    return (
      <CButton color="danger" size="sm" className="mb-2 mx-2 col-md-2" onClick={() => ruc2Click()}>
        Add Ruc (Owner)
      </CButton>
    )
  }
  const handleYesClick = (value) => {
    setVisible(false)
    const currentYear = new Date().getFullYear()
    const startYear = clientData.client.Fecha_Inicio != "" ? clientData.client.Fecha_Inicio : ""
    const rebootYear =
      clientData.client.Fecha_Reinicio != "" ? clientData.client.Fecha_Reinicio : ""
    const year = rebootYear != "" ? rebootYear : startYear != "" ? startYear : ""
    const partes = year.split("/")
    const admissionYear = partes[2]
    const jobTime = currentYear - admissionYear
    const addressRuc =
      clientData.client.Provincia_2 +
      " " +
      clientData.client.Cantón_2 +
      " " +
      clientData.client.Parroquia_2 +
      " " +
      clientData.client.Dirección_2 +
      " " +
      clientData.client.Referencia
    if (value == "SI") {
      setInputsValues((prevState) => {
        const newInputsValues = [...prevState]
        //SRI
        newInputsValues[62] = clientData.client.Razón_Social //nombre empresa
        newInputsValues[63] = clientData.client.Actividad_2 //actividad
        newInputsValues[64] = clientData.client.Nombre_Fantasía //descripcion
        newInputsValues[65] = "" //cargo
        newInputsValues[66] = jobTime != "" ? jobTime + " AÑOS" : "" //tiempo
        newInputsValues[67] = validateIfStringIsValid(addressRuc) ? addressRuc : addressRuc.trim() //direccion
        newInputsValues[68] = ""
        newInputsValues[69] = ""
        newInputsValues[70] = "" //telefono
        return newInputsValues
      })
    }
  }
  const handleNoClick = (value) => {
    setVisible(false)
    if (value == "NO") {
      setInputsValues((prevState) => {
        const newInputsValues = [...prevState]
        //SRI
        newInputsValues[62] = "" //nombre empresa
        newInputsValues[63] = "" //actividad
        newInputsValues[64] = "" //descripcion
        newInputsValues[65] = "" //cargo
        newInputsValues[66] = "" //tiempo
        newInputsValues[67] = "" //direccion
        newInputsValues[68] = ""
        newInputsValues[69] = ""
        newInputsValues[70] = "" //telefono
        return newInputsValues
      })
    }
  }
  const NextButton = () => {
    return (
      <CButton
        color="info"
        size="sm"
        className="mb-2 mx-2 col-md-2"
        onClick={() => handleButtonClick(parseInt(id) + 1)}
        href={`/manage/client/${clientName}/${parseInt(id) + 1}`}
      >
        Next &raquo;
      </CButton>
    )
  }
  const PrevButton = () => {
    return (
      <CButton
        color="info"
        size="sm"
        className="mb-2 mx-2 col-md-2"
        onClick={() => handleButtonClick(parseInt(id) - 1)}
        href={`/manage/client/${clientName}/${parseInt(id) - 1}`}
      >
        &laquo; Prev
      </CButton>
    )
  }
  const SaveButton = () => {
    return (
      <CButton color="info" size="sm" className="mb-2 mx-2 col-md-2">
        Save
      </CButton>
    )
  }
  const CisText = () => {
    const textC = clientData.parents.some((obj) => obj.Tipo === "CONYUGE")
      ? "CI_CONYUGE:" + clientData.parents[0].NUT
      : "NO TIENE CONYUGE"
    return (
      <div>
        <p className="text-emphasis">CI_TITULAR: {clientData.client.NUT}</p>
        <p className="text-emphasis">{textC}</p>
      </div>
    )
  }
  const AddCommentsLegacyButton = () => {
    return (
      <CButton
        color="warning"
        size="sm"
        className="mb-2 mx-2 col-md-2"
        onClick={() => fillCommentsLegacyClick()}
      >
        Fill Comments
      </CButton>
    )
  }
  const addReferenceClick = (selectedParent, referenceType) => {
    //recibe como parámetro el objeto del pariente
    const validatedMobileNumbersR = validateMobileNumbers(clientData.all, selectedParent.Tipo)
    const validatedFixedNumbersR = validateFixedNumbers(clientData.all, selectedParent.Tipo)
    const validatedEmailsR = validateEmails(clientData.all, selectedParent.Tipo)
    const jobNumber = selectedParent.Teléfono_1
    const addressR =
      selectedParent.Provincia +
      " " +
      selectedParent.Cantón +
      " " +
      selectedParent.Parroquia +
      " " +
      selectedParent.Dirección
    const relationship = selectedParent.Tipo.includes("HIJO") ? "HIJO" : selectedParent.Tipo
    const addressRuc1 =
      selectedParent.Provincia_1 +
      " " +
      selectedParent.Cantón_1 +
      " " +
      selectedParent.Parroquia_1 +
      " " +
      selectedParent.Dirección_1
    const addressRuc2 =
      selectedParent.Provincia_2 +
      " " +
      selectedParent.Cantón_2 +
      " " +
      selectedParent.Parroquia_2 +
      " " +
      selectedParent.Dirección_2 +
      " " +
      selectedParent.Referencia
    const addressJobR =
      selectedParent.RUC_1 != "" ? addressRuc1 : selectedParent.RUC_2 != "" ? addressRuc2 : ""
    if (referenceType == "RF1") {
      setInputsValues((prevState) => {
        const newInputsValues = [...prevState]
        newInputsValues[23] = selectedParent.NUT
        newInputsValues[24] = selectedParent.Nombre
        newInputsValues[25] = relationship
        newInputsValues[26] = validatedMobileNumbersR ? validatedMobileNumbersR[0] : ""
        newInputsValues[27] = validatedMobileNumbersR ? validatedMobileNumbersR[1] : ""
        newInputsValues[28] = addressR.trim() !== "" ? addressR : "" //trim elimina espacios en blanco
        newInputsValues[29] = selectedParent.Cargo
        newInputsValues[30] = addressJobR.trim() !== "" ? addressJobR : ""
        newInputsValues[31] = getDateString(selectedParent.Fecha_Nacimiento)
        newInputsValues[32] = validatedFixedNumbersR ? validatedFixedNumbersR[0] : ""
        newInputsValues[33] = jobNumber.length == 9 ? jobNumber : ""
        newInputsValues[34] = jobNumber.length == 10 ? jobNumber : ""
        newInputsValues[35] = validatedEmailsR.length > 0 ? validatedEmailsR[0] : ""
        return newInputsValues
      })
    } else if (referenceType == "RF2") {
      setInputsValues((prevState) => {
        const newInputsValues = [...prevState]
        newInputsValues[36] = selectedParent.NUT
        newInputsValues[37] = selectedParent.Nombre
        newInputsValues[38] = relationship
        newInputsValues[39] = validatedMobileNumbersR ? validatedMobileNumbersR[0] : ""
        newInputsValues[40] = validatedMobileNumbersR ? validatedMobileNumbersR[1] : ""
        newInputsValues[41] = addressR.trim() !== "" ? addressR : ""
        newInputsValues[42] = selectedParent.Cargo
        newInputsValues[43] = addressJobR.trim() !== "" ? addressJobR : ""
        newInputsValues[44] = getDateString(selectedParent.Fecha_Nacimiento)
        newInputsValues[45] = validatedFixedNumbersR ? validatedFixedNumbersR[0] : ""
        newInputsValues[46] = jobNumber.length == 9 ? jobNumber : ""
        newInputsValues[47] = jobNumber.length == 10 ? jobNumber : ""
        newInputsValues[48] = validatedEmailsR ? validatedEmailsR[0] : ""
        return newInputsValues
      })
    }
  }
  const addReferenceButton = (selectedParent, referenceType) => {
    return (
      <CButton
        color="danger"
        size="sm"
        className="mb-2 mx-2 col-md-2"
        onClick={() => addReferenceClick(selectedParent, referenceType)}
      >
        {selectedParent.Tipo}
      </CButton>
    )
  }
  const AddAllReferencesButtons = () => {
    const ref = id == "3" ? "RF1" : id == "4" ? "RF2" : ""
    return (
      <div>
        <p className="text-emphasis">Choose de reference to insert</p>
        {clientData.parents.map((obj, idx) => {
          if (obj.Tipo != "CONYUGE") {
            return addReferenceButton(obj, ref)
          }
          return null
        })}
      </div>
    )
  }
  return (
    <div>
      <div className="d-flex justify-content-center">
        {id > 1 && id <= range.length && showComponents.prevButton && <PrevButton />}
        {/* {id > 0 && id < range.length && showComponents.nextButton && <NextButton />} */}
        {<NextButton />}
        {id == range.length && showComponents.saveButton && <SaveButton />}
      </div>
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">¡Precaución!</CModalTitle>
        </CModalHeader>
        <CModalBody>
          El RUC personal del cliente se encuentra suspendido. ¿Desea agregarlo de todas formas?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => handleYesClick("SI")}>
            SI
          </CButton>
          <CButton color="primary" onClick={() => handleNoClick("NO")}>
            NO
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>{clientData.client.Nombre}</strong> <small>Management{comments}</small>
            </CCardHeader>
            <CCardBody>
              <p className="text-emphasis">
                <strong>{rangePortfolioFields.dataTitle}</strong>
              </p>
              {id == "5" && showComponents.CIsText && <CisText />}
              <CButton
                color="success"
                size="sm"
                className="mb-2 mx-2 col-md-2"
                onClick={() => FillEmptysButton()}
              >
                Fill emptys
              </CButton>
              {id == "6" && showComponents.legacyCommentsButton && <AddCommentsLegacyButton />}
              {id == "6" && showComponents.ruc1Button && <Ruc1Button />}
              {id == "6" && showComponents.ruc2Button && <Ruc2Button />}
              {showComponents.referencesButton && <AddAllReferencesButtons />}
              <CTable bordered small>
                {setGroupsOf5Array(portfolioFields.slice()).map((element, key) => {
                  return (
                    <React.Fragment key={key}>
                      <CTableHead>
                        <CTableRow>
                          {element.map((element1, key1) => {
                            const bgColor =
                              element1 === "REDES_SOCIALES"
                                ? "bg-warning"
                                : rangePortfolioFields.classBackground
                            return (
                              <CTableHeaderCell scope="col" key={key1} className={`h6 ${bgColor}`}>
                                {element1.replace(/_/g, " ")}
                              </CTableHeaderCell>
                            )
                          })}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody color="success">
                        <CTableRow>
                          {element.map((element1, key1) => {
                            var count = key * 5 + key1 + rangePortfolioFields.minRange
                            return (
                              <CTableDataCell key={key1}>
                                <CInputGroup className="flex-nowrap">
                                  <CFormInput
                                    aria-label="Username"
                                    aria-describedby="addon-wrapping"
                                    value={inputsValues[count]}
                                    name={`input-${count}`}
                                    onChange={(event) => {
                                      handleInputChange(event, count, element1)
                                    }}
                                  />
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
export default ManageClient
