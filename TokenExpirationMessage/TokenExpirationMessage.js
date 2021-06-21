import './TokenExpirationMessage.scss';
import { useState, useEffect } from 'react';
import * as Gl from "../js/Gl";
import * as LangJSON from "./TokenExpirationMessage-lang";

export default function TokenExpirationMessage(props) {
    const LangElements = LangJSON.langJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const [tokenStatus, setTokenStatus] = useState("NOT VALID");

    async function onExtendValidity(e) {
        let extendResult = await props.db.extendTokenValidity(props.loginData.token.token);

        switch (extendResult?.result) {
            case "ok":
                props.onExtendToken({
                    token: extendResult.token,
                    validUntil: extendResult.validUntil
                });
                break;

            default:
                props.onLogout();
                break;
        }
    }

    useEffect(() => {
        let timerOfExpiresShortly;
        let timerOfValidity;

        let user = props?.loginData?.user

        if (!user) {
            setTokenStatus("NOT VALID")
        } else {
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
                    props.onExtendToken(null);
                }, validUntil - 5000)

                if (setTimerShortly) {
                    timerOfExpiresShortly = setTimeout(() => {
                        setTokenStatus("EXPIRES SHORTLY");
                    }, validUntil - 120000)
                }
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
            <button type="button" className="btn-extend btn btn-success btn-sm" aria-label="Close" onClick={e => onExtendValidity(e)}>{lng("btn-extend")}</button>
        </div>
    }

    return (
        <div className="token-expiration-message">
            {message}
        </div>
    )
}
