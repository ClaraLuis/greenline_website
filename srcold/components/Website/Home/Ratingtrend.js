import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import API from '../../../API/API';

const Ratingtrend = () => {
    const { FetchInsights_API } = API();
    const FetchInsights = useQuery(['FetchInsights_API'], () => FetchInsights_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [categories, setcategories] = useState([]);
    const [values, setvalues] = useState([]);
    const dateformatter = (date) => {
        // var string = date;

        const options = { month: 'short' };
        return new Date(date).toLocaleDateString(undefined, options);
    };
    const [state, setstate] = useState({
        plotOptions: {
            bar: {
                columnWidth: '5px',
            },
        },
        options: {
            chart: {
                id: 'basic-bar',
            },
            xaxis: {
                categories: categories,
            },
        },
        series: [
            {
                data: values,
            },
        ],
    });

    useEffect(() => {
        if (FetchInsights.isSuccess && !FetchInsights.isFetching) {
            var temp = [];
            var tempvalues = [{ name: 'Rating', data: [] }];

            FetchInsights?.data?.data?.reviewsgroupedbymonthsdataAvgoverallratings?.map((item, index) => {
                temp.push(dateformatter(item.month));
                tempvalues[0]?.data?.push(parseFloat(item.c).toFixed(3));
            });
            setstate({
                chart: {
                    width: '100%',
                    toolbar: {
                        show: false,
                        tools: {
                            download: false,
                        },
                    },
                },

                options: {
                    chart: {
                        id: 'basic-bar',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                            },
                        },
                    },
                    xaxis: {
                        categories: temp,
                    },
                    responsive: [
                        {
                            chart: {
                                height: 220,
                                type: 'radialBar',
                                toolbar: {
                                    show: false,
                                    tools: {
                                        download: false,
                                    },
                                },
                            },
                            breakpoint: 400,
                            options: {
                                legend: {
                                    show: true,
                                    floating: true,
                                    fontSize: '10px',
                                    position: 'left',
                                    offsetX: 0,
                                    offsetY: -10,
                                    symbolWidth: 0,
                                    labels: {
                                        show: false,
                                        useSeriesColors: false,
                                    },
                                    markers: {
                                        width: 0,
                                        height: 0,
                                        strokeWidth: 0,
                                        strokeColor: '#fff',
                                    },
                                    formatter: function (seriesName, opts) {
                                        return seriesName;
                                    },
                                    itemMargin: {
                                        vertical: 3,
                                    },
                                },
                                responsive: [
                                    {
                                        breakpoint: 100,
                                        options: {
                                            plotOptions: {
                                                bar: {
                                                    horizontal: false,
                                                },
                                            },
                                            legend: {
                                                position: 'bottom',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                series: tempvalues,
            });
            setcategories([...temp]);
            setvalues([...tempvalues]);
            // alert(JSON.stringify(temp));
        }
    }, [FetchInsights.isSuccess, FetchInsights.data]);

    return (
        <div className="app w-100">
            <div className="row">
                <div className="mixed-chart">
                    <Chart options={state.options} series={state.series} type="area" width="480" height="200" />
                </div>
            </div>
        </div>
    );
};

export default Ratingtrend;
