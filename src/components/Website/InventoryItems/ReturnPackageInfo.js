import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Modal } from 'react-bootstrap';
import API from '../../../API/API.js';

import { IoMdClose } from 'react-icons/io';
import { MdOutlineInventory2 } from 'react-icons/md';

const ReturnPackageInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, chosenOrderContext, dateformatter, orderStatusEnumContext, orderTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchPackages, fetchGovernorates, fetchInventoryItemReturns, updateMerchantDomesticShipping, fetchOrdersInInventory, fetchOrderHistory, createInventoryRent } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });
    const [outOfStock, setoutOfStock] = useState(false);
    const [diffInDays, setdiffInDays] = useState(0);

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assigned: false,
        inventoryId: undefined,
        packageId: parseInt(queryParameters.get('packageId')),
    });

    const fetchInventoryItemReturnsQuery = useQueryGQL('', fetchInventoryItemReturns(), filter);
    // const fetchOrderHistoryQuery = useQueryGQL('', fetchOrderHistory(), filterordershistory);

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

    useEffect(() => {}, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                <div class={' row m-0 w-100 allcentered'}>
                    <div class="col-lg-6">
                        <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                            <div className="col-lg-12 p-0">
                                <div class={' row m-0 w-100 '}>
                                    {fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.data[0]?.orderItems?.map((subitem, subindex) => {
                                        var organizedData = [];
                                        organizedData = organizeInventory(subitem?.inventory);
                                        return (
                                            <div class={'col-lg-12 mb-2'}>
                                                <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="row m-0 w-100 d-flex align-items-center p-2">
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                        <img
                                                            src={
                                                                subitem?.info?.imageUrl
                                                                    ? subitem?.info?.imageUrl
                                                                    : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                            }
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                        />
                                                    </div>
                                                    <div class="col-lg-9 d-flex align-items-center">
                                                        <div className="row m-0 w-100">
                                                            <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                {subitem?.info?.item?.name ?? '-'}
                                                            </div>
                                                            <div style={{ fontSize: '12px' }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                {subitem?.info?.name ?? '-'}
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div style={{ fontSize: '12px' }} class="col-lg-12 p-0 mt-2 d-flex justify-content-end ">
                                        <p className={' m-0 p-0 wordbreak  '}>{dateformatter(fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.data[0]?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                                                            <p class="p-0 m-0">Pallet: {ballotData.ballot.name}</p>
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
        </div>
    );
};
export default ReturnPackageInfo;
