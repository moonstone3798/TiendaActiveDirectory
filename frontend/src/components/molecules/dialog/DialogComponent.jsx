import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";
import DialogWrapper from "@/components/atoms/dialog/DialogWrapper";
import { forwardRef, Fragment, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogComponent = ({ title, description, icon, onConfirm }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };
  return (
    <Fragment>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClickOpen}
      >
        {icon}
      </IconButton>
      <DialogWrapper
        open={open}
        onClose={handleClose}
        title={title}
        description={description}
        role="alertdialog"
        dialogProps={{
          slots: {
            transition: Transition,
          },
          "aria-describedby": "alert-dialog-slide-description",
        }}
        titleProps={{ className: "text-gray-800" }}
        descriptionProps={{
          id: "alert-dialog-slide-description",
          sx: { color: "#616161" },
        }}
        actions={
          <>
            <ButtonComponent
              text="Cancelar"
              onClick={handleClose}
              color="#78909C"
            />
            <ButtonComponent
              text="Confirmar"
              onClick={handleConfirm}
              color="#FF8FAB"
            />
          </>
        }
      />
    </Fragment>
  );
};

export default DialogComponent;
