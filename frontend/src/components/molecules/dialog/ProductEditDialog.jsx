import { useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import ButtonComponent from "../../atoms/button/ButtonComponent";
import DialogWrapper from "../../atoms/dialog/DialogWrapper";
import Input from "../../atoms/input/Input";
import { addProduct, updateProduct } from "../../../store/productSlice";
import { uploadProductImage } from "../../../services/productService";

const getInitialForm = (product) => ({
  title: product?.title || "",
  description: product?.description || "",
  price: product?.price || 0,
  stock: product?.stock || 0,
  img: product?.img || "",
});

const ProductEditForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => getInitialForm(product));
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    let savedProductId = product?.id;

    if (product) {
      await dispatch(
        updateProduct({ productId: product.id, productData: form }),
      );
    } else {
      const createdAction = await dispatch(addProduct(form));
      savedProductId = createdAction?.payload?.data?.id;
    }

    if (selectedImage && savedProductId) {
      const uploadResult = await uploadProductImage(selectedImage);
      const uploadedFilename = uploadResult?.data?.filename;

      if (uploadedFilename) {
        await dispatch(
          updateProduct({
            productId: savedProductId,
            productData: { ...form, img: uploadedFilename },
          }),
        );
      }
    }

    setLoading(false);
    onClose();
    setForm(getInitialForm(null));
    setSelectedImage(null);
  };

  const handleImageSelected = (event) => {
    const file = event.target.files?.[0];
    setSelectedImage(file || null);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Input
          id="product-title"
          label="Nombre"
          value={form.title}
          onChange={handleChange("title")}
        />
        <Input
          id="product-description"
          label="Descripción"
          value={form.description}
          onChange={handleChange("description")}
        />
        <Input
          id="product-price"
          label="Precio"
          type="number"
          value={form.price}
          onChange={handleChange("price")}
        />
        <label htmlFor="product-image">Imagen</label>
        <input type="file" accept="image/*" onChange={handleImageSelected} />
      </Box>
      <Box
        sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 3 }}
      >
        <ButtonComponent text="Cancelar" onClick={onClose} color="#78909C" />
        <ButtonComponent
          text="Guardar"
          loading={loading}
          disabled={loading}
          onClick={handleSave}
          color="#FF8FAB"
        />
      </Box>
    </>
  );
};

const ProductEditDialog = ({ open, onClose, product }) => {
  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      title={product ? `Editar producto` : "Agregar producto"}
      dialogProps={{ fullWidth: true, maxWidth: "sm" }}
      titleProps={{ sx: { color: "#4E342E", fontWeight: 700 } }}
      contentProps={{ sx: { pt: 2 } }}
      actions={null}
    >
      <ProductEditForm
        key={`${open}-${product?.id ?? "new"}`}
        product={product}
        onClose={onClose}
      />
    </DialogWrapper>
  );
};

export default ProductEditDialog;
