import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
// import { useMutation } from 'react-query';
import { components } from 'react-select';
import { FaLayerGroup } from 'react-icons/fa';

import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import SubmitButton from '../../Form.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import AddEditSecuritylayers from '../Securitylayers/AddEditSecuritylayers.js';

const { ValueContainer, Placeholder } = components;

const ItemInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { UserMutation_API, DeleteUserMutation_API, useQueryGQL, useMutationGQL, addUser } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [newpassword, setnewpassword] = useState('');

    const [itemsarray, setitemsarray] = useState([
        { type: 'import', count: 15, inventory: 'inv 1' },
        { type: 'export', count: 30, inventory: 'inv 1' },
        { type: 'import', count: 15, inventory: 'inv 3' },
        { type: 'export', count: 30, inventory: 'inv 3' },
        { type: 'export', count: 30, inventory: 'inv 3' },
    ]);

    return (
        <>
            <Modal
                show={props?.openModal}
                onHide={() => {
                    props?.setopenModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0 d-flex align-items-center">Item History</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    props?.setopenModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ fontSize: '14px' }} class="row m-0 w-100 pb-2">
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                            {props?.fetchItemHistoryQuery?.loading && (
                                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                </div>
                            )}
                            {!props?.fetchItemHistoryQuery?.loading && (
                                <>
                                    {props?.fetchItemHistoryQuery?.paginateItemHistory?.data?.length == 0 && (
                                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div class="row m-0 w-100">
                                                <FaLayerGroup size={40} class=" col-lg-12" />
                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No History
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {props?.fetchItemHistoryQuery?.paginateItemHistory?.data?.length != 0 && (
                                        <table style={{}} className={'table text-capitalize'}>
                                            <thead>
                                                <th>Amount</th>
                                                <th style={{ minWidth: '400px' }}>Description</th>
                                            </thead>
                                            <tbody>
                                                {props?.fetchItemHistoryQuery?.paginateItemHistory?.data?.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.amount}</p>
                                                            </td>
                                                            <td style={{ minWidth: '400px' }}>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.description}</p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                    {/* <Pagespaginatecomponent
                                totaldatacount={props?.fetchItemHistoryQuery?.data?.total}
                                numofitemsperpage={props?.fetchItemHistoryQuery?.data?.per_page}
                                pagenumbparams={props?.fetchItemHistoryQuery?.data?.current_page}
                                nextpagefunction={(nextpage) => {
                                    history.push({
                                        pathname: '/users',
                                        search: '&page=' + nextpage,
                                    });
                                }}
                            /> */}
                                </>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default ItemInfo;
