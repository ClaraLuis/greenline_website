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
import * as XLSX from 'xlsx';
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
import FulfillModal from './FulfillModal.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import { BiSearch } from 'react-icons/bi';

const { ValueContainer, Placeholder } = components;

const Orders = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, isAuth, updateQueryParamContext, useLoadQueryParamsToPayload } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, fetchOrdersInInventory, fetchInventories } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [fulfilllModal, setfulfilllModal] = useState(false);
    const [ordersToBeFulfilled, setordersToBeFulfilled] = useState([]);

    const [merchantModal, setmerchantModal] = useState(false);
    const [search, setSearch] = useState('');
    const [waybills, setWaybills] = useState([]);

    const [filterorders, setfilterorders] = useState({
        limit: 20,
        outOfStock: false,
    });
    useLoadQueryParamsToPayload(setfilterorders);

    // Sync search state with filterorders.name from URL
    useEffect(() => {
        if (filterorders?.name) {
            setSearch(filterorders.name);
        }
    }, [filterorders?.name]);

    const fetchOrdersInInventoryQuery = useQueryGQL('', fetchOrdersInInventory(), filterorders);
    const { refetch: refetchOrdersInInventory } = useQueryGQL('', fetchOrdersInInventory(), filterorders);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const [filterInventories, setfilterInventories] = useState({
        limit: 10,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    const handleSelectOrder = (order) => {
        setSelectedOrders((prevSelected) => (prevSelected.includes(order.id) ? prevSelected.filter((id) => id !== order.id) : [...prevSelected, order.id]));
        var temp = [...ordersToBeFulfilled];
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
        setordersToBeFulfilled(temp);
    };
    useEffect(() => {
        // alert();
        setpageactive_context(window.location.pathname);
        setpagetitle_context('Warehouses');
        if (window.location.pathname == '/handpicked') {
            setfilterorders({ ...filterorders, statuses: ['handPicked'] });
        }
    }, []);
    const [barcode, setBarcode] = useState('');
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return; // Don't process barcode scanning when typing in an input field
            }

            if (e.key === 'Enter') {
                setfilterorders({ ...filterorders, name: barcode.length === 0 ? undefined : barcode });
                updateQueryParamContext('name', barcode.length === 0 ? undefined : barcode);
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
        const selectedOrdersDetails = fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data.filter((order) => selectedOrders.includes(order.id));

        setWaybills(selectedOrdersDetails);
    }, [selectedOrders]);
    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
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
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-end ">
                                <button
                                    style={{ height: '35px' }}
                                    class={generalstyles.roundbutton + '  mb-1 mx-1'}
                                    onClick={() => {
                                        const orders = fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data;

                                        const exportData = orders.map((order) => {
                                            const {
                                                id,
                                                createdAt,
                                                shippingPrice,
                                                originalPrice,
                                                paidToMerchant,
                                                price,
                                                paymentType,
                                                status,
                                                orderDate,
                                                currency,
                                                canOpen,
                                                fragile,
                                                deliveryPart,
                                                latestHistory,
                                                sheetOrder,
                                                merchant,
                                                address,
                                                courier,
                                                merchantCustomer,
                                                orderItems,
                                            } = order;

                                            return {
                                                ID: id,
                                                'Created At': createdAt,
                                                'Shipping Price': shippingPrice,
                                                'Original Price?': originalPrice,
                                                'Paid to Merchant?': paidToMerchant,
                                                'Total Price': price,
                                                'Payment Type': paymentType,
                                                Status: status,
                                                'Order Date': orderDate,
                                                Currency: currency,
                                                'Can Open': canOpen,
                                                Fragile: fragile,
                                                'Delivery Part': deliveryPart,
                                                'Merchant Name': merchant?.name,
                                                'Customer Name': merchantCustomer?.customerName,
                                                'Customer Phone': merchantCustomer?.customer?.phone,
                                                City: address?.city,
                                                'Street Address': address?.streetAddress?.trim(),
                                                'Building No.': address?.buildingNumber,
                                                Floor: address?.buildingNumber,
                                                'Courier Name': courier?.name,
                                                'History Description': latestHistory?.description,
                                                'Sheet ID': sheetOrder?.sheetId,
                                                'Shipping Collected': sheetOrder?.shippingCollected,
                                                'Admin Pass': sheetOrder?.adminPass,
                                                'Finance Pass': sheetOrder?.financePass,
                                            };
                                        });

                                        exportToExcel(exportData, 'orders');
                                    }}
                                >
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {cookies.get('userInfo')?.type != 'merchant' && (
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
                                            {/* <div class="col-lg-3" style={{ marginBottom: '15px' }}>
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
                                                            ].find((option) => option.value === (filterorders?.isAsc ?? true))}
                                                            onChange={(option) => {
                                                                if (fetchOrdersInInventoryQuery?.loading) return;
                                                                setfilterorders({ ...filterorders, isAsc: option?.value });
                                                            }}
                                                            isDisabled={fetchOrdersInInventoryQuery?.loading}
                                                        />
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="col-lg-2 p-0 mb-2 d-flex align-items-center ">
                                                <div className="row m-0 w-100 d-flex ">
                                                    <label className={`${formstyles.switch}  my-0`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={filterorders?.outOfStock || false}
                                                            onChange={(e) => {
                                                                if (fetchOrdersInInventoryQuery?.loading) return;
                                                                e.stopPropagation();
                                                                const newValue = !filterorders?.outOfStock;
                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    outOfStock: newValue,
                                                                });
                                                                updateQueryParamContext('outOfStock', newValue);
                                                            }}
                                                            disabled={fetchOrdersInInventoryQuery?.loading}
                                                        />
                                                        <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                                    </label>
                                                    <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak`}>Out of stock</p>
                                                </div>
                                            </div>
                                            <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                <MerchantSelectComponent
                                                    type="multi"
                                                    label="name"
                                                    value="id"
                                                    selected={filterorders?.merchantIds}
                                                    onClick={(option) => {
                                                        const tempArray = [...(filterorders?.merchantIds ?? [])];

                                                        if (option === 'All') {
                                                            setfilterorders({ ...filterorders, merchantIds: undefined });
                                                            updateQueryParamContext('merchantIds', undefined);
                                                        } else {
                                                            const index = tempArray.indexOf(option?.id);
                                                            if (index === -1) {
                                                                tempArray.push(option?.id);
                                                            } else {
                                                                tempArray.splice(index, 1);
                                                            }

                                                            setfilterorders({ ...filterorders, merchantIds: tempArray.length ? tempArray : undefined });
                                                            updateQueryParamContext('merchantIds', tempArray.length ? tempArray : undefined);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div class="col-lg-3 mb-md-2">
                                                <span>Date Range</span>
                                                <div class="mt-1" style={{ width: '100%' }}>
                                                    <DateRangePicker
                                                        showOneCalendar
                                                        value={filterorders?.fromDate && filterorders?.toDate ? [new Date(filterorders.fromDate), new Date(filterorders.toDate)] : null}
                                                        onChange={(event) => {
                                                            if (fetchOrdersInInventoryQuery?.loading) return;
                                                            if (event != null) {
                                                                const toUTCDate = (d) => {
                                                                    const date = new Date(d);
                                                                    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                                                };

                                                                const [start, end] = event;
                                                                const fromDate = toUTCDate(start).toISOString();
                                                                const toDate = toUTCDate(end).toISOString();

                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    fromDate: fromDate,
                                                                    toDate: toDate,
                                                                });
                                                                updateQueryParamContext('fromDate', fromDate);
                                                                updateQueryParamContext('toDate', toDate);
                                                            } else {
                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    fromDate: undefined,
                                                                    toDate: undefined,
                                                                });
                                                                updateQueryParamContext('fromDate', undefined);
                                                                updateQueryParamContext('toDate', undefined);
                                                            }
                                                        }}
                                                        onClean={() => {
                                                            if (fetchOrdersInInventoryQuery?.loading) return;
                                                            setfilterorders({
                                                                ...filterorders,
                                                                fromDate: undefined,
                                                                toDate: undefined,
                                                            });
                                                            updateQueryParamContext('fromDate', undefined);
                                                            updateQueryParamContext('toDate', undefined);
                                                        }}
                                                        disabled={fetchOrdersInInventoryQuery?.loading}
                                                    />
                                                </div>
                                            </div>

                                            {window.location.pathname !== '/handpicked' && (
                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <MultiSelect
                                                        title="Status"
                                                        options={orderStatusEnumContext}
                                                        label="label"
                                                        value="value"
                                                        selected={filterorders?.statuses}
                                                        onClick={(option) => {
                                                            const tempArray = [...(filterorders?.statuses ?? [])];
                                                            if (option.value) {
                                                                const index = tempArray.indexOf(option.value);
                                                                if (index === -1) {
                                                                    tempArray.push(option.value);
                                                                } else {
                                                                    tempArray.splice(index, 1);
                                                                }

                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    statuses: tempArray.length ? tempArray : undefined,
                                                                    // Clear status dates when statuses change to all/undefined
                                                                    statusStartDate: tempArray.length ? filterorders?.statusStartDate : undefined,
                                                                    statusEndDate: tempArray.length ? filterorders?.statusEndDate : undefined,
                                                                });
                                                                updateQueryParamContext('statuses', tempArray.length ? tempArray : undefined);
                                                            } else {
                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    statuses: undefined,
                                                                    // Clear status dates when statuses change to all
                                                                    statusStartDate: undefined,
                                                                    statusEndDate: undefined,
                                                                });
                                                                updateQueryParamContext('statuses', undefined);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Status Date Range - only show when specific statuses are selected */}
                                            {window.location.pathname !== '/handpicked' && filterorders?.statuses && filterorders?.statuses?.length > 0 && (
                                                <div class="col-lg-3 mb-md-2">
                                                    <span>Status Date Range</span>
                                                    <div class="mt-1" style={{ width: '100%' }}>
                                                        <DateRangePicker
                                                            showOneCalendar
                                                            value={
                                                                filterorders?.statusStartDate && filterorders?.statusEndDate
                                                                    ? [new Date(filterorders.statusStartDate), new Date(filterorders.statusEndDate)]
                                                                    : null
                                                            }
                                                            onChange={(event) => {
                                                                if (fetchOrdersInInventoryQuery?.loading) return;
                                                                if (event != null) {
                                                                    const toUTCDate = (d) => {
                                                                        const date = new Date(d);
                                                                        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                                                    };

                                                                    const [start, end] = event;
                                                                    const statusStartDate = toUTCDate(start).toISOString();
                                                                    const statusEndDate = toUTCDate(end).toISOString();

                                                                    setfilterorders({
                                                                        ...filterorders,
                                                                        statusStartDate: statusStartDate,
                                                                        statusEndDate: statusEndDate,
                                                                    });
                                                                    updateQueryParamContext('statusStartDate', statusStartDate);
                                                                    updateQueryParamContext('statusEndDate', statusEndDate);
                                                                } else {
                                                                    setfilterorders({
                                                                        ...filterorders,
                                                                        statusStartDate: undefined,
                                                                        statusEndDate: undefined,
                                                                    });
                                                                    updateQueryParamContext('statusStartDate', undefined);
                                                                    updateQueryParamContext('statusEndDate', undefined);
                                                                }
                                                            }}
                                                            onClean={() => {
                                                                if (fetchOrdersInInventoryQuery?.loading) return;
                                                                setfilterorders({
                                                                    ...filterorders,
                                                                    statusStartDate: undefined,
                                                                    statusEndDate: undefined,
                                                                });
                                                                updateQueryParamContext('statusStartDate', undefined);
                                                                updateQueryParamContext('statusEndDate', undefined);
                                                            }}
                                                            disabled={fetchOrdersInInventoryQuery?.loading}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                <SelectComponent
                                                    title="Inventory"
                                                    filter={filterInventories}
                                                    setfilter={setfilterInventories}
                                                    options={fetchinventories}
                                                    attr="paginateInventories"
                                                    label="name"
                                                    value="id"
                                                    payload={filterorders}
                                                    payloadAttr="inventoryId"
                                                    onClick={(option) => {
                                                        if (fetchOrdersInInventoryQuery?.loading) return;
                                                        setfilterorders({
                                                            ...filterorders,
                                                            inventoryId: option ? option.id : undefined,
                                                        });
                                                        updateQueryParamContext('inventoryId', option ? option.id : undefined);
                                                    }}
                                                    disabled={fetchOrdersInInventoryQuery?.loading}
                                                />
                                            </div>

                                            <div class="col-lg-3">
                                                <Inputfield
                                                    placeholder="Order Ids"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.target.value?.length !== 0) {
                                                            const raw = e.target.value;
                                                            const parts = raw
                                                                .split(/[\n,]+/)
                                                                .map((v) => v.trim())
                                                                .filter((v) => v.length > 0);
                                                            const values = Array.from(new Set(parts.map((v) => parseInt(v)).filter((v) => !isNaN(v))));

                                                            const existing = filterorders?.orderIds ?? [];
                                                            const newValues = values.filter((id) => !existing.includes(id));

                                                            if (newValues.length === 0) {
                                                                NotificationManager.warning('', 'All values already exist');
                                                            } else {
                                                                const updated = [...existing, ...newValues];
                                                                setfilterorders({ ...filterorders, orderIds: updated });
                                                                updateQueryParamContext('orderIds', updated);
                                                            }

                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const text = e.clipboardData?.getData('text');
                                                        if (!text) return;
                                                        e.preventDefault();

                                                        const parts = text
                                                            .split(/[\n,]+/)
                                                            .map((v) => v.trim())
                                                            .filter((v) => v.length > 0);

                                                        const values = Array.from(new Set(parts.map((v) => parseInt(v)).filter((v) => !isNaN(v))));

                                                        const existing = filterorders?.orderIds ?? [];
                                                        const newValues = values.filter((id) => !existing.includes(id));

                                                        if (newValues.length === 0) {
                                                            NotificationManager.warning('', 'All values already exist');
                                                        } else {
                                                            const updated = [...existing, ...newValues];
                                                            setfilterorders({ ...filterorders, orderIds: updated });
                                                            updateQueryParamContext('orderIds', updated);
                                                        }
                                                    }}
                                                    type="text"
                                                />
                                                <div class="col-lg-12 p-0">
                                                    <div class="row m-0 w-100 scrollmenuclasssubscrollbar" style={{ overflow: 'scroll', flexWrap: 'nowrap' }}>
                                                        {filterorders?.orderIds?.map((orderItem, orderIndex) => (
                                                            <div
                                                                key={orderIndex}
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
                                                                    const tempArray = [...filterorders.orderIds];
                                                                    tempArray.splice(orderIndex, 1);
                                                                    setfilterorders({ ...filterorders, orderIds: tempArray.length ? tempArray : undefined });
                                                                    updateQueryParamContext('orderIds', tempArray.length ? tempArray : undefined);
                                                                }}
                                                            >
                                                                {orderItem}
                                                                <AiOutlineClose size={12} color="#6C757D" className="ml-2" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                )}

                <div class="col-lg-12 px-3">
                    {' '}
                    <div class={generalstyles.card + ' row m-0 w-100 my-2 p-2 px-2'}>
                        <div class="col-lg-12 p-0 ">
                            <div class="row m-0 w-100 d-flex align-items-center">
                                <div class="col-lg-10 col-md-10">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={search}
                                            placeholder={'Search by name or SKU'}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setfilterorders({ ...filterorders, name: search?.length == 0 ? undefined : search });
                                                    updateQueryParamContext('name', search?.length == 0 ? undefined : search);
                                                }
                                            }}
                                            onChange={(event) => {
                                                setBarcode(event.target.value);
                                                setSearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-2  col-md-2 allcenered p-md-0">
                                    <button
                                        onClick={() => {
                                            setfilterorders({ ...filterorders, name: search?.length == 0 ? undefined : search });
                                            updateQueryParamContext('name', search?.length == 0 ? undefined : search);
                                        }}
                                        style={{ height: '35px', marginInlineStart: '5px', minWidth: 'auto' }}
                                        class={generalstyles.roundbutton + '  allcentered bg-primary-light'}
                                    >
                                        <div class="d-flex d-md-none">search</div>
                                        <div class="d-none d-md-flex">
                                            <BiSearch />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isAuth([1, 54]) && (
                    <div class={' row m-0 w-100'}>
                        <div class="col-lg-12 px-3">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div className="col-lg-6 col-md-6 p-0 d-flex justify-content-end ">
                                    <div
                                        onClick={() => {
                                            var temp = [];
                                            var temp1 = [];
                                            if (selectedOrders?.length != fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.length) {
                                                fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data?.map((i, ii) => {
                                                    temp.push(i.id);
                                                    temp1.push(i);
                                                });
                                            }
                                            setordersToBeFulfilled(temp1);
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
                                <div class="col-lg-6 col-md-6 d-flex justify-content-end">
                                    {' '}
                                    {waybills?.length > 0 && <WaybillPrint waybills={waybills} />}
                                    {/* {selectedOrders?.length != 0 && (
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + '  mx-2'}
                                            onClick={() => {
                                                setfulfilllModal(true);
                                            }}
                                        >
                                            Fulfill orders
                                        </button>
                                    )} */}
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12 p-0 mb-2">
                            <Pagination
                                total={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.totalCount}
                                beforeCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                                loading={fetchOrdersInInventoryQuery?.loading}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                            <OrdersTable
                                selectedOrders={selectedOrders}
                                clickable={true}
                                actiononclick={(order) => handleSelectOrder(order)}
                                fetchOrdersQuery={fetchOrdersInInventoryQuery}
                                attr={'paginateOrdersInInventory'}
                                srcFrom="inventory"
                            />
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                total={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.totalCount}
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
                        <div class="col-lg-6 col-md-10 pt-3 ">
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
                            <MerchantSelectComponent
                                type="single"
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
            <FulfillModal fulfilllModal={fulfilllModal} setfulfilllModal={setfulfilllModal} ordersToBeFulfilled={ordersToBeFulfilled} />
        </div>
    );
};
export default Orders;
