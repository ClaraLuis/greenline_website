import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { FiCheckCircle } from 'react-icons/fi';
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { FaLayerGroup } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import Cookies from 'universal-cookie';

const MerchantPackages = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setchosenPackageContext, returnPackageStatusContext, isAuth, dateformatter, setpagetitle_context } = useContext(Contexthandlerscontext);
    const { fetchPackages, useQueryGQL, findReturnPackageBySku, useLazyQueryGQL, fetchMerchants } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        userId: '',
    });
    const [search, setSearch] = useState('');

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assigned: undefined,
        status: undefined,
        type: 'merchant',
        toMerchantId: undefined,
    });

    const fetchPackagesQuery = useQueryGQL('', fetchPackages(), filter);

    useEffect(() => {
        setpageactive_context('/merchantpackages');
        setpagetitle_context('Merchant');
    }, []);

    const [findReturnPackageBySkuQuery] = useLazyQueryGQL(findReturnPackageBySku());

    const [barcode, setBarcode] = useState('');
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);
    useEffect(() => {
        const handleKeyDown = async (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return; // Don't process barcode scanning when typing in an input field
            }
            if (e.key === 'Enter') {
                const finalBarcode = barcode; // Add the last character (Enter) before clearing
                setBarcode(''); // Clear the barcode state

                try {
                    var { data } = await findReturnPackageBySkuQuery({
                        variables: {
                            sku: finalBarcode,
                        },
                    });
                    if (data?.findReturnPackageBySku != null) {
                        setchosenPackageContext(data?.findReturnPackageBySku);
                        history.push('/merchantreturnpackageinfo?packageId=' + data?.findReturnPackageBySku?.id);
                    }
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
            } else {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-12 p-0 '}>
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 p-0 px-2">
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
                                                {/* <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
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
                                                    value={returnPackageTypeContext.filter((option) => option.value == filter?.assigned)}
                                                    onChange={(option) => {
                                                        setfilter({ ...filter, assigned: option.value });
                                                    }}
                                                />
                                            </div> */}
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
                                                {!cookies.get('userInfo')?.merchantId && (
                                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                        <SelectComponent
                                                            title={'Merchant'}
                                                            filter={filterMerchants}
                                                            setfilter={setfilterMerchants}
                                                            options={fetchMerchantsQuery}
                                                            attr={'paginateMerchants'}
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
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                        <div class="col-lg-12 p-0 px-3">
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
                        </div>

                        {isAuth([1, 52, 64]) && (
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
                                    return (
                                        <div
                                            onClick={() => {
                                                history.push('/merchantreturnpackageinfo?packageId=' + item.id);
                                                setchosenPackageContext(item);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                            className="col-lg-4 "
                                        >
                                            <div
                                                style={{ background: 'white', transition: 'all 0.4s', cursor: 'pointer' }}
                                                class={generalstyles.card + ' p-3 row m-0 w-100   d-flex align-items-center'}
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
                                                            {item?.courier && (
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
            </div>
        </div>
    );
};
export default MerchantPackages;
