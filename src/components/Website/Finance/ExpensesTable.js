import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import shimmerstyles from '../Generalfiles/CSS_GENERAL/shimmer.module.css';
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

    return (
        <>
            {props?.loading && (
                <table className="table table-hover">
                    <thead style={{ position: 'sticky', top: '0px' }}>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>From Account</th>
                            <th>Amount</th>
                            <th>Receipt</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4].map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '40px', borderRadius: '4px' }}></div>
                                </td>
                                <td>
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '80px', borderRadius: '4px' }}></div>
                                </td>
                                <td>
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '120px', borderRadius: '4px' }}></div>
                                </td>
                                <td>
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '100px', borderRadius: '4px' }}></div>
                                </td>
                                <td>
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '80px', borderRadius: '4px' }}></div>
                                </td>
                                <td>
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '150px', borderRadius: '4px' }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <table className="table table-hover">
                <thead style={{ position: 'sticky', top: '0px' }}>
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
