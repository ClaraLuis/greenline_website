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
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

const { ValueContainer, Placeholder } = components;

const UserInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { UserMutation_API, DeleteUserMutation_API, Changepassword_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changepasswordmodal, setchangepasswordmodal] = useState(false);
    const [newpassword, setnewpassword] = useState('');

    const Changepassword = useMutation('Changepassword_API', {
        mutationFn: Changepassword_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchUsers.refetch();
                setchangepasswordmodal(false);
                setnewpassword('');
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    const UserMutation = useMutation('UserMutation_API', {
        mutationFn: UserMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchUsers.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const DeleteUserMutation = useMutation('DeleteUserMutation_API', {
        mutationFn: DeleteUserMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchUsers.refetch();
                props?.setopenModal(false);

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    return (
        <>
            {!changepasswordmodal && (
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
                                {props?.leadpayload.functype == 'edit' && <div className="row w-100 m-0 p-0">User : {props?.leadpayload.username}</div>}
                                {props?.leadpayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add User</div>}
                            </div>
                            <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                                {props?.leadpayload.functype == 'edit' && (
                                    <div
                                        onClick={() => {
                                            setchangepasswordmodal(true);
                                        }}
                                        style={{ textDecoration: 'underline', fontSize: '13px', transition: 'all 0.4s' }}
                                        className="m-0 p-0 text-primaryhover"
                                    >
                                        Change password
                                    </div>
                                )}

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
                        <div class="row m-0 w-100 py-2">
                            {props?.leadpayload?.functype == 'add' && (
                                <Form
                                    size={'lg'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={[
                                        { name: 'First Name', attr: 'fname', size: '6' },
                                        { name: 'Last Name', attr: 'lname', size: '6' },
                                        { name: 'Email', attr: 'email', size: '6' },
                                        { name: 'Phone number', attr: 'phonenumber', type: 'number', size: '6' },
                                        { name: 'Birthdate', attr: 'birthdate', type: 'date', size: '6' },
                                        { name: 'Gender', attr: 'gender', type: 'gender', size: '6' },
                                        { name: 'Security Layer', attr: 'security_layer_id', type: 'securitylayer', size: '6' },
                                        // { name: 'Company', attr: 'company_id', type: 'companyid', size: '6' },
                                        { name: 'Password', attr: 'password', size: '6' },
                                    ]}
                                    payload={props?.leadpayload}
                                    setpayload={props?.setleadpayload}
                                    button1disabled={UserMutation.isLoading}
                                    button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                    button1placeholder={props?.leadpayload?.functype == 'add' ? lang.add : lang.edit}
                                    button1onClick={() => {
                                        UserMutation.mutate(props?.leadpayload);
                                    }}
                                    button2={props?.leadpayload?.functype == 'add' ? false : true}
                                    button2disabled={DeleteUserMutation.isLoading}
                                    button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                    button2placeholder={lang.delete}
                                    button2onClick={() => {
                                        DeleteUserMutation.mutate(props?.leadpayload);
                                    }}
                                />
                            )}
                            {props?.leadpayload?.functype == 'edit' && (
                                <Form
                                    size={'lg'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={[
                                        { name: 'First Name', attr: 'fname', size: '6' },
                                        { name: 'Last Name', attr: 'lname', size: '6' },
                                        { name: 'Email', attr: 'email', size: '6' },
                                        { name: 'Phone number', attr: 'phonenumber', type: 'number', size: '6' },
                                        { name: 'Birthdate', attr: 'birthdate', type: 'date', size: '6' },
                                        { name: 'Gender', attr: 'gender', type: 'gender', size: '6' },
                                        { name: 'Security Layer', attr: 'security_layer_id', type: 'securitylayer', size: '6' },
                                        // { name: 'Company', attr: 'company_id', type: 'companyid', size: '6' },
                                        // { name: 'Password', attr: 'password', size: '6' },
                                    ]}
                                    payload={props?.leadpayload}
                                    setpayload={props?.setleadpayload}
                                    button1disabled={UserMutation.isLoading}
                                    button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                    button1placeholder={props?.leadpayload?.functype == 'add' ? lang.add : lang.edit}
                                    button1onClick={() => {
                                        UserMutation.mutate(props?.leadpayload);
                                    }}
                                    button2={props?.leadpayload?.functype == 'add' ? false : true}
                                    button2disabled={DeleteUserMutation.isLoading}
                                    button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                    button2placeholder={lang.delete}
                                    button2onClick={() => {
                                        DeleteUserMutation.mutate(props?.leadpayload);
                                    }}
                                />
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}{' '}
            <Modal
                show={changepasswordmodal}
                onHide={() => {
                    setchangepasswordmodal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Change Password</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setchangepasswordmodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-12">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label for="name" class={formstyles.form__label}>
                                        New Password
                                    </label>
                                    <input
                                        class={formstyles.form__field}
                                        value={newpassword}
                                        onChange={(event) => {
                                            setnewpassword(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                onClick={() => {
                                    var temp = {};
                                    temp.user_id = props?.leadpayload?.id;
                                    temp.password = newpassword;
                                    Changepassword.mutate(temp);
                                }}
                                disabled={Changepassword?.isLoading}
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                            >
                                {!Changepassword?.isLoading && <>Submit</>}
                                {Changepassword?.isLoading && (
                                    <>
                                        <CircularProgress color="var(--info)" width="25px" height="25px" duration="1s" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default UserInfo;
