import React, { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export default function DataGrid(props) {
    return (
        <div id={props.id} className="ag-theme-alpine" style={{ height: "70vh", width: "100%" }}>
            <AgGridReact
                rowData={props.data}>
                {
                    props.columns.map(col => {
                        return (
                            <AgGridColumn key={col.field} field={col.field} sortable={true} filter={true}></AgGridColumn>
                        )
                    })
                }
            </AgGridReact>
        </div>
    );
}
