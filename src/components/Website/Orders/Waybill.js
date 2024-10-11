import React, { useContext } from 'react';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import Barcode from 'react-barcode';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import bwipjs from 'bwip-js';
const Waybill = ({ order }) => {
    const { dateformatter } = useContext(Contexthandlerscontext);
    const codeGenerate = (sku) => {
        let canvas = document.createElement('canvas');
        bwipjs?.toCanvas(canvas, {
            bcid: 'datamatrix', // Barcode type
            text: JSON.stringify(sku), // Text to encode
            // scale: 2, // 3x scaling factor
            height: 15, // Bar height, in millimeters
            width: 15, // Bar height, in millimeters
            includetext: true, // Show human-readable text
            textxalign: 'center', // Always good to set this
        });
        return canvas.toDataURL('image/png');
    };
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
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-2 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0"> {order?.merchant?.name}</div>
                                    <div class="col-lg-12 p-0"> Date: {dateformatter(order?.createdAt)}</div>
                                </div>
                            </div>
                            <div className="company-info p-2 col-lg-4 col-md-4">
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
                        <div style={{ borderBottom: '1px solid #eee' }} className=" row  w-100 m-0 p-1">
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 text-start ">
                                        Payment Method: <span style={{ fontWeight: 700 }}>{order?.paymentType}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 ">
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
                                    <div class="col-lg-12 p-0 ">
                                        CAN BE OPENED:{' '}
                                        <span style={{ fontWeight: 700 }} class="text-capitalize">
                                            {order?.canOpen == 0 ? 'No' : 'Yes'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 ">
                                        PART OF SHIPPMENT:{' '}
                                        <span style={{ fontWeight: 700 }} class="text-capitalize">
                                            {order?.deliveryPart == 0 ? 'No' : 'Yes'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="company-info p-1 col-lg-4 col-md-4">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 ">
                                        FRAGILE:{' '}
                                        <span style={{ fontWeight: 700 }} class="text-capitalize">
                                            {order?.fragile == 0 ? 'No' : 'Yes'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px solid #eee' }} className=" row allcentered w-100 m-0 p-1">
                            {order?.orderItems?.map((item, index) => {
                                return (
                                    <div class="col-lg-12 p-0">
                                        ({item?.count}) <span style={{ fontWeight: 600 }}>{item?.info?.item?.name}, </span> <span style={{ fontSize: '11px' }}>{item?.info?.sku} </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div class="row allcentered w-100 m-0 p-1">
                            <div class="col-lg-12 p-0 mt-2">
                                <div class="row m-0 w-100  d-flex">
                                    <div style={{ fontWeight: 600, fontSize: '15px' }} className=" p-0 mb-2  col-lg-4 col-md-4">
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-12 p-0 ">
                                                <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                            </div>
                                            <div class="col-lg-12 p-0 ">
                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                    {parseFloat(order?.price)} {order?.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-2 p-0 " style={{ flex: 1 }}>
                    <div class="row m-0 w-100 h-100">
                        <div className="col-lg-12 allcentered " style={{ height: '50%', borderBottom: '1px solid #eee' }}>
                            <div class="row m-0 w-100">
                                <div class="col-lg-12 p-0 allcentered">
                                    <img src={codeGenerate(order?.id)} alt={`data matrix from ${order?.id}`} />
                                </div>

                                <div class="col-lg-12 mt-1 allcentered">{order?.id}</div>
                            </div>
                        </div>
                        <div className="col-lg-12 allcentered " style={{ height: '50%', borderBottom: '1px solid #eee' }}>
                            {order?.otherId && (
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 allcentered">
                                        <img src={codeGenerate(order?.otherId)} alt={`data matrix from ${order?.otherId}`} />
                                    </div>

                                    <div class="col-lg-12 mt-1 allcentered">{order?.otherId}</div>
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
