import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

import { Accordion, AccordionItem, AccordionItemPanel } from 'react-accessible-accordion';
import API from '../../../API/API.js';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { NotificationManager } from 'react-notifications';
import { FaCheck } from 'react-icons/fa';

const CourierSheet = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusesContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchCourierSheet, updateCourierSheet, useMutationGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [sheetID, setsheetID] = useState(null);
    const [submitSheetPayload, setsubmitSheetPayload] = useState({});
    const [type, settype] = useState('');

    const fetchCourierSheetQuery = useQueryGQL('', fetchCourierSheet(sheetID));
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
        updateSheetOrders: submitSheetPayload?.updateSheetOrders,
    });

    const handleupdateCourierSheet = async () => {
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
            // console.error('Error adding user:', error);
        }
    };

    // Initialize the expanded state for each accordion item
    const [expandedItems, setExpandedItems] = useState([]);
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
                shippingCollected: item?.shippingCollected,
                description: '',
            });
            temp.updateSheetOrders.push({
                sheetOrderId: item?.id,
                status: type == 'admin' ? (item?.adminPass ? 'adminAccepted' : 'adminRejected') : item?.financePass ? 'financeAccepted' : 'financeRejected',
                shippingCollected: item?.shippingCollected,
                description: '',
            });
        });
        temp.orderTotal = total;
        temp.orderCurrency = currency;
        temp.status = fetchCourierSheetQuery?.data?.CourierSheet?.status;
        setsubmitSheetPayload({ ...temp });
    }, [fetchCourierSheetQuery?.data]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Sheet
                    </p>
                </div>
                {type == 'finance' && (
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '20px', fontWeight: 600 }}>
                            {submitSheetPayload?.orderTotal} {submitSheetPayload?.orderCurrency}
                        </p>
                    </div>
                )}
                {/* <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                            <AccordionItemState>
                                                {(state) => {
                                                    if (state.expanded == true) {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                 <BsChevronDown />
                                                            </i>
                                                        );
                                                    }
                                                }}
                                            </AccordionItemState>
                                        </div>
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <hr className="mt-2 mb-3" />
                                <div class="row m-0 w-100">
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <label for="name" class={formstyles.form__label}>
                                            Status
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Pending', value: '1' },
                                                { label: 'Done', value: '2' },
                                            ]}
                                            styles={defaultstyles}
                                            value={
                                                [
                                                    { label: 'Pending', value: '1' },
                                                    { label: 'Done', value: '2' },
                                                ]
                                                // .filter((option) => option.value == props?.payload[item?.attr])
                                            }
                                            onChange={(option) => {
                                                // props?.setsubmit(false);
                                                // var temp = { ...props?.payload };
                                                // temp[item?.attr] = option.value;
                                                // props?.setpayload({ ...temp });
                                            }}
                                        />
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div> */}
                <div class={'col-lg-12 p-0'}>
                    <Accordion allowMultipleExpanded expanded={expandedItems} preExpanded={expandedItems}>
                        <div class="row m-0 w-100">
                            {fetchCourierSheetQuery?.data?.CourierSheet?.sheetOrders?.map((item, index) => {
                                var tempsheetpayload = {};
                                submitSheetPayload?.updateSheetOrderstemp?.map((i, ii) => {
                                    if (item?.id == i.sheetOrderId) {
                                        tempsheetpayload = i;
                                    }
                                });
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            handleAccordionChange(index);
                                            var temp = { ...submitSheetPayload };

                                            temp.updateSheetOrders.map((i, ii) => {
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
                                        <AccordionItem uuid={index} style={{}} className={generalstyles.filter_container + ' col-lg-12 p-2 mb-3'}>
                                            <div className={' col-lg-12 p-0'}>
                                                <div className="row m-0 w-100">
                                                    <div className="col-lg-7 p-0">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0">
                                                                <label style={{}} className={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex my-0 '}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mt-auto mb-auto"
                                                                        checked={tempsheetpayload.expanded}
                                                                        onChange={() => {
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

                                                                                temp.updateSheetOrders.map((i, ii) => {
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
                                                            <div className="col-lg-12 mb-2" style={{ fontWeight: 600 }}>
                                                                #{item?.id}
                                                            </div>
                                                            <div class="col-lg-12 p-0 d-flex justify-content-start mb-1">
                                                                <div className="row m-0 w-100 d-flex align-items-center justify-content-start">
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
                                                                                : 'Finance Rejected'
                                                                            : item?.adminPass
                                                                            ? 'Admin Accepted'
                                                                            : 'Admin Rejected'}
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            item.status == 'delivered'
                                                                                ? ' wordbreak text-success bg-light-success rounded-pill allcentered  '
                                                                                : item?.status == 'postponed' || item?.status == 'failedDeliveryAttempt'
                                                                                ? ' wordbreak text-danger bg-light-danger rounded-pill allcentered '
                                                                                : ' wordbreak text-warning bg-light-warning rounded-pill allcentered '
                                                                        }
                                                                    >
                                                                        {orderStatusesContext?.map((i, ii) => {
                                                                            if (i.value == item?.order?.status) {
                                                                                return <span>{i.label}</span>;
                                                                            }
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>{' '}
                                                    </div>
                                                    <div className="col-lg-5 p-0">
                                                        <div className="row m-0 w-100">
                                                            <div className="col-lg-12 p-0 d-flex justify-content-end">
                                                                <div className="row m-0 w-100 d-flex justify-content-end">
                                                                    <label className={`${formstyles.switch} mx-2 my-0`}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!tempsheetpayload?.shippingCollected}
                                                                            onChange={() => {
                                                                                var temp = { ...submitSheetPayload };

                                                                                temp.updateSheetOrders.map((i, ii) => {
                                                                                    if (i.sheetOrderId == item.id) {
                                                                                        temp.updateSheetOrders[ii].shippingCollected = !temp.updateSheetOrders[ii].shippingCollected;
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
                                                            <div className="col-lg-12 p-0 d-flex justify-content-end">
                                                                <div>
                                                                    <div className="row w-100 d-flex align-items-center m-0">
                                                                        <div className="col-lg-12 p-0 mt-2">
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
                                                                                // disabled={
                                                                                //     item?.order?.status != 'delivered' &&
                                                                                //     item?.order?.status != 'partiallyDelivered' &&
                                                                                //     item?.order?.status != 'cancelled' &&
                                                                                //     item?.order?.status != 'cancelled'
                                                                                // }
                                                                                onClick={(e) => {
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

                                                                                        temp.updateSheetOrders.map((i, ii) => {
                                                                                            if (i.sheetOrderId == item.id) {
                                                                                                if (expandedItems.includes(index)) {
                                                                                                    temp.updateSheetOrders[ii].status = type == 'admin' ? 'adminAccepted' : 'financeAccepted';
                                                                                                    temp.updateSheetOrderstemp[ii].status = type == 'admin' ? 'adminAccepted' : 'financeAccepted';
                                                                                                } else {
                                                                                                    temp.updateSheetOrders[ii].status = type == 'admin' ? 'adminRejected' : 'financeRejected';
                                                                                                    temp.updateSheetOrderstemp[ii].status = type == 'admin' ? 'adminRejected' : 'financeRejected';
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                        setsubmitSheetPayload({ ...temp });
                                                                                    } else {
                                                                                        NotificationManager.warning('Can not update order with status ' + item?.order?.status, 'Warning!');
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

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
                                                                                <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-2">
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
                                                                                    <div class="col-lg-6 d-flex align-items-center">
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
                                                                                            <div>
                                                                                                {subitem?.partialCount && (
                                                                                                    <div
                                                                                                        style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }}
                                                                                                        class="row m-0 w-100 p-1 px-2"
                                                                                                    >
                                                                                                        {parseInt(subitem.count) - parseInt(subitem.partialCount)}/{subitem.count}
                                                                                                    </div>
                                                                                                )}
                                                                                                {!subitem?.partialCount && (
                                                                                                    <div
                                                                                                        style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }}
                                                                                                        class="row m-0 w-100 p-1 px-4"
                                                                                                    >
                                                                                                        {subitem.count}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                            <div style={{ fontWeight: 700 }} class="mx-2">
                                                                                                {subitem?.partialCount
                                                                                                    ? parseInt(subitem.partialCount) * parseFloat(subitem?.unitPrice)
                                                                                                    : parseInt(subitem.count) * parseFloat(subitem?.unitPrice)}{' '}
                                                                                                {item?.info?.currency}
                                                                                            </div>
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
                                                                            class={formstyles.form__field}
                                                                            value={tempsheetpayload?.description}
                                                                            placeholder={'Notes'}
                                                                            minRows={5}
                                                                            maxRows={5}
                                                                            onChange={(event) => {
                                                                                var temp = { ...submitSheetPayload };

                                                                                temp.updateSheetOrders.map((i, ii) => {
                                                                                    if (i.sheetOrderId == item.id) {
                                                                                        temp.updateSheetOrders[ii].description = event.target.value;
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
                                                                Total: {parseInt(item?.order?.price) + parseInt(item?.order?.shippingPrice)} {item?.order?.currency}
                                                            </div>
                                                        )}
                                                        {type == 'finance' && (
                                                            <div class="col-lg-12 p-0">
                                                                <div class="row m-0 w-100 d-flex" style={{ justifyContent: 'space-around' }}>
                                                                    <div className="p-0 mb-2">
                                                                        Price: {parseInt(item?.order?.price)} {item?.order?.currency}
                                                                    </div>
                                                                    <div className=" p-0 mb-2">
                                                                        Shiping: {parseInt(item?.order?.shippingPrice)} {item?.order?.currency}
                                                                    </div>
                                                                    <div style={{ fontWeight: 600, fontSize: '15px' }} className=" p-0 mb-2">
                                                                        Total: {parseInt(item?.order?.price) + parseInt(item?.order?.shippingPrice)} {item?.order?.currency}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                                // </AccordionItemPanel>
                                            )}
                                        </AccordionItem>
                                    </div>
                                );
                            })}
                        </div>{' '}
                    </Accordion>
                </div>
            </div>
            <div style={{ position: 'fixed', bottom: '2%', right: '2%' }}>
                <button
                    style={{ height: '35px' }}
                    class={generalstyles.roundbutton + '  mb-1 mx-2'}
                    onClick={() => {
                        // history.push('/addorder');
                        handleupdateCourierSheet();
                    }}
                >
                    Close Sheet
                </button>
            </div>
        </div>
    );
};
export default CourierSheet;
