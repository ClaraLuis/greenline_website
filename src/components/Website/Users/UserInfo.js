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
import Cookies from 'universal-cookie';
import SelectComponent from '../../SelectComponent.js';
import { BiEdit } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';

const { ValueContainer, Placeholder } = components;

const UserInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { isPhoneValidContext, userTypeContext, employeeTypeContext, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, removeUser, useMutationGQL, addUser, useMutationNoInputGQL, fetchMerchants, fetchInventories, fetchHubs, updateEmployeeInfo } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [edit, setedit] = useState(false);
    const [changepermissionsmodal, setchangepermissionsmodal] = useState(false);

    const groupedPermissions = _.groupBy(props?.payload?.userPermissions, (permission) => permission.permission.type);

    // Transform into desired format
    const userPermissions = Object.keys(groupedPermissions).map((type) => ({
        type,
        permissions: groupedPermissions[type],
    }));
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const [filterInventories, setfilterInventories] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('cache-first', fetchInventories(), filterInventories);

    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);

    const [addUser1] = useMutationGQL(addUser(), {
        name: props?.payload?.name,
        type: cookies.get('merchantId') != undefined ? 'merchant' : props?.payload?.type,
        phone: props?.payload?.phone,
        email: props?.payload?.email,
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

        merchantId: cookies.get('merchantId') != undefined ? undefined : parseInt(props?.payload?.merchant),
    });
    const [updateEmployeeInfoMutation] = useMutationGQL(updateEmployeeInfo(), {
        type: props?.payload?.employeeType,
        salary: props?.payload?.salary,
        commission: props?.payload?.commission,
        hubId: parseInt(props?.payload?.hubID),
        inventoryId: props?.payload?.inventoryId,
        id: props?.payload?.id,
    });
    const [removeUserMutation] = useMutationNoInputGQL(removeUser(), { removeUserId: props?.payload?.id });

    const [filterHubs, setfilterHubs] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('cache-first', fetchHubs(), filterHubs);

    const handleAddUser = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);

        try {
            if (props?.payload.functype == 'edit') {
                var { data } = await updateEmployeeInfoMutation();
                if (data?.updateEmployeeInfo?.success) {
                    props?.setopenModal(false);
                    setedit(false);

                    if (props?.refetchUsers) {
                        props?.refetchUsers();
                    }
                    NotificationManager.success('', 'Success');
                } else {
                    NotificationManager.warning(data?.updateEmployeeInfo?.message, 'Warning!');
                }
            } else {
                var { data } = await addUser1();
                if (data?.createUser?.success) {
                    props?.setopenModal(false);
                    setedit(false);

                    if (props?.refetchUsers) {
                        props?.refetchUsers();
                    }
                    NotificationManager.success('', 'Success');
                } else {
                    NotificationManager.warning(data?.createUser?.message, 'Warning!');
                }
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
        setbuttonLoadingContext(false);
    };

    const handleDeleteUser = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);

        try {
            var { data } = await removeUserMutation();
            if (data?.removeUser) {
                props?.setopenModal(false);
                setedit(false);

                if (props?.refetchUsers) {
                    props?.refetchUsers();
                }
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data?.updateEmployeeInfo?.message, 'Warning!');
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
        setbuttonLoadingContext(false);
    };

    return (
        <>
            {!changepermissionsmodal && (
                <Modal
                    show={props?.openModal}
                    onHide={() => {
                        props?.setopenModal(false);
                        setedit(false);
                    }}
                    centered
                    size={'lg'}
                >
                    <Modal.Header>
                        <div className="row w-100 m-0 p-0">
                            <div class="col-lg-6 col-md-10 pt-3 ">
                                {props?.payload.functype == 'edit' && <div className="row w-100 m-0 p-0">User : {props?.payload.name}</div>}
                                {props?.payload.functype == 'add' && <div className="row w-100 m-0 p-0">Add User</div>}
                            </div>
                            <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                                <div
                                    class={'close-modal-container'}
                                    onClick={() => {
                                        props?.setopenModal(false);
                                        setedit(false);
                                    }}
                                >
                                    <IoMdClose />
                                </div>
                            </div>{' '}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row m-0 w-100 py-2">
                            {!edit && props?.payload?.functype == 'edit' && props?.payload?.modaltype == 'view' && (
                                <div class={' row m-0 w-100'}>
                                    <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                            <div> Main Info</div>
                                            {isAuth([1, 45]) && (
                                                <TbEdit
                                                    onClick={() => {
                                                        setedit(true);
                                                    }}
                                                    class="text-secondaryhover"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div class="col-lg-6 col-lg-12 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Name
                                                </label>
                                                <div>{props?.payload?.name}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6 col-lg-12 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Phone
                                                </label>
                                                <div>{props?.payload?.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-lg-12 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Email
                                                </label>
                                                <div>{props?.payload?.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div class="col-lg-6 col-lg-12 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Birthdate
                                                </label>
                                                <div>{props?.payload?.birthdate.split('T')[0]}</div>
                                            </div>
                                        </div>
                                    </div> */}
                                    {props?.payload?.hub && (
                                        <div class="col-lg-6 col-lg-12 mb-3">
                                            <div class="row m-0 w-100">
                                                <div class="form__group field">
                                                    <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                        Hub
                                                    </label>
                                                    <div>{props?.payload?.hub?.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {props?.payload?.merchant && (
                                        <div class="col-lg-6 col-lg-12 mb-3">
                                            <div class="row m-0 w-100">
                                                <div class="form__group field">
                                                    <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                        Merchant
                                                    </label>
                                                    <div>{props?.payload?.merchant?.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {props?.payload?.type != 'merchant' && (
                                        <>
                                            <div class="col-lg-6 col-lg-12 mb-3">
                                                <div class="row m-0 w-100">
                                                    <div class="form__group field">
                                                        <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                            Type
                                                        </label>
                                                        <div>{props?.payload?.type}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 col-lg-12 mb-3">
                                                <div class="row m-0 w-100">
                                                    <div class="form__group field">
                                                        <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                            Employee Type
                                                        </label>
                                                        <div>{props?.payload?.employee?.type}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-6 col-lg-12 mb-3">
                                                <div class="row m-0 w-100">
                                                    <div class="form__group field">
                                                        <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                            Currency
                                                        </label>
                                                        <div>{props?.payload?.employee?.currency}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-6 col-lg-12 mb-3">
                                                <div class="row m-0 w-100">
                                                    <div class="form__group field">
                                                        <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                            Salary
                                                        </label>
                                                        <div>{props?.payload?.employee?.salary}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-6 col-lg-12 mb-3">
                                                <div class="row m-0 w-100">
                                                    <div class="form__group field">
                                                        <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                            Commission
                                                        </label>
                                                        <div>{props?.payload?.employee?.commission}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                            {props?.payload?.functype == 'edit' && props?.payload?.type != 'merchant' && edit && props?.payload?.modaltype == 'view' && (
                                <>
                                    <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                            <div> Main Info</div>
                                            <MdClose
                                                onClick={() => {
                                                    setedit(false);
                                                }}
                                                class="text-secondaryhover"
                                            />
                                        </div>
                                    </div>
                                    <Form
                                        size={'lg'}
                                        submit={submit}
                                        setsubmit={setsubmit}
                                        attr={[
                                            {
                                                name: 'Employee Type',
                                                attr: 'employeeType',
                                                type: 'select',
                                                options: employeeTypeContext,
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
                                                disabled: fetchinventories?.loading,
                                            },
                                            {
                                                title: 'Hub',
                                                filter: filterHubs,
                                                setfilter: setfilterHubs,
                                                options: fetchHubsQuery,
                                                optionsAttr: 'paginateHubs',
                                                label: 'name',
                                                value: 'id',
                                                size: '6',
                                                attr: 'hubID',
                                                type: 'fetchSelect',
                                                disabled: fetchHubsQuery?.loading,
                                            },
                                            { name: 'Commission', attr: 'commission', size: '6', type: 'number' },
                                            { name: 'Salary', attr: 'salary', size: '6', type: 'number' },
                                        ]}
                                        payload={props?.payload}
                                        setpayload={props?.setpayload}
                                        button1disabled={buttonLoadingContext}
                                        button1class={generalstyles.roundbutton + '  mr-2 '}
                                        button1placeholder={props?.payload?.functype == 'add' ? lang.add : lang.edit}
                                        button1onClick={() => {
                                            handleAddUser();
                                        }}
                                        button2disabled={buttonLoadingContext}
                                        button2={props?.payload?.functype == 'edit'}
                                        button2class={generalstyles.roundbutton + '  mr-2 '}
                                        button2placeholder={'Delete'}
                                        button2onClick={() => {
                                            handleDeleteUser();
                                        }}
                                    />
                                </>
                            )}
                            {props?.payload.functype == 'edit' && props?.payload?.modaltype == 'permissions' && (
                                <div class="col-lg-12 d-flex justify-content-end py-0">
                                    <div
                                        onClick={() => {
                                            setchangepermissionsmodal(true);
                                        }}
                                        class={generalstyles.roundbutton + ' allcentered'}
                                        // style={{ textDecoration: 'underline', fontSize: '12px' }}
                                    >
                                        Update permissions
                                    </div>
                                </div>
                            )}
                            {props?.payload?.functype == 'add' && (
                                <Form
                                    size={'lg'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={
                                        cookies.get('userInfo')?.permissions?.some((p) => p.permissionId === 44) && cookies.get('userInfo')?.merchantId
                                            ? [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                              ]
                                            : props?.payload?.type == 'merchant'
                                            ? [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypeContext,
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
                                                      disabled: fetchMerchantsQuery?.loading,
                                                  },
                                              ]
                                            : props?.payload?.type == 'employee' && props?.payload?.employeeType != 'inventory'
                                            ? [
                                                  { name: 'Name', attr: 'name', size: '6' },

                                                  { name: 'Email', attr: 'email', size: '6' },
                                                  { name: 'Phone number', attr: 'phone', type: 'number', size: '6' },
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypeContext,
                                                      size: '6',
                                                  },
                                                  {
                                                      name: 'Employee Type',
                                                      attr: 'employeeType',
                                                      type: 'select',
                                                      options: employeeTypeContext,
                                                      size: '6',
                                                  },
                                                  {
                                                      title: 'Hub',
                                                      filter: filterHubs,
                                                      setfilter: setfilterHubs,
                                                      options: fetchHubsQuery,
                                                      optionsAttr: 'paginateHubs',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '6',
                                                      attr: 'hubID',
                                                      type: 'fetchSelect',
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
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypeContext,
                                                      size: '6',
                                                  },
                                                  {
                                                      name: 'Employee Type',
                                                      attr: 'employeeType',
                                                      type: 'select',
                                                      options: employeeTypeContext,
                                                      size: '6',
                                                  },

                                                  {
                                                      title: 'Hub',
                                                      filter: filterHubs,
                                                      setfilter: setfilterHubs,
                                                      options: fetchHubsQuery,
                                                      optionsAttr: 'paginateHubs',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '6',
                                                      attr: 'hubID',
                                                      type: 'fetchSelect',
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
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: userTypeContext,
                                                      size: '6',
                                                  },
                                              ]
                                    }
                                    payload={props?.payload}
                                    setpayload={props?.setpayload}
                                    button1disabled={buttonLoadingContext}
                                    button1class={generalstyles.roundbutton + '  mr-2 '}
                                    button1placeholder={props?.payload?.functype == 'add' ? lang.add : lang.edit}
                                    button1onClick={() => {
                                        const payload = props?.payload || {};

                                        let requiredFields = ['name', 'email', 'phone']; // Default required fields

                                        if (payload.type === 'merchant') {
                                            if (cookies.get('merchantId') != undefined) {
                                                requiredFields.push('type');
                                            } else {
                                                requiredFields.push('type', 'merchant');
                                            }
                                        } else if (payload.type === 'employee' && payload.employeeType !== 'inventory') {
                                            requiredFields.push('type', 'employeeType', 'hubID', 'commission', 'salary', 'currency');
                                        } else if (payload.type === 'employee' && payload.employeeType === 'inventory') {
                                            requiredFields.push('type', 'employeeType', 'hubID', 'inventoryId', 'commission', 'salary', 'currency');
                                        } else {
                                            requiredFields.push('type');
                                        }

                                        const emptyFields = requiredFields.filter((field) => !payload[field]);

                                        // Replace "hubID" with "hub" in the warning message
                                        const formattedFields = emptyFields.map((field) => (field === 'hubID' ? 'hub' : field));

                                        if (formattedFields.length > 0) {
                                            NotificationManager.warning('', `Please fill in all required fields: ${formattedFields.join(', ')}`);
                                            return;
                                        }

                                        // Email validation
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        if (!emailRegex.test(payload.email)) {
                                            NotificationManager.warning('', 'Please enter a valid email address');
                                            return;
                                        }

                                        // Phone number validation
                                        if (!isPhoneValidContext(payload.phone)) {
                                            NotificationManager.warning('', 'Please enter a valid phone number');
                                            return;
                                        }

                                        handleAddUser();
                                    }}
                                    button2disabled={buttonLoadingContext}
                                    button2={props?.payload?.functype == 'edit'}
                                    button2class={generalstyles.roundbutton + '  mr-2 '}
                                    button2placeholder={'Delete'}
                                    button2onClick={() => {
                                        handleDeleteUser();
                                    }}
                                />
                            )}
                            {props?.payload?.functype == 'edit' && props?.payload?.modaltype == 'permissions' && (
                                <div class="row m-0 w-100">
                                    {userPermissions?.map((item, index) => {
                                        return (
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100">
                                                    <div class="col-lg-12 p-0 mb-2 text-capitalize" style={{ fontWeight: 500 }}>
                                                        {item?.type}
                                                    </div>
                                                    {item?.permissions?.map((permission, permissionIndex) => {
                                                        return (
                                                            <div class={' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 mr-2 mb-2 text-capitalize '}>
                                                                {permission?.permission?.name?.split(/(?=[A-Z])/).join(' ')}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            <Modal
                show={changepermissionsmodal}
                onHide={() => {
                    setchangepermissionsmodal(false);
                }}
                centered
                size={'xl'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 col-md-10 pt-3 ">
                            <div className="row w-100 m-0 p-0">Change Permissions</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setchangepermissionsmodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <AddEditSecuritylayers payload={props?.payload} setopenModal={props?.setopenModal} setchangepermissionsmodal={setchangepermissionsmodal} edit={true} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default UserInfo;
