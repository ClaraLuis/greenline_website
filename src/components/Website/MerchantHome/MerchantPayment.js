import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';

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
    const { setpageactive_context, isAuth, financialAccountTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchMerchants, useMutationGQL, createFinancialAccount, updateFinancialAccount, fetchMerchantPaymentTransactions, completeMerchantPayments, fetchFinancialAccounts } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [chosenMerchantsArray, setchosenMerchantsArray] = useState([]);
    const [total, setTotal] = useState(0);
    const [submit, setsubmit] = useState(false);
    const [selectedArray, setselectedArray] = useState([]);

    const [payload, setpayload] = useState({
        functype: 'add',
        name: '',
        type: '',
        merchantId: undefined,
        balance: 0,
        userId: undefined,
    });
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
    const [filteMerchants, setfilteMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filteMerchants);
    const { refetch: refetchMerchantPaymentTransactionsQuery } = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);

    const [completeMerchantPaymentsMutation] = useMutationGQL(completeMerchantPayments(), {
        transactionIds: selectedArray,
        description: payload?.description,
    });

    useEffect(() => {
        var totalTemp = 0;
        if (selectedArray?.length == 0) {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.map((item, index) => {
                totalTemp += parseFloat(item?.amount);
            });
        } else {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data.forEach((item) => {
                if (selectedArray.length === 0 || selectedArray.includes(item.id)) {
                    totalTemp += parseFloat(item?.amount);
                }
            });
        }

        setTotal(totalTemp);
    }, [fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data, selectedArray]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Merchant Payments
                    </p>
                </div>
                {/* <div style={{ borderRadius: '18px', background: 'white' }} class={' mb-3 col-lg-12 p-2'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
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
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <SelectComponent
                                            title={'Merchant'}
                                            filter={filteMerchants}
                                            setfilter={setfilteMerchants}
                                            options={fetchMerchantsQuery}
                                            attr={'paginateMerchants'}
                                            label={'name'}
                                            value={'id'}
                                            onClick={(option) => {
                                                var temp = filterobj?.merchantIds ?? [];
                                                if (option != undefined) {
                                                    var exist = false;
                                                    filterobj?.merchantIds?.map((i, ii) => {
                                                        if (i == option?.id) {
                                                            exist = true;
                                                        }
                                                    });
                                                    if (!exist) {
                                                        chosenMerchantsArray.push(option);
                                                        temp.push(option?.id);
                                                    }
                                                } else {
                                                    temp = undefined;
                                                    setchosenMerchantsArray([]);
                                                }

                                                setfilterobj({ ...filterobj, merchantIds: temp });
                                            }}
                                        />
                                    </div>
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <label for="name" class={formstyles.form__label}>
                                            Processing
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'All', value: undefined },
                                                { label: 'True', value: true },
                                                { label: 'False', value: false },
                                            ]}
                                            styles={defaultstyles}
                                            defaultValue={[
                                                { label: 'All', value: undefined },
                                                { label: 'True', value: true },
                                                { label: 'False', value: false },
                                            ].filter((option) => option?.id == filterobj?.processing)}
                                            onChange={(option) => {
                                                setfilterobj({ ...filterobj, processing: option.value });
                                            }}
                                        />
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100">
                                            {chosenMerchantsArray?.map((item, index) => {
                                                return (
                                                    <div
                                                        style={{
                                                            background: '#ECECEC',
                                                            padding: '5px 10px',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            justifyContent: 'space-between',
                                                            width: 'fit-content',
                                                            fontSize: '11px',
                                                            minWidth: 'fit-content',
                                                        }}
                                                        className="d-flex align-items-center mr-2 mb-1"
                                                        onClick={() => {
                                                            var temp = [...filterobj?.merchantIds];
                                                            chosenMerchantsArray.splice(index, 1);
                                                            temp.splice(index, 1);
                                                            setfilterobj({ ...filterobj, merchantIds: temp });
                                                        }}
                                                    >
                                                        {item?.name}
                                                        <AiOutlineClose size={12} color="#6C757D" className="ml-2" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div> */}
                <div class="col-lg-12 p-0 ">
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 p-0">
                            {isAuth([1, 51, 19]) && (
                                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                    <div class="col-lg-12 p-0">
                                        <Pagination
                                            beforeCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.beforeCursor}
                                            afterCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.afterCursor}
                                            filter={filterobj}
                                            setfilter={setfilterobj}
                                        />
                                    </div>
                                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                        <TransactionsTable
                                            width={'40%'}
                                            query={fetchMerchantPaymentTransactionsQuery}
                                            paginationAttr="paginateMerchantPaymentTransactions"
                                            srctype="all"
                                            refetchFunc={() => {
                                                Refetch();
                                            }}
                                            // allowSelect={true}
                                            // selectedArray={selectedArray}
                                            // setselectedArray={setselectedArray}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MerchantPayment;
