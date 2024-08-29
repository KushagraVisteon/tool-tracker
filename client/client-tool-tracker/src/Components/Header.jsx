import { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";

function Header({ changeCategory, searched }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [enableInput, setEnableInput] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");

  const handleSelectChange = (event) => {
    setCategoryValue("");
    const value = event.target.value;
    setSelectedValue(value);

    // Enable input/select dropdown based on the selected filter
    if (value !== "NONE") {
      setEnableInput(true);
    } else {
      setEnableInput(false);
      setCategoryValue(""); // Reset category value when no filter is selected
    }
  };

  useEffect(() => {
    console.log("categoryValue is: " + categoryValue);
  }, [categoryValue]);

  // Determine what input type to show
  const renderInputField = () => {
    if (selectedValue === "LOCATION") {
      return (
        <select
          className="category-input"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
        >
          <option value="">Select Location</option>
          <option value="BENGALURU">Bangaluru</option>
          <option value="CHENNAI">Chennai</option>
          <option value="GOA">Goa</option>
          <option value="PUNE">Pune</option>
          <option value="COIMBATORE">Coimbatore</option>
          <option value="TRIVANDRUM">Trivandrum</option>
        </select>
      );
    } else if (selectedValue === "ASSET_CATEGORY") {
      return (
        <select
          className="category-input"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
        >
          <option value="">Select Asset Category</option>
          <option value="HARDWARE">Hardware</option>
          <option value="FLASHING_TOOL">Flashing Tool</option>
          <option value="PHONES">Phones</option>
          <option value="HEADSET">Headset</option>
          <option value="CAMERA">Camera</option>
          <option value="ANTENA">Antena</option>
          <option value="PENDRIVE">Pendrive</option>
          <option value="ACCESSORIES">Accessories</option>
          <option value="TEST_PANEL">Test Panel</option>
          <option value="OTHER">Other</option>
        </select>
      );
    } else {
      // Default to text input for other categories
      return (
        <input
          className="category-input"
          type="text"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
        />
      );
    }
  };

  return (
    <div className="header">
      <h1 className="heading_header">Tool Tracker</h1>
      <div className="filter-container">
        <label className="filter-label">
          Filter By:
          <select
            className="filter-select"
            value={selectedValue}
            onChange={handleSelectChange}
          >
            <option value="NONE">None</option>
            <option value="LOCATION">Location</option>
            <option value="ASSET_CATEGORY">Asset Category</option>
            <option value="PROJECT">Project</option>
            <option value="NAME">Name</option>
          </select>
        </label>
        {enableInput && (
          <div className="input-field-container">{renderInputField()}</div>
        )}
        <div className="btn-header-container">
          <PrimaryButton
            onClick={() => {
              searched(selectedValue, categoryValue);
            }}
          >
            Search
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default Header;
