import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardComponent from "../card/CardComponent";
import { fetchProducts } from "../../../store/productSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
const ProductGrid = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch]);
  return (
    <Box
      sx={{ width: "100%", mt: 4, display: "flex", justifyContent: "center" }}
    >
      {loading ? (
        <div>Cargando...</div>
      ) : products.length > 0 ? (
        <Grid
          container
          sx={{ width: "95vw" }}
          rowSpacing={3}
          columnSpacing={{ xs: 2, sm: 3, md: 4 }}
        >
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <CardComponent alt={product.alt} product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>No hay productos disponibles.</div>
      )}
    </Box>
  );
};

export default ProductGrid;
