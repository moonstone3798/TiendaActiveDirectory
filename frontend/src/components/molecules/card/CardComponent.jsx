import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DialogComponent from "../dialog/DialogComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import ProductDetailDialog from "../dialog/ProductDetailDialog";
import ProductEditDialog from "../dialog/ProductEditDialog";
import { API_URL } from "../../../config/api";
import { removeProduct } from "../../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
export default function CardComponent({ alt, product }) {
  const dispatch = useDispatch();
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.role);
  const handleOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleSaveProduct = (updatedProduct) => {
    console.log("Producto actualizado:", updatedProduct);
    setOpenEdit(false);
  };

  return (
    <Card sx={{ borderRadius: "0.6rem" }}>
      <CardActionArea onClick={handleOpenDetail}>
        <CardMedia
          component="img"
          height="300"
          image={product?.img ? `${API_URL}/assets/img/${product.img}` : ""}
          alt={alt}
          sx={{
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ color: "#D81B60" }}
          >
            {product.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#616161" }}>
            {product.description}
          </Typography>
          <Typography
            className="text-gray-800"
            variant="h6"
            sx={{ marginLeft: "auto" }}
          >
            ${product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <ProductDetailDialog
        open={openDetail}
        onClose={handleCloseDetail}
        alt={alt}
        product={product}
      />
      <ProductEditDialog
        open={openEdit}
        onClose={handleCloseEdit}
        product={product}
        onSave={handleSaveProduct}
      />
      {userRole === "Admin" && (
        <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
          <DialogComponent
            title={`Eliminar producto ${product.title}`}
            description="¿Estás seguro de que deseas eliminar este producto?"
            icon={<DeleteIcon sx={{ color: "#ab846e" }} />}
            onConfirm={() => dispatch(removeProduct(product.id))}
          />
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="editar producto"
            onClick={handleOpenEdit}
          >
            <EditIcon sx={{ color: "#ab846e" }} />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
}
