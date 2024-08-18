import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import { DateRangePicker } from 'rsuite';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { IoMdClose } from 'react-icons/io';
import { Modal } from 'react-bootstrap';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import OrdersTable from './OrdersTable.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import Cookies from 'universal-cookie';
import Inputfield from '../../Inputfield.js';
import MultiSelect from '../../MultiSelect.js';
import { NotificationManager } from 'react-notifications';
import { AiOutlineClose } from 'react-icons/ai';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import WaybillPrint from './WaybillPrint.js';

const { ValueContainer, Placeholder } = components;

const Orders = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, isAuth, setchosenOrderContext } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, fetchOrdersInInventory, fetchInventories } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [merchantModal, setmerchantModal] = useState(false);
    const [search, setSearch] = useState('');
    const [waybills, setWaybills] = useState([]);

    const [filterorders, setfilterorders] = useState({
        limit: 20,
    });
    const fetchOrdersInInventoryQuery = useQueryGQL('', fetchOrdersInInventory(), filterorders);
    const { refetch: refetchOrdersInInventory } = useQueryGQL('', fetchOrdersInInventory(), filterorders);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const [filterInventories, setfilterInventories] = useState({
        limit: 10,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);
    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) => (prevSelected.includes(orderId) ? prevSelected.filter((id) => id !== orderId) : [...prevSelected, orderId]));
    };
    useEffect(() => {
        setpageactive_context('/orders');
    }, []);
    const [barcode, setBarcode] = useState('');
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }

            if (e.key === 'Enter') {
                setfilterorders({ ...filterorders, name: barcode.length === 0 ? undefined : barcode });
                setSearch(barcode); // Update the search state with the scanned barcode
                // setBarcode(''); // Clear the barcode state
            } else {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode, filterorders]);

    useEffect(() => {
        refetchOrdersInInventory();
    }, [filterorders]);

    useEffect(() => {
        const selectedOrdersDetails = fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data.filter((order) => selectedOrders.includes(order.id));

        setWaybills(selectedOrdersDetails);
    }, [selectedOrders]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Orders
                    </p>
                </div>
                <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
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
                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                        <MultiSelect
                                            title={'Merchants'}
                                            filter={filterMerchants}
                                            setfilter={setfilterMerchants}
                                            options={fetchMerchantsQuery}
                                            attr={'paginateMerchants'}
                                            label={'name'}
                                            value={'id'}
                                            selected={filterorders?.merchantIds}
                                            onClick={(option) => {
                                                var tempArray = filterorders?.merchantIds ?? [];

                                                if (option == 'All') {
                                                    tempArray = undefined;
                                                } else {
                                                    if (!tempArray?.includes(option?.id)) {
                                                        tempArray.push(option?.id);
                                                    } else {
                                                        tempArray.splice(tempArray?.indexOf(option?.id), 1);
                                                    }
                                                }

                                                setfilterorders({ ...filterorders, merchantIds: tempArray?.length != 0 ? tempArray : undefined });
                                            }}
                                        />
                                    </div>

                                    <div class=" col-lg-3 mb-md-2">
                                        <span>Date Range</span>
                                        <div class="mt-1" style={{ width: '100%' }}>
                                            <DateRangePicker
                                                // disabledDate={allowedMaxDays(30)}
                                                // value={[filterorders?.fromDate, filterorders?.toDate]}
                                                onChange={(event) => {
                                                    if (event != null) {
                                                        const start = event[0];
                                                        const startdate = new Date(start);
                                                        const year1 = startdate.getFullYear();
                                                        const month1 = startdate.getMonth() + 1; // Months are zero-indexed
                                                        const day1 = startdate.getDate();

                                                        const end = event[1];
                                                        const enddate = new Date(end);
                                                        const year2 = enddate.getFullYear();
                                                        const month2 = enddate.getMonth() + 1; // Months are zero-indexed
                                                        const day2 = enddate.getDate();
                                                        setfilterorders({
                                                            ...filterorders,
                                                            fromDate: event[0],
                                                            toDate: event[1],
                                                            // from_date: year1 + '-' + month1 + '-' + day1,
                                                            // to_date: year2 + '-' + month2 + '-' + day2,
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
                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                        <MultiSelect
                                            title={'Status'}
                                            options={orderStatusEnumContext}
                                            label={'label'}
                                            value={'value'}
                                            selected={filterorders?.statuses}
                                            onClick={(option) => {
                                                var tempArray = [...(filterorders?.statuses ?? [])];
                                                if (option == 'All') {
                                                    tempArray = undefined;
                                                } else {
                                                    if (!tempArray?.includes(option.value)) {
                                                        tempArray.push(option.value);
                                                    } else {
                                                        tempArray.splice(tempArray?.indexOf(option?.value), 1);
                                                    }
                                                }
                                                setfilterorders({ ...filterorders, statuses: tempArray?.length != 0 ? tempArray : undefined });
                                            }}
                                        />
                                    </div>
                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                        <SelectComponent
                                            title={'Inventory'}
                                            filter={filterInventories}
                                            setfilter={setfilterInventories}
                                            options={fetchinventories}
                                            attr={'paginateInventories'}
                                            label={'name'}
                                            value={'id'}
                                            payload={filterorders}
                                            payloadAttr={'inventoryId'}
                                            onClick={(option) => {
                                                if (option != undefined) {
                                                    setfilterorders({ ...filterorders, inventoryId: option.id });
                                                } else {
                                                    setfilterorders({ ...filterorders, inventoryId: undefined });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div class="col-lg-3">
                                        <Inputfield
                                            placeholder={'Order Ids'}
                                            onKeyDown={(e) => {
                                                e.stopPropagation();

                                                if (e.key == 'Enter') {
                                                    var exists = filterorders?.orderIds?.includes(parseInt(e?.target?.value));
                                                    if (exists) {
                                                        NotificationManager.warning('', 'Already exists');
                                                    } else {
                                                        var temp = filterorders.orderIds ?? [];
                                                        temp.push(parseInt(e.target.value));
                                                        setfilterorders({
                                                            ...filterorders,
                                                            orderIds: temp,
                                                        });
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                            type={'number'}
                                        />
                                        <div class="col-lg-12 p-0">
                                            <div class="row m-0 w-100 scrollmenuclasssubscrollbar" style={{ overflow: 'scroll', flexWrap: 'nowrap' }}>
                                                {filterorders?.orderIds?.map((orderItem, orderIndex) => {
                                                    return (
                                                        <div
                                                            style={{
                                                                background: '#ECECEC',
                                                                padding: '5px 10px',
                                                                cursor: 'pointer',
                                                                borderRadius: '8px',
                                                                justifyContent: 'space-between',
                                                                width: 'fit-content',
                                                                fontSize: '11px',
                                                                minWidth: 'fit-content',
                                                            }}
                                                            className="d-flex align-items-center mr-2 mb-1"
                                                            onClick={() => {
                                                                var temp = filterorders.orderIds ?? [];
                                                                temp.splice(orderIndex, 1);
                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    orderIds: temp?.length != 0 ? temp : undefined,
                                                                });
                                                            }}
                                                        >
                                                            {orderItem}
                                                            <AiOutlineClose size={12} color="#6C757D" className="ml-2" />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 my-2 p-2 px-2'}>
                    <div class="col-lg-12 p-0 ">
                        <div class="row m-0 w-100 d-flex align-items-center">
                            <div class="col-lg-10">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        // disabled={props?.disabled}
                                        // type={props?.type}
                                        class={formstyles.form__field}
                                        value={search}
                                        placeholder={'Search by name or SKU'}
                                        onChange={(event) => {
                                            setBarcode(event.target.value);
                                            setSearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-2 allcenered">
                                <button
                                    onClick={() => {
                                        setfilterorders({ ...filterorders, name: search?.length == 0 ? undefined : search });
                                    }}
                                    style={{ height: '25px', minWidth: 'fit-content', marginInlineStart: '5px' }}
                                    class={generalstyles.roundbutton + '  allcentered'}
                                >
                                    search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isAuth([1, 54]) && (
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div className="col-lg-6 p-0 d-flex justify-content-end ">
                            <div
                                onClick={() => {
                                    var temp = [];
                                    if (selectedOrders?.length != fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length) {
                                        fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.map((i, ii) => {
                                            temp.push(i.id);
                                        });
                                    }
                                    setSelectedOrders(temp);
                                }}
                                class="row m-0 w-100 d-flex align-items-center"
                                style={{
                                    cursor: 'pointer',
                                    // color:
                                    //     selectedOrders?.length == fetchOrdersInInventoryQuery?.data?.paginateOrders?.data?.length ? 'var(--success)' : '',
                                }}
                            >
                                <div
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                    }}
                                    className="iconhover allcentered mr-1"
                                >
                                    {selectedOrders?.length != fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length && (
                                        <FiCircle
                                            style={{ transition: 'all 0.4s' }}
                                            color={selectedOrders?.length == fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length ? 'var(--success)' : ''}
                                            size={18}
                                        />
                                    )}
                                    {selectedOrders?.length == fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length && (
                                        <FiCheckCircle
                                            style={{ transition: 'all 0.4s' }}
                                            color={selectedOrders?.length == fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length ? 'var(--success)' : ''}
                                            size={18}
                                        />
                                    )}
                                </div>
                                {selectedOrders?.length != fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length ? 'Select All' : 'Deselect All'}
                            </div>
                        </div>
                        <div class="col-lg-6 d-flex justify-content-end"> {waybills?.length > 0 && <WaybillPrint waybills={waybills} />}</div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <OrdersTable
                                selectedOrders={selectedOrders}
                                clickable={true}
                                actiononclick={(order) => handleSelectOrder(order.id)}
                                fetchOrdersQuery={fetchOrdersInInventoryQuery}
                                attr={'paginateOrdersInInventory'}
                                srcFrom="inventory"
                            />
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Modal
                show={merchantModal}
                onHide={() => {
                    setmerchantModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Choose Merchant</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setmerchantModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <SelectComponent
                                title={'Merchant'}
                                filter={filterMerchants}
                                setfilter={setfilterMerchants}
                                options={fetchMerchantsQuery}
                                attr={'paginateMerchants'}
                                label={'name'}
                                value={'id'}
                                onClick={(option) => {
                                    history.push('/addorder?merchantId=' + option?.id);
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Orders;
