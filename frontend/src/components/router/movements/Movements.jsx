import { useState } from "react";
import ButtonComponent from "../../atoms/button/ButtonComponent";
import MovementDialog from "../../molecules/dialog/MovementDialog";
import MovementTable from "../../molecules/table/MovementTable";
import { addMovement } from "../../../store/movementSlice";
import { fetchProducts } from "../../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
const Movements = () => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.role);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleSave = async (form, closeModal) => {
    if (!form?.product?.id || Number(form.quantity) < 1) {
      return;
    }

    const payload = {
      product_id: form.product.id,
      quantity: Number(form.quantity),
      type: Number(form.type) === 1,
    };

    const result = await dispatch(addMovement(payload));
    if (result.meta.requestStatus === "fulfilled" && result.payload?.data) {
      await dispatch(fetchProducts());
      closeModal();
    }
  };
  return (
    <>
      {(userRole === "Admin" || userRole === "Operador") && (
        <div className="flex justify-end gap-2 pt-4 pe-6">
          <ButtonComponent
            text="Agregar movimiento"
            color="#FF8FAB"
            onClick={handleOpenDialog}
          />
        </div>
      )}
      <MovementTable />
      <MovementDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </>
  );
};
export default Movements;
