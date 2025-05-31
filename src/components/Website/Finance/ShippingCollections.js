import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import { DateRangePicker } from 'rsuite';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import Form from '../../Form.js';

import { Modal } from 'react-bootstrap';
import { IoIosArrowForward, IoMdClose } from 'react-icons/io';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import MultiSelect from '../../MultiSelect.js';
import TransactionsTableView from './TransactionsTableView.js';
import * as XLSX from 'xlsx';
import Cookies from 'universal-cookie';
import Pagination from '../../Pagination.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import Select from 'react-select';
import Decimal from 'decimal.js';
import { NotificationManager } from 'react-notifications';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const ShippingCollections = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth, buttonLoadingContext, setbuttonLoadingContext, useLoadQueryParamsToPayload, updateQueryParamContext } =
        useContext(Contexthandlerscontext);
    const { useQueryGQL, paginateShippingCollections, fetchHubs, processShippingTaxes, useMutationGQL, useLazyQueryGQL } = API();
    const { lang, langdetect } = useContext(LanguageContext);
    const [total, setTotal] = useState(0);

    const [filterShippingCollections, setfilterShippingCollections] = useState({
        afterCursor: undefined,
        beforeCursor: undefined,
        hubId: undefined,
        isAsc: false,
        limit: 20,
        merchantId: undefined,
    });
    useLoadQueryParamsToPayload(setfilterShippingCollections);

    const [submit, setsubmit] = useState(false);

    const [selectedArray, setselectedArray] = useState([]);
    const [openModal, setopenModal] = useState(false);

    const [payload, setpayload] = useState({
        functype: 'add',
        name: '',
        type: '',
        merchantId: undefined,
        balance: 0,
        userId: undefined,
        taxRate: '14',
    });
    const [paginateShippingCollectionsQuery, setpaginateShippingCollectionsQuery] = useState({ data: { paginateShippingCollections: { data: [] } } });

    const [paginateShippingCollectionsLazyQuery] = useLazyQueryGQL(paginateShippingCollections());

    const [filterobj, setfilterobj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
        fromDate: undefined,
        toDate: undefined,
    });

    const { isAsc, limit, processing, ...filteredFilterObj } = filterobj;
    const [filterHubs, setfilterHubs] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('', fetchHubs(), filterHubs);
    useEffect(() => {
        setpageactive_context('/shippingcollections');
        setpagetitle_context('Finance');
    }, []);

    const [processShippingTaxesMutation] = useMutationGQL(processShippingTaxes(), {
        merchantId: filterShippingCollections?.merchantId,
        shippingCollectionIds: selectedArray,
        taxRate: payload?.taxRate ? new Decimal(payload.taxRate).div(100).toNumber() : 0,
    });
    const fetchTaxes = async () => {
        try {
            var { data } = await paginateShippingCollectionsLazyQuery({
                variables: { input: { ...filterShippingCollections } },
            });
            // setpaginateShippingCollectionsQuery({ data: { ...paginateShippingCollections?.data, data } });
            setpaginateShippingCollectionsQuery((prev) => {
                const oldData = prev?.data?.paginateShippingCollections?.data || [];
                const newData = data?.paginateShippingCollections?.data || [];

                return {
                    data: {
                        paginateShippingCollections: {
                            ...data?.paginateShippingCollections,
                            data: [...oldData, ...newData],
                        },
                    },
                };
            });
        } catch (e) {
            let errorMessage = 'An unexpected error occurred';
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                errorMessage = e.graphQLErrors[0].message || errorMessage;
            } else if (e.networkError) {
                errorMessage = e.networkError.message || errorMessage;
            } else if (e.message) {
                errorMessage = e.message;
            }
            NotificationManager.warning(errorMessage, 'Warning!');
        }
    };
    const refetchTaxes = async () => {
        try {
            var { data } = await paginateShippingCollectionsLazyQuery({
                variables: { input: { ...filterShippingCollections } },
            });
            setpaginateShippingCollectionsQuery({ data: data });
        } catch (e) {
            let errorMessage = 'An unexpected error occurred';
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                errorMessage = e.graphQLErrors[0].message || errorMessage;
            } else if (e.networkError) {
                errorMessage = e.networkError.message || errorMessage;
            } else if (e.message) {
                errorMessage = e.message;
            }
            NotificationManager.warning(errorMessage, 'Warning!');
        }
    };
    useEffect(async () => {
        fetchTaxes();
    }, [filterShippingCollections]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-start justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={isAuth([1, 60]) ? 'col-lg-9 p-0' : 'col-lg-12'}>
                    <div class="row m-0 w-100">
                        <div class="col-lg-12">
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
                                                                ].find((option) => option.value === (filterShippingCollections?.isAsc ?? true))}
                                                                onChange={(option) => {
                                                                    setfilterShippingCollections({ ...filterShippingCollections, isAsc: option?.value });
                                                                    updateQueryParamContext('isAsc', option?.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {isAuth([1]) && (
                                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                        <MerchantSelectComponent
                                                            type="single"
                                                            attr={'paginateMerchants'}
                                                            label={'name'}
                                                            value={'id'}
                                                            payload={filterShippingCollections}
                                                            payloadAttr={'merchantId'}
                                                            onClick={(option) => {
                                                                if (option === 'All') {
                                                                    setfilterShippingCollections({ ...filterShippingCollections, merchantId: undefined });
                                                                    updateQueryParamContext('merchantId', undefined);
                                                                } else {
                                                                    setfilterShippingCollections({ ...filterShippingCollections, merchantId: option.id });
                                                                    updateQueryParamContext('merchantId', option.id);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <SelectComponent
                                                        title="Hubs"
                                                        filter={filterHubs}
                                                        setfilter={setfilterHubs}
                                                        options={fetchHubsQuery}
                                                        attr="paginateHubs"
                                                        label={'name'}
                                                        value={'id'}
                                                        payload={filterShippingCollections}
                                                        payloadAttr={'hubId'}
                                                        onClick={(option) => {
                                                            setfilterShippingCollections({ ...filterShippingCollections, hubId: option?.id });
                                                            updateQueryParamContext('hubId', option.id);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>{' '}
                        <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                            <div className={' col-lg-12 table_responsive  scrollmenuclasssubscrollbar px-3 py-0 '}>
                                <div class="row m-0 w-100">
                                    <TransactionsTableView
                                        width={'50%'}
                                        query={paginateShippingCollectionsQuery}
                                        paginationAttr="paginateShippingCollections"
                                        srctype="all"
                                        refetchFunc={() => {
                                            Refetch();
                                        }}
                                        allowSelect={true}
                                        selectedArray={selectedArray}
                                        setselectedArray={setselectedArray}
                                        hasOrder={true}
                                    />
                                    {/* <TransactionsTable hasOrder={true} width={'50%'} query={paginateShippingCollectionsQuery} paginationAttr="paginateShippingCollections" srctype="all" /> */}
                                </div>
                            </div>
                            <div class="col-lg-12 p-0 mb-3 d-flex justify-content-end">
                                {/* <Pagination
                                    beforeCursor={paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.cursor?.beforeCursor}
                                    afterCursor={paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.cursor?.afterCursor}
                                    filter={filterobj}
                                    setfilter={setfilterobj}
                                /> */}

                                <div
                                    onClick={() => {
                                        setfilterShippingCollections({
                                            ...filterShippingCollections,
                                            afterCursor: paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.cursor?.afterCursor,
                                            beforeCursor: null,
                                        });
                                    }}
                                    class={
                                        paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.cursor?.afterCursor === null ||
                                        paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.cursor?.afterCursor === undefined
                                            ? `${generalstyles.mui_1774owm_disabled} ${generalstyles.mui_1774owm}`
                                            : generalstyles.mui_1774owm
                                    }
                                >
                                    <span style={{ fontSize: '16px' }}>Load More</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isAuth([1, 60]) && (
                    <div class="col-lg-3 ">
                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                            <div className="col-lg-12 p-0 mb-3">
                                <span style={{ fontWeight: 600 }}>
                                    Sub Total:{' '}
                                    {new Decimal(
                                        paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.data
                                            ?.filter((item) => selectedArray.includes(item.id))
                                            ?.reduce((sum, item) => sum.plus(new Decimal(item.amount || 0)), new Decimal(0)),
                                    ).toFixed(2)}
                                </span>

                                <div className="d-flex align-items-center my-2">
                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label for="name" class={formstyles.form__label}>
                                            Tax Rate (%):
                                        </label>
                                        <input
                                            id="taxRateInput"
                                            type="number"
                                            step="0.01"
                                            class={formstyles.form__field}
                                            value={payload?.taxRate || ''}
                                            onChange={(event) => {
                                                setpayload({ ...payload, taxRate: parseFloat(event.target.value || 0) });
                                            }}
                                        />
                                    </div>
                                </div>

                                <span style={{ fontWeight: 600 }}>
                                    Total:{' '}
                                    {useMemo(() => {
                                        const subtotal =
                                            paginateShippingCollectionsQuery?.data?.paginateShippingCollections?.data
                                                ?.filter((item) => selectedArray.includes(item.id))
                                                ?.reduce((sum, item) => sum.plus(new Decimal(item.amount || 0)), new Decimal(0)) || new Decimal(0);

                                        const taxRate = new Decimal(payload?.taxRate || 0);
                                        const total = subtotal.plus(subtotal.times(taxRate.div(100)));

                                        return total.toFixed(2);
                                    }, [selectedArray, paginateShippingCollectionsQuery, payload?.taxRate])}
                                </span>
                            </div>

                            <div class="col-lg-12">
                                <button
                                    class={generalstyles.roundbutton + ' allcentered w-100'}
                                    onClick={async () => {
                                        if (buttonLoadingContext) return;
                                        setbuttonLoadingContext(true);
                                        try {
                                            const { data } = await processShippingTaxesMutation();
                                            if (data?.processShippingTaxes?.success) {
                                                NotificationManager.success(data?.processShippingTaxes?.message, 'Success');
                                                setselectedArray([]);
                                                refetchTaxes();
                                            } else {
                                                NotificationManager.warning(data?.processShippingTaxes?.message, 'warning');
                                            }
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
                                        }
                                        setbuttonLoadingContext(false);
                                    }}
                                >
                                    Process Taxes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ShippingCollections;
