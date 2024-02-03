import React, { useEffect, useState } from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useLocation } from 'react-router-dom';
import '../../trans.css';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';
import Header from './Header/Header';
import Sidenav from './Sidenavfiles/Sidenav';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';

import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
// import socketIO from 'socket.io-client';
import Companies from './Companies/Companies';
import Leads from './Leads/Leads';
import Users from './Users/Users';
import Phases from './Phases/Phases';
import Calls from './Calls/Calls';
import Groups from './Groups/Groups';
import Campaigns from './Campaigns/Campaigns.js';
import FollowupsandMeetings from './FollowupsandMeetings/FollowupsandMeetings.js';
import Deals from './Deals/Deals.js';
import Privacy from './Privacy/Privacy.js';
import Termsofuse from './Termsofuse/Termsofuse.js';
import Securitylayers from './Securitylayers/Securitylayers.js';
import AddEditSecuritylayers from './Securitylayers/AddEditSecuritylayers.js';
import Analytics from './Campaigns/Analytics.js';
import API from '../../API/API.js';
import { NotificationManager } from 'react-notifications';
import formstyles from '../Website/Generalfiles/CSS_GENERAL/form.module.css';
import { useMutation } from 'react-query';
import Home from './Home/Home.js';
import SalesAnalytics from './Campaigns/SalesAnalytics.js';
import PhasesAnalytics from './Campaigns/PhasesAnalytics.js';
import UserAnalytics from './Campaigns/UserAnalytics.js';
import logo from './Generalfiles/images/logo.png';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import user from './user.png';
import { BiBell } from 'react-icons/bi';
const App = (props) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const { UserChooseCurrentCompan_API } = API();
    const { hidesidenav_context, sethidesidenav_context, setopenloginmodalcontext, openloginmodalcontext, pagetitle_context } = React.useContext(Contexthandlerscontext);
    useEffect(() => {
        // if (openloginmodalcontext != true) {
        //     const foo = params.get('secondtrial');
        //     if (foo != 'true') {
        //         setopenloginmodalcontext(true);
        //     }
        //     setTimeout(() => {
        //         alert('s');
        //         params.delete('secondtrial');
        //         history.replace({
        //             search: params.toString(),
        //         });
        //         clearTimeout(this);
        //     }, 2000);
        // }
    }, []);
    const UserChooseCurrentCompanyMutation = useMutation('UserChooseCurrentCompan_API', {
        mutationFn: UserChooseCurrentCompan_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                window.location.reload();
                // fetchAuthorizationQueryContext?.refetch();
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    useEffect(() => {
        // if (fetchAuthorizationQueryContext?.isSuccess && !fetchAuthorizationQueryContext?.isFetching) {
        //     if (fetchAuthorizationQueryContext?.data?.data?.currentcompanyusertype?.length == 0 && fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype != 'liftupadmin') {
        //         UserChooseCurrentCompanyMutation.mutate({ company_id: fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_company_junc[0]?.company?.id?.toString() });
        //     }
        // }
    }, []);

    return (
        <div class="row m-0 w-100">
            <Router>
                <div class="row m-0 w-100" style={{ overflow: 'hidden' }}>
                    <div class="col-lg-12 p-0">
                        <div class="row m-0 w-100">
                            <div class="col-lg-6 p-0 px-2  ">
                                <div class="row m-0 w-100">
                                    <div class={`${generalstyles.sidenav__logo}` + ' cursor-pointer '}>
                                        <img src={logo} />
                                    </div>
                                    <div
                                        onClick={() => {
                                            sethidesidenav_context(!hidesidenav_context);
                                        }}
                                        class="pt-3"
                                    >
                                        <div
                                            id="app-title"
                                            class="allcentered p-0"
                                            style={{
                                                backgroundColor: 'var(--secondary)',
                                                borderRadius: '5px',
                                                // transform: !hidesidenav_context ? 'translate(60%, 10%)' : 'translate(30%,0%)',
                                                zIndex: 100000,
                                                transition: 'all 0.4s',
                                                width: '23px',
                                                height: '23px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <FiMenu size={15} color={'var(--primary)'} />
                                            {/* {hidesidenav_context && <IoIosArrowForward size={25} class="pl-1" />} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 d-flex justify-content-end align-items-center ">
                                <Dropdown show={isOpen1} onToggle={() => setIsOpen1(!isOpen1)}>
                                    <Dropdown.Toggle>
                                        <div
                                            style={{
                                                background: !isOpen1 ? 'var(--secondary)' : 'var(--primary)',
                                                color: isOpen1 ? 'white' : 'var(--primary)',
                                                borderRadius: '10px',
                                                transition: 'all 0.4s',
                                            }}
                                            class={' ml-3 mr-3 d-flex  p-2 align-items-center justify-content-between cursor-pointer p-sm-0 ml-sm-1 mr-sm-1 '}
                                        >
                                            <BiBell size={18} />
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div style={{ minWidth: '340px', maxWidth: '340px' }}>
                                            <div class="row m-0 w-100" style={{ paddingBottom: '10px' }}>
                                                <div class="col-lg-12 p-2">
                                                    <div class="row m-0 w-100">
                                                        <div class="col-lg-7 p-0">
                                                            <span style={{ fontWeight: 600 }}>
                                                                All Notifications
                                                                <span style={{ fontWeight: 400, color: 'white', background: '#fcb636', borderRadius: '12px', fontSize: '10px' }} class="py-1 px-2 mx-2">
                                                                    01
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div class="col-lg-5 d-flex justify-content-end p-0">
                                                            <span style={{ fontSize: '11px', textDecoration: 'underline' }} class="text-primary text-secondaryhover">
                                                                Mark all as unread
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-lg-12 p-0">
                                                    <hr class="p-0 m-0" />
                                                </div>
                                            </div>
                                            {/* <Dropdown.Item>
                                                <p
                                                    class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                    onClick={() => {
                                                        NotificationManager.success('Logged out');
                                                        const cookies = new Cookies();
                                                        cookies.set('coas12312efaasasdafasdas32131asdsadsadsaqweasdkjenfjenfk kern123!@_#!@3123', null);
                                                        history.push('/');
                                                        fetchAuthorizationQueryContext.refetch();
                                                    }}
                                                >
                                                    <IoSettingsOutline size={15} style={{ marginInlineEnd: '10px' }} />
                                                    Account Settings
                                                </p>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <p
                                                    class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                    onClick={() => {
                                                        NotificationManager.success('Logged out');
                                                        const cookies = new Cookies();
                                                        cookies.set('coas12312efaasasdafasdas32131asdsadsadsaqweasdkjenfjenfk kern123!@_#!@3123', null);
                                                        history.push('/');
                                                        fetchAuthorizationQueryContext.refetch();
                                                    }}
                                                >
                                                    <IoSettingsOutline size={15} style={{ marginInlineEnd: '10px' }} />
                                                    Account Settings
                                                </p>
                                            </Dropdown.Item> */}
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown show={isOpen} onToggle={() => setIsOpen(!isOpen)}>
                                    <Dropdown.Toggle>
                                        <div
                                            style={{
                                                background: !isOpen ? 'var(--secondary)' : 'var(--primary)',
                                                color: isOpen ? 'white' : 'var(--primary)',
                                                borderRadius: '20px',
                                                transition: 'all 0.4s',
                                            }}
                                            class={' ml-3 mr-3 d-flex p-1 px-2 align-items-center justify-content-between cursor-pointer p-sm-0 ml-sm-1 mr-sm-1 '}
                                        >
                                            <div style={{ width: '31px', height: '31px', marginInlineEnd: '10px' }}>
                                                <img src={user} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <IoSettingsOutline size={18} style={{ marginInlineEnd: '5px' }} />
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div style={{ paddingBottom: '10px' }}>
                                            <div class="col-lg-12 py-0 pt-2">
                                                <span style={{ fontWeight: 600 }}>
                                                    Good Morning,
                                                    <span style={{ fontWeight: 400 }}> User</span>
                                                </span>
                                            </div>
                                            <div class="col-lg-12 py-0">
                                                <span style={{ fontSize: '11px', color: 'grey' }}>Project amdin</span>
                                            </div>
                                            <div class="col-lg-12">
                                                <hr class="p-0 m-0" />
                                            </div>
                                        </div>
                                        <Dropdown.Item>
                                            <p
                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                onClick={() => {
                                                    NotificationManager.success('Logged out');
                                                    const cookies = new Cookies();
                                                    cookies.set('coas12312efaasasdafasdas32131asdsadsadsaqweasdkjenfjenfk kern123!@_#!@3123', null);
                                                    history.push('/');
                                                    fetchAuthorizationQueryContext.refetch();
                                                }}
                                            >
                                                <IoSettingsOutline size={15} style={{ marginInlineEnd: '10px' }} />
                                                Account Settings
                                            </p>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <p
                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                onClick={() => {
                                                    NotificationManager.success('Logged out');
                                                    const cookies = new Cookies();
                                                    cookies.set('coas12312efaasasdafasdas32131asdsadsadsaqweasdkjenfjenfk kern123!@_#!@3123', null);
                                                    history.push('/');
                                                    fetchAuthorizationQueryContext.refetch();
                                                }}
                                            >
                                                <IoSettingsOutline size={15} style={{ marginInlineEnd: '10px' }} />
                                                Account Settings
                                            </p>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div class=" p-0" style={{ width: hidesidenav_context ? '5%' : '14%', transition: 'all 0.4s' }}>
                        <Sidenav />
                    </div>
                    <div class="p-0" style={{ width: hidesidenav_context ? '95%' : '86%', transition: 'all 0.4s' }}>
                        <div class={generalstyles.app_container + ' w-100 '}>
                            <div class="row m-0 w-100">
                                <div class={`${generalstyles.app_main}` + '  app_main  '}>
                                    <div
                                        class={
                                            pagetitle_context == 'dashboard' && !hidesidenav_context ? generalstyles.app_container_inner + ' w-100 pt-0 ' : generalstyles.app_container_inner + ' p-3 '
                                        }
                                    >
                                        <Route
                                            render={({ location, match }) => {
                                                return (
                                                    <Switch key={location.key} location={location}>
                                                        <Route
                                                            exact
                                                            path="/"
                                                            render={(props) => {
                                                                return <Redirect to={'/users'} />;
                                                            }}
                                                        />
                                                        {/* <Route exact path="/home" component={Home} /> */}
                                                        <Route exact path="/companies" component={Companies} />
                                                        <Route exact path="/leads" component={Leads} />
                                                        <Route exact path="/deals" component={Deals} />

                                                        <Route exact path="/users" component={Users} />
                                                        <Route exact path="/phases" component={Phases} />
                                                        <Route exact path="/calls" component={Calls} />
                                                        <Route exact path="/campaigns" component={Campaigns} />
                                                        <Route exact path="/groups" component={Groups} />
                                                        <Route exact path="/privacy" component={Privacy} />
                                                        <Route exact path="/termsofuse" component={Termsofuse} />
                                                        <Route exact path="/home" component={Home} />
                                                        <Route exact path="/securitylayers" component={Securitylayers} />
                                                        <Route exact path="/phasesanalytics" component={PhasesAnalytics} />
                                                        <Route exact path="/salesanalytics" component={SalesAnalytics} />
                                                        <Route exact path="/useranalytics" component={UserAnalytics} />

                                                        <Route exact path="/addsecuritylayers/:functypeparam/:editsecuritygroupidparams" component={AddEditSecuritylayers} />

                                                        <Route exact path="/encounters" component={FollowupsandMeetings} />
                                                        <Route exact path="/analytics" component={Analytics} />
                                                    </Switch>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        </div>
    );
};

export default App;
