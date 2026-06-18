import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const PasswordInput = ({ value = "", onChange, error = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      variant="outlined"
      error={error}
      fullWidth={true}
      required={true}
      sx={{
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          borderColor: value ? "#BDBDBD" : "#cbd5e1",
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: value ? "#616161" : "#94a3b8",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#F1B8C4",
          },
        "& .MuiInputLabel-root": {
          color: value ? "#D81B60" : "#64748b",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#D81B60",
        },
        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 100px #FDF1F1 inset",
          WebkitTextFillColor: "#0f172a",
          transition: "background-color 9999s ease-out 0s",
        },
      }}
    >
      <InputLabel htmlFor="password">Contraseña</InputLabel>
      <OutlinedInput
        id="password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        label="Contraseña"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? "ocultar contraseña" : "mostrar contraseña"
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
export default PasswordInput;
