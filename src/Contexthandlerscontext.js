import React, { useContext, useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';

import { useMutation, useQuery } from 'react-query';
import { LiaSitemapSolid } from 'react-icons/lia';
import API from './API/API';

import { useHistory } from 'react-router-dom';
import { LuPackageOpen } from 'react-icons/lu';
import { RxTokens } from 'react-icons/rx';
import { NotificationManager } from 'react-notifications';
import { IoSettingsOutline } from 'react-icons/io5';
import Cookies from 'universal-cookie';
import { MdOutlineHub, MdOutlineInventory2, MdOutlineSmsFailed, MdSwitchAccount } from 'react-icons/md';
import { BiSolidCoinStack, BiSolidSpreadsheet, BiTransfer } from 'react-icons/bi';
import { CiBoxes, CiShop } from 'react-icons/ci';
import { IoMdHome } from 'react-icons/io';
import { FaMap } from 'react-icons/fa';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { TbArrowsExchange, TbBuilding, TbBuildingStore, TbBuildingWarehouse, TbMoneybag, TbPackages, TbTruckDelivery } from 'react-icons/tb';
import { Loggedincontext } from './Loggedincontext';
export const Contexthandlerscontext = React.createContext();
export const Contexthandlerscontext_provider = (props) => {
    let history = useHistory();

    function useWindowWidth() {
        const [width, setWidth] = useState(window.innerWidth);
        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
        return width;
    }
    const width = useWindowWidth();
    const isSmallScreen = width < 768;
    const [hidesidenav_context, sethidesidenav_context] = useState(isSmallScreen ? true : false);
    const [scroll, setScroll] = useState(false);
    const [openloginmodalcontext, setopenloginmodalcontext] = useState(true);
    const [allcachedproductscontext, setallcachedproductscontext] = useState([]);
    const [pagesarray_context, setpagesarray_context] = useState([]);
    const [importedDataContext, setimportedDataContext] = useState([]);
    const [pagetitle_context, setpagetitle_context] = useState('');
    const [value, setValue] = useState(0);
    const [UserInfoContext, setUserInfoContext] = useState({});
    const [chosenOrderContext, setchosenOrderContext] = useState({});
    const [chosenMerchantSettlemant, setchosenMerchantSettlemant] = useState({});
    const [chosenItemContext, setchosenItemContext] = useState({});
    const [chosenPackageContext, setchosenPackageContext] = useState({});
    const [chosenHubContext, setchosenHubContext] = useState({});
    const [buttonLoadingContext, setbuttonLoadingContext] = useState(false);

    // const [pagetitle_context, setchosenHubContext] = useState({});
    const cookies = new Cookies();
    const phoneUtil = PhoneNumberUtil.getInstance();
    const isPhoneValidContext = (phone) => {
        try {
            return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
        } catch (error) {
            return false;
        }
    };

    const setpageactive_context = (route) => {
        var temparr = [...pagesarray_context];
        temparr?.forEach((sideelement, index) => {
            sideelement?.subitems?.forEach((subsideelement, index) => {
                if (subsideelement?.path == route) {
                    subsideelement['isselected'] = true;
                } else {
                    subsideelement['isselected'] = false;
                }
            });
        });
        setpagesarray_context([...temparr]);
    };
    const dateformatter = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', hour12: true };
        return new Date(date).toLocaleDateString(undefined, options);
    };
    const isAuth = (permissions) => {
        var show = false;
        const cookies = new Cookies();
        var user = cookies.get('userInfo');
        // alert(JSON.stringify(user?.permissions));
        const admin = user?.permissions?.some((x) => x.permissionId === 1) || false;

        var acceptedPermissions = permissions.filter((e) => user?.permissions?.map((x) => x.permissionId).includes(e));
        show = acceptedPermissions?.length > 0;
        if (admin) {
            return true;
        } else {
            return show;
        }
    };

    const [chosenMerchantContext, setchosenMerchantContext] = useState({});

    useEffect(() => {
        var pagesarr = [
            {
                icon: (
                    <i class={'allcentered'}>
                        <IoSettingsOutline size={18} />
                    </i>
                ),
                maintitle: 'Settings',
                subitems: [
                    {
                        name: 'Users',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <FiUsers size={18} />
                            </i>
                        ),
                        path: '/users',
                        permissionpage: [1],
                        show: isAuth([1, 43, 44, 45, 46, 52, 78, 79]),
                    },
                ],
            },
            {
                icon: (
                    <i class={'allcentered'}>
                        <TbBuildingWarehouse size={18} />
                    </i>
                ),
                maintitle: 'Warehouses',
                subitems: [
                    // {
                    //     name: 'Rent',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <MdOutlineInventory2 size={18} />
                    //         </i>
                    //     ),
                    //     path: '/rentpage',
                    //     permissionpage: [1],
                    //     show: isAuth([1]),
                    // },
                    {
                        name: 'Warehouses',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LiaSitemapSolid size={18} />
                            </i>
                        ),
                        path: '/inventoryitems',
                        permissionpage: [1],
                        show: isAuth([1, 54, 2, 3, 4, 6, 7, 8, 52, 81, 82, 77, 83]),
                    },
                    {
                        name: 'Inventory Rent',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <CiShop size={18} />
                            </i>
                        ),
                        path: '/inventorysettings?merchantId=' + cookies.get('merchantId'),
                        permissionpage: [1],
                        show: cookies.get('userInfo')?.type == 'merchant' && cookies.get('merchantId') != undefined,
                    },
                    // {
                    //     name: 'Hub Items',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <MdOutlineHub size={18} />
                    //         </i>
                    //     ),
                    //     path: '/hubitems',
                    //     permissionpage: [1],
                    //     show: isAuth([1, 54]),
                    // },
                    {
                        name: 'Orders',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/orders',
                        permissionpage: [1],
                        show: isAuth([1, 54, 63]),
                    },

                    {
                        name: 'Fulfill',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/handpicked',
                        permissionpage: [1],
                        show: isAuth([1, 54, 85]),
                    },
                    {
                        name: 'Return Packages',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <TbPackages size={18} />
                            </i>
                        ),
                        path: '/inventorypackages',
                        permissionpage: [1],
                        show: cookies.get('userInfo')?.type != 'merchant' && isAuth([1, 54, 64, 2]),
                    },
                    {
                        name: 'Dispatch',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/fulfilled',
                        permissionpage: [1],
                        show: isAuth([1, 54, 86]),
                    },
                    {
                        name: 'Inventory Rent',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/inventoryrent',
                        permissionpage: [1],
                        show: isAuth([1, 54]),
                    },
                    {
                        name: 'Inventory Logs',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <CiShop size={18} />
                            </i>
                        ),
                        path: '/itemhistory',
                        permissionpage: [1],
                        show: isAuth([1, 52]),
                    },
                ],
            },
            {
                icon: (
                    <i class={'allcentered'}>
                        <TbBuildingStore size={18} />
                    </i>
                ),
                maintitle: 'Merchant',
                path: '/merchants',
                subitems: [
                    {
                        name: 'Merchant Details',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <CiShop size={18} />
                            </i>
                        ),
                        path: '/updatemerchant?merchantId=' + cookies.get('merchantId'),
                        permissionpage: [1],
                        show: cookies.get('userInfo')?.type == 'merchant' && cookies.get('merchantId') != undefined && isAuth([91, 118]),
                    },
                    {
                        name: 'Merchants',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <CiShop size={18} />
                            </i>
                        ),
                        path: '/merchants',
                        permissionpage: [1],
                        show: isAuth([1, 91, 87, 84, 88, 89, 90]),
                    },
                    {
                        name: 'Dashboard',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <IoMdHome size={18} />
                            </i>
                        ),
                        path: '/merchanthome',
                        permissionpage: [1],
                        show: isAuth([1, 52, 10]) || cookies.get('merchantId') != undefined,
                    },
                    {
                        name: 'Items',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <CiBoxes size={18} />
                            </i>
                        ),
                        path: '/merchantitems',
                        permissionpage: [1],
                        show: isAuth([1, 52, 12, 74, 75, 12, 13]),
                    },
                    {
                        name: 'Orders',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/merchantorders',
                        permissionpage: [1],
                        show: isAuth([1, 52, 68, 14, 15]),
                    },

                    {
                        name: 'Merchant Payments',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <MdSwitchAccount size={18} />
                            </i>
                        ),
                        path: '/merchantfinance',
                        permissionpage: [1],
                        show: isAuth([1, 51, 19, 52]) && cookies.get('merchantId') != undefined,
                    },
                    {
                        name: 'Return Packages',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <TbPackages size={18} />
                            </i>
                        ),
                        path: '/merchantpackages',
                        permissionpage: [1],
                        show: isAuth([1, 52, 64]) && cookies.get('merchantId') != undefined,
                    },
                    // {
                    //     name: 'Webtoken',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <RxTokens size={18} />
                    //         </i>
                    //     ),
                    //     path: '/webtoken',
                    //     permissionpage: [1],
                    //     show: isAuth([1, 52]),
                    // },
                ],
            },
            {
                icon: (
                    <i class={'allcentered'}>
                        <TbBuilding size={18} />
                    </i>
                ),
                maintitle: 'Hubs',
                // path: '/hubs',
                subitems: [
                    {
                        name: 'Hubs',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <MdOutlineHub size={18} />
                            </i>
                        ),
                        path: '/hubs',
                        permissionpage: [1],
                        show: isAuth([1, 94, 95]),
                    },
                    {
                        name: 'Item Returns',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <TbArrowsExchange size={18} />
                            </i>
                        ),
                        path: '/merchantreturns',
                        permissionpage: [1],
                        show: isAuth([1, 94, 62]),
                    },
                    {
                        name: 'Inventory Returns',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <TbArrowsExchange size={18} />
                            </i>
                        ),
                        path: '/inventoryreturns',
                        permissionpage: [1],
                        show: isAuth([1, 94, 61]),
                    },
                    {
                        name: 'Return Packages',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <TbPackages size={18} />
                            </i>
                        ),
                        path: '/packages',
                        permissionpage: [1],
                        show: cookies.get('userInfo')?.type != 'merchant' && isAuth([1, 94, 64]),
                    },
                    {
                        name: 'Receive At Hub',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/arrivedathub',
                        permissionpage: [1],
                        show: isAuth([1, 101]),
                    },
                    {
                        name: 'Receive At Sort Facilities',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/dispatched',
                        permissionpage: [1],
                        show: isAuth([1, 102]),
                    },
                    {
                        name: 'Transfer',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/sortfacilities',
                        permissionpage: [1],
                        show: isAuth([1, 103]),
                    },
                    {
                        name: 'Action Center',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <MdOutlineSmsFailed size={18} />
                            </i>
                        ),
                        path: '/actioncenter',
                        permissionpage: [1],
                        show: isAuth([1, 104]),
                    },
                ],
            },
            {
                icon: (
                    <i class={'allcentered'}>
                        <TbTruckDelivery size={18} />
                    </i>
                ),
                maintitle: 'Courier',
                subitems: [
                    {
                        name: 'Dashboard',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <IoMdHome size={18} />
                            </i>
                        ),
                        path: '/courierhome',
                        permissionpage: [1],
                        show: isAuth([1, 53, 30]),
                    },
                    {
                        name: 'Manifest',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiSolidSpreadsheet size={18} />
                            </i>
                        ),
                        path: '/couriersheets',
                        permissionpage: [1],
                        show: isAuth([1, 53, 34, 35]),
                    },
                    // {
                    //     name: 'Orders',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <LuPackageOpen size={18} />
                    //         </i>
                    //     ),
                    //     path: '/addsheet',
                    //     permissionpage: [1],
                    //     show: isAuth([1, 53, 36]),
                    // },
                    // {
                    //     name: 'Return Packages',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <TbPackages size={18} />
                    //         </i>
                    //     ),
                    //     path: '/courierpackages',
                    //     permissionpage: [1],
                    //     show: isAuth([1, 53]),
                    // },
                ],
            },
            {
                icon: (
                    <i class={'allcentered'}>
                        <TbMoneybag size={18} />
                    </i>
                ),
                maintitle: 'Finance',
                subitems: [
                    {
                        name: 'Dashboard',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <IoMdHome size={18} />
                            </i>
                        ),
                        path: '/financehome',
                        permissionpage: [1],
                        show: isAuth([1, 51, 18]),
                    },
                    {
                        name: 'Manifest',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiSolidSpreadsheet size={18} />
                            </i>
                        ),
                        path: '/financesheets',
                        permissionpage: [1],
                        show: isAuth([1, 51]),
                    },
                    {
                        name: 'Financial Accounts',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <MdSwitchAccount size={18} />
                            </i>
                        ),
                        path: '/financialaccounts',
                        permissionpage: [1],
                        show: isAuth([1, 51, 19]),
                    },
                    {
                        name: 'Courier Collections',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <MdSwitchAccount size={18} />
                            </i>
                        ),
                        path: '/couriercollections',
                        permissionpage: [1],
                        show: isAuth([1, 51, 107]),
                    },
                    // {
                    //     name: 'Merchant Payments',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <MdSwitchAccount size={18} />
                    //         </i>
                    //     ),
                    //     path: '/merchantpayments',
                    //     permissionpage: [1],
                    //     show: isAuth([1, 51, 19]),
                    // },
                    // {
                    //     name: 'Merchant Order Payments',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <BiSolidCoinStack size={18} />
                    //         </i>
                    //     ),
                    //     path: '/merchantfinance',
                    //     permissionpage: [1],
                    //     show: isAuth([1, 51, 110]),
                    // },
                    {
                        name: 'Transactions',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiTransfer size={18} />
                            </i>
                        ),
                        path: '/financetransactions',
                        permissionpage: [1],
                        show: isAuth([1, 51, 27]),
                    },
                    {
                        name: 'Expenses',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiTransfer size={18} />
                            </i>
                        ),
                        path: '/expenses',
                        permissionpage: [1],
                        show: isAuth([1, 51]),
                    },
                    {
                        name: 'Inventory Rent Bills',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiTransfer size={18} />
                            </i>
                        ),
                        path: '/rentbills',
                        permissionpage: [1],
                        show: isAuth([1, 51, 114]),
                    },
                    {
                        name: 'Create Settlements',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiTransfer size={18} />
                            </i>
                        ),
                        path: '/settlements',
                        permissionpage: [1],
                        show: isAuth([1, 122, 123]),
                    },
                    {
                        name: 'Shipping Taxes',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiTransfer size={18} />
                            </i>
                        ),
                        path: '/shippingcollections',
                        permissionpage: [1],
                        show: isAuth([1, 51, 124]),
                    },
                    {
                        name: 'Merchant Settlements',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <BiTransfer size={18} />
                            </i>
                        ),
                        path: '/merchantsettlements',
                        permissionpage: [1],
                        show: isAuth([1, 51, 52, 122]),
                    },
                ],
            },
            // {
            //     maintitle: 'Shipping',
            //     subitems: [
            //         {
            //             name: 'Governorates',
            //             isselected: false,
            //             icon: (
            //                 <i class={'allcentered'}>
            //                     <FaMap size={18} />
            //                 </i>
            //             ),
            //             path: '/governorates',
            //             permissionpage: [1],
            //             show: isAuth([1]),
            //         },
            //     ],
            // },
        ];

        var temp = [];
        pagesarr?.map((i, ii) => {
            var exist = false;
            i.subitems?.map((item, index) => {
                if (item?.show) {
                    exist = true;
                }
            });
            if (exist) {
                temp.push(i);
            }
        });

        setpagesarray_context([...temp]);
        setchosenMerchantContext(UserInfoContext?.user?.merchantId);
        // alert(JSON.stringify(UserInfoContext?.user?.merchantId));
    }, [UserInfoContext]);

    const courierSheetStatusesContext = [
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Waiting For Admin Approval', value: 'waitingForAdminApproval' },
        { label: 'Waiting For Finance Approval', value: 'waitingForFinanceApproval' },
        { label: 'Completed', value: 'completed' },
    ];

    const sheetOrderStatusesContext = [
        { label: 'Admin Accepted', value: 'adminAccepted' },
        { label: 'Admin Rejected', value: 'adminRejected' },
        { label: 'Finance Accepted', value: 'financeAccepted' },
        { label: 'Finance Rejected', value: 'financeRejected' },
    ];
    const orderStatusEnumContext = [
        { label: 'Idle', value: 'idle' },
        { label: 'Hand Picked', value: 'handPicked' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Dispatched', value: 'dispatched' },
        { label: 'Picked Up', value: 'pickedUp' },
        { label: 'Arrived At Sort Facilities', value: 'arrivedAtSortFacilities' },
        { label: 'Arrived At Hub', value: 'arrivedAtHub' },
        { label: 'Transferring', value: 'transferring' },
        { label: 'Assigned To Courier', value: 'assignedToCourier' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Partially Delivered', value: 'partiallyDelivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
        { label: 'In Resolution', value: 'inResolution' },
        { label: 'In Cage', value: 'inCage' },
        { label: 'Postponed', value: 'postponed' },
        { label: 'Returned', value: 'returned' },
        { label: 'Partially Returned', value: 'partiallyReturned' },
        { label: 'Lost', value: 'lost' },
    ];

    const transactionUpdateTypeContext = [
        { label: 'Process', value: 'process' },
        { label: 'Complete', value: 'complete' },
        { label: 'Reject', value: 'reject' },
        { label: 'Cancel', value: 'cancel' },
        { label: 'Fail', value: 'fail' },
    ];

    const shippingStatusContext = [
        { label: 'Collected', value: 'collected' },
        { label: 'Not Collected', value: 'notCollected' },
        { label: 'Dismissed', value: 'dismissed' },
    ];
    const transactionStatusTypeContext = [
        { label: 'Pending Sender', value: 'pendingSender' },
        { label: 'Pending Receiver', value: 'pendingReceiver' },
        { label: 'Processing', value: 'processing' },
        { label: 'Processing By Sender', value: 'processingBySender' },
        { label: 'Processing By Receiver', value: 'processingByReceiver' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Rejected By Sender', value: 'rejectedBySender' },
        { label: 'Rejected By Receiver', value: 'rejectedByReceiver' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled By Sender', value: 'cancelledBySender' },
        { label: 'Cancelled By Receiver', value: 'cancelledByReceiver' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending Internal', value: 'pendingInternal' },
        { label: 'Transferred', value: 'transferred' },
    ];

    const closingTransactionStatuses = [
        { label: 'Completed', value: 'completed' },
        { label: 'Rejected By Receiver', value: 'rejectedByReceiver' },
        { label: 'Rejected By Sender', value: 'rejectedBySender' },
        { label: 'Cancelled By Receiver', value: 'cancelledByReceiver' },
        { label: 'Cancelled By Sender', value: 'cancelledBySender' },
    ];

    const transactionTypeContext = [
        { label: 'Deposit', value: 'deposit' },
        { label: 'Withdrawal', value: 'withdrawal' },
        { label: 'Order Collection', value: 'orderCollection' },
        { label: 'Shipping Collection', value: 'shippingCollection' },
        { label: 'Courier Collection', value: 'courierCollection' },
        { label: 'Courier Collection Transfer', value: 'courierCollectionTransfer' },
        { label: 'Merchant Order Payment', value: 'merchantOrderPayment' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'Refund', value: 'refund' },
        { label: 'Adjustment', value: 'adjustment' },
        { label: 'Interest', value: 'interest' },
        { label: 'Donation', value: 'donation' },
        { label: 'Conversion', value: 'conversion' },
        { label: 'Reward', value: 'reward' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Inventory Rent', value: 'inventoryRent' },
        { label: 'Payment', value: 'payment' },
        { label: 'Taxes', value: 'taxes' },
        { label: 'Other', value: 'other' },
    ];

    const expenseTypeContext = [
        { label: 'Salary', value: 'salary' },
        { label: 'Salary Bonus', value: 'salaryBonus' },
        { label: 'Salary Overtime', value: 'salaryOvertime' },
        { label: 'Rent', value: 'rent' },
        { label: 'Utilities', value: 'utilities' },
        { label: 'Office Supplies', value: 'officeSupplies' },
        { label: 'Vehicle Maintenance', value: 'vehicleMaintenance' },
        { label: 'Postal Fees', value: 'postalFees' },
        { label: 'Courier Commission', value: 'courierComission' },
        { label: 'Fuel', value: 'fuel' },
        { label: 'Insurance', value: 'insurance' },
        { label: 'Equipment Purchase', value: 'equipmentPurchase' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Software Subscriptions', value: 'softwareSubscriptions' },
        { label: 'Legal Fees', value: 'legalFees' },
        { label: 'Training', value: 'training' },
        { label: 'Taxes', value: 'taxes' },
        { label: 'Loan Repayments', value: 'loanRepayments' },
        { label: 'Interest', value: 'interest' },
        { label: 'Office Rent', value: 'officeRent' },
        { label: 'Warehouse Rent', value: 'warehouseRent' },
        { label: 'Travel Expenses', value: 'travelExpenses' },
        { label: 'Professional Services', value: 'professionalServices' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Security Services', value: 'securityServices' },
        { label: 'Packaging Materials', value: 'packagingMaterials' },
        { label: 'Cleaning Services', value: 'cleaningServices' },
        { label: 'Waste Disposal', value: 'wasteDisposal' },
        { label: 'Office Equipment', value: 'officeEquipment' },
        { label: 'Internet Services', value: 'internetServices' },
        { label: 'Telecommunication', value: 'telecommunication' },
        { label: 'Office Furniture', value: 'officeFurniture' },
        { label: 'Membership Fees', value: 'membershipFees' },
        { label: 'Professional Development', value: 'professionalDevelopment' },
        { label: 'Vehicle Lease', value: 'vehicleLease' },
        { label: 'Advertising', value: 'advertising' },
        { label: 'Delivery Expenses', value: 'deliveryExpenses' },
        { label: 'Miscellaneous', value: 'miscellaneous' },
    ];

    const requestPriorityContext = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
    ];

    const requestTypeContext = [
        { label: 'Notification', value: 'notification' },
        { label: 'Confirmation', value: 'confirmation' },
        { label: 'Authorization', value: 'authorization' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Verification', value: 'verification' },
        { label: 'Reminder', value: 'reminder' },
        { label: 'Invitation', value: 'invitation' },
        { label: 'Password Reset', value: 'passwordReset' },
        { label: 'Account Update', value: 'accountUpdate' },
        { label: 'Transaction Update', value: 'transactionUpdate' },
        { label: 'Policy Update', value: 'policyUpdate' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Feedback', value: 'feedback' },
        { label: 'Support', value: 'support' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Survey', value: 'survey' },
        { label: 'Report', value: 'report' },
        { label: 'Inquiry', value: 'inquiry' },
        { label: 'Appointment', value: 'appointment' },
        { label: 'Request', value: 'request' },
        { label: 'Order Problem', value: 'orderProblem' },
        { label: 'Payment Reminder', value: 'paymentReminder' },
        { label: 'Invoice', value: 'invoice' },
        { label: 'Other', value: 'other' },
    ];

    const orderTypeContext = [
        { label: 'Delivery', value: 'delivery' },
        { label: 'Exchange', value: 'exchange' },
        { label: 'Return', value: 'return' },
        { label: 'Free Shipping', value: 'freeShipping' },
        // { label: 'Free Of Charge', value: 'freeOfCharge' },
    ];

    const paymentTypeContext = [
        { label: 'Cash', value: 'cash' },
        { label: 'Card', value: 'card' },
    ];

    const requestStatusContext = [
        { label: 'Sent', value: 'sent' },
        { label: 'Pending', value: 'pending' },
        { label: 'Read', value: 'read' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Expired', value: 'expired' },
    ];

    const userTypeContext = [
        { label: 'Employee', value: 'employee' },
        { label: 'Merchant', value: 'merchant' },
        // { label: 'Customer', value: 'customer' },
    ];

    const employeeTypeContext = [
        { label: 'Admin', value: 'admin' },
        { label: 'Finance', value: 'finance' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Courier', value: 'courier' },
        { label: 'Customer Service', value: 'customerService' },
    ];

    const financialAccountTypeContext = [
        { label: 'Hub', value: 'hub' },
        { label: 'User', value: 'user' },
        { label: 'Merchant', value: 'merchant' },
        { label: 'Bank', value: 'bank' },
        { label: 'Department', value: 'department' },
    ];

    const itemHistoryEnumContext = [
        { label: 'Import', value: 'import' },
        { label: 'Return', value: 'return' },
        { label: 'Order Return', value: 'orderReturn' },
        { label: 'Export', value: 'export' },
        { label: 'Order Pick', value: 'orderPick' },
    ];

    const inventoryRentTypeContext = [
        { label: 'Item', value: 'item' },
        { label: 'Order', value: 'order' },
        { label: 'Box', value: 'box' },
        { label: 'Pallet', value: 'pallet' },
        { label: 'Rack', value: 'rack' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Meter', value: 'meter' },
    ];

    const merchantVisitTypeContext = [
        { label: 'Order Pickup', value: 'orderPickup' },
        { label: 'Order Returns', value: 'orderReturns' },
        { label: 'Supply Pickup', value: 'supplyPickup' },
    ];

    const merchantVisitStatusContext = [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Assigned to Courier', value: 'assignedToCourier' },
        { label: 'On The Way', value: 'onTheWay' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled ', value: 'cancelled ' },
        { label: 'Rescheduled', value: 'rescheduled' },
        { label: 'Returned', value: 'returned' },
        { label: 'Supplies Delivered', value: 'suppliesDelivered' },
    ];

    const discountTypeContext = [
        { label: 'Fixed', value: 'fixed' },
        { label: 'Percentage', value: 'percentage' },
        { label: 'Free Shipping', value: 'freeShipping' },
    ];

    const inventoryReturnStatusContext = [
        { label: 'Idle', value: 'idle' },
        { label: 'Returned To Box', value: 'returnedToBox' },
    ];

    const returnPackageTypeContext = [
        { label: 'Inventory', value: 'inventory' },
        { label: 'Merchant', value: 'merchant' },
    ];

    const returnPackageStatusContext = [
        { label: 'Idle', value: 'idle' },
        { label: 'Assigned To Courier', value: 'assignedToCourier' },
        { label: 'Transferring', value: 'transferring' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Restocked', value: 'restocked' },
    ];

    const permissionTypeContext = [
        { label: 'Super Admin', value: 'super' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Merchant', value: 'merchant' },
        { label: 'Finance', value: 'finance' },
        { label: 'Courier', value: 'courier' },
        { label: 'Customer', value: 'customer' },
        { label: 'Requests', value: 'requests' },
        { label: 'Order', value: 'order' },
        { label: 'Management', value: 'management' },
        { label: 'Return Package', value: 'returnPackage' },
    ];
    const userPermissionsContext = [
        { label: 'Admin', value: 'admin' },
        { label: 'Access Inventory', value: 'accessInventory' },
        { label: 'View Inventories', value: 'viewInventories' },
        { label: 'Create Inventories', value: 'createInventories' },
        { label: 'Edit Inventories', value: 'editInventories' },
        { label: 'View Inventory Items', value: 'viewInventoryItems' },
        { label: 'Create Inventory Items', value: 'createInventoryItems' },
        { label: 'Delete Inventory Items', value: 'deleteInventoryItems' },
        { label: 'Access Merchant', value: 'accessMerchant' },
        { label: 'View Merchant Dashboard', value: 'viewMerchantDashboard' },
        { label: 'View Merchant Account', value: 'viewMerchantAccount' },
        { label: 'View Merchant Items', value: 'viewMerchantItems' },
        { label: 'Edit Merchant Items', value: 'editMerchantItems' },
        { label: 'View Merchant Orders', value: 'viewMerchantOrders' },
        { label: 'Create Merchant Orders', value: 'createMerchantOrders' },
        { label: 'Edit Merchant Orders', value: 'editMerchantOrders' },
        { label: 'Access Finance', value: 'accessFinance' },
        { label: 'View Finance Dashboard', value: 'viewFinanceDashboard' },
        { label: 'View Finance Accounts', value: 'viewFinanceAccounts' },
        { label: 'Create Finance Accounts', value: 'createFinanceAccounts' },
        { label: 'Edit Finance Accounts', value: 'editFinanceAccounts' },
        { label: 'View Finance Expenses', value: 'viewFinanceExpenses' },
        { label: 'Create Finance Expenses', value: 'createFinanceExpenses' },
        { label: 'Edit Finance Expenses', value: 'editFinanceExpenses' },
        { label: 'View Finance Orders', value: 'viewFinanceOrders' },
        { label: 'Edit Finance Orders', value: 'editFinanceOrders' },
        { label: 'View Finance Transactions', value: 'viewFinanceTransactions' },
        { label: 'Edit Finance Transactions', value: 'editFinanceTransactions' },
        { label: 'Access Courier', value: 'accessCourier' },
        { label: 'View Courier Dashboard', value: 'viewCourierDashboard' },
        { label: 'View Couriers', value: 'viewCouriers' },
        { label: 'Create Couriers', value: 'createCouriers' },
        { label: 'Edit Couriers', value: 'editCouriers' },
        { label: 'View Courier Sheet', value: 'viewCourierSheet' },
        { label: 'Edit Courier Sheet', value: 'editCourierSheet' },
        { label: 'Create Courier Sheet', value: 'createCourierSheet' },
        { label: 'Create Request', value: 'createRequest' },
        { label: 'Edit Request', value: 'editRequest' },
        { label: 'Edit Request Status', value: 'editRequestStatus' },
        { label: 'Create Order', value: 'createOrder' },
        { label: 'Edit Order', value: 'editOrder' },
        { label: 'Edit Order Status', value: 'editOrderStatus' },
        { label: 'Access User Management', value: 'accessUserManagement' },
        { label: 'Create User', value: 'createUser' },
        { label: 'Edit User', value: 'editUser' },
        { label: 'Edit User Permissions', value: 'editUserPermissions' },
        { label: 'View Merchant Finance', value: 'viewMerchantFinance' },
        { label: 'Create Merchant User', value: 'createMerchantUser' },
        { label: 'Edit Merchant User', value: 'editMerchantUser' },
        { label: 'Edit Merchant User Permissions', value: 'editMerchantUserPermissions' },
        { label: 'Finance Admin', value: 'financeAdmin' },
        { label: 'Merchant Admin', value: 'merchantAdmin' },
        { label: 'Courier Admin', value: 'courierAdmin' },
        { label: 'Inventory Admin', value: 'inventoryAdmin' },
        { label: 'View All Customers', value: 'viewAllCustomers' },
        { label: 'Delete Any Customer', value: 'deleteAnyCustomer' },
        { label: 'Edit All Customers', value: 'editAllCustomers' },
        { label: 'Send Finance Transaction', value: 'sendFinanceTransaction' },
        { label: 'Edit Hub Finance Transactions', value: 'editHubFinanceTransactions' },
        { label: 'Process Merchant Payments', value: 'processMerchantPayments' },
        { label: 'View Inventory Returns', value: 'viewInventoryReturns' },
        { label: 'View Item Returns', value: 'viewItemReturns' },
        { label: 'View All Orders', value: 'viewAllOrders' },
        { label: 'View Return Packages', value: 'viewReturnPackages' },
        { label: 'Create Return Packages', value: 'createReturnPackages' },
        { label: 'Edit Return Packages', value: 'editReturnPackages' },
        { label: 'Delete Return Package', value: 'deleteReturnPackage' },
        { label: 'Create Any Orders', value: 'createAnyOrders' },
        { label: 'Delete User', value: 'deleteUser' },
        { label: 'Create Merchant Visit', value: 'createMerchantVisit' },
        { label: 'Edit Merchant Visit', value: 'editMerchantVisit' },
        { label: 'Delete Merchant Visit', value: 'deleteMerchantVisit' },
        { label: 'Delete Merchant User', value: 'deleteMerchantUser' },
        { label: 'Create Merchant Item', value: 'createMerchantItem' },
        { label: 'Import Merchant Items', value: 'importMerchantItems' },
        { label: 'Delete Merchant Items', value: 'deleteMerchantItems' },
        { label: 'Edit Inventory Item', value: 'editInventoryItem' },
    ];

    const transactionStatusesSelectContext = [
        { label: 'Process', value: 'process' },
        { label: 'Complete', value: 'complete' },
        { label: 'Reject', value: 'reject' },
        // { label: 'Cancel', value: 'cancel' },
        // { label: 'Fail', value: 'fail' },
    ];
    const updateQueryParamContext = (key, value) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (Array.isArray(value) || typeof value === 'object') {
            const serialized = JSON.stringify(value);
            searchParams.set(key, serialized);
        } else if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
        } else {
            searchParams.delete(key);
        }

        const newSearch = searchParams.toString();
        const newPath = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;

        // This updates the URL without reloading the page
        window.history.replaceState(null, '', newPath);
    };
    const [ready, setReady] = useState(false);

    function useLoadQueryParamsToPayload(setPayload) {
        useEffect(() => {
            setReady(false); // Mark ready once params are loaded

            const searchParams = new URLSearchParams(window.location.search);
            const newPayload = {};

            for (const [key, value] of searchParams.entries()) {
                try {
                    const parsed = JSON.parse(value);
                    newPayload[key] = parsed;
                } catch (err) {
                    newPayload[key] = value;
                }
            }

            setPayload((prev) => ({ ...prev, ...newPayload }));
            setReady(true); // Mark ready once params are loaded
        }, [window.location.search, setPayload]);
    }

    return (
        <Contexthandlerscontext.Provider
            value={{
                isSmallScreen,
                ready,
                setReady,
                useLoadQueryParamsToPayload,
                updateQueryParamContext,
                pagesarray_context,
                setpagesarray_context,
                pagetitle_context,
                setpagetitle_context,
                setpageactive_context,
                hidesidenav_context,
                sethidesidenav_context,
                openloginmodalcontext,
                setopenloginmodalcontext,
                allcachedproductscontext,
                setallcachedproductscontext,
                scroll,
                setScroll,
                dateformatter,
                value,
                setValue,
                courierSheetStatusesContext,
                orderStatusEnumContext,
                transactionStatusTypeContext,
                transactionTypeContext,
                orderTypeContext,
                expenseTypeContext,
                userTypeContext,
                sheetOrderStatusesContext,
                inventoryRentTypeContext,
                paymentTypeContext,
                employeeTypeContext,
                merchantVisitTypeContext,

                financialAccountTypeContext,
                userPermissionsContext,
                transactionStatusesSelectContext,
                returnPackageTypeContext,
                returnPackageStatusContext,
                isAuth,
                chosenMerchantContext,
                setchosenMerchantContext,
                UserInfoContext,
                setUserInfoContext,
                setchosenOrderContext,
                chosenOrderContext,
                chosenPackageContext,
                setchosenPackageContext,
                chosenHubContext,
                setchosenHubContext,
                importedDataContext,
                setimportedDataContext,
                chosenItemContext,
                setchosenItemContext,
                buttonLoadingContext,
                setbuttonLoadingContext,
                isPhoneValidContext,
                chosenMerchantSettlemant,
                setchosenMerchantSettlemant,
            }}
        >
            {props.children}
        </Contexthandlerscontext.Provider>
    );
};
