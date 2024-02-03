import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Mixedchart = (props) => {
    const [categories, setcategories] = useState([]);
    const [values, setvalues] = useState([]);
    const dateformatter = (date) => {
        // var string = date;

        const options = { year: 'numeric', day: 'long', day: 'numeric' };

        return new Date(date).toLocaleDateString();
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
            tempvalues.push({ name: item?.name, data: [], type: item?.charttype });
        });

        props?.data?.map((subitem, subindex) => {
            subitem?.data?.map((subitemm, subindexx) => {
                // alert(JSON.stringify(array));
                var values = [];
                props?.data?.map((itemm, itemmindex) => {
                    values.push({ name: itemm?.name, data: '' });
                });
                var tempp = [...values];
                var exist = false;
                var indexx = null;
                var index2 = null;

                array?.map((i, ii) => {
                    if (dateformatter(i?.time) == dateformatter(subitemm?.day)) {
                        exist = true;
                        indexx = ii;
                    }
                });
                values?.map((v, vv) => {
                    if (v?.name == subitem?.name) {
                        if (!exist) {
                            var x = subitemm != undefined && subitemm?.length != 0 ? subitemm[subitem?.type] : 0;

                            tempp[vv].data = x;
                        } else {
                            index2 = vv;
                        }
                    }
                });

                if (exist) {
                    var x = subitemm != undefined && subitemm?.length != 0 ? subitemm[subitem?.type] : 0;
                    array[indexx].values[index2].data = x;
                } else {
                    array.push({
                        day: dateformatter(subitemm.day),
                        time: subitemm.day,
                        values: [...tempp],
                    });
                }
            });
        });

        var finaltempvalues = [...tempvalues];

        sortArrayByColumns(array, ['time'])?.map((i, ii) => {
            temp.push(dateformatter(i?.time));
            // alert(JSON.stringify(array));
            tempvalues?.map((itemm, index) => {
                finaltempvalues[index]?.data?.push(i?.values[index]?.data?.length != 0 ? i?.values[index]?.data : 0);
            });
        });
        // alert(JSON.stringify(finaltempvalues));
        setstate({
            series: finaltempvalues,

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
                labels: temp,
                markers: {
                    size: 0,
                },
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    title: {
                        text: '',
                    },
                    min: 0,
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== 'undefined') {
                                return y.toFixed(0);
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
