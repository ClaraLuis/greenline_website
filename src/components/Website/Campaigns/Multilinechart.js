import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Multilinechart = (props) => {
    const [categories, setcategories] = useState([]);
    const [values, setvalues] = useState([]);
    const dateformatter = (date) => {
        // var string = date;

        const options = { year: 'numeric', day: 'long', day: 'numeric' };

        return new Date(date).toLocaleDateString(undefined, options);
    };
    const sortArrayByColumns = (array, columns) => {
        // Create a copy of the array to sort.
        const sortedArray = [...array];

        // Sort the array using the specified columns.
        sortedArray.sort((a, b) => {
            for (const column of columns) {
                var date1 = new Date(a[column]);
                var date2 = new Date(b[column]);
                const comparison = date1 - date2;

                // If the values are not equal, return the comparison result.
                if (comparison !== 0) {
                    return comparison;
                }
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
        var array = [];
        var temp = [];

        var tempvalues = [];

        props?.data?.map((item, index) => {
            var exist = false;
            tempvalues?.map((i, ii) => {
                if (item?.phase__name == i.name) {
                    exist = true;
                }
            });
            if (!exist) {
                tempvalues.push({ name: item?.phase__name, data: [] });
            }
        });

        props?.data?.map((subitem, subindex) => {
            var exist = false;
            var indexx = null;
            var index2 = null;

            var values = [];
            props?.data?.map((subitemm, subindexx) => {
                var exist = false;
                values?.map((i, ii) => {
                    if (subitemm?.phase__name == i.name) {
                        exist = true;
                    }
                });
                if (!exist) {
                    values.push({ name: subitemm?.phase__name, data: '' });
                }
            });
            var tempp = [...values];
            array?.map((i, ii) => {
                if (i?.time == subitem?.day) {
                    exist = true;
                    indexx = ii;
                }
            });

            values?.map((v, vv) => {
                if (v?.name == subitem?.phase__name) {
                    if (!exist) {
                        tempp[vv].data = subitem?.leadscount;
                    } else {
                        index2 = vv;
                    }
                }
            });

            if (exist) {
                array[indexx].values[index2].data = subitem?.leadscount;
            } else {
                array.push({
                    day: dateformatter(subitem.day),
                    time: subitem.day,
                    values: [...tempp],
                });
            }
        });
        var finaltempvalues = [...tempvalues];

        sortArrayByColumns(array, ['time'])?.map((i, ii) => {
            temp.push(dateformatter(i?.time));
            // alert(JSON.stringify(array));
            tempvalues?.map((itemm, index) => {
                finaltempvalues[index]?.data?.push(i?.values[index]?.data);
            });
        });
        setstate({
            series: finaltempvalues,

            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false,
                },
                stroke: {
                    // width: [0, 2, 5],
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
                markers: {
                    size: 0,
                },
                labels: temp,

                // xaxis: {
                //     categories: temp,
                //     labels: {
                //         style: {
                //             fontSize: '10px',
                //             fontWeight: 500,
                //         },
                //     },
                // },
                yaxis: {
                    title: {
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
                                return y.toFixed(0) + ' Leads';
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

export default Multilinechart;
