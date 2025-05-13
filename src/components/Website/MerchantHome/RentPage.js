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
import { IoMdTime } from 'react-icons/io';
const { ValueContainer, Placeholder } = components;

const RentPage = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { useQueryGQL, paginateInventoryRentTransaction, useLazyQueryGQL, inventoryRentSummary, fetchMerchants } = API();

    const [inventoryRentSummaryData, setinventoryRentSummaryData] = useState(null);

    const { lang, langdetect } = useContext(LanguageContext);

    const [filterSentTransactionsObj, setfilterSentTransactionsObj] = useState({
        isAsc: false,
        limit: 3,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const paginateInventoryRentTransactionQuery = useQueryGQL('', paginateInventoryRentTransaction(), filterSentTransactionsObj);
    const [inventoryRentSummaryLazyQuery] = useLazyQueryGQL(inventoryRentSummary());

    useEffect(async () => {
        setpageactive_context('/rentpage');
        setpagetitle_context('Warehouses');

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

    const getFirstDayOfNextMonth = () => {
        const today = new Date();
        const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const year = firstDayNextMonth.getFullYear();
        const month = String(firstDayNextMonth.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(firstDayNextMonth.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <>
                    <div class="col-lg-12 px-3">
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
                    <div class={' row m-0 w-100 mb-2 p-2'}>
                        <div class="col-lg-12 px-3">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
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
                            </div>
                        </div>

                        <>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                {paginateInventoryRentTransactionQuery?.data?.paginateInventoryRentTransaction?.data?.length != 0 && (
                                    <div class="row m-0 w-100">
                                        {paginateInventoryRentTransactionQuery?.data?.paginateInventoryRentTransaction?.data?.map((item, index) => {
                                            return (
                                                <div style={{ fontSize: '13px', position: 'relative' }} className="p-1 col-lg-6 pb-0">
                                                    <div class={generalstyles.card + ' p-2 px-3 row m-0 w-100 allcentered'}>
                                                        <div className="col-lg-12 p-0">
                                                            <span style={{ fontWeight: 700, fontSize: '16px' }} class=" d-flex align-items-center">
                                                                {item?.quantity}
                                                            </span>
                                                        </div>
                                                        <div className="col-lg-12 p-0 mb-1 d-flex justify-content-end">
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                                                <IoMdTime class="mr-1" />
                                                                {dateformatter(item?.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    </div>
                </>
            </div>
        </div>
    );
};
export default RentPage;
