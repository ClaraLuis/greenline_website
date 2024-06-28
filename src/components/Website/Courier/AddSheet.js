import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp, BsTrash } from 'react-icons/bs';
import API from '../../../API/API.js';
import ItemsTable from '../MerchantItems/ItemsTable.js';
import Users from '../Users/Users.js';
import AddressInfo from '../Users/AddressInfo.js';
import Form from '../../Form.js';
import OrdersTable from '../Orders/OrdersTable.js';
import { FiCheckCircle } from 'react-icons/fi';
import { NotificationManager } from 'react-notifications';
import { MdOutlineLocationOn } from 'react-icons/md';

const { ValueContainer, Placeholder } = components;

const AddSheet = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusesContext, user } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchOrders, addCourierSheet, useMutationGQL, fetchCouriers } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [sheetpayload, setsheetpayload] = useState({
        functype: 'add',
        name: '',
        courier: '',
        orders: [],
        orderIds: [],
    });
    const [tabs, settabs] = useState([
        { name: 'Sheet orders', isChecked: true },
        { name: 'Sheet Info', isChecked: false },
    ]);
    const [userAddresses, setuserAddresses] = useState([
        { id: '1', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
        { id: '2', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
        { id: '3', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
        { id: '4', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
    ]);
    const [search, setsearch] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [addresspayload, setaddresspayload] = useState({
        functype: 'add',
        country: '',
        city: '',
        details: '',
    });

    const [filterorders, setfilterorders] = useState({
        statuses: [], //arrivedToHub
        limit: 20,
        orderIds: undefined,
    });
    const fetchOrdersQuery = useQueryGQL('', fetchOrders(), filterorders); //network only
    const [filterCouriers, setfilterCouriers] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchCouriersQuery = useQueryGQL('', fetchCouriers(), filterCouriers);

    const [addCourierSheetMutation] = useMutationGQL(addCourierSheet(), {
        userId: sheetpayload?.courier,
        orderIds: sheetpayload?.orderIds,
    });

    const handleAddCourierSheet = async () => {
        try {
            const { data } = await addCourierSheetMutation();
            if (data?.createCourierSheet?.success == true) {
                history.push('/couriersheets');
            } else {
                NotificationManager.warning(data?.createCourierSheet?.message, 'Warning!');
            }
        } catch (error) {
            // console.error('Error adding user:', error);
        }
    };
    useEffect(() => {
        setpageactive_context('/addsheet');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' row m-0 p-0 w-100'}>
                    <div className={' col-lg-8 p-1 py-0 '}>
                        <div class="row m-0 w-100">
                            <div class="col-lg-10 p-0 ">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        class={formstyles.form__field}
                                        value={search}
                                        placeholder={'Search by order ID'}
                                        onChange={(event) => {
                                            setsearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-2 p-0 allcentered">
                                <button
                                    style={{ height: '30px', minWidth: '80%' }}
                                    class={generalstyles.roundbutton + ' allcentered p-0'}
                                    onClick={() => {
                                        var temp = [parseInt(search)];
                                        setfilterorders({ ...filterorders, orderIds: temp });
                                    }}
                                >
                                    search
                                </button>
                            </div>

                            <div className="row m-0 w-100 mt-2">
                                {fetchOrdersQuery?.data?.paginateOrders?.data?.map((item, index) => {
                                    var selected = false;
                                    sheetpayload?.orders?.map((orderitem, orderindex) => {
                                        if (orderitem?.id == item?.id) {
                                            selected = true;
                                        }
                                    });
                                    return (
                                        <>
                                            <div className="col-lg-6 p-1">
                                                <div
                                                    onClick={() => {
                                                        var temp = { ...sheetpayload };
                                                        var exist = false;
                                                        var chosenindex = null;
                                                        temp.orders.map((i, ii) => {
                                                            if (i.id == item.id) {
                                                                exist = true;
                                                                chosenindex = ii;
                                                            }
                                                        });
                                                        if (!exist) {
                                                            temp.orders.push(item);
                                                            temp.orderIds.push(item.id);
                                                        } else {
                                                            temp.orders.splice(chosenindex, 1);
                                                            temp.orderIds.splice(chosenindex, 1);
                                                        }
                                                        setsheetpayload({ ...temp });
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                    class={generalstyles.card + ' p-3 row m-0 w-100 allcentered '}
                                                >
                                                    <div className="col-lg-6 p-0">
                                                        <span style={{ fontWeight: 700 }}># {item?.id}</span>
                                                    </div>
                                                    <div className="col-lg-6 p-0 d-flex justify-content-end align-items-center">
                                                        <div
                                                            className={
                                                                item.status == 'delivered'
                                                                    ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  '
                                                                    : item?.status == 'postponed' || item?.status == 'failedDeliveryAttempt'
                                                                    ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 allcentered '
                                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered '
                                                            }
                                                        >
                                                            {orderStatusesContext?.map((i, ii) => {
                                                                if (i.value == item?.status) {
                                                                    return <span>{i.label}</span>;
                                                                }
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 p-0 my-2">
                                                        <hr className="m-0" />
                                                    </div>
                                                    <div className="col-lg-12 p-0 mb-2">
                                                        <span style={{ fontWeight: 600, fontSize: '16px' }}>{item?.merchant?.name}</span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                        <MdOutlineLocationOn class="mr-1" />
                                                        <span style={{ fontWeight: 400 }}>
                                                            {item?.address?.city}, {item?.address?.country}
                                                        </span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 ">
                                                        <span style={{ fontWeight: 600 }}>
                                                            {item?.address?.streetAddress}, {item?.address?.buildingNumber}, {item?.address?.apartmentFloor}
                                                        </span>
                                                    </div>
                                                    {selected && (
                                                        <div
                                                            style={{
                                                                width: '35px',
                                                                height: '35px',
                                                                position: 'absolute',
                                                                bottom: 20,
                                                                right: 10,
                                                            }}
                                                            className=" allcentered"
                                                        >
                                                            <FiCheckCircle style={{ transition: 'all 0.4s' }} color={selected ? 'var(--success)' : ''} size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-3 px-1">
                        <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3 scrollmenuclasssubscrollbar'} style={{ overflow: 'scroll' }}>
                            <div class="col-lg-12">
                                {sheetpayload?.orders?.length != 0 && (
                                    <>
                                        <div class="col-lg-12 pb-2 px-0 " style={{ fontSize: '17px', fontWeight: 700 }}>
                                            Orders ({sheetpayload?.orders?.length})
                                        </div>
                                        <div class="col-lg-12 p-0">
                                            <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                                {sheetpayload?.orders?.map((item, index) => {
                                                    return (
                                                        <div class={' col-lg-12 p-0'}>
                                                            <div class={generalstyles.filter_container + ' p-2 row m-0 mb-2 w-100 allcentered'}>
                                                                <div style={{ fontWeight: 700 }} class="col-lg-10 p-0 mb-2">
                                                                    # {item?.id}
                                                                </div>
                                                                <div class="col-lg-2 p-0 allcentered">
                                                                    <BsTrash
                                                                        onClick={() => {
                                                                            var temp = { ...sheetpayload };
                                                                            temp.orders.splice(index, 1);
                                                                            temp.orderIds.splice(index, 1);
                                                                            setsheetpayload({ ...temp });
                                                                        }}
                                                                        class="text-danger text-dangerhover"
                                                                        // size={20}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-12 p-0 my-2">
                                                                    <hr className="m-0" />
                                                                </div>
                                                                <div class="col-lg-12 p-0 wordbreak">
                                                                    <div class="row m-0 w-100">
                                                                        <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                                            <MdOutlineLocationOn class="mr-1" />

                                                                            <span style={{}}>
                                                                                {item?.address?.city}, {item?.address?.country}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-lg-12 p-0 ">
                                                                            <span style={{ fontWeight: 600 }}>
                                                                                {item?.address?.streetAddress}, {item?.address?.buildingNumber}, {item?.address?.apartmentFloor}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    {
                                        title: 'Courier',
                                        filter: filterCouriers,
                                        setfilter: setfilterCouriers,
                                        options: fetchCouriersQuery,
                                        optionsAttr: 'paginateCouriers',
                                        label: 'name',
                                        value: 'id',
                                        size: '12',
                                        attr: 'courier',
                                        type: 'fetchSelect',
                                    },
                                ]}
                                payload={sheetpayload}
                                setpayload={setsheetpayload}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={sheetpayload?.functype == 'add' ? 'Add sheet' : lang.edit}
                                button1onClick={() => {
                                    handleAddCourierSheet();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <AddressInfo openModal={openModal} setopenModal={setopenModal} addresspayload={addresspayload} setaddresspayload={setaddresspayload} />
        </div>
    );
};
export default AddSheet;
