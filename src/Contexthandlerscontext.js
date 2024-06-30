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
import { CiBoxes, CiShop } from 'react-icons/ci';
import { IoMdHome } from 'react-icons/io';
import { FaMap } from 'react-icons/fa';
import { TbArrowsExchange, TbPackages } from 'react-icons/tb';
export const Contexthandlerscontext = React.createContext();
export const Contexthandlerscontext_provider = (props) => {
    let history = useHistory();
    const [hidesidenav_context, sethidesidenav_context] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [openloginmodalcontext, setopenloginmodalcontext] = useState(true);
    const [allcachedproductscontext, setallcachedproductscontext] = useState([]);
    const [pagesarray_context, setpagesarray_context] = useState([]);
    const [pagetitle_context, setpagetitle_context] = useState('');
    const [value, setValue] = useState(0);
    const [UserInfoContext, setUserInfoContext] = useState({});

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
    const isAuth = (roles) => {
        var show = false;
        const cookies = new Cookies();
        var user = cookies.get('userInfo');
        var acceptedRoles = roles.filter((e) => user?.roles?.map((x) => x.roleId).includes(e));
        show = acceptedRoles?.length > 0;
        return show;
    };

    const sheetStatusesContext = [
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

    const orderStatusesContext = [
        { label: 'Idle', value: 'idle' },
        { label: 'Shipped From Courier', value: 'shippedFromCourier' },
        { label: 'Transferring', value: 'transferring' },
        { label: 'Assigned To Courier', value: 'assignedToCourier' },
        { label: 'Out For Delivery', value: 'outForDelivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Partially Delivered', value: 'partiallyDelivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed Delivery Attempt', value: 'failedDeliveryAttempt' },
        { label: 'Postponed', value: 'postponed' },
    ];

    const transactionStatusesContext = [
        { label: 'Pending Sender', value: 'pendingSender' },
        { label: 'Pending Receiver', value: 'pendingReceiver' },
        { label: 'Processing', value: 'processing' },
        { label: 'Processing By Sender', value: 'processingBySender' },
        { label: 'Processing By Receiver', value: 'processingByReceiver' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Rejected By Sender', value: 'rejectedBySender' },
        { label: 'Rejected By Receiver', value: 'rejectedByReceiver' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Cancelled By Sender', value: 'cancelledBySender' },
        { label: 'Cancelled By Receiver', value: 'cancelledByReceiver' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending Internal', value: 'pendingInternal' },
        { label: 'Transferred', value: 'transferred' },
    ];

    const transactionStatusesSelectContext = [
        { label: 'Process', value: 'process' },
        { label: 'Complete', value: 'complete' },
        { label: 'Reject', value: 'reject' },
        // { label: 'Cancel', value: 'cancel' },
        // { label: 'Fail', value: 'fail' },
    ];
    const transactionTypesContext = [
        { label: 'Deposit', value: 'deposit' },
        { label: 'Withdrawal', value: 'withdrawal' },
        { label: 'Order Collection', value: 'orderCollection' },
        { label: 'Shipping Collection', value: 'shippinCollection' },
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

    const requestPrioritiesContext = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
    ];

    const requestStatusesContext = [
        { label: 'Sent', value: 'sent' },
        { label: 'Pending', value: 'pending' },
        { label: 'Read', value: 'read' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Expired', value: 'expired' },
        // Add other request statuses...
    ];

    const requestTypesContext = [
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
        // Add other request types...
    ];

    const orderTypesContext = [
        { label: 'Delivery', value: 'delivery' },
        { label: 'Exchange', value: 'exchange' },
        { label: 'Refund', value: 'refund' },
        { label: 'Free Delivery', value: 'freeDelivery' },
        { label: 'Gift', value: 'gift' },
        { label: 'Free Of Charge', value: 'freeOfCharge' },
    ];

    const expenseTypesContext = [
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
        // Add other expense types...
    ];

    const employeeTypesContext = [
        { label: 'Admin', value: 'admin' },
        { label: 'Finance', value: 'finance' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Courier', value: 'courier' }, // Add other employee types...
    ];

    const financialAccountTypesContext = [
        { label: 'Hub', value: 'hub' },
        { label: 'User', value: 'user' },
        { label: 'Merchant', value: 'merchant' },
        { label: 'Bank', value: 'bank' }, // Add other financial account types...
        { label: 'Department', value: 'department' }, // Add other financial account types...
    ];

    const itemHistoryEnumContext = [
        { label: 'Import', value: 'import' },
        { label: 'New Import', value: 'newImport' },
        { label: 'Order Return', value: 'orderReturn' },
        { label: 'Export', value: 'export' }, // Add other item history enums...
        { label: 'Order Export', value: 'orderExport' }, // Add other item history enums...
    ];

    const inventoryRentTypesContext = [
        { label: 'Item', value: 'item' },
        { label: 'Order', value: 'order' },
        { label: 'Box', value: 'box' },
        { label: 'Ballot', value: 'ballot' }, // Add other inventory rent types...
        { label: 'Rack', value: 'rack' }, // Add other inventory rent types...
        { label: 'Inventory', value: 'inventory' }, // Add other inventory rent types...
        { label: 'Meter', value: 'meter' }, // Add other inventory rent types...
    ];

    const merchantVisitTypesContext = [
        { label: 'Order Pickup', value: 'orderPickup' },
        { label: 'Order Returns', value: 'orderReturns' },
        { label: 'Supply Pickup', value: 'supplyPickup' },
        { label: 'Supply Delivery', value: 'supplyDelivery' }, // Add other merchant visit types...
    ];

    const merchantVisitStatusesContext = [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Assigned to Courier', value: 'assignedToCourier' },
        { label: 'On The Way', value: 'onTheWay' },
        { label: 'Completed', value: 'completed' }, // Add other merchant visit statuses...
        { label: 'Canceled', value: 'canceled' }, // Add other merchant visit statuses...
        { label: 'Rescheduled', value: 'rescheduled' }, // Add other merchant visit statuses...
        { label: 'Returned', value: 'returned' }, // Add other merchant visit statuses...
        { label: 'Supplies Delivered', value: 'suppliesDelivered' }, // Add other merchant visit statuses...
    ];

    const userTypesContext = [
        { label: 'Employee', value: 'employee' },
        { label: 'Merchant', value: 'merchant' },
        { label: 'Customer', value: 'customer' },
    ];

    const paymentTypesContext = [
        { label: 'Cash', value: 'cash' },
        { label: 'Card', value: 'card' },
        { label: 'Free', value: 'free' },
    ];

    const returnPackageStatusContext = [
        { label: 'Idle', value: 'idle' },
        { label: 'Assigned to Courier', value: 'assignedToCourier' },
        { label: 'Transferring', value: 'transferring' },
        { label: 'Delivered', value: 'delivered' },
    ];
    const returnPackageTypesContext = [
        { label: 'Inventory', value: 'inventory' },
        { label: 'Merchant', value: 'merchant' },
    ];

    const [paymentTypeContext, setpaymentTypeContext] = useState([
        { label: 'Cash', value: 'cash' },
        { label: 'Card', value: 'card' },
        { label: 'Free', value: 'free' },
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

    const [empTypesContext, setempTypesContext] = useState([
        { label: 'Admin', value: 'admin' },
        { label: 'Finance', value: 'finance' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Courier', value: 'courier' },
        { label: 'Customer Service', value: 'customerService' },
    ]);

    const [inventoryTypesContext, setinventoryTypesContext] = useState([
        { label: 'Item', value: 'item' },
        { label: 'Box', value: 'box' },
        { label: 'Ballot', value: 'ballot' },
        { label: 'Refund', value: 'refund' },
        { label: 'Rack', value: 'rack' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Meter', value: 'meter' },
    ]);

    const userRolesContext = [
        { label: 'Admin', value: '1', type: 'super', description: 'Super admin with full access' },
        { label: 'Access Inventory', value: '2', type: 'inventory', description: 'Can access the inventory module' },
        { label: 'View Inventories', value: '3', type: 'inventory', description: 'Can view inventories' },
        { label: 'Add Inventories', value: '4', type: 'inventory', description: 'Can add new inventories' },
        { label: 'Edit Inventories', value: '5', type: 'inventory', description: 'Can edit existing inventories' },
        { label: 'View Inventory Items', value: '6', type: 'inventory', description: 'Can view items' },
        { label: 'Add Inventory Items', value: '7', type: 'inventory', description: 'Can add new items' },
        { label: 'Remove Inventory Items', value: '8', type: 'inventory', description: 'Can remove items' },
        { label: 'Access Merchant', value: '9', type: 'merchant', description: 'Can access the merchant module' },
        { label: 'View Merchant Dashboard', value: '10', type: 'merchant', description: 'Can view the merchant dashboard' },
        { label: 'View Merchant Account', value: '11', type: 'merchant', description: 'Can view merchant account details' },
        { label: 'View Merchant Items', value: '12', type: 'merchant', description: 'Can view merchant items' },
        { label: 'Edit Merchant Items', value: '13', type: 'merchant', description: 'Can edit merchant items' },
        { label: 'View Merchant Orders', value: '14', type: 'merchant', description: 'Can view merchant orders' },
        { label: 'Add Merchant Orders', value: '15', type: 'merchant', description: 'Can add new merchant orders' },
        { label: 'Edit Merchant Orders', value: '16', type: 'merchant', description: 'Can edit merchant orders' },
        { label: 'Access Finance', value: '17', type: 'finance', description: 'Can access the finance module' },
        { label: 'View Finance Dashboard', value: '18', type: 'finance', description: 'Can view the finance dashboard' },
        { label: 'View Finance Accounts', value: '19', type: 'finance', description: 'Can view finance accounts' },
        { label: 'Add Finance Accounts', value: '20', type: 'finance', description: 'Can add new finance accounts' },
        { label: 'Edit Finance Accounts', value: '21', type: 'finance', description: 'Can edit finance accounts' },
        { label: 'View Finance Expenses', value: '22', type: 'finance', description: 'Can view finance expenses' },
        { label: 'Add Finance Expenses', value: '23', type: 'finance', description: 'Can add new finance expenses' },
        { label: 'Edit Finance Expenses', value: '24', type: 'finance', description: 'Can edit finance expenses' },
        { label: 'View Finance Orders', value: '25', type: 'finance', description: 'Can view finance orders' },
        { label: 'Edit Finance Orders', value: '26', type: 'finance', description: 'Can edit finance orders' },
        { label: 'View Finance Transactions', value: '27', type: 'finance', description: 'Can view finance transactions' },
        { label: 'Edit Finance Transactions', value: '28', type: 'finance', description: 'Can edit finance transactions' },
        { label: 'Access Courier', value: '29', type: 'courier', description: 'Can access the courier module' },
        { label: 'View Courier Dashboard', value: '30', type: 'courier', description: 'Can view the courier dashboard' },
        { label: 'View Couriers', value: '31', type: 'courier', description: 'Can view couriers' },
        { label: 'Add Couriers', value: '32', type: 'courier', description: 'Can add new couriers' },
        { label: 'Edit Couriers', value: '33', type: 'courier', description: 'Can edit couriers' },
        { label: 'View Courier Sheet', value: '34', type: 'courier', description: 'Can view courier sheets' },
        { label: 'Edit Courier Sheet', value: '35', type: 'courier', description: 'Can edit courier sheets' },
        { label: 'Add Courier Sheet', value: '36', type: 'courier', description: 'Can add new courier sheets' },
        { label: 'Add Request', value: '37', type: 'requests', description: 'Can add new requests' },
        { label: 'Edit Request', value: '38', type: 'requests', description: 'Can edit requests' },
        { label: 'Edit Request Status', value: '39', type: 'requests', description: 'Can edit request statuses' },
        { label: 'Add Order', value: '40', type: 'order', description: 'Can add new orders' },
        { label: 'Edit Order', value: '41', type: 'order', description: 'Can edit orders' },
        { label: 'Edit Order Status', value: '42', type: 'order', description: 'Can edit order statuses' },
        { label: 'Access User Management', value: '43', type: 'management', description: 'Can access user management' },
        { label: 'Add User', value: '44', type: 'management', description: 'Can add new user' },
        { label: 'Edit User', value: '45', type: 'management', description: 'Can edit users' },
        { label: 'Edit User Roles', value: '46', type: 'management', description: 'Can edit user roles' },
        { label: 'View Merchant Finance', value: '47', type: 'merchant', description: 'Can view merchant financial account details' },
        { label: 'Add Merchant User', value: '48', type: 'merchant', description: 'Can add new merchant user' },
        { label: 'Edit Merchant User', value: '49', type: 'merchant', description: 'Can edit merchant users' },
        { label: 'Edit Merchant User Roles', value: '50', type: 'merchant', description: 'Can edit merchant user roles' },
        { label: 'Finance Admin', value: '51', type: 'finance', description: 'Finance full access' },
        { label: 'Merchant Admin', value: '52', type: 'merchant', description: 'Merchant full access' },
        { label: 'Courier Admin', value: '53', type: 'courier', description: 'Courier full access' },
        { label: 'Inventory Admin', value: '54', type: 'inventory', description: 'Inventory full access' },
    ];

    const [chosenMerchantContext, setchosenMerchantContext] = useState({});

    useEffect(() => {
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
                        permissionpage: [1],
                        show: isAuth([1, 43, 44, 45, 46]),
                    },
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
                        show: isAuth([1]),
                    },
                ],
            },
            {
                maintitle: 'Inventory',
                subitems: [
                    // {
                    //     name: 'Inventory details',
                    //     isselected: false,
                    //     icon: (
                    //         <i class={'allcentered'}>
                    //             <MdOutlineInventory2 size={18} />
                    //         </i>
                    //     ),
                    //     path: '/inventorydetails',
                    //     permissionpage: [1],
                    //     show: isAuth([1]),
                    // },
                    {
                        name: 'Inventories',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LiaSitemapSolid size={18} />
                            </i>
                        ),
                        path: '/inventoryitems',
                        permissionpage: [1],
                        show: isAuth([1, 54, 2, 4, 6, 7, 8]),
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
                        show: isAuth([1, 54]),
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
                        show: isAuth([1, 54]),
                    },
                ],
            },
            {
                maintitle: 'Merchant',
                path: '/merchants',
                subitems: [
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
                        show: isAuth([1]),
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
                        show: isAuth([1]),
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
                        permissionpage: [1],
                        show: isAuth([1, 52]),
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
                        show: isAuth([1, 52]),
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
                        show: isAuth([1, 52]),
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
                        show: isAuth([1, 52]),
                    },
                ],
            },
            {
                maintitle: 'Hubs',
                // path: '/hubs',
                subitems: [
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
                        show: isAuth([1]),
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
                        show: isAuth([1]),
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
                        show: isAuth([1]),
                    },
                ],
            },
            {
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
                        name: 'Sheets',
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
                    {
                        name: 'Orders',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <LuPackageOpen size={18} />
                            </i>
                        ),
                        path: '/addsheet',
                        permissionpage: [1],
                        show: isAuth([1, 53, 36]),
                    },
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
                        name: 'Sheets',
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
                        show: isAuth([1, 51, 19, 52]),
                    },
                    {
                        name: 'Merchant Payments',
                        isselected: false,
                        icon: (
                            <i class={'allcentered'}>
                                <MdSwitchAccount size={18} />
                            </i>
                        ),
                        path: '/merchantpayments',
                        permissionpage: [1],
                        show: isAuth([1, 51, 19, 52]),
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
                        permissionpage: [1],
                        show: isAuth([1, 51]),
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

    return (
        <Contexthandlerscontext.Provider
            value={{
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
                sheetStatusesContext,
                orderStatusesContext,
                transactionStatusesContext,
                transactionTypesContext,
                orderTypesContext,
                expensesTypeContext,
                setexpensesTypeContext,
                userTypesContext,
                UserInfoContext,
                setUserInfoContext,
                inventoryTypesContext,
                setinventoryTypesContext,
                paymentTypeContext,
                setpaymentTypeContext,
                empTypesContext,
                setempTypesContext,
                inventoryRentTypesContext,
                merchantVisitTypesContext,
                isAuth,
                chosenMerchantContext,
                setchosenMerchantContext,
                financialAccountTypesContext,
                userRolesContext,
                transactionStatusesSelectContext,
                returnPackageTypesContext,
                returnPackageStatusContext,
            }}
        >
            {props.children}
        </Contexthandlerscontext.Provider>
    );
};
