import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Barchart = (props) => {
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
        var tempvalues = [{ name: props?.type, data: [] }];
        props?.data?.map((item, index) => {
            if (props?.type == 'Leads') {
                temp.push(item.name);
                tempvalues[0]?.data?.push(item?.leadscount);
            } else {
                //xaxis values
                var x = new Date(item?.day).toLocaleDateString();
                temp.push(x);
                //yaxis values
                tempvalues[0]?.data.push(item?.leadscount);
            }
        });

        setstate({
            series: tempvalues,
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    stacked: false,
                },
                stroke: {
                    width: [0, 2, 5],
                    curve: 'smooth',
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%',
                    },
                },
                fill: {
                    // opacity: [0.85, 0.25, 1],
                    gradient: {
                        inverseColors: false,
                        shade: 'light',
                        type: 'vertical',
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                        stops: [0, 100, 100, 100],
                    },
                },
                labels: temp,
                markers: {
                    size: 0,
                },
                xaxis: {
                    // type: 'datetime',
                    labels: {
                        style: {
                            fontSize: '8px',
                            fontWeight: 500,
                        },
                    },
                },
                yaxis: {
                    title: {
                        show: false,
                        // text: 'Points',
                    },
                    min: 0,
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== 'undefined') {
                                return y + ' Leads';
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
                    <Chart options={state.options} series={state.series} type={'bar'} width="100%" height="250" />
                </div>
            </div>
        </div>
    );
};

export default Barchart;
