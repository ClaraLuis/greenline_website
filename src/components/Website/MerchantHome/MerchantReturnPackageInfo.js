import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import API from '../../../API/API.js';

import Pagination from '../../Pagination.js';
import ReturnsTable from './ReturnsTable.js';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import { TbTruckDelivery } from 'react-icons/tb';
import Cookies from 'universal-cookie';
import { IoMdClose } from 'react-icons/io';

const MerchantReturnPackageInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, chosenPackageContext, setchosenPackageContext, dateformatter, setchosenOrderContext, returnPackageStatusContext, setpagetitle_context } =
        useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchPackages, fetchGovernorates, fetchMerchantItemReturns, updateMerchantDomesticShipping, findOneReturnPackage, useLazyQueryGQL, paginateReturnPackageHistory } = API();
    useEffect(() => {
        setpageactive_context('/packages');
        setpagetitle_context('Hubs');
    }, []);
    const [signaturemodal, setsignaturemodal] = useState(false);
    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: undefined,
        beforeCursor: undefined,
        assignedToPackage: undefined,

        merchantId: undefined,
        packageId: parseInt(queryParameters.get('packageId')),
    });
    const [filterordershistory, setfilterordershistory] = useState({
        limit: 20,
        packageId: parseInt(queryParameters?.get('packageId')),
    });
    const [findOneReturnPackageLazyQuery] = useLazyQueryGQL(findOneReturnPackage());

    const paginateReturnPackageHistoryQuery = useQueryGQL('', paginateReturnPackageHistory(), filterordershistory);
    const fetchMerchantItemReturnsQuery = useQueryGQL('', fetchMerchantItemReturns(), filter);
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
                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered text-capitalize'
                                            }
                                        >
                                            {chosenPackageContext?.status?.split(/(?=[A-Z])/).join(' ')}
                                        </div>
                                        <div style={{ color: 'white' }} className={' wordbreak  bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}>
                                            {chosenPackageContext?.type?.split(/(?=[A-Z])/).join(' ')}
                                        </div>
                                        {chosenPackageContext?.signatureFile && (
                                            <div
                                                onClick={() => {
                                                    setsignaturemodal(true);
                                                }}
                                                style={{ color: 'white' }}
                                                className={' wordbreak  bg-primary rounded-pill font-weight-600 allcentered text-capitalize'}
                                            >
                                                Signature
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-12 p-0 my-2">
                                    <hr className="m-0" />
                                </div>
                                <div className="col-lg-12 p-0 mb-2">
                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                        #{chosenPackageContext?.merchant?.id}, {chosenPackageContext?.merchant?.name}
                                    </span>
                                </div>
                                {chosenPackageContext?.courier && cookies.get('userInfo')?.type != 'merchant' && (
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
                                clickable={true}
                                background="#F0F5F9"
                                actiononclick={async (item) => {
                                    await setchosenOrderContext(item);
                                    history.push('/orderinfo?orderId=' + item.id);
                                }}
                                card="col-lg-12 px-1"
                                items={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.data}
                            />
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
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
                                                        {historyItem?.status.split(/(?=[A-Z])/).join(' ')} <br />
                                                        {cookies.get('userInfo')?.type != 'merchant' && <span style={{ fontWeight: 500 }}>{historyItem?.user?.name}</span>}
                                                        {historyItem?.courier?.name && cookies.get('userInfo')?.type != 'merchant' && (
                                                            <>
                                                                {' '}
                                                                <br />
                                                                <span style={{ fontWeight: 400 }}>{historyItem?.courier?.name}</span>
                                                            </>
                                                        )}
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
            <Modal
                show={signaturemodal}
                onHide={() => {
                    setsignaturemodal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-612 col-md-12 col-sm-12 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setsignaturemodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div style={{ width: '200px', height: '200px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                            <img
                                src={
                                    chosenPackageContext?.signatureFile?.url
                                        ? chosenPackageContext?.signatureFile?.url
                                        : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                }
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default MerchantReturnPackageInfo;
