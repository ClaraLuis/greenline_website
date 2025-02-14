import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaEllipsisV, FaLayerGroup, FaShopify } from 'react-icons/fa';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import { Dropdown, Modal } from 'react-bootstrap';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BiUser } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineInventory2, MdOutlineLocationOn } from 'react-icons/md';
import Form from '../../Form.js';
import API from '../../../API/API.js';
import { NotificationManager } from 'react-notifications';
import WaybillPrint from './WaybillPrint.js';

const { ValueContainer, Placeholder } = components;

const FulfillModal = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { orderStatusEnumContext, dateformatter, orderTypeContext, setchosenOrderContext, chosenOrderContext, isAuth, buttonLoadingContext, setbuttonLoadingContext } =
        useContext(Contexthandlerscontext);
    const { requestOrderReturn, useMutationGQL, updateOrdersStatus } = API();
    const { lang, langdetect } = useContext(LanguageContext);

    const [itemScanned, setitemScanned] = useState([]);
    const [index, setindex] = useState(0);

    const [updateOrdersStatusMutation] = useMutationGQL(updateOrdersStatus(), {
        status: 'fulfilled',
        sheetOrderId: chosenOrderContext?.sheetOrder?.id,
    });

    const [barcode, setBarcode] = useState('');
    useEffect(() => {
        // alert(JSON.stringify(props?.ordersToBeFulfilled));
        setitemScanned(
            props?.ordersToBeFulfilled[index]?.orderItems?.map((item) => ({
                ...item,
                scannedCount: 0, // Adding a field to track scanned count
            })) || [],
        );
    }, [index, props?.ordersToBeFulfilled]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return; // Don't process barcode scanning when typing in an input field
            }
            if (e.key === 'Enter') {
                if (props?.fulfilllModal && barcode) {
                    const scannedSku = barcode.trim();

                    // Find the matched item in the scanned items
                    const matchedItem = itemScanned.find((item) => item.info.sku === scannedSku);

                    if (matchedItem) {
                        // Increment the scanned count if it is not already equal to the required count
                        if (matchedItem.scannedCount < matchedItem.count) {
                            setitemScanned((prevScanned) => prevScanned.map((item) => (item.info.sku === scannedSku ? { ...item, scannedCount: item.scannedCount + 1 } : item)));
                        } else {
                            alert(`Item with SKU ${scannedSku} has already been fully scanned.`);
                        }
                    } else {
                        alert(`No item found with SKU ${scannedSku}`);
                    }

                    // Clear barcode after processing
                    setBarcode('');
                }
            } else {
                // Update barcode state as the user types
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode, props?.fulfilllModal, itemScanned]);
    const allItemsScanned = itemScanned.every((item) => item.scannedCount === item.count);

    return (
        <>
            <Modal show={props?.fulfilllModal} onHide={() => props?.setfulfilllModal(false)} centered size={'md'}>
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div className="col-lg-6 pt-3">
                            <div className="row w-100 m-0 p-0">Fulfill Order (#{props?.ordersToBeFulfilled[index]?.id})</div>
                        </div>
                        <div className="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div className={'close-modal-container'} onClick={() => props?.setfulfilllModal(false)}>
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="row m-0 w-100 py-2">
                        <div class="col-lg-12 p-0 d-flex justify-content-end">
                            <WaybillPrint waybills={[props?.ordersToBeFulfilled[index]]} />
                        </div>
                        {itemScanned?.map((item, index) => (
                            <div className="col-lg-12 mb-3" key={index}>
                                <div className="row m-0 w-100 d-flex align-items-center">
                                    <div style={{ width: '55px', height: '50px', border: '1px solid #eee', borderRadius: '10px' }}>
                                        <img src={item?.info?.imageUrl} style={{ width: '100%', height: '100%', borderRadius: '10px' }} alt={item?.info?.name} />
                                    </div>
                                    <div className="ml-2">
                                        <div className="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px' }}>
                                            {item?.info?.name}
                                        </div>
                                        <div className="col-lg-12 p-0" style={{ fontWeight: 500, fontSize: '13px', color: 'lightgray' }}>
                                            {item?.info?.sku}
                                        </div>
                                        <div className="col-lg-12 p-0" style={{ fontWeight: 500, fontSize: '13px', color: 'green' }}>
                                            Scanned: {item.scannedCount} / {item.count}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show the fulfill button only when all items are fully scanned */}

                    <div class="col-lg-12 p-0 allcentered py-2">
                        <button
                            class={generalstyles.roundbutton}
                            style={{ height: '35px' }}
                            onClick={async () => {
                                if (buttonLoadingContext) return;
                                setbuttonLoadingContext(true);
                                try {
                                    const { data } = await updateOrdersStatusMutation();
                                    NotificationManager.success('', 'Status changed successfully');
                                    if (index < props?.ordersToBeFulfilled?.length - 1) {
                                        setindex(index + 1);
                                    } else {
                                        props?.setfulfilllModal(false);
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
                            }}
                            disabled={!allItemsScanned || buttonLoadingContext}
                        >
                            {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoadingContext && <span> Fulfill Order</span>}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default FulfillModal;
