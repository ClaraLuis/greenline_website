import React, { useContext, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaEllipsisV, FaLayerGroup } from 'react-icons/fa';
import { IoMdClose, IoMdTime } from 'react-icons/io';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { NotificationManager } from 'react-notifications';
import Form from '../../Form.js';
import API from '../../../API/API.js';

const { ValueContainer, Placeholder } = components;

const SheetsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { courierSheetStatusesContext, dateformatter, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { deleteCourierSheet, useMutationNoInputGQL } = API();
    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changestatusmodal, setchangestatusmodal] = useState(false);
    const [sheetID, setsheetID] = useState(undefined);

    const [statuspayload, setstatuspayload] = useState({
        sheetID: '',
        status: '',
    });
    const [deleteCourierSheetMutation] = useMutationNoInputGQL(deleteCourierSheet(), { id: sheetID });

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
                                className="col-lg-4"
                                // style={{ cursor: props?.clickable ? 'pointer' : '' }}
                            >
                                <div style={{ background: 'white' }} class={generalstyles.card + '  row  w-100 '}>
                                    <div class="col-lg-12 p-0">
                                        <div class="row m-0 w-100 d-flex align-items-end">
                                            <div className="col-lg-4 p-0">
                                                <span style={{ fontSize: '12px', color: 'grey' }}># {item?.id}</span>
                                                <br />
                                                <span style={{ fontWeight: 600, fontSize: '12px' }} class="text-capitalize">
                                                    {item?.userInfo?.name}{' '}
                                                </span>
                                            </div>
                                            <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                    <div
                                                        className={
                                                            item.status == 'completed'
                                                                ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered text-capitalize '
                                                                : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered text-capitalize'
                                                        }
                                                    >
                                                        {/* {courierSheetStatusesContext?.map((i, ii) => {
                                                            if (i.value == item?.status) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })} */}
                                                        {item?.status?.split(/(?=[A-Z])/).join(' ')}
                                                    </div>
                                                    {(parseInt(item?.orderCount) == 0 || item.status == 'idle') && (
                                                        <Dropdown>
                                                            <Dropdown.Toggle>
                                                                <div
                                                                    class="iconhover allcentered ml-1"
                                                                    style={{
                                                                        color: 'var(--primary)',
                                                                        // borderRadius: '10px',
                                                                        width: '28px',
                                                                        height: '28px',
                                                                        transition: 'all 0.4s',
                                                                    }}
                                                                >
                                                                    <FaEllipsisV />
                                                                </div>
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu style={{ minWidth: '170px', fontSize: '12px' }}>
                                                                {parseInt(item?.orderCount) == 0 && (
                                                                    <Dropdown.Item
                                                                        onClick={async () => {
                                                                            if (!buttonLoadingContext) {
                                                                                if (buttonLoadingContext) return;
                                                                                setbuttonLoadingContext(true);
                                                                                await setsheetID(item?.id);
                                                                                try {
                                                                                    const { data } = await deleteCourierSheetMutation();

                                                                                    if (data?.deleteCourierSheet?.success == true) {
                                                                                        if (props?.refetchCourierSheets) {
                                                                                            props?.refetchCourierSheets();
                                                                                        }
                                                                                        NotificationManager.success('', 'Success');
                                                                                    } else {
                                                                                        NotificationManager.warning(data?.deleteCourierSheet?.message, 'Warning!');
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
                                                                            }
                                                                        }}
                                                                        class="py-2"
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>
                                                                            {buttonLoadingContext && <CircularProgress color="var(--primary)" width="15px" height="15px" duration="1s" />}
                                                                            {!buttonLoadingContext && <span>Delete Manifest</span>}
                                                                        </p>
                                                                    </Dropdown.Item>
                                                                )}
                                                                {item.status == 'idle' && (
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            history.push('/addsheet?sheetId=' + item?.id);
                                                                        }}
                                                                        class="py-2"
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}> Add orders</p>
                                                                    </Dropdown.Item>
                                                                )}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    )}
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
                                                    if (isAuth([1, 34, 35, 53, 51])) {
                                                        if (props?.clickable) {
                                                            props?.onClick(item);
                                                        }
                                                    } else {
                                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                                    }
                                                }}
                                            >
                                                View Manifest
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
            {props?.fetchSheetsQuery?.data?.paginateCourierSheets?.data?.length == 0 && (
                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                    <div class="row m-0 w-100">
                        <FaLayerGroup size={40} class=" col-lg-12" />
                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                            No Sheets
                        </div>
                    </div>
                </div>
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
                            <div className="row w-100 m-0 p-0">Update Manifest Status</div>
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
                                    options: courierSheetStatusesContext,
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
