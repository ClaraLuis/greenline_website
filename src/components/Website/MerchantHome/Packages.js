import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { FaLayerGroup, FaPlus, FaWindowMinimize } from 'react-icons/fa';
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

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';

const Packages = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, returnPackageStatusContext, returnPackageTypeContext, dateformatter } = useContext(Contexthandlerscontext);
    const { useMutationGQL, fetchMerchants, assignPackageToCourier, fetchCouriers, fetchPackages, useQueryGQL, createReturnPackage } = API();
    const [buttonLoading, setbuttonLoading] = useState(false);
    const { lang, langdetect } = useContext(LanguageContext);
    const [cartItems, setcartItems] = useState([]);
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
    const fetchCouriersQuery = useQueryGQL('', fetchCouriers(), filterCouriers);

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assigned: undefined,
    });

    const fetchPackagesQuery = useQueryGQL('', fetchPackages(), filter);
    const { refetch: refetchPackagesQuery } = useQueryGQL('', fetchPackages(), filter);

    const [assignPackageToCourierMutation] = useMutationGQL(assignPackageToCourier(), {
        ids: packagepayload?.ids,
        userId: packagepayload?.userId,
    });

    useEffect(() => {
        setpageactive_context('/packages');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-8 p-0 '}>
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
                                    className="col-lg-6 p-1"
                                >
                                    <div style={{ background: 'white' }} class={' p-3 row m-0 w-100 card  d-flex align-items-center'}>
                                        <div className="col-lg-4 p-0">
                                            <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                # {item?.id}
                                            </span>
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
                                                <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered mx-1 '}>
                                                    {returnPackageTypeContext?.map((i, ii) => {
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
                                        {/* <div className="col-lg-12 p-0 mb-2">
                                            SKU:{' '}
                                           
                                        </div> */}
                                        <div class="col-lg-6 p-0">
                                            <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                {item?.sku}
                                            </span>
                                        </div>
                                        <div class="col-lg-6 p-0 d-flex justify-content-end">
                                            <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                {item?.count} items
                                            </span>
                                        </div>
                                        <div class="col-lg-12 p-0 d-flex justify-content-end" style={{ fontSize: '12px', color: 'grey' }}>
                                            {dateformatter(item?.createdAt)}
                                        </div>
                                        {selected && (
                                            <div
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    position: 'absolute',
                                                    left: 15,
                                                    bottom: 0,
                                                }}
                                                className=" allcentered"
                                            >
                                                <FiCheckCircle style={{ transition: 'all 0.4s' }} color={selected ? 'var(--success)' : ''} size={18} />
                                            </div>
                                        )}
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
                <div class="col-lg-4 mb-3 px-1">
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
                            />
                        </div>

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                onClick={async () => {
                                    setbuttonLoading(true);
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
                                    setbuttonLoading(false);
                                }}
                                disabled={buttonLoading}
                                class={generalstyles.roundbutton}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>Assign to courier</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Packages;
