import "./LoggedUser.scss";
import * as Gl from "../../_SelWebComponents/js/Gl"
import langJSON from "./LoggedUser-lang"

export default function LoggedUser(props) {
    const LangElements = langJSON();
    const lang = props.lang;

    function onLogout() {
        props.onLogout();
    }

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <div id="LoggedUser" className="btn btn-success" onClick={onLogout}>
            <div id="LoggedUser-user-icon"></div>
            {lng("div-LoggedUser")}
            <span>{props.loginData?.user?.email}</span>
        </div>
    )
}
