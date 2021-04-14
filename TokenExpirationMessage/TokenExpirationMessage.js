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

    function onLogout() {
        props.onLogout()
    }

    function onExtendValidity(e) {
        alert("meghosszabbítom!")
    }

    useEffect(() => {
        let timerOfExpiresShortly;
        let timerOfValidity;

        let validUntil = props?.loginData?.token?.validUntil;

        if (validUntil === undefined || validUntil < 2000) {
            setTokenStatus("NOT VALID");
        } else {
            let setTimerShortly = false;

            if (validUntil < 120000) {
                setTokenStatus("EXPIRES SHORTLY");
            } else {
                setTokenStatus("VALID");
                setTimerShortly = true
            }

            timerOfValidity = setTimeout(() => {
                onLogout();
            }, validUntil - 5000)

            if (setTimerShortly) {
                timerOfExpiresShortly = setTimeout(() => {
                    setTokenStatus("EXPIRES SHORTLY");
                }, validUntil - 120000)
            }
        }

        return () => {
            if (timerOfExpiresShortly !== undefined) {
                clearTimeout(timerOfExpiresShortly);
            };

            if (timerOfValidity !== undefined) {
                clearTimeout(timerOfValidity);
            };
        }
    }, [props.loginData])

    let message;

    if (tokenStatus === "EXPIRES SHORTLY") {
        message = <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>{lng("message-expires-shortly-strong")}</strong>
            {lng("message-expires-shortly")}
            <button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="alert" onClick={e => onExtendValidity(e)}></button>
        </div>
    }

    return (
        <div className="token-expiration-message">
            {message}
        </div>
    )
}
