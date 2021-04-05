import { useState, useEffect, useRef } from 'react';
import { Modal } from "bootstrap";

export default function Dialog(props) {
    const refDialog = useRef();
    const [modal, setModal] = useState(null);

    useEffect(() => {
        setModal(new Modal(refDialog.current));
    }, [])

    function btnClicked(event) {
        modal.hide();
        props.onAnswer(event.target.dataset.id);
    }

    if (props?.dialogParams?.show) {
        modal.show();
    }

    return (
        <div className="dialog">
            <div className="modal fade" ref={refDialog} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{props?.dialogParams?.dialogTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {props?.dialogParams?.dialogText}
                        </div>
                        <div className="modal-footer">
                            {props?.dialogParams?.buttons?.map((btn) => <button type="button" data-id={btn.id} key={`modal-dialog-${btn.id}`} className={`btn ${btn.class}`} onClick={btnClicked} >{btn.text}</button>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}