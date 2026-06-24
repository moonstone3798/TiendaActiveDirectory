import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../../store/errorSlice";

const SnackbarComponent = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.error.message);
  const type = useSelector((state) => state.error.type);

  const handleClose = () => {
    dispatch(clearError());
  };

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!message}
        onClose={handleClose}
        message={message}
        key={"bottom" + "center"}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: type === "error" ? "#D32F2F" : "#4CAF50",
            color: "#fff",
          },
        }}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default SnackbarComponent;
