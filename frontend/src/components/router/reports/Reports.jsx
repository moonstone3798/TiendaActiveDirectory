import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsWithLessEgress,
  fetchProductsWithLessEgressAndMoreExpensive,
  fetchProductsWithMoreEgress,
} from "../../../store/movementSlice";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
const Reports = () => {
  const dispatch = useDispatch();
  const productsWithMoreEgress = useSelector(
    (state) => state.movement?.productsWithMoreEgress || [],
  );
  const productsWithLessEgress = useSelector(
    (state) => state.movement?.productsWithLessEgress || [],
  );
  const productsWithLessEgressAndMoreExpensive = useSelector(
    (state) => state.movement?.productsWithLessEgressAndMoreExpensive || [],
  );

  useEffect(() => {
    if (
      !productsWithMoreEgress.length ||
      !productsWithLessEgress.length ||
      !productsWithLessEgressAndMoreExpensive.length
    ) {
      dispatch(fetchProductsWithMoreEgress());
      dispatch(fetchProductsWithLessEgress());
      dispatch(fetchProductsWithLessEgressAndMoreExpensive());
    }
  }, [
    dispatch,
    productsWithMoreEgress.length,
    productsWithLessEgress.length,
    productsWithLessEgressAndMoreExpensive.length,
  ]);
  const palette = ["lightcoral", "slateblue"];
  return (
    <Box>
      <h2>Productos con más egresos</h2>
      <PieChart
        series={[
          {
            data: productsWithMoreEgress.map((product) => ({
              id: product.name,
              value: product.total_egress,
              label: product.title,
            })),
          },
        ]}
        colors={palette}
        width={400}
        height={200}
      />
      <h2>Productos con menos egresos</h2>
    </Box>
  );
};

export default Reports;
