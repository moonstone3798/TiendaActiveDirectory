import { useState } from "react";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";
import MovementDialog from "@/components/molecules/dialog/MovementDialog";
import MovementTable from "@/components/molecules/table/MovementTable";
import { addMovement, updateMovement } from "@/store/movementSlice";
import { fetchProducts } from "@/store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import MovementExportCsvButton from "@/components/molecules/movement/MovementExportCsvButton";

const Movements = () => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role);
  const movements = useSelector((state) => state.movement.movements);

  const handleOpenDialog = () => {
    setSelectedMovement(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (movement) => {
    setSelectedMovement(movement || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMovement(null);
  };

  const handleSave = async (form, closeModal) => {
    const productId =
      form?.product?.id ?? form?.product_id ?? selectedMovement?.product_id;

    if (!productId || Number(form.quantity) < 1) {
      return;
    }

    const payload = {
      product_id: Number(productId),
      quantity: Number(form.quantity),
      type: Number(form.type) === 1,
    };

    const result = selectedMovement?.id
      ? await dispatch(
          updateMovement({
            movementId: selectedMovement.id,
            movementData: payload,
          }),
        )
      : await dispatch(addMovement(payload));

    if (result.meta.requestStatus === "fulfilled" && result.payload?.data) {
      await dispatch(fetchProducts());
      closeModal();
    }
  };

  return (
    <>
      {(userRole === "Admin" || userRole === "Operador") && (
        <div className="flex justify-end gap-2 pt-4 pe-6">
          <MovementExportCsvButton movements={movements} />
          <ButtonComponent
            text="Agregar movimiento"
            color="#FF8FAB"
            onClick={handleOpenDialog}
          />
        </div>
      )}
      <MovementTable handleOpenEdit={handleOpenEdit} />
      <MovementDialog
        key={`${selectedMovement?.id || "new"}-${openDialog ? "open" : "closed"}`}
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        movement={selectedMovement}
      />
    </>
  );
};
export default Movements;
