import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { FaEllipsisV, FaLayerGroup, FaPlus, FaWindowMinimize } from 'react-icons/fa';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import Select from 'react-select';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import ItemsTable from './ItemsTable.js';
import { NotificationManager } from 'react-notifications';
import { FiCheckCircle } from 'react-icons/fi';
import { Dropdown } from 'react-bootstrap';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { TbTruckDelivery } from 'react-icons/tb';
import Cookies from 'universal-cookie';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import InventorySelectComponent from '../../selectComponents/InventorySelectComponent.js';

const Packages = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const {
        setpageactive_context,
        setpagetitle_context,
        returnPackageStatusContext,
        returnPackageTypeContext,
        dateformatter,
        buttonLoadingContext,
        setbuttonLoadingContext,
        setchosenPackageContext,
        isAuth,
    } = useContext(Contexthandlerscontext);
    const { useMutationGQL, fetchMerchants, assignPackageToCourier, fetchCouriers, fetchPackages, useQueryGQL, fetchInventories } = API();
    const { lang, langdetect } = useContext(LanguageContext);
    const [cartItems, setcartItems] = useState([]);
    const [search, setSearch] = useState('');
    const cookies = new Cookies();

    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        userId: '',
    });

    const [filterCouriers, setfilterCouriers] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchCouriersQuery = useQueryGQL('cache-first', fetchCouriers(), filterCouriers);

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assigned: undefined,
    });

    const fetchPackagesQuery = useQueryGQL('', fetchPackages(), filter);
    const refetchPackagesQuery = () => fetchPackagesQuery.refetch();

    const [assignPackageToCourierMutation] = useMutationGQL(assignPackageToCourier(), {
        ids: packagepayload?.ids,
        userId: packagepayload?.userId,
    });

    const [filterInventories, setfilterInventories] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    useEffect(() => {
        setpageactive_context('/packages');
        setpagetitle_context('Hubs');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-8'}>
                    <div class="row m-0 w-100">
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
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <SelectComponent
                                                    title={'Courier'}
                                                    filter={filterCouriers}
                                                    setfilter={setfilterCouriers}
                                                    options={fetchCouriersQuery}
                                                    attr={'paginateCouriers'}
                                                    label={'name'}
                                                    value={'id'}
                                                    payload={filter}
                                                    payloadAttr={'courierId'}
                                                    onClick={(option) => {
                                                        setfilter({ ...filter, courierId: option?.id });
                                                    }}
                                                />
                                            </div>
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <label for="name" class={formstyles.form__label}>
                                                    Type
                                                </label>
                                                <Select
                                                    options={[{ label: 'All', value: undefined }, ...returnPackageTypeContext]}
                                                    styles={defaultstyles}
                                                    value={[{ label: 'All', value: undefined }, ...returnPackageTypeContext].filter((option) => option.value == filter?.type)}
                                                    onChange={(option) => {
                                                        setfilter({ ...filter, type: option.value });
                                                    }}
                                                />
                                            </div>
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <label for="name" class={formstyles.form__label}>
                                                    Status
                                                </label>
                                                <Select
                                                    options={[{ label: 'All', value: undefined }, ...returnPackageStatusContext]}
                                                    styles={defaultstyles}
                                                    value={[{ label: 'All', value: undefined }, ...returnPackageStatusContext].filter((option) => option.value == filter?.status)}
                                                    onChange={(option) => {
                                                        setfilter({ ...filter, status: option.value });
                                                    }}
                                                />
                                            </div>
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <label for="name" class={formstyles.form__label}>
                                                    Assigned
                                                </label>
                                                <Select
                                                    options={[
                                                        { label: 'All', value: undefined },
                                                        { label: 'Assigned', value: true },
                                                        { label: 'Not Assigned', value: false },
                                                    ]}
                                                    styles={defaultstyles}
                                                    value={[
                                                        { label: 'All', value: undefined },
                                                        { label: 'Assigned', value: true },
                                                        { label: 'Not Assigned', value: false },
                                                    ].filter((option) => option.value == filter?.assigned)}
                                                    onChange={(option) => {
                                                        setfilter({ ...filter, assigned: option.value });
                                                    }}
                                                />
                                            </div>
                                            {!cookies.get('userInfo')?.merchantId && (
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <MerchantSelectComponent
                                                        type="single"
                                                        label={'name'}
                                                        value={'id'}
                                                        payload={filter}
                                                        payloadAttr={'toMerchantId'}
                                                        onClick={(option) => {
                                                            setfilter({ ...filter, toMerchantId: option?.id ?? undefined });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {!cookies.get('userInfo')?.inventoryId && (
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <InventorySelectComponent
                                                        type="single"
                                                        label={'name'}
                                                        value={'id'}
                                                        payload={filter}
                                                        payloadAttr={'toInventoryId'}
                                                        onClick={(option) => {
                                                            setfilter({ ...filter, toInventoryId: option?.id });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100 my-2 p-2 px-0'}>
                            <div class="col-lg-12 p-0 ">
                                <div class="row m-0 w-100 d-flex align-items-center">
                                    <div class="col-lg-10">
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <input
                                                class={formstyles.form__field}
                                                value={search}
                                                placeholder={'Search by name or SKU'}
                                                onChange={(event) => {
                                                    setSearch(event.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-lg-2 p-0 allcenered">
                                        <button
                                            onClick={() => {
                                                setfilter({ ...filter, sku: search?.length == 0 ? undefined : search });
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
                        {isAuth([1, 94, 64]) && (
                            <>
                                <div class="col-lg-12 p-0 mb-3">
                                    <Pagination
                                        beforeCursor={fetchPackagesQuery?.data?.paginateReturnPackages?.cursor?.beforeCursor}
                                        afterCursor={fetchPackagesQuery?.data?.paginateReturnPackages?.cursor?.afterCursor}
                                        filter={filter}
                                        setfilter={setfilter}
                                    />
                                </div>
                                {fetchPackagesQuery?.data?.paginateReturnPackages?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Packages
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {fetchPackagesQuery?.data?.paginateReturnPackages?.data?.map((item, index) => {
                                    var selected = false;
                                    packagepayload?.ids?.map((packageitem) => {
                                        if (packageitem == item.id) {
                                            selected = true;
                                        }
                                    });
                                    return (
                                        <div
                                            onClick={() => {
                                                var temp = { ...packagepayload };
                                                var exist = false;
                                                var chosenindex = null;
                                                temp.ids.map((i, ii) => {
                                                    if (i == item.id) {
                                                        exist = true;
                                                        chosenindex = ii;
                                                    }
                                                });
                                                if (!exist) {
                                                    temp.ids.push(item.id);
                                                } else {
                                                    temp.ids.splice(chosenindex, 1);
                                                }
                                                setpackagepayload({ ...temp });
                                            }}
                                            style={{ cursor: 'pointer' }}
                                            className="col-lg-6 "
                                        >
                                            <div
                                                style={{ background: selected ? 'var(--secondary)' : 'white', transition: 'all 0.4s', cursor: 'pointer' }}
                                                class={generalstyles.card + ' p-3 row  w-100   d-flex align-items-center'}
                                            >
                                                <div className="col-lg-2 p-0">
                                                    <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                        # {item?.id}
                                                    </span>
                                                </div>
                                                <div className="col-lg-10 p-0 d-flex justify-content-end align-items-center">
                                                    <div class="row m-0 w-100 d-fex justify-content-end align-items-center">
                                                        <div
                                                            className={
                                                                item.status == 'delivered'
                                                                    ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  text-capitalize'
                                                                    : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered text-capitalize'
                                                            }
                                                        >
                                                            {item?.status?.split(/(?=[A-Z])/).join(' ')}
                                                        </div>
                                                        <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered mx-1 text-capitalize '}>
                                                            {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                        </div>
                                                        <Dropdown>
                                                            <Dropdown.Toggle>
                                                                <div
                                                                    class="iconhover allcentered"
                                                                    style={{
                                                                        color: 'var(--primary)',
                                                                        // borderRadius: '10px',
                                                                        width: '28px',
                                                                        height: '28px',
                                                                        transition: 'all 0.4s',
                                                                    }}
                                                                >
                                                                    <FaEllipsisV />
                                                                </div>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu style={{ minWidth: '170px', fontSize: '12px' }}>
                                                                <Dropdown.Item
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setchosenPackageContext(item);

                                                                        if (item.type == 'merchant') {
                                                                            history.push('/merchantreturnpackageinfo?packageId=' + item.id);
                                                                        } else {
                                                                            history.push('/returnpackageinfo?packageId=' + item.id);
                                                                        }
                                                                    }}
                                                                    class="py-2"
                                                                >
                                                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Show Package</p>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 p-0 my-2">
                                                    <hr className="m-0" />
                                                </div>
                                                <div class="col-lg-12 p-0 mb-2">
                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                        <div class="col-lg-8 p-0">{item.type == 'merchant' ? item?.merchant?.name : item?.inventory?.name}</div>
                                                        <div class="col-lg-4 p-0 d-flex justify-content-end">
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                                {item?.countAndSum?.sum} items
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12 p-0 mb-2">
                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                        <div class="col-lg-8 p-0">
                                                            {' '}
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                                {item?.sku}
                                                            </span>
                                                        </div>
                                                        <div class="col-lg-4 p-0 d-flex justify-content-end">
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                                {item?.countAndSum?.count} orders
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12 p-0">
                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                        <div class="col-lg-6 p-0">
                                                            {item?.courier && cookies.get('userInfo')?.type != 'merchant' && (
                                                                <div className="col-lg-12 p-0 mb-2 d-flex align-items-center">
                                                                    <TbTruckDelivery size={20} class="mr-1" />

                                                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                                        {item?.courier?.name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div class="col-lg-6 p-0 d-flex justify-content-end">
                                                            <span style={{ fontSize: '12px', color: 'grey' }} class="text-capitalize">
                                                                {dateformatter(item?.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div class="col-lg-12 p-0">
                                    <Pagination
                                        beforeCursor={fetchPackagesQuery?.data?.paginateReturnPackages?.cursor?.beforeCursor}
                                        afterCursor={fetchPackagesQuery?.data?.paginateReturnPackages?.cursor?.afterCursor}
                                        filter={filter}
                                        setfilter={setfilter}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div class="col-lg-4 mb-3">
                    <div class="col-lg-12 p-0 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">Courier Assignment</div>
                    </div>
                    <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3'}>
                        <div class="col-lg-12">
                            {packagepayload?.ids?.length != 0 && (
                                <>
                                    <div class="col-lg-12 pb-2 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Packages ({packagepayload?.ids?.length})
                                    </div>
                                </>
                            )}
                        </div>

                        <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <SelectComponent
                                title={'Courier'}
                                filter={filterCouriers}
                                setfilter={setfilterCouriers}
                                options={fetchCouriersQuery}
                                attr={'paginateCouriers'}
                                label={'name'}
                                value={'id'}
                                payload={packagepayload}
                                payloadAttr={'userId'}
                                onClick={(option) => {
                                    setpackagepayload({ ...packagepayload, userId: option?.id });
                                }}
                                removeAll={true}
                            />
                        </div>

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                onClick={async () => {
                                    if (isAuth([1, 100])) {
                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                        return;
                                    }
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    try {
                                        if (packagepayload?.ids?.length != 0 && packagepayload?.userId?.length != 0) {
                                            await assignPackageToCourierMutation();
                                            NotificationManager.success('Package assigned successfully', 'Success!');
                                            refetchPackagesQuery();
                                        } else {
                                            NotificationManager.warning('Please Complete all fields', 'Warning!');
                                        }
                                    } catch (error) {
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
                                    setbuttonLoadingContext(false);
                                }}
                                disabled={buttonLoadingContext}
                                class={generalstyles.roundbutton}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>Assign to courier</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Packages;
