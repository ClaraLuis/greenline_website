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
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
const Settlements = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, createMerchantSettlement, paginateSettlementPayouts, paginateMerchantDebts, useLazyQueryGQL } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);

    const [settlementPayload, setsettlementPayload] = useState({
        sheetOrderIds: [],
        merchantDebtIds: [],
    });

    useEffect(() => {
        setpageactive_context('/settlements');
        setpagetitle_context('Finance');
    }, []);

    const [createsettlementModal, setcreatesettlementModal] = useState(false);
    const [fetchSettlementsQuery, setfetchSettlementsQuery] = useState([]);
    const [fetchMerchantDebtsQuery, setfetchMerchantDebtsQuery] = useState([]);

    const [paginateSettlementPayoutsLazyQuery] = useLazyQueryGQL(paginateSettlementPayouts());
    const [paginateMerchantDebtsLazyQuery] = useLazyQueryGQL(paginateMerchantDebts());

    const [settlementsFilter, setsettlementsFilter] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantId: queryParameters.get('merchantId') ?? undefined,
    });
    useEffect(async () => {
        try {
            var { data } = await paginateSettlementPayoutsLazyQuery({
                variables: { input: { ...settlementsFilter, merchantId: parseInt(queryParameters.get('merchantId')) } },
            });
            setfetchSettlementsQuery({ data: data });
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
    }, [settlementsFilter]);
    useEffect(async () => {
        try {
            var { data } = await paginateMerchantDebtsLazyQuery({
                variables: { input: { ...settlementsFilter, merchantId: parseInt(queryParameters.get('merchantId')) } },
            });
            setfetchMerchantDebtsQuery({ data: data });
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
    }, [settlementsFilter]);

    const [createMerchantSettlementMutation] = useMutationGQL(createMerchantSettlement(), {
        merchantId: parseInt(settlementsFilter?.merchantId),
        sheetOrderIds: settlementPayload?.sheetOrderIds?.map((item) => item.id)?.length != 0 ? settlementPayload?.sheetOrderIds?.map((item) => item.id) : undefined,
        merchantDebtIds: settlementPayload?.merchantDebtIds?.map((item) => item.id)?.length != 0 ? settlementPayload?.merchantDebtIds?.map((item) => item.id) : undefined,
    });

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 d-flex align-items-center justify-content-start pb-2 px-3 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Settlements
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
                                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                            <MerchantSelectComponent
                                                type="single"
                                                label={'name'}
                                                value={'id'}
                                                payload={settlementsFilter}
                                                payloadAttr={'merchantId'}
                                                removeAll={true}
                                                onClick={(option) => {
                                                    if (option != undefined) {
                                                        history.push('/settlements?merchantId=' + option.id + '&m=' + option.name);
                                                    } else {
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                {queryParameters?.get('merchantId') != undefined && (
                    <div class="col-lg-12 p-0 ">
                        <div class="row m-0 w-100">
                            <div class="col-lg-7 p-0">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 pl-3">
                                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                            {fetchSettlementsQuery?.data && (
                                                <>
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '17px', fontWeight: 700 }}>
                                                        Orders
                                                    </div>
                                                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-3 '}>
                                                        <table className={'table'}>
                                                            <thead>
                                                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>#</th>
                                                                <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Type</th>
                                                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Shipping</th>
                                                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Total</th>
                                                            </thead>
                                                            <tbody>
                                                                {/* {alert(JSON.stringify(fetchSettlementsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                                {fetchSettlementsQuery?.data?.paginateSettlementPayouts?.data?.map((item, index) => {
                                                                    var selected = false;
                                                                    settlementPayload?.sheetOrderIds?.map((orderitem, orderindex) => {
                                                                        if (orderitem?.id == item?.id) {
                                                                            selected = true;
                                                                        }
                                                                    });
                                                                    return (
                                                                        <tr
                                                                            style={{ background: selected ? 'var(--secondary)' : '' }}
                                                                            onClick={() => {
                                                                                var temp = { ...settlementPayload };
                                                                                var exist = false;
                                                                                var chosenindex = null;
                                                                                temp.sheetOrderIds.map((i, ii) => {
                                                                                    if (i.id == item.id) {
                                                                                        exist = true;
                                                                                        chosenindex = ii;
                                                                                    }
                                                                                });
                                                                                if (!exist) {
                                                                                    temp.sheetOrderIds.push(item);
                                                                                } else {
                                                                                    temp.sheetOrderIds.splice(chosenindex, 1);
                                                                                }
                                                                                setsettlementPayload({ ...temp });
                                                                            }}
                                                                        >
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                                                            </td>
                                                                            <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                <div
                                                                                    style={{ color: 'white' }}
                                                                                    className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                                >
                                                                                    {item?.order?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className="m-0 p-0 wordbreak">
                                                                                    {item?.transactions?.map((i) => (i.type === 'merchantOrderPayment' ? i.amount : 0))}
                                                                                </p>
                                                                            </td>
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className="m-0 p-0 wordbreak">
                                                                                    {item?.transactions?.map((i) => (i.type === 'shippingCollection' ? i.amount * -1 : 0))}
                                                                                </p>
                                                                            </td>
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className={' m-0 p-0 wordbreak '}>
                                                                                    {new Decimal(item?.transactions?.reduce((sum, i) => (i.type === 'merchantOrderPayment' ? sum + i.amount : sum), 0))
                                                                                        .plus(
                                                                                            new Decimal(
                                                                                                item?.transactions?.reduce(
                                                                                                    (sum, i) => (i.type === 'shippingCollection' ? sum + i.amount * -1 : sum),
                                                                                                    0,
                                                                                                ),
                                                                                            ),
                                                                                        )
                                                                                        .toNumber()}{' '}
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div class="col-lg-12 pl-3">
                                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                            {fetchMerchantDebtsQuery?.data && (
                                                <>
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '17px', fontWeight: 700 }}>
                                                        Services
                                                    </div>
                                                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-3 '}>
                                                        <table className={'table'}>
                                                            <thead>
                                                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>#</th>
                                                                <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Type</th>
                                                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                            </thead>
                                                            <tbody>
                                                                {/* {alert(JSON.stringify(fetchMerchantDebtsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                                {fetchMerchantDebtsQuery?.data?.paginateMerchantDebts?.data?.map((item, index) => {
                                                                    var selected = false;
                                                                    settlementPayload?.merchantDebtIds?.map((orderitem, orderindex) => {
                                                                        if (orderitem?.id == item?.id) {
                                                                            selected = true;
                                                                        }
                                                                    });
                                                                    return (
                                                                        <tr
                                                                            style={{ background: selected ? 'var(--secondary)' : '' }}
                                                                            onClick={() => {
                                                                                var temp = { ...settlementPayload };
                                                                                var exist = false;
                                                                                var chosenindex = null;
                                                                                temp.merchantDebtIds.map((i, ii) => {
                                                                                    if (i.id == item.id) {
                                                                                        exist = true;
                                                                                        chosenindex = ii;
                                                                                    }
                                                                                });
                                                                                if (!exist) {
                                                                                    temp.merchantDebtIds.push(item);
                                                                                } else {
                                                                                    temp.merchantDebtIds.splice(chosenindex, 1);
                                                                                }
                                                                                setsettlementPayload({ ...temp });
                                                                            }}
                                                                        >
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                                                            </td>
                                                                            <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                <p className={' m-0 p-0 wordbreak '}>
                                                                                    {' '}
                                                                                    <div
                                                                                        style={{ color: 'white' }}
                                                                                        className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                                    >
                                                                                        {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                                    </div>
                                                                                </p>
                                                                            </td>
                                                                            <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                <p className={' m-0 p-0 wordbreak '}>{item?.amount}</p>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5 pr-1 ">
                                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-0 '}>
                                    <div class="col-lg-12 p-0 mb-2" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Details
                                    </div>
                                    <div class="col-lg-12 p-0 mb-2">
                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                            <div>Merchant Name</div>
                                            <div style={{ fontWeight: 700 }}>{queryParameters.get('m')}</div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 p-0 mb-2">
                                        {settlementPayload?.sheetOrderIds?.length != 0 && (
                                            <>
                                                <div
                                                    style={{ border: '1px solid #eee', borderRadius: '0.5rem' }}
                                                    className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}
                                                >
                                                    <table className={'table'}>
                                                        <thead>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Orders</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Shipping</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Total</th>
                                                        </thead>
                                                        <tbody>
                                                            {/* {alert(JSON.stringify(fetchSettlementsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                            {settlementPayload?.sheetOrderIds?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                                                        </td>

                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className="m-0 p-0 wordbreak">{item?.transactions?.map((i) => (i.type === 'merchantOrderPayment' ? i.amount : 0))}</p>
                                                                        </td>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className="m-0 p-0 wordbreak">{item?.transactions?.map((i) => (i.type === 'shippingCollection' ? i.amount * -1 : 0))}</p>
                                                                        </td>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>
                                                                                {new Decimal(item?.transactions?.reduce((sum, i) => (i.type === 'merchantOrderPayment' ? sum + i.amount : sum), 0))
                                                                                    .plus(
                                                                                        new Decimal(
                                                                                            item?.transactions?.reduce((sum, i) => (i.type === 'shippingCollection' ? sum + i.amount * -1 : sum), 0),
                                                                                        ),
                                                                                    )
                                                                                    .toNumber()}{' '}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                        {settlementPayload?.merchantDebtIds?.length != 0 && (
                                            <>
                                                <div
                                                    style={{ border: '1px solid #eee', borderRadius: '0.5rem' }}
                                                    className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 mt-2'}
                                                >
                                                    <table className={'table'}>
                                                        <thead>
                                                            <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Service</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                        </thead>
                                                        <tbody>
                                                            {/* {alert(JSON.stringify(fetchMerchantDebtsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                            {settlementPayload?.merchantDebtIds?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>
                                                                                {' '}
                                                                                <div
                                                                                    style={{ color: 'white' }}
                                                                                    className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                                >
                                                                                    {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                                </div>
                                                                            </p>
                                                                        </td>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.amount}</p>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div class="col-lg-12 p-0 mb-3">
                                        <div class="row m-0 w-100 p-3" style={{ border: '1px solid #eee', borderRadius: '0.5rem' }}>
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div>Orders</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {settlementPayload?.sheetOrderIds?.reduce((acc, item) => {
                                                            const merchantAmount = item?.transactions?.reduce((sum, i) => (i.type === 'merchantOrderPayment' ? sum + i.amount : sum), 0);
                                                            const shippingAmount = item?.transactions?.reduce((sum, i) => (i.type === 'shippingCollection' ? sum + i.amount * -1 : sum), 0);
                                                            return acc + new Decimal(merchantAmount).plus(new Decimal(shippingAmount)).toNumber();
                                                        }, 0)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div>Services</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {settlementPayload?.merchantDebtIds?.reduce((sum, item) => sum + new Decimal(item?.amount || 0).toNumber(), 0)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div style={{ fontWeight: 700 }}>Total</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {
                                                            new Decimal(
                                                                settlementPayload?.sheetOrderIds?.reduce((acc, item) => {
                                                                    const merchantAmount = item?.transactions?.reduce((sum, i) => (i.type === 'merchantOrderPayment' ? sum + i.amount : sum), 0);
                                                                    const shippingAmount = item?.transactions?.reduce((sum, i) => (i.type === 'shippingCollection' ? sum + i.amount * -1 : sum), 0);
                                                                    return acc + new Decimal(merchantAmount).plus(new Decimal(shippingAmount)).toNumber();
                                                                }, 0),
                                                            )
                                                                .plus(new Decimal(settlementPayload?.merchantDebtIds?.reduce((sum, item) => sum + new Decimal(item?.amount || 0).toNumber(), 0)))
                                                                .toFixed(2) /* Or use .toNumber() if you don't need fixed precision */
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-3">
                                        <button
                                            class={generalstyles.roundbutton + ' allcentered w-100'}
                                            onClick={async () => {
                                                if (buttonLoadingContext) return;
                                                setbuttonLoadingContext(true);
                                                try {
                                                    const { data } = await createMerchantSettlementMutation();
                                                    if (data?.createMerchantSettlement?.success) {
                                                        //    await refetchfetchItemsInBox();
                                                        NotificationManager.success(data?.createMerchantSettlement?.message, 'Success!');
                                                        setcreatesettlementModal({ open: true, data: data });
                                                    } else {
                                                        NotificationManager.warning(data?.createMerchantSettlement?.message, 'Warning!');
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
                                                }
                                                setbuttonLoadingContext(false);
                                            }}
                                        >
                                            Create Settlement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                show={createsettlementModal?.open}
                onHide={() => {
                    setcreatesettlementModal({ open: false });
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0 d-flex align-items-center">
                        <div class="col-lg-6 p-0 ">
                            <div className="row w-100 m-0 p-0 d-flex align-items-center">Create Settlement</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setcreatesettlementModal({ open: false });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 p-4">
                        <div class="col-lg-12 p-0 mb-3">Tota: {createsettlementModal?.data?.createMerchantSettlement?.data?.total}</div>
                        <div class="col-lg-12 p-0 allcentered text-center">
                            <button
                                class={generalstyles.roundbutton + ' allcentered w-100'}
                                onClick={async () => {
                                    window.open(createsettlementModal?.data?.createMerchantSettlement?.data?.pdfUrl, '_blank');
                                }}
                            >
                                Open PDF
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Settlements;
