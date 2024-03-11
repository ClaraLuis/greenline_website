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

const { ValueContainer, Placeholder } = components;

const UsersTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);

    const [leadpayload, setleadpayload] = useState({
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

    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/users');
    }, []);

    return (
        <>
            {props?.fetchusers?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.fetchusers?.loading && props?.fetchusers?.data != undefined && (
                <>
                    {props?.fetchusers?.data?.paginateUsers?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Users
                                </div>
                            </div>
                        </div>
                    )}
                    {props?.fetchusers?.data?.length != 0 && (
                        <table style={{}} className={'table'}>
                            <thead>
                                <th style={{ minWidth: '100px' }} class="col-lg-1">
                                    Manage
                                </th>
                                <th>Name</th>

                                <th>{lang.email}</th>

                                <th>{lang.phonenumber}</th>
                            </thead>
                            <tbody>
                                {props?.fetchusers?.data?.paginateUsers?.data?.map((item, index) => {
                                    return (
                                        <tr>
                                            <td style={{ minWidth: '100px' }} class="col-lg-1">
                                                <BiShowAlt
                                                    onClick={() => {
                                                        var temp = { ...item };
                                                        temp.functype = 'edit';
                                                        setleadpayload({ ...temp });
                                                        setopenModal(true);
                                                    }}
                                                    size={20}
                                                    class={reviewsstyles.icon + ' ml-2'}
                                                />
                                            </td>

                                            <td>
                                                <p className={' m-0 p-0 wordbreak '}>{item?.name}</p>
                                            </td>

                                            <td>
                                                <p className={' m-0 p-0 wordbreak '}>{item?.email}</p>
                                            </td>

                                            <td>
                                                <p className={' m-0 p-0 wordbreak '}>{item?.phone}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    {/* <Pagespaginatecomponent
                                totaldatacount={FetchUsers?.data?.data?.total}
                                numofitemsperpage={FetchUsers?.data?.data?.per_page}
                                pagenumbparams={FetchUsers?.data?.data?.current_page}
                                nextpagefunction={(nextpage) => {
                                    history.push({
                                        pathname: '/users',
                                        search: '&page=' + nextpage,
                                    });
                                }}
                            /> */}
                </>
            )}
        </>
    );
};
export default UsersTable;
