// import React, { Component, useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
// import { useQuery } from 'react-query';
// import API from '../../../API/API';

// const ReviewsInsights = () => {
//     const { FetchHomeInsights_API } = API();
//     const FetchHomeInsights = useQuery(['FetchHomeInsights_API'], () => FetchHomeInsights_API(), {
//         keepPreviousData: true,
//         staleTime: Infinity,
//     });
//     const [categories, setcategories] = useState([]);
//     const [values, setvalues] = useState([]);
//     const dateformatter = (date) => {
//         // var string = date;

//         const options = { month: 'short' };
//         return new Date(date).toLocaleDateString(undefined, options);
//     };
//     const [state, setstate] = useState({
//         series: [76, 67, 61, 90],
//         options: {
//             chart: {
//                 height: 390,
//                 type: 'radialBar',
//             },
//             plotOptions: {
//                 radialBar: {
//                     offsetY: 0,
//                     startAngle: 0,
//                     endAngle: 270,
//                     hollow: {
//                         margin: 5,
//                         size: '30%',
//                         background: 'transparent',
//                         image: undefined,
//                     },
//                     dataLabels: {
//                         name: {
//                             show: false,
//                         },
//                         value: {
//                             show: false,
//                         },
//                     },
//                 },
//             },
//             colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
//             labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
//             legend: {
//                 show: true,
//                 floating: true,
//                 fontSize: '16px',
//                 position: 'left',
//                 offsetX: 160,
//                 offsetY: 15,
//                 labels: {
//                     useSeriesColors: true,
//                 },
//                 markers: {
//                     size: 0,
//                 },
//                 formatter: function (seriesName, opts) {
//                     return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
//                 },
//                 itemMargin: {
//                     vertical: 3,
//                 },
//             },
//             responsive: [
//                 {
//                     breakpoint: 480,
//                     options: {
//                         legend: {
//                             show: false,
//                         },
//                     },
//                 },
//             ],
//         },
//     });

//     useEffect(() => {
//         if (FetchHomeInsights.isSuccess && !FetchHomeInsights.isFetching) {
//             var temp = [...categories];
//             var tempvalues = [...values];

//             FetchHomeInsights?.data?.data?.reviewsgroupedbyjobs?.map((item, index) => {
//                 temp.push(dateformatter(item.jobname));
//                 tempvalues.push(item.percentage);
//             });
//             setstate({
//                 series: values,
//                 options: {
//                     chart: {
//                         height: 390,
//                         type: 'radialBar',
//                     },
//                     plotOptions: {
//                         radialBar: {
//                             offsetY: 0,
//                             startAngle: 0,
//                             endAngle: 270,
//                             hollow: {
//                                 margin: 5,
//                                 size: '30%',
//                                 background: 'transparent',
//                                 image: undefined,
//                             },
//                             dataLabels: {
//                                 name: {
//                                     show: false,
//                                 },
//                                 value: {
//                                     show: false,
//                                 },
//                             },
//                         },
//                     },
//                     colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
//                     labels: categories,
//                     legend: {
//                         show: true,
//                         floating: true,
//                         fontSize: '16px',
//                         position: 'left',
//                         offsetX: 160,
//                         offsetY: 15,
//                         labels: {
//                             useSeriesColors: true,
//                         },
//                         markers: {
//                             size: 0,
//                         },
//                         formatter: function (seriesName, opts) {
//                             return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
//                         },
//                         itemMargin: {
//                             vertical: 3,
//                         },
//                     },
//                     responsive: [
//                         {
//                             breakpoint: 480,
//                             options: {
//                                 legend: {
//                                     show: false,
//                                 },
//                             },
//                         },
//                     ],
//                 },
//             });
//             setcategories([...temp]);
//             setvalues([...tempvalues]);
//             // alert(JSON.stringify(temp));
//         }
//     }, [FetchHomeInsights.isSuccess, FetchHomeInsights.data]);

//     return (
//         <div className="app w-100">
//             <div className="row">
//                 <div className="mixed-chart">
//                     <Chart options={state.options} series={state.series} type="radialBars" width="550" height="300" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReviewsInsights;
import React, { Component } from 'react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import API from '../../../API/API';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
const ReviewsInsights = () => {
    const { FetchHomeInsights_API } = API();
    const FetchHomeInsights = useQuery(['FetchHomeInsights_API'], () => FetchHomeInsights_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [categories, setcategories] = useState([]);
    const [values, setvalues] = useState([]);
    const [state, setstate] = useState({
        series: [],
        options: {
            chart: {
                height: 390,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent',
                        image: undefined,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            show: false,
                        },
                    },
                },
            },
            colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
            labels: [],
            legend: {
                show: true,
                floating: true,
                fontSize: '16px',
                position: 'left',
                offsetX: 160,
                offsetY: 15,
                labels: {
                    useSeriesColors: true,
                },
                markers: {
                    size: 0,
                },
                formatter: function (seriesName, opts) {
                    return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
                },
                itemMargin: {
                    vertical: 3,
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false,
                        },
                    },
                },
            ],
        },
    });

    useEffect(() => {
        if (FetchHomeInsights.isSuccess && !FetchHomeInsights.isFetching) {
            var temp = [];
            var tempvalues = [];

            FetchHomeInsights?.data?.data?.reviewsgroupedbyjobs?.map((item, index) => {
                temp.push(item?.jobname);
                tempvalues.push(item?.percentage?.toFixed(1));
            });
            setstate({
                series: tempvalues,
                options: {
                    chart: {
                        height: 250,
                        type: 'radialBar',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                            },
                        },
                    },

                    plotOptions: {
                        radialBar: {
                            offsetY: 0,
                            offsetX: 25,
                            startAngle: 0,
                            endAngle: 270,
                            hollow: {
                                margin: 5,
                                size: '30%',
                                background: 'transparent',
                                image: undefined,
                            },
                            dataLabels: {
                                name: {
                                    show: false,
                                },
                                value: {
                                    show: false,
                                },
                            },
                        },
                    },
                    colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
                    labels: temp,
                    legend: {
                        show: true,
                        // floating: true,
                        fontSize: '10px',
                        position: 'left',
                        offsetX: -35,
                        offsetY: 5,
                        labels: {
                            useSeriesColors: true,
                        },
                        markers: {
                            width: 0,
                            height: 0,
                            strokeWidth: 0,
                            strokeColor: '#fff',
                        },
                        formatter: function (seriesName, opts) {
                            return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex] + '%';
                        },
                        itemMargin: {
                            vertical: 2,
                        },
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
                            },
                        },
                    ],
                },
            });
            setcategories([...temp]);
            setvalues([...tempvalues]);
            // alert(JSON.stringify(temp));
        }
    }, [FetchHomeInsights.isSuccess, FetchHomeInsights.data]);

    return (
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="radialBar" />
        </div>
    );
};
export default ReviewsInsights;
