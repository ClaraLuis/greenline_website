import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup, FaMoneyBill } from 'react-icons/fa';
import { components } from 'react-select';
import { GrUpdate } from 'react-icons/gr';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { IoMdClose, IoMdTime } from 'react-icons/io';
import { MdOutlineAccountCircle, MdOutlineCallMade, MdOutlineCallReceived } from 'react-icons/md';
import { TbFileDescription } from 'react-icons/tb';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';
import { FcCancel } from 'react-icons/fc';
import { FiCheckCircle } from 'react-icons/fi';
const { ValueContainer, Placeholder } = components;

const TransactionsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { transactionStatusesContext, transactionTypesContext, isAuth, transactionStatusesSelectContext } = useContext(Contexthandlerscontext);
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
                                    No Transactions
                                </div>
                            </div>
                        </div>
                    )}
                    {props?.query?.data[props?.paginationAttr]?.data?.length != 0 && (
                        <div class="row m-0 w-100">
                            {props?.query?.data[props?.paginationAttr]?.data?.map((item, index) => {
                                const selected = selectedArray.includes(item.id);
                                return (
                                    <div
                                        style={{ fontSize: '13px', cursor: props?.allowSelect ? 'pointer' : '', width: props?.width }}
                                        onClick={() => {
                                            if (props?.allowSelect) {
                                                handleSelect(item);
                                            }
                                        }}
                                        className="p-1 pb-0"
                                    >
                                        <div class={generalstyles.card + ' p-2 px-3 row m-0 w-100 allcentered'}>
                                            <div className="col-lg-3 p-0">
                                                <span style={{ fontWeight: 700, fontSize: '16px' }} class=" d-flex align-items-center">
                                                    {/* <FaMoneyBill class="mr-1" /> */}
                                                    {item?.amount}
                                                </span>
                                            </div>
                                            {/* <div className="col-lg-6 p-0 d-flex justify-content-end align-items-center">
                                                <div class="row m-0 w-100 d-flex justify-content-end align-items-center">
                                                    <div class="col-lg-12 p-0 d-flex justify-content-end align-items-center mb-1 ">
                                                        {transactionStatusesContext?.map((i, ii) => {
                                                            if (i.value == item.status) {
                                                                return (
                                                                    <div
                                                                        style={{ cursor: props?.srctype == 'recieved' ? 'pointer' : '' }}
                                                                        className={
                                                                            item.status == 'completed'
                                                                                ? ' wordbreak text-success bg-light-success rounded-pill  '
                                                                                : item?.status == 'cancelled' ||
                                                                                  item?.status == 'failed' ||
                                                                                  item?.status == 'rejectedByReceiver' ||
                                                                                  item?.status == 'cancelledBySender' ||
                                                                                  item?.status == 'cancelledByReceiver' ||
                                                                                  item?.status == 'rejectedBySender' ||
                                                                                  item?.status == 'rejected'
                                                                                ? ' wordbreak text-danger bg-light-danger rounded-pill '
                                                                                : ' wordbreak text-warning bg-light-warning rounded-pill  '
                                                                        }
                                                                    >
                                                                        <p className={' m-0 p-0 wordbreak '}>{i.label}</p>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                    <div class="col-lg-12 p-0 d-flex justify-content-end align-items-center ">
                                                        <div className={' wordbreak text-success bg-light-success rounded-pill allcentered  '}>
                                                            {transactionTypesContext?.map((i, ii) => {
                                                                if (i.value == item?.type) {
                                                                    return <span>{i.label}</span>;
                                                                }
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="col-lg-9 p-0 d-flex justify-content-end align-items-center">
                                                <div class="row m-0 w-100 d-flex justify-content-end align-items-center">
                                                    {transactionStatusesContext?.map((i, ii) => {
                                                        if (i.value == item.status) {
                                                            return (
                                                                <div
                                                                    style={{ cursor: props?.srctype == 'recieved' ? 'pointer' : '' }}
                                                                    className={
                                                                        item.status == 'completed'
                                                                            ? ' wordbreak text-success bg-light-success rounded-pill  '
                                                                            : item?.status == 'cancelled' ||
                                                                              item?.status == 'failed' ||
                                                                              item?.status == 'rejectedByReceiver' ||
                                                                              item?.status == 'cancelledBySender' ||
                                                                              item?.status == 'cancelledByReceiver' ||
                                                                              item?.status == 'rejectedBySender' ||
                                                                              item?.status == 'rejected'
                                                                            ? ' wordbreak text-danger bg-light-danger rounded-pill '
                                                                            : ' wordbreak text-warning bg-light-warning rounded-pill  '
                                                                    }
                                                                >
                                                                    <p className={' m-0 p-0 wordbreak '}>{i.label}</p>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                    <div className={' wordbreak text-success bg-light-success rounded-pill allcentered mx-1'}>
                                                        {transactionTypesContext?.map((i, ii) => {
                                                            if (i.value == item?.type) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })}
                                                    </div>
                                                    {props?.srctype == 'recieved' && (
                                                        <button
                                                            onClick={() => {
                                                                setstatuspayload({ ...statuspayload, id: item?.id });
                                                                setchangestatusmodal(true);
                                                            }}
                                                            style={{
                                                                height: '30px',
                                                                width: '30px',
                                                            }}
                                                            class={' iconhover allcentered '}
                                                        >
                                                            <GrUpdate />
                                                        </button>
                                                    )}
                                                    {props?.srctype == 'sent' && item?.status == 'pendingReceiver' && (
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
                                                            style={{
                                                                height: '30px',
                                                                width: '30px',
                                                            }}
                                                            class={' iconhover allcentered '}
                                                        >
                                                            <FcCancel size={25} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 p-0 my-2">
                                                <hr className="m-0" />
                                            </div>
                                            {props?.srctype == 'all' && (
                                                <>
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#4C8CF5' }}>
                                                            <MdOutlineCallMade class="mr-1" />
                                                            {item?.fromAccount?.name ?? '-'}
                                                        </span>
                                                    </div>{' '}
                                                    <div className="col-lg-12 p-0 mb-1">
                                                        <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#1EC000' }}>
                                                            <MdOutlineCallReceived class="mr-1" />
                                                            {item?.toAccount?.name ?? '-'}
                                                        </span>
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
                                                        <span class="d-flex align-items-center" style={{ fontWeight: 600, color: '#1EC000' }}>
                                                            <MdOutlineCallReceived class="mr-1" />
                                                            {item?.toAccount?.name ?? '-'}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {props?.srctype != 'all' && props?.srctype != 'courierCollection' && (
                                                <div className="col-lg-12 p-0 mb-1">
                                                    <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                                        <MdOutlineAccountCircle class="mr-1" />
                                                        {props?.srctype == 'recieved' ? item?.fromAccount?.name ?? '-' : item?.toAccount?.name ?? '-'}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="col-lg-12 p-0 mb-1">
                                                <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                                    <TbFileDescription class="mr-1" />
                                                    {item?.description}
                                                </span>
                                            </div>
                                            {props?.allowSelect && selected && (
                                                <div
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        position: 'absolute',
                                                        right: 15,
                                                        bottom: 30,
                                                    }}
                                                    className=" allcentered"
                                                >
                                                    <FiCheckCircle style={{ transition: 'all 0.4s' }} color={selected ? 'var(--success)' : ''} size={18} />
                                                </div>
                                            )}
                                            {!props?.allowSelect && (
                                                <div className="col-lg-12 p-0 mb-1 d-flex justify-content-end">
                                                    <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                                        <IoMdTime class="mr-1" />
                                                        {item?.createdAt}
                                                    </span>
                                                </div>
                                            )}
                                            {/* <div class="col-lg-12 p-0 allcentered">
                                                {props?.srctype == 'recieved' && (
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
                                                {props?.srctype == 'sent' && item?.status == 'pendingReceiver' && (
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
                                                {transactionStatusesContext?.map((i, ii) => {
                                                    if (i.value == item.status) {
                                                        return (
                                                            <div
                                                                className={
                                                                    item.status == 'completed'
                                                                        ? ' wordbreak text-success bg-light-success rounded-pill  '
                                                                        : ' wordbreak text-warning bg-light-warning rounded-pill  '
                                                                }
                                                            >
                                                                <p className={' m-0 p-0 wordbreak '}>{i.label}</p>
                                                            </div>
                                                        );
                                                    }
                                                })}
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
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 my-3 '}
                            button1placeholder={'Update status'}
                            button1onClick={async () => {
                                try {
                                    if (statuspayload?.status?.length != 0) {
                                        if (isAuth([1, 51])) {
                                            var { data } = await updateAnyFinancialTransactionMutation();
                                        } else {
                                            var { data } = await updateMyFinancialTransactionMutation();
                                        }
                                        if (data?.updateAnyFinancialTransaction?.success) {
                                            props?.refetchFunc();
                                            setchangestatusmodal(false);
                                        } else {
                                            NotificationManager.warning(data?.updateAnyFinancialTransaction?.message, 'Warning!');
                                        }
                                    } else {
                                        NotificationManager.warning('Choose Status First', 'Warning!');
                                    }
                                } catch (error) {
                                    NotificationManager.warning(error, 'Warning!');
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
