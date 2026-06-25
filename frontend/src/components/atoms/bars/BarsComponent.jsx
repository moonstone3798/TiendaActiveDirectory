import { BarChart } from "@mui/x-charts";

const BarsComponent = ({
  text,
  labels,
  seriesLabel,
  data,
  wideMargin,
  bottomBarWidth,
  height,
  color,
}) => {
  return (
    <BarChart
      localeText={text}
      layout="horizontal"
      yAxis={[
        {
          scaleType: "band",
          data: labels,
        },
      ]}
      series={[
        {
          label: seriesLabel,
          data: data,
          color: color,
        },
      ]}
      margin={wideMargin}
      width={bottomBarWidth}
      height={height}
    />
  );
};
export default BarsComponent;
