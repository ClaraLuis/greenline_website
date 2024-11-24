import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { components } from 'react-select';
import cardstyles from '../components/Website/Generalfiles/CSS_GENERAL/input.module.css';
import formstyles from '../components/Website/Generalfiles/CSS_GENERAL/form.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';

import { LanguageContext } from '../LanguageContext';

const SelectComponent = (props) => {
    const { langdetect } = useContext(LanguageContext);
    const searchMenuRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [placeholder, setPlaceholder] = useState('Select...');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Handle incoming options and filter updates
    useEffect(() => {
        if (props?.options?.data && !props?.options?.loading) {
            const newData = props?.options?.data[props?.attr]?.data || [];
            const mergedData = [...data, ...newData];
            const uniqueData = Array.from(new Set(mergedData.map((item) => item[props?.value]))).map((id) => mergedData.find((item) => item[props?.value] === id));

            setData(uniqueData);

            // Apply filter if applicable
            const filterText = props?.filter?.name?.toLowerCase() || '';
            setFilteredData(uniqueData.filter((item) => item[props?.label]?.toLowerCase().includes(filterText)));
        }
    }, [props?.options?.data, props?.options?.loading, props?.filter?.name]);

    // Handle infinite scroll for loading additional data
    useEffect(() => {
        const handleScroll = () => {
            if (!searchMenuRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = searchMenuRef.current;

            if (scrollTop + clientHeight >= scrollHeight - 1) {
                const cursor = props?.options?.data?.[props?.attr]?.cursor;
                if (cursor?.afterCursor) {
                    props?.setfilter({
                        ...props?.filter,
                        afterCursor: cursor.afterCursor,
                        beforeCursor: null,
                    });
                }
            }
        };

        searchMenuRef.current?.addEventListener('scroll', handleScroll);
        return () => searchMenuRef.current?.removeEventListener('scroll', handleScroll);
    }, [props]);

    // Update placeholder on payload change
    useEffect(() => {
        if (props?.payload) {
            const matchingItem = data.find((item) => item[props?.value] === props?.payload[props?.payloadAttr]);
            setPlaceholder(matchingItem ? matchingItem[props?.label] : props?.removeAll ? '' : 'All');
        }
    }, [props?.payload, data]);

    // Handle search input
    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearch(value);

        if (value) {
            setFilteredData(data.filter((item) => item[props?.label]?.toLowerCase().includes(value.toLowerCase())));
        } else {
            setFilteredData(data);
        }
    };

    // Debounce search filter update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (props?.setfilter) {
                props?.setfilter({
                    ...props?.filter,
                    name: search || undefined,
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, props]);

    useEffect(() => {
        // Disable body scroll when the menu is open
        if (showMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showMenu]);
    return (
        <div className="row m-0 w-100">
            <div className={`${cardstyles.formgroup} ${cardstyles.field}`}>
                <label htmlFor="departments" className={cardstyles.formlabel}>
                    {props?.title}
                </label>
                <div
                    onClick={() => {
                        if (!props?.disabled) {
                            setIsFocused(true);
                            setShowMenu(true);
                        }
                    }}
                    className={cardstyles.formfield}
                    style={{
                        cursor: props?.disabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    {placeholder}
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
                    <i className={`fa fa-chevron-${isFocused ? 'up' : 'down'}`}></i>
                </div>
            </div>

            {showMenu && (
                <div style={{ maxHeight: '200px', overflow: 'auto' }} ref={searchMenuRef} className={`${showMenu ? cardstyles.searchmenushown : cardstyles.searchmenu} row m-0 w-100`}>
                    <div
                        className="blocker"
                        onClick={() => {
                            setShowMenu(false);
                            setIsFocused(false);
                        }}
                    ></div>
                    <div className="col-lg-12 py-2 px-1">
                        <input
                            type="text"
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                height: '25px',
                            }}
                            className={`${formstyles.form__field} p-2`}
                            value={search}
                            placeholder="Search"
                            onChange={handleInputChange}
                        />
                    </div>

                    {props?.removeAll !== true && (
                        <div
                            onClick={() => {
                                props?.onClick(undefined);
                                setShowMenu(false);
                                setIsFocused(false);
                            }}
                            className="col-lg-12 p-0"
                        >
                            <div className={cardstyles.searchitem} style={{ cursor: 'pointer', fontSize: '11px' }}>
                                All
                            </div>
                        </div>
                    )}

                    {filteredData.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                props?.onClick(item);
                                setShowMenu(false);
                                setIsFocused(false);
                            }}
                            className="col-lg-12 p-0"
                        >
                            <div className={cardstyles.searchitem} style={{ cursor: 'pointer', fontSize: '11px' }}>
                                {item[props?.label]}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectComponent;
