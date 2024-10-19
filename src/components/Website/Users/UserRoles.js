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

const UserRoles = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpagetitle_context, userTypeContext, employeeTypeContext, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, addUser, findOneUser, fetchMerchants, fetchInventories, fetchHubs, updateEmployeeInfo, useLazyQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [edit, setedit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const groupedRoles = _.groupBy(props?.payload?.userRoles, (role) => role.role.type);

    // Transform into desired format
    const userRoles = Object.keys(groupedRoles).map((type) => ({
        type,
        roles: groupedRoles[type],
    }));
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const [filterInventories, setfilterInventories] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const [findOneUserQuery] = useLazyQueryGQL(findOneUser());

    const [addUser1] = useMutationGQL(addUser(), {
        name: props?.payload?.name,
        type: cookies.get('merchantId') != undefined ? 'merchant' : props?.payload?.type,
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

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);
    const [filterHubs, setfilterHubs] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('', fetchHubs(), filterHubs);

    const handleAddUser = async () => {
        setbuttonLoading(true);

        try {
            if (props?.payload.functype == 'edit') {
                var { data } = await updateEmployeeInfoMutation();
                if (data?.updateEmployeeInfo?.success) {
                    props?.setopenModal(false);
                    setedit(false);

                    refetchUsers();
                    NotificationManager.success('', 'Success');
                } else {
                    NotificationManager.warning(data?.updateEmployeeInfo?.message, 'Warning!');
                }
            } else {
                var { data } = await addUser1();
                if (data?.createUser?.success) {
                    props?.setopenModal(false);
                    setedit(false);

                    refetchUsers();
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
        setbuttonLoading(false);
    };
    useEffect(async () => {
        setpagetitle_context('Settings');
        alert(queryParameters?.get('id'));
        try {
            var { data } = await findOneUserQuery({
                variables: {
                    id: queryParameters?.get('id'),
                },
            });
            if (data?.findOneUser) {
            }
        } catch (e) {
            let errorMessage = 'An unexpected error occurred';
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                errorMessage = e.graphQLErrors[0].message || errorMessage;
            } else if (e.networkError) {
                errorMessage = e.networkError.message || errorMessage;
            } else if (e.message) {
                errorMessage = e.message;
            }
            NotificationManager.warning(errorMessage, 'Warning!');
        }
    }, [queryParameters?.get('id')]);
    return (
        <>
            {!changerolesmodal && (
                <>
                    <div class="col-lg-12 d-flex justify-content-end py-0">
                        <div
                            onClick={() => {
                                setchangerolesmodal(true);
                            }}
                            class={generalstyles.roundbutton + ' allcentered'}
                            // style={{ textDecoration: 'underline', fontSize: '12px' }}
                        >
                            Update roles
                        </div>
                    </div>
                </>
            )}
            {changerolesmodal && (
                <>
                    <div class="row m-0 w-100 py-2">
                        <AddEditSecuritylayers payload={props?.payload} setopenModal={props?.setopenModal} setchangerolesmodal={setchangerolesmodal} edit={true} />
                    </div>
                </>
            )}
        </>
    );
};
export default UserRoles;
