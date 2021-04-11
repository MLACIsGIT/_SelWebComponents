import { useState, useRef, useEffect } from 'react';
import * as Gl from "../js/Gl";
import * as LangJSON from "./TokenExpirationMessage-lang";

export default function TokenExpirationMessage(props) {
    const LangElements = LangJSON.langJSON();
    const lang = props.lang;
    
    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    function onExtendValidity(e) {
        alert("meghosszabbítom!")
    }

    return (
        <div className="token-expiration-message">

            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>{lng("message-expires-shortly-strong")}</strong>
                {lng("message-expires-shortly")}
                <button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="alert" onClick={e => onExtendValidity(e)}></button>
            </div>
        </div>
    )
}
