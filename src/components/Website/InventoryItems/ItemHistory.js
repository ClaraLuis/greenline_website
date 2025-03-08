import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { Modal } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaLayerGroup, FaRegClock } from 'react-icons/fa';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { DateRangePicker } from 'rsuite';

// Icons
import { CiExport, CiImport } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import MultiSelect from '../../MultiSelect.js';
import Pagination from '../../Pagination.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import SkuPrint from '../MerchantItems/SkuPrint.js';
import ImportNewItem from './ImportNewItem.js';
import ItemInfo from './ItemInfo.js';
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const ItemHistory = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, dateformatter, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchInventories, useMutationGQL, addInventory, fetchItemsInBox, fetchMerchants, importNew, fetchItemHistory, exportItem, importItem, useLazyQueryGQL } = API();

    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [search, setSearch] = useState('');

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
    var fetchMerchantsQuery = undefined;
    if (cookies.get('userInfo')?.type != 'merchant') {
        fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    }
    const [fetchItemHistoryQuery, setfetchItemHistoryQuery] = useState({});
    const [fetchItemHistoryfilter, setfetchItemHistoryfilter] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchitemhistorfunc = async () => {
        var { data } = await fetchItemHistorLazyQuery({
            variables: {
                input: { ...fetchItemHistoryfilter, itemInBoxId: parseInt(queryParameters?.get('id')) },
            },
        });
        setfetchItemHistoryQuery(data);
    };

    const [fetchItemHistorLazyQuery] = useLazyQueryGQL(fetchItemHistory());

    useEffect(() => {
        setpageactive_context('/itemhistory');
        setpagetitle_context('Warehouses');
    }, []);

    useEffect(() => {
        fetchitemhistorfunc();
    }, [queryParameters?.get('id'), fetchItemHistoryfilter]);
    useEffect(() => {
        setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, merchantId: parseInt(cookies.get('merchantId')) });
    }, [cookies.get('merchantId')]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
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
                                        {cookies.get('merchantId') == undefined && cookies.get('userInfo')?.type != 'merchant' && (
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <SelectComponent
                                                    title={'Merchant'}
                                                    filter={filterMerchants}
                                                    setfilter={setfilterMerchants}
                                                    options={fetchMerchantsQuery}
                                                    attr={'paginateMerchants'}
                                                    label={'name'}
                                                    value={'id'}
                                                    payload={fetchItemHistoryfilter}
                                                    payloadAttr={'merchantId'}
                                                    onClick={(option) => {
                                                        setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, merchantId: option?.id });
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                            <SelectComponent
                                                title={'Inventory'}
                                                filter={filterInventories}
                                                setfilter={setfilterInventories}
                                                options={fetchinventories}
                                                attr={'paginateInventories'}
                                                label={'name'}
                                                value={'id'}
                                                payload={fetchItemHistoryfilter}
                                                payloadAttr={'inventoryId'}
                                                onClick={async (option) => {
                                                    setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, inventoryId: option?.id });
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

                                                            setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, fromDate: event[0], toDate: event[1] });
                                                        }
                                                    }}
                                                    onClean={() => {
                                                        setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, fromDate: null, toDate: null });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {queryParameters?.get('id') && (
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <span class="text-primaryhover allcentered ">
                                                    <span
                                                        onClick={() => {
                                                            history.push('/itemhistory');
                                                        }}
                                                        className="mx-2"
                                                    >
                                                        {' '}
                                                        Remove Item Id filter
                                                    </span>{' '}
                                                    <IoMdClose />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100 p-2'}>
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
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, name: search?.length == 0 ? undefined : search });
                                                }
                                            }}
                                            onChange={(event) => {
                                                setSearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-2 allcenered">
                                    <button
                                        onClick={() => {
                                            setfetchItemHistoryfilter({ ...fetchItemHistoryfilter, name: search?.length == 0 ? undefined : search });
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
                <div class="col-lg-12 px-3">
                    <div class="col-lg-12 p-0 mb-2">
                        <Pagination
                            beforeCursor={fetchItemHistoryQuery?.paginateItemHistory?.cursor?.beforeCursor}
                            afterCursor={fetchItemHistoryQuery?.paginateItemHistory?.cursor?.afterCursor}
                            filter={fetchItemHistoryfilter}
                            setfilter={setfetchItemHistoryfilter}
                        />
                    </div>
                    <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                        <div class="col-lg-12 p-0">
                            <div style={{ fontSize: '14px' }} class="row m-0 w-100 pb-2">
                                <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                    {fetchItemHistoryQuery?.loading && (
                                        <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                            <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                        </div>
                                    )}
                                    {!fetchItemHistoryQuery?.loading && (
                                        <>
                                            {fetchItemHistoryQuery?.paginateItemHistory?.data?.length == 0 && (
                                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                                    <div class="row m-0 w-100">
                                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                            No History
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {fetchItemHistoryQuery?.paginateItemHistory?.data?.length != 0 && (
                                                <>
                                                    <table style={{}} className={'table text-capitalize'}>
                                                        <thead>
                                                            <th>id</th>
                                                            <th>SKU</th>
                                                            <th>Inventory</th>
                                                            {cookies.get('merchantId') == undefined && cookies.get('userInfo')?.type != 'merchant' && <th>Merchant</th>}
                                                            <th>Current Stock</th>
                                                            <th>Amount</th>
                                                            <th>Stock Before</th>
                                                            <th>Order</th>
                                                            <th style={{ minWidth: '400px' }}>Description</th>
                                                            {cookies.get('merchantId') == undefined && cookies.get('userInfo')?.type != 'merchant' && <th>User</th>}
                                                            <th>Timestamp</th>
                                                        </thead>
                                                        <tbody>
                                                            {fetchItemHistoryQuery?.paginateItemHistory?.data?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                                                        </td>
                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.sku ?? '-'}</p>
                                                                        </td>
                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.inventory?.name ?? '-'}</p>
                                                                        </td>
                                                                        {cookies.get('merchantId') == undefined && cookies.get('userInfo')?.type != 'merchant' && (
                                                                            <td>
                                                                                <p className={' m-0 p-0 wordbreak '}>{item?.merchant?.name ?? '-'}</p>
                                                                            </td>
                                                                        )}

                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.stockCount ?? '-'}</p>
                                                                        </td>
                                                                        <td>
                                                                            <p style={{ color: item.amount < 0 ? 'var(--danger)' : 'var(--success)' }} className="m-0 p-0 wordbreak">
                                                                                {item?.amount !== undefined ? (
                                                                                    <>{item.amount < 0 ? <span>- {Math.abs(item.amount)}</span> : <span>+ {item.amount} </span>}</>
                                                                                ) : (
                                                                                    '-'
                                                                                )}
                                                                            </p>
                                                                        </td>

                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.amountBefore ?? '-'}</p>
                                                                        </td>
                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.order?.id ?? '-'}</p>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.order?.status}</p>
                                                                        </td>
                                                                        <td style={{ minWidth: '400px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.description}</p>
                                                                        </td>
                                                                        {cookies.get('merchantId') == undefined && cookies.get('userInfo')?.type != 'merchant' && (
                                                                            <td>
                                                                                <p className={' m-0 p-0 wordbreak '}>{item?.user?.name}</p>
                                                                            </td>
                                                                        )}
                                                                        <td>
                                                                            <p className={' m-0 p-0 wordbreak '}>{dateformatter(item?.createdAt)}</p>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </>
                                            )}
                                            {/* <Pagespaginatecomponent
                                totaldatacount={fetchItemHistoryQuery?.data?.total}
                                numofitemsperpage={fetchItemHistoryQuery?.data?.per_page}
                                pagenumbparams={fetchItemHistoryQuery?.data?.current_page}
                                nextpagefunction={(nextpage) => {
                                    history.push({
                                        pathname: '/users',
                                        search: '&page=' + nextpage,
                                    });
                                }}
                            /> */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ItemHistory;
