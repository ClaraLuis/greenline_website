import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import { DateRangePicker } from 'rsuite';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { IoMdClose } from 'react-icons/io';
import { Modal } from 'react-bootstrap';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import OrdersTable from '../Orders/OrdersTable.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import Cookies from 'universal-cookie';
import WaybillPrint from '../Orders/WaybillPrint.js';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import MultiSelect from '../../MultiSelect.js';
import { NotificationManager } from 'react-notifications';
import Inputfield from '../../Inputfield.js';
import { AiOutlineClose } from 'react-icons/ai';

const { ValueContainer, Placeholder } = components;

const MerchantOrders = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, orderStatusEnumContext, orderTypeContext, paymentTypeContext, isAuth, courierSheetStatusesContext, setpagetitle_context } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, useLazyQueryGQL, fetchOrders, fetchCouriers, fetchGovernorates } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [search, setsearch] = useState('');

    const [merchantModal, setmerchantModal] = useState(false);

    const [filterorders, setfilterorders] = useState({
        limit: 20,
    });
    const [fetchOrdersQuery, setfetchOrdersQuery] = useState({});
    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());

    const [fetchOrdersLazyQuey] = useLazyQueryGQL(fetchOrders(), 'cache-first');
    const [fetchOrdersLazyQuey1] = useLazyQueryGQL(fetchOrders(), 'network-only');
    // const { refetch: refetchOrdersQuery } = useQueryGQL('cache-and-network', fetchOrders(), filterorders);
    //
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const [filterCouriers, setfilterCouriers] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchCouriersQuery = useQueryGQL('cache-first', fetchCouriers(), filterCouriers);
    useEffect(async () => {
        setpageactive_context('/merchantorders');
        setpagetitle_context('Merchant');
        var { data } = await fetchOrdersLazyQuey1({
            variables: { input: filterorders },
        });
        setfetchOrdersQuery({ data: data });
    }, []);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) => (prevSelected.includes(orderId) ? prevSelected.filter((id) => id !== orderId) : [...prevSelected, orderId]));
    };
    const [waybills, setWaybills] = useState([]);
    useEffect(() => {
        const selectedOrdersDetails = fetchOrdersQuery?.data?.paginateOrders?.data.filter((order) => selectedOrders.includes(order.id));

        setWaybills(selectedOrdersDetails);
    }, [selectedOrders]);

    useEffect(async () => {
        refetchOrders();
    }, [filterorders]);

    const refetchOrders = async () => {
        var { data } = await fetchOrdersLazyQuey({
            variables: { input: filterorders },
        });
        setfetchOrdersQuery({ data: data });
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
                                    class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                    onClick={() => {
                                        if (isAuth([1, 68, 52, 15])) {
                                            if (isAuth([1, 68])) {
                                                setmerchantModal(true);
                                            } else {
                                                var merchantId = cookies.get('userInfo')?.merchantId ?? cookies.get('merchantId');

                                                history.push('/addorder?merchantId=' + merchantId);
                                            }
                                        } else {
                                            NotificationManager.warning('Not Authorized', 'Warning');
                                        }
                                    }}
                                >
                                    Add Order
                                </button>
                                {waybills?.length > 0 && <WaybillPrint waybills={waybills} />}

                                {/* <button style={{ height: '35px' }} class={generalstyles.roundbutton + '  mb-1 '} onClick={() => {}}>
                            Print Waybills
                        </button> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* {waybills?.length > 0 && <WaybillPrint waybills={waybills} />} */}
                <div class="col-lg-12 px-3">
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
                                        {isAuth([1]) && (
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
                                                        var tempArray = [...(filterorders?.merchantIds ?? [])];

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
                                        )}

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
                                            <MultiSelect
                                                title={'Types'}
                                                options={orderTypeContext}
                                                label={'label'}
                                                value={'value'}
                                                selected={filterorders?.types}
                                                onClick={(option) => {
                                                    var tempArray = [...(filterorders?.types ?? [])];
                                                    if (option == 'All') {
                                                        tempArray = undefined;
                                                    } else {
                                                        if (!tempArray?.includes(option.value)) {
                                                            tempArray.push(option.value);
                                                        } else {
                                                            tempArray.splice(tempArray?.indexOf(option?.value), 1);
                                                        }
                                                    }
                                                    setfilterorders({ ...filterorders, types: tempArray?.length != 0 ? tempArray : undefined });
                                                }}
                                            />
                                        </div>
                                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                            <MultiSelect
                                                title={'Payment Types'}
                                                options={paymentTypeContext}
                                                label={'label'}
                                                value={'value'}
                                                selected={filterorders?.paymentTypeContext}
                                                onClick={(option) => {
                                                    var tempArray = [...(filterorders?.paymentTypeContext ?? [])];
                                                    if (option == 'All') {
                                                        tempArray = undefined;
                                                    } else {
                                                        if (!tempArray?.includes(option.value)) {
                                                            tempArray.push(option.value);
                                                        } else {
                                                            tempArray.splice(tempArray?.indexOf(option?.value), 1);
                                                        }
                                                    }
                                                    setfilterorders({ ...filterorders, paymentTypeContext: tempArray?.length != 0 ? tempArray : undefined });
                                                }}
                                            />
                                        </div>
                                        {isAuth([1]) && (
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <MultiSelect
                                                    title={'Couriers'}
                                                    filter={filterCouriers}
                                                    setfilter={setfilterCouriers}
                                                    options={fetchCouriersQuery}
                                                    attr={'paginateCouriers'}
                                                    label={'name'}
                                                    value={'id'}
                                                    selected={filterorders?.courierIds}
                                                    onClick={(option) => {
                                                        var tempArray = [...(filterorders?.courierIds ?? [])];
                                                        if (option == 'All') {
                                                            tempArray = undefined;
                                                        } else {
                                                            if (!tempArray?.includes(option?.id)) {
                                                                tempArray.push(option?.id);
                                                            } else {
                                                                tempArray.splice(tempArray?.indexOf(option?.id), 1);
                                                            }
                                                        }
                                                        setfilterorders({ ...filterorders, courierIds: tempArray?.length != 0 ? tempArray : undefined });
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                            <MultiSelect
                                                title={'Governorates'}
                                                options={fetchGovernoratesQuery}
                                                attr={'findAllDomesticGovernorates'}
                                                label={'name'}
                                                value={'id'}
                                                selected={filterorders?.governorateIds}
                                                onClick={(option) => {
                                                    var tempArray = [...(filterorders?.governorateIds ?? [])];
                                                    if (option == 'All') {
                                                        tempArray = undefined;
                                                    } else {
                                                        if (!tempArray?.includes(option?.id)) {
                                                            tempArray.push(option?.id);
                                                        } else {
                                                            tempArray.splice(tempArray?.indexOf(option?.id), 1);
                                                        }
                                                    }
                                                    setfilterorders({ ...filterorders, governorateIds: tempArray?.length != 0 ? tempArray : undefined });
                                                }}
                                            />
                                        </div>
                                        {isAuth([1]) && (
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <MultiSelect
                                                    title={'Manifest Status'}
                                                    options={courierSheetStatusesContext}
                                                    label={'label'}
                                                    value={'value'}
                                                    selected={filterorders?.manifestStatuses}
                                                    onClick={(option) => {
                                                        var tempArray = [...(filterorders?.manifestStatuses ?? [])];
                                                        if (option == 'All') {
                                                            tempArray = undefined;
                                                        } else {
                                                            if (!tempArray?.includes(option.value)) {
                                                                tempArray.push(option.value);
                                                            } else {
                                                                tempArray.splice(tempArray?.indexOf(option?.value), 1);
                                                            }
                                                        }
                                                        setfilterorders({ ...filterorders, manifestStatuses: tempArray?.length != 0 ? tempArray : undefined });
                                                    }}
                                                />
                                            </div>
                                        )}
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
                                        <div class="col-lg-3">
                                            <Inputfield
                                                placeholder={'Order Ids'}
                                                onKeyDown={(e) => {
                                                    if (e.key == 'Enter' && e.target.value?.length != 0) {
                                                        var exists = filterorders?.orderIds?.includes(parseInt(e?.target?.value));
                                                        if (exists) {
                                                            NotificationManager.warning('', 'Already exists');
                                                        } else {
                                                            var temp = [...(filterorders?.orderIds ?? [])];
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
                </div>
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class="col-lg-10 p-0 ">
                            <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                <input
                                    class={formstyles.form__field}
                                    value={search}
                                    placeholder={'Search by phone, email, street address, country, city or zipcode'}
                                    onChange={(event) => {
                                        setsearch(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div class="col-lg-2 p-0 allcentered">
                            <button
                                style={{ height: '35px', minWidth: '80%' }}
                                class={generalstyles.roundbutton + ' allcentered p-0 bg-primary-light'}
                                onClick={() => {
                                    setfilterorders({ ...filterorders, name: search });
                                }}
                            >
                                search
                            </button>
                        </div>
                    </div>
                </div>

                {isAuth([1, 52, 14]) && (
                    <div class={' row m-0 w-100'}>
                        <div class="col-lg-12 px-3">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div className="col-lg-6 p-0 d-flex justify-content-end ">
                                    <div
                                        onClick={() => {
                                            var temp = [];
                                            if (selectedOrders?.length != fetchOrdersQuery?.data?.paginateOrders?.data?.length) {
                                                fetchOrdersQuery?.data?.paginateOrders?.data?.map((i, ii) => {
                                                    temp.push(i.id);
                                                });
                                            }
                                            setSelectedOrders(temp);
                                        }}
                                        class="row m-0 w-100 d-flex align-items-center"
                                        style={{
                                            cursor: 'pointer',
                                            // color:
                                            //     selectedOrders?.length == fetchOrdersQuery?.data?.paginateOrders?.data?.length ? 'var(--success)' : '',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                            }}
                                            className="iconhover allcentered mr-1"
                                        >
                                            {selectedOrders?.length != fetchOrdersQuery?.data?.paginateOrders?.data?.length && (
                                                <FiCircle
                                                    style={{ transition: 'all 0.4s' }}
                                                    color={selectedOrders?.length == fetchOrdersQuery?.data?.paginateOrders?.data?.length ? 'var(--success)' : ''}
                                                    size={18}
                                                />
                                            )}
                                            {selectedOrders?.length == fetchOrdersQuery?.data?.paginateOrders?.data?.length && (
                                                <FiCheckCircle
                                                    style={{ transition: 'all 0.4s' }}
                                                    color={selectedOrders?.length == fetchOrdersQuery?.data?.paginateOrders?.data?.length ? 'var(--success)' : ''}
                                                    size={18}
                                                />
                                            )}
                                        </div>
                                        {selectedOrders?.length != fetchOrdersQuery?.data?.paginateOrders?.data?.length ? 'Select All' : 'Deselect All'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12 p-0 mb-2">
                            <Pagination
                                beforeCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.beforeCursor}
                                afterCursor={fetchOrdersQuery?.data?.paginateOrders?.cursor?.afterCursor}
                                filter={filterorders}
                                setfilter={setfilterorders}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-1'}>
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
                                removeAll={true}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default MerchantOrders;
