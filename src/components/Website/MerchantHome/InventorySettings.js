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
import TransactionsTable from '../Finance/TransactionsTable.js';

import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
const { ValueContainer, Placeholder } = components;

const InventorySettings = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        fetchTransactions,
        findOneMerchant,
        useLazyQueryGQL,
        fetchRacks,
        paginateBoxes,
        paginateBallots,
        sumInventoryRentTransaction,
        removeMerchantAssignmentFromInventory,
        useMutationGQL,
        countInventoryRentTransaction,
    } = API();
    const [importItemModel, setimportItemModel] = useState(false);
    const [inventorySettings, setinventorySettings] = useState({});
    const [buttonLoading, setbuttonLoading] = useState(false);

    const [fetchRacksQuery, setfetchRacksQuery] = useState(null);
    const [fetchBoxesQuery, setfetchBoxesQuery] = useState(null);
    const [sumInventoryRent, setsumInventoryRent] = useState(null);
    const [fetchBallotsQuery, setfetchBallotsQuery] = useState(null);
    const [countInventoryRent, setcountInventoryRent] = useState(null);

    const [idsToBeRemoved, setidsToBeRemoved] = useState({
        rackIds: undefined,
        ballotIds: undefined,
        boxIds: undefined,
    });

    const { lang, langdetect } = useContext(LanguageContext);

    const [filterSentTransactionsObj, setfilterSentTransactionsObj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        type: 'inventoryRent',
    });

    const fetchSenttTransactionsQuery = useQueryGQL('', fetchTransactions(), filterSentTransactionsObj);
    const [findOneMerchantQuery] = useLazyQueryGQL(findOneMerchant());
    const [fetchRacksLazyQuery] = useLazyQueryGQL(fetchRacks());
    const [paginateBoxesLazyQuery] = useLazyQueryGQL(paginateBoxes());
    const [paginateBallotsLazyQuery] = useLazyQueryGQL(paginateBallots());
    const [sumInventoryRentTransactionLazyQuery] = useLazyQueryGQL(sumInventoryRentTransaction());
    const [countInventoryRentTransactionLazyQuery] = useLazyQueryGQL(countInventoryRentTransaction());

    const [removeMerchantAssignmentFromInventoryMutation] = useMutationGQL(removeMerchantAssignmentFromInventory(), {
        rackIds: idsToBeRemoved?.rackIds,
        ballotIds: idsToBeRemoved?.ballotIds,
        boxIds: idsToBeRemoved?.boxIds,
    });

    useEffect(async () => {
        try {
            var lastbill = undefined;
            var { data } = await findOneMerchantQuery({
                variables: {
                    id: parseInt(queryParameters?.get('merchantId')),
                },
            });
            if (data?.findOneMerchant) {
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
                });
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
                } else if (data?.findOneMerchant?.inventoryRent?.type == 'ballot') {
                    var { data } = await paginateBallotsLazyQuery({
                        variables: {
                            input: {
                                limit: 50,
                                merchantId: parseInt(queryParameters.get('merchantId')),
                            },
                        },
                    });
                    setfetchBallotsQuery(data);
                } else if (data?.findOneMerchant?.inventoryRent?.type == 'item') {
                    var { data } = await sumInventoryRentTransactionLazyQuery({
                        variables: {
                            input: {
                                merchantId: parseInt(queryParameters.get('merchantId')),
                                afterDate: lastbill ?? undefined,
                            },
                        },
                    });
                    setsumInventoryRent(data?.sumInventoryRentTransaction);
                    // setfetchBallotsQuery(data);
                    // alert(JSON.stringify(data?.sumInventoryRentTransaction));
                }

                var { data } = await countInventoryRentTransactionLazyQuery({
                    variables: {
                        input: {
                            merchantId: parseInt(queryParameters.get('merchantId')),
                            afterDate: lastbill ?? undefined,
                        },
                    },
                });
                setcountInventoryRent(data?.countInventoryRentTransaction);
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
    const formatDate = (isoDate) => {
        return isoDate.split('T')[0];
    };

    const toggleSelection = (type, id) => {
        setIdsToBeRemoved((prevState) => {
            const ids = prevState[`${type}Ids`];
            const isSelected = ids.includes(id);

            return {
                ...prevState,
                [`${type}Ids`]: isSelected ? ids.filter((itemId) => itemId !== id) : [...ids, id],
            };
        });
    };

    return (
        <>
            <div class="col-lg-12 p-0">
                <div class="row m-0 w-100">
                    {inventorySettings?.type == 'item' && (
                        <div class="col-lg-4">
                            <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                                <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                    Inventory Rent Transactions
                                </div>
                                <div class="col-lg-12">
                                    <span style={{ fontWeight: 800, fontSize: '23px' }}>{sumInventoryRent}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div class="col-lg-4">
                        <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                            <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                Inventory Rent Count
                            </div>
                            <div class="col-lg-12">
                                <span style={{ fontWeight: 800, fontSize: '23px' }}>{countInventoryRent}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                    <p class=" p-0 m-0 text-uppercase" style={{ fontSize: '15px' }}>
                        <span style={{ color: 'var(--info)' }}>Transactions</span>
                    </p>
                </div>
                <>
                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchSenttTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.beforeCursor}
                            afterCursor={fetchSenttTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.afterCursor}
                            filter={filterSentTransactionsObj}
                            setfilter={setfilterSentTransactionsObj}
                        />
                    </div>
                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable
                            width={'50%'}
                            query={fetchSenttTransactionsQuery}
                            paginationAttr="paginateFinancialTransaction"
                            srctype="courierCollection"
                            // accountId={queryParameters.get('accountId')}
                            refetchFunc={() => {
                                Refetch();
                            }}
                        />
                    </div>
                </>
            </div>
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
                        <div class="col-lg-6">
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
                    <div class={'col-lg-12 d-flex justify-content-center mt-5'}>
                        <button
                            disabled={buttonLoading}
                            class={generalstyles.roundbutton + ' allcentered'}
                            onClick={async () => {
                                setbuttonLoading(true);
                                try {
                                    if (
                                        inventorySettings?.type &&
                                        inventorySettings?.type?.length != 0 &&
                                        inventorySettings?.startDate &&
                                        inventorySettings?.startDate?.length != 0 &&
                                        inventorySettings?.merchantId &&
                                        inventorySettings?.merchantId?.length != 0 &&
                                        inventorySettings?.currency &&
                                        inventorySettings?.currency?.length != 0 &&
                                        inventorySettings?.pricePerUnit &&
                                        inventorySettings?.pricePerUnit?.length != 0
                                    ) {
                                        if (inventorySettings?.functype == 'add') {
                                            const { data } = await createInventoryRentMutation();
                                            refetchMerchants();
                                            setinventoryModal(false);
                                        } else if (inventorySettings?.functype == 'edit') {
                                            const { data } = await updateInventoryRentMutation();
                                            refetchMerchants();
                                            setinventoryModal(false);
                                        }
                                        NotificationManager.success('', 'Success');
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
                                setbuttonLoading(false);
                            }}
                            style={{ padding: '0px' }}
                        >
                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoading && <span>{inventorySettings?.functype == 'add' ? 'Add' : 'Edit'}</span>}
                        </button>
                    </div>
                </div>
            </div>
            {(inventorySettings?.type == 'rack' || inventorySettings?.type == 'box' || inventorySettings?.type == 'ballot') && (
                <div class="col-lg-12 p-0 d-flex align-items-center justify-content-end">
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + ' allcentered p-0'}
                        onClick={async () => {
                            setbuttonLoading(true);
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
                            setbuttonLoading(false);
                        }}
                    >
                        {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                        {!buttonLoading && <span>Remove</span>}
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
                                                    borderRadius: '15px',
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
                                                    borderRadius: '15px',
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

            {inventorySettings?.type == 'ballot' && (
                <div className="col-lg-12 p-0">
                    {fetchBallotsQuery?.loading && (
                        <div style={{ height: '70vh' }} className="row w-100 allcentered m-0">
                            <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                        </div>
                    )}
                    {fetchBallotsQuery?.paginateBallots != undefined && (
                        <>
                            {fetchBallotsQuery?.paginateBallots?.data?.length === 0 && (
                                <div style={{ height: '70vh' }} className="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div className="row m-0 w-100">
                                        <FaLayerGroup size={40} className=" col-lg-12" />
                                        <div className="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            No Ballots
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row w-100 allcentered m-0">
                                {fetchBallotsQuery?.paginateBallots?.data?.map((item) => {
                                    const isSelected = idsToBeRemoved.ballotIds.includes(item.id);

                                    return (
                                        <div key={item.id} className="col-lg-6 mb-2" onClick={() => toggleSelection('ballot', item.id)}>
                                            <div
                                                className="row m-0 w-100 p-2"
                                                style={{
                                                    border: '1px solid #eee',
                                                    borderRadius: '15px',
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
    );
};
export default InventorySettings;
