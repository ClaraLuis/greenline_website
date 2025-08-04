import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { IoMdClose } from 'react-icons/io';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { Modal } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemPanel } from 'react-accessible-accordion';
import API from '../../../API/API.js';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { NotificationManager } from 'react-notifications';
import { FaCheck } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import Form from '../../Form.js';
import Select from 'react-select';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import Inputfield from '../../Inputfield.js';
import Decimal from 'decimal.js';
import { IoChevronBackOutline } from 'react-icons/io5';
import SkuPrint from '../MerchantItems/SkuPrint.js';

const OrderItemsModal = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const [selectedVariants, setselectedVariants] = useState([]);

    return (
        <Modal
            show={props?.openModal}
            onHide={() => {
                props?.setOpenModal(false);
                setselectedVariants([]);
            }}
            centered
            size={'md'}
        >
            <Modal.Header>
                <div className="row w-100 m-0 p-0">
                    <div class="col-lg-6 col-md-10 pt-3 ">{/* <div className="row w-100 m-0 p-0">Update Sheet Status</div> */}</div>
                    <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                        <div
                            class={'close-modal-container'}
                            onClick={() => {
                                props?.setOpenModal(false);
                                setselectedVariants([]);
                            }}
                        >
                            <IoMdClose />
                        </div>
                    </div>{' '}
                </div>
            </Modal.Header>
            <Modal.Body>
                <div class="row m-0 w-100 allcentered py-2">
                    <div class="col-lg-12 p-0 d-flex justify-content-end">{selectedVariants?.length > 0 && <SkuPrint skus={selectedVariants} />}</div>
                    <div className="col-lg-12 p-0">
                        <div className="row m-0 w-100">
                            {props?.orderItems?.length != 0 && (
                                <>
                                    <div class="col-lg-12 mb-2 text-capitalize" style={{ fontWeight: 600 }}>
                                        {/* {props?.order?.type}  */}
                                        Items with courier
                                    </div>
                                    {props?.orderItems?.map((subitem, subindex) => {
                                        var selected = false;
                                        selectedVariants?.map((i) => {
                                            if (i.id == subitem.id) {
                                                selected = true;
                                            }
                                        });
                                        return (
                                            <div className={'col-lg-6 mb-2'} key={subindex}>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        var temp = [...selectedVariants];
                                                        var exist = false;
                                                        var chosenindex = null;

                                                        temp.map((i, ii) => {
                                                            if (i?.id == subitem.id) {
                                                                exist = true;
                                                                chosenindex = ii;
                                                            }
                                                        });
                                                        if (!exist) {
                                                            temp.push({ item: subitem.info, id: subitem.id });
                                                        } else {
                                                            temp.splice(chosenindex, 1);
                                                        }
                                                        setselectedVariants([...temp]);
                                                    }}
                                                    style={{
                                                        background: selected ? 'var(--secondary)' : 'white',
                                                        transition: 'all 0.4s',
                                                        cursor: 'pointer',
                                                        border: '1px solid #eee',
                                                        borderRadius: '0.25rem',
                                                    }}
                                                    className="row m-0 w-100 p-2 d-flex align-items-start"
                                                >
                                                    {props?.order?.type == 'return' && (
                                                        <div style={{ borderRadius: '10px', fontWeight: 700, fontSize: '11px' }} className="p-1 px-2 mr-1 allcentered">
                                                            {subitem?.partialCount != null ? new Decimal(subitem.partialCount).toFixed(0) : new Decimal(subitem.count).toFixed(0)}
                                                        </div>
                                                    )}
                                                    {props?.order?.type != 'return' && (
                                                        <div style={{ borderRadius: '10px', fontWeight: 700, fontSize: '11px' }} className="p-1 px-2 mr-1 allcentered">
                                                            {subitem?.partialCount != null ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)).toFixed(0) : '0'}
                                                        </div>
                                                    )}
                                                    <div class="col-lg-12 p-0 allcentered">
                                                        <div style={{ width: '80px', height: '80px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                            <img
                                                                src={
                                                                    subitem?.info?.imageUrl
                                                                        ? subitem?.info?.imageUrl
                                                                        : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                }
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12 p-0 allcentered" style={{ marginTop: '5px' }}>
                                                        <div style={{ fontWeight: 500, fontSize: '12px', color: 'grey' }}>{subitem?.info?.sku}</div>
                                                    </div>
                                                    <div class="col-lg-12 p-0 allcentered" style={{ marginTop: '5px' }}>
                                                        <div style={{ fontWeight: 700 }} className="col-lg-12 p-0 allcentered">
                                                            {subitem?.info?.fullName}
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12 p-0 allcentered" style={{ marginTop: '0px' }}>
                                                        {props?.order?.type != 'return' && (
                                                            <div style={{ fontWeight: 700 }} className="mx-2">
                                                                {new Decimal(subitem?.partialCount != null ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)) : new Decimal(0))
                                                                    .times(new Decimal(subitem?.unitPrice))
                                                                    .toFixed(2)}{' '}
                                                                {props?.order?.currency}
                                                            </div>
                                                        )}
                                                        {props?.order?.type == 'return' && (
                                                            <div style={{ fontWeight: 700 }} className="mx-2">
                                                                {new Decimal(subitem?.partialCount != null ? new Decimal(subitem.partialCount) : new Decimal(subitem.count))
                                                                    .times(new Decimal(subitem?.unitPrice))
                                                                    .toFixed(2)}{' '}
                                                                {props?.order?.currency}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {props?.previousOrder && props?.previousOrderItems?.length != 0 && (
                                <>
                                    <hr className="mt-2 mb-3" />
                                    <div class="col-lg-12 p-0">
                                        <div className="row m-0 w-100">
                                            <div class="col-lg-12 mb-2 text-capitalize" style={{ fontWeight: 600 }}>
                                                {props?.previousOrder?.order?.type} items with courier
                                            </div>
                                            {props?.previousOrderItems?.map((subitem, subindex) => {
                                                var selected = false;
                                                selectedVariants?.map((i) => {
                                                    if (i.id == subitem.id) {
                                                        selected = true;
                                                    }
                                                });
                                                return (
                                                    <div className={'col-lg-6 mb-2'} key={subindex}>
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                var temp = [...selectedVariants];
                                                                var exist = false;
                                                                var chosenindex = null;

                                                                temp.map((i, ii) => {
                                                                    if (i?.id == subitem?.id) {
                                                                        exist = true;
                                                                        chosenindex = ii;
                                                                    }
                                                                });
                                                                if (!exist) {
                                                                    temp.push({ item: subitem.info, id: subitem.id });
                                                                } else {
                                                                    temp.splice(chosenindex, 1);
                                                                }
                                                                setselectedVariants([...temp]);
                                                            }}
                                                            style={{
                                                                background: selected ? 'var(--secondary)' : 'white',
                                                                transition: 'all 0.4s',
                                                                cursor: 'pointer',
                                                                border: '1px solid #eee',
                                                                borderRadius: '0.25rem',
                                                            }}
                                                            className="row m-0 w-100 p-2  "
                                                        >
                                                            {props?.previousOrder?.order?.type == 'return' && (
                                                                <div style={{ borderRadius: '8px', fontWeight: 700, fontSize: '11px' }} className="p-1 px-2 mr-1 ">
                                                                    {subitem?.partialCount != null ? new Decimal(subitem.partialCount).toFixed(0) : new Decimal(subitem.count).toFixed(0)}
                                                                </div>
                                                            )}
                                                            {props?.previousOrder?.order?.type != 'return' && (
                                                                <div style={{ borderRadius: '8px', fontWeight: 700, fontSize: '11px' }} className="p-1 px-2 mr-1 allcentered">
                                                                    {subitem?.partialCount != null ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)).toFixed(0) : '0'}
                                                                </div>
                                                            )}
                                                            <div class="col-lg-12 p-0 allcentered">
                                                                <div style={{ width: '80px', height: '80px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                                    <img
                                                                        src={
                                                                            subitem?.info?.imageUrl
                                                                                ? subitem?.info?.imageUrl
                                                                                : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                        }
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-12 p-0 allcentered" style={{ marginTop: '5px' }}>
                                                                <div style={{ fontWeight: 500, fontSize: '12px', color: 'grey' }}>{subitem?.info?.sku}</div>
                                                            </div>
                                                            <div class="col-lg-12 p-0 allcentered" style={{ marginTop: '5px' }}>
                                                                <div style={{ fontWeight: 700 }} className="col-lg-12 p-0 allcentered">
                                                                    {subitem?.info?.fullName}
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-12 p-0 allcentered" style={{ marginTop: '0px' }}>
                                                                {props?.previousOrder?.order?.type != 'return' && (
                                                                    <div style={{ fontWeight: 700 }}>
                                                                        {new Decimal(
                                                                            subitem?.partialCount != null ? new Decimal(subitem.count).minus(new Decimal(subitem.partialCount)) : new Decimal(0),
                                                                        )
                                                                            .times(new Decimal(subitem?.unitPrice))
                                                                            .toFixed(2)}{' '}
                                                                        {props?.previousOrder?.order?.currency}
                                                                    </div>
                                                                )}

                                                                {props?.previousOrder?.order?.type == 'return' && (
                                                                    <div style={{ fontWeight: 700 }} className="mx-2">
                                                                        {new Decimal(subitem?.partialCount != null ? new Decimal(subitem.partialCount) : new Decimal(subitem.count))
                                                                            .times(new Decimal(subitem?.unitPrice))
                                                                            .toFixed(2)}{' '}
                                                                        {props?.previousOrder?.order?.currency}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default OrderItemsModal;
