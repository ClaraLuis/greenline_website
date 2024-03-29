import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { Modal } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import { IoMdClose } from 'react-icons/io';
import Form from '../../Form.js';

const { ValueContainer, Placeholder } = components;

const OrdersTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { orderStatusesContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [selectedinventory, setselectedinventory] = useState('');
    const [changestatusmodal, setchangestatusmodal] = useState(false);
    const [submit, setsubmit] = useState(false);

    const [itemsarray, setitemsarray] = useState([
        { id: '1', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1', status: 'idle' },
        { id: '2', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1', status: 'shippedFromCourier' },
        { id: '3', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1', status: 'delivered' },
        { id: '4', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1', status: 'failedDeliveryAttempt' },
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

    const [statuspayload, setstatuspayload] = useState({
        orderid: '',
        status: '',
    });

    const fetchusers = useQueryGQL('', fetchUsers());
    // const fetchusers = [];

    return (
        <>
            {props?.fetchIdleOrdersQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {/* {!fetchusers?.loading && fetchusers?.data != undefined && (
                <>
                    {fetchusers?.data?.paginateUsers?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Orders
                                </div>
                            </div>
                        </div>
                    )}
                    {fetchusers?.data?.length != 0 && ( */}
            <table style={{}} className={props?.clickable ? 'table table_hover' : 'table'}>
                <thead>
                    <th>Order#</th>

                    <th>Items count</th>

                    <th>Status</th>
                </thead>
                <tbody>
                    {props?.fetchIdleOrdersQuery?.data?.fetchIdleOrdersQuery?.data?.map((item, index) => {
                        return (
                            <tr
                                onClick={() => {
                                    if (props?.clickable) {
                                        props?.actiononclick(item);
                                    }
                                }}
                            >
                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                </td>
                                <td>
                                    <p className={' m-0 p-0 wordbreak  '}>{item?.items?.length}</p>
                                    {/* <p className={' m-0 p-0 wordbreak text-secondaryhover '}>5</p> */}
                                </td>

                                <td>
                                    <div
                                        onClick={() => {
                                            setchangestatusmodal(true);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        className={
                                            // item.status == 'delivered'
                                            //     ? ' wordbreak text-success bg-light-success rounded-pill  '
                                            //     : item?.status == 'postponed' || item?.status == 'failedDeliveryAttempt'
                                            //     ? ' wordbreak text-danger bg-light-danger rounded-pill  '
                                            //     :
                                            ' wordbreak text-warning bg-light-warning rounded-pill  '
                                        }
                                    >
                                        {/* {orderStatusesContext?.map((i, ii) => {
                                            if (i.value == item?.status) {
                                                return <span>{i.label}</span>;
                                            }
                                        })} */}
                                        Idle
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {/* )} */}
            {/* <Pagespaginatecomponent
                                totaldatacount={FetchUsers?.data?.data?.total}
                                numofitemsperpage={FetchUsers?.data?.data?.per_page}
                                pagenumbparams={FetchUsers?.data?.data?.current_page}
                                nextpagefunction={(nextpage) => {
                                    history.push({
                                        pathname: '/users',
                                        search: '&page=' + nextpage,
                                    });
                                }}
                            />
                </>
            )} */}

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
                            <div className="row w-100 m-0 p-0">Update Order Status</div>
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
                                    options: orderStatusesContext,
                                    size: '12',
                                },
                            ]}
                            payload={statuspayload}
                            setpayload={setstatuspayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                            button1placeholder={'Update status'}
                            button1onClick={() => {
                                setchangestatusmodal(false);
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default OrdersTable;
