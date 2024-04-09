import React from "react"
import PropTypes from "prop-types"
import { CPopover } from "@coreui/react"

const PopoverTop = ({ content, placement, cInside, classes }) => {
  return (
    <CPopover content={content} placement={placement} trigger="hover" className={classes}>
      {cInside}
    </CPopover>
  )
}
PopoverTop.propTypes = {
  content: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
  cInside: PropTypes.any,
  classes: PropTypes.string,
}
export default PopoverTop
