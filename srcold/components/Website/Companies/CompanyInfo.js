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

const CompanyInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchCompanies_API, CompanyMutation_API, CompanyDeleteMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);

    const CompanyMutation = useMutation('CompanyMutation_API', {
        mutationFn: CompanyMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchCompanies.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const CompanyDeleteMutation = useMutation('CompanyDeleteMutation_API', {
        mutationFn: CompanyDeleteMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchCompanies.refetch();
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
                        {props?.companypayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Company ID: {props?.companypayload.id}</div>}
                        {props?.companypayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add company</div>}
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
                            { name: 'Company name', attr: 'companyname' },
                            { name: 'Email', attr: 'email' },
                            { name: 'Phone number', attr: 'phonenumber', type: 'number' },
                        ]}
                        payload={props?.companypayload}
                        setpayload={props?.setcompanypayload}
                        button1disabled={CompanyMutation.isLoading}
                        button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                        button1placeholder={props?.companypayload?.functype == 'add' ? lang.add : lang.edit}
                        button1onClick={() => {
                            CompanyMutation.mutate(props?.companypayload);
                        }}
                        button2={props?.companypayload?.functype == 'add' ? false : true}
                        button2disabled={CompanyDeleteMutation.isLoading}
                        button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                        button2placeholder={lang.delete}
                        button2onClick={() => {
                            CompanyDeleteMutation.mutate(props?.companypayload);
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default CompanyInfo;
