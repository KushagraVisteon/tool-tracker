import { useState, useEffect } from "react";
import Asset from "./Asset";
import AddAssets from "./AddAssets";
import BasicTable from "./BasicTable";
import { Button, ButtonGroup } from "@mui/material";
import PrimaryButton from "./PrimaryButton";

function Assets({ loading, data, download }) {
  const [isClicked, setIsClicked] = useState(false);
  const isCancled = () => {
    setIsClicked(false);
  };
  useEffect(() => {
    console.log("isLoading: " + loading);
  }, [loading]);
  console.log(data.length);

  return (
    <div className="assets">
      {data && data.length > 0 ? <BasicTable data={data} /> : null}
      <div className="assets-buttons">
        <PrimaryButton
          onClick={() => setIsClicked((prev) => !prev)}
          variant="contained"
        >
          Add
        </PrimaryButton>
        {loading && <div className="loading-overlay"></div>}
        {data && data.length === 0 && !loading && (
          <div>No asset found for this search</div>
        )}

        {data && data.length > 0 && (
          <PrimaryButton
            onClick={() => {
              download();
            }}
            variant="contained"
          >
            Download Data
          </PrimaryButton>
        )}
      </div>
      {isClicked ? <AddAssets isCancled={isCancled} /> : null}
    </div>
  );
}

export default Assets;
