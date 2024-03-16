import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { Modal } from 'react-bootstrap';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import { IoMdArrowDown, IoMdArrowUp, IoMdClose } from 'react-icons/io';
import { MdHistory } from 'react-icons/md';

const { ValueContainer, Placeholder } = components;

const TransactionsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { transactionStatusesContext, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [transactionhistory, settransactionhistory] = useState([
        { status: 'pendingSender', date: '3/16/2024', by: 'user 1' },
        { status: 'pendingReceiver', date: '4/16/2024', by: 'user 1' },
        { status: 'completed', date: '10/16/2024', by: 'user 1' },
    ]);
    const [transactionhistorymodal, settransactionhistorymodal] = useState(false);
    const [itemsarray, setitemsarray] = useState([
        { id: '1', type: 'deposit', description: 'money 123', fromAccount: 'Account 1', toAccount: 'Account 2', amount: '1000', receipt: 'receipt', status: 'pendingSender', approvedBy: 'user 1' },
        {
            id: '2',
            type: 'withdrawal',
            description: 'money 123',
            fromAccount: 'Account 2',
            toAccount: 'Account 3',
            amount: '20000',
            receipt: 'receipt',
            status: 'pendingReceiver',
            approvedBy: 'user 2',
        },
    ]);

    const [leadpayload, setleadpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: '',
        phone: '',
        email: '',
        birthdate: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    const fetchusers = useQueryGQL('', fetchUsers());
    // const fetchusers = [];

    return (
        <>
            {/*       
      {fetchusers?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!fetchusers?.loading && fetchusers?.data != undefined && (
                            <>
                                {fetchusers?.data?.paginateUsers?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Users
                                            </div>
                                        </div>
                                    </div>
                                )} */}
            {fetchusers?.data?.length != 0 && (
                <table style={{}} className={'table'}>
                    <thead>
                        <th>#</th>

                        <th>Type</th>
                        <th>Description</th>
                        <th>From Account</th>
                        <th>To Account</th>
                        <th>Ammount</th>
                        <th>Reciept</th>
                        <th>Status</th>
                        <th>Approved by</th>
                        <th>History</th>
                    </thead>
                    <tbody>
                        {itemsarray?.map((item, index) => {
                            return (
                                <tr>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.type}</p>
                                    </td>

                                    {/* <td>
                                        <p
                                            className={
                                                item?.inandout == 'out' ? ' text-danger m-0 p-0 wordbreak d-flex align-items-center ' : ' text-success m-0 p-0 wordbreak d-flex align-items-center'
                                            }
                                        >
                                            {item?.type}
                                            {item?.inandout == 'out' ? <IoMdArrowDown className="mx-1" /> : <IoMdArrowUp className="mx-1" />}
                                        </p>
                                    </td> */}
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.description}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.fromAccount}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.toAccount}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.amount}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.receipt}</p>
                                    </td>
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
                                        <p className={' m-0 p-0 wordbreak '}>{item?.approvedBy}</p>
                                    </td>
                                    <td>
                                        {/* <p className={' m-0 p-0 wordbreak '}>{item?.approvedBy}</p> */}
                                        <MdHistory
                                            onClick={() => {
                                                settransactionhistorymodal(true);
                                            }}
                                            class="text-primary text-secondaryhover"
                                            size={20}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
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
        </>
    );
};
export default TransactionsTable;
