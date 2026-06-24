import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DialogWrapper = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  dialogProps = {},
  titleProps = {},
  contentProps = {},
  descriptionProps = {},
  keepMounted = true,
  role = "dialog",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      keepMounted={keepMounted}
      role={role}
      {...dialogProps}
    >
      {title ? <DialogTitle {...titleProps}>{title}</DialogTitle> : null}

      <DialogContent {...contentProps}>
        {children ? (
          children
        ) : description ? (
          <DialogContentText {...descriptionProps}>
            {description}
          </DialogContentText>
        ) : null}
      </DialogContent>

      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};

export default DialogWrapper;
