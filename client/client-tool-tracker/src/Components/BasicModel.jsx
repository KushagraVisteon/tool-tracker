import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import PrimaryButton from "./PrimaryButton";
import { localhost } from "../Production";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function BasicModal({ isOpen, isClosed, isTokenPresent }) {
  const [open, setOpen] = useState(false);
  const [cdsid, setCdsid] = useState("");
  const [password, setPassword] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    isClosed();
  };


  const sendLoginReq = async () => {
    if (!cdsid || !password) {
      alert("cdsid and password are required");
      return;
    }

    // if (!isValidcdsid(cdsid)) {
    //   alert("Please enter a valid cdsid address");
    //   return;
    // }

    try {
      const response = await fetch(`${localhost}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cdsid, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the token is returned in data.token
        localStorage.setItem("toolTrackerAuthToken", data.token);
        alert("Login successful");
        isTokenPresent();
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
    handleClose();
  };

  if (isOpen && !open) handleOpen();

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            sx={{ marginBottom: "15px" }}
            id="outlined-email"
            label="CDSID"
            variant="outlined"
            value={cdsid}
            onChange={(e) => setCdsid(e.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Box mt={2}>
            <PrimaryButton onClick={sendLoginReq}>Login</PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
