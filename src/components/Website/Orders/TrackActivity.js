import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import Cookies from 'universal-cookie';

import { Modal } from 'react-bootstrap';
import API from '../../../API/API.js';

import { FaLayerGroup } from 'react-icons/fa';
import { IoMdClose, IoMdTime } from 'react-icons/io';
import { MdClose, MdOutlineEditLocationAlt, MdOutlineInventory2, MdOutlineLocationOn } from 'react-icons/md';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import { TbEdit, TbPlus, TbTrash } from 'react-icons/tb';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';
import ItemsTable from '../MerchantItems/ItemsTable.js';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import Form from '../../Form.js';
import DynamicInputfield from '../DynamicInputfield/DynamicInputfield.js';
import Inputfield from '../../Inputfield.js';
import WaybillPrint from './WaybillPrint.js';
import Decimal from 'decimal.js';
import { useQuery } from 'react-query';
import { Loggedincontext } from '../../../Loggedincontext.js';
import NotFound from '../NotFound.js';

const TrackActivity = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setchosenOrderContext, chosenOrderContext, dateformatter, orderStatusEnumContext, orderTypeContext, setpagetitle_context, isAuth, buttonLoadingContext, setbuttonLoadingContext } =
        useContext(Contexthandlerscontext);
    const {
        useLazyQueryGQL,

        findPublicOrder,
    } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });
    const [outOfStock, setoutOfStock] = useState(false);
    const [diffInDays, setdiffInDays] = useState(0);
    const [loading, setloading] = useState(true);
    const [historyType, sethistoryType] = useState('order');
    const { loggedincontext } = useContext(Loggedincontext);

    const [fetchOrderHistoryQuery, setfetchOrderHistoryQuery] = useState([]);

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

    const [fetchOneOrderLazyQuery] = useLazyQueryGQL(findPublicOrder());

    const fetchOrder = async () => {
        if (queryParameters.get('orderId')) {
            var { data } = await fetchOneOrderLazyQuery({
                variables: {
                    input: {
                        orderId: parseInt(queryParameters.get('orderId')),
                        merchantId: parseInt(queryParameters.get('merchantId')),
                    },
                },
            });
            setchosenOrderContext(data?.findPublicOrder?.order);
            setfetchOrderHistoryQuery([...data?.findPublicOrder?.history]);
        }
    };
    useEffect(() => {
        if (loggedincontext) {
            window.open('/orderinfo?type=merchant&orderId=' + queryParameters?.get('orderId'), '_self');
        }
    }, [loggedincontext]);

    useEffect(() => {
        if (JSON.stringify(chosenOrderContext) == '{}') {
            fetchOrder();
            // history.push(queryParameters?.get('type') == 'inventory' ? '/orders' : 'merchantorders');
        }

        chosenOrderContext?.orderItems?.map((orderitem, orderindex) => {
            if (orderitem?.countInInventory == 0 || orderitem?.count > orderitem?.countInInventory) {
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
    useEffect(() => {
        setTimeout(() => {
            setloading(false);
        }, 1000);
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                <div class={' row m-0 w-100 allcentered'}>
                    <div class="col-lg-12">
                        <div class="row m-0 w-100">
                            {chosenOrderContext != undefined && chosenOrderContext && JSON.stringify(chosenOrderContext) != '{}' && (
                                <>
                                    <div class="col-lg-12">
                                        <div class={generalstyles.card + ' row m-0 w-100'}>
                                            <div class="col-lg-4">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <div class="col-lg-12 p-0">
                                                        <p class=" p-0 m-0" style={{ fontSize: '23px' }}>
                                                            <span style={{ color: 'var(--info)' }}>{chosenOrderContext?.merchant?.name}</span>
                                                        </p>
                                                    </div>

                                                    {chosenOrderContext?.createdAt && (
                                                        <div class="col-lg-12 p-0">
                                                            <p style={{ fontSize: '12px' }} className={' m-0 p-0 wordbreak  '}>
                                                                {dateformatter(chosenOrderContext?.createdAt)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div class="col-lg-8 d-flex justify-content-end mb-3 md-none">
                                                <button
                                                    style={{ height: '35px' }}
                                                    class={generalstyles.roundbutton + '  allcentered mx-1 ml-2'}
                                                    onClick={async () => {
                                                        window.open('/orderinfo?type=merchant&orderId=' + queryParameters?.get('orderId'), '_self');
                                                    }}
                                                >
                                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Login</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div style={{ minHeight: '400px', maxHeight: '400px' }} class={generalstyles.card + ' row m-0 w-100 d-flex align-content-start'}>
                                            <div className="col-lg-4 p-0">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                        # {chosenOrderContext?.id}
                                                    </span>{' '}
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
                                                                ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 text-capitalize '
                                                                : chosenOrderContext?.status == 'postponed' || chosenOrderContext?.status == 'failedDeliveryAttempt'
                                                                ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 text-capitalize '
                                                                : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 text-capitalize'
                                                        }
                                                    >
                                                        {/* {orderStatusEnumContext?.map((i, ii) => {
                                                            if (i.value == chosenOrderContext?.status) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })} */}
                                                        {chosenOrderContext?.status?.split(/(?=[A-Z])/).join(' ')}
                                                    </div>
                                                    <div
                                                        // onClick={() => {
                                                        //     setchangestatusmodal(true);
                                                        // }}
                                                        style={{ color: 'white' }}
                                                        className={'ml-1 wordbreak bg-primary rounded-pill font-weight-600 text-capitalize '}
                                                    >
                                                        {/* {orderTypeContext?.map((i, ii) => {
                                                            if (i.value == chosenOrderContext?.type) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })} */}
                                                        {chosenOrderContext?.type?.split(/(?=[A-Z])/).join(' ')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <hr />
                                            </div>

                                            {historyType == 'order' && (
                                                <>
                                                    {fetchOrderHistoryQuery?.length == 0 && (
                                                        <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary mt-5">
                                                            <div class="row m-0 w-100">
                                                                <FaLayerGroup size={22} class=" col-lg-12 mb-2" />
                                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                                    No History Yet
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {fetchOrderHistoryQuery?.length != 0 && (
                                                        <div style={{ overflowY: 'scroll', height: '250px' }} class={' row m-0 w-100 p-0 pb-4 py-3 scrollmenuclasssubscrollbar'}>
                                                            <Timeline
                                                                style={{ width: '100%' }}
                                                                sx={{
                                                                    [`& .${timelineOppositeContentClasses.root}`]: {
                                                                        flex: 0.2,
                                                                    },
                                                                }}
                                                            >
                                                                {fetchOrderHistoryQuery?.map((historyItem, historyIndex) => {
                                                                    return (
                                                                        <TimelineItem>
                                                                            <TimelineOppositeContent style={{ fontSize: '13px' }}>
                                                                                <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>
                                                                                    {dateformatterDayAndMonth(historyItem?.createdAt)}
                                                                                </span>
                                                                                <br />
                                                                                {dateformatterTime(historyItem?.createdAt)}
                                                                            </TimelineOppositeContent>
                                                                            <TimelineSeparator>
                                                                                <TimelineDot style={{ background: 'var(--primary)' }} />
                                                                                {historyIndex < fetchOrderHistoryQuery?.length - 1 && <TimelineConnector style={{ background: 'var(--primary)' }} />}
                                                                            </TimelineSeparator>
                                                                            <TimelineContent style={{ fontWeight: 600, color: 'black', textTransform: 'capitalize' }}>
                                                                                {historyItem?.status.split(/(?=[A-Z])/).join(' ')} <br />
                                                                                {historyItem?.status == 'postponed' && (
                                                                                    <>
                                                                                        <span style={{ fontSize: '13px', fontWeight: 400 }}>{dateformatter(historyItem?.postponeDate)}</span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
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
                                    </div>
                                    <div class="col-lg-6">
                                        <div style={{ minHeight: '400px', maxHeight: '400px' }} class={generalstyles.card + ' row m-0 w-100 d-flex align-items-start align-content-start'}>
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100 d-flex justify-content-between">
                                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                        Order Items:
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 p-0 mt-2">
                                                <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                                    {chosenOrderContext?.orderItems?.map((orderItem, orderIndex) => {
                                                        var organizedData = [];

                                                        return (
                                                            <div class="col-lg-12 p-0 mb-1">
                                                                <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="row m-0 w-100 p-1 align-items-center">
                                                                    <div class="allcentered">
                                                                        {orderItem?.partial && (
                                                                            <div style={{ borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-3 ">
                                                                                {orderItem?.partialCount}/{orderItem?.count}
                                                                            </div>
                                                                        )}
                                                                        {!orderItem?.partial && (
                                                                            <div style={{ borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-3 ">
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
                                                                        {/* {queryParameters?.get('type') == 'inventory' && ( */}
                                                                        <div className="row m-0 w-100">
                                                                            <div style={{ fontSize: '13px' }} className={' col-lg-12 p-0'}>
                                                                                {orderItem?.info?.fullName}
                                                                            </div>
                                                                            {/* <div style={{ color: 'lightgray', fontSize: '13px' }} className="col-lg-12 p-0">
                                                                                {orderItem?.info?.sku}
                                                                            </div> */}
                                                                        </div>
                                                                        {/* )} */}
                                                                    </div>

                                                                    <div className="col-lg-5">
                                                                        <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                            <div className="mr-2">
                                                                                {orderItem?.partial ? (
                                                                                    <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} className="row m-0 w-100 p-1 px-3">
                                                                                        {new Decimal(orderItem?.partialCount).times(new Decimal(orderItem?.unitPrice)).toFixed(2)}{' '}
                                                                                        {chosenOrderContext?.currency}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} className="row m-0 w-100 p-1 px-3">
                                                                                        {new Decimal(orderItem?.count).times(new Decimal(orderItem?.unitPrice)).toFixed(2)}{' '}
                                                                                        {chosenOrderContext?.currency}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            {queryParameters?.get('type') === 'inventory' && (
                                                                                <div
                                                                                    onClick={() => {
                                                                                        if (orderItem?.countInInventory !== 0 && orderItem?.count < orderItem?.countInInventory) {
                                                                                            // Uncomment if you need to debug the inventory
                                                                                            // alert(JSON.stringify(orderItem?.inventory));
                                                                                            setinventoryModal({ open: true, items: organizedData });
                                                                                        }
                                                                                    }}
                                                                                    style={{ width: '30px', height: '30px' }}
                                                                                    className={
                                                                                        orderItem?.countInInventory === 0 || orderItem?.count > orderItem?.countInInventory
                                                                                            ? 'allcentered iconhover text-danger'
                                                                                            : 'allcentered iconhover text-success'
                                                                                    }
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
                                    </div>
                                    <div class="col-lg-12">
                                        <div style={{ minHeight: '140px' }} class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                            <div style={{ cursor: props?.clickable ? 'pointer' : '' }} className="col-lg-12 p-0 allcentered">
                                                <div class={' row m-0 w-100 allcentered '}>
                                                    <div className="col-lg-12 p-0 d-flex justify-content-end mb-3" style={{ position: 'absolute', top: 5, right: 5 }}>
                                                        <div style={{ background: '#eee', color: 'black' }} className={' wordbreak rounded-pill font-weight-600 allcentered mx-1 '}>
                                                            {chosenOrderContext?.paymentType == 'cash' ? 'Not Paid' : 'Paid'}
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-12 p-0 mt-2 mt-md-5">
                                                        <div className="row m-0 w-100 d-flex justify-content-center">
                                                            <>
                                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-2 col-md-6">
                                                                    <div className="row m-0 w-100">
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                                        </div>
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                                {new Decimal(chosenOrderContext?.price || 0).plus(new Decimal(chosenOrderContext?.shippingPrice || 0)).toFixed(2)}{' '}
                                                                                {chosenOrderContext?.currency}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-2 col-md-6">
                                                                    <div className="row m-0 w-100">
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Fragile</span>
                                                                        </div>
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>{chosenOrderContext?.fragile == 1 ? 'Yes' : 'No'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-2 col-md-6">
                                                                    <div className="row m-0 w-100">
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Can be opened</span>
                                                                        </div>
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>{chosenOrderContext?.canBeOpened == 1 ? 'Yes' : 'No'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-2 col-md-6">
                                                                    <div className="row m-0 w-100">
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 400, fontSize: '11px' }}>Partial Delivery</span>
                                                                        </div>
                                                                        <div className="col-lg-12 p-0 allcentered text-center">
                                                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>{chosenOrderContext?.partialdelivery == 1 ? 'Yes' : 'No'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>

                                                            <div style={{ fontWeight: 600, fontSize: '15px' }} className="p-0 mb-2 allcentered col-lg-2 col-md-6">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Order Type</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center text-capitalize">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{chosenOrderContext?.type}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {(chosenOrderContext == undefined || !chosenOrderContext || JSON.stringify(chosenOrderContext) == '{}') && !loading && (
                                <div class="col-lg-12 p-0 alllcentered">
                                    <NotFound />
                                </div>
                            )}
                            {(chosenOrderContext == undefined || !chosenOrderContext || JSON.stringify(chosenOrderContext) == '{}') && loading && (
                                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TrackActivity;
