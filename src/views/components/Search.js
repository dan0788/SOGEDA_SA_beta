import React from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { CInputGroup, CInputGroupText, CFormInput } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilMagnifyingGlass } from "@coreui/icons"
import useVariables from "../variables"

const Search = ({ onDataReceived }) => {
  const { webRoute } = useVariables()
  const handleSearchChange = async (e) => {
    const value = e.target.value
    try {
      const response = await axios.post(`${webRoute}/api/data/search`, { searchValue: value })
      onDataReceived(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <CInputGroup className="mb-3">
      <CInputGroupText id="basic-addon1" className="font-black">
        <CIcon icon={cilMagnifyingGlass} />
      </CInputGroupText>
      <CFormInput
        placeholder="Search"
        aria-label="Username"
        aria-describedby="basic-addon1"
        onChange={(e) => handleSearchChange(e)}
        autoFocus
      />
    </CInputGroup>
  )
}

// Define PropTypes para onDataReceived
Search.propTypes = {
  onDataReceived: PropTypes.func.isRequired,
}
export default Search
