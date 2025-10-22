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
import { MdClose } from 'react-icons/md';

const UpdateMerchant = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, isAuth, dateformatter, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, findOneMerchant, useLazyQueryGQL, fetchSimilarAddresses, fetchUsers, fetchMerchants, updateMerchant, fetchAllCountries, findAllZones } =
        API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const { lang, langdetect } = useContext(LanguageContext);
    const [similarAddresses, setsimilarAddresses] = useState([]);
    const [issimilarAddresses, setissimilarAddresses] = useState(false);
    const [cities, setCities] = useState([]);

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
                      apartmentNumber: addresspayload?.apartmentNumber,
                      streetAddress: addresspayload?.streetAddress,
                      zoneId: addresspayload?.zoneId,
                      governorateId:
                          addresspayload?.country == 'Egypt' ? fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.filter((item) => item?.name == addresspayload?.city)[0]?.id : undefined,
                  }
                : undefined,
        addressId: merchantPayload?.addressId ?? undefined,
    });
    const [filterUsers, setfilterUsers] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantId: merchantPayload?.merchantId ?? undefined,
    });
    const fetchusers = useQueryGQL('', fetchUsers(), filterUsers);

    useEffect(() => {
        const cities = fetchAllCountriesQuery?.data?.data?.data.filter((item) => item.country == addresspayload?.country)[0]?.cities.map((city) => ({ label: city, value: city }));
        setCities(cities);
    }, [addresspayload?.country]);
    useEffect(async () => {
        setpageactive_context('/updatemerchant?merchantId=' + queryParameters?.get('merchantId'));
        setpagetitle_context('Merchant');

        try {
            var { data } = await findOneMerchantQuery({
                variables: {
                    id: parseInt(queryParameters?.get('merchantId')),
                },
            });
            if (data?.findOneMerchant) {
                setmerchantPayload({
                    ...data?.findOneMerchant,
                    country: data?.findOneMerchant?.address?.country,
                    city: data?.findOneMerchant?.address?.city,
                    buildingNumber: data?.findOneMerchant?.address?.buildingNumber,
                    apartmentNumber: data?.findOneMerchant?.address?.apartmentNumber,
                    streetAddress: data?.findOneMerchant?.address?.streetAddress,
                    ownerName: data?.findOneMerchant?.owner?.name,
                    ownerPhone: data?.findOneMerchant?.owner?.phone,
                    ownerEmail: data?.findOneMerchant?.owner?.email,
                });

                setaddresspayload({
                    country: data?.findOneMerchant?.address?.country ?? 'Egypt',
                    city: data?.findOneMerchant?.address?.city,
                    buildingNumber: data?.findOneMerchant?.address?.buildingNumber,
                    streetAddress: data?.findOneMerchant?.address?.streetAddress,
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
                    country: data?.findOneMerchant?.address?.country,
                    city: data?.findOneMerchant?.address?.city,
                    buildingNumber: data?.findOneMerchant?.address?.buildingNumber,
                    apartmentNumber: data?.findOneMerchant?.address?.apartmentNumber,
                    streetAddress: data?.findOneMerchant?.address?.streetAddress,
                    ownerName: data?.findOneMerchant?.owner?.name,
                    ownerPhone: data?.findOneMerchant?.owner?.phone,
                    ownerEmail: data?.findOneMerchant?.owner?.email,
                });

                setaddresspayload({
                    country: data?.findOneMerchant?.address?.country ?? 'Egypt',
                    city: data?.findOneMerchant?.address?.city,
                    buildingNumber: data?.findOneMerchant?.address?.buildingNumber,
                    streetAddress: data?.findOneMerchant?.address?.streetAddress,
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
    const calculateDaysLeft = (expirationDate) => {
        const currentDate = new Date();
        const expiration = new Date(expirationDate);
        const timeDiff = expiration - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert from milliseconds to days
        return daysDiff;
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class={' row m-0 w-100 '}>
                {isAuth([1]) && (
                    <div class="col-lg-12 ">
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            <div class="col-lg-12 p-0 mb-2" style={{ color: 'grey', fontSize: '18px', fontWeight: 700 }}>
                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                    <div>Webtoken</div>
                                </div>
                            </div>
                            <div style={{ background: '#f6f8fa', padding: '1rem' }} class="col-lg-12 ">
                                {merchantPayload?.webToken ?? 'No token'}
                            </div>
                            {merchantPayload?.webTokenExpiration && (
                                <>
                                    <div className="col-lg-12 d-flex justify-content-end mt-2">Expires in {calculateDaysLeft(merchantPayload?.webTokenExpiration)} Days</div>

                                    <div className="col-lg-12 d-flex justify-content-end mt-1" style={{ color: 'grey', fontSize: '12px' }}>
                                        {dateformatter(merchantPayload?.webTokenExpiration)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {merchantPayload && (
                    <>
                        <div class="col-lg-6 p-0 ">
                            <div class="row m-0 w-100">
                                <div class="col-lg-12">
                                    <div class={generalstyles.card + ' row m-0 w-100'}>
                                        {' '}
                                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '18px', fontWeight: 700 }}>
                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                <div>Main Info</div>
                                                <div
                                                    style={{ height: '30px', width: '30px' }}
                                                    class="iconhover allcentered"
                                                    onClick={() => {
                                                        setEdit({ ...edit, mainInfo: !edit?.mainInfo });
                                                    }}
                                                >
                                                    {edit.mainInfo && <MdClose />}
                                                    {!edit.mainInfo && <TbEdit />}
                                                </div>
                                            </div>
                                        </div>
                                        {edit?.mainInfo && (
                                            <div class={' row m-0 w-100'}>
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
                                                            <Select
                                                                options={[
                                                                    { label: 'EGP', value: 'EGP' },
                                                                    { label: 'USD', value: 'USD' },
                                                                ]}
                                                                styles={defaultstyles}
                                                                defaultValue={merchantPayload.currency}
                                                                onChange={(option) => {
                                                                    setmerchantPayload({ ...merchantPayload, currency: option.value });
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
                                                            if (buttonLoadingContext) return;

                                                            setbuttonLoadingContext(true);
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
                                                            setbuttonLoadingContext(false);
                                                        }}
                                                    >
                                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                        {!buttonLoadingContext && <span>Update</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {!edit?.mainInfo && (
                                            <div class={' row m-0 w-100'}>
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
                                </div>
                                <div class="col-lg-12">
                                    <div class={generalstyles.card + ' row m-0 w-100'}>
                                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '18px', fontWeight: 700 }}>
                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                <div>Owner Info</div>
                                                <div
                                                    style={{ height: '30px', width: '30px' }}
                                                    class="iconhover allcentered"
                                                    onClick={() => {
                                                        setEdit({ ...edit, ownerInfo: !edit?.ownerInfo });
                                                    }}
                                                >
                                                    {edit.ownerInfo && <MdClose />}
                                                    {!edit.ownerInfo && <TbEdit />}
                                                </div>
                                            </div>
                                        </div>

                                        {edit.ownerInfo ? (
                                            <div class={' row m-0 w-100'}>
                                                <Form
                                                    size={'lg'}
                                                    submit={submit}
                                                    setsubmit={setsubmit}
                                                    attr={[
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
                                                            disabled: fetchusers?.loading,
                                                        },
                                                    ]}
                                                    payload={merchantPayload}
                                                    setpayload={setmerchantPayload}
                                                />
                                                <div class="col-lg-12 p-0 allcentered">
                                                    <button
                                                        style={{ height: '35px' }}
                                                        class={generalstyles.roundbutton + ' allcentered p-0'}
                                                        onClick={async () => {
                                                            if (buttonLoadingContext) return;
                                                            setbuttonLoadingContext(true);
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
                                                            setbuttonLoadingContext(false);
                                                        }}
                                                    >
                                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                        {!buttonLoadingContext && <span>Update</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {merchantPayload.ownerName && (
                                                    <div class={' row m-0 w-100'}>
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
                                                        {/* <div class="col-lg-12">
                                                            <div class="row m-0 w-100  ">
                                                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                    <label class={formstyles.form__label}>Owner Birthdate</label>
                                                                    <div>{merchantPayload.ownerBirthdate}</div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                )}
                                                {!merchantPayload.ownerName && (
                                                    <div class={' row m-0 w-100 allcentered'}>
                                                        <div class="col-lg-12 p-0 allcentered">
                                                            <button
                                                                style={{ height: '35px' }}
                                                                class={generalstyles.roundbutton + ' allcentered p-0'}
                                                                onClick={async () => {
                                                                    setEdit({ ...edit, ownerInfo: true });
                                                                }}
                                                            >
                                                                <span>Add Owner</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 p-0">
                            <div class={' row m-0 w-100'}>
                                <div class="col-lg-12">
                                    <div class={generalstyles.card + ' row m-0 w-100'}>
                                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '18px', fontWeight: 700 }}>
                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                <div>Address</div>
                                                <div
                                                    style={{ height: '30px', width: '30px' }}
                                                    class="iconhover allcentered"
                                                    onClick={() => {
                                                        setEdit({ ...edit, address: !edit?.address });
                                                    }}
                                                >
                                                    {edit.address && <MdClose />}
                                                    {!edit.address && <TbEdit />}
                                                </div>
                                            </div>
                                        </div>
                                        {edit?.address && (
                                            <div class={' row m-0 w-100'}>
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
                                                                              attr: 'zoneId',
                                                                              type: 'select',
                                                                              options: findAllZonesQuery?.data?.findAllZones?.filter(
                                                                                  (e) =>
                                                                                      e.governorateId ==
                                                                                      fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)?.id,
                                                                              ),
                                                                              size: '6',
                                                                              optionValue: 'id',
                                                                              optionLabel: 'name',
                                                                          },
                                                                          { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                                          { name: 'Apartment Floor', attr: 'apartmentNumber', size: '6' },
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
                                                                              attr: 'zoneId',
                                                                              type: 'select',
                                                                              options: findAllZonesQuery?.data?.findAllZones?.filter(
                                                                                  (e) =>
                                                                                      e.governorateId ==
                                                                                      fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)?.id,
                                                                              ),
                                                                              size: '6',
                                                                              optionValue: 'id',
                                                                              optionLabel: 'name',
                                                                          },
                                                                          { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                                          { name: 'Apartment Floor', attr: 'apartmentNumber', size: '6' },
                                                                          { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                                      ]
                                                            }
                                                            payload={addresspayload}
                                                            setpayload={setaddresspayload}
                                                            button1disabled={buttonLoadingContext}
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
                                                                                                    <span style={{ fontWeight: 600 }}>{item?.address?.buildingNumber}</span>
                                                                                                </div>
                                                                                                <div class="col-lg-12">
                                                                                                    Floor: <span style={{ fontWeight: 600 }}>{item?.address?.apartmentNumber}</span>, Floor:{' '}
                                                                                                    <span style={{ fontWeight: 600 }}>{item?.address?.apartmentNumber}</span>
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
                                                                                                    Floor: <span style={{ fontWeight: 600 }}>{item?.address?.apartmentNumber}</span>
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
                                                                if (buttonLoadingContext) return;
                                                                setbuttonLoadingContext(true);
                                                                if (addresspayload?.city?.length != 0 && addresspayload?.country?.length != 0 && addresspayload?.streetAddress?.length != 0) {
                                                                    try {
                                                                        var { data } = await fetchSimilarAddressesQuery({
                                                                            variables: {
                                                                                input: {
                                                                                    city: addresspayload?.city,
                                                                                    country: addresspayload?.country,
                                                                                    streetAddress: addresspayload?.streetAddress,
                                                                                    buildingNumber: addresspayload?.buildingNumber,
                                                                                    apartmentNumber: addresspayload?.apartmentNumber,

                                                                                    zoneId: addresspayload?.zoneId,
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
                                                                setbuttonLoadingContext(false);
                                                            } else {
                                                                if (buttonLoadingContext) return;
                                                                setbuttonLoadingContext(true);
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
                                                                setbuttonLoadingContext(false);
                                                            }
                                                        }}
                                                    >
                                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                        {!buttonLoadingContext && <span>{issimilarAddresses ? 'Update' : 'Confirm address'}</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {!edit?.address && (
                                            <>
                                                {merchantPayload.address && (
                                                    <div class={' row m-0 w-100'}>
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
                                                                    <label class={formstyles.form__label}>Zone</label>
                                                                    <div>{merchantPayload?.address?.zone?.name}</div>
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
                                                                    <div>{merchantPayload?.address?.apartmentNumber}</div>
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
                                                {!merchantPayload.address && (
                                                    <div class={' row m-0 w-100 allcentered'}>
                                                        <div class="col-lg-12 p-0 allcentered">
                                                            <button
                                                                style={{ height: '35px' }}
                                                                class={generalstyles.roundbutton + ' allcentered p-0'}
                                                                onClick={async () => {
                                                                    setEdit({ ...edit, address: true });
                                                                }}
                                                            >
                                                                <span>Add Address</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class={generalstyles.card + ' row m-0 w-100'}>
                                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '18px', fontWeight: 700 }}>
                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                <div>Billing Info</div>
                                                <div
                                                    style={{ height: '30px', width: '30px' }}
                                                    class="iconhover allcentered"
                                                    onClick={() => {
                                                        setEdit({ ...edit, billingInfo: !edit?.billingInfo });
                                                    }}
                                                >
                                                    {edit.billingInfo && <MdClose />}
                                                    {!edit.billingInfo && <TbEdit />}
                                                </div>
                                            </div>
                                        </div>

                                        {edit.billingInfo ? (
                                            <>
                                                <div class={' row m-0 w-100'}>
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
                                                                if (buttonLoadingContext) return;
                                                                setbuttonLoadingContext(true);
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
                                                                setbuttonLoadingContext(false);
                                                            }}
                                                        >
                                                            {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                            {!buttonLoadingContext && <span>Update</span>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {merchantPayload.bankName && (
                                                    <div class={' row m-0 w-100'}>
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
                                                {!merchantPayload.bankName && (
                                                    <div class={' row m-0 w-100 allcentered'}>
                                                        <div class="col-lg-12 p-0 allcentered">
                                                            <button
                                                                style={{ height: '35px' }}
                                                                class={generalstyles.roundbutton + ' allcentered p-0'}
                                                                onClick={async () => {
                                                                    setEdit({ ...edit, billingInfo: true });
                                                                }}
                                                            >
                                                                <span>Add Bank</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default UpdateMerchant;
