import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
import Decimal from 'decimal.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { Modal } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import TransactionsTable from '../Finance/TransactionsTable.js';
import Pagination from '../../Pagination.js';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import SelectComponent from '../../SelectComponent.js';

const MerchantPayment = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const [total, setTotal] = useState(0);

    const { setpageactive_context, isAuth, financialAccountTypeContext } = useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        fetchMerchants,
        useMutationGQL,
        createFinancialAccount,
        calculateFinancialTransactionsTotal,
        fetchMerchantPaymentTransactions,
        completeMerchantPayments,
        fetchFinancialAccounts,
    } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonLoading, setbuttonLoading] = useState(false);

    const [selectedArray, setselectedArray] = useState([]);

    const [filterobj, setfilterobj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
    });

    const fetchMerchantPaymentTransactionsQuery = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);

    useEffect(() => {
        setpageactive_context('/merchantpayment');
        setfilterobj({
            isAsc: true,
            limit: 20,
            afterCursor: undefined,
            beforeCursor: undefined,
            merchantIds: undefined,
            processing: undefined,
        });
    }, []);

    useEffect(() => {
        let totalTemp = new Decimal(0); // Initialize totalTemp as a Decimal

        if (selectedArray?.length === 0) {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.forEach((item) => {
                totalTemp = totalTemp.plus(new Decimal(item?.amount || 0)); // Use Decimal for summing amounts
            });
        } else {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data.forEach((item) => {
                if (selectedArray.includes(item.id)) {
                    totalTemp = totalTemp.plus(new Decimal(item?.amount || 0)); // Use Decimal for summing amounts
                }
            });
        }

        setTotal(totalTemp.toNumber()); // Convert Decimal to number before setting state
    }, [fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data, selectedArray]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Merchant Payments
                    </p>
                </div>

                <div class="col-lg-12 p-0 ">
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 p-0">
                            <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                <div class="col-lg-12 p-0">
                                    <Pagination
                                        beforeCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.beforeCursor}
                                        afterCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.afterCursor}
                                        filter={filterobj}
                                        setfilter={setfilterobj}
                                    />
                                </div>
                                <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                    <TransactionsTable
                                        width={'40%'}
                                        query={fetchMerchantPaymentTransactionsQuery}
                                        paginationAttr="paginateMerchantPaymentTransactions"
                                        srctype="all"
                                        refetchFunc={() => {
                                            Refetch();
                                        }}
                                        hasOrder={true}
                                        // allowSelect={true}
                                        // selectedArray={selectedArray}
                                        // setselectedArray={setselectedArray}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MerchantPayment;
