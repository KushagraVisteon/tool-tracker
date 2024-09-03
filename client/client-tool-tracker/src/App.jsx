import { useState, useEffect } from "react";
import "./App.css";
import Assets from "./Components/Assets";
import Header from "./Components/Header";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { localhost } from "./Production";
import BasicAppBar from "./Components/BasicAppBar";

function App() {
  const searched = (filterType, filterValue) => {
    console.log(filterType, filterValue);
    setIsFirstFetch(false);
    fetchAssets(filterType, filterValue);
  };

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logedIn, setLogedIn] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  const download = () => {
    exportToExcel();
  };

  const exportToExcel = () => {
    const data = {
      name: assets.name,
      cdsid: assets.cdsid,
      location: assets.location,
      asset_category: assets.asset_category,
      asset_id: assets.asset_id,
      project: assets.project,
      comment: assets.comment,
    };

    const worksheet = XLSX.utils.json_to_sheet(assets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "data.xlsx");
  };

  const fetchAssets = async (filterType, filterValue) => {
    setLoading(true);
    setAssets([]);
    if (filterValue !== "" && filterType !== "NONE") {
      try {
        console.log(
          `${localhost}/assets/find-by-category/${filterType}/${filterValue}`
        );
        const response = await fetch(
          `${localhost}/assets/find-by-category/${filterType}/${filterValue}`
        );
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await fetch(`${localhost}/assets/findall`);
        const data = await response.json();
        console.log(data);
        setAssets(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isTokenPresent = () => {
    setLogedIn(true);
  };

  const checkLocalStorageForDummyKey = () => {
    const value = localStorage.getItem("toolTrackerAuthToken");
    if (value !== null) {
      setLogedIn(true);
    } else {
      setLogedIn(false);
    }
  };

  useEffect(() => {
    checkLocalStorageForDummyKey();
  }, []);

  console.log(assets);
  console.log("isLogedIn", logedIn);

  const isLogedOut = () => {
    setLogedIn(false);
    console.log("press");
  };

  return (
    <div className="app">
      <Header isTokenPresent={isTokenPresent} searched={searched} setLogedIn={setLogedIn} />
      <Assets
        isLogedOut={isLogedOut}
        logedIn={logedIn}
        loading={loading}
        download={download}
        data={assets}
        isFirstFetch={isFirstFetch}
      />
    </div>
  );
}

export default App;
