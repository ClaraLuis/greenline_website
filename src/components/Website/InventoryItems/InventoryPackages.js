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

const InventoryPackages = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, returnPackageStatusContext, returnPackageTypeContext } = useContext(Contexthandlerscontext);
    const { fetchPackages, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        userId: '',
    });

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assigned: undefined,
        status: undefined,
        type: 'inventory',
    });

    const fetchPackagesQuery = useQueryGQL('', fetchPackages(), filter);

    useEffect(() => {
        setpageactive_context('/inventorypackages');
    }, []);

    const [barcode, setBarcode] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }

            if (e.key === 'Enter') {
                setfilter({ ...filter, sku: barcode.length === 0 ? undefined : barcode });
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
    }, [barcode, filter]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-12 p-0 '}>
                    <div class="row m-0 w-100">
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
                                                setfilter({ ...filter, sku: search?.length == 0 ? undefined : search });
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
                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={fetchPackagesQuery?.data?.PaginateReturnPackages?.cursor?.beforeCursor}
                                afterCursor={fetchPackagesQuery?.data?.PaginateReturnPackages?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                        {fetchPackagesQuery?.data?.PaginateReturnPackages?.data?.length == 0 && (
                            <div style={{ height: '70vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                                <div class="row m-0 w-100">
                                    <FaLayerGroup size={40} class=" col-lg-12" />
                                    <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                        No Packages
                                    </div>
                                </div>
                            </div>
                        )}
                        {fetchPackagesQuery?.data?.PaginateReturnPackages?.data?.map((item, index) => {
                            return (
                                <div className="col-lg-4 p-1">
                                    <div style={{ background: 'white' }} class={' p-3 row m-0 w-100 card  d-flex align-items-center'}>
                                        <div className="col-lg-4 p-0">
                                            <span style={{ fontSize: '12px', color: 'grey' }}># {item?.id}</span>
                                        </div>
                                        <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                            <div class="row m-0 w-100 d-fex justify-content-end align-items-center">
                                                <div
                                                    className={
                                                        item.status == 'delivered'
                                                            ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered  '
                                                            : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600 allcentered '
                                                    }
                                                >
                                                    {returnPackageStatusContext?.map((i, ii) => {
                                                        if (i.value == item?.status) {
                                                            return <span>{i.label}</span>;
                                                        }
                                                    })}
                                                </div>
                                                {/* <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered mx-1 '}>
                                                    {returnPackageTypeContext?.map((i, ii) => {
                                                        if (i.value == item?.type) {
                                                            return <span>{i.label}</span>;
                                                        }
                                                    })}
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 p-0 my-2">
                                            <hr className="m-0" />
                                        </div>
                                        <div className="col-lg-12 p-0 mb-2">
                                            SKU:{' '}
                                            <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                {item?.sku}
                                            </span>
                                        </div>

                                        <div class="col-lg-12 p-0 d-flex justify-content-end" style={{ fontSize: '12px', color: 'grey' }}>
                                            {item?.createdAt}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchPackagesQuery?.data?.PaginateReturnPackages?.cursor?.beforeCursor}
                                afterCursor={fetchPackagesQuery?.data?.PaginateReturnPackages?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InventoryPackages;
