import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import API from '../../../API/API.js';
import AccountsTable from './AccountsTable.js';
import TransactionsTable from './TransactionsTable.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';
import SettlemantsTable from './SettlemantsTable.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import Cookies from 'universal-cookie';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import Select from 'react-select';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

const { ValueContainer, Placeholder } = components;

const MerchantSettlements = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, financialAccountTypeContext, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { paginateMerchantSettlements, useQueryGQL, fetchUsers, fetchMerchants, useMutationGQL, createFinancialAccount, updateFinancialAccount } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);

    const [filterobj, setfilterobj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const paginateMerchantSettlementsQuery = useQueryGQL('', paginateMerchantSettlements(), filterobj);
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/merchantsettlements');
        setpagetitle_context('Finance');
        setfilterobj({
            isAsc: false,
            limit: 20,
            afterCursor: undefined,
            beforeCursor: undefined,
        });
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' m-0 row w-100 '}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Merchant Settlements
                            </p>
                        </div>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}></div>
                    </div>
                </div>{' '}
                {cookies.get('userInfo')?.type == 'employee' && (
                    <div class="col-lg-12 px-3">
                        <div style={{ borderRadius: '0.25rem', background: 'white' }} class={generalstyles.card + ' col-lg-12'}>
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
                                                        <label class={formstyles.form__label}>Order by</label>
                                                        <Select
                                                            options={[
                                                                { label: 'Oldest', value: true },
                                                                { label: 'Latest', value: false },
                                                            ]}
                                                            styles={defaultstyles}
                                                            value={[
                                                                { label: 'Oldest', value: true },
                                                                { label: 'Latest', value: false },
                                                            ].find((option) => option.value === (filterobj?.isAsc ?? true))}
                                                            onChange={(option) => {
                                                                setfilterobj({ ...filterobj, isAsc: option?.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <MerchantSelectComponent
                                                    type="single"
                                                    label={'name'}
                                                    value={'id'}
                                                    payload={filterobj}
                                                    payloadAttr={'merchantId'}
                                                    onClick={(option) => {
                                                        if (option === 'All') {
                                                            setfilterobj({ ...filterobj, merchantId: undefined });
                                                        } else {
                                                            setfilterobj({ ...filterobj, merchantId: option.id });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                )}
                {isAuth([1, 51, 52, 122]) && (
                    <div class={' row m-0 w-100'}>
                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={paginateMerchantSettlementsQuery?.data?.paginateMerchantSettlements?.cursor?.beforeCursor}
                                afterCursor={paginateMerchantSettlementsQuery?.data?.paginateMerchantSettlements?.cursor?.afterCursor}
                                filter={filterobj}
                                setfilter={setfilterobj}
                            />
                        </div>
                        {paginateMerchantSettlementsQuery?.data?.paginateMerchantSettlements && (
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                <SettlemantsTable clickable={true} attr={'paginateMerchantSettlements'} paginateMerchantSettlementsQuery={paginateMerchantSettlementsQuery} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MerchantSettlements;
