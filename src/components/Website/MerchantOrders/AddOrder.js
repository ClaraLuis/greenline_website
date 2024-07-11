import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaPlus, FaWindowMinimize } from 'react-icons/fa';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
// Icons
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import { RiErrorWarningFill } from 'react-icons/ri';
import Form from '../../Form.js';
import Inputfield from '../../Inputfield.js';
import Pagination from '../../Pagination.js';
import DynamicInputfield from '../DynamicInputfield/DynamicInputfield.js';
import ItemsTable from '../MerchantItems/ItemsTable.js';
import AddCustomer from './AddCustomer.js';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FiCheckCircle } from 'react-icons/fi';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

const { ValueContainer, Placeholder } = components;

const AddOrder = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, paymentTypeContext, orderTypeContext, orderStatusEnumContext } = useContext(Contexthandlerscontext);
    const {
        useMutationGQL,
        fetchCustomerNameSuggestions,
        fetchCustomer,
        useLazyQueryGQL,
        addCustomer,
        fetchCustomerAddresses,
        linkCustomerMerchant,
        linkCurrentCustomerAddress,
        fetchSimilarAddresses,
        createAddress,
        fetchMerchantItemVariants,
        useQueryGQL,
        addOrder,
        fetchOrders,
    } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [merchantId, setmerchantId] = useState(null);
    const [newCustomer, setnewCustomer] = useState(false);
    const [addCustomerModal, setaddCustomerModal] = useState(false);
    const [fetchSuggestions, setfetchSuggestions] = useState(false);
    const [similarAddresses, setsimilarAddresses] = useState([]);

    const [nameSuggestions, setnameSuggestions] = useState([]);
    const [cartItems, setcartItems] = useState([]);
    const [orderpayload, setorderpayload] = useState({
        functype: 'add',
        items: [],
        returnOrderItems: [],
        user: '',
        address: '',
        ordertype: '',
        paymenttype: '',
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
        // currency: 'EGP',
    });
    const [tabs, settabs] = useState([
        { name: 'Order Items', isChecked: true },
        { name: 'User Info', isChecked: false },
    ]);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [fetching, setfetching] = useState(false);
    const [userAddresses, setuserAddresses] = useState();
    const [search, setsearch] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [fetched, setfetched] = useState(false);
    const [loading, setloading] = useState(false);
    const [customerFound, setcustomerFound] = useState(false);
    const [customerData, setcustomerData] = useState({});
    const [externalOrder, setexternalOrder] = useState(false);

    const [customerDataSuggestions, setcustomerDataSuggestions] = useState({});
    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: '',
        streetAddress: '',
    });
    const [filterorders, setfilterorders] = useState({
        statuses: [], //arrivedToHub
        limit: 20,
        orderIds: undefined,
    });
    const fetchOrdersQuery = useQueryGQL('', fetchOrders(), filterorders); //network only

    const [filterCustomerPayload, setfilterCustomerPayload] = useState({
        phone: '',
        email: '',
        myCustomers: true,
        limit: 20,
        merchantId: merchantId,
    });

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: undefined,
        merchantId: merchantId,
    });

    const [fetchSimilarAddressesQuery] = useLazyQueryGQL(fetchSimilarAddresses());
    const [checkCustomer] = useLazyQueryGQL(fetchCustomer());
    const [fetchCustomerAddressesQuery] = useLazyQueryGQL(fetchCustomerAddresses(), 'network-only');

    const [checkCustomerNameSuggestions] = useLazyQueryGQL(fetchCustomerNameSuggestions());
    const fetchMerchantItemVariantsQuery = useQueryGQL('', fetchMerchantItemVariants(), filter);

    const [linkCustomerMutation] = useMutationGQL(linkCustomerMerchant(), {
        customerId: orderpayload?.customerId,
        customerName: orderpayload?.user,
        merchantId: merchantId,
    });
    const [addOrderMutation] = useMutationGQL(addOrder(), {
        customerId: orderpayload?.customerId,
        addressId: orderpayload?.address,
        type: orderpayload?.ordertype,
        merchantId: merchantId,
        canOpen: orderpayload?.canbeoppened == 1 ? true : false,
        fragile: orderpayload?.fragile == 1 ? true : false,
        deliveryPart: orderpayload?.partialdelivery == 1 ? true : false,
        original: orderpayload?.original == 1 ? true : false,
        price: orderpayload?.price,
        returnAmount: orderpayload?.returnAmount,
        returnOrderItems: orderpayload?.returnOrderItems?.length == 0 ? undefined : orderpayload?.returnOrderItems,
        // currency: 'EGP',
        orderItems: cartItems,
        // shippingPrice: '0.0',
    });

    const [linkCurrentCustomerAddressMutation] = useMutationGQL(linkCurrentCustomerAddress(), {
        customerId: orderpayload?.customerId,
        addressId: orderpayload?.address,
    });

    const [addCustomerMutation] = useMutationGQL(addCustomer(), {
        name: orderpayload?.user,
        phone: orderpayload?.phone,
        email: orderpayload?.email,
        merchantId: merchantId,
    });
    const [createAddressMutation] = useMutationGQL(createAddress(), {
        customerId: orderpayload?.customerId,
        city: addresspayload?.city,
        country: addresspayload?.country,
        streetAddress: addresspayload?.streetAddress,
        buildingNumber: addresspayload?.buildingNumber,
        apartmentFloor: addresspayload?.apartmentFloor,
        merchantId: merchantId,
    });

    const handleAddCustomer = async () => {
        try {
            const { data } = await addCustomerMutation();
            setcustomerFound(true);

            setorderpayload({ ...orderpayload, customerId: data?.createCustomer });

            console.log(data); // Handle response
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
    };
    useEffect(() => {
        setpageactive_context('/merchantorders');
    }, []);
    useEffect(() => {
        settabs(
            orderpayload?.ordertype == 'exchange'
                ? [
                      { name: 'Order Items', isChecked: true },
                      { name: 'User Info', isChecked: false },
                      { name: 'Previous Order', isChecked: false },
                  ]
                : [
                      { name: 'Order Items', isChecked: true },
                      { name: 'User Info', isChecked: false },
                  ],
        );
    }, [orderpayload?.ordertype]);

    useEffect(async () => {
        setnewCustomer(false);
        var customerFound = false;
        if (customerData?.findCustomer?.data?.length != 0) {
            if (customerData?.findCustomer?.data[0]) {
                setorderpayload({
                    ...orderpayload,
                    customerId: customerData?.findCustomer?.data[0]?.id,
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
                            merchantId: merchantId,
                        },
                        merchantId: merchantId,
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
                    customerId: customerDataSuggestions?.findCustomer?.data[0]?.id,
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

    useEffect(async () => {
        if (orderpayload?.customerId) {
            var { data } = await fetchCustomerAddressesQuery({
                variables: {
                    input: {
                        customerId: orderpayload?.customerId,
                        merchantId: merchantId,
                        limit: 20,
                    },
                    merchantId: merchantId,
                },
            });
            setuserAddresses([...data?.paginateAddresses?.data]);
        }
    }, [orderpayload?.customerId]);

    useEffect(() => {
        // alert(queryParameters.get('merchantId'));
        const merchantIdtemp = parseInt(queryParameters.get('merchantId'));
        setmerchantId(merchantIdtemp);
        setfilter({
            limit: 20,
            isAsc: true,
            afterCursor: '',
            beforeCursor: '',
            name: undefined,
            merchantId: merchantIdtemp,
        });
    }, [queryParameters.get('merchantId')]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 p-0">
                    <div class={generalstyles.card + ' row m-0 w-100  d-flex align-items-center p-2'} style={{ justifyContent: 'space-between' }}>
                        <div class="row m-0 d-flex align-items-center">
                            {tabs?.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            var tabstemp = [...tabs];
                                            tabstemp.map((i, ii) => {
                                                if (i.name == item.name) {
                                                    tabstemp[ii].isChecked = true;
                                                } else {
                                                    tabstemp[ii].isChecked = false;
                                                }
                                            });
                                            settabs([...tabstemp]);
                                        }}
                                        class={!item.isChecked ? generalstyles.tab + ' allcentered' : `${generalstyles.tab} ${generalstyles.tab_active}` + ' allcentered'}
                                    >
                                        {item.name}
                                        {((index == 0 && orderpayload?.items?.length == 0) ||
                                            (index == 1 &&
                                                (orderpayload?.customerId?.length == 0 ||
                                                    orderpayload?.customerId == undefined ||
                                                    orderpayload?.address?.length == 0 ||
                                                    orderpayload?.address == undefined)) ||
                                            (index == 2 &&
                                                ((orderpayload?.returnOrderItems?.length == 0 && externalOrder) ||
                                                    (!externalOrder && (orderpayload?.previousOrderId?.length == 0 || orderpayload?.previousOrderId == undefined))))) && (
                                            <RiErrorWarningFill color="var(--danger)" size={20} class="ml-2" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            class={generalstyles.roundbutton}
                            onClick={async () => {
                                setbuttonLoading(true);
                                try {
                                    if (
                                        orderpayload?.customerId?.length != 0 &&
                                        orderpayload?.address?.length != 0 &&
                                        orderpayload?.ordertype?.length != 0 &&
                                        orderpayload?.canbeoppened?.length != 0 &&
                                        orderpayload?.fragile?.length != 0 &&
                                        orderpayload?.partialdelivery?.length != 0 &&
                                        orderpayload?.items?.length != 0
                                    ) {
                                        var temp = [];
                                        var temp1 = [];
                                        await orderpayload?.items?.map((item, index) => {
                                            temp.push({ itemVariantId: item?.item?.id, count: item?.count });
                                        });
                                        await orderpayload?.returnOrderItems?.map((returnOrderItem, index) => {
                                            temp1.push({ itemVariantId: returnOrderItem?.item?.id, count: returnOrderItem?.count });
                                        });
                                        await setorderpayload({ ...orderpayload, returnOrderItems: temp1 });
                                        await setcartItems([...temp]);
                                        await addOrderMutation();
                                        history.push('/merchantorders');
                                    } else {
                                        NotificationManager.warning('Complete the missing fields', 'Warning!');
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
                                setbuttonLoading(false);
                            }}
                        >
                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoading && <span>Create Order</span>}
                        </button>
                    </div>
                </div>
                {tabs[0]?.isChecked && (
                    <div className={' col-lg-8 p-0 '}>
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 my-3 ">
                                <div class="row m-0 w-100 d-flex align-items-center">
                                    <div class="col-lg-10 p-0">
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <input
                                                // disabled={props?.disabled}
                                                // type={props?.type}
                                                class={formstyles.form__field}
                                                value={search}
                                                placeholder={'Search by name, SKU '}
                                                onChange={() => {
                                                    setsearch(event.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-lg-2 p-1">
                                        <button
                                            style={{ height: '30px' }}
                                            class={generalstyles.roundbutton + ' p-0 allcentered'}
                                            onClick={() => {
                                                if (search.length == 0) {
                                                    setfilter({ ...filter, name: undefined });
                                                } else {
                                                    setfilter({ ...filter, name: search });
                                                }
                                            }}
                                        >
                                            search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 p-0 mb-3">
                                <Pagination
                                    beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                    filter={filter}
                                    setfilter={setfilter}
                                />
                            </div>
                            <ItemsTable
                                clickable={true}
                                selectedItems={orderpayload?.items}
                                actiononclick={(item) => {
                                    var temp = { ...orderpayload };
                                    var exist = false;
                                    var chosenindex = null;
                                    temp.items.map((i, ii) => {
                                        if (i.item.sku == item.sku) {
                                            exist = true;
                                            chosenindex = ii;
                                        }
                                    });
                                    if (!exist) {
                                        temp.items.push({ item: item, count: 1 });
                                    } else {
                                        temp.items[chosenindex].count = parseInt(temp.items[chosenindex].count) + 1;
                                    }
                                    setorderpayload({ ...temp });
                                }}
                                card="col-lg-4 px-1"
                                items={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.data}
                            />
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                    filter={filter}
                                    setfilter={setfilter}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {tabs[1]?.isChecked && (
                    <div className={' col-lg-8 p-0 '}>
                        <div class={generalstyles.card + ' row m-0 w-100 p-3'}>
                            <div class="col-lg-12 p-0 mt-3 ">
                                <div class="row m-0 w-100 d-flex align-items-center">
                                    <div class={'col-lg-6'}>
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
                                                setuserAddresses([]);
                                                setfilterCustomerPayload({ ...filterCustomerPayload, phone: event.target.value, myCustomers: true });
                                                setorderpayload({ ...orderpayload, phone: event.target.value });
                                            }}
                                            type={'number'}
                                        />
                                    </div>
                                    <div class={'col-lg-6 '}>
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
                                                setsimilarAddresses([]);
                                                setnameSuggestions([]);
                                                setuserAddresses([]);
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
                                                                    merchantId: merchantId,
                                                                },
                                                                merchantId: merchantId,
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
                                                <div class={'col-lg-6 '}>
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
                                                            <div class="col-lg-6">
                                                                <div
                                                                    onClick={() => {
                                                                        setorderpayload({ ...orderpayload, customerId: item.id, user: item?.details?.customerName });
                                                                    }}
                                                                    style={{
                                                                        border: orderpayload?.customerId == item?.id ? '1px solid var(--primary)' : '',
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
                                            <div class="col-lg-6 col-md-6 col-sm-12 p-0">
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
                                                    setbuttonLoading(true);
                                                    try {
                                                        await linkCustomerMutation();
                                                        setcustomerFound(true);
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
                                                    setbuttonLoading(false);
                                                }}
                                                style={{ height: '35px' }}
                                                class={generalstyles.roundbutton + '  mb-1 mt-2'}
                                                disabled={buttonLoading}
                                            >
                                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                {!buttonLoading && <span>Create customer</span>}
                                            </button>
                                        </div>
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
                                                            country: '',
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
                                                        attr={[
                                                            { name: 'Country', attr: 'country', size: '6' },
                                                            { name: 'City', attr: 'city', size: '6' },
                                                            { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                            { name: 'Apartment Floor', attr: 'apartmentFloor', size: '6' },
                                                            { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                        ]}
                                                        payload={addresspayload}
                                                        setpayload={setaddresspayload}
                                                        button1disabled={buttonLoading}
                                                        button1class={generalstyles.roundbutton + '  mr-2 '}
                                                        button1placeholder={'Add address'}
                                                        button1onClick={async () => {
                                                            setbuttonLoading(true);
                                                            if (addresspayload?.city?.length != 0 && addresspayload?.country?.length != 0 && addresspayload?.streetAddress?.length != 0) {
                                                                var { data } = await fetchSimilarAddressesQuery({
                                                                    variables: {
                                                                        input: {
                                                                            customerId: orderpayload?.customerId,
                                                                            city: addresspayload?.city,
                                                                            country: addresspayload?.country,
                                                                            streetAddress: addresspayload?.streetAddress,
                                                                            buildingNumber: addresspayload?.buildingNumber,
                                                                            apartmentFloor: addresspayload?.apartmentFloor,
                                                                            merchantId: merchantId,
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
                                                                                        customerId: orderpayload?.customerId,
                                                                                        merchantId: merchantId,
                                                                                        limit: 20,
                                                                                    },
                                                                                    merchantId: merchantId,
                                                                                },
                                                                            });

                                                                            setuserAddresses([...data?.paginateAddresses?.data]);
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
                                                            setbuttonLoading(false);
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

                                                                                            await linkCurrentCustomerAddressMutation();

                                                                                            setsimilarAddresses([]);
                                                                                            if (orderpayload?.customerId) {
                                                                                                var { data } = await fetchCustomerAddressesQuery({
                                                                                                    variables: {
                                                                                                        input: {
                                                                                                            customerId: orderpayload?.customerId,
                                                                                                            merchantId: merchantId,
                                                                                                            limit: 20,
                                                                                                        },
                                                                                                        merchantId: merchantId,
                                                                                                    },
                                                                                                });
                                                                                                setuserAddresses([...data?.paginateAddresses?.data]);
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
                                                                                            {item?.address?.city}, {item?.address?.country}
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

                                                                                            await linkCurrentCustomerAddressMutation();

                                                                                            setsimilarAddresses([]);
                                                                                            if (orderpayload?.customerId) {
                                                                                                var { data } = await fetchCustomerAddressesQuery({
                                                                                                    variables: {
                                                                                                        input: {
                                                                                                            customerId: orderpayload?.customerId,
                                                                                                            merchantId: merchantId,
                                                                                                            limit: 20,
                                                                                                        },
                                                                                                        merchantId: merchantId,
                                                                                                    },
                                                                                                });
                                                                                                setuserAddresses([...data?.paginateAddresses?.data]);
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
                                                                                            {item?.address?.city}, {item?.address?.country}
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
                                </>
                            )}
                        </div>
                    </div>
                )}
                {tabs[2]?.isChecked && (
                    <div className={' col-lg-8 p-0 '}>
                        <div class="row m-0 w-100">
                            <div className="col-lg-12 p-0 d-flex justify-content-start my-2">
                                <div className="row m-0 w-100 d-flex justify-content-start">
                                    <label className={`${formstyles.switch} mx-2 my-0`}>
                                        <input
                                            type="checkbox"
                                            checked={externalOrder}
                                            onChange={() => {
                                                setorderpayload({ ...orderpayload, previousOrderId: undefined, returnOrderItems: [] });
                                                setexternalOrder(!externalOrder);
                                            }}
                                        />
                                        <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                    </label>
                                    <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>External Order</p>
                                </div>
                            </div>
                            {externalOrder && (
                                <>
                                    <div class="col-lg-12 p-0 my-3 ">
                                        <div class="row m-0 w-100 d-flex align-items-center">
                                            <div class="col-lg-10 p-0">
                                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                                    <input
                                                        // disabled={props?.disabled}
                                                        // type={props?.type}
                                                        class={formstyles.form__field}
                                                        value={search}
                                                        placeholder={'Search by name, SKU '}
                                                        onChange={() => {
                                                            setsearch(event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-lg-2 p-1">
                                                <button
                                                    style={{ height: '30px' }}
                                                    class={generalstyles.roundbutton + ' p-0 allcentered'}
                                                    onClick={() => {
                                                        if (search.length == 0) {
                                                            setfilter({ ...filter, name: undefined });
                                                        } else {
                                                            setfilter({ ...filter, name: search });
                                                        }
                                                    }}
                                                >
                                                    search
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                            afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                            filter={filter}
                                            setfilter={setfilter}
                                        />
                                    </div>
                                    <ItemsTable
                                        clickable={true}
                                        selectedItems={orderpayload?.returnOrderItems}
                                        actiononclick={(item) => {
                                            var temp = { ...orderpayload };
                                            var exist = false;
                                            var chosenindex = null;
                                            temp.returnOrderItems.map((i, ii) => {
                                                if (i.item.sku == item.sku) {
                                                    exist = true;
                                                    chosenindex = ii;
                                                }
                                            });
                                            if (!exist) {
                                                temp.returnOrderItems.push({ item: item, count: 1 });
                                            } else {
                                                temp.returnOrderItems[chosenindex].count = parseInt(temp.returnOrderItems[chosenindex].count) + 1;
                                            }
                                            setorderpayload({ ...temp });
                                        }}
                                        card="col-lg-4 px-1"
                                        items={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.data}
                                    />
                                    <div class="col-lg-12 p-0">
                                        <Pagination
                                            beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                            afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                            filter={filter}
                                            setfilter={setfilter}
                                        />
                                    </div>
                                </>
                            )}
                            {!externalOrder && (
                                <>
                                    <div class="col-lg-12 p-0 my-3 ">
                                        <div class="row m-0 w-100 d-flex align-items-center">
                                            <div class="col-lg-10 p-0">
                                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                                    <input
                                                        // disabled={props?.disabled}
                                                        // type={props?.type}
                                                        class={formstyles.form__field}
                                                        value={search}
                                                        placeholder={'Search by name, SKU '}
                                                        onChange={() => {
                                                            setsearch(event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-lg-2 p-1">
                                                <button
                                                    style={{ height: '30px' }}
                                                    class={generalstyles.roundbutton + ' p-0 allcentered'}
                                                    onClick={() => {
                                                        if (search.length == 0) {
                                                            setfilter({ ...filter, name: undefined });
                                                        } else {
                                                            setfilter({ ...filter, name: search });
                                                        }
                                                    }}
                                                >
                                                    search
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            beforeCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.beforeCursor}
                                            afterCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.afterCursor}
                                            filter={filterorders}
                                            setfilter={setfilterorders}
                                        />
                                    </div>
                                    {fetchOrdersQuery?.data?.paginateOrders?.data?.map((item, index) => {
                                        var selected = false;
                                        if (item.id == orderpayload?.previousOrderId) {
                                            selected = true;
                                        }
                                        // sheetpayload?.orders?.map((orderitem, orderindex) => {
                                        //     if (orderitem?.id == item?.id) {
                                        //         selected = true;
                                        //     }
                                        // });
                                        return (
                                            <>
                                                <div className="col-lg-6 p-1">
                                                    <div
                                                        onClick={() => {
                                                            setorderpayload({ ...orderpayload, previousOrderId: item.id });
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
                                                                {orderStatusEnumContext?.map((i, ii) => {
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
                                    <div class="col-lg-12 p-0">
                                        <Pagination
                                            beforeCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.beforeCursor}
                                            afterCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.afterCursor}
                                            filter={filterorders}
                                            setfilter={setfilterorders}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div class="col-lg-4 mb-3 px-1">
                    <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3'}>
                        <p class={generalstyles.cardTitle + '  m-0 p-2 pt-0 '} style={{ fontWeight: 600 }}>
                            Order Details
                        </p>

                        <div class="col-lg-12">
                            <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-1'}>
                                <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                    <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div class="row m-0 w-100">
                                                    <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                        <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Items ({orderpayload?.items?.length})</p>
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
                                            {orderpayload?.items?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-12 p-0'}>
                                                        <div class={generalstyles.filter_container + ' p-1 row m-0 mb-2 w-100 allcentered'}>
                                                            <div class="col-lg-2 mr-2 p-0">
                                                                <div style={{ width: '100%', height: '35px' }}>
                                                                    <img
                                                                        src={
                                                                            item?.item?.imageUrl
                                                                                ? item?.item?.imageUrl
                                                                                : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                        }
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-4 p-0 wordbreak" style={{ fontWeight: 700, fontSize: '12px' }}>
                                                                {item?.item?.name}
                                                            </div>

                                                            <div class="col-lg-5 d-flex justify-content-end  p-0">
                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                    <FaWindowMinimize
                                                                        onClick={() => {
                                                                            if (orderpayload.items[index].count > 1) {
                                                                                var temp = { ...orderpayload };
                                                                                temp.items[index].count = parseInt(temp.items[index].count) - 1;
                                                                                setorderpayload({ ...temp });
                                                                            } else {
                                                                                var temp = { ...orderpayload };
                                                                                temp.items.splice(index, 1);
                                                                                setorderpayload({ ...temp });
                                                                            }
                                                                        }}
                                                                        class=" mb-2 text-danger text-dangerhover"
                                                                    />

                                                                    <input
                                                                        // disabled={props?.disabled}
                                                                        type={'number'}
                                                                        class={formstyles.form__field + ' mx-2'}
                                                                        style={{ height: '25px', width: '52%', paddingInlineStart: '10px' }}
                                                                        value={item?.count}
                                                                        placeholder={'Search by name or SKU'}
                                                                        onChange={(event) => {
                                                                            var temp = { ...orderpayload };
                                                                            temp.items[index].count = event.target.value;
                                                                            setorderpayload({ ...temp });
                                                                        }}
                                                                    />
                                                                    <FaPlus
                                                                        onClick={() => {
                                                                            var temp = { ...orderpayload };
                                                                            temp.items[index].count = parseInt(temp.items[index].count) + 1;
                                                                            setorderpayload({ ...temp });
                                                                        }}
                                                                        class=" text-secondaryhover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                        <Form
                            size={'lg'}
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={
                                orderpayload?.original == 1
                                    ? [
                                          { name: 'Order type', attr: 'ordertype', type: 'select', options: orderTypeContext, size: '12' },
                                          { name: 'Payment method', attr: 'paymenttype', type: 'select', options: paymentTypeContext, size: '12' },
                                          { name: 'Can be oppened', attr: 'canbeoppened', type: 'checkbox', size: '12' },
                                          { name: 'Fragile', attr: 'fragile', type: 'checkbox', size: '12' },
                                          { name: 'Partial delivery', attr: 'partialdelivery', type: 'checkbox', size: '12' },
                                          { name: 'Original Price', attr: 'original', type: 'checkbox', size: '12' },
                                      ]
                                    : [
                                          { name: 'Order type', attr: 'ordertype', type: 'select', options: orderTypeContext, size: '12' },
                                          { name: 'Payment type', attr: 'paymenttype', type: 'select', options: paymentTypeContext, size: '12' },
                                          { name: 'Can be oppened', attr: 'canbeoppened', type: 'checkbox', size: '12' },
                                          { name: 'Fragile', attr: 'fragile', type: 'checkbox', size: '12' },
                                          { name: 'Partial delivery', attr: 'partialdelivery', type: 'checkbox', size: '12' },
                                          { name: 'Original Price', attr: 'original', type: 'checkbox', size: '12' },
                                          { name: 'Price', attr: 'price', type: 'number', size: '12' },
                                      ]
                            }
                            payload={orderpayload}
                            setpayload={setorderpayload}
                            // button1disabled={UserMutation.isLoading}
                        />
                        {orderpayload?.ordertype == 'exchange' && externalOrder && (
                            <div class="col-lg-12 mt-2">
                                <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-1'}>
                                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                        <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    <div class="row m-0 w-100">
                                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Returned Items ({orderpayload?.returnOrderItems?.length})</p>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                {/* <AccordionItemState>
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
                                                                </AccordionItemState> */}
                                                                <div class="wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered">External</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <hr className="mt-2 mb-3" />
                                                {orderpayload?.returnOrderItems?.map((item, index) => {
                                                    return (
                                                        <div class={' col-lg-12 p-0'}>
                                                            <div class={generalstyles.filter_container + ' p-1 row m-0 mb-2 w-100 allcentered'}>
                                                                <div class="col-lg-2 mr-2 p-0">
                                                                    <div style={{ width: '100%', height: '35px' }}>
                                                                        <img
                                                                            src={
                                                                                item?.item?.imageUrl
                                                                                    ? item?.item?.imageUrl
                                                                                    : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                            }
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-4 p-0 wordbreak" style={{ fontWeight: 700, fontSize: '12px' }}>
                                                                    {item?.item?.name}
                                                                </div>

                                                                <div class="col-lg-5 d-flex justify-content-end  p-0">
                                                                    <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                        <FaWindowMinimize
                                                                            onClick={() => {
                                                                                if (orderpayload.returnOrderItems[index].count > 0) {
                                                                                    var temp = { ...orderpayload };
                                                                                    temp.returnOrderItems[index].count = parseInt(temp.returnOrderItems[index].count) - 1;
                                                                                    setorderpayload({ ...temp });
                                                                                } else {
                                                                                    var temp = { ...orderpayload };
                                                                                    temp.returnOrderItems.splice(index, 1);
                                                                                    setorderpayload({ ...temp });
                                                                                }
                                                                            }}
                                                                            class=" mb-2 text-danger text-dangerhover"
                                                                        />

                                                                        <input
                                                                            // disabled={props?.disabled}
                                                                            type={'number'}
                                                                            class={formstyles.form__field + ' mx-2'}
                                                                            style={{ height: '25px', width: '52%', paddingInlineStart: '10px' }}
                                                                            value={item?.count}
                                                                            placeholder={'Search by name or SKU'}
                                                                            onChange={(event) => {
                                                                                var temp = { ...orderpayload };
                                                                                temp.returnOrderItems[index].count = event.target.value;
                                                                                setorderpayload({ ...temp });
                                                                            }}
                                                                        />
                                                                        <FaPlus
                                                                            onClick={() => {
                                                                                var temp = { ...orderpayload };
                                                                                temp.returnOrderItems[index].count = parseInt(temp.returnOrderItems[index].count) + 1;
                                                                                setorderpayload({ ...temp });
                                                                            }}
                                                                            class=" text-secondaryhover"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        )}
                        {orderpayload?.ordertype == 'exchange' && !externalOrder && (
                            <div class="col-lg-12 mt-2">
                                <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>
                                                {orderpayload?.previousOrderId?.length != 0 && orderpayload?.previousOrderId != undefined
                                                    ? 'Chosen order ID: #' + orderpayload?.previousOrderId
                                                    : 'No order chosen yet'}
                                            </p>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                            <div class="wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered">Internal</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {orderpayload?.ordertype == 'exchange' && (
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={
                                    orderpayload?.returnoriginal == 1
                                        ? [{ name: 'Return Original Price', attr: 'returnoriginal', type: 'checkbox', size: '12' }]
                                        : [
                                              { name: 'Original Price', attr: 'returnoriginal', type: 'checkbox', size: '12' },
                                              { name: 'Return Price', attr: 'returnAmount', type: 'number', size: '12' },
                                          ]
                                }
                                payload={orderpayload}
                                setpayload={setorderpayload}
                                // button1disabled={UserMutation.isLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
            <AddCustomer openModal={addCustomerModal} setopenModal={setaddCustomerModal} payload={orderpayload} setpayload={setorderpayload} />
        </div>
    );
};
export default AddOrder;
