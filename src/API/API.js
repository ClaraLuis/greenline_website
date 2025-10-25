import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Contexthandlerscontext } from '../Contexthandlerscontext';
import Cookies from 'universal-cookie';
import { getAuth, signOut } from 'firebase/auth';

const API = () => {
    const cookies = new Cookies();

    const { setUserInfoContext, UserInfoContext, ready } = useContext(Contexthandlerscontext);

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
    const removeUser = () => {
        return gql`
            mutation removeUser($removeUserId: String!) {
                removeUser(id: $removeUserId)
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
    const removeItemInBox = () => {
        return gql`
            mutation RemoveItemInBox($id: Int!) {
                removeItemInBox(id: $id)
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

    const removeInventoryRent = () => {
        return gql`
            mutation removeInventoryRent($input: RemoveInventoryRentInput!) {
                removeInventoryRent(input: $input)
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

    const updateUserPermissions = () => {
        return gql`
            mutation updateUserPermissionsOptimized($input: UpdateUserPermissionInputAdvanced!) {
                updateUserPermissionsOptimized(input: $input)
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

    const cancelUnresolvedOrders = () => {
        return gql`
            mutation cancelUnresolvedOrders($input: cancelUnresolvedOrdersInput!) {
                cancelUnresolvedOrders(input: $input)
            }
        `;
    };

    const createMerchantSettlement = () => {
        return gql`
            mutation createMerchantSettlement($input: CreateMerchantSettlementInput!) {
                createMerchantSettlement(input: $input)
            }
        `;
    };

    const processShippingTaxes = () => {
        return gql`
            mutation processShippingTaxes($input: ProcessShippingTaxesInput!) {
                processShippingTaxes(input: $input)
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
    const updateOrdersInCourierSheet = () => {
        return gql`
            mutation updateOrdersInCourierSheet($input: UpdateOrdersInCourierSheetInput!) {
                updateOrdersInCourierSheet(input: $input)
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

    const deleteItems = () => {
        return gql`
            mutation deleteItems($input: DeleteItemsInput!) {
                deleteItems(input: $input)
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
                        permissions {
                            permissionId
                        }
                        merchant {
                            name
                        }
                        inventory {
                            name
                        }
                        hub {
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
                    totalCount
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
                    totalCount
                }
            }
        `;
    };

    const paginateMerchantSettlements = (payload) => {
        return gql`
            query paginateMerchantSettlements($input: PaginateMerchantSettlementsInput!) {
                paginateMerchantSettlements(input: $input) {
                    cursor
                    totalCount
                    data {
                        id
                        merchantId
                        totalAmount
                        pdfKey
                        createdAt
                        pdfUrl
                        merchant {
                            name
                        }
                    }
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
                        sku
                        blocksCountSum
                        stockCount
                        imageUrl
                        blocks {
                            id
                            count
                        }
                    }
                    cursor
                    totalCount
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
                    totalCount
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
                            deletedAt
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
                    totalCount
                }
            }
        `;
    };

    const paginateSettlementPayouts = () => {
        return gql`
            query paginateSettlementPayouts($input: PaginateSettlementPayoutsInput!) {
                paginateSettlementPayouts(input: $input) {
                    data {
                        id
                        sheetId
                        orderId
                        adminPass
                        financePass
                        shippingCollected
                        amountCollected
                        transactionId
                        assignedById
                        createdAt
                        lastModified
                        order {
                            id
                            otherId
                            shopifyName
                            currency
                            previousOrderId
                            hubId
                            type
                            paymentType
                            status
                            merchantCustomerId
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
                            orderDate
                            initialDate
                            createdAt
                            lastModified
                            failsAndAssigns
                            paidToMerchant
                        }
                        sheet {
                            id
                            userId
                            status
                            createdAt
                            lastModified
                            orderCount
                        }
                        transactions {
                            id
                            type
                            description
                            fromAccountId
                            sheetOrderId
                            toAccountId
                            merchantSettlementId
                            amount
                            currency
                            receipt
                            status
                            auditedById
                            createdAt
                            lastModified
                        }
                    }
                    cursor
                    totalCount
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
                            deletedAt
                        }
                        courier {
                            name
                        }
                    }
                    cursor
                    totalCount
                }
            }
        `;
    };
    const paginateMerchantDebts = () => {
        return gql`
            query PaginateMerchantDebts($input: PaginateMerchantDebtsInput!) {
                paginateMerchantDebts(input: $input) {
                    cursor
                    totalCount
                    data {
                        id
                        type
                        description
                        fromAccountId
                        sheetOrderId
                        toAccountId
                        merchantSettlementId
                        amount
                        currency
                        receipt
                        status
                        auditedById
                        createdAt
                        lastModified
                    }
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
                            deletedAt
                        }

                        fromAccount {
                            merchantId
                            id
                            name
                        }
                        toAccount {
                            merchantId
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                id
                                type
                                status
                                shopifyName
                                otherId
                                merchant {
                                    name
                                }
                                address {
                                    country
                                    city
                                    streetAddress
                                    buildingNumber
                                    buildingNumber
                                }
                                merchantCustomer {
                                    id
                                    customerName
                                    customer {
                                        email
                                        phone
                                        id
                                    }
                                }
                            }
                        }
                    }
                    cursor
                    totalCount
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
                            deletedAt
                        }
                    }
                    cursor
                    totalCount
                }
            }
        `;
    };

    const fetchOrders = () => {
        return gql`
            query findOrders($input: PaginateOrdersInput!) {
                paginateOrders(input: $input) {
                    data {
                        previousOrderId
                        expectedPrice
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
                        previousOrder {
                            id
                            type
                        }
                        parentOrder {
                            id
                            type
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
                            signatureId
                            signatureFile {
                                id
                                key
                                url
                                name
                            }
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
                            buildingNumber
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
                            buildingNumber
                        }
                        orderItems {
                            id
                            orderId
                            count
                            unitPrice
                            unitDiscount
                            partialCount
                            info {
                                fullName
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
                            fromHub {
                                name
                            }
                            toHub {
                                name
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
                                    deletedAt
                                }
                            }
                        }
                    }
                    cursor
                    totalCount
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
                            signatureId
                            signatureFile {
                                id
                                key
                                url
                                name
                            }
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
                            buildingNumber
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
                            buildingNumber
                        }
                        orderItems {
                            id
                            orderId
                            count
                            unitPrice
                            unitDiscount
                            partialCount
                            info {
                                fullName
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
                            fromHub {
                                name
                            }
                            toHub {
                                name
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
                                    deletedAt
                                }
                            }
                        }
                    }
                    cursor
                    totalCount
                }
            }
        `;
    };

    const fetchOrdersInInventory = () => {
        return gql`
            query paginateOrdersInInventory($input: PaginateOrdersInInventoryInput!) {
                paginateOrdersInInventory(input: $input) {
                    data {
                        expectedPrice
                        previousOrderId
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
                        previousOrder {
                            id
                            type
                        }
                        parentOrder {
                            id
                            type
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
                                    deletedAt
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
                            buildingNumber
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
                                fullName
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
                    totalCount
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
                        previousOrder {
                            id
                            type
                        }
                        parentOrder {
                            id
                            type
                        }
                        address {
                            buildingNumber
                            streetAddress
                            buildingNumber
                            city
                            country
                        }
                    }
                    totalCount
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
                        userPermissions {
                            permissionId
                            permission {
                                type
                                name
                                id
                            }
                        }
                    }
                    totalCount
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
                    totalCount
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
                    totalCount
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
                    totalCount
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
                        buildingNumber
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
                    userPermissions {
                        permissionId
                        permission {
                            type
                            name
                            id
                        }
                    }
                }
            }
        `;
    };

    const findOneMerchantSettlement = (payload) => {
        return gql`
            query findOneMerchantSettlement($id: Int!) {
                findOneMerchantSettlement(id: $id) {
                    id
                    merchantId
                    totalAmount
                    pdfKey
                    createdAt
                    merchant {
                        name
                    }
                    pdfUrl
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
                    signatureId
                    signatureFile {
                        id
                        key
                        url
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
                    buildingNumber
                }
                failsAndAssigns
                courier {
                    id
                    name
                }
                previousOrder {
                    id
                    type
                }
                parentOrder {
                    id
                    type
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
                    signatureId
                    signatureFile {
                        id
                        key
                        url
                        name
                    }
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
                        buildingNumber
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
                signatureId
                signatureFile {
                    id
                    key
                    url
                    name
                }
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

    const paginateShippingCollections = () => {
        return gql`
            query paginateShippingCollections($input: PaginateShippingCollectionsInput!) {
                paginateShippingCollections(input: $input) {
                    data {
                        id
                        type
                        description
                        fromAccountId
                        sheetOrderId
                        toAccountId
                        merchantSettlementId
                        amount
                        currency
                        receipt
                        status
                        auditedById
                        createdAt
                        lastModified
                        fromAccount {
                            id
                            name
                            type
                            userId
                            merchantId
                            currency
                            balance
                            createdAt
                            lastModified
                            deletedAt
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
                            assignedById
                            createdAt
                            lastModified
                            order {
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
                                previousOrder {
                                    id
                                    type
                                }
                                parentOrder {
                                    id
                                    type
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
                                    signatureId
                                    signatureFile {
                                        id
                                        key
                                        url
                                        name
                                    }
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
                                    buildingNumber
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
                                    buildingNumber
                                }
                                orderItems {
                                    id
                                    orderId
                                    count
                                    unitPrice
                                    unitDiscount
                                    partialCount
                                    info {
                                        fullName
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
                                    fromHub {
                                        name
                                    }
                                    toHub {
                                        name
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
                        taxedShipping {
                            id
                            transactionId
                            createdAt
                            transaction {
                                id
                                type
                                description
                                fromAccountId
                                sheetOrderId
                                toAccountId
                                merchantSettlementId
                                amount
                                currency
                                receipt
                                status
                                auditedById
                                createdAt
                                lastModified
                            }
                        }
                        toAccount {
                            id
                            name
                            type
                            userId
                            merchantId
                            currency
                            balance
                            createdAt
                            lastModified
                            deletedAt
                        }
                    }
                    cursor
                    totalCount
                }
            }
        `;
    };

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
                    totalCount
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
                        buildingNumber
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
                    totalCount
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
                            buildingNumber
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
                            buildingNumber
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
                            signatureId
                            signatureFile {
                                id
                                key
                                url
                                name
                            }
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
                                    deletedAt
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
                    totalCount
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
                            buildingNumber
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
                    totalCount
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
                        lastBillTransaction {
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
                        }
                    }
                    cursor
                    totalCount
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
                    totalCount
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
                    totalCount
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
                    totalCount
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
                        id
                        amount
                        amountBefore
                        orderId
                        description
                        order {
                            id
                            status
                        }
                        itemInBox {
                            inventory {
                                name
                            }
                            merchant {
                                name
                            }
                            itemVariant {
                                sku
                                stockCount
                            }
                        }
                        user {
                            name
                            deletedAt
                        }
                        order {
                            id
                            status
                        }
                        createdAt
                    }
                    totalCount
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
                            buildingNumber
                            streetAddress
                            buildingNumber
                        }
                    }
                    totalCount
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
                    totalCount
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
                            deletedAt
                        }
                        createdAt
                    }
                    totalCount
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
                    totalCount
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
                        deletedAt
                    }
                    createdAt
                    sheetOrders {
                        id
                        adminPass
                        financePass
                        shippingCollected
                        amountCollected
                        orderId
                        assignedBy {
                            name
                            deletedAt
                        }
                        order {
                            failsAndAssigns
                            previousOrderId
                            previousOrder {
                                id
                            }

                            parentOrder {
                                id
                            }
                            paymentType
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
                        buildingNumber
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
                    totalCount
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
                    totalCount
                    cursor
                }
            }
        `;
    };
    const paginateSettlementTransactions = (payload) => {
        return gql`
            query paginateSettlementTransactions($input: PaginateSettlementTransactionsInput!) {
                paginateSettlementTransactions(input: $input) {
                    data {
                        id
                        type
                        description
                        fromAccountId
                        sheetOrderId
                        toAccountId
                        merchantSettlementId
                        amount
                        currency
                        receipt
                        status
                        auditedById
                        createdAt
                        lastModified
                        sheetOrder {
                            id
                            sheetId
                            orderId
                            adminPass
                            financePass
                            shippingCollected
                            amountCollected
                            transactionId
                            assignedById
                            createdAt
                            lastModified
                            order {
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
                                previousOrder {
                                    id
                                    type
                                }
                                parentOrder {
                                    id
                                    type
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
                                    signatureId
                                    signatureFile {
                                        id
                                        key
                                        url
                                        name
                                    }
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
                                    buildingNumber
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
                                    buildingNumber
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
                                    fromHub {
                                        name
                                    }
                                    toHub {
                                        name
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
                    }
                    cursor
                    totalCount
                }
            }
        `;
    };
    const fetchTransactions = (payload) => {
        return gql`
            query paginateFinancialTransaction($input: FinancialTransactionPaginationInput!) {
                paginateFinancialTransaction(input: $input) {
                    cursor
                    totalCount
                    data {
                        id
                        type
                        description
                        fromAccountId
                        sheetOrderId
                        toAccountId
                        merchantSettlementId
                        amount
                        currency
                        receipt
                        status
                        auditedById
                        createdAt
                        lastModified
                        auditedBy {
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
                        }
                        fromAccount {
                            id
                            name
                            type
                            userId
                            merchantId
                            currency
                            balance
                            createdAt
                            lastModified
                            deletedAt
                        }
                        toAccount {
                            id
                            name
                            type
                            userId
                            merchantId
                            currency
                            balance
                            createdAt
                            lastModified
                            deletedAt
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
                            assignedById
                            createdAt
                            lastModified
                            order {
                                id
                                otherId
                                shopifyName
                                currency
                                previousOrderId
                                hubId
                                type
                                paymentType
                                status
                                merchantCustomerId
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
                                orderDate
                                initialDate
                                createdAt
                                lastModified
                                failsAndAssigns
                                paidToMerchant
                                courier {
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
                                }
                                merchantCustomer {
                                    id
                                    merchantId
                                    customerId
                                    customerName
                                    createdAt
                                    customer {
                                        id
                                        phone
                                        email
                                    }
                                    merchant {
                                        id
                                        shopifyShop
                                        name
                                        currency
                                        includesVat
                                        taxId
                                        bankNumber
                                        bankName
                                        ownerId
                                        addressId
                                        threshold
                                        overShipping
                                        webToken
                                        webTokenExpiration
                                        createdAt
                                        lastModified
                                    }
                                }
                                address {
                                    id
                                    country
                                    governorateId
                                    zoneId
                                    city
                                    state
                                    streetAddress
                                    zipCode
                                    buildingNumber
                                    buildingNumber
                                    createdAt
                                    lastModified
                                }
                                orderItems {
                                    id
                                    orderId
                                    itemVariantId
                                    count
                                    unitPrice
                                    unitDiscount
                                    partialCount
                                    returnCount
                                    inventoryId
                                    createdAt
                                    lastModified
                                    deletedAt
                                    countInInventory
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
                                previousOrder {
                                    id
                                    otherId
                                    shopifyName
                                    currency
                                    previousOrderId
                                    hubId
                                    type
                                    paymentType
                                    status
                                    merchantCustomerId
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
                                    orderDate
                                    initialDate
                                    createdAt
                                    lastModified
                                    failsAndAssigns
                                    paidToMerchant
                                    sheetOrder {
                                        id
                                        sheetId
                                        orderId
                                        adminPass
                                        financePass
                                        shippingCollected
                                        amountCollected
                                        transactionId
                                        assignedById
                                        createdAt
                                        lastModified
                                        sheet {
                                            id
                                            userId
                                            status
                                            createdAt
                                            lastModified
                                            sheetOrders {
                                                id
                                                sheetId
                                                orderId
                                                adminPass
                                                financePass
                                                shippingCollected
                                                amountCollected
                                                transactionId
                                                assignedById
                                                createdAt
                                                lastModified
                                            }
                                            userInfo {
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
                                            }
                                            orderCount
                                        }
                                        order {
                                            id
                                            otherId
                                            shopifyName
                                            currency
                                            previousOrderId
                                            hubId
                                            type
                                            paymentType
                                            status
                                            merchantCustomerId
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
                                            orderDate
                                            initialDate
                                            createdAt
                                            lastModified
                                            failsAndAssigns
                                            paidToMerchant
                                        }
                                        transactions {
                                            id
                                            type
                                            description
                                            fromAccountId
                                            sheetOrderId
                                            toAccountId
                                            merchantSettlementId
                                            amount
                                            currency
                                            receipt
                                            status
                                            auditedById
                                            createdAt
                                            lastModified
                                            auditedBy {
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
                                            }

                                            taxedShipping {
                                                id
                                                transactionId
                                                createdAt
                                            }
                                            toAccount {
                                                id
                                                name
                                                type
                                                userId
                                                merchantId
                                                currency
                                                balance
                                                createdAt
                                                lastModified
                                                deletedAt
                                            }
                                            fromAccount {
                                                id
                                                name
                                                type
                                                userId
                                                merchantId
                                                currency
                                                balance
                                                createdAt
                                                lastModified
                                                deletedAt
                                            }
                                        }
                                        assignedBy {
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
                                        }
                                    }
                                    merchantCustomer {
                                        id
                                        merchantId
                                        customerId
                                        customerName
                                        createdAt
                                        customer {
                                            id
                                            phone
                                            email
                                            details {
                                                id
                                                merchantId
                                                customerId
                                                customerName
                                                createdAt
                                            }
                                            nameSuggestions {
                                                id
                                                merchantId
                                                customerId
                                                customerName
                                                createdAt
                                            }
                                        }
                                    }
                                    address {
                                        id
                                        country
                                        governorateId
                                        zoneId
                                        city
                                        state
                                        streetAddress
                                        zipCode
                                        buildingNumber
                                        buildingNumber
                                        createdAt
                                        lastModified
                                        zone {
                                            id
                                            name
                                            nameAr
                                            governorateId
                                        }
                                        governorate {
                                            id
                                            name
                                            arabicName
                                            zones {
                                                id
                                                name
                                                nameAr
                                                governorateId
                                            }
                                        }
                                    }
                                    merchant {
                                        id
                                        shopifyShop
                                        name
                                        currency
                                        includesVat
                                        taxId
                                        bankNumber
                                        bankName
                                        ownerId
                                        addressId
                                        threshold
                                        overShipping
                                        webToken
                                        webTokenExpiration
                                        createdAt
                                        lastModified

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
                                            deletedAt
                                            lastBillTransaction {
                                                id
                                                type
                                                description
                                                fromAccountId
                                                sheetOrderId
                                                toAccountId
                                                merchantSettlementId
                                                amount
                                                currency
                                                receipt
                                                status
                                                auditedById
                                                createdAt
                                                lastModified
                                            }
                                        }
                                        owner {
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
                                        }
                                    }
                                    orderItems {
                                        id
                                        orderId
                                        itemVariantId
                                        count
                                        unitPrice
                                        unitDiscount
                                        partialCount
                                        returnCount
                                        inventoryId
                                        createdAt
                                        lastModified
                                        deletedAt
                                        itemReturn {
                                            id
                                            orderItemId
                                            hubId
                                            merchantId
                                            packageId
                                            count
                                            createdAt
                                            orderItem {
                                                id
                                                orderId
                                                itemVariantId
                                                count
                                                unitPrice
                                                unitDiscount
                                                partialCount
                                                returnCount
                                                inventoryId
                                                createdAt
                                                lastModified
                                                deletedAt
                                                countInInventory
                                            }
                                        }
                                        inventoryReturn {
                                            id
                                            inventoryId
                                            hubId
                                            restockedToId
                                            packageId
                                            orderItemId
                                            count
                                            status
                                            createdAt
                                            lastModified
                                        }
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
                                            lastModified
                                            deletedAt
                                            item {
                                                id
                                                merchantId
                                                name
                                                shopifyId
                                                description
                                                currency
                                                imageUrl
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
                                                    lastModified
                                                    deletedAt
                                                    fullName
                                                    stockCount
                                                    blocksCountSum
                                                }
                                                createdAt
                                                lastModified
                                                deletedAt
                                            }
                                            selectedOptions {
                                                id
                                                itemVariantId
                                                variantNameId
                                                variantOptionId
                                                createdAt
                                                lastModified
                                                deletedAt
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

                                            fullName
                                            stockCount
                                            blocksCountSum
                                        }
                                        inventory {
                                            id
                                            inventoryId
                                            merchantId
                                            itemVariantId
                                            boxId
                                            count
                                            minCount
                                            createdAt
                                            lastModified
                                            deletedAt
                                            box {
                                                id
                                                merchantId
                                                palletId
                                                name
                                                createdAt
                                                lastModified
                                                deletedAt
                                                pallet {
                                                    id
                                                    merchantId
                                                    rackId
                                                    level
                                                    name
                                                    createdAt
                                                    lastModified
                                                    deletedAt
                                                    rack {
                                                        id
                                                        merchantId
                                                        inventoryId
                                                        levels
                                                        name
                                                        createdAt
                                                        lastModified
                                                        deletedAt
                                                    }
                                                    boxes {
                                                        id
                                                        merchantId
                                                        palletId
                                                        name
                                                        createdAt
                                                        lastModified
                                                        deletedAt
                                                    }
                                                }
                                            }
                                            itemVariant {
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
                                                lastModified
                                                deletedAt
                                                fullName
                                                stockCount
                                                blocksCountSum
                                            }
                                            totalCount
                                        }
                                        countInInventory
                                    }
                                    previousOrder {
                                        id
                                        otherId
                                        shopifyName
                                        currency
                                        previousOrderId
                                        hubId
                                        type
                                        paymentType
                                        status
                                        merchantCustomerId
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
                                        orderDate
                                        initialDate
                                        createdAt
                                        lastModified
                                        failsAndAssigns
                                        paidToMerchant
                                    }
                                    parentOrder {
                                        id
                                        otherId
                                        shopifyName
                                        currency
                                        previousOrderId
                                        hubId
                                        type
                                        paymentType
                                        status
                                        merchantCustomerId
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
                                        orderDate
                                        initialDate
                                        createdAt
                                        lastModified
                                        failsAndAssigns
                                        paidToMerchant
                                    }
                                    courier {
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

                                        employee {
                                            id
                                            type
                                            currency
                                            salary
                                            commission
                                            createdAt
                                            lastModified
                                        }
                                        courierSheets {
                                            id
                                            userId
                                            status
                                            createdAt
                                            lastModified
                                            orderCount
                                        }
                                        userPermissions {
                                            userId
                                            permissionId
                                        }
                                        inventory {
                                            id
                                            hubId
                                            name
                                            module
                                            governorateId
                                            createdAt
                                            lastModified

                                            racks {
                                                id
                                                merchantId
                                                inventoryId
                                                levels
                                                name
                                                createdAt
                                                lastModified
                                                deletedAt
                                                pallets {
                                                    id
                                                    merchantId
                                                    rackId
                                                    level
                                                    name
                                                    createdAt
                                                    lastModified
                                                    deletedAt
                                                }
                                            }
                                        }
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
                                        signatureId
                                        createdAt
                                        lastModified
                                        countAndSum
                                        signatureFile {
                                            id
                                            key
                                            name
                                            category
                                            sizeInKiloBytes
                                            merchantId
                                            createdAt
                                            lastModified
                                            deletedAt
                                            url
                                        }
                                    }
                                }
                            }
                        }
                    }
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
                            deletedAt
                        }
                        fromAccount {
                            merchantId
                            id
                            name
                        }
                        toAccount {
                            merchantId
                            id
                            name
                        }

                        sheetOrder {
                            order {
                                id
                                type
                                status
                                shopifyName
                                otherId
                                merchant {
                                    name
                                }
                                address {
                                    country
                                    city
                                    streetAddress
                                    buildingNumber
                                    buildingNumber
                                }
                                merchantCustomer {
                                    id
                                    customerName
                                    customer {
                                        email
                                        phone
                                        id
                                    }
                                }
                            }
                        }
                        createdAt
                    }
                    cursor
                    totalCount
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
                            deletedAt
                        }
                        fromAccount {
                            merchantId
                            id
                            name
                        }
                        toAccount {
                            merchantId
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                id
                                type
                                status
                                shopifyName
                                otherId
                                merchant {
                                    name
                                }
                                address {
                                    country
                                    city
                                    streetAddress
                                    buildingNumber
                                    buildingNumber
                                }
                                merchantCustomer {
                                    id
                                    customerName
                                    customer {
                                        email
                                        phone
                                        id
                                    }
                                }
                            }
                        }
                        createdAt
                    }
                    cursor
                    totalCount
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
                            merchantId
                            id
                            name
                        }
                        toAccount {
                            merchantId
                            id
                            name
                        }
                        sheetOrder {
                            order {
                                address {
                                    country
                                    city
                                    streetAddress
                                    buildingNumber
                                    buildingNumber
                                }
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
                    totalCount
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

    const findPermissions = (payload) => {
        return gql`
            query findPermissions {
                findPermissions {
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
                        signatureId
                        signatureFile {
                            id
                            key
                            url
                            name
                        }
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
                    totalCount
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
        const mutation = useLazyQuery(query, {
            fetchPolicy: fetchPolicy ?? 'network-only',
        });
        return mutation;
    };

    const useQueryGQL = (fetchPolicy, query, payload) => {
        return useQuery(query, {
            fetchPolicy: fetchPolicy?.length != 0 ? fetchPolicy : 'network-only',
            variables: {
                input: payload,
            },
            skip: !ready,
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
        removeUser,
        updateEmployeeInfo,
        useQueryGQL,
        fetchUsers,
        isValidEmailMutation,
        findPermissions,
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
        updateOrdersInCourierSheet,
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
        updateUserPermissions,
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
        removeInventoryRent,
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
        deleteItems,
        findAllZones,
        deleteCourierSheet,
        removeItemInBox,
        createMerchantToken,
        findReturnPackageBySku,
        findOneItem,
        paginateInventoryRentTransaction,
        paginateMerchantSettlements,
        ordersDeliverableSummary,
        graphOrders,
        findOneUser,
        emailTaken,
        findItemReturnByOrder,
        findPublicOrder,
        cancelUnresolvedOrders,
        paginateSettlementPayouts,
        paginateMerchantDebts,
        createMerchantSettlement,
        paginateShippingCollections,
        processShippingTaxes,
        paginateSettlementTransactions,
        findOneMerchantSettlement,
    };
};
export default API;
