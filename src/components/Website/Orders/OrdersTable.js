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
import { Modal } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import { IoMdClose } from 'react-icons/io';
import Form from '../../Form.js';
import { MdOutlineInventory2, MdOutlineLocationOn } from 'react-icons/md';

const { ValueContainer, Placeholder } = components;

const OrdersTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { orderStatusesContext, dateformatter, orderTypesContext } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    const [changestatusmodal, setchangestatusmodal] = useState(false);
    const [submit, setsubmit] = useState(false);
    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });

    const [statuspayload, setstatuspayload] = useState({
        orderid: '',
        status: '',
    });
    const organizeInventory = (inventory) => {
        const racks = {};

        inventory.forEach((item) => {
            const box = item.box;
            const ballot = box.ballot;
            const rack = ballot.rack;

            const rackId = rack.id;
            if (!racks[rackId]) {
                racks[rackId] = {
                    rack,
                    ballots: {},
                };
            }

            const ballotId = ballot.id;
            const ballotLevel = ballot.level;
            if (!racks[rackId].ballots[ballotLevel]) {
                racks[rackId].ballots[ballotLevel] = {};
            }

            if (!racks[rackId].ballots[ballotLevel][ballotId]) {
                racks[rackId].ballots[ballotLevel][ballotId] = {
                    ballot,
                    boxes: [],
                };
            }

            racks[rackId].ballots[ballotLevel][ballotId].boxes.push({ box: box, count: item.count });
        });

        // Sort ballots within each rack by level
        Object.values(racks).forEach((rack) => {
            rack.ballots = Object.fromEntries(Object.entries(rack.ballots).sort(([levelA], [levelB]) => levelA - levelB));
        });

        return racks;
    };

    return (
        <>
            {props?.fetchOrdersQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}

            {!props?.fetchOrdersQuery?.loading && props?.fetchOrdersQuery?.data != undefined && (
                <>
                    {props?.fetchOrdersQuery?.data[props?.attr]?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Orders
                                </div>
                            </div>
                        </div>
                    )}
                    {props?.fetchOrdersQuery?.data[props?.attr]?.data?.length != 0 && (
                        <div class="row m-0 w-100">
                            {props?.fetchOrdersQuery?.data[props?.attr]?.data?.map((item, index) => {
                                var outOfStock = false;
                                item?.orderItems?.map((orderitem, orderindex) => {
                                    if (orderitem?.countInInventory == 0) {
                                        outOfStock = true;
                                    }
                                });
                                const timestamp = item?.orderDate;
                                const orderDate = new Date(timestamp);

                                // Create a Date object for the current date
                                const now = new Date();

                                // Set the hours, minutes, seconds, and milliseconds to 0 for both dates
                                orderDate.setHours(0, 0, 0, 0);
                                now.setHours(0, 0, 0, 0);

                                // Calculate the difference in milliseconds
                                const diffInMs = now.getTime() - orderDate.getTime();

                                // Convert milliseconds to days
                                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                                return (
                                    <div
                                        onClick={() => {
                                            if (props?.clickable) {
                                                props?.actiononclick(item);
                                            }
                                        }}
                                        style={{ cursor: props?.clickable ? 'pointer' : '' }}
                                        className="col-lg-6 p-1"
                                    >
                                        <div style={{ background: 'white' }} class={' p-3 row m-0 w-100 card'}>
                                            <div className="col-lg-4 p-0">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                        # {item?.id}
                                                    </span>{' '}
                                                    {outOfStock && props?.srcFrom == 'inventory' && (
                                                        <div className={'ml-1 wordbreak text-danger bg-light-danger rounded-pill font-weight-600 '}>Out Of Stock</div>
                                                    )}
                                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                        {item?.merchant?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                <div class="row m-0 w-100  d-flex justify-content-end align-items-center">
                                                    {props?.srcFrom == 'inventory' && (
                                                        <div className={' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 mr-1 '}>{diffInDays} late days</div>
                                                    )}
                                                    <div
                                                        // onClick={() => {
                                                        //     setchangestatusmodal(true);
                                                        // }}
                                                        // style={{ cursor: 'pointer' }}
                                                        className={
                                                            item.status == 'delivered'
                                                                ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 '
                                                                : item?.status == 'postponed' || item?.status == 'failedDeliveryAttempt'
                                                                ? ' wordbreak text-danger bg-light-danger rounded-pill font-weight-600 '
                                                                : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 '
                                                        }
                                                    >
                                                        {orderStatusesContext?.map((i, ii) => {
                                                            if (i.value == item?.status) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })}
                                                    </div>
                                                    <div
                                                        // onClick={() => {
                                                        //     setchangestatusmodal(true);
                                                        // }}
                                                        style={{ color: 'white' }}
                                                        className={'ml-1 wordbreak bg-primary rounded-pill font-weight-600 '}
                                                    >
                                                        {orderTypesContext?.map((i, ii) => {
                                                            if (i.value == item?.type) {
                                                                return <span>{i.label}</span>;
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 p-0 my-2">
                                                <hr className="m-0" />
                                            </div>
                                            {props?.srcFrom != 'inventory' && (
                                                <>
                                                    <div class="col-lg-12 p-0 mb-2 text-capitalize">
                                                        <span style={{ fontWeight: 600 }}>{item?.customerInfo?.customerName}</span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 mb-1 d-flex align-items-center">
                                                        <MdOutlineLocationOn class="mr-1" />
                                                        <span style={{ fontWeight: 400, fontSize: '13px' }}>
                                                            {item?.address?.city}, {item?.address?.country}
                                                        </span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 ">
                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                            {item?.address?.streetAddress}, {item?.address?.buildingNumber}, {item?.address?.apartmentFloor}
                                                        </span>
                                                    </div>
                                                    <div className="col-lg-12 p-0 mt-3 mb-2">
                                                        <div
                                                            style={{ maxWidth: '100%', flexDirection: 'row', flexWrap: 'nowrap', overflow: 'scroll' }}
                                                            class="row m-0 w-100 scrollmenuclasssubscrollbar"
                                                        >
                                                            {item?.orderItems?.map((orderITem, orderIndex) => {
                                                                return (
                                                                    <div class="p-0 mb-1 mr-2">
                                                                        <div style={{ border: '1px solid #eee', borderRadius: '10px' }} class="row m-0 w-100 p-2 align-items-center">
                                                                            <div style={{ width: '35px', height: '35px', borderRadius: '7px', marginInlineEnd: '15px' }}>
                                                                                <img
                                                                                    src={
                                                                                        orderITem?.info?.imageUrl
                                                                                            ? orderITem?.info?.imageUrl
                                                                                            : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                                    }
                                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                                />
                                                                            </div>

                                                                            <div class="">
                                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                                    <div>
                                                                                        {orderITem?.partial && (
                                                                                            <div style={{ fontWeight: 700 }} class="row m-0 w-100 p-1 px-3">
                                                                                                {orderITem.partialCount}/{orderITem.count}
                                                                                            </div>
                                                                                        )}
                                                                                        {!orderITem?.partial && (
                                                                                            <div style={{ fontWeight: 700 }} class="row m-0 w-100 p-1 px-3">
                                                                                                {orderITem.count}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12 p-0 mt-2">
                                                        <div class="row m-0 w-100 d-flex">
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Price</span>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {parseFloat(item?.price)} {item?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ borderRight: '1px solid #eee' }} className="p-0 mb-2 allcentered col-lg-4">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Shipping</span>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {parseFloat(item?.shippingPrice)} {item?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '15px' }} className=" p-0 mb-2 allcentered col-lg-4">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 400, fontSize: '11px' }}>Total</span>
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 allcentered text-center">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                            {parseFloat(item?.price) + parseFloat(item?.shippingPrice)} {item?.currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {props?.srcFrom == 'inventory' && (
                                                <div className="col-lg-12 p-0 mt-2">
                                                    <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                                        {item?.orderItems?.map((orderITem, orderIndex) => {
                                                            var organizedData = [];
                                                            if (props?.srcFrom == 'inventory') {
                                                                organizedData = organizeInventory(orderITem?.inventory);
                                                            }
                                                            return (
                                                                <div class="col-lg-12 p-0 mb-1">
                                                                    <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-1 align-items-center">
                                                                        <div style={{ width: '50px', height: '50px', borderRadius: '7px', marginInlineEnd: '10px' }}>
                                                                            <img
                                                                                src={
                                                                                    orderITem?.info?.imageUrl
                                                                                        ? orderITem?.info?.imageUrl
                                                                                        : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                                }
                                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                            />
                                                                        </div>
                                                                        <div class="col-lg-5 d-flex align-items-center">
                                                                            {props?.srcFrom == 'inventory' && (
                                                                                <div className="row m-0 w-100">
                                                                                    <div style={{ fontSize: '14px', fontWeight: 600 }} className={' col-lg-12 p-0'}>
                                                                                        {orderITem?.info?.item?.name}
                                                                                    </div>
                                                                                    <div style={{ fontSize: '13px' }} className={' col-lg-12 p-0'}>
                                                                                        {orderITem?.info?.name}
                                                                                    </div>
                                                                                    <div style={{ color: 'lightgray', fontSize: '13px' }} className="col-lg-12 p-0">
                                                                                        {orderITem?.info?.sku}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div class="col-lg-5 ">
                                                                            <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                                <div>
                                                                                    {orderITem?.partial && (
                                                                                        <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-1 px-4">
                                                                                            {orderITem.partialCount}/{orderITem.count}
                                                                                        </div>
                                                                                    )}
                                                                                    {!orderITem?.partial && (
                                                                                        <div style={{ border: '1px solid #eee', borderRadius: '8px', fontWeight: 700 }} class="row m-0 w-100 p-1 px-4">
                                                                                            {orderITem.count}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                {/* <div style={{ fontWeight: 700 }} class="mx-2">
                                                                                    {orderITem?.partial
                                                                                        ? parseInt(orderITem.partialCount) * parseFloat(orderITem?.unitPrice)
                                                                                        : parseInt(orderITem.count) * parseFloat(orderITem?.unitPrice)}{' '}
                                                                                    {item?.info?.currency}
                                                                                </div> */}
                                                                                {props?.srcFrom == 'inventory' && (
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (orderITem?.countInInventory != 0) {
                                                                                                setinventoryModal({ open: true, items: organizedData });
                                                                                            }
                                                                                        }}
                                                                                        style={{ width: '30px', height: '30px' }}
                                                                                        class={
                                                                                            orderITem?.countInInventory == 0
                                                                                                ? 'allcentered iconhover text-danger'
                                                                                                : 'allcentered iconhover text-success'
                                                                                        }
                                                                                    >
                                                                                        <MdOutlineInventory2 size={20} />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ fontSize: '12px' }} class="col-lg-12 p-0 mt-2 d-flex justify-content-end ">
                                                <p className={' m-0 p-0 wordbreak  '}>{dateformatter(orderDate.toUTCString())}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
                            <div className="row w-100 m-0 p-0">Update Order Status</div>
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
                                    options: orderStatusesContext,
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

            <Modal
                show={inventoryModal.open}
                onHide={() => {
                    setinventoryModal({ open: false, items: [] });
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Place in inventory</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setinventoryModal({ open: false, items: [] });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        {Object.values(inventoryModal?.items).map((rackData) => (
                            <>
                                <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                        Rack {rackData.rack.name}
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <hr class="p-0 m-0" />
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <div class="row m-0 w-100 p-1">
                                            {Object.entries(rackData.ballots).map(([level, ballots]) => {
                                                return (
                                                    <div class="col-lg-12 p-0 mb-2">
                                                        <div class="row m-0 w-100 d-flex align-items-center p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                                            Level {level}:
                                                            {Object.values(ballots).map((ballotData) => {
                                                                return (
                                                                    <div class="col-lg-12">
                                                                        <div key={ballotData.ballot.id}>
                                                                            <p class="p-0 m-0">Ballot: {ballotData.ballot.name}</p>
                                                                            <div class="row m-0 w-100">
                                                                                {ballotData.boxes.map((box) => (
                                                                                    <div class={'searchpill'}>
                                                                                        {' '}
                                                                                        {box?.box.name} ({box.count})
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default OrdersTable;
