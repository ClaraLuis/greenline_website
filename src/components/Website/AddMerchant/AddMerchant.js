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
    const { setpageactive_context, setpagetitle_context, dateformatter, inventoryRentTypeContext, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
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
        findAllZones,
        emailTaken,
    } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Rent'];

    const { lang, langdetect } = useContext(LanguageContext);
    const [similarAddresses, setsimilarAddresses] = useState([]);
    const [cities, setCities] = useState([]);

    const [governoratesItems, setgovernoratesItems] = useState([
        {
            name: 'Cairo',
            shipping: 50,
            base: 20,
            vat: 0.14,
        },
    ]);
    const [merchantId, setmerchantId] = useState(undefined);
    const [addressskipped, setaddressskipped] = useState(undefined);
    const [addressConfirmed, setaddressConfirmed] = useState(undefined);
    const [governoratesItemsList, setgovernoratesItemsList] = useState([]);
    const [inventorySettings, setinventorySettings] = useState({
        inInventory: '',
        type: '',
        pricePerUnit: '',
        merchantId: '',
        sqaureMeter: undefined,
        currency: 'EGP',
        startDate: new Date().toISOString().split('T')[0],
    });

    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: 'Egypt',
        streetAddress: '',
    });
    const fetchGovernoratesQuery = useQueryGQL('cache-and-network', fetchGovernorates());
    const findAllZonesQuery = useQueryGQL('cache-and-network', findAllZones());
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
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchMerchants } = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);

    const [fetchSimilarAddressesQuery] = useLazyQueryGQL(fetchSimilarAddresses());
    const [emailTakenQuery] = useLazyQueryGQL(emailTaken());

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
                      streetAddress: addresspayload?.streetAddress,
                      zoneId: addresspayload?.zone,
                      governorateId:
                          addresspayload?.country == 'Egypt' ? fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.filter((item) => item?.name == addresspayload?.city)[0]?.id : undefined,
                  }
                : undefined,
        addressId: merchantPayload?.addressId,
        bankName: merchantPayload?.bankName,
        bankNumber: merchantPayload?.bankNumber,
        taxId: merchantPayload?.taxId,
        ownerName: merchantPayload?.ownerName,
        ownerEmail: merchantPayload?.ownerEmail,
        ownerPhone: merchantPayload?.ownerPhone,
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
        const cities = fetchAllCountriesQuery?.data?.data?.data.filter((item) => item.country == addresspayload?.country)[0]?.cities.map((city) => ({ label: city, value: city }));
        setCities(cities);
    }, [addresspayload?.country]);
    useEffect(() => {
        if (fetchGovernoratesQuery?.data) {
            var temp = [];
            fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.map((item, index) => {
                orderTypes?.map((orderType, orderTypeIndex) => {
                    temp.push({
                        name: item?.name,
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

    const validateOwnerInfo = async (payload) => {
        const { ownerName, ownerPhone, ownerEmail } = payload;

        if (!ownerName && !ownerPhone && !ownerEmail) {
            return true; // No owner info is fine, so we consider it valid
        }

        if (!ownerName || !ownerPhone || !ownerEmail) {
            NotificationManager.warning('Complete owner info', 'Warning');
            return false;
        }

        let isEmailTaken = false;

        // Verify email asynchronously
        try {
            const { data } = await emailTakenQuery({
                variables: {
                    input: {
                        email: ownerEmail,
                    },
                },
            });
            isEmailTaken = data?.emailTaken;
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
            return false;
        }

        if (isEmailTaken) {
            NotificationManager.warning('Email is taken', 'Warning!');
            return false;
        }

        return true;
    };

    const validateBankInfo = (payload) => {
        const { bankName, bankNumber, taxId } = payload;
        if (bankName || bankNumber || taxId) {
            return bankName && bankNumber && taxId;
        }
        return true; // No bank info is fine, so we consider it valid
    };
    const validateRentInfo = (payload) => {
        const { type, startDate, currency, pricePerUnit } = payload;
        if (type || startDate || currency || pricePerUnit) {
            return type && startDate && currency && pricePerUnit;
        }
        return true; // No bank info is fine, so we consider it valid
    };

    const handleNext = async () => {
        if (activeStep == 0) {
            if (merchantPayload?.name?.length === 0) {
                NotificationManager.warning('Name cannot be empty', 'Warning');
                return;
            }

            if (!(await validateOwnerInfo(merchantPayload))) {
                return;
            }

            if (!validateBankInfo(merchantPayload)) {
                NotificationManager.warning('Complete bank info', 'Warning');
                return;
            }
            if (addressskipped == undefined && addressConfirmed == undefined) {
                NotificationManager.warning('Please either confirm address or skip to continue', 'Warning');
                return;
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep == 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep == 2) {
            if (!validateRentInfo(inventorySettings)) {
                NotificationManager.warning('Complete rent info', 'Warning');
                return;
            }
            if (merchantPayload?.name?.length == 0) {
                NotificationManager.warning('Name Can not be empty', 'Warning');
            } else {
                if (buttonLoadingContext) return;
                setbuttonLoadingContext(true);
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
                setbuttonLoadingContext(false);
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
                if (buttonLoadingContext) return;
                setbuttonLoadingContext(true);

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
                setbuttonLoadingContext(false);
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
                                <Button disabled={buttonLoadingContext} color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    {buttonLoadingContext && <CircularProgress color="var(--primary)" width="15px" height="15px" duration="1s" />}
                                    {!buttonLoadingContext && <span>Skip</span>}
                                </Button>
                            )}
                            <button disabled={buttonLoadingContext} class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && (
                                    <span style={{ fontSize: '14px' }} className="text-uppercase">
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </span>
                                )}
                            </button>

                            {/* <Button disabled={buttonLoadingContext} onClick={handleNext}>
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</span>}
                            </Button> */}
                        </Box>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                                {activeStep === 0 && merchantPayload && (
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
                                                                <Select
                                                                    options={[
                                                                        { label: 'EGP', value: 'EGP' },
                                                                        { label: 'USD', value: 'USD' },
                                                                    ]}
                                                                    styles={defaultstyles}
                                                                    value={[
                                                                        { label: 'EGP', value: 'EGP' },
                                                                        { label: 'USD', value: 'USD' },
                                                                    ].filter((option) => option.value == merchantPayload?.currency)}
                                                                    onChange={(option) => {
                                                                        // alert(JSON.stringify(option.value));
                                                                        setmerchantPayload({ ...merchantPayload, currency: option.value });
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
                                                                          {
                                                                              name: 'Zone',
                                                                              attr: 'zone',
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
                                                                          //   { name: 'Apartment Floor', attr: 'buildingNumber', size: '6' },
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
                                                                                      fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.find((i) => i.name == addresspayload?.city)?.id,
                                                                              ),
                                                                              size: '6',
                                                                              optionValue: 'id',
                                                                              optionLabel: 'name',
                                                                          },
                                                                          { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                                          //   { name: 'Apartment Floor', attr: 'buildingNumber', size: '6' },
                                                                          { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                                      ]
                                                            }
                                                            payload={addresspayload}
                                                            setpayload={setaddresspayload}
                                                            button1disabled={buttonLoadingContext}
                                                            button1class={generalstyles.roundbutton + '  mr-2 '}
                                                            button1placeholder={addressskipped || addressConfirmed ? 'Edit' : 'Confirm address'}
                                                            button1onClick={async () => {
                                                                if (addressskipped || addressConfirmed) {
                                                                    setaddressConfirmed(undefined);
                                                                    setaddressskipped(undefined);
                                                                } else {
                                                                    setaddressConfirmed(true);

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
                                                                                        // buildingNumber: addresspayload?.buildingNumber,
                                                                                        zoneId: addresspayload?.zone,

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
                                                                    setbuttonLoadingContext(false);
                                                                }
                                                            }}
                                                            button2={addressskipped || addressConfirmed ? false : true}
                                                            button2disabled={buttonLoadingContext}
                                                            button2class={generalstyles.roundbutton + '  mr-2 '}
                                                            button2placeholder={'Skip'}
                                                            button2onClick={async () => {
                                                                setaddressskipped(true);
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
                                                                                                    <span style={{ fontWeight: 600 }}>{item?.address?.buildingNumber}</span>
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
                                                                                                {/* <div class="col-lg-12">
                                                                                                    Floor: <span style={{ fontWeight: 600 }}>{item?.address?.buildingNumber}</span>
                                                                                                </div> */}

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
                                                    {/* <div class="col-lg-12">
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
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>{' '}
                                    </div>
                                )}
                                {activeStep === 1 && (
                                    <>
                                        <div class="col-lg-12 px-3">
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
                                                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                                        <table className="table table-hover">
                                                            <thead style={{ position: 'sticky', top: '0px' }}>
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
                                        </div>
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
                                                            <Select
                                                                options={[
                                                                    { label: 'EGP', value: 'EGP' },
                                                                    { label: 'USD', value: 'USD' },
                                                                ]}
                                                                styles={defaultstyles}
                                                                value={[
                                                                    { label: 'EGP', value: 'EGP' },
                                                                    { label: 'USD', value: 'USD' },
                                                                ].filter((option) => option.value == inventorySettings?.currency)}
                                                                onChange={(option) => {
                                                                    setinventorySettings({ ...inventorySettings, currency: option.value });
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
                                                        <Button disabled={buttonLoadingContext} color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                            {buttonLoadingContext && <CircularProgress color="var(--primary)" width="15px" height="15px" duration="1s" />}
                                                            {!buttonLoadingContext && <span>Skip</span>}
                                                        </Button>
                                                    )}
                                                    <button disabled={buttonLoadingContext} class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                        {!buttonLoadingContext && <span>continue</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {isStepOptional(activeStep) && (
                                <Button disabled={buttonLoadingContext} color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    {buttonLoadingContext && <CircularProgress color="var(--primary)" width="15px" height="15px" duration="1s" />}
                                    {!buttonLoadingContext && <span>Skip</span>}
                                </Button>
                            )}
                            <button disabled={buttonLoadingContext} class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && (
                                    <span style={{ fontSize: '14px' }} className="text-uppercase">
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </span>
                                )}
                            </button>

                            {/* <Button disabled={buttonLoadingContext} onClick={handleNext}>
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</span>}
                            </Button> */}
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </div>
    );
};
export default AddMerchant;
