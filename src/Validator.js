import validator from "validator"

export function setGroupsOf5Values(objeto) {
  const gruposTempC = []
  for (let i = 0; i < Object.values(objeto).length; i += 5) {
    gruposTempC.push(Object.values(objeto).slice(i, i + 5))
  }
  return gruposTempC
}
export function setGroupsOf5Keys(objeto) {
  const gruposTempC = []
  for (let i = 0; i < Object.keys(objeto).length; i += 5) {
    gruposTempC.push(Object.keys(objeto).slice(i, i + 5))
  }
  return gruposTempC
}
export function setGroupsOf5Array(array) {
  const gruposTempC = []
  for (let i = 0; i < array.length; i += 5) {
    gruposTempC.push(array.slice(i, i + 5))
  }
  return gruposTempC
}
export function getActualDate() {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1
  const getYear = currentDate.getFullYear()
  const getMonth = month < 10 ? "0" + month : month
  const getDay = day < 10 ? "0" + day : day
  return getYear + "-" + getMonth + "-" + getDay
}
export function getDateString(stringDate) {
  // convierte el string date de formato mm/dd/yy a dd/mm/yy
  const fechaOriginal = stringDate
  const partes = fechaOriginal.split("/")
  const mes = partes[0]
  const dia = partes[1]
  const año = partes[2]
  return `${dia}/${mes}/${año}`
}
/* colocar valores manualmente */
export const setOnlyAlpha = (value) => {
  if (validator.isAlpha(value) || value === "" || /^[A-Za-z\s]*$/.test(value)) {
    return value
  }
  return value.slice(0, -1)
}
export const setOnlyNumeric = (value) => {
  if (validator.isNumeric(value) || value === "") {
    return value
  }
  return value.slice(0, -1)
}
export const setIdentityCard = (value) => {
  if (validator.isNumeric(value) && value.length <= 10) {
    return value
  }
  return value.slice(0, -1)
}
export const convertToUpperCase = (text) => {
  return text.toUpperCase()
}
/* colocar valores automáticamente */
export const setEmailsArray = (arrayValues) => {
  const array = arrayValues.filter((element) => element)
  return array
}
export const setMobileNumbers = (arrayValues) => {
  const array = arrayValues.filter((item) => item !== "")
  const newArray = array.filter(
    (item) =>
      validator.isNumeric(item) &&
      item.length === 10 &&
      (item.slice(0, 2) === "09" || item.slice(0, 2) === "08"),
  )
  //console.log("newArray", newArray)
  return newArray
}
export const setFixedNumbers = (arrayValues) => {
  const array = arrayValues.filter((item) => item !== "")
  const newArray = array.filter(
    (item) =>
      validator.isNumeric(item) &&
      item.length === 9 &&
      (item.slice(0, 2) === "02" ||
        item.slice(0, 2) === "03" ||
        item.slice(0, 2) === "04" ||
        item.slice(0, 2) === "05" ||
        item.slice(0, 2) === "06" ||
        item.slice(0, 2) === "07"),
  )
  return newArray
}
export const setOnlyLetters = (text) => {
  const letras = text.match(/[a-zA-Z]+/g).join("")
  return letras
}
export const setDate = (dateText) => {
  const arrayDate = dateText.split("/")
  const dia = arrayDate[1]
  const mes = arrayDate[0]
  const anio = arrayDate[2]
  return anio + "-" + mes + "-" + dia
}
export function validateMobileNumbers(objectAll, stringTipoCliente) {
  try {
    const indexOfClient = objectAll.findIndex((element) => element.Tipo === stringTipoCliente)
    const objectTipoClient = objectAll.find((element) => element.Tipo === stringTipoCliente)
    const objectParents = objectAll.filter((element, index) => index < indexOfClient && element.NUT)
    const arrayClientWithoutEmptys = Object.entries(objectTipoClient)
      .filter(
        (element) =>
          (element[0] === "Medio_1" ||
            element[0] === "Medio_2" ||
            element[0] === "Medio_3" ||
            element[0] === "Medio_4" ||
            element[0] === "Medio_5" ||
            element[0] === "Medio_6") &&
          element[1] !== "",
      )
      .flatMap((element) => [element[1]])
    const objectParentsWithoutEmptys = objectParents.map((element) => {
      const array = ["Medio_1", "Medio_2", "Medio_3", "Medio_4", "Medio_5", "Medio_6"]
        .map((element1) => element[element1])
        .filter((element1) => element1)
      return array
    })
    const arrayParentsWithoutEmptys = Object.values(objectParentsWithoutEmptys)
      .flatMap((element) => element)
      .filter((element) => element)
    const arrayParentsMobileNumbers = setMobileNumbers(arrayParentsWithoutEmptys)
    const arrayClientMobileNumbers = setMobileNumbers(arrayClientWithoutEmptys)
    const array = arrayClientMobileNumbers.filter(
      (element) => !arrayParentsMobileNumbers.includes(element),
    )
    const arrayClientNumbers = [...new Set(array)]
    return arrayClientNumbers
  } catch (error) {
    console.log(error)
  }
}
export function validateFixedNumbers(objectAll, stringTipoCliente) {
  try {
    const indexOfClient = objectAll.findIndex((element) => element.Tipo === stringTipoCliente)
    const objectTipoClient = objectAll.find((element) => element.Tipo === stringTipoCliente)
    const objectParents = objectAll.filter((element, index) => index < indexOfClient && element.NUT)
    const arrayClientWithoutEmptys = Object.entries(objectTipoClient)
      .filter(
        (element) =>
          (element[0] === "Medio_1" ||
            element[0] === "Medio_2" ||
            element[0] === "Medio_3" ||
            element[0] === "Medio_4" ||
            element[0] === "Medio_5" ||
            element[0] === "Medio_6") &&
          element[1] !== "",
      )
      .flatMap((element) => [element[1]])
    const objectParentsWithoutEmptys = objectParents.map((element) => {
      const array = ["Medio_1", "Medio_2", "Medio_3", "Medio_4", "Medio_5", "Medio_6"]
        .map((element1) => element[element1])
        .filter((element1) => element1)
      return array
    })
    const arrayParentsWithoutEmptys = Object.values(objectParentsWithoutEmptys)
      .flatMap((element) => element)
      .filter((element) => element)
    const arrayParentsFixedNumbers = setFixedNumbers(arrayParentsWithoutEmptys)
    const arrayClientFixedNumbers = setFixedNumbers(arrayClientWithoutEmptys)
    const array = arrayClientFixedNumbers.filter(
      (element) => !arrayParentsFixedNumbers.includes(element),
    )
    const arrayClientNumbers = [...new Set(array)] //elimina repetidos
    return arrayClientNumbers
  } catch (error) {
    console.log(error)
  }
}
export function validateEmails(objectAll, stringTipoCliente) {
  try {
    const indexOfClient = objectAll.find((element) => element.Tipo == stringTipoCliente)
    const objectTipoClient = objectAll.find((element) => element.Tipo == stringTipoCliente)
    const objectParents = objectAll.filter((element, index) => index < indexOfClient && element.NUT)
    const arrayClientWithoutEmptys = Object.entries(objectTipoClient)
      .filter(
        (element) => (element[0] === "Email_1" || element[0] === "Email_2") && element[1] !== "",
      )
      .flatMap((element) => [element[1]])
    const objectParentsWithoutEmptys = objectParents.map((element) => {
      const array = ["Email_1", "Email_2"]
        .map((element1) => element[element1])
        .filter((element1) => element1)
      return array
    })
    const arrayParentsWithoutEmptys = Object.values(objectParentsWithoutEmptys)
      .flatMap((element) => element)
      .filter((element) => element)
    const arrayParentsEmails = setEmailsArray(arrayParentsWithoutEmptys)
    const arrayClientEmails = setEmailsArray(arrayClientWithoutEmptys)
    const array = arrayClientEmails.filter((element) => !arrayParentsEmails.includes(element))
    const arrayClienteEmails = [...new Set(array)] //elimina repetidos
    return arrayClienteEmails
  } catch (error) {
    //console.log(error)
  }
}
export function validDoubleIf(condition1, response1, condition2, response2, finalResponse) {
  const data = condition1 ? response1 : condition2 ? response2 : finalResponse
  return data
}
export function validateIfStringIsValid(stringData) {
  if (!stringData || validator.isEmpty(stringData) || stringData.trim() === "NO HAY DATOS") {
    return false
  } else {
    return true
  }
}
