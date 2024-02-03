import React, { useContext, useState } from 'react';
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

const LeadInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { LeadsMutation_API, DeleteLeadsMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);

    const LeadsMutation = useMutation('LeadsMutation_API', {
        mutationFn: LeadsMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const DeleteLeadsMutation = useMutation('DeleteLeadsMutation_API', {
        mutationFn: DeleteLeadsMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();
                props?.setopenModal(false);

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    return (
        <Modal
            show={props?.openModal}
            onHide={() => {
                props?.setopenModal(false);
            }}
            centered
            size={'md'}
        >
            <Modal.Header>
                <div className="row w-100 m-0 p-0">
                    <div class="col-lg-6 pt-3 ">
                        {props?.leadpayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Lead ID: {props?.leadpayload.id}</div>}
                        {props?.leadpayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Lead</div>}
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
                <div class="row m-0 w-100 py-2 allcentered">
                    <Form
                        submit={submit}
                        setsubmit={setsubmit}
                        attr={[
                            { name: 'First Name', attr: 'fname' },
                            { name: 'Last Name', attr: 'lname' },
                            { name: 'Email', attr: 'email' },
                            { name: 'Phone number', attr: 'phonenumber', type: 'number' },
                            { name: 'Company', attr: 'company_id', type: 'companyid' },
                        ]}
                        payload={props?.leadpayload}
                        setpayload={props?.setleadpayload}
                        button1disabled={LeadsMutation.isLoading}
                        button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                        button1placeholder={props?.leadpayload?.functype == 'add' ? lang.add : lang.edit}
                        button1onClick={() => {
                            LeadsMutation.mutate(props?.leadpayload);
                        }}
                        button2={props?.leadpayload?.functype == 'add' ? false : true}
                        button2disabled={DeleteLeadsMutation.isLoading}
                        button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                        button2placeholder={lang.delete}
                        button2onClick={() => {
                            DeleteLeadsMutation.mutate(props?.leadpayload);
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default LeadInfo;
