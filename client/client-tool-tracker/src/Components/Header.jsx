import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PrimaryButton from "./PrimaryButton";
import { MenuItem, Select } from "@mui/material";
import { localhost } from "../Production";
import { Login } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import BasicModal from "./BasicModel";
import LockIcon from "@mui/icons-material/Lock";

function Header({ changeCategory, searched, isTokenPresent, setLogedIn }) {
  const [selectedValue, setSelectedValue] = useState("NONE");
  const [enableInput, setEnableInput] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [projectOptions, setProjectOptions] = useState([]); // State to store fetched project options
  const [nameOptions, setNameOptions] = useState([]); // State to store fetched name options
  const [isModelClicked, setIsModelClicked] = useState(false);

  const isModalClosed = () => {
    setIsModelClicked(false);
  };

  // Sample options for Location and Asset Category
  const locationOptions = [
    "BANGALORE",
    "CHENNAI",
    "COIMBATORE",
    "GOA",
    "PUNE",
    "TRIVANDRUM",
  ];
  const assetCategoryOptions = [
    "ACCESSORIES",
    "ANTENA",
    "CAMERA",
    "FLASHING_TOOL",
    "HARDWARE",
    "HEADSET",
    "OTHER",
    "PENDRIVE",
    "PHONES",
    "TEST_PANEL",
  ];

  const fetchDistinctProjects = async () => {
    await fetch(`${localhost}/find/distinct-projects`)
      .then((response) => response.json())
      .then((data) => setProjectOptions(data))
      .catch((error) => console.error("Error fetching projects:", error));
  };

  const fetchDistinctNames = async () => {
    await fetch(`${localhost}/find/distinct-cdsids`)
      .then((response) => response.json())
      .then((data) => setNameOptions(data))
      .catch((error) => console.error("Error fetching cdsid:", error));
  };

  useEffect(() => {
    fetchDistinctProjects();
    fetchDistinctNames();
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
    } else if (selectedValue === "CDSID") {
      return (
        <Autocomplete
          className="autocomplete"
          options={nameOptions}
          value={categoryValue}
          onChange={(event, newValue) => setCategoryValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
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
    <div>
      <BasicModal
        isTokenPresent={isTokenPresent}
        isOpen={isModelClicked}
        isClosed={isModalClosed}
      />
      <div className="flex_container header">
        <h1 className="heading_header">Tool Tracker</h1>
        <IconButton
          onClick={() => {
            setIsModelClicked(true);
          }}
          sx={{ padding: "6px 22px" }}
          aria-label="delete"
        >
          <Login />
        </IconButton>
        <IconButton
          onClick={() => {
            localStorage.removeItem("toolTrackerAuthToken");
            setLogedIn(false);
          }}
          sx={{ padding: "6px 22px" }}
          aria-label="delete"
        >
          <LockIcon />
        </IconButton>
      </div>
      <div className="filter-container">
        <label className="filter-label">
          Filter By:
          <Select
            className="filter-select"
            value={selectedValue}
            onChange={handleSelectChange}
            sx={{
              minWidth: 220,
              backgroundColor: "white", // Add white background
              borderRadius: "5px", // Optional: Adds rounded corners
            }}
          >
            <MenuItem value="NONE">None</MenuItem>
            <MenuItem value="LOCATION">Location</MenuItem>
            <MenuItem value="ASSET_CATEGORY">Asset Category</MenuItem>
            <MenuItem value="PROJECT">Project</MenuItem>
            <MenuItem value="CDSID">CDSID</MenuItem>
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
