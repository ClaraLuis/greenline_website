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
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io';

const { ValueContainer, Placeholder } = components;

const ExpensesTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { id: '1', type: 'salary', fromAccount: 'Account 1', amount: '1000', reciept: 'Reciept', comment: 'cc' },
        { id: '2', type: 'rent', fromAccount: 'Account 1', amount: '70000', reciept: 'Reciept', comment: 'cc' },
        { id: '3', type: 'fuel', fromAccount: 'Account 2', amount: '500', reciept: 'Reciept', comment: 'cc' },
    ]);

    const [payload, setpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: '',
        phone: '',
        email: '',
        birthdate: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    return (
        <>
            {/*       
      {fetchusers?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!fetchusers?.loading && fetchusers?.data != undefined && (
                            <>
                                {fetchusers?.data?.paginateUsers?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Users
                                            </div>
                                        </div>
                                    </div>
                                )} */}
            {/* {fetchusers?.data?.length != 0 && (
            
             
            )} */}
            <table style={{}} className={'table'}>
                <thead>
                    <th>#</th>
                    <th>Type</th>
                    <th>From Account</th>
                    <th>Amount</th>
                    <th>Reciept</th>
                    <th>Comment</th>
                </thead>
                <tbody>
                    {itemsarray?.map((item, index) => {
                        return (
                            <tr>
                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                </td>

                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item?.type}</p>
                                </td>

                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item?.fromAccount}</p>
                                </td>
                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item?.amount}</p>
                                </td>
                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item?.reciept}</p>
                                </td>
                                <td>
                                    <p className={' m-0 p-0 wordbreak '}>{item?.comment}</p>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
export default ExpensesTable;
