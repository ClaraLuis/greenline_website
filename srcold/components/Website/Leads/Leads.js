import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BiPlus, BiShowAlt } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation, useQuery } from 'react-query';
import reviewsstyles from './reviews.module.css';
import checkboxstyles from '../Generalfiles/CSS_GENERAL/checkbox.module.css';

import Dropdown from 'react-bootstrap/Dropdown';
// Icons
import { components } from 'react-select';
import API from '../../../API/API.js';
import LeadInfo from './LeadInfo.js';
import CallInfo from '../Calls/CallInfo.js';
import { defaultstyles, tabledefaultstyles } from '../Generalfiles/selectstyles.js';
import Select from 'react-select';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import MeetingandFollowup from '../Calls/MeetingandFollowup.js';
import DealInfo from '../Deals/DealInfo.js';
import { MdAddIcCall, MdOutlineMoreVert } from 'react-icons/md';

const { ValueContainer, Placeholder } = components;

const Leads = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);

    let history = useHistory();
    const { filterLeadscontext, setfilterLeadscontext, setpageactive_context, setpagetitle_context, dateformatter, fetchAuthorizationQueryContext } = useContext(Contexthandlerscontext);
    const { FetchLeads_API, FetchPhases_API, FetchGroups_API, FetchCampaigns_API, FetchCompanies_API, AssigntoGroupMutation_API, AssigntoPhaseMutation_API, Updateleadstatus_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [array, setarray] = useState(['Calls', 'Meetings', 'Followups']);
    const [chosentab, setchosentab] = useState('');
    const [selectedusers, setselectedusers] = useState([]);

    const [phasecolor, setphasecolor] = useState(false);
    const [ImportFileInput, setImportFileInput] = useState('');
    const [filtermodal, setfiltermodal] = useState('');

    const [leadsource, setleadsource] = useState(false);

    const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [opencallModal, setopencallModal] = useState(false);
    const [meetingfolowupmodal, setmeetingfolowupmodal] = useState({ open: false, type: '' });

    const [callsmodal, setcallsmodal] = useState(false);
    const [dealsmodal, setdealsmodal] = useState(false);
    const [changemodal, setchangemodal] = useState({ open: false, type: '', optionid: '' });

    const [calls, setcalls] = useState([]);
    const [leadpayload, setleadpayload] = useState({
        functype: 'add',
        id: 'add',
        leadedists: '',
        fname: '',
        lname: '',
        phonenumber: '',
        email: '',
        company_id: '',
        phase_id: '',
        group_id: '',
    });
    const [callpayload, setcallpayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        lead_id: '',
        status: '',
        duration: '',
    });

    const [meetingfolowuppayload, setmeetingfolowuppayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        date: '',
        time: '',
        followupstatus: '',
        meetingstatus: '',
        priority: '',
        lead_id: '',
    });

    const [dealspayload, setdealspayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        value: '',
        quantity: '',
        totalvalue: '',
        lead_id: '',
    });
    const [filterroute, setfilterroute] = useState({
        phase_id: '',
        group_id: '',
        platform: '',
        meta_campaign_id: '',
        meta_adset_id: '',
        meta_ad_id: '',
        company_id: '',
        from_date: '',
        to_date: '',
    });

    const [filter, setfilter] = useState({
        page: 1,
        search: '',
        phase_id: 'all',
        group_id: 'all',
        platform: 'all',
        meta_campaign_id: 'all',
        meta_adset_id: 'all',
        meta_ad_id: 'all',
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
    });

    const FetchLeads = useQuery(['FetchLeads_API' + JSON.stringify(filterLeadscontext)], () => FetchLeads_API({ filter: filterLeadscontext }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filterphaseobj, setfilterphaseobj] = useState({
        page: 1,
        search: '',
    });
    const FetchPhases = useQuery(['FetchPhases_API' + JSON.stringify(filterphaseobj)], () => FetchPhases_API({ filter: filterphaseobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filtergroupobj, setfiltergroupobj] = useState({
        page: 1,
        search: '',
    });
    const FetchGroups = useQuery(['FetchGroups_API' + JSON.stringify(filtergroupobj)], () => FetchGroups_API({ filter: filtergroupobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filtercampaigns, seyfiltercampaigns] = useState({
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
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

    const AssigntoPhaseMutation = useMutation('AssigntoPhaseMutation_API', {
        mutationFn: AssigntoPhaseMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchLeads.refetch();
                setselectedusers([]);
                setchangemodal({ open: false, type: '', optionid: '' });

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    const Updateleadstatus = useMutation('Updateleadstatus_API', {
        mutationFn: Updateleadstatus_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchLeads.refetch();
                setselectedusers([]);
                setchangemodal({ open: false, type: '', optionid: '' });

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const AssigntoGroupMutation = useMutation('AssigntoGroupMutation_API', {
        mutationFn: AssigntoGroupMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchLeads.refetch();
                setselectedusers([]);
                setchangemodal({ open: false, type: '', optionid: '' });
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    useEffect(() => {
        setpageactive_context('/leads');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
        var page = 1;
        var pageroute = '';

        var leadsourcee = false;
        var phasecolorr = false;
        var company = filterLeadscontext?.company_id;
        var companyroute = '';
        var fromdate = filterLeadscontext?.from_date;
        var fromdateroute = '';
        var todate = filterLeadscontext?.to_date;
        var todateroute = '';
        var groupid = filterLeadscontext?.group_id;
        var groupidroute = '';
        var phaseid = filterLeadscontext?.phase_id;
        var phaseidroute = '';

        var platform = filterLeadscontext?.platform;
        var platformroute = '';
        var campaignid = filterLeadscontext?.meta_campaign_id;
        var campaignidroute = '';
        var adsetid = filterLeadscontext?.meta_adset_id;
        var adsetidroute = '';
        var adid = filterLeadscontext?.meta_ad_id;
        var adidroute = '';
        if (queryParameters.get('page') == undefined) {
        } else {
            page = queryParameters.get('page');
            pageroute = '&page=' + queryParameters.get('page');
        }
        if (queryParameters.get('leadsource') == undefined) {
        } else {
            leadsourcee = queryParameters.get('leadsource');
        }
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
        if (queryParameters.get('groupid') == undefined) {
        } else {
            groupid = queryParameters.get('groupid');
            groupidroute = '&groupid=' + queryParameters.get('groupid');
        }
        if (queryParameters.get('phaseid') == undefined) {
        } else {
            phaseid = queryParameters.get('phaseid');
            phaseidroute = '&phaseid=' + queryParameters.get('phaseid');
        }

        if (queryParameters.get('platform') == undefined) {
        } else {
            platform = queryParameters.get('platform');
            platformroute = '&platform=' + queryParameters.get('platform');
        }
        if (queryParameters.get('campaignid') == undefined) {
        } else {
            campaignid = queryParameters.get('campaignid');
            campaignidroute = '&campaignid=' + queryParameters.get('campaignid');
        }
        if (queryParameters.get('adsetid') == undefined) {
        } else {
            adsetid = queryParameters.get('adsetid');
            adsetidroute = '&adsetid=' + queryParameters.get('adsetid');
        }
        if (queryParameters.get('adid') == undefined) {
        } else {
            adid = queryParameters.get('adid');
            adidroute = '&adid=' + queryParameters.get('adid');
        }

        if (queryParameters.get('phasecolor') == undefined) {
        } else {
            phasecolorr = queryParameters.get('phasecolor');
        }
        setphasecolor(phasecolorr);
        setleadsource(leadsourcee);
        setfilter({
            page: page,
            search: '',
            phase_id: phaseid,
            group_id: groupid,
            platform: platform,
            meta_campaign_id: campaignid,
            meta_adset_id: adsetid,
            meta_ad_id: adid,
            company_id: company,
            from_date: fromdate,
            to_date: todate,
        });
        setfilterLeadscontext({
            page: page,
            search: '',
            phase_id: phaseid,
            group_id: groupid,
            platform: platform,
            meta_campaign_id: campaignid,
            meta_adset_id: adsetid,
            meta_ad_id: adid,
            company_id: company,
            from_date: fromdate,
            to_date: todate,
        });
        setfilterroute({
            page: pageroute,
            search: '',
            phase_id: phaseidroute,
            group_id: groupidroute,
            platform: platformroute,
            meta_campaign_id: campaignidroute,
            meta_adset_id: adsetidroute,
            meta_ad_id: adidroute,
            company_id: companyroute,
            from_date: fromdateroute,
            to_date: todateroute,
        });
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Leads
                    </p>
                </div>
                <div class="col-lg-12 p-0 mt-2">
                    <div className="row m-0 w-100">
                        <div
                            onClick={() => {
                                setfilterLeadscontext({ ...filterLeadscontext, phase_id: 'all' });
                                history.push('/leads');
                            }}
                            class="mr-3 pb-2  text-secondaryhover"
                            style={{ borderBottom: filterLeadscontext?.phase_id == 'all' ? '2px solid var(--info)' : '' }}
                        >
                            All
                        </div>
                        {FetchPhases?.data?.data?.data?.map((item, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        history.push('/leads?phaseid=' + item?.id);
                                    }}
                                    class="mr-3 pb-2 text-capitalize text-secondaryhover"
                                    style={{ borderBottom: filterLeadscontext?.phase_id == item?.id ? '2px solid var(--info)' : '' }}
                                >
                                    <span class="text-info">{item?.leads_count}</span> {item?.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 p-2 w-100'}>
                    <div class="col-lg-12 p-0 d-flex justify-content-end">
                        <button
                            onClick={() => {
                                setfilterLeadscontext({
                                    page: 1,
                                    search: '',
                                    phase_id: 'all',
                                    group_id: 'all',
                                    platform: 'all',
                                    meta_campaign_id: 'all',
                                    meta_adset_id: 'all',
                                    meta_ad_id: 'all',
                                    company_id: 'all',
                                    from_date: 'all',
                                    to_date: 'all',
                                });
                                history.push('/leads');
                            }}
                            class="text-danger text-dangerhover d-flex align-items-center"
                            style={{ textDecoration: 'underline' }}
                        >
                            <IoMdClose style={{ marginTop: '3px' }} /> Clear
                        </button>
                    </div>
                    <div class="col-lg-12 p-3 pb-4 ">
                        <div class="row m-0 w-100 mt-0 d-flex align-items-end ">
                            {fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin' && (
                                <div class="col-lg-12 p-0 mb-3">
                                    <div class="row m-0 w-100"></div>
                                    <div class="mr-2">
                                        <span>Company</span>
                                        <div class="mt-1" style={{ width: '220px' }}>
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
                                </div>
                            )}
                            <div class="col-lg-10 p-0">
                                <div class="row m-0 w-100">
                                    <div class=" col-lg-3 ">
                                        <span>From</span>
                                        <div class="mt-1" style={{ width: '100%' }}>
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
                                    <div class=" col-lg-3">
                                        <span>To</span>
                                        <div class="mt-1" style={{ width: '100%' }}>
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
                                    <div class=" col-lg-3">
                                        <span>Group</span>
                                        <div class="mt-1" style={{ width: '100%' }}>
                                            <Select
                                                options={FetchGroups?.data?.data?.data}
                                                value={FetchGroups?.data?.data?.data?.filter((option) => option.id == filter?.group_id)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                styles={tabledefaultstyles}
                                                onChange={(option) => {
                                                    setfilter({ ...filter, group_id: option.id });
                                                    setfilterroute({ ...filterroute, group_id: '&groupid=' + option.id });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class=" col-lg-3 ">
                                        <span>Phase</span>
                                        <div class="mt-1" style={{ width: '100%' }}>
                                            <Select
                                                options={FetchPhases?.data?.data?.data}
                                                value={FetchPhases?.data?.data?.data?.filter((option) => option.id == filter?.phase_id)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                styles={tabledefaultstyles}
                                                onChange={(option) => {
                                                    setfilter({ ...filter, phase_id: option.id });
                                                    setfilterroute({ ...filterroute, phase_id: '&phaseid=' + option.id });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {leadsource && FetchCampaigns?.isSuccess && !FetchCampaigns?.isFetching && (
                                <div class="col-lg-12 my-3  p-0">
                                    <div class="row m-0 w-100">
                                        <div class="mr-2">
                                            <span>Platform</span>
                                            <div class="mt-1" style={{ width: '220px' }}>
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
                                                    defaultValue={[
                                                        { label: 'All', value: 'all' },
                                                        { label: 'Instagram', value: 'ig' },
                                                        { label: 'Facebook', value: 'fb' },
                                                        { label: 'Snapchat', value: 'snapchat' },
                                                        { label: 'Tiktok', value: 'tiktok' },
                                                    ].filter((option) => option.value == filter?.platform)}
                                                    onChange={(option) => {
                                                        setfilter({ ...filter, platform: option.value });
                                                        setfilterroute({ ...filterroute, platform: '&platform=' + option.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbycampaigns != undefined && (
                                            <div class="mr-2">
                                                <span>Campaigns</span>
                                                <div class="mt-1" style={{ width: '220px' }}>
                                                    <Select
                                                        options={[{ meta_campaign_name: 'All', meta_campaign_id: 'all' }, ...FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbycampaigns]}
                                                        value={FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbycampaigns?.filter(
                                                            (option) => option.meta_campaign_id == filter?.meta_campaign_id,
                                                        )}
                                                        getOptionLabel={(option) => option.meta_campaign_name}
                                                        getOptionValue={(option) => option.meta_campaign_id}
                                                        styles={tabledefaultstyles}
                                                        onChange={(option) => {
                                                            setfilter({ ...filter, meta_campaign_id: option.meta_campaign_id });
                                                            setfilterroute({ ...filterroute, meta_campaign_id: '&campaignid=' + option.meta_campaign_id });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {filter?.meta_campaign_id != 'all' && FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyadsets != undefined && (
                                            <div class="mr-2">
                                                <span>Adset</span>
                                                <div class="mt-1" style={{ width: '220px' }}>
                                                    <Select
                                                        options={[
                                                            { meta_adset_name: 'All', meta_adset_id: 'all' },
                                                            ...FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyadsets.filter((option) => option.meta_campaign_id == filter?.meta_campaign_id),
                                                        ]}
                                                        value={FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyadsets?.filter((option) => option.meta_adset_id == filter?.meta_adset_id)}
                                                        getOptionLabel={(option) => option.meta_adset_name}
                                                        getOptionValue={(option) => option.meta_adset_id}
                                                        styles={tabledefaultstyles}
                                                        onChange={(option) => {
                                                            setfilter({ ...filter, meta_adset_id: option.meta_adset_id });
                                                            setfilterroute({ ...filterroute, meta_adset_id: '&adsetid=' + option.meta_adset_id });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {filter?.meta_adset_id != 'all' && FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyads != undefined && (
                                            <div class="mr-2">
                                                <span>Ad</span>
                                                <div class="mt-1" style={{ width: '220px' }}>
                                                    <Select
                                                        options={[
                                                            { meta_ad_name: 'All', meta_ad_id: 'all' },
                                                            ...FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyads.filter((option) => option.meta_adset_id == filter?.meta_adset_id),
                                                        ]}
                                                        value={FetchCampaigns?.data?.data?.meta_campaigns?.leadsgroupedbyads?.filter((option) => option.meta_ad_id == filter?.meta_ad_id)}
                                                        getOptionLabel={(option) => option.meta_ad_name}
                                                        getOptionValue={(option) => option.meta_ad_id}
                                                        styles={tabledefaultstyles}
                                                        onChange={(option) => {
                                                            setfilter({ ...filter, meta_ad_id: option.meta_ad_id });
                                                            setfilterroute({ ...filterroute, meta_ad_id: '&adid=' + option.meta_ad_id });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div class="col-lg-2 p-0 allcentered">
                                {' '}
                                <button
                                    style={{ height: '35px' }}
                                    class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                    onClick={() => {
                                        if (leadsource) {
                                            history.push({
                                                pathname: '/leads',
                                                search:
                                                    filterroute.company_id +
                                                    filterroute.from_date +
                                                    filterroute.to_date +
                                                    filterroute.group_id +
                                                    filterroute.group_id +
                                                    filterroute.phase_id +
                                                    filterroute.platform +
                                                    filterroute.meta_campaign_id +
                                                    filterroute.meta_adset_id +
                                                    filterroute.meta_ad_id +
                                                    '&leadsource=true' +
                                                    '&phasecolor=' +
                                                    phasecolor,
                                            });
                                        } else {
                                            history.push({
                                                pathname: '/leads',
                                                search:
                                                    filterroute.company_id +
                                                    filterroute.from_date +
                                                    filterroute.to_date +
                                                    filterroute.group_id +
                                                    filterroute.group_id +
                                                    filterroute.phase_id +
                                                    filterroute.platform +
                                                    filterroute.meta_campaign_id +
                                                    filterroute.meta_adset_id +
                                                    filterroute.meta_ad_id +
                                                    '&phasecolor=' +
                                                    phasecolor,
                                            });
                                        }
                                    }}
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ zIndex: -1 }} class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {FetchLeads?.data?.data?.total}</span>
                        </p>
                    </div>

                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        <div
                            onClick={() => {
                                var temp = phasecolor == 'true' || phasecolor == true ? false : true;
                                if (leadsource) {
                                    history.push({
                                        pathname: '/leads',
                                        search:
                                            filterroute.company_id +
                                            filterroute.from_date +
                                            filterroute.to_date +
                                            filterroute.group_id +
                                            filterroute.group_id +
                                            filterroute.phase_id +
                                            filterroute.platform +
                                            filterroute.meta_campaign_id +
                                            filterroute.meta_adset_id +
                                            filterroute.meta_ad_id +
                                            '&leadsource=true' +
                                            '&phasecolor=' +
                                            temp,
                                    });
                                } else {
                                    history.push({
                                        pathname: '/leads',
                                        search:
                                            filterroute.company_id +
                                            filterroute.from_date +
                                            filterroute.to_date +
                                            filterroute.group_id +
                                            filterroute.group_id +
                                            filterroute.phase_id +
                                            filterroute.platform +
                                            filterroute.meta_campaign_id +
                                            filterroute.meta_adset_id +
                                            filterroute.meta_ad_id +
                                            '&phasecolor=' +
                                            temp,
                                    });
                                }
                            }}
                            class="mx-2"
                        >
                            <label className={`${generalstyles.checkbox} ${checkboxstyles.checkbox} ` + ' d-flex mb-0 '}>
                                <input type="checkbox" checked={phasecolor == 'false' || phasecolor == false ? false : true} className={checkboxstyles.checkboxinputstyles + ' mt-auto mb-auto '} />
                                <svg viewBox="0 0 21 21" className={checkboxstyles.svgstyles + ' h-100 '}>
                                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                </svg>

                                <p className={`` + ' ml-2 mb-0 cursor-pointer text-capitalize wordbreak mr-2'} style={{ fontSize: '13px' }}>
                                    Show phase color
                                </p>
                            </label>
                        </div>
                        <div
                            onClick={() => {
                                if (!leadsource) {
                                    history.push({
                                        pathname: '/leads',
                                        search:
                                            filterroute.company_id +
                                            filterroute.from_date +
                                            filterroute.to_date +
                                            filterroute.group_id +
                                            filterroute.group_id +
                                            filterroute.phase_id +
                                            filterroute.platform +
                                            filterroute.meta_campaign_id +
                                            filterroute.meta_adset_id +
                                            filterroute.meta_ad_id +
                                            '&leadsource=true' +
                                            '&phasecolor=' +
                                            phasecolor,
                                    });
                                } else {
                                    history.push({
                                        pathname: '/leads',
                                        search:
                                            filterroute.company_id +
                                            filterroute.from_date +
                                            filterroute.to_date +
                                            filterroute.group_id +
                                            filterroute.group_id +
                                            filterroute.phase_id +
                                            filterroute.platform +
                                            filterroute.meta_campaign_id +
                                            filterroute.meta_adset_id +
                                            filterroute.meta_ad_id +
                                            '&phasecolor=' +
                                            phasecolor,
                                    });
                                }
                            }}
                            // class="col-lg-6 mb-2 p-0"
                        >
                            <label className={`${generalstyles.checkbox} ${checkboxstyles.checkbox} ` + ' d-flex mb-0 '}>
                                <input type="checkbox" checked={leadsource == 'false' || leadsource == false ? false : true} className={checkboxstyles.checkboxinputstyles + ' mt-auto mb-auto '} />
                                <svg viewBox="0 0 21 21" className={checkboxstyles.svgstyles + ' h-100 '}>
                                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                </svg>

                                <p className={`` + ' ml-2 mb-0 cursor-pointer text-capitalize wordbreak mr-2'} style={{ fontSize: '13px' }}>
                                    Show lead properties
                                </p>
                            </label>
                        </div>
                        {/* <button
                        class=" bg-secondaryhover avenirmedium allcentered mr-2 "
                        style={{
                            width: '20vh',
                            color: 'white',
                            fontSize: '1.8vh',
                            padding: '1.2vh',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '10px',
                        }}
                        onClick={() => {
                            setleadpayload({
                                functype: 'add',
                                id: 'add',
                                leadedists: '',
                                fname: '',
                                lname: '',
                                phonenumber: '',
                                email: '',
                                company_id: '',
                            });
                            setopenModal(true);
                        }}
                    >
                        Add Lead
                    </button> */}

                        {/* <button
                        disabled={buttonClicked}
                        style={{
                            width: '20vh',
                            color: 'white',
                            fontSize: '1.8vh',
                            padding: '1.2vh',
                            backgroundColor: 'var(--info)',
                            borderRadius: '10px',
                        }}
                        onClick={async () => {
                            setbuttonClicked(true);
                            const axiosheaders = {
                                'Content-Type': 'multipart/form-data',
                            };
                            axios({
                                url: serverbaselink + '/api/userprofiles/exportusers',
                                method: 'GET',
                                responseType: 'blob',
                                headers: axiosheaders,
                            })
                                .then((response) => {
                                    if (response?.data != undefined) {
                                        // create file link in browser's memory
                                        const href = URL.createObjectURL(response.data);

                                        // create "a" HTML element with href to file & click
                                        const link = document.createElement('a');
                                        link.href = href;
                                        link.setAttribute('download', 'users.xlsx'); //or any other extension
                                        document.body.appendChild(link);
                                        link.click();

                                        // clean up "a" element & remove ObjectURL
                                        document.body.removeChild(link);
                                        URL.revokeObjectURL(href);
                                        setbuttonClicked(false);
                                    }
                                    // setisexportloading(false);
                                })
                                .catch((error) => {
                                    console.log(error);
                                    NotificationManager.error('', 'Error');
                                    setbuttonClicked(false);
                                });
                        }}
                    >
                        {!buttonClicked && <span>{lang.export}</span>}

                        {buttonClicked && <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />}
                    </button> */}
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-0 pt-0 mb-2" />
                    </div>

                    <div class="col-lg-12 p-0">
                        <div class="row m-0 py-2 pb-3 w-100 d-flex justify-content-between align-items-center">
                            {selectedusers?.length != FetchLeads?.data?.data?.data?.length && (
                                <div
                                    class="text-primaryhover"
                                    style={{ textDecoration: 'underline' }}
                                    onClick={() => {
                                        var tempselectedleads = [];
                                        FetchLeads?.data?.data?.data?.forEach(function (item) {
                                            tempselectedleads.push(item?.id);
                                        });
                                        setselectedusers([...tempselectedleads]);
                                    }}
                                >
                                    Select all
                                </div>
                            )}
                            {selectedusers?.length == FetchLeads?.data?.data?.data?.length && (
                                <div
                                    class="text-primaryhover"
                                    style={{ textDecoration: 'underline' }}
                                    onClick={() => {
                                        setselectedusers([]);
                                    }}
                                >
                                    Deselect all
                                </div>
                            )}
                            <div style={{ width: '220px' }}>
                                <div class="">
                                    <div>
                                        <Select
                                            options={[
                                                { label: 'Change phase', value: 'phase' },
                                                { label: 'Change group', value: 'group' },
                                                { label: 'Change lead status', value: 'lead' },
                                            ]}
                                            styles={tabledefaultstyles}
                                            onChange={(option) => {
                                                setchangemodal({ open: true, type: option.value });
                                                // props?.setcallpayload({ ...props?.callpayload, leadstatus: option.value });
                                                // var temp = {};
                                                // temp.leadid_arr = [props?.callpayload?.lead_id];
                                                // temp.lead_status = option?.value;
                                                // Updateleadstatus?.mutate(temp);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxHeight: '600px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        {FetchLeads.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}

                        {!FetchLeads.isFetching && FetchLeads.isSuccess && (
                            <>
                                {FetchLeads?.data?.data?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Leads
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {FetchLeads?.data?.data?.data?.length != 0 && (
                                    <table className={'table mt-2'}>
                                        {/* <thead className="">
                                        <th style={{ maxWidth: '150px', minWidth: '150px' }}>Actions</th>

                                        <th>#</th>

                                        {fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin' && (
                                            <th style={{ maxWidth: '160px', minWidth: '160px' }}>Company</th>
                                        )}
                                        {leadsource && <th style={{ maxWidth: '400px', minWidth: '400px' }}>Campaign Details</th>}
                                        <th>Calls</th>
                                    </thead> */}

                                        <tbody>
                                            {FetchLeads?.data?.data?.data?.map((item, index) => {
                                                var isleadselected = 'Not Selected';
                                                var selectedindexvalue = null;
                                                selectedusers.forEach(function (selecteditem, selectedindex) {
                                                    if (selecteditem == item?.id) {
                                                        isleadselected = 'Selected';
                                                        selectedindexvalue = selectedindex;
                                                    }
                                                });
                                                return (
                                                    <tr
                                                        style={{
                                                            color:
                                                                phasecolor == 'true' || phasecolor == true
                                                                    ? item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.color
                                                                    : '#6b7280',
                                                        }}
                                                    >
                                                        <td style={{ maxWidth: '75px', minWidth: '75px' }}>
                                                            <div class="row m-0 w-100 ">
                                                                <div class="col-lg-12 allcentered p-0 d-flex align-items-center">
                                                                    <label className={`${generalstyles.checkbox} ${checkboxstyles.checkbox} ` + ' d-flex mb-1 mr-1'}>
                                                                        <input
                                                                            checked={isleadselected == 'Selected'}
                                                                            onChange={(e) => {
                                                                                e.stopPropagation();
                                                                                var tempselectedusers = [...selectedusers];
                                                                                if (isleadselected == 'Selected') {
                                                                                    isleadselected = 'Not Selected';

                                                                                    if (selectedindexvalue != null) {
                                                                                        tempselectedusers.splice(selectedindexvalue, 1);
                                                                                    }
                                                                                } else {
                                                                                    tempselectedusers.push(item?.id);

                                                                                    isleadselected = 'Selected';
                                                                                }
                                                                                setselectedusers([...tempselectedusers]);
                                                                            }}
                                                                            type="checkbox"
                                                                            // checked={officepayload.headquarter == 1 ? true : false}
                                                                            className={checkboxstyles.checkboxinputstyles + ' mt-auto mb-auto '}
                                                                        />
                                                                        <svg viewBox="0 0 21 21" className={checkboxstyles.svgstyles + ' h-100 '}>
                                                                            <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                        </svg>
                                                                    </label>
                                                                    <button
                                                                        onClick={() => {
                                                                            var temp = { ...callpayload };
                                                                            temp.functype = 'add';
                                                                            temp.lead_id = item.id;
                                                                            temp.duration = '';
                                                                            temp.notes = '';
                                                                            temp.status = '';
                                                                            temp.lead_feilds = item?.lead_feilds;
                                                                            temp.phaseaction = item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.phaseaction;
                                                                            temp.leadstatus = item?.leadstatus;
                                                                            temp.phase_id = item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.id;
                                                                            temp.group_id = item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.id;
                                                                            setcallpayload({ ...temp });
                                                                            setopencallModal(true);
                                                                        }}
                                                                        class="text-primary text-primaryhover p-0 mx-1"
                                                                        style={{ textDecoration: 'underline' }}
                                                                    >
                                                                        <MdAddIcCall size={17} />
                                                                    </button>
                                                                    <Dropdown>
                                                                        <Dropdown.Toggle>
                                                                            <button class="text-success text-successhover p-0" style={{ textDecoration: 'underline' }}>
                                                                                <MdOutlineMoreVert size={18} />
                                                                            </button>
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu>
                                                                            <Dropdown.Item
                                                                                onClick={() => {
                                                                                    var temp = { ...dealspayload };
                                                                                    temp.functype = 'add';
                                                                                    temp.lead_id = item.id;
                                                                                    temp.value = '';
                                                                                    temp.notes = '';
                                                                                    temp.quantity = '';
                                                                                    temp.totalvalue = '';
                                                                                    temp.lead_feilds = item?.lead_feilds;

                                                                                    setdealspayload({ ...temp });
                                                                                    setdealsmodal(true);
                                                                                }}
                                                                            >
                                                                                Add Deal
                                                                            </Dropdown.Item>
                                                                            <Dropdown.Item
                                                                                onClick={() => {
                                                                                    var temp = { ...meetingfolowuppayload };
                                                                                    temp.functype = 'add';
                                                                                    temp.lead_id = item.id;
                                                                                    temp.time = '';
                                                                                    temp.notes = '';
                                                                                    temp.date = '';

                                                                                    temp.lead_feilds = item?.lead_feilds;
                                                                                    temp.phase_id = item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.id;
                                                                                    temp.group_id = item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.id;
                                                                                    setmeetingfolowuppayload({ ...temp });
                                                                                    setmeetingfolowupmodal({ open: true, type: 'meeting' });
                                                                                }}
                                                                            >
                                                                                Add Meeting
                                                                            </Dropdown.Item>
                                                                            <Dropdown.Item
                                                                                onClick={() => {
                                                                                    var temp = { ...meetingfolowuppayload };
                                                                                    temp.functype = 'add';
                                                                                    temp.lead_id = item.id;
                                                                                    temp.time = '';
                                                                                    temp.notes = '';
                                                                                    temp.date = '';
                                                                                    temp.followupstatus = '';
                                                                                    temp.priority = '';
                                                                                    temp.lead_feilds = item?.lead_feilds;
                                                                                    temp.phase_id = item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.id;
                                                                                    temp.group_id = item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.id;
                                                                                    setmeetingfolowuppayload({ ...temp });
                                                                                    setmeetingfolowupmodal({ open: true, type: 'followup' });
                                                                                }}
                                                                            >
                                                                                Add Followup
                                                                            </Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </div>
                                                                <div class="col-lg-12 allcentered p-0"></div>
                                                            </div>
                                                        </td>
                                                        <td style={{ maxWidth: '150px', minWidth: '150px' }}>
                                                            <div class="row m-0 w-100">
                                                                <div class="col-lg-12 p-0 d-flex justify-content-center ">
                                                                    <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                                                </div>
                                                                <div style={{ fontSize: '10px' }} class="col-lg-12 p-0 d-flex justify-content-center ">
                                                                    <p className={' m-0 p-0 wordbreak '}>{dateformatter(item.created_at)}</p>
                                                                </div>

                                                                <div class="col-lg-12 p-0 d-flex justify-content-center ">
                                                                    <p className={' m-0 p-0 wordbreak '}>
                                                                        {' '}
                                                                        <div class="col-lg-12 p-0 d-flex justify-content-center ">
                                                                            <div class="row m-0 w-100 d-flex justify-content-center ">
                                                                                <div class="col-lg-12 d-flex justify-content-center text-capitalize">
                                                                                    {item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length != 0 &&
                                                                                        item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name != undefined &&
                                                                                        item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name != null && (
                                                                                            <>
                                                                                                <span
                                                                                                    style={{
                                                                                                        color:
                                                                                                            item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length !=
                                                                                                                0 &&
                                                                                                            item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name !=
                                                                                                                undefined &&
                                                                                                            item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name != null
                                                                                                                ? item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.color
                                                                                                                : '#a0a0a0',
                                                                                                        fontSize:
                                                                                                            item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length !=
                                                                                                                0 &&
                                                                                                            item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name !=
                                                                                                                undefined &&
                                                                                                            item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name != null
                                                                                                                ? ''
                                                                                                                : '12px',
                                                                                                    }}
                                                                                                    class=" mr-1"
                                                                                                >
                                                                                                    {item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length != 0 &&
                                                                                                    item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name != undefined &&
                                                                                                    item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name != null
                                                                                                        ? item?.phases_lead_lead_junc[item?.phases_lead_lead_junc?.length - 1]?.phase?.name
                                                                                                        : '-'}
                                                                                                </span>
                                                                                                {item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                                                    item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                                                    item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != null && <>,</>}
                                                                                            </>
                                                                                        )}
                                                                                    {item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                                        item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                                        item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != null && (
                                                                                            <>
                                                                                                <span
                                                                                                    style={{
                                                                                                        color:
                                                                                                            item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name?.length !=
                                                                                                                0 &&
                                                                                                            item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name !=
                                                                                                                undefined &&
                                                                                                            item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != null
                                                                                                                ? ''
                                                                                                                : '#a0a0a0',
                                                                                                        fontSize:
                                                                                                            item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name?.length !=
                                                                                                                0 &&
                                                                                                            item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name !=
                                                                                                                undefined &&
                                                                                                            item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != null
                                                                                                                ? ''
                                                                                                                : '12px',
                                                                                                    }}
                                                                                                    class=" mr-1"
                                                                                                >
                                                                                                    {item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                                                    item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                                                    item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name != null
                                                                                                        ? item?.group_lead_lead_junc[item?.group_lead_lead_junc?.length - 1]?.group?.name
                                                                                                        : '-'}
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin' && (
                                                            <td style={{ maxWidth: '160px', minWidth: '160px' }}>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.company?.companyname}</p>
                                                            </td>
                                                        )}

                                                        {leadsource && (
                                                            <td style={{ minWidth: '400px', maxWidth: '400px' }} class=" d-flex justify-content-start">
                                                                <div class="co-lg-12 p-0 d-flex justify-content-start ">
                                                                    <div class="row m-0 w-100 d-flex justify-content-start ">
                                                                        <div class="col-lg-12 d-flex justify-content-start text-capitalize">
                                                                            <span style={{ fontWeight: 700 }} class=" mr-1">
                                                                                Platform:
                                                                            </span>
                                                                            {item?.meta_platform == 'ig' ? 'Instagram' : item?.meta_platform == 'fb' ? 'Facebook' : item?.meta_platform}
                                                                        </div>
                                                                        <div class="col-lg-12 d-flex justify-content-start text-capitalize">
                                                                            <span style={{ fontWeight: 700 }} class=" mr-1">
                                                                                Campaign:
                                                                            </span>
                                                                            {item?.meta_campaign_name}
                                                                        </div>
                                                                        <div class="col-lg-12 d-flex justify-content-start text-capitalize">
                                                                            <span style={{ fontWeight: 700 }} class=" mr-1">
                                                                                Adset:
                                                                            </span>
                                                                            {item?.meta_adset_name}
                                                                        </div>
                                                                        <div class="col-lg-12 d-flex justify-content-start text-capitalize">
                                                                            <span style={{ fontWeight: 700 }} class=" mr-1">
                                                                                Ad:
                                                                            </span>
                                                                            {item?.meta_ad_name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                        <td style={{ maxWidth: '210px', minWidth: '210px' }}>
                                                            <div style={{ cursor: 'pointer' }} className="row m-0 w-100 d-flex allcentered">
                                                                <div className="col-lg-12 col-sm-12 col-md-12 ">
                                                                    <div class="row m-0 w-100 d-flex justify-content-center">
                                                                        <p
                                                                            onClick={() => {
                                                                                setchosentab('Calls');
                                                                                setcalls(item);
                                                                                setcallsmodal(true);
                                                                            }}
                                                                            className={' mr-3 mb-0 mt-0 ml-0 p-0 wordbreak d-flex justify-content-start text-capitalize '}
                                                                            style={{
                                                                                color: item?.lead_calls?.length == 0 ? '#a0a0a0' : 'orange',
                                                                                fontSize: item?.lead_calls?.length == 0 ? '11px' : '12px',
                                                                            }}
                                                                        >
                                                                            {item?.lead_calls?.length == 0 ? 'No Calls yet' : item?.lead_calls?.length + ' calls'}
                                                                        </p>
                                                                        <p
                                                                            onClick={() => {
                                                                                setchosentab('Followups');
                                                                                setcalls(item);
                                                                                setcallsmodal(true);
                                                                            }}
                                                                            className={' mr-3 mb-0 mt-0 ml-0 p-0 wordbreak d-flex justify-content-start text-capitalize '}
                                                                            style={{ color: item?.lead_followup?.length == 0 ? '#a0a0a0' : 'blue' }}
                                                                        >
                                                                            {item?.lead_followup?.length == 0 ? '' : item?.lead_followup?.length + ' Followups'}
                                                                        </p>
                                                                        <p
                                                                            onClick={() => {
                                                                                setchosentab('Meetings');
                                                                                setcalls(item);
                                                                                setcallsmodal(true);
                                                                            }}
                                                                            className={' mr-0 mb-0 mt-0 ml-0 p-0 wordbreak d-flex justify-content-start text-capitalize '}
                                                                            style={{ color: item?.lead_meetings?.length == 0 ? '#a0a0a0' : 'purple' }}
                                                                        >
                                                                            {item?.lead_meetings?.length == 0 ? '' : item?.lead_meetings?.length + ' Meetings'}
                                                                        </p>
                                                                    </div>
                                                                    {item?.lead_calls?.length != 0 && (
                                                                        <div
                                                                            onClick={() => {
                                                                                setchosentab('Calls');
                                                                                setcalls(item);
                                                                                setcallsmodal(true);
                                                                            }}
                                                                            style={{ height: '30px', overflowY: 'scroll' }}
                                                                            className="col-lg-12 col-sm-12 col-md-12 p-0 scrollmenuclasssubscrollbar"
                                                                        >
                                                                            {item?.lead_calls?.map(function (callitem, inde) {
                                                                                return (
                                                                                    <p class="text-capitalize mb-2">
                                                                                        <span style={{ fontWeight: 600, color: 'var(--info)', fontSize: '12px' }}>
                                                                                            {callitem.status == 'active'
                                                                                                ? 'Active'
                                                                                                : callitem.status == 'noanswer'
                                                                                                ? 'No Answer'
                                                                                                : callitem.status == 'userbusy'
                                                                                                ? 'User busy'
                                                                                                : 'No Service'}
                                                                                        </span>{' '}
                                                                                        <span style={{ fontSize: '10px' }}>{dateformatter(callitem.updated_at)}</span>
                                                                                    </p>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {item?.lead_feilds?.length != 0 && item?.lead_feilds != undefined && item?.lead_feilds != null && (
                                                            <>
                                                                {item?.lead_feilds?.map((key, keyindex) => {
                                                                    return (
                                                                        <td style={{ maxWidth: '200px', minWidth: '200px' }} class=" p-0 d-flex  w-100 justify-content-start align-items-start">
                                                                            <div class="col-lg-12 p-0 d-flex justify-content-start ">
                                                                                <div class="row m-0 w-100 d-flex justify-content-start ">
                                                                                    <div
                                                                                        style={{
                                                                                            padding: '0px',
                                                                                            background: 'white',
                                                                                            fontSize: '12px',
                                                                                            // fontWeight: 600,
                                                                                            boxShadow: 'rgb(215, 213, 210) -1px 0px 0px inset, rgb(215, 213, 210)  0px -1px 0px inset',
                                                                                            borderTop: '1px solid rgb(215, 213, 210)',
                                                                                        }}
                                                                                        class="col-lg-12 d-flex allcentered text-capitalize text-primary py-1"
                                                                                    >
                                                                                        {key?.name}
                                                                                    </div>
                                                                                    <div
                                                                                        class="col-lg-12 allcentered py-1 scrollmenuclasssubscrollbar"
                                                                                        style={{ maxHeight: '40px', overflow: 'scroll', fontWeight: 400 }}
                                                                                    >
                                                                                        {key?.value}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* <p className={' m-0 p-0 wordbreak '}> </p> */}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}
                    </div>
                    <div class="mt-3">
                        <Pagespaginatecomponent
                            totaldatacount={FetchLeads?.data?.data?.total}
                            numofitemsperpage={FetchLeads?.data?.data?.per_page}
                            pagenumbparams={FetchLeads?.data?.data?.current_page}
                            nextpagefunction={(nextpage) => {
                                if (leadsource) {
                                    history.push({
                                        pathname: '/leads',
                                        search:
                                            filterroute.company_id +
                                            filterroute.from_date +
                                            filterroute.to_date +
                                            filterroute.group_id +
                                            filterroute.group_id +
                                            filterroute.phase_id +
                                            filterroute.platform +
                                            filterroute.meta_campaign_id +
                                            filterroute.meta_adset_id +
                                            filterroute.meta_ad_id +
                                            '&leadsource=true' +
                                            '&phasecolor=' +
                                            phasecolor +
                                            '&page=' +
                                            nextpage,
                                    });
                                } else {
                                    history.push({
                                        pathname: '/leads',
                                        search:
                                            filterroute.company_id +
                                            filterroute.from_date +
                                            filterroute.to_date +
                                            filterroute.group_id +
                                            filterroute.group_id +
                                            filterroute.phase_id +
                                            filterroute.platform +
                                            filterroute.meta_campaign_id +
                                            filterroute.meta_adset_id +
                                            filterroute.meta_ad_id +
                                            '&phasecolor=' +
                                            phasecolor +
                                            '&page=' +
                                            nextpage,
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <DealInfo openModal={dealsmodal} setopenModal={setdealsmodal} dealspayload={dealspayload} setdealspayload={setdealspayload} FetchDeals={FetchLeads} />
            <LeadInfo openModal={openModal} setopenModal={setopenModal} leadpayload={leadpayload} setleadpayload={setleadpayload} FetchLeads={FetchLeads} />
            <CallInfo
                openModal={opencallModal}
                setopenModal={setopencallModal}
                callpayload={callpayload}
                setcallpayload={setcallpayload}
                FetchLeads={FetchLeads}
                dealsmodal={dealsmodal}
                setdealsmodal={setdealsmodal}
                dealspayload={dealspayload}
                setdealspayload={setdealspayload}
                setmeetingfolowupmodal={setmeetingfolowupmodal}
                meetingfolowupmodal={meetingfolowupmodal}
                setmeetingfolowuppayload={setmeetingfolowuppayload}
                meetingfolowuppayload={meetingfolowuppayload}
            />
            <MeetingandFollowup
                openModal={meetingfolowupmodal}
                setopenModal={setmeetingfolowupmodal}
                callpayload={meetingfolowuppayload}
                setcallpayload={setmeetingfolowuppayload}
                FetchLeads={FetchLeads}
            />

            <Modal
                show={changemodal?.open}
                onHide={() => {
                    setchangemodal({ open: false, type: '', optionid: '' });
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-12 col-md-12 col-sm-12 d-flex align-items-center justify-content-end p-0">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setchangemodal({ open: false, type: '', optionid: '' });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {changemodal?.type == 'phase' && !FetchPhases?.isFetching && FetchPhases?.isSuccess && (
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-2" style={{ fontSize: '12px' }}>
                                Change Phase
                            </div>
                            <div class="col-lg-12 p-0 mb-3">
                                <Select
                                    options={[{ name: 'Remove phase', id: null }, ...FetchPhases?.data?.data?.data]}
                                    value={FetchPhases?.data?.data?.data?.filter((option) => option.id == changemodal?.optionid)}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    styles={tabledefaultstyles}
                                    onChange={(option) => {
                                        setchangemodal({ ...changemodal, optionid: option?.id });
                                    }}
                                />
                            </div>
                            <div class="col-lg-12 my-3 allcentered p-0">
                                <button
                                    disabled={AssigntoPhaseMutation?.isLoading}
                                    class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                    onClick={() => {
                                        var temp = {};
                                        temp.assigntype = 'lead';
                                        temp.leadidarr = [...selectedusers];
                                        temp.phase_id = changemodal?.optionid;
                                        AssigntoPhaseMutation?.mutate(temp);
                                    }}
                                >
                                    {AssigntoPhaseMutation?.isLoading && <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />}
                                    {!AssigntoPhaseMutation?.isLoading && <>Change for {selectedusers?.length} Leads</>}
                                </button>
                            </div>
                        </div>
                    )}
                    {changemodal?.type == 'group' && FetchGroups?.isSuccess && !FetchGroups?.isFetching && (
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-2" style={{ fontSize: '12px' }}>
                                Change Group
                            </div>
                            <div class="col-lg-12 p-0 mb-3">
                                <Select
                                    options={[{ name: 'Remove group', id: null }, ...FetchGroups?.data?.data?.data]}
                                    value={FetchGroups?.data?.data?.data?.filter((option) => option.id == changemodal?.optionid)}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    styles={tabledefaultstyles}
                                    onChange={(option) => {
                                        setchangemodal({ ...changemodal, optionid: option?.id });
                                    }}
                                />
                            </div>
                            <div class="col-lg-12 my-3 allcentered p-0">
                                <button
                                    disabled={AssigntoGroupMutation?.isLoading}
                                    class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                    onClick={() => {
                                        var temp = {};
                                        temp.assigntype = 'lead';
                                        temp.leadidarr = [...selectedusers];

                                        temp.group_id = changemodal?.optionid;
                                        AssigntoGroupMutation?.mutate(temp);
                                    }}
                                >
                                    {AssigntoGroupMutation?.isLoading && <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />}
                                    {!AssigntoGroupMutation?.isLoading && <>Change for {selectedusers?.length} Leads</>}
                                </button>
                            </div>
                        </div>
                    )}
                    {changemodal?.type == 'lead' && (
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-2" style={{ fontSize: '12px' }}>
                                Change Lead status
                            </div>
                            <div class="col-lg-12 p-0 mb-3">
                                <Select
                                    options={[
                                        { label: 'No status', value: null },
                                        { label: 'Qualified, Interested', value: 'Qualified, Interested' },
                                        { label: 'Qualified, Potential Lead', value: 'Qualified, Potential Lead' },
                                        { label: 'No Answer', value: 'No Answer' },
                                        { label: 'Unqualified', value: 'Unqualified' },
                                    ]}
                                    value={[
                                        { label: 'No status', value: null },
                                        { label: 'Qualified, Interested', value: 'Qualified, Interested' },
                                        { label: 'Qualified, Potential Lead', value: 'Qualified, Potential Lead' },
                                        { label: 'No Answer', value: 'No Answer' },
                                        { label: 'Unqualified', value: 'Unqualified' },
                                    ].filter((option) => option.value == changemodal?.optionid)}
                                    styles={tabledefaultstyles}
                                    onChange={(option) => {
                                        setchangemodal({ ...changemodal, optionid: option?.value });
                                    }}
                                />
                            </div>
                            <div class="col-lg-12 my-3 allcentered p-0">
                                <button
                                    disabled={Updateleadstatus?.isLoading}
                                    class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                    onClick={() => {
                                        var temp = {};
                                        temp.leadid_arr = [...selectedusers];
                                        temp.lead_status = changemodal?.optionid;
                                        Updateleadstatus?.mutate(temp);
                                    }}
                                >
                                    {Updateleadstatus?.isLoading && <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />}
                                    {!Updateleadstatus?.isLoading && <>Change for {selectedusers?.length} Leads</>}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <Modal
                show={callsmodal}
                onHide={() => {
                    setcallsmodal(false);
                }}
                centered
                size={'xl'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">
                                {array?.map((item, index) => {
                                    var active = false;
                                    if (item == chosentab) {
                                        active = true;
                                    }
                                    return (
                                        <span
                                            onClick={() => {
                                                setchosentab(item);
                                            }}
                                            style={{
                                                transition: 'all 0.4s',
                                                marginInlineEnd: '10px',
                                                padding: '10px 20px',
                                                background: active ? 'var(--primary)' : 'lightgray',
                                                color: active ? 'white' : '',
                                                fontSize: '14px',
                                                borderRadius: '25px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {item}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setcallsmodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="col-lg-12 allcentered table_responsive  scrollmenuclasssubscrollbar p-2">
                        <table className={'table w-100'}>
                            {chosentab == 'Calls' && (
                                <>
                                    {calls?.lead_calls?.length != 0 && (
                                        <>
                                            <thead>
                                                <th>Status</th>
                                                <th>Notes</th>
                                                <th>Duration</th>
                                                <th>By</th>
                                                <th>Date</th>
                                            </thead>
                                            <tbody>
                                                {calls?.lead_calls?.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>
                                                                    {item?.status == 'active'
                                                                        ? 'Active'
                                                                        : item?.status == 'noanswer'
                                                                        ? 'No Answer'
                                                                        : item?.status == 'userbusy'
                                                                        ? 'User busy'
                                                                        : 'No Service'}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.notes}</p>
                                                            </td>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.duration}</p>
                                                            </td>

                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.user?.email}</p>
                                                            </td>

                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{dateformatter(item.created_at)}</p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </>
                                    )}
                                    {calls?.lead_calls?.length == 0 && <span class="col-lg-12 p-0 allcentered">No Calls</span>}
                                </>
                            )}
                            {chosentab == 'Meetings' && (
                                <>
                                    {calls?.lead_meetings?.length != 0 && (
                                        <>
                                            <thead>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Notes</th>
                                            </thead>
                                            <tbody>
                                                {calls?.lead_meetings?.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak text-capitalize '}>{item?.meetingstatus}</p>
                                                            </td>

                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.date}</p>
                                                            </td>

                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.time?.length == 0 || item?.time == null ? '-' : item?.time}</p>
                                                            </td>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.notes}</p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </>
                                    )}
                                    {calls?.lead_meetings?.length == 0 && <span class="col-lg-12 p-0 allcentered">No Meetings</span>}
                                </>
                            )}
                            {chosentab == 'Followups' && (
                                <>
                                    {calls?.lead_followup?.length != 0 && (
                                        <>
                                            <thead>
                                                <th>Status</th>
                                                <th>Priority</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Notes</th>
                                            </thead>
                                            <tbody>
                                                {calls?.lead_followup?.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak text-capitalize'}>{item?.followupstatus}</p>
                                                            </td>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak text-capitalize'}>{item?.priority}</p>
                                                            </td>

                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.date}</p>
                                                            </td>

                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.time?.length == 0 || item?.time == null ? '-' : item?.time}</p>
                                                            </td>
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak '}>{item?.notes}</p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </>
                                    )}
                                    {calls?.lead_followup?.length == 0 && <span class="col-lg-12 p-0 allcentered">No Followups</span>}
                                </>
                            )}
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Leads;
