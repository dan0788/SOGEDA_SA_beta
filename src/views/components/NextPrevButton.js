import React from "react"
import { CButton } from "@coreui/react"

const NextPrevButton = (eventClick, href, text) => {
  return (
    <CButton color="info" size="sm" className="mb-2 mx-2 col-md-2" onClick={eventClick} href={href}>
      {text}
    </CButton>
  )
}
export default NextPrevButton
