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
import FulfillModal from './FulfillModal.js';

const { ValueContainer, Placeholder } = components;

const Orders = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, isAuth, setchosenOrderContext } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, fetchOrdersInInventory, fetchInventories } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [fulfilllModal, setfulfilllModal] = useState(false);
    const [ordersToBeFulfilled, setordersToBeFulfilled] = useState([]);

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
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
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
        const selectedOrdersDetails = fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.data.filter((order) => selectedOrders.includes(order.id));

        setWaybills(selectedOrdersDetails);
    }, [selectedOrders]);
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
                    </div>
                </div>
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
                                        <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                            <MultiSelect
                                                title="Merchants"
                                                filter={filterMerchants}
                                                setfilter={setfilterMerchants}
                                                options={fetchMerchantsQuery}
                                                attr="paginateMerchants"
                                                label="name"
                                                value="id"
                                                selected={filterorders?.merchantIds}
                                                onClick={(option) => {
                                                    const tempArray = [...(filterorders?.merchantIds ?? [])];

                                                    if (option === 'All') {
                                                        setfilterorders({ ...filterorders, merchantIds: undefined });
                                                    } else {
                                                        const index = tempArray.indexOf(option?.id);
                                                        if (index === -1) {
                                                            tempArray.push(option?.id);
                                                        } else {
                                                            tempArray.splice(index, 1);
                                                        }

                                                        setfilterorders({ ...filterorders, merchantIds: tempArray.length ? tempArray : undefined });
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div class="col-lg-3 mb-md-2">
                                            <span>Date Range</span>
                                            <div class="mt-1" style={{ width: '100%' }}>
                                                <DateRangePicker
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

                                                        if (option.value === 'All') {
                                                            setfilterorders({ ...filterorders, statuses: undefined });
                                                        } else {
                                                            const index = tempArray.indexOf(option.value);
                                                            if (index === -1) {
                                                                tempArray.push(option.value);
                                                            } else {
                                                                tempArray.splice(index, 1);
                                                            }

                                                            setfilterorders({ ...filterorders, statuses: tempArray.length ? tempArray : undefined });
                                                        }
                                                    }}
                                                />
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
                                                    setfilterorders({
                                                        ...filterorders,
                                                        inventoryId: option ? option.id : undefined,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div class="col-lg-3">
                                            <Inputfield
                                                placeholder="Order Ids"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value?.length !== 0) {
                                                        const orderId = parseInt(e.target.value);
                                                        if (!filterorders?.orderIds?.includes(orderId)) {
                                                            const tempArray = [...(filterorders?.orderIds ?? [])];
                                                            tempArray.push(orderId);
                                                            setfilterorders({ ...filterorders, orderIds: tempArray });
                                                            e.target.value = '';
                                                        } else {
                                                            NotificationManager.warning('', 'Already exists');
                                                        }
                                                    }
                                                }}
                                                type="number"
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
                <div class="col-lg-12 px-3">
                    {' '}
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
                                        style={{ height: '35px', marginInlineStart: '5px' }}
                                        class={generalstyles.roundbutton + '  allcentered bg-primary-light'}
                                    >
                                        search
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
                                <div className="col-lg-6 p-0 d-flex justify-content-end ">
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
                                <div class="col-lg-6 d-flex justify-content-end">
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
                                beforeCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
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
            <FulfillModal fulfilllModal={fulfilllModal} setfulfilllModal={setfulfilllModal} ordersToBeFulfilled={ordersToBeFulfilled} />
        </div>
    );
};
export default Orders;
