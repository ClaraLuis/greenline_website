import React, { useContext, useEffect, useState } from 'react';
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

const HubInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { userRolesContext, userTypeContext, employeeTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, addUser, editUserType, fetchMerchants, fetchInventories, fetchGovernorates } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);

    const [addUser1] = useMutationGQL(addUser(), {
        name: props?.payload?.name,
        type: props?.payload?.type,
        phone: props?.payload?.phone,
        email: props?.payload?.email,
        birthdate: props?.payload?.birthdate,
        employeeInfo:
            props?.payload?.type == 'employee'
                ? {
                      type: props?.payload?.employeeType,
                      currency: props?.payload?.currency,
                      salary: props?.payload?.salary,
                      commission: props?.payload?.commission,
                  }
                : undefined,
        hubId: parseInt(props?.payload?.hubID),
        inventoryId: props?.payload?.inventoryId,

        merchantId: parseInt(props?.payload?.merchant),
    });

    const [editUserTypeMutation] = useMutationGQL(editUserType(), {
        type: props?.payload?.type,
        // name: props?.payload?.name,
        // phone: props?.payload?.phone,
        // email: props?.payload?.email,
        // birthdate: props?.payload?.birthdate,
        id: props?.payload?.id,
    });

    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());

    const handleAddUser = async () => {
        setbuttonLoading(true);

        try {
            if (props?.payload.functype == 'edit') {
                var { data } = await editUserTypeMutation();
            } else {
                var { data } = await addUser1();
            }
            if (data?.createUser?.success) {
                props?.setopenModal(false);
            } else {
                NotificationManager.warning(data?.createUser?.message, 'Warning!');
            }
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
        setbuttonLoading(false);
    };

    return (
        <>
            {!changerolesmodal && (
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
                                {props?.payload.functype == 'edit' && <div className="row w-100 m-0 p-0">Hub : {props?.payload.name}</div>}
                                {props?.payload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Hub</div>}
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
                            {props?.payload.functype == 'edit' && (
                                <div class="col-lg-12 d-flex justify-content-end py-0">
                                    <div
                                        onClick={() => {
                                            setchangerolesmodal(true);
                                        }}
                                        class="text-primary text-primaryhover"
                                        style={{ textDecoration: 'underline', fontSize: '12px' }}
                                    >
                                        Update roles
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row m-0 w-100 py-2">
                            {props?.payload?.functype == 'add' && (
                                <Form
                                    size={'lg'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={[
                                        { name: 'Name', attr: 'name', size: '6' },

                                        {
                                            name: 'City',
                                            attr: 'city',
                                            type: 'select',
                                            options: fetchGovernoratesQuery?.data?.findAllDomesticGovernorates,
                                            size: '6',
                                            optionValue: 'name',
                                            optionLabel: 'name',
                                        },
                                    ]}
                                    payload={props?.payload}
                                    setpayload={props?.setpayload}
                                    button1disabled={buttonLoading}
                                    button1class={generalstyles.roundbutton + '  mr-2 '}
                                    button1placeholder={props?.payload?.functype == 'add' ? lang.add : lang.edit}
                                    button1onClick={() => {
                                        handleAddUser();
                                    }}
                                    // button2={props?.payload?.functype == 'add' ? false : true}
                                    // // button2disabled={DeleteUserMutation.isLoading}
                                    // button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                    // button2placeholder={lang.delete}
                                    // button2onClick={() => {
                                    //     // DeleteUserMutation.mutate(props?.payload);
                                    // }}
                                />
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            <Modal
                show={changerolesmodal}
                onHide={() => {
                    setchangerolesmodal(false);
                }}
                centered
                size={'xl'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Change Roles</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setchangerolesmodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <AddEditSecuritylayers payload={props?.payload} setopenModal={props?.setopenModal} setchangerolesmodal={setchangerolesmodal} edit={true} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default HubInfo;
