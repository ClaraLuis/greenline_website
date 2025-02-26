import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Multilinechart = (props) => {
    const [chartConfig, setChartConfig] = useState({
        series: [],
        options: {
            chart: {
                height: 350,
                type: 'line',
                stacked: false,
            },
            stroke: {
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
            markers: {
                size: 0,
            },
            xaxis: {
                categories: [], // Dynamic categories from props
            },
            yaxis: {
                labels: {
                    formatter: (value) => `${value} EGP`, // Formats both positive and negative values
                },
                title: {
                    show: false,
                },
            },
            tooltip: {
                y: {
                    formatter: function (value, context) {
                        console.log('Tooltip Context:', context); // Debugging
                        const seriesName = context.w.config.series[context.seriesIndex]?.name || 'Unknown';
                        return `${value} EGP per ${seriesName}`;
                    },
                },
            },
        },
    });

    // Update the chart when props change
    useEffect(() => {
        if (props?.chartData && props?.xaxisCategories) {
            setChartConfig((prevConfig) => ({
                ...prevConfig,
                series: props.chartData, // Series from props
                options: {
                    ...prevConfig.options,
                    xaxis: {
                        categories: props.xaxisCategories, // X-axis labels from props
                    },
                },
            }));
        }
    }, [props.chartData, props.xaxisCategories]);

    return (
        <div className="app w-100 px-1">
            <div className="row">
                <div className="mixed-chart" style={{ width: '100%' }}>
                    <Chart options={chartConfig.options} series={chartConfig.series} type="line" width="100%" height="310" />
                </div>
            </div>
        </div>
    );
};

export default Multilinechart;
