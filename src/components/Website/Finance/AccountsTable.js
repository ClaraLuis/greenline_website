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

const AccountsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { id: '1', name: 'Account 1', type: 'hub', user: 'User 1', merchant: 'Merchant 1', balance: '1000' },
        { id: '2', name: 'Account 2', type: 'merchant', user: 'User 1', merchant: 'Merchant 1', balance: '3000' },
        { id: '3', name: 'Account 3', type: 'bank', user: 'User 1', merchant: 'Merchant 2', balance: '40000' },
    ]);

    const [leadpayload, setleadpayload] = useState({
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

    const fetchusers = useQueryGQL('', fetchUsers());
    // const fetchusers = [];

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
            {fetchusers?.data?.length != 0 && (
                <table style={{}} className={props?.clickable ? 'table table_hover' : 'table'}>
                    <thead>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Merchant</th>
                        <th>Balance</th>
                    </thead>
                    <tbody>
                        {itemsarray?.map((item, index) => {
                            return (
                                <tr
                                    onClick={() => {
                                        if (props?.clickable) {
                                            history.push('/financialaccountinfo');
                                        }
                                    }}
                                >
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.name}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.type}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.user}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.merchant}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.balance}</p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                //     )}
                //     {/* <Pagespaginatecomponent
                //     totaldatacount={FetchUsers?.data?.data?.total}
                //     numofitemsperpage={FetchUsers?.data?.data?.per_page}
                //     pagenumbparams={FetchUsers?.data?.data?.current_page}
                //     nextpagefunction={(nextpage) => {
                //         history.push({
                //             pathname: '/users',
                //             search: '&page=' + nextpage,
                //         });
                //     }}
                // /> */}
                // </>
            )}
        </>
    );
};
export default AccountsTable;
