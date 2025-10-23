import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
import { DateRangePicker } from 'rsuite';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { Modal } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import TransactionsTable from './TransactionsTable.js';
import Decimal from 'decimal.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import Select, { components } from 'react-select';

const RentBills = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext, useLoadQueryParamsToPayload, updateQueryParamContext } =
        useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchInventoryRentBills, completeInventoryRentTransactions, fetchFinancialAccounts } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [chosenMerchantsArray, setchosenMerchantsArray] = useState([]);
    const [total, setTotal] = useState(0);
    const [submit, setsubmit] = useState(false);
    const [selectedArray, setselectedArray] = useState([]);
    const [hasTransactions, sethasTransactions] = useState(false);

    const [payload, setpayload] = useState({
        functype: 'add',
        name: '',
        type: '',
        merchantId: undefined,
        balance: 0,
        userId: undefined,
    });
    const [filterobj, setfilterobj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        statuses: undefined,
        fromDate: undefined,
        toDate: undefined,
    });

    useLoadQueryParamsToPayload(setfilterobj);

    const fetchInventoryRentBillsQuery = useQueryGQL('', fetchInventoryRentBills(), filterobj);

    const { isAsc, limit, processing, ...filteredFilterObj } = filterobj;
    const [filterAllFinancialAccountsObj, setfilterAllFinancialAccountsObj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchAllFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);

    useEffect(() => {
        setpageactive_context('/rentbills');
        setpagetitle_context('Finance');
    }, []);

    const refetchInventoryRentBillsQuery = () => fetchInventoryRentBillsQuery.refetch();

    const [completeInventoryRentTransactionsutation] = useMutationGQL(completeInventoryRentTransactions(), {
        transactionIds: selectedArray,
        financialAccountId: payload?.toAccountId,
        allTransactions: payload?.allTransactions,
    });

    useEffect(() => {
        let totalTemp = new Decimal(0); // Initialize totalTemp as a Decimal

        if (selectedArray?.length === 0) {
            fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.forEach((item) => {
                totalTemp = totalTemp.plus(new Decimal(item?.amount ?? 0)); // Using Decimal for accurate addition
            });
        } else {
            fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data.forEach((item) => {
                if (selectedArray.includes(item.id)) {
                    totalTemp = totalTemp.plus(new Decimal(item?.amount ?? 0)); // Using Decimal for accurate addition
                }
            });
        }

        setTotal(totalTemp.toNumber()); // Convert Decimal to number for setting state
    }, [fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data, selectedArray]);

    useEffect(() => {
        if (fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length > 0) {
            sethasTransactions(true);
        }
    }, [fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 d-flex align-items-center justify-content-start pb-2 px-3 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Rent Bills
                    </p>
                </div>
                <div class="col-lg-12 px-3">
                    <div style={{ borderRadius: '0.25rem', background: 'white' }} class={generalstyles.card + ' col-lg-12'}>
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
                                        <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                            <div class="row m-0 w-100  ">
                                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                    <label class={formstyles.form__label}>Order by</label>
                                                    <Select
                                                        options={[
                                                            { label: 'Oldest', value: true },
                                                            { label: 'Latest', value: false },
                                                        ]}
                                                        styles={defaultstyles}
                                                        value={[
                                                            { label: 'Oldest', value: true },
                                                            { label: 'Latest', value: false },
                                                        ].find((option) => option.value === (filterobj?.isAsc ?? true))}
                                                        onChange={(option) => {
                                                            setfilterobj({ ...filterobj, isAsc: option?.value });
                                                            updateQueryParamContext('isAsc', option?.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class=" col-lg-3 mb-md-2">
                                            <span>Date Range</span>
                                            <div class="mt-1" style={{ width: '100%' }}>
                                                <DateRangePicker
                                                    showOneCalendar
                                                    // disabledDate={allowedMaxDays(30)}
                                                    // value={[filterorders?.fromDate, filterorders?.toDate]}
                                                    onChange={(event) => {
                                                        if (event != null) {
                                                            const toUTCDate = (d) => {
                                                                const date = new Date(d);
                                                                return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                                            };

                                                            const [start, end] = event;

                                                            setfilterobj({
                                                                ...filterobj,
                                                                fromDate: toUTCDate(start).toISOString(),
                                                                toDate: toUTCDate(end).toISOString(),
                                                            });
                                                        }
                                                    }}
                                                    onClean={() => {
                                                        setfilterobj({ ...filterobj, fromDate: null, toDate: null });
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
                <div class="col-lg-12 p-0 ">
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 p-0">
                            {isAuth([1, 51, 114]) && (
                                <div class={' row m-0 w-100 mb-2 p-0 px-0'}>
                                    {/* <div class="col-lg-12 px-3">
                                        <div class={generalstyles.card + ' row m-0 w-100'}>
                                            <div className="col-lg-6 col-md-6 p-0 d-flex justify-content-end ">
                                                <div
                                                    onClick={() => {
                                                        var temp = [];
                                                        if (selectedArray?.length != fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length) {
                                                            fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.map((i, ii) => {
                                                                temp.push(i.id);
                                                            });
                                                        }
                                                        setselectedArray(temp);
                                                    }}
                                                    class="row m-0 w-100 d-flex align-items-center"
                                                    style={{
                                                        cursor: 'pointer',
                                                        // color:
                                                        //     selectedArray?.length == fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length ? 'var(--success)' : '',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                        }}
                                                        className="iconhover allcentered mr-1"
                                                    >
                                                        {selectedArray?.length != fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length && (
                                                            <FiCircle
                                                                style={{ transition: 'all 0.4s' }}
                                                                color={selectedArray?.length == fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length ? 'var(--success)' : ''}
                                                                size={18}
                                                            />
                                                        )}
                                                        {selectedArray?.length == fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length && (
                                                            <FiCheckCircle
                                                                style={{ transition: 'all 0.4s' }}
                                                                color={selectedArray?.length == fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length ? 'var(--success)' : ''}
                                                                size={18}
                                                            />
                                                        )}
                                                    </div>
                                                    {selectedArray?.length != fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.data?.length ? 'Select All' : 'Deselect All'}
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            total={fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.totalCount}
                                            beforeCursor={fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.cursor?.beforeCursor}
                                            afterCursor={fetchInventoryRentBillsQuery?.data?.paginateInventoryRentBills?.cursor?.afterCursor}
                                            filter={filterobj}
                                            setfilter={setfilterobj}
                                            loading={fetchInventoryRentBillsQuery?.loading}
                                        />
                                    </div>
                                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                        <TransactionsTable
                                            hasOrder={true}
                                            enableEdit={false}
                                            width={'50%'}
                                            query={fetchInventoryRentBillsQuery}
                                            paginationAttr="paginateInventoryRentBills"
                                            srctype="courierCollection"
                                            refetchFunc={() => {
                                                Refetch();
                                            }}
                                            // allowSelect={isAuth([1, 51, 115]) ? true : false}
                                            selectedArray={selectedArray}
                                            setselectedArray={setselectedArray}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* <div class="col-lg-3 pr-1 ">
                            <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                <div class="col-lg-12 mb-3">
                                    <button
                                        class={generalstyles.roundbutton + ' allcentered w-100'}
                                        onClick={async () => {
                                            if (!isAuth([1, 51, 115])) {
                                                NotificationManager.warning('Not Authorized', 'Warning!');
                                                return;
                                            }
                                            if (hasTransactions) {
                                                setpayload({ ...payload, type: 'transfer', allTransactions: true });

                                                setopenModal(true);
                                            } else {
                                                NotificationManager.warning('You have no transactions', 'Warning!');
                                            }
                                        }}
                                    >
                                        {' '}
                                        Complete all bills
                                    </button>
                                </div>
                                <div class="col-lg-12 mb-3">
                                    <button
                                        class={generalstyles.roundbutton + ' allcentered w-100'}
                                        onClick={async () => {
                                            if (!isAuth([1, 51, 115])) {
                                                NotificationManager.warning('Not Authorized', 'Warning!');
                                                return;
                                            }
                                            if (selectedArray?.length != 0) {
                                                setpayload({ ...payload, type: 'transfer' });

                                                setopenModal(true);
                                            } else {
                                                NotificationManager.warning('Choose bills first', 'Warning!');
                                            }
                                        }}
                                    >
                                        {' '}
                                        Complete selected
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                {/* <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
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
                        <div class="col-lg-6 col-md-10 pt-3 ">
                            <div className="row w-100 m-0 p-0 text-capitalize">{'Transfer'}</div>
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
                            attr={[
                                {
                                    title: 'To Account',
                                    filter: filterAllFinancialAccountsObj,
                                    setfilter: setfilterAllFinancialAccountsObj,
                                    options: fetchAllFinancialAccountsQuery,
                                    optionsAttr: 'paginateFinancialAccounts',
                                    label: 'name',
                                    value: 'id',
                                    size: '12',
                                    attr: 'toAccountId',
                                    type: 'fetchSelect',
                                },
                            ]}
                            payload={payload}
                            setpayload={setpayload}
                            button1disabled={buttonLoadingContext}
                            button1class={generalstyles.roundbutton + ' mr-2 '}
                            button1placeholder={'Complete'}
                            button1onClick={async () => {
                                if (buttonLoadingContext) return;
                                setbuttonLoadingContext(true);
                                if (isAuth([1, 28, 51])) {
                                    try {
                                        const { data } = await completeInventoryRentTransactionsutation();
                                        refetchInventoryRentBillsQuery();
                                        setselectedArray([]);
                                        setopenModal(false);
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
                                    }
                                } else {
                                    NotificationManager.warning('Not Authorized', 'Warning!');
                                }
                                setbuttonLoadingContext(false);
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default RentBills;
