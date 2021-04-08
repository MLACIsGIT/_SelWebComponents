import "./GridReport.scss";
import { Accordion } from "bootstrap";
import { useState } from 'react'
import DataGrid from "../DataGrid/DataGrid"
import * as Gl from "../js/Gl"
import ExcelExport from "../ExcelExport/ExcelExport"

export default function GridReport(props) {
    const LangElements = props.report.languageElements
    const lang = props.lang;

    const [dataLoadingState, setDataLoadingState] = useState("NOT LOADED");
    const [gridData, setGridData] = useState([
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
    ]
    );

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    function showDataIfNotCollapsed(e) {
        if (!e.target.classList.contains("collapsed")) {
            showData();
        }
    }

    function showData() {
        setDataLoadingState("LOADING");
        setTimeout(() => { setDataLoadingState("LOADED") }, 3000)
    }

    return (
        <div className="grid-report">
            <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="grid-report-flush-filter">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-filter" aria-expanded="false" aria-controls="flush-collapse-filter">
                            {lng("flush-filter")}
                        </button>
                    </h2>
                    <div id="flush-collapse-filter" className="accordion-collapse collapse" aria-labelledby="grid-report-flush-filter" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="grid-report-flush-data">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-data" aria-expanded="false" aria-controls="flush-collapse-data" onClick={e => showDataIfNotCollapsed(e)}>
                            {lng("flush-data")}
                        </button>
                    </h2>
                    <div id="flush-collapse-data" className="accordion-collapse collapse" aria-labelledby="grid-report-flush-data" data-bs-parent="#accordionFlushExample">
                        {
                            dataLoadingState === "NOT LOADED" &&
                            <div className="accordion-body">
                            </div>
                        }

                        {
                            dataLoadingState === "LOADING" &&
                            <div className="accordion-body loading-spinner">
                                <div class="spinner-border text-secondary"
                                    role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        }

                        {
                            dataLoadingState === "LOADED" &&
                            <div className="accordion-body">
                                <div className="accordion-body-header">
                                    <ExcelExport />
                                </div>

                                <DataGrid
                                    id={`${props.id}-dataGrid`}
                                    columns={
                                        [
                                            { field: "make", sortable: true, filter: true },
                                            { field: "model", sortable: true, filter: true },
                                            { field: "price", sortable: true, filter: true }
                                        ]
                                    }
                                    data={gridData}
                                />
                            </div>
                        }
                    </div>
                </div>
                <div className="d-none accordion-item">
                    <h2 className="accordion-header" id="grid-report-flush-select-columns">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-selectColumns" aria-expanded="false" aria-controls="flush-collapse-selectColumns">
                            {"###flush-select-columns"}
                        </button>
                    </h2>
                    <div id="flush-collapse-selectColumns" className="accordion-collapse collapse" aria-labelledby="grid-report-flush-select-columns" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}