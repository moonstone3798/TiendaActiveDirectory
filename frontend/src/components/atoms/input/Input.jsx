import TextField from "@mui/material/TextField";

const Input = ({
  id,
  label,
  type = "text",
  error = false,
  helperText = "",
  fullWidth = true,
  required = false,
  variant = "outlined",
  value = "",
  onChange,
  min,
  max,
  step,
}) => {
  return (
    <TextField
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
      id={id}
      label={label}
      required={required}
      type={type}
      fullWidth={fullWidth}
      error={error}
      helperText={helperText}
      value={value}
      onChange={onChange}
      variant={variant}
      slotProps={{
        htmlInput: {
          min: min ?? undefined,
          max: max ?? undefined,
          step: step ?? undefined,
        },
      }}
    />
  );
};
export default Input;
