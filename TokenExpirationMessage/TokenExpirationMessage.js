import { useState, useRef, useEffect } from 'react';
import * as Gl from "../js/Gl";
import * as LangJSON from "./TokenExpirationMessage-lang";

export default function TokenExpirationMessage(props) {
    const LangElements = LangJSON.langJSON();
    const lang = props.lang;
    
    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const [tokenStatus, setTokenStatus] = useState("NOT VALID");
    const [timerOfExpiresShortly, setTimerOfExpiresShortly] = useState(undefined);
    const [timerOfValidity, setTimerOfValidity] = useState(undefined);

    function removeTimerOfExpiresShorly() {
        if (timerOfExpiresShortly !== undefined) {
            clearTimeout(timerOfExpiresShortly);
            setTimerOfExpiresShortly(undefined);
        }
    }

    function removeTimerOfValidity() {
        if (timerOfValidity !== undefined) {
            clearTimeout(timerOfValidity);
            setTimerOfValidity(undefined);
        }
    }

    function onTimerOfExpiresShortly() {
        removeTimerOfExpiresShorly();
        setTokenStatus("EXPIRES SHORTLY")
    }

    function onTimerOfValidity() {
        removeTimerOfValidity();
        setTokenStatus("NOT VALID")
    }

    function onExtendValidity(e) {
        alert("meghosszabbítom!")
    }

    function setNewTimerOfValidity(validUntil) {
        removeTimerOfExpiresShorly();
        removeTimerOfValidity();

        if (validUntil === undefined) {
            setTokenStatus("NOT VALID");
            return;
        }

        let currentDate = new Date();
        let msUntilExp = validUntil - currentDate;
        msUntilExp = (msUntilExp < 2000) ? 0 : msUntilExp;
        let tokenStatus = (msUntilExp < 120000) ? "EXPIRES SHORTLY" : "VALID"

        setTokenStatus(tokenStatus)
    }

    return (
        <div className="token-expiration-message">

            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>{lng("message-expires-shortly-strong")}</strong>
                {lng("message-expires-shortly")}
                <button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="alert" onClick={e => onExtendValidity(e)}></button>
            </div>
            <div>
                {`Token valid until: ${props.loginData?.token?.validUntil}`}
                {`Token status: ${tokenStatus}`}
            </div>
        </div>
    )
}