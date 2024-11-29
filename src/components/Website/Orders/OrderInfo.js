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
import { MdClose, MdOutlineInventory2, MdOutlineLocationOn } from 'react-icons/md';

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

const OrderInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setchosenOrderContext, chosenOrderContext, dateformatter, orderStatusEnumContext, orderTypeContext, setpagetitle_context, isAuth, buttonLoadingContext, setbuttonLoadingContext } =
        useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        useMutationGQL,
        paginateOrderLogs,
        removeOrderItems,
        addOrderItems,
        useLazyQueryGQL,
        fetchTransactionHistory,
        fetchOrderHistory,
        findOneOrder,
        fetchMerchantItemVariants,
        requestOrderReturn,
        changeOrderCustomerInfo,
        fetchCustomerNameSuggestions,
        fetchCustomer,
        changeOrderPrice,
        linkCustomerMerchant,
        fetchSimilarAddresses,
        linkCurrentCustomerAddress,
        fetchAllCountries,
        fetchGovernorates,
        findAllZones,
        fetchCustomerAddresses,
        createAddress,
    } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });
    const [outOfStock, setoutOfStock] = useState(false);
    const [diffInDays, setdiffInDays] = useState(0);
    const [orderItemIds, setorderItemIds] = useState([]);
    const [historyType, sethistoryType] = useState('order');

    const [returnOrderModal, setreturnOrderModal] = useState(false);
    const [submit, setsubmit] = useState(false);
    const [newCustomer, setnewCustomer] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [newPrice, setnewPrice] = useState(null);
    const [loading, setloading] = useState(false);
    const [nameSuggestions, setnameSuggestions] = useState([]);
    const [customerData, setcustomerData] = useState({});
    const [customerDataSuggestions, setcustomerDataSuggestions] = useState({});
    const [customerFound, setcustomerFound] = useState(false);
    const [fetchSuggestions, setfetchSuggestions] = useState(false);
    const [fetching, setfetching] = useState(false);
    const [editCustomer, seteditCustomer] = useState(false);
    const [orderLogsModal, setorderLogsModal] = useState({ open: false });
    const [similarAddresses, setsimilarAddresses] = useState([]);

    const [orderpayload, setorderpayload] = useState({
        functype: 'add',
        items: [],
        returnOrderItems: [],
        user: '',
        address: '',
        ordertype: 'delivery',
        paymenttype: 'cash',
        shippingprice: '',
        canbeoppened: 1,
        fragile: 0,
        partialdelivery: 1,
        original: 1,
        returnoriginal: 1,
        price: undefined,
        returnAmount: undefined,
        includevat: 0,
        previousOrderId: undefined,
        returnOrderId: undefined,
        // currency: 'EGP',
    });
    const [filterCustomerPayload, setfilterCustomerPayload] = useState({
        phone: '',
        email: '',
        myCustomers: true,
        limit: 20,
        merchantId: chosenOrderContext?.merchant?.id,
    });

    const [itemsModal, setitemsModal] = useState({ open: false, items: [], itemstobeadded: [] });
    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: undefined,
        merchantId: chosenOrderContext?.merchant?.id,
    });
    const [userAddresses, setuserAddresses] = useState();

    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: 'Egypt',
        streetAddress: '',
    });
    const [linkCustomerMutation] = useMutationGQL(linkCustomerMerchant(), {
        customerId: orderpayload?.customerIdForAddress,
        customerName: orderpayload?.user,
        merchantId: chosenOrderContext?.merchant?.id,
    });
    const [linkCurrentCustomerAddressMutation] = useMutationGQL(linkCurrentCustomerAddress(), {
        customerId: orderpayload?.customerIdForAddress,
        addressId: orderpayload?.address,
    });
    const fetchAllCountriesQuery = useQuery(['fetchAllCountries'], () => fetchAllCountries(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [fetchCustomerAddressesQuery] = useLazyQueryGQL(fetchCustomerAddresses(), 'network-only');

    const fetchGovernoratesQuery = useQueryGQL('cache-and-network', fetchGovernorates());
    const findAllZonesQuery = useQueryGQL('cache-and-network', findAllZones());

    const [fetchSimilarAddressesQuery] = useLazyQueryGQL(fetchSimilarAddresses());

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
        isAsc: false,
    });
    const [filterOrderLogs, setfilterOrderLogs] = useState({
        limit: 20,
        orderId: parseInt(queryParameters?.get('orderId')),
    });

    const fetchOrderHistoryQuery = useQueryGQL('', fetchOrderHistory(), filterordershistory);

    const [fetchOneOrderLazyQuery] = useLazyQueryGQL(findOneOrder());
    const [checkCustomerNameSuggestions] = useLazyQueryGQL(fetchCustomerNameSuggestions());
    const [checkCustomer] = useLazyQueryGQL(fetchCustomer());
    const [createAddressMutation] = useMutationGQL(createAddress(), {
        customerId: orderpayload?.customerIdForAddress,
        city: addresspayload?.city,
        country: addresspayload?.country,
        streetAddress: addresspayload?.streetAddress,
        buildingNumber: addresspayload?.buildingNumber,
        apartmentFloor: addresspayload?.apartmentFloor,
        merchantId: chosenOrderContext?.merchant?.id,
        zoneId: addresspayload?.zone,
        governorateId: addresspayload?.country == 'Egypt' ? fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.filter((item) => item.name == addresspayload?.city)[0]?.id : undefined,
    });

    const fetchTransactionHistoryQuery = useQueryGQL('', fetchTransactionHistory(), filterordershistory);
    const paginateOrderLogsQuery = useQueryGQL('', paginateOrderLogs(), filterOrderLogs);

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
    const [requestReturnPayload, setrequestReturnPayload] = useState({
        orderId: '',
        orderDate: '',
        returnAmount: '',
        freeShipping: true,
        originalPrice: true,
    });

    const [requestOrderReturnMutation] = useMutationGQL(requestOrderReturn(), {
        orderId: queryParameters.get('orderId'),
        orderDate: requestReturnPayload?.orderDate,
        returnAmount: requestReturnPayload?.originalPrice ? undefined : requestReturnPayload?.returnAmount,
        freeShipping: requestReturnPayload?.freeShipping == 0 ? false : true,
        merchantId: isAuth([1]) ? requestReturnPayload?.item?.merchant?.id : undefined,
    });
    const fetchOrder = async () => {
        if (queryParameters.get('orderId')) {
            var { data } = await fetchOneOrderLazyQuery({
                variables: {
                    id: parseInt(queryParameters.get('orderId')),
                },
            });
            setchosenOrderContext(data?.findOneOrder);
            if (data?.findOneOrder) {
                seteditCustomer(false);
            }
            console.log(data);
        }
    };
    useEffect(() => {
        setpagetitle_context('Merchant');
    }, []);

    useEffect(() => {
        if (JSON.stringify(chosenOrderContext) == '{}') {
            fetchOrder();
            // history.push(queryParameters?.get('type') == 'inventory' ? '/orders' : 'merchantorders');
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
    const [removeOrderItemsMutation] = useMutationGQL(removeOrderItems(), {
        orderId: parseInt(queryParameters?.get('orderId')),
        orderItemIds: orderItemIds,
        newPrice: newPrice?.length ? newPrice : undefined,
    });

    const [addOrderItemsMutation] = useMutationGQL(addOrderItems(), {
        orderId: parseInt(queryParameters?.get('orderId')),
        orderItems: itemsModal?.itemstobeadded ?? undefined,
        keepCurrentPrice: true,
        newPrice: newPrice?.length ? newPrice : undefined,
    });

    const [changeOrderCustomerInfoMutation] = useMutationGQL(changeOrderCustomerInfo(), {
        orderId: parseInt(queryParameters?.get('orderId')),
        merchantCustomerId: parseInt(orderpayload?.customerId),
    });

    const [changeOrderPriceMutation] = useMutationGQL(changeOrderPrice(), {
        orderId: parseInt(queryParameters?.get('orderId')),
        price: newPrice,
    });

    const fetchMerchantItemVariantsQuery = useQueryGQL('', fetchMerchantItemVariants(), filter);
    const changePriceFunc = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
        try {
            var { data } = await changeOrderPriceMutation();
            if (data?.changeOrderPrice?.success == true) {
                await fetchOrder();

                NotificationManager.success('Success!', '');
                setorderLogsModal({ open: false });
                setnewPrice(null);
            } else {
                NotificationManager.warning(data?.changeOrderPrice?.message, 'Warning!');
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
            console.error('Error adding Merchant:', error);
        }
        setbuttonLoadingContext(false);
    };
    const addOrderItemsFunc = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
        try {
            var temp = [];
            await itemsModal?.items?.map((item, index) => {
                temp.push({ itemVariantId: item?.item?.id, count: item?.count });
            });
            await setitemsModal({ ...itemsModal, itemstobeadded: temp, open: false });
            const { data } = await addOrderItemsMutation();
            if (data?.addOrderItems?.success == true) {
                NotificationManager.success('Success!', '');
                setorderLogsModal({ open: false });
                setnewPrice('');
                fetchOrder();
            } else {
                NotificationManager.warning(data?.addOrderItems?.message, 'Warning!');
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
            console.error('Error adding Merchant:', error);
        }
        setbuttonLoadingContext(false);
    };
    const removeOrderItemsFunc = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            if (buttonLoadingContext) return;
            setbuttonLoadingContext(true);
            try {
                const { data } = await removeOrderItemsMutation();
                if (data?.removeOrderItems?.success == true) {
                    NotificationManager.success('Success!', '');
                    setnewPrice('');
                    setorderLogsModal({ open: false });
                    fetchOrder();
                } else {
                    NotificationManager.warning(data?.removeOrderItems?.message, 'Warning!');
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
                console.error('Error adding Inventory Rent:', error);
            }
            setbuttonLoadingContext(false);
        }
    };
    useEffect(async () => {
        setnewCustomer(false);
        var customerFound = false;
        if (customerData?.findCustomer?.data?.length != 0) {
            if (customerData?.findCustomer?.data[0]) {
                setorderpayload({
                    ...orderpayload,
                    customerId: customerData?.findCustomer?.data[0]?.details?.id,
                    customerIdForAddress: customerData?.findCustomer?.data[0]?.id,
                    email: customerData?.findCustomer?.data[0]?.email,
                    user: customerData?.findCustomer?.data[0]?.details?.customerName,
                });
                setcustomerFound(true);

                customerFound = true;
            }
        }
        if (customerData?.findCustomer?.data?.length == 0 && !fetchSuggestions) {
            setorderpayload({ ...orderpayload, user: '', customerId: '' });
            await setfilterCustomerPayload({ ...filterCustomerPayload, myCustomers: false });
            try {
                var { data, loading } = await checkCustomerNameSuggestions({
                    variables: {
                        input: {
                            phone: filterCustomerPayload?.phone,
                            email: filterCustomerPayload?.email,
                            myCustomers: false,
                            limit: filterCustomerPayload?.limit,
                            merchantId: chosenOrderContext?.merchant?.id,
                        },
                        merchantId: chosenOrderContext?.merchant?.id,
                    },
                });
                setloading(loading);
                setfetchSuggestions(true);
                setcustomerFound(false);
                setcustomerDataSuggestions({ ...data });
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
                console.error('Error adding Merchant:', error);
            }
        }
    }, [customerData, customerDataSuggestions]);
    useEffect(() => {
        var nameSuggestions = [];
        if (customerDataSuggestions?.findCustomer?.data?.length != 0 && customerDataSuggestions?.findCustomer?.data[0]?.nameSuggestions?.length != 0) {
            if (customerDataSuggestions?.findCustomer?.data[0]) {
                setorderpayload({
                    ...orderpayload,
                    customerId: customerDataSuggestions?.findCustomer?.data[0]?.details?.id,
                    customerIdForAddress: customerDataSuggestions?.findCustomer?.data[0]?.id,
                    email: customerDataSuggestions?.findCustomer?.data[0]?.email,
                });
                nameSuggestions = [...customerDataSuggestions?.findCustomer?.data[0]?.nameSuggestions];
                setnewCustomer(false);
            }
        } else {
            setnewCustomer(true);
        }
        setcustomerFound(false);

        setnameSuggestions([...nameSuggestions]);
    }, [customerDataSuggestions]);

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
                                                    {/* {chosenOrderContext?.orderDate && (
                                                        <div class="col-lg-12 p-0">
                                                            <p style={{ fontSize: '12px' }} className={' m-0 p-0 wordbreak  '}>
                                                                Order Date: {dateformatter(chosenOrderContext?.orderDate)}
                                                            </p>
                                                        </div>
                                                    )} */}
                                                    {chosenOrderContext?.createdAt && (
                                                        <div class="col-lg-12 p-0">
                                                            <p style={{ fontSize: '12px' }} className={' m-0 p-0 wordbreak  '}>
                                                                {dateformatter(chosenOrderContext?.createdAt)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div class="col-lg-8 d-flex justify-content-end mb-3">
                                                <WaybillPrint waybills={[chosenOrderContext]} />

                                                <button
                                                    style={{ height: '35px' }}
                                                    class={generalstyles.roundbutton + '  allcentered mx-1 ml-2'}
                                                    onClick={async () => {
                                                        await setorderLogsModal({ open: true, type: 'price' });
                                                    }}
                                                >
                                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Change order price</p>
                                                </button>
                                                <button
                                                    style={{ height: '35px' }}
                                                    class={generalstyles.roundbutton + ' mx-1 allcentered'}
                                                    onClick={async () => {
                                                        await setorderLogsModal({ open: true, type: 'logs' });
                                                    }}
                                                >
                                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Order Logs</p>
                                                </button>
                                                {chosenOrderContext?.type == 'delivery' && (
                                                    <button
                                                        style={{ height: '35px' }}
                                                        class={generalstyles.roundbutton + ' allcentered mx-1'}
                                                        onClick={() => {
                                                            if (chosenOrderContext?.status == 'delivered' || chosenOrderContext?.status == 'partiallyDelivered') {
                                                                setrequestReturnPayload({ ...requestReturnPayload, chosenOrderContext });
                                                                setreturnOrderModal(true);
                                                            } else {
                                                                NotificationManager.warning('Order is not yet delivered', 'Warning!');
                                                            }
                                                        }}
                                                    >
                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Request Return</p>
                                                    </button>
                                                )}
                                                {chosenOrderContext?.type == 'return' && (
                                                    <button
                                                        style={{ height: '35px' }}
                                                        class={generalstyles.roundbutton + ' allcenetered mx-1'}
                                                        onClick={() => {
                                                            history.push('/addorder?merchantId=' + chosenOrderContext?.merchant?.id + '&order=' + chosenOrderContext?.id);
                                                        }}
                                                    >
                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Attach Exhange Order</p>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {cookies.get('userInfo')?.type != 'merchant' && (
                                        <div class="col-lg-12">
                                            <div class="col-lg-12 mb-1 p-0" style={{ color: 'grey', fontSize: '11px', fontWeight: 700 }}>
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div>Manifest</div>
                                                </div>
                                            </div>
                                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                                {chosenOrderContext?.sheetOrder == null && (
                                                    <div class="col-lg-4">
                                                        <div class="row m-0 w-100 d-flex align-items-center">
                                                            <div class="col-lg-12 p-0">
                                                                <p class=" p-0 m-0" style={{ fontSize: '17px' }}>
                                                                    <span style={{ color: 'var(--danger)' }}>Not Assigned to Manifest</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {chosenOrderContext?.sheetOrder != null && (
                                                    <>
                                                        <div className="col-lg-4 p-0">
                                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                                <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                                    {chosenOrderContext?.courier?.name}{' '}
                                                                </span>
                                                                <div style={{ background: '#eee', color: 'black' }} className={' wordbreak rounded-pill font-weight-600 allcentered mx-1 '}>
                                                                    # {chosenOrderContext?.sheetOrder?.sheetId}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                            <div
                                                                class={
                                                                    chosenOrderContext?.sheetOrder?.shippingCollected == 'collected'
                                                                        ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600'
                                                                        : ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600'
                                                                }
                                                            >
                                                                Courier collected shipping:{chosenOrderContext?.sheetOrder?.shippingCollected == 'collected' ? 'Yes' : 'No'}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    color: 'white',
                                                                    borderRadius: '0.25rem',
                                                                    fontSize: '11px',
                                                                    background: chosenOrderContext?.sheetOrder?.financePass ? 'var(--success)' : 'var(--danger)',
                                                                }}
                                                                class="allcentered mx-2 p-1 px-2"
                                                            >
                                                                {chosenOrderContext?.sheetOrder?.financePass ? 'Finance Accepted' : 'Finance Pending'}
                                                            </div>

                                                            <div
                                                                style={{
                                                                    color: 'white',
                                                                    borderRadius: '0.25rem',
                                                                    fontSize: '11px',
                                                                    background: chosenOrderContext?.sheetOrder?.adminPass ? 'var(--success)' : 'var(--danger)',
                                                                }}
                                                                class="allcentered  p-1 px-2"
                                                            >
                                                                {chosenOrderContext?.sheetOrder?.financePass ? 'Admin Accepted' : 'Admin Pending'}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 p-0 my-2">
                                                            <hr className="m-0" />
                                                        </div>

                                                        <div className="col-lg-6 p-0 mb-2"></div>

                                                        <div class="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 400, color: 'grey', fontSize: '10px' }}>
                                                                <IoMdTime class="mr-1" />
                                                                {dateformatter(chosenOrderContext?.sheetOrder?.createdAt)}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

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
                                            <div class="col-lg-12 p-0">
                                                <hr />
                                            </div>
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
                                                        <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary mt-5">
                                                            <div class="row m-0 w-100">
                                                                <FaLayerGroup size={22} class=" col-lg-12 mb-2" />
                                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                                    No History Yet
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {fetchOrderHistoryQuery?.data?.paginateOrderHistory?.data?.length != 0 && (
                                                        <div style={{ overflowY: 'scroll', height: '250px' }} class={' row m-0 w-100 p-0 pb-4 py-3 scrollmenuclasssubscrollbar'}>
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
                                                                                <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>
                                                                                    {dateformatterDayAndMonth(historyItem?.createdAt)}
                                                                                </span>
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
                                                                                {historyItem?.status.split(/(?=[A-Z])/).join(' ')} <br />
                                                                                {historyItem?.status == 'postponed' && (
                                                                                    <>
                                                                                        <span style={{ fontSize: '13px', fontWeight: 400 }}>{dateformatter(historyItem?.postponeDate)}</span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                                {historyItem?.description && (
                                                                                    <>
                                                                                        <span style={{ fontSize: '13px', fontWeight: 400 }}>{historyItem?.description}</span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                                {historyItem?.inventory && (
                                                                                    <>
                                                                                        <span style={{ fontSize: '10px', fontWeight: 400 }}>Inventory </span>
                                                                                        <span style={{ fontSize: '10px', fontWeight: 600 }}>{historyItem?.inventory?.name}</span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                                {historyItem?.fromHub && (
                                                                                    <>
                                                                                        <span style={{ fontSize: '10px', fontWeight: 400 }}>From Hub </span>
                                                                                        <span style={{ fontSize: '10px', fontWeight: 600 }}>{historyItem?.fromHub?.name}</span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                                {historyItem?.toHub && (
                                                                                    <>
                                                                                        <span style={{ fontSize: '10px', fontWeight: 400 }}>To Hub </span>
                                                                                        <span style={{ fontSize: '10px', fontWeight: 600 }}>{historyItem?.toHub?.name}</span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                                {cookies.get('userInfo')?.type == 'employee' && (
                                                                                    <span style={{ fontSize: '12px', fontWeight: 400 }}>{historyItem?.user?.name}</span>
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
                                            {historyType == 'payment' && (
                                                <>
                                                    {fetchTransactionHistoryQuery?.data?.paginateOrderTransactionsHistory?.data?.length == 0 && (
                                                        <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary mt-5">
                                                            <div class="row m-0 w-100">
                                                                <FaLayerGroup size={22} class=" col-lg-12 mb-2" />
                                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                                    No History Yet
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {fetchTransactionHistoryQuery?.data?.paginateOrderTransactionsHistory?.data?.length != 0 && (
                                                        <div style={{ overflowY: 'scroll', height: '200px' }} class={' row m-0 w-100 p-2 pb-4 py-3 scrollmenuclasssubscrollbar'}>
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
                                                                                <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>
                                                                                    {dateformatterDayAndMonth(historyItem?.createdAt)}
                                                                                </span>
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
                                                                                {cookies.get('userInfo')?.type == 'employee' && (
                                                                                    <span style={{ fontSize: '14px', fontWeight: 400 }}>{historyItem?.auditedBy?.name}</span>
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
                                                    <div
                                                        style={{ width: '30px', height: '30px' }}
                                                        class="iconhover allcentered"
                                                        onClick={async () => {
                                                            setitemsModal({ open: true, items: [], itemstobeadded: [] });
                                                        }}
                                                    >
                                                        <TbPlus />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 p-0 mt-2">
                                                <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                                    {chosenOrderContext?.orderItems?.map((orderItem, orderIndex) => {
                                                        var organizedData = [];
                                                        if (queryParameters?.get('type') == 'inventory') {
                                                            organizedData = organizeInventory(orderItem?.inventory);
                                                        }
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
                                                                                        if (orderItem?.countInInventory !== 0) {
                                                                                            // Uncomment if you need to debug the inventory
                                                                                            // alert(JSON.stringify(orderItem?.inventory));
                                                                                            setinventoryModal({ open: true, items: organizedData });
                                                                                        }
                                                                                    }}
                                                                                    style={{ width: '30px', height: '30px' }}
                                                                                    className={
                                                                                        orderItem?.countInInventory === 0 ? 'allcentered iconhover text-danger' : 'allcentered iconhover text-success'
                                                                                    }
                                                                                >
                                                                                    <MdOutlineInventory2 size={20} />
                                                                                </div>
                                                                            )}
                                                                            <div
                                                                                style={{ width: '30px', height: '30px' }}
                                                                                className="iconhover allcentered"
                                                                                onClick={async () => {
                                                                                    if (!buttonLoadingContext) {
                                                                                        const temp = [...orderItemIds, orderItem.id];
                                                                                        await setorderItemIds(temp);
                                                                                        if (!chosenOrderContext?.originalPrice) {
                                                                                            setorderLogsModal({ open: true, type: 'price', func: 'removeitems' });
                                                                                            return;
                                                                                        }
                                                                                        removeOrderItemsFunc();
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <TbTrash color="var(--danger)" />
                                                                            </div>
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
                                    <div class="col-lg-4">
                                        <div style={{ minHeight: '140px' }} class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                            <div style={{ cursor: props?.clickable ? 'pointer' : '' }} className="col-lg-12 p-0 allcentered">
                                                <div class={' row m-0 w-100 allcentered '}>
                                                    <div class="col-lg-12 p-0 mt-2">
                                                        <div className="row m-0 w-100 d-flex">
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(chosenOrderContext?.price).toFixed(2)} {chosenOrderContext?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4">
                                                                <div className="row m-0 w-100">
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                                                    </div>
                                                                    <div className="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {new Decimal(chosenOrderContext?.shippingPrice).toFixed(2)} {chosenOrderContext?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '15px' }} className="p-0 mb-2 allcentered col-lg-4">
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        {!editCustomer && (
                                            <div style={{ minHeight: '140px' }} class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                                <div className="col-lg-6 p-0 mb-2 text-capitalize">
                                                    <span style={{ fontWeight: 600 }}>{chosenOrderContext?.merchantCustomer?.customerName}</span>
                                                </div>
                                                <div className="col-lg-6 p-0 mb-2 text-capitalize d-flex justify-content-end">
                                                    <div
                                                        style={{ height: '30px', width: '30px' }}
                                                        class="iconhover allcentered"
                                                        onClick={() => {
                                                            seteditCustomer(true);
                                                        }}
                                                    >
                                                        <TbEdit />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                    <MdOutlineLocationOn className="mr-1" />
                                                    <span style={{ fontWeight: 400, fontSize: '13px' }}>
                                                        {chosenOrderContext?.address?.city}, {chosenOrderContext?.address?.country}
                                                    </span>
                                                </div>
                                                <div className="col-lg-12 p-0 ">
                                                    <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                        {chosenOrderContext?.address?.streetAddress}, Building {chosenOrderContext?.address?.buildingNumber}, Floor{' '}
                                                        {chosenOrderContext?.address?.apartmentFloor}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {editCustomer && (
                                            <div class={generalstyles.card + ' row m-0 w-100 p-3'}>
                                                <div class="col-lg-12 p-0 mt-3 ">
                                                    <div
                                                        style={{ height: '30px', width: '30px', position: 'absolute', right: 0, zIndex: 1000, top: -10 }}
                                                        class="iconhover allcentered"
                                                        onClick={() => {
                                                            seteditCustomer(false);
                                                        }}
                                                    >
                                                        <MdClose />
                                                    </div>
                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                        <div class={'col-lg-12'}>
                                                            <label style={{ fontSize: '1.8vh' }} class="m-0 mb-2">
                                                                Phone
                                                            </label>
                                                            <Inputfield
                                                                hideLabel={true}
                                                                placeholder={'phone'}
                                                                value={filterCustomerPayload?.phone}
                                                                onChange={(event) => {
                                                                    setcustomerFound(false);
                                                                    setopenModal(false);
                                                                    setnewCustomer(false);
                                                                    setnameSuggestions([]);
                                                                    setsimilarAddresses([]);
                                                                    setfilterCustomerPayload({ ...filterCustomerPayload, phone: event.target.value, myCustomers: true });
                                                                    setorderpayload({ ...orderpayload, phone: event.target.value });
                                                                }}
                                                                type={'number'}
                                                            />
                                                        </div>

                                                        <div class={'col-lg-12 '}>
                                                            <label style={{ fontSize: '1.8vh' }} class="m-0 mb-2">
                                                                Email
                                                            </label>
                                                            <Inputfield
                                                                hideLabel={true}
                                                                placeholder={'email'}
                                                                value={orderpayload?.email}
                                                                onChange={(event) => {
                                                                    setcustomerFound(false);
                                                                    setopenModal(false);
                                                                    setnewCustomer(false);
                                                                    setnameSuggestions([]);
                                                                    setsimilarAddresses([]);

                                                                    setfilterCustomerPayload({ ...filterCustomerPayload, email: event.target.value, myCustomers: true });
                                                                    setorderpayload({ ...orderpayload, email: event.target.value });
                                                                }}
                                                                type={'text'}
                                                            />
                                                        </div>
                                                        <div class="col-lg-12 p-0 ">
                                                            <button
                                                                onClick={async () => {
                                                                    if (filterCustomerPayload?.phone?.length != 0 || filterCustomerPayload?.email?.length != 0) {
                                                                        try {
                                                                            setfetchSuggestions(false);
                                                                            setcustomerFound(false);
                                                                            setfetching(true);
                                                                            var { data } = await checkCustomer({
                                                                                variables: {
                                                                                    input: {
                                                                                        phone: filterCustomerPayload?.phone,
                                                                                        email: filterCustomerPayload?.email,
                                                                                        myCustomers: true,
                                                                                        limit: filterCustomerPayload?.limit,
                                                                                        merchantId: chosenOrderContext?.merchant?.id,
                                                                                    },
                                                                                    merchantId: chosenOrderContext?.merchant?.id,
                                                                                },
                                                                            });
                                                                            setcustomerData({ ...data });
                                                                            setfetching(false);
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
                                                                            console.error(':', error);
                                                                        }
                                                                    } else {
                                                                        NotificationManager.warning('', 'Please fill email or phone');
                                                                    }
                                                                }}
                                                                class={generalstyles.roundbutton + '  mx-2'}
                                                                disabled={loading || fetching}
                                                            >
                                                                {!loading && <>Search</>}
                                                                {loading && <CircularProgress color="var(--primary)" width="20px" height="20px" duration="1s" />}

                                                                {/* Search */}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {fetching && (
                                                    <div class="col-lg-12 col-md-12 col-sm-12 mt-4 allcentered">
                                                        <CircularProgress color="var(--primary)" width="100px" height="100px" duration="1s" />
                                                    </div>
                                                )}
                                                {!fetching && (
                                                    <>
                                                        {!customerFound && newCustomer && (
                                                            <div class="col-lg-12 col-md-12 col-sm-12 mt-4">
                                                                <>
                                                                    <div class={'col-lg-12 '}>
                                                                        <label style={{ fontSize: '1.8vh' }} class="m-0 mb-2">
                                                                            Customer Name
                                                                        </label>
                                                                        <Inputfield
                                                                            hideLabel={true}
                                                                            placeholder={'name'}
                                                                            value={orderpayload?.user}
                                                                            onChange={(event) => {
                                                                                setorderpayload({ ...orderpayload, user: event.target.value });
                                                                            }}
                                                                            type={'text'}
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleAddCustomer();
                                                                        }}
                                                                        style={{ height: '35px' }}
                                                                        class={generalstyles.roundbutton + '  mb-1 ,t-2'}
                                                                    >
                                                                        Create customer
                                                                    </button>
                                                                </>
                                                            </div>
                                                        )}
                                                        {customerFound && (
                                                            <div class="col-lg-12 col-md-12 p-0 col-sm-12 mt-4">
                                                                <div class="col-lg-12">
                                                                    <div class="row m-0 w-100">
                                                                        {customerData?.findCustomer?.data?.map((item, index) => {
                                                                            return (
                                                                                <div class="col-lg-12">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            setorderpayload({
                                                                                                ...orderpayload,
                                                                                                customerId: item?.details?.id,
                                                                                                customerIdForAddress: item.id,
                                                                                                user: item?.details?.customerName,
                                                                                            });
                                                                                        }}
                                                                                        style={{
                                                                                            border: orderpayload?.customerId == item?.details?.id ? '1px solid var(--primary)' : '',
                                                                                        }}
                                                                                        class={generalstyles.card + ' row m-0 p-2 w-100'}
                                                                                    >
                                                                                        <div class="col-lg-12">
                                                                                            Name: <span style={{ fontWeight: 600 }}>{item?.details?.customerName}</span>
                                                                                        </div>
                                                                                        <div class="col-lg-12">
                                                                                            Email: <span style={{ fontWeight: 600 }}>{item?.email}</span>
                                                                                        </div>
                                                                                        <div class="col-lg-12">
                                                                                            Phone Number: <span style={{ fontWeight: 600 }}>{item?.phone}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {nameSuggestions?.length != 0 && !customerFound && (
                                                            <div class="col-lg-12 col-md-12 col-sm-12 mt-4">
                                                                <div class="col-lg-12 col-md-12 col-sm-12 p-0">
                                                                    <label style={{ fontSize: '1.8vh' }} class="m-0 mb-2">
                                                                        Customer Name
                                                                    </label>
                                                                    <DynamicInputfield
                                                                        options={nameSuggestions}
                                                                        payload={orderpayload}
                                                                        setpayload={setorderpayload}
                                                                        attribute={'user'}
                                                                        optionLabel={'customerName'}
                                                                        optionValue={'customerName'}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (buttonLoadingContext) return;
                                                                        setbuttonLoadingContext(true);
                                                                        try {
                                                                            await linkCustomerMutation();
                                                                            var { data } = await checkCustomer({
                                                                                variables: {
                                                                                    input: {
                                                                                        phone: filterCustomerPayload?.phone,
                                                                                        email: filterCustomerPayload?.email,
                                                                                        myCustomers: true,
                                                                                        limit: filterCustomerPayload?.limit,
                                                                                        merchantId: chosenOrderContext?.merchant?.id,
                                                                                    },
                                                                                    merchantId: chosenOrderContext?.merchant?.id,
                                                                                },
                                                                            });
                                                                            setcustomerData({ ...data });
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
                                                                            console.error('Error adding Merchant:', error);
                                                                        }
                                                                        setbuttonLoadingContext(false);
                                                                    }}
                                                                    style={{ height: '35px' }}
                                                                    class={generalstyles.roundbutton + '  mb-1 mt-2'}
                                                                    disabled={buttonLoadingContext}
                                                                >
                                                                    {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                                    {!buttonLoadingContext && <span>Create customer</span>}
                                                                </button>
                                                            </div>
                                                        )}
                                                        {orderpayload?.customerId && (
                                                            <div class="col-lg-12 allcentered">
                                                                <button
                                                                    class={generalstyles.roundbutton}
                                                                    onClick={async () => {
                                                                        if (buttonLoadingContext) return;
                                                                        setbuttonLoadingContext(true);
                                                                        try {
                                                                            var { data } = await changeOrderCustomerInfoMutation();
                                                                            if (data?.changeOrderCustomerInfo?.success == true) {
                                                                                setTimeout(async () => {
                                                                                    NotificationManager.success('Success!', '');
                                                                                    var { data } = await fetchOneOrderLazyQuery({
                                                                                        variables: {
                                                                                            id: parseInt(queryParameters.get('orderId')),
                                                                                        },
                                                                                    });
                                                                                    setchosenOrderContext(data?.findOneOrder);
                                                                                    if (data?.findOneOrder) {
                                                                                        seteditCustomer(false);
                                                                                    }
                                                                                }, 1000);
                                                                            } else {
                                                                                NotificationManager.warning(data?.changeOrderCustomerInfo?.message, 'Warning!');
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
                                                                            console.error('Error adding Merchant:', error);
                                                                        }
                                                                        setbuttonLoadingContext(false);
                                                                    }}
                                                                >
                                                                    {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                                    {!buttonLoadingContext && <span>Update Customers</span>}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {orderpayload?.customerId?.length != 0 && orderpayload?.customerId && customerFound && (
                                                    <>
                                                        <div class="col-lg-6 p-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                                            Addresses
                                                        </div>
                                                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                                                            <button
                                                                style={{ height: '35px' }}
                                                                class={generalstyles.roundbutton + '  mb-1'}
                                                                onClick={() => {
                                                                    setaddresspayload({
                                                                        city: '',
                                                                        country: 'Egypt',
                                                                        streetAddress: '',
                                                                    });
                                                                    setopenModal(!openModal);
                                                                }}
                                                            >
                                                                {openModal ? 'Cancel' : 'Add Address'}
                                                            </button>
                                                        </div>
                                                        {openModal && (
                                                            <div class="row m-0 w-100 my-2">
                                                                <Form
                                                                    size={'lg'}
                                                                    submit={submit}
                                                                    setsubmit={setsubmit}
                                                                    attr={
                                                                        addresspayload?.country == 'Egypt'
                                                                            ? [
                                                                                  {
                                                                                      title: 'Country',
                                                                                      options: fetchAllCountriesQuery,
                                                                                      optionsAttr: 'data',
                                                                                      label: 'country',
                                                                                      value: 'country',
                                                                                      size: '6',
                                                                                      attr: 'country',
                                                                                      type: 'fetchSelect',
                                                                                      payload: addresspayload,
                                                                                  },
                                                                                  {
                                                                                      name: 'City',
                                                                                      attr: 'city',
                                                                                      type: 'select',
                                                                                      options: fetchGovernoratesQuery?.data?.findAllDomesticGovernorates,
                                                                                      size: '6',
                                                                                      optionValue: 'name',
                                                                                      optionLabel: 'name',
                                                                                  },
                                                                                  {
                                                                                      name: 'Zone',
                                                                                      attr: 'zone',
                                                                                      type: 'select',
                                                                                      options: findAllZonesQuery?.data?.findAllZones?.filter(
                                                                                          (e) =>
                                                                                              e.governorateId ==
                                                                                              fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)
                                                                                                  ?.id,
                                                                                      ),
                                                                                      size: '6',
                                                                                      optionValue: 'id',
                                                                                      optionLabel: 'name',
                                                                                  },
                                                                                  { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                                                  { name: 'Apartment Floor', attr: 'apartmentFloor', size: '6' },
                                                                                  { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                                              ]
                                                                            : [
                                                                                  {
                                                                                      title: 'Country',
                                                                                      options: fetchAllCountriesQuery,
                                                                                      optionsAttr: 'data',
                                                                                      label: 'country',
                                                                                      value: 'country',
                                                                                      size: '6',
                                                                                      attr: 'country',
                                                                                      type: 'fetchSelect',
                                                                                      payload: addresspayload,
                                                                                  },
                                                                                  {
                                                                                      name: 'City',
                                                                                      attr: 'city',
                                                                                      type: 'select',
                                                                                      options: cities,
                                                                                      size: '6',
                                                                                  },
                                                                                  {
                                                                                      name: 'Zone',
                                                                                      attr: 'zone',
                                                                                      type: 'select',
                                                                                      options: findAllZonesQuery?.data?.findAllZones?.filter(
                                                                                          (e) =>
                                                                                              e.governorateId ==
                                                                                              fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)
                                                                                                  ?.id,
                                                                                      ),
                                                                                      size: '6',
                                                                                      optionValue: 'id',
                                                                                      optionLabel: 'name',
                                                                                  },
                                                                                  { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                                                  { name: 'Apartment Floor', attr: 'apartmentFloor', size: '6' },
                                                                                  { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                                              ]
                                                                    }
                                                                    payload={addresspayload}
                                                                    setpayload={setaddresspayload}
                                                                    button1disabled={buttonLoadingContext}
                                                                    button1class={generalstyles.roundbutton + '  mr-2 '}
                                                                    button1placeholder={'Add address'}
                                                                    button1onClick={async () => {
                                                                        if (buttonLoadingContext) return;
                                                                        setbuttonLoadingContext(true);
                                                                        if (addresspayload?.city?.length != 0 && addresspayload?.country?.length != 0 && addresspayload?.streetAddress?.length != 0) {
                                                                            var { data } = await fetchSimilarAddressesQuery({
                                                                                variables: {
                                                                                    input: {
                                                                                        customerId: orderpayload?.customerIdForAddress,
                                                                                        city: addresspayload?.city,
                                                                                        country: addresspayload?.country,
                                                                                        streetAddress: addresspayload?.streetAddress,
                                                                                        buildingNumber: addresspayload?.buildingNumber,
                                                                                        apartmentFloor: addresspayload?.apartmentFloor,
                                                                                        zoneId: addresspayload?.zone,
                                                                                        merchantId: chosenOrderContext?.merchant?.id,
                                                                                    },
                                                                                },
                                                                            });
                                                                            if (data?.findSimilarAddresses?.length != 0 && data?.findSimilarAddresses) {
                                                                                setsimilarAddresses([...data?.findSimilarAddresses]);
                                                                            } else {
                                                                                try {
                                                                                    var { data } = await createAddressMutation();
                                                                                    setorderpayload({ ...orderpayload, address: data?.createNewCustomerAddress });
                                                                                    if (orderpayload?.customerId) {
                                                                                        var { data } = await fetchCustomerAddressesQuery({
                                                                                            variables: {
                                                                                                input: {
                                                                                                    customerId: orderpayload?.customerIdForAddress,
                                                                                                    merchantId: chosenOrderContext?.merchant?.id,
                                                                                                    limit: 20,
                                                                                                },
                                                                                                merchantId: chosenOrderContext?.merchant?.id,
                                                                                            },
                                                                                        });

                                                                                        if (data?.paginateAddresses?.data) {
                                                                                            setuserAddresses([...data?.paginateAddresses?.data]);
                                                                                        }
                                                                                    }
                                                                                } catch (e) {
                                                                                    let errorMessage = 'An unexpected error occurred';
                                                                                    if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                                                                                        errorMessage = e.graphQLErrors[0].message || errorMessage;
                                                                                    } else if (e.networkError) {
                                                                                        errorMessage = e.networkError.message || errorMessage;
                                                                                    } else if (e.message) {
                                                                                        errorMessage = e.message;
                                                                                    }

                                                                                    NotificationManager.warning(errorMessage, 'Warning!');
                                                                                    // alert(JSON.stringify(e));
                                                                                }
                                                                            }
                                                                            setopenModal(false);
                                                                            // alert(JSON.stringify(data));
                                                                        } else {
                                                                            NotificationManager.warning('', 'Please complete the missing fields');
                                                                        }
                                                                        setbuttonLoadingContext(false);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}

                                                        {similarAddresses?.length != 0 && (
                                                            <>
                                                                {' '}
                                                                <div class="col-lg-12 p-0">
                                                                    <div class="row m-0 w-100">
                                                                        <div class="col-lg-12">Strongly recommended:</div>
                                                                        {similarAddresses?.map((item, index) => {
                                                                            if (item?.score == 0) {
                                                                                return (
                                                                                    <>
                                                                                        <div class="col-lg-6 mt-2 ">
                                                                                            <div
                                                                                                onClick={async () => {
                                                                                                    try {
                                                                                                        await setorderpayload({ ...orderpayload, address: item?.address?.id });
                                                                                                        setaddresspayload({
                                                                                                            city: item?.address?.city,
                                                                                                            country: item?.address?.country,
                                                                                                        });
                                                                                                        await linkCurrentCustomerAddressMutation();

                                                                                                        setsimilarAddresses([]);
                                                                                                        if (orderpayload?.customerId) {
                                                                                                            var { data } = await fetchCustomerAddressesQuery({
                                                                                                                variables: {
                                                                                                                    input: {
                                                                                                                        customerId: orderpayload?.customerIdForAddress,
                                                                                                                        merchantId: chosenOrderContext?.merchant?.id,
                                                                                                                        limit: 20,
                                                                                                                    },
                                                                                                                    merchantId: chosenOrderContext?.merchant?.id,
                                                                                                                },
                                                                                                            });
                                                                                                            if (data?.paginateAddresses?.data) {
                                                                                                                setuserAddresses([...data?.paginateAddresses?.data]);
                                                                                                            }
                                                                                                        }
                                                                                                    } catch (e) {
                                                                                                        if (
                                                                                                            e?.graphQLErrors[0]?.message.includes('Duplicate entry') &&
                                                                                                            e?.graphQLErrors[0]?.message.includes('merchant-customer-address.PRIMARY')
                                                                                                        ) {
                                                                                                            setopenModal(false);
                                                                                                            setsimilarAddresses([]);
                                                                                                        } else {
                                                                                                            NotificationManager.warning('', e?.graphQLErrors[0]?.message);
                                                                                                        }
                                                                                                    }
                                                                                                }}
                                                                                                style={{
                                                                                                    cursor: 'pointer',
                                                                                                    transition: 'all 0.4s',
                                                                                                    border: orderpayload?.address == item?.address?.id ? '1px solid var(--primary)' : '',
                                                                                                }}
                                                                                                class={generalstyles.card + ' row m-0 p-2 w-100'}
                                                                                            >
                                                                                                <div class="col-lg-12">
                                                                                                    <span style={{ fontWeight: 600 }}>
                                                                                                        {item?.address?.country}, {item?.address?.city}
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div class="col-lg-12">
                                                                                                    Building: <span style={{ fontWeight: 600 }}>{item?.address?.buildingNumber}</span>, Floor:{' '}
                                                                                                    <span style={{ fontWeight: 600 }}>{item?.address?.apartmentFloor}</span>
                                                                                                </div>

                                                                                                <div class="col-lg-12">
                                                                                                    Address: <span style={{ fontWeight: 600 }}>{item?.address?.streetAddress}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                );
                                                                            }
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-12 p-0">
                                                                    <div class="row m-0 w-100">
                                                                        <div class="col-lg-12">Suggestions:</div>
                                                                        {similarAddresses?.map((item, index) => {
                                                                            if (item?.score != 0) {
                                                                                return (
                                                                                    <>
                                                                                        <div class="col-lg-6 mt-2 ">
                                                                                            <div
                                                                                                onClick={async () => {
                                                                                                    try {
                                                                                                        await setorderpayload({ ...orderpayload, address: item?.address?.id });
                                                                                                        setaddresspayload({
                                                                                                            city: item?.address?.city,
                                                                                                            country: item?.address?.country,
                                                                                                        });
                                                                                                        await linkCurrentCustomerAddressMutation();

                                                                                                        setsimilarAddresses([]);
                                                                                                        if (orderpayload?.customerId) {
                                                                                                            var { data } = await fetchCustomerAddressesQuery({
                                                                                                                variables: {
                                                                                                                    input: {
                                                                                                                        customerId: orderpayload?.customerIdForAddress,
                                                                                                                        merchantId: chosenOrderContext?.merchant?.id,
                                                                                                                        limit: 20,
                                                                                                                    },
                                                                                                                    merchantId: chosenOrderContext?.merchant?.id,
                                                                                                                },
                                                                                                            });
                                                                                                            if (data?.paginateAddresses?.data) {
                                                                                                                setuserAddresses([...data?.paginateAddresses?.data]);
                                                                                                            }
                                                                                                        }
                                                                                                    } catch (e) {
                                                                                                        if (
                                                                                                            e?.graphQLErrors[0]?.message.includes('Duplicate entry') &&
                                                                                                            e?.graphQLErrors[0]?.message.includes('merchant-customer-address.PRIMARY')
                                                                                                        ) {
                                                                                                            setopenModal(false);
                                                                                                            setsimilarAddresses([]);
                                                                                                        } else {
                                                                                                            NotificationManager.warning('', e?.graphQLErrors[0]?.message);
                                                                                                        }
                                                                                                    }
                                                                                                }}
                                                                                                style={{
                                                                                                    cursor: 'pointer',
                                                                                                    transition: 'all 0.4s',
                                                                                                    border: orderpayload?.address == item?.address?.id ? '1px solid var(--primary)' : '',
                                                                                                }}
                                                                                                class={generalstyles.card + ' row m-0 p-2 w-100'}
                                                                                            >
                                                                                                <div class="col-lg-12">
                                                                                                    <span style={{ fontWeight: 600 }}>
                                                                                                        {item?.address?.country}, {item?.address?.city}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div class="col-lg-12">
                                                                                                    Building Number: <span style={{ fontWeight: 600 }}>{item?.address?.buildingNumber}</span>
                                                                                                </div>
                                                                                                <div class="col-lg-12">
                                                                                                    Floor: <span style={{ fontWeight: 600 }}>{item?.address?.apartmentFloor}</span>
                                                                                                </div>

                                                                                                <div class="col-lg-12">
                                                                                                    Address: <span style={{ fontWeight: 600 }}>{item?.address?.streetAddress}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                );
                                                                            }
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {similarAddresses?.length == 0 && (
                                                            <div class="col-lg-12 p-0">
                                                                <div class="row m-0 w-100">
                                                                    {userAddresses?.map((item, index) => {
                                                                        return (
                                                                            <div class="col-lg-6 mt-2 ">
                                                                                <div
                                                                                    onClick={() => {
                                                                                        setorderpayload({ ...orderpayload, address: item?.details?.id });
                                                                                        setaddresspayload({
                                                                                            city: item?.details?.city,
                                                                                            country: item?.details?.country,
                                                                                        });
                                                                                    }}
                                                                                    style={{
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.4s',
                                                                                        border: orderpayload?.address == item?.details?.id ? '1px solid var(--primary)' : '',
                                                                                    }}
                                                                                    class={generalstyles.card + ' row m-0 p-2 w-100'}
                                                                                >
                                                                                    <div class="col-lg-12">
                                                                                        <span style={{ fontWeight: 600 }}>
                                                                                            {item?.details?.country}, {item?.details?.city}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div class="col-lg-12">
                                                                                        Building Number: <span style={{ fontWeight: 600 }}>{item?.details?.buildingNumber}</span>
                                                                                    </div>
                                                                                    <div class="col-lg-12">
                                                                                        Floor: <span style={{ fontWeight: 600 }}>{item?.details?.apartmentFloor}</span>
                                                                                    </div>

                                                                                    <div class="col-lg-12">
                                                                                        Address: <span style={{ fontWeight: 600 }}>{item?.details?.streetAddress}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div class="col-lg-4">
                                        <div style={{ minHeight: '140px' }} class={generalstyles.card + ' row m-0 w-100 p-4'}>
                                            <div style={{ fontSize: '12px' }} className="col-lg-12 p-0 mt-2">
                                                <div className="row m-0 w-100 d-flex align-items-center">
                                                    <div className="col-lg-4 p-0">
                                                        <div className="text-capitalize">Can Be Opened</div>
                                                        <div style={{ fontWeight: 600 }} className="text-capitalize">
                                                            {chosenOrderContext?.canBeOpened == 1 ? 'Yes' : 'No'}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 p-0">
                                                        <div className="text-capitalize">Fragile</div>
                                                        <div style={{ fontWeight: 600 }} className="text-capitalize">
                                                            {chosenOrderContext?.fragile == 1 ? 'Yes' : 'No'}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 p-0">
                                                        <div className="text-capitalize">Partial Delivery</div>
                                                        <div style={{ fontWeight: 600 }} className="text-capitalize">
                                                            {chosenOrderContext?.deliveryPart == 1 ? 'Yes' : 'No'}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 p-0 mt-2">
                                                        <div className="text-capitalize">Payment Method</div>
                                                        <div style={{ fontWeight: 600 }} className="text-capitalize">
                                                            {chosenOrderContext?.paymentType}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 p-0 mt-2">
                                                        <div className="text-capitalize">Order Type</div>
                                                        <div style={{ fontWeight: 600 }} className="text-capitalize">
                                                            {chosenOrderContext?.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={itemsModal.open}
                onHide={() => {
                    setitemsModal({ open: false, items: [], itemstobeadded: [] });
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Items</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setitemsModal({ open: false, items: [], itemstobeadded: [] });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-6 p-0 mb-3">
                            <button
                                class={generalstyles.roundbutton}
                                onClick={async () => {
                                    if (chosenOrderContext?.originalPrice == false) {
                                        setorderLogsModal({ open: true, type: 'price', func: 'additems' });
                                        return;
                                    }
                                    addOrderItemsFunc();
                                }}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>Add Items</span>}
                            </button>
                        </div>
                        <div class="col-lg-6 p-0 mb-3">
                            <Pagination
                                beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                        <ItemsTable
                            clickable={true}
                            selectedItems={itemsModal?.items ?? []}
                            addToCount={(item) => {
                                var temp = { ...itemsModal };
                                var exist = false;
                                var chosenindex = null;

                                temp.items.map((i, ii) => {
                                    if (i?.item?.sku == item?.sku) {
                                        exist = true;
                                        chosenindex = ii;
                                    }
                                });

                                if (!exist) {
                                    temp.items.push({ item: item, count: 1 });
                                } else {
                                    temp.items[chosenindex].count = parseInt(temp.items[chosenindex].count) + 1;
                                }

                                setitemsModal({ ...temp });
                            }}
                            subtractFromCount={(item) => {
                                var temp = { ...itemsModal };
                                var exist = false;
                                var chosenindex = null;

                                temp.items.map((i, ii) => {
                                    if (i?.item?.sku == item?.sku) {
                                        exist = true;
                                        chosenindex = ii;
                                    }
                                });

                                if (exist) {
                                    if (temp.items[chosenindex].count > 1) {
                                        temp.items[chosenindex].count = parseInt(temp.items[chosenindex].count) - 1;
                                    } else {
                                        temp.items.splice(chosenindex, 1); // Remove item if count is 1
                                    }
                                }

                                setitemsModal({ ...temp });
                            }}
                            card="col-lg-4 px-1"
                            items={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.data}
                        />
                    </div>
                </Modal.Body>
            </Modal>
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
                                <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '12px' }}>
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
                                                        <div class="row m-0 w-100 d-flex align-items-center p-2" style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '12px' }}>
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
            <Modal
                show={returnOrderModal}
                onHide={() => {
                    setreturnOrderModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Request Return</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setreturnOrderModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <Form
                            size={'md'}
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={
                                !requestReturnPayload?.originalPrice
                                    ? [
                                          {
                                              name: 'Order Date',
                                              attr: 'orderDate',
                                              type: 'date',
                                              size: '12',
                                          },
                                          {
                                              name: 'Original Price',
                                              attr: 'originalPrice',
                                              type: 'switch',
                                              size: '12',
                                          },
                                          {
                                              name: 'Return Amount',
                                              attr: 'returnAmount',
                                              type: 'number',
                                              size: '12',
                                          },
                                          {
                                              name: 'Free Shipping',
                                              attr: 'freeShipping',
                                              type: 'switch',
                                              size: '12',
                                          },
                                      ]
                                    : [
                                          {
                                              name: 'Order Date',
                                              attr: 'orderDate',
                                              type: 'date',
                                              size: '12',
                                          },
                                          {
                                              name: 'Original Price',
                                              attr: 'originalPrice',
                                              type: 'switch',
                                              size: '12',
                                          },

                                          {
                                              name: 'Free Shipping',
                                              attr: 'freeShipping',
                                              type: 'switch',
                                              size: '12',
                                          },
                                      ]
                            }
                            payload={requestReturnPayload}
                            setpayload={setrequestReturnPayload}
                            button1disabled={buttonLoadingContext}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={'Request Return'}
                            button1onClick={async () => {
                                if (buttonLoadingContext) return;
                                setbuttonLoadingContext(true);

                                try {
                                    const data = await requestOrderReturnMutation();
                                    if (data?.equestOrderReturn?.success == true) {
                                        setTimeout(() => {
                                            findOneOrder();
                                            NotificationManager.success('Request Return submmited', 'success!');
                                            setreturnOrderModal(false);
                                        }, 1000);
                                    } else {
                                        NotificationManager.warning(data?.equestOrderReturn?.message, 'Warning!');
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
                                setbuttonLoadingContext(false);
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={orderLogsModal.open}
                onHide={() => {
                    setorderLogsModal({ open: false, type: '' });
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            {orderLogsModal.type == 'logs' && <div className="row w-100 m-0 p-0">Order Logs</div>}
                            {orderLogsModal.type == 'price' && !orderLogsModal?.func && <div className="row w-100 m-0 p-0">Change Order Price</div>}
                            {orderLogsModal.type == 'price' && orderLogsModal?.func && <div className="row w-100 m-0 p-0">Enter New Order Price</div>}
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setorderLogsModal({ open: false, type: '' });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {orderLogsModal.type == 'logs' && (
                        <div class="row m-0 w-100 py-2">
                            {paginateOrderLogsQuery?.data?.paginateOrderLogs?.data?.length == 0 && (
                                <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={22} class=" col-lg-12 mb-2" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            No Logs Yet
                                        </div>
                                    </div>
                                </div>
                            )}
                            {paginateOrderLogsQuery?.data?.paginateOrderLogs?.data?.length != 0 && (
                                <div style={{ overflowY: 'scroll', height: '200px' }} class={' row m-0 w-100 p-0 pb-4 py-3 scrollmenuclasssubscrollbar'}>
                                    <Timeline
                                        style={{ width: '100%' }}
                                        sx={{
                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                flex: 0.2,
                                            },
                                        }}
                                    >
                                        {paginateOrderLogsQuery?.data?.paginateOrderLogs?.data?.map((historyItem, historyIndex) => {
                                            return (
                                                <TimelineItem>
                                                    <TimelineOppositeContent style={{ fontSize: '13px' }}>
                                                        <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>{dateformatterDayAndMonth(historyItem?.createdAt)}</span>
                                                        <br />
                                                        {dateformatterTime(historyItem?.createdAt)}
                                                    </TimelineOppositeContent>
                                                    <TimelineSeparator>
                                                        <TimelineDot style={{ background: 'var(--primary)' }} />
                                                        {historyIndex < paginateOrderLogsQuery?.data?.paginateOrderLogs?.data?.length - 1 && (
                                                            <TimelineConnector style={{ background: 'var(--primary)' }} />
                                                        )}
                                                    </TimelineSeparator>
                                                    <TimelineContent style={{ fontWeight: 600, color: 'black', textTransform: 'capitalize' }}>
                                                        {historyItem?.status.split(/(?=[A-Z])/).join(' ')} <br />
                                                        {cookies.get('userInfo')?.type == 'employee' && <span style={{ fontSize: '14px', fontWeight: 400 }}>{historyItem?.user?.name}</span>}
                                                    </TimelineContent>
                                                </TimelineItem>
                                            );
                                        })}
                                    </Timeline>
                                </div>
                            )}
                        </div>
                    )}
                    {orderLogsModal.type == 'price' && (
                        <div class="row m-0 w-100 py-2">
                            {chosenOrderContext?.originalPrice == true && (
                                <div class="col-lg-12 p-0 allcentered text-center mb-2 ">
                                    <span style={{ fontWeight: 700, color: 'red', fontSize: '11px' }}>
                                        Disclaimer:{' '}
                                        <span style={{ fontWeight: 500 }}>
                                            Please be aware that by proceeding with this order, the price will be adjusted from the original amount to the input price you have specified
                                        </span>{' '}
                                    </span>
                                </div>
                            )}

                            <div class={'col-lg-12 p-0 mb-2'}>
                                <label style={{ fontSize: '1.8vh' }} class="m-0 mb-2">
                                    New Price
                                </label>
                                <Inputfield
                                    hideLabel={true}
                                    placeholder={'price'}
                                    value={newPrice}
                                    onChange={(event) => {
                                        setnewPrice(event.target.value);
                                    }}
                                    type={'number'}
                                />
                            </div>
                            <div class="col-lg-12 p-0 allcentered">
                                <button
                                    class={generalstyles.roundbutton}
                                    onClick={async () => {
                                        if (orderLogsModal?.func == 'removeitems') {
                                            await removeOrderItemsFunc();
                                            // await changePriceFunc();
                                        } else if (orderLogsModal?.func == 'additems') {
                                            await addOrderItemsFunc();
                                            // await changePriceFunc();
                                        } else {
                                            await changePriceFunc();
                                        }
                                    }}
                                    disabled={buttonLoadingContext}
                                >
                                    {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                    {!buttonLoadingContext && (
                                        <span>{orderLogsModal?.func == 'removeitems' ? 'Remove items' : orderLogsModal?.func == 'additems' ? 'Add items' : 'Change order price'}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default OrderInfo;
