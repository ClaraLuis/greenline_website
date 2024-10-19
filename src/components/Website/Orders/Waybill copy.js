import React, { useContext } from 'react';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import Barcode from 'react-barcode';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import Decimal from 'decimal.js';

const Waybill = ({ order }) => {
    const { dateformatter } = useContext(Contexthandlerscontext);
    return (
        <div style={{ fontSize: '12px' }} className="print-item waybill p-1 col-lg-12">
            <div class="row m-0 w-100  h-100">
                <div style={{ borderInlineEnd: '1px solid #eee' }} class="col-lg-10 col-md-10">
                    <div class="row m-0 w-100 d-flex justify-content-center">
                        <div style={{ borderBottom: '1px solid #eee' }} className=" row w-100 m-0 p-1">
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <h1 className="company-name">
                                    <img src={logo} style={{ objectFit: 'contain', width: '180px' }} />
                                </h1>
                                <div className="company-address">
                                    <span>Phone Number: +20100077400</span>
                                </div>
                            </div>
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0"> {order?.merchant?.name}</div>
                                    <div class="col-lg-12 p-0"> Date: {dateformatter(order?.createdAt)}</div>
                                </div>
                            </div>
                            <div className="company-info p-1 col-lg-4 col-md-4">
                                {order?.merchantCustomer?.customerName}
                                {order?.merchantCustomer?.customer?.phone && (
                                    <>
                                        <br />
                                        {order?.merchantCustomer?.customer?.phone}
                                    </>
                                )}
                                <br />
                                {order?.address?.city}, {order?.address?.country}
                                <br />
                                {order?.address?.streetAddress}
                                <br />
                                {order?.address?.buildingNumber && (
                                    <>
                                        {order?.address?.buildingNumber}, {order?.address?.apartmentFloor}
                                    </>
                                )}
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px solid #eee' }} className=" row allcentered w-100 m-0 p-1">
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 allcentered">
                                        Payment Method: <span style={{ fontWeight: 700 }}>{order?.paymentType}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 allcentered">
                                        Order Type:{' '}
                                        <span style={{ fontWeight: 700 }} class="text-capitalize">
                                            {order?.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px solid #eee' }} className=" row allcentered w-100 m-0 p-1">
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0">
                                        <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '} style={{ background: 'transaprent' }}>
                                            <input type="checkbox" class="mt-1 mb-1" checked={order?.canOpen == 0 ? false : true} />
                                            <svg viewBox="0 0 21 21" class="h-100">
                                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                            </svg>
                                            <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>CAN BE OPENED</p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0">
                                        <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '} style={{ background: 'transaprent' }}>
                                            <input type="checkbox" class="mt-1 mb-1" checked={order?.deliveryPart == 0 ? false : true} />
                                            <svg viewBox="0 0 21 21" class="h-100">
                                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                            </svg>
                                            <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>PART OF SHIPPMENT</p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0">
                                        <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '} style={{ background: 'transaprent' }}>
                                            <input type="checkbox" class="mt-1 mb-1" checked={order?.fragile == 0 ? false : true} />
                                            <svg viewBox="0 0 21 21" class="h-100">
                                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                            </svg>
                                            <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>FRAGILE</p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px solid #eee' }} className=" row allcentered w-100 m-0 p-1">
                            {order?.orderItems?.map((item, index) => {
                                return (
                                    <div class="col-lg-12">
                                        ({item?.count}) <span style={{ fontWeight: 600 }}>{item?.info?.item?.name}, </span> <span style={{ fontSize: '11px' }}>{item?.info?.sku} </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="row allcentered w-100 m-0 p-1">
                            <div className="col-lg-12 p-0 mt-2">
                                <div className="row m-0 w-100 d-flex">
                                    <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4 col-md-4">
                                        <div className="row m-0 w-100">
                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                            </div>
                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                    {new Decimal(order?.price || 0).toFixed(2)} {order?.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4 col-md-4">
                                        <div className="row m-0 w-100">
                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                            </div>
                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                    {new Decimal(order?.shippingPrice || 0).toFixed(2)} {order?.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }} className="p-0 mb-2 allcentered col-lg-4 col-md-4">
                                        <div className="row m-0 w-100">
                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                            </div>
                                            <div className="col-lg-12 p-0 allcentered text-center">
                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                    {new Decimal(order?.price || 0).plus(new Decimal(order?.shippingPrice || 0)).toFixed(2)} {order?.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-2 p-0 h-100">
                    <div class="row m-0 w-100 h-100">
                        <div className="col-lg-12 allcentered " style={{ height: '50%', borderBottom: '1px solid #eee' }}>
                            <div style={{ transform: 'rotate(270deg)' }}>
                                <Barcode value={order?.id} width={2} height={40} fontSize={12} background="transparent" style={{ background: 'transparent', transform: 'rotate(90deg)' }} />
                            </div>
                        </div>
                        <div className="col-lg-12 allcentered " style={{ height: '50%', borderBottom: '1px solid #eee' }}>
                            {order?.otherId && (
                                <div style={{ transform: 'rotate(270deg)' }}>
                                    <Barcode value={order?.otherId} width={2} height={40} fontSize={12} background="transparent" style={{ background: 'transparent', transform: 'rotate(90deg)' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Waybill;
