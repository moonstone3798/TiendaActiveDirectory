import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ButtonComponent from "../../atoms/button/ButtonComponent";
import DialogWrapper from "../../atoms/dialog/DialogWrapper";
import { API_URL } from "../../../config/api";
const ProductDetailDialog = ({ open, onClose, alt, product }) => {
  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      title="Detalle del producto"
      dialogProps={{ fullWidth: true, maxWidth: "sm" }}
      titleProps={{ sx: { color: "#4E342E", fontWeight: 700 } }}
      contentProps={{ sx: { pt: 1 } }}
      actions={
        <ButtonComponent text="Cerrar" onClick={onClose} color="#ab846e" />
      }
    >
      <Box sx={{ display: "grid", gap: 2 }}>
        <CardMedia
          component="img"
          image={product?.img ? `${API_URL}/assets/img/${product.img}` : ""}
          alt={alt}
          sx={{ borderRadius: "0.5rem", maxHeight: 280, objectFit: "contain" }}
        />

        <Typography variant="h6" sx={{ color: "#D81B60", fontWeight: 600 }}>
          {product?.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#616161" }}>
          {product?.description}
        </Typography>
        <Typography variant="body2" sx={{ color: "#616161" }}>
          Hay {product?.stock} en stock
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#4E342E", fontWeight: 700 }}
        >
          ${product?.price}
        </Typography>
      </Box>
    </DialogWrapper>
  );
};

export default ProductDetailDialog;
