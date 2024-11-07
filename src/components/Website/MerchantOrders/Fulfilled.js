import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { FaWindowMinimize } from 'react-icons/fa';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import ReturnsTable from '../MerchantHome/ReturnsTable.js';
import OrdersTable from '../Orders/OrdersTable.js';

const Fulfilled = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, paymentTypeContext, returnPackageTypeContext } = useContext(Contexthandlerscontext);
    const { useMutationGQL, fetchOrders, updateupdateOrderIdsStatus, fetchHubs, fetchInventoryItemReturns, useQueryGQL, createReturnPackage } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const [orderpayload, setorderpayload] = useState({
        ids: [],
        type: 'inventory',
        toInventoryId: undefined,
        toMerchantId: undefined,
    });

    const [buttonLoading, setbuttonLoading] = useState(false);

    const [filterorders, setfilterorders] = useState({
        limit: 20,
        statuses: window.location.pathname == '/fulfilled' ? ['fulfilled'] : ['dispatched'],
    });
    const fetchOrdersQuery = useQueryGQL('', fetchOrders(), filterorders);
    const { refetch: refetchOrders } = useQueryGQL('', fetchOrders(), filterorders);

    const [updateupdateOrderIdsStatusMutation] = useMutationGQL(updateupdateOrderIdsStatus(), {
        status: 'dispatched',
        ids: selectedOrders,
        toHubId: orderpayload?.toHubId,
    });

    const [filterHubs, setfilterHubs] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('', fetchHubs(), filterHubs);
    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) => (prevSelected.includes(orderId) ? prevSelected.filter((id) => id !== orderId) : [...prevSelected, orderId]));
    };
    useEffect(() => {
        setpageactive_context(window.location.pathname);
        setpagetitle_context('Warehouses');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-8 p-0 '}>
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                            <OrdersTable
                                refetchOrders={refetchOrders}
                                selectedOrders={selectedOrders}
                                clickable={true}
                                actiononclick={(order) => handleSelectOrder(order.id)}
                                fetchOrdersQuery={fetchOrdersQuery}
                                attr={'paginateOrders'}
                                srcFrom="merchant"
                            />
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 mb-3 px-1">
                    <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3'}>
                        <div class="col-lg-12">
                            {selectedOrders?.length != 0 && (
                                <>
                                    <div class="col-lg-12 pb-2 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Orders ({selectedOrders?.length})
                                    </div>
                                </>
                            )}
                        </div>

                        <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <SelectComponent
                                title={'Hub'}
                                filter={filterHubs}
                                setfilter={setfilterHubs}
                                options={fetchHubsQuery}
                                attr={'paginateHubs'}
                                label={'name'}
                                value={'id'}
                                payload={orderpayload}
                                payloadAttr={'toHubId'}
                                onClick={(option) => {
                                    setorderpayload({ ...orderpayload, toHubId: option?.id });
                                }}
                                removeAll={true}
                            />
                        </div>

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                disabled={buttonLoading}
                                onClick={async () => {
                                    if (buttonLoading) return;
                                    setbuttonLoading(true);
                                    if (selectedOrders?.length != 0) {
                                        try {
                                            const { data } = await updateupdateOrderIdsStatusMutation();
                                            if (data?.updateOrdersStatus?.success == true) {
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
                                    setbuttonLoading(false);
                                }}
                                class={generalstyles.roundbutton}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>Dispatch Orders</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Fulfilled;
