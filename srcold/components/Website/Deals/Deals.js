import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BiShowAlt } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation, useQuery } from 'react-query';
import reviewsstyles from './reviews.module.css';

// Icons
import { components } from 'react-select';
import API from '../../../API/API.js';
import { FiPlus } from 'react-icons/fi';
import DealInfo from './DealInfo.js';

const { ValueContainer, Placeholder } = components;

const Deals = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchDeals_API, FetchUsers_API, AssigntoPhaseMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonClicked, setbuttonClicked] = useState(false);

    const [importmodal, setimportmodal] = useState(false);
    const [ImportFileInput, setImportFileInput] = useState('');
    const [search, setsearch] = useState('');

    const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
    const [openModal, setopenModal] = useState(false);

    const [assignmodal, setassignmodal] = useState(false);
    const [assignpayload, setassignpayload] = useState({});
    const [dealspayload, setdealspayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        value: '',
        quantity: '',
        totalvalue: '',
        lead_id: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchDeals = useQuery(['FetchDeals_API' + JSON.stringify(filterobj)], () => FetchDeals_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filterusersobj, setfilterusersobj] = useState({
        page: 1,
        search: '',
    });
    const FetchUsers = useQuery(['FetchUsers_API' + JSON.stringify(filterusersobj)], () => FetchUsers_API({ filter: filterusersobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    useEffect(() => {
        setpageactive_context('/deals');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
        var page = 1;
        if (queryParameters.get('page') == undefined) {
        } else {
            page = queryParameters.get('page');
        }

        setfilterobj({ ...filterobj, page: page });
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Deals
                    </p>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {FetchDeals?.data?.data?.data?.length} </span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        {FetchDeals.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!FetchDeals.isFetching && FetchDeals.isSuccess && (
                            <>
                                {FetchDeals?.data?.data?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Deals
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {FetchDeals?.data?.data?.data?.length != 0 && (
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th style={{ minWidth: '100px' }} class="col-lg-1">
                                                #
                                            </th>
                                            <th>Lead</th>
                                            <th>Value</th>
                                            <th>Quantity</th>
                                            <th>Total Value</th>
                                            <th>Notes</th>
                                            <th>By</th>
                                            <th>Timestamp</th>
                                            <th>Show</th>
                                        </thead>
                                        <tbody>
                                            {FetchDeals?.data?.data?.data?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ minWidth: '100px' }} class="col-lg-1">
                                                            <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                                        </td>
                                                        <td>
                                                            <div class="row m-0 w-100 px-1 scrollmenuclasssubscrollbar" style={{ height: '100px', overflowY: 'scroll' }}>
                                                                {item?.lead?.lead_feilds?.map((i, i2) => {
                                                                    return (
                                                                        <p className={' col-lg-12 m-0 p-0 wordbreak '}>
                                                                            {i?.name}: {i?.value}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.value}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.quantity}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.totalvalue}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.notes}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.user?.email}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{dateformatter(item.created_at)}</p>
                                                        </td>
                                                        <td>
                                                            <BiShowAlt
                                                                onClick={() => {
                                                                    var temp = { ...item };
                                                                    temp.functype = 'edit';
                                                                    temp.email = item.email;
                                                                    temp.id = item.id;
                                                                    temp.lead_id = item?.lead?.id;
                                                                    temp.lead_feilds = item?.lead?.lead_feilds;

                                                                    setdealspayload({ ...temp });
                                                                    setopenModal(true);
                                                                }}
                                                                size={20}
                                                                class={reviewsstyles.icon + ' ml-2'}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                                <Pagespaginatecomponent
                                    totaldatacount={FetchDeals?.data?.data?.total}
                                    numofitemsperpage={FetchDeals?.data?.data?.per_page}
                                    pagenumbparams={FetchDeals?.data?.data?.current_page}
                                    nextpagefunction={(nextpage) => {
                                        history.push({
                                            pathname: '/phases',
                                            search: '&page=' + nextpage,
                                        });
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <DealInfo openModal={openModal} setopenModal={setopenModal} dealspayload={dealspayload} setdealspayload={setdealspayload} FetchDeals={FetchDeals} />
        </div>
    );
};
export default Deals;
