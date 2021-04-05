import InputFieldSet from "../InputFieldSet/InputFieldSet"
import { useState, useRef, useEffect } from 'react';
import * as Gl from '../js/Gl'

export default function LanguageSelector(props) {
    const refLangSelector = useRef()
    const [fieldValues, setFieldValues] = useState({
        LanguageSelector: props.defaultLanguage
    })

    function setLang(lang) {
        if (fieldValues.LanguageSelector !== lang) {
            setFieldValues({
                LanguageSelector: lang
            });
            Gl.COOKIES_SET("lang", lang);
            props.onLanguageChanged(lang)
        }
    }

    function handleLanguageChanged(e) {
        setLang(e.target.value);
    }

    useEffect(() => {
        let cookies = Gl.COOKIES_GET();
        if (cookies.lang !== undefined) {
            setLang(cookies.lang);
        }
    }, [])

    return (
        <div>
            <InputFieldSet
                reference={refLangSelector}
                name="LanguageSelector"
                type="select"
                fieldValues={fieldValues}
                optionList={props.languages}
                handleInputBlur={handleLanguageChanged}
                handleInputChange={handleLanguageChanged}
                required={true}
            />
        </div>
    )
}

