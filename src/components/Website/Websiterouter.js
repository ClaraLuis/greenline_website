import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../../trans.css';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';
import Sidenav from './Sidenavfiles/Sidenav';

import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
// import socketIO from 'socket.io-client';
import { getAuth, signOut } from 'firebase/auth';
import { BiBell } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { NotificationManager } from 'react-notifications';
import AddSheet from './Courier/AddSheet.js';
import CourierHome from './Courier/CourierHome.js';
import CourierSheet from './Courier/CourierSheet.js';
import CourierSheets from './Courier/CourierSheets.js';
import AddInvoice from './Finance/AddInvoice.js';
import Finance from './Finance/Finance.js';
import FinanceHome from './Finance/FinanceHome.js';
import FinanceOrders from './Finance/FinanceOrders.js';
import FinanceSheets from './Finance/FinanceSheets.js';
import FinanceTransactions from './Finance/FinanceTransactions.js';
import FinancialAccountInfo from './Finance/FinancialAccountInfo.js';
import FinancialAccounts from './Finance/FinancialAccounts.js';
import logo from './Generalfiles/images/logo.png';
import HubItems from './HubItems/HubItems.js';
import InventoryDetails from './InventoryDetails/InventoryDetails.js';
import InventoryItems from './InventoryItems/InventoryItems.js';
import MerchantHome from './MerchantHome/MerchantHome.js';
import MerchantItems from './MerchantItems/MerchantItems.js';
import AddOrder from './MerchantOrders/AddOrder.js';
import MerchantOrders from './MerchantOrders/MerchantOrders.js';
import Orders from './Orders/Orders.js';
import sidenavstyles from './Sidenavfiles/sidenav.module.css';
import Users from './Users/Users';
import userImage from './user.png';
import BookVisit from './MerchantHome/BookVisit.js';
import AddMerchant from './AddMerchant/AddMerchant.js';
import Merchants from './MerchantHome/Merchants.js';
import CourierCollection from './Finance/CourierCollection.js';
import MerchantPayments from './Finance/MerchantPayments.js';
import MerchanReturns from './MerchantHome/MerchanReturns.js';
import Packages from './MerchantHome/Packages.js';
import InventoryReturns from './InventoryItems/InventoryReturns.js';
import InventoryPackages from './InventoryItems/InventoryPackages.js';
import MerchantPackages from './MerchantHome/MerchantPackages.js';
import AddItem from './MerchantItems/AddItem.js';
import Hubs from './Hubs/Hubs.js';
import OrderInfo from './Orders/OrderInfo.js';
import AddSheetNew from './Courier/AddSheetNew.js';
import Expenses from './Finance/Expenses.js';
import MerchantPayment from './MerchantHome/MerchantPayment.js';
import ReturnPackageInfo from './InventoryItems/ReturnPackageInfo.js';
import MerchantReturnPackageInfo from './MerchantHome/MerchantReturnPackageInfo.js';
import UpdateShipping from './AddMerchant/UpdateShipping.js';
import UpdateMerchant from './AddMerchant/UpdateMerchant.js';
import HubDetails from './Hubs/HubDetails.js';
import InventorySettings from './MerchantHome/InventorySettings.js';
import Fulfilled from './MerchantOrders/Fulfilled.js';
import RentPage from './MerchantHome/RentPage.js';
import WebToken from './WebToken/WebToken.js';
import { TbApi, TbBuilding, TbBuildingWarehouse, TbLogout, TbUserPentagon } from 'react-icons/tb';
import ItemDetails from './MerchantItems/ItemDetails.js';
import UserPermissions from './Users/UserPermissions.js';
import NotFound from './NotFound.js';
import RentBills from './Finance/RentBills.js';
import ActionCenter from './Hubs/ActionCenter.js';
import InventoryRent from './InventoryItems/InventoryRent.js';
import ItemHistory from './InventoryItems/ItemHistory.js';
import BatchScan from './Hubs/BatchScan.js';
import Settlements from './Finance/Settlements.js';
import ShippingCollections from './Finance/ShippingCollections.js';
import MerchantSettlements from './Finance/MerchantSettlements.js';
import MerchantSettlement from './Finance/MerchantSettlement.js';
const App = (props) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const cookies = new Cookies();

    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const user = cookies.get('userInfo');
    const { hidesidenav_context, sethidesidenav_context, setopenloginmodalcontext, openloginmodalcontext, pagetitle_context } = React.useContext(Contexthandlerscontext);
    useEffect(() => {
        // alert(JSON.stringify(user));
    }, []);

    const headerSection = () => {
        return (
            <div class={generalstyles.header}>
                <div class="row m-0 w-100">
                    <div class="col-lg-6 p-0 px-2  ">
                        <div class="row m-0 w-100">
                            <div
                                onClick={() => {
                                    sethidesidenav_context(!hidesidenav_context);
                                }}
                                class="pt-2"
                            >
                                <div
                                    id="app-title"
                                    class="allcentered p-0 mx-3"
                                    style={{
                                        // backgroundColor: 'var(--secondary)',
                                        borderRadius: '5px',
                                        zIndex: 100000,
                                        transition: 'all 0.4s',
                                        width: '23px',
                                        height: '23px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <FiMenu size={20} color={'white'} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 d-flex justify-content-end align-items-center ">
                        {/* <Dropdown show={isOpen1} onToggle={() => setIsOpen1(!isOpen1)}>
                            <Dropdown.Toggle>
                                <div
                                    style={{
                                        // background: !isOpen1 ? 'var(--secondary)' : 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '10px',
                                        transition: 'all 0.4s',
                                    }}
                                    class={' ml-3 mr-3 d-flex  p-2 align-items-center justify-content-between cursor-pointer p-sm-0 ml-sm-1 mr-sm-1 '}
                                >
                                    <div class={generalstyles.mui_7a9o4p}></div>
                                    <div class={generalstyles.mui_vu6um3}></div>
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
                        </Dropdown> */}
                        <Dropdown show={isOpen} onToggle={() => setIsOpen(!isOpen)}>
                            <Dropdown.Toggle>
                                <div
                                    style={{
                                        // background: !isOpen ? 'var(--secondary)' : 'var(--primary)',
                                        // background: 'white',
                                        color: 'white',
                                        borderRadius: '20px',
                                        transition: 'all 0.4s',
                                    }}
                                    class={' ml-3 mr-3 d-flex p-1 px-2 align-items-center justify-content-between cursor-pointer p-sm-0 ml-sm-1 mr-sm-1 '}
                                >
                                    <div style={{ width: '31px', height: '31px', marginInlineEnd: '10px' }}>
                                        <img src={userImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    {user?.name}
                                    <IoSettingsOutline size={18} style={{ marginInline: '10px' }} color="white" />
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <div style={{ paddingBottom: '10px' }}>
                                    <div class="col-lg-12 py-0 pt-2">
                                        <span style={{ fontWeight: 600 }}>
                                            <span style={{ fontWeight: 400 }}> {user?.name}</span>
                                        </span>
                                    </div>
                                    <div class="col-lg-12 p-0 d0flex align-items-center">
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-6 py-0 text-capitalize">
                                                <span style={{ fontSize: '13px', color: 'grey' }}>
                                                    <TbUserPentagon class="mr-1" />
                                                    {user?.type} {user?.merchant?.name ? ', ' + user.merchant?.name : ''}
                                                </span>
                                            </div>
                                            <div class="col-lg-6 py-0 text-capitalize">
                                                <span style={{ fontSize: '13px', color: 'grey' }} class="d-flex align-items-center text-capitalize">
                                                    <TbBuilding class="mr-1" />
                                                    {user?.hub?.name ?? 'No Hub'}
                                                </span>
                                            </div>
                                            <div class="col-lg-6 py-0 text-capitalize">
                                                <span style={{ fontSize: '13px', color: 'grey' }} class="d-flex align-items-center text-capitalize">
                                                    <TbBuildingWarehouse class="mr-1" />
                                                    {user?.inventory?.name ?? 'No Inventory'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <hr class="p-0 m-0" />
                                    </div>
                                </div>
                                {cookies.get('userInfo')?.type == 'merchant' && (
                                    <Dropdown.Item
                                        onClick={async () => {
                                            // window.open('/webtoken', '_self');
                                            // navigate('/webtoken');
                                            window.location.href = '/webtoken';
                                        }}
                                    >
                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>
                                            <TbApi size={15} style={{ marginInlineEnd: '10px' }} />
                                            Web API Settings
                                        </p>
                                    </Dropdown.Item>
                                )}

                                <Dropdown.Item
                                    onClick={async () => {
                                        await signOut(getAuth());
                                        const cookies = new Cookies();
                                        cookies.remove('accessToken');
                                        cookies.remove('merchantId');
                                        cookies.remove('userInfo');
                                        window.open('/login', '_self');
                                    }}
                                >
                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>
                                        <TbLogout size={15} style={{ marginInlineEnd: '10px' }} />
                                        Logout
                                    </p>
                                </Dropdown.Item>
                                {/* <Dropdown.Item
                                    onClick={() => {
                                        NotificationManager.success('Logged out');
                                        const cookies = new Cookies();
                                        history.push('/');
                                        fetchAuthorizationQueryContext.refetch();
                                    }}
                                >
                                    <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>
                                        <IoSettingsOutline size={15} style={{ marginInlineEnd: '10px' }} />
                                        Account Settings
                                    </p>
                                </Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div class="row m-0 w-100">
            <Router>
                <div class="row m-0 w-100 d-flex " style={{ maxHeight: '100vh', paddingRight: 0 }}>
                    {user?.permissions?.length != 0 && (
                        <>
                            <div style={{ width: hidesidenav_context ? '4%' : '20%', transition: 'all 0.4s' }}>
                                <div class={sidenavstyles.app_sidebar} style={{ width: hidesidenav_context ? '4%' : '20%', transition: 'all 0.4s' }}>
                                    <Sidenav />
                                </div>
                            </div>
                            <div class="px-0" style={{ width: hidesidenav_context ? '96%' : '80%', transition: 'all 0.4s' }}>
                                <div class={generalstyles.app_container + ' w-100 '}>
                                    <div class="row m-0 w-100">
                                        <div class={`${generalstyles.app_main}` + '  app_main  '}>
                                            {headerSection()}

                                            <div
                                                class={
                                                    pagetitle_context == 'dashboard' && !hidesidenav_context
                                                        ? generalstyles.app_container_inner + ' w-100 pt-0 '
                                                        : generalstyles.app_container_inner + ' p-1 '
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
                                                                        return <Redirect to={cookies.get('userInfo')?.type == 'merchant' ? '/merchanthome' : '/merchantorders'} />;
                                                                    }}
                                                                />

                                                                <Route exact path="/users" component={Users} />
                                                                <Route exact path="/userpermissions" component={UserPermissions} />
                                                                <Route exact path="/merchantsettlements" component={MerchantSettlements} />
                                                                <Route exact path="/merchantsettlement" component={MerchantSettlement} />
                                                                <Route exact path="/hubs" component={Hubs} />
                                                                <Route exact path="/inventorydetails" component={InventoryDetails} />
                                                                <Route exact path="/inventoryitems" component={InventoryItems} />
                                                                <Route exact path="/hubitems" component={HubItems} />
                                                                <Route exact path="/merchanthome" component={MerchantHome} />
                                                                <Route exact path="/orders" component={Orders} />
                                                                <Route exact path="/actioncenter" component={ActionCenter} />
                                                                <Route exact path="/handpicked" component={Orders} />
                                                                <Route exact path="/merchantfinance" component={Finance} />
                                                                <Route exact path="/merchantitems" component={MerchantItems} />
                                                                <Route exact path="/merchantorders" component={MerchantOrders} />
                                                                <Route exact path="/addorder" component={AddOrder} />
                                                                <Route exact path="/updateshipping" component={UpdateShipping} />
                                                                <Route exact path="/updatemerchant" component={UpdateMerchant} />
                                                                <Route exact path="/hubdetails" component={HubDetails} />
                                                                <Route exact path="/inventorysettings" component={InventorySettings} />
                                                                <Route exact path="/fulfilled" component={AddSheetNew} />
                                                                <Route exact path="/sortfacilities" component={AddSheetNew} />
                                                                <Route exact path="/webtoken" component={WebToken} />

                                                                <Route exact path="/courierhome" component={CourierHome} />
                                                                <Route exact path="/couriersheets" component={CourierSheets} />
                                                                <Route exact path="/couriersheet" component={CourierSheet} />
                                                                <Route exact path="/orderinfo" component={OrderInfo} />
                                                                <Route exact path="/addsheet" component={AddSheetNew} />
                                                                <Route exact path="/arrivedathub" component={AddSheetNew} />
                                                                <Route exact path="/batchscan" component={BatchScan} />
                                                                <Route exact path="/dispatched" component={AddSheetNew} />
                                                                <Route exact path="/rentpage" component={RentPage} />
                                                                <Route exact path="/itemhistory" component={ItemHistory} />

                                                                <Route exact path="/financehome" component={FinanceHome} />
                                                                <Route exact path="/additem" component={AddItem} />
                                                                <Route exact path="/updateitem" component={AddItem} />
                                                                <Route exact path="/itemdetails" component={ItemDetails} />
                                                                <Route exact path="/financesheets" component={FinanceSheets} />
                                                                <Route exact path="/expenses" component={Expenses} />
                                                                <Route exact path="/merchantpayment" component={MerchantPayment} />
                                                                <Route exact path="/returnpackageinfo" component={ReturnPackageInfo} />
                                                                <Route exact path="/merchantreturnpackageinfo" component={MerchantReturnPackageInfo} />

                                                                <Route exact path="/couriercollections" component={CourierCollection} />
                                                                <Route exact path="/rentbills" component={RentBills} />
                                                                <Route exact path="/settlements" component={Settlements} />
                                                                <Route exact path="/shippingcollections" component={ShippingCollections} />

                                                                <Route exact path="/merchantpayments" component={MerchantPayments} />

                                                                <Route exact path="/financialaccounts" component={FinancialAccounts} />
                                                                <Route exact path="/financialaccountinfo" component={FinancialAccountInfo} />
                                                                <Route exact path="/financeorders" component={FinanceOrders} />
                                                                <Route exact path="/financetransactions" component={FinanceTransactions} />
                                                                <Route exact path="/addinvoice" component={AddInvoice} />
                                                                <Route exact path="/bookvisit" component={BookVisit} />
                                                                <Route exact path="/addmerchant" component={AddMerchant} />
                                                                <Route exact path="/merchants" component={Merchants} />
                                                                <Route exact path="/merchantreturns" component={MerchanReturns} />
                                                                <Route exact path="/packages" component={Packages} />
                                                                <Route exact path="/inventoryrent" component={InventoryRent} />

                                                                <Route exact path="/inventoryreturns" component={InventoryReturns} />
                                                                <Route exact path="/inventorypackages" component={InventoryPackages} />
                                                                <Route exact path="/merchantpackages" component={MerchantPackages} />
                                                                <Route component={NotFound} />
                                                            </Switch>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {user?.permissions?.length == 0 && (
                        <div class="w-100" style={{ height: '100vh' }}>
                            {headerSection()}

                            <div class={generalstyles.card + ' mt-4 row m-0 w-100 allcentered'} style={{ fontWeight: 700, fontSize: '20px' }}>
                                <div class="col-lg-6 text-center">You are not assignd to any permissions please contact Admin.</div>
                            </div>
                        </div>
                    )}
                </div>
            </Router>
        </div>
    );
};

export default App;
