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
import TransactionsTable from '../Finance/TransactionsTable.js';
import OrdersTable from '../Orders/OrdersTable.js';
import ItemsTable from '../HubItems/ItemsTable.js';

const { ValueContainer, Placeholder } = components;

const MerchantHome = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

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

    const fetchusers = useQueryGQL('', fetchUsers());
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/merchanthome');
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Dashboard
                    </p>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Finance</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Orders</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <OrdersTable />
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Items</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <ItemsTable />
                    </div>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        {fetchusers?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!fetchusers?.loading && fetchusers?.data != undefined && (
                            <>
                                {fetchusers?.data?.paginateUsers?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Users
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {fetchusers?.data?.length != 0 && (
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th>Name</th>

                                            <th>Size</th>

                                            <th>Color</th>
                                            <th>Count in Inventory</th>
                                            <th>Merchant name</th>
                                        </thead>
                                        <tbody>
                                            {itemsarray?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.name}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.size}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.color}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.countinventory}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.merchantname}</p>
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
                    </div>
                </div>
            </div>

            <UserInfo openModal={openModal} setopenModal={setopenModal} leadpayload={leadpayload} setleadpayload={setleadpayload} refetchUsers={fetchusers.refetch} />
        </div>
    );
};
export default MerchantHome;
