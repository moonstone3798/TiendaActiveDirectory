import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";
import DialogWrapper from "@/components/atoms/dialog/DialogWrapper";
import DropzoneComponent from "@/components/atoms/dropzone/DropzoneComponent";
import Input from "@/components/atoms/input/Input";
import { addProduct, updateProduct } from "@/store/productSlice";
import { uploadProductImage } from "@/services/productService";
import { API_URL } from "@/config/api";
import { setError } from "@/store/errorSlice";

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
  const [imageRemoved, setImageRemoved] = useState(!product?.img);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    price: "",
    image: "",
  });

  const handleChange = (field) => (event) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageChange = useCallback((file) => {
    setSelectedImage(file || null);
    if (file) {
      setImageRemoved(false);
      setFieldErrors((prev) => ({ ...prev, image: "" }));
    }
  }, []);

  const handleInitialImageRemove = useCallback(() => {
    setImageRemoved(true);
    setFieldErrors((prev) => ({ ...prev, image: "" }));
  }, []);

  const validateForm = () => {
    const nextErrors = {
      title: form.title.trim() ? "" : "El nombre es obligatorio",
      price:
        form.price === "" || form.price === null || Number(form.price) <= 0
          ? "El precio es obligatorio"
          : "",
      image:
        !selectedImage && (imageRemoved || !product?.img)
          ? "La imagen es obligatoria"
          : "",
    };

    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    let savedSuccessfully = false;

    try {
      if (product) {
        await dispatch(
          updateProduct({ productId: product.id, productData: form }),
        );

        if (selectedImage) {
          const uploadResult = await uploadProductImage(selectedImage);
          const uploadedFilename = uploadResult?.data?.filename;

          if (uploadedFilename) {
            await dispatch(
              updateProduct({
                productId: product.id,
                productData: { ...form, img: uploadedFilename },
              }),
            );
          }
        }
      } else {
        const uploadResult = await uploadProductImage(selectedImage);
        const uploadedFilename = uploadResult?.data?.filename;

        if (!uploadedFilename) {
          throw new Error("No se pudo subir la imagen del producto");
        }

        const createdAction = await dispatch(
          addProduct({ ...form, img: uploadedFilename }),
        );

        if (!createdAction?.payload?.data?.id) {
          throw new Error("No se pudo crear el producto");
        }
      }

      savedSuccessfully = true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto";
      dispatch(setError({ message: errorMessage, type: "error" }));
    } finally {
      setLoading(false);
    }

    if (savedSuccessfully) {
      onClose();
      setForm(getInitialForm(null));
      setSelectedImage(null);
      setFieldErrors({ title: "", price: "", image: "" });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Input
          id="product-title"
          label="Nombre"
          required
          value={form.title}
          onChange={handleChange("title")}
          error={Boolean(fieldErrors.title)}
          helperText={fieldErrors.title}
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
          required
          value={form.price}
          onChange={handleChange("price")}
          error={Boolean(fieldErrors.price)}
          helperText={fieldErrors.price}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box
            component="label"
            sx={{ fontSize: 14, fontWeight: 600, color: "#4E342E" }}
          >
            Imagen
            {!product && (
              <Box component="span" sx={{ color: "#d32f2f", ml: 0.5 }}>
                *
              </Box>
            )}
          </Box>
        </Box>
        <DropzoneComponent
          className="product-dropzone"
          acceptedFiles="image/*"
          maxFiles={1}
          onFileChange={handleImageChange}
          onInitialImageRemove={handleInitialImageRemove}
          message="Arrastra y suelta una imagen aqui o haz clic para seleccionar"
          initialImageUrl={
            product ? `${API_URL}/assets/img/${product.img}` : ""
          }
        />
        {fieldErrors.image && (
          <Box sx={{ color: "#d32f2f", fontSize: 12, mt: -1 }}>
            {fieldErrors.image}
          </Box>
        )}
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
