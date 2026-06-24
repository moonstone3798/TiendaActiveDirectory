import Box from "@mui/material/Box";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const InputNumber = ({
  min,
  max,
  step = 1,
  defaultValue,
  value,
  onChange,
  onValueChange,
  size = "small",
  error = false,
  helperText = "",
  id = "number-input",
  label = "Cantidad",
  disabled = false,
  required = false,
  fullWidth = true,
}) => {
  return (
    <Box sx={{ display: "grid", gap: 4 }}>
      <BaseNumberField.Root
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        required={required}
        onValueChange={onValueChange}
        render={(props, state) => (
          <FormControl
            size={size}
            fullWidth={fullWidth}
            ref={props.ref}
            disabled={state.disabled}
            required={state.required}
            error={error}
            variant="outlined"
          >
            {props.children}
          </FormControl>
        )}
      >
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <BaseNumberField.Input
          id={id}
          render={(props, state) => (
            <OutlinedInput
              aria-describedby={helperText ? `${id}-helper-text` : undefined}
              label={label}
              inputRef={props.ref}
              value={state.inputValue ?? ""}
              onBlur={props.onBlur}
              onChange={(event) => {
                props.onChange(event);
                onChange?.(event);
              }}
              onKeyUp={props.onKeyUp}
              onKeyDown={props.onKeyDown}
              onFocus={props.onFocus}
              inputProps={{
                min: min ?? undefined,
                max: max ?? undefined,
                step: step ?? undefined,
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{
                    flexDirection: "column",
                    maxHeight: "unset",
                    alignSelf: "stretch",
                    borderLeft: "1px solid",
                    borderColor: "divider",
                    ml: 0,
                    "& button": {
                      py: 0,
                      flex: 1,
                      borderRadius: 0.5,
                    },
                  }}
                >
                  <BaseNumberField.Increment
                    render={<IconButton size={size} aria-label="Increase" />}
                  >
                    <KeyboardArrowUpIcon
                      fontSize={size}
                      sx={{ transform: "translateY(2px)" }}
                    />
                  </BaseNumberField.Increment>

                  <BaseNumberField.Decrement
                    render={<IconButton size={size} aria-label="Decrease" />}
                  >
                    <KeyboardArrowDownIcon
                      fontSize={size}
                      sx={{ transform: "translateY(-2px)" }}
                    />
                  </BaseNumberField.Decrement>
                </InputAdornment>
              }
              sx={{ pr: 0 }}
            />
          )}
        />
        <FormHelperText
          id={`${id}-helper-text`}
          sx={{ ml: 0, "&:empty": { mt: 0 } }}
        >
          {helperText}
        </FormHelperText>
      </BaseNumberField.Root>
    </Box>
  );
};
export default InputNumber;
