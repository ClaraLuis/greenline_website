import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import API from '../../../API/API';
import { LanguageContext } from '../../../LanguageContext.js';

const RatingTrend = (props) => {
    const { lang, langdetect } = useContext(LanguageContext);
    const [categories, setcategories] = useState([]);
    const [values, setvalues] = useState([]);
    const [category, setcategory] = useState([
        { label: lang.worklifebalanceandoverallwellbeing, value: 'rate_worklifebalance' },
        { label: lang.salaryandbenefits, value: 'rate_salaryandbenefits' },
        { label: lang.careergrowth, value: 'rate_promotionsandappraisal' },
        // { label: 'No', value: 'rate_jobsecurity' },
        // { label: 'No', value: 'rate_skilldevelopandlearning' },
        { label: lang.companyculture, value: 'rate_companyculture' },
        { label: lang.diversityandinclusion, value: 'rate_diversityandinclusion' },
        { label: lang.managementandleadershipcapabilities, value: 'rate_managementandleadershipcapabilities' },
    ]);
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
    const dateformatter = (date) => {
        // var string = date;

        const options = { year: 'numeric', day: 'numeric', day: 'numeric' };

        return new Date(date).toLocaleDateString();
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

                toolbar: {
                    show: false,
                    tools: {
                        download: false,
                    },
                },
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
        if (props?.type == 'line') {
            var temp = [];

            var tempvalues = [{ name: props?.title, data: [] }];

            props?.data?.map((item, index) => {
                //xaxis values
                var x = new Date(item?.day).toLocaleDateString();
                temp.push(x);
                //yaxis values
                tempvalues[0]?.data.push(item?.leadscount);
            });
        } else {
            var array = [];
            var temp = [];

            var tempvalues = [
                { name: props?.type == '%' ? 'Average ' : 'All', data: [] },
                { name: 'Meta', data: [] },
                { name: 'Tiktok', data: [] },
                { name: 'Snapchat', data: [] },
            ];
            props?.data1?.analyisPerDay?.map((item, index) => {
                if (props?.type == '%') {
                    var data1 = props?.data1?.analyisPerDay[index] != undefined ? props?.data1?.analyisPerDay[index][props?.fetch] : 0;
                    var data2 = props?.data2?.analyisPerDay[index] != undefined ? props?.data2?.analyisPerDay[index][props?.fetch] : 0;
                    var data3 = props?.data3?.analyisPerDay[index] != undefined ? props?.data3?.analyisPerDay[index][props?.fetch] : 0;

                    var allvalues = ((parseFloat(data1) / 100 + parseFloat(data2) / 100 + parseFloat(data3) / 100) / 3) * 100;
                } else {
                    var data1 = props?.data1?.analyisPerDay[index] != undefined ? props?.data1?.analyisPerDay[index][props?.fetch] : 0;
                    var data2 = props?.data2?.analyisPerDay[index] != undefined ? props?.data2?.analyisPerDay[index][props?.fetch] : 0;
                    var data3 = props?.data3?.analyisPerDay[index] != undefined ? props?.data3?.analyisPerDay[index][props?.fetch] : 0;
                    var allvalues = parseFloat(data1) + parseFloat(data2) + parseFloat(data3);
                }

                array.push({
                    day: dateformatter(item.day),
                    time: item.day,

                    values: [
                        { name: props?.type == '%' ? 'Average ' : 'All', data: parseFloat(allvalues).toFixed(2) },
                        { name: 'Meta', data: '' },
                        { name: 'Tiktok', data: '' },
                        { name: 'Snapchat', data: '' },
                    ],
                });
            });
            props?.data1?.analyisPerDay?.map((item, index) => {
                var exist = false;
                var indexx = null;
                array?.map((i, ii) => {
                    if (i?.day == dateformatter(item?.day)) {
                        exist = true;
                        indexx = ii;
                    }
                });
                if (exist) {
                    array[indexx].values[1].data = parseFloat(item[props?.fetch]).toFixed(2);
                } else {
                    array.push({
                        day: dateformatter(item.day),
                        time: item.day,

                        values: [
                            { name: props?.type == '%' ? 'Average ' : 'All', data: '' },
                            { name: 'Meta', data: parseFloat(item[props?.fetch]).toFixed(2) },
                            { name: 'Tiktok', data: '' },
                            { name: 'Snapchat', data: '' },
                        ],
                    });
                }
            });
            props?.data2?.analyisPerDay?.map((item, index) => {
                var exist = false;
                var indexx = null;
                array?.map((i, ii) => {
                    if (i?.day == dateformatter(item?.day)) {
                        exist = true;
                        indexx = ii;
                    }
                });
                if (exist) {
                    array[indexx].values[2].data = parseFloat(item[props?.fetch]).toFixed(2);
                } else {
                    array.push({
                        day: dateformatter(item.day),
                        time: item.day,

                        values: [
                            { name: props?.type == '%' ? 'Average ' : 'All', data: '' },
                            { name: 'Meta', data: '' },
                            { name: 'Tiktok', data: parseFloat(item[props?.fetch]).toFixed(2) },
                            { name: 'Snapchat', data: '' },
                        ],
                    });
                }
            });
            props?.data3?.analyisPerDay?.map((item, index) => {
                var exist = false;
                var indexx = null;
                array?.map((i, ii) => {
                    if (i?.day == dateformatter(item?.day)) {
                        exist = true;
                        indexx = ii;
                    }
                });
                if (exist) {
                    array[indexx].values[3].data = parseFloat(item[props?.fetch]).toFixed(2);
                } else {
                    array.push({
                        day: dateformatter(item.day),
                        time: item.day,

                        values: [
                            { name: props?.type == '%' ? 'Average ' : 'All', data: '' },
                            { name: 'Meta', data: '' },
                            { name: 'Tiktok', data: '' },
                            { name: 'Snapchat', data: parseFloat(item[props?.fetch]).toFixed(2) },
                        ],
                    });
                }
            });

            sortArrayByColumns(array, ['time'])?.map((i, ii) => {
                temp.push(i?.day);
                tempvalues[0]?.data?.push(i?.values[0]?.data);
                tempvalues[1]?.data?.push(i?.values[1]?.data);
                tempvalues[2]?.data?.push(i?.values[2]?.data);
                tempvalues[3]?.data?.push(i?.values[3]?.data);
            });
        }

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
                    // id: 'basic-bar',
                },

                colors: [
                    // this array contains different color code for each data
                    '#ff4560',

                    '#008ffb',
                    '#808080',

                    '#feb019',
                ],
                dataLabels: {
                    enabled: false,
                },
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
        // setcategories([...temp]);
        // setvalues([...tempvalues]);
        // alert(JSON.stringify(temp));
    }, [props?.data, props?.filter_ratingtrendcategory]);
    return (
        <div className="app w-100 px-1">
            <div className="row">
                <div className="mixed-chart" style={{ width: '98%' }}>
                    <Chart options={state.options} series={state.series} type={props?.title == 'Budget' ? 'line' : 'area'} width="100%" height="200" />
                </div>
            </div>
        </div>
    );
};

export default RatingTrend;
