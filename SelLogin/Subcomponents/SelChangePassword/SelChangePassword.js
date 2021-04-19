import { useState, useEffect, useRef } from 'react';
import InputFieldSet from '../../../InputFieldSet/InputFieldSet';
import { Modal } from "bootstrap";
import * as Gl from "../../../js/Gl"
import langJSON from "./SelChangePassword-lang"

export default function SelChangePassword(props) {
    const refDialog = useRef();
    const [modal, setModal] = useState(null);
    const [formWasValidated, setFormWasValidated] = useState(false);

    const LangElements = langJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const [errors, setErrors] = useState({
        password: '',
        passwordAgain: ''
    });

    function clearAllErrors() {
        setErrors({
            password: '',
            passwordAgain: ''
        })
    }

    const [fieldValues, setFieldValues] = useState({
        password: '',
        passwordAgain: ''
    });

    const references = {
        password: useRef(),
        passwordAgain: useRef()
    };

    const validators = {
        password: {
            required: isNotEmpty,
            complexity: isComplex
        },
        passwordAgain: {
            required: isNotEmpty,
            same: isSame
        }
    }

    function btnClicked(event) {
        if (isFormValid()) {
            //let change password in database here!
            modal.hide();
            props.onAnswer('ok');
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

    const errorTypes = {
        required: lng(`validation-required`),
        same: lng(`validation-isSame`),
        complexity: lng(`invalid-password`)
    };

    function isNotEmpty(value) {
        return value !== '';
    }

    function isComplex(value) {
        return new RegExp(props.settings["password-regex"]).test(value);
    }

    function isSame(value) {
        if (fieldValues["password"] && fieldValues["passwordAgain"]) {
            return (fieldValues["password"] === fieldValues["passwordAgain"])
        }
    }

    useEffect(() => {
        setModal(new Modal(refDialog.current));
    }, [])

    if (props?.dialogParams?.show) {
        modal.show();
    }

    return (
        <div className="dialog" noValidate={true}>
            <div className="modal fade" ref={refDialog} tabIndex="-1" aria-labelledby="SelChangePassword" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="SelChangePassword">{lng(`modal-title`)}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <InputFieldSet
                                    reference={references['password']}
                                    name="password"
                                    labelText={lng(`field-pass`)}
                                    type="password"
                                    errors={errors}
                                    fieldValues={fieldValues}
                                    handleInputBlur={handleInputBlur}
                                    handleInputChange={handleInputChange}
                                    required={true}
                                />

                                <InputFieldSet
                                    reference={references['passwordAgain']}
                                    name="passwordAgain"
                                    labelText={lng(`field-pass-again`)}
                                    type="password"
                                    errors={errors}
                                    fieldValues={fieldValues}
                                    handleInputBlur={handleInputBlur}
                                    handleInputChange={handleInputChange}
                                    required={true}
                                />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={btnClicked}>{lng(`btn-save-password`)}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}