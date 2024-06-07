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

const UserInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, userTypesContext, empTypesContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, addUser, editUserType, fetchMerchants, fetchInventories } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [newpassword, setnewpassword] = useState('');
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const [filterInventories, setfilterInventories] = useState({
        limit: 100,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);

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
                : null,
        hubId: parseInt(props?.payload?.hubID),
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

    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers());

    const handleAddUser = async () => {
        try {
            if (props?.payload.functype == 'edit') {
                var { data } = await editUserTypeMutation();
            } else {
                var { data } = await addUser1();
            }
            props?.setopenModal(false);
            refetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
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
                                {props?.payload.functype == 'edit' && <div className="row w-100 m-0 p-0">User : {props?.payload.name}</div>}
                                {props?.payload.functype == 'add' && <div className="row w-100 m-0 p-0">Add User</div>}
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
                                        Update rules
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
                                    attr={
                                        props?.payload?.type == 'merchant'
                                            ? [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                                  { name: 'Birthdate', attr: 'birthdate', type: 'date', size: '6' },
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypesContext,
                                                      size: '6',
                                                  },

                                                  {
                                                      title: 'Merchant',
                                                      filter: filterMerchants,
                                                      setfilter: setfilterMerchants,
                                                      options: fetchMerchantsQuery,
                                                      optionsAttr: 'paginateMerchants',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '6',
                                                      attr: 'merchant',
                                                      type: 'fetchSelect',
                                                  },
                                              ]
                                            : props?.payload?.type == 'employee' && props?.payload?.employeeType != 'inventory'
                                            ? [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                                  { name: 'Birthdate', attr: 'birthdate', type: 'date', size: '6' },
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypesContext,
                                                      size: '6',
                                                  },
                                                  {
                                                      name: 'Employee Type',
                                                      attr: 'employeeType',
                                                      type: 'select',
                                                      options: empTypesContext,
                                                      size: '6',
                                                  },

                                                  {
                                                      name: 'Hub',
                                                      attr: 'hubID',
                                                      size: '6',
                                                      type: 'select',
                                                      options: [
                                                          { label: 'Hub 1', value: '1' },
                                                          { label: 'Hub 2', value: '2' },
                                                      ],
                                                      size: '6',
                                                  },
                                                  { name: 'Commission', attr: 'commission', size: '6', type: 'number' },
                                                  { name: 'Salary', attr: 'salary', size: '6', type: 'number' },
                                                  {
                                                      name: 'Currency',
                                                      attr: 'currency',
                                                      size: '6',
                                                      type: 'select',
                                                      options: [
                                                          { label: 'EGP', value: 'EGP' },
                                                          { label: 'USD', value: 'USD' },
                                                      ],
                                                      size: '6',
                                                  },
                                              ]
                                            : props?.payload?.type == 'employee' && props?.payload?.employeeType == 'inventory'
                                            ? [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                                  { name: 'Birthdate', attr: 'birthdate', type: 'date', size: '6' },
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypesContext,
                                                      size: '6',
                                                  },
                                                  {
                                                      name: 'Employee Type',
                                                      attr: 'employeeType',
                                                      type: 'select',
                                                      options: empTypesContext,
                                                      size: '6',
                                                  },
                                                  {
                                                      title: 'Inventory',
                                                      filter: filterInventories,
                                                      setfilter: setfilterInventories,
                                                      options: fetchinventories,
                                                      optionsAttr: 'paginateInventories',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '6',
                                                      attr: 'inventoryId',
                                                      type: 'fetchSelect',
                                                  },
                                                  {
                                                      name: 'Hub',
                                                      attr: 'hubID',
                                                      size: '6',
                                                      type: 'select',
                                                      options: [
                                                          { label: 'Hub 1', value: '1' },
                                                          { label: 'Hub 2', value: '2' },
                                                      ],
                                                      size: '6',
                                                  },
                                                  { name: 'Commission', attr: 'commission', size: '6', type: 'number' },
                                                  { name: 'Salary', attr: 'salary', size: '6', type: 'number' },
                                                  {
                                                      name: 'Currency',
                                                      attr: 'currency',
                                                      size: '6',
                                                      type: 'select',
                                                      options: [
                                                          { label: 'EGP', value: 'EGP' },
                                                          { label: 'USD', value: 'USD' },
                                                      ],
                                                      size: '6',
                                                  },
                                              ]
                                            : [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                                  { name: 'Birthdate', attr: 'birthdate', type: 'date', size: '6' },
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypesContext,
                                                      size: '6',
                                                  },
                                              ]
                                    }
                                    payload={props?.payload}
                                    setpayload={props?.setpayload}
                                    // button1disabled={UserMutation.isLoading}
                                    button1class={generalstyles.roundbutton + '  mr-2 '}
                                    button1placeholder={props?.payload?.functype == 'add' ? lang.add : lang.edit}
                                    button1onClick={() => {
                                        handleAddUser();
                                    }}
                                    button2={props?.payload?.functype == 'add' ? false : true}
                                    // button2disabled={DeleteUserMutation.isLoading}
                                    button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                    button2placeholder={lang.delete}
                                    button2onClick={() => {
                                        // DeleteUserMutation.mutate(props?.payload);
                                    }}
                                />
                            )}
                            {props?.payload?.functype == 'edit' && (
                                <Form
                                    size={'lg'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={[
                                        {
                                            name: 'Type',
                                            attr: 'type',
                                            type: 'select',
                                            options: userTypesContext,
                                            size: '6',
                                        },
                                    ]}
                                    payload={props?.payload}
                                    setpayload={props?.setpayload}
                                    // button1disabled={UserMutation.isLoading}
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
                        <AddEditSecuritylayers payload={props?.payload} setopenModal={props?.setopenModal} setchangerolesmodal={setchangerolesmodal} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default UserInfo;
