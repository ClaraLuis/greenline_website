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
import PhaseInfo from './PhaseInfo.js';
import { FiPlus } from 'react-icons/fi';

const { ValueContainer, Placeholder } = components;

const Phases = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchPhases_API, FetchUsers_API, AssigntoPhaseMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonClicked, setbuttonClicked] = useState(false);

    const [importmodal, setimportmodal] = useState(false);
    const [ImportFileInput, setImportFileInput] = useState('');
    const [search, setsearch] = useState('');

    const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
    const [openModal, setopenModal] = useState(false);

    const [assignmodal, setassignmodal] = useState(false);
    const [assignpayload, setassignpayload] = useState({});
    const [phasepayload, setphasepayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        color: '',
        phaseaction: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchPhases = useQuery(['FetchPhases_API' + JSON.stringify(filterobj)], () => FetchPhases_API({ filter: filterobj }), {
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
        setpageactive_context('/phases');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
        var page = 1;
        if (queryParameters.get('page') == undefined) {
        } else {
            page = queryParameters.get('page');
        }

        setfilterobj({ ...filterobj, page: page });
    }, []);

    const AssigntoPhaseMutation = useMutation('AssigntoPhaseMutation_API', {
        mutationFn: AssigntoPhaseMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchUsers.refetch();
                FetchPhases.refetch();
                setassignmodal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Phases
                    </p>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {FetchPhases?.data?.data?.total} </span>
                        </p>
                    </div>

                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                            onClick={() => {
                                setphasepayload({
                                    functype: 'add',
                                    id: 'add',
                                    name: '',
                                    color: '',
                                    phaseaction: '',
                                });
                                setopenModal(true);
                            }}
                        >
                            Add Phase
                        </button>
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        {FetchPhases.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!FetchPhases.isFetching && FetchPhases.isSuccess && (
                            <>
                                {FetchPhases?.data?.data?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Phases
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {FetchPhases?.data?.data?.data?.length != 0 && (
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th style={{ minWidth: '100px' }} class="col-lg-1">
                                                #
                                            </th>
                                            <th>Phase Name</th>
                                            <th>Phase Color</th>
                                            <th>Phase Action</th>
                                            <th>Timestamp</th>
                                            <th>Assign users</th>

                                            <th>Show</th>
                                        </thead>
                                        <tbody>
                                            {FetchPhases?.data?.data?.data?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ minWidth: '100px' }} class="col-lg-1">
                                                            <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.name}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.color}</p>
                                                        </td>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.phaseaction == null ? 'No Action' : item?.phaseaction}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{dateformatter(item.updated_at)}</p>
                                                        </td>
                                                        <td>
                                                            <FiPlus
                                                                onClick={() => {
                                                                    setassignpayload({ ...assignpayload, phase_id: item.id, phase_user_phase_junc: item?.phase_user_phase_junc });
                                                                    setassignmodal(true);
                                                                }}
                                                                size={20}
                                                                class={reviewsstyles.icon + ' ml-2'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <BiShowAlt
                                                                onClick={() => {
                                                                    var temp = { ...item };
                                                                    temp.functype = 'edit';
                                                                    temp.email = item.email;
                                                                    temp.id = item.id;
                                                                    temp.company_id = item?.company?.id;
                                                                    setphasepayload({ ...temp });
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
                                    totaldatacount={FetchPhases?.data?.data?.total}
                                    numofitemsperpage={FetchPhases?.data?.data?.per_page}
                                    pagenumbparams={FetchPhases?.data?.data?.current_page}
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
            <PhaseInfo openModal={openModal} setopenModal={setopenModal} phasepayload={phasepayload} setphasepayload={setphasepayload} FetchPhases={FetchPhases} />

            <Modal
                show={assignmodal}
                onHide={() => {
                    setassignmodal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Assign users</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setassignmodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={'row m-0 w-100 pb-3 '}>
                        {FetchUsers?.data?.data?.data?.map((item, index) => {
                            var Assign = false;
                            var assindex = 0;
                            assignpayload?.phase_user_phase_junc?.map((sub, subindex) => {
                                if (item?.id == sub?.user) {
                                    Assign = true;
                                    assindex = subindex;
                                }
                            });
                            return (
                                <>
                                    <div class="col-lg-12 p-0 mb-2">
                                        <div class="row m-0 w-100 d-flex align-items-center">
                                            <div class="col-lg-8 text-capitalize">
                                                {item?.user_profile?.fname} {item?.user_profile?.lname}
                                            </div>
                                            <div class="col-lg-3">
                                                <button
                                                    onClick={() => {
                                                        if (Assign) {
                                                            var temp = assignpayload?.phase_user_phase_junc;
                                                            temp.splice(assindex, 1);
                                                            setassignpayload({ ...assignpayload, phase_user_phase_junc: temp });
                                                        }
                                                        var temp = {};
                                                        temp.assigntype = 'user';
                                                        temp.userid = item?.id;
                                                        temp.phase_id = assignpayload?.phase_id;
                                                        AssigntoPhaseMutation?.mutate(temp);
                                                    }}
                                                    disabled={AssigntoPhaseMutation?.isLoading}
                                                    class={Assign ? generalstyles.roundbutton + ' bg-danger bg-dangerhover mr-2 ' : generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                                >
                                                    {AssigntoPhaseMutation?.isLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                    {!AssigntoPhaseMutation?.isLoading && <span>{Assign ? 'Remove' : 'Assign'}</span>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {index != FetchUsers?.data?.data?.data?.length - 1 && (
                                        <div class="col-lg-12 p-0">
                                            <hr />
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </div>
                </Modal.Body>
            </Modal>
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
export default Phases;
