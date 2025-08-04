import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { IoMdClose } from 'react-icons/io';
import { MdOutlineInventory2 } from 'react-icons/md';
import API from '../../../API/API.js';

const { ValueContainer, Placeholder } = components;

const ReturnsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { useQueryGQL } = API();
    const [importItemModel, setimportItemModel] = useState(false);

    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });

    const { lang, langdetect } = useContext(LanguageContext);

    const organizeInventory = (inventory) => {
        const racks = {};

        inventory.forEach((item) => {
            const box = item.box;
            const pallet = box.pallet;
            const rack = pallet.rack;

            const rackId = rack.id;
            if (!racks[rackId]) {
                racks[rackId] = {
                    rack,
                    pallets: {},
                };
            }

            const palletId = pallet.id;
            const palletLevel = pallet.level;
            if (!racks[rackId].pallets[palletLevel]) {
                racks[rackId].pallets[palletLevel] = {};
            }

            if (!racks[rackId].pallets[palletLevel][palletId]) {
                racks[rackId].pallets[palletLevel][palletId] = {
                    pallet,
                    boxes: [],
                };
            }

            racks[rackId].pallets[palletLevel][palletId].boxes.push({ box: box, count: item.count });
        });

        // Sort pallets within each rack by level
        Object.values(racks).forEach((rack) => {
            rack.pallets = Object.fromEntries(Object.entries(rack.pallets).sort(([levelA], [levelB]) => levelA - levelB));
        });

        return racks;
    };

    return (
        <>
            {props?.fetchMerchantItemVariantsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.items != undefined && (
                <>
                    {props?.items?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Returns
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {props?.items?.length != 0 && (
                <div class="row m-0 w-100">
                    {props?.items?.map((item, index) => {
                        var selected = false;
                        props?.selectedItems?.map((i) => {
                            if (i?.id == item?.id) {
                                selected = true;
                            }
                        });

                        return (
                            <div class={props?.card}>
                                <div
                                    style={{
                                        cursor: props?.clickable ? 'pointer' : '',
                                        background: props?.background ? props?.background : selected ? 'var(--secondary)' : '',
                                        transition: 'all 0.4s',
                                    }}
                                    onClick={() => {
                                        if (props?.clickable) {
                                            props?.actiononclick(item);
                                        }
                                    }}
                                    class={generalstyles.card + ' p-0 row m-0 w-100'}
                                >
                                    {/* {selected && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 20,
                                                zIndex: 100,
                                            }}
                                            class={generalstyles.cart_button}
                                        >
                                            <FaCheck color="white" />
                                        </div>
                                    )} */}
                                    <div class="col-lg-12 py-2 px-3">
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-12 p-0 mb-1">
                                                <span style={{ fontSize: '12px', color: 'grey' }}># {item?.id}</span>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <span style={{ fontSize: '12px' }}>{item?.merchant?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 p-0 my-2">
                                        <hr className="m-0" />
                                    </div>
                                    <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                            <div>Items</div>
                                        </div>
                                    </div>
                                    {item?.orderItems?.map((subitem, subindex) => {
                                        if (props?.type == 'inventory') {
                                            var organizedData = [];
                                            organizedData = organizeInventory(subitem?.inventory);
                                        }
                                        return (
                                            <div class={'col-lg-12 mb-2'}>
                                                <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="row m-0 d-flex align-items-center w-100 p-2">
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '7px', marginInline: '5px' }}>
                                                        <img
                                                            src={
                                                                subitem?.info?.imageUrl
                                                                    ? subitem?.info?.imageUrl
                                                                    : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                            }
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                        />
                                                    </div>
                                                    <div class="col-lg-8 d-flex align-items-center">
                                                        <div className="row m-0 w-100">
                                                            <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                {subitem?.info?.fullName ?? '-'}
                                                            </div>
                                                            <div style={{ fontSize: '12px' }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                {subitem?.info?.name ?? '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {props?.type == 'inventory' && (
                                                        <div
                                                            onClick={() => {
                                                                if (subitem?.inventory?.length != 0) {
                                                                    setinventoryModal({ open: true, items: organizedData });
                                                                }
                                                            }}
                                                            style={{ width: '30px', height: '30px' }}
                                                            class={subitem?.inventory?.length == 0 ? 'allcentered iconhover text-danger' : 'allcentered iconhover text-success'}
                                                        >
                                                            <MdOutlineInventory2 size={20} />
                                                        </div>
                                                    )}

                                                    {/* {subitem?.partial && <>{subitem?.partialCount}</>} */}
                                                    <>{subitem?.itemReturn?.count}</>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div class="col-lg-8 p-0 mt-2 wordbreak" style={{ fontWeight: 700, fontSize: '16px' }}>
                                        {item?.orderItem?.info?.name}
                                    </div>

                                    <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px', color: 'lightgray' }}>
                                        {item?.orderItem?.info?.sku}
                                    </div>
                                    <div class="col-lg-12 p-0 mt-2" style={{ fontWeight: 700, fontSize: '15px' }}>
                                        {item?.orderItem?.info?.prices?.map((price, priceindex) => {
                                            return (
                                                <>
                                                    {price?.info[0]?.price} {price?.info[0]?.currency}
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <div class="row m-0 w-100">
                                            {item?.orderItem?.info?.colors?.map((color, colorindex) => {
                                                return <div style={{ width: '18px', height: '18px', borderRadius: '100%', backgroundColor: color, marginInlineEnd: '5px' }}></div>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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
                        <div class="col-lg-6 col-md-10 pt-3 ">
                            <div className="row w-100 m-0 p-0">Place in warehouse</div>
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
                                <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '12px' }}>
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                        Rack {rackData.rack.name}
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <hr class="p-0 m-0" />
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <div class="row m-0 w-100 p-1">
                                            {Object.entries(rackData.pallets).map(([level, pallets]) => {
                                                return (
                                                    <div class="col-lg-12 p-0 mb-2">
                                                        <div class="row m-0 w-100 d-flex align-items-center p-2" style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '12px' }}>
                                                            Level {level}:
                                                            {Object.values(pallets).map((palletData) => {
                                                                return (
                                                                    <div class="col-lg-12">
                                                                        <div key={palletData.pallet.id}>
                                                                            <p class="p-0 m-0">Pallet: {palletData.pallet.name}</p>
                                                                            <div class="row m-0 w-100">
                                                                                {palletData.boxes.map((box) => (
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
export default ReturnsTable;
