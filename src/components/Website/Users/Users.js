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
import Select, { components } from 'react-select';

// Icons
import API from '../../../API/API.js';
import UserInfo from './UserInfo.js';
import { FiPlus } from 'react-icons/fi';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

const { ValueContainer, Placeholder } = components;

const Users = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { FetchUsers_API, FetchCompanies_API, AssignUserCompanyMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonClicked, setbuttonClicked] = useState(false);
    const [assignpayload, setassignpayload] = useState({});
    const [assignmodal, setassignmodal] = useState(false);

    const [importmodal, setimportmodal] = useState(false);
    const [ImportFileInput, setImportFileInput] = useState('');
    const [search, setsearch] = useState('');
    const [companies, setcompanies] = useState([]);

    const [claimedcoinsmodel, setclaimedcoinsmodel] = useState(false);
    const [openModal, setopenModal] = useState(false);

    const [chosenitem, setchosenitem] = useState({});
    const [leadpayload, setleadpayload] = useState({
        functype: 'add',
        id: 'add',
        fname: '',
        lname: '',
        phonenumber: '',
        email: '',
        company_id: '',
        birthdate: '',
        gender: '',
        password: '',
        usertype: '',
        security_layer_id: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchInstitueSecurityLayersQuery = useQuery(['FetchAllSecuritylayers_API'], () => FetchAllSecuritylayers_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const FetchUsers = useQuery(['FetchUsers_API' + JSON.stringify(filterobj)], () => FetchUsers_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const FetchCompanies = useQuery(['FetchCompanies_API' + JSON.stringify(filterobj)], () => FetchCompanies_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const AssignUserCompanyMutation = useMutation('AssignUserCompanyMutation_API', {
        mutationFn: AssignUserCompanyMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchUsers.refetch();
                setassignmodal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    useEffect(() => {
        setpageactive_context('/users');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
        var page = 1;
        if (queryParameters.get('page') == undefined) {
        } else {
            page = queryParameters.get('page');
        }

        setfilterobj({ ...filterobj, page: page });
        if (FetchCompanies?.isSuccess && !FetchCompanies?.isFetching) {
            var temp = [];

            FetchCompanies?.data?.data?.data?.map((item, index) => {
                temp.push({ ...item, usertype: '' });
            });
            setcompanies([...temp]);
        }
    }, [FetchCompanies?.isSuccess, FetchCompanies?.data]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Users
                    </p>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {FetchUsers?.data?.data?.total} </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                            onClick={() => {
                                setleadpayload({
                                    functype: 'add',
                                    id: 'add',
                                    fname: '',
                                    lname: '',
                                    phonenumber: '',
                                    email: '',
                                    company_id: '',
                                    birthdate: '',
                                    gender: '',
                                    password: '',
                                    usertype: '',
                                    security_layer_id: '',
                                });
                                setopenModal(true);
                            }}
                        >
                            Add User
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
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        {FetchUsers.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!FetchUsers.isFetching && FetchUsers.isSuccess && (
                            <>
                                {FetchUsers?.data?.data?.data?.length == 0 && (
                                    <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                        <div class="row m-0 w-100">
                                            <FaLayerGroup size={40} class=" col-lg-12" />
                                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                No Users
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {FetchUsers?.data?.data?.data?.length != 0 && (
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th style={{ minWidth: '100px' }} class="col-lg-1">
                                                #
                                            </th>
                                            <th>Name</th>

                                            <th>{lang.email}</th>

                                            <th>{lang.phonenumber}</th>

                                            <th>Timestamp</th>
                                            <th>Assign Company</th>

                                            <th>Show</th>
                                        </thead>
                                        <tbody>
                                            {FetchUsers?.data?.data?.data?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ minWidth: '100px' }} class="col-lg-1">
                                                            <p className={' m-0 p-0 wordbreak '}>{item.id}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>
                                                                {item?.user_profile?.fname} {item?.user_profile?.lname}
                                                            </p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.email}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.user_profile?.phonenumber}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{dateformatter(item?.date_joined)}</p>
                                                        </td>

                                                        <td>
                                                            <FiPlus
                                                                onClick={() => {
                                                                    setassignpayload({ ...item });
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
                                                                    temp.userid = item.id;
                                                                    temp.company_id = item?.user_profile?.emp_company?.id;
                                                                    temp.fname = item?.user_profile?.fname;
                                                                    temp.lname = item?.user_profile?.lname;
                                                                    temp.phonenumber = item?.user_profile?.phonenumber;
                                                                    temp.gender = item?.user_profile?.gender;
                                                                    temp.birthdate = item?.user_profile?.birthdate;
                                                                    temp.usertype = item?.user_profile?.usertype;
                                                                    temp.security_layer_id = item?.user_profile?.securitylayer?.id;

                                                                    setleadpayload({ ...temp });
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
                                    totaldatacount={FetchUsers?.data?.data?.total}
                                    numofitemsperpage={FetchUsers?.data?.data?.per_page}
                                    pagenumbparams={FetchUsers?.data?.data?.current_page}
                                    nextpagefunction={(nextpage) => {
                                        history.push({
                                            pathname: '/users',
                                            search: '&page=' + nextpage,
                                        });
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <UserInfo openModal={openModal} setopenModal={setopenModal} leadpayload={leadpayload} setleadpayload={setleadpayload} FetchUsers={FetchUsers} />

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
                            <div className="row w-100 m-0 p-0">Assign Company</div>
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
                        {companies?.map((item, index) => {
                            var assignedusertype = '';
                            var Assign = false;
                            var assindex = 0;
                            assignpayload?.user_company_junc?.map((sub, subindex) => {
                                if (item?.id == sub?.company?.id) {
                                    Assign = true;
                                    assindex = subindex;
                                    assignedusertype = sub?.usertype;
                                }
                            });
                            return (
                                <>
                                    <div class="col-lg-12 p-0 mb-2">
                                        <div class="row m-0 w-100 d-flex align-items-center">
                                            <div class="col-lg-12 text-capitalize mb-2">{item?.companyname}</div>
                                            <div style={{ fontSize: '12px' }} class={'col-lg-8 m-0'}>
                                                {Assign && <span class="m-0 p-0">Role: {assignedusertype == 'companyowner' ? 'Company Owner' : assignedusertype == 'user' ? 'User' : ''}</span>}
                                                {!Assign && (
                                                    <>
                                                        <select
                                                            style={{ fontSize: '14px', padding: '5px' }}
                                                            value={item?.usertype}
                                                            onChange={(event) => {
                                                                var temp = [...companies];
                                                                temp[index].usertype = event.target.value;
                                                                setcompanies([...temp]);
                                                            }}
                                                        >
                                                            <option value={''}>User type</option>
                                                            <option value={'user'}>User</option>
                                                            <option value={'companyowner'}>Company Owner</option>
                                                        </select>
                                                    </>
                                                )}
                                            </div>
                                            <div class="col-lg-3">
                                                <button
                                                    onClick={() => {
                                                        var temp = {};
                                                        if (Assign) {
                                                            // var temp = assignpayload?.phase_user_phase_junc;
                                                            // temp.splice(assindex, 1);
                                                            // setassignpayload({ ...assignpayload, phase_user_phase_junc: temp });
                                                            temp.functype = 'deassign';
                                                        } else {
                                                            temp.functype = 'assign';
                                                            temp.type = companies[index]?.usertype;
                                                        }

                                                        temp.requserid = assignpayload?.id;
                                                        temp.reqcompanyid = item?.id;

                                                        AssignUserCompanyMutation?.mutate(temp);
                                                    }}
                                                    disabled={AssignUserCompanyMutation?.isLoading}
                                                    class={Assign ? generalstyles.roundbutton + ' bg-danger bg-dangerhover mr-2 ' : generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                                >
                                                    {AssignUserCompanyMutation?.isLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                    {!AssignUserCompanyMutation?.isLoading && <span>{Assign ? 'DeAssign' : 'Assign'}</span>}
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
        </div>
    );
};
export default Users;
