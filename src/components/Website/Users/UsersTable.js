import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Dropdown } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaEllipsisV, FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';

import { TbBuilding, TbBuildingWarehouse, TbUserPentagon } from 'react-icons/tb';
import { components } from 'react-select';
// Icons
import { MdEmail, MdOutlinePhone } from 'react-icons/md';
import UserInfo from './UserInfo.js';

const { ValueContainer, Placeholder } = components;

const UsersTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

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
                        <div style={{ minHeight: '70vh' }} class="row m-0 w-100 d-flex align-content-start align-items-start justify-content-start">
                            {props?.fetchusers?.data?.paginateUsers?.data?.map((item, index) => {
                                return (
                                    <div className={props?.card}>
                                        <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                            <div className="col-lg-8 p-0  text-capitalize mb-2">
                                                <span style={{ fontWeight: 700 }}>{item?.name}</span>
                                            </div>

                                            <div className="col-lg-4 p-0 mb-2 d-flex justify-content-end">
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
                                                                    props?.setpayload({
                                                                        ...temp,
                                                                        employeeType: item?.employee?.type,
                                                                        salary: item?.employee?.salary,
                                                                        commission: item?.employee?.commission,
                                                                        modaltype: 'view',
                                                                    });
                                                                    props?.setopenModal(true);
                                                                }}
                                                                class="py-2"
                                                            >
                                                                <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>View</p>
                                                            </Dropdown.Item>
                                                            {item?.type == 'merchant' && !cookies.get('merchantId') && (
                                                                <Dropdown.Item
                                                                    onClick={() => {
                                                                        history.push('/updatemerchant?merchantId=' + item.merchantId);
                                                                    }}
                                                                    class="py-2"
                                                                >
                                                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>View Merchant</p>
                                                                </Dropdown.Item>
                                                            )}
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    const auth = getAuth();
                                                                    sendPasswordResetEmail(auth, item.email)
                                                                        .then(() => {
                                                                            NotificationManager.success('Password reset email sent!', 'Success');
                                                                        })
                                                                        .catch((error) => {
                                                                            const errorCode = error.code;
                                                                            const errorMessage = error.message;
                                                                            NotificationManager.warning(errorMessage, 'Warning');

                                                                            // ..
                                                                        });
                                                                }}
                                                                class="py-2"
                                                            >
                                                                <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Change Password</p>
                                                            </Dropdown.Item>

                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    //     var temp = { ...item };
                                                                    //     temp.functype = 'edit';
                                                                    //     setpayload({
                                                                    //         ...temp,
                                                                    //         employeeType: item?.employee?.type,
                                                                    //         salary: item?.employee?.salary,
                                                                    //         commission: item?.employee?.commission,
                                                                    //         modaltype: 'roles',
                                                                    //     });
                                                                    //     setopenModal(true);
                                                                    history.push('/userroles?id=' + item?.id);
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
                                                    {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                    {item?.employee?.type ? ',' : ''} {item?.employee?.type?.split(/(?=[A-Z])/).join(' ')}
                                                </span>
                                            </div>
                                            {item?.hub && (
                                                <div className="col-lg-12 p-0 mb-1">
                                                    <span style={{ fontWeight: 600 }} class="d-flex align-items-center text-capitalize">
                                                        <TbBuilding class="mr-1" />
                                                        {item?.hub?.name}
                                                    </span>
                                                </div>
                                            )}
                                            {item?.inventory && (
                                                <div className="col-lg-12 p-0 mb-1">
                                                    <span style={{ fontWeight: 600 }} class="d-flex align-items-center text-capitalize">
                                                        <TbBuildingWarehouse class="mr-1" />
                                                        {item?.inventory?.name}
                                                    </span>
                                                </div>
                                            )}

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
        </>
    );
};
export default UsersTable;
