// import React, { useContext, useEffect, useState } from 'react';
// import { Modal } from 'react-bootstrap';
// import { BiShowAlt } from 'react-icons/bi';
// import { IoMdClose } from 'react-icons/io';
// import { useHistory } from 'react-router-dom';
// import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
// import { LanguageContext } from '../../../LanguageContext.js';
// import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
// import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
// import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// // import { fetch_collection_data } from '../../../API/API';
// import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
// import { FaLayerGroup } from 'react-icons/fa';
// import { NotificationManager } from 'react-notifications';
// import { useMutation, useQuery } from 'react-query';
// import reviewsstyles from './reviews.module.css';

// // Icons
// import { components } from 'react-select';
// import API from '../../../API/API.js';
// import CallInfo from './CallInfo.js';

// const { ValueContainer, Placeholder } = components;

// const Calls = (props) => {
//     const queryParameters = new URLSearchParams(window.location.search);
//     let history = useHistory();
//     const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
//     const { FetchCalls_API } = API();

//     const { lang, langdetect } = useContext(LanguageContext);
//     const [buttonClicked, setbuttonClicked] = useState(false);

//     const [importmodal, setimportmodal] = useState(false);
//     const [ImportFileInput, setImportFileInput] = useState('');
//     const [search, setsearch] = useState('');

//     const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
//     const [openModal, setopenModal] = useState(false);

//     const [chosenitem, setchosenitem] = useState({});
//     const [leadpayload, setleadpayload] = useState({
//         functype: 'add',
//         id: 'add',
//         leadedists: '',
//         fname: '',
//         lname: '',
//         phonenumber: '',
//         email: '',
//         company_id: '',
//     });
//     const [filterobj, setfilterobj] = useState({
//         page: 1,
//         search: '',
//     });
//     const FetchCalls = useQuery(['FetchCalls_API' + JSON.stringify(filterobj)], () => FetchCalls_API({ filter: filterobj }), {
//         keepPreviousData: true,
//         staleTime: Infinity,
//     });
//     useEffect(() => {
//         setpageactive_context('/calls');
//         setpagetitle_context('dashboard');
//         document.title = 'Dashboard';
//         var page = 1;
//         if (queryParameters.get('page') == undefined) {
//         } else {
//             page = queryParameters.get('page');
//         }

//         setfilterobj({ ...filterobj, page: page });
//     }, []);
//     return <div class="row m-0 w-100 p-md-2 pt-2">Coming Soon..</div>;
// };
// export default Calls;

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
import CallInfo from './CallInfo.js';

const { ValueContainer, Placeholder } = components;

const Calls = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchCalls_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonClicked, setbuttonClicked] = useState(false);

    const [importmodal, setimportmodal] = useState(false);
    const [ImportFileInput, setImportFileInput] = useState('');
    const [search, setsearch] = useState('');

    const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
    const [openModal, setopenModal] = useState(false);

    const [chosenitem, setchosenitem] = useState({});
    const [callpayload, setcallpayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        lead_id: '',
        status: '',
        phase_id: '',
        group_id: '',
    });
    const [dealspayload, setdealspayload] = useState({
        functype: 'add',
        id: 'add',
        notes: '',
        value: '',
        quantity: '',
        totalvalue: '',
        lead_id: '',
    });

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
    const FetchCalls = useQuery(['FetchCalls_API' + JSON.stringify(filterobj)], () => FetchCalls_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    useEffect(() => {
        setpageactive_context('/calls');
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
                        Calls
                    </p>
                </div>

                {/* <div class="col-lg-12 pl-0">
                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                        <input
                            class={formstyles.form__field}
                            value={search}
                            placeholder="Search"
                            onChange={(event) => {
                                setsearch(event.target.value);
                                setTimeout(() => {
                                    setfilterobj({ ...filterobj, search: event.target.value });
                                }, 1000);
                            }}
                        />
                        <label class={formstyles.form__label}>{'Search'}</label>
                    </div>
                </div> */}
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {FetchCalls?.data?.data?.total} </span>
                        </p>
                    </div>

                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        {/* <button
                        class=" bg-secondaryhover avenirmedium allcentered mr-2 "
                        style={{
                            width: '20vh',
                            color: 'white',
                            fontSize: '1.8vh',
                            padding: '1.2vh',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '10px',
                        }}
                        onClick={() => {
                            setcallpayload({
                                functype: 'add',
                                id: 'add',
                                notes: '',
                                lead_id: '',
                                status: '',
                                phase_id: '',
                                group_id: '',
                            });
                            setopenModal(true);
                        }}
                    >
                        Add call
                    </button> */}
                        {/* <button
                        disabled={buttonClicked}
                        style={{
                            width: '20vh',
                            color: 'white',
                            fontSize: '1.8vh',
                            padding: '1.2vh',
                            backgroundColor: 'var(--info)',
                            borderRadius: '10px',
                        }}
                        onClick={async () => {
                            setbuttonClicked(true);
                            const axiosheaders = {
                                'Content-Type': 'multipart/form-data',
                            };
                            axios({
                                url: serverbaselink + '/api/userprofiles/exportusers',
                                method: 'GET',
                                responseType: 'blob',
                                headers: axiosheaders,
                            })
                                .then((response) => {
                                    if (response?.data != undefined) {
                                        // create file link in browser's memory
                                        const href = URL.createObjectURL(response.data);

                                        // create "a" HTML element with href to file & click
                                        const link = document.createElement('a');
                                        link.href = href;
                                        link.setAttribute('download', 'users.xlsx'); //or any other extension
                                        document.body.appendChild(link);
                                        link.click();

                                        // clean up "a" element & remove ObjectURL
                                        document.body.removeChild(link);
                                        URL.revokeObjectURL(href);
                                        setbuttonClicked(false);
                                    }
                                    // setisexportloading(false);
                                })
                                .catch((error) => {
                                    console.log(error);
                                    NotificationManager.error('', 'Error');
                                    setbuttonClicked(false);
                                });
                        }}
                    >
                        {!buttonClicked && <span>{lang.export}</span>}

                        {buttonClicked && <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />}
                    </button> */}
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        {FetchCalls.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!FetchCalls.isFetching && FetchCalls.isSuccess && (
                            <>
                                {FetchCalls?.data?.data?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                {'No Calls'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {FetchCalls?.data?.data?.data?.length != 0 && (
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th style={{ minWidth: '100px' }} class="col-lg-1">
                                                #
                                            </th>
                                            <th>Lead</th>
                                            <th>Phase/Group</th>
                                            <th style={{ minWidth: '100px' }}>Status</th>

                                            <th style={{ minWidth: '100px' }}>Duration</th>
                                            <th>Notes</th>
                                            <th>By</th>
                                            <th>Called at</th>
                                        </thead>
                                        <tbody>
                                            {FetchCalls?.data?.data?.data?.map((item, index) => {
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
                                                        <td>
                                                            <div class="row m-0 w-100 d-flex justify-content-center text-capitalize">
                                                                {item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length != 0 &&
                                                                    item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != undefined &&
                                                                    item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != null && (
                                                                        <>
                                                                            <span
                                                                                style={{
                                                                                    color:
                                                                                        item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length != 0 &&
                                                                                        item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != undefined &&
                                                                                        item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != null
                                                                                            ? ''
                                                                                            : '#a0a0a0',
                                                                                    fontSize:
                                                                                        item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length != 0 &&
                                                                                        item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != undefined &&
                                                                                        item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != null
                                                                                            ? ''
                                                                                            : '14px',
                                                                                }}
                                                                                class="  col-lg-12 allcentered mr-1"
                                                                            >
                                                                                Phase:{' '}
                                                                                <span class="mx-1" style={{ fontWeight: 700 }}>
                                                                                    {item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name?.length != 0 &&
                                                                                    item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != undefined &&
                                                                                    item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name != null
                                                                                        ? item?.lead?.phases_lead_lead_junc[item?.lead?.phases_lead_lead_junc?.length - 1]?.phase?.name
                                                                                        : '-'}
                                                                                </span>
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                {item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                    item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                    item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != null && (
                                                                        <>
                                                                            <span
                                                                                style={{
                                                                                    color:
                                                                                        item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                                        item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                                        item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != null
                                                                                            ? ''
                                                                                            : '#a0a0a0',
                                                                                    fontSize:
                                                                                        item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                                        item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                                        item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != null
                                                                                            ? ''
                                                                                            : '14px',
                                                                                }}
                                                                                class=" col-lg-12 allcentered mr-1"
                                                                            >
                                                                                Group:{' '}
                                                                                <span class="mx-1" style={{ fontWeight: 700 }}>
                                                                                    {item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name?.length != 0 &&
                                                                                    item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != undefined &&
                                                                                    item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name != null
                                                                                        ? item?.lead?.group_lead_lead_junc[item?.lead?.group_lead_lead_junc?.length - 1]?.group?.name
                                                                                        : '-'}
                                                                                </span>
                                                                            </span>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </td>
                                                        <td style={{ minWidth: '100px' }}>
                                                            <p className={' m-0 p-0 wordbreak '}>
                                                                <span
                                                                    style={{
                                                                        fontWeight: 600,
                                                                        color:
                                                                            item.status == 'active'
                                                                                ? 'var(--success)'
                                                                                : item.status == 'noanswer'
                                                                                ? 'var(--danger)'
                                                                                : item.status == 'userbusy'
                                                                                ? 'var(--info)'
                                                                                : 'var(--info)',
                                                                        fontSize: '13px',
                                                                    }}
                                                                >
                                                                    {item.status == 'active'
                                                                        ? 'Active'
                                                                        : item.status == 'noanswer'
                                                                        ? 'No Answer'
                                                                        : item.status == 'userbusy'
                                                                        ? 'User busy'
                                                                        : 'No Service'}
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td style={{ minWidth: '100px' }}>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.duration} min</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.notes}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak text-capitalize '}>
                                                                {item?.user?.user_profile?.fname} {item?.user?.user_profile?.lname}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak text-capitalize '}>{dateformatter(item?.created_at)}</p>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                                <Pagespaginatecomponent
                                    totaldatacount={FetchCalls?.data?.data?.total}
                                    numofitemsperpage={FetchCalls?.data?.data?.per_page}
                                    pagenumbparams={FetchCalls?.data?.data?.current_page}
                                    nextpagefunction={(nextpage) => {
                                        history.push({
                                            pathname: '/calls',
                                            search: '&page=' + nextpage,
                                        });
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <CallInfo
                openModal={openModal}
                setopenModal={setopenModal}
                callpayload={callpayload}
                setcallpayload={setcallpayload}
                dealspayload={dealspayload}
                setdealspayload={setdealspayload}
                meetingfolowuppayload={meetingfolowuppayload}
                setmeetingfolowuppayload={setmeetingfolowuppayload}
                FetchCalls={FetchCalls}
            />

            <Modal
                show={claimedcoinsmodel}
                onHide={() => {
                    setclaimedcoinsmodel(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Claimed Rewards</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setclaimedcoinsmodel(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={'row m-0 w-100 '}>
                        <div class=" m-0 mb-4 pl-2 pr-2 col-lg-12">
                            <p class={generalstyles.cardTitle + ' m-0 p-0 '} style={{ fontSize: '15px' }}>
                                {lang.tableformat}
                            </p>
                            <div class={'table_responsive  scrollmenuclasssubscrollbar'}>
                                <table className={' table  mb-0'}>
                                    <thead className="">
                                        <th style={{ minWidth: '100px' }} class="col-lg-1">
                                            id
                                        </th>
                                        <th>ref_Code</th>
                                        <th>User Name</th>
                                        <th>Email</th>
                                    </thead>
                                </table>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            className={`${formstyles.form_control}` + ' mb-4 mt-2 '}
                            onChange={(event) => {
                                setImportFileInput(event.target.files[0]);
                            }}
                            id="importinput"
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Calls;
