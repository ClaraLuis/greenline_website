import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import { tabledefaultstyles } from '../Generalfiles/selectstyles.js';

import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { useQuery } from 'react-query';

// Icons
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { BiHide, BiShowAlt } from 'react-icons/bi';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import Select, { components } from 'react-select';
import API from '../../../API/API.js';

import snapchat from './snapchat.png';
import tiktok from './tiktok.png';
import meta from './meta.png';
import Graph from './Graph.js';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import RatingTrend from './RatingTrend.js';
import { DateRangePicker } from 'rsuite';
import Intrograph from './Intrograph.js';
import Mixedchart from './Mixedchart.js';
import { FaDollarSign, FaEye, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } = DateRangePicker;

const { ValueContainer, Placeholder } = components;

const Analytics = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { filterLeadscontext, setpageactive_context, setpagetitle_context, fetchAuthorizationQueryContext } = useContext(Contexthandlerscontext);
    const { FetchCampaigns_API, FetchMeta_API, FetchCampaigninsights_API, FetchCampaignOveralls_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [openModal, setopenModal] = useState(false);
    const [allowfetch, setallowfetch] = useState(false);
    const [totalstatistics, settotalstatistics] = useState([]);

    const [filterroute, setfilterroute] = useState({
        company_id: '',
        from_date: '',
        to_date: '',
        platform: '',
    });

    const [filter, setfilter] = useState({
        company_id: filterLeadscontext?.company_id,
        from_date: filterLeadscontext?.from_date,
        to_date: filterLeadscontext?.to_date,
        platform: filterLeadscontext?.platform,
    });

    const [filtercampaigns, setfiltercampaigns] = useState({
        company_id: filterLeadscontext?.company_id,
        from_date: filterLeadscontext?.from_date,
        to_date: filterLeadscontext?.to_date,
        platform: 'meta',
        page: 1,
        search: '',
    });

    const FetchMeta = useQuery(['FetchCampaigninsightsmeta_API' + JSON.stringify(filtercampaigns) + 'meta'], () => FetchCampaigninsights_API({ filter: filtercampaigns, platform: 'meta' }), {
        keepPreviousData: true,
        staleTime: Infinity,
        enabled: allowfetch,
    });

    const FetchGoogle = useQuery(['FetchCampaigninsightsmeta_API' + JSON.stringify(filtercampaigns) + 'google'], () => FetchCampaigninsights_API({ filter: filtercampaigns, platform: 'google' }), {
        keepPreviousData: true,
        staleTime: Infinity,
        enabled: allowfetch,
    });
    const FetchCampaignOveralls = useQuery(['FetchCampaignOveralls_API' + JSON.stringify(filtercampaigns) + 'meta'], () => FetchCampaignOveralls_API({ filter: filtercampaigns, platform: 'meta' }), {
        keepPreviousData: true,
        staleTime: Infinity,
        enabled: allowfetch,
    });
    const FetchTiktok = useQuery(['FetchCampaigninsightstiktok_API' + JSON.stringify(filtercampaigns) + 'tiktok'], () => FetchCampaigninsights_API({ filter: filtercampaigns, platform: 'tiktok' }), {
        keepPreviousData: true,
        staleTime: Infinity,
        enabled: allowfetch,

        // enabled: fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin',
    });

    const [analytics, setanalytics] = useState([
        {
            title: 'Spent',
            type: '',

            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'Leads',
            type: '',

            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'Impressions',
            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'Clicks',
            type: '',

            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'CTR',
            type: '%',

            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'CPM',
            type: '%',

            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'CPC',
            type: '%',
            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
        {
            title: 'Reach',
            type: '',

            statistics: [
                { name: 'All', number: '' },
                { name: 'Meta', number: '', img: meta },
                { name: 'Tiktok', number: '', img: tiktok },
                { name: 'Snapchat', number: '', img: snapchat },
            ],
        },
    ]);

    useEffect(() => {
        setpageactive_context('/analytics');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';

        var totalleads = 0;
        FetchCampaignOveralls?.data?.data?.leadsperday?.map((item, index) => {
            totalleads += parseInt(item?.leadscount);
        });
        setanalytics([
            {
                title: 'Spent',
                type: '',
                fetch: 'sumspend',
                statistics: [
                    {
                        name: 'All',
                        number:
                            parseFloat(FetchMeta?.data?.data?.analysis?.spend__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.spend__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.spend__sum),
                    },
                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.spend__sum, img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.spend__sum, img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
            {
                title: 'Leads',
                type: '',
                fetch: 'sumleads',

                statistics: [
                    {
                        name: 'All',
                        number: totalleads,
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.leads__sum, img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.leads__sum, img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                    {
                        name: 'Google',
                        number:
                            FetchGoogle?.data?.data?.analyisPerDay?.leads__sum?.length != 0 &&
                            FetchGoogle?.data?.data?.analyisPerDay?.leads__sum != null &&
                            FetchGoogle?.data?.data?.analyisPerDay?.leads__sum != undefined
                                ? FetchGoogle?.data?.data?.analyisPerDay?.leads__sum
                                : '-',
                    },
                ],
            },
            {
                title: 'Impressions',
                type: '',
                fetch: 'sumimpressions',

                statistics: [
                    {
                        name: 'All',
                        number:
                            parseFloat(FetchMeta?.data?.data?.analysis?.impressions__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.impressions__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.impressions__sum),
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.impressions__sum, img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.impressions__sum, img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
            {
                title: 'Clicks',
                type: '',
                fetch: 'sumclicks',

                statistics: [
                    {
                        name: 'All',
                        number:
                            parseFloat(FetchMeta?.data?.data?.analysis?.clicks__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.clicks__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.clicks__sum),
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.clicks__sum, img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.clicks__sum, img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
            {
                title: 'CTR',
                type: '%',
                fetch: 'avgctr',

                statistics: [
                    {
                        name: 'Average',
                        number:
                            ((parseFloat(FetchMeta?.data?.data?.analysis?.ctr__avg) / 100 +
                                parseFloat(FetchTiktok?.data?.data?.analysis?.ctr__avg) / 100 +
                                parseFloat(FetchTiktok?.data?.data?.analysis?.ctr__avg) / 100) /
                                3) *
                            100,
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.ctr__avg?.toFixed(2), img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.ctr__avg?.toFixed(2), img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
            {
                title: 'CPM',
                type: '%',
                fetch: 'avgcpm',

                statistics: [
                    {
                        name: 'Average',
                        number:
                            ((parseFloat(FetchMeta?.data?.data?.analysis?.cpm__avg) / 100 +
                                parseFloat(FetchTiktok?.data?.data?.analysis?.cpm__avg) / 100 +
                                parseFloat(FetchTiktok?.data?.data?.analysis?.cpm__avg) / 100) /
                                3) *
                            100,
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.cpm__avg?.toFixed(2), img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.cpm__avg?.toFixed(2), img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
            {
                title: 'CPC',
                type: '%',
                fetch: 'avgcpc',

                statistics: [
                    {
                        name: 'Average',
                        number:
                            ((parseFloat(FetchMeta?.data?.data?.analysis?.cpc__avg) / 100 +
                                parseFloat(FetchTiktok?.data?.data?.analysis?.cpc__avg) / 100 +
                                parseFloat(FetchTiktok?.data?.data?.analysis?.cpc__avg) / 100) /
                                3) *
                            100,
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.cpc__avg?.toFixed(2), img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.cpc__avg?.toFixed(2), img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
            {
                title: 'Reach',
                type: '',
                fetch: 'sumreach',

                statistics: [
                    {
                        name: 'All',
                        number:
                            parseFloat(FetchMeta?.data?.data?.analysis?.reach__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.reach__sum) +
                            parseFloat(FetchTiktok?.data?.data?.analysis?.reach__sum),
                    },

                    { name: 'Meta', number: FetchMeta?.data?.data?.analysis?.reach__sum, img: meta },
                    { name: 'Tiktok', number: FetchTiktok?.data?.data?.analysis?.reach__sum, img: tiktok },
                    { name: 'Snapchat', number: '-', img: snapchat },
                ],
            },
        ]);

        settotalstatistics([
            {
                name: 'Total Spent',
                number: parseFloat(FetchMeta?.data?.data?.analysis?.spend__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.spend__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.spend__sum),
                color: '#00e396',
                icon: <FaMoneyBillWave class="mr-2" size={20} />,
                // data: FetchCampaignOveralls?.data?.data?.leadsperday,
                // charttype: 'ine',
                // type: 'leadscount',
            },
            {
                name: 'Total Leads',
                number: totalleads,
                color: '#008ffb',
                icon: <FaUsers class="mr-2" size={20} />,
                data: FetchCampaignOveralls?.data?.data?.leadsperday,
                charttype: 'line',
                type: 'leadscount',
            },
            {
                name: 'Total Impressions',
                number:
                    parseFloat(FetchMeta?.data?.data?.analysis?.impressions__sum) +
                    parseFloat(FetchTiktok?.data?.data?.analysis?.impressions__sum) +
                    parseFloat(FetchTiktok?.data?.data?.analysis?.impressions__sum),
                color: '#feb019',
                icon: <FaEye class="mr-2" size={20} />,
                // data: FetchCampaignOveralls?.data?.data?.leadsperday,
                // charttype: 'bar',
                // type: 'leadscount',
            },
            {
                name: 'Total Clicks',
                number:
                    parseFloat(FetchMeta?.data?.data?.analysis?.clicks__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.clicks__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.clicks__sum),
                color: '#ff4560',
                icon: <HiCursorClick class="mr-2" size={20} />,
                // data: FetchCampaignOveralls?.data?.data?.leadsperday,
                // charttype: 'line',
                // type: 'leadscount',
            },
        ]);
        var company = filterLeadscontext?.company_id;
        var companyroute = '';
        var fromdate = filterLeadscontext?.from_date;
        var fromdateroute = '';
        var todate = filterLeadscontext?.to_date;
        var todateroute = '';
        var platform = filterLeadscontext?.platform;
        var platformroute = '';

        if (queryParameters.get('companyid') == undefined) {
        } else {
            company = queryParameters.get('companyid');
            companyroute = '?companyid=' + queryParameters.get('companyid');
        }
        if (queryParameters.get('fromdate') == undefined) {
            if (FetchMeta?.data?.data?.from_date != undefined) {
                var ll = new Date(FetchMeta?.data?.data?.from_date);
            }
        } else {
            fromdate = queryParameters.get('fromdate');
            fromdateroute = '&fromdate=' + queryParameters.get('fromdate');
            var ll = new Date(fromdate);
        }
        if (queryParameters.get('todate') == undefined) {
            if (FetchMeta?.data?.data?.to_date != undefined) {
                var lll = new Date(FetchMeta?.data?.data?.to_date);
            }
        } else {
            todate = queryParameters.get('todate');
            todateroute = '&todate=' + queryParameters.get('todate');
            var lll = new Date(todate);
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
            fiterdatefrom: ll,
            fiterdateto: lll,
        });
        setfiltercampaigns({
            company_id: company,
            from_date: fromdate,
            to_date: todate,
            platform: 'meta',
        });
        setfilterroute({
            company_id: companyroute,
            from_date: fromdateroute,
            to_date: todateroute,
            platform: platformroute,
        });
        setallowfetch(true);
    }, [FetchMeta?.data, FetchTiktok?.data, FetchCampaignOveralls?.data, filterLeadscontext]);
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
                            Campaign Analytics
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}>
                        <DateRangePicker
                            style={{ color: 'black' }}
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
                                        pathname: '/analytics',
                                        search: filterroute.company_id + '&fromdate=' + year1 + '-' + month1 + '-' + day1 + '&todate=' + year2 + '-' + month2 + '-' + day2 + filterroute.platform,
                                    });
                                }
                            }}
                        />
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div class="col-lg-12 p-0 mb-4">
                        <div class="row m-0 w-100 ">
                            {totalstatistics?.map((item, index) => {
                                return (
                                    <div class="col-lg-3 p-3">
                                        <div
                                            class="row m-0 w-100"
                                            style={{
                                                boxShadow: '0px 1px 22px -12px #607D8B',
                                                padding: '3px 0 0 0',
                                            }}
                                        >
                                            <div class="col-lg-12 allcentered pt-3" style={{ fontSize: '13px' }}>
                                                {item?.name}
                                            </div>
                                            <div style={{ fontWeight: 900, fontSize: '21px', fontFamily: 'Helvetica, Arial, sans-serif' }} class="col-lg-12 allcentered pb-0">
                                                {item?.icon} {Number.isFinite(item?.number) ? parseInt(item?.number)?.toLocaleString() : '-'}
                                            </div>

                                            <div style={{ minHeight: '40px' }} class="col-lg-12 p-0">
                                                <Intrograph data={item?.data} label={item?.name} color={item?.color} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>{' '}
                    </div>
                    <div class="col-lg-12 p-0">
                        <Mixedchart data={totalstatistics} />
                    </div>
                    {analytics?.map((analytic, analyticindex) => {
                        if (analytic?.type == '%') {
                            var allvalues =
                                ((parseFloat(analytic?.statistics[1].number) / 100 + parseFloat(analytic?.statistics[2].number) / 100 + parseFloat(analytic?.statistics[2].number) / 100) / 3) * 100;
                        } else {
                            var allvalues = parseFloat(analytic?.statistics[1].number) + parseFloat(analytic?.statistics[2].number) + parseFloat(analytic?.statistics[2].number);
                        }

                        return (
                            <div class="col-lg-12 p-1 mb-3">
                                <div class="row m-0 w-100 container p-1 py-2 ">
                                    <div class="col-lg-12 my-2 allcentered ">
                                        <span style={{ fontSize: '16px', fontWeight: 600 }}>{analytic?.title}</span>
                                    </div>
                                    <div class="col-lg-12 p-1">
                                        <div
                                            style={{
                                                padding: '10px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                                borderRadius: '5px',
                                            }}
                                            class="row m-0 w-100 mb-1"
                                        >
                                            <div class={analytic?.title == 'Leads' ? 'col-lg-2' : 'col-lg-3'}>
                                                <div
                                                    class="row m-0 w-100"
                                                    style={{
                                                        borderInlineEnd: '1px solid lightgray',
                                                        minHeight: '45px',
                                                    }}
                                                >
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '14px' }}>
                                                        <div class="row m-0 w-100 d-flex align-items-center">{analytic?.statistics[0].name}</div>
                                                    </div>
                                                    <div
                                                        class="col-lg-12 p-0 mt-1"
                                                        style={{
                                                            fontWeight: 600,
                                                            color: 'black',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {analytic.type != '%' ? allvalues?.toLocaleString() : allvalues?.toFixed(2)}
                                                        {analytic?.type}
                                                    </div>
                                                </div>
                                            </div>{' '}
                                            <div class={analytic?.title == 'Leads' ? 'col-lg-2' : 'col-lg-3'}>
                                                <div
                                                    class="row m-0 w-100"
                                                    style={{
                                                        borderInlineEnd: '1px solid lightgray',
                                                        minHeight: '45px',
                                                    }}
                                                >
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '14px', color: 'black' }}>
                                                        <div class="row m-0 w-100 d-flex align-items-center">
                                                            {analytic?.statistics[1]?.img != undefined && (
                                                                <img src={analytic?.statistics[1]?.img} class="mr-1" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                                            )}
                                                            {analytic?.statistics[1].name}
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="col-lg-12 p-0 mt-1"
                                                        style={{
                                                            fontWeight: 600,
                                                            color: 'black',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {FetchMeta?.isSuccess && !FetchMeta?.isFetching && (
                                                            <>
                                                                {analytic.type != '%' ? analytic?.statistics[1].number?.toLocaleString() : analytic?.statistics[1].number}
                                                                {analytic?.statistics[1].number != '-' ? analytic?.type : ''}
                                                            </>
                                                        )}
                                                        {FetchMeta?.isFetching && <CircularProgress width="20px" height="20px" duration="1s" />}
                                                    </div>
                                                </div>
                                            </div>{' '}
                                            <div class={analytic?.title == 'Leads' ? 'col-lg-2' : 'col-lg-3'}>
                                                <div
                                                    class="row m-0 w-100"
                                                    style={{
                                                        borderInlineEnd: '1px solid lightgray',
                                                        minHeight: '45px',
                                                    }}
                                                >
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '14px', color: 'black' }}>
                                                        <div class="row m-0 w-100 d-flex align-items-center">
                                                            {analytic?.statistics[2]?.img != undefined && (
                                                                <img src={analytic?.statistics[2]?.img} class="mr-1" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                                            )}
                                                            {analytic?.statistics[2].name}
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="col-lg-12 p-0 mt-1"
                                                        style={{
                                                            fontWeight: 600,
                                                            color: 'black',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {analytic.type != '%' ? analytic?.statistics[2].number?.toLocaleString() : analytic?.statistics[2].number}
                                                        {analytic?.statistics[2].number != '-' ? analytic?.type : ''}
                                                    </div>
                                                </div>
                                            </div>{' '}
                                            <div class={analytic?.title == 'Leads' ? 'col-lg-2' : 'col-lg-3'}>
                                                <div
                                                    class="row m-0 w-100"
                                                    style={{
                                                        borderInlineEnd: analytic?.title == 'Leads' ? '1px solid lightgray' : '',
                                                        minHeight: '45px',
                                                    }}
                                                >
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '14px', color: 'black' }}>
                                                        <div class="row m-0 w-100 d-flex align-items-center">
                                                            {analytic?.statistics[3]?.img != undefined && (
                                                                <img src={analytic?.statistics[3]?.img} class="mr-1" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                                            )}
                                                            {analytic?.statistics[3]?.name}
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="col-lg-12 p-0 mt-1"
                                                        style={{
                                                            fontWeight: 600,
                                                            color: 'black',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {analytic.type != '%' ? analytic?.statistics[3].number?.toLocaleString() : analytic?.statistics[3].number}
                                                        {analytic?.statistics[3].number != '-' ? analytic?.type : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            {analytic?.title == 'Leads' && (
                                                <div class={analytic?.title == 'Leads' ? 'col-lg-2' : 'col-lg-3'}>
                                                    <div
                                                        class="row m-0 w-100"
                                                        style={{
                                                            // borderInlineEnd: '1px solid lightgray',
                                                            minHeight: '45px',
                                                        }}
                                                    >
                                                        <div class="col-lg-12 p-0" style={{ fontSize: '14px', color: 'black' }}>
                                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                                {analytic?.statistics[4]?.img != undefined && (
                                                                    <img src={analytic?.statistics[4]?.img} class="mr-1" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                                                )}
                                                                {analytic?.statistics[4]?.name}
                                                            </div>
                                                        </div>
                                                        <div
                                                            class="col-lg-12 p-0 mt-1"
                                                            style={{
                                                                fontWeight: 600,
                                                                color: 'black',
                                                                fontSize: '15px',
                                                            }}
                                                        >
                                                            {analytic.type != '%' ? analytic?.statistics[4]?.number?.toLocaleString() : analytic?.statistics[4]?.number}
                                                            {analytic?.statistics[4]?.number != '-' ? analytic?.type : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div class="col-lg-4 p-1 scrollmenuclasssubscrollbar">
                                        <div
                                            class="row m-0 w-100"
                                            style={{
                                                background: 'white',
                                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            <Graph data={analytic?.statistics} title={analytic?.title} />
                                        </div>
                                    </div>
                                    {FetchMeta?.isSuccess && !FetchMeta?.isFetching && FetchTiktok?.isSuccess && !FetchTiktok?.isFetching && (
                                        <div class="col-lg-8 p-1 scrollmenuclasssubscrollbar">
                                            <div
                                                class="row m-0 w-100"
                                                style={{
                                                    background: 'white',
                                                    boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                <RatingTrend
                                                    data1={FetchMeta?.data?.data}
                                                    data2={FetchTiktok?.data?.data}
                                                    data3={FetchTiktok?.data?.data}
                                                    fetch={analytic?.fetch}
                                                    type={analytic?.type}
                                                    title={analytic?.title}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default Analytics;
