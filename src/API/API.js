import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Contexthandlerscontext } from '../Contexthandlerscontext';
import Cookies from 'universal-cookie';
import { getAuth, signOut } from 'firebase/auth';

const API = () => {
    const cookies = new Cookies();

    const { setUserInfoContext, UserInfoContext } = useContext(Contexthandlerscontext);
    var accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNKa1lDeVFWOU5RREhEYVdLaUZHWmFZblY3UDIiLCJodWJJZCI6MSwiaW52ZW50b3J5SWQiOm51bGwsInR5cGUiOiJFbXBsb3llZSIsIm1lcmNoYW50SWQiOm51bGwsInJvbGVzIjpbMV0sImlhdCI6MTcxMjg0MTk2OSwiZXhwIjoxNzE2ODQzNzY5fQ.vb1L0BcnM0TeJiJmbmAlMm5EB7TVTBq4TCgw3r24x2w';

    // useEffect(() => {
    //     accessToken = UserInfoContext?.accessToken;
    //     accessToken = cookies.get('accessToken');
    // }, [UserInfoContext]);
    const axiosheaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const addUser = () => {
        return gql`
            mutation cruser($input: CreateUserInput!) {
                createUser(createUserInput: $input)
            }
        `;
    };
    const updateEmployeeInfo = () => {
        return gql`
            mutation updateEmployeeInfo($input: UpdateEmployeeInput!) {
                updateEmployeeInfo(input: $input)
            }
        `;
    };
    const createHub = () => {
        return gql`
            mutation createHub($input: CreateHubInput!) {
                createHub(input: $input)
            }
        `;
    };
    const createMerchantDomesticShipping = () => {
        return gql`
            mutation createMerchantDomesticShipping($input: CreateMerchantShippingListInput!) {
                createMerchantDomesticShipping(input: $input)
            }
        `;
    };
    const createInventoryRent = () => {
        return gql`
            mutation createInventoryRent($input: CreateInventoryRentInput!) {
                createInventoryRent(input: $input)
            }
        `;
    };
    const assignMerchantToInventory = () => {
        return gql`
            mutation assignMerchantToInventory($input: AssignMerchantToInventoryInput!) {
                assignMerchantToInventory(input: $input)
            }
        `;
    };
    const removeMerchantAssignmentFromInventory = () => {
        return gql`
            mutation removeMerchantAssignmentFromInventory($input: RemoveMerchantAssignmentInput!) {
                removeMerchantAssignmentFromInventory(input: $input)
            }
        `;
    };

    const updateRackName = () => {
        return gql`
            mutation updateRackName($input: UpdateRackNameInput!) {
                updateRackName(input: $input)
            }
        `;
    };

    const updatePalletName = () => {
        return gql`
            mutation updatePalletName($input: UpdatePalletNameInput!) {
                updatePalletName(input: $input)
            }
        `;
    };

    const updateBoxName = () => {
        return gql`
            mutation updateBoxName($input: UpdateBoxNameInput!) {
                updateBoxName(input: $input)
            }
        `;
    };

    const addRackLevels = () => {
        return gql`
            mutation addRackLevels($input: AddRackLevelsInput!) {
                addRackLevels(input: $input)
            }
        `;
    };

    const uploadExcelFile = () => {
        return gql`
            mutation uploadExcelFile($base64File: String!) {
                uploadExcelFile(base64File: $base64File)
            }
        `;
    };
    const deleteCourierSheet = () => {
        return gql`
            mutation deleteCourierSheet($id: Int!) {
                deleteCourierSheet(id: $id)
            }
        `;
    };

    const createMerchantToken = () => {
        return gql`
            mutation createMerchantToken($merchantId: Int!) {
                createMerchantToken(merchantId: $merchantId)
            }
        `;
    };

    const updateInventoryRent = () => {
        return gql`
            mutation updateInventoryRent($input: UpdateInventoryRentInput!) {
                updateInventoryRent(input: $input)
            }
        `;
    };

    const removeOrderItems = () => {
        return gql`
            mutation removeOrderItems($input: RemoveOrderItemsInput!) {
                removeOrderItems(input: $input)
            }
        `;
    };

    const addOrderItems = () => {
        return gql`
            mutation addOrderItems($input: AddOrderItemsInput!) {
                addOrderItems(input: $input)
            }
        `;
    };

    const changeOrderCustomerInfo = () => {
        return gql`
            mutation changeOrderCustomerInfo($input: ChangeOrderCustomerInfoInput!) {
                changeOrderCustomerInfo(input: $input)
            }
        `;
    };

    const updateMerchantDomesticShipping = () => {
        return gql`
            mutation updateMerchantDomesticShipping($input: UpdateMerchantDomesticShippingInput!) {
                updateMerchantDomesticShipping(input: $input)
            }
        `;
    };

    const updateOrdersStatus = () => {
        return gql`
            mutation updateOrderStatus($input: UpdateCourierOrderStatusInput!) {
                updateOrderStatus(input: $input)
            }
        `;
    };
    const updateupdateOrderIdsStatus = () => {
        return gql`
            mutation updateOrderIds($input: UpdateOrderStatusInput!) {
                updateOrdersStatus(input: $input)
            }
        `;
    };

    const editUserType = () => {
        return gql`
            mutation updateUserType($input: UpdateUserTypeInput!) {
                updateUserType(updateInfo: $input)
            }
        `;
    };

    const updateUserRoles = () => {
        return gql`
            mutation updateUserRolesOptimized($input: UpdateUserRoleInputAdvanced!) {
                updateUserRolesOptimized(input: $input)
            }
        `;
    };

    const addCustomer = () => {
        return gql`
            mutation createCustomer($input: CreateCustomerInput!) {
                createCustomer(input: $input)
            }
        `;
    };

    const addOrder = () => {
        return gql`
            mutation createOrder($input: CreateOrderInput!) {
                createOrder(input: $input)
            }
        `;
    };

    const createReturnPackage = () => {
        return gql`
            mutation createReturnPackage($input: CreateReturnPackageInput!) {
                createReturnPackage(input: $input)
            }
        `;
    };

    const exportItem = () => {
        return gql`
            mutation export($input: ItemCountInput!) {
                exportItem(input: $input)
            }
        `;
    };
    const importItem = () => {
        return gql`
            mutation import($input: ItemCountInput!) {
                importItem(input: $input)
            }
        `;
    };

    const addItem = () => {
        return gql`
            mutation createSingles($input: [SingleItemRefInput!]!) {
                createMerchantItemSingles(input: $input)
            }
        `;
    };
    const createInventory = () => {
        return gql`
            mutation createInventoryRent($input: CreateInventoryRentInput!) {
                createInventoryRent(input: $input)
            }
        `;
    };

    const createAddress = () => {
        return gql`
            mutation createNewAddress($input: CreateCustomerAddressInput!) {
                createNewCustomerAddress(input: $input)
            }
        `;
    };

    const linkCustomerMerchant = () => {
        return gql`
            mutation link($input: LinkMerchantCustomerInput!) {
                linkMerchantCustomer(input: $input)
            }
        `;
    };

    const linkCurrentCustomerAddress = () => {
        return gql`
            mutation link($input: LinkCurrentCustomerAddressInput!) {
                linkCurrentCustomerAddress(input: $input)
            }
        `;
    };

    const addInventory = () => {
        return gql`
            mutation createInventory($input: CreateInventoryInput!) {
                createInventory(input: $input)
            }
        `;
    };
    const addMerchant = () => {
        return gql`
            mutation createMerchant($input: CreateMerchantInput!) {
                createMerchant(input: $input)
            }
        `;
    };
    const assignPackageToCourier = () => {
        return gql`
            mutation assignPackagesToCourier($input: AssignPackageToCourierInput!) {
                assignPackagesToCourier(input: $input)
            }
        `;
    };
    const addCompoundItem = () => {
        return gql`
            mutation createCompoundMerchantItems($input: CreateMerchantItemsInput!) {
                createCompoundMerchantItems(input: $input)
            }
        `;
    };

    const addCourierSheet = () => {
        return gql`
            mutation createCourierSheet($input: CreateCourierSheetInput!) {
                createCourierSheet(input: $input)
            }
        `;
    };
    const addOrdersToCourierSheet = () => {
        return gql`
            mutation addOrdersToCourierSheet($input: AddOrdersToCourierSheetInput!) {
                addOrdersToCourierSheet(input: $input)
            }
        `;
    };

    const updateCourierSheet = () => {
        return gql`
            mutation updateCourierSheet($input: UpdateCourierSheetInput!) {
                updateCourierSheet(input: $input)
            }
        `;
    };

    const importNew = () => {
        return gql`
            mutation importNew($input: ImportNewItemInput!) {
                importNewItem(input: $input)
            }
        `;
    };

    const createExpense = () => {
        return gql`
            mutation createExpense($input: CreateExpenseInput!) {
                createExpense(input: $input)
            }
        `;
    };

    const createFinancialAccount = () => {
        return gql`
            mutation createFinancialAccount($input: CreateFinancialAccountInput!) {
                createFinancialAccount(input: $input)
            }
        `;
    };

    const updateFinancialAccount = () => {
        return gql`
            mutation updateFinancialAccount($input: UpdateFinancialAccountInput!) {
                updateFinancialAccount(input: $input)
            }
        `;
    };
    const changeOrderPrice = () => {
        return gql`
            mutation changeOrderPrice($input: ChangeOrderPriceInput!) {
                changeOrderPrice(input: $input)
            }
        `;
    };

    const sendAnyFinancialTransaction = () => {
        return gql`
            mutation sendAnyFinancialTransaction($input: SendFinancialTransactionInput!) {
                sendAnyFinancialTransaction(input: $input)
            }
        `;
    };
    const sendMyFinancialTransaction = () => {
        return gql`
            mutation sendFinancialTransaction($input: SendMyFinancialTransactionInput!) {
                sendFinancialTransaction(input: $input)
            }
        `;
    };

    const updateAnyFinancialTransaction = () => {
        return gql`
            mutation updateAnyFinancialTransaction($input: UpdateFinancialTransactionInput!) {
                updateAnyFinancialTransaction(input: $input)
            }
        `;
    };
    const updateMyFinancialTransaction = () => {
        return gql`
            mutation updateFinancialTransaction($input: UpdateMyFinancialTransactionInput!) {
                updateFinancialTransaction(input: $input)
            }
        `;
    };

    const transferMyCourierCollectionFunds = () => {
        return gql`
            mutation transferCourierCollectionFunds($input: TransferCourierCollectionInput!) {
                transferCourierCollectionFunds(input: $input)
            }
        `;
    };

    const completeInventoryRentTransactions = () => {
        return gql`
            mutation completeInventoryRentTransactions($input: TransferCourierCollectionInput!) {
                completeInventoryRentTransactions(input: $input)
            }
        `;
    };

    const processMerchantPayments = () => {
        return gql`
            mutation processMerchantPayments($input: MerchantPaymentTransactionInput!) {
                processMerchantPayments(input: $input)
            }
        `;
    };

    const completeMerchantPayments = () => {
        return gql`
            mutation completeMerchantPayments($input: completeMerchantPaymentInput!) {
                completeMerchantPayments(input: $input)
            }
        `;
    };

    const requestOrderReturn = () => {
        return gql`
            mutation requestOrderReturn($input: RequestOrderReturnInput!) {
                requestOrderReturn(input: $input)
            }
        `;
    };

    const updateMerchantItem = () => {
        return gql`
            mutation updateMerchantItem($input: UpdateMerchantItemInput!) {
                updateMerchantItem(input: $input)
            }
        `;
    };

    const updateMerchant = () => {
        return gql`
            mutation updateMerchant($input: UpdateMerchantInput!) {
                updateMerchant(input: $input)
            }
        `;
    };

    // const removeFinancialAccount = () => {
    //     return gql`
    //         mutation removeFinancialAccount($input: UpdateFinancialAccountInput!) {
    //             removeFinancialAccount(id: $input) {
    //                 id
    //             }
    //         }
    //     `;
    // };

    const requestLoginResponse = () => {
        return gql`
            mutation signIn($input: TokenRequestInput!) {
                signIn(input: $input) {
                    user {
                        id
                        email
                        phone
                        hubId
                        merchantId
                        inventoryId
                        name
                        type

                        createdAt
                        lastModified
                        deletedAt
                        roles {
                            roleId
                        }
                        merchant {
                            name
                        }
                    }
                    accessToken
                }
            }
        `;
    };
    const findSingleMerchantDomesticShipping = () => {
        return gql`
            query findSingleMerchantDomesticShipping($input: findMerchantDomesticShippingInput!) {
                findSingleMerchantDomesticShipping(input: $input) {
                    domesticShipping {
                        total
                    }
                }
            }
        `;
    };

    const findMerchantDomesticShippings = () => {
        return gql`
            query findMerchantDomesticShippings($merchantId: Int!) {
                findMerchantDomesticShippings(merchantId: $merchantId) {
                    orderType
                    id
                    domesticShipping {
                        id
                        total
                        vat
                        post
                        base
                        extra
                    }
                    governorate {
                        id
                        name
                        arabicName
                    }
                }
            }
        `;
    };

    const isValidEmailMutation = (payload) => {
        return gql`
            query userState($email: String!) {
                userState(email: $email)
            }
        `;
    };

    const fetchInventories = (payload) => {
        return gql`
            query paginateInventories($input: PaginateInventoryInput!) {
                paginateInventories(input: $input) {
                    data {
                        id
                        hubId
                        name
                    }
                    cursor
                }
            }
        `;
    };

    const paginateInventoryRentTransaction = (payload) => {
        return gql`
            query paginateInventoryRentTransaction($input: PaginateInventoryRentTransactionsInput!) {
                paginateInventoryRentTransaction(input: $input) {
                    data {
                        id
                        merchantId
                        quantity
                        type
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };

    const fetchItemsInBox = () => {
        return gql`
            query paginateItemsInBox($input: ItemInBoxPageInput!) {
                paginateItemInBox(input: $input) {
                    data {
                        id
                        inventoryId
                        count
                        totalCount
                        merchant {
                            name
                        }
                        itemVariant {
                            name
                            merchantId
                            imageUrl
                            id
                            sku
                            fullName
                            shopifyId
                            item {
                                name
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchHubs = () => {
        return gql`
            query paginateHubs($input: PaginateHubsInput!) {
                paginateHubs(input: $input) {
                    data {
                        id
                        name
                        governorateId

                        location
                        createdAt
                        lastModified
                    }
                    cursor
                }
            }
        `;
    };
    const fetchOrderHistory = () => {
        return gql`
            query paginateOrderHistory($input: PaginateOrderHistoryInput!) {
                paginateOrderHistory(input: $input) {
                    data {
                        id
                        orderId
                        userId
                        status
                        fromHubId
                        toHubId
                        inventoryId
                        description
                        createdAt
                        lastModified
                        postponeDate
                        user {
                            name
                            email
                        }
                        inventory {
                            name
                        }
                        fromHub {
                            name
                        }
                        toHub {
                            name
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const paginateReturnPackageHistory = () => {
        return gql`
            query paginateReturnPackageHistory($input: PaginateReturnPackageHistoryInput!) {
                paginateReturnPackageHistory(input: $input) {
                    data {
                        id
                        returnPackageId
                        status
                        description
                        transferredToId
                        createdAt
                        user {
                            name
                        }
                        courier {
                            name
                        }
                    }
                    cursor
                }
            }
        `;
    };
    const fetchTransactionHistory = () => {
        return gql`
            query paginateOrderTransactionsHistory($input: PaginateOrderTransactionsInput!) {
                paginateOrderTransactionsHistory(input: $input) {
                    data {
                        id
                        type
                        description
                        fromAccountId
                        sheetOrderId
                        toAccountId
                        amount
                        currency
                        receipt
                        status
                        auditedById
                        createdAt
                        lastModified
                        auditedBy {
                            name
                            email
                        }

                        fromAccount {
                            id
                            name
                        }
                        toAccount {
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                id
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const paginateOrderLogs = () => {
        return gql`
            query paginateOrderLogs($input: PaginateOrderLogInput!) {
                paginateOrderLogs(input: $input) {
                    data {
                        id
                        orderId
                        status
                        userId
                        type
                        createdAt
                        user {
                            name
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchOrders = () => {
        return gql`
            query findOrders($input: PaginateOrdersInput!) {
                paginateOrders(input: $input) {
                    data {
                        id
                        type
                        createdAt
                        shippingPrice
                        originalPrice
                        paidToMerchant
                        merchant {
                            id
                            name
                        }
                        failsAndAssigns
                        returnPackage {
                            id
                            sku
                            type
                            hubId
                            courierId
                            toInventoryId
                            toMerchantId
                            status
                            createdAt
                            lastModified
                            inventory {
                                name
                                id
                            }
                            merchant {
                                name
                                id
                            }
                            courier {
                                name
                                id
                            }
                            countAndSum
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        courier {
                            id
                            name
                        }
                        price
                        paymentType
                        status
                        orderDate
                        currency
                        otherId
                        shopifyName
                        merchantCustomer {
                            id
                            customerName
                            customer {
                                email
                                phone
                                id
                            }
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        orderItems {
                            id
                            orderId
                            count
                            unitPrice
                            unitDiscount
                            partialCount
                            info {
                                name
                                imageUrl
                                sku
                                item {
                                    name
                                }
                            }
                        }
                        latestHistory {
                            description
                        }
                        canOpen
                        fragile
                        deliveryPart
                        sheetOrder {
                            id
                            sheetId
                            orderId
                            adminPass
                            financePass
                            shippingCollected
                            amountCollected
                            transactionId
                            createdAt
                            lastModified
                            sheet {
                                status
                                user {
                                    name
                                    email
                                    id
                                }
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const paginateUnresolvedOrders = () => {
        return gql`
            query paginateUnresolvedOrders($input: PaginateUnresolvedOrdersInput!) {
                paginateUnresolvedOrders(input: $input) {
                    data {
                        id
                        type
                        createdAt
                        shippingPrice
                        originalPrice
                        merchant {
                            id
                            name
                        }
                        failsAndAssigns
                        returnPackage {
                            id
                            sku
                            type
                            hubId
                            courierId
                            toInventoryId
                            toMerchantId
                            status
                            createdAt
                            lastModified
                            inventory {
                                name
                                id
                            }
                            merchant {
                                name
                                id
                            }
                            courier {
                                name
                                id
                            }
                            countAndSum
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        courier {
                            id
                            name
                        }
                        price
                        paymentType
                        status
                        orderDate
                        currency
                        otherId
                        shopifyName
                        merchantCustomer {
                            id
                            customerName
                            customer {
                                email
                                phone
                                id
                            }
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        orderItems {
                            id
                            orderId
                            count
                            unitPrice
                            unitDiscount
                            partialCount
                            info {
                                name
                                imageUrl
                                sku
                                item {
                                    name
                                }
                            }
                        }
                        latestHistory {
                            description
                        }
                        canOpen
                        fragile
                        deliveryPart
                        sheetOrder {
                            id
                            sheetId
                            orderId
                            adminPass
                            financePass
                            shippingCollected
                            amountCollected
                            transactionId
                            createdAt
                            lastModified
                            sheet {
                                status
                                user {
                                    name
                                    email
                                    id
                                }
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchOrdersInInventory = () => {
        return gql`
            query paginateOrdersInInventory($input: PaginateOrdersInInventoryInput!) {
                paginateOrdersInInventory(input: $input) {
                    data {
                        id
                        createdAt
                        otherId
                        shopifyName
                        currency
                        previousOrderId
                        type
                        paymentType
                        status
                        addressId
                        merchantId
                        isDomestic
                        originalPrice
                        canBeEdited
                        shippingPrice
                        weight
                        price
                        canOpen
                        fragile
                        deliveryPart
                        sheetOrder {
                            id
                            sheetId
                            orderId
                            adminPass
                            financePass
                            shippingCollected
                            amountCollected
                            transactionId
                            createdAt
                            lastModified
                            sheet {
                                status
                                user {
                                    name
                                    email
                                    id
                                }
                            }
                        }
                        orderDate
                        createdAt
                        lastModified
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        merchantCustomer {
                            id
                            customerName
                            customer {
                                email
                                id
                                phone
                            }
                        }
                        merchant {
                            id
                            name
                        }
                        courier {
                            id
                            name
                        }
                        orderItems {
                            id
                            orderId
                            count
                            unitPrice
                            unitDiscount
                            partialCount
                            countInInventory
                            info {
                                name
                                imageUrl
                                sku
                                item {
                                    name
                                }
                            }

                            inventory {
                                count
                                box {
                                    id
                                    name
                                    pallet {
                                        id
                                        level
                                        name
                                        rack {
                                            name
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchCourierOrders = () => {
        return gql`
            query findOrders($input: PaginateOrdersInput!) {
                paginateOrders(input: $input) {
                    data {
                        id
                        shippingPrice
                        merchant {
                            name
                        }
                        price
                        paymentType

                        address {
                            apartmentFloor
                            streetAddress
                            buildingNumber
                            city
                            country
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchUsers = () => {
        return gql`
            query findUsers($input: PaginateUsersInput!) {
                paginateUsers(paginateUsersInput: $input) {
                    data {
                        id
                        name
                        type
                        email
                        phone
                        hubId
                        merchantId
                        inventoryId
                        employee {
                            id
                            type
                            currency
                            salary
                            commission
                        }
                        hub {
                            name
                        }
                        inventory {
                            name
                        }
                        merchant {
                            name
                        }
                        userRoles {
                            roleId
                            role {
                                type
                                name
                                id
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchCouriers = (payload) => {
        return gql`
            query fetchCouriers($input: CourierPageInput!) {
                paginateCouriers(input: $input) {
                    data {
                        id
                        name
                        email
                        phone
                    }
                    cursor
                }
            }
        `;
    };
    const paginateFiles = (payload) => {
        return gql`
            query paginateFiles($input: PaginateFilesInput!) {
                paginateFiles(input: $input) {
                    data {
                        id
                        key
                        name
                        url
                        merchantId
                        createdAt
                        lastModified
                        deletedAt
                    }
                    cursor
                }
            }
        `;
    };
    const fetchMerchants = (payload) => {
        return gql`
            query fetchMerchants($input: PaginateMerchantsInput!) {
                paginateMerchants(input: $input) {
                    data {
                        id
                        name
                        inventoryRent {
                            id
                            merchantId
                            type
                            startDate
                            lastBill
                            pricePerUnit
                            sqaureMeter
                            currency
                            createdAt
                            lastModified
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const findOneMerchant = (payload) => {
        return gql`
            query findOneMerchant($id: Int!) {
                findOneMerchant(id: $id) {
                    id
                    name
                    inventoryRent {
                        id
                        merchantId
                        type
                        startDate
                        lastBill
                        pricePerUnit
                        sqaureMeter
                        currency
                        createdAt
                        lastModified
                    }
                    webToken
                    webTokenExpiration
                    shopifyShop
                    currency
                    includesVat
                    taxId
                    bankNumber
                    bankName
                    ownerId
                    addressId
                    threshold
                    overShipping
                    address {
                        country
                        city
                        streetAddress
                        buildingNumber
                        apartmentFloor
                        zone {
                            name
                            id
                        }
                    }
                    owner {
                        id
                        type
                        name
                        email
                        phone
                    }
                }
            }
        `;
    };

    const findOneUser = (payload) => {
        return gql`
            query findOneUser($id: String!) {
                findOneUser(id: $id) {
                    id
                    type
                    hubId
                    merchantId
                    inventoryId
                    name
                    email
                    phone

                    refreshToken
                    createdAt
                    lastModified
                    deletedAt
                    hub {
                        name
                    }

                    merchant {
                        name
                    }
                    userRoles {
                        roleId
                        role {
                            type
                            name
                            id
                        }
                    }
                }
            }
        `;
    };

    const findOneItem = (payload) => {
        return gql`
            query findOneItem($input: FindOneItemInput!) {
                findOneItem(input: $input) {
                    id
                    name
                    description
                    currency
                    imageUrl
                    merchantId
                    merchant {
                        name
                    }
                    itemVariants {
                        id
                        sku
                        name
                        shopifyId
                        merchantSku
                        merchantId
                        itemId
                        isEnabled
                        imageUrl
                        price
                        weight
                        createdAt
                        stockCount
                        fullName
                        selectedOptions {
                            id
                            itemVariantId
                            variantNameId
                            variantOptionId
                            createdAt
                            lastModified
                            variantOption {
                                id
                                value
                                colorCode
                            }
                            variantName {
                                id
                                name
                            }
                        }
                    }
                }
            }
        `;
    };

    const findReturnPackageBySku = (payload) => {
        return gql`
            query findReturnPackageBySku($sku: String!) {
                findReturnPackageBySku(sku: $sku) {
                    id
                    sku
                    type
                    hubId
                    courierId
                    toInventoryId
                    toMerchantId
                    status
                    createdAt
                    lastModified
                    merchant {
                        id
                        name
                    }
                    inventory {
                        id
                        name
                    }
                    countAndSum
                }
            }
        `;
    };

    const fetcOneInventory = (inventoryId) => {
        return gql`
        query findSingleInventory{
            findOneInventory(input: {
              id:${JSON.stringify(inventoryId)}
            }){
              id
        name
        racks {
        levels
        merchant{name}
          id
          name
          pallets {
        merchant{name}

            rackId
            id
            name
            level
            boxes {
        merchant{name}

              palletId
              pallet {
                rackId
              }
              name
              id
            }
          }
        }
              
            }
          }
        `;
    };

    const findOneOrder = () => gql`
        query findOneOrder($id: Int!) {
            findOneOrder(id: $id) {
                id
                type
                createdAt
                shippingPrice
                shopifyName
                paidToMerchant
                merchant {
                    id
                    name
                }
                address {
                    country
                    city
                    streetAddress
                    buildingNumber
                    apartmentFloor
                }
                failsAndAssigns
                courier {
                    id
                    name
                }
                returnPackage {
                    id
                    sku
                    type
                    hubId
                    courierId
                    toInventoryId
                    toMerchantId
                    status
                    createdAt
                    lastModified
                    inventory {
                        name
                        id
                    }
                    merchant {
                        name
                        id
                    }
                    courier {
                        name
                        id
                    }
                    countAndSum
                }
                price
                paymentType
                status
                orderDate
                currency
                otherId
                shopifyName
                originalPrice
                merchantCustomer {
                    id
                    customerName
                    customer {
                        email
                        phone
                        id
                    }
                }
                orderItems {
                    id
                    orderId
                    count
                    unitPrice
                    unitDiscount
                    partialCount
                    info {
                        name
                        fullName
                        imageUrl
                        sku
                        item {
                            name
                        }
                    }

                    inventory {
                        count
                        box {
                            id
                            name
                            pallet {
                                id
                                level
                                name
                                rack {
                                    name
                                    id
                                }
                            }
                        }
                    }
                }
                canOpen
                fragile
                deliveryPart
                sheetOrder {
                    id
                    sheetId
                    orderId
                    adminPass
                    financePass
                    shippingCollected
                    amountCollected
                    transactionId
                    createdAt
                    lastModified
                    sheet {
                        status
                        user {
                            name
                            email
                            id
                        }
                    }
                }
            }
        }
    `;

    const findPublicOrder = () => gql`
        query findPublicOrder($input: FindPublicOrderInput!) {
            findPublicOrder(input: $input) {
                order {
                    id
                    type
                    createdAt
                    shippingPrice
                    paidToMerchant
                    merchant {
                        id
                        name
                    }
                    address {
                        country
                        city
                        streetAddress
                        buildingNumber
                        apartmentFloor
                    }
                    courier {
                        id
                        name
                    }
                    price
                    paymentType
                    status
                    orderDate
                    currency
                    otherId
                    shopifyName
                    originalPrice
                    merchantCustomer {
                        id
                        customerName
                        customer {
                            email
                            phone
                            id
                        }
                    }
                    orderItems {
                        id
                        orderId
                        count
                        unitPrice
                        unitDiscount
                        partialCount
                        info {
                            name
                            fullName
                            imageUrl
                            sku
                            item {
                                name
                            }
                        }
                    }
                    canOpen
                    fragile
                    deliveryPart
                    sheetOrder {
                        id
                        sheetId
                        orderId
                        adminPass
                        financePass
                        shippingCollected
                        amountCollected
                        transactionId
                        createdAt
                        lastModified
                        sheet {
                            status
                            user {
                                name
                                email
                                id
                            }
                        }
                    }
                }
                history {
                    id
                    orderId
                    userId
                    status
                    fromHubId
                    toHubId
                    inventoryId
                    description
                    createdAt
                    lastModified
                    postponeDate
                    user {
                        name
                        email
                    }
                    inventory {
                        name
                    }
                    fromHub {
                        name
                    }
                    toHub {
                        name
                    }
                }
            }
        }
    `;

    const findOneReturnPackage = () => gql`
        query findReturnPackageById($id: Int!) {
            findReturnPackageById(input: $id) {
                id
                sku
                type
                hubId
                courierId
                toInventoryId
                toMerchantId
                status
                countAndSum
                courier {
                    name
                }
                merchant {
                    id
                    name
                }
                inventory {
                    id
                    name
                }
                createdAt
                countAndSum
            }
        }
    `;

    const emailTaken = () => gql`
        query emailTaken($input: EmailTakenInput!) {
            emailTaken(input: $input)
        }
    `;

    const fetchMerchantItems = (payload) => {
        return gql`
            query paginateItms($input: paginateItemsInput!) {
                paginateItems(itemPageInput: $input) {
                    data {
                        id
                        name
                        description
                        currency
                        imageUrl
                        merchantId
                        merchant {
                            name
                        }
                        shopifyId
                        itemVariants {
                            id
                            sku
                            name
                            shopifyId
                            merchantSku
                            merchantId
                            itemId
                            isEnabled
                            imageUrl
                            price
                            weight
                            createdAt
                            fullName
                            selectedOptions {
                                id
                                itemVariantId
                                variantNameId
                                variantOptionId
                                createdAt
                                lastModified
                                variantOption {
                                    id
                                    value
                                    colorCode
                                }
                                variantName {
                                    id
                                    name
                                }
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };
    const findItemReturnByOrder = (payload) => {
        return gql`
            query findItemReturnByOrder($input: FindReturnByOrderInput!) {
                findItemReturnByOrder(input: $input) {
                    id
                    type
                    createdAt
                    shippingPrice
                    paidToMerchant
                    merchant {
                        id
                        name
                    }
                    address {
                        country
                        city
                        streetAddress
                        buildingNumber
                        apartmentFloor
                    }
                    courier {
                        id
                        name
                    }
                    price
                    paymentType
                    status
                    orderDate
                    currency
                    otherId
                    shopifyName
                    originalPrice
                    merchantCustomer {
                        id
                        customerName
                        customer {
                            email
                            phone
                            id
                        }
                    }
                    orderItems {
                        id
                        orderId
                        count
                        unitPrice
                        unitDiscount
                        partialCount
                        itemReturn {
                            count
                        }
                        inventoryReturn {
                            count
                        }
                        info {
                            item {
                                name
                            }
                            id
                            sku
                            name
                            shopifyId
                            merchantSku
                            merchantId
                            itemId
                            isEnabled
                            imageUrl
                            price
                            weight
                            createdAt
                            fullName
                        }

                        inventory {
                            count
                            box {
                                id
                                name
                                pallet {
                                    id
                                    level
                                    name
                                    rack {
                                        name
                                        id
                                    }
                                }
                            }
                        }
                    }
                    canOpen
                    fragile
                    deliveryPart
                    sheetOrder {
                        id
                        sheetId
                        orderId
                        adminPass
                        financePass
                        shippingCollected
                        amountCollected
                        transactionId
                        createdAt
                        lastModified
                        sheet {
                            status
                            user {
                                name
                                email
                                id
                            }
                        }
                    }
                }
            }
        `;
    };
    const fetchMerchantItemVariants = (payload) => {
        return gql`
            query paginateItemVariants($input: PaginateItemVariantsInput!) {
                paginateItemVariants(input: $input) {
                    data {
                        id
                        sku
                        name
                        merchantSku
                        itemId
                        isEnabled
                        imageUrl
                        price
                        weight
                        fullName
                        shopifyId
                        createdAt
                        lastModified
                    }
                    cursor
                }
            }
        `;
    };

    const fetchMerchantItemReturns = (payload) => {
        return gql`
            query paginateItemReturns($input: PaginateItemReturnsInput!) {
                paginateItemReturns(input: $input) {
                    data {
                        id
                        type
                        createdAt
                        shippingPrice
                        paidToMerchant
                        merchant {
                            name
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        courier {
                            id
                            name
                        }
                        price
                        paymentType
                        status
                        orderDate
                        currency
                        merchantCustomer {
                            id
                            customerName
                            customer {
                                email
                                phone
                                id
                            }
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        returnPackage {
                            id
                            sku
                            type
                            hubId
                            courierId
                            toInventoryId
                            toMerchantId
                            status
                            createdAt
                            lastModified
                            inventory {
                                name
                                id
                            }
                            merchant {
                                name
                                id
                            }
                            courier {
                                name
                                id
                            }
                            countAndSum
                        }
                        sheetOrder {
                            id
                            sheetId
                            orderId
                            adminPass
                            financePass
                            shippingCollected
                            amountCollected
                            transactionId
                            createdAt
                            lastModified
                            sheet {
                                status
                                user {
                                    name
                                    email
                                    id
                                }
                            }
                        }
                        orderItems {
                            id
                            orderId
                            count
                            unitPrice
                            unitDiscount
                            partialCount
                            itemReturn {
                                count
                            }
                            info {
                                name
                                imageUrl
                                fullName

                                sku
                                item {
                                    name
                                }
                            }
                        }
                        canOpen
                        fragile
                        deliveryPart
                    }
                    cursor
                }
            }
        `;
    };
    const fetchInventoryItemReturns = (payload) => {
        return gql`
            query paginateInventoryReturns($input: PaginateInventoryReturnInput!) {
                paginateInventoryReturns(input: $input) {
                    data {
                        id
                        type
                        createdAt
                        shippingPrice
                        paidToMerchant
                        merchant {
                            name
                        }
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        courier {
                            id
                            name
                        }
                        price
                        paymentType
                        status
                        orderDate
                        currency
                        merchantId
                        orderItems {
                            id
                            info {
                                id
                                sku
                                name
                                merchantSku
                                itemId
                                isEnabled
                                imageUrl
                                price
                                weight
                                createdAt
                                lastModified
                                fullName
                            }
                            inventory {
                                count
                                box {
                                    id
                                    name
                                    pallet {
                                        id
                                        level
                                        name
                                        rack {
                                            name
                                            id
                                        }
                                    }
                                }
                            }
                        }
                        parentOrder {
                            id
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };
    const paginateInventoryRents = (payload) => {
        return gql`
            query paginateInventoryRents($input: PaginateInventoryRentInput!) {
                paginateInventoryRents(input: $input) {
                    data {
                        id
                        merchantId
                        type
                        startDate
                        lastBill
                        pricePerUnit
                        sqaureMeter
                        currency
                        createdAt
                        lastModified
                        deletedAt
                        merchant {
                            name
                            id
                        }
                    }
                    cursor
                }
            }
        `;
    };
    const fetchRacks = () => {
        return gql`
            query paginateRacks($input: PaginateRacksInput!) {
                paginateRacks(input: $input) {
                    data {
                        name
                        id
                        pallets {
                            id
                            name
                            level
                            boxes {
                                name
                                id
                            }
                        }
                    }

                    cursor
                }
            }
        `;
    };

    const paginateBoxes = () => {
        return gql`
            query paginateBoxes($input: BoxPaginationInput!) {
                paginateBoxes(input: $input) {
                    data {
                        id
                        merchantId
                        palletId
                        name
                        createdAt
                        lastModified
                        deletedAt
                    }

                    cursor
                }
            }
        `;
    };

    const paginatePallets = () => {
        return gql`
            query paginatePallets($input: PalletPaginationInput!) {
                paginatePallets(input: $input) {
                    data {
                        id
                        name
                    }

                    cursor
                }
            }
        `;
    };

    const inventoryRentSummary = () => {
        return gql`
            query inventoryRentSummary($input: InventoryRentSummaryInput!) {
                inventoryRentSummary(input: $input)
            }
        `;
    };

    const ordersDeliverableSummary = () => {
        return gql`
            query ordersDeliverableSummary($input: ChartOrdersInput!) {
                ordersDeliverableSummary(input: $input)
            }
        `;
    };

    const graphOrders = () => {
        return gql`
            query graphOrders($input: GraphOrdersInput!) {
                graphOrders(input: $input)
            }
        `;
    };

    const merchantPaymentsSummary = () => {
        return gql`
            query merchantPaymentsSummary($input: MerchantPaymentsSummaryInput!) {
                merchantPaymentsSummary(input: $input)
            }
        `;
    };

    const fetchItemHistory = (payload) => {
        return gql`
            query paginateItemHistory($input: PaginateItemHistoryInput!) {
                paginateItemHistory(input: $input) {
                    data {
                        amount
                        description
                        user {
                            name
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };

    const mostSoldItems = (payload) => {
        return gql`
            query mostSoldItems($input: MostSoldItemsInput!) {
                mostSoldItems(input: $input) {
                    data {
                        itemVariantId
                        soldCount
                        itemVariant {
                            id
                            name
                            imageUrl
                            sku
                            fullName
                        }
                    }
                    startDate
                    endDate
                }
            }
        `;
    };

    const fetchCustomerAddresses = (payload) => {
        return gql`
            query findAddresses($input: MerchantCustomerAddressPaginationInput!) {
                paginateAddresses(input: $input) {
                    data {
                        details {
                            id
                            country
                            city
                            apartmentFloor
                            streetAddress
                            buildingNumber
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchCustomer = (payload) => {
        return gql`
            query customers($input: FindCustomerInput!, $merchantId: Int) {
                findCustomer(input: $input) {
                    data {
                        id
                        phone
                        email
                        details(merchantId: $merchantId) {
                            id
                            customerName
                            customerId
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchGovernorates = (payload) => {
        return gql`
            query findAllDomesticGovernorates {
                findAllDomesticGovernorates {
                    id
                    name
                }
            }
        `;
    };
    const findAllZones = (payload) => {
        return gql`
            query findAllZones {
                findAllZones {
                    id
                    name
                    governorateId
                }
            }
        `;
    };
    const fetchCourierSheets = (payload) => {
        return gql`
            query paginateCourierSheets($input: PaginateCourierSheetInput!) {
                paginateCourierSheets(input: $input) {
                    data {
                        id
                        status
                        orderCount
                        userInfo {
                            name
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };
    const fetchExpenses = (payload) => {
        return gql`
            query paginateExpenses($input: PaginateExpensesInput!) {
                paginateExpenses(input: $input) {
                    data {
                        id
                        type
                        fromAccountId
                        auditedById
                        amount
                        receipt
                        comment
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };
    const fetchCourierSheet = () => {
        return gql`
            query CourierSheet($id: Int!) {
                CourierSheet(id: $id) {
                    id
                    status
                    orderCount
                    userInfo {
                        name
                    }
                    createdAt
                    sheetOrders {
                        id
                        adminPass
                        financePass
                        shippingCollected
                        amountCollected
                        orderId
                        order {
                            failsAndAssigns
                            previousOrderId
                            previousOrder {
                                id
                            }
                            parentOrder {
                                id
                            }
                            otherId
                            shopifyName
                            id
                            originalPrice
                            type
                            status
                            currency
                            shippingPrice
                            price
                            paidToMerchant
                            merchant {
                                id
                                name
                            }
                            orderItems {
                                id
                                partialCount
                                count
                                unitPrice
                                itemVariantId
                                info {
                                    id
                                    sku
                                    name
                                    shopifyId
                                    merchantSku
                                    merchantId
                                    itemId
                                    isEnabled
                                    imageUrl
                                    price
                                    weight
                                    createdAt
                                    fullName
                                }
                            }
                        }
                    }
                }
            }
        `;
    };

    const fetchSimilarAddresses = (payload) => {
        return gql`
            query findAddress($input: CreateCustomerAddressInput!) {
                findSimilarAddresses(input: $input) {
                    score
                    address {
                        id
                        country
                        city
                        streetAddress
                        buildingNumber
                        apartmentFloor
                        createdAt
                    }
                }
            }
        `;
    };

    const fetchCustomerNameSuggestions = (payload) => {
        return gql`
            query customers($input: FindCustomerInput!) {
                findCustomer(input: $input) {
                    data {
                        id
                        phone
                        email
                        nameSuggestions {
                            customerName
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchFinancialAccounts = (payload) => {
        return gql`
            query paginateFinancialAccounts($input: PaginateFinancialAccountsInput!) {
                paginateFinancialAccounts(input: $input) {
                    data {
                        id
                        name
                        type
                        userId
                        merchantId
                        balance
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };
    const fetchTransactions = (payload) => {
        return gql`
            query paginateFinancialTransaction($input: FinancialTransactionPaginationInput!) {
                paginateFinancialTransaction(input: $input) {
                    data {
                        sheetOrderId
                        currency
                        auditedById
                        lastModified
                        id
                        type
                        description
                        receipt
                        status
                        amount
                        auditedBy {
                            name
                        }
                        fromAccount {
                            id
                            name
                        }
                        toAccount {
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                id
                            }
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };

    const fetchCourierCollectionTransactions = (payload) => {
        return gql`
            query paginateCourierCollectionTransactions($input: PaginateCourierCollectionTransactionsInput!) {
                paginateCourierCollectionTransactions(input: $input) {
                    data {
                        id
                        type
                        description
                        receipt
                        status
                        amount
                        currency
                        auditedBy {
                            name
                        }
                        fromAccount {
                            id
                            name
                        }
                        toAccount {
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                otherId
                                shopifyName
                                merchant {
                                    name
                                }
                            }
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };

    const fetchInventoryRentBills = (payload) => {
        return gql`
            query paginateInventoryRentBills($input: PaginateInventoryRentBillsInput!) {
                paginateInventoryRentBills(input: $input) {
                    data {
                        id
                        type
                        description
                        receipt
                        status
                        amount
                        currency
                        auditedBy {
                            name
                        }
                        fromAccount {
                            id
                            name
                        }
                        toAccount {
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                otherId
                                shopifyName
                                merchant {
                                    name
                                }
                            }
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };

    const fetchMerchantPaymentTransactions = (payload) => {
        return gql`
            query paginateMerchantPaymentTransactions($input: PaginateMerchantPaymentTransactionsInput!) {
                paginateMerchantPaymentTransactions(input: $input) {
                    data {
                        id
                        type
                        description
                        receipt
                        status
                        amount
                        currency
                        auditedBy {
                            name
                        }
                        fromAccount {
                            id
                            name
                        }
                        toAccount {
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                previousOrderId
                                previousOrder {
                                    id
                                }
                                parentOrder {
                                    id
                                }
                                otherId
                                shopifyName
                                id
                                originalPrice
                                type
                                status
                                currency
                                shippingPrice
                                paidToMerchant
                                price
                                merchantCustomer {
                                    id
                                    customerName
                                    customer {
                                        email
                                        phone
                                        id
                                    }
                                }
                                merchant {
                                    id
                                    name
                                }
                                orderItems {
                                    id
                                    partialCount
                                    count
                                    unitPrice
                                    itemVariantId
                                    info {
                                        name
                                        item {
                                            name
                                        }
                                    }
                                }
                            }
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };
    const calculateFinancialTransactionsTotal = (payload) => {
        return gql`
            query calculateFinancialTransactionsTotal($input: FinancialTotalInput!) {
                calculateFinancialTransactionsTotal(input: $input) {
                    total
                    currency
                    count
                }
            }
        `;
    };

    const findRoles = (payload) => {
        return gql`
            query findRoles {
                findRoles {
                    id
                    name
                    type
                    description
                }
            }
        `;
    };

    const fetchPackages = (payload) => {
        return gql`
            query paginateReturnPackages($input: PaginateReturnPackageInput!) {
                paginateReturnPackages(input: $input) {
                    data {
                        id
                        sku
                        type
                        hubId
                        courierId
                        toInventoryId
                        toMerchantId
                        status
                        countAndSum
                        courier {
                            name
                        }
                        merchant {
                            id
                            name
                        }
                        inventory {
                            id
                            name
                        }
                        createdAt
                    }
                    cursor
                }
            }
        `;
    };

    var refreshing = false;
    const useMutationGQL = (query, payload) => {
        const mutation = useMutation(query, {
            variables: {
                input: payload,
            },
            // context: {
            //     headers: {
            //         Authorization: ` Bearer ${accessToken}`,
            //     },
            // },
        });
        return mutation;
    };
    const useMutationNoInputGQL = (query, payload) => {
        const mutation = useMutation(query, {
            variables: payload,
            // context: {
            //     headers: {
            //         Authorization: ` Bearer ${accessToken}`,
            //     },
            // },
        });
        return mutation;
    };

    const useLazyQueryGQL = (query, fetchPolicy) => {
        // alert(JSON.stringify(fetchPolicy) + ' ' + JSON.stringify(query));
        const mutation = useLazyQuery(query, {
            fetchPolicy: fetchPolicy ?? 'network-only',
            // context: {
            //     headers: {
            //         Authorization: ` Bearer ${accessToken}`,
            //     },
            // },
        });
        return mutation;
    };
    const useQueryGQL = (fetchPolicy, query, payload) => {
        return useQuery(query, {
            fetchPolicy: fetchPolicy?.length != 0 ? fetchPolicy : 'network-only',
            variables: {
                input: payload,
            },
            // context: {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`,
            //     },
            // },
        });
    };
    const fetchAllCountries = (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        const axiosfetch = axios({
            method: 'get',
            url: 'https://countriesnow.space/api/v0.1/countries',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    return {
        useMutationGQL,
        addUser,
        updateEmployeeInfo,
        useQueryGQL,
        fetchUsers,
        isValidEmailMutation,
        findRoles,
        useLazyQueryGQL,
        requestLoginResponse,
        fetchMerchantItems,
        addItem,
        fetchInventories,
        addInventory,
        fetchItemsInBox,
        importNew,
        fetchOrders,
        paginateUnresolvedOrders,
        paginateInventoryRents,
        fetchRacks,
        paginateBoxes,
        paginatePallets,
        inventoryRentSummary,
        merchantPaymentsSummary,
        fetchItemHistory,
        mostSoldItems,
        exportItem,
        importItem,
        fetcOneInventory,
        findOneOrder,
        findOneReturnPackage,
        fetchCustomer,
        addCustomer,
        fetchCustomerNameSuggestions,
        fetchCustomerAddresses,
        linkCustomerMerchant,
        fetchSimilarAddresses,
        createAddress,
        linkCurrentCustomerAddress,
        addOrder,
        fetchCourierOrders,
        createInventory,
        addCourierSheet,
        addOrdersToCourierSheet,
        fetchCourierSheets,
        fetchCourierSheet,
        updateCourierSheet,
        fetchCouriers,
        paginateFiles,
        fetchMerchants,
        addMerchant,
        addCompoundItem,
        fetchMerchantItemVariants,
        editUserType,
        updateUserRoles,
        fetchFinancialAccounts,
        fetchTransactions,
        createFinancialAccount,
        updateFinancialAccount,
        changeOrderPrice,
        sendAnyFinancialTransaction,
        sendMyFinancialTransaction,
        updateAnyFinancialTransaction,
        updateMyFinancialTransaction,
        fetchCourierCollectionTransactions,
        fetchInventoryRentBills,
        transferMyCourierCollectionFunds,
        completeInventoryRentTransactions,
        processMerchantPayments,
        fetchMerchantPaymentTransactions,
        calculateFinancialTransactionsTotal,
        completeMerchantPayments,
        fetchMerchantItemReturns,
        createReturnPackage,
        fetchPackages,
        fetchInventoryItemReturns,
        assignPackageToCourier,
        fetchOrdersInInventory,
        fetchGovernorates,
        createMerchantDomesticShipping,
        updateMerchantDomesticShipping,
        createInventoryRent,
        updateInventoryRent,
        removeOrderItems,
        addOrderItems,
        changeOrderCustomerInfo,
        fetchHubs,
        fetchOrderHistory,
        paginateReturnPackageHistory,
        updateOrdersStatus,
        updateupdateOrderIdsStatus,
        fetchExpenses,
        createExpense,
        fetchAllCountries,
        findSingleMerchantDomesticShipping,
        findMerchantDomesticShippings,
        requestOrderReturn,
        fetchTransactionHistory,
        paginateOrderLogs,
        createHub,
        assignMerchantToInventory,
        removeMerchantAssignmentFromInventory,
        updateRackName,
        updatePalletName,
        updateBoxName,
        addRackLevels,
        findOneMerchant,
        uploadExcelFile,
        useMutationNoInputGQL,
        updateMerchantItem,
        updateMerchant,
        findAllZones,
        deleteCourierSheet,
        createMerchantToken,
        findReturnPackageBySku,
        findOneItem,
        paginateInventoryRentTransaction,
        ordersDeliverableSummary,
        graphOrders,
        findOneUser,
        emailTaken,
        findItemReturnByOrder,
        findPublicOrder,
    };
};
export default API;
