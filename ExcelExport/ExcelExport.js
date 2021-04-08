import ExcelExportIcon from "./ExcelExport-icon.svg";
import "./ExcelExport.scss";

export default function ExcelExport(props) {
    function exportToExcel() {
        alert("Export to Excel");
    }
    return (
        <div className="btn-excel-export" onClick={exportToExcel}>
            <img className="ExcelExport-icon" src={ExcelExportIcon} alt="ExcelExport-icon.svg" />
        </div>
    )
}