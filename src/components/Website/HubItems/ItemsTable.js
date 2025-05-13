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

const { ValueContainer, Placeholder } = components;

const ItemsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const fetchusers = useQueryGQL('', fetchUsers());

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
                <table className="table table-hover">
                    <thead style={{ position: 'sticky', top: '0px' }}>
                        <th style={{ minWidth: '100px', maxWidth: '100px' }}>SKU</th>
                        <th>Name</th>

                        <th>Size</th>

                        <th>Color</th>
                        <th>Count in Inventory</th>
                        <th>Merchant name</th>
                    </thead>
                    <tbody>
                        {itemsarray?.map((item, index) => {
                            return (
                                <tr>
                                    <td style={{ minWidth: '100px', maxWidth: '100px' }}>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.sku}</p>
                                    </td>
                                    <td>
                                        <div class="row m-0 w-100">
                                            <div style={{ width: '50px', height: '50px', borderRadius: '7px', marginInlineEnd: '10px' }}>
                                                <img
                                                    src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                />
                                            </div>
                                            <div>
                                                <p className={' m-0 p-0 wordbreak '}>{item?.name}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.size}</p>
                                    </td>
                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.color}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.countinventory}</p>
                                    </td>

                                    <td>
                                        <p className={' m-0 p-0 wordbreak '}>{item?.merchantname}</p>
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
export default ItemsTable;
