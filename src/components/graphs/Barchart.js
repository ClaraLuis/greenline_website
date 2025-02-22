import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Barchart = (props) => {
    const [state, setstate] = useState(undefined);

    useEffect(() => {
        setstate({
            series: props?.yAxis,
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
                    gradient: {
                        inverseColors: false,
                        shade: 'light',
                        type: 'vertical',
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                        stops: [0, 100, 100, 100],
                    },
                },
                labels: props?.xAxis,
                markers: {
                    size: 0,
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '8px',
                            fontWeight: 500,
                        },
                    },
                },
                yaxis: {
                    labels: {
                        formatter: (value) => `${value} EGP`,
                    },
                    title: {
                        show: false,
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (value, context) {
                            console.log('Tooltip Context:', context); // Debugging
                            const seriesName = context.w.config.labels[context.dataPointIndex] || 'Unknown';
                            return `${value} EGP per ${seriesName}`;
                        },
                    },
                },
            },
        });
    }, [props]);

    if (state) {
        return (
            <div className="app w-100 px-1">
                <div className="row">
                    <div className="mixed-chart" style={{ width: '100%' }}>
                        <Chart options={state.options} series={state.series} type={'bar'} width="100%" height="250" />
                    </div>
                </div>
            </div>
        );
    } else {
        return <div className="app w-100 px-1"></div>;
    }
};

export default Barchart;
