import Table from "../../atoms/table/Table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchMovements, removeMovement } from "../../../store/movementSlice";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString("es-AR");
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
    editable: true,
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
const MovementTable = () => {
  const dispatch = useDispatch();
  const movements = useSelector((state) => state.movement.movements);
  const loading = useSelector((state) => state.movement.loading);
  const userRole = useSelector((state) => state.auth.user?.role);

  const handleDelete = (movementId) => {
    if (!movementId) {
      return;
    }
    dispatch(removeMovement(movementId));
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
        <IconButton
          aria-label="Eliminar movimiento"
          onClick={() => handleDelete(params.row.id)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
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
