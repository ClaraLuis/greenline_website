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
import { IoMdClose } from 'react-icons/io';
import { Modal } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import Form from '../../Form.js';

const { ValueContainer, Placeholder } = components;

const SheetsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { sheetStatusesContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [submit, setsubmit] = useState(false);
    const [changestatusmodal, setchangestatusmodal] = useState(false);

    const [statuspayload, setstatuspayload] = useState({
        sheetID: '',
        status: '',
    });
    const [itemsarray, setitemsarray] = useState([
        { id: '1', user: 'user 1', orderscount: '5', status: 'inProgress', moneyTobeCollected: '1000' },
        { id: '2', user: 'user 2', orderscount: '15', status: 'waitingForAdmin', moneyTobeCollected: '500' },
        { id: '3', user: 'user 3', orderscount: '10', status: 'complete', moneyTobeCollected: '10000' },
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
                <table style={{}} className={props?.clickable ? 'table table_hover' : 'table'}>
                    <thead>
                        <th style={{ minWidth: '100px', maxWidth: '100px' }}>#</th>
                        <th>User</th>

                        <th>Orders count</th>
                        <th>Money To Be Collected</th>

                        <th>Status</th>
                    </thead>
                    <tbody>
                        {itemsarray?.map((item, index) => {
                            return (
                                <tr
                                    onClick={() => {
                                        if (props?.clickable) {
                                            history.push('/couriersheet');
                                        }
                                    }}
                                >
                                    <td style={{ minWidth: '100px', maxWidth: '100px' }}>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.user}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.orderscount}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.moneyTobeCollected}</p>
                                    </td>
                                    <td>
                                        <div
                                            onClick={() => {
                                                setchangestatusmodal(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                            className={
                                                item.status == 'complete' ? ' wordbreak text-success bg-light-success rounded-pill  ' : ' wordbreak text-warning bg-light-warning rounded-pill  '
                                            }
                                        >
                                            {sheetStatusesContext?.map((i, ii) => {
                                                if (i.value == item?.status) {
                                                    return <p className={' m-0 p-0 wordbreak '}>{i.label}</p>;
                                                }
                                            })}
                                        </div>
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
export default SheetsTable;
