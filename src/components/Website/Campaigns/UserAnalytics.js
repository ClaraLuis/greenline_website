import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';

import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { useQuery } from 'react-query';

// Icons
import { FaUserGroup } from 'react-icons/fa6';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { components } from 'react-select';
import API from '../../../API/API.js';

import { HiCursorClick } from 'react-icons/hi';
import { MdMeetingRoom, MdPhone } from 'react-icons/md';
import { DateRangePicker } from 'rsuite';
import Barchart from './Barchart.js';
import Intrograph from './Intrograph.js';
import Mixedchart from './Mixedchart.js';
import meta from './meta.png';
import snapchat from './snapchat.png';
import tiktok from './tiktok.png';
import MultiBar from './MultiBar.js';
const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } = DateRangePicker;

const { ValueContainer, Placeholder } = components;

const UserAnalytics = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { filterLeadscontext, setpageactive_context, setpagetitle_context, fetchAuthorizationQueryContext } = useContext(Contexthandlerscontext);
    const { FetchCampaigns_API, FetchCampaigninsights_API, FetchCampaignOveralls_API, FetchUserAnalytics_API } = API();

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

    const FetchUserAnalytics = useQuery(['FetchUserAnalytics_API' + JSON.stringify(filtercampaigns)], () => FetchUserAnalytics_API({ filter: filtercampaigns }), {
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
        setpageactive_context('/useranalytics');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';

        var totalvalues = 0;
        FetchUserAnalytics?.data?.data?.totalvalueperday?.map((item, index) => {
            totalvalues += parseInt(item?.sumtotalvalue);
        });

        var totalcalls = 0;
        FetchUserAnalytics?.data?.data?.callesperday?.map((item, index) => {
            totalcalls += parseInt(item?.callscount);
        });

        var totaldeals = 0;
        FetchUserAnalytics?.data?.data?.dealsperday?.map((item, index) => {
            totaldeals += parseInt(item?.dealscount);
        });

        var totalmeetings = 0;
        FetchUserAnalytics?.data?.data?.meetingsperday?.map((item, index) => {
            totalmeetings += parseInt(item?.meetingcount);
        });

        setanalytics([
            {
                title: 'Calls',
                type: 'callscount',
                fetch: 'sumspend',
                data: FetchUserAnalytics?.data?.data?.userspercall,
            },

            {
                title: 'Meetings',
                type: 'meetingscount',
                fetch: 'sumclicks',

                data: FetchUserAnalytics?.data?.data?.userspermeetings,
            },
            {
                title: 'Deals',
                type: 'dealscount',
                fetch: 'sumclicks',
                data: FetchUserAnalytics?.data?.data?.usersperdeals,
            },
            {
                title: 'Values',
                type: 'sumtotalvalue',
                fetch: 'sumclicks',

                data: FetchUserAnalytics?.data?.data?.userspervalue,
            },
        ]);

        settotalstatistics([
            {
                name: 'Total Calls',
                number: totalcalls,
                color: '#00e396',
                icon: <MdPhone class="mr-2" size={20} />,
                data: FetchUserAnalytics?.data?.data?.callesperday,
                type: 'callscount',
                charttype: 'area',
            },
            // {
            //     name: 'Total Values',
            //     number: totalvalues,
            //     color: '#008ffb',
            //     icon: <MdMeetingRoom class="mr-2" size={20} />,
            //     data: FetchUserAnalytics?.data?.data?.totalvalueperday,
            //     type: 'sumtotalvalue',
            //     charttype: 'column',
            // },

            {
                name: 'Total Deals',
                number: totaldeals,
                color: '#008ffb',
                icon: <FaUserGroup class="mr-2" size={18} />,
                data: FetchUserAnalytics?.data?.data?.dealsperday,
                type: 'dealscount',
                charttype: 'bar',
            },
            {
                name: 'Total Meetings',
                number: totalmeetings,
                color: '#feb019',
                icon: <MdMeetingRoom class="mr-2" size={20} />,
                data: FetchUserAnalytics?.data?.data?.meetingsperday,
                type: 'meetingcount',
                charttype: 'line',
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
    }, [FetchUserAnalytics?.data, filterLeadscontext]);
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
                            Users Analytics
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
                                        pathname: '/useranalytics',
                                        search: filterroute.company_id + '&fromdate=' + year1 + '-' + month1 + '-' + day1 + '&todate=' + year2 + '-' + month2 + '-' + day2 + filterroute.platform,
                                    });
                                }
                            }}
                        />
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    {FetchUserAnalytics.isFetching && (
                        <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                            <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                        </div>
                    )}
                    {FetchUserAnalytics?.isSuccess && !FetchUserAnalytics?.isFetching && (
                        <>
                            <div class="col-lg-12 p-0 mb-4">
                                <div class="row m-0 w-100 allcentered ">
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

                                                    <div style={{ minHeight: '52px' }} class="col-lg-12 p-0">
                                                        <Intrograph data={item?.data} label={item?.name} color={item?.color} type={item?.type} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>{' '}
                            </div>
                            <div class="col-lg-12 mb-4 p-0">
                                <Mixedchart data={totalstatistics} />
                            </div>

                            <div class="col-lg-12 p-1 mb-3">
                                <div class="row m-0 w-100 container p-1 py-2 ">
                                    <div class="col-lg-12 my-2 allcentered ">
                                        <span style={{ fontSize: '16px', fontWeight: 600 }}>Phases</span>
                                    </div>

                                    <div class="col-lg-12 p-1 scrollmenuclasssubscrollbar">
                                        <div
                                            class="row m-0 w-100"
                                            style={{
                                                background: 'white',
                                                boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            <MultiBar data={FetchUserAnalytics?.data?.data?.usersperphases} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {analytics?.map((analytic, analyticindex) => {
                                return (
                                    <div class="col-lg-6 p-1 mb-3">
                                        <div class="row m-0 w-100 container p-1 py-2 ">
                                            <div class="col-lg-12 my-2 allcentered ">
                                                <span style={{ fontSize: '16px', fontWeight: 600 }}>{analytic?.title}</span>
                                            </div>

                                            <div class="col-lg-12 p-1 scrollmenuclasssubscrollbar">
                                                <div
                                                    class="row m-0 w-100"
                                                    style={{
                                                        background: 'white',
                                                        boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <Barchart type={analytic?.title} data={analytic?.data} fetchtype={analytic?.type} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default UserAnalytics;
