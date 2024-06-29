import React, { useContext, useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineLocationOn } from 'react-icons/md';
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import API from '../../../API/API.js';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Form from '../../Form.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

const { ValueContainer, Placeholder } = components;

const AddSheet = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusesContext, user, isAuth } = useContext(Contexthandlerscontext);
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
        statuses: [],
        limit: 20,
        orderIds: undefined,
    });

    const fetchOrdersQuery = useQueryGQL('', fetchOrders(), filterorders);

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

    useEffect(() => {
        setpageactive_context('/addsheet');
    }, []);

    const handleAddCourierSheet = async () => {
        if (isAuth([1, 36, 53])) {
            try {
                const { data } = await addCourierSheetMutation();
                if (data?.createCourierSheet?.success === true) {
                    history.push('/couriersheets');
                } else {
                    NotificationManager.warning(data?.createCourierSheet?.message, 'Warning!');
                }
            } catch (error) {
                console.error('Error adding courier sheet:', error);
            }
        }
    };

    return (
        <div className="row m-0 w-100 p-md-2 pt-2">
            <div className="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className="row m-0 p-0 w-100">
                    <div className={' col-lg-8 p-1 py-0 '}>
                        <div className="row m-0 w-100">
                            <div className="col-lg-10 p-0 ">
                                <div className={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        className={formstyles.form__field}
                                        value={search}
                                        placeholder={'Search by order ID'}
                                        onChange={(event) => {
                                            setsearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 p-0 allcentered">
                                <button
                                    style={{ height: '30px', minWidth: '80%' }}
                                    className={generalstyles.roundbutton + ' allcentered p-0'}
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
                                        if (orderitem?.id === item?.id) {
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
                                                            if (i.id === item.id) {
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
                                                    className={generalstyles.card + ' p-3 row m-0 w-100 allcentered '}
                                                >
                                                    <div className="col-lg-6 p-0">
                                                        <span style={{ fontWeight: 700 }}># {item?.id}</span>
                                                    </div>
                                                    <div className="col-lg-6 p-0 d-flex justify-content-end align-items-center">
                                                        <div
                                                            className={
                                                                item.status === 'delivered'
                                                                    ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  '
                                                                    : item?.status === 'postponed' || item?.status === 'failedDeliveryAttempt'
                                                                    ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 allcentered '
                                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered '
                                                            }
                                                        >
                                                            {orderStatusesContext?.map((i, ii) => {
                                                                if (i.value === item?.status) {
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
                                                        <MdOutlineLocationOn className="mr-1" />
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
                    <div className="col-lg-4 mb-3 px-1">
                        <div className={generalstyles.card + ' row m-0 w-100 p-2 py-3 scrollmenuclasssubscrollbar'} style={{ overflow: 'scroll' }}>
                            <div className="col-lg-12">
                                {sheetpayload?.orders?.length !== 0 && (
                                    <>
                                        <div className="col-lg-12 pb-2 px-0 " style={{ fontSize: '17px', fontWeight: 700 }}>
                                            Orders ({sheetpayload?.orders?.length})
                                        </div>
                                        <div className="col-lg-12 p-0">
                                            <div style={{ maxHeight: '40vh', overflow: 'scroll' }} className="row m-0 w-100 scrollmenuclasssubscrollbar">
                                                {sheetpayload?.orders?.map((item, index) => {
                                                    return (
                                                        <div className={' col-lg-12 p-0'}>
                                                            <div className={generalstyles.filter_container + ' p-2 row m-0 mb-2 w-100 allcentered'}>
                                                                <div style={{ fontWeight: 700 }} className="col-lg-10 p-0 mb-2">
                                                                    # {item?.id}
                                                                </div>
                                                                <div className="col-lg-2 p-0 allcentered">
                                                                    <IoMdClose
                                                                        onClick={() => {
                                                                            var temp = { ...sheetpayload };
                                                                            temp.orders.splice(index, 1);
                                                                            temp.orderIds.splice(index, 1);
                                                                            setsheetpayload({ ...temp });
                                                                        }}
                                                                        className="text-danger text-dangerhover"
                                                                        // size={20}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-12 p-0 my-2">
                                                                    <hr className="m-0" />
                                                                </div>
                                                                <div className="col-lg-12 p-0 wordbreak">
                                                                    <div className="row m-0 w-100">
                                                                        <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                                            <MdOutlineLocationOn className="mr-1" />

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
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={sheetpayload?.functype === 'add' ? 'Add sheet' : lang.edit}
                                button1onClick={handleAddCourierSheet}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSheet;
