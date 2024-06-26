import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BiShowAlt } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import reviewsstyles from './reviews.module.css';
import Select, { components } from 'react-select';

// Icons
import API from '../../../API/API.js';
import UserInfo from './UserInfo.js';
import { FiPlus } from 'react-icons/fi';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import UsersTable from './UsersTable.js';
import Pagination from '../../Pagination.js';

const { ValueContainer, Placeholder } = components;

const Users = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);

    const [payload, setpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: '',
        phone: '',
        email: '',
        birthdate: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchusers = useQueryGQL('', fetchUsers(), filterUsers);
    useEffect(() => {
        setpageactive_context('/users');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Users
                    </p>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {fetchusers?.data?.paginateUsers?.data?.length} </span>
                        </p>
                    </div>
                    {isAuth([1, 44]) && (
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1'}
                                onClick={() => {
                                    setpayload({
                                        functype: 'add',
                                        id: 'add',
                                        name: '',
                                        type: '',
                                        phone: '',
                                        email: '',
                                        birthdate: '',
                                    });
                                    setopenModal(true);
                                }}
                            >
                                Add User
                            </button>
                        </div>
                    )}

                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    {isAuth([1, 43]) && (
                        <>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchusers?.data?.paginateUsers?.cursor?.beforeCursor}
                                    afterCursor={fetchusers?.data?.paginateUsers?.cursor?.afterCursor}
                                    filter={filterUsers}
                                    setfilter={setfilterUsers}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                <UsersTable fetchusers={fetchusers} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <UserInfo openModal={openModal} setopenModal={setopenModal} payload={payload} setpayload={setpayload} refetchUsers={fetchusers.refetch} />
        </div>
    );
};
export default Users;
