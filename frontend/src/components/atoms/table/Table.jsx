import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";

const Table = ({ rows, columns, loading = false }) => {
  return (
    <Box
      sx={() => ({
        height: "70vh",
        width: "95vw",
        "& .MuiDataGrid-cell--editable": {
          cursor: "text",
        },
        "& .MuiDataGrid-cell:not(.MuiDataGrid-cell--editable)": {
          cursor: "default",
        },
      })}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        isCellEditable={(params) => Boolean(params.colDef.editable)}
        disableRowSelectionOnClick
        localeText={{
          ...esES.components.MuiDataGrid.defaultProps.localeText,
          paginationRowsPerPage: "Filas por pagina:",
        }}
      />
    </Box>
  );
};

export default Table;
