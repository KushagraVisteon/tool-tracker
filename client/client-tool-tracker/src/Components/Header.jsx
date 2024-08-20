import { useState } from "react";

function Header({ changeCategory, searched }) {

  const [selectedValue, setSelectedValue] = useState('');
  const [enableInput, setEnableInput] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");

  const handleSelectChange = (event) => {
    const value = event.target.value
    if (value !== "NONE") {
      setEnableInput(true)
    }
    if (value === "NONE") {
      setEnableInput(false)
    }
    setSelectedValue(event.target.value);
  };

  return (
    <div className="header">
      <h1 className="heading_header">Tool Tracker</h1>
      <div className="filter-container">
        <label>
          Filter By:
          <select className="heading_header" value={selectedValue} onChange={handleSelectChange}>
            <option className="option" value="NONE">None</option>
            <option className="option" value="LOCATION">Location</option>
            <option className="option" value="ASSET_CATEGORY">Asset Category</option>
            <option className="option" value="PROJECT">Project</option>
            <option className="option" value="NAME">Name</option>
          </select>
        </label>
        {enableInput && <input className="category-input" type="text" value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)} />}
        <span className="btn-header-container">
          <button onClick={() => { searched(selectedValue, categoryValue) }}>Search</button>
        </span>
      </div>
    </div>
  )
}

export default Header
