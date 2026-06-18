import Button from "@mui/material/Button";
const ButtonComponent = ({
  type,
  onClick,
  color,
  text,
  variant = "text",
  disabled = false,
  loading = false,
}) => {
  return (
    <Button
      type={type}
      sx={{ color: color }}
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      loading={loading}
    >
      {text}
    </Button>
  );
};
export default ButtonComponent;
