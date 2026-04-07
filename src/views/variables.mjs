import { useState } from "react"

const useVariables = () => {
  const range = [
    {
      id: 1,
      minRange: 0,
      maxRange: 15,
      classBackground: "bg-primary bg-gradient text-white",
      dataTitle: "CLIENT DATA",
    },
    {
      id: 2,
      minRange: 16,
      maxRange: 22,
      classBackground: "bg-primary bg-opacity-75",
      dataTitle: "PARTNER DATA",
    },
    {
      id: 3,
      minRange: 23,
      maxRange: 35,
      classBackground: "bg-info bg-gradient",
      dataTitle: "REFERENCE1 DATA",
    },
    {
      id: 4,
      minRange: 36,
      maxRange: 49,
      classBackground: "bg-primary bg-gradient text-white",
      dataTitle: "REFERENCE2 DATA",
    },
    {
      id: 5,
      minRange: 50,
      maxRange: 61,
      classBackground: "bg-success bg-gradient",
      dataTitle: "INSTRUCTION, SRI AND SUPERINTENDENCE DATA",
    },
    {
      id: 6,
      minRange: 62,
      maxRange: 99,
      classBackground: "bg-purple bg-gradient text-white",
      dataTitle: "COMPANY AND LEGACY DATA",
    },
  ]
  const fieldsExoneratedSpecialChar = [
    "CORREO_ELECTRONICO_TITULAR",
    "GEO_REFERENCIA_URL_DIRECCION_TITULAR",
    "CORREO_CONYUGE",
    "FECHA_DE_NACIMIENTO_RF1",
    "CORREO_RF1",
    "FECHA_DE_NACIMIENTO_RF2",
    "CORREO_RF2",
    "INGRESOS_ACTUALES",
    "GEO_REFERENCIA",
    "HORARIO_DE_TRABAJO",
    "CUANTIA_DEMANDA1",
    "CUANTIA_DEMANDA2",
  ]
  const fieldsExoneratedUpper = [
    "CORREO_ELECTRONICO_TITULAR",
    "GEO_REFERENCIA_URL_DIRECCION_TITULAR",
    "CORREO_CONYUGE",
    "CORREO_RF1",
    "CORREO_RF2",
    "GEO_REFERENCIA",
  ]
  const webRoute = process.env.REACT_APP_API_URL || ""
  const database = {
    nameDatabase: "excel",
    nameTableClients: "clientstest",
    nameTableManage: "portfolios",
  }
  return { range, fieldsExoneratedSpecialChar, fieldsExoneratedUpper, webRoute, database }
}
export default useVariables
