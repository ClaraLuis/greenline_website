import React from 'react';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import Barcode from 'react-barcode';
const Waybill = ({ order }) => {
    return (
        <div style={{ fontSize: '12px' }} className="waybill p-0 col-lg-12">
            <header className="waybill-header p-0 m-0">
                <div style={{ borderInlineEnd: '2px solid black' }} className="company-info p-3 col-lg-4">
                    <h1 className="company-name">
                        <img src={logo} style={{ objectFit: 'contain', width: '200px' }} />
                    </h1>
                    <div className="company-address">
                        <span>Head Office: 10 10 Ahmed Hosny St., St., Nasr City, Cairo</span>
                        <br />
                        <span>Phone Number: +20100077400</span>
                        <br />

                        <span>E-mail: info@greenlineco.com</span>
                    </div>
                </div>
                <div className="waybill-info p-2">
                    <span style={{ fontWeight: 500, fontSize: '50px' }}>Waybill</span>
                    <br />
                    <Barcode value={order?.id} width={2} height={40} fontSize={12} background="transparent" style={{ background: 'transparent' }} />
                </div>
            </header>
            <div className="waybill-body col-lg-12 p-0 m-0">
                <div className=" row m-0 w-100" style={{ borderBottom: '1px solid black' }}>
                    <span style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }} class="col-lg-4 py-1 d-flex align-items-center">
                        Shipper
                    </span>
                    <span class="col-lg-8  py-1 d-flex align-items-center"> {order.merchant.name}</span>
                    {/* Address (optional if provided) */}
                    {order.merchant.address && (
                        <span>
                            {order.merchant.address.streetAddress}, {order.merchant.address.city}
                        </span>
                    )}
                </div>
                <div className=" row m-0 w-100" style={{ borderBottom: '1px solid black' }}>
                    <span style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }} class="col-lg-4 py-1 d-flex align-items-center">
                        Date {order.orderDate}
                    </span>
                    <span class="col-lg-4 py-1 d-flex align-items-center" style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }}>
                        {' '}
                        Shipment Id: 1
                    </span>
                    <span class="col-lg-4  py-1 d-flex align-items-center" style={{ fontWeight: 700 }}>
                        {' '}
                        Shopify Id: 1
                    </span>
                    {/* Address (optional if provided) */}
                </div>
                <div className=" row m-0 w-100" style={{ borderBottom: '1px solid black' }}>
                    <span style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }} class="col-lg-4 py-1 d-flex align-items-center">
                        Consignee
                    </span>
                    <span class="col-lg-8  py-1 d-flex align-items-center">
                        {' '}
                        {order.customerInfo.customerName}
                        {order.customerInfo.phoneNumber && (
                            <>
                                <br />
                                +2 {order.customerInfo.phoneNumber}
                            </>
                        )}
                        <br />
                        {order.address.city}, {order.address.country}
                        <br />
                        {order.address.streetAddress}
                        <br />
                        {order.address.buildingNumber && (
                            <>
                                {order.address.buildingNumber}, {order.address.apartmentFloor}
                            </>
                        )}
                    </span>
                </div>
                <div className=" row m-0 w-100" style={{ borderBottom: '1px solid black' }}>
                    <span style={{ borderInlineEnd: '2px solid black' }} class="col-lg-4 py-1 d-flex align-items-center">
                        Payment Method: <span style={{ fontWeight: 700 }}>{order.paymentType}</span>
                    </span>
                    <span class="col-lg-2 py-1 d-flex align-items-center" style={{ borderInlineEnd: '2px solid black' }}>
                        Order Type:{' '}
                        <span style={{ fontWeight: 700 }} class="text-capitalize">
                            {order.type}
                        </span>
                    </span>
                    <span class="col-lg-2  py-1 d-flex align-items-center" style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }}>
                        <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '} style={{ background: 'transaprent' }}>
                            <input type="checkbox" class="mt-1 mb-1" checked={order.canOpen == 0 ? false : true} />
                            <svg viewBox="0 0 21 21" class="h-100">
                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                            </svg>
                            <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>CAN BE OPENED</p>
                        </label>
                    </span>
                    <span class="col-lg-2  py-1 d-flex align-items-center" style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }}>
                        <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '} style={{ background: 'transaprent' }}>
                            <input type="checkbox" class="mt-1 mb-1" checked={order.deliveryPart == 0 ? false : true} />
                            <svg viewBox="0 0 21 21" class="h-100">
                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                            </svg>
                            <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>PART OF SHIPPMENT</p>
                        </label>
                    </span>
                    <span class="col-lg-2  py-1 d-flex align-items-center" style={{ fontWeight: 700 }}>
                        <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '} style={{ background: 'transaprent' }}>
                            <input type="checkbox" class="mt-1 mb-1" checked={order.fragile == 0 ? false : true} />
                            <svg viewBox="0 0 21 21" class="h-100">
                                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                            </svg>
                            <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>FRAGILE</p>
                        </label>
                    </span>
                    {/* Address (optional if provided) */}
                </div>
                <div className=" row m-0 w-100" style={{ borderBottom: '1px solid black' }}>
                    <span style={{ borderInlineEnd: '2px solid black' }} class="col-lg-4 py-1 d-flex align-items-center">
                        Items Description
                    </span>
                    <span class="col-lg-8  py-1 d-flex align-items-center" style={{ fontWeight: 700 }}>
                        {order.orderItems.map((item, index) => (
                            <>
                                {item.info.name}
                                {index !== order.orderItems.length - 1 && <br />}
                            </>
                        ))}
                    </span>
                    {/* Address (optional if provided) */}
                </div>
                <div className=" row m-0 w-100" style={{ borderBottom: '1px solid black', fontWeight: 800, fontSize: '15px' }}>
                    <span style={{ borderInlineEnd: '2px solid black', fontWeight: 700 }} class="col-lg-4 py-1 d-flex align-items-center">
                        Total Amount
                    </span>
                    <span class="col-lg-8  py-1 d-flex align-items-center">
                        {' '}
                        {order.price} {order.currency}
                    </span>
                    {/* Address (optional if provided) */}
                </div>
            </div>
        </div>
    );
};

export default Waybill;
