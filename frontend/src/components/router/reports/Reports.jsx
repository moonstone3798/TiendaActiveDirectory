import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ExpensiveProduct from "@/components/molecules/expensiveProduct/ExpensiveProduct";
import ProductsWithLessEgress from "@/components/molecules/productsWithLessEgress/ProductsWithLessEgress";
import ProductsWithMoreEgress from "@/components/molecules/productWithMoreEgress/ProductWithMoreEgress";

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const getLabels = (products) => products.map((product) => product.title);

  const chartLocaleText = { noData: "No hay datos" };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        pb: 4,
        pt: 4,
      }}
    >
      <ProductsWithMoreEgress
        isMobile={isMobile}
        isTablet={isTablet}
        chartLocaleText={chartLocaleText}
      />
      <ProductsWithLessEgress
        isMobile={isMobile}
        isTablet={isTablet}
        chartLocaleText={chartLocaleText}
        getLabels={getLabels}
      />
      <ExpensiveProduct
        isMobile={isMobile}
        isTablet={isTablet}
        chartLocaleText={chartLocaleText}
        getLabels={getLabels}
      />
    </Box>
  );
};

export default Reports;
