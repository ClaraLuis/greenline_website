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

const AddressInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { UserMutation_API, DeleteUserMutation_API, useQueryGQL, fetchUsers, useMutationGQL, addUser } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [newpassword, setnewpassword] = useState('');

    const [addUser1] = useMutationGQL(addUser(props?.addresspayload));
    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);

    const handleAddUser = async () => {
        try {
            const { data } = await addUser1();
            props?.setopenModal(false);
            refetchUsers();
            console.log(data); // Handle response
        } catch (error) {
            let errorMessage = 'An unexpected error occurred';
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                errorMessage = error.graphQLErrors[0].message || errorMessage;
            } else if (error.networkError) {
                errorMessage = error.networkError.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            NotificationManager.warning(errorMessage, 'Warning!');
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
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            {props?.addresspayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Address:</div>}
                            {props?.addresspayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Address</div>}
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
                        {props?.addresspayload?.functype == 'add' && (
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    { name: 'Country', attr: 'name', size: '6' },
                                    { name: 'City', attr: 'name', size: '6' },
                                    { name: 'Details', attr: 'details', type: 'textarea', size: '12' },
                                ]}
                                payload={props?.addresspayload}
                                setpayload={props?.setaddresspayload}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={props?.addresspayload?.functype == 'add' ? lang.add : lang.edit}
                                button1onClick={() => {
                                    handleAddUser();
                                }}
                                button2={props?.addresspayload?.functype == 'add' ? false : true}
                                // button2disabled={DeleteUserMutation.isLoading}
                                button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                button2placeholder={lang.delete}
                                button2onClick={() => {
                                    // DeleteUserMutation.mutate(props?.addresspayload);
                                }}
                            />
                        )}
                        {props?.addresspayload?.functype == 'edit' && (
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    { name: 'Country', attr: 'name', size: '6' },
                                    { name: 'City', attr: 'name', size: '6' },
                                    { name: 'Details', attr: 'details', type: 'textarea', size: '12' },
                                ]}
                                payload={props?.addresspayload}
                                setpayload={props?.setaddresspayload}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={props?.addresspayload?.functype == 'add' ? lang.add : lang.edit}
                                button1onClick={() => {
                                    handleAddUser();
                                }}
                                // button2={props?.addresspayload?.functype == 'add' ? false : true}
                                // // button2disabled={DeleteUserMutation.isLoading}
                                // button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                // button2placeholder={lang.delete}
                                // button2onClick={() => {
                                //     // DeleteUserMutation.mutate(props?.addresspayload);
                                // }}
                            />
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default AddressInfo;
