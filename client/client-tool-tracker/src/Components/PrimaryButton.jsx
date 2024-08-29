import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const CustomButton = styled(Button)({
  padding: "10px 20px",
  margin: "5px",
  backgroundColor: "#ff4500",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#cc3700",
  },
});

function PrimaryButton({ children, onClick, type }) {
  return (
    <CustomButton
      onClick={() => {
        onClick();
      }}
      variant="contained"
      type={type}
    >
      {children}
    </CustomButton>
  );
}

export default PrimaryButton;
