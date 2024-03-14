import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';

import { useMutation, useQuery } from 'react-query';
import { LiaSitemapSolid } from 'react-icons/lia';
import API from './API/API';

import { useHistory } from 'react-router-dom';
import { LuPackageOpen } from 'react-icons/lu';

import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import { MdOutlineHub, MdOutlineInventory2, MdSwitchAccount } from 'react-icons/md';
import { BiSolidCoinStack, BiSolidSpreadsheet, BiTransfer } from 'react-icons/bi';
import { CiBoxes } from 'react-icons/ci';
import { IoMdHome } from 'react-icons/io';
export const Contexthandlerscontext = React.createContext();
export const Contexthandlerscontext_provider = (props) => {
    let history = useHistory();
    const { fetchuseauthorization, Checkauth_API, Login_API, FetchPhases_API } = API();
    const [hidesidenav_context, sethidesidenav_context] = useState(false);
    const [scroll, setScroll] = useState(false);
    const cookies = new Cookies();
    const [openloginmodalcontext, setopenloginmodalcontext] = useState(true);
    const [allcachedproductscontext, setallcachedproductscontext] = useState([]);
    const fetchAuthorizationQueryContext = useQuery(['Checkauth_API'], () => Checkauth_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchPhases = useQuery(['FetchPhases_API' + JSON.stringify(filterobj)], () => FetchPhases_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const LoginmutationContext = useMutation('Login_API', {
        mutationFn: Login_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                NotificationManager.success('Login Success', 'Success');
                cookies.set('coas8866612efaasasdscjckkkkas32131asdsadsassjjscjjjeasd123!@_#!@3123', data.data.access);
                fetchAuthorizationQueryContext.refetch();
                window.open(window.location.origin + '/leads', '_self');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    const [pagesarray_context, setpagesarray_context] = useState([]);
    const [chosencompany, setchosencompany] = useState(false);

    const [pagetitle_context, setpagetitle_context] = useState('');
    const [value, setValue] = useState(0);

    const [filterLeadscontext, setfilterLeadscontext] = useState({
        page: 1,
        search: '',
        phase_id: 'all',
        group_id: 'all',
        platform: 'all',
        meta_campaign_id: 'all',
        meta_adset_id: 'all',
        meta_ad_id: 'all',
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
    });
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
    const isshowuserpage = (page) => {
        var show = true;
        if (
            fetchAuthorizationQueryContext?.data?.data?.currentcompanyusertype == 'companyowner' ||
            fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'adminuser' ||
            fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin'
        ) {
            show = true;
        } else {
            fetchAuthorizationQueryContext?.data?.data?.permissions?.map((item, index) => {
                if (item?.permission?.permissiontype == 'Page') {
                    if (item?.permission?.name == page) {
                        show = true;
                    }
                }
            });
        }
        return show;
    };
    const [sheetStatusesContext, setsheetStatusesContext] = useState([
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Waiting For Admin', value: 'waitingForAdmin' },
        { label: 'Waiting For Finance', value: 'waitingForFinance' },
        { label: 'Complete', value: 'complete' },
    ]);

    const [expensesTypeContext, setexpensesTypeContext] = useState([
        { label: 'Salary', value: 'salary' },
        { label: 'Rent', value: 'rent' },
        { label: 'Utilities', value: 'utilities' },
        { label: 'Office Supplies', value: 'officeSupplies' },
        { label: 'Vehicle Maintenance', value: 'vehicleMaintenance' },
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
    ]);
    const [orderTypeContext, setorderTypeContext] = useState([
        { label: 'Delivery', value: 'delivery' },
        { label: 'Exchange', value: 'exchange' },
        { label: 'Refund', value: 'refund' },
        { label: 'Free Delivery', value: 'freeDelivery' },
        { label: 'Gift', value: 'gift' },
        { label: 'Free Of Charge', value: 'freeOfCharge' },
    ]);

    const [orderStatusesContext, setorderStatusesContext] = useState([
        { label: 'Idle', value: 'idle' },
        { label: 'Shipped From Courier', value: 'shippedFromCourier' },
        { label: 'Transferring', value: 'transferring' },
        { label: 'Assigned To Courier', value: 'assignedToCourier' },
        { label: 'Out For Delivery', value: 'outForDelivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Partially Delivered', value: 'partiallyDelivered' },
        { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
        { label: 'Postponed', value: 'postponed' },
    ]);

    const [transactionStatusesContext, settransactionStatusesContext] = useState([
        { label: 'Pending Sender', value: 'pendingSender' },
        { label: 'Pending Receiver', value: 'pendingReceiver' },
        { label: 'Processing By Sender', value: 'processingBySender' },
        { label: 'Processing By Receiver', value: 'processingByReceiver' },
        { label: 'Rejected By Sender', value: 'rejectedBySender' },
        { label: 'Rejected By Receiver', value: 'rejectedByReceiver' },
        { label: 'Cancelled By Sender', value: 'cancelledBySender' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
    ]);

    const [transactionTypesContext, settransactionTypesContext] = useState([
        { label: 'Deposit', value: 'deposit' },
        { label: 'Withdrawal', value: 'withdrawal' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'Refund', value: 'refund' },
        { label: 'Adjustment', value: 'adjustment' },
        { label: 'Interest', value: 'interest' },
        { label: 'Donation', value: 'donation' },
        { label: 'Conversion', value: 'conversion' },
        { label: 'Reward', value: 'reward' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Rent', value: 'rent' },
        { label: 'Payment', value: 'payment' },
        { label: 'Other', value: 'other' },
    ]);

    useEffect(() => {
        if (FetchPhases?.isSuccess && !FetchPhases?.isFetching) {
            var pagesarr = [
                {
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
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                    ],
                },
                {
                    maintitle: 'Inventory',
                    subitems: [
                        {
                            name: 'Inventory details',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <MdOutlineInventory2 size={18} />
                                </i>
                            ),
                            path: '/inventorydetails',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Inventories',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <LiaSitemapSolid size={18} />
                                </i>
                            ),
                            path: '/inventoryitems',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Hub Items',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <MdOutlineHub size={18} />
                                </i>
                            ),
                            path: '/hubitems',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Orders',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <LuPackageOpen size={18} />
                                </i>
                            ),
                            path: '/orders',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                    ],
                },
                {
                    maintitle: 'Merchant',
                    subitems: [
                        {
                            name: 'Home',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <IoMdHome size={18} />
                                </i>
                            ),
                            path: '/merchanthome',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Finance',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BiSolidCoinStack size={18} />
                                </i>
                            ),
                            path: '/merchantfinance',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
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
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
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
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                    ],
                },
                {
                    maintitle: 'Courier',
                    subitems: [
                        {
                            name: 'Home',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <IoMdHome size={18} />
                                </i>
                            ),
                            path: '/courierhome',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Sheets',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BiSolidSpreadsheet size={18} />
                                </i>
                            ),
                            path: '/couriersheets',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                    ],
                },
                {
                    maintitle: 'Finance',
                    subitems: [
                        {
                            name: 'Home',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <IoMdHome size={18} />
                                </i>
                            ),
                            path: '/financehome',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Sheets',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BiSolidSpreadsheet size={18} />
                                </i>
                            ),
                            path: '/financesheets',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
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
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Financial Orders',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <LuPackageOpen size={18} />
                                </i>
                            ),
                            path: '/financeorders',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Transactions',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BiTransfer size={18} />
                                </i>
                            ),
                            path: '/financetransactions',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                    ],
                },
            ];
            // FetchPhases?.data?.data?.data?.map((item, index) => {
            //     pagesarr[0].subitems.push({
            //         name: (
            //             <span class=" text-capitalize d-flex align-items-center">
            //                 <span
            //                     class="mx-2 px-1"
            //                     style={{
            //                         background: 'var(--primary)',
            //                         color: 'white',
            //                         borderRadius: '3px',
            //                         fontSize: '9px',
            //                         opacity: parseInt(filterLeadscontext.phase_id) == parseInt(item.id) ? '1' : '0.75',
            //                         transition: 'all 0.4s',
            //                     }}
            //                 >
            //                     {item?.leads_count}
            //                 </span>
            //                 {item?.name}{' '}
            //             </span>
            //         ),
            //         isselected: parseInt(filterLeadscontext.phase_id) == parseInt(item.id) ? true : false,
            //         icon: '',
            //         path: '/leads?phaseid=' + item?.id,
            //         show: isshowuserpage('Show Leads Page'),
            //     });
            // });
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
        }
    }, [fetchAuthorizationQueryContext?.isSuccess, fetchAuthorizationQueryContext?.data, FetchPhases?.isSuccess, FetchPhases?.data, filterLeadscontext]);

    return (
        <Contexthandlerscontext.Provider
            value={{
                filterLeadscontext,
                setfilterLeadscontext,
                chosencompany,
                setchosencompany,
                pagesarray_context,
                setpagesarray_context,
                pagetitle_context,
                setpagetitle_context,
                setpageactive_context,
                hidesidenav_context,
                sethidesidenav_context,
                openloginmodalcontext,
                setopenloginmodalcontext,
                fetchAuthorizationQueryContext,
                allcachedproductscontext,
                setallcachedproductscontext,
                scroll,
                setScroll,
                dateformatter,
                LoginmutationContext,
                value,
                setValue,
                sheetStatusesContext,
                setsheetStatusesContext,
                orderStatusesContext,
                setorderStatusesContext,
                transactionStatusesContext,
                settransactionStatusesContext,
                transactionTypesContext,
                settransactionTypesContext,
                orderTypeContext,
                setorderTypeContext,
                expensesTypeContext,
                setexpensesTypeContext,
            }}
        >
            {props.children}
        </Contexthandlerscontext.Provider>
    );
};
