import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { components } from 'react-select';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';

const { ValueContainer, Placeholder } = components;

const BatchScan = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, user, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, updateupdateOrderIdsStatus, addCourierSheet, updateOrdersInCourierSheet, useMutationGQL, fetchCouriers, fetchCourierSheet, useLazyQueryGQL, fetchHubs } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [fetchCourierSheetQuery, setfetchCourierSheetQuery] = useState({});
    const [submit, setsubmit] = useState(false);
    const [changestatusmodal, setchangestatusmodal] = useState(false);
    const [sheetpayload, setsheetpayload] = useState({
        functype: 'add',
        name: '',
        courier: '',
        orders: [],
        orderIds: [],
    });

    const [search, setsearch] = useState('');
    const [assignOpenModal, setassignOpenModal] = useState(false);

    useEffect(() => {
        setpageactive_context(window.location.pathname);
        setpagetitle_context('Hubs');
    }, []);
    const [updateupdateOrderIdsStatusMutation] = useMutationGQL(updateupdateOrderIdsStatus(), {
        status: sheetpayload?.status,
        ids: sheetpayload?.orderIds,
    });
    const [ordersWithDetails, setordersWithDetails] = useState([]);
    const [barcode, setBarcode] = useState('');
    const handleOrderStatusChange = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
        if (sheetpayload?.orderIds?.length != 0 && sheetpayload?.status?.length != 0 && sheetpayload?.status) {
            try {
                const { data } = await updateupdateOrderIdsStatusMutation();
                if (data?.updateOrdersStatus?.success == true) {
                    NotificationManager.success('Orders status updated successfully', 'Success');
                    setchangestatusmodal(false);
                } else {
                    NotificationManager.warning(data?.updateOrdersStatus?.message, 'Warning!');
                }
            } catch (error) {
                // alert(JSON.stringify(error));
                let errorMessage = 'An unexpected error occurred';
                // // Check for GraphQL errors
                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                } else if (error.networkError) {
                    errorMessage = error.networkError.message || errorMessage;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                NotificationManager.warning(errorMessage, 'Warning!');
            }
        }

        setbuttonLoadingContext(false);
    };
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return; // Don't process barcode scanning when typing in an input field
            }

            if (e.key === 'Enter') {
                var temp = { ...sheetpayload };
                var exist = false;
                temp.orderIds.map((i, ii) => {
                    if (i == barcode) {
                        exist = true;
                    }
                });
                temp?.orderIdsOld?.map((i, ii) => {
                    if (i == search) {
                        exist = true;
                    }
                });
                if (!exist) {
                    if (barcode?.length != 0 && !isNaN(parseInt(barcode))) {
                        temp.orderIds.push(parseInt(barcode));
                    } else {
                        NotificationManager.warning('Order has to be numbers', 'Warning!');
                    }
                } else {
                    NotificationManager.warning('Order already added', 'Warning!');
                }
                setsheetpayload({ ...temp });

                // setsearch(barcode); // Update the search state with the scanned barcode
                setBarcode('');
                setsearch(''); // Clear the barcode state
            } else {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class="col-lg-10 p-0 ">
                            <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                <input
                                    type="number"
                                    class={formstyles.form__field}
                                    value={search}
                                    placeholder={'Search by order ID'}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            var temp = { ...sheetpayload };
                                            var exist = false;
                                            temp.orderIds.map((i, ii) => {
                                                if (i == search) {
                                                    exist = true;
                                                }
                                            });
                                            temp?.orderIdsOld?.map((i, ii) => {
                                                if (i == search) {
                                                    exist = true;
                                                }
                                            });
                                            if (!exist) {
                                                if (search?.length != 0 && !isNaN(parseInt(search))) {
                                                    temp.orderIds.push(parseInt(search));
                                                } else {
                                                    NotificationManager.warning('Order has to be numbers', 'Warning!');
                                                }
                                            } else {
                                                NotificationManager.warning('Order already added', 'Warning!');
                                            }
                                            setsheetpayload({ ...temp });
                                            setsearch('');
                                        }
                                    }}
                                    onChange={(event) => {
                                        setsearch(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div class="col-lg-2 p-0 allcentered">
                            <button
                                style={{ height: '30px', minWidth: '80%' }}
                                class={generalstyles.roundbutton + ' allcentered p-0'}
                                onClick={() => {
                                    var temp = { ...sheetpayload };
                                    var exist = false;
                                    temp.orderIds.map((i, ii) => {
                                        if (i == search) {
                                            exist = true;
                                        }
                                    });
                                    temp?.orderIdsOld?.map((i, ii) => {
                                        if (i == search) {
                                            exist = true;
                                        }
                                    });
                                    if (!exist) {
                                        if (search?.length != 0 && !isNaN(parseInt(search))) {
                                            temp.orderIds.push(parseInt(search));
                                        } else {
                                            NotificationManager.warning('Order has to be numbers', 'Warning!');
                                        }
                                    } else {
                                        NotificationManager.warning('Order already added', 'Warning!');
                                    }
                                    setsheetpayload({ ...temp });
                                    setsearch('');
                                }}
                            >
                                Add order
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '17px' }}>
                                Orders ({sheetpayload?.orderIds?.length})
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <div class={' row m-0 w-100 scrollmenuclasssubscrollbar'} style={{ overflow: 'scroll' }}>
                        <div class="col-lg-12 p-0">
                            <>
                                {sheetpayload?.orderIdsOld?.length != 0 && (
                                    <div class="col-lg-12 p-0">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {sheetpayload?.orderIdsOld?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-3 '}>
                                                        <div class={generalstyles.card + ' p-2 row m-0 mb-3 w-100 allcentered'}>
                                                            <div style={{ fontWeight: 700 }} class="col-lg-10 p-0 mb-2">
                                                                # {item}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {sheetpayload?.orderIds?.length != 0 && (
                                    <div class="col-lg-12 p-0">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {sheetpayload?.orderIds?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-3 '}>
                                                        <div class={generalstyles.card + ' p-2 row m-0 mb-3 w-100 allcentered'}>
                                                            <div style={{ fontWeight: 700 }} class="col-lg-10 p-0 mb-2">
                                                                # {item}
                                                            </div>
                                                            <div class="col-lg-2 p-0 allcentered">
                                                                <BsTrash
                                                                    onClick={() => {
                                                                        var temp = { ...sheetpayload };
                                                                        temp.orderIds.splice(index, 1);
                                                                        setsheetpayload({ ...temp });
                                                                    }}
                                                                    class="text-danger text-dangerhover"
                                                                    // size={20}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'fixed', bottom: 0, width: '79.5%' }} class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center justify-content-end'}>
                        <button
                            style={{ height: '30px', minWidth: '170px' }}
                            class={generalstyles.roundbutton + ' allcentered  p-0'}
                            onClick={() => {
                                setchangestatusmodal(true);
                            }}
                            disabled={buttonLoadingContext}
                        >
                            {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoadingContext && <span>{'Submit'}</span>}
                            {/* Add Manifest */}
                        </button>
                    </div>
                </div>
            </div>
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
                            <div className="row w-100 m-0 p-0">Update Orders Status</div>
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
                                    options: [
                                        { label: 'In Resolution', value: 'inResolution' },
                                        { label: 'In Cage', value: 'inCage' },
                                    ],
                                    size: '12',
                                },
                            ]}
                            payload={sheetpayload}
                            setpayload={setsheetpayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={'Update status'}
                            button1onClick={() => {
                                handleOrderStatusChange();
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default BatchScan;
