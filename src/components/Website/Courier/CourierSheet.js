import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { IoMdClose } from 'react-icons/io';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { Modal } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemPanel } from 'react-accessible-accordion';
import API from '../../../API/API.js';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { NotificationManager } from 'react-notifications';
import { FaCheck } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import Form from '../../Form.js';
import Select from 'react-select';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import Inputfield from '../../Inputfield.js';

const CourierSheet = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, courierSheetStatusesContext, dateformatter, orderStatusEnumContext, isAuth } = useContext(Contexthandlerscontext);
    const { useLazyQueryGQL, useQueryGQL, fetchCourierSheet, updateCourierSheet, useMutationGQL, updateOrdersStatus } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [changestatusmodal, setchangestatusmodal] = useState(false);

    const [sheetID, setsheetID] = useState(null);
    const [submitSheetPayload, setsubmitSheetPayload] = useState({});
    const [type, settype] = useState('');
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [updateStatusButtonLoading, setupdateStatusButtonLoading] = useState(false);

    const [fetchCourierSheetLazyQuery] = useLazyQueryGQL(fetchCourierSheet());
    const [fetchCourierSheetQuery, setfetchCourierSheetQuery] = useState({});
    const [statuspayload, setstatuspayload] = useState({
        step: 0,
        orderid: '',
        status: '',
        fullDelivery: true,
    });
    useEffect(() => {
        setpageactive_context('/CourierSheet');
        if (queryParameters.get('id')) {
            setsheetID(queryParameters.get('id'));
        }
        if (queryParameters.get('type')) {
            settype(queryParameters.get('type'));
        }
    }, []);
    const [updateCourierSheetMutation] = useMutationGQL(updateCourierSheet(), {
        id: submitSheetPayload?.id,
        // ordersCount: submitSheetPayload?.orderCount,
        asAdmin: type == 'admin' && isAuth([1]) ? true : false,
        updateSheetOrders: submitSheetPayload?.updateSheetOrders
            ?.filter((item) => item.status === 'adminAccepted' || item.status === 'financeAccepted')
            .map((item) => ({
                ...item,
                orderId: undefined,
            })),
    });

    const calculateAmountCollected = () => {
        var amount = 0;
        var orderItemsAmount = 0;
        statuspayload?.order?.orderItems?.map((i) => {
            orderItemsAmount += parseFloat(i.unitPrice) * parseInt(i.count);
        });
        if (statuspayload?.order?.originalPrice) {
            if (statuspayload?.shippingCollected) {
                amount = parseFloat(statuspayload?.order?.shippingPrice) + parseFloat(statuspayload?.orderItemsAmount);
            } else {
                amount = parseFloat(statuspayload?.orderItemsAmount);
            }
            return amount;
        } else if (!statuspayload?.order?.originalPrice && !statuspayload?.fullDelivery) {
            if (statuspayload?.shippingCollected) {
                amount = parseFloat(statuspayload?.order?.shippingPrice) + parseFloat(statuspayload?.amountCollected);
            } else {
                amount = parseFloat(statuspayload?.amountCollected);
            }
            return amount;
        } else if (!statuspayload?.order?.originalPrice && statuspayload?.fullDelivery) {
            if (statuspayload?.shippingCollected) {
                amount = parseFloat(statuspayload?.order?.shippingPrice) + parseFloat(statuspayload?.price);
            } else {
                amount = parseFloat(statuspayload?.price);
            }
            return amount;
        }
    };
    const [updateOrdersStatusMutation] = useMutationGQL(updateOrdersStatus(), {
        status: statuspayload?.status,
        sheetOrderId: parseInt(statuspayload?.orderid),
        amountCollected: calculateAmountCollected(),
        description: statuspayload?.description,
        postponeDate: statuspayload?.postponeDate,
        shippingCollected: statuspayload?.shippingCollected,
        partialItems: statuspayload?.partialItems,
        returnOrderUpdateInput: statuspayload?.returnOrderUpdateInput,
    });

    const handleupdateCourierSheet = async () => {
        setbuttonLoading(true);
        if (
            submitSheetPayload?.status == 'inProgress' ||
            (type == 'admin' && submitSheetPayload?.status == 'waitingForAdminApproval') ||
            (type != 'admin' && submitSheetPayload?.status == 'waitingForFinanceApproval')
        ) {
            try {
                const { data } = await updateCourierSheetMutation();
                if (data?.updateCourierSheet?.success == true) {
                    if (type == 'admin') {
                        history.push('/couriersheets');
                    } else {
                        history.push('/financesheets');
                    }
                } else {
                    NotificationManager.warning(data?.updateCourierSheet?.message, 'Warning!');
                }
            } catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                } else if (error.networkError) {
                    errorMessage = error.networkError.message || errorMessage;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                NotificationManager.warning(errorMessage, 'Warning!');
            }
        } else {
            NotificationManager.warning('Sheet already closed.', 'Warning!');
        }
        setbuttonLoading(false);
    };
    const [submit, setsubmit] = useState(false);

    // Initialize the expanded state for each accordion item
    const [expandedItems, setExpandedItems] = useState([]);
    const [totalExpected, settotalExpected] = useState(0);
    useEffect(() => {
        setExpandedItems(Array.from(Array(fetchCourierSheetQuery?.data?.CourierSheet?.sheetOrders?.length).keys()));
    }, [fetchCourierSheetQuery?.data]);

    const handleAccordionChange = (index) => {
        if (expandedItems.includes(index)) {
            setExpandedItems(expandedItems.filter((item) => item !== index));
        } else {
            setExpandedItems([...expandedItems, index]);
        }
    };
    useEffect(() => {
        var temp = {
            id: fetchCourierSheetQuery?.data?.CourierSheet?.id,
            orderCount: fetchCourierSheetQuery?.data?.CourierSheet?.orderCount,
            orderTotal: 0,
            orderCurrency: '',
            updateSheetOrders: [],
            updateSheetOrderstemp: [],
        };
        var total = 0;
        var currency = '';
        fetchCourierSheetQuery?.data?.CourierSheet?.sheetOrders?.map((item, index) => {
            total += parseFloat(item?.order?.price) + parseFloat(item?.order?.shippingPrice);
            currency = item?.order?.currency;
            temp.updateSheetOrderstemp.push({
                sheetOrderId: item?.id,
                expanded: type == 'admin' ? (item?.adminPass ? false : true) : false,
                status: type == 'admin' ? (item?.adminPass ? 'adminAccepted' : 'adminRejected') : item?.financePass ? 'financeAccepted' : 'financeRejected',
                shippingCollected: item?.shippingCollected == 'collected' ? true : false,
                description: '',
                price: item?.order?.price,
                shippingPrice: item?.order?.shippingPrice,
                orderStatus: item?.order?.status,
                amountCollected: item?.amountCollected,
                orderId: item?.order?.id,
            });
            if (!(item?.adminPass && type == 'admin') && !(item?.financePass && type == 'finance')) {
                temp.updateSheetOrders.push({
                    sheetOrderId: item?.id,
                    status: type == 'admin' ? (item?.adminPass ? 'adminAccepted' : 'adminRejected') : item?.financePass ? 'financeAccepted' : 'financeRejected',
                    shippingCollected: item?.shippingCollected == 'collected' ? true : false,
                    description: '',
                    orderId: item?.order?.id,
                });
            }
        });
        temp.orderTotal = total;
        temp.orderCurrency = currency;
        temp.status = fetchCourierSheetQuery?.data?.CourierSheet?.status;
        temp.orderCount = fetchCourierSheetQuery?.data?.CourierSheet?.orderCount;
        temp.id = fetchCourierSheetQuery?.data?.CourierSheet?.id;
        temp.createdAt = fetchCourierSheetQuery?.data?.CourierSheet?.createdAt;
        temp.userInfo = fetchCourierSheetQuery?.data?.CourierSheet?.userInfo;

        setsubmitSheetPayload({ ...temp });
    }, [fetchCourierSheetQuery?.data]);
    useEffect(() => {
        const fetchData = async () => {
            if (sheetID) {
                try {
                    const { data } = await fetchCourierSheetLazyQuery({
                        variables: { id: parseInt(sheetID) },
                    });
                    setfetchCourierSheetQuery({ data: data });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        const executeScroll = async () => {
            await fetchData();
            // setTimeout(() => {
            //     const element = document.querySelector('#id22');

            //     if (element) {
            //         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            //     } else {
            //         console.error('Element with ID "id28" not found');
            //     }
            // }, 1000);
        };

        executeScroll();
    }, [sheetID, fetchCourierSheetLazyQuery]);

    const fetchCourierSheets = (status) => {
        return (
            <>
                {fetchCourierSheetQuery?.data?.CourierSheet?.sheetOrders?.map((item, index) => {
                    var tempsheetpayload = {};
                    var show = false;
                    submitSheetPayload?.updateSheetOrderstemp?.map((i, ii) => {
                        if (item?.order?.id == i.orderId) {
                            tempsheetpayload = i;
                            if (
                                status == 'Accepted' &&
                                ((type == 'admin' && i?.status == 'adminAccepted') ||
                                    (type != 'admin' && i?.status == 'financeAccepted' && submitSheetPayload?.updateSheetOrders?.find((e) => e.sheetOrderId == item.id)))
                            ) {
                                show = true;
                            }

                            if (status == 'Not' && ((type == 'admin' && i?.status != 'adminAccepted') || (type != 'admin' && i?.status != 'financeAccepted'))) {
                                show = true;
                            }
                        }
                    });
                    if (show) {
                        // alert(JSON.stringify(tempsheetpayload));
                        return (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();

                                    handleAccordionChange(index);
                                    var temp = { ...submitSheetPayload };

                                    temp.updateSheetOrderstemp.map((i, ii) => {
                                        if (i.sheetOrderId == item.id) {
                                            // temp.updateSheetOrders[ii].expanded = !tempsheetpayload?.expanded;
                                            temp.updateSheetOrderstemp[ii].expanded = !tempsheetpayload?.expanded;
                                        }
                                    });
                                    setsubmitSheetPayload({ ...temp });
                                }}
                                className={type == 'admin' ? 'col-lg-12 ' : 'col-lg-6 '}
                                key={index}
                            >
                                <AccordionItem uuid={index} style={{}} className={generalstyles.filter_container + ' col-lg-12 p-4 mb-3'}>
                                    <div id={'id' + JSON.stringify(item.id)} className={' col-lg-12 p-0'}>
                                        <div className="row m-0 w-100">
                                            <div className="col-lg-7 p-0">
                                                <div className="row m-0 w-100">
                                                    <div className="col-lg-12 p-0">
                                                        <label style={{}} className={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex my-0 '}>
                                                            <input
                                                                type="checkbox"
                                                                className="mt-auto mb-auto"
                                                                checked={tempsheetpayload.expanded}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    if (
                                                                        item?.order?.status == 'delivered' ||
                                                                        item?.order?.status == 'partiallyDelivered' ||
                                                                        item?.order?.status == 'cancelled' ||
                                                                        submitSheetPayload?.status == 'inProgress' ||
                                                                        (type == 'admin' && submitSheetPayload?.status == 'waitingForAdminApproval') ||
                                                                        (type != 'admin' && submitSheetPayload?.status == 'waitingForFinanceApproval')
                                                                    ) {
                                                                        handleAccordionChange(index);
                                                                        var temp = { ...submitSheetPayload };

                                                                        temp.updateSheetOrderstemp.map((i, ii) => {
                                                                            if (i.sheetOrderId == item.id) {
                                                                                // temp.updateSheetOrders[ii].expanded = !tempsheetpayload?.expanded;
                                                                                temp.updateSheetOrderstemp[ii].expanded = !tempsheetpayload?.expanded;
                                                                            }
                                                                        });
                                                                        setsubmitSheetPayload({ ...temp });
                                                                    }
                                                                }}
                                                            />
                                                            <svg viewBox="0 0 21 21" className="h-100">
                                                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                            </svg>
                                                            <p className={`${generalstyles.checkbox_label} ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-0 wordbreak`}>
                                                                Expand Order
                                                            </p>
                                                        </label>
                                                    </div>

                                                    <div className="col-lg-12 mt-1">
                                                        <span>{item?.order?.merchantCustomer?.customerName}</span>
                                                        {item?.order?.merchantCustomer?.customer && (
                                                            <>
                                                                <br />
                                                                <span>{item?.order?.merchantCustomer?.customer?.email}</span>

                                                                <br />
                                                                <span>{item?.order?.merchantCustomer?.customer?.phone}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div class="col-lg-12 p-0 d-flex justify-content-start mb-1 mt-3">
                                                        <div className="row m-0 w-100 d-flex align-items-center justify-content-start">
                                                            <div style={{ background: '#eee', color: 'black' }} className={' wordbreak rounded-pill font-weight-600 allcentered '}>
                                                                # {item?.order?.id}
                                                            </div>

                                                            <div
                                                                style={{
                                                                    color: 'white',
                                                                    borderRadius: '15px',
                                                                    fontSize: '11px',
                                                                    background: 'var(--primary)',
                                                                }}
                                                                class="allcentered mx-2 p-1 px-2 text-capitalize"
                                                            >
                                                                {item?.order?.type?.split(/(?=[A-Z])/).join(' ')}
                                                            </div>
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();

                                                                    setstatuspayload({
                                                                        step: 0,
                                                                        orderid: item.id,
                                                                        status: '',
                                                                        order: item?.order,
                                                                        fullDelivery: true,
                                                                    });

                                                                    setchangestatusmodal(true);
                                                                }}
                                                                style={{ cursor: 'pointer' }}
                                                                className={
                                                                    item.status == 'delivered' || item.status == 'partiallyDelivered' || item.status == 'returned' || item.status == 'partiallyReturned'
                                                                        ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 text-capitalize '
                                                                        : item?.status == 'cancelled' || item?.status == 'failedDeliveryAttempt'
                                                                        ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 text-capitalize '
                                                                        : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 text-capitalize '
                                                                }
                                                            >
                                                                <span>{tempsheetpayload?.orderStatus?.split(/(?=[A-Z])/).join(' ')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>{' '}
                                            </div>

                                            <div className="col-lg-5 p-0">
                                                <div className="row m-0 w-100">
                                                    {type == 'finance' && (
                                                        <div className="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                                                            <div className="row m-0 w-100 d-flex justify-content-end">
                                                                <label className={`${formstyles.switch} mx-2 my-0`}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!tempsheetpayload?.shippingCollected}
                                                                        onChange={(e) => {
                                                                            e.stopPropagation();
                                                                            var temp = { ...submitSheetPayload };

                                                                            temp.updateSheetOrders.map((i, ii) => {
                                                                                if (i.sheetOrderId == item.id) {
                                                                                    temp.updateSheetOrders[ii].shippingCollected = !temp.updateSheetOrders[ii].shippingCollected;
                                                                                }
                                                                            });

                                                                            temp.updateSheetOrderstemp.map((i, ii) => {
                                                                                if (i.sheetOrderId == item.id) {
                                                                                    temp.updateSheetOrderstemp[ii].shippingCollected = !temp.updateSheetOrders[ii].shippingCollected;
                                                                                }
                                                                            });

                                                                            setsubmitSheetPayload({ ...temp });
                                                                        }}
                                                                    />
                                                                    <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                                </label>
                                                                <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>
                                                                    Shipping on merchant
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="col-lg-12 p-0 d-flex justify-content-end">
                                                        <div>
                                                            <div className="row w-100 d-flex align-items-center d-flex justify-content-end m-0">
                                                                <div className="col-lg-12 p-0 d-flex justify-content-end my-2">
                                                                    <button
                                                                        style={{
                                                                            backgroundColor:
                                                                                type == 'admin' && tempsheetpayload?.status == 'adminAccepted'
                                                                                    ? 'var(--success)'
                                                                                    : type != 'admin' && tempsheetpayload?.status == 'financeAccepted'
                                                                                    ? 'var(--success)'
                                                                                    : '',
                                                                            height: '30px',
                                                                        }}
                                                                        class={generalstyles.roundbutton + '  allcentered'}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (item?.amountCollected == null) {
                                                                                NotificationManager.warning(`Can not update order`, 'Warning!');
                                                                                return;
                                                                            }

                                                                            const orderStatus = item?.order?.status;
                                                                            const sheetOrder = submitSheetPayload?.updateSheetOrders?.find((e) => e.sheetOrderId == item.id);

                                                                            const canUpdateOrder = ['delivered', 'partiallyDelivered', 'cancelled'].includes(orderStatus);
                                                                            const isInProgress = submitSheetPayload?.status == 'inProgress';
                                                                            const isWaitingForAdminApproval = submitSheetPayload?.status == 'waitingForAdminApproval' && type == 'admin';
                                                                            const isWaitingForFinanceApproval = submitSheetPayload?.status == 'waitingForFinanceApproval' && type != 'admin';

                                                                            if (sheetOrder) {
                                                                                if (canUpdateOrder || isInProgress || isWaitingForAdminApproval || isWaitingForFinanceApproval) {
                                                                                    handleAccordionChange(index);
                                                                                    var temp = { ...submitSheetPayload };
                                                                                    temp.updateSheetOrders.map((i, ii) => {
                                                                                        if (i.orderId == item.order.id) {
                                                                                            if (expandedItems.includes(index)) {
                                                                                                temp.updateSheetOrders[ii].status = type == 'admin' ? 'adminAccepted' : 'financeAccepted';
                                                                                            } else {
                                                                                                temp.updateSheetOrders[ii].status = type == 'admin' ? 'adminRejected' : 'financeRejected';
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                    temp.updateSheetOrderstemp.map((i, ii) => {
                                                                                        if (i.orderId == item.order.id) {
                                                                                            if (expandedItems.includes(index)) {
                                                                                                temp.updateSheetOrderstemp[ii].status = type == 'admin' ? 'adminAccepted' : 'financeAccepted';
                                                                                            } else {
                                                                                                temp.updateSheetOrderstemp[ii].status = type == 'admin' ? 'adminRejected' : 'financeRejected';
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                    setsubmitSheetPayload({ ...temp });
                                                                                } else {
                                                                                    NotificationManager.warning(`Can not update order with status ${orderStatus}`, 'Warning!');
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        {type == 'admin' && tempsheetpayload?.status == 'adminAccepted'
                                                                            ? 'Order Accepted'
                                                                            : type != 'admin' && tempsheetpayload?.status == 'financeAccepted'
                                                                            ? 'Order Accepted'
                                                                            : 'Accept Order'}
                                                                        {((type == 'admin' && tempsheetpayload?.status == 'adminAccepted') ||
                                                                            (type != 'admin' && tempsheetpayload?.status == 'financeAccepted')) && (
                                                                            <>
                                                                                <FaCheck className="m-1 mt-1" size={12} />
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <div class="col-lg-12 p-0">
                                                                    <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                        <div
                                                                            style={{
                                                                                color: 'white',
                                                                                borderRadius: '15px',
                                                                                fontSize: '11px',
                                                                                background:
                                                                                    type == 'admin'
                                                                                        ? item?.financePass
                                                                                            ? 'var(--success)'
                                                                                            : 'var(--danger)'
                                                                                        : item?.adminPass
                                                                                        ? 'var(--success)'
                                                                                        : 'var(--danger)',
                                                                            }}
                                                                            class="allcentered mx-2 p-1 px-2"
                                                                        >
                                                                            {type == 'admin'
                                                                                ? item?.financePass
                                                                                    ? 'Finance Accepted'
                                                                                    : 'Pending Finance'
                                                                                : item?.adminPass
                                                                                ? 'Admin Accepted'
                                                                                : 'Pending Admin'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {type == 'finance' && (
                                        <div class="col-lg-12 p-3 mt-2">
                                            <div class="row m-0 w-100 d-flex">
                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                    <div class="row m-0 w-100">
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Collected</span>
                                                        </div>
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                {item?.amountCollected ? parseFloat(item?.amountCollected) : 0} {item?.order?.currency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                    <div class="row m-0 w-100">
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                                        </div>
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                {parseFloat(item?.order?.price)} {item?.order?.currency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                    <div class="row m-0 w-100">
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                                        </div>
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                {parseFloat(item?.order?.shippingPrice)} {item?.order?.currency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 600, fontSize: '15px' }} className=" p-0 mb-2 allcentered col-lg-3">
                                                    <div class="row m-0 w-100">
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                        </div>
                                                        <div class="col-lg-12 p-0 allcentered text-center">
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                {parseFloat(item?.order?.price) + parseFloat(item?.order?.shippingPrice)} {item?.order?.currency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {tempsheetpayload?.expanded && (
                                        // <AccordionItemPanel expanded={expandedItems.includes(index)}>
                                        <>
                                            <hr className="mt-2 mb-3" />
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100">
                                                    <div className="col-lg-8 p-0">
                                                        <div className="row m-0 w-100">
                                                            {type == 'admin' && (
                                                                <div class="col-lg-12 mb-2" style={{ fontWeight: 600 }}>
                                                                    Not delivered
                                                                </div>
                                                            )}
                                                            {item?.order?.orderItems?.map((subitem, subindex) => {
                                                                return (
                                                                    <div class={type == 'admin' ? 'col-lg-6 mb-2' : 'col-lg-12 p-0 mb-2'}>
                                                                        <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-2 d-flex align-items-center">
                                                                            {item?.order?.type == 'return' && (
                                                                                <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} className=" p-1 px-2 mr-1 allcentered">
                                                                                    {subitem?.partialCount != null ? parseFloat(subitem.partialCount) : parseFloat(subitem.count)}
                                                                                </div>
                                                                            )}
                                                                            {item?.order?.type != 'return' && (
                                                                                <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} className=" p-1 px-2 mr-1 allcentered">
                                                                                    {subitem?.partialCount != null ? parseFloat(subitem.count) - parseFloat(subitem.partialCount) : 0}
                                                                                </div>
                                                                            )}

                                                                            {type == 'admin' && (
                                                                                <div style={{ width: '40px', height: '40px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                                                    <img
                                                                                        src={
                                                                                            subitem?.info?.imageUrl
                                                                                                ? subitem?.info?.imageUrl
                                                                                                : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                                        }
                                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            <div class="col-lg-5 d-flex align-items-center">
                                                                                <div className="row m-0 w-100">
                                                                                    <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                                        {subitem?.info?.item?.name ?? '-'}
                                                                                    </div>
                                                                                    <div style={{ fontSize: '12px' }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                                        {subitem?.info?.name ?? '-'}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class={type == 'admin' ? 'col-lg-4 ' : 'col-lg-6 '}>
                                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                                    {item?.order?.type != 'return' && (
                                                                                        <div style={{ fontWeight: 700 }} class="mx-2">
                                                                                            {parseFloat(
                                                                                                (subitem?.partialCount != null ? parseFloat(subitem.count) - parseFloat(subitem.partialCount) : 0) *
                                                                                                    parseFloat(subitem?.unitPrice),
                                                                                            )}{' '}
                                                                                            {item?.info?.currency}
                                                                                        </div>
                                                                                    )}
                                                                                    {item?.order?.type == 'return' && (
                                                                                        <div style={{ fontWeight: 700 }} class="mx-2">
                                                                                            {parseFloat(
                                                                                                (subitem?.partialCount != null ? parseFloat(subitem.partialCount) : parseFloat(subitem.count)) *
                                                                                                    parseFloat(subitem?.unitPrice),
                                                                                            )}{' '}
                                                                                            {item?.info?.currency}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4 p-0">
                                                        <div class="row m-0 w-100 px-1">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                {/* <label for="name" class={formstyles.form__label}>
                                                                    {'Notes'}
                                                                </label> */}
                                                                <TextareaAutosize
                                                                    style={{ zIndex: 1000 }}
                                                                    class={formstyles.form__field}
                                                                    value={tempsheetpayload?.description}
                                                                    placeholder={'Notes'}
                                                                    minRows={5}
                                                                    maxRows={5}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                    onChange={(event) => {
                                                                        event.stopPropagation();
                                                                        var temp = { ...submitSheetPayload };

                                                                        temp.updateSheetOrders.map((i, ii) => {
                                                                            if (i.orderId == item?.order?.id) {
                                                                                temp.updateSheetOrders[ii].description = event.target.value;
                                                                            }
                                                                        });
                                                                        temp.updateSheetOrderstemp.map((i, ii) => {
                                                                            if (i.orderId == item?.order?.id) {
                                                                                temp.updateSheetOrderstemp[ii].description = event.target.value;
                                                                            }
                                                                        });
                                                                        setsubmitSheetPayload({ ...temp });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {type == 'admin' && (
                                                    <div className="col-lg-12 p-0 d-flex justify-content-end mb-2 px-3" style={{ fontWeight: 600, fontSize: '15px' }}>
                                                        Total: {parseFloat(item?.order?.price) + parseFloat(item?.order?.shippingPrice)} {item?.order?.currency}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                        // </AccordionItemPanel>
                                    )}
                                </AccordionItem>
                            </div>
                        );
                    }
                })}
            </>
        );
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2 pb-5">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div
                    className="col-lg-12 pr-3 pl-2 m-0 mb-3"
                    // style={{ cursor: props?.clickable ? 'pointer' : '' }}
                >
                    <div style={{ background: 'white', margin: '0px' }} class={' p-3 row m-0 w-100 card'}>
                        <div className="col-lg-4 p-0">
                            <div class="row m-0 w-100 d-flex align-items-center">
                                <span style={{ fontWeight: 600 }} class="text-capitalize">
                                    {submitSheetPayload?.userInfo?.name}{' '}
                                </span>
                                <div style={{ background: '#eee', color: 'black' }} className={' wordbreak rounded-pill font-weight-600 allcentered mx-1 '}>
                                    # {submitSheetPayload?.id}
                                </div>
                                <div style={{ background: 'black', color: 'white' }} className={' wordbreak rounded-pill font-weight-600 allcentered mx-1 '}>
                                    <span>{submitSheetPayload?.orderCount}</span> Orders
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                            <div
                                className={
                                    submitSheetPayload.status == 'completed'
                                        ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  '
                                        : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered '
                                }
                            >
                                {courierSheetStatusesContext?.map((i, ii) => {
                                    if (i.value == submitSheetPayload?.status) {
                                        return <span>{i.label}</span>;
                                    }
                                })}
                            </div>
                        </div>
                        <div className="col-lg-12 p-0 my-2">
                            <hr className="m-0" />
                        </div>

                        <div className="col-lg-6 p-0 mb-2"></div>
                        {type == 'finance' && (
                            <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}>
                                <p class=" p-0 m-0" style={{ fontSize: '18px', fontWeight: 600 }}>
                                    {submitSheetPayload?.orderTotal} {submitSheetPayload?.orderCurrency}
                                </p>
                            </div>
                        )}
                        <div class="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                            <span class="d-flex align-items-center" style={{ fontWeight: 400, color: 'grey', fontSize: '10px' }}>
                                <IoMdTime class="mr-1" />
                                {dateformatter(submitSheetPayload?.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div class={'col-lg-12 p-0'}>
                    <Accordion allowMultipleExpanded expanded={expandedItems} preExpanded={expandedItems}>
                        <div class="row m-0 w-100">
                            {fetchCourierSheets('Not')}
                            {fetchCourierSheets('Accepted')}
                        </div>{' '}
                    </Accordion>
                </div>
            </div>

            <div style={{ position: 'fixed', bottom: '3%', right: '4%', width: '75.5%' }}>
                <div class="col-lg-12 p-0">
                    <div style={{ background: 'white', boxShadow: 'rgba(37, 83, 185, 0.1) -2px -5px 6px' }} class="row m-0 w-100 card d-flex align-items-center p-3">
                        <div class="col-lg-6 p-0 ">
                            <div style={{ fontWeight: 600 }}>
                                <div style={{ background: 'var(--primary)', color: 'white' }} className={' wordbreak rounded-pill font-weight-600 allcentered mx-1 px-3 py-2 '}>
                                    <span class="px-2">
                                        {submitSheetPayload?.updateSheetOrders?.filter((item) => item.status == 'adminAccepted' || item.status == 'financeAccepted')?.length} Orders Accepted
                                    </span>
                                    {type == 'finance' && (
                                        <span class="px-2" style={{ borderInlineStart: '1px solid rgba(238, 238, 238, 0.6)' }}>
                                            {submitSheetPayload?.updateSheetOrderstemp
                                                ?.filter((item) => item.status == 'adminAccepted' || item.status == 'financeAccepted')
                                                .map((e) => parseFloat(e?.amountCollected ?? '0') + (e?.shippingCollected ? parseFloat(e?.shippingPrice ?? '0') : 0))
                                                .reduce((sum, current) => sum + current, 0)}{' '}
                                            {submitSheetPayload?.orderCurrency}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 p-0 d-flex justify-content-end">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton}
                                disabled={buttonLoading}
                                onClick={() => {
                                    if (isAuth([1, 53, 51, 35])) {
                                        handleupdateCourierSheet();
                                    } else {
                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                    }
                                }}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>Update Manifest</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={changestatusmodal}
                onHide={() => {
                    setchangestatusmodal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Update Order Status</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setchangestatusmodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {statuspayload?.step == 0 && (
                        <div class="row m-0 w-100 py-2">
                            <div class={'col-lg-12 mb-3'}>
                                <label for="name" class={formstyles.form__label}>
                                    Status
                                </label>
                                <Select
                                    options={[
                                        { label: 'Delivered', value: 'delivered' },
                                        { label: 'Postponed', value: 'postponed' },
                                        { label: 'Unreachable', value: 'unreachable' },
                                        { label: 'Canceled', value: 'canceled' },
                                    ]}
                                    styles={defaultstyles}
                                    value={[
                                        { label: 'Delivered', value: 'delivered' },
                                        { label: 'Postponed', value: 'postponed' },
                                        { label: 'Unreachable', value: 'unreachable' },
                                        { label: 'Canceled', value: 'canceled' },
                                    ].filter((option) => option.value == statuspayload?.status)}
                                    onChange={(option) => {
                                        setstatuspayload({ ...statuspayload, status: option.value, step: 1 });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {statuspayload?.step == 1 && (
                        <div class="row m-0 w-100 py-2">
                            {statuspayload?.status == 'canceled' && (
                                <div class={'col-lg-12 mb-3'}>
                                    <label for="name" class={formstyles.form__label}>
                                        Shipping
                                    </label>
                                    <Select
                                        options={[
                                            { label: 'Collected', value: true },
                                            { label: 'Not Collected', value: false },
                                        ]}
                                        styles={defaultstyles}
                                        value={[
                                            { label: 'Collected', value: true },
                                            { label: 'Not Collected', value: false },
                                        ].filter((option) => option.value == statuspayload?.shippingCollected)}
                                        onChange={(option) => {
                                            setstatuspayload({ ...statuspayload, shippingCollected: option.value });
                                        }}
                                    />
                                </div>
                            )}
                            {statuspayload?.status == 'postponed' && (
                                <div class={'col-lg-12 mb-3'}>
                                    <Inputfield
                                        placeholder={'Postpone Date'}
                                        value={statuspayload?.postponeDate}
                                        onChange={(event) => {
                                            setstatuspayload({ ...statuspayload, postponeDate: event.target.value });
                                        }}
                                        type={'date'}
                                    />
                                </div>
                            )}
                            {statuspayload?.status == 'delivered' && (
                                <div class={'col-lg-12 mb-3'}>
                                    <div class="row m-0 w-100">
                                        <div class={'col-lg-12 mb-3 p-0 '}>
                                            <div className="row m-0 w-100 d-flex align-items-center">
                                                <label className={`${formstyles.switch} mx-2 my-0`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={statuspayload?.fullDelivery}
                                                        onChange={(e) => {
                                                            var newStatus = !statuspayload?.fullDelivery;
                                                            var partialItemsTemp = [];
                                                            if (!newStatus) {
                                                                statuspayload?.order?.orderItems?.map((i) => {
                                                                    partialItemsTemp.push({ id: i.id, partialCount: i.count });
                                                                });
                                                            }
                                                            setstatuspayload({
                                                                ...statuspayload,
                                                                fullDelivery: newStatus,
                                                                partialDilevery: !newStatus,
                                                                partialItems: newStatus ? undefined : partialItemsTemp,
                                                            });
                                                        }}
                                                    />
                                                    <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                </label>
                                                <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>Full delivery</p>
                                            </div>
                                        </div>
                                        {statuspayload?.order?.orderItems?.map((subitem, subindex) => {
                                            var partialItem = {};
                                            statuspayload?.partialItems?.map((i) => {
                                                if (i.id == subitem.id) {
                                                    partialItem = i;
                                                }
                                            });
                                            return (
                                                <div class={'col-lg-12 p-0 mb-2'}>
                                                    <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-2 d-flex align-items-center">
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                            <img
                                                                src={
                                                                    subitem?.info?.imageUrl
                                                                        ? subitem?.info?.imageUrl
                                                                        : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                }
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                            />
                                                        </div>

                                                        <div class="col-lg-5 d-flex align-items-center">
                                                            <div className="row m-0 w-100">
                                                                <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                    {subitem?.info?.item?.name ?? '-'}
                                                                </div>
                                                                <div style={{ fontSize: '12px' }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                    {subitem?.info?.name ?? '-'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class={'col-lg-5 '}>
                                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                <div style={{ fontWeight: 700 }} class="mx-2">
                                                                    {statuspayload?.fullDelivery
                                                                        ? parseFloat(subitem?.count) * parseFloat(subitem?.unitPrice)
                                                                        : parseFloat(subitem.unitPrice) * parseFloat(partialItem?.partialCount)}{' '}
                                                                    {statuspayload?.info?.currency}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="col-lg-12 p-0 mt-2">
                                                            <div class="row m-0 w-100">
                                                                {statuspayload?.fullDelivery && (
                                                                    <div
                                                                        style={{
                                                                            border: '1px solid #eee',
                                                                            borderRadius: '8px',
                                                                            fontWeight: 700,
                                                                            background: 'var(--primary)',
                                                                            color: 'white',
                                                                            width: '35px',
                                                                        }}
                                                                        className=" p-1 px-2 mr-1 allcentered"
                                                                    >
                                                                        {parseFloat(subitem.count)}
                                                                    </div>
                                                                )}
                                                                {!statuspayload?.fullDelivery && (
                                                                    <>
                                                                        {Array.from({ length: parseFloat(subitem.count) + 1 }, (_, i) => (
                                                                            <div
                                                                                onClick={() => {
                                                                                    var partialItemsTemp = [...statuspayload?.partialItems] ?? [];
                                                                                    const existingItemIndex = partialItemsTemp?.findIndex((i) => i.id === subitem?.id);
                                                                                    partialItemsTemp[existingItemIndex].partialCount = i;
                                                                                    setstatuspayload({ ...statuspayload, partialItems: partialItemsTemp });
                                                                                }}
                                                                                key={i}
                                                                                style={{
                                                                                    border: '1px solid #eee',
                                                                                    borderRadius: '8px',
                                                                                    fontWeight: 700,
                                                                                    background: partialItem.partialCount == i ? 'var(--primary)' : '',
                                                                                    color: partialItem.partialCount == i ? 'white' : '',
                                                                                    width: '35px',
                                                                                    cursor: 'pointer',
                                                                                    transition: 'all 0.4s',
                                                                                }}
                                                                                className="p-1 px-2 mr-1 allcentered"
                                                                            >
                                                                                {i}
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div class={'col-lg-12 mb-3 p-0 '}>
                                            <div className="row m-0 w-100 d-flex align-items-center">
                                                <label className={`${formstyles.switch} mx-2 my-0`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={statuspayload?.shippingCollected}
                                                        onChange={(e) => {
                                                            setstatuspayload({
                                                                ...statuspayload,
                                                                shippingCollected: !statuspayload?.shippingCollected,
                                                            });
                                                        }}
                                                    />
                                                    <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                </label>
                                                <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>Shipping Collected</p>
                                            </div>
                                        </div>
                                        {!statuspayload?.order?.originalPrice && !statuspayload?.fullDelivery && (
                                            <div class={'col-lg-12 mb-3'}>
                                                <Inputfield
                                                    placeholder={'Amount Recieved'}
                                                    value={statuspayload?.amountCollected}
                                                    onChange={(event) => {
                                                        setstatuspayload({ ...statuspayload, amountCollected: event.target.value });
                                                    }}
                                                    type={'number'}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div class="col-lg-12 mb-3 allcentered">
                                <button
                                    onClick={async () => {
                                        try {
                                            setupdateStatusButtonLoading(true);
                                            const { data } = await updateOrdersStatusMutation();
                                            var temp = { ...submitSheetPayload };
                                            temp.updateSheetOrderstemp.map((i, ii) => {
                                                if (i.sheetOrderId == statuspayload.orderid) {
                                                    temp.updateSheetOrderstemp[ii].orderStatus = statuspayload?.status;
                                                }
                                            });
                                            setsubmitSheetPayload({ ...temp });
                                            setstatuspayload({ step: 0, orderid: '', status: '', fullDelivery: true });
                                            setchangestatusmodal(false);
                                            NotificationManager.success('', 'Status changed successfully');
                                        } catch (error) {
                                            let errorMessage = 'An unexpected error occurred';
                                            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                errorMessage = error.graphQLErrors[0].message || errorMessage;
                                            } else if (error.networkError) {
                                                errorMessage = error.networkError.message || errorMessage;
                                            } else if (error.message) {
                                                errorMessage = error.message;
                                            }

                                            NotificationManager.warning(errorMessage, 'Warning!');
                                        }
                                        setupdateStatusButtonLoading(false);
                                    }}
                                    class={generalstyles.roundbutton}
                                    disabled={updateStatusButtonLoading}
                                >
                                    {updateStatusButtonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                    {!updateStatusButtonLoading && <span>Update Status</span>}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default CourierSheet;
