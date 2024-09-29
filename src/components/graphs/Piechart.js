import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Piechart = (props) => {
    const [state, setstate] = useState(undefined);

    useEffect(() => {
        setstate({
            series: props?.yAxis,
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

                tooltip: {
                    y: {
                        formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                            return Math.round((parseFloat(value) / 100) * props?.total) + ' ' + props?.title;
                        },
                    },
                },
                labels: props?.xAxis,
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
                                height: 'auto',
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
    }, [props]);
    if (state) {
        return (
            <div className="app w-100 px-1">
                <div className="row">
                    <div className="mixed-chart" style={{ width: '100%' }}>
                        <Chart options={state.options} series={state.series} type={'pie'} width="100%" height={props?.height} />
                    </div>
                </div>
            </div>
        );
    } else {
        return <div className="app w-100 px-1"></div>;
    }
};

export default Piechart;
