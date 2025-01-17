import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { components } from 'react-select';
import cardstyles from '../components/Website/Generalfiles/CSS_GENERAL/input.module.css';
import formstyles from '../components/Website/Generalfiles/CSS_GENERAL/form.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import checkboxstyles from '../components/Website/Generalfiles/CSS_GENERAL/checkbox.module.css';
import generalstyles from '../components/Website/Generalfiles/CSS_GENERAL/general.module.css';

import { LanguageContext } from '../LanguageContext';

const { ValueContainer, Placeholder } = components;

const MultiSelect = (props) => {
    const { lang, setlang, langdetect } = useContext(LanguageContext);
    const searchMenuRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showmenu, setshowmenu] = useState(false);
    const [placeholder, setplaceholder] = useState('');
    const [search, setsearch] = useState('');

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Add filteredData state

    useEffect(() => {
        if (props?.attr) {
            if (props?.attr === 'findAllZones' && props?.options) {
                let newData = props?.options;
                // alert(JSON.stringify(newData));
                // Combine current data and new data, then filter out duplicates
                const mergedData = [...newData];
                const uniqueData = Array.from(new Set(mergedData.map((item) => item[props?.value]))).map((id) => {
                    return mergedData.find((item) => item[props?.value] === id);
                });
                setData(uniqueData); // Update data state with unique items

                // Handle filtering
                if (props?.filter?.name) {
                    const filtered = uniqueData.filter((item) => item[props?.label].toLowerCase().includes(props?.filter?.name.toLowerCase()));
                    setFilteredData(filtered);
                } else {
                    setFilteredData(uniqueData); // Update filteredData with unique items
                }
            } else if (props?.options?.data && !props?.options?.loading) {
                let newData = props?.attr === 'findAllDomesticGovernorates' ? props?.options?.data[props?.attr] || [] : props?.options?.data[props?.attr]?.data || [];

                // Combine current data and new data, then filter out duplicates
                const mergedData = [...data, ...newData];
                const uniqueData = Array.from(new Set(mergedData.map((item) => item[props?.value]))).map((id) => {
                    return mergedData.find((item) => item[props?.value] === id);
                });

                setData(uniqueData); // Update data state with unique items

                // Handle filtering
                if (props?.filter?.name) {
                    const filtered = uniqueData.filter((item) => item[props?.label].toLowerCase().includes(props?.filter?.name.toLowerCase()));
                    setFilteredData(filtered);
                } else {
                    setFilteredData(uniqueData); // Update filteredData with unique items
                }
            }
        } else {
            const newData = props?.options || [];
            const mergedData = [...data, ...newData];
            const uniqueData = Array.from(new Set(mergedData.map((item) => item[props?.value]))).map((id) => {
                return mergedData.find((item) => item[props?.value] === id);
            });
            setData(uniqueData);
            if (props?.filter?.name) {
                const filtered = newData.filter((item) => item[props?.label].toLowerCase().includes(value.toLowerCase()));

                setFilteredData(filtered);
            } else {
                setData(uniqueData);
                setFilteredData(uniqueData); // Update filteredData as well
            }
        }
    }, [props?.filter, props?.options?.data, props?.options?.loading, props?.options]);

    useEffect(() => {
        const handleScroll = () => {
            if (!searchMenuRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = searchMenuRef.current;

            // Trigger when reaching the bottom
            if (scrollTop + clientHeight >= scrollHeight - 1) {
                const cursor = props?.options?.data?.[props?.attr]?.cursor;
                if (cursor?.afterCursor) {
                    const currentScrollTop = scrollTop; // Save current scroll position

                    // Update the filter to fetch new data
                    props?.setfilter({
                        ...props?.filter,
                        afterCursor: cursor.afterCursor,
                        beforeCursor: null,
                    });

                    // Wait for DOM update, then restore scroll position
                    const observer = new MutationObserver(() => {
                        if (searchMenuRef.current) {
                            searchMenuRef.current.scrollTop = currentScrollTop; // Restore scroll position
                        }
                        observer.disconnect(); // Stop observing
                    });

                    observer.observe(searchMenuRef.current, { childList: true, subtree: true });
                }
            }
        };

        searchMenuRef.current?.addEventListener('scroll', handleScroll);
        return () => searchMenuRef.current?.removeEventListener('scroll', handleScroll);
    }, [props?.options?.data, props?.attr, props?.filter]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setsearch(value);

        if (value) {
            const filtered = data.filter((item) => item[props?.label].toLowerCase().includes(value.toLowerCase()));

            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (props?.setfilter) {
                props?.setfilter({
                    ...props?.filter,
                    name: search?.length ? search : undefined,
                });
            }
        }, 500); // Set delay to 500ms or any delay you prefer

        // Clean up the timer if the component unmounts or search changes
        return () => clearTimeout(debounceTimer);
    }, [search]);

    useEffect(() => {
        // Disable body scroll when the menu is open
        if (showmenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showmenu]);

    useEffect(() => {
        data?.map((item, index) => {
            if (item[props?.value] == props?.payload[props?.payloadAttr]) {
                setplaceholder(item[props?.label]);
            }
        });
    }, [props?.payload]);

    return (
        <>
            <div className="row m-0 w-100">
                <div className={`${cardstyles.formgroup} ${cardstyles.field}`}>
                    <label htmlFor="departments" className={cardstyles.formlabel}>
                        {props?.title}
                    </label>
                    <div
                        onClick={() => {
                            setIsFocused(true);
                            setshowmenu(true);
                        }}
                        className={cardstyles.formfield + ' d-flex align-items-center'}
                    >
                        <div
                            className=" row m-0 w-100"
                            style={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                flexWrap: 'nowrap',
                            }}
                        >
                            {props?.selected == undefined && <>All</>}
                            {props?.selected != undefined && (
                                <>
                                    {props?.selected?.map((selectedItem, selectedIndex) => {
                                        var value = '';
                                        filteredData?.map((i, ii) => {
                                            if (selectedItem == i[props?.value]) {
                                                value = i[props?.label];
                                            }
                                        });
                                        return <div class="mr-1">{value}, </div>;
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            right: langdetect === 'en' ? 10 : '',
                            left: langdetect === 'ar' ? 10 : '',
                            top: '55%',
                            fontSize: '13.5px',
                            width: '20px',
                            color: 'var(--primary)',
                        }}
                    >
                        {!isFocused && <i className="fa fa-chevron-down"></i>}
                        {isFocused && <i className="fa fa-chevron-up"></i>}
                    </div>
                </div>
                <div style={{ maxHeight: '200px', overflow: 'auto' }} ref={searchMenuRef} className={!showmenu ? `${cardstyles.searchmenu} row m-0 w-100` : `${cardstyles.searchmenushown} row m-0`}>
                    <div
                        className="blocker"
                        onClick={(e) => {
                            setshowmenu(false);
                            setIsFocused(false);
                        }}
                    ></div>
                    <div class="col-lg-12 py-2 px-1">
                        <input
                            type="text"
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                height: '25px',
                            }}
                            className={formstyles.form__field + ' p-2'}
                            value={search}
                            placeholder="search"
                            onChange={handleInputChange} // Update onChange handler
                        />
                    </div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            props?.onClick('All');
                        }}
                        className="col-lg-12 p-0"
                    >
                        <div style={{ cursor: 'pointer', zIndex: 1000, fontSize: '11px' }} className={cardstyles.searchitem}>
                            <div style={{ justifyContent: 'space-between' }} className={formstyles.companyname + ' row m-0 w-100 d-flex align-items-center'}>
                                {'All'}
                                <div className={' m-0 pt-1 pb-1 pl-2 pr-2 '} style={{ borderRadius: '5px' }}>
                                    <label className={`${generalstyles.checkbox} ${checkboxstyles.checkbox} ` + ' d-flex mb-0 '}>
                                        <input
                                            id={'all'}
                                            type="checkbox"
                                            onChange={(event) => {}}
                                            checked={props?.selected == undefined || props?.selected?.length == 0}
                                            className={checkboxstyles.checkboxinputstyles + ' mt-auto mb-auto '}
                                            // checked={fetchcustomercartQueryContext?.data?.data?.customercart.paymentmethod === 'cod' ? true : false}
                                        />
                                        <svg viewBox="0 0 21 21" className={checkboxstyles.svgstyles + ' h-100 '}>
                                            <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredData?.map((item, index) => {
                        var isSelected = false;
                        var selectedIndex = null;
                        if (props?.selected) {
                            props?.selected?.map((selected, selectedindex) => {
                                if (item[props?.value] === selected) {
                                    isSelected = true;
                                    selectedIndex = selectedindex;
                                }
                            });
                        }
                        return (
                            <div
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props?.onClick(item);
                                    // setshowmenu(false);
                                }}
                                className="col-lg-12 p-0"
                            >
                                <div style={{ cursor: 'pointer', zIndex: 1000, fontSize: '11px' }} className={cardstyles.searchitem}>
                                    <div style={{ justifyContent: 'space-between' }} className={formstyles.companyname + ' row m-0 w-100 d-flex align-items-center'}>
                                        {item[props?.label]}
                                        <div className={' m-0 pt-1 pb-1 pl-2 pr-2 '} style={{ borderRadius: '5px' }}>
                                            <label className={`${generalstyles.checkbox} ${checkboxstyles.checkbox} ` + ' d-flex mb-0 '}>
                                                <input
                                                    id={item[props?.label]}
                                                    type="checkbox"
                                                    onChange={(event) => {}}
                                                    checked={isSelected}
                                                    className={checkboxstyles.checkboxinputstyles + ' mt-auto mb-auto '}
                                                    // checked={fetchcustomercartQueryContext?.data?.data?.customercart.paymentmethod === 'cod' ? true : false}
                                                />
                                                <svg viewBox="0 0 21 21" className={checkboxstyles.svgstyles + ' h-100 '}>
                                                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                </svg>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MultiSelect;
