import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PrimaryButton from "./PrimaryButton";
import { MenuItem, Select } from "@mui/material";
import { localhost } from "../Production";

function Header({ changeCategory, searched }) {
  const [selectedValue, setSelectedValue] = useState("NONE");
  const [enableInput, setEnableInput] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [projectOptions, setProjectOptions] = useState([]); // State to store fetched project options
  const [nameOptions, setNameOptions] = useState([]); // State to store fetched name options

  // Sample options for Location and Asset Category
  const locationOptions = [
    "BENGALURU",
    "CHENNAI",
    "GOA",
    "PUNE",
    "COIMBATORE",
    "TRIVANDRUM",
  ];
  const assetCategoryOptions = [
    "HARDWARE",
    "FLASHING_TOOL",
    "PHONES",
    "HEADSET",
    "CAMERA",
    "ANTENA",
    "PENDRIVE",
    "ACCESSORIES",
    "TEST_PANEL",
    "OTHER",
  ];

  // Fetch distinct projects and names on component mount
  useEffect(() => {
    // Fetch distinct projects
    fetch(`${localhost}/find/distinct-projects`)
      .then((response) => response.json())
      .then((data) => setProjectOptions(data))
      .catch((error) => console.error("Error fetching projects:", error));

    // Fetch distinct names
    fetch(`${localhost}/find/distinct-names`)
      .then((response) => response.json())
      .then((data) => setNameOptions(data))
      .catch((error) => console.error("Error fetching names:", error));
  }, []);

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

  // Determine what input type to show
  const renderInputField = () => {
    if (selectedValue === "LOCATION") {
      return (
        <Autocomplete
          className="autocomplete"
          options={locationOptions}
          value={categoryValue}
          onChange={(event, newValue) => setCategoryValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Location"
              variant="outlined"
              sx={{
                width: "250px",
                background: "white",
                borderRadius: "5px",
                margin: "15px 0px",
              }}
            />
          )}
        />
      );
    } else if (selectedValue === "ASSET_CATEGORY") {
      return (
        <Autocomplete
          className="autocomplete"
          options={assetCategoryOptions}
          value={categoryValue}
          onChange={(event, newValue) => setCategoryValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Asset Category"
              variant="outlined"
              sx={{
                width: "250px",
                background: "white",
                borderRadius: "5px",
                margin: "15px 0px",
              }}
            />
          )}
        />
      );
    } else if (selectedValue === "PROJECT") {
      return (
        <Autocomplete
          className="autocomplete"
          options={projectOptions}
          value={categoryValue}
          onChange={(event, newValue) => setCategoryValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Project"
              variant="outlined"
              sx={{
                width: "250px",
                background: "white",
                borderRadius: "5px",
                margin: "15px 0px",
              }}
            />
          )}
        />
      );
    } else if (selectedValue === "NAME") {
      return (
        <Autocomplete
          className="autocomplete"
          options={nameOptions}
          value={categoryValue}
          onChange={(event, newValue) => setCategoryValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Name"
              variant="outlined"
              sx={{
                width: "200px",
                background: "white",
                borderRadius: "5px",
                margin: "15px 0px",
              }}
            />
          )}
        />
      );
    } else {
      return (
        <TextField
          className="category-input"
          variant="outlined"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          label="Enter value"
          sx={{
            width: "200px",
            background: "white",
            borderRadius: "5px",
            margin: "15px 0px",
          }}
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
          <Select
            className="filter-select"
            value={selectedValue}
            onChange={handleSelectChange}
            sx={{
              minWidth: 220,
              marginBottom: 2,
              backgroundColor: "white", // Add white background
              borderRadius: "5px", // Optional: Adds rounded corners
            }}
          >
            <MenuItem value="NONE">None</MenuItem>
            <MenuItem value="LOCATION">Location</MenuItem>
            <MenuItem value="ASSET_CATEGORY">Asset Category</MenuItem>
            <MenuItem value="PROJECT">Project</MenuItem>
            <MenuItem value="NAME">Name</MenuItem>
          </Select>
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
