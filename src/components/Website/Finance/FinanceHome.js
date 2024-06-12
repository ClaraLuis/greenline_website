import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import TransactionsTable from './TransactionsTable.js';
import AccountsTable from './AccountsTable.js';
import OrdersTable from '../Orders/OrdersTable.js';
import ExpensesTable from './ExpensesTable.js';

const { ValueContainer, Placeholder } = components;

const FinanceHome = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, dateformatter } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    useEffect(() => {
        setpageactive_context('/financehome');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            {isAuth([1, 51, 18]) && (
                <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                            Dashboard
                        </p>
                    </div>
                    {/* <div style={{ borderRadius: '0px', background: 'white' }} class={' mb-3 col-lg-12 p-2'}>
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
                                                 <BsChevronDown />
                                             </i>
                                         );
                                     } else {
                                         return (
                                             <i class="h-100 d-flex align-items-center justify-content-center">
                                                 <BsChevronUp />
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
                     <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                         <label for="name" class={formstyles.form__label}>
                             Inventories
                         </label>
                         <Select
                             options={[
                                 { label: 'Inv 1', value: '1' },
                                 { label: 'Inv 2', value: '2' },
                             ]}
                             styles={defaultstyles}
                             value={
                                 [
                                     { label: 'Inv 1', value: '1' },
                                     { label: 'Inv 2', value: '2' },
                                 ]
                                 // .filter((option) => option.value == props?.payload[item?.attr])
                             }
                             onChange={(option) => {
                                 // props?.setsubmit(false);
                                 // var temp = { ...props?.payload };
                                 // temp[item?.attr] = option.value;
                                 // props?.setpayload({ ...temp });
                             }}
                         />
                     </div>
                     <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                         <label for="name" class={formstyles.form__label}>
                             Merchant
                         </label>
                         <Select
                             options={[
                                 { label: 'Merch 1', value: '1' },
                                 { label: 'Merch 2', value: '2' },
                             ]}
                             styles={defaultstyles}
                             value={
                                 [
                                     { label: 'Merch 1', value: '1' },
                                     { label: 'Merch 2', value: '2' },
                                 ]
                                 // .filter((option) => option.value == props?.payload[item?.attr])
                             }
                             onChange={(option) => {
                                 // props?.setsubmit(false);
                                 // var temp = { ...props?.payload };
                                 // temp[item?.attr] = option.value;
                                 // props?.setpayload({ ...temp });
                             }}
                         />
                     </div>
                 </div>
             </AccordionItemPanel>
         </AccordionItem>
     </Accordion>
 </div> */}
                    {/* <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-2'}>
     <div class="col-lg-12 p-0 ">
         <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
             <input
                 // disabled={props?.disabled}
                 // type={props?.type}
                 class={formstyles.form__field}
                 // value={}
                 placeholder={'Search by name or SKU'}

                 // onChange={}
             />
         </div>
     </div>
 </div> */}

                    <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                        <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                            <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                                <span style={{ color: 'var(--info)' }}>Financial Accounts</span>
                            </p>
                        </div>
                        <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <AccountsTable />
                        </div>
                    </div>

                    <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                        <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                            <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                                <span style={{ color: 'var(--info)' }}>Orders History</span>
                            </p>
                        </div>
                        <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <OrdersTable />
                        </div>
                    </div>

                    <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                        <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                            <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                                <span style={{ color: 'var(--info)' }}>Expenses</span>
                            </p>
                        </div>
                        <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <ExpensesTable />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default FinanceHome;
