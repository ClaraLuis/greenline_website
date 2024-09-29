import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { components } from 'react-select';

import Select from 'react-select';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import API from '../../../API/API.js';
import TransactionsTable from '../Finance/TransactionsTable.js';

import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import SelectComponent from '../../SelectComponent.js';
const { ValueContainer, Placeholder } = components;

const RentPage = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        paginateInventoryRentTransaction,
        findOneMerchant,
        useLazyQueryGQL,
        fetchRacks,
        paginateBoxes,
        paginateBallots,
        removeMerchantAssignmentFromInventory,
        useMutationGQL,
        inventoryRentSummary,
        fetchMerchants,
    } = API();
    const [importItemModel, setimportItemModel] = useState(false);
    const [inventorySettings, setinventorySettings] = useState({});
    const [buttonLoading, setbuttonLoading] = useState(false);

    const [fetchRacksQuery, setfetchRacksQuery] = useState(null);
    const [fetchBoxesQuery, setfetchBoxesQuery] = useState(null);
    const [sumInventoryRent, setsumInventoryRent] = useState(null);
    const [fetchBallotsQuery, setfetchBallotsQuery] = useState(null);
    const [inventoryRentSummaryData, setinventoryRentSummaryData] = useState(null);

    const [idsToBeRemoved, setidsToBeRemoved] = useState({
        rackIds: undefined,
        ballotIds: undefined,
        boxIds: undefined,
    });

    const { lang, langdetect } = useContext(LanguageContext);

    const [filterSentTransactionsObj, setfilterSentTransactionsObj] = useState({
        isAsc: true,
        limit: 3,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const paginateInventoryRentTransactionQuery = useQueryGQL('', paginateInventoryRentTransaction(), filterSentTransactionsObj);
    const [inventoryRentSummaryLazyQuery] = useLazyQueryGQL(inventoryRentSummary());

    useEffect(async () => {
        setpageactive_context('/rentpage');
        try {
            var { data } = await inventoryRentSummaryLazyQuery({
                variables: {
                    input: {
                        // merchantId: parseInt(queryParameters.get('merchantId')),
                        // afterDate: lastbill ?? undefined,
                    },
                },
            });
            setinventoryRentSummaryData(data?.inventoryRentSummary?.data[0]);
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

    const [filteMerchants, setfilteMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchMerchantsQuery = useQueryGQL('cashe-first', fetchMerchants(), filteMerchants);
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
            {/* {!queryParameters.get('merchantId') && (
                <div class="col-lg-12 p-0">
                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                        <SelectComponent
                            title={'Merchant'}
                            filter={filteMerchants}
                            setfilter={setfilteMerchants}
                            options={fetchMerchantsQuery}
                            attr={'paginateMerchants'}
                            label={'name'}
                            value={'id'}
                            onClick={(option) => {
                                history.push('/inventorysettings?merchantId=' + option.id);
                            }}
                        />
                    </div>
                </div>
            )} */}
            <>
                <div class="col-lg-12 p-0">
                    <div class="row m-0 w-100">
                        <div class="col-lg-5">
                            <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                                <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                    Next Bill Payment <span style={{ color: 'grey', fontSize: '15px' }}>({getFirstDayOfNextMonth()})</span>
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
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0 text-uppercase" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    <div class="col-lg-6 p-0 d-flex justify-content-end">
                        <span
                            onClick={() => {
                                history.push('/merchantpayments');
                            }}
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  allcentered'}
                        >
                            View all
                        </span>
                    </div>
                    <>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <TransactionsTable
                                width={'50%'}
                                query={paginateInventoryRentTransactionQuery}
                                paginationAttr="paginateInventoryRentTransaction"
                                srctype="courierCollection"
                                // accountId={queryParameters.get('accountId')}
                            />
                        </div>
                    </>
                </div>
            </>
        </>
    );
};
export default RentPage;