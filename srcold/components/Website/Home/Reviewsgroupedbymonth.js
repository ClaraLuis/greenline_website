import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import API from '../../../API/API';

const Reviewsgroupedbymonth = () => {
    const { FetchInsights_API } = API();
    const FetchInsights = useQuery(['FetchInsights_API'], () => FetchInsights_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
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
        if (FetchInsights.isSuccess && !FetchInsights.isFetching) {
            var temp = [];
            var tempvalues = [{ name: 'Count', data: [] }];

            FetchInsights?.data?.data?.reviewsgroupedbymonth?.map((item, index) => {
                temp.push(dateformatter(item.month));
                tempvalues[0]?.data?.push(parseFloat(item.c).toFixed(1));
            });
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
                        id: 'basic-bar',
                    },
                    xaxis: {
                        categories: temp,
                    },
                },
                series: tempvalues,
            });
            setcategories([...temp]);
            setvalues([...tempvalues]);
            // alert(JSON.stringify(temp));
        }
    }, [FetchInsights.isSuccess, FetchInsights.data]);

    return (
        <div className="app w-100">
            <div className="row">
                <div className="mixed-chart">
                    <Chart options={state.options} series={state.series} type="bar" width="480" height="200" />
                </div>
            </div>
        </div>
    );
};

export default Reviewsgroupedbymonth;
