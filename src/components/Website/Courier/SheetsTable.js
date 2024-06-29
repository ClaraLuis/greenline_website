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
import { IoMdClose, IoMdTime } from 'react-icons/io';
import { Modal } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';

const { ValueContainer, Placeholder } = components;

const SheetsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { sheetStatusesContext, dateformatter, isAuth } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    const [submit, setsubmit] = useState(false);
    const [changestatusmodal, setchangestatusmodal] = useState(false);

    const [statuspayload, setstatuspayload] = useState({
        sheetID: '',
        status: '',
    });
    const [itemsarray, setitemsarray] = useState([
        { id: '1', courier: 'courier 1', orderscount: '5', status: 'inProgress', moneyTobeCollected: '1000' },
        { id: '2', courier: 'courier 2', orderscount: '15', status: 'waitingForAdminApproval', moneyTobeCollected: '500' },
        { id: '3', courier: 'courier 3', orderscount: '10', status: 'completed', moneyTobeCollected: '10000' },
    ]);

    const [payload, setpayload] = useState({
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

    return (
        <>
            {props?.fetchSheetsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}

            {props?.fetchSheetsQuery?.data?.paginateCourierSheets?.data?.length != 0 && (
                <>
                    {props?.fetchSheetsQuery?.data?.paginateCourierSheets?.data?.map((item, index) => {
                        return (
                            <div
                                className="col-lg-4 p-1"
                                // style={{ cursor: props?.clickable ? 'pointer' : '' }}
                            >
                                <div style={{ background: 'white' }} class={' p-3 row m-0 w-100 card'}>
                                    <div class="col-lg-12 p-0">
                                        <div class="row m-0 w-100 d-flex align-items-end">
                                            <div className="col-lg-4 p-0">
                                                <span style={{ fontSize: '12px', color: 'grey' }}># {item?.id}</span>
                                                <br />
                                                <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                    {item?.userInfo?.name}{' '}
                                                </span>
                                            </div>
                                            <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                <div
                                                    className={
                                                        item.status == 'completed'
                                                            ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  '
                                                            : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered '
                                                    }
                                                >
                                                    {sheetStatusesContext?.map((i, ii) => {
                                                        if (i.value == item?.status) {
                                                            return <span>{i.label}</span>;
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 p-0 my-2">
                                        <hr className="m-0" />
                                    </div>

                                    <div className="col-lg-6 p-0 mb-2">
                                        <span style={{ fontWeight: 600 }}>{item?.orderCount}</span> Orders
                                    </div>
                                    <div class="col-lg-6 p-0 mb-2 d-flex justify-content-end">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 400, color: 'grey', fontSize: '10px' }}>
                                            <IoMdTime class="mr-1" />
                                            {dateformatter(item?.createdAt)}
                                        </span>
                                    </div>
                                    {props?.clickable && (
                                        <div class="col-lg-12 allcentered">
                                            <button
                                                style={{ height: '30px' }}
                                                class={generalstyles.roundbutton + ' p-0 allcentered'}
                                                onClick={() => {
                                                    if (isAuth([1, 34, 35, 53])) {
                                                        if (props?.clickable) {
                                                            props?.onClick(item);
                                                        }
                                                    } else {
                                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                                    }
                                                }}
                                            >
                                                View Sheet
                                            </button>
                                        </div>
                                    )}

                                    {/* <div className="col-lg-12 p-0 d-flex justify-content-end ">
                                        <div
                                            onClick={() => {
                                                var temp = { ...sheetpayload };
                                                var exist = false;
                                                var chosenindex = null;
                                                temp.orders.map((i, ii) => {
                                                    if (i.id == item.id) {
                                                        exist = true;
                                                        chosenindex = ii;
                                                    }
                                                });
                                                if (!exist) {
                                                    temp.orders.push(item);
                                                } else {
                                                    temp.orders.splice(chosenindex, 1);
                                                }
                                                setsheetpayload({ ...temp });
                                            }}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                            }}
                                            className="iconhover allcentered"
                                        >
                                            <FiCheckCircle style={{ transition: 'all 0.4s' }} color={selected ? 'var(--success)' : ''} size={20} />
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}

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
                            <div className="row w-100 m-0 p-0">Update Sheet Status</div>
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
                                    options: sheetStatusesContext,
                                    size: '12',
                                },
                            ]}
                            payload={statuspayload}
                            setpayload={setstatuspayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
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
export default SheetsTable;
