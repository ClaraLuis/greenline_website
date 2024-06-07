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
// Icons
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import Inputfield from '../../Inputfield.js';
import Pagination from '../../Pagination.js';
import DynamicInputfield from '../DynamicInputfield/DynamicInputfield.js';
import ItemsTable from '../MerchantItems/ItemsTable.js';
import AddCustomer from './AddCustomer.js';

const { ValueContainer, Placeholder } = components;

const AddOrder = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, paymentTypeContext, orderTypeContext } = useContext(Contexthandlerscontext);
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
        user: '',
        address: '',
        ordertype: '',
        paymenttype: '',
        shippingprice: '',
        canbeoppened: 0,
        fragile: 0,
        partialdelivery: 0,
        includevat: 0,
        // currency: 'EGP',
    });
    const [tabs, settabs] = useState([
        { name: 'Order Items', isChecked: true },
        { name: 'User Info', isChecked: false },
    ]);
    const [userAddresses, setuserAddresses] = useState();
    const [search, setsearch] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [fetched, setfetched] = useState(false);
    const [loading, setloading] = useState(false);
    const [customerFound, setcustomerFound] = useState(false);
    const [customerData, setcustomerData] = useState({});
    const [fetchMerchantItemVariantsQuery, setfetchMerchantItemVariantsQuery] = useState({ loading: true });

    const [customerDataSuggestions, setcustomerDataSuggestions] = useState({});
    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: '',
        streetAddress: '',
    });

    const [filterCustomerPayload, setfilterCustomerPayload] = useState({
        phone: '',
        email: '',
        myCustomers: true,
        limit: 20,
        merchantId: merchantId,
    });

    const [filter, setfiter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: '',
        merchantId: merchantId,
    });

    const [fetchSimilarAddressesQuery] = useLazyQueryGQL(fetchSimilarAddresses());
    const [checkCustomer] = useLazyQueryGQL(fetchCustomer());
    const [fetchCustomerAddressesQuery] = useLazyQueryGQL(fetchCustomerAddresses(), {
        customerId: orderpayload?.customerId,
        merchantId: merchantId,
    });

    const [checkCustomerNameSuggestions] = useLazyQueryGQL(fetchCustomerNameSuggestions());
    const [fetchMerchantItemVariantsFunc] = useLazyQueryGQL(fetchMerchantItemVariants());

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
            console.error('Error adding user:', error);
        }
    };
    useEffect(() => {
        setpageactive_context('/merchantorders');
    }, []);

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
                    },
                });
                setloading(loading);
                setfetchSuggestions(true);
                setcustomerFound(false);
                setcustomerDataSuggestions({ ...data });
            } catch {
                alert('error');
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
                    },
                },
            });
            setuserAddresses([...data?.paginateAddresses?.data]);
        }
    }, [orderpayload?.customerId]);

    useEffect(async () => {
        if (queryParameters.get('merchantId')) {
            const merchantIdtemp = parseInt(queryParameters.get('merchantId'));
            setmerchantId(merchantIdtemp);
            // alert(merchantId);
            var { data, loading } = await fetchMerchantItemVariantsFunc({
                variables: {
                    input: filter,
                },
            });
            setfetchMerchantItemVariantsQuery({ data: data, loading: loading });
        }
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 p-0">
                    <div class={generalstyles.card + ' row m-0 w-100 p-2'}>
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
                                    class={!item.isChecked ? generalstyles.tab : `${generalstyles.tab} ${generalstyles.tab_active}`}
                                >
                                    {item.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {tabs[0]?.isChecked && (
                    <div className={' col-lg-8 p-0 '}>
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 my-3 ">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-6 p-0">
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <input
                                                // disabled={props?.disabled}
                                                // type={props?.type}
                                                class={formstyles.form__field}
                                                value={filter?.name}
                                                placeholder={'Search by name '}
                                                onChange={() => {
                                                    setfiter({ ...filter, name: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-lg-6 p-0 px-1">
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <input
                                                // disabled={props?.disabled}
                                                // type={props?.type}
                                                class={formstyles.form__field}
                                                value={filter?.sku}
                                                placeholder={'Search by SKU'}
                                                onChange={() => {
                                                    setfiter({ ...filter, sku: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 p-0 mb-3">
                                <Pagination
                                    beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                    filter={filter}
                                    setfiter={setfiter}
                                />
                            </div>
                            <ItemsTable
                                clickable={true}
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
                                    setfiter={setfiter}
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

                                                        var { data } = await checkCustomer({
                                                            variables: {
                                                                input: {
                                                                    phone: filterCustomerPayload?.phone,
                                                                    email: filterCustomerPayload?.email,
                                                                    myCustomers: true,
                                                                    limit: filterCustomerPayload?.limit,
                                                                    merchantId: merchantId,
                                                                },
                                                            },
                                                        });
                                                        setcustomerData({ ...data });
                                                    } catch (error) {
                                                        console.error(':', error);
                                                    }
                                                } else {
                                                    NotificationManager.warning('', 'Please fill email or phone');
                                                }
                                            }}
                                            class={generalstyles.roundbutton + '  mx-2'}
                                            disabled={loading}
                                        >
                                            {!loading && <>Search</>}
                                            {loading && <CircularProgress color="var(--primary)" width="20px" height="20px" duration="1s" />}

                                            {/* Search */}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {!customerFound && newCustomer && (
                                <div class="col-lg-12 col-md-12 col-sm-12 mt-4">
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
                                </div>
                            )}
                            {customerFound && (
                                <div class="col-lg-12 col-md-12 p-0 col-sm-12 mt-4">
                                    <div class="col-lg-12">
                                        <div class="col-lg-6">
                                            <div class={generalstyles.card + ' row m-0 p-2 w-100'}>
                                                <div class="col-lg-12 mb-1">
                                                    <span style={{ fontWeight: 600 }}> User: </span>
                                                </div>
                                                <div class="col-lg-12">
                                                    Name: <span style={{ fontWeight: 600 }}>{orderpayload?.user}</span>
                                                </div>
                                                <div class="col-lg-12">
                                                    Email: <span style={{ fontWeight: 600 }}>{orderpayload?.email}</span>
                                                </div>
                                                <div class="col-lg-12">
                                                    Phone Number: <span style={{ fontWeight: 600 }}>{orderpayload?.phone}</span>
                                                </div>
                                            </div>
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
                                            try {
                                                await linkCustomerMutation();
                                                setcustomerFound(true);
                                            } catch {
                                                alert('error');
                                            }
                                        }}
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1 mt-2'}
                                    >
                                        Create customer
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
                                                // button1disabled={UserMutation.isLoading}
                                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                                button1placeholder={'Add address'}
                                                button1onClick={async () => {
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
                                                                            },
                                                                        },
                                                                    });
                                                                    setuserAddresses([...data?.paginateAddresses?.data]);
                                                                }
                                                            } catch {}
                                                        }
                                                        setopenModal(false);
                                                        // alert(JSON.stringify(data));
                                                    } else {
                                                        NotificationManager.warning('', 'Please complete the missing fields');
                                                    }
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
                                                                                                },
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

                                                                                    await linkCurrentCustomerAddressMutation();

                                                                                    setsimilarAddresses([]);
                                                                                    if (orderpayload?.customerId) {
                                                                                        var { data } = await fetchCustomerAddressesQuery({
                                                                                            variables: {
                                                                                                input: {
                                                                                                    customerId: orderpayload?.customerId,
                                                                                                    merchantId: merchantId,
                                                                                                },
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
                    </div>
                )}
                <div class="col-lg-4 mb-3 px-1">
                    <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3'}>
                        <div class="col-lg-12">
                            {orderpayload?.items?.length != 0 && (
                                <>
                                    <div class="col-lg-12 pb-2 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Cart ({orderpayload?.items?.length})
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {orderpayload?.items?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-12 p-0'}>
                                                        <div class={generalstyles.filter_container + ' py-2 row m-0 mb-2 w-100 allcentered'}>
                                                            <div class="col-lg-2 mr-2 p-0">
                                                                <div style={{ width: '100%', height: '40px' }}>
                                                                    <img
                                                                        src={
                                                                            item?.item?.imageUrl
                                                                                ? item?.item?.imageUrl
                                                                                : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                        }
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-4 p-0 wordbreak" style={{ fontWeight: 700, fontSize: '16px' }}>
                                                                {item?.item?.name}
                                                            </div>

                                                            <div class="col-lg-5 d-flex justify-content-end  p-0">
                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                    <FaWindowMinimize
                                                                        onClick={() => {
                                                                            if (orderpayload.items[index].count > 0) {
                                                                                var temp = { ...orderpayload };
                                                                                temp.items[index].count -= 1;
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
                                                                        class={formstyles.form__field + ' mx-2 p-1'}
                                                                        style={{ height: '25px', width: '52%' }}
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
                                                                            temp.items[index].count += 1;
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
                                { name: 'Order type', attr: 'ordertype', type: 'select', options: orderTypeContext, size: '12' },
                                { name: 'Payment type', attr: 'paymenttype', type: 'select', options: paymentTypeContext, size: '12' },
                                { name: 'Can be oppened', attr: 'canbeoppened', type: 'checkbox', size: '12' },
                                { name: 'Fragile', attr: 'fragile', type: 'checkbox', size: '12' },
                                { name: 'Partial delivery', attr: 'partialdelivery', type: 'checkbox', size: '12' },
                            ]}
                            payload={orderpayload}
                            setpayload={setorderpayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={orderpayload?.functype == 'add' ? 'Add Order' : lang.edit}
                            button1onClick={async () => {
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
                                        await orderpayload?.items?.map((item, index) => {
                                            temp.push({ itemVariantId: item?.item?.id, count: item?.count });
                                        });
                                        await setcartItems([...temp]);
                                        await addOrderMutation();
                                        history.push('/merchantorders');
                                    }
                                } catch {}
                            }}
                        />
                    </div>
                </div>
            </div>
            <AddCustomer openModal={addCustomerModal} setopenModal={setaddCustomerModal} payload={orderpayload} setpayload={setorderpayload} />
        </div>
    );
};
export default AddOrder;
