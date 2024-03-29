import React from "react"
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react"

const Modal = (title, text, textButton1, textButton2, event1, event2, closeEvent, visible) => {
  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={closeEvent}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{text}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={event1}>
          {textButton1}
        </CButton>
        <CButton color="primary" onClick={event2}>
          {textButton2}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
export default Modal
