import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
// import { useMutation } from 'react-query';
import { components } from 'react-select';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import SubmitButton from '../../Form.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import AddEditSecuritylayers from '../Securitylayers/AddEditSecuritylayers.js';

const { ValueContainer, Placeholder } = components;

const AddCustomer = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, addUser, addCustomer } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [newpassword, setnewpassword] = useState('');

    const [addCustomerMutation] = useMutationGQL(addCustomer(), {
        name: props?.payload?.name,
        phone: props?.payload?.phone,
        email: props?.payload?.email,
    });

    const handleAddCustomer = async () => {
        try {
            const { data } = await addCustomerMutation();
            props?.setopenModal(false);
            console.log(data); // Handle response
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };
    return (
        <>
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
                            <div className="row w-100 m-0 p-0">Add Customer</div>
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
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <Form
                            size={'lg'}
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={[
                                { name: 'Name', attr: 'name', size: '12' },
                                { name: 'Phone', attr: 'phone', type: 'number', size: '12' },
                                { name: 'Email', attr: 'email', size: '12' },
                            ]}
                            payload={props?.payload}
                            setpayload={props?.setpayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={lang.add}
                            button1onClick={() => {
                                handleAddCustomer();
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default AddCustomer;
