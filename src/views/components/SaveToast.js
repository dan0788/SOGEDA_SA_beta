import React from "react"
import { CToast, CToastHeader, CToastBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCheckAlt, cilX } from "@coreui/icons"

const SaveToast = (value, iconCheck, time) => {
  const icon = iconCheck ? (
    <CIcon icon={cilCheckAlt} style={{ color: "green" }} />
  ) : (
    <CIcon icon={cilX} style={{ color: "red" }} />
  )
  return (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          {icon}
        </svg>
        <div className="fw-bold me-auto">Actualización de datos</div>
        <small>{time}</small>
      </CToastHeader>
      <CToastBody>{value}</CToastBody>
    </CToast>
  )
}
export default SaveToast
