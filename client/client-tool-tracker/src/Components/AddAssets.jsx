import { useState } from "react";
import { localhost } from "../Production";
import { Button } from "@mui/material";
import PrimaryButton from "./PrimaryButton";

function AddAssets({ isCancled, isLogedOut, logedIn }) {
  const [name, setName] = useState("");
  const [cdsid, setCdsid] = useState("");
  const [location, setLocation] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [assetId, setAssetId] = useState("");
  const [project, setProject] = useState("");
  const [assetType, setAssetType] = useState("");
  const [comment, setComment] = useState("");
  const [cdsidWarning, setCdsidWarning] = useState(""); // State for warning message
  const token = localStorage.getItem("toolTrackerAuthToken");
  const isTokenPresent = token !== undefined && token !== null;
  const clearFeild = () => {
    setName("");
    setCdsid("");
    setLocation("");
    setAssetCategory("");
    setAssetId("");
    setProject("");
    setAssetType("");
    setComment("");
    setCdsidWarning(""); // Clear warning messages
  };

  const onAddAsset = async () => {
    // Retrieve token from local storage

    // Prepare the asset data
    const asset = {
      name,
      cdsid,
      location,
      assetCategory,
      assetId,
      project,
      assetType,
      comment,
    };

    try {
      // Check if token exists
      if (token) {
        // Send request with token in headers
        const response = await fetch(`${localhost}/assets/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          body: JSON.stringify({ asset }),
        });

        if (!response.ok) {
          console.log("Network response was not ok");
        }

        const result = await response.json();
        console.log(result);
        if (result.message === "Invalid credentials") {
          alert("User Forbidden");
          isLogedOut();
          localStorage.removeItem("toolTrackerAuthToken");
        }
        if (result.message === "Token expired or invalid") {
          alert("Sign In needed");
          isLogedOut();
          localStorage.removeItem("toolTrackerAuthToken");
        }

        // Handle the result as needed
      } else {
        alert("Session Expired Login Again");
        console.log("Token is expired or not present");
        localStorage.removeItem("toolTrackerAuthToken");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (cdsidWarning) {
      // If there's a warning, do not proceed with the form submission
      alert(cdsidWarning);
      return;
    }
    console.log("add");
    onAddAsset({
      name,
      cdsid,
      location,
      assetCategory,
      assetId,
      project,
      assetType,
      comment,
    });

    clearFeild();
  };

  const handleCdsidChange = (e) => {
    const value = e.target.value;
    setCdsid(value);

    // Check if value contains spaces
    if (/\s/.test(value)) {
      setCdsidWarning("CDSID should not contain spaces.");
    } else {
      setCdsidWarning(""); // Clear warning if no spaces
    }
  };

  return (
    <div className="assets-form-container">
      <form className="assets-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            CDSID:
            <input
              type="text"
              value={cdsid}
              required
              onChange={handleCdsidChange}
            />
          </label>
          {cdsidWarning && (
            <p style={{ color: "red" }}>{cdsidWarning}</p> // Display warning message
          )}
        </div>

        <div className="form-group">
          <label>
            Location:
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select</option>
              <option value="BANGALORE">Bangalore</option>
              <option value="CHENNAI">Chennai</option>
              <option value="GOA">Goa</option>
              <option value="PUNE">Pune</option>
              <option value="COIMBATORE">Coimbatore</option>
              <option value="TRIVANDRUM">Trivandrum</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Asset Category:
            <select
              value={assetCategory}
              onChange={(e) => setAssetCategory(e.target.value)}
            >
              <option value="">Other</option>
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
          </label>
        </div>

        <div className="form-group">
          <label>
            Asset Type:
            <input
              type="text"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Asset ID:
            <input
              type="text"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Project:
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Comment:
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        </div>

        <div className="form-buttons">
          <PrimaryButton type="submit">Add Asset</PrimaryButton>
          <PrimaryButton onClick={isCancled}>Cancel</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

export default AddAssets;
