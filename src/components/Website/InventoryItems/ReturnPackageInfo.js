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
import Pagination from '../../Pagination.js';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import { TbTruckDelivery } from 'react-icons/tb';
import ReturnsTable from '../MerchantHome/ReturnsTable.js';

const ReturnPackageInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, chosenPackageContext, dateformatter, setchosenPackageContext, orderTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useLazyQueryGQL, paginateReturnPackageHistory, fetchInventoryItemReturns, findOneReturnPackage, fetchOrdersInInventory, fetchOrderHistory, createInventoryRent } = API();
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
    const [filterordershistory, setfilterordershistory] = useState({
        limit: 20,
        packageId: parseInt(queryParameters?.get('packageId')),
    });
    const fetchInventoryItemReturnsQuery = useQueryGQL('', fetchInventoryItemReturns(), filter);
    // const fetchOrderHistoryQuery = useQueryGQL('', fetchOrderHistory(), filterordershistory);
    const paginateReturnPackageHistoryQuery = useQueryGQL('', paginateReturnPackageHistory(), filterordershistory);
    const [findOneReturnPackageLazyQuery] = useLazyQueryGQL(findOneReturnPackage());

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

    const dateformatterDayAndMonth = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'long' });
        return `${day} ${month}`;
    };
    const dateformatterTime = (date) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(date).toLocaleTimeString(undefined, options);
    };
    useEffect(() => {
        if (JSON.stringify(chosenPackageContext) == '{}') {
            const fetchOrder = async () => {
                if (queryParameters.get('packageId')) {
                    var { data } = await findOneReturnPackageLazyQuery({
                        variables: {
                            id: parseInt(queryParameters.get('packageId')),
                        },
                    });
                    setchosenPackageContext(data?.findReturnPackageById);
                    console.log(data);
                }
            };
            fetchOrder();
        }
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                <div class={' row m-0 w-100 '}>
                    <div class="col-lg-6">
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div>Main Info</div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-2 p-0">
                            <div style={{ background: 'white' }} class={generalstyles.card + ' row m-0 w-100   d-flex align-items-center'}>
                                <div className="col-lg-5 p-0">
                                    <span style={{ fontSize: '12px', color: 'grey' }}>
                                        # {chosenPackageContext?.id}, {chosenPackageContext?.sku}
                                    </span>
                                </div>
                                <div className="col-lg-7 p-0 d-flex justify-content-end align-items-center">
                                    <div class="row m-0 w-100 d-fex justify-content-end align-items-center">
                                        <div
                                            className={
                                                chosenPackageContext?.status == 'delivered'
                                                    ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  text-capitalize'
                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered text-capitalize '
                                            }
                                        >
                                            {/* {returnPackageStatusContext?.map((i, ii) => {
                                            if (i.value == chosenPackageContext?.status) {
                                                return <span>{i.label}</span>;
                                            }
                                        })} */}
                                            {chosenPackageContext?.status?.split(/(?=[A-Z])/).join(' ')}
                                        </div>
                                        <div style={{ color: 'white' }} className={' wordbreak  bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize '}>
                                            {chosenPackageContext?.type?.split(/(?=[A-Z])/).join(' ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 p-0 my-2">
                                    <hr className="m-0" />
                                </div>
                                <div className="col-lg-12 p-0 mb-2">
                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                        #{chosenPackageContext?.inventory?.id}, {chosenPackageContext?.inventory?.name}
                                    </span>
                                </div>
                                {chosenPackageContext?.courier && (
                                    <div className="col-lg-12 p-0 mb-2 d-flex align-items-center">
                                        <TbTruckDelivery size={20} class="mr-1" />

                                        <span style={{ fontWeight: 600 }} class="text-capitalize">
                                            {chosenPackageContext?.courier?.name}
                                        </span>
                                    </div>
                                )}

                                <div class="col-lg-12 p-0 d-flex justify-content-end" style={{ fontSize: '12px', color: 'grey' }}>
                                    {dateformatter(chosenPackageContext?.createdAt)}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div>Orders</div>
                            </div>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100 p-4'}>
                            <ReturnsTable
                                clickable={false}
                                background="#F0F5F9"
                                type={'inventory'}
                                card="col-lg-12 px-1"
                                items={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.data}
                            />
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.cursor?.beforeCursor}
                                    afterCursor={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.cursor?.afterCursor}
                                    filter={filter}
                                    setfilter={setfilter}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div>History</div>
                            </div>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100 py-4 px-0'}>
                            {paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.length == 0 && (
                                <div class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={22} class=" col-lg-12 mb-2" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            No History Yet
                                        </div>
                                    </div>
                                </div>
                            )}
                            {paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.length != 0 && (
                                <div style={{ overflowY: 'scroll' }} class={' row m-0 w-100 p-0 pb-4  scrollmenuclasssubscrollbar'}>
                                    <Timeline
                                        style={{ width: '100%' }}
                                        sx={{
                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                flex: 0.2,
                                            },
                                        }}
                                    >
                                        {paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.map((historyItem, historyIndex) => {
                                            return (
                                                <TimelineItem>
                                                    <TimelineOppositeContent style={{ fontSize: '13px', minWidth: '100px' }}>
                                                        <span style={{ fontSize: '13px', color: 'black', fontWeight: 600 }}>{dateformatterDayAndMonth(historyItem?.createdAt)}</span>
                                                        <br />
                                                        {dateformatterTime(historyItem?.createdAt)}
                                                    </TimelineOppositeContent>
                                                    <TimelineSeparator>
                                                        <TimelineDot style={{ background: 'var(--primary)' }} />
                                                        {historyIndex < paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.length - 1 && (
                                                            <TimelineConnector style={{ background: 'var(--primary)' }} />
                                                        )}
                                                    </TimelineSeparator>
                                                    <TimelineContent style={{ fontWeight: 600, color: 'black', textTransform: 'capitalize' }}>
                                                        {historyItem?.status.split(/(?=[A-Z])/).join(' ')}{' '}
                                                    </TimelineContent>
                                                </TimelineItem>
                                            );
                                        })}
                                    </Timeline>
                                </div>
                            )}
                            {paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.length != 0 && (
                                <div class="col-lg-12 p-0">
                                    <Pagination
                                        beforeCursor={paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.beforeCursor}
                                        afterCursor={paginateReturnPackageHistoryQuery?.data?.paginateReturnPackageHistory?.data?.afterCursor}
                                        filter={filterordershistory}
                                        setfilter={setfilterordershistory}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReturnPackageInfo;
