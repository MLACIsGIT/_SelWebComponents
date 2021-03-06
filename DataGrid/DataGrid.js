import React, { useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import FieldFormatters from "./FieldFormatters";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

export default function DataGrid(props) {
  function dateFormatter(params) {
    return FieldFormatters.dateFormatter(params.value, props.lang);
  }

  const columnTypes = {
    date: {
      valueFormatter: dateFormatter,
    },
  };

  return (
    <div
      id={props.id}
      className="ag-theme-alpine"
      style={{ height: "70vh", width: "100%" }}
    >
      <AgGridReact rowData={props.data} columnTypes={columnTypes}>
        {props.columns.map((col) => {
          return (
            <AgGridColumn
              key={col.field}
              field={col.field}
              sortable={true}
              filter={true}
              type={col.type}
            ></AgGridColumn>
          );
        })}
      </AgGridReact>
    </div>
  );
}
