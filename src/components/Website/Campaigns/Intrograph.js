import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Intrograph = (props) => {
    const [categories, setcategories] = useState([]);
    const [values, setvalues] = useState([]);
    const dateformatter = (date) => {
        // var string = date;

        const options = { month: 'short' };
        return new Date(date).toLocaleDateString();
    };
    const sortArrayByColumns = (array) => {
        // Create a copy of the array to sort.
        const sortedArray = [...array];

        // Sort the array using the specified columns.
        sortedArray.sort((a, b) => {
            var date1 = new Date(a);
            var date2 = new Date(b);
            const comparison = date1 - date2;

            // If the values are not equal, return the comparison result.
            if (comparison !== 0) {
                return comparison;
            }
            // If all of the specified column values are equal, return 0.
            return 0;
        });

        // Return the sorted array.
        return sortedArray;
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
        var tempvalues = [{ name: props?.label, data: [] }];
        if (props?.data != undefined) {
            props?.data?.map((item, index) => {
                temp.push(dateformatter(item?.day));
                if (props?.type == undefined) {
                    tempvalues[0]?.data.push(parseInt(item?.leadscount));
                } else {
                    tempvalues[0]?.data.push(parseInt(item[props?.type]));
                }
            });
        } else {
            [...Array(30)].map((element, index) => {
                temp.push(dateformatter(element));
                tempvalues[0]?.data.push(Math.random(100).toFixed(1));
            });
        }

        // props?.data?.map((subitem, suindex) => {
        //     // tempvalues.push(subitem?.number?.toFixed(2));
        //     // tempvalues[0]?.data.push(subitem?.number);
        //     tempvalues[0]?.data.push(Math.random(100).toFixed(1));
        // });

        var finaltempvalues = [{ name: props?.label, data: [] }];
        var tempfinal = [];

        sortArrayByColumns(temp)?.map((i, ii) => {
            tempfinal.push(i);
            var indexx = null;
            temp.map((item, index) => {
                if (i == item) {
                    indexx = index;
                }
            });
            finaltempvalues[0].data.push(tempvalues[0]?.data[indexx]);
        });
        setstate({
            chart: {
                // width: '100%',
                toolbar: {
                    show: false,
                    tools: {
                        download: false,
                    },
                },
            },

            options: {
                dataLabels: {
                    enabled: false,
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: false,
                        },
                    },
                    yaxis: {
                        lines: {
                            show: false,
                        },
                    },
                },
                chart: {
                    toolbar: {
                        show: false,
                        tools: {
                            download: false,
                        },
                    },
                },
                colors: [props?.color],
                yaxis: {
                    floating: true,
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        show: false,
                    },
                    show: false,

                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },

                xaxis: {
                    categories: tempfinal,
                    show: false,
                    labels: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
            },
            series: finaltempvalues,
        });

        setcategories([...temp]);
        setvalues([...tempvalues]);
        // alert(JSON.stringify(temp));
    }, [props, props?.data, props?.type]);

    return (
        <div className="mixed-chart1 m-0 p-0" style={{ width: '108.5%', height: '8px', left: '-12px', bottom: '134%', position: 'absolute' }}>
            <Chart options={state.options} class="p-0" series={state.series} type={'area'} width="100%" height={'93'} />
        </div>
    );
};

export default Intrograph;
