import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import { tabledefaultstyles } from '../Generalfiles/selectstyles.js';

import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { useQuery } from 'react-query';
import { DateRangePicker } from 'rsuite';
// Icons
import { AiOutlineSearch } from 'react-icons/ai';
import { BiGridAlt } from 'react-icons/bi';
import { BsWindow } from 'react-icons/bs';
import Select, { components } from 'react-select';
import API from '../../../API/API.js';

import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import meta from './meta.png';
import snapchat from './snapchat.png';
import tiktok from './tiktok.png';

import { MdFolderSpecial, MdOutlineArrowForwardIos } from 'react-icons/md';
import { FaLayerGroup } from 'react-icons/fa';
import Multilinechart from './Multilinechart.js';
import Barchart from './Barchart.js';
import Piechart from './Piechart.js';
const { ValueContainer, Placeholder } = components;
const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } = DateRangePicker;

const PhasesAnalytics = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { filterLeadscontext, setpageactive_context, setpagetitle_context, fetchAuthorizationQueryContext, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchCompanies_API, FetchCampaignphasesinsights_API, FetchPhases_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [searchInput, setsearchInput] = useState('');
    const [id, setid] = useState('');
    const [allowfetch, setallowfetch] = useState(false);
    const [platforms, setplatforms] = useState([
        // { name: 'All', isselected: true, value: 'all', icon: <FaBorderAll size={18} class="mr-1" /> },
        { name: 'Meta', isselected: false, img: meta, value: 'meta' },
        { name: 'Tiktok', isselected: false, img: tiktok, value: 'tiktok' },
        { name: 'Snapchat', isselected: false, img: snapchat, value: 'snapchat' },
    ]);
    const [columnstiktok, setcolumnstiktok] = useState([
        { label: 'Leads', value: 'leads' },
        { label: 'Clicks', value: 'clicks' },
        { label: 'CPC', value: 'cpc', type: '%' },
        { label: 'CPM', value: 'cpm', type: '%' },
        { label: 'CTR', value: 'ctr', type: '%' },
        { label: 'Impressions', value: 'impressions' },
        { label: 'Video views', value: 'video_views' },
        { label: 'Video 25%', value: 'quartile_1' },
        { label: 'Video 50%', value: 'quartile_2' },
        { label: 'Video 70%', value: 'quartile_3' },
        { label: 'Video 100%', value: 'view_completion' },
        { label: 'Swipes', value: 'swipes' },
        { label: 'Reach', value: 'reach' },
        { label: 'Budget', value: 'spend' },
        { label: 'Created at', value: 'created_at', type: 'date' },
    ]);
    const [columnsmeta, setcolumnsmeta] = useState([
        { label: 'Leads', value: 'leads' },
        { label: 'Clicks', value: 'clicks' },
        { label: 'CPC', value: 'cpc', type: '%' },
        { label: 'CPM', value: 'cpm', type: '%' },
        { label: 'CTR', value: 'ctr', type: '%' },
        { label: 'Impressions', value: 'impressions' },
        { label: 'Video 25%', value: 'video_25' },
        { label: 'Video 50%', value: 'video_50' },
        { label: 'Video 70%', value: 'video_75' },
        { label: 'Video 100%', value: 'video_100' },
        { label: 'Reach', value: 'reach' },
        { label: 'Budget', value: 'spend' },
        { label: 'Created at', value: 'created_at', type: 'date' },
    ]);
    const [filterperformanefunnel, setfilterperformanefunnel] = useState({
        rankby: '',
        sort: 'desc',
    });

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
        platform: 'meta',
    });
    const [filtercampaigns, setfiltercampaigns] = useState({
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
        platform: 'meta',
    });

    const FetchCampaignphasesinsights = useQuery(
        ['FetchCampaignphasesinsights_API' + JSON.stringify(filtercampaigns) + filtercampaigns?.insight_type + filtercampaigns?.campaign_id + filtercampaigns?.adset_id],
        () => FetchCampaignphasesinsights_API({ filter: filtercampaigns, insight_type: filtercampaigns?.insight_type, campaign_id: filtercampaigns?.campaign_id, adset_id: filtercampaigns?.adset_id }),
        {
            keepPreviousData: true,
            staleTime: Infinity,
            enabled: allowfetch,
        },
    );
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchPhases = useQuery(['FetchPhases_API' + JSON.stringify(filterobj)], () => FetchPhases_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filtercompanies, setfiltercompanies] = useState({
        page: 1,
        search: '',
    });
    const [tabs, settabs] = useState([
        { name: 'Campaigns', status: false, icon: <MdFolderSpecial size={18} class="mr-2" /> },
        { name: 'Ad sets', status: false, icon: <BiGridAlt size={18} class="mr-2" /> },
        { name: 'Ads', status: false, icon: <BsWindow size={18} class="mr-2" /> },
    ]);
    const FetchCompanies = useQuery(['FetchCompanies_API' + JSON.stringify(filtercompanies)], () => FetchCompanies_API({ filter: filtercompanies }), {
        keepPreviousData: true,
        staleTime: Infinity,
        enabled: fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin',
    });

    const sortArrayByColumns = (array, columns) => {
        // Create a copy of the array to sort.
        const sortedArray = [...array];

        // Sort the array using the specified columns.

        sortedArray.sort((a, b) => {
            for (const column of columns) {
                var first = 0;
                var second = 0;
                var exist = false;
                var exist2 = false;
                var chosenindex = 0;
                var chosenindex2 = 0;
                a?.phases?.map((phase, phaseindex) => {
                    if (phase?.id == column) {
                        exist = true;
                        chosenindex = phaseindex;
                    }
                });
                b?.phases?.map((phase, phaseindex) => {
                    if (phase?.id == column) {
                        exist2 = true;
                        chosenindex2 = phaseindex;
                    }
                });

                first = exist ? parseInt(a?.phases[chosenindex]?.leadscount) : 0;
                second = exist2 ? parseInt(b?.phases[chosenindex2]?.leadscount) : 0;
                // Compare the values of the specified columns.
                if (parseInt(first) < parseInt(second)) return -1;
                if (parseInt(first) > parseInt(second)) return 1;

                return 0;
            }

            // If all of the specified column values are equal, return 0.
            return 0;
        });

        // Return the sorted array.
        return sortedArray;
    };
    useEffect(() => {
        setpageactive_context('/phasesanalytics');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';

        var company = filterLeadscontext?.company_id;
        var companyroute = '';
        var fromdate = '';
        var fromdateroute = '';
        var todate = '';
        var todateroute = '';
        var platform = 'meta';
        var platformroute = '';

        var campaignid = '';
        var insighttype = 'campaigns';
        var adsetid = '';

        if (queryParameters.get('adsetid') == undefined && queryParameters.get('campaignid') == undefined) {
            settabs([
                { name: 'Campaigns', status: true, icon: <MdFolderSpecial size={18} class="mr-2" /> },
                { name: 'Ad sets', status: false, icon: <BiGridAlt size={18} class="mr-2" /> },
                { name: 'Ads', status: false, icon: <BsWindow size={18} class="mr-2" /> },
            ]);
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
            var ll = new Date(fromdate);
        }
        if (queryParameters.get('todate') == undefined) {
        } else {
            todate = queryParameters.get('todate');
            todateroute = '&todate=' + queryParameters.get('todate');
            var lll = new Date(todate);
        }
        if (queryParameters.get('platform') == undefined) {
        } else {
            platform = queryParameters.get('platform');
            platformroute = '&platform=' + queryParameters.get('platform');
            if (platform == 'all') {
                setplatforms([
                    // { name: 'All', isselected: true, value: 'all' },
                    { name: 'Meta', isselected: false, img: meta, value: 'meta' },
                    { name: 'Tiktok', isselected: false, img: tiktok, value: 'tiktok' },
                    { name: 'Snapchat', isselected: false, img: snapchat, value: 'snapchat' },
                ]);
            } else if (platform == 'meta') {
                setplatforms([
                    // { name: 'All', isselected: false, value: 'all' },
                    { name: 'Meta', isselected: true, img: meta, value: 'meta' },
                    { name: 'Tiktok', isselected: false, img: tiktok, value: 'tiktok' },
                    { name: 'Snapchat', isselected: false, img: snapchat, value: 'snapchat' },
                ]);
            } else if (platform == 'tiktok') {
                setplatforms([
                    // { name: 'All', isselected: false, value: 'all' },
                    { name: 'Meta', isselected: false, img: meta, value: 'meta' },
                    { name: 'Tiktok', isselected: true, img: tiktok, value: 'tiktok' },
                    { name: 'Snapchat', isselected: false, img: snapchat, value: 'snapchat' },
                ]);
            } else if (platform == 'snapchat') {
                setplatforms([
                    // { name: 'All', isselected: false, value: 'all' },
                    { name: 'Meta', isselected: false, img: meta, value: 'meta' },
                    { name: 'Tiktok', isselected: false, img: tiktok, value: 'tiktok' },
                    { name: 'Snapchat', isselected: true, img: snapchat, value: 'snapchat' },
                ]);
            }
        }
        if (queryParameters.get('campaignid') == undefined) {
        } else {
            campaignid = queryParameters.get('campaignid');
            setid(campaignid);
            insighttype = 'adsets';
            settabs([
                { name: 'Campaigns', status: false, icon: <MdFolderSpecial size={18} class="mr-2" /> },
                { name: 'Ad sets', status: true, icon: <BiGridAlt size={18} class="mr-2" /> },
                { name: 'Ads', status: false, icon: <BsWindow size={18} class="mr-2" /> },
            ]);
        }
        if (queryParameters.get('adsetid') == undefined) {
        } else {
            adsetid = queryParameters.get('adsetid');
            setid(adsetid);
            insighttype = 'ads';

            settabs([
                { name: 'Campaigns', status: false, icon: <MdFolderSpecial size={18} class="mr-2" /> },
                { name: 'Ad sets', status: false, icon: <BiGridAlt size={18} class="mr-2" /> },
                { name: 'Ads', status: true, icon: <BsWindow size={18} class="mr-2" /> },
            ]);
        }
        // alert(ll);
        setfilter({
            company_id: company,
            from_date: fromdate,
            to_date: todate,
            platform: platform,
            fiterdatefrom: ll,
            fiterdateto: lll,
            insight_type: insighttype,
        });
        setfiltercampaigns({
            company_id: company,
            from_date: fromdate,
            to_date: todate,
            platform: platform,
            campaign_id: campaignid,
            adset_id: adsetid,
            insight_type: insighttype,
        });
        setfilterroute({
            company_id: companyroute,
            from_date: fromdateroute,
            to_date: todateroute,
            platform: platformroute,
        });
        setallowfetch(true);
    }, [FetchCampaignphasesinsights?.data]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Analytics
                    </p>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '18px' }}>
                            Phases Analytics
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}>
                        <DateRangePicker
                            disabledDate={allowedMaxDays(30)}
                            value={[filter?.fiterdatefrom, filter?.fiterdateto]}
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
                                    history.push({
                                        pathname: '/campaigns',
                                        search: filterroute.company_id + '&fromdate=' + year1 + '-' + month1 + '-' + day1 + '&todate=' + year2 + '-' + month2 + '-' + day2 + filterroute.platform,
                                    });
                                }
                            }}
                        />
                    </div>

                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div class="col-lg-6 p-1 scrollmenuclasssubscrollbar">
                        <div
                            class="row m-0 w-100"
                            style={{
                                background: 'white',
                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                borderRadius: '5px',
                            }}
                        >
                            <Barchart type="Leads" data={FetchCampaignphasesinsights?.data?.data?.phasescounters} />
                        </div>
                    </div>
                    <div class="col-lg-6 p-1 scrollmenuclasssubscrollbar">
                        <div
                            class="row m-0 w-100"
                            style={{
                                background: 'white',
                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                borderRadius: '5px',
                            }}
                        >
                            <Piechart data={FetchCampaignphasesinsights?.data?.data?.phasescounters} />
                        </div>
                    </div>
                    <div class="col-lg-12 mt-1 p-1 scrollmenuclasssubscrollbar">
                        <div
                            class="row m-0 w-100"
                            style={{
                                background: 'white',
                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                borderRadius: '5px',
                            }}
                        >
                            <Multilinechart data={FetchCampaignphasesinsights?.data?.data?.phasescountgroupedbyday} />
                        </div>
                    </div>

                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>

                    {fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin' && (
                        <div class="col-lg-12 mb-3">
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
                            </div>
                        </div>
                    )}

                    <>
                        <div style={{ position: 'relative', height: '36px', width: '100%' }} class="mr-2 ">
                            <div style={{ position: 'absolute', top: '29%', left: langdetect == 'en' ? '1%' : '', right: langdetect == 'en' ? '' : '2%' }}>
                                <AiOutlineSearch color="rgb(158, 158, 158)" size={15} class="ml-2 mr-2" />
                            </div>
                            <input
                                class={'inputfeild'}
                                style={{
                                    height: '36px',
                                    width: '100%',
                                    border: '1px solid lightgray',
                                    borderRadius: '10px',
                                    paddingInlineStart: '42px',
                                }}
                                type="name"
                                placeholder={'search'}
                                onChange={(event) => {
                                    setsearchInput(event.target.value);
                                }}
                            />
                        </div>
                    </>

                    <div class="col-lg-12 px-1 mt-3">
                        <div class="row m-0 w-100">
                            {tabs?.map((item, index) => {
                                return (
                                    <div class="col-lg-4 px-1 pb-0">
                                        <div
                                            onClick={() => {
                                                if (index == 0) {
                                                    history.push({
                                                        pathname: '/phasesanalytics',
                                                        search: filterroute.company_id + filterroute.from_date + filterroute.to_date + filterroute.platform,
                                                    });
                                                }
                                            }}
                                            class={generalstyles.subcontainer + ' row m-0 w-100 p-3 d-flex align-items-center '}
                                            style={{
                                                background: item?.status ? 'white' : '#fcfcfc',
                                                borderTopLeftRadius: '10px',
                                                borderTopRightRadius: '10px',
                                                borderBottomRightRadius: '0px',
                                                borderBottomLeftRadius: '0px',
                                                transition: 'all 0.4s',
                                                cursor: index == 0 ? 'pointer' : '',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {item?.icon} {item?.name}
                                            {item?.status && (
                                                <div
                                                    class="allcentered ml-1"
                                                    style={{ background: 'var(--primary)', paddingInline: '5px', color: 'white', height: '20px', borderRadius: '5px', fontSize: '11px' }}
                                                >
                                                    {FetchCampaignphasesinsights?.data?.data?.campaigns?.length}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {(FetchCampaignphasesinsights.isFetching || FetchCampaignphasesinsights.isFetching || FetchCampaignphasesinsights.isFetching) && (
                        <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                            <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                        </div>
                    )}
                    {FetchCampaignphasesinsights?.isSuccess && !FetchCampaignphasesinsights?.isFetching && (
                        <>
                            {tabs[0]?.status && FetchCampaignphasesinsights?.data?.data?.campaigns?.length == 0 && (
                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            {'No Campaigns'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tabs[1]?.status && FetchCampaignphasesinsights?.data?.data?.campaigns?.length == 0 && (
                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            {'No Adsets'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {tabs[2]?.status && FetchCampaignphasesinsights?.data?.data?.campaigns?.length == 0 && (
                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            {'No Ads'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 
                            {tabs[1]?.status && FetchCampaignphasesinsights?.data?.data?.campaigns?.length != 0 && (
                                <div className={generalstyles.subcontainertable + ' col-lg-12 px-1 table_responsive  scrollmenuclasssubscrollbar pt-0 '}>
                                    <table className={'table'}>
                                        <thead class="m-0" style={{ borderRadius: '0px' }}>
                                            <th style={{ color: 'black' }}>Name</th>
                                            {FetchPhases?.data?.data?.data?.map((item, index) => {
                                                return (
                                                    <th style={{ minWidth: '100px', color: 'black' }}>
                                                        <span
                                                            style={{
                                                                color: item?.value == filterperformanefunnel?.rankby ? 'var(--primary)' : '',
                                                                fontWeight: item?.value == filterperformanefunnel?.rankby ? 600 : '',
                                                            }}
                                                            class="d-flex align-items-center"
                                                        >
                                                            <span class="mr-2">{item?.name}</span>
                                                        </span>
                                                    </th>
                                                );
                                            })}
                                        </thead>
                                        <tbody>
                                            {FetchCampaignphasesinsights?.data?.data?.campaigns
                                                .filter((row) => !searchInput?.length || row?.campaign?.name?.toString()?.toLowerCase()?.includes(searchInput.toString().toLowerCase()))
                                                .map((subitem, subindex) => {
                                                    return (
                                                        <>
                                                            <tr class="m-0" style={{ borderRadius: '0px' }}>
                                                                <td>
                                                                    <p
                                                                        onClick={() => {
                                                                            history.push({
                                                                                pathname: '/phasesanalytics',
                                                                                search:
                                                                                    filterroute.company_id +
                                                                                    filterroute.from_date +
                                                                                    filterroute.to_date +
                                                                                    filterroute.platform +
                                                                                    '&adsetid=' +
                                                                                    subitem?.id,
                                                                            });
                                                                        }}
                                                                        style={{ fontWeight: 600 }}
                                                                        className={' m-0 px-1 wordbreak text-primary text-secondaryhover '}
                                                                    >
                                                                        {subitem?.name}
                                                                    </p>
                                                                </td>
                                                                {FetchPhases?.data?.data?.data?.map((i, ii) => {
                                                                    var exist = false;
                                                                    var chosenindex = 0;

                                                                    subitem?.phases?.map((phase, phaseindex) => {
                                                                        if (phase?.id == i?.id) {
                                                                            exist = true;
                                                                            chosenindex = phaseindex;
                                                                        }
                                                                    });
                                                                    return (
                                                                        <td style={{ minWidth: '100px', color: 'black' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{exist ? subitem?.phases[chosenindex]?.leadscount : 0}</p>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                     
                            {tabs[2]?.status && FetchCampaignphasesinsights?.data?.data?.campaigns?.length != 0 && (
                                <div className={generalstyles.subcontainertable + ' col-lg-12 px-1 table_responsive  scrollmenuclasssubscrollbar pt-0 '}>
                                    <table className={'table'}>
                                        <thead class="m-0" style={{ borderRadius: '0px' }}>
                                            <th style={{ color: 'black' }}>Name</th>
                                            {FetchPhases?.data?.data?.data?.map((item, index) => {
                                                return (
                                                    <th style={{ minWidth: '100px', color: 'black' }}>
                                                        <span
                                                            style={{
                                                                color: item?.value == filterperformanefunnel?.rankby ? 'var(--primary)' : '',
                                                                fontWeight: item?.value == filterperformanefunnel?.rankby ? 600 : '',
                                                            }}
                                                            class="d-flex align-items-center"
                                                        >
                                                            <span class="mr-2">{item?.name}</span>
                                                        </span>
                                                    </th>
                                                );
                                            })}
                                        </thead>
                                        <tbody>
                                            {FetchCampaignphasesinsights?.data?.data?.campaigns
                                                .filter((row) => !searchInput?.length || row?.campaign?.name?.toString()?.toLowerCase()?.includes(searchInput.toString().toLowerCase()))
                                                .map((subitem, subindex) => {
                                                    return (
                                                        <>
                                                            <tr class="m-0" style={{ borderRadius: '0px' }}>
                                                                <td>
                                                                    <p style={{ fontWeight: 600 }} className={' m-0 px-1 wordbreak text-primary '}>
                                                                        {subitem?.name}
                                                                    </p>
                                                                </td>
                                                                {FetchPhases?.data?.data?.data?.map((i, ii) => {
                                                                    var exist = false;
                                                                    var chosenindex = 0;

                                                                    subitem?.phases?.map((phase, phaseindex) => {
                                                                        if (phase?.id == i?.id) {
                                                                            exist = true;
                                                                            chosenindex = phaseindex;
                                                                        }
                                                                    });
                                                                    return (
                                                                        <td style={{ minWidth: '100px', color: 'black' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{exist ? subitem?.phases[chosenindex]?.leadscount : 0}</p>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            )} */}

                            <div className={generalstyles.subcontainertable + ' col-lg-12 px-1 table_responsive  scrollmenuclasssubscrollbar pt-0 '}>
                                <table className={'table'}>
                                    <thead class="m-0" style={{ borderRadius: '0px' }}>
                                        <th style={{ color: 'black' }}>Name</th>
                                        <th style={{ minWidth: '100px', color: 'black' }}>Platform</th>
                                        {FetchPhases?.data?.data?.data?.map((item, index) => {
                                            return (
                                                <th style={{ minWidth: '100px', color: 'black' }}>
                                                    <span
                                                        style={{
                                                            color: item?.id == filterperformanefunnel?.rankby ? 'var(--primary)' : '',
                                                            fontWeight: item?.id == filterperformanefunnel?.rankby ? 600 : '',
                                                        }}
                                                        class="d-flex align-items-center"
                                                    >
                                                        <span class="mr-2">{item?.name}</span>
                                                        <MdOutlineArrowForwardIos
                                                            style={{
                                                                transition: 'all 0.4s',
                                                                transform: item?.id == filterperformanefunnel?.rankby && filterperformanefunnel?.sort == 'desc' ? 'rotate(270deg)' : 'rotate(90deg)',
                                                            }}
                                                            class="text-primaryhover"
                                                            onClick={() => {
                                                                setfilterperformanefunnel({
                                                                    rankby: item?.id,
                                                                    sort: item?.id == filterperformanefunnel?.rankby ? (filterperformanefunnel?.sort == 'desc' ? 'asc' : 'desc') : 'desc',
                                                                });
                                                            }}
                                                        />
                                                    </span>
                                                </th>
                                            );
                                        })}
                                    </thead>

                                    {filterperformanefunnel?.sort == 'asc' && (
                                        <tbody>
                                            {sortArrayByColumns(FetchCampaignphasesinsights?.data?.data?.campaigns, [filterperformanefunnel?.rankby])
                                                .filter((row) => !searchInput?.length || row?.campaign?.name?.toString()?.toLowerCase()?.includes(searchInput.toString().toLowerCase()))
                                                .map((subitem, subindex) => {
                                                    return (
                                                        <>
                                                            <tr class="m-0" style={{ borderRadius: '0px' }}>
                                                                <td>
                                                                    <p
                                                                        onClick={() => {
                                                                            if (tabs[0]?.status) {
                                                                                history.push({
                                                                                    pathname: '/phasesanalytics',
                                                                                    search:
                                                                                        filterroute.company_id +
                                                                                        filterroute.from_date +
                                                                                        filterroute.to_date +
                                                                                        filterroute.platform +
                                                                                        '&campaignid=' +
                                                                                        subitem?.id,
                                                                                });
                                                                            } else if (tabs[1]?.status) {
                                                                                history.push({
                                                                                    pathname: '/phasesanalytics',
                                                                                    search:
                                                                                        filterroute.company_id +
                                                                                        filterroute.from_date +
                                                                                        filterroute.to_date +
                                                                                        filterroute.platform +
                                                                                        '&adsetid=' +
                                                                                        subitem?.id,
                                                                                });
                                                                            }
                                                                        }}
                                                                        style={{ fontWeight: 600 }}
                                                                        className={tabs[2]?.status ? ' m-0 px-1 wordbreak text-primary  ' : ' m-0 px-1 wordbreak text-primary text-secondaryhover '}
                                                                    >
                                                                        {subitem?.name}
                                                                    </p>
                                                                </td>
                                                                <td style={{ minWidth: '100px', color: 'black' }}>
                                                                    <p className={' m-0 p-0 wordbreak text-capitalize '}>{subitem?.platform}</p>
                                                                </td>
                                                                {FetchPhases?.data?.data?.data?.map((i, ii) => {
                                                                    var exist = false;
                                                                    var chosenindex = 0;

                                                                    subitem?.phases?.map((phase, phaseindex) => {
                                                                        if (phase?.id == i?.id) {
                                                                            exist = true;
                                                                            chosenindex = phaseindex;
                                                                        }
                                                                    });
                                                                    return (
                                                                        <td style={{ minWidth: '100px', color: 'black' }}>
                                                                            <p className={' m-0 p-0 wordbreak  '}>{exist ? subitem?.phases[chosenindex]?.leadscount : 0}</p>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                        </tbody>
                                    )}
                                    {filterperformanefunnel?.sort == 'desc' && (
                                        <tbody>
                                            {sortArrayByColumns(FetchCampaignphasesinsights?.data?.data?.campaigns, [filterperformanefunnel?.rankby])
                                                ?.reverse()
                                                .filter((row) => !searchInput?.length || row?.campaign?.name?.toString()?.toLowerCase()?.includes(searchInput.toString().toLowerCase()))
                                                .map((subitem, subindex) => {
                                                    return (
                                                        <>
                                                            <tr class="m-0" style={{ borderRadius: '0px' }}>
                                                                <td>
                                                                    <p
                                                                        onClick={() => {
                                                                            if (tabs[0]?.status) {
                                                                                history.push({
                                                                                    pathname: '/phasesanalytics',
                                                                                    search:
                                                                                        filterroute.company_id +
                                                                                        filterroute.from_date +
                                                                                        filterroute.to_date +
                                                                                        filterroute.platform +
                                                                                        '&campaignid=' +
                                                                                        subitem?.id,
                                                                                });
                                                                            } else if (tabs[1]?.status) {
                                                                                history.push({
                                                                                    pathname: '/phasesanalytics',
                                                                                    search:
                                                                                        filterroute.company_id +
                                                                                        filterroute.from_date +
                                                                                        filterroute.to_date +
                                                                                        filterroute.platform +
                                                                                        '&adsetid=' +
                                                                                        subitem?.id,
                                                                                });
                                                                            }
                                                                        }}
                                                                        style={{ fontWeight: 600 }}
                                                                        className={tabs[2]?.status ? ' m-0 px-1 wordbreak text-primary  ' : ' m-0 px-1 wordbreak text-primary text-secondaryhover '}
                                                                    >
                                                                        {subitem?.name}
                                                                    </p>
                                                                </td>
                                                                <td style={{ minWidth: '100px', color: 'black' }}>
                                                                    <p className={' m-0 p-0 wordbreak text-capitalize'}>{subitem?.platform}</p>
                                                                </td>
                                                                {FetchPhases?.data?.data?.data?.map((i, ii) => {
                                                                    var exist = false;
                                                                    var chosenindex = 0;

                                                                    subitem?.phases?.map((phase, phaseindex) => {
                                                                        if (phase?.id == i?.id) {
                                                                            exist = true;
                                                                            chosenindex = phaseindex;
                                                                        }
                                                                    });
                                                                    return (
                                                                        <td style={{ minWidth: '100px', color: 'black' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{exist ? subitem?.phases[chosenindex]?.leadscount : 0}</p>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PhasesAnalytics;
