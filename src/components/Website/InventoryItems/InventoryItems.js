import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import API from '../../../API/API.js';
import ItemInfo from './ItemInfo.js';
import OrderInfo from './OrderInfo.js';

const { ValueContainer, Placeholder } = components;

const InventoryItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [openOrderModal, setopenOrderModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const [itemsarrayhistory, setitemsarrayhistory] = useState([
        { sku: '123', name: 'item 1', type: 'import', count: 15, inventory: 'inv 1' },
        { sku: '123', name: 'item 1', type: 'export', count: 30, inventory: 'inv 1' },
        { sku: '123', name: 'item 1', type: 'import', count: 15, inventory: 'inv 3' },
        { sku: '123', name: 'item 1', type: 'export', count: 30, inventory: 'inv 3' },
        { sku: '123', name: 'item 1', type: 'export', count: 30, inventory: 'inv 3' },
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
        setpageactive_context('/inventoryitems');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Inventories
                    </p>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Inventories </span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0 ">
                        <div style={{ width: '100px', overflowY: 'scroll', flexDirection: 'row', flexWrap: 'nowrap' }} class=" scrollmenuclasssubscrollbar row m-0 w-100">
                            {[...Array(4)].map((element, arrayindex) => {
                                return (
                                    <div style={{ fontSize: '13px' }} class="card col-lg-2">
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-12 p-0 mb-1 " style={{ fontSize: '15px' }}>
                                                Inv {arrayindex + 1}
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <hr class="p-0 m-0" />
                                            </div>
                                            <div class="col-lg-12 p-0 mt-2">
                                                <span>Location: </span>
                                                <span style={{ fontWeight: 600 }}> ll</span>
                                            </div>
                                            <div class="col-lg-12 p-0 mt-1">
                                                <span>Items: </span>
                                                <span style={{ fontWeight: 600 }}> 100</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 p-2 mb-2'}>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-start mb-2 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Items </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-2 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                            <span
                                onClick={() => {
                                    history.push('/hubitems');
                                }}
                                class="text-primary text-secondaryhover"
                                style={{ textDecoration: 'underline' }}
                            >
                                View all
                            </span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        {fetchusers?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                    </div>
                    {itemsarray.map((element, arrayindex) => {
                        return (
                            <div style={{ fontSize: '13px' }} class=" col-lg-4 p-2 mb-1">
                                <div class="row m-0 w-100 card">
                                    <div class=" mr-2" style={{ width: '45px', height: '45px' }}>
                                        <img
                                            src={'https://www.shutterstock.com/image-vector/new-label-shopping-icon-vector-260nw-1894227709.jpg'}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div class="col-lg-7 p-0 mb-1 mt-2 " style={{ fontSize: '15px' }}>
                                        {element.name} <span style={{ fontSize: '12px', color: 'var(--primary)' }}>({element.sku})</span>
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <hr class="p-0 m-0" />
                                    </div>
                                    <div class="col-lg-12 p-0 mt-2">
                                        <span>Size: </span>
                                        <span style={{ fontWeight: 600 }}> {element.size}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Color: </span>
                                        <span style={{ fontWeight: 600 }}> {element.color}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Count in Inventory: </span>
                                        <span style={{ fontWeight: 600 }}> {element.countinventory}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Merchant: </span>
                                        <span style={{ fontWeight: 600 }}> {element.merchantname}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span
                                            onClick={() => {
                                                setleadpayload({ ...element });
                                                setopenModal(true);
                                            }}
                                            class="text-primary text-secondaryhover"
                                            style={{ textDecoration: 'underline' }}
                                        >
                                            Show item history
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 p-2 mb-2'}>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-start mb-2 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Orders </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-2 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                            <span
                                onClick={() => {
                                    history.push('/orders');
                                }}
                                class="text-primary text-secondaryhover"
                                style={{ textDecoration: 'underline' }}
                            >
                                View all
                            </span>
                        </p>
                    </div>
                    {itemsarray.map((element, arrayindex) => {
                        return (
                            <div style={{ fontSize: '13px' }} class=" col-lg-4 p-2 mb-1">
                                <div class="row m-0 w-100 card">
                                    <div class="col-lg-12 p-0 mb-1 mt-2 " style={{ fontSize: '15px' }}>
                                        Order <span style={{ fontSize: '12px', color: 'var(--primary)' }}>(123)</span>
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <hr class="p-0 m-0" />
                                    </div>
                                    <div class="col-lg-12 p-0 mt-2">
                                        <span>Items: </span>
                                        <span style={{ fontWeight: 600 }}> 4</span>
                                    </div>

                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Merchant: </span>
                                        <span style={{ fontWeight: 600 }}> {element.merchantname}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span
                                            onClick={() => {
                                                setleadpayload({ ...element });
                                                setopenOrderModal(true);
                                            }}
                                            class="text-primary text-secondaryhover"
                                            style={{ textDecoration: 'underline' }}
                                        >
                                            Show order
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start mb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Items history </span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
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
                                            <FaLayerGroups size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No History
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {fetchusers?.data?.length != 0 && (
                                    <table style={{}} className={'table text-capitalize'}>
                                        <thead>
                                            <th>SKU</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Count</th>
                                            <th>inventory</th>
                                        </thead>
                                        <tbody>
                                            {itemsarrayhistory?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.sku}</p>
                                                        </td>{' '}
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.name}</p>
                                                        </td>
                                                        <td>
                                                            <p className={item?.type == 'import' ? ' text-success m-0 p-0 wordbreak ' : ' text-danger m-0 p-0 wordbreak '}>{item?.type}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.count}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.inventory}</p>
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

            <ItemInfo openModal={openModal} setopenModal={setopenModal} leadpayload={leadpayload} setleadpayload={setleadpayload} refetchUsers={fetchusers.refetch} />
            <OrderInfo openModal={openOrderModal} setopenModal={setopenOrderModal} leadpayload={leadpayload} setleadpayload={setleadpayload} refetchUsers={fetchusers.refetch} />
        </div>
    );
};
export default InventoryItems;
