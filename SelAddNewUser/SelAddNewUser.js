import { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import InputFieldSet from '../InputFieldSet/InputFieldSet';
import * as Gl from "../../_SelWebComponents/js/Gl"
import langJSON from "./SelAddNewUser-lang"

export default function SelAddNewUser(props) {
    const LangElements = langJSON();
    const lang = props.lang;

    const [formWasValidated, setFormWasValidated] = useState(false);

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const [errors, setErrors] = useState({
        name: '',
        company: '',
        level: '',
        status: ''
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
            name: '',
            email: '',
            emailAgain: '',
            level: '',
            status: ''
        })
    }

    const [fieldValues, setFieldValues] = useState({
        name: '',
        email: '',
        emailAgain: '',
        level: '',
        status: true
});

    const references = {
        name: useRef(),
        email: useRef(),
        emailAgain: useRef(),
        level: useRef(),
        status: useRef()
    };

    const [formAlertText, setFormAlertText] = useState('');
    const [formAlertType, setFormAlertType] = useState('');

    const validators = {
        name: {
            required: isNotEmpty
        },
        email: {
            required: isNotEmpty
        },
        emailAgain: {
            required: isNotEmpty
        },
        level: {
            required: isNotEmpty
        },
        status: {
        }
    }

    const errorTypes = {
        required: lng(`validation-required`),
        chkboxChecked: lng(`validation-chkboxChecked`)
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
            alert('await saveLogin')
            let loginResult = { result: "ok" }
            //let loginResult = await props.db.login(fieldValues.login, fieldValues.pass)

            switch (loginResult?.result) {
                case "ok":
                    showMessageShortly("result-ok", "success");
                    break;

                case "nok":
                    showMessageShortly("result-nok", "danger");
                    break;

                default:
                    showMessageShortly("result-no-response", "danger");
                    break;
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

    function downloadGDPR() {
        alert("SelRegister.downloadGDPR")
    }

    let gdprAcceptedText = <>
        {`${lng("field-gdprAccepted-before-link")} `}
        <Link id="link-to-gdpr" to='#' onClick={downloadGDPR}>{lng(`field-gdprAccepted-link-text`)}</Link>
        {` ${lng("field-gdprAccepted-after-link")}`}
    </>

    return (
        <div className="sel-register">
            {formAlertText &&
                <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
                    {formAlertText}
                </div>
            }
            <form onSubmit={handleSubmit} noValidate={true}
                className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
                <InputFieldSet
                    reference={references['name']}
                    name="name"
                    labelText={lng(`field-name`)}
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['email']}
                    name="email"
                    labelText={lng(`field-email`)}
                    type="email"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['emailAgain']}
                    name="emailAgain"
                    labelText={lng(`field-emailAgain`)}
                    type="email"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['level']}
                    name="level"
                    labelText={lng(`field-level`)}
                    type="select"
                    optionList= {[
                        {value: '', text: lng('field-level-pleaseSelect')},
                        {value: 'MA', text: lng('field-level-MA')},
                        {value: 'SA', text: lng('field-level-SA')},
                        {value: 'U', text: lng('field-level-U')}
                    ]}
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['status']}
                    name="status"
                    labelText={lng(`field-status`)}
                    type="checkbox"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <div className="btn-area">
                    <button type="submit" className="btn btn-success">{lng(`btn-submit`)}</button>
                </div>
            </form>
        </div>
    );
}

