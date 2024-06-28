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
    const { setpageactive_context, setpagetitle_context, returnPackageStatusContext, returnPackageTypesContext } = useContext(Contexthandlerscontext);
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
                                                    value={returnPackageTypesContext.filter((option) => option.value == filter?.assigned)}
                                                    onChange={(option) => {
                                                        setfilter({ ...filter, assigned: option.value });
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
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
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
                                            <span style={{ fontWeight: 700, fontSize: '16px' }}># {item?.id}</span>
                                        </div>
                                        <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                            <div class="row m-0 w-100 d-fex justify-content-end align-items-center">
                                                <div
                                                    className={
                                                        item.status == 'delivered'
                                                            ? ' wordbreak text-success bg-light-success rounded-pill font-weight-600allcentered  '
                                                            : ' wordbreak text-warning bg-light-warning rounded-pill font-weight-600allcentered '
                                                    }
                                                >
                                                    {returnPackageStatusContext?.map((i, ii) => {
                                                        if (i.value == item?.status) {
                                                            return <span>{i.label}</span>;
                                                        }
                                                    })}
                                                </div>
                                                <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600allcentered mx-1 '}>
                                                    {returnPackageTypesContext?.map((i, ii) => {
                                                        if (i.value == item?.type) {
                                                            return <span>{i.label}</span>;
                                                        }
                                                    })}
                                                </div>
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
