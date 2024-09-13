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

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { useQuery } from 'react-query';
import Form from '../../Form.js';
import Decimal from 'decimal.js';

const AddMerchant = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        useMutationGQL,
        fetchGovernorates,
        createMerchantDomesticShipping,
        updateMerchantDomesticShipping,
        fetchMerchants,
        addMerchant,
        createInventoryRent,
        fetchAllCountries,
        fetchSimilarAddresses,
        useLazyQueryGQL,
        createAddress,
        fetchCustomerAddresses,
    } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [buttonLoading, setbuttonLoading] = useState(false);
    const { lang, langdetect } = useContext(LanguageContext);
    const [similarAddresses, setsimilarAddresses] = useState([]);

    const [governoratesItems, setgovernoratesItems] = useState([
        {
            name: 'Cairo',
            shipping: 50,
            base: 20,
            vat: 0.14,
        },
    ]);
    const [merchantId, setmerchantId] = useState(undefined);
    const [governoratesItemsList, setgovernoratesItemsList] = useState([]);
    const [inventorySettings, setinventorySettings] = useState({
        inInventory: '',
        type: '',
        pricePerUnit: '',
        merchantId: '',
        sqaureMeter: undefined,
        currency: '',
        startDate: undefined,
    });

    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: 'Egypt',
        streetAddress: '',
    });
    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());
    const [createMerchantDomesticShippingMutation] = useMutationGQL(createMerchantDomesticShipping(), {
        merchantId: merchantId,
        list: governoratesItemsList,
    });

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
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchMerchants } = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const [fetchSimilarAddressesQuery] = useLazyQueryGQL(fetchSimilarAddresses());

    const [addMerchantMutation] = useMutationGQL(addMerchant(), {
        name: merchantPayload?.name,
        includesVat: merchantPayload?.includesVat,
        currency: merchantPayload?.currency,
        threshold: merchantPayload?.threshold,
        overShipping: merchantPayload?.overShipping,
        address:
            merchantPayload?.addressId == undefined
                ? {
                      country: addresspayload?.country,
                      city: addresspayload?.city,
                      buildingNumber: addresspayload?.buildingNumber,
                      apartmentFloor: addresspayload?.apartmentFloor,
                      streetAddress: addresspayload?.streetAddress,
                      governorateId:
                          addresspayload?.country == 'Egypt' ? fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.filter((item) => item.name == addresspayload?.city)[0]?.id : undefined,
                  }
                : undefined,
        addressId: merchantPayload?.addressId,
        bankName: merchantPayload?.bankName,
        bankNumber: merchantPayload?.bankNumber,
        taxId: merchantPayload?.taxId,
        ownerName: merchantPayload?.ownerName,
        ownerEmail: merchantPayload?.ownerEmail,
        ownerPhone: merchantPayload?.ownerPhone,
        ownerBirthdate: merchantPayload?.ownerBirthdate,
    });

    const [createInventoryRentMutation] = useMutationGQL(createInventoryRent(), {
        startDate: inventorySettings?.startDate,
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        type: inventorySettings?.type,
        sqaureMeter: inventorySettings?.sqaureMeter,
        merchantId: merchantId,
    });
    const [orderTypes, setOrderTypes] = useState([
        { label: 'Delivery', value: 'delivery' },
        { label: 'Exchange', value: 'exchange' },
        { label: 'Return', value: 'return' },
    ]);
    useEffect(() => {
        if (fetchGovernoratesQuery?.data) {
            var temp = [];
            fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.map((item, index) => {
                orderTypes?.map((orderType, orderTypeIndex) => {
                    temp.push({
                        name: item.name,
                        id: item.id,
                        shipping: 50,
                        base: 20,
                        vat: 0.14,
                        post: 0.1,
                        orderType: orderType?.value,
                    });
                });
            });
            setgovernoratesItems([...temp]);
        }
    }, [fetchGovernoratesQuery?.data]);

    const [activeStep, setActiveStep] = React.useState(0);
    const [skippedarray, setskippedarray] = React.useState([]);
    const [skipped, setSkipped] = React.useState(new Set());
    const [submit, setsubmit] = React.useState(false);

    const isStepOptional = (step) => {
        return step === 1 || step === 2;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const validateOwnerInfo = (payload) => {
        const { ownerName, ownerBirthdate, ownerPhone, ownerEmail } = payload;
        if (ownerName || ownerBirthdate || ownerPhone || ownerEmail) {
            return ownerName && ownerBirthdate && ownerPhone && ownerEmail;
        }
        return true; // No owner info is fine, so we consider it valid
    };

    const validateBankInfo = (payload) => {
        const { bankName, bankNumber, taxId } = payload;
        if (bankName || bankNumber || taxId) {
            return bankName && bankNumber && taxId;
        }
        return true; // No bank info is fine, so we consider it valid
    };

    const handleNext = async () => {
        if (activeStep == 0) {
            if (merchantPayload?.name?.length === 0) {
                NotificationManager.warning('Name cannot be empty', 'Warning');
                return;
            }

            if (!validateOwnerInfo(merchantPayload)) {
                NotificationManager.warning('Complete owner info', 'Warning');
                return;
            }

            if (!validateBankInfo(merchantPayload)) {
                NotificationManager.warning('Complete bank info', 'Warning');
                return;
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep == 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep == 2) {
            if (merchantPayload?.name?.length == 0) {
                NotificationManager.warning('Name Can not be empty', 'Warning');
            } else {
                setbuttonLoading(true);
                try {
                    const { data } = await addMerchantMutation();
                    var temp = [];

                    await setmerchantId(data?.createMerchant);
                    if (!skippedarray.includes(1)) {
                        await governoratesItems?.map((item, index) => {
                            temp.push({
                                govId: item.id,
                                total: item?.shipping,
                                vatDecimal: item.vat,
                                postDecimal: item.post,
                                base: item?.base,
                                orderType: item?.orderType,
                            });
                        });
                        await setgovernoratesItemsList([...temp]);
                        // if (queryParameters?.get('type') == 'add') {
                        await createMerchantDomesticShippingMutation();
                    }

                    if (!skippedarray.includes(2)) {
                        try {
                            const { data } = await createInventoryRentMutation();
                            history.push('/merchants');
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
                    }
                    refetchMerchants();
                    history.push('/merchants');

                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = async () => {
        if (activeStep == 1) {
            // const { data } = await addMerchantMutation();
            // await setmerchantId(data?.createMerchant);
        } else if (activeStep == 2) {
            if (merchantPayload?.name?.length == 0) {
                NotificationManager.warning('Name Can not be empty', 'Warning');
            } else {
                setbuttonLoading(true);

                try {
                    const { data } = await addMerchantMutation();
                    var temp = [];

                    await setmerchantId(data?.createMerchant);
                    if (!skippedarray.includes(1)) {
                        await governoratesItems?.map((item, index) => {
                            temp.push({
                                govId: item.id,
                                total: item?.shipping,
                                vatDecimal: item.vat,
                                postDecimal: item.post,
                                base: item?.base,
                                orderType: item?.orderType,
                            });
                        });
                        await setgovernoratesItemsList([...temp]);
                        // if (queryParameters?.get('type') == 'add') {
                        await createMerchantDomesticShippingMutation();
                    }

                    history.push('/merchants');

                    refetchMerchants();
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
            }
        }

        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // setSkipped((prevActiveStep) => prevActiveStep);
        var skippedTemp = [...skippedarray];
        skippedTemp.push(activeStep);
        setskippedarray([...skippedTemp]);

        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <></>
                ) : (
                    <React.Fragment>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {isStepOptional(activeStep) && (
                                <Button disabled={buttonLoading} color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    {buttonLoading && <CircularProgress color="var(--primary)" width="15px" height="15px" duration="1s" />}
                                    {!buttonLoading && <span>Skip</span>}
                                </Button>
                            )}
                            <button disabled={buttonLoading} class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && (
                                    <span style={{ fontSize: '14px' }} className="text-uppercase">
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </span>
                                )}
                            </button>

                            {/* <Button disabled={buttonLoading} onClick={handleNext}>
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</span>}
                            </Button> */}
                        </Box>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                                {activeStep === 0 && (
                                    <div class={' row m-0 w-100 allcentered'}>
                                        <div class="col-lg-12 p-0 mb-2 allcentered">
                                            <div class="col-lg-6">
                                                <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                                    Main Info
                                                </div>
                                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
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
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0 mb-2 allcentered">
                                            <div class="col-lg-6">
                                                <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                                    Address <span style={{ fontSize: '11px' }}>(optional)</span>
                                                </div>
                                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
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
                                                                          { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                                          { name: 'Apartment Floor', attr: 'apartmentFloor', size: '6' },
                                                                          { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                                      ]
                                                            }
                                                            payload={addresspayload}
                                                            setpayload={setaddresspayload}
                                                            button1disabled={buttonLoading}
                                                            button1class={generalstyles.roundbutton + '  mr-2 '}
                                                            button1placeholder={'Confirm address'}
                                                            button1onClick={async () => {
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
                                                                                    merchantId: merchantId,
                                                                                },
                                                                            },
                                                                        });
                                                                        if (data?.findSimilarAddresses) {
                                                                            setsimilarAddresses([...data?.findSimilarAddresses]);
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
                                                            }}
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
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0 mb-2 allcentered">
                                            <div class="col-lg-6">
                                                <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                                    Billing Info <span style={{ fontSize: '11px' }}>(optional)</span>
                                                </div>
                                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                                    <div class="col-lg-12">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Bank Name</label>
                                                                <input
                                                                    type={'text'}
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
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Bank Number</label>
                                                                <input
                                                                    type={'number'}
                                                                    class={formstyles.form__field}
                                                                    value={merchantPayload.bankNumber}
                                                                    onChange={(event) => {
                                                                        setmerchantPayload({ ...merchantPayload, bankNumber: event.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6 ">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Tax Id</label>
                                                                <input
                                                                    type={'number'}
                                                                    class={formstyles.form__field}
                                                                    value={merchantPayload.taxId}
                                                                    onChange={(event) => {
                                                                        setmerchantPayload({ ...merchantPayload, taxId: event.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class={'col-lg-6 pl-0'}>
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
                                                            ].filter((option) => option.value == merchantPayload?.includesVat)}
                                                            onChange={(option) => {
                                                                setmerchantPayload({ ...merchantPayload, includesVat: option.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0 mb-2 allcentered">
                                            <div class="col-lg-6">
                                                <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                                    Owner Info <span style={{ fontSize: '11px' }}>(optional)</span>
                                                </div>
                                                <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                                    <div class="col-lg-12">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Owner Name</label>
                                                                <input
                                                                    type={'text'}
                                                                    class={formstyles.form__field}
                                                                    value={merchantPayload.ownerName}
                                                                    onChange={(event) => {
                                                                        setmerchantPayload({ ...merchantPayload, ownerName: event.target.value?.length != 0 ? event.target.value : undefined });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Owner Email</label>
                                                                <input
                                                                    type={'text'}
                                                                    class={formstyles.form__field}
                                                                    value={merchantPayload.ownerEmail}
                                                                    onChange={(event) => {
                                                                        setmerchantPayload({ ...merchantPayload, ownerEmail: event.target.value?.length != 0 ? event.target.value : undefined });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Owner Phone</label>
                                                                <input
                                                                    type={'number'}
                                                                    class={formstyles.form__field}
                                                                    value={merchantPayload.ownerPhone}
                                                                    onChange={(event) => {
                                                                        setmerchantPayload({ ...merchantPayload, ownerPhone: event.target.value?.length != 0 ? event.target.value : undefined });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Owner Birthdate</label>
                                                                <input
                                                                    type={'date'}
                                                                    class={formstyles.form__field}
                                                                    value={merchantPayload.ownerBirthdate}
                                                                    onChange={(event) => {
                                                                        setmerchantPayload({ ...merchantPayload, ownerBirthdate: event.target.value?.length != 0 ? event.target.value : undefined });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>{' '}
                                    </div>
                                )}
                                {activeStep === 1 && (
                                    <>
                                        <div class={generalstyles.card + ' row m-0 w-100'}>
                                            <div class="col-lg-4">
                                                <div class="row m-0 w-100  ">
                                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                        <label class={formstyles.form__label}>Max order weight</label>
                                                        <input
                                                            type={'number'}
                                                            step="any"
                                                            class={formstyles.form__field}
                                                            value={merchantPayload.threshold}
                                                            onChange={(event) => {
                                                                setmerchantPayload({ ...merchantPayload, threshold: event.target.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="row m-0 w-100  ">
                                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                        <label class={formstyles.form__label}>Price per unit overweight</label>
                                                        <input
                                                            type={'number'}
                                                            step="any"
                                                            class={formstyles.form__field}
                                                            value={merchantPayload.overShipping}
                                                            onChange={(event) => {
                                                                setmerchantPayload({ ...merchantPayload, overShipping: event.target.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {!fetchGovernoratesQuery?.loading && (
                                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                                <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                                    <table style={{}} className={'table'}>
                                                        <thead>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}></th>
                                                            <th>VAT (14%)</th>
                                                            <th>Post (10%)</th>
                                                            <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Base</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Extra</th>
                                                            <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Total</th>
                                                        </thead>
                                                        <tbody>
                                                            {governoratesItems?.map((item, index) => {
                                                                if (index % 3 == 0) {
                                                                    return (
                                                                        <>
                                                                            <div style={{ border: '1px solid #eee', borderRadius: '5px', background: '#eee' }} class="col-lg-12 py-2">
                                                                                {item?.name}
                                                                            </div>

                                                                            <tr>
                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className={' m-0 p-0 wordbreak '}>
                                                                                        <span style={{ color: 'grey', fontSize: '14px' }} class="text-capitalize">
                                                                                            {item?.orderType}
                                                                                        </span>
                                                                                    </p>
                                                                                </td>

                                                                                <td>
                                                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                                                        <input
                                                                                            style={{ width: '50%' }}
                                                                                            type={'text'}
                                                                                            disabled={true}
                                                                                            class={formstyles.form__field}
                                                                                            value={item.vat}
                                                                                            onChange={(event) => {
                                                                                                var governoratesItemsTemp = [...governoratesItems];

                                                                                                governoratesItemsTemp[index].vat = event.target.value;

                                                                                                setgovernoratesItems([...governoratesItemsTemp]);
                                                                                            }}
                                                                                        />
                                                                                        <p style={{ width: '45%' }} className={' m-0 p-0 mx-1 h-100 d-flex align-items-center '}>
                                                                                            {new Decimal(item?.shipping ?? 0).sub(new Decimal(item?.shipping ?? 0).div(1.14)).toFixed(2)}
                                                                                        </p>
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                                                        <input
                                                                                            style={{ width: '50%' }}
                                                                                            type={'text'}
                                                                                            disabled={true}
                                                                                            class={formstyles.form__field}
                                                                                            value={item.post}
                                                                                            onChange={(event) => {
                                                                                                var governoratesItemsTemp = [...governoratesItems];

                                                                                                governoratesItemsTemp[index].post = event.target.value;

                                                                                                setgovernoratesItems([...governoratesItemsTemp]);
                                                                                            }}
                                                                                        />
                                                                                        <p style={{ width: '45%' }} className={' m-0 p-0 mx-1 h-100 d-flex align-items-center '}>
                                                                                            {new Decimal(0.1).mul(new Decimal(item?.base ?? 0)).toFixed(2)}
                                                                                        </p>
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                    <input
                                                                                        type={'text'}
                                                                                        class={formstyles.form__field}
                                                                                        value={item?.base}
                                                                                        onChange={(event) => {
                                                                                            var governoratesItemsTemp = [...governoratesItems];
                                                                                            if (event.target.value.length == 0) {
                                                                                                governoratesItemsTemp[index].base = 0;
                                                                                            } else {
                                                                                                governoratesItemsTemp[index].base = event.target.value;
                                                                                            }
                                                                                            setgovernoratesItems([...governoratesItemsTemp]);
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className={' m-0 p-0  h-100 d-flex align-items-center '}>
                                                                                        {new Decimal(item?.shipping ?? 0)
                                                                                            .div(1.14)
                                                                                            .minus(new Decimal(item?.base ?? 0))
                                                                                            .toFixed(2)}
                                                                                    </p>
                                                                                </td>
                                                                                <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                    <input
                                                                                        type={'text'}
                                                                                        class={formstyles.form__field}
                                                                                        value={item?.shipping}
                                                                                        onChange={(event) => {
                                                                                            var governoratesItemsTemp = [...governoratesItems];
                                                                                            if (event.target.value.length == 0) {
                                                                                                governoratesItemsTemp[index].shipping = 0;
                                                                                            } else {
                                                                                                governoratesItemsTemp[index].shipping = event.target.value;
                                                                                            }
                                                                                            setgovernoratesItems([...governoratesItemsTemp]);
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <tr>
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className={' m-0 p-0 wordbreak '}>
                                                                                    <span style={{ color: 'grey', fontSize: '14px' }} class="text-capitalize">
                                                                                        {item?.orderType}
                                                                                    </span>
                                                                                </p>
                                                                            </td>

                                                                            <td>
                                                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                                                    <input
                                                                                        style={{ width: '50%' }}
                                                                                        type={'text'}
                                                                                        disabled={true}
                                                                                        class={formstyles.form__field}
                                                                                        value={item.vat}
                                                                                        onChange={(event) => {
                                                                                            var governoratesItemsTemp = [...governoratesItems];

                                                                                            governoratesItemsTemp[index].vat = event.target.value;

                                                                                            setgovernoratesItems([...governoratesItemsTemp]);
                                                                                        }}
                                                                                    />
                                                                                    <p style={{ width: '45%' }} className={' m-0 p-0 mx-1 h-100 d-flex align-items-center '}>
                                                                                        {new Decimal(item?.shipping ?? 0).sub(new Decimal(item?.shipping ?? 0).div(1.14)).toFixed(2)}
                                                                                    </p>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                                                    <input
                                                                                        style={{ width: '50%' }}
                                                                                        type={'text'}
                                                                                        disabled={true}
                                                                                        class={formstyles.form__field}
                                                                                        value={item.post}
                                                                                        onChange={(event) => {
                                                                                            var governoratesItemsTemp = [...governoratesItems];

                                                                                            governoratesItemsTemp[index].post = event.target.value;

                                                                                            setgovernoratesItems([...governoratesItemsTemp]);
                                                                                        }}
                                                                                    />
                                                                                    <p style={{ width: '45%' }} className={' m-0 p-0 mx-1 h-100 d-flex align-items-center '}>
                                                                                        {new Decimal(0.1).mul(new Decimal(item?.base ?? 0)).toFixed(2)}
                                                                                    </p>
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                <input
                                                                                    type={'text'}
                                                                                    class={formstyles.form__field}
                                                                                    value={item?.base}
                                                                                    onChange={(event) => {
                                                                                        var governoratesItemsTemp = [...governoratesItems];
                                                                                        if (event.target.value.length == 0) {
                                                                                            governoratesItemsTemp[index].base = 0;
                                                                                        } else {
                                                                                            governoratesItemsTemp[index].base = event.target.value;
                                                                                        }
                                                                                        setgovernoratesItems([...governoratesItemsTemp]);
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className={' m-0 p-0  h-100 d-flex align-items-center '}>
                                                                                    {new Decimal(item?.shipping ?? 0)
                                                                                        .div(1.14)
                                                                                        .minus(new Decimal(item?.base ?? 0))
                                                                                        .toFixed(2)}
                                                                                </p>
                                                                            </td>
                                                                            <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                <input
                                                                                    type={'text'}
                                                                                    class={formstyles.form__field}
                                                                                    value={item?.shipping}
                                                                                    onChange={(event) => {
                                                                                        var governoratesItemsTemp = [...governoratesItems];
                                                                                        if (event.target.value.length == 0) {
                                                                                            governoratesItemsTemp[index].shipping = 0;
                                                                                        } else {
                                                                                            governoratesItemsTemp[index].shipping = event.target.value;
                                                                                        }
                                                                                        setgovernoratesItems([...governoratesItemsTemp]);
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {activeStep === 2 && (
                                    <div class={' row m-0 w-100 allcentered'}>
                                        <div class="col-lg-6">
                                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '100px 100px' }}>
                                                <div class={'col-lg-12 mb-3'}>
                                                    <label for="name" class={formstyles.form__label}>
                                                        Rent Type
                                                    </label>
                                                    <Select
                                                        options={inventoryRentTypeContext}
                                                        styles={defaultstyles}
                                                        value={inventoryRentTypeContext.filter((option) => option.value == inventorySettings?.type)}
                                                        onChange={(option) => {
                                                            setinventorySettings({ ...inventorySettings, type: option.value });
                                                        }}
                                                    />
                                                </div>
                                                <div class="col-lg-12">
                                                    <div class="row m-0 w-100  ">
                                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                            <label class={formstyles.form__label}>Start Date</label>
                                                            <input
                                                                type={'date'}
                                                                class={formstyles.form__field}
                                                                value={inventorySettings.startDate}
                                                                onChange={(event) => {
                                                                    setinventorySettings({ ...inventorySettings, startDate: event.target.value });
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
                                                                class={formstyles.form__field}
                                                                value={inventorySettings.currency}
                                                                onChange={(event) => {
                                                                    setinventorySettings({ ...inventorySettings, currency: event.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {inventorySettings?.type == 'meter' && (
                                                    <div class="col-lg-12">
                                                        <div class="row m-0 w-100  ">
                                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                                <label class={formstyles.form__label}>Sqaure Meter</label>
                                                                <input
                                                                    type={'number'}
                                                                    class={formstyles.form__field}
                                                                    value={inventorySettings.sqaureMeter}
                                                                    onChange={(event) => {
                                                                        setinventorySettings({ ...inventorySettings, sqaureMeter: event.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div class="col-lg-12">
                                                    <div class="row m-0 w-100  ">
                                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                            <label class={formstyles.form__label}>
                                                                {inventorySettings?.type === 'item'
                                                                    ? 'Price Per Item'
                                                                    : inventorySettings?.type == 'order'
                                                                    ? 'Price Per Order'
                                                                    : inventorySettings?.type == 'meter'
                                                                    ? 'Price Per Meter'
                                                                    : 'Price Per Unit Per Month'}
                                                            </label>
                                                            <input
                                                                type={'number'}
                                                                step="any"
                                                                class={formstyles.form__field}
                                                                value={inventorySettings.pricePerUnit}
                                                                onChange={(event) => {
                                                                    setinventorySettings({ ...inventorySettings, pricePerUnit: event.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class={'col-lg-12 d-flex justify-content-end mt-5'}>
                                                    {isStepOptional(activeStep) && (
                                                        <Button disabled={buttonLoading} color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                            {buttonLoading && <CircularProgress color="var(--primary)" width="15px" height="15px" duration="1s" />}
                                                            {!buttonLoading && <span>Skip</span>}
                                                        </Button>
                                                    )}
                                                    <button disabled={buttonLoading} class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                                        {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                        {!buttonLoading && <span>continue</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Typography>
                    </React.Fragment>
                )}
            </Box>
        </div>
    );
};
export default AddMerchant;
