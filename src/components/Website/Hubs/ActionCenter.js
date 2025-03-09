import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { components } from 'react-select';
import { DateRangePicker } from 'rsuite';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';

import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import OrdersTable from '../Orders/OrdersTable.js';
const { ValueContainer, Placeholder } = components;

const ActionCenter = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, paginateUnresolvedOrders, fetchHubs, updateupdateOrderIdsStatus, useMutationGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [ordersWithDetails, setordersWithDetails] = useState([]);

    const [waybills, setWaybills] = useState([]);

    const [filterorders, setfilterorders] = useState({
        limit: 20,
        fromDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
    });

    const paginateUnresolvedOrdersQuery = useQueryGQL('', paginateUnresolvedOrders(), filterorders);

    const [selectedOrders, setSelectedOrders] = useState([]);

    const [filterHubs, setfilterHubs] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('', fetchHubs(), filterHubs);
    const handleSelectOrder = (order) => {
        if (!isAuth([1, 105])) {
            NotificationManager.warning('Not Authorized', 'Warning!');
            return;
        }
        setSelectedOrders((prevSelected) => (prevSelected.includes(order.id) ? prevSelected.filter((id) => id !== order.id) : [...prevSelected, order.id]));
        var temp = [...ordersWithDetails];
        var exist = false;
        var indexexist = null;
        temp?.map((item, index) => {
            if (order.id == item.id) {
                exist = true;
                indexexist = index;
            }
        });
        if (exist) {
            temp.splice(indexexist, 1);
        } else {
            temp.push(order);
        }
        setordersWithDetails(temp);
    };
    const [updateupdateOrderIdsStatusMutation] = useMutationGQL(updateupdateOrderIdsStatus(), {
        status: ordersWithDetails?.every((i) => i.status === 'failedDeliveryAttempt') ? 'inResolution' : ordersWithDetails?.every((i) => i.status === 'inResolution') ? 'inCage' : '',
        ids: selectedOrders,
    });

    useEffect(() => {
        // alert();
        setpageactive_context(window.location.pathname);
        setpagetitle_context('Hubs');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Orders
                            </p>
                        </div>
                        <div className="col-lg-6 p-0 d-flex align-items-center justify-content-end">
                            <button
                                class={generalstyles.roundbutton + ' allcentered  p-0'}
                                onClick={() => {
                                    history.push('/batchscan');
                                }}
                            >
                                <span>Batch Scan</span>
                            </button>
                        </div>
                    </div>
                </div>
                {isAuth([1, 104]) && (
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' mb-2 col-lg-12 p-2'}>
                            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                <AccordionItem class={`${generalstyles.innercard} p-2`}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                    <p class={`${generalstyles.cardTitle} m-0 p-0`}>Filter:</p>
                                                </div>
                                                <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                    <AccordionItemState>
                                                        {(state) => <i class="h-100 d-flex align-items-center justify-content-center">{state.expanded ? <BsChevronUp /> : <BsChevronDown />}</i>}
                                                    </AccordionItemState>
                                                </div>
                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        <hr className="mt-2 mb-3" />
                                        <div class="row m-0 w-100">
                                            {isAuth([1, 63]) && (
                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <SelectComponent
                                                        title="Hubs"
                                                        filter={filterHubs}
                                                        setfilter={setfilterHubs}
                                                        options={fetchHubsQuery}
                                                        attr="paginateHubs"
                                                        label={'name'}
                                                        value={'id'}
                                                        payload={filterorders}
                                                        payloadAttr={'hubId'}
                                                        onClick={(option) => {
                                                            setfilterorders({ ...filterorders, hubId: option?.id });
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div class="col-lg-3 mb-md-2">
                                                <span>Date Range</span>
                                                <div class="mt-1" style={{ width: '100%' }}>
                                                    <DateRangePicker
                                                        // value={[filterorders?.fromDate ? new Date(filterorders.fromDate) : null, filterorders?.toDate ? new Date(filterorders.toDate) : null]}
                                                        onChange={(event) => {
                                                            if (event != null) {
                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    fromDate: event[0],
                                                                    toDate: event[1],
                                                                });
                                                            }
                                                        }}
                                                        onClean={() => {
                                                            setfilterorders({
                                                                ...filterorders,
                                                                fromDate: null,
                                                                toDate: null,
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
                )}

                {isAuth([1, 104]) && (
                    <div class={' row m-0 w-100'}>
                        {isAuth([1, 105]) && (
                            <div class="col-lg-12 px-3">
                                <div class={generalstyles.card + ' row m-0 w-100'}>
                                    <div className="col-lg-6 p-0 d-flex justify-content-end ">
                                        <div
                                            onClick={() => {
                                                var temp = [];
                                                var temp1 = [];
                                                if (selectedOrders?.length != paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.length) {
                                                    paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.map((i, ii) => {
                                                        temp.push(i.id);
                                                        temp1.push(i);
                                                    });
                                                }
                                                setordersWithDetails(temp1);
                                                setSelectedOrders(temp);
                                            }}
                                            class="row m-0 w-100 d-flex align-items-center"
                                            style={{
                                                cursor: 'pointer',
                                                // color:
                                                //     selectedOrders?.length == paginateUnresolvedOrdersQuery?.data?.paginateOrders?.data?.length ? 'var(--success)' : '',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                }}
                                                className="iconhover allcentered mr-1"
                                            >
                                                {selectedOrders?.length != paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.length && (
                                                    <FiCircle
                                                        style={{ transition: 'all 0.4s' }}
                                                        color={selectedOrders?.length == paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.length ? 'var(--success)' : ''}
                                                        size={18}
                                                    />
                                                )}
                                                {selectedOrders?.length == paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.length && (
                                                    <FiCheckCircle
                                                        style={{ transition: 'all 0.4s' }}
                                                        color={selectedOrders?.length == paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.length ? 'var(--success)' : ''}
                                                        size={18}
                                                    />
                                                )}
                                            </div>
                                            {selectedOrders?.length != paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.data?.length ? 'Select All' : 'Deselect All'}
                                        </div>
                                    </div>
                                    <div class="col-lg-6 d-flex justify-content-end">
                                        <div className="row m-0 w-100 d-flex justify-content-end">
                                            {(ordersWithDetails?.every((i) => i.status === 'failedDeliveryAttempt') || ordersWithDetails?.every((i) => i.status === 'inResolution')) &&
                                                ordersWithDetails?.length != 0 && (
                                                    <button
                                                        style={{ height: '30px', minWidth: '170px' }}
                                                        class={generalstyles.roundbutton + ' allcentered  p-0'}
                                                        onClick={async () => {
                                                            if (buttonLoadingContext) return;
                                                            setbuttonLoadingContext(true);
                                                            if (selectedOrders?.length != 0) {
                                                                try {
                                                                    const { data } = await updateupdateOrderIdsStatusMutation();
                                                                    if (data?.updateOrdersStatus?.success == true) {
                                                                        paginateUnresolvedOrdersQuery.refetch();
                                                                        NotificationManager.success('Orders status updated successfully', 'Success');
                                                                    } else {
                                                                        NotificationManager.warning(data?.updateOrdersStatus?.message, 'Warning!');
                                                                    }
                                                                } catch (error) {
                                                                    // alert(JSON.stringify(error));
                                                                    let errorMessage = 'An unexpected error occurred';
                                                                    // // Check for GraphQL errors
                                                                    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                                        errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                                    } else if (error.networkError) {
                                                                        errorMessage = error.networkError.message || errorMessage;
                                                                    } else if (error.message) {
                                                                        errorMessage = error.message;
                                                                    }
                                                                    NotificationManager.warning(errorMessage, 'Warning!');
                                                                }
                                                            }

                                                            setbuttonLoadingContext(false);
                                                        }}
                                                        disabled={buttonLoadingContext}
                                                    >
                                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                        {!buttonLoadingContext && (
                                                            <span>
                                                                {ordersWithDetails?.every((i) => i.status === 'failedDeliveryAttempt')
                                                                    ? 'Mark as In Resolution'
                                                                    : ordersWithDetails?.every((i) => i.status === 'inResolution')
                                                                    ? 'Resolve'
                                                                    : ''}
                                                            </span>
                                                        )}
                                                        {/* Add Manifest */}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div class="col-lg-12 p-0 mb-2">
                            <Pagination
                                beforeCursor={paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.cursor?.beforeCursor}
                                afterCursor={paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                            <OrdersTable
                                selectedOrders={selectedOrders}
                                clickable={isAuth([1, 105]) ? true : false}
                                actiononclick={(order) => handleSelectOrder(order)}
                                fetchOrdersQuery={paginateUnresolvedOrdersQuery}
                                attr={'paginateUnresolvedOrders'}
                            />
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.cursor?.beforeCursor}
                                afterCursor={paginateUnresolvedOrdersQuery?.data?.paginateUnresolvedOrders?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ActionCenter;
