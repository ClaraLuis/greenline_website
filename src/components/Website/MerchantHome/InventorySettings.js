import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaCheck, FaLayerGroup, FaPlus } from 'react-icons/fa';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import Select from 'react-select';
// Icons
import API from '../../../API/API.js';
import ImportNewItem from '../InventoryItems/ImportNewItem.js';
import { FiCheckCircle } from 'react-icons/fi';
import Pagination from '../../Pagination.js';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { DateRangePicker } from 'rsuite';

import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import SelectComponent from '../../SelectComponent.js';
import { NotificationManager } from 'react-notifications';
import { IoMdTime } from 'react-icons/io';
import Decimal from 'decimal.js';
import Cookies from 'universal-cookie';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';

const { ValueContainer, Placeholder } = components;

const InventorySettings = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { dateformatter, inventoryRentTypeContext, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        fetchTransactions,
        findOneMerchant,
        useLazyQueryGQL,
        fetchRacks,
        paginateBoxes,
        paginatePallets,
        removeMerchantAssignmentFromInventory,
        useMutationGQL,
        inventoryRentSummary,
        fetchMerchants,
        updateInventoryRent,
        createInventoryRent,
        paginateInventoryRentTransaction,
    } = API();
    const [importItemModel, setimportItemModel] = useState(false);
    const [inventorySettings, setinventorySettings] = useState({
        startDate: new Date().toISOString().split('T')[0],
        currency: 'EGP',
    });

    const [fetchRacksQuery, setfetchRacksQuery] = useState(null);
    const [fetchBoxesQuery, setfetchBoxesQuery] = useState(null);
    const [sumInventoryRent, setsumInventoryRent] = useState(null);
    const [fetchPalletsQuery, setfetchPalletsQuery] = useState(null);
    const [inventoryRentSummaryData, setinventoryRentSummaryData] = useState(null);

    const [idsToBeRemoved, setidsToBeRemoved] = useState({
        rackIds: undefined,
        palletIds: undefined,
        boxIds: undefined,
    });

    const { lang, langdetect } = useContext(LanguageContext);

    const [filterSentTransactionsObj, setfilterSentTransactionsObj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: [parseInt(queryParameters.get('merchantId'))],
    });

    const fetchSenttTransactionsQuery = useQueryGQL('', paginateInventoryRentTransaction(), filterSentTransactionsObj);
    const [findOneMerchantQuery] = useLazyQueryGQL(findOneMerchant());
    const [fetchRacksLazyQuery] = useLazyQueryGQL(fetchRacks());
    const [paginateBoxesLazyQuery] = useLazyQueryGQL(paginateBoxes());
    const [paginatePalletsLazyQuery] = useLazyQueryGQL(paginatePallets());
    const [inventoryRentSummaryLazyQuery] = useLazyQueryGQL(inventoryRentSummary());

    const [createInventoryRentMutation] = useMutationGQL(createInventoryRent(), {
        startDate: inventorySettings?.startDate,
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        type: inventorySettings?.type,
        sqaureMeter: inventorySettings?.sqaureMeter,
        merchantId: parseInt(queryParameters.get('merchantId')),
    });

    const [updateInventoryRentMutation] = useMutationGQL(updateInventoryRent(), {
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        squareMeter: inventorySettings?.sqaureMeter,
        merchantId: parseInt(queryParameters.get('merchantId')),
    });

    const [removeMerchantAssignmentFromInventoryMutation] = useMutationGQL(removeMerchantAssignmentFromInventory(), {
        rackIds: idsToBeRemoved?.rackIds,
        palletIds: idsToBeRemoved?.palletIds,
        boxIds: idsToBeRemoved?.boxIds,
    });

    const findOneMerchantFunction = async () => {
        try {
            var lastbill = undefined;
            var { data } = await findOneMerchantQuery({
                variables: {
                    id: parseInt(queryParameters?.get('merchantId')),
                },
            });
            if (data?.findOneMerchant) {
                // alert(data?.findOneMerchant?.inventoryRent);
                if (data?.findOneMerchant?.inventoryRent != null) {
                    setinventorySettings({
                        ...data?.findOneMerchant,
                        type: data?.findOneMerchant?.inventoryRent?.type,
                        createdAt: data?.findOneMerchant?.inventoryRent?.createdAt,
                        currency: data?.findOneMerchant?.inventoryRent?.currency,
                        lastBill: data?.findOneMerchant?.inventoryRent?.lastBill,
                        lastModified: data?.findOneMerchant?.inventoryRent?.lastModified,
                        pricePerUnit: data?.findOneMerchant?.inventoryRent?.pricePerUnit,
                        sqaureMeter: data?.findOneMerchant?.inventoryRent?.sqaureMeter,
                        startDate: data?.findOneMerchant?.inventoryRent?.startDate,
                        functype: 'edit',
                    });
                } else {
                    setinventorySettings({ ...inventorySettings, functype: 'add' });
                }

                lastbill = data?.findOneMerchant?.inventoryRent?.lastBill;
                if (data?.findOneMerchant?.inventoryRent?.type == 'rack') {
                    var { data } = await fetchRacksLazyQuery({
                        variables: {
                            input: {
                                limit: 50,
                                merchantId: parseInt(queryParameters.get('merchantId')),
                            },
                        },
                    });
                    setfetchRacksQuery(data);
                } else if (data?.findOneMerchant?.inventoryRent?.type == 'box') {
                    var { data } = await paginateBoxesLazyQuery({
                        variables: {
                            input: {
                                limit: 50,
                                merchantId: parseInt(queryParameters.get('merchantId')),
                            },
                        },
                    });
                    setfetchBoxesQuery(data);
                } else if (data?.findOneMerchant?.inventoryRent?.type == 'pallet') {
                    var { data } = await paginatePalletsLazyQuery({
                        variables: {
                            input: {
                                limit: 50,
                                merchantId: parseInt(queryParameters.get('merchantId')),
                            },
                        },
                    });
                    setfetchPalletsQuery(data);
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
        }
    };

    useEffect(async () => {
        var { data } = await inventoryRentSummaryLazyQuery({
            variables: {
                input: {
                    startDate: filterSentTransactionsObj?.startDate ?? undefined,
                    endDate: filterSentTransactionsObj?.endDate ?? undefined,
                    merchantIds: [parseInt(queryParameters.get('merchantId'))],
                },
            },
        });
        // alert(JSON.stringify(data?.inventoryRentSummary));
        setfilterSentTransactionsObj({
            startDate: data?.inventoryRentSummary?.startDate,
            endDate: data?.inventoryRentSummary?.endDate,
        });
        setinventoryRentSummaryData(data?.inventoryRentSummary?.data[0]);
    }, [filterSentTransactionsObj?.startDate, filterSentTransactionsObj?.endDate, parseInt(queryParameters.get('merchantId'))]);

    useEffect(async () => {
        if (queryParameters.get('merchantId')) {
            findOneMerchantFunction();
            setfilterSentTransactionsObj({
                isAsc: false,
                limit: 20,
                afterCursor: undefined,
                beforeCursor: undefined,
                merchantIds: [parseInt(queryParameters.get('merchantId'))],
            });
        }
    }, [queryParameters.get('merchantId')]);
    const formatDate = (isoDate) => {
        return isoDate.split('T')[0];
    };

    const toggleSelection = (type, id) => {
        setidsToBeRemoved((prevState) => {
            const ids = prevState[`${type}Ids`];
            const isSelected = ids.includes(id);

            return {
                ...prevState,
                [`${type}Ids`]: isSelected ? ids.filter((itemId) => itemId !== id) : [...ids, id],
            };
        });
    };

    const dateformatterDayAndMonth = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'long' });
        return `${day} ${month}`;
    };

    const getFirstDayOfNextMonth = () => {
        const today = new Date();
        const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const year = firstDayNextMonth.getFullYear();
        const month = String(firstDayNextMonth.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(firstDayNextMonth.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    return (
        <>
            {!queryParameters.get('merchantId') && (
                <div class="col-lg-12 p-0">
                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                        <MerchantSelectComponent
                            type="single"
                            label={'name'}
                            value={'id'}
                            onClick={(option) => {
                                history.push('/inventorysettings?merchantId=' + option.id);
                            }}
                        />
                    </div>
                </div>
            )}
            <div class="col-lg-12 px-3">
                {inventorySettings?.functype == 'edit' && cookies.get('userInfo')?.type == 'merchant' && (
                    <div class="row m-0 w-100">
                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 pt-4 px-3'}>
                            <div class="row m-0 w-100">
                                <div class="row m-0 w-100 mb-2 p-2 pt-4 px-3">
                                    <div class="col-lg-6 mb-3">
                                        <label class={formstyles.form__label}>Rent Type</label>
                                        <p>{inventorySettings?.type || 'N/A'}</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <label class={formstyles.form__label}>Start Date</label>
                                        <p>{inventorySettings?.startDate ? formatDate(inventorySettings.startDate) : 'N/A'}</p>
                                    </div>

                                    {inventorySettings?.type === 'meter' && (
                                        <div class="col-lg-6">
                                            <label class={formstyles.form__label}>Square Meter</label>
                                            <p>
                                                {inventorySettings?.sqaureMeter || 'N/A'} {inventorySettings?.currency}
                                            </p>
                                        </div>
                                    )}
                                    <div class="col-lg-6">
                                        <label class={formstyles.form__label}>
                                            {inventorySettings?.type === 'item'
                                                ? 'Price Per Item'
                                                : inventorySettings?.type === 'order'
                                                ? 'Price Per Order'
                                                : inventorySettings?.type === 'meter'
                                                ? 'Price Per Meter'
                                                : 'Price Per Unit Per Month'}
                                        </label>
                                        <p>
                                            {inventorySettings?.pricePerUnit || 'N/A'} {inventorySettings?.currency}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {inventorySettings?.functype == 'add' && cookies.get('userInfo')?.type == 'merchant' && (
                    <div class="row m-0 w-100">
                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 pt-4 px-3 allcentered'}>You have no inventory rent</div>
                    </div>
                )}
            </div>
            <div class="col-lg-12 px-3">
                <div style={{ borderRadius: '0.25rem', background: 'white' }} class={generalstyles.card + ' col-lg-12'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true} preExpanded={['import-instructions']}>
                        <AccordionItem
                            uuid="import-instructions" // Unique ID for this accordion item
                            class={`${generalstyles.innercard}` + '  p-2'}
                        >
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>
                                                Filter:{' '}
                                                <AccordionItemState>
                                                    {(state) => {
                                                        if (state.expanded == true) {
                                                            return (
                                                                <>
                                                                    {dateformatterDayAndMonth(filterSentTransactionsObj?.startDate) ?? ''} -{' '}
                                                                    {dateformatterDayAndMonth(filterSentTransactionsObj?.endDate) ?? ''}
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    {dateformatterDayAndMonth(filterSentTransactionsObj?.startDate) ?? ''} -{' '}
                                                                    {dateformatterDayAndMonth(filterSentTransactionsObj?.endDate) ?? ''}
                                                                </>
                                                            );
                                                        }
                                                    }}
                                                </AccordionItemState>
                                            </p>
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
                                <div class="row m-0 w-100">
                                    <div class=" col-lg-3 mb-md-2">
                                        <span>Date Range</span>
                                        <div class="mt-1" style={{ width: '100%' }}>
                                            <DateRangePicker
                                                // disabledDate={allowedMaxDays(30)}
                                                value={[
                                                    filterSentTransactionsObj?.startDate ? new Date(filterSentTransactionsObj.startDate) : null,
                                                    filterSentTransactionsObj?.endDate ? new Date(filterSentTransactionsObj.endDate) : null,
                                                ]}
                                                onChange={(event) => {
                                                    if (event != null) {
                                                        const start = event[0];
                                                        const startdate = new Date(start);
                                                        const year1 = startdate.getFullYear();
                                                        const month1 = startdate.getMonth() + 1; // Months are zero-indexed
                                                        const day1 = startdate.getDate();

                                                        const end = event[1];
                                                        const enddate = new Date(end);
                                                        const year2 = enddate.getFullYear();
                                                        const month2 = enddate.getMonth() + 1; // Months are zero-indexed
                                                        const day2 = enddate.getDate();
                                                        setfilterSentTransactionsObj({ ...filterSentTransactionsObj, startDate: event[0], endDate: event[1] });
                                                    }
                                                }}
                                                onClean={() => {
                                                    setfilterSentTransactionsObj({ ...filterSentTransactionsObj, startDate: null, endDate: null });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            {queryParameters.get('merchantId') && (
                <>
                    <div class="col-lg-12 p-0">
                        <div class="row m-0 w-100">
                            <div class="col-lg-5">
                                <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                                    <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                        Total Cost
                                    </div>
                                    <div class="col-lg-12">
                                        <span style={{ fontWeight: 800, fontSize: '23px' }}>
                                            {inventoryRentSummaryData?.sum} {inventoryRentSummaryData?.currency}{' '}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                                    <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                        Inventory Rent Count
                                    </div>
                                    <div class="col-lg-12">
                                        <span style={{ fontWeight: 800, fontSize: '23px' }}>{inventoryRentSummaryData?.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                            <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                                <p class=" p-0 m-0 text-uppercase" style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'var(--info)' }}>Transactions</span>
                                </p>
                            </div>

                            <>
                                <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                    {!props?.query?.loading && fetchSenttTransactionsQuery != undefined && fetchSenttTransactionsQuery && (
                                        <>
                                            {fetchSenttTransactionsQuery.data?.paginateInventoryRentTransaction?.data?.length == 0 && (
                                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                                    <div class="row m-0 w-100">
                                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                            {props?.srctype == 'expenses' ? 'No Expenses' : 'No Transactions'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {fetchSenttTransactionsQuery.data?.paginateInventoryRentTransaction?.data?.length != 0 && (
                                                <div class="row m-0 w-100">
                                                    <div class="col-lg-12 p-0 mb-3">
                                                        <Pagination
                                                            beforeCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.beforeCursor}
                                                            afterCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.afterCursor}
                                                            filter={filterSentTransactionsObj}
                                                            setfilter={setfilterSentTransactionsObj}
                                                        />
                                                    </div>
                                                    {fetchSenttTransactionsQuery.data?.paginateInventoryRentTransaction?.data?.map((item, index) => {
                                                        return (
                                                            <div
                                                                style={{ fontSize: '13px', cursor: props?.allowSelect ? 'pointer' : '', position: 'relative', padding: 'auto' }}
                                                                onClick={() => {
                                                                    if (props?.allowSelect) {
                                                                        handleSelect(item);
                                                                    }
                                                                }}
                                                                className={'col-lg-4'}
                                                            >
                                                                <div class={generalstyles.card + ' p-2 px-3 row m-0 w-100 allcentered'}>
                                                                    <div className="col-lg-3 p-0">
                                                                        <span style={{ fontWeight: 700, fontSize: '16px' }} class=" d-flex align-items-center">
                                                                            {/* <FaMoneyBill class="mr-1" /> */}
                                                                            {new Decimal(item?.quantity ?? 0).times(inventorySettings?.pricePerUnit ?? 0).toFixed(2)}
                                                                            {inventorySettings?.currency}
                                                                        </span>
                                                                    </div>

                                                                    <div className="col-lg-9 p-0 d-flex justify-content-end align-items-center">
                                                                        <div class="row m-0 w-100 d-flex justify-content-end align-items-center">
                                                                            <div
                                                                                style={{ color: 'white' }}
                                                                                className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                            >
                                                                                {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="col-lg-12 p-0 mt-2">
                                                                        <div class="row m-0 w-100 justify-content-end">
                                                                            <div className="col-lg-12 p-0 mb-1 d-flex justify-content-end">
                                                                                <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                                                                    <IoMdTime class="mr-1" />
                                                                                    {dateformatter(item?.createdAt)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* )} */}
                                                                    {/* <div class="col-lg-12 p-0 allcentered">
                                                {item?.toAccount?.id == props?.accountId && (
                                                    <button
                                                        onClick={() => {
                                                            setstatuspayload({ ...statuspayload, id: item?.id });
                                                            setchangestatusmodal(true);
                                                        }}
                                                        style={{
                                                            height: '25px',
                                                            fontSize: '12px',
                                                            width: 'fit-content',
                                                        }}
                                                        class={generalstyles.roundbutton + '  mr-2 my-3 py-0 px-0'}
                                                    >
                                                        Update status
                                                    </button>
                                                )}
                                                {item?.fromAccount?.id == props?.accountId && item?.status == 'pendingReceiver' && (
                                                    <button
                                                        onClick={async () => {
                                                            await setstatuspayload({ ...statuspayload, id: item?.id, status: 'cancel' });
                                                            if (window.confirm('Are you sure you want to cancel this transaction')) {
                                                                if (isAuth([1, 51])) {
                                                                    var { data } = await updateAnyFinancialTransactionMutation();
                                                                } else {
                                                                    var { data } = await updateMyFinancialTransactionMutation();
                                                                }
                                                                if (data?.updateAnyFinancialTransaction?.success) {
                                                                    props?.refetchFunc();
                                                                } else {
                                                                    NotificationManager.warning(data?.updateAnyFinancialTransaction?.message, 'Warning!');
                                                                }
                                                            }
                                                        }}
                                                        class={generalstyles.roundbutton + '  mr-2 my-3 bg-danger bg-dangerhover '}
                                                    >
                                                        Cancel transaction
                                                    </button>
                                                )}
                                            </div> */}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <div class="col-lg-12 p-0 mb-3">
                                                        <Pagination
                                                            beforeCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.beforeCursor}
                                                            afterCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.afterCursor}
                                                            filter={filterSentTransactionsObj}
                                                            setfilter={setfilterSentTransactionsObj}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        </div>
                        {inventorySettings?.functype == 'edit' && cookies.get('userInfo')?.type != 'merchant' && (
                            <div class="row m-0 w-100">
                                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 pt-4 px-3'}>
                                    <div class={'col-lg-6 mb-3'}>
                                        <label for="name" class={formstyles.form__label}>
                                            Rent Type
                                        </label>
                                        <Select
                                            isDisabled={inventorySettings?.functype == 'edit'}
                                            options={inventoryRentTypeContext}
                                            styles={defaultstyles}
                                            value={inventoryRentTypeContext.filter((option) => option.value == inventorySettings?.type)}
                                            onChange={(option) => {
                                                setinventorySettings({ ...inventorySettings, type: option.value });
                                            }}
                                        />
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Start Date</label>
                                                <input
                                                    disabled={inventorySettings?.functype == 'edit'}
                                                    type={'date'}
                                                    class={formstyles.form__field}
                                                    value={inventorySettings.startDate ? formatDate(inventorySettings.startDate) : ''}
                                                    onChange={(event) => {
                                                        setinventorySettings({ ...inventorySettings, startDate: event.target.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
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
                                                    isDisabled={inventorySettings?.functype == 'edit'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {inventorySettings?.type == 'meter' && (
                                        <div class="col-lg-6">
                                            <div class="row m-0 w-100  ">
                                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                    <label class={formstyles.form__label}>Sqaure Meter</label>
                                                    <input
                                                        type={'number'}
                                                        disabled={inventorySettings?.functype == 'edit' && cookies.get('userInfo')?.type == 'merchant'}
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
                                    <div class="col-lg-6">
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
                                                    disabled={inventorySettings?.functype == 'edit' && cookies.get('userInfo')?.type == 'merchant'}
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
                                    {inventorySettings?.functype == 'edit' && cookies.get('userInfo')?.type != 'merchant' && (
                                        <div class={'col-lg-12 d-flex justify-content-center mt-5'}>
                                            <button
                                                disabled={buttonLoadingContext}
                                                class={generalstyles.roundbutton + ' allcentered'}
                                                onClick={async () => {
                                                    if (buttonLoadingContext) return;
                                                    setbuttonLoadingContext(true);
                                                    try {
                                                        if (
                                                            inventorySettings?.type &&
                                                            inventorySettings?.type?.length != 0 &&
                                                            inventorySettings?.startDate &&
                                                            inventorySettings?.startDate?.length != 0 &&
                                                            inventorySettings?.currency &&
                                                            inventorySettings?.currency?.length != 0 &&
                                                            inventorySettings?.pricePerUnit &&
                                                            inventorySettings?.pricePerUnit?.length != 0
                                                        ) {
                                                            if (inventorySettings?.functype == 'add') {
                                                                const { data } = await createInventoryRentMutation();
                                                                if (data?.createInventoryRent?.success) {
                                                                    findOneMerchantFunction();
                                                                    NotificationManager.success('', 'Success');
                                                                } else {
                                                                    NotificationManager.warning('', 'Warning');
                                                                }
                                                            } else if (inventorySettings?.functype == 'edit') {
                                                                const { data } = await updateInventoryRentMutation();
                                                                if (data?.updateInventoryRent?.success) {
                                                                    findOneMerchantFunction();
                                                                    NotificationManager.success('', 'Success');
                                                                } else {
                                                                    NotificationManager.warning('', 'Warning');
                                                                }
                                                            }
                                                        } else {
                                                            NotificationManager.warning('Please Complete all fields', 'Warning');
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
                                                style={{ padding: '0px' }}
                                            >
                                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                {!buttonLoadingContext && <span>{inventorySettings?.functype == 'add' ? 'Add' : 'Edit'}</span>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {(inventorySettings?.type == 'rack' || inventorySettings?.type == 'box' || inventorySettings?.type == 'pallet') && (
                        <div class="col-lg-12 p-0 d-flex align-items-center justify-content-end">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + ' allcentered p-0'}
                                onClick={async () => {
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    try {
                                        const { data } = await removeMerchantAssignmentFromInventoryMutation();
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
                                {!buttonLoadingContext && <span>Remove</span>}
                            </button>
                        </div>
                    )}

                    {inventorySettings?.type == 'rack' && (
                        <div className="col-lg-12 p-0">
                            {fetchRacksQuery?.loading && (
                                <div style={{ height: '70vh' }} className="row w-100 allcentered m-0">
                                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                </div>
                            )}
                            {fetchRacksQuery?.paginateRacks != undefined && (
                                <>
                                    {fetchRacksQuery?.paginateRacks?.data?.length === 0 && (
                                        <div style={{ height: '70vh' }} className="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div className="row m-0 w-100">
                                                <FaLayerGroup size={40} className=" col-lg-12" />
                                                <div className="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No Racks
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row w-100 allcentered m-0">
                                        {fetchRacksQuery?.paginateRacks?.data?.map((item) => {
                                            const isSelected = idsToBeRemoved.rackIds.includes(item.id);

                                            return (
                                                <div key={item.id} className="col-lg-6 mb-2" onClick={() => toggleSelection('rack', item.id)}>
                                                    <div
                                                        className="row m-0 w-100 p-2"
                                                        style={{
                                                            border: '1px solid #eee',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '12px',
                                                            background: isSelected ? 'var(--secondary)' : 'transparent',
                                                        }}
                                                    >
                                                        <div className="col-lg-12 p-0">
                                                            <div className="row m-0 w-100 d-flex align-items-center">
                                                                <div className="col-lg-6 p-0" style={{ fontWeight: 700 }}>
                                                                    Rack {item.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {inventorySettings?.type == 'box' && (
                        <div className="col-lg-12 p-0">
                            {fetchBoxesQuery?.loading && (
                                <div style={{ height: '70vh' }} className="row w-100 allcentered m-0">
                                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                </div>
                            )}
                            {fetchBoxesQuery?.paginateBoxes != undefined && (
                                <>
                                    {fetchBoxesQuery?.paginateBoxes?.data?.length === 0 && (
                                        <div style={{ height: '70vh' }} className="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div className="row m-0 w-100">
                                                <FaLayerGroup size={40} className=" col-lg-12" />
                                                <div className="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No Boxes
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row w-100 allcentered m-0">
                                        {fetchBoxesQuery?.paginateBoxes?.data?.map((item) => {
                                            const isSelected = idsToBeRemoved.boxIds.includes(item.id);

                                            return (
                                                <div key={item.id} className="col-lg-6 mb-2" onClick={() => toggleSelection('box', item.id)}>
                                                    <div
                                                        className="row m-0 w-100 p-2"
                                                        style={{
                                                            border: '1px solid #eee',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '12px',
                                                            background: isSelected ? 'var(--secondary)' : 'transparent',
                                                        }}
                                                    >
                                                        <div className="col-lg-12 p-0">
                                                            <div className="row m-0 w-100 d-flex align-items-center">
                                                                <div className="col-lg-6 p-0" style={{ fontWeight: 700 }}>
                                                                    {item.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {inventorySettings?.type == 'pallet' && (
                        <div className="col-lg-12 p-0">
                            {fetchPalletsQuery?.loading && (
                                <div style={{ height: '70vh' }} className="row w-100 allcentered m-0">
                                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                </div>
                            )}
                            {fetchPalletsQuery?.paginatePallets != undefined && (
                                <>
                                    {fetchPalletsQuery?.paginatePallets?.data?.length === 0 && (
                                        <div style={{ height: '70vh' }} className="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div className="row m-0 w-100">
                                                <FaLayerGroup size={40} className=" col-lg-12" />
                                                <div className="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No Pallets
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row w-100 allcentered m-0">
                                        {fetchPalletsQuery?.paginatePallets?.data?.map((item) => {
                                            const isSelected = idsToBeRemoved.palletIds.includes(item.id);

                                            return (
                                                <div key={item.id} className="col-lg-6 mb-2" onClick={() => toggleSelection('pallet', item.id)}>
                                                    <div
                                                        className="row m-0 w-100 p-2"
                                                        style={{
                                                            border: '1px solid #eee',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '12px',
                                                            background: isSelected ? 'var(--secondary)' : 'transparent',
                                                        }}
                                                    >
                                                        <div className="col-lg-12 p-0">
                                                            <div className="row m-0 w-100 d-flex align-items-center">
                                                                <div className="col-lg-6 p-0" style={{ fontWeight: 700 }}>
                                                                    {item.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};
export default InventorySettings;
