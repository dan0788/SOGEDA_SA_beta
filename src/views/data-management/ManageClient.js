import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  setGroupsOf5Array,
  validateMobileNumbers,
  validateFixedNumbers,
  validateEmails,
  getDateString,
  validateIfStringIsValid,
  validateInputExist,
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
  CToaster,
  CInputGroup,
  CFormInput,
} from "@coreui/react"
import NextPrevButton from "../components/NextPrevButton.js"
import SaveToast from "../components/SaveToast.js"
import Modal from "../components/Modal.js"

const ManageClient = () => {
  const { clientName, id } = useParams()
  const {
    range,
    fieldsExoneratedSpecialChar,
    fieldsExoneratedUpper,
    webRoute,
    clientData,
    modalVisible,
    setModalVisible,
    toast,
    setToast,
    toaster,
    setClientData,
    inputsValues,
    setInputsValues,
    portfolioValues,
    setPortfolioValues,
    manageValues,
    setManageValues,
  } = useVariables()
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
  const [modalRucText, setModalRucText] = useState("")
  const [typeModal, setTypeModal] = useState("") // YES_NO, OK
  var portfolioData = []
  var inputData = manageValues
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
        console.log(response.data)
        const client = response.data.result1[0]
        const all = response.data.result1
        setClientData((prevData) => ({
          ...prevData,
          all: all,
          client: client,
          parents: parents,
        }))
        setModalVisible(false)
        handleButtonClick(id)
        if (id == "6") {
          setShowComponents((prevState) => ({
            ...prevState,
            saveButton: true,
          }))
        }
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
        if (id == "5" || id == "6") {
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
        setPortfolioValues(portfolioData)
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
          let addressT = client.Direccion
          setManageValues((prevState) => {
            const newManageValues = [...prevState]
            newManageValues[0] = !client.Fecha_Defunción ? "VIVO" : "FALLECIDO"
            newManageValues[1] = client.Estado_Civil
            newManageValues[2] = client.NUT
            newManageValues[3] = validatedFixedNumbersT ? validatedFixedNumbersT[0] : ""
            newManageValues[4] = validatedMobileNumbersT ? validatedMobileNumbersT[0] : ""
            newManageValues[5] = validatedEmailsT ? validatedEmailsT[0] : ""
            newManageValues[6] = ""
            newManageValues[7] = ""
            newManageValues[8] = addressT.trim() !== "" ? addressT : ""
            newManageValues[9] = ""
            newManageValues[10] = ""
            newManageValues[11] = client.Provincia ? client.Provincia : ""
            newManageValues[12] = client.Canton ? client.Canton : ""
            newManageValues[13] = client.Parroquia ? client.Parroquia : ""
            newManageValues[14] = client.Canton ? client.Canton : ""
            newManageValues[15] = ""
            newManageValues[16] = conyugeType
            newManageValues[17] = conyugeNUT
            newManageValues[18] = validatedFixedNumbersC.length > 0 ? validatedFixedNumbersC[0] : ""
            newManageValues[19] = validatedFixedNumbersC.length > 0 ? validatedFixedNumbersC[1] : ""
            newManageValues[20] =
              validatedMobileNumbersC.length > 0 ? validatedMobileNumbersC[0] : ""
            newManageValues[21] =
              validatedMobileNumbersC.length > 0 ? validatedMobileNumbersC[1] : ""
            newManageValues[22] = validatedEmailsC.length > 0 ? validatedEmailsC[0] : ""
            newManageValues[23] = ""
            newManageValues[24] = ""
            newManageValues[25] = ""
            newManageValues[26] = ""
            newManageValues[27] = ""
            newManageValues[28] = ""
            newManageValues[29] = ""
            newManageValues[30] = ""
            newManageValues[31] = ""
            newManageValues[32] = ""
            newManageValues[33] = ""
            newManageValues[34] = ""
            newManageValues[35] = ""
            newManageValues[36] = ""
            newManageValues[37] = ""
            newManageValues[38] = ""
            newManageValues[39] = ""
            newManageValues[40] = ""
            newManageValues[41] = ""
            newManageValues[42] = ""
            newManageValues[43] = ""
            newManageValues[44] = ""
            newManageValues[45] = ""
            newManageValues[46] = ""
            newManageValues[47] = ""
            newManageValues[48] = ""
            newManageValues[49] = fillComments(
              validatedFixedNumbersT,
              validatedEmailsT,
              validatedFixedNumbersC,
              validatedEmailsC,
              parents,
              all,
            )
            //RUC
            newManageValues[50] = ""
            newManageValues[51] = ""
            newManageValues[52] = ""
            newManageValues[53] = ""
            newManageValues[54] = ""
            newManageValues[55] = ""
            newManageValues[56] = ""
            newManageValues[57] = ""
            newManageValues[58] = !conyugeRUC ? "NO HAY DATOS" : newManageValues[58] //revisar
            newManageValues[59] = !conyugeRUC ? "NO HAY DATOS" : newManageValues[59]
            newManageValues[60] = !conyugeRUC ? "NO HAY DATOS" : newManageValues[60]
            newManageValues[61] = ""
            //SRI
            newManageValues[62] = ""
            newManageValues[63] = ""
            newManageValues[64] = ""
            newManageValues[65] = ""
            newManageValues[66] = ""
            newManageValues[67] = ""
            newManageValues[68] = ""
            newManageValues[69] = ""
            newManageValues[70] = ""
            newManageValues[71] = "NO HAY DATOS"
            newManageValues[72] = "NO HAY DATOS"
            newManageValues[73] = "NO HAY DATOS"
            newManageValues[74] = "NO HAY DATOS"
            newManageValues[75] = "NO HAY DATOS"
            newManageValues[76] = ""
            newManageValues[77] = ""
            newManageValues[78] = ""
            newManageValues[79] = ""
            newManageValues[80] = ""
            newManageValues[81] = ""
            newManageValues[82] = ""
            newManageValues[83] = ""
            newManageValues[84] = ""
            newManageValues[85] = ""
            newManageValues[86] = ""
            newManageValues[87] = ""
            newManageValues[88] = ""
            newManageValues[89] = ""
            newManageValues[90] = ""
            newManageValues[91] = ""
            newManageValues[92] = ""
            newManageValues[93] = ""
            newManageValues[94] = ""
            newManageValues[95] = ""
            newManageValues[96] = ""
            newManageValues[97] = ""
            newManageValues[98] = ""
            setInputsValues(newManageValues)
            return newManageValues
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
    const validateConyuge = all[1].NUT == "" ? false : true
    console.log(validateConyuge)
    let newComment = ""
    let count = 0
    if (id == "4") {
      for (let i = 1; i <= 4; i++) {
        const existParent = parents.some((object) => object.Tipo == all[i].Tipo && all[i].NUT)
        if (!existParent) {
          if (count == 0) {
            let text = ""
            if (all[i].Tipo.includes("HIJO")) {
              text = "HIJOS"
            } else {
              text = all[i].Tipo
            }
            newComment = newComment + "NO REGISTRA " + text + " "
            count++
          } else if (count > 0) {
            if (i == 4) {
              newComment = newComment + " NI HIJOS "
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
        validatedFixedNumbersC.length == 0 && validateConyuge
          ? "CONYUGE NO REGISTRA NUMEROS FIJOS VALIDOS "
          : ""
      newComment = newComment + register
      register =
        validatedEmailsC.length == 0 && validateConyuge
          ? "CONYUGE NO REGISTRA CORREOS VALIDOS "
          : ""
      newComment = newComment + register
      register =
        manageValues[15] == "NO HAY DATOS" || manageValues[15] == ""
          ? "TITULAR NO REGISTRA DIRECCION EXACTA "
          : ""
      newComment = newComment + register
    }
    return newComment
  }
  const fillCommentsLegacyClick = () => {
    let newComment = ""
    let value = ""
    let value1 = ""
    let demand1 = false
    let demand2 = false
    let addressCompany = false
    let company = false
    if (id == "6") {
      value = document.querySelector('input[name="input-76"]').value
      demand1 = value != "" && value != "NO HAY DATOS" ? true : false
      value = document.querySelector('input[name="input-87"]').value
      demand2 = value != "" && value != "NO HAY DATOS" ? true : false
      value = document.querySelector('input[name="input-68"]').value
      value1 = document.querySelector('input[name="input-62"]').value
      addressCompany = value == "" && value1 != "" ? true : false
      if (addressCompany === true) {
        newComment = "EMPRESA NO REGISTRA DIRECCION EXACTA "
      }
      if (demand1 && !demand2) {
        newComment =
          newComment + "REGISTRA 1 DEMANDA Y SALE COMO LA CONSULTA NO DEVOLVIO RESULTADOS"
      } else if (demand1 && demand2) {
        newComment = newComment + "REGISTRA 2 DEMANDAS"
      } else if (!demand1 && !demand2) {
        newComment =
          newComment + "NO REGISTRA NINGUNA DEMANDA Y SALE COMO LA CONSULTA NO DEVOLVIO RESULTADOS"
      }
      setManageValues((prevState) => {
        const newManageValues = [...prevState]
        newManageValues[99] = newComment
        return newManageValues
      })
      return newComment
    }
  }
  const handleButtonClick = (handleId) => {
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
      ? value.replace(/[ñÑ]/g, "N")
      : value
    value = !fieldsExoneratedSpecialChar.includes(selectedField)
      ? value.replace(/[^\w\sñÑ]/g, "")
      : value
    value = !fieldsExoneratedUpper.includes(selectedField) ? value.toUpperCase() : value
    setManageValues((prevState) => {
      const newManageValues = [...prevState]
      newManageValues[count] = value
      return newManageValues
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
      if (response.data) {
        setToast(SaveToast("Datos guardados con éxito", true, "Now"))
      }
    } catch (error) {
      console.log(error)
      setToast(SaveToast("Error al enviar los datos", false, "Now"))
    }
  }
  const FillEmptysButton = () => {
    setManageValues((prevState) => {
      const newManageValues = [...prevState]
      for (let i = 0; i < 100; i++) {
        if (i >= 0 && i <= 15) {
          newManageValues[i] = id != "1" ? portfolioValues[i] : prevState[i] || "NO HAY DATOS"
        }
        if (i >= 16 && i <= 22) {
          newManageValues[i] = id != "2" ? portfolioValues[i] : prevState[i] || "NO HAY DATOS"
        }
        if (i >= 23 && i <= 35) {
          newManageValues[i] = id != "3" ? portfolioValues[i] : prevState[i] || "NO HAY DATOS"
        }
        if (i >= 36 && i <= 49) {
          newManageValues[i] = id != "4" ? portfolioValues[i] : prevState[i] || "NO HAY DATOS"
        }
        if (i >= 50 && i <= 61) {
          newManageValues[i] = id != "5" ? portfolioValues[i] : prevState[i] || "NO HAY DATOS"
        }
        if (i >= 62) {
          newManageValues[i] = id != "6" ? portfolioValues[i] : prevState[i] || "NO HAY DATOS"
        }
      }
      newManageValues[0] = id != "1" ? portfolioValues[0] : prevState[0] || "NO HAY DATOS"
      newManageValues[1] = id != "1" ? portfolioValues[1] : prevState[1] || "NO HAY DATOS"
      newManageValues[2] = id != "1" ? portfolioValues[2] : prevState[2] || "NO HAY DATOS"
      newManageValues[3] = id != "1" ? portfolioValues[3] : prevState[3] || "NO HAY DATOS"
      newManageValues[4] = id != "1" ? portfolioValues[4] : prevState[4] || "NO HAY DATOS"
      newManageValues[5] = id != "1" ? portfolioValues[5] : prevState[5] || "NO HAY DATOS"
      newManageValues[6] = id != "1" ? portfolioValues[6] : prevState[6] || "NO HAY DATOS"
      newManageValues[7] = id != "1" ? portfolioValues[7] : prevState[7] || "NO HAY DATOS"
      newManageValues[8] = id != "1" ? portfolioValues[8] : prevState[8] || "NO HAY DATOS"
      newManageValues[9] = id != "1" ? portfolioValues[9] : prevState[9] || "NO HAY DATOS"
      newManageValues[10] = id != "1" ? portfolioValues[10] : prevState[10] || "NO HAY DATOS"
      newManageValues[11] = id != "1" ? portfolioValues[11] : prevState[11] || "NO HAY DATOS"
      newManageValues[12] = id != "1" ? portfolioValues[12] : prevState[12] || "NO HAY DATOS"
      newManageValues[13] = id != "1" ? portfolioValues[13] : prevState[13] || "NO HAY DATOS"
      newManageValues[14] = id != "1" ? portfolioValues[14] : prevState[14] || "NO HAY DATOS"
      newManageValues[15] = id != "1" ? portfolioValues[15] : prevState[15] || "NO HAY DATOS"
      newManageValues[16] = id != "2" ? portfolioValues[16] : prevState[16] || "NO HAY DATOS"
      newManageValues[17] = id != "2" ? portfolioValues[17] : prevState[17] || "NO HAY DATOS"
      newManageValues[18] = id != "2" ? portfolioValues[18] : prevState[18] || "NO HAY DATOS"
      newManageValues[19] = id != "2" ? portfolioValues[19] : prevState[19] || "NO HAY DATOS"
      newManageValues[20] = id != "2" ? portfolioValues[20] : prevState[20] || "NO HAY DATOS"
      newManageValues[21] = id != "2" ? portfolioValues[21] : prevState[21] || "NO HAY DATOS"
      newManageValues[22] = id != "2" ? portfolioValues[22] : prevState[22] || "NO HAY DATOS"
      newManageValues[23] = id != "3" ? portfolioValues[23] : prevState[23] || "NO HAY DATOS"
      newManageValues[24] = id != "3" ? portfolioValues[24] : prevState[24] || "NO HAY DATOS"
      newManageValues[25] = id != "3" ? portfolioValues[25] : prevState[25] || "NO HAY DATOS"
      newManageValues[26] = id != "3" ? portfolioValues[26] : prevState[26] || "NO HAY DATOS"
      newManageValues[27] = id != "3" ? portfolioValues[27] : prevState[27] || "NO HAY DATOS"
      newManageValues[28] = id != "3" ? portfolioValues[28] : prevState[28] || "NO HAY DATOS"
      newManageValues[29] = id != "3" ? portfolioValues[29] : prevState[29] || "NO HAY DATOS"
      newManageValues[30] = id != "3" ? portfolioValues[30] : prevState[30] || "NO HAY DATOS"
      newManageValues[31] = id != "3" ? portfolioValues[31] : prevState[31] || "NO HAY DATOS"
      newManageValues[32] = id != "3" ? portfolioValues[32] : prevState[32] || "NO HAY DATOS"
      newManageValues[33] = id != "3" ? portfolioValues[33] : prevState[33] || "NO HAY DATOS"
      newManageValues[34] = id != "3" ? portfolioValues[34] : prevState[34] || "NO HAY DATOS"
      newManageValues[35] = id != "3" ? portfolioValues[35] : prevState[35] || "NO HAY DATOS"
      newManageValues[36] = id != "4" ? portfolioValues[36] : prevState[36] || "NO HAY DATOS"
      newManageValues[37] = id != "4" ? portfolioValues[37] : prevState[37] || "NO HAY DATOS"
      newManageValues[38] = id != "4" ? portfolioValues[38] : prevState[38] || "NO HAY DATOS"
      newManageValues[39] = id != "4" ? portfolioValues[39] : prevState[39] || "NO HAY DATOS"
      newManageValues[40] = id != "4" ? portfolioValues[40] : prevState[40] || "NO HAY DATOS"
      newManageValues[41] = id != "4" ? portfolioValues[41] : prevState[41] || "NO HAY DATOS"
      newManageValues[42] = id != "4" ? portfolioValues[42] : prevState[42] || "NO HAY DATOS"
      newManageValues[43] = id != "4" ? portfolioValues[43] : prevState[43] || "NO HAY DATOS"
      newManageValues[44] = id != "4" ? portfolioValues[44] : prevState[44] || "NO HAY DATOS"
      newManageValues[45] = id != "4" ? portfolioValues[45] : prevState[45] || "NO HAY DATOS"
      newManageValues[46] = id != "4" ? portfolioValues[46] : prevState[46] || "NO HAY DATOS"
      newManageValues[47] = id != "4" ? portfolioValues[47] : prevState[47] || "NO HAY DATOS"
      newManageValues[48] = id != "4" ? portfolioValues[48] : prevState[48] || "NO HAY DATOS"
      newManageValues[49] = id != "4" ? portfolioValues[49] : prevState[49] || "NO HAY DATOS"
      newManageValues[50] = id != "5" ? portfolioValues[50] : prevState[50] || "NO HAY DATOS"
      newManageValues[51] = id != "5" ? portfolioValues[51] : prevState[51] || "NO HAY DATOS"
      newManageValues[52] = id != "5" ? portfolioValues[52] : prevState[52] || "NO HAY DATOS"
      newManageValues[53] = id != "5" ? portfolioValues[53] : prevState[53] || "NO HAY DATOS"
      newManageValues[54] = id != "5" ? portfolioValues[54] : prevState[54] || "NO HAY DATOS"
      newManageValues[55] = id != "5" ? portfolioValues[55] : prevState[55] || "NO HAY DATOS"
      newManageValues[56] = id != "5" ? portfolioValues[56] : prevState[56] || "NO HAY DATOS"
      newManageValues[57] = id != "5" ? portfolioValues[57] : prevState[57] || "NO HAY DATOS"
      newManageValues[58] = id != "5" ? portfolioValues[58] : prevState[58] || "NO HAY DATOS"
      newManageValues[59] = id != "5" ? portfolioValues[59] : prevState[59] || "NO HAY DATOS"
      newManageValues[60] = id != "5" ? portfolioValues[60] : prevState[60] || "NO HAY DATOS"
      newManageValues[61] = id != "5" ? portfolioValues[61] : prevState[61] || "NO HAY DATOS"
      newManageValues[62] = id != "6" ? portfolioValues[62] : prevState[62] || "NO HAY DATOS"
      newManageValues[63] = id != "6" ? portfolioValues[63] : prevState[63] || "NO HAY DATOS"
      newManageValues[64] = id != "6" ? portfolioValues[64] : prevState[64] || "NO HAY DATOS"
      newManageValues[65] = id != "6" ? portfolioValues[65] : prevState[65] || "NO HAY DATOS"
      newManageValues[66] = id != "6" ? portfolioValues[66] : prevState[66] || "NO HAY DATOS"
      newManageValues[67] = id != "6" ? portfolioValues[67] : prevState[67] || "NO HAY DATOS"
      newManageValues[68] = id != "6" ? portfolioValues[68] : prevState[68] || "NO HAY DATOS"
      newManageValues[69] = id != "6" ? portfolioValues[69] : prevState[69] || "NO HAY DATOS"
      newManageValues[70] = id != "6" ? portfolioValues[70] : prevState[70] || "NO HAY DATOS"
      newManageValues[71] = id != "6" ? portfolioValues[71] : prevState[71] || "NO HAY DATOS"
      newManageValues[72] = id != "6" ? portfolioValues[72] : prevState[72] || "NO HAY DATOS"
      newManageValues[73] = id != "6" ? portfolioValues[73] : prevState[73] || "NO HAY DATOS"
      newManageValues[74] = id != "6" ? portfolioValues[74] : prevState[74] || "NO HAY DATOS"
      newManageValues[75] = id != "6" ? portfolioValues[75] : prevState[75] || "NO HAY DATOS"
      newManageValues[76] = id != "6" ? portfolioValues[76] : prevState[76] || "NO HAY DATOS"
      newManageValues[77] = id != "6" ? portfolioValues[77] : prevState[77] || "NO HAY DATOS"
      newManageValues[78] = id != "6" ? portfolioValues[78] : prevState[78] || "NO HAY DATOS"
      newManageValues[79] = id != "6" ? portfolioValues[79] : prevState[79] || "NO HAY DATOS"
      newManageValues[80] = id != "6" ? portfolioValues[80] : prevState[80] || "NO HAY DATOS"
      newManageValues[81] = id != "6" ? portfolioValues[81] : prevState[81] || "NO HAY DATOS"
      newManageValues[82] = id != "6" ? portfolioValues[82] : prevState[82] || "NO HAY DATOS"
      newManageValues[83] = id != "6" ? portfolioValues[83] : prevState[83] || "NO HAY DATOS"
      newManageValues[84] = id != "6" ? portfolioValues[84] : prevState[84] || "NO HAY DATOS"
      newManageValues[85] = id != "6" ? portfolioValues[85] : prevState[85] || "NO HAY DATOS"
      newManageValues[86] = id != "6" ? portfolioValues[86] : prevState[86] || "NO HAY DATOS"
      newManageValues[87] = id != "6" ? portfolioValues[87] : prevState[87] || "NO HAY DATOS"
      newManageValues[88] = id != "6" ? portfolioValues[88] : prevState[88] || "NO HAY DATOS"
      newManageValues[89] = id != "6" ? portfolioValues[89] : prevState[89] || "NO HAY DATOS"
      newManageValues[90] = id != "6" ? portfolioValues[90] : prevState[90] || "NO HAY DATOS"
      newManageValues[91] = id != "6" ? portfolioValues[91] : prevState[91] || "NO HAY DATOS"
      newManageValues[92] = id != "6" ? portfolioValues[92] : prevState[92] || "NO HAY DATOS"
      newManageValues[93] = id != "6" ? portfolioValues[93] : prevState[93] || "NO HAY DATOS"
      newManageValues[94] = id != "6" ? portfolioValues[94] : prevState[94] || "NO HAY DATOS"
      newManageValues[95] = id != "6" ? portfolioValues[95] : prevState[95] || "NO HAY DATOS"
      newManageValues[96] = id != "6" ? portfolioValues[96] : prevState[96] || "NO HAY DATOS"
      newManageValues[97] = id != "6" ? portfolioValues[97] : prevState[97] || "NO HAY DATOS"
      newManageValues[98] = id != "6" ? portfolioValues[98] : prevState[98] || "NO HAY DATOS"
      newManageValues[99] = id != "6" ? portfolioValues[99] : prevState[99] || "NO HAY DATOS"
      setInputsValues(newManageValues)
      return newManageValues
    })
  }
  const ruc1Click = () => {
    const validRucEnter = validateIfStringIsValid(clientData.client.Fecha_Ingreso)
    const validRucOut = validateIfStringIsValid(clientData.client.Fecha_Salida)
    const validRuc1Exist = validateIfStringIsValid(clientData.client.RUC_1)
    if (validRuc1Exist == false) {
      setModalVisible(true)
      setModalRucText("El cliente no registra RUC de dependencia")
      setTypeModal("OK")
    }
    if (validRuc1Exist == true && validRucEnter == true && validRucOut == true) {
      setModalVisible(true)
      setModalRucText(
        "El cliente registra que ya no está trabajando en la empresa. ¿Desea agregarlo de todas formas?",
      )
      setTypeModal("YES_NO")
    }
    if (validRuc1Exist == true && validRucEnter == true && validRucOut == false) {
      handleYesClick("SI", "RUC_1")
    }
  }
  const ruc2Click = () => {
    const validRucCancellled = validateIfStringIsValid(clientData.client.Fecha_Cancelacion)
    const validRucSuspended = validateIfStringIsValid(clientData.client.Fecha_Suspension)
    const validRuc2Exist = validateIfStringIsValid(clientData.client.RUC_2)
    if (validRuc2Exist == false) {
      const handleClose = () => {
        setModalVisible(false)
      }
      setModalVisible(true)
      setModalRucText("El cliente no registra RUC personal")
      setTypeModal("OK")
    }
    if (validRucSuspended == true && validRucCancellled == false) {
      setModalVisible(true)
      setModalRucText(
        "El RUC personal del cliente se encuentra suspendido. ¿Desea agregarlo de todas formas?",
      )
      setTypeModal("YES_NO")
    }
    if (validRucSuspended == true && validRucCancellled == true) {
      setModalVisible(true)
      setModalRucText(
        "El RUC personal del cliente se encuentra cancelado. ¿Desea agregarlo de todas formas?",
      )
      setTypeModal("YES_NO")
    }
    if (validRucSuspended == false && validRucCancellled == false) {
      setModalVisible(false)
      handleYesClick("SI", "RUC_2")
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
  const handleYesClick = (value, valueRUC) => {
    setModalVisible(false)
    if (value == "SI") {
      if (valueRUC == "RUC_1") {
        const currentYear = new Date().getFullYear()
        const ingressDate = clientData.client.Fecha_Ingreso
        const partes = ingressDate.split("/")
        const admissionYear = partes[2]
        const jobTime = currentYear - admissionYear
        const addressRuc =
          clientData.client.Provincia_1 +
          " " +
          clientData.client.Canton_1 +
          " " +
          clientData.client.Parroquia_1 +
          " " +
          clientData.client.Direccion_1
        setManageValues((prevState) => {
          const newManageValues = [...prevState]
          //SRI
          newManageValues[62] = clientData.client.Empresa //nombre empresa
          newManageValues[63] = clientData.client.Actividad_1 //actividad
          newManageValues[64] = clientData.client.Descripcion //descripcion
          newManageValues[65] = clientData.client.Cargo //cargo
          newManageValues[66] = jobTime + " AÑOS" //tiempo
          newManageValues[67] = addressRuc //direccion
          newManageValues[68] = ""
          newManageValues[69] = ""
          newManageValues[70] = clientData.client.Telefono_1 //telefono
          return newManageValues
        })
      }
      if (valueRUC == "RUC_2") {
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
          clientData.client.Canton_2 +
          " " +
          clientData.client.Parroquia_2 +
          " " +
          clientData.client.Direccion_2 +
          " " +
          clientData.client.Referencia
        setManageValues((prevState) => {
          const newManageValues = [...prevState]
          //SRI
          newManageValues[62] = clientData.client.Razon_Social //nombre empresa
          newManageValues[63] = clientData.client.Actividad_2 //actividad
          newManageValues[64] = clientData.client.Nombre_Fantasia //descripcion
          newManageValues[65] = "" //cargo
          newManageValues[66] = jobTime != "" ? jobTime + " AÑOS" : "" //tiempo
          newManageValues[67] = validateIfStringIsValid(addressRuc) ? addressRuc : addressRuc.trim() //direccion
          newManageValues[68] = ""
          newManageValues[69] = ""
          newManageValues[70] = "" //telefono
          return newManageValues
        })
      }
    }
  }
  const handleNoClick = (value, valueRUC) => {
    setModalVisible(false)
    if (value == "NO") {
      setManageValues((prevState) => {
        const newManageValues = [...prevState]
        //SRI
        newManageValues[62] = "" //nombre empresa
        newManageValues[63] = "" //actividad
        newManageValues[64] = "" //descripcion
        newManageValues[65] = "" //cargo
        newManageValues[66] = "" //tiempo
        newManageValues[67] = "" //direccion
        newManageValues[68] = ""
        newManageValues[69] = ""
        newManageValues[70] = "" //telefono
        return newManageValues
      })
    }
  }
  const CisText = () => {
    const textC = clientData.parents.some((obj) => obj.Tipo == "CONYUGE")
      ? "CI_CONYUGE: " + clientData.parents[0].NUT
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
    const jobNumber = selectedParent.Telefono_1
    const addressR =
      selectedParent.Provincia +
      " " +
      selectedParent.Canton +
      " " +
      selectedParent.Parroquia +
      " " +
      selectedParent.Direccion
    const relationship = selectedParent.Tipo.includes("HIJO") ? "HIJO" : selectedParent.Tipo
    const addressRuc1 =
      selectedParent.Provincia_1 +
      " " +
      selectedParent.Canton_1 +
      " " +
      selectedParent.Parroquia_1 +
      " " +
      selectedParent.Direccion_1
    const addressRuc2 =
      selectedParent.Provincia_2 +
      " " +
      selectedParent.Canton_2 +
      " " +
      selectedParent.Parroquia_2 +
      " " +
      selectedParent.Direccion_2 +
      " " +
      selectedParent.Referencia
    const addressJobR =
      selectedParent.RUC_1 != "" ? addressRuc1 : selectedParent.RUC_2 != "" ? addressRuc2 : ""
    if (referenceType == "RF1") {
      setManageValues((prevState) => {
        const newManageValues = [...prevState]
        newManageValues[23] = selectedParent.NUT
        newManageValues[24] = selectedParent.Nombre
        newManageValues[25] = relationship
        newManageValues[26] = validatedMobileNumbersR ? validatedMobileNumbersR[0] : ""
        newManageValues[27] = validatedMobileNumbersR ? validatedMobileNumbersR[1] : ""
        newManageValues[28] = addressR.trim() !== "" ? addressR : "" //trim elimina espacios en blanco
        newManageValues[29] = selectedParent.Cargo
        newManageValues[30] = addressJobR.trim() !== "" ? addressJobR : ""
        newManageValues[31] = getDateString(selectedParent.Fecha_Nacimiento)
        newManageValues[32] = validatedFixedNumbersR ? validatedFixedNumbersR[0] : ""
        newManageValues[33] = jobNumber.length == 9 ? jobNumber : ""
        newManageValues[34] = jobNumber.length == 10 ? jobNumber : ""
        newManageValues[35] = validatedEmailsR.length > 0 ? validatedEmailsR[0] : ""
        return newManageValues
      })
    } else if (referenceType == "RF2") {
      setManageValues((prevState) => {
        const newManageValues = [...prevState]
        newManageValues[36] = selectedParent.NUT
        newManageValues[37] = selectedParent.Nombre
        newManageValues[38] = relationship
        newManageValues[39] = validatedMobileNumbersR ? validatedMobileNumbersR[0] : ""
        newManageValues[40] = validatedMobileNumbersR ? validatedMobileNumbersR[1] : ""
        newManageValues[41] = addressR.trim() !== "" ? addressR : ""
        newManageValues[42] = selectedParent.Cargo
        newManageValues[43] = addressJobR.trim() !== "" ? addressJobR : ""
        newManageValues[44] = getDateString(selectedParent.Fecha_Nacimiento)
        newManageValues[45] = validatedFixedNumbersR ? validatedFixedNumbersR[0] : ""
        newManageValues[46] = jobNumber.length == 9 ? jobNumber : ""
        newManageValues[47] = jobNumber.length == 10 ? jobNumber : ""
        newManageValues[48] = validatedEmailsR ? validatedEmailsR[0] : ""
        return newManageValues
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
            if (obj.Fecha_Defuncion == "") {
              return addReferenceButton(obj, ref)
            }
          }
          return null
        })}
      </div>
    )
  }
  const NextButton = () => {
    const handleClick = () => {
      handleButtonClick(parseInt(id) + 1)
    }
    return NextPrevButton(handleClick, `/manage/client/${clientName}/${parseInt(id) + 1}`, "Next »")
  }
  const PrevButton = () => {
    const handleClick = () => {
      handleButtonClick(parseInt(id) - 1)
    }
    return NextPrevButton(handleClick, `/manage/client/${clientName}/${parseInt(id) - 1}`, `« Prev`)
  }
  const SaveButton = () => {
    const handleClick = () => {
      //actualizar datos
      updatePortfolio()
    }
    return NextPrevButton(handleClick, "", "Save")
  }
  const RucModal = ({ value }) => {
    const handleClick1 = () => {
      handleYesClick("SI", "RUC_2")
    }
    const handleClick2 = () => {
      handleNoClick("NO", "RUC_2")
    }
    const handleClose = () => {
      setModalVisible(false)
    }
    if (value == "YES_NO") {
      return Modal(
        "¡Precaución!",
        modalRucText,
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
    if (value == "OK") {
      return Modal(
        "Falta de datos",
        modalRucText,
        handleClose,
        modalVisible,
        "CERRAR",
        handleClose,
        "danger",
      )
    }
  }
  return (
    <div>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      <div className="d-flex justify-content-center">
        {id > 1 && id <= range.length && showComponents.prevButton && <PrevButton />}
        {id > 0 && id < range.length && showComponents.nextButton && <NextButton />}
      </div>
      <div>{<SaveButton />}</div>
      {<RucModal value={typeModal} />}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>{clientData.client.Nombre}</strong> <small>Management</small>
            </CCardHeader>
            <CCardBody>
              <p className="text-emphasis">
                <strong>{rangePortfolioFields.dataTitle}</strong>
              </p>
              {(id == "5" || id == "6") && showComponents.CIsText && <CisText />}
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
                                    value={manageValues[count]}
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
