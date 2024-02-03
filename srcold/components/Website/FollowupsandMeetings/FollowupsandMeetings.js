import React, { useContext, useEffect, useState } from 'react';
import { BiShowAlt } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { useQuery } from 'react-query';
import reviewsstyles from './reviews.module.css';

// Icons
import { components } from 'react-select';
import API from '../../../API/API.js';
import MeetingandFollowup from '../Calls/MeetingandFollowup.js';

const { ValueContainer, Placeholder } = components;

const FollowupsandMeetings = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchFollowups_API, FetchMeetings_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonClicked, setbuttonClicked] = useState(false);

    const [importmodal, setimportmodal] = useState(false);
    const [ImportFileInput, setImportFileInput] = useState('');
    const [search, setsearch] = useState('');

    const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [meetingfolowupmodal, setmeetingfolowupmodal] = useState({ open: false, type: '' });

    const [assignmodal, setassignmodal] = useState(false);

    const [meetingfolowuppayload, setmeetingfolowuppayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        date: '',
        time: '',
        followupstatus: '',
        meetingstatus: '',
        priority: '',
        lead_id: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchFollowups = useQuery(['FetchFollowups_API' + JSON.stringify(filterobj)], () => FetchFollowups_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [fetch, setfetch] = useState(FetchFollowups);

    const FetchMeetings = useQuery(['FetchMeetings_API' + JSON.stringify(filterobj)], () => FetchMeetings_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filterusersobj, setfilterusersobj] = useState({
        page: 1,
        search: '',
    });

    useEffect(() => {
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
        var page = 1;
        var type = '';

        if (queryParameters.get('page') == undefined) {
        } else {
            page = queryParameters.get('page');
        }

        if (queryParameters.get('type') == undefined) {
        } else {
            type = queryParameters.get('type');
            // meeting followup
        }

        setmeetingfolowupmodal({ open: false, type: type });
        setpageactive_context(type == 'meeting' ? '/encounters?type=meeting' : '/encounters?type=followup');
        setfetch(type == 'meeting' ? FetchMeetings : FetchFollowups);
        setfilterobj({ ...filterobj, page: page });
    }, [FetchMeetings?.data, FetchFollowups?.data, queryParameters.get('type')]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        {meetingfolowupmodal?.type == 'meeting' ? 'Meetings' : 'Followups'}
                    </p>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                            <span style={{ color: 'var(--info)' }}> {fetch?.data?.data?.data?.length} </span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        {fetch.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!fetch.isFetching && fetch.isSuccess && (
                            <>
                                {fetch?.data?.data?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                {meetingfolowupmodal?.type == 'meeting' ? 'No Meetings' : 'No Followups'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {fetch?.data?.data?.data?.length != 0 && (
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th style={{ minWidth: '100px' }} class="col-lg-1">
                                                #
                                            </th>
                                            <th>Lead</th>
                                            {meetingfolowupmodal?.type == 'followup' && <th>Priority</th>}
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Notes</th>
                                            <th>By</th>

                                            <th>Show</th>
                                        </thead>
                                        <tbody>
                                            {fetch?.data?.data?.data?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ minWidth: '100px' }} class="col-lg-1">
                                                            <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                                        </td>
                                                        <td>
                                                            <div class="row m-0 w-100 px-1 scrollmenuclasssubscrollbar" style={{ height: '100px', overflowY: 'scroll' }}>
                                                                {item?.lead?.lead_feilds?.map((i, i2) => {
                                                                    return (
                                                                        <p className={' col-lg-12 m-0 wordbreak '}>
                                                                            {i?.name}: {i?.value}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                        {meetingfolowupmodal?.type == 'followup' && (
                                                            <td>
                                                                <p className={' m-0 p-0 wordbreak text-capitalize'}>{item?.priority}</p>
                                                            </td>
                                                        )}
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak text-capitalize '}>
                                                                {meetingfolowupmodal?.type == 'followup' ? item?.followupstatus : item?.meetingstatus}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.date}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.time?.length == 0 || item?.time == null ? '-' : item?.time}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.notes}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.user?.email}</p>
                                                        </td>
                                                        <td>
                                                            <BiShowAlt
                                                                onClick={() => {
                                                                    var temp = { ...item };
                                                                    temp.functype = 'edit';
                                                                    temp.email = item.email;
                                                                    temp.id = item.id;
                                                                    temp.lead_id = item?.lead?.id;
                                                                    setmeetingfolowuppayload({ ...temp });
                                                                    setopenModal(true);
                                                                    setmeetingfolowupmodal({ ...meetingfolowupmodal, open: true });
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
                                    totaldatacount={FetchFollowups?.data?.data?.total}
                                    numofitemsperpage={FetchFollowups?.data?.data?.per_page}
                                    pagenumbparams={FetchFollowups?.data?.data?.current_page}
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

            <MeetingandFollowup
                openModal={meetingfolowupmodal}
                setopenModal={setmeetingfolowupmodal}
                callpayload={meetingfolowuppayload}
                setcallpayload={setmeetingfolowuppayload}
                FetchLeads={meetingfolowupmodal?.type == 'meeting' ? FetchMeetings : FetchFollowups}
            />
        </div>
    );
};
export default FollowupsandMeetings;
