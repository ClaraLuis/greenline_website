import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import { components } from 'react-select';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import SubmitButton from '../../Form.js';
import Form from '../../Form.js';

const { ValueContainer, Placeholder } = components;

const DealInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { AddDeal_API, DeleteAddDeal_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);

    const AddDeal = useMutation('AddDeal_API', {
        mutationFn: AddDeal_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchDeals.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    useEffect(() => {
        var temp = '';
        if (props?.dealspayload?.value?.length != 0 && props?.dealspayload?.quantity?.length != 0) {
            temp = parseFloat(props?.dealspayload?.value) * parseFloat(props?.dealspayload?.quantity);
        }
        props?.setdealspayload({ ...props?.dealspayload, totalvalue: temp });
    }, [props?.dealspayload?.value, props?.dealspayload?.quantity]);

    return (
        <Modal
            show={props?.openModal}
            onHide={() => {
                props?.setopenModal(false);
            }}
            centered
            size={'lg'}
        >
            <Modal.Header>
                <div className="row w-100 m-0 p-0">
                    <div class="col-lg-6 pt-3 ">
                        {props?.dealspayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Deal ID: {props?.dealspayload.id}</div>}
                        {props?.dealspayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Deal</div>}
                    </div>
                    <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                        <div
                            class={'close-modal-container'}
                            onClick={() => {
                                props?.setopenModal(false);
                            }}
                        >
                            <IoMdClose />
                        </div>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div class="row m-0 w-100 py-2 ">
                    <div class="col-lg-12 mb-2">
                        <div
                            style={{ border: '1px solid #cecece', borderRadius: '10px', maxHeight: '150px', overflow: 'scroll' }}
                            class="row m-0 d-flex scrollmenuclasssubscrollbar justify-content-between p-3 w-100"
                        >
                            {props?.dealspayload?.lead_feilds?.map((key, keyindex) => {
                                return (
                                    <div style={{ fontSize: '14px' }} class=" d-flex justify-content-start ">
                                        <div class="row m-0 d-flex justify-content-start ">
                                            <div class=" d-flex justify-content-start text-capitalize mr-2">{key?.name}: </div>
                                            <span style={{ fontWeight: 500 }}>{key?.value}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Form
                        submit={submit}
                        setsubmit={setsubmit}
                        attr={[
                            // { name: 'Lead', attr: 'lead_id', type: 'leadid' },
                            { name: 'Value', attr: 'value', type: 'number', size: '6' },
                            { name: 'Quantity', attr: 'quantity', type: 'number', size: '6' },
                            { name: 'Notes', attr: 'notes', type: 'textarea', size: '12' },
                            { name: 'Total Value', attr: 'totalvalue', type: 'number', size: '12', disabled: true },
                        ]}
                        payload={props?.dealspayload}
                        setpayload={props?.setdealspayload}
                        button1disabled={AddDeal.isLoading}
                        button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                        button1placeholder={props?.dealspayload?.functype == 'add' ? lang.add : lang.edit}
                        button1onClick={() => {
                            AddDeal.mutate(props?.dealspayload);
                        }}
                        button2={props?.dealspayload?.functype == 'add' ? false : true}
                        button2disabled={AddDeal.isLoading}
                        button2class={generalstyles.roundbutton + ' bg-danger bg-danger mr-2 '}
                        button2placeholder={lang.delete}
                        button2onClick={() => {
                            var temp = { ...props?.dealspayload };
                            temp.functype = 'delete';
                            AddDeal.mutate(temp);
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default DealInfo;
