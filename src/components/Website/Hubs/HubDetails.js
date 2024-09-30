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
import UsersTable from '../Users/UsersTable.js';
import Pagination from '../../Pagination.js';

const { ValueContainer, Placeholder } = components;

const HubDetails = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { userRolesContext, userTypeContext, employeeTypeContext, chosenHubContext, setchosenHubContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, createHub, editUserType, fetchMerchants, fetchInventories, fetchGovernorates } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        hubId: parseInt(queryParameters.get('id')),
    });

    const fetchusers = useQueryGQL('', fetchUsers(), filterUsers);
    return (
        <>
            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                <div class={' row m-0 w-100 allcentered'}>
                    <div class="col-lg-12 p-0">
                        {chosenHubContext != undefined && (
                            <>
                                <div class={' row m-0 w-100 px-4'}>
                                    <div style={{ cursor: props?.clickable ? 'pointer' : '' }} className={' col-lg-12 p-1'}>
                                        <div class={generalstyles.card + ' row m-0 w-100 '}>
                                            <div className="col-lg-12 p-0">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                        # {chosenHubContext?.id}
                                                    </span>{' '}
                                                    <div>{chosenHubContext?.name}</div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 p-0 my-2">
                                                <hr className="m-0" />
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100">
                                                    <div class="col-lg-3 mb-3">
                                                        <div class="row m-0 w-100">
                                                            <div class="form__group field">
                                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                                    Governorate ID
                                                                </label>
                                                                <div>{chosenHubContext?.governorateId}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-3 mb-3">
                                                        <div class="row m-0 w-100">
                                                            <div class="form__group field">
                                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                                    Location (Longitude, Latitude)
                                                                </label>
                                                                <div>
                                                                    {'{'} {chosenHubContext?.location?.long}, {chosenHubContext?.location?.lat} {'}'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class={' row m-0 w-100 px-4'}>
                                    <div style={{ cursor: props?.clickable ? 'pointer' : '' }} className="col-lg-12 p-0">
                                        <div class={' row m-0 w-100 '}>
                                            <div className="col-lg-12 p-1 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <span class="mr-1">Hub Users</span>{' '}
                                                </div>
                                            </div>

                                            <div class="col-lg-12 p-1 ">
                                                <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center '}>
                                                    <div class="col-lg-11 p-0">
                                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                                            <input
                                                                // disabled={props?.disabled}
                                                                // type={props?.type}
                                                                class={formstyles.form__field}
                                                                value={search}
                                                                placeholder={'Search by name, email, or phone'}
                                                                onChange={(event) => {
                                                                    setSearch(event.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-1 allcenered">
                                                        <button
                                                            onClick={() => {
                                                                setfilterUsers({ ...filterUsers, name: search?.length == 0 ? undefined : search });
                                                            }}
                                                            style={{ height: '25px', minWidth: 'fit-content', marginInlineStart: '5px' }}
                                                            class={generalstyles.roundbutton + '  allcentered'}
                                                        >
                                                            search
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                                <UsersTable fetchusers={fetchusers} card="col-lg-4 p-1" />
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <Pagination
                                                    beforeCursor={fetchusers?.data?.paginateUsers?.cursor?.beforeCursor}
                                                    afterCursor={fetchusers?.data?.paginateUsers?.cursor?.afterCursor}
                                                    filter={filterUsers}
                                                    setfilter={setfilterUsers}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default HubDetails;
