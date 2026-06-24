import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ButtonComponent from "../../atoms/button/ButtonComponent";
import DialogWrapper from "../../atoms/dialog/DialogWrapper";
import Datalist from "../../atoms/datalist/Datalist";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/productSlice";
import SelectComponent from "../../atoms/select/SelectComponent";
import InputNumber from "../../atoms/input/InputNumber";
const MovementDialog = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    product: null,
    quantity: 0,
    type: 1,
  });
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleQuantityChange = (nextValue) => {
    setForm((prev) => ({
      ...prev,
      quantity: nextValue ?? 0,
    }));
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };
  const handleClose = () => {
    setForm({
      product: null,
      quantity: 0,
      type: 1,
    });
    onClose();
  };
  return (
    <DialogWrapper
      open={open}
      onClose={handleClose}
      title="Agregar movimiento"
      dialogProps={{ fullWidth: true, maxWidth: "sm" }}
      titleProps={{ sx: { color: "#4E342E", fontWeight: 700 } }}
      contentProps={{ sx: { pt: 2 } }}
      actions={
        <>
          <ButtonComponent
            text="Cancelar"
            onClick={handleClose}
            color="#78909C"
          />
          <ButtonComponent
            text="Guardar"
            onClick={() => onSave(form, handleClose)}
            color="#FF8FAB"
          />
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Datalist
          data={products}
          label="Producto"
          id="product-datalist"
          value={form.product}
          setValue={(value) => setForm((prev) => ({ ...prev, product: value }))}
        />
        <InputNumber
          id="product-quantity"
          label="Cantidad"
          min={1}
          step={1}
          onValueChange={handleQuantityChange}
          value={form.quantity}
          size="medium"
          error={form.quantity < 1}
          helperText={form.quantity < 1 ? "Cantidad debe ser mayor a 0" : ""}
          required
        />
        <SelectComponent
          options={[
            { value: 1, label: "Ingreso" },
            { value: 0, label: "Egreso" },
          ]}
          value={form.type}
          onChange={handleChange("type")}
          label="Tipo de movimiento"
          required
        />
      </Box>
    </DialogWrapper>
  );
};

export default MovementDialog;
