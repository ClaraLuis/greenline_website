import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Modal } from 'react-bootstrap';
import API from '../../../API/API.js';

import { FaLayerGroup } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineInventory2, MdOutlineLocationOn } from 'react-icons/md';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';

const OrderInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setchosenOrderContext, chosenOrderContext, dateformatter, orderStatusEnumContext, orderTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, createMerchantDomesticShipping, useLazyQueryGQL, fetchTransactionHistory, fetchOrderHistory, findOneOrder } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });
    const [outOfStock, setoutOfStock] = useState(false);
    const [diffInDays, setdiffInDays] = useState(0);
    const [historyType, sethistoryType] = useState('order');

    const dateformatterDayAndMonth = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'long' });
        return `${day} ${month}`;
    };
    const dateformatterTime = (date) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(date).toLocaleTimeString(undefined, options);
    };

    const [filterordershistory, setfilterordershistory] = useState({
        limit: 20,
        orderId: parseInt(queryParameters?.get('orderId')),
    });

    const fetchOrderHistoryQuery = useQueryGQL('', fetchOrderHistory(), filterordershistory);

    const [fetchOneOrderLazyQuery] = useLazyQueryGQL(findOneOrder());

    const fetchTransactionHistoryQuery = useQueryGQL('', fetchTransactionHistory(), filterordershistory);

    const organizeInventory = (inventory) => {
        const racks = {};

        inventory?.forEach((item) => {
            const box = item.box;
            const ballot = box.ballot;
            const rack = ballot.rack;

            const rackId = rack.id;
            if (!racks[rackId]) {
                racks[rackId] = {
                    rack,
                    ballots: {},
                };
            }

            const ballotId = ballot.id;
            const ballotLevel = ballot.level;
            if (!racks[rackId].ballots[ballotLevel]) {
                racks[rackId].ballots[ballotLevel] = {};
            }

            if (!racks[rackId].ballots[ballotLevel][ballotId]) {
                racks[rackId].ballots[ballotLevel][ballotId] = {
                    ballot,
                    boxes: [],
                };
            }

            racks[rackId].ballots[ballotLevel][ballotId].boxes.push({ box: box, count: item.count });
        });

        // Sort ballots within each rack by level
        Object.values(racks).forEach((rack) => {
            rack.ballots = Object.fromEntries(Object.entries(rack.ballots).sort(([levelA], [levelB]) => levelA - levelB));
        });

        return racks;
    };

    useEffect(() => {
        if (JSON.stringify(chosenOrderContext) == '{}') {
            // const fetchOrder = async () => {
            //     if (queryParameters.get('orderId')) {
            //         var { data } = await fetchOneOrderLazyQuery({
            //             variables: {
            //                 id: parseInt(queryParameters.get('orderId')),
            //             },
            //         });
            //         // Handle the data or set state here
            //         setchosenOrderContext(data?.findOneOrder);
            //         // alert('1');
            //         console.log(data);
            //     }
            // };
            // fetchOrder();
            history.push(queryParameters?.get('type') == 'inventory' ? '/orders' : 'merchantorders');
        }

        chosenOrderContext?.orderItems?.map((orderitem, orderindex) => {
            if (orderitem?.countInInventory == 0) {
                setoutOfStock(true);
            }
        });
        const timestamp = chosenOrderContext?.orderDate;
        const orderDate = new Date(timestamp);

        // Create a Date object for the current date
        const now = new Date();

        // Set the hours, minutes, seconds, and milliseconds to 0 for both dates
        orderDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        // Calculate the difference in milliseconds
        const diffInMs = now.getTime() - orderDate.getTime();

        // Convert milliseconds to days
        setdiffInDays(Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
    }, [chosenOrderContext]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                <div class={' row m-0 w-100 allcentered'}>
                    <div class="col-lg-6">
                        {chosenOrderContext != undefined && (
                            <>
                                <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                    <div style={{ cursor: props?.clickable ? 'pointer' : '' }} className="col-lg-12 p-0">
                                        <div class={' row m-0 w-100 '}>
                                            <div className="col-lg-4 p-0">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                        # {chosenOrderContext?.id}
                                                    </span>{' '}
                                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                        {chosenOrderContext?.merchant?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                <div class="row m-0 w-100  d-flex justify-content-end align-items-center">
                                                    {outOfStock && queryParameters?.get('type') == 'inventory' && (
                                                        <div className={'mr-1 wordbreak text-danger bg-light-danger rounded-pill font-weight-600 '}>Out Of Stock</div>
                                                    )}

                                                    <div
                                                        // onClick={() => {
                                                        //     setchangestatusmodal(true);
                                                        // }}
                                                        // style={{ cursor: 'pointer' }}
                                                        className={
                                                            chosenOrderContext?.status == 'delivered'
                                                                ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 '
                                                                : chosenOrderContext?.status == 'postponed' || chosenOrderContext?.status == 'failedDeliveryAttempt'
                                                                ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 '
                                                                : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 '
                                                        }
                                                    >
                                                        {orderStatusEnumContext?.map((i, ii) => {
                                                            if (i.value == chosenOrderContext?.status) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })}
                                                    </div>
                                                    <div
                                                        // onClick={() => {
                                                        //     setchangestatusmodal(true);
                                                        // }}
                                                        style={{ color: 'white' }}
                                                        className={'ml-1 wordbreak bg-primary rounded-pill font-weight-600 '}
                                                    >
                                                        {orderTypeContext?.map((i, ii) => {
                                                            if (i.value == chosenOrderContext?.type) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 p-0 my-2">
                                                <hr className="m-0" />
                                            </div>
                                            {queryParameters?.get('type') != 'inventory' && (
                                                <>
                                                    <div class="col-lg-12 p-0 mb-2 text-capitalize">
                                                        <span style={{ fontWeight: 600 }}>{chosenOrderContext?.merchantCustomer?.customerName}</span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                        <MdOutlineLocationOn class="mr-1" />
                                                        <span style={{ fontWeight: 400, fontSize: '13px' }}>
                                                            {chosenOrderContext?.address?.city}, {chosenOrderContext?.address?.country}
                                                        </span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 ">
                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                            {chosenOrderContext?.address?.streetAddress}, {chosenOrderContext?.address?.buildingNumber}, {chosenOrderContext?.address?.apartmentFloor}
                                                        </span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 mt-3 mb-2">
                                                        <div
                                                            style={{ maxWidth: '100%', flexDirection: 'row', flexWrap: 'nowrap', overflow: 'scroll' }}
                                                            class="row m-0 w-100 scrollmenuclasssubscrollbar"
                                                        ></div>
                                                    </div>
                                                    <div class="col-lg-12 p-0 mt-2">
                                                        <div class="row m-0 w-100 d-flex">
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {parseFloat(chosenOrderContext?.price)} {chosenOrderContext?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {parseFloat(chosenOrderContext?.shippingPrice)} {chosenOrderContext?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '15px' }} className=" p-0 mb-2 allcentered col-lg-4">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {parseFloat(chosenOrderContext?.price) + parseFloat(chosenOrderContext?.shippingPrice)} {chosenOrderContext?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div class="col-lg-12 p-0 ">
                                                <div class="row m-0 w-100 d-flex justify-content-end align-items-center mt-2">
                                                    {/* {queryParameters?.get('type') == 'inventory' && (
                                                        <div class="col-lg-6 p-0 d-flex align-item-center">
                                                            <div className={' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 mr-1 '}>{diffInDays} days late</div>
                                                        </div>
                                                    )} */}

                                                    <div style={{ fontSize: '12px' }} class="col-lg-6 p-0 d-flex justify-content-end ">
                                                        <p className={' m-0 p-0 wordbreak  '}>{dateformatter(chosenOrderContext?.orderDate)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                    <div className="col-lg-12 p-0 mb-2 text-capitalize">
                                        <span style={{ fontWeight: 600 }}>{chosenOrderContext?.merchantCustomer?.customerName}</span>
                                    </div>
                                    <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                        <MdOutlineLocationOn className="mr-1" />
                                        <span style={{ fontWeight: 400, fontSize: '13px' }}>
                                            {chosenOrderContext?.address?.city}, {chosenOrderContext?.address?.country}
                                        </span>
                                    </div>
                                    <div className="col-lg-12 p-0 ">
                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                            {chosenOrderContext?.address?.streetAddress}, {chosenOrderContext?.address?.buildingNumber}, {chosenOrderContext?.address?.apartmentFloor}
                                        </span>
                                    </div>
                                </div>
                                <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                    <div className="col-lg-12 p-0 mt-2">
                                        <div className="row m-0 w-100 d-flex align-items-center">
                                            <div className="col-lg-4 p-0">
                                                <div className="text-capitalize" style={{ fontWeight: 600 }}>
                                                    Can Be Opened
                                                </div>
                                                <div className="text-capitalize">{chosenOrderContext?.canBeOpened == 1 ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div className="col-lg-4 p-0">
                                                <div className="text-capitalize" style={{ fontWeight: 600 }}>
                                                    Fragile
                                                </div>
                                                <div className="text-capitalize">{chosenOrderContext?.fragile == 1 ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div className="col-lg-4 p-0">
                                                <div className="text-capitalize" style={{ fontWeight: 600 }}>
                                                    Fragile
                                                </div>
                                                <div className="text-capitalize">{chosenOrderContext?.deliveryPart == 1 ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div className="col-lg-4 p-0 mt-2">
                                                <div className="text-capitalize" style={{ fontWeight: 600 }}>
                                                    Payment Method
                                                </div>
                                                <div className="text-capitalize">{chosenOrderContext?.paymentType}</div>
                                            </div>
                                            <div className="col-lg-4 p-0 mt-2">
                                                <div className="text-capitalize" style={{ fontWeight: 600 }}>
                                                    Order Type
                                                </div>
                                                <div className="text-capitalize">{chosenOrderContext?.type}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                    <div className="col-lg-12 p-0 mt-2">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {chosenOrderContext?.orderItems?.map((orderItem, orderIndex) => {
                                                var organizedData = [];
                                                if (queryParameters?.get('type') == 'inventory') {
                                                    organizedData = organizeInventory(orderItem?.inventory);
                                                }
                                                return (
                                                    <div class="col-lg-12 p-0 mb-1">
                                                        <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-1 align-items-center">
                                                            <div class="mr-2">
                                                                {orderItem?.partial && (
                                                                    <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-1 px-3">
                                                                        {orderItem?.partialCount}/{orderItem?.count}
                                                                    </div>
                                                                )}
                                                                {!orderItem?.partial && (
                                                                    <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-1 px-3">
                                                                        {orderItem?.count}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div style={{ width: '50px', height: '50px', borderRadius: '7px', marginInlineEnd: '10px' }}>
                                                                <img
                                                                    src={
                                                                        orderItem?.info?.imageUrl
                                                                            ? orderItem?.info?.imageUrl
                                                                            : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                    }
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                />
                                                            </div>
                                                            <div class="col-lg-4 d-flex align-items-center">
                                                                {queryParameters?.get('type') == 'inventory' && (
                                                                    <div className="row m-0 w-100">
                                                                        <div style={{ fontSize: '14px', fontWeight: 600 }} className={' col-lg-12 p-0'}>
                                                                            {orderItem?.info?.chosenOrderContext?.name}
                                                                        </div>
                                                                        <div style={{ fontSize: '13px' }} className={' col-lg-12 p-0'}>
                                                                            {orderItem?.info?.name}
                                                                        </div>
                                                                        <div style={{ color: 'lightgray', fontSize: '13px' }} className="col-lg-12 p-0">
                                                                            {orderItem?.info?.sku}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div class="col-lg-5 ">
                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                    <div class="mr-2">
                                                                        {orderItem?.partial && (
                                                                            <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-1 px-3">
                                                                                {parseFloat(parseFloat(orderItem?.partialCount) * parseFloat(orderItem?.unitPrice)).toFixed(2)}{' '}
                                                                                {chosenOrderContext?.currency}
                                                                            </div>
                                                                        )}
                                                                        {!orderItem?.partial && (
                                                                            <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-1 px-3">
                                                                                {parseFloat(parseFloat(orderItem?.count) * parseFloat(orderItem?.unitPrice)).toFixed(2)} {chosenOrderContext?.currency}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {queryParameters?.get('type') == 'inventory' && (
                                                                        <div
                                                                            onClick={() => {
                                                                                if (orderItem?.countInInventory != 0) {
                                                                                    // alert(JSON.stringify(orderItem?.inventory));

                                                                                    setinventoryModal({ open: true, items: organizedData });
                                                                                }
                                                                            }}
                                                                            style={{ width: '30px', height: '30px' }}
                                                                            class={orderItem?.countInInventory == 0 ? 'allcentered iconhover text-danger' : 'allcentered iconhover text-success'}
                                                                        >
                                                                            <MdOutlineInventory2 size={20} />
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
                                </div>
                                <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                    <div class="col-lg-12 p-0 mb-3">
                                        <div class="row m-0 w-100 allcentered">
                                            <button
                                                onClick={() => sethistoryType('order')}
                                                style={{ fontWeight: historyType == 'order' ? 800 : 400, width: '40%' }}
                                                class={generalstyles.roundbutton + ' allcentered p-0 mr-2'}
                                            >
                                                Order History
                                            </button>
                                            <button
                                                onClick={() => sethistoryType('payment')}
                                                style={{ fontWeight: historyType == 'payment' ? 800 : 400, width: '40%' }}
                                                class={generalstyles.roundbutton + ' allcentered p-0 '}
                                            >
                                                Transaction History
                                            </button>
                                        </div>
                                    </div>
                                    {historyType == 'order' && (
                                        <>
                                            {fetchOrderHistoryQuery?.data?.paginateOrderHistory?.data?.length == 0 && (
                                                <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                                    <div class="row m-0 w-100">
                                                        <FaLayerGroup size={30} class=" col-lg-12 mb-2" />
                                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                            No History Yet
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {fetchOrderHistoryQuery?.data?.paginateOrderHistory?.data?.length != 0 && (
                                                <div style={{ overflowY: 'scroll' }} class={' row m-0 w-100 p-0 pb-4 py-3 scrollmenuclasssubscrollbar'}>
                                                    <Timeline
                                                        style={{ width: '100%' }}
                                                        sx={{
                                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                                flex: 0.2,
                                                            },
                                                        }}
                                                    >
                                                        {fetchOrderHistoryQuery?.data?.paginateOrderHistory?.data?.map((historyItem, historyIndex) => {
                                                            return (
                                                                <TimelineItem>
                                                                    <TimelineOppositeContent style={{ fontSize: '13px' }}>
                                                                        <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>{dateformatterDayAndMonth(historyItem?.createdAt)}</span>
                                                                        <br />
                                                                        {dateformatterTime(historyItem?.createdAt)}
                                                                    </TimelineOppositeContent>
                                                                    <TimelineSeparator>
                                                                        <TimelineDot style={{ background: 'var(--primary)' }} />
                                                                        {historyIndex < fetchOrderHistoryQuery?.data?.paginateOrderHistory?.data?.length - 1 && (
                                                                            <TimelineConnector style={{ background: 'var(--primary)' }} />
                                                                        )}
                                                                    </TimelineSeparator>
                                                                    <TimelineContent style={{ fontWeight: 600, color: 'black', textTransform: 'capitalize' }}>
                                                                        {historyItem?.status.split(/(?=[A-Z])/).join(' ')}{' '}
                                                                    </TimelineContent>
                                                                </TimelineItem>
                                                            );
                                                        })}
                                                    </Timeline>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {historyType == 'payment' && (
                                        <>
                                            {fetchTransactionHistoryQuery?.data?.paginateOrderTransactionsHistory?.data?.length == 0 && (
                                                <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                                    <div class="row m-0 w-100">
                                                        <FaLayerGroup size={30} class=" col-lg-12 mb-2" />
                                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                            No History Yet
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {fetchTransactionHistoryQuery?.data?.paginateOrderTransactionsHistory?.data?.length != 0 && (
                                                <div style={{ overflowY: 'scroll' }} class={' row m-0 w-100 p-2 pb-4 py-3 scrollmenuclasssubscrollbar'}>
                                                    <Timeline
                                                        style={{ width: '100%' }}
                                                        sx={{
                                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                                flex: 0.2,
                                                            },
                                                        }}
                                                    >
                                                        {fetchTransactionHistoryQuery?.data?.paginateOrderTransactionsHistory?.data?.map((historyItem, historyIndex) => {
                                                            return (
                                                                <TimelineItem>
                                                                    <TimelineOppositeContent style={{ fontSize: '13px' }}>
                                                                        <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>{dateformatterDayAndMonth(historyItem?.createdAt)}</span>
                                                                        <br />
                                                                        {dateformatterTime(historyItem?.createdAt)}
                                                                    </TimelineOppositeContent>
                                                                    <TimelineSeparator>
                                                                        <TimelineDot style={{ background: 'var(--primary)' }} />
                                                                        {historyIndex < fetchTransactionHistoryQuery?.data?.paginateOrderTransactionsHistory?.data?.length - 1 && (
                                                                            <TimelineConnector style={{ background: 'var(--primary)' }} />
                                                                        )}
                                                                    </TimelineSeparator>
                                                                    <TimelineContent>
                                                                        <span style={{ fontWeight: 600, color: 'black', textTransform: 'capitalize' }}>
                                                                            {historyItem?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                        </span>
                                                                        <br />
                                                                        <span style={{ fontSize: '14px', fontWeight: 400 }}>
                                                                            {historyItem?.status?.split(/(?=[A-Z])/).join(' ')}, {historyItem?.amount} {historyItem?.currency}
                                                                        </span>{' '}
                                                                        <br />
                                                                        <span style={{ fontSize: '14px', fontWeight: 400 }}>{historyItem?.auditedBy?.name}</span>{' '}
                                                                    </TimelineContent>
                                                                </TimelineItem>
                                                            );
                                                        })}
                                                    </Timeline>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                show={inventoryModal.open}
                onHide={() => {
                    setinventoryModal({ open: false, items: [] });
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Place in warehouse</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setinventoryModal({ open: false, items: [] });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        {Object.values(inventoryModal?.items).map((rackData) => (
                            <>
                                <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                        Rack {rackData.rack.name}
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <hr class="p-0 m-0" />
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <div class="row m-0 w-100 p-1">
                                            {Object.entries(rackData.ballots).map(([level, ballots]) => {
                                                return (
                                                    <div class="col-lg-12 p-0 mb-2">
                                                        <div class="row m-0 w-100 d-flex align-items-center p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                                            Level {level}:
                                                            {Object.values(ballots).map((ballotData) => {
                                                                return (
                                                                    <div class="col-lg-12">
                                                                        <div key={ballotData.ballot.id}>
                                                                            <p class="p-0 m-0">Pallet: {ballotData.ballot.name}</p>
                                                                            <div class="row m-0 w-100">
                                                                                {ballotData.boxes.map((box) => (
                                                                                    <div class={'searchpill'}>
                                                                                        {' '}
                                                                                        {box?.box.name} ({box.count})
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default OrderInfo;
