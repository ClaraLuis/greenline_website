import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import Decimal from 'decimal.js';
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
                        title: {
                            display: 'none',
                            formatter: (seriesName) => '',
                        },
                        formatter: function (value, context) {
                            const totalValue = new Decimal(props?.total || 0);
                            const calculatedValue = new Decimal(value).dividedBy(100).times(totalValue);

                            // Get series name safely
                            const seriesName = context.config.labels[context.seriesIndex] || 'Unknown';

                            return `${props?.title} ${calculatedValue.toDecimalPlaces(0).toString()} per ${seriesName}`;
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
