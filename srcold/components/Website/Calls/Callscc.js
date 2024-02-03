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
    const { FetchLeads_API } = API();

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
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchLeads = useQuery(['FetchLeads_API' + JSON.stringify(filterobj)], () => FetchLeads_API({ filter: filterobj }), {
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
                        <span style={{ color: 'var(--info)' }}> {FetchLeads?.data?.data?.total}</span> Calls
                    </p>
                </div>

                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
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
                    </button>
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
                <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                    {FetchLeads.isFetching && (
                        <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                            <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                        </div>
                    )}
                    {!FetchLeads.isFetching && FetchLeads.isSuccess && (
                        <>
                            {FetchLeads?.data?.data?.data?.length == 0 && (
                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            No Calls
                                        </div>
                                    </div>
                                </div>
                            )}
                            {FetchLeads?.data?.data?.data?.length != 0 && (
                                <table style={{}} className={'table'}>
                                    <thead>
                                        <th style={{ minWidth: '100px' }} class="col-lg-1">
                                            #
                                        </th>
                                        <th>Phase Name</th>

                                        <th>Show</th>
                                        <th>Timestamp</th>
                                    </thead>
                                    <tbody>
                                        {FetchLeads?.data?.data?.data?.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td style={{ minWidth: '100px' }} class="col-lg-1">
                                                        <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                                    </td>

                                                    <td>
                                                        <p className={' m-0 p-0 wordbreak '}>
                                                            {item?.fname} {item?.lname}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <BiShowAlt
                                                            onClick={() => {
                                                                var temp = { ...item };
                                                                temp.functype = 'edit';
                                                                temp.email = item.email;
                                                                temp.id = item.id;
                                                                temp.company_id = item?.company?.id;
                                                                setcallpayload({ ...temp });
                                                                setopenModal(true);
                                                            }}
                                                            size={20}
                                                            class={reviewsstyles.icon + ' ml-2'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <p className={' m-0 p-0 wordbreak '}>{dateformatter(item.updated_at)}</p>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            <Pagespaginatecomponent
                                totaldatacount={FetchLeads?.data?.data?.total}
                                numofitemsperpage={FetchLeads?.data?.data?.per_page}
                                pagenumbparams={FetchLeads?.data?.data?.current_page}
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
            <CallInfo openModal={openModal} setopenModal={setopenModal} callpayload={callpayload} setcallpayload={setcallpayload} FetchLeads={FetchLeads} />

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
