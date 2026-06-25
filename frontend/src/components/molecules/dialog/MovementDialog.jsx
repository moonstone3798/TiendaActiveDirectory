import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";
import DialogWrapper from "@/components/atoms/dialog/DialogWrapper";
import Datalist from "@/components/atoms/datalist/Datalist";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import SelectComponent from "@/components/atoms/select/SelectComponent";
import InputNumber from "@/components/atoms/input/InputNumber";
const buildFormFromMovement = (movement) => ({
  product: movement
    ? {
        id: movement.product_id,
        title: movement.product,
      }
    : null,
  quantity: movement ? movement.quantity : 0,
  type: movement ? (movement.type ? 1 : 0) : 1,
  id: movement ? movement.id : null,
});
const MovementDialog = ({ open, onClose, onSave, movement }) => {
  const [form, setForm] = useState(buildFormFromMovement(movement));
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
    setForm(buildFormFromMovement(movement));
    onClose();
  };
  return (
    <DialogWrapper
      open={open}
      onClose={handleClose}
      title={movement ? "Editar movimiento" : "Agregar movimiento"}
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
