import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';

import Decimal from 'decimal.js';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { AiOutlineClose } from 'react-icons/ai';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { IoChevronBackOutline } from 'react-icons/io5';
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import MultiSelect from '../../MultiSelect.js';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import OrderItemsModal from './OrderItemsModal.js';

const CourierSheet = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const {
        setpageactive_context,
        courierSheetStatusesContext,
        dateformatter,
        setpagetitle_context,
        isAuth,
        buttonLoadingContext,
        setbuttonLoadingContext,
        orderStatusEnumContext,
        updateQueryParamContext,
    } = useContext(Contexthandlerscontext);
    const { useLazyQueryGQL, useQueryGQL, fetchCourierSheet, updateCourierSheet, useMutationGQL, updateOrdersStatus, fetchInventories, fetchMerchants } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [changestatusmodal, setchangestatusmodal] = useState(false);
    const [total, settotal] = useState(0);
    const [skuModal, setskuModal] = useState(false);
    const [skuModalInfo, setskuModalInfo] = useState({});

    const [sheetID, setsheetID] = useState(null);
    const [submitSheetPayload, setsubmitSheetPayload] = useState({});
    const [type, settype] = useState('');
    const [sheetOrders, setsheetOrders] = useState();
    const [filterorders, setfilterorders] = useState({
        limit: 20,
        outOfStock: false,
    });

    const [updateStatusbuttonLoadingContext, setupdateStatusbuttonLoadingContext] = useState(false);

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
        setpagetitle_context('Courier');
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
        let amount = new Decimal(0);
        let orderItemsAmount = new Decimal(0);
        if (statuspayload?.order?.paymentType == 'card') {
            return;
        }

        if (statuspayload?.fullDelivery) {
            statuspayload?.order?.orderItems?.forEach((i) => {
                const unitPrice = new Decimal(i?.unitPrice ?? 0);
                const count = new Decimal(i?.count ?? 0);
                orderItemsAmount = orderItemsAmount.plus(unitPrice.times(count));
            });
        } else {
            statuspayload?.partialItems?.forEach((i) => {
                const orderItem = statuspayload?.order?.orderItems?.filter((ii) => ii.id === i.id)[0];
                const unitPrice = new Decimal(orderItem?.unitPrice ?? 0);
                const partialCount = new Decimal(i?.partialCount ?? 0);
                orderItemsAmount = orderItemsAmount.plus(unitPrice.times(partialCount));
            });
        }

        if (statuspayload?.order?.originalPrice) {
            if (statuspayload?.shippingCollected == 'collected') {
                amount = new Decimal(statuspayload?.order?.shippingPrice ?? 0).plus(orderItemsAmount);
            } else {
                amount = orderItemsAmount;
            }
        } else if (!statuspayload?.order?.originalPrice) {
            if (statuspayload?.shippingCollected == 'collected') {
                amount = new Decimal(statuspayload?.order?.shippingPrice ?? 0).plus(new Decimal(statuspayload?.amountCollected ?? 0));
            } else {
                amount = new Decimal(statuspayload?.amountCollected ?? 0);
            }
        }

        return amount.toFixed(2);
    };
    const calculateAmountCollectedReturn = () => {
        let amount = new Decimal(0);
        let orderItemsAmountReturn = new Decimal(0);
        if (statuspayload?.previousOrder?.paymentType == 'card') {
            return;
        }

        if (statuspayload?.fullReturn) {
            statuspayload?.previousOrder?.orderItems?.forEach((i) => {
                const unitPrice = new Decimal(i?.unitPrice ?? 0);
                const count = new Decimal(i?.count ?? 0);
                orderItemsAmountReturn = orderItemsAmountReturn.plus(unitPrice.times(count));
            });
        } else {
            statuspayload?.partialItemsReturn?.forEach((i) => {
                const orderItem = statuspayload?.previousOrder?.orderItems?.filter((ii) => ii.id === i.id)[0];
                const unitPrice = new Decimal(orderItem?.unitPrice ?? 0);
                const partialCount = new Decimal(i?.partialCount ?? 0);
                orderItemsAmountReturn = orderItemsAmountReturn.plus(unitPrice.times(partialCount));
            });
        }

        if (statuspayload?.previousOrder && statuspayload?.returnStatus === 'returned') {
            if (statuspayload?.previousOrder?.originalPrice) {
                amount = amount.plus(orderItemsAmountReturn);
            } else if (!statuspayload?.previousOrder?.originalPrice) {
                amount = amount.plus(new Decimal(statuspayload?.amountCollectedReturn ?? 0));
            }
        }

        return amount.toFixed(2);
    };
    useEffect(() => {
        const collected = new Decimal(calculateAmountCollected() || 0);
        const collectedReturn = new Decimal(calculateAmountCollectedReturn() || 0);
        const total = collected.plus(collectedReturn);
        settotal(total.toFixed(2));
    }, [statuspayload]);

    const [updateOrdersStatusMutation] = useMutationGQL(updateOrdersStatus(), {
        status:
            !statuspayload?.fullDelivery && statuspayload?.status == 'delivered'
                ? 'partiallyDelivered'
                : !statuspayload?.fullDelivery && statuspayload?.status == 'returned'
                ? 'partiallyReturned'
                : statuspayload?.status,
        sheetOrderId: parseInt(statuspayload?.orderid),
        amountCollected: calculateAmountCollected(),
        description: statuspayload?.description,
        postponeDate: statuspayload?.postponeDate,
        shippingCollected: statuspayload?.status === 'postponed' || statuspayload?.status === 'failedDeliveryAttempt' ? 'notCollected' : statuspayload?.shippingCollected,
        partialItems: statuspayload?.partialItems,
        returnOrderUpdateInput: statuspayload?.previousOrder
            ? {
                  status:
                      statuspayload?.status == 'postponed'
                          ? statuspayload?.status
                          : !statuspayload?.fullReturn && statuspayload?.returnStatus == 'returned'
                          ? 'partiallyReturned'
                          : statuspayload?.returnStatus,
                  partialItems: statuspayload?.partialItemsReturn,
                  amountCollected: calculateAmountCollectedReturn(),
              }
            : undefined,
    });

    const handleupdateCourierSheet = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
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
        setbuttonLoadingContext(false);
    };
    const [submit, setsubmit] = useState(false);

    // Initialize the expanded state for each accordion item
    const [expandedItems, setExpandedItems] = useState([]);
    const [totalExpected, settotalExpected] = useState(0);
    useEffect(() => {
        setExpandedItems(Array.from(Array(sheetOrders?.length).keys()));
    }, [sheetOrders]);

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
            orderTotal: new Decimal(0), // Start with Decimal for total
            orderCurrency: '',
            updateSheetOrders: [],
            updateSheetOrderstemp: [],
        };
        var total = new Decimal(0); // Initialize with Decimal
        var currency = '';

        sheetOrders?.map((item, index) => {
            // Calculate total using Decimal for precision
            total = total.plus(new Decimal(item?.order?.price || 0)).plus(new Decimal(item?.order?.shippingPrice || 0));
            currency = item?.order?.currency;

            temp.updateSheetOrderstemp.push({
                sheetOrderId: item?.id,
                expanded: type == 'admin' ? (item?.adminPass ? false : true) : false,
                status: type == 'admin' ? (item?.adminPass ? 'adminAccepted' : 'adminRejected') : item?.financePass ? 'financeAccepted' : 'financeRejected',
                shippingCollected: item?.order?.status == 'postponed' ? 'notCollected' : item?.shippingCollected,
                description: '',
                price: item?.order?.price,
                shippingPrice: item?.order?.shippingPrice,
                orderStatus: item?.order?.status,
                amountCollected: item?.amountCollected,
                orderId: item?.order?.id,
                paymentType: item?.order?.paymentType,
            });

            if (!(item?.adminPass && type == 'admin') && !(item?.financePass && type == 'finance')) {
                temp.updateSheetOrders.push({
                    sheetOrderId: item?.id,
                    status: type == 'admin' ? (item?.adminPass ? 'adminAccepted' : 'adminRejected') : item?.financePass ? 'financeAccepted' : 'financeRejected',
                    shippingCollected: item?.order?.status == 'postponed' ? 'notCollected' : item?.shippingCollected,
                    description: '',
                    orderId: item?.order?.id,
                });
            }
        });

        temp.orderTotal = total.toNumber(); // Convert total back to number for storing
        temp.orderCurrency = currency;
        temp.status = fetchCourierSheetQuery?.data?.CourierSheet?.status;
        temp.orderCount = fetchCourierSheetQuery?.data?.CourierSheet?.orderCount;
        temp.id = fetchCourierSheetQuery?.data?.CourierSheet?.id;
        temp.createdAt = fetchCourierSheetQuery?.data?.CourierSheet?.createdAt;
        temp.userInfo = fetchCourierSheetQuery?.data?.CourierSheet?.userInfo;

        setsubmitSheetPayload({ ...temp });
    }, [fetchCourierSheetQuery?.data, sheetOrders]);
    // useEffect(() => {
    //     alert(JSON.stringify(sheetOrders));
    // }, [sheetOrders]);

    useEffect(() => {
        const fetchData = async () => {
            if (sheetID) {
                try {
                    const { data } = await fetchCourierSheetLazyQuery({
                        variables: { id: parseInt(sheetID) },
                    });
                    setfetchCourierSheetQuery({ data: data });
                    // alert(JSON.stringify(data?.CourierSheet?.sheetOrders[0]));
                    setsheetOrders([...data?.CourierSheet?.sheetOrders]);
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
                {sheetOrders
                    ?.filter((item) => {
                        const statusFilter = filterorders?.statuses ? filterorders.statuses.includes(item.order.status) : true;

                        const orderIdsFilter = filterorders?.orderIds ? filterorders.orderIds.includes(item.order.id) || filterorders.orderIds.includes(item.order?.previousOrderId) : true;

                        const acceptedFilter =
                            filterorders?.accepted !== undefined
                                ? (() => {
                                      const sta = type === 'admin' ? (item?.adminPass ? 'adminAccepted' : 'adminRejected') : item?.financePass ? 'financeAccepted' : 'financeRejected';
                                      return (filterorders?.accepted && type === 'admin' && sta === 'adminRejected') || (filterorders?.accepted && type === 'finance' && sta === 'financeRejected');
                                  })()
                                : true;

                        return statusFilter && orderIdsFilter && acceptedFilter;
                    })
                    .map((item, index) => {
                        var tempsheetpayload = {};
                        var tempsheetpayloadPreviousOrder = {};
                        var show = false;
                        var previousOrder = undefined;
                        submitSheetPayload?.updateSheetOrderstemp?.map((i, ii) => {
                            if (item?.order?.id == i.orderId) {
                                tempsheetpayload = i;
                                // if (status == 'Accepted' && ((type == 'admin' && i?.status == 'adminAccepted') || (type != 'admin' && i?.status == 'financeAccepted'))) {
                                //     show = true;
                                // }

                                // if (status == 'Not' && ((type == 'admin' && i?.status != 'adminAccepted') || (type != 'admin' && i?.status != 'financeAccepted'))) {
                                //     show = true;
                                // }
                                show = true;
                            }
                        });
                        if (item?.order?.previousOrderId && item?.order?.type == 'exchange') {
                            previousOrder = sheetOrders?.filter((ii) => ii.orderId == item?.order?.previousOrderId)[0];
                            submitSheetPayload?.updateSheetOrderstemp?.map((i, ii) => {
                                if (item?.order?.previousOrderId == i.orderId) {
                                    tempsheetpayloadPreviousOrder = i;
                                }
                            });
                        }
                        if (item?.order?.type == 'return') {
                            var orderexist = sheetOrders?.filter((ii) => ii.order?.previousOrderId == item?.orderId)[0];
                            if (orderexist) {
                                show = false;
                            }
                        }

                        var orderItems = item?.order?.orderItems?.filter((subitem) => {
                            // if (item?.order?.type === 'return') {
                            if (subitem?.order?.type === 'return') {
                                // For return subitems, check partialCount or count
                                const value = subitem?.partialCount != null ? new Decimal(subitem.partialCount).toFixed(0) : new Decimal(subitem.count).toFixed(0);
                                return value != 0;
                            } else {
                                // For non-return subitems, calculate remaining count
                                const value = subitem?.partialCount != null ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)).toFixed(0) : '0';
                                // alert(value > 0);
                                return value != 0;
                            }
                            // }
                            return false; // Exclude if item?.order?.type is not 'return'
                        });
                        // alert(JSON.stringify(orderItems));
                        var previousOrderItems = previousOrder?.order?.orderItems?.filter((subitem) => {
                            if (previousOrder?.order?.type === 'return') {
                                // For 'return' type, check partialCount or count
                                const value = subitem?.partialCount != null ? new Decimal(subitem.partialCount).toFixed(0) : new Decimal(subitem.count).toFixed(0);
                                return value != 0;
                            } else {
                                // For non-'return' type, calculate the remaining count
                                const value = subitem?.partialCount != null ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)).toFixed(0) : '0';
                                return value != 0;
                            }
                        });

                        if (show) {
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
                                    className={'col-lg-6 '}
                                    key={index}
                                >
                                    <AccordionItem uuid={index} style={{}} className={generalstyles.card + ' col-lg-12 p-4 mb-3'}>
                                        <div id={'id' + JSON.stringify(item.id)} className={' col-lg-12 p-0'}>
                                            <div className="row m-0 w-100">
                                                <div className="col-lg-8 col-md-8 p-0">
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

                                                        <div class="col-lg-12 p-0 d-flex justify-content-start mb-1 mt-3">
                                                            <div className="row m-0 w-100 d-flex align-items-center justify-content-start">
                                                                <div style={{ background: '#eee', color: 'black' }} className={' wordbreak rounded-pill font-weight-600 allcentered '}>
                                                                    # {item?.order?.id}
                                                                </div>

                                                                <div
                                                                    style={{
                                                                        color: 'white',
                                                                        borderRadius: '0.25rem',
                                                                        fontSize: '11px',
                                                                        background: 'var(--primary)',
                                                                    }}
                                                                    class="allcentered mx-2 p-1 px-2 text-capitalize"
                                                                >
                                                                    {item?.order?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'white',
                                                                        borderRadius: '0.25rem',
                                                                        fontSize: '11px',
                                                                        background: 'var(--primary)',
                                                                    }}
                                                                    class="allcentered p-1 px-2 text-capitalize"
                                                                >
                                                                    {item?.order?.paymentType?.split(/(?=[A-Z])/).join(' ')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-12 p-0 d-flex justify-content-start mb-1">
                                                            <div className="row m-0 w-100 d-flex align-items-center justify-content-start">
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();

                                                                        if (
                                                                            tempsheetpayload?.orderStatus == 'assignedToCourier' ||
                                                                            tempsheetpayload?.orderStatus == 'delivered' ||
                                                                            tempsheetpayload?.orderStatus == 'partiallyDelivered' ||
                                                                            tempsheetpayload?.orderStatus == 'returned' ||
                                                                            tempsheetpayload?.orderStatus == 'partiallyReturned' ||
                                                                            tempsheetpayload?.orderStatus == 'postponed' ||
                                                                            tempsheetpayload?.orderStatus == 'cancelled' ||
                                                                            tempsheetpayload?.orderStatus == 'failedDeliveryAttempt'
                                                                        ) {
                                                                            setstatuspayload({
                                                                                step: 0,
                                                                                orderid: item.id,
                                                                                status: '',
                                                                                type: item?.order?.type,
                                                                                order: item?.order,
                                                                                previousOrder: sheetOrders?.filter((ii) => ii.orderId == item?.order?.previousOrderId)[0]?.order,
                                                                                fullDelivery: true,
                                                                                fullReturn: true,
                                                                                returnStatus: 'returned',
                                                                            });
                                                                            if (tempsheetpayload?.status == 'financeAccepted' || tempsheetpayload?.status == 'adminAccepted') {
                                                                                return;
                                                                            }
                                                                            setchangestatusmodal(true);
                                                                        }
                                                                    }}
                                                                    style={{ cursor: 'pointer', marginInlineEnd: '5px' }}
                                                                    className={
                                                                        tempsheetpayload?.orderStatus == 'delivered' ||
                                                                        tempsheetpayload?.orderStatus == 'partiallyDelivered' ||
                                                                        tempsheetpayload?.orderStatus == 'returned' ||
                                                                        tempsheetpayload?.orderStatus == 'partiallyReturned'
                                                                            ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 text-capitalize '
                                                                            : tempsheetpayload?.orderStatus == 'cancelled' || tempsheetpayload?.orderStatus == 'failedDeliveryAttempt'
                                                                            ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 text-capitalize '
                                                                            : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 text-capitalize '
                                                                    }
                                                                >
                                                                    <span>{tempsheetpayload?.orderStatus?.split(/(?=[A-Z])/).join(' ')}</span>
                                                                </div>
                                                                {item?.order?.failsAndAssigns?.fails > 0 && (
                                                                    <div
                                                                        style={{ background: 'var(--danger)', color: 'white' }}
                                                                        className={' wordbreak rounded-pill font-weight-600 allcentered mr-1 '}
                                                                    >
                                                                        {item?.order?.failsAndAssigns?.fails} Failed Attempts
                                                                    </div>
                                                                )}
                                                                {item?.order?.merchant?.name}
                                                            </div>
                                                        </div>
                                                    </div>{' '}
                                                </div>

                                                <div className="col-lg-4 col-md-4 p-0">
                                                    <div className="row m-0 w-100">
                                                        {type == 'finance' && (
                                                            <div className="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                                                                <div className="row m-0 w-100 d-flex justify-content-end">
                                                                    <div class={'col-lg-12'}>
                                                                        <label for="name" class={formstyles.form__label + ' text-capitalize'}>
                                                                            Shipping
                                                                        </label>
                                                                        <Select
                                                                            options={[
                                                                                { label: 'Dismissed', value: 'dismissed' },
                                                                                { label: 'Collected', value: 'collected' },
                                                                                { label: 'Not Collected', value: 'notCollected' },
                                                                            ]}
                                                                            styles={defaultstyles}
                                                                            value={[
                                                                                { label: 'Dismissed', value: 'dismissed' },
                                                                                { label: 'Collected', value: 'collected' },
                                                                                { label: 'Not Collected', value: 'notCollected' },
                                                                            ].filter((option) => option.value == tempsheetpayload?.shippingCollected)}
                                                                            onChange={(option) => {
                                                                                var temp = { ...submitSheetPayload };

                                                                                temp.updateSheetOrders.map((i, ii) => {
                                                                                    if (i.sheetOrderId == item.id) {
                                                                                        temp.updateSheetOrders[ii].shippingCollected = option.value;
                                                                                    }
                                                                                });

                                                                                temp.updateSheetOrderstemp.map((i, ii) => {
                                                                                    if (i.sheetOrderId == item.id) {
                                                                                        temp.updateSheetOrderstemp[ii].shippingCollected = option.value;
                                                                                    }
                                                                                });

                                                                                setsubmitSheetPayload({ ...temp });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    {/* <div className="col-lg-12">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Collected</span>:{' '}
                                                                        <span style={{ fontWeight: 600, fontSize: '12px' }}>
                                                                            {item?.amountCollected ? new Decimal(item?.amountCollected).toFixed(2) : '0.00'} {item?.order?.currency}
                                                                        </span>
                                                                    </div> */}
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
                                                                                fontSize: '12px ',
                                                                            }}
                                                                            class={generalstyles.roundbutton + '  allcentered px-1 py-0'}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (
                                                                                    item?.amountCollected == null &&
                                                                                    item.order.status !== 'postponed' &&
                                                                                    item.order.status !== 'failedDeliveryAttempt'
                                                                                ) {
                                                                                    NotificationManager.warning(`Can not update order`, 'Warning!');
                                                                                    return;
                                                                                }

                                                                                const orderStatus = item?.order?.status;
                                                                                const sheetOrder = submitSheetPayload?.updateSheetOrders?.find((e) => e.sheetOrderId == item.id);

                                                                                const canUpdateOrder = ['delivered', 'partiallyDelivered', 'cancelled', 'failedDeliveryAttempt'].includes(orderStatus);
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
                                                                                    <FaCheck className="m-1 mt-1" size={8} />
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0">
                                                                        <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                            <div
                                                                                style={{
                                                                                    color: 'white',
                                                                                    borderRadius: '0.25rem',
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
                                            <div className="col-lg-12 p-3 mt-2">
                                                <div className="row m-0 w-100 d-flex">
                                                    <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Courier Collected</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {item?.amountCollected ? new Decimal(item?.amountCollected).toFixed(2) : '0.00'} {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping Price</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {item?.order?.paymentType != 'card'
                                                                        ? new Decimal(item?.order?.paymentType == 'cash' ? item?.order?.shippingPrice || 0 : 0).toFixed(2)
                                                                        : 0}{' '}
                                                                    {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: 600, fontSize: '15px', borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {new Decimal(item?.order?.price || 0)
                                                                        .plus(new Decimal(item?.order?.paymentType == 'cash' ? item?.order?.shippingPrice || 0 : 0))
                                                                        .toFixed(2)}{' '}
                                                                    {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{}} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Finance Received</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {type != 'admin' && tempsheetpayload?.status == 'financeAccepted'
                                                                        ? new Decimal(item?.amountCollected || 0)
                                                                              .plus(
                                                                                  new Decimal(
                                                                                      item?.order?.paymentType == 'card' ||
                                                                                      !(item?.order?.shippingCollected == 'collected' && item?.order?.paymentType == 'cash')
                                                                                          ? 0
                                                                                          : item?.order?.shippingPrice || 0,
                                                                                  ),
                                                                              )
                                                                              .toFixed(2)
                                                                        : '0.00'}{' '}
                                                                    {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* old */}
                                                    {/* <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Finance Received</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {type != 'admin' && tempsheetpayload?.status == 'financeAccepted'
                                                                        ? new Decimal(item?.amountCollected || 0)
                                                                              .plus(
                                                                                  new Decimal(
                                                                                      item?.order?.paymentType == 'card' ||
                                                                                      !(item?.order?.shippingCollected == 'collected' && item?.order?.paymentType == 'cash')
                                                                                          ? 0
                                                                                          : item?.order?.shippingPrice || 0,
                                                                                  ),
                                                                              )
                                                                              .toFixed(2)
                                                                        : '0.00'}{' '}
                                                                    {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {new Decimal(item?.order?.price || 0).toFixed(2)} {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {item?.order?.paymentType != 'card'
                                                                        ? new Decimal(item?.order?.paymentType == 'cash' ? item?.order?.shippingPrice || 0 : 0).toFixed(2)
                                                                        : 0}{' '}
                                                                    {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: 600, fontSize: '15px' }} className="p-0 mb-2 allcentered col-lg-3">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                            </div>
                                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {new Decimal(item?.order?.price || 0)
                                                                        .plus(new Decimal(item?.order?.paymentType == 'cash' ? item?.order?.shippingPrice || 0 : 0))
                                                                        .toFixed(2)}{' '}
                                                                    {item?.order?.currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        )}

                                        {previousOrder && (
                                            <>
                                                <div className={' col-lg-12 p-0 mb-2'}>
                                                    <hr class="mb-0" />
                                                </div>
                                                <div className={' col-lg-12 p-0'}>
                                                    <div className="row m-0 w-100">
                                                        <div className="col-lg-7 p-0">
                                                            <div className="row m-0 w-100">
                                                                <div class="col-lg-12 p-0 d-flex justify-content-start mb-1 mt-3">
                                                                    <div className="row m-0 w-100 d-flex align-items-center justify-content-start">
                                                                        <div style={{ background: '#eee', color: 'black' }} className={' wordbreak rounded-pill font-weight-600 allcentered '}>
                                                                            # {previousOrder?.order?.id}
                                                                        </div>

                                                                        <div
                                                                            style={{
                                                                                color: 'white',
                                                                                borderRadius: '0.25rem',
                                                                                fontSize: '11px',
                                                                                background: 'var(--primary)',
                                                                            }}
                                                                            class="allcentered mx-2 p-1 px-2 text-capitalize"
                                                                        >
                                                                            {previousOrder?.order?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                color: 'white',
                                                                                borderRadius: '0.25rem',
                                                                                fontSize: '11px',
                                                                                background: 'var(--primary)',
                                                                            }}
                                                                            class="allcentered p-1 px-2 text-capitalize"
                                                                        >
                                                                            {previousOrder?.order?.paymentType?.split(/(?=[A-Z])/).join(' ')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-12 p-0 d-flex justify-content-start mb-1">
                                                                    <div className="row m-0 w-100 d-flex align-items-center justify-content-start">
                                                                        <div
                                                                            style={{ cursor: 'pointer', marginInlineEnd: '5px' }}
                                                                            className={
                                                                                tempsheetpayloadPreviousOrder?.orderStatus == 'delivered' ||
                                                                                tempsheetpayloadPreviousOrder?.orderStatus == 'partiallyDelivered' ||
                                                                                tempsheetpayloadPreviousOrder?.orderStatus == 'returned' ||
                                                                                tempsheetpayloadPreviousOrder?.orderStatus == 'partiallyReturned'
                                                                                    ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 text-capitalize '
                                                                                    : tempsheetpayloadPreviousOrder?.orderStatus == 'cancelled' ||
                                                                                      tempsheetpayloadPreviousOrder?.orderStatus == 'failedDeliveryAttempt'
                                                                                    ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 text-capitalize '
                                                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 text-capitalize '
                                                                            }
                                                                        >
                                                                            <span>{tempsheetpayloadPreviousOrder?.orderStatus?.split(/(?=[A-Z])/).join(' ')}</span>
                                                                        </div>
                                                                        {previousOrder?.order?.failsAndAssigns?.fails > 0 && (
                                                                            <div
                                                                                style={{ background: 'var(--danger)', color: 'white' }}
                                                                                className={' wordbreak rounded-pill font-weight-600 allcentered mr-1 '}
                                                                            >
                                                                                {previousOrder?.order?.failsAndAssigns?.fails} Failed Attempts
                                                                            </div>
                                                                        )}
                                                                        {item?.order?.merchant?.name}
                                                                    </div>
                                                                </div>
                                                            </div>{' '}
                                                        </div>

                                                        <div className="col-lg-5 p-0">
                                                            <div className="row m-0 w-100">
                                                                {type == 'finance' && (
                                                                    <div className="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                                                                        <div className="row m-0 w-100 d-flex justify-content-end">
                                                                            <div class={'col-lg-12 '}>
                                                                                <label for="name" class={formstyles.form__label + ' text-capitalize'}>
                                                                                    Shipping
                                                                                </label>
                                                                                <Select
                                                                                    options={[
                                                                                        { label: 'Dismissed', value: 'dismissed' },
                                                                                        { label: 'Collected', value: 'collected' },
                                                                                        { label: 'Not Collected', value: 'notCollected' },
                                                                                    ]}
                                                                                    styles={defaultstyles}
                                                                                    value={[
                                                                                        { label: 'Dismissed', value: 'dismissed' },
                                                                                        { label: 'Collected', value: 'collected' },
                                                                                        { label: 'Not Collected', value: 'notCollected' },
                                                                                    ].filter((option) => option.value == tempsheetpayloadPreviousOrder?.shippingCollected)}
                                                                                    onChange={(option) => {
                                                                                        var temp = { ...submitSheetPayload };

                                                                                        temp.updateSheetOrders.map((i, ii) => {
                                                                                            if (i.sheetOrderId == previousOrder.id) {
                                                                                                temp.updateSheetOrders[ii].shippingCollected = option.value;
                                                                                            }
                                                                                        });

                                                                                        temp.updateSheetOrderstemp.map((i, ii) => {
                                                                                            if (i.sheetOrderId == previousOrder.id) {
                                                                                                temp.updateSheetOrderstemp[ii].shippingCollected = option.value;
                                                                                            }
                                                                                        });

                                                                                        setsubmitSheetPayload({ ...temp });
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            {/* <div className="col-lg-12">
                                                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Collected</span>:{' '}
                                                                                <span style={{ fontWeight: 600, fontSize: '12px' }}>
                                                                                    {previousOrder?.amountCollected ? new Decimal(previousOrder?.amountCollected).toFixed(2) : '0.00'}{' '}
                                                                                    {previousOrder?.order?.currency}
                                                                                </span>
                                                                            </div> */}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {type == 'finance' && (
                                                    <div className="col-lg-12 p-3 mt-2">
                                                        <div className="row m-0 w-100 d-flex">
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Courier Collected</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {previousOrder?.amountCollected ? new Decimal(previousOrder?.amountCollected).toFixed(2) : '0.00'}{' '}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping Price</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(previousOrder?.order?.paymentType == 'cash' ? previousOrder?.order?.shippingPrice || 0 : 0).toFixed(2)}{' '}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '15px', borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(previousOrder?.order?.price || 0)
                                                                                .plus(new Decimal(previousOrder?.order?.paymentType == 'cash' ? previousOrder?.order?.shippingPrice || 0 : 0))
                                                                                .toFixed(2)}{' '}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{}} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Finance Received</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {type != 'admin' && tempsheetpayload?.status == 'financeAccepted'
                                                                                ? new Decimal(previousOrder?.amountCollected || 0)
                                                                                      .plus(
                                                                                          new Decimal(
                                                                                              previousOrder?.order?.paymentType == 'card' ||
                                                                                              !(previousOrder?.order?.shippingCollected == 'collected' && previousOrder?.order?.paymentType == 'cash')
                                                                                                  ? 0
                                                                                                  : previousOrder?.order?.shippingPrice || 0,
                                                                                          ),
                                                                                      )
                                                                                      .toFixed(2)
                                                                                : '0.00'}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* old */}
                                                            {/* <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Finance Received</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {type != 'admin' && tempsheetpayload?.status == 'financeAccepted'
                                                                                ? new Decimal(previousOrder?.amountCollected || 0)
                                                                                      .plus(
                                                                                          new Decimal(
                                                                                              (previousOrder?.order?.shippingCollected == 'collected' && previousOrder?.order?.paymentType == 'cash') ||
                                                                                              previousOrder?.order?.paymentType == 'card'
                                                                                                  ? 0
                                                                                                  : previousOrder?.order?.shippingPrice || 0,
                                                                                          ),
                                                                                      )
                                                                                      .toFixed(2)
                                                                                : '0.00'}{' '}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(previousOrder?.order?.price || 0).toFixed(2)} {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(previousOrder?.order?.paymentType == 'cash' ? previousOrder?.order?.shippingPrice || 0 : 0).toFixed(2)}{' '}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '15px' }} className="p-0 mb-2 allcentered col-lg-3">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(previousOrder?.order?.price || 0)
                                                                                .plus(new Decimal(previousOrder?.order?.paymentType == 'cash' ? previousOrder?.order?.shippingPrice || 0 : 0))
                                                                                .toFixed(2)}{' '}
                                                                            {previousOrder?.order?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {tempsheetpayload?.expanded && (
                                            <>
                                                <hr className="mt-2 mb-3" />
                                                <div class="col-lg-12 p-0">
                                                    <div class="row m-0 w-100">
                                                        <div className="col-lg-12 p-0">
                                                            <div className="row m-0 w-100">
                                                                {orderItems?.length != 0 && (
                                                                    <>
                                                                        {type == 'admin' && (
                                                                            <div class="col-lg-12 mb-2 text-capitalize" style={{ fontWeight: 600 }}>
                                                                                {/* {item?.order?.type}  */}
                                                                                Items with courier
                                                                            </div>
                                                                        )}
                                                                        {orderItems?.map((subitem, subindex) => {
                                                                            return (
                                                                                <div className={type == 'admin' ? 'col-lg-6 mb-2' : 'col-lg-12 p-0 mb-2'} key={subindex}>
                                                                                    <div
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setskuModal(true);
                                                                                            setskuModalInfo({
                                                                                                previousOrder: previousOrder,
                                                                                                previousOrderItems: previousOrderItems,
                                                                                                order: item.order,
                                                                                                orderItems: orderItems,
                                                                                            });
                                                                                        }}
                                                                                        style={{ border: '1px solid #eee', borderRadius: '0.25rem' }}
                                                                                        className="row m-0 w-100 p-2 d-flex align-items-start"
                                                                                    >
                                                                                        {item?.order?.type == 'return' && (
                                                                                            <div
                                                                                                style={{ borderRadius: '10px', fontWeight: 700, fontSize: '11px' }}
                                                                                                className="p-1 px-2 mr-1 allcentered"
                                                                                            >
                                                                                                {subitem?.partialCount != null
                                                                                                    ? new Decimal(subitem.partialCount).toFixed(0)
                                                                                                    : new Decimal(subitem.count).toFixed(0)}
                                                                                            </div>
                                                                                        )}
                                                                                        {item?.order?.type != 'return' && (
                                                                                            <div
                                                                                                style={{ borderRadius: '10px', fontWeight: 700, fontSize: '11px' }}
                                                                                                className="p-1 px-2 mr-1 allcentered"
                                                                                            >
                                                                                                {subitem?.partialCount != null
                                                                                                    ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)).toFixed(0)
                                                                                                    : '0'}
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
                                                                                        <div style={{ marginTop: '10px' }}>
                                                                                            {item?.order?.type != 'return' && (
                                                                                                <div style={{ fontWeight: 700 }} className="mx-2">
                                                                                                    {new Decimal(
                                                                                                        subitem?.partialCount != null
                                                                                                            ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount))
                                                                                                            : new Decimal(0),
                                                                                                    )
                                                                                                        .times(new Decimal(subitem?.unitPrice))
                                                                                                        .toFixed(2)}{' '}
                                                                                                    {item?.order?.currency}
                                                                                                </div>
                                                                                            )}
                                                                                            {item?.order?.type == 'return' && (
                                                                                                <div style={{ fontWeight: 700 }} className="mx-2">
                                                                                                    {new Decimal(
                                                                                                        subitem?.partialCount != null ? new Decimal(subitem.partialCount) : new Decimal(subitem.count),
                                                                                                    )
                                                                                                        .times(new Decimal(subitem?.unitPrice))
                                                                                                        .toFixed(2)}{' '}
                                                                                                    {item?.order?.currency}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* <div className="col-lg-5 d-flex align-items-center">
                                                                              <div className="row m-0 w-100">
                                                                                  <div style={{ fontSize: '14px', fontWeight: 500 }} className={'col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                                      {subitem?.info?.item?.name ?? '-'}
                                                                                  </div>
                                                                                  <div style={{ fontSize: '12px' }} className={'col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                                      {subitem?.info?.name ?? '-'}
                                                                                  </div>
                                                                              </div>
                                                                          </div> */}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </>
                                                                )}

                                                                {previousOrder && previousOrderItems?.length != 0 && (
                                                                    <>
                                                                        <hr className="mt-2 mb-3" />
                                                                        <div class="col-lg-12 p-0">
                                                                            <div className="row m-0 w-100">
                                                                                {type == 'admin' && (
                                                                                    <div class="col-lg-12 mb-2 text-capitalize" style={{ fontWeight: 600 }}>
                                                                                        {previousOrder?.order?.type} items with courier
                                                                                    </div>
                                                                                )}
                                                                                {previousOrderItems?.map((subitem, subindex) => {
                                                                                    return (
                                                                                        <div className={type == 'admin' ? 'col-lg-6 mb-2' : 'col-lg-12 p-0 mb-2'} key={subindex}>
                                                                                            <div
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    setskuModal(true);
                                                                                                }}
                                                                                                style={{ border: '1px solid #eee', borderRadius: '0.25rem' }}
                                                                                                className="row m-0 w-100 p-2  "
                                                                                            >
                                                                                                {previousOrder?.order?.type == 'return' && (
                                                                                                    <div style={{ borderRadius: '8px', fontWeight: 700, fontSize: '11px' }} className="p-1 px-2 mr-1 ">
                                                                                                        {subitem?.partialCount != null
                                                                                                            ? new Decimal(subitem.partialCount).toFixed(0)
                                                                                                            : new Decimal(subitem.count).toFixed(0)}
                                                                                                    </div>
                                                                                                )}
                                                                                                {previousOrder?.order?.type != 'return' && (
                                                                                                    <div
                                                                                                        style={{ borderRadius: '8px', fontWeight: 700, fontSize: '11px' }}
                                                                                                        className="p-1 px-2 mr-1 allcentered"
                                                                                                    >
                                                                                                        {subitem?.partialCount != null
                                                                                                            ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)).toFixed(0)
                                                                                                            : '0'}
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
                                                                                                <div style={{ marginTop: '10px' }}>
                                                                                                    {previousOrder?.order?.type != 'return' && (
                                                                                                        <div style={{ fontWeight: 700 }} className="mx-2">
                                                                                                            {new Decimal(
                                                                                                                subitem?.partialCount != null
                                                                                                                    ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount))
                                                                                                                    : new Decimal(0),
                                                                                                            )
                                                                                                                .times(new Decimal(subitem?.unitPrice))
                                                                                                                .toFixed(2)}{' '}
                                                                                                            {previousOrder?.order?.currency}
                                                                                                        </div>
                                                                                                    )}
                                                                                                    {previousOrder?.order?.type == 'return' && (
                                                                                                        <div style={{ fontWeight: 700 }} className="mx-2">
                                                                                                            {new Decimal(
                                                                                                                subitem?.partialCount != null
                                                                                                                    ? new Decimal(subitem.partialCount)
                                                                                                                    : new Decimal(subitem.count),
                                                                                                            )
                                                                                                                .times(new Decimal(subitem?.unitPrice))
                                                                                                                .toFixed(2)}{' '}
                                                                                                            {previousOrder?.order?.currency}
                                                                                                        </div>
                                                                                                    )}
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
                                                        </div>
                                                        {/* <div class="col-lg-4 col-md-4 p-0">
                                                        <div class="row m-0 w-100 px-1">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                               
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
                                                    </div> */}
                                                    </div>
                                                    {/* {type == 'admin' && (
                                                    <div className="col-lg-12 p-0 d-flex justify-content-end mb-2 px-3" style={{ fontWeight: 600, fontSize: '15px' }}>
                                                        Total: {new Decimal(item?.order?.price ?? 0).plus(new Decimal(item?.order?.shippingPrice ?? 0)).toFixed(2)} {item?.order?.currency}
                                                    </div>
                                                )} */}
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
                        <div className="col-lg-4 col-md-4 p-0">
                            <div class="row m-0 w-100 d-flex align-items-center">
                                <span
                                    style={{
                                        fontWeight: 600,
                                        color: submitSheetPayload?.userInfo?.deletedAt ? 'var(--danger)' : undefined,
                                    }}
                                    class="text-capitalize"
                                >
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
                        <div className="col-lg-8 col-md-8 p-0 d-flex justify-content-end align-items-center">
                            <div
                                className={
                                    submitSheetPayload.status == 'completed'
                                        ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered text-capitalize '
                                        : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered text-capitalize '
                                }
                            >
                                {/* {courierSheetStatusesContext?.map((i, ii) => {
                                    if (i.value == submitSheetPayload?.status) {
                                        return <span>{i.label}</span>;
                                    }
                                })} */}
                                {submitSheetPayload?.status?.split(/(?=[A-Z])/).join(' ')}
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
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' mb-2 col-lg-12 p-2'}>
                        <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                            <AccordionItem class={`${generalstyles.innercard} p-2`}>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                <p class={`${generalstyles.cardTitle} m-0 p-0`}>Filter:</p>
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                <AccordionItemState>
                                                    {(state) => <i class="h-100 d-flex align-items-center justify-content-center">{state.expanded ? <BsChevronUp /> : <BsChevronDown />}</i>}
                                                </AccordionItemState>
                                            </div>
                                        </div>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <hr className="mt-2 mb-3" />
                                    <div class="row m-0 w-100">
                                        <div className="col-lg-2 p-0 mb-2 d-flex align-items-center ">
                                            <div className="row m-0 w-100 d-flex ">
                                                <label className={`${formstyles.switch}  my-0`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={filterorders?.accepted}
                                                        onChange={(e) => {
                                                            if (fetchCourierSheetLazyQuery?.loading) return;
                                                            e.stopPropagation();
                                                            setfilterorders({
                                                                ...filterorders,
                                                                accepted: filterorders?.accepted ? undefined : true,
                                                            });
                                                        }}
                                                        disabled={fetchCourierSheetLazyQuery?.loading}
                                                    />
                                                    <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                </label>
                                                <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak`}>Not Accepted</p>
                                            </div>
                                        </div>
                                        <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                            <MultiSelect
                                                title="Statuses"
                                                options={orderStatusEnumContext}
                                                label="label"
                                                value="value"
                                                selected={filterorders?.statuses}
                                                onClick={(option) => {
                                                    if (fetchCourierSheetLazyQuery?.loading) return;
                                                    const tempArray = [...(filterorders?.statuses ?? [])];

                                                    if (option === 'All') {
                                                        setfilterorders({ ...filterorders, statuses: undefined });
                                                    } else {
                                                        const index = tempArray.indexOf(option?.value);
                                                        if (index === -1) {
                                                            tempArray.push(option?.value);
                                                        } else {
                                                            tempArray.splice(index, 1);
                                                        }

                                                        setfilterorders({ ...filterorders, statuses: tempArray.length ? tempArray : undefined });
                                                    }
                                                }}
                                                disabled={fetchCourierSheetLazyQuery?.loading}
                                            />
                                        </div>

                                        <div class="col-lg-3">
                                            <Inputfield
                                                placeholder="Order Ids"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value?.length !== 0) {
                                                        if (fetchCourierSheetLazyQuery?.loading) return;
                                                        const orderId = parseInt(e.target.value);
                                                        if (!filterorders?.orderIds?.includes(orderId)) {
                                                            const tempArray = [...(filterorders?.orderIds ?? [])];
                                                            tempArray.push(orderId);
                                                            setfilterorders({ ...filterorders, orderIds: tempArray });
                                                            e.target.value = '';
                                                        } else {
                                                            NotificationManager.warning('', 'Already exists');
                                                        }
                                                    }
                                                }}
                                                disabled={fetchCourierSheetLazyQuery?.loading}
                                                type="number"
                                            />
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100 scrollmenuclasssubscrollbar" style={{ overflow: 'scroll', flexWrap: 'nowrap' }}>
                                                    {filterorders?.orderIds?.map((orderItem, orderIndex) => (
                                                        <div
                                                            key={orderIndex}
                                                            style={{
                                                                background: '#ECECEC',
                                                                padding: '5px 10px',
                                                                cursor: fetchCourierSheetLazyQuery?.loading ? 'not-allowed' : 'pointer',
                                                                borderRadius: '8px',
                                                                justifyContent: 'space-between',
                                                                width: 'fit-content',
                                                                fontSize: '11px',
                                                                minWidth: 'fit-content',
                                                            }}
                                                            className="d-flex align-items-center mr-2 mb-1"
                                                            onClick={() => {
                                                                if (fetchCourierSheetLazyQuery?.loading) return;
                                                                const tempArray = [...filterorders.orderIds];
                                                                tempArray.splice(orderIndex, 1);
                                                                setfilterorders({ ...filterorders, orderIds: tempArray.length ? tempArray : undefined });
                                                            }}
                                                        >
                                                            {orderItem}
                                                            <AiOutlineClose size={12} color="#6C757D" className="ml-2" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                <div class={'col-lg-12 p-0'}>
                    <Accordion allowMultipleExpanded expanded={expandedItems} preExpanded={expandedItems}>
                        <div class="row m-0 w-100">
                            {/* {fetchCourierSheets('Not')} */}
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
                                                ?.filter((item) => (item.status == 'adminAccepted' || item.status == 'financeAccepted') && item.paymentType != 'card')
                                                .map((e) => new Decimal(e?.amountCollected ?? '0').plus(e?.shippingCollected == 'collected' ? new Decimal(e?.shippingPrice ?? '0') : 0))
                                                .reduce((sum, current) => sum.plus(current), new Decimal(0))
                                                .toFixed(2)}{' '}
                                            {submitSheetPayload?.orderCurrency}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 p-0 d-flex justify-content-end">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton}
                                disabled={buttonLoadingContext}
                                onClick={() => {
                                    if (isAuth([1, 35])) {
                                        handleupdateCourierSheet();
                                    } else {
                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                    }
                                }}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>Update Manifest</span>}
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
                    <div className="row w-100 m-0 p-0 d-flex align-items-center">
                        <div class="col-lg-6 p-0 ">
                            <div className="row w-100 m-0 p-0 d-flex align-items-center">
                                {statuspayload?.step != 0 && (
                                    <div
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                        }}
                                        className="iconhover allcentered"
                                        onClick={() => {
                                            setstatuspayload({ ...statuspayload, step: statuspayload?.step - 1 });
                                        }}
                                    >
                                        <IoChevronBackOutline size={20} />
                                    </div>
                                )}
                                Update Order Status
                            </div>
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
                                <label for="name" class={formstyles.form__label + ' text-capitalize'}>
                                    {statuspayload.type} Status
                                </label>
                                <Select
                                    options={
                                        statuspayload.type == 'return'
                                            ? [
                                                  { label: 'Returned', value: 'returned' },
                                                  { label: 'Postponed', value: 'postponed' },
                                                  { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
                                                  { label: 'Cancelled', value: 'cancelled' },
                                              ]
                                            : [
                                                  { label: 'Delivered', value: 'delivered' },
                                                  { label: 'Postponed', value: 'postponed' },
                                                  { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
                                                  { label: 'Cancelled', value: 'cancelled' },
                                              ]
                                    }
                                    styles={defaultstyles}
                                    value={
                                        statuspayload.type == 'return'
                                            ? [
                                                  { label: 'Returned', value: 'returned' },
                                                  { label: 'Postponed', value: 'postponed' },
                                                  { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
                                                  { label: 'Cancelled', value: 'cancelled' },
                                              ]
                                            : [
                                                  { label: 'Delivered', value: 'delivered' },
                                                  { label: 'Postponed', value: 'postponed' },
                                                  { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
                                                  { label: 'Cancelled', value: 'cancelled' },
                                              ].filter((option) => option.value == statuspayload?.status)
                                    }
                                    onChange={(option) => {
                                        setstatuspayload({
                                            ...statuspayload,
                                            status: option.value,
                                            step: 1,

                                            postponeDate: option.value == 'postponed' ? new Date().toISOString().split('T')[0] : undefined,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {statuspayload?.step == 1 && (
                        <div class="row m-0 w-100 py-2">
                            {statuspayload?.status == 'cancelled' && (
                                <>
                                    <div class={'col-lg-12 mb-3'}>
                                        <label for="name" class={formstyles.form__label}>
                                            Shipping
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Dismissed', value: 'dismissed' },
                                                { label: 'Collected', value: 'collected' },
                                                { label: 'Not Collected', value: 'notCollected' },
                                            ]}
                                            styles={defaultstyles}
                                            value={[
                                                { label: 'Dismissed', value: 'dismissed' },
                                                { label: 'Collected', value: 'collected' },
                                                { label: 'Not Collected', value: 'notCollected' },
                                            ].filter((option) => option.value == statuspayload?.shippingCollected)}
                                            onChange={(option) => {
                                                setstatuspayload({ ...statuspayload, shippingCollected: option.value });
                                            }}
                                        />
                                    </div>
                                    {statuspayload?.previousOrder && (
                                        <div className="row m-0 w-100">
                                            <div class={'col-lg-12 mb-3'}>
                                                <label for="name" class={formstyles.form__label}>
                                                    Status
                                                </label>
                                                <Select
                                                    options={[
                                                        { label: 'Cancelled', value: 'cancelled' },
                                                        { label: 'Returned', value: 'returned' },
                                                    ]}
                                                    styles={defaultstyles}
                                                    value={[
                                                        { label: 'Cancelled', value: 'cancelled' },
                                                        { label: 'Returned', value: 'returned' },
                                                    ].filter((option) => option.value == statuspayload?.returnStatus)}
                                                    onChange={(option) => {
                                                        setstatuspayload({ ...statuspayload, returnStatus: option.value, step: 1 });
                                                    }}
                                                />
                                            </div>
                                            {statuspayload?.returnStatus == 'returned' && (
                                                <>
                                                    <div className="col-lg-12 mb-3 p-0">
                                                        <div className="row m-0 w-100 d-flex align-items-center">
                                                            <label className={`${formstyles.switch} mx-2 my-0`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={statuspayload?.fullReturn}
                                                                    onChange={(e) => {
                                                                        const newStatus = !statuspayload?.fullReturn;
                                                                        const partialItemsReturnTemp = newStatus
                                                                            ? []
                                                                            : statuspayload?.previousOrder?.orderItems?.map((i) => ({
                                                                                  id: i.id,
                                                                                  partialCount: i.count,
                                                                              })) || [];

                                                                        setstatuspayload((prev) => ({
                                                                            ...prev,
                                                                            fullReturn: newStatus,
                                                                            partialDilevery: !newStatus,
                                                                            partialItemsReturn: newStatus ? undefined : partialItemsReturnTemp,
                                                                        }));
                                                                    }}
                                                                />
                                                                <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                            </label>
                                                            <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>Full return</p>
                                                        </div>
                                                    </div>

                                                    {statuspayload?.previousOrder?.orderItems?.map((subitem, subindex) => {
                                                        const partialItem = statuspayload?.partialItemsReturn?.find((i) => i.id === subitem.id) || {};

                                                        return (
                                                            <div key={subindex} className="col-lg-12 p-0 mb-2">
                                                                <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} className="row m-0 w-100 p-2 d-flex align-items-center">
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

                                                                    <div className="col-lg-5 d-flex align-items-center">
                                                                        <div className="row m-0 w-100">
                                                                            <div style={{ fontSize: '14px', fontWeight: 500 }} className="col-lg-12 p-0 wordbreak wordbreak1">
                                                                                {subitem?.info?.item?.name ?? '-'}
                                                                            </div>
                                                                            <div style={{ fontSize: '12px' }} className="col-lg-12 p-0 wordbreak wordbreak1">
                                                                                {subitem?.info?.name ?? '-'}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-5">
                                                                        <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                            <div style={{ fontWeight: 700 }} className="mx-2">
                                                                                {statuspayload?.fullReturn
                                                                                    ? new Decimal(subitem?.count).times(new Decimal(subitem?.unitPrice)).toFixed(2) // Using Decimal here
                                                                                    : new Decimal(subitem.unitPrice).times(new Decimal(partialItem?.partialCount ?? 0)).toFixed(2)}{' '}
                                                                                {statuspayload?.info?.currency}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-12 p-0 mt-2">
                                                                        <div className="row m-0 w-100">
                                                                            {statuspayload?.fullReturn && (
                                                                                <div
                                                                                    style={{
                                                                                        border: '1px solid #eee',
                                                                                        borderRadius: '8px',
                                                                                        fontWeight: 700,
                                                                                        background: 'var(--primary)',
                                                                                        color: 'white',
                                                                                        width: '35px',
                                                                                    }}
                                                                                    className="p-1 px-2 mr-1 allcentered"
                                                                                >
                                                                                    {new Decimal(subitem.count).toFixed(0)} {/* Using Decimal for full return */}
                                                                                </div>
                                                                            )}
                                                                            {!statuspayload?.fullReturn && (
                                                                                <>
                                                                                    {Array.from(
                                                                                        { length: new Decimal(subitem.count).plus(1).toNumber() },
                                                                                        (
                                                                                            _,
                                                                                            i, // Using Decimal for the count
                                                                                        ) => (
                                                                                            <div
                                                                                                key={i}
                                                                                                onClick={() => {
                                                                                                    const partialItemsReturnTemp = [...(statuspayload?.partialItemsReturn || [])];
                                                                                                    const existingItemIndex = partialItemsReturnTemp?.findIndex((item) => item.id === subitem?.id);

                                                                                                    if (existingItemIndex !== -1) {
                                                                                                        partialItemsReturnTemp[existingItemIndex].partialCount = i;
                                                                                                    } else {
                                                                                                        partialItemsReturnTemp.push({ id: subitem?.id, partialCount: i });
                                                                                                    }

                                                                                                    setstatuspayload((prev) => ({
                                                                                                        ...prev,
                                                                                                        partialItemsReturn: partialItemsReturnTemp,
                                                                                                    }));
                                                                                                }}
                                                                                                style={{
                                                                                                    border: '1px solid #eee',
                                                                                                    borderRadius: '8px',
                                                                                                    fontWeight: 700,
                                                                                                    background: partialItem?.partialCount === i ? 'var(--primary)' : '',
                                                                                                    color: partialItem?.partialCount === i ? 'white' : '',
                                                                                                    width: '35px',
                                                                                                    cursor: 'pointer',
                                                                                                    transition: 'all 0.4s',
                                                                                                }}
                                                                                                className="p-1 px-2 mr-1 allcentered"
                                                                                            >
                                                                                                {i}
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {!statuspayload?.previousOrder?.originalPrice && !statuspayload?.fullReturn && (
                                                        <div className="col-lg-12 mb-3">
                                                            <Inputfield
                                                                placeholder={'Amount Received'}
                                                                value={statuspayload?.amountCollectedReturn}
                                                                onChange={(event) => {
                                                                    setstatuspayload((prev) => ({ ...prev, amountCollectedReturn: event.target.value }));
                                                                }}
                                                                type={'number'}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
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
                            {(statuspayload?.status == 'delivered' || statuspayload?.status == 'returned') && (
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
                                                <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>
                                                    {statuspayload?.status == 'returned' ? 'Full return' : 'Full delivery'}{' '}
                                                </p>
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
                                                    <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="row m-0 w-100 p-2 d-flex align-items-center">
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
                                                        <div class={'col-lg-5'}>
                                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                <div style={{ fontWeight: 700 }} class="mx-2">
                                                                    {statuspayload?.fullDelivery
                                                                        ? new Decimal(subitem?.count).times(new Decimal(subitem?.unitPrice)).toFixed(2)
                                                                        : new Decimal(subitem.unitPrice).times(new Decimal(partialItem?.partialCount ?? 0)).toFixed(2)}{' '}
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
                                                                        className="p-1 px-2 mr-1 allcentered"
                                                                    >
                                                                        {new Decimal(subitem.count).toFixed(0)} {/* Using Decimal here */}
                                                                    </div>
                                                                )}
                                                                {!statuspayload?.fullDelivery && (
                                                                    <>
                                                                        {Array.from({ length: new Decimal(subitem.count).plus(1).toNumber() }, (_, i) => (
                                                                            <div
                                                                                onClick={() => {
                                                                                    var partialItemsTemp = [...(statuspayload?.partialItems || [])]; // Use an empty array if partialItems is undefined
                                                                                    const existingItemIndex = partialItemsTemp.findIndex((item) => item.id === subitem?.id);

                                                                                    // Only update if the existing item is found
                                                                                    if (existingItemIndex !== -1) {
                                                                                        partialItemsTemp[existingItemIndex].partialCount = i;
                                                                                    }

                                                                                    setstatuspayload({ ...statuspayload, partialItems: partialItemsTemp });
                                                                                }}
                                                                                key={i}
                                                                                style={{
                                                                                    border: '1px solid #eee',
                                                                                    borderRadius: '8px',
                                                                                    fontWeight: 700,
                                                                                    background: partialItem.partialCount === i ? 'var(--primary)' : '',
                                                                                    color: partialItem.partialCount === i ? 'white' : '',
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
                                                <div class={'col-lg-12 mb-3'}>
                                                    <label for="name" class={formstyles.form__label}>
                                                        Shipping
                                                    </label>
                                                    <Select
                                                        options={[
                                                            { label: 'Dismissed', value: 'dismissed' },
                                                            { label: 'Collected', value: 'collected' },
                                                            { label: 'Not Collected', value: 'notCollected' },
                                                        ]}
                                                        styles={defaultstyles}
                                                        value={[
                                                            { label: 'Dismissed', value: 'dismissed' },
                                                            { label: 'Collected', value: 'collected' },
                                                            { label: 'Not Collected', value: 'notCollected' },
                                                        ].filter((option) => option.value == statuspayload?.shippingCollected)}
                                                        onChange={(option) => {
                                                            setstatuspayload({ ...statuspayload, shippingCollected: option.value });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {!statuspayload?.order?.originalPrice && !statuspayload?.fullDelivery && (
                                            <div class={'col-lg-12 mb-3'}>
                                                <Inputfield
                                                    placeholder={'Amount Received'}
                                                    value={statuspayload?.amountCollected}
                                                    onChange={(event) => {
                                                        setstatuspayload({ ...statuspayload, amountCollected: event.target.value });
                                                    }}
                                                    type={'number'}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {statuspayload?.previousOrder && (
                                        <div className="row m-0 w-100">
                                            <div class={'col-lg-12 mb-3'}>
                                                <label for="name" class={formstyles.form__label}>
                                                    Status
                                                </label>
                                                <Select
                                                    options={[
                                                        { label: 'Cancelled', value: 'cancelled' },
                                                        { label: 'Returned', value: 'returned' },
                                                    ]}
                                                    styles={defaultstyles}
                                                    value={[
                                                        { label: 'Cancelled', value: 'cancelled' },
                                                        { label: 'Returned', value: 'returned' },
                                                    ].filter((option) => option.value == statuspayload?.returnStatus)}
                                                    onChange={(option) => {
                                                        setstatuspayload({ ...statuspayload, returnStatus: option.value, step: 1 });
                                                    }}
                                                />
                                            </div>
                                            {statuspayload?.returnStatus == 'returned' && (
                                                <>
                                                    <div className="col-lg-12 mb-3 p-0">
                                                        <div className="row m-0 w-100 d-flex align-items-center">
                                                            <label className={`${formstyles.switch} mx-2 my-0`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={statuspayload?.fullReturn}
                                                                    onChange={(e) => {
                                                                        const newStatus = !statuspayload?.fullReturn;
                                                                        const partialItemsReturnTemp = newStatus
                                                                            ? []
                                                                            : statuspayload?.previousOrder?.orderItems?.map((i) => ({
                                                                                  id: i.id,
                                                                                  partialCount: i.count,
                                                                              })) || [];

                                                                        setstatuspayload((prev) => ({
                                                                            ...prev,
                                                                            fullReturn: newStatus,
                                                                            partialDilevery: !newStatus,
                                                                            partialItemsReturn: newStatus ? undefined : partialItemsReturnTemp,
                                                                        }));
                                                                    }}
                                                                />
                                                                <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                            </label>
                                                            <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>Full return</p>
                                                        </div>
                                                    </div>

                                                    {statuspayload?.previousOrder?.orderItems?.map((subitem, subindex) => {
                                                        const partialItem = statuspayload?.partialItemsReturn?.find((i) => i.id === subitem.id) || {};

                                                        return (
                                                            <div key={subindex} className="col-lg-12 p-0 mb-2">
                                                                <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} className="row m-0 w-100 p-2 d-flex align-items-center">
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

                                                                    <div className="col-lg-5 d-flex align-items-center">
                                                                        <div className="row m-0 w-100">
                                                                            <div style={{ fontSize: '14px', fontWeight: 500 }} className="col-lg-12 p-0 wordbreak wordbreak1">
                                                                                {subitem?.info?.item?.name ?? '-'}
                                                                            </div>
                                                                            <div style={{ fontSize: '12px' }} className="col-lg-12 p-0 wordbreak wordbreak1">
                                                                                {subitem?.info?.name ?? '-'}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-5">
                                                                        <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                            <div style={{ fontWeight: 700 }} className="mx-2">
                                                                                {statuspayload?.fullReturn
                                                                                    ? new Decimal(subitem?.count).times(new Decimal(subitem?.unitPrice)).toFixed(2) // Using Decimal here
                                                                                    : new Decimal(subitem.unitPrice).times(new Decimal(partialItem?.partialCount ?? 0)).toFixed(2)}{' '}
                                                                                {statuspayload?.info?.currency}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-12 p-0 mt-2">
                                                                        <div className="row m-0 w-100">
                                                                            {statuspayload?.fullReturn && (
                                                                                <div
                                                                                    style={{
                                                                                        border: '1px solid #eee',
                                                                                        borderRadius: '8px',
                                                                                        fontWeight: 700,
                                                                                        background: 'var(--primary)',
                                                                                        color: 'white',
                                                                                        width: '35px',
                                                                                    }}
                                                                                    className="p-1 px-2 mr-1 allcentered"
                                                                                >
                                                                                    {new Decimal(subitem.count).toFixed(0)} {/* Using Decimal for full return */}
                                                                                </div>
                                                                            )}
                                                                            {!statuspayload?.fullReturn && (
                                                                                <>
                                                                                    {Array.from(
                                                                                        { length: new Decimal(subitem.count).plus(1).toNumber() },
                                                                                        (
                                                                                            _,
                                                                                            i, // Using Decimal for the count
                                                                                        ) => (
                                                                                            <div
                                                                                                key={i}
                                                                                                onClick={() => {
                                                                                                    const partialItemsReturnTemp = [...(statuspayload?.partialItemsReturn || [])];
                                                                                                    const existingItemIndex = partialItemsReturnTemp?.findIndex((item) => item.id === subitem?.id);

                                                                                                    if (existingItemIndex !== -1) {
                                                                                                        partialItemsReturnTemp[existingItemIndex].partialCount = i;
                                                                                                    } else {
                                                                                                        partialItemsReturnTemp.push({ id: subitem?.id, partialCount: i });
                                                                                                    }

                                                                                                    setstatuspayload((prev) => ({
                                                                                                        ...prev,
                                                                                                        partialItemsReturn: partialItemsReturnTemp,
                                                                                                    }));
                                                                                                }}
                                                                                                style={{
                                                                                                    border: '1px solid #eee',
                                                                                                    borderRadius: '8px',
                                                                                                    fontWeight: 700,
                                                                                                    background: partialItem?.partialCount === i ? 'var(--primary)' : '',
                                                                                                    color: partialItem?.partialCount === i ? 'white' : '',
                                                                                                    width: '35px',
                                                                                                    cursor: 'pointer',
                                                                                                    transition: 'all 0.4s',
                                                                                                }}
                                                                                                className="p-1 px-2 mr-1 allcentered"
                                                                                            >
                                                                                                {i}
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {!statuspayload?.previousOrder?.originalPrice && !statuspayload?.fullReturn && (
                                                        <div className="col-lg-12 mb-3">
                                                            <Inputfield
                                                                placeholder={'Amount Received'}
                                                                value={statuspayload?.amountCollectedReturn}
                                                                onChange={(event) => {
                                                                    setstatuspayload((prev) => ({ ...prev, amountCollectedReturn: event.target.value }));
                                                                }}
                                                                type={'number'}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="row m-0 w-100 p-2 d-flex align-items-center">
                                        Total: {total}
                                    </div>
                                </div>
                            )}

                            {statuspayload?.status == 'failedDeliveryAttempt' && (
                                <div class={'col-lg-12 mb-3'}>
                                    <label for="name" class={formstyles.form__label}>
                                        Comment
                                    </label>
                                    <Select
                                        options={[
                                            { label: 'الرقم غلط', value: 'الرقم غلط' },
                                            { label: 'العنوان غير واضح', value: 'العنوان غير واضح' },
                                            { label: 'لم يتم الرد و تم ارسال رساله', value: 'لم يتم الرد و تم ارسال رساله' },
                                            { label: 'مغلق و تم ارسال رسالة', value: 'مغلق و تم ارسال رسالة' },
                                            { label: 'عدم الرد بعد تأجيل استلام الاوردر لاكثر من مره مع المندوب', value: 'عدم الرد بعد تأجيل استلام الاوردر لاكثر من مره مع المندوب' },
                                            { label: 'يوجد خطأ فى سعر الاوردر فى انتظار رد من الراسل', value: 'يوجد خطأ فى سعر الاوردر فى انتظار رد من الراسل' },
                                            { label: 'لا يوجد رد و تم الذهاب للعنوان و لا يوجد احد للاستلام', value: 'لا يوجد رد و تم الذهاب للعنوان و لا يوجد احد للاستلام' },
                                        ]}
                                        styles={defaultstyles}
                                        value={[
                                            { label: 'الرقم غلط', value: 'الرقم غلط' },
                                            { label: 'العنوان غير واضح', value: 'العنوان غير واضح' },
                                            { label: 'لم يتم الرد و تم ارسال رساله', value: 'لم يتم الرد و تم ارسال رساله' },
                                            { label: 'مغلق و تم ارسال رسالة', value: 'مغلق و تم ارسال رسالة' },
                                            { label: 'عدم الرد بعد تأجيل استلام الاوردر لاكثر من مره مع المندوب', value: 'عدم الرد بعد تأجيل استلام الاوردر لاكثر من مره مع المندوب' },
                                            { label: 'يوجد خطأ فى سعر الاوردر فى انتظار رد من الراسل', value: 'يوجد خطأ فى سعر الاوردر فى انتظار رد من الراسل' },
                                            { label: 'لا يوجد رد و تم الذهاب للعنوان و لا يوجد احد للاستلام', value: 'لا يوجد رد و تم الذهاب للعنوان و لا يوجد احد للاستلام' },
                                        ].filter((option) => option.value == statuspayload?.description)}
                                        onChange={(option) => {
                                            setstatuspayload({ ...statuspayload, description: option.value, step: 1 });
                                        }}
                                    />
                                </div>
                            )}

                            <div class="col-lg-12 mb-3 allcentered">
                                <button
                                    onClick={async () => {
                                        if (
                                            !statuspayload?.order?.originalPrice &&
                                            !statuspayload?.fullDelivery &&
                                            !statuspayload?.amountCollected &&
                                            (statuspayload?.status == 'delivered' || statuspayload?.status == 'returned')
                                        ) {
                                            NotificationManager.warning('Enter Amount Collected.', 'Warning!');
                                            return;
                                        }
                                        if (
                                            (statuspayload?.shippingCollected?.length == 0 || !statuspayload?.shippingCollected) &&
                                            statuspayload?.status !== 'postponed' &&
                                            statuspayload?.status !== 'failedDeliveryAttempt'
                                        ) {
                                            NotificationManager.warning('Enter Shipping.', 'Warning!');
                                            return;
                                        }
                                        try {
                                            setupdateStatusbuttonLoadingContext(true);
                                            const { data } = await updateOrdersStatusMutation();
                                            if (data?.updateOrderStatus?.success) {
                                                var temp = { ...submitSheetPayload };
                                                temp.updateSheetOrderstemp.map((i, ii) => {
                                                    if (i.orderId == statuspayload.order.id) {
                                                        temp.updateSheetOrderstemp[ii].orderStatus =
                                                            !statuspayload?.fullDelivery && statuspayload?.status == 'delivered'
                                                                ? 'partiallyDelivered'
                                                                : !statuspayload?.fullDelivery && statuspayload?.status == 'returned'
                                                                ? 'partiallyReturned'
                                                                : statuspayload?.status;
                                                    }

                                                    if (i.orderId == statuspayload?.previousOrder?.id) {
                                                        temp.updateSheetOrderstemp[ii].orderStatus =
                                                            statuspayload?.status == 'postponed'
                                                                ? statuspayload?.status
                                                                : !statuspayload?.fullReturn && statuspayload?.returnStatus == 'returned'
                                                                ? 'partiallyReturned'
                                                                : statuspayload?.returnStatus;
                                                    }
                                                });

                                                const deepClone = (obj) => JSON.parse(JSON.stringify(obj)); // Utility for deep cloning

                                                var sheetOrdersTemp = deepClone(sheetOrders);
                                                if (statuspayload?.order?.id) {
                                                    sheetOrders?.forEach((sheet, sheetIndex) => {
                                                        if (sheet.order.id === statuspayload.order.id) {
                                                            sheetOrdersTemp[sheetIndex].order.status =
                                                                !statuspayload?.fullDelivery && statuspayload?.status == 'delivered'
                                                                    ? 'partiallyDelivered'
                                                                    : !statuspayload?.fullDelivery && statuspayload?.status == 'returned'
                                                                    ? 'partiallyReturned'
                                                                    : statuspayload?.status;
                                                            sheet?.order?.orderItems?.forEach((orderitem, orderitemindex) => {
                                                                const matchingSuborder = statuspayload?.partialItems?.find((suborderitem) => suborderitem.id === orderitem.id);
                                                                // if (matchingSuborder) {
                                                                sheetOrdersTemp[sheetIndex].order.orderItems[orderitemindex].partialCount = matchingSuborder
                                                                    ? matchingSuborder?.partialCount
                                                                    : sheetOrdersTemp[sheetIndex].order.orderItems[orderitemindex].count;
                                                                // }
                                                            });
                                                        }
                                                    });
                                                }

                                                if (statuspayload?.previousOrder?.id) {
                                                    sheetOrders?.forEach((sheet, sheetIndex) => {
                                                        if (sheet.order.id === statuspayload.previousOrder.id) {
                                                            sheetOrdersTemp[sheetIndex].order.status =
                                                                statuspayload?.status == 'postponed'
                                                                    ? statuspayload?.status
                                                                    : !statuspayload?.fullReturn && statuspayload?.returnStatus == 'returned'
                                                                    ? 'partiallyReturned'
                                                                    : statuspayload?.returnStatus;
                                                            sheet?.order?.orderItems?.forEach((orderitem, orderitemindex) => {
                                                                const matchingSuborder = statuspayload?.partialItemsReturn?.find((suborderitem) => suborderitem.id === orderitem.id);

                                                                // if (matchingSuborder) {
                                                                sheetOrdersTemp[sheetIndex].order.orderItems[orderitemindex].partialCount = matchingSuborder
                                                                    ? matchingSuborder?.partialCount
                                                                    : sheetOrdersTemp[sheetIndex].order.orderItems[orderitemindex].count;
                                                                // }
                                                            });
                                                        }
                                                    });
                                                }

                                                setsheetOrders(sheetOrdersTemp);

                                                setsubmitSheetPayload({ ...temp });
                                                setstatuspayload({ step: 0, orderid: '', status: '', fullDelivery: true });
                                                setchangestatusmodal(false);
                                                NotificationManager.success('', 'Status changed successfully');
                                            } else {
                                                NotificationManager.warning(data?.updateOrderStatus?.message, 'Warning!');
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
                                        setupdateStatusbuttonLoadingContext(false);
                                    }}
                                    class={generalstyles.roundbutton}
                                    disabled={updateStatusbuttonLoadingContext}
                                >
                                    {updateStatusbuttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                    {!updateStatusbuttonLoadingContext && <span>Update Status</span>}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <OrderItemsModal
                openModal={skuModal}
                setOpenModal={setskuModal}
                previousOrder={skuModalInfo?.previousOrder}
                order={skuModalInfo?.item?.order}
                orderItems={skuModalInfo?.orderItems}
                previousOrderItems={skuModalInfo?.previousOrderItems}
            />
        </div>
    );
};
export default CourierSheet;
