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

const AddMerchant = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, inventoryRentTypesContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, createMerchantDomesticShipping, updateMerchantDomesticShipping, fetchMerchants, addMerchant, createInventoryRent } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];

    const { lang, langdetect } = useContext(LanguageContext);
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

    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());
    const [createMerchantDomesticShippingMutation] = useMutationGQL(createMerchantDomesticShipping(), {
        merchantId: merchantId,
        list: governoratesItemsList,
    });
    const [updateMerchantDomesticShippingMutation] = useMutationGQL(updateMerchantDomesticShipping(), {
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
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchMerchants } = useQueryGQL('', fetchMerchants(), filterMerchants);

    const [addMerchantMutation] = useMutationGQL(addMerchant(), {
        name: merchantPayload?.name,
        includesVat: merchantPayload?.includesVat,
        currency: merchantPayload?.currency,
        threshold: merchantPayload?.threshold,
        overShipping: merchantPayload?.overShipping,
    });

    const [createInventoryRentMutation] = useMutationGQL(createInventoryRent(), {
        startDate: inventorySettings?.startDate,
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        type: inventorySettings?.type,
        sqaureMeter: inventorySettings?.sqaureMeter,
        merchantId: merchantId,
    });

    useEffect(() => {
        if (fetchGovernoratesQuery?.data) {
            var temp = [];
            fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.map((item, index) => {
                temp.push({
                    name: item.name,
                    id: item.id,
                    shipping: 50,
                    base: 20,
                    vat: 0.14,
                });
            });
            setgovernoratesItems([...temp]);
        }
    }, [fetchGovernoratesQuery?.data]);

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return step === 1 || step === 2;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = async () => {
        if (activeStep == 0) {
            if (merchantPayload?.name?.length == 0) {
                NotificationManager.warning('Name Can not be empty', 'Warning');
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } else if (activeStep == 1) {
            if (merchantPayload?.name?.length == 0) {
                NotificationManager.warning('Name Can not be empty', 'Warning');
            } else {
                try {
                    const { data } = await addMerchantMutation();

                    await setmerchantId(data?.createMerchant);
                    var temp = [];
                    await governoratesItems?.map((item, index) => {
                        temp.push({
                            govId: item.id,
                            total: item.shipping,
                            vatDecimal: item.vat,
                            base: item.base,
                            extra: parseFloat(item.shipping) - (parseFloat(item.base) + parseFloat(item.shipping) * 0.14),
                        });
                    });
                    await setgovernoratesItemsList([...temp]);
                    // if (queryParameters?.get('type') == 'add') {
                    await createMerchantDomesticShippingMutation();

                    // } else {
                    //     var { data } = await updateMerchantDomesticShippingMutation();
                    //     if (data?.updateMerchantDomesticShipping?.success) {
                    //         NotificationManager.success('', 'Success!');
                    //     } else {
                    //         NotificationManager.warning(data?.updateMerchantDomesticShipping?.message, 'Warning!');
                    //     }
                    // }
                    refetchMerchants();
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
            }
        } else if (activeStep == 2) {
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
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = async () => {
        if (activeStep == 1) {
            const { data } = await addMerchantMutation();
            await setmerchantId(data?.createMerchant);
        } else if (activeStep == 2) {
            history.push('/merchants');
        }

        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
                                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    Skip
                                </Button>
                            )}

                            <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
                        </Box>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                                {activeStep === 0 && (
                                    <div class={' row m-0 w-100 allcentered'}>
                                        <div class="col-lg-6">
                                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '100px 100px' }}>
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
                                                <div class={'col-lg-12'}>
                                                    <label for="name" class={formstyles.form__label}>
                                                        Includes VAT
                                                    </label>
                                                    <Select
                                                        options={[
                                                            { label: 'Includes VAT', value: true },
                                                            { label: 'Does not incluse VAT', value: false },
                                                        ]}
                                                        styles={defaultstyles}
                                                        value={[
                                                            { label: 'Includes VAT', value: true },
                                                            { label: 'Does not incluse VAT', value: false },
                                                        ].filter((option) => option.value == merchantPayload?.includesVat)}
                                                        onChange={(option) => {
                                                            setmerchantPayload({ ...merchantPayload, includesVat: option.value });
                                                        }}
                                                    />
                                                </div>
                                                <div class={'col-lg-12 d-flex justify-content-end mt-5'}>
                                                    <button class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                                        continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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
                                                            <th>Governorate</th>
                                                            <th>Shipping</th>
                                                            <th>VAT (14%)</th>
                                                            <th>Base</th>
                                                            <th>Extra</th>
                                                        </thead>
                                                        <tbody>
                                                            {governoratesItems?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item.name}</p>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type={'text'}
                                                                                class={formstyles.form__field}
                                                                                value={item.shipping}
                                                                                onChange={(event) => {
                                                                                    var governoratesItemsTemp = [...governoratesItems];
                                                                                    governoratesItemsTemp[index].shipping = event.target.value;
                                                                                    setgovernoratesItems([...governoratesItemsTemp]);
                                                                                }}
                                                                            />
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
                                                                                    {(parseFloat(item.shipping) * parseFloat(item.vat)).toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type={'text'}
                                                                                class={formstyles.form__field}
                                                                                value={item.base}
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
                                                                        <td>
                                                                            <p className={' m-0 p-0  h-100 d-flex align-items-center '}>
                                                                                {parseFloat(item.shipping) - (parseFloat(item.base) + parseFloat(item.shipping) * 0.14)}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* <div style={{ position: 'fixed', bottom: '2%', right: '2%' }}>
                                                <button
                                                    style={{ height: '35px' }}
                                                    class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                                    onClick={async () => {
                                                        var temp = [];
                                                        await governoratesItems?.map((item, index) => {
                                                            temp.push({
                                                                govId: item.id,
                                                                total: item.shipping,
                                                                vatDecimal: item.vat,
                                                                base: item.base,
                                                                extra: parseFloat(item.shipping) - (parseFloat(item.base) + parseFloat(item.shipping) * 0.14),
                                                            });
                                                        });
                                                        await setgovernoratesItemsList([...temp]);
                                                        if (queryParameters?.get('type') == 'add') {
                                                            var { data } = await createMerchantDomesticShippingMutation();
                                                            if (data?.createMerchantDomesticShipping?.success) {
                                                                NotificationManager.success('', 'Success!');
                                                            } else {
                                                                NotificationManager.warning(data?.createMerchantDomesticShipping?.message, 'Warning!');
                                                            }
                                                        } else {
                                                            var { data } = await updateMerchantDomesticShippingMutation();
                                                            if (data?.updateMerchantDomesticShipping?.success) {
                                                                NotificationManager.success('', 'Success!');
                                                            } else {
                                                                NotificationManager.warning(data?.updateMerchantDomesticShipping?.message, 'Warning!');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Submit
                                                </button>
                                            </div> */}
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
                                                        options={inventoryRentTypesContext}
                                                        styles={defaultstyles}
                                                        value={inventoryRentTypesContext.filter((option) => option.value == inventorySettings?.type)}
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
                                                                    : 'Price Per Unit Per Day'}
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
                                                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                            Skip
                                                        </Button>
                                                    )}
                                                    <button class={generalstyles.roundbutton + ' allcentered'} onClick={handleNext} style={{ padding: '0px' }}>
                                                        continue
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
