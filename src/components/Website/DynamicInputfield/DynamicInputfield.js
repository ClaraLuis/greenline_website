import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { components } from 'react-select';
import cardstyles from '../Generalfiles/CSS_GENERAL/menu.module.css';

const { ValueContainer, Placeholder } = components;

const DynamicInputfield = (props) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showmenu, setshowmenu] = useState(false);
    const [placeholder, setplaceholder] = useState('');

    return (
        <>
            <div class="row m-0 w-100  ">
                <div class={`${cardstyles.formgroup} ${cardstyles.field}`}>
                    <input
                        onFocus={() => {
                            setIsFocused(true);
                            setshowmenu(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        readonly
                        type={props?.type}
                        class={cardstyles.formfield}
                        value={placeholder}
                        onChange={(event) => {
                            setplaceholder(event.target.value);
                            var temp = { ...props?.payload };
                            temp[props?.attribute] = event.target.value;
                            props?.setpayload({ ...temp });
                        }}
                    />
                    {/* <div
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 30,
                            fontSize: '13.5px',
                            width: '20px',
                            color: 'rgba(0, 145, 64, 1)',
                        }}
                    >
                        {!isFocused && <i class={' fa fa-chevron-down '}></i>}
                        {isFocused && <i class={' fa fa-chevron-up '}></i>}
                    </div> */}
                </div>{' '}
                <div style={{ maxHeight: '200px' }} class={!showmenu ? cardstyles.searchmenu + ' row m-0 w-100 ' : cardstyles.searchmenushown + ' row m-0 '}>
                    <div
                        class="blocker"
                        onClick={(e) => {
                            e.stopPropagation();

                            setshowmenu(false);
                        }}
                    ></div>

                    {props?.options
                        ?.filter((row) => !placeholder?.length || row[props?.optionLabel].toString().toLowerCase().includes(placeholder.toString().toLowerCase()))
                        .map((item, index) => {
                            return (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setplaceholder(item[props?.optionLabel]);
                                        var temp = { ...props?.payload };
                                        temp[props?.attribute] = item[props?.optionValue];
                                        props?.setpayload({ ...temp });
                                        setshowmenu(false);
                                    }}
                                    class="col-lg-12 p-0"
                                >
                                    <div style={{ cursor: 'pointer', zIndex: 1000 }} class={cardstyles.searchitem}>
                                        <div class={cardstyles.companyname}>{item[props?.optionLabel]}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default DynamicInputfield;
