import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import API from '../../../API/API.js';

import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { TbEdit } from 'react-icons/tb';
import { useQuery } from 'react-query';
import Form from '../../Form.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

const UpdateMerchant = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, isAuth, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, findOneMerchant, useLazyQueryGQL, fetchSimilarAddresses, fetchUsers, fetchMerchants, updateMerchant, fetchAllCountries, findAllZones } =
        API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [buttonLoading, setbuttonLoading] = useState(false);
    const { lang, langdetect } = useContext(LanguageContext);
    const [similarAddresses, setsimilarAddresses] = useState([]);
    const [issimilarAddresses, setissimilarAddresses] = useState(false);

    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: 'Egypt',
        streetAddress: '',
    });
    const fetchGovernoratesQuery = useQueryGQL('cache-and-network', fetchGovernorates());
    const findAllZonesQuery = useQueryGQL('cache-and-network', findAllZones());

    const [merchantPayload, setmerchantPayload] = useState({
        functype: 'add',
        name: '',
        includesVat: false,
        currency: 'EGP',
        overShipping: undefined,
        threshold: undefined,
    });
    const fetchAllCountriesQuery = useQuery(['fetchAllCountries'], () => fetchAllCountries(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [findOneMerchantQuery] = useLazyQueryGQL(findOneMerchant());
    const [fetchSimilarAddressesQuery] = useLazyQueryGQL(fetchSimilarAddresses());

    const [submit, setsubmit] = React.useState(false);
    const [edit, setEdit] = React.useState({
        mainInfo: false,
        address: false,
        billingInfo: false,
        ownerInfo: false,
    });

    const [updateMerchantMutation] = useMutationGQL(updateMerchant(), {
        id: parseInt(queryParameters?.get('merchantId')),
        name: merchantPayload?.name,
        currency: merchantPayload?.currency,
    });

    const [updateMerchantBillingMutation] = useMutationGQL(updateMerchant(), {
        id: parseInt(queryParameters?.get('merchantId')),
        bankNumber: merchantPayload?.bankNumber,
        bankName: merchantPayload?.bankName,
        includesVat: merchantPayload?.includesVat,
        taxId: merchantPayload?.taxId,
    });

    const [updateMerchantOwnerMutation] = useMutationGQL(updateMerchant(), {
        id: parseInt(queryParameters?.get('merchantId')),
        ownerId: merchantPayload?.ownerId,
    });

    const [updateMerchantAddressMutation] = useMutationGQL(updateMerchant(), {
        id: parseInt(queryParameters?.get('merchantId')),
        address:
            merchantPayload?.addressId == undefined
                ? {
                      country: addresspayload?.country,
                      city: addresspayload?.city,
                      buildingNumber: addresspayload?.buildingNumber,
                      apartmentFloor: addresspayload?.apartmentFloor,
                      streetAddress: addresspayload?.streetAddress,
                      zoneId: addresspayload?.zone,
                      governorateId:
                          addresspayload?.country == 'Egypt' ? fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.filter((item) => item.name == addresspayload?.city)[0]?.id : undefined,
                  }
                : undefined,
        addressId: merchantPayload?.addressId ?? undefined,
    });
    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantId: merchantPayload?.merchantId ?? undefined,
    });
    const fetchusers = useQueryGQL('', fetchUsers(), filterUsers);
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    useEffect(async () => {
        try {
            var { data } = await findOneMerchantQuery({
                variables: {
                    id: parseInt(queryParameters?.get('merchantId')),
                },
            });
            if (data?.findOneMerchant) {
                setmerchantPayload({
                    ...data?.findOneMerchant,
                    country: data?.findOneMerchant?.address.country,
                    city: data?.findOneMerchant?.address.city,
                    buildingNumber: data?.findOneMerchant?.address.buildingNumber,
                    apartmentFloor: data?.findOneMerchant?.address.apartmentFloor,
                    streetAddress: data?.findOneMerchant?.address.streetAddress,
                    ownerName: data?.findOneMerchant?.owner.name,
                    ownerBirthdate: data?.findOneMerchant?.owner.birthdate,
                    ownerPhone: data?.findOneMerchant?.owner.phone,
                    ownerEmail: data?.findOneMerchant?.owner.email,
                });

                setaddresspayload({
                    country: data?.findOneMerchant?.address.country ?? 'Egypt',
                    city: data?.findOneMerchant?.address.city,
                    buildingNumber: data?.findOneMerchant?.address.buildingNumber,
                    apartmentFloor: data?.findOneMerchant?.address.apartmentFloor,
                    streetAddress: data?.findOneMerchant?.address.streetAddress,
                });
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
        }
    }, []);
    const refetchfindOneMerchantQuery = async () => {
        try {
            var { data } = await findOneMerchantQuery({
                variables: {
                    id: parseInt(queryParameters?.get('merchantId')),
                },
            });
            setEdit({
                mainInfo: false,
                address: false,
                billingInfo: false,
                ownerInfo: false,
            });
            setissimilarAddresses(false);

            NotificationManager.success('', 'Success');

            if (data?.findOneMerchant) {
                setmerchantPayload({
                    ...data?.findOneMerchant,
                    country: data?.findOneMerchant?.address.country,
                    city: data?.findOneMerchant?.address.city,
                    buildingNumber: data?.findOneMerchant?.address.buildingNumber,
                    apartmentFloor: data?.findOneMerchant?.address.apartmentFloor,
                    streetAddress: data?.findOneMerchant?.address.streetAddress,
                    ownerName: data?.findOneMerchant?.owner.name,
                    ownerBirthdate: data?.findOneMerchant?.owner.birthdate,
                    ownerPhone: data?.findOneMerchant?.owner.phone,
                    ownerEmail: data?.findOneMerchant?.owner.email,
                });

                setaddresspayload({
                    country: data?.findOneMerchant?.address.country ?? 'Egypt',
                    city: data?.findOneMerchant?.address.city,
                    buildingNumber: data?.findOneMerchant?.address.buildingNumber,
                    apartmentFloor: data?.findOneMerchant?.address.apartmentFloor,
                    streetAddress: data?.findOneMerchant?.address.streetAddress,
                });
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
        }
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class={' row m-0 w-100 '}>
                <div class="col-lg-6 p-0 ">
                    <div class="row m-0 w-100">
                        <div class="col-lg-12">
                            <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                    <div> Main Info</div>
                                    <TbEdit
                                        onClick={() => {
                                            setEdit({ ...edit, mainInfo: true });
                                        }}
                                        class="text-secondaryhover"
                                    />
                                </div>
                            </div>
                            {edit?.mainInfo && (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Name</label>
                                                <input
                                                    type={'text'}
                                                    class={formstyles.form__field}
                                                    value={merchantPayload.name}
                                                    onChange={(event) => {
                                                        setmerchantPayload({ ...merchantPayload, name: event.target.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Currency</label>
                                                <input
                                                    disabled={true}
                                                    type={'text'}
                                                    class={formstyles.form__field}
                                                    value={merchantPayload.currency}
                                                    onChange={(event) => {
                                                        setmerchantPayload({ ...merchantPayload, currency: event.target.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 p-0 allcentered">
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + ' allcentered p-0'}
                                            onClick={async () => {
                                                setbuttonLoading(true);
                                                try {
                                                    const { data } = await updateMerchantMutation();
                                                    refetchfindOneMerchantQuery();
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
                                                setbuttonLoading(false);
                                            }}
                                        >
                                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                            {!buttonLoading && <span>Update</span>}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {!edit?.mainInfo && (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Name</label>
                                                <div>{merchantPayload?.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Currency</label>
                                                <div>{merchantPayload?.currency}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="col-lg-12">
                            <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                    <div>Owner Info</div>
                                    <TbEdit
                                        onClick={() => {
                                            setEdit({ ...edit, ownerInfo: true });
                                        }}
                                        class="text-secondaryhover"
                                    />
                                </div>
                            </div>
                            {edit.ownerInfo ? (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <Form
                                        size={'lg'}
                                        submit={submit}
                                        setsubmit={setsubmit}
                                        attr={
                                            isAuth([1])
                                                ? [
                                                      {
                                                          title: 'Merchant',
                                                          filter: filterMerchants,
                                                          setfilter: setfilterMerchants,
                                                          options: fetchMerchantsQuery,
                                                          optionsAttr: 'paginateMerchants',
                                                          label: 'name',
                                                          value: 'id',
                                                          size: '12',
                                                          attr: 'merchantId',
                                                          type: 'fetchSelect',
                                                      },
                                                      {
                                                          title: 'User',
                                                          filter: filterUsers,
                                                          setfilter: setfilterUsers,
                                                          options: fetchusers,
                                                          optionsAttr: 'paginateUsers',
                                                          label: 'name',
                                                          value: 'id',
                                                          size: '12',
                                                          attr: 'ownerId',
                                                          type: 'fetchSelect',
                                                      },
                                                  ]
                                                : [
                                                      {
                                                          title: 'User',
                                                          filter: filterUsers,
                                                          setfilter: setfilterUsers,
                                                          options: fetchusers,
                                                          optionsAttr: 'paginateUsers',
                                                          label: 'name',
                                                          value: 'id',
                                                          size: '12',
                                                          attr: 'ownerID',
                                                          type: 'fetchSelect',
                                                      },
                                                  ]
                                        }
                                        payload={merchantPayload}
                                        setpayload={setmerchantPayload}
                                    />
                                    <div class="col-lg-12 p-0 allcentered">
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + ' allcentered p-0'}
                                            onClick={async () => {
                                                setbuttonLoading(true);
                                                try {
                                                    const { data } = await updateMerchantOwnerMutation();
                                                    refetchfindOneMerchantQuery();
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
                                                setbuttonLoading(false);
                                            }}
                                        >
                                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                            {!buttonLoading && <span>Update</span>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Owner Name</label>
                                                <div>{merchantPayload.ownerName}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Owner Email</label>
                                                <div>{merchantPayload.ownerEmail}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Owner Phone</label>
                                                <div>{merchantPayload.ownerPhone}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Owner Birthdate</label>
                                                <div>{merchantPayload.ownerBirthdate}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 p-0">
                    <div class="row m-0 w-100">
                        <div class="col-lg-12">
                            <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                    <div>Address</div>
                                    <TbEdit
                                        onClick={() => {
                                            setEdit({ ...edit, address: true });
                                        }}
                                        class="text-secondaryhover"
                                    />
                                </div>
                            </div>
                            {edit?.address && (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-12 p-0">
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
                                                                          e.governorateId == fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)?.id,
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
                                                                          e.governorateId == fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)?.id,
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
                                                button1disabled={buttonLoading}
                                                button1class={generalstyles.roundbutton + '  mr-2 d-none '}
                                                button1placeholder={'Confirm address'}
                                                button1onClick={async () => {}}
                                            />
                                        </div>
                                        {similarAddresses?.length != 0 && (
                                            <>
                                                {' '}
                                                {similarAddresses?.filter((i) => i?.score == 0)?.length != 0 && (
                                                    <div class="col-lg-12 p-0">
                                                        <div class="row m-0 w-100">
                                                            <div class="col-lg-12">Strongly recommended:</div>
                                                            {similarAddresses?.map((item, index) => {
                                                                if (item?.score == 0) {
                                                                    return (
                                                                        <>
                                                                            <div class="col-lg-12 mt-2 ">
                                                                                <div
                                                                                    onClick={async () => {
                                                                                        setmerchantPayload({ ...merchantPayload, addressId: item?.address?.id });
                                                                                    }}
                                                                                    style={{
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.4s',
                                                                                        border: merchantPayload?.addressId == item?.address?.id ? '1px solid var(--primary)' : '',
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
                                                )}
                                                {similarAddresses?.filter((i) => i?.score != 0)?.length != 0 && (
                                                    <div class="col-lg-12 p-0">
                                                        <div class="row m-0 w-100">
                                                            <div class="col-lg-12">Suggestions:</div>
                                                            {similarAddresses?.map((item, index) => {
                                                                if (item?.score != 0) {
                                                                    return (
                                                                        <>
                                                                            <div class="col-lg-12 mt-2 ">
                                                                                <div
                                                                                    onClick={async () => {
                                                                                        setmerchantPayload({ ...merchantPayload, addressId: item?.address?.id });
                                                                                    }}
                                                                                    style={{
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.4s',
                                                                                        border: merchantPayload?.addressId == item?.address?.id ? '1px solid var(--primary)' : '',
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
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div class="col-lg-12 p-0 allcentered">
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + ' allcentered p-0'}
                                            onClick={async () => {
                                                if (!issimilarAddresses) {
                                                    setbuttonLoading(true);
                                                    if (addresspayload?.city?.length != 0 && addresspayload?.country?.length != 0 && addresspayload?.streetAddress?.length != 0) {
                                                        try {
                                                            var { data } = await fetchSimilarAddressesQuery({
                                                                variables: {
                                                                    input: {
                                                                        city: addresspayload?.city,
                                                                        country: addresspayload?.country,
                                                                        streetAddress: addresspayload?.streetAddress,
                                                                        buildingNumber: addresspayload?.buildingNumber,
                                                                        apartmentFloor: addresspayload?.apartmentFloor,
                                                                        zoneId: addresspayload?.zone,
                                                                        merchantId: parseInt(queryParameters?.get('merchantId')),
                                                                    },
                                                                },
                                                            });
                                                            if (data?.findSimilarAddresses) {
                                                                setsimilarAddresses([...data?.findSimilarAddresses]);
                                                                setmerchantPayload({ ...merchantPayload, addressId: undefined });

                                                                setissimilarAddresses(true);
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
                                                        }
                                                    } else {
                                                        NotificationManager.warning('', 'Please complete the missing fields');
                                                    }
                                                    setbuttonLoading(false);
                                                } else {
                                                    setbuttonLoading(true);
                                                    try {
                                                        const { data } = await updateMerchantAddressMutation();
                                                        refetchfindOneMerchantQuery();
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
                                                    setbuttonLoading(false);
                                                }
                                            }}
                                        >
                                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                            {!buttonLoading && <span>{issimilarAddresses ? 'Update' : 'Confirm address'}</span>}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {!edit?.address && (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Country</label>
                                                <div>{merchantPayload?.address?.country}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>City</label>
                                                <div>{merchantPayload?.address?.city}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Building Number</label>
                                                <div>{merchantPayload?.address?.buildingNumber}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Apartment Floor</label>
                                                <div>{merchantPayload?.address?.apartmentFloor}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Street Address</label>
                                                <div>{merchantPayload?.address?.streetAddress}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="col-lg-12">
                            <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                    <div>Billing Info</div>
                                    <TbEdit
                                        onClick={() => {
                                            setEdit({ ...edit, billingInfo: true });
                                        }}
                                        class="text-secondaryhover"
                                    />
                                </div>
                            </div>
                            {edit.billingInfo ? (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Bank Name</label>
                                                <input
                                                    type="text"
                                                    class={formstyles.form__field}
                                                    value={merchantPayload.bankName}
                                                    onChange={(event) => {
                                                        setmerchantPayload({ ...merchantPayload, bankName: event.target.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Bank Number</label>
                                                <input
                                                    type="number"
                                                    class={formstyles.form__field}
                                                    value={merchantPayload.bankNumber}
                                                    onChange={(event) => {
                                                        setmerchantPayload({ ...merchantPayload, bankNumber: event.target.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Tax Id</label>
                                                <input
                                                    type="number"
                                                    class={formstyles.form__field}
                                                    value={merchantPayload.taxId}
                                                    onChange={(event) => {
                                                        setmerchantPayload({ ...merchantPayload, taxId: event.target.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 pl-0">
                                        <label for="name" class={formstyles.form__label}>
                                            Includes VAT
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Includes VAT', value: true },
                                                { label: 'Does not include VAT', value: false },
                                            ]}
                                            styles={defaultstyles}
                                            value={[
                                                { label: 'Includes VAT', value: true },
                                                { label: 'Does not include VAT', value: false },
                                            ].filter((option) => option.value == merchantPayload.includesVat)}
                                            onChange={(option) => {
                                                setmerchantPayload({ ...merchantPayload, includesVat: option.value });
                                            }}
                                        />
                                    </div>
                                    <div class="col-lg-12 p-0 allcentered">
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + ' allcentered p-0'}
                                            onClick={async () => {
                                                setbuttonLoading(true);
                                                try {
                                                    const { data } = await updateMerchantBillingMutation();
                                                    refetchfindOneMerchantQuery();
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
                                                setbuttonLoading(false);
                                            }}
                                        >
                                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                            {!buttonLoading && <span>Update</span>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '20px 40px' }}>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Bank Name</label>
                                                <div>{merchantPayload.bankName}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Bank Number</label>
                                                <div>{merchantPayload.bankNumber}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Tax Id</label>
                                                <div>{merchantPayload.taxId}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 pl-0">
                                        <label class={formstyles.form__label}>Includes VAT</label>
                                        <div>{merchantPayload.includesVat ? 'Includes VAT' : 'Does not include VAT'}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UpdateMerchant;
