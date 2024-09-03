import { useState, useEffect } from "react";
import AddAssets from "./AddAssets";
import BasicTable from "./BasicTable";
import PrimaryButton from "./PrimaryButton";

function Assets({ loading, data, download, logedIn, isLogedOut, isFirstFetch }) {
  const [isClicked, setIsClicked] = useState(false);


  const token = localStorage.getItem("toolTrackerAuthToken");
  const isTokenPresent = token !== undefined && token !== null;

  const isCancled = () => {
    // setIsFirstFetch(false);
    setIsClicked(false);
  };
  useEffect(() => {
    console.log("isLoading: " + loading);
  }, [loading]);
  console.log(data.length);
  console.log("isfirstfetch", isFirstFetch);
  return (
    <div className="assets">
      {data && data.length > 0 ? <BasicTable data={data} /> : null}

      {loading && <div className="loading-overlay"></div>}
      {!isFirstFetch && data && data.length === 0 && !loading && (
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

      <div className="assets-buttons">
        {isTokenPresent !== undefined &&
          isTokenPresent != null &&
          isTokenPresent != "" &&
          logedIn && (
            <PrimaryButton
              onClick={() => setIsClicked((prev) => !prev)}
              variant="contained"
            >
              Add
            </PrimaryButton>
          )}
      </div>

      {isClicked && logedIn ? (
        <AddAssets isCancled={isCancled} isLogedOut={isLogedOut} />
      ) : null}
    </div>
  );
}

export default Assets;
