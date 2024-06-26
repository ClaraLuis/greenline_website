import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { components } from 'react-select';
import cardstyles from '../components/Website/Generalfiles/CSS_GENERAL/input.module.css';

import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';

import { LanguageContext } from '../LanguageContext';

const { ValueContainer, Placeholder } = components;

const SelectComponent = (props) => {
    const { lang, setlang, langdetect } = useContext(LanguageContext);
    const searchMenuRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showmenu, setshowmenu] = useState(false);
    const [placeholder, setplaceholder] = useState('');

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Add filteredData state

    useEffect(() => {
        if (props?.options?.data && !props?.options?.loading) {
            const newData = props?.options?.data[props?.attr]?.data || [];
            const mergedData = [...data, ...newData];
            setData(mergedData);
            setFilteredData(mergedData); // Update filteredData as well
        }
    }, [props?.options?.data, props?.options?.loading]);

    useEffect(() => {
        const handleScroll = () => {
            if (searchMenuRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = searchMenuRef.current;
                if (scrollTop + clientHeight + 1 >= scrollHeight) {
                    const cursor = props?.options?.data?.[props?.attr]?.cursor;
                    if (cursor?.afterCursor !== null) {
                        props?.setfilter({
                            ...props?.filter,
                            afterCursor: cursor?.afterCursor,
                            beforeCursor: null,
                        });
                    }
                }
            }
        };

        if (searchMenuRef.current) {
            searchMenuRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (searchMenuRef.current) {
                searchMenuRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [props]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setplaceholder(value);
        if (value) {
            const filtered = data.filter((item) => item[props?.label].toLowerCase().includes(value.toLowerCase()));

            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

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
                    <input
                        onFocus={() => {
                            setIsFocused(true);
                            setshowmenu(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        name="department"
                        id="department"
                        type="text"
                        className={cardstyles.formfield}
                        value={placeholder}
                        onChange={handleInputChange} // Update onChange handler
                    />

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
                        }}
                    ></div>
                    {props?.options?.loading && (
                        <div className="col-lg-12 allcentered p-2">
                            <div>
                                <CircularProgress color="var(--greenprimary)" width="25px" height="25px" duration="1s" />
                            </div>
                        </div>
                    )}

                    {!props?.options?.loading && (
                        <>
                            {filteredData?.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        props?.onClick(item);
                                        setshowmenu(false);
                                    }}
                                    className="col-lg-12 p-0"
                                >
                                    <div style={{ cursor: 'pointer', zIndex: 1000 }} className={cardstyles.searchitem}>
                                        <div className={cardstyles.companyname}>{item[props?.label]}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectComponent;
