import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Modal } from 'react-bootstrap';
import { IoMdClose, IoMdTime } from 'react-icons/io';
import API from '../../../API/API.js';
import AccountsTable from './AccountsTable.js';
import TransactionsTable from './TransactionsTable.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';
import SettlemantsTable from './SettlemantsTable.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import Cookies from 'universal-cookie';
import { FaMoneyBill } from 'react-icons/fa';
import TransactionsTableView from './TransactionsTableView.js';

const { ValueContainer, Placeholder } = components;

const MerchantSettlement = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, chosenMerchantSettlemant, setchosenMerchantSettlemant, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext, dateformatter } =
        useContext(Contexthandlerscontext);
    const { paginateSettlementTransactions, useQueryGQL, fetchUsers, fetchMerchants, useMutationGQL, createFinancialAccount, useLazyQueryGQL } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);

    const [filterobj, setfilterobj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const [paginateSettlementTransactionsQuery, setpaginateSettlementTransactionsQuery] = useState({});

    const [paginateSettlementTransactionsLazyQuery] = useLazyQueryGQL(paginateSettlementTransactions());
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/merchantsettlements');
        setpagetitle_context('Finance');
        setfilterobj({
            isAsc: true,
            limit: 20,
            afterCursor: undefined,
            beforeCursor: undefined,
            merchantSettlementId: parseInt(queryParameters.get('id')),
        });
    }, []);

    useEffect(async () => {
        if (filterobj?.merchantSettlementId) {
            try {
                var { data } = await paginateSettlementTransactionsLazyQuery({
                    variables: { input: { ...filterobj } },
                });
                setpaginateSettlementTransactionsQuery({ data: data });
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
        }
    }, [filterobj]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' m-0 row w-100 '}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Merchant Settlement
                            </p>
                        </div>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}></div>
                    </div>
                </div>{' '}
                {chosenMerchantSettlemant != undefined && chosenMerchantSettlemant && JSON.stringify(chosenMerchantSettlemant) != '{}' && (
                    <div class="col-lg-12 px-1">
                        <div className="col-lg-4">
                            <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                <div className="col-lg-6 p-0">
                                    <span style={{ fontSize: '12px', color: 'grey' }}># {chosenMerchantSettlemant?.id}</span>
                                </div>
                                <div className="col-lg-6 p-0 d-flex justify-content-end align-items-center">
                                    <div class="row m-0 w-100 d-flrx justify-content-end align-items-center"></div>
                                </div>
                                <div className="col-lg-12 p-0 my-2">
                                    <hr className="m-0" />
                                </div>

                                <div className="col-lg-6 p-0 mb-2">
                                    <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                        <FaMoneyBill class="mr-1" />
                                        {chosenMerchantSettlemant?.totalAmount}
                                    </span>
                                </div>
                                <div className="col-lg-6 p-0 mb-2 d-flex justify-content-end">
                                    <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                        <IoMdTime class="mr-1" />
                                        {dateformatter(chosenMerchantSettlemant?.createdAt)}
                                    </span>
                                </div>
                                <div class="col-lg-12 p-0 allcentered mt-2">
                                    <button
                                        onClick={() => {
                                            window.open(chosenMerchantSettlemant.pdfUrl, '_blank');
                                        }}
                                        class={generalstyles.roundbutton}
                                    >
                                        View PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isAuth([1, 51, 52, 122]) && (
                    <div class={' row m-0 w-100'}>
                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={paginateSettlementTransactionsQuery?.data?.paginateSettlementTransactions?.cursor?.beforeCursor}
                                afterCursor={paginateSettlementTransactionsQuery?.data?.paginateSettlementTransactions?.cursor?.afterCursor}
                                filter={filterobj}
                                setfilter={setfilterobj}
                            />
                        </div>
                        {paginateSettlementTransactionsQuery?.data?.paginateSettlementTransactions && (
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                <TransactionsTableView
                                    width={'50%'}
                                    query={paginateSettlementTransactionsQuery}
                                    paginationAttr="paginateSettlementTransactions"
                                    // srctype="courierCollection"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MerchantSettlement;
