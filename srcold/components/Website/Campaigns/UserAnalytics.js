import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';

import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { useQuery } from 'react-query';

// Icons
import { FaUserGroup } from 'react-icons/fa6';
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
const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } = DateRangePicker;

const { ValueContainer, Placeholder } = components;

const UserAnalytics = (props) => {
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
        setpageactive_context('/useranalytics');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';

        var totalleads = 0;
        FetchCampaignOveralls?.data?.data?.leadsperday?.map((item, index) => {
            totalleads += parseInt(item?.leadscount);
        });
        setanalytics([
            {
                title: 'Calls',
                type: '',
                fetch: 'sumspend',
                data: FetchCampaignOveralls?.data?.data?.leadsperday,
            },

            {
                title: 'Meetings',
                type: '',
                fetch: 'sumclicks',

                data: FetchCampaignOveralls?.data?.data?.leadsperday,
            },
            {
                title: 'Phases',
                type: '',
                fetch: 'sumclicks',
                data: FetchCampaignOveralls?.data?.data?.leadsperday,
            },
            {
                title: 'Values',
                type: '',
                fetch: 'sumclicks',

                data: FetchCampaignOveralls?.data?.data?.leadsperday,
            },
        ]);

        settotalstatistics([
            {
                name: 'Total Calls',
                number: parseFloat(FetchMeta?.data?.data?.analysis?.spend__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.spend__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.spend__sum),
                color: '#00e396',
                icon: <MdPhone class="mr-2" size={20} />,
            },

            {
                name: 'Total Leads',
                number:
                    parseFloat(FetchMeta?.data?.data?.analysis?.impressions__sum) +
                    parseFloat(FetchTiktok?.data?.data?.analysis?.impressions__sum) +
                    parseFloat(FetchTiktok?.data?.data?.analysis?.impressions__sum),
                color: '#feb019',
                icon: <FaUserGroup class="mr-2" size={18} />,
            },
            {
                name: 'Total Meetings',
                number:
                    parseFloat(FetchMeta?.data?.data?.analysis?.clicks__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.clicks__sum) + parseFloat(FetchTiktok?.data?.data?.analysis?.clicks__sum),
                color: '#ff4560',
                icon: <MdMeetingRoom class="mr-2" size={20} />,
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

                                            <div style={{ minHeight: '40px' }} class="col-lg-12 p-0">
                                                <Intrograph data={item?.data} label={item?.name} color={item?.color} />
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
                    {analytics?.map((analytic, analyticindex) => {
                        return (
                            <div class="col-lg-6 p-1 mb-3">
                                <div class="row m-0 w-100 container p-1 py-2 ">
                                    <div class="col-lg-12 my-2 allcentered ">
                                        <span style={{ fontSize: '16px', fontWeight: 600 }}>{analytic?.title}</span>
                                    </div>

                                    {FetchMeta?.isSuccess && !FetchMeta?.isFetching && FetchTiktok?.isSuccess && !FetchTiktok?.isFetching && (
                                        <div class="col-lg-12 p-1 scrollmenuclasssubscrollbar">
                                            <div
                                                class="row m-0 w-100"
                                                style={{
                                                    background: 'white',
                                                    boxShadow: '0px 2px 6px -2px rgba(0,106,194,0.2)',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                <Barchart type={analytic?.title} data={analytic?.data} />
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
export default UserAnalytics;
