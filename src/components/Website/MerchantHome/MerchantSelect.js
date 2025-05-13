import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import Cookies from 'universal-cookie';
import SelectComponent from '../../SelectComponent.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';

const { ValueContainer, Placeholder } = components;

const MerchantSelect = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const cookies = new Cookies();
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth, setchosenMerchantContext, chosenMerchantContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchMerchants } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            {isAuth([1]) && (
                <div style={{ borderRadius: '0.25rem', background: 'white' }} class={generalstyles.card + '  col-lg-12 '}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                            <AccordionItemState>
                                                {(state) => {
                                                    if (state.expanded == true) {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    }
                                                }}
                                            </AccordionItemState>
                                        </div>
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <hr className="mt-2 mb-3" />
                                <div class="row m-0 w-100">
                                    <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                        <div class="row m-0 w-100  ">
                                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                <label class={formstyles.form__label}>Order</label>
                                                <Select
                                                    options={[
                                                        { label: 'Ascending', value: true },
                                                        { label: 'Descending', value: false },
                                                    ]}
                                                    styles={defaultstyles}
                                                    value={[
                                                        { label: 'Ascending', value: true },
                                                        { label: 'Descending', value: false },
                                                    ].find((option) => option.value === (props?.filter?.isAsc ?? true))}
                                                    onChange={(option) => {
                                                        props?.setfilter({ ...props?.filter, isAsc: option?.value });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                        <MerchantSelectComponent
                                            type="single"
                                            payload={props?.filter}
                                            payloadAttr={'merchantId'}
                                            label={'name'}
                                            value={'id'}
                                            onClick={(option) => {
                                                setchosenMerchantContext(option);
                                                props?.setFilter({ ...props?.filter, merchantId: option?.id });
                                                // cookies.set('merchantId', option?.id);
                                            }}
                                        />
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    );
};
export default MerchantSelect;
