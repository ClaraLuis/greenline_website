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

const TransactionsTableView = (props) => {
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
                        <div style={{ maxHeight: '400px' }} className="table-responsive">
                            <table className="table table-hover">
                                <thead style={{ position: 'sticky', top: '0px' }}>
                                    <tr>
                                        <th>ID</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Type</th>
                                        {props?.srctype === 'all' && <th>From</th>}
                                        {props?.srctype === 'all' && <th>To</th>}
                                        {props?.srctype !== 'all' && props?.allowAction != false && <th>Account</th>}
                                        {(props?.srctype === 'all' || props?.srctype === 'courierCollection') && <th>Order</th>}
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props?.query?.data[props?.paginationAttr]?.data?.map((item, index) => {
                                        const selected = selectedArray?.includes(item.id);

                                        return (
                                            <tr
                                                key={item.id}
                                                style={{ cursor: props?.allowSelect ? 'pointer' : 'default', background: selected ? 'var(--secondary)' : '' }}
                                                onClick={() => props?.allowSelect && handleSelect(item)}
                                                className={selected ? 'table-active' : ''}
                                            >
                                                <td>#{item?.id}</td>
                                                {props?.amountCondition && (
                                                    <td>
                                                        {item?.type != 'merchantOrderPayment' ? '-' : ''} {item?.amount} {item?.currency}
                                                    </td>
                                                )}
                                                {!props?.amountCondition && (
                                                    <td>
                                                        {item?.amount} {item?.currency}
                                                    </td>
                                                )}

                                                <td>
                                                    {item?.status && (
                                                        <span
                                                            className={`badge text-capitalize ${
                                                                item.status === 'completed'
                                                                    ? 'bg-light-success text-success'
                                                                    : item?.status === 'cancelled' ||
                                                                      item?.status === 'failed' ||
                                                                      item?.status === 'rejectedByReceiver' ||
                                                                      item?.status === 'cancelledBySender' ||
                                                                      item?.status === 'cancelledByReceiver' ||
                                                                      item?.status === 'rejectedBySender' ||
                                                                      item?.status === 'rejected'
                                                                    ? 'bg-light-danger text-danger'
                                                                    : 'bg-light-warning text-warning'
                                                            }`}
                                                        >
                                                            {item?.status?.split(/(?=[A-Z])/).join(' ')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span style={{ color: 'white' }} className="badge bg-primary text-capitalize">
                                                        {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                    </span>
                                                </td>

                                                {props?.srctype === 'all' && (
                                                    <td>
                                                        <div className="d-flex flex-column">
                                                            <small className="text-primary">
                                                                <MdOutlineCallMade className="me-1" />
                                                                {item?.fromAccount?.name ?? '-'}
                                                            </small>
                                                        </div>
                                                    </td>
                                                )}
                                                {props?.srctype === 'all' && (
                                                    <td>
                                                        <div className="d-flex flex-column">
                                                            <small className="text-success">
                                                                <MdOutlineCallReceived className="me-1" />
                                                                {item?.toAccount?.name ?? '-'}
                                                            </small>
                                                        </div>
                                                    </td>
                                                )}

                                                {props?.srctype !== 'all' && props?.allowAction != false && (
                                                    <td>
                                                        {item?.toAccount?.id === props?.accountId ? (
                                                            <span className="text-primary">
                                                                <MdOutlineAccountCircle className="me-1" />
                                                                {item?.fromAccount?.name ?? '-'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-success">
                                                                <MdOutlineAccountCircle className="me-1" />
                                                                {item?.toAccount?.name ?? '-'}
                                                            </span>
                                                        )}
                                                    </td>
                                                )}

                                                {(props?.srctype === 'all' || props?.srctype === 'courierCollection') && (
                                                    <td>
                                                        {item?.sheetOrder?.order?.id && (
                                                            <>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="badge bg-secondary p-0 mr-1">
                                                                        #{item?.sheetOrder?.order?.id}
                                                                        {item?.sheetOrder?.order?.merchant?.name && <span className="text-muted">, {item?.sheetOrder?.order?.merchant?.name}</span>}
                                                                    </span>
                                                                    <span
                                                                        className={`badge text-capitalize ${
                                                                            item?.sheetOrder?.order?.status === 'delivered' ||
                                                                            item?.sheetOrder?.order?.status === 'partiallyDelivered' ||
                                                                            item?.sheetOrder?.order?.status === 'returned' ||
                                                                            item?.sheetOrder?.order?.status === 'partiallyReturned'
                                                                                ? 'bg-light-success text-success'
                                                                                : item?.sheetOrder?.order?.status === 'cancelled' || item?.sheetOrder?.order?.status === 'failedDeliveryAttempt'
                                                                                ? 'bg-light-danger text-danger'
                                                                                : 'bg-light-warning text-warning'
                                                                        }`}
                                                                    >
                                                                        {item?.sheetOrder?.order?.status?.split(/(?=[A-Z])/).join(' ')}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                )}

                                                <td>
                                                    <small className="text-muted">
                                                        <IoMdTime className="me-1" />
                                                        {dateformatter(item?.createdAt)}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        {props?.allowAction != false && (
                                                            <>
                                                                {item?.toAccount?.id === props?.accountId && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (props?.srctype === 'expenses' && !isAuth([1, 51, 24])) {
                                                                                NotificationManager.warning('Not Authorized', 'Warning!');
                                                                                return;
                                                                            }
                                                                            setstatuspayload({ ...statuspayload, id: item?.id });
                                                                            setchangestatusmodal(true);
                                                                        }}
                                                                        className="btn btn-sm btn-icon"
                                                                        title="Edit"
                                                                    >
                                                                        <TbEdit size={18} />
                                                                    </button>
                                                                )}

                                                                {item?.fromAccount?.id === props?.accountId && item?.status === 'pendingReceiver' && (
                                                                    <button
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            await setstatuspayload({ ...statuspayload, id: item?.id, status: 'cancel' });
                                                                            if (window.confirm('Are you sure you want to cancel this transaction')) {
                                                                                if (buttonLoadingContext) return;
                                                                                setbuttonLoadingContext(true);
                                                                                const { data } = isAuth([1, 51])
                                                                                    ? await updateAnyFinancialTransactionMutation()
                                                                                    : await updateMyFinancialTransactionMutation();

                                                                                if (data?.updateAnyFinancialTransaction?.success) {
                                                                                    props?.refetchFunc?.();
                                                                                } else {
                                                                                    NotificationManager.warning(data?.updateAnyFinancialTransaction?.message, 'Warning!');
                                                                                }
                                                                                setbuttonLoadingContext(false);
                                                                            }
                                                                        }}
                                                                        className="btn btn-sm btn-icon"
                                                                        title="Cancel"
                                                                        disabled={buttonLoadingContext}
                                                                    >
                                                                        <FcCancel size={18} />
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                        {props?.hasOrder && item?.sheetOrder?.order?.id && (
                                                            <Dropdown onClick={(e) => e.stopPropagation()}>
                                                                <Dropdown.Toggle variant="link" className="btn btn-sm btn-icon">
                                                                    <FaEllipsisV />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            await setchosenOrderContext(item?.sheetOrder?.order);
                                                                            history.push(`/orderinfo?type=merchant&orderId=` + item?.sheetOrder?.order?.id);
                                                                        }}
                                                                    >
                                                                        View order
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
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
                        <table className="table table-hover">
                            <thead style={{ position: 'sticky', top: '0px' }}>
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
export default TransactionsTableView;
