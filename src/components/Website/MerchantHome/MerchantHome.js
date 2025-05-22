import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import Select, { components } from 'react-select';

// Icons
import Decimal from 'decimal.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';
import { DateRangePicker } from 'rsuite';
import API from '../../../API/API.js';
import Barchart from '../../graphs/Barchart.js';
import Multilinechart from '../../graphs/Multilinechart.js';
import Piechart from '../../graphs/Piechart.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

const { ValueContainer, Placeholder } = components;

const MerchantHome = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    let history = useHistory();
    const { setpageactive_context, inventoryRentTypeContext, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { createInventory, useMutationGQL, paginateInventoryRentTransaction, useQueryGQL, ordersDeliverableSummary, graphOrders, mostSoldItems, fetchMerchants } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [submit, setsubmit] = useState(false);
    const [merchants, setmerchants] = useState([]);
    const [barchartaxis, setbarchartaxis] = useState({ xAxis: undefined, yAxis: undefined });

    const [filterordersDeliverableSummary, setfilterordersDeliverableSummary] = useState({
        startDate: '2024-06-28T18:38:47.762Z',
    });
    const ordersDeliverableSummaryQuery = useQueryGQL('cache-first', ordersDeliverableSummary(), filterordersDeliverableSummary);

    const [filtergraphOrders, setfiltergraphOrders] = useState({
        startDate: thirtyDaysAgo.toISOString(), // Set startDate to 30 days ago
        endDate: today.toISOString(), // Set endDate to today
    });

    const graphOrdersQuery = useQueryGQL('cache-first', graphOrders(), filtergraphOrders);
    const [filtermostSoldItems, setfiltermostSoldItems] = useState({});
    const mostSoldItemsQuery = useQueryGQL('cache-first', mostSoldItems(), filtermostSoldItems);

    useEffect(() => {
        const temp = []; // Array to track all unique statuses
        const tempvalues = [{ name: props?.type, data: [] }]; // Data for bar chart
        let tempvalues1 = []; // Data for percentage chart
        let total = new Decimal(0); // Initialize total as a Decimal

        const data = ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data;

        if (data) {
            // Check grouping type
            const isGroupedByStatus = Array.isArray(data['Partially Delivered']); // Example key check for status
            const isGroupedByMerchant = Object.keys(data).some((key) => Array.isArray(data[key]));

            if (isGroupedByStatus) {
                // Handle data grouped by status
                Object.keys(data).forEach((status) => {
                    temp.push(status); // Add status to x-axis

                    const statusTotal = data[status]?.reduce((acc, item) => acc.plus(new Decimal(item?.total || 0)), new Decimal(0));
                    const statusCount = data[status]?.reduce((acc, item) => acc.plus(new Decimal(item?.count || 0)), new Decimal(0));

                    // Add total to bar chart
                    tempvalues[0].data.push(statusTotal.toNumber());

                    // Accumulate overall total count
                    total = total.plus(statusCount);
                });

                // Calculate percentages for each status
                temp.forEach((status) => {
                    const statusCount = data[status]?.reduce((acc, item) => acc.plus(new Decimal(item?.count || 0)), new Decimal(0));

                    const percentage = statusCount.div(total).times(100).toNumber();
                    tempvalues1.push(percentage);
                });
            } else if (isGroupedByMerchant) {
                // Handle data grouped by merchant
                Object.keys(data).forEach((merchantId) => {
                    const merchantPayments = data[merchantId];
                    const groupedByStatus = {};

                    // Group merchant data by status
                    merchantPayments.forEach((payment) => {
                        const { status, total: paymentTotal } = payment;

                        if (!groupedByStatus[status]) {
                            groupedByStatus[status] = new Decimal(0);
                        }

                        groupedByStatus[status] = groupedByStatus[status].plus(new Decimal(paymentTotal || 0));
                        if (!temp.includes(status)) temp.push(status); // Add status to x-axis if not already present
                    });

                    // Prepare bar chart data for each merchant
                    const merchantData = temp.map((status) => groupedByStatus[status]?.toNumber() || 0);
                    tempvalues.push({ name: `${merchants?.filter((i) => i.id == merchantId)[0]?.name}`, data: merchantData });
                });

                // Calculate total and percentages for merchants
                Object.values(data).forEach((merchantPayments) => {
                    merchantPayments.forEach((payment) => {
                        total = total.plus(new Decimal(payment?.count || 0));
                    });
                });

                temp.forEach((status) => {
                    const statusCount = Object.values(data).reduce((acc, merchantPayments) => {
                        return acc.plus(
                            merchantPayments.filter((payment) => payment.status === status).reduce((statusAcc, payment) => statusAcc.plus(new Decimal(payment?.count || 0)), new Decimal(0)),
                        );
                    }, new Decimal(0));

                    const percentage = statusCount.div(total).times(100).toNumber();
                    tempvalues1.push(percentage);
                });
            }
        }

        // Set the data for charts
        setbarchartaxis({
            xAxis: temp, // Unique statuses
            yAxis: tempvalues, // Bar chart data
            yAxis1: tempvalues1, // Percentage chart data
            total: total.toNumber(), // Overall total count
        });
    }, [ordersDeliverableSummaryQuery?.data]);

    const [chartData, setChartData] = useState([]);
    const [xaxisCategories, setXaxisCategories] = useState([]);

    useEffect(() => {
        if (graphOrdersQuery?.data) {
            const tempCategories = [];
            const seriesData = {
                Return: [],
                Delivery: [],
                Exchange: [],
            };

            Object.keys(graphOrdersQuery?.data?.graphOrders?.data).forEach((type) => {
                graphOrdersQuery?.data?.graphOrders?.data[type].forEach((item) => {
                    // const dateFormatted = new Date(item.createdAt).toLocaleString();
                    const dateObj = new Date(item.createdAt);
                    const dateFormatted = `${dateObj.toLocaleDateString([], { weekday: 'long' })}, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                    if (!tempCategories.includes(dateFormatted)) {
                        tempCategories.push(dateFormatted);
                    }

                    const totalValue = new Decimal(item.total || 0); // Use Decimal for total value
                    seriesData[type].push(totalValue.toNumber()); // Convert Decimal to number
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
        setpagetitle_context('Merchant');
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            {isAuth([1, 52, 10]) && (
                <div class="row m-0 w-100 d-flex align-items-start justify-content-start mt-sm-2 pb-5 pb-md-0">
                    <div class="col-lg-12">
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                                <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                    Dashboard
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 ">
                        <div class={generalstyles.card + ' mb-3 col-lg-12 p-2'}>
                            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                    <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
                                                </div>
                                                <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                    <AccordionItemState>
                                                        {(state) => {
                                                            if (state.expanded == true) {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronUp />
                                                                    </i>
                                                                );
                                                            } else {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronDown />
                                                                    </i>
                                                                );
                                                            }
                                                        }}
                                                    </AccordionItemState>
                                                </div>
                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        <hr className="mt-2 mb-3" />
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                <div class="row m-0 w-100  ">
                                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                        <label class={formstyles.form__label}>Order by</label>
                                                        <Select
                                                            options={[
                                                                { label: 'Oldest', value: true },
                                                                { label: 'Latest', value: false },
                                                            ]}
                                                            styles={defaultstyles}
                                                            value={[
                                                                { label: 'Oldest', value: true },
                                                                { label: 'Latest', value: false },
                                                            ].find((option) => option.value === (filterordersDeliverableSummary?.isAsc ?? true))}
                                                            onChange={(option) => {
                                                                setfilterordersDeliverableSummary({ ...filterordersDeliverableSummary, isAsc: option?.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {isAuth([1]) && (
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <MerchantSelectComponent
                                                        type="multi"
                                                        label={'name'}
                                                        value={'id'}
                                                        selected={filterordersDeliverableSummary?.merchantIds}
                                                        onClick={(option) => {
                                                            var tempArray = [...(filterordersDeliverableSummary?.merchantIds ?? [])];
                                                            var temp = [...merchants];
                                                            if (option == 'All') {
                                                                tempArray = undefined;
                                                                temp = [];
                                                            } else {
                                                                if (!temp.some((i) => i.id === option.id)) {
                                                                    temp.push(option);
                                                                } else {
                                                                    const index = temp.findIndex((i) => i.id === option.id);
                                                                    if (index !== -1) {
                                                                        temp.splice(index, 1);
                                                                    }
                                                                }
                                                                if (!tempArray?.includes(option?.id)) {
                                                                    tempArray.push(option?.id);
                                                                } else {
                                                                    tempArray.splice(tempArray?.indexOf(option?.id), 1);
                                                                }
                                                            }
                                                            setmerchants([...temp]);
                                                            setfilterordersDeliverableSummary({ ...filterordersDeliverableSummary, merchantIds: tempArray?.length != 0 ? tempArray : undefined });
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div class=" col-lg-3 mb-md-2">
                                                <span>Date Range</span>
                                                <div class="mt-1" style={{ width: '100%' }}>
                                                    <DateRangePicker
                                                        onChange={(event) => {
                                                            if (event != null) {
                                                                setfilterordersDeliverableSummary({
                                                                    ...filterordersDeliverableSummary,
                                                                    startDate: event[0],
                                                                    endDate: event[1],
                                                                });
                                                            }
                                                        }}
                                                        onClean={() => {
                                                            setfilterordersDeliverableSummary({
                                                                ...filterordersDeliverableSummary,
                                                                startDate: '2024-06-28T18:38:47.762Z',
                                                                endDate: undefined,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>

                    <div class={barchartaxis?.xAxis && barchartaxis?.yAxis1?.length ? 'col-lg-7 scrollmenuclasssubscrollbar' : 'col-lg-12 p-1 scrollmenuclasssubscrollbar'}>
                        {barchartaxis?.xAxis &&
                            barchartaxis?.yAxis &&
                            ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data?.length != 0 &&
                            ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data &&
                            Object.keys(ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data).length > 0 && (
                                <div class={generalstyles.card + ' row m-0 w-100 '}>
                                    <div class={'col-lg-12 my-2'} style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Total amount per delivery type
                                    </div>
                                    <Barchart xAxis={barchartaxis?.xAxis} yAxis={barchartaxis?.yAxis} />
                                </div>
                            )}

                        {chartData && xaxisCategories && mostSoldItemsQuery?.data && graphOrdersQuery?.data?.graphOrders?.data && Object.keys(graphOrdersQuery.data.graphOrders.data).length > 0 && (
                            <div class={generalstyles.card + ' row m-0 w-100 '}>
                                <div class={'col-lg-12 my-2'} style={{ fontSize: '17px', fontWeight: 700 }}>
                                    Timeline per delivery type
                                </div>
                                <Multilinechart chartData={chartData} xaxisCategories={xaxisCategories} />
                            </div>
                        )}
                    </div>
                    {barchartaxis?.xAxis && barchartaxis?.yAxis1 && ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary && (
                        <div class="col-lg-5 ">
                            {ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data?.length != 0 &&
                                ordersDeliverableSummaryQuery?.data?.ordersDeliverableSummary?.data &&
                                Object.keys(ordersDeliverableSummaryQuery.data.ordersDeliverableSummary.data).length > 0 && (
                                    <div class={generalstyles.card + ' row m-0 w-100 '}>
                                        <div class={'col-lg-12 my-2'} style={{ fontSize: '17px', fontWeight: 700 }}>
                                            Total amount per delivery type
                                        </div>
                                        <Piechart height={mostSoldItemsQuery?.data ? '250' : 300} xAxis={barchartaxis?.xAxis} yAxis={barchartaxis?.yAxis1} title={''} total={barchartaxis?.total} />
                                    </div>
                                )}

                            {mostSoldItemsQuery?.data && (
                                <div class={generalstyles.card + ' row m-0 w-100  '}>
                                    <div class={'col-lg-12 my-2'} style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Most Sold Items
                                    </div>
                                    {mostSoldItemsQuery?.data?.mostSoldItems?.data?.length == 0 && (
                                        <div style={{ height: '42vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div class="row m-0 w-100">
                                                <FaLayerGroup size={35} class=" col-lg-12" />
                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No Items
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div class="col-lg-12 p-0">
                                        <div class="row m-0 w-100 scrollmenuclasssubscrollbar" style={{ maxHeight: '330px', overflow: 'scroll' }}>
                                            {mostSoldItemsQuery?.data?.mostSoldItems?.data.map((subitem, subindex) => {
                                                return (
                                                    <div class={'col-lg-12 mb-2'}>
                                                        <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="row m-0 w-100 p-2">
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
                                                                    <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-10 p-0 wordbreak wordbreak1'}>
                                                                        {subitem?.itemVariant?.fullName ?? '-'}
                                                                    </div>
                                                                    <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-2 d-flex justify-content-end p-0'}>
                                                                        {subitem?.soldCount ?? '-'}
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
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {chartData && xaxisCategories && !mostSoldItemsQuery?.data && graphOrdersQuery?.data?.graphOrders?.data && Object.keys(graphOrdersQuery.data.graphOrders.data).length > 0 && (
                        <div class="col-lg-12 ">
                            <div class={generalstyles.card + ' row m-0 w-100 '}>
                                <div class={'col-lg-12 my-2'} style={{ fontSize: '17px', fontWeight: 700 }}>
                                    Timeline per delivery type
                                </div>
                                <Multilinechart chartData={chartData} xaxisCategories={xaxisCategories} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default MerchantHome;
