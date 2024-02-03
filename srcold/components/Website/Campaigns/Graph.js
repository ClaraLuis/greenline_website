import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Graph = (props) => {
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
        if (props?.title != 'Leads') {
            var temp = [];
            var tempvalues = [{ name: props?.title, data: [] }];

            props?.data?.map((item, index) => {
                temp.push(item.name);
            });
            props?.data?.map((subitem, suindex) => {
                // tempvalues.push(subitem?.number?.toFixed(2));
                // tempvalues[0]?.data.push(subitem?.number);
                // tempvalues[0]?.data.push(Math.random(100).toFixed(1));
                tempvalues[0].data.push(parseFloat(subitem?.number)?.toFixed(2));
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
                    },
                    plotOptions: {
                        bar: {
                            distributed: true, // this line is mandatory
                            // horizontal: true,
                            // barHeight: '85%',
                        },
                    },
                    colors: [
                        // this array contains different color code for each data
                        '#ff4560',

                        '#008ffb',
                        '#808080',

                        '#feb019',
                    ],
                    xaxis: {
                        categories: temp,
                        labels: {
                            style: {
                                fontSize: '8px',
                                fontWeight: 500,
                            },
                        },
                    },
                },
                series: tempvalues,
            });
        } else {
            var temp = [];
            var tempvalues = [];
            props?.data?.map((item, index) => {
                temp.push(item.name);
            });
            props?.data?.map((subitem, suindex) => {
                // tempvalues.push(subitem?.number?.toFixed(2));
                // tempvalues[0]?.data.push(subitem?.number);
                // tempvalues.push(Math.random(100).toFixed(1));
                // tempvalues.push(parseFloat(Math.random() * (1000 - 100) + 100));
                tempvalues.push(subitem?.number != '-' ? parseFloat(subitem?.number) : parseFloat(0));
            });
            setstate({
                series: tempvalues,
                options: {
                    pie: {
                        startAngle: 0,
                        endAngle: 360,
                        expandOnClick: true,
                        offsetX: 0,
                        offsetY: 0,
                        customScale: 1,
                        dataLabels: {
                            offset: 0,
                            minAngleToShowLabel: 10,
                        },
                    },
                    colors: [
                        // this array contains different color code for each data
                        '#ff4560',

                        '#008ffb',
                        '#808080',

                        '#feb019',
                    ],
                    chart: {
                        width: 480,
                        height: 1000,
                        type: 'pie',
                        overflow: 'visible',
                    },
                    dataLabels: {
                        enabled: true,
                        show: true,
                        formatter: function (val, opts) {
                            return val.toFixed(1) + '%';
                        },
                    },

                    // tooltip: {
                    //     y: {
                    //         formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    //             return Math.round((parseFloat(value) / 100) * totalcount);
                    //         },
                    //     },
                    // },
                    labels: temp,
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                dataLabels: {
                                    enabled: false,
                                    show: false,
                                },
                                chart: {
                                    width: 270,
                                },

                                legend: {
                                    position: 'bottom',
                                    height: 300,
                                    flexDirection: 'column',
                                },
                            },
                        },
                    ],
                    legend: {
                        position: 'bottom',
                        offsetY: 0,
                        // height: 1000,
                        // show: props?.type == 'education' ? false : true,
                        minWidth: '10px',
                    },
                },
            });
        }

        setcategories([...temp]);
        setvalues([...tempvalues]);
        // alert(JSON.stringify(temp));
    }, [props]);

    return (
        <div className="app w-100 px-1">
            <div className="row">
                <div className="mixed-chart" style={{ width: '98%' }}>
                    <Chart options={state.options} series={state.series} type={props?.title == 'Leads' ? 'pie' : 'bar'} width="100%" height={props?.title == 'Leads' ? '250' : '200'} />
                </div>
            </div>
        </div>
    );
};

export default Graph;
