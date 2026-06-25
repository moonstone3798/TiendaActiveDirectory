import { useMemo } from "react";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const rawValue =
    value && typeof value === "object" && "value" in value
      ? value.value
      : value;

  if (!rawValue) {
    return "-";
  }

  const hasTimezone =
    typeof rawValue === "string" && /([zZ]|[+-]\d{2}:?\d{2})$/.test(rawValue);

  const parsedDate = new Date(
    typeof rawValue === "string" && !hasTimezone ? `${rawValue}Z` : rawValue,
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const escapeCsvValue = (value) => {
  const normalizedValue = value ?? "";
  return `"${String(normalizedValue).replaceAll('"', '""')}"`;
};

const buildCsvContent = (movements) => {
  const headers = [
    "Empleado",
    "Fecha",
    "Producto",
    "Tipo",
    "Cantidad",
    "Stock acumulado",
  ];

  const rows = movements.map((movement) => [
    movement.employee,
    formatDate(movement.date),
    movement.product,
    movement.type ? "Ingreso" : "Egreso",
    movement.quantity,
    movement.stock_total,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\r\n");
};

const buildFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `movimientos-${year}${month}${day}.csv`;
};

const MovementExportCsvButton = ({ movements = [] }) => {
  const fileName = useMemo(() => buildFileName(), []);

  const handleExportCsv = () => {
    if (!movements.length) {
      return;
    }

    const csvContent = buildCsvContent(movements);
    const blob = new Blob(["\ufeff", csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <ButtonComponent
      text="Exportar movimientos"
      color="#FF8FAB"
      onClick={handleExportCsv}
      disabled={!movements.length}
    />
  );
};

export default MovementExportCsvButton;
