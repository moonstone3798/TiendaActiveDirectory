import Table from "@/components/atoms/table/Table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchMovements, removeMovement } from "@/store/movementSlice";
import EditIcon from "@mui/icons-material/Edit";

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
const columns = [
  {
    flex: 1,
    headerName: "Empleado",
    field: "employee",
    type: "string",
    editable: false,
  },
  {
    flex: 1,
    headerName: "Fecha",
    type: "string",
    field: "date",
    editable: false,
    valueFormatter: (value) => formatDate(value),
  },
  {
    flex: 1,
    headerName: "Producto",
    field: "product",
    editable: false,
    type: "string",
  },
  {
    flex: 1,
    headerName: "Tipo",
    field: "type",
    editable: false,
    type: "string",
    valueFormatter: (value) => (value ? "Ingreso" : "Egreso"),
  },
  {
    flex: 1,
    headerName: "Cantidad",
    field: "quantity",
    editable: false,
    type: "number",
  },
  {
    flex: 1,
    headerName: "Stock acumulado",
    field: "stock_total",
    editable: false,
    type: "number",
  },
];
const MovementTable = ({ handleOpenEdit }) => {
  const dispatch = useDispatch();
  const movements = useSelector((state) => state.movement.movements);
  const loading = useSelector((state) => state.movement.loading);
  const userRole = useSelector((state) => state.auth.user?.role);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleDelete = (movementId) => {
    if (!movementId) {
      return;
    }
    setLoadingDelete(true);
    dispatch(removeMovement(movementId)).finally(() => setLoadingDelete(false));
  };
  const columnsWithActions = [
    ...columns,
    {
      flex: 0.5,
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      editable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <IconButton
            aria-label="Eliminar movimiento"
            onClick={() => handleDelete(params.row.id)}
            size="small"
            disabled={loadingDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Editar movimiento"
            onClick={() => handleOpenEdit(params.row)}
          >
            <EditIcon sx={{ color: "#ab846e" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchMovements());
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-center items-center h-full pt-6">
        <Table
          rows={movements}
          columns={
            userRole === "Admin" || userRole === "Operador"
              ? columnsWithActions
              : columns
          }
          loading={loading}
        />
      </div>
    </>
  );
};

export default MovementTable;
