import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../../trans.css';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';
import Sidenav from './Sidenavfiles/Sidenav';

import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
// import socketIO from 'socket.io-client';
import { BiBell } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import API from '../../API/API.js';
import logo from './Generalfiles/images/logo.png';
import Users from './Users/Users';
import user from './user.png';
import InventoryDetails from './InventoryDetails/InventoryDetails.js';
import InventoryItems from './InventoryItems/InventoryItems.js';
import HubItems from './HubItems/HubItems.js';
import Orders from './Orders/Orders.js';
import MerchantHome from './MerchantHome/MerchantHome.js';
import Finance from './Finance/Finance.js';
import MerchantItems from './MerchantItems/MerchantItems.js';
import MerchantOrders from './MerchantOrders/MerchantOrders.js';
import AddOrder from './MerchantOrders/AddOrder.js';
import CourierHome from './Courier/CourierHome.js';
import CourierSheets from './Courier/CourierSheets.js';
import CourierSheet from './Courier/CourierSheet.js';
import AddSheet from './Courier/AddSheet.js';
import FinanceHome from './Finance/FinanceHome.js';
import FinanceSheets from './Finance/FinanceSheets.js';
import FinancialAccounts from './Finance/FinancialAccounts.js';
import FinancialAccountInfo from './Finance/FinancialAccountInfo.js';
import FinanceOrders from './Finance/FinanceOrders.js';
import FinanceTransactions from './Finance/FinanceTransactions.js';
import AddInvoice from './Finance/AddInvoice.js';
import { getAuth, signOut } from 'firebase/auth';
const App = (props) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
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

    return (
        <div class="row m-0 w-100">
            <Router>
                <div class="row m-0 w-100 d-flex justify-content-end" style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'fixed', top: 0, zIndex: 100, background: 'white' }} class="col-lg-12 p-0">
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
                                                    signOut(getAuth());
                                                }}
                                            >
                                                <IoSettingsOutline size={15} style={{ marginInlineEnd: '10px' }} />
                                                Logout
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
                    <div class=" p-0" style={{ width: hidesidenav_context ? '5%' : '14%', transition: 'all 0.4s', position: 'fixed', top: 0, left: 0 }}>
                        <Sidenav />
                    </div>
                    <div class="pl-0 pr-0 pb-0" style={{ width: hidesidenav_context ? '95%' : '86%', transition: 'all 0.4s', paddingTop: '75px' }}>
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
                                                                return <Redirect to={'/merchantitems'} />;
                                                            }}
                                                        />

                                                        <Route exact path="/users" component={Users} />
                                                        <Route exact path="/inventorydetails" component={InventoryDetails} />
                                                        <Route exact path="/inventoryitems" component={InventoryItems} />
                                                        <Route exact path="/hubitems" component={HubItems} />
                                                        <Route exact path="/merchanthome" component={MerchantHome} />
                                                        <Route exact path="/orders" component={Orders} />
                                                        <Route exact path="/merchantfinance" component={Finance} />
                                                        <Route exact path="/merchantitems" component={MerchantItems} />
                                                        <Route exact path="/merchantorders" component={MerchantOrders} />
                                                        <Route exact path="/addorder" component={AddOrder} />
                                                        <Route exact path="/courierhome" component={CourierHome} />
                                                        <Route exact path="/couriersheets" component={CourierSheets} />
                                                        <Route exact path="/couriersheet" component={CourierSheet} />
                                                        <Route exact path="/addsheet" component={AddSheet} />
                                                        <Route exact path="/financehome" component={FinanceHome} />
                                                        <Route exact path="/financesheets" component={FinanceSheets} />
                                                        <Route exact path="/financialaccounts" component={FinancialAccounts} />
                                                        <Route exact path="/financialaccountinfo" component={FinancialAccountInfo} />
                                                        <Route exact path="/financeorders" component={FinanceOrders} />
                                                        <Route exact path="/financetransactions" component={FinanceTransactions} />
                                                        <Route exact path="/addinvoice" component={AddInvoice} />
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
