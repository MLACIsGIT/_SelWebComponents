import "./GridReport.scss";
import { Accordion } from "bootstrap";
import { useState } from "react";
import DataGrid from "../DataGrid/DataGrid";
import * as Gl from "../js/Gl";
import ExcelExport from "../ExcelExport/ExcelExport";

export default function GridReport(props) {
  const LangElements = props.report.languageElements;
  const lang = props.lang;

  let columns = props.report.columns;

  const [dataLoadingState, setDataLoadingState] = useState("NOT LOADED");
  const [gridData, setGridData] = useState([]);

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
  }

  function getSQL() {
    let filterFields = Array.from(
      document.querySelectorAll(".reportFilter")
    ).filter((e) => {
      return e.dataset.sql;
    });

    let sqlFilters = filterFields
      .filter((e) => e.value)
      .map((e) => {
        switch (e.type) {
          case "date":
            let dateValue = new Date(e.value);
            let sqlDate = `CONVERT(DATETIME, '${dateValue.getFullYear()}-${
              dateValue.getMonth() + 1
            }-${dateValue.getDate()}', 102)`;
            let sqlDate2359 = `CONVERT(DATETIME, '${dateValue.getFullYear()}-${
              dateValue.getMonth() + 1
            }-${dateValue.getDate()} 23:59:59', 102)`;

            let result = e.dataset.sql.replace(/\?\(2359\)/g, sqlDate2359);
            result = result.replace(/\?/g, sqlDate);

            return result;

          default:
            return `(${e.dataset.sql.replace(/\?/g, e.value)})`;
        }
      });

      debugger
    return sqlFilters.join(" AND ");
  }

  function showDataIfNotCollapsed(e) {
    if (!e.target.classList.contains("collapsed")) {
      console.log("getSQL", getSQL());

      showData();
    }
  }

  function showData() {
    debugger
    setDataLoadingState("LOADING");
    props.db
      .getData(props.loginData.token.token, {
        lang: props.lang,
        reportId: "ReportUpsTrackTrace",
        where: getSQL(),
        pageNo: 0,
        rowsPerPage: 50,
      })
      .then((result) => {
          debugger
        if (result.result !== "ok") {
          setDataLoadingState("NOT LOADED");
        } else {
          //columns = result.columns;
          setGridData(result.data);
          setDataLoadingState("LOADED");
        }
      });
  }

  return (
    <div className="grid-report">
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="grid-report-flush-filter">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse-filter"
              aria-expanded="false"
              aria-controls="flush-collapse-filter"
            >
              {lng("flush-filter")}
            </button>
          </h2>
          <div
            id="flush-collapse-filter"
            className="accordion-collapse collapse"
            aria-labelledby="grid-report-flush-filter"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">{props.Filters}</div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="grid-report-flush-data">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse-data"
              aria-expanded="false"
              aria-controls="flush-collapse-data"
              onClick={(e) => showDataIfNotCollapsed(e)}
            >
              {lng("flush-data")}
            </button>
          </h2>
          <div
            id="flush-collapse-data"
            className="accordion-collapse collapse"
            aria-labelledby="grid-report-flush-data"
            data-bs-parent="#accordionFlushExample"
          >
            {dataLoadingState === "NOT LOADED" && (
              <div className="accordion-body"></div>
            )}

            {dataLoadingState === "LOADING" && (
              <div className="accordion-body loading-spinner">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {dataLoadingState === "LOADED" && (
              <div className="accordion-body">
                <div className="accordion-body-header">
                  <ExcelExport data={gridData} />
                </div>

                <DataGrid
                  id={`${props.id}-dataGrid`}
                  columns={ columns }
                  lang={ props.lang }
                  data={ gridData }
                />
              </div>
            )}
          </div>
        </div>
        <div className="accordion-item d-none">
          <h2
            className="accordion-header"
            id="grid-report-flush-select-columns"
          >
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse-selectColumns"
              aria-expanded="false"
              aria-controls="flush-collapse-selectColumns"
            >
              {"###flush-select-columns"}
            </button>
          </h2>
          <div
            id="flush-collapse-selectColumns"
            className="accordion-collapse collapse"
            aria-labelledby="grid-report-flush-select-columns"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Placeholder content for this accordion, which is intended to
              demonstrate the <code>.accordion-flush</code> class. This is the
              third item's accordion body. Nothing more exciting happening here
              in terms of content, but just filling up the space to make it
              look, at least at first glance, a bit more representative of how
              this would look in a real-world application.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
