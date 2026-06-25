import BarsComponent from "@/components/atoms/bars/BarsComponent";
import Box from "@mui/material/Box";
import { fetchProductsWithLessEgress } from "@/store/movementSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
const ProductsWithLessEgress = ({
  isMobile,
  isTablet,
  chartLocaleText,
  getLabels,
}) => {
  const dispatch = useDispatch();
  const productsWithLessEgress = useSelector(
    (state) => state.movement?.productsWithLessEgress || [],
  );
  const topBarWidth = isMobile ? 260 : isTablet ? 340 : 460;

  const compactMargin = isMobile
    ? { left: 95, right: 12, top: 16, bottom: 16 }
    : { left: 150, right: 20, top: 20, bottom: 20 };
  const getEgressValues = (products) =>
    products.map((product) => Number(product.total_egress || 0));
  useEffect(() => {
    dispatch(fetchProductsWithLessEgress());
  }, [dispatch]);

  return (
    <Box>
      <h2>Productos con menos egresos</h2>
      <BarsComponent
        text={chartLocaleText}
        labels={getLabels(productsWithLessEgress)}
        data={getEgressValues(productsWithLessEgress)}
        seriesLabel="Total egresos"
        wideMargin={compactMargin}
        bottomBarWidth={topBarWidth}
        height={260}
        color="#3b82f6"
      />
    </Box>
  );
};
export default ProductsWithLessEgress;
