import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles, tabledefaultstyles } from '../Generalfiles/selectstyles.js';

import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation, useQuery } from 'react-query';

// Icons
import Select, { components } from 'react-select';
import API from '../../../API/API.js';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { BiHide, BiShowAlt } from 'react-icons/bi';
import { FiUsers } from 'react-icons/fi';

const { ValueContainer, Placeholder } = components;

const Campaigns = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, fetchAuthorizationQueryContext } = useContext(Contexthandlerscontext);
    const { FetchCampaigns_API, FetchCompanies_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [openModal, setopenModal] = useState(false);
    const [shownads, setshownads] = useState([]);
    const [locationpayload, setlocationpayload] = useState({
        functype: 'add',
        name: '',
        isvisible: '',

        id: '',
    });

    const [filterroute, setfilterroute] = useState({
        company_id: '',
        from_date: '',
        to_date: '',
        platform: '',
    });

    const [filter, setfilter] = useState({
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
        platform: 'all',
    });
    const [filtercampaigns, setfiltercampaigns] = useState({
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
        platform: 'all',
    });

    const FetchCampaigns = useQuery(['FetchCampaigns_API' + JSON.stringify(filtercampaigns)], () => FetchCampaigns_API({ filter: filtercampaigns }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filtercompanies, setfiltercompanies] = useState({
        page: 1,
        search: '',
    });
    const FetchCompanies = useQuery(['FetchCompanies_API' + JSON.stringify(filtercompanies)], () => FetchCompanies_API({ filter: filtercompanies }), {
        keepPreviousData: true,
        staleTime: Infinity,
        enabled: fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin',
    });

    const CustomValueContainer = ({ children, ...props }) => {
        return (
            <ValueContainer {...props}>
                <Placeholder {...props} isFocused={props.isFocused}>
                    {props.selectProps.placeholder}
                </Placeholder>
                {React.Children.map(children, (child) => (child && child.type !== Placeholder ? child : null))}
            </ValueContainer>
        );
    };
    useEffect(() => {
        setpageactive_context('/campaigns');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';

        var company = 'all';
        var companyroute = '';
        var fromdate = 'all';
        var fromdateroute = '';
        var todate = 'all';
        var todateroute = '';
        var platform = 'all';
        var platformroute = '';

        if (queryParameters.get('companyid') == undefined) {
        } else {
            company = queryParameters.get('companyid');
            companyroute = '?companyid=' + queryParameters.get('companyid');
        }
        if (queryParameters.get('fromdate') == undefined) {
        } else {
            fromdate = queryParameters.get('fromdate');
            fromdateroute = '&fromdate=' + queryParameters.get('fromdate');
        }
        if (queryParameters.get('todate') == undefined) {
        } else {
            todate = queryParameters.get('todate');
            todateroute = '&todate=' + queryParameters.get('todate');
        }
        if (queryParameters.get('platform') == undefined) {
        } else {
            platform = queryParameters.get('platform');
            platformroute = '&platform=' + queryParameters.get('platform');
        }
        setfilter({
            company_id: company,
            from_date: fromdate,
            to_date: todate,
            platform: platform,
        });
        setfiltercampaigns({
            company_id: company,
            from_date: fromdate,
            to_date: todate,
            platform: platform,
        });
        setfilterroute({
            company_id: companyroute,
            from_date: fromdateroute,
            to_date: todateroute,
            platform: platformroute,
        });
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start pb-2 mb-2'}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        <span style={{ color: 'var(--info)' }}> {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbycampaigns?.length} </span>
                        Campaigns
                    </p>
                </div>
                <div class="col-lg-12 ">
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.subcontainer}` + ' mb-3 p-3 '}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p style={{ fontSize: '2.3vh' }} class={'  m-0 p-0 '}>
                                                Filter:
                                            </p>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                            <AccordionItemState>
                                                {(state) => {
                                                    if (state.expanded == true) {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
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
                                <div class="row m-0 w-100 mt-2 ">
                                    {fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin' && (
                                        <div class="col-lg-12 p-0 mb-3">
                                            <div class="row m-0 w-100">
                                                <div class="mr-2">
                                                    <span>Company</span>
                                                    <div class="mt-1" style={{ width: '200px' }}>
                                                        <Select
                                                            options={FetchCompanies?.data?.data?.data}
                                                            value={FetchCompanies?.data?.data?.data?.filter((option) => option.id == filter?.company_id)}
                                                            getOptionLabel={(option) => option.companyname}
                                                            getOptionValue={(option) => option.id}
                                                            styles={tabledefaultstyles}
                                                            onChange={(option) => {
                                                                setfilter({ ...filter, company_id: option.id });
                                                                setfilterroute({ ...filterroute, company_id: '?companyid=' + option.id });
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div class="mr-2">
                                                    <span>Platform</span>
                                                    <div class="mt-1" style={{ width: '200px' }}>
                                                        <Select
                                                            options={[
                                                                { label: 'All', value: 'all' },
                                                                { label: 'Instagram', value: 'ig' },
                                                                { label: 'Facebook', value: 'fb' },
                                                                { label: 'Snapchat', value: 'snapchat' },
                                                                { label: 'Tiktok', value: 'tiktok' },
                                                            ]}
                                                            styles={tabledefaultstyles}
                                                            isSearchable={true}
                                                            value={[
                                                                { label: 'All', value: 'all' },
                                                                { label: 'Instagram', value: 'ig' },
                                                                { label: 'Facebook', value: 'fb' },
                                                                { label: 'Snapchat', value: 'snapchat' },
                                                                { label: 'Tiktok', value: 'tiktok' },
                                                            ].filter((option) => option.value == filter.platform)}
                                                            onChange={(option) => {
                                                                setfilter({ ...filter, platform: option.value });
                                                                setfilterroute({ ...filterroute, platform: '&platform=' + option.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div class="col-lg-12 p-0 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="mr-2">
                                                <span>From</span>
                                                <div class="mt-1" style={{ width: '200px' }}>
                                                    <input
                                                        class={generalstyles.tableinputfield}
                                                        type={'date'}
                                                        value={filter?.from_date}
                                                        onChange={(event) => {
                                                            setfilter({ ...filter, from_date: event?.target?.value });
                                                            setfilterroute({ ...filterroute, from_date: '&fromdate=' + event?.target?.value });
                                                        }}
                                                    />
                                                </div>
                                            </div>{' '}
                                            <div class="mr-2">
                                                <span>To</span>
                                                <div class="mt-1" style={{ width: '200px' }}>
                                                    <input
                                                        class={generalstyles.tableinputfield}
                                                        type={'date'}
                                                        value={filter?.to_date}
                                                        onChange={(event) => {
                                                            setfilter({ ...filter, to_date: event?.target?.value });
                                                            setfilterroute({ ...filterroute, to_date: '&todate=' + event?.target?.value });
                                                        }}
                                                    />
                                                </div>
                                            </div>{' '}
                                        </div>
                                    </div>

                                    <div class="col-lg-12 p-0 mt-3 allcentered">
                                        <button
                                            // style={{ width: '10vh' }}
                                            class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                            onClick={() => {
                                                history.push({
                                                    pathname: '/campaigns',
                                                    search: filterroute.company_id + filterroute.from_date + filterroute.to_date + filterroute.platform,
                                                });
                                            }}
                                        >
                                            Filter
                                        </button>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbycampaigns?.map((item, index) => {
                    var adsetindex = 0;

                    return (
                        <div class="col-lg-6">
                            <div style={{ maxHeight: '350px', minHeight: '350px', overflowY: 'scroll' }} class={generalstyles.shadowcardnohover + ' scrollmenuclasssubscrollbar'}>
                                <div style={{ fontWeight: 600, fontSize: '16px', color: '#003e5a' }} class="col-lg-12 mb-3 p-0 text-capitalize">
                                    {index + 1}. {item?.meta_campaign_name} (total leads:
                                    <span style={{ color: 'var(--info)' }}> {item?.c}</span>)
                                </div>
                                <div class="col-lg-12 p-0">
                                    <hr />
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '15.5px', color: '#5E4D8A' }} class="col-lg-12 p-0 mb-1  text-capitalize">
                                    Adsets:
                                </div>
                                {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyadsets?.map((subitem, subindex) => {
                                    var adindexx = 0;

                                    if (item?.meta_campaign_id == subitem?.meta_campaign_id) {
                                        adsetindex += 1;

                                        return (
                                            <>
                                                <div style={{ fontWeight: 500, fontSize: '15.5px', color: '#5E4D8A' }} class="col-lg-12 mb-1  text-capitalize">
                                                    {adsetindex}. {subitem?.meta_adset_name} (total leads:
                                                    <span style={{ color: 'var(--info)' }}> {subitem?.c}</span>)
                                                </div>
                                                <div style={{ fontWeight: 500, color: '#C9498E' }} class="col-lg-12  mb-1 text-capitalize">
                                                    Ads:
                                                </div>

                                                {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyads?.map((aditem, adindex) => {
                                                    if (aditem?.meta_adset_id == subitem?.meta_adset_id) {
                                                        adindexx += 1;

                                                        return (
                                                            <div style={{ fontWeight: 400, color: '#C9498E' }} class="col-lg-12 px-4 mb-1 text-capitalize">
                                                                {adindexx}. {aditem?.meta_ad_name} (total leads:
                                                                <span style={{ color: 'var(--info)' }}> {aditem?.c}</span>)
                                                            </div>
                                                        );
                                                    }
                                                })}
                                                <div class="col-lg-12">
                                                    <hr />
                                                </div>
                                            </>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    );
                })} */}

                {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbycampaigns?.map((item, index) => {
                    return (
                        <div class="col-lg-12 p-3 px-4 mb-2" style={{ background: 'white' }}>
                            <div style={{ fontWeight: 600, fontSize: '17px', color: '#003e5a' }} class="col-lg-12 mb-1 p-0 text-capitalize">
                                {index + 1}. {item?.meta_campaign_name} (total leads:
                                <span style={{ color: 'var(--info)' }}> {item?.c}</span>)
                            </div>
                            <table style={{}} className={'table'}>
                                <thead>
                                    <th>Adset</th>
                                    <th>Total</th>
                                    <th>Show Ads</th>
                                    <th>Show Leads</th>
                                </thead>
                                <tbody>
                                    {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyadsets?.map((subitem, subindex) => {
                                        if (item?.meta_campaign_id == subitem?.meta_campaign_id) {
                                            var show = false;
                                            shownads?.map((i, ix) => {
                                                if (i == subitem.meta_adset_id) {
                                                    show = true;
                                                }
                                            });

                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{subitem.meta_adset_name}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{subitem?.c}</p>
                                                        </td>

                                                        <td>
                                                            {show && (
                                                                <BiHide
                                                                    onClick={() => {
                                                                        var temp = [...shownads];
                                                                        var exist = false;
                                                                        var indexx = 0;
                                                                        shownads?.map((i, ix) => {
                                                                            if (i == subitem.meta_adset_id) {
                                                                                exist = true;
                                                                                indexx = ix;
                                                                            }
                                                                        });
                                                                        if (!exist) {
                                                                            temp.push(subitem.meta_adset_id);
                                                                        } else {
                                                                            temp.splice(indexx, 1);
                                                                        }
                                                                        setshownads([...temp]);
                                                                    }}
                                                                    class="text-secondaryhover"
                                                                    size={20}
                                                                />
                                                            )}
                                                            {!show && (
                                                                <BiShowAlt
                                                                    onClick={() => {
                                                                        var temp = [...shownads];
                                                                        var exist = false;
                                                                        var indexx = 0;
                                                                        shownads?.map((i, ix) => {
                                                                            if (i == subitem.meta_adset_id) {
                                                                                exist = true;
                                                                                indexx = ix;
                                                                            }
                                                                        });
                                                                        if (!exist) {
                                                                            temp.push(subitem.meta_adset_id);
                                                                        } else {
                                                                            temp.splice(indexx, 1);
                                                                        }
                                                                        setshownads([...temp]);
                                                                    }}
                                                                    class="text-secondaryhover"
                                                                    size={20}
                                                                />
                                                            )}
                                                        </td>
                                                        <td>
                                                            <FiUsers
                                                                onClick={() => {
                                                                    history.push('/leads?&campaignid=' + item?.meta_campaign_id + '&adsetid=' + subitem.meta_adset_id + '&leadsource=true');
                                                                }}
                                                                class="text-secondaryhover"
                                                                size={20}
                                                            />
                                                        </td>
                                                    </tr>
                                                    {show && (
                                                        <>
                                                            <div class="col-lg-12 p-2 allcentered">
                                                                <table style={{ width: '200px', borderRadius: '20px' }} className={'table'}>
                                                                    <thead>
                                                                        <th style={{ minWidth: '400px', maxWidth: '400px' }}>Ad</th>
                                                                        <th>Total</th>
                                                                        <th>Show leads</th>
                                                                    </thead>
                                                                    <tbody>
                                                                        {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyads?.map((aditem, adindex) => {
                                                                            if (aditem?.meta_adset_id == subitem?.meta_adset_id) {
                                                                                return (
                                                                                    <tr>
                                                                                        <td style={{ minWidth: '400px', maxWidth: '400px' }}>
                                                                                            <p className={' m-0 p-0 wordbreak '}>{aditem?.meta_ad_name}</p>
                                                                                        </td>

                                                                                        <td>
                                                                                            <p className={' m-0 p-0 wordbreak '}>{aditem?.c}</p>
                                                                                        </td>
                                                                                        <td>
                                                                                            <FiUsers
                                                                                                onClick={() => {
                                                                                                    history.push(
                                                                                                        '/leads?&campaignid=' +
                                                                                                            item?.meta_campaign_id +
                                                                                                            '&adsetid=' +
                                                                                                            subitem.meta_adset_id +
                                                                                                            '&adid=' +
                                                                                                            aditem?.meta_ad_id +
                                                                                                            '&leadsource=true',
                                                                                                    );
                                                                                                }}
                                                                                                class="text-secondaryhover"
                                                                                                size={20}
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            }
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div class="col-lg-12 p-0">
                                                                <hr />
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Campaigns;
