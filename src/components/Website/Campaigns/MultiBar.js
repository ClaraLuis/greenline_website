import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import API from '../../../API/API.js';
import { LanguageContext } from '../../../LanguageContext.js';

const MultiBar = (props) => {
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
                const propertyA = a[column]?.toLowerCase();
                const propertyB = b[column]?.toLowerCase();
                return propertyA?.localeCompare(propertyB);
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
        var colors = [];

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

            var tempvalues = [];
            props?.data?.map((item, index) => {
                var exist = false;
                tempvalues?.map((i, ii) => {
                    if (item?.phase__name == i.name) {
                        exist = true;
                    }
                });
                if (!exist) {
                    tempvalues.push({ name: item?.phase__name, data: [], color: item?.phase__color });
                }
            });

            props?.data?.map((subitem, subindex) => {
                var exist = false;
                var indexx = null;
                var index2 = null;

                var values = [];
                tempvalues?.map((i, ii) => {
                    values.push({ name: i?.name, data: '' });
                });
                var tempp = [...values];

                array?.map((i, ii) => {
                    if (i?.user__user_profile__fname == subitem?.user__user_profile__fname) {
                        exist = true;
                        indexx = ii;
                    }
                });

                values?.map((v, vv) => {
                    if (v?.name == subitem?.phase__name) {
                        if (!exist) {
                            tempp[vv].data = subitem?.totalleadsinphase;
                        } else {
                            index2 = vv;
                        }
                    }
                });

                if (exist) {
                    array[indexx].values[index2].data = subitem?.totalleadsinphase;
                } else {
                    array.push({
                        user__user_profile__fname: subitem.user__user_profile__fname,
                        values: [...tempp],
                    });
                }
            });
            var finaltempvalues = [...tempvalues];

            sortArrayByColumns(array, ['user__user_profile__fname'])?.map((i, ii) => {
                temp.push(i?.user__user_profile__fname == null ? '' : i?.user__user_profile__fname);
                // alert(JSON.stringify(array));
                tempvalues?.map((itemm, index) => {
                    finaltempvalues[index]?.data?.push(i?.values[index]?.data?.length != 0 ? i?.values[index]?.data : 0);
                    colors.push(tempvalues[index]?.color);
                });
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

                colors: colors,
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: temp,
                    labels: {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            // textTransform: 'capitalize',
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
                    <Chart options={state.options} series={state.series} type={'bar'} width="100%" height="200" />
                </div>
            </div>
        </div>
    );
};

export default MultiBar;
