import { PieChart } from "@mui/x-charts";

const PieComponent = ({ data, palette, pieWidth, height, chartLocaleText }) => {
  return (
    <PieChart
      localeText={chartLocaleText}
      series={[
        {
          data: data,
        },
      ]}
      colors={palette}
      width={pieWidth}
      height={height}
    />
  );
};
export default PieComponent;
