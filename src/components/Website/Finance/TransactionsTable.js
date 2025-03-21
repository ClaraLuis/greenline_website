import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { components } from 'react-select';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import Cookies from 'universal-cookie';

// Icons
import { TbEdit, TbUserDollar } from 'react-icons/tb';
import { BiEdit } from 'react-icons/bi';
import { FaEllipsisV } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { IoMdClose, IoMdTime } from 'react-icons/io';
import { MdOutlineAccountCircle, MdOutlineCallMade, MdOutlineCallReceived, MdOutlineLocationOn } from 'react-icons/md';
import { TbFileDescription } from 'react-icons/tb';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import Form from '../../Form.js';

import { Dropdown } from 'react-bootstrap';
const { ValueContainer, Placeholder } = components;

const TransactionsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { transactionStatusTypeContext, setchosenOrderContext, isAuth, transactionStatusesSelectContext, dateformatter, buttonLoadingContext, setbuttonLoadingContext } =
        useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, updateAnyFinancialTransaction, updateMyFinancialTransaction, useMutationGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [changestatusmodal, setchangestatusmodal] = useState(false);

    const [selectedArray, setSelectedArray] = useState(props?.selectedArray || []);

    useEffect(() => {
        if (props?.selectedArray) {
            setSelectedArray(props?.selectedArray);
        }
    }, [props?.selectedArray]);

    const handleSelect = (item) => {
        let updatedArray;
        if (selectedArray.includes(item.id)) {
            updatedArray = selectedArray.filter((id) => id !== item.id);
        } else {
            updatedArray = [...selectedArray, item.id];
        }
        setSelectedArray(updatedArray);
        if (props?.setselectedArray) {
            props?.setselectedArray(updatedArray);
        }
    };
    const [statuspayload, setstatuspayload] = useState({
        id: '',
        status: '',
        description: undefined,
        receipt: undefined,
    });

    const [transactionhistory, settransactionhistory] = useState([
        { status: 'pendingSender', date: '3/16/2024', by: 'user 1' },
        { status: 'pendingReceiver', date: '4/16/2024', by: 'user 1' },
        { status: 'completed', date: '10/16/2024', by: 'user 1' },
    ]);
    const [submit, setsubmit] = useState(false);

    const [transactionhistorymodal, settransactionhistorymodal] = useState(false);
    const [updateAnyFinancialTransactionMutation] = useMutationGQL(updateAnyFinancialTransaction(), {
        id: statuspayload?.id,
        description: statuspayload?.description,
        status: statuspayload?.status,
        receipt: statuspayload?.receipt,
    });

    const [updateMyFinancialTransactionMutation] = useMutationGQL(updateMyFinancialTransaction(), {
        id: statuspayload?.id,
        description: statuspayload?.description,
        status: statuspayload?.status,
        receipt: statuspayload?.receipt,
    });

    return (
        <>
            {props?.query?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.query?.loading && props?.query?.data != undefined && props?.query?.data && (
                <>
                    {props?.query?.data[props?.paginationAttr]?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    {props?.srctype == 'expenses' ? 'No Expenses' : 'No Transactions'}
                                </div>
                            </div>
                        </div>
                    )}
                    {props?.query?.data[props?.paginationAttr]?.data?.length != 0 && (
                        <div class="row m-0 w-100">
                            {props?.query?.data[props?.paginationAttr]?.data?.map((item, index) => {
                                var selected = false;
                                selectedArray?.map((i, ii) => {
                                    if (i == item.id) {
                                        selected = true;
                                    }
                                });
                                return (
                                    <div
                                        style={{ fontSize: '13px', cursor: props?.allowSelect ? 'pointer' : '', position: 'relative', padding: 'auto' }}
                                        onClick={() => {
                                            if (props?.allowSelect) {
                                                handleSelect(item);
                                            }
                                        }}
                                        className={props?.width == '50%' ? 'col-lg-6' : props?.width == '100%' ? 'col-lg-12' : props?.width == '40%' ? 'col-lg-5' : 'col-lg-6'}
                                    >
                                        <div
                                            style={{ background: props?.allowSelect && selected ? 'var(--secondary)' : '', transition: 'all 0.4s' }}
                                            class={generalstyles.card + ' p-2 px-3 row m-0 w-100 allcentered'}
                                        >
                                            <div className="col-lg-3 p-0">
                                                <span style={{ fontWeight: 500, fontSize: '12px', color: 'grey' }} class=" d-flex align-items-center">
                                                    {/* <FaMoneyBill class="mr-1" /> */}#{item?.id}
                                                </span>
                                                <span style={{ fontWeight: 700, fontSize: '16px' }} class=" d-flex align-items-center">
                                                    {/* <FaMoneyBill class="mr-1" /> */}
                                                    {item?.amount} {item?.currency}
                                                </span>
                                            </div>

                                            <div className="col-lg-9 p-0 d-flex justify-content-end align-items-center">
                                                <div class="row m-0 w-100 d-flex justify-content-end align-items-center">
                                                    {/* {transactionStatusTypeContext?.map((i, ii) => {
                                                        if (i.value == item.status) { */}
                                                    {/* return ( */}
                                                    {item?.status && (
                                                        <div
                                                            style={{ cursor: item?.toAccount?.id == props?.accountId ? 'pointer' : '' }}
                                                            className={
                                                                item.status == 'completed'
                                                                    ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 text-capitalize '
                                                                    : item?.status == 'cancelled' ||
                                                                      item?.status == 'failed' ||
                                                                      item?.status == 'rejectedByReceiver' ||
                                                                      item?.status == 'cancelledBySender' ||
                                                                      item?.status == 'cancelledByReceiver' ||
                                                                      item?.status == 'rejectedBySender' ||
                                                                      item?.status == 'rejected'
                                                                    ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 text-capitalize'
                                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 text-capitalize'
                                                            }
                                                        >
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.status?.split(/(?=[A-Z])/).join(' ')}</p>
                                                        </div>
                                                    )}

                                                    {/* ); */}
                                                    {/* } */}
                                                    {/* })} */}
                                                    <div style={{ color: 'white' }} className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}>
                                                        {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                    </div>
                                                    {item?.toAccount?.id == props?.accountId && (
                                                        <button
                                                            onClick={() => {
                                                                if (props?.srctype == 'expenses' && !isAuth([1, 51, 24])) {
                                                                    NotificationManager.warning('Not Authorized', 'Warning!');
                                                                    return;
                                                                }
                                                                setstatuspayload({ ...statuspayload, id: item?.id });
                                                                setchangestatusmodal(true);
                                                            }}
                                                            style={{
                                                                height: '30px',
                                                                width: '30px',
                                                            }}
                                                            class={' iconhover allcentered '}
                                                        >
                                                            <TbEdit size={28} />
                                                        </button>
                                                    )}
                                                    {item?.fromAccount?.id == props?.accountId && item?.status == 'pendingReceiver' && (
                                                        <button
                                                            onClick={async () => {
                                                                await setstatuspayload({ ...statuspayload, id: item?.id, status: 'cancel' });
                                                                if (window.confirm('Are you sure you want to cancel this transaction')) {
                                                                    if (buttonLoadingContext) return;
                                                                    setbuttonLoadingContext(true);
                                                                    if (isAuth([1, 51])) {
                                                                        var { data } = await updateAnyFinancialTransactionMutation();
                                                                    } else {
                                                                        var { data } = await updateMyFinancialTransactionMutation();
                                                                    }
                                                                    if (data?.updateAnyFinancialTransaction?.success) {
                                                                        if (props?.refetchFunc) {
                                                                            props?.refetchFunc();
                                                                        }
                                                                    } else {
                                                                        NotificationManager.warning(data?.updateAnyFinancialTransaction?.message, 'Warning!');
                                                                    }
                                                                    setbuttonLoadingContext(false);
                                                                }
                                                            }}
                                                            style={{
                                                                height: '30px',
                                                                width: '30px',
                                                            }}
                                                            class={' iconhover allcentered '}
                                                            disabled={buttonLoadingContext}
                                                        >
                                                            <FcCancel size={25} />
                                                        </button>
                                                    )}
                                                    {props?.hasOrder && item?.sheetOrder?.order?.id && (
                                                        <div>
                                                            <Dropdown
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <Dropdown.Toggle>
                                                                    <div
                                                                        style={{
                                                                            color: 'var(--primary)',
                                                                            borderRadius: '10px',
                                                                            transition: 'all 0.4s',
                                                                        }}
                                                                        class="ml-0"
                                                                    >
                                                                        <FaEllipsisV />
                                                                    </div>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            await setchosenOrderContext(item?.sheetOrder?.order);
                                                                            history.push(`/orderinfo?type=merchant&orderId=` + item?.sheetOrder?.order?.id);
                                                                        }}
                                                                        class="py-2"
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>View order</p>
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 p-0 my-2">
                                                <hr className="m-0" />
                                            </div>
                                            {props?.srctype == 'all' && (
                                                <>
                                                    <div className="col-lg-7 p-0 mb-1">
                                                        {(cookies.get('userInfo')?.type != 'merchant' || cookies.get('merchantId') == item?.fromAccount?.merchantId) && (
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#4C8CF5' }}>
                                                                <MdOutlineCallMade class="mr-1" />
                                                                {item?.fromAccount?.name ?? '-'}
                                                            </span>
                                                        )}
                                                    </div>{' '}
                                                    <div className="col-lg-5 p-0 mb-1 d-flex justify-content-end">
                                                        <div class="row m-0 w-100d-flex justify-content-end">
                                                            {item?.sheetOrder?.order?.id && (
                                                                <div
                                                                    style={{ color: 'black', backgroundColor: '#eee' }}
                                                                    className={' wordbreak  rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                >
                                                                    #{item?.sheetOrder?.order?.id}
                                                                </div>
                                                            )}
                                                            {item?.sheetOrder?.order?.status && (
                                                                <div
                                                                    className={`wordbreak rounded-pill font-weight-600 text-capitalize ${
                                                                        item?.sheetOrder?.order?.status === 'delivered' ||
                                                                        item?.sheetOrder?.order?.status === 'partiallyDelivered' ||
                                                                        item?.sheetOrder?.order?.status === 'returned' ||
                                                                        item?.sheetOrder?.order?.status === 'partiallyReturned'
                                                                            ? 'text-success bg-light-success text-capitalize'
                                                                            : item?.sheetOrder?.order?.status === 'cancelled' || item?.sheetOrder?.order?.status === 'failedDeliveryAttempt'
                                                                            ? 'text-danger bg-light-danger text-capitalize'
                                                                            : item?.sheetOrder?.order?.status === 'postponed'
                                                                            ? 'text-warning bg-light-warning rounded-pill-hover text-capitalize'
                                                                            : 'text-warning bg-light-warning text-capitalize'
                                                                    }`}
                                                                >
                                                                    <p className={' m-0 p-0 wordbreak '}>{item?.sheetOrder?.order?.status?.split(/(?=[A-Z])/).join(' ')}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>{' '}
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        {(cookies.get('userInfo')?.type != 'merchant' || cookies.get('merchantId') == item?.toAccount?.merchantId) && (
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#1EC000' }}>
                                                                <MdOutlineCallReceived class="mr-1" />
                                                                {item?.toAccount?.name ?? '-'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {props?.srctype == 'courierCollection' && (
                                                <>
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#4C8CF5' }}>
                                                            {/* <MdOutlineCallMade class="mr-1" /> */}
                                                            {item?.sheetOrder?.order?.merchant?.name ?? '-'}
                                                        </span>
                                                    </div>{' '}
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        {(cookies.get('userInfo')?.type != 'merchant' || cookies.get('merchantId') == item?.fromAccount?.merchantId) && (
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#4C8CF5' }}>
                                                                <MdOutlineCallMade class="mr-1" />
                                                                {item?.fromAccount?.name ?? '-'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        {(cookies.get('userInfo')?.type != 'merchant' || cookies.get('merchantId') == item?.toAccount?.merchantId) && (
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#1EC000' }}>
                                                                <MdOutlineCallReceived class="mr-1" />
                                                                {item?.toAccount?.name ?? '-'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {props?.srctype != 'all' &&
                                                props?.srctype != 'courierCollection' &&
                                                props?.srctype != 'expenses' &&
                                                (cookies.get('userInfo')?.type != 'merchant' || cookies.get('merchantId') == item?.toAccount?.merchantId) && (
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        <span class="d-flex align-items-center" style={{ fontWeight: 600, color: item?.toAccount?.id == props?.accountId ? '#4C8CF5' : '#1EC000' }}>
                                                            <MdOutlineAccountCircle class="mr-1" />
                                                            {item?.toAccount?.id == props?.accountId ? item?.fromAccount?.name ?? '-' : item?.toAccount?.name ?? '-'}
                                                        </span>
                                                    </div>
                                                )}
                                            {(item?.comment || item?.description) && (
                                                <div className="col-lg-12 p-0 mb-1">
                                                    <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                                        <TbFileDescription class="mr-1" />
                                                        {props?.srctype == 'expenses' ? item?.comment : item?.description}
                                                    </span>
                                                </div>
                                            )}
                                            {cookies.get('userInfo')?.type == 'merchant' && item?.sheetOrder?.order && (
                                                <div className="col-lg-12 p-0">
                                                    <div style={{ border: '1px solid #eee' }} class={generalstyles.card + ' p-3 row m-0 w-100 '}>
                                                        <div className="col-lg-4 p-0">
                                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                                <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                                    # {item?.sheetOrder?.order?.id}
                                                                </span>{' '}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                            <div class="row m-0 w-100  d-flex justify-content-end align-items-center">
                                                                <div
                                                                    className={`wordbreak rounded-pill font-weight-600 text-capitalize ${
                                                                        item?.sheetOrder?.order?.status === 'delivered' ||
                                                                        item?.sheetOrder?.order?.status === 'partiallyDelivered' ||
                                                                        item?.sheetOrder?.order?.status === 'returned' ||
                                                                        item?.sheetOrder?.order?.status === 'partiallyReturned'
                                                                            ? 'text-success bg-light-success text-capitalize'
                                                                            : item?.sheetOrder?.order?.status === 'cancelled' || item?.sheetOrder?.order?.status === 'failedDeliveryAttempt'
                                                                            ? 'text-danger bg-light-danger text-capitalize'
                                                                            : item?.sheetOrder?.order?.status === 'postponed'
                                                                            ? 'text-warning bg-light-warning rounded-pill-hover text-capitalize'
                                                                            : 'text-warning bg-light-warning text-capitalize'
                                                                    } `}
                                                                >
                                                                    {item?.sheetOrder?.order?.status?.split(/(?=[A-Z])/).join(' ')}
                                                                </div>
                                                                <div style={{ color: 'white' }} className={'ml-1 wordbreak bg-primary rounded-pill font-weight-600 text-capitalize '}>
                                                                    {item?.sheetOrder?.order?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 p-0 my-2">
                                                            <hr className="m-0" />
                                                        </div>
                                                        <div class="col-lg-12 p-0 ">
                                                            <div class="row m-0 w-100" style={{ position: 'relative' }}>
                                                                {item?.sheetOrder?.order?.shopifyName && (
                                                                    <div style={{ position: 'absolute', right: 10 }}>
                                                                        <div class="row m-0 w-100 aign-items-center">
                                                                            <FaShopify class="mt-1 mr-1" /> {item?.sheetOrder?.order?.shopifyName}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-12 p-0 mb-0 text-capitalize">
                                                            <span style={{ fontWeight: 600 }}>{item?.sheetOrder?.order?.merchantCustomer?.customerName}</span>
                                                        </div>
                                                        <div class="col-lg-12 p-0 mb-1 text-capitalize">
                                                            <span style={{ fontWeight: 500, fontSize: '12px' }}>{item?.sheetOrder?.order?.merchantCustomer?.customer?.phone}</span>
                                                        </div>
                                                        <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                            <MdOutlineLocationOn class="mr-1" />
                                                            <span style={{ fontWeight: 400, fontSize: '13px' }}>
                                                                {item?.sheetOrder?.order?.address?.country}, {item?.sheetOrder?.order?.address?.city},{' '}
                                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                    {item?.sheetOrder?.order?.address?.streetAddress}, Building {item?.sheetOrder?.order?.address?.buildingNumber}, Floor{' '}
                                                                    {item?.sheetOrder?.order?.address?.apartmentFloor}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* {!props?.allowSelect && ( */}
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100 justify-content-end">
                                                    {item?.auditedBy && (
                                                        <div className="col-lg-6 p-0 mb-1 d-flex ">
                                                            <span class="d-flex align-items-center" style={{ fontWeight: 500, fontSize: '13px' }}>
                                                                <TbUserDollar class="mr-1" />
                                                                {item?.auditedBy?.name}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="col-lg-6 p-0 mb-1 d-flex justify-content-end">
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
                        </div>
                        //     )}
                        //     {/* <Pagespaginatecomponent
                        //     totaldatacount={FetchUsers?.data?.data?.total}
                        //     numofitemsperpage={FetchUsers?.data?.data?.per_page}
                        //     pagenumbparams={FetchUsers?.data?.data?.current_page}
                        //     nextpagefunction={(nextpage) => {
                        //         history.push({
                        //             pathname: '/users',
                        //             search: '&page=' + nextpage,
                        //         });
                        //     }}
                        // /> */}
                        // </>
                    )}
                </>
            )}

            <Modal
                show={transactionhistorymodal}
                onHide={() => {
                    settransactionhistorymodal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">History</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    settransactionhistorymodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <table style={{}} className={'table'}>
                            <thead>
                                <th>Status</th>
                                <th>Date</th>
                                <th>By</th>
                            </thead>
                            <tbody>
                                {transactionhistory?.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>
                                                {/* {transactionStatusTypeContext?.map((i, ii) => {
                                                    if (i.value == item.status) {
                                                        return ( */}
                                                <div
                                                    className={
                                                        item.status == 'completed'
                                                            ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 '
                                                            : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 '
                                                    }
                                                >
                                                    <p className={' m-0 p-0 wordbreak text-capitalize '}>
                                                        {item?.status?.split(/(?=[A-Z])/).join(' ')}
                                                        {/* {i.label} */}
                                                    </p>
                                                </div>
                                                {/* );
                                                    }
                                                })} */}
                                            </td>

                                            <td>
                                                <p className={' m-0 p-0 wordbreak '}>{item?.date}</p>
                                            </td>
                                            <td>
                                                <p className={' m-0 p-0 wordbreak '}>{item?.by}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={changestatusmodal}
                onHide={() => {
                    setchangestatusmodal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Update Transaction Status</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setchangestatusmodal(false);
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
                                    name: 'Status',
                                    attr: 'status',
                                    type: 'select',
                                    options: transactionStatusesSelectContext,
                                    size: '12',
                                },
                                { name: 'Description', attr: 'description', type: 'textarea', size: '12' },
                                { name: 'Receipt', attr: 'receipt', previewerAttr: 'previewerReceipt', type: 'image', size: '12' },
                            ]}
                            payload={statuspayload}
                            setpayload={setstatuspayload}
                            button1disabled={buttonLoadingContext}
                            button1class={generalstyles.roundbutton + '  mr-2 my-3 '}
                            button1placeholder={'Update status'}
                            button1onClick={async () => {
                                try {
                                    if (statuspayload?.status?.length != 0) {
                                        if (buttonLoadingContext) return;
                                        setbuttonLoadingContext(true);

                                        if (isAuth([1, 51])) {
                                            var { data } = await updateAnyFinancialTransactionMutation();
                                        } else {
                                            var { data } = await updateMyFinancialTransactionMutation();
                                        }
                                        if (data?.updateAnyFinancialTransaction?.success) {
                                            if (props?.refetchFunc) {
                                                props?.refetchFunc();
                                            }
                                            setchangestatusmodal(false);
                                        } else {
                                            NotificationManager.warning(data?.updateAnyFinancialTransaction?.message, 'Warning!');
                                        }
                                        setbuttonLoadingContext(false);
                                    } else {
                                        NotificationManager.warning('Choose Status First', 'Warning!');
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
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default TransactionsTable;
