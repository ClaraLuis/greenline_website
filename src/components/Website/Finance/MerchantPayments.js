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
import TransactionsTable from './TransactionsTable.js';
import Pagination from '../../Pagination.js';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import SelectComponent from '../../SelectComponent.js';

const MerchantPayments = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, financialAccountTypesContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchMerchants, useMutationGQL, createFinancialAccount, updateFinancialAccount, fetchMerchantPaymentTransactions, completeMerchantPayments, fetchFinancialAccounts } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);

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
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
    });

    const fetchMerchantPaymentTransactionsQuery = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);
    const [filterAllFinancialAccountsObj, setfilterAllFinancialAccountsObj] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchAllFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);

    useEffect(() => {
        setpageactive_context('/merchantpayments');
        setfilterobj({
            isAsc: true,
            limit: 100,
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
    const [updateFinancialAccountMutation] = useMutationGQL(updateFinancialAccount(), {
        name: payload?.name,
        id: payload?.id,
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
                <div style={{ borderRadius: '18px', background: 'white' }} class={' mb-3 col-lg-12 p-2'}>
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
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
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
                                                var exist = false;
                                                filterobj?.merchantIds?.map((i, ii) => {
                                                    if (i == option.id) {
                                                        exist = true;
                                                    }
                                                });
                                                if (!exist) {
                                                    chosenMerchantsArray.push(option);
                                                    temp.push(option?.id);
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
                                            ].filter((option) => option.id == filterobj?.processing)}
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
                </div>
                <div class="col-lg-12 p-0 ">
                    <div class="row m-0 w-100">
                        <div class="col-lg-9 p-0">
                            {isAuth([1, 51, 19]) && (
                                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                    <div className="col-lg-6 p-0 d-flex justify-content-end ">
                                        <div
                                            onClick={() => {
                                                var temp = [];
                                                if (selectedArray?.length != fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length) {
                                                    fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.map((i, ii) => {
                                                        temp.push(i.id);
                                                    });
                                                }
                                                setselectedArray(temp);
                                            }}
                                            class="row m-0 w-100 d-flex align-items-center"
                                            style={{
                                                cursor: 'pointer',
                                                // color:
                                                //     selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length ? 'var(--success)' : '',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                }}
                                                className="iconhover allcentered mr-1"
                                            >
                                                {selectedArray?.length != fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length && (
                                                    <FiCircle
                                                        style={{ transition: 'all 0.4s' }}
                                                        color={
                                                            selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length
                                                                ? 'var(--success)'
                                                                : ''
                                                        }
                                                        size={18}
                                                    />
                                                )}
                                                {selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length && (
                                                    <FiCheckCircle
                                                        style={{ transition: 'all 0.4s' }}
                                                        color={
                                                            selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length
                                                                ? 'var(--success)'
                                                                : ''
                                                        }
                                                        size={18}
                                                    />
                                                )}
                                            </div>
                                            {selectedArray?.length != fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length ? 'Select All' : 'Deselect All'}
                                        </div>
                                    </div>
                                    <div class="col-lg-6 p-0">
                                        <Pagination
                                            beforeCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.beforeCursor}
                                            afterCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.afterCursor}
                                            filter={filterobj}
                                            setfilter={setfilterobj}
                                        />
                                    </div>
                                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                        <TransactionsTable
                                            width={'50%'}
                                            query={fetchMerchantPaymentTransactionsQuery}
                                            paginationAttr="paginateMerchantPaymentTransactions"
                                            srctype="all"
                                            refetchFunc={() => {
                                                Refetch();
                                            }}
                                            allowSelect={true}
                                            selectedArray={selectedArray}
                                            setselectedArray={setselectedArray}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="col-lg-3 ">
                            <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                <div class="col-lg-12 p-0 mb-3">
                                    <span style={{ fontWeight: 600 }}>Total: </span>
                                    {total}
                                </div>
                                <div class="col-lg-12">
                                    <button
                                        class={generalstyles.roundbutton + ' allcentered w-100'}
                                        onClick={async () => {
                                            if (selectedArray?.length != 0) {
                                                setopenModal(true);
                                            } else {
                                                NotificationManager.warning('Choose transactions first', 'Warning!');
                                            }
                                        }}
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div> */}
            </div>
            <Modal
                show={openModal}
                onHide={() => {
                    setopenModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0 text-capitalize">{'Account'}</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <Form
                            size={'md'}
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={[{ name: 'Description', attr: 'description', type: 'textarea', size: '12' }]}
                            payload={payload}
                            setpayload={setpayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + ' mr-2 '}
                            button1placeholder={'Complete'}
                            button1onClick={async () => {
                                try {
                                    const { data } = await completeMerchantPaymentsMutation();
                                    refetchMerchantPaymentTransactionsQuery();
                                    setselectedArray([]);
                                    setopenModal(false);
                                } catch (error) {
                                    NotificationManager.warning(error.message || error, 'Warning!');
                                }
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default MerchantPayments;
