import "./SelLogin.scss";
import { useRef, useState, useEffect } from 'react';
import InputFieldSet from '../InputFieldSet/InputFieldSet';
import * as Gl from "../../_SelWebComponents/js/Gl"
import langJSON from "./SelLogin-lang"

export default function SelLogin(props) {
    const LangElements = langJSON();
    const lang = props.lang;

    const [formWasValidated, setFormWasValidated] = useState(false);

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const [errors, setErrors] = useState({
        login: '',
        pass: ''
    });

    function showMessageShortly(codeOfMessage, typeOfAlert) {
        setFormAlertText(lng(codeOfMessage));
        setFormAlertType(typeOfAlert);
        setTimeout(() => {
            setFormAlertText('');
            setFormAlertType('');
        }, 5000);
    }

    function clearAllErrors() {
        setErrors({
            login: '',
            pass: ''
        })
    }

    const [fieldValues, setFieldValues] = useState({
        login: '',
        pass: ''
    });

    const references = {
        login: useRef(),
        pass: useRef()
    };

    const [formAlertText, setFormAlertText] = useState('');
    const [formAlertType, setFormAlertType] = useState('');

    const validators = {
        login: {
            required: isNotEmpty
        },
        pass: {
            required: isNotEmpty
        }
    }

    const errorTypes = {
        required: lng(`validation-required`)
    };

    function isNotEmpty(value) {
        return value !== '';
    }

    useEffect(() => {
        clearAllErrors();
    }, [props.lang])

    async function handleSubmit(e) {
        e.preventDefault();

        if (isFormValid()) {
            let loginResult = await props.db.login(fieldValues.login, fieldValues.pass)

            if (loginResult.result !== "ok") {
                showMessageShortly("invalid-password", "danger");
            } else {
                props.onLogin({
                    user: {
                        email: fieldValues.login,
                        userLevel: null
                    },
                    token: null
                })
            }
        }
    }

    function isFormValid() {
        let isFormValid = true;
        for (const fieldName of Object.keys(fieldValues)) {
            const isFieldValid = validateField(fieldName);
            if (!isFieldValid) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }

    function handleInputBlur(e) {
        const fieldName = e.target.name;
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));

        validateField(fieldName);
    }

    function handleInputChange(e) {
        const value = e.target.value;
        const fieldName = e.target.name;
        setFieldValues({
            ...fieldValues,
            [fieldName]: value
        });
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
    }

    function validateField(fieldName) {
        const value = fieldValues[fieldName];
        let isValid = true;
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
        references[fieldName].current.setCustomValidity('');

        if (validators[fieldName] !== undefined) {
            for (const [validationType, validatorFn] of Object.entries(validators[fieldName])) {
                if (isValid) {
                    isValid = validatorFn(value);
                    if (!isValid) {
                        const errorText = errorTypes[validationType];
                        setErrors((previousErrors) => {
                            return ({
                                ...previousErrors,
                                [fieldName]: errorText
                            })
                        });
                        references[fieldName].current.setCustomValidity(errorText);
                    }
                }
            }
        }
        return isValid;
    }

    return (
        <div className="sel-login">
            {formAlertText &&
                <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
                    {formAlertText}
                </div>
            }
            <form onSubmit={handleSubmit} noValidate={true}
                className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
                <InputFieldSet
                    reference={references['login']}
                    name="login"
                    labelText={lng(`field-login`)}
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['pass']}
                    name="pass"
                    labelText={lng(`field-pass`)}
                    type="password"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <button type="submit" className="btn btn-success">{lng(`btn-login`)}</button>
            </form>
        </div>
    );
}

