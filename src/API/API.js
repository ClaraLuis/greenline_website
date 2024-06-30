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

    const addUser = () => {
        return gql`
            mutation cruser($input: CreateUserInput!) {
                createUser(createUserInput: $input)
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

    const updateMerchantDomesticShipping = () => {
        return gql`
            mutation updateMerchantDomesticShipping($input: CreateMerchantShippingListInput!) {
                updateMerchantDomesticShipping(input: $input)
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
                        birthdate
                        createdAt
                        lastModified
                        deletedAt
                        roles {
                            roleId
                        }
                    }
                    accessToken
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

    const fetchItemsInBox = () => {
        return gql`
            query paginateItemsInBox($input: ItemInBoxPageInput!) {
                paginateItemInBox(input: $input) {
                    data {
                        id
                        inventoryId
                        count
                        totalCount
                        itemVariant {
                            name
                            merchantId
                            imageUrl
                            id
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
    const fetchOrders = () => {
        return gql`
            query findOrders($input: PaginateOrdersInput!) {
                paginateOrders(input: $input) {
                    data {
                        id
                        shippingPrice
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
                        price
                        paymentType
                        status
                        orderDate
                        currency
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
                        otherId
                        currency
                        previousOrderId
                        type
                        paymentType
                        status
                        customerId
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
                        createdAt
                        lastModified
                        address {
                            country
                            city
                            streetAddress
                            buildingNumber
                            apartmentFloor
                        }
                        merchant {
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
                            info {
                                name
                                imageUrl
                                item {
                                    name
                                }
                            }
                            inventory {
                                count
                                box {
                                    id
                                    name
                                    ballot {
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

    const fetchUsers = (payload) => {
        return gql`
            query findUsers($input: PaginationInput!) {
                paginateUsers(paginateUsersInput: $input) {
                    data {
                        id
                        name
                        type
                        email
                        phone
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
    const fetchMerchants = (payload) => {
        return gql`
            query fetchMerchants($input: PaginateMerchantsInput!) {
                paginateMerchants(input: $input) {
                    data {
                        id
                        name
                    }
                    cursor
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
              name,
              racks{
                id,
                name
                ballots{
                  id,
                  name,
                  level
                   boxes{
                                            name
                                            id
                                            }
                }
              }
            }
          }
        `;
    };

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
                    }
                    cursor
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
                        orderItemId
                        hubId
                        merchantId
                        packageId
                        orderItem {
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
                            }
                        }
                        createdAt
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
                        inventoryId
                        hubId
                        restockedToId
                        packageId
                        orderItemId
                        status
                        orderItem {
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
                            }
                        }
                        createdAt
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
                        ballots {
                            id
                            name
                            level
                        }
                    }

                    cursor
                }
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
                    }
                    cursor
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
            query customers($input: FindCustomerInput!) {
                findCustomer(input: $input) {
                    data {
                        id
                        phone
                        email
                        details {
                            customerName
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
    const fetchCourierSheet = (id) => {
        return gql`
            query CourierSheet{
                CourierSheet(id:${id}) {
                    
                        id
                        status
                        orderCount
                        userInfo {
                            name
                        }
                        createdAt
                        sheetOrders{
                            id
                            adminPass
                            financePass
                            shippingCollected
                           
                            order{
                                status
                                currency
                                shippingPrice
                                price
                                merchant {
                                    id
                                    name
                                }
                                orderItems {
                                    
                                    partialCount
                                    count
                                    unitPrice
                                    itemVariantId
                                    info {
                                        name
                                        item{
                                        name
                                        }
                                   
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
                        id
                        type
                        description
                        receipt
                        status
                        amount
                        fromAccount {
                            name
                        }
                        toAccount {
                            name
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
                        fromAccount {
                            name
                        }
                        toAccount {
                            name
                        }
                        sheetOrder {
                            order {
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
                        fromAccount {
                            name
                        }
                        toAccount {
                            name
                        }
                        sheetOrder {
                            order {
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

    const fetchPackages = (payload) => {
        return gql`
            query PaginateReturnPackages($input: PaginateReturnPackageInput!) {
                PaginateReturnPackages(input: $input) {
                    data {
                        id
                        sku
                        type
                        hubId
                        courierId
                        toInventoryId
                        toMerchantId
                        status
                        createdAt
                        updatedAt
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
    const useQueryGQL = (token, query, payload) => {
        return useQuery(query, {
            fetchPolicy: 'network-only',
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

    return {
        useMutationGQL,
        addUser,
        useQueryGQL,
        fetchUsers,
        isValidEmailMutation,
        useLazyQueryGQL,
        requestLoginResponse,
        fetchMerchantItems,
        addItem,
        fetchInventories,
        addInventory,
        fetchItemsInBox,
        importNew,
        fetchOrders,
        fetchRacks,
        fetchItemHistory,
        exportItem,
        importItem,
        fetcOneInventory,
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
        fetchCourierSheets,
        fetchCourierSheet,
        updateCourierSheet,
        fetchCouriers,
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
        sendAnyFinancialTransaction,
        sendMyFinancialTransaction,
        updateAnyFinancialTransaction,
        updateMyFinancialTransaction,
        fetchCourierCollectionTransactions,
        transferMyCourierCollectionFunds,
        processMerchantPayments,
        fetchMerchantPaymentTransactions,
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
    };
};
export default API;
