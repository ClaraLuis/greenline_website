import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Mixedchart = (props) => {
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
        var temp = [];
        var tempvalues = [{ name: props?.title, data: [] }];
        props?.data?.map((item, index) => {
            temp.push(item.name);
        });
        // props?.data?.map((subitem, suindex) => {
        //     // tempvalues.push(subitem?.number?.toFixed(2));
        //     // tempvalues[0]?.data.push(subitem?.number);
        //     tempvalues[0]?.data.push(Math.random(100).toFixed(1));
        // });
        [...Array(20)].map((element, index) => {
            temp.push(dateformatter(element));
            tempvalues[0]?.data.push(Math.random(100).toFixed(1));
        });
        setstate({
            series: [
                {
                    name: props?.data[0]?.name,
                    type: 'area',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                    name: props?.data[1]?.name,

                    type: 'column',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                    name: props?.data[2]?.name,

                    type: 'line',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
                {
                    name: props?.data[3]?.name,

                    type: 'line',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
            ],
            options: {
                colors: [
                    // this array contains different color code for each data
                    '#00e396',

                    '#008ffb',

                    '#feb019',

                    '#ff4560',
                ],
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false,
                },
                stroke: {
                    width: [2, 2, 5, 5],
                    curve: 'smooth',
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%',
                    },
                },
                fill: {
                    opacity: [0.25, 1, 0.85, 1],
                    gradient: {
                        inverseColors: false,
                        shade: 'light',
                        type: 'vertical',
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                        stops: [0, 100, 100, 100],
                    },
                },
                labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
                markers: {
                    size: 0,
                },
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    title: {
                        text: 'Points',
                    },
                    min: 0,
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== 'undefined') {
                                return y.toFixed(0) + ' points';
                            }
                            return y;
                        },
                    },
                },
            },
        });

        setcategories([...temp]);
        setvalues([...tempvalues]);
        // alert(JSON.stringify(temp));
    }, [props]);

    return (
        <div className="app w-100 px-1">
            <div className="row">
                <div className="mixed-chart" style={{ width: '100%' }}>
                    <Chart options={state.options} series={state.series} type={'line'} width="100%" height="310" />
                </div>
            </div>
        </div>
    );
};

export default Mixedchart;
