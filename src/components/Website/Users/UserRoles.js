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
import { MdClose, MdEmail } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';

const { ValueContainer, Placeholder } = components;

const UserRoles = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpagetitle_context, userTypeContext, employeeTypeContext, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, addUser, findOneUser, fetchMerchants, fetchInventories, fetchHubs, updateEmployeeInfo, useLazyQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [userPayload, setuserPayload] = useState(undefined);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const groupedRoles = _.groupBy(userPayload?.userRoles, (role) => role.role.type);

    // Transform into desired format
    const userRoles = Object.keys(groupedRoles).map((type) => ({
        type,
        roles: groupedRoles[type],
    }));

    const [findOneUserQuery] = useLazyQueryGQL(findOneUser());

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchUserInfo = async () => {
        try {
            var { data } = await findOneUserQuery({
                variables: {
                    id: queryParameters?.get('id'),
                },
            });
            if (data?.findOneUser) {
                setuserPayload({ ...data?.findOneUser });
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
    };

    useEffect(async () => {
        setpagetitle_context('Settings');
        fetchUserInfo();
    }, [queryParameters?.get('id')]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class="col-lg-6 p-0">
                            <div className="row m-0 w-100">
                                <div class="col-lg-12 p-0" style={{ fontWeight: 600 }}>
                                    {userPayload?.name}
                                </div>
                                <div class="col-lg-12 p-0">
                                    <span class="d-flex align-items-center">
                                        <MdEmail class="mr-1" />
                                        {userPayload?.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {!changerolesmodal && (
                            <div class="col-lg-6 d-flex justify-content-end py-0">
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
                        )}
                    </div>
                </div>
                {!changerolesmodal && (
                    <>
                        <div class="col-lg-12 px-3">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                {userRoles?.map((item, index) => {
                                    return (
                                        <div class="col-lg-12 p-0 mb-2">
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-12 p-0 mb-2 text-capitalize" style={{ fontWeight: 500 }}>
                                                    {item?.type}
                                                </div>
                                                {item?.roles?.map((role, roleIndex) => {
                                                    return (
                                                        <div class={' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 mr-2 mb-2 text-capitalize '}>
                                                            {role?.role?.name?.split(/(?=[A-Z])/).join(' ')}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
                {changerolesmodal && (
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' row m-0 w-100 py-2'}>
                            <AddEditSecuritylayers payload={userPayload} setopenModal={props?.setopenModal} setchangerolesmodal={setchangerolesmodal} edit={true} fetchUserInfo={fetchUserInfo} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default UserRoles;
