import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';

// Icons
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import Barchart from '../../graphs/Barchart.js';
import Piechart from '../../graphs/Piechart.js';
import Multilinechart from '../../graphs/Multilinechart.js';
const { ValueContainer, Placeholder } = components;

const MerchantHome = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const { createInventory, useMutationGQL, paginateInventoryRentTransaction, useQueryGQL, ordersDeliverableSummary, graphOrders, mostSoldItems } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [inventoryRentPayload, setinventoryRentPayload] = useState({
        merchantId: 1,
        type: '',
        startDate: '',
        pricePerUnit: '',
        currency: '',
    });
    const [openModal, setopenModal] = useState(false);
    const [submit, setsubmit] = useState(false);
    const [barchartaxis, setbarchartaxis] = useState({ xAxis: undefined, yAxis: undefined });

    const [addInventoryRent] = useMutationGQL(createInventory(), {
        merchantId: parseInt(inventoryRentPayload?.merchantId),
        type: inventoryRentPayload?.type,
        startDate: inventoryRentPayload?.startDate,
        pricePerUnit: inventoryRentPayload?.pricePerUnit,
        currency: inventoryRentPayload?.currency,
    });
    const [filterTransactions, setfilterTransactions] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantId: 1,
    });
    const paginateInventoryRentTransactionQuery = useQueryGQL('cache-first', paginateInventoryRentTransaction(), filterTransactions);

    const [filterordersDeliverableSummary, setfilterordersDeliverableSummary] = useState({
        merchantIds: [],
        startDate: '2024-06-28T18:38:47.762Z',
    });
    const ordersDeliverableSummaryQuery = useQueryGQL('cache-first', ordersDeliverableSummary(), filterordersDeliverableSummary);

    const [filtergraphOrders, setfiltergraphOrders] = useState({
        startDate: '2024-01-28T18:38:47.762Z',
    });
    const graphOrdersQuery = useQueryGQL('cache-first', graphOrders(), filtergraphOrders);
    const [filtermostSoldItems, setfiltermostSoldItems] = useState({});
    const mostSoldItemsQuery = useQueryGQL('cache-first', mostSoldItems(), filtermostSoldItems);

    const dateformatter = (date) => {
        // const options = { month: 'short', day: };
        const options = { month: 'long', day: 'numeric', hour: 'numeric', hour12: true };

        return new Date(date).toLocaleDateString(undefined, options);
    };
    useEffect(() => {
        var temp = [];
        var tempvalues = [{ name: props?.type, data: [] }];
        var tempvalues1 = [];
        var total = 0;
        ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data?.map((item, index) => {
            temp.push(item.status);
            tempvalues[0]?.data.push(parseFloat(item?.total));
        });

        ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data?.map((item, index) => {
            total += parseFloat(item?.count);
        });
        ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data?.map((subitem, suindex) => {
            tempvalues1.push(parseFloat((subitem?.count / total) * 100));
        });
        setbarchartaxis({ xAxis: temp, yAxis: tempvalues, yAxis1: tempvalues1, total: total });
    }, [ordersDeliverableSummaryQuery?.data]);

    const [chartData, setChartData] = useState([]);
    const [xaxisCategories, setXaxisCategories] = useState([]);

    useEffect(() => {
        if (graphOrdersQuery?.data) {
            let tempCategories = [];
            let seriesData = {
                Return: [],
                Delivery: [],
                Exchange: [],
            };

            Object.keys(graphOrdersQuery?.data?.graphOrders?.data).forEach((type) => {
                graphOrdersQuery?.data?.graphOrders?.data[type].forEach((item) => {
                    const dateFormatted = new Date(item.createdAt).toLocaleString();
                    if (!tempCategories.includes(dateFormatted)) {
                        tempCategories.push(dateFormatted);
                    }

                    const totalValue = parseFloat(item.total);
                    seriesData[type].push(totalValue);
                });
            });

            const finalSeries = Object.keys(seriesData).map((key) => ({
                name: key,
                data: seriesData[key],
            }));

            setChartData(finalSeries);
            setXaxisCategories(tempCategories);
        }
    }, [graphOrdersQuery?.data]);
    useEffect(() => {
        setpageactive_context('/merchanthome');
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-start justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Dashboard
                    </p>
                </div>
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + '  mb-1 mx-2'}
                        onClick={() => {
                            history.push('/bookvisit');
                        }}
                    >
                        Book a visit
                    </button>
                </div>
                <div class="col-lg-7 p-1 scrollmenuclasssubscrollbar">
                    {barchartaxis?.xAxis && barchartaxis?.yAxis && (
                        <div
                            class="row m-0 w-100"
                            style={{
                                background: 'white',
                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                borderRadius: '5px',
                            }}
                        >
                            <Barchart xAxis={barchartaxis?.xAxis} yAxis={barchartaxis?.yAxis} />
                        </div>
                    )}
                    {chartData && xaxisCategories && (
                        <div
                            class="row m-0 w-100 mt-3"
                            style={{
                                background: 'white',
                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                borderRadius: '5px',
                            }}
                        >
                            <Multilinechart chartData={chartData} xaxisCategories={xaxisCategories} />
                        </div>
                    )}
                </div>
                {barchartaxis?.xAxis && barchartaxis?.yAxis1 && (
                    <div class="col-lg-5 p-1 pl-2">
                        <div
                            class="row m-0 w-100"
                            style={{
                                background: 'white',
                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                borderRadius: '5px',
                            }}
                        >
                            <Piechart xAxis={barchartaxis?.xAxis} yAxis={barchartaxis?.yAxis1} title={'Orders'} total={barchartaxis?.total} />
                        </div>
                        {mostSoldItemsQuery?.data && (
                            <div
                                class="row m-0 w-100 mt-3"
                                style={{
                                    background: 'white',
                                    boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                    borderRadius: '5px',
                                }}
                            >
                                <div class={'col-lg-12 my-2'} style={{ fontSize: '17px', fontWeight: 700 }}>
                                    Most Sold Items
                                </div>
                                {mostSoldItemsQuery?.data?.mostSoldItems?.data.map((subitem, subindex) => {
                                    return (
                                        <div class={'col-lg-12 mb-2'}>
                                            <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-2">
                                                <div style={{ width: '35px', height: '35px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                    <img
                                                        src={
                                                            subitem?.itemVariant?.imageUrl
                                                                ? subitem?.itemVariant?.imageUrl
                                                                : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                        }
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                    />
                                                </div>
                                                <div class="col-lg-10 d-flex align-items-center">
                                                    <div className="row m-0 w-100">
                                                        <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                            {subitem?.itemVariant?.name ?? '-'}
                                                        </div>
                                                        <div style={{ fontSize: '12px' }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                            {subitem?.itemVariant?.sku ?? '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Modal
                show={openModal}
                onHide={() => {
                    setopenModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Inventory rent</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenModal(false);
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
                            submit={submit}
                            setsubmit={setsubmit}
                            size={'md'}
                            attr={[
                                {
                                    name: 'Type',
                                    attr: 'type',
                                    type: 'select',
                                    options: inventoryRentTypeContext,
                                    size: '12',
                                },
                                {
                                    name: 'Start Date',
                                    attr: 'startDate',
                                    type: 'date',
                                    size: '12',
                                },
                                {
                                    name: 'Price Per Unit',
                                    attr: 'pricePerUnit',
                                    type: 'number',
                                    size: '12',
                                },
                                {
                                    name: 'Currency',
                                    attr: 'currency',
                                    type: 'select',
                                    options: [{ label: 'EGP', value: 'EGP' }],
                                    size: '12',
                                },
                            ]}
                            payload={inventoryRentPayload}
                            setpayload={setinventoryRentPayload}
                            button1disabled={buttonLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={'Update'}
                            button1onClick={async () => {
                                setbuttonLoading(true);
                                try {
                                    await addInventoryRent();
                                    setchangestatusmodal(false);
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
                                    console.error('Error adding Merchant:', error);
                                }
                                setbuttonLoading(false);
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default MerchantHome;
