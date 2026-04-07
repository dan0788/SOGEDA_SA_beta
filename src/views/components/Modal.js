import React from "react"
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react"

const Modal = (title, text, closeEvent, visible, ...buttons) => {
  const array = []
  for (let i = 0; i < buttons.length / 3; i++) {
    array.push(i)
  }
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
        {array.map((_, index) => {
          const buttonIndex = index * 3
          const buttonText = buttons[buttonIndex]
          const buttonClick = buttons[buttonIndex + 1]
          const buttonColor = buttons[buttonIndex + 2]
          return (
            <CButton color={buttonColor} onClick={buttonClick} key={index}>
              {buttonText}
            </CButton>
          )
        })}
      </CModalFooter>
    </CModal>
  )
}
export default Modal
