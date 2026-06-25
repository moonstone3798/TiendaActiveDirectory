import BarsComponent from "@/components/atoms/bars/BarsComponent";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { fetchProductsWithLessEgressAndMoreExpensive } from "@/store/movementSlice";
import { useDispatch, useSelector } from "react-redux";
const ExpensiveProduct = ({
  isMobile,
  isTablet,
  chartLocaleText,
  getLabels,
}) => {
  const dispatch = useDispatch();
  const productsWithLessEgressAndMoreExpensive = useSelector(
    (state) => state.movement?.productsWithLessEgressAndMoreExpensive || [],
  );
  useEffect(() => {
    dispatch(fetchProductsWithLessEgressAndMoreExpensive());
  }, [dispatch]);
  const getPriorityValues = (products) =>
    products.map((product) => Number(product.priority_score || 0));
  const bottomBarWidth = isMobile ? 260 : isTablet ? 680 : 960;
  const wideMargin = isMobile
    ? { left: 95, right: 12, top: 16, bottom: 16 }
    : isTablet
      ? { left: 135, right: 18, top: 20, bottom: 20 }
      : { left: 180, right: 20, top: 20, bottom: 20 };
  return (
    <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
      <h2>Productos con menos egresos más caros</h2>
      <BarsComponent
        text={chartLocaleText}
        labels={getLabels(productsWithLessEgressAndMoreExpensive)}
        data={getPriorityValues(productsWithLessEgressAndMoreExpensive)}
        seriesLabel="Prioridad"
        wideMargin={wideMargin}
        bottomBarWidth={bottomBarWidth}
        height={280}
        color="#14b8a6"
      />
    </Box>
  );
};

export default ExpensiveProduct;
