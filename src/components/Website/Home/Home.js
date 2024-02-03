import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import API from '../../../API/API.js';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
// import insightstyles from './home.module.css';
import Followersgroupedbymonth from './Followersgroupedbymonth.js';
import Reviewsgroupedbymonth from './Reviewsgroupedbymonth.js';
import { BsFillStarFill } from 'react-icons/bs';
import Viewsgroupedbymonth from './Viewsgroupedbymonth.js';
import Ratingtrend from './Ratingtrend.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

// Assets

const Home = () => {
    let history = useHistory();
    const { lang, langdetect } = useContext(LanguageContext);
    const { setpageactive_context, setpagetitle_context, fetchCompanyinfoContext, setScroll } = useContext(Contexthandlerscontext);
    const { FetchInsights_API } = API();
    const [ratings, setratings] = useState([]);
    const [categoryratings, setcategoryratings] = useState([]);

    const [statistics, setstatistics] = useState([
        { name: 'Total Leads', number: '10' },
        // { name: 'Overall Rating', number: '' },
        // { name: 'Interview Reviews', number: '' },
        // { name: 'Followers', number: '', path: './followers' },
    ]);
    const [companyinfo, setcompanyinfo] = useState({});
    const [links, setlinks] = useState([
        { name: 'Create your brand', subinks: [] },
        { name: 'Add more about your brand', subinks: [] },
        {
            name: 'Add Social media links',
            subinks: [],
        },
        { name: 'Engage with your employees', subinks: [{ name: 'Respond to the reviews', path: '/reviews' }] },
    ]);

    const FetchInsights = useQuery(['FetchInsights_API'], () => FetchInsights_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    // useEffect(() => {
    //     if (fetchCompanyinfoContext.isSuccess && !fetchCompanyinfoContext.isFetching) {
    //         var temp = fetchCompanyinfoContext?.data?.data?.data;

    //         setcompanyinfo({ ...temp });
    //         setstatistics([
    //             { name: 'Average Rating', number: temp?.overallratings },
    //             { name: 'Total Reviews', number: temp?.totalreviewscount },
    //             { name: 'Total Followers', number: temp?.totalfollowers },
    //         ]);
    //         setratings([
    //             { rate: '5', percentage: temp?.overallrating_5_count },
    //             { rate: '4', percentage: temp?.overallrating_4_count },
    //             { rate: '3', percentage: temp?.overallrating_3_count },
    //             { rate: '2', percentage: temp?.overallrating_2_count },
    //             { rate: '1', percentage: temp?.overallrating_1_count },
    //         ]);
    //         setcategoryratings([
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_rate_diversityandinclusion, name: lang.diversityandinclusion },
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_rate_managementandleadershipcapabilities, name: lang.managementandleadershipcapabilities },
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_skilldevelopment, name: lang.personaldevlopement },
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_companyculture, name: lang.companyculture },
    //             // { rate: fetchCompanyinfo?.data?.data?.data?.overallrating_workstatisfcation, name: lang.worksatisfaction },
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_worklifebalance, name: lang.worklifebalanceandoverallwellbeing },
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_promotionsandappraisls, name: lang.careergrowth },
    //             { rate: fetchCompanyinfoContext?.data?.data?.data?.overallrating_salaryandbenefits, name: lang.salaryandbenefits },
    //         ]);
    //     }
    // }, [fetchCompanyinfoContext.isSuccess, fetchCompanyinfoContext.data]);
    const percentage = (item) => {
        if (item != 0) {
            var number =
                (parseInt(item) /
                    (parseInt(fetchCompanyinfoContext?.data?.data?.data?.overallrating_1_count) +
                        parseInt(fetchCompanyinfoContext?.data?.data?.data?.overallrating_2_count) +
                        parseInt(fetchCompanyinfoContext?.data?.data?.data?.overallrating_3_count) +
                        parseInt(fetchCompanyinfoContext?.data?.data?.data?.overallrating_4_count) +
                        parseInt(fetchCompanyinfoContext?.data?.data?.data?.overallrating_5_count))) *
                100;
            return number;
        } else {
            return 0;
        }
    };

    const star = (item) => {
        var color = '';
        if (parseInt(item) == 5) {
            color = '#5ba829';
        }
        if (parseInt(item) == 4) {
            color = '#9acd32';
        }
        if (parseInt(item) == 3) {
            color = '#cdd614';
        }
        if (parseInt(item) == 2) {
            color = '#FF9A05';
        }
        if (parseInt(item) == 1) {
            color = '#ff4b2b';
        }
        if (item == 'info') {
            color = 'var(--greenprimary)';
        }
        return <BsFillStarFill color={color} />;
    };
    useEffect(() => {
        setpagetitle_context('dashboard');
        setpageactive_context('/home');

        // window.scrollTo(0, 0);
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Insights
                    </p>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class="col-lg-12 p-0">
                        <div class={'container'}>
                            <div class="row m-0 w-100 p-3 pl-4 pr-4">
                                {statistics?.map((item, index) => {
                                    return (
                                        <div style={{ width: '150px' }} class=" p-0">
                                            <div style={{ fontSize: '20px' }} class="row m-0 w-100">
                                                <div class="col-lg-12 ">
                                                    <span class="Carbona-Black mr-2 ">{item.number}</span>
                                                </div>
                                                <div class="col-lg-12 " style={{ fontSize: '14px' }}>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 p-0">
                        <div style={{ minHeight: '300px' }} class={'container p-4'}>
                            <div class="bar-chart-container">
                                <div class="bar-graph-heading">Leads trend</div>
                                <div style={{ width: '100%' }}>
                                    <Ratingtrend />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 p-0">
                        <div style={{ minHeight: '300px' }} class={'container p-4'}>
                            <div class="bar-chart-container">
                                <div class="bar-graph-heading">Leads Count Trend</div>
                                <div style={{ width: '100%' }}>
                                    <Reviewsgroupedbymonth />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div class="col-lg-6 p-0">
                    <div style={{ minHeight: '300px' }} class={'container p-4'}>
                        <div class="bar-graph-heading mb-3">Category Rating</div>

                        <div class="row w-100">
                            {categoryratings?.map((item, index) => {
                                return (
                                    <div style={{ fontSize: '10.5px' }} class={'col-lg-6 p-0 mb-3'}>
                                        <div class="row m-0 w-100 d-flex align-items-center">
                                            <div class="d-flex align-items-center">{star(item.rate)}</div>
                                            <div class=" ml-1 mr-1 Carbona-Black " style={{ fontWeight: 600, fontSize: '12px' }}>
                                                {parseFloat(item.rate).toFixed(1)}
                                            </div>
                                            <span class="wordbreak" style={{ width: '80%' }}>
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div> */}
                    <div class="col-lg-6 p-0">
                        <div style={{ minHeight: '300px' }} class={'container p-4'}>
                            <div class="bar-chart-container">
                                <div class="bar-graph-heading">Monthly Page Views Trend</div>
                                <div style={{ width: '100%' }}>
                                    <Viewsgroupedbymonth />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 p-0">
                        <div style={{ minHeight: '300px' }} class={'container p-4'}>
                            <div class="bar-chart-container">
                                <div class="bar-graph-heading">Followers Trend</div>
                                <div style={{ width: '100%' }}>
                                    <Followersgroupedbymonth />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
