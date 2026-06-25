import PieComponent from "@/components/atoms/pie/PieComponent";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsWithMoreEgress } from "@/store/movementSlice";

const ProductsWithMoreEgress = ({ isMobile, isTablet, chartLocaleText }) => {
  const pieWidth = isMobile ? 200 : isTablet ? 300 : 330;
  const dispatch = useDispatch();
  const productsWithMoreEgress = useSelector(
    (state) => state.movement?.productsWithMoreEgress || [],
  );
  useEffect(() => {
    if (!productsWithMoreEgress.length) {
      dispatch(fetchProductsWithMoreEgress());
    }
  }, [dispatch, productsWithMoreEgress.length]);
  const palette = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#eab308",
    "#f97316",
    "#14b8a6",
    "#a855f7",
  ];

  return (
    <Box>
      <h2>Productos con más egresos</h2>
      <PieComponent
        data={productsWithMoreEgress.map((product) => ({
          id: product.product_id,
          value: product.total_egress,
          label: product.title,
        }))}
        chartLocaleText={chartLocaleText}
        palette={palette}
        pieWidth={pieWidth}
        height={220}
      />
    </Box>
  );
};
export default ProductsWithMoreEgress;
