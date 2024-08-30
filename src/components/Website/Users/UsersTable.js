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
import { FaEllipsisV, FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import { Dropdown } from 'react-bootstrap';

import reviewsstyles from './reviews.module.css';
import Select, { components } from 'react-select';
import { TbUserPentagon } from 'react-icons/tb';
// Icons
import API from '../../../API/API.js';
import UserInfo from './UserInfo.js';
import { FiPlus } from 'react-icons/fi';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { MdEmail, MdOutlinePhone } from 'react-icons/md';
import { CiUnlock } from 'react-icons/ci';
import { RiSettings4Line } from 'react-icons/ri';

const { ValueContainer, Placeholder } = components;

const UsersTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);

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
                        <div class="row m-0 w-100">
                            {props?.fetchusers?.data?.paginateUsers?.data?.map((item, index) => {
                                return (
                                    <div className="col-lg-4 p-1">
                                        <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                            <div className="col-lg-6 p-0  text-capitalize mb-2">
                                                <span style={{ fontWeight: 700 }}>{item?.name}</span>
                                            </div>

                                            <div className="col-lg-6 p-0 mb-2 d-flex justify-content-end">
                                                {item?.id?.length != 7 && isAuth([1, 46, 52]) && (
                                                    <Dropdown>
                                                        <Dropdown.Toggle>
                                                            <div
                                                                class="iconhover allcentered ml-1"
                                                                style={{
                                                                    color: 'var(--primary)',
                                                                    // borderRadius: '10px',
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    transition: 'all 0.4s',
                                                                }}
                                                            >
                                                                <FaEllipsisV />
                                                            </div>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu style={{ minWidth: '170px', fontSize: '12px' }}>
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    var temp = { ...item };

                                                                    temp.functype = 'edit';
                                                                    setpayload({
                                                                        ...temp,
                                                                        employeeType: item?.employee?.type,
                                                                        salary: item?.employee?.salary,
                                                                        commission: item?.employee?.commission,
                                                                        modaltype: 'view',
                                                                    });
                                                                    setopenModal(true);
                                                                }}
                                                                class="py-2"
                                                            >
                                                                <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>View</p>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    var temp = { ...item };
                                                                    temp.functype = 'edit';
                                                                    setpayload({
                                                                        ...temp,
                                                                        employeeType: item?.employee?.type,
                                                                        salary: item?.employee?.salary,
                                                                        commission: item?.employee?.commission,
                                                                        modaltype: 'roles',
                                                                    });
                                                                    setopenModal(true);
                                                                }}
                                                                class="py-2"
                                                            >
                                                                <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Update Roles</p>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    // <div
                                                    //     onClick={() => {
                                                    //         var temp = { ...item };
                                                    //         temp.functype = 'edit';
                                                    //         setpayload({ ...temp, employeeType: item?.employee?.type, salary: item?.employee?.salary, commission: item?.employee?.commission });
                                                    //         setopenModal(true);
                                                    //     }}
                                                    //     style={{
                                                    //         width: '35px',
                                                    //         height: '35px',
                                                    //     }}
                                                    //     className="iconhover allcentered"
                                                    // >
                                                    //     <CiUnlock style={{ transition: 'all 0.4s' }} size={20} />
                                                    // </div>
                                                )}
                                                {item?.id?.length == 7 && (
                                                    <div
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        className=" allcentered"
                                                    >
                                                        <div class=" wordbreak text-danger bg-light-danger rounded-pill font-weight-600 allcentered ">inactive</div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-lg-12 p-0 mb-1">
                                                <span style={{ fontWeight: 600 }} class="d-flex align-items-center">
                                                    <MdEmail class="mr-1" />
                                                    {item?.email}
                                                </span>
                                            </div>
                                            <div className="col-lg-12 p-0 mb-1">
                                                <span style={{ fontWeight: 600 }} class="d-flex align-items-center text-capitalize">
                                                    <TbUserPentagon class="mr-1" />
                                                    {item?.type?.split(/(?=[A-Z])/).join(' ')} {item?.employee?.type?.split(/(?=[A-Z])/).join(' ')}
                                                </span>
                                            </div>
                                            <div className="col-lg-12 p-0 ">
                                                <span style={{ fontWeight: 600 }} class="d-flex align-items-center">
                                                    <MdOutlinePhone class="mr-1" />
                                                    {item?.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
            <UserInfo openModal={openModal} setopenModal={setopenModal} payload={payload} setpayload={setpayload} />
        </>
    );
};
export default UsersTable;
