import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

const API = () => {
    const axiosheaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const axiosheadersfiles = {
        'Content-Type': 'multipart/form-data',
    };
    const serverbaselinkfunc = () => {
        var serverbaselinktemp = 'https://liftup-t-80fc1de1a85d.herokuapp.com';
        // var serverbaselinktemp = 'https://apmedgo.com';
        // var serverbaselinktemp = 'http://0.0.0.0:8000';
        // var serverbaselinktemp = 'http://192.168.1.144:8000';
        // var serverbaselinktemp = 'http://localhost:8000';
        // var serverbaselinktemp = 'http://192.168.1.120:8000';
        return serverbaselinktemp;
    };
    const addUser = () => {
        return gql`
            mutation cruser($input: CreateUserInput!) {
                createUser(createUserInput: $input)
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

    const addInventory = () => {
        return gql`
            mutation createInventory($input: CreateInventoryInput!) {
                createInventory(CreateInventoryInput: $input)
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

    const requestLoginResponse = () => {
        return gql`
            mutation requestTokenMutation($input: TokenRequestInput!) {
                requestToken(requestTokenInput: $input) {
                    user {
                        id
                        type
                        name
                        email
                        phone
                    }
                    userRoles {
                        roleId
                        role {
                            name
                        }
                    }
                    accessToken
                }
            }
        `;
    };

    const isValidEmailMutation = (payload) => {
        return gql`
            query isValid($email: String!) {
                isValidEmail(email: $email) {
                    isValid
                    id
                }
            }
        `;
    };

    const fetchInventories = (payload) => {
        return gql`
            query paginateInventories {
                paginateInventories(input: {
                    limit: ${JSON.stringify(payload?.limit)},
                    afterCursor: ${JSON.stringify(payload?.afterCursor)},
                    beforeCursor: ${JSON.stringify(payload?.beforeCursor)},
                }) {
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
            query paginateItemsInBox {
                paginateItemInBox(input: { limit: 10, isAsc: true }) {
                    data {
                        id
                        itemSku
                        inventoryId
                        count
                        totalCount
                        item {
                            name
                            merchantId
                            imageUrl
                        }
                    }
                    cursor
                }
            }
        `;
    };
    const fetchIdleOrders = () => {
        return gql`
            query findOrders {
                paginateOrders(input: { merchantIds: [], statuses: [idle], limit: 5 }) {
                    data {
                        id
                        shippingPrice
                        items {
                            itemSku
                            frozenPrice
                            frozenCurrency
                            info {
                                name
                            }
                            inventory {
                                count
                            }
                        }
                    }
                    cursor
                }
            }
        `;
    };

    const fetchUsers = (payload) => {
        return gql`
            query findUsers {
                paginateUsers(paginateUsersInput: { limit: 10, isAsc: false }) {
                    data {
                        id
                        name
                        type
                        email
                        phone
                    }
                    cursor
                }
            }
        `;
    };

    const fetchMerchantItems = (payload) => {
        return gql`
            query paginateItms{
                paginateItems(itemPageInput: {
                limit: ${JSON.stringify(payload?.limit)}, 
                isAsc: true,
                afterCursor: ${JSON.stringify(payload?.afterCursor)},
                beforeCursor: ${JSON.stringify(payload?.beforeCursor)},
                name: ${JSON.stringify(payload?.name)},
                sku:  ${JSON.stringify(payload?.sku)},
                }){
            
                data{
                    sku,
                    name,
                    merchantSku,
                    size,
                    color,
                    colorHex,
                    description,
                    name,
                    imageUrl,
                    prices{
                    info{
                        currency
                        price
                    }
                    }
                }
                cursor
                }
            }
        `;
    };
    const fetchRacks = (payload) => {
        return gql`
        query paginateRacks{
            paginateRacks(input: {
              limit: ${JSON.stringify(payload?.limit)},
              invetoryIds: ${JSON.stringify(payload?.invetoryIds)},
              
            }){
              data{
                name,
                ballots{
                  id
                  name
                }
              },
              
              cursor
            }
          }
        `;
    };
    const fetchItemHistory = (itemInBoxId) => {
        return gql`
        query paginateItemHistory{
            paginateItemHistory(input: {
              itemInBoxId: ${JSON.stringify(itemInBoxId)},
              
            }){
                data{
                amount,
                description,
              },
              cursor
            }
          }
        `;
    };

    const useMutationGQL = (query, payload) => {
        const mutation = useMutation(query, {
            variables: {
                input: payload,
            },
            context: {
                headers: {
                    Authorization:
                        ' Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVuTFgzTXZ0UzFZOXJjQjN0WDhKM0d0N1F4IiwiaHViSWQiOm51bGwsIm1lcmNoYW50SWQiOm51bGwsInR5cGUiOiJjb3VyaWVyIiwicm9sZXMiOlsxXSwiaWF0IjoxNzA2ODE0NzQzLCJleHAiOjE4MDY4MTY1NDN9.BnUOLRuoV1QgSzbYtiQKZONguDLQyBCmhNnBwB4OPC4',
                },
            },
        });
        return mutation;
    };

    const useLazyQueryGQL = (query, fetchPolicy) => {
        const mutation = useLazyQuery(query, {
            fetchPolicy: fetchPolicy ?? 'network-only',
            context: {
                headers: {
                    Authorization:
                        ' Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVuTFgzTXZ0UzFZOXJjQjN0WDhKM0d0N1F4IiwiaHViSWQiOm51bGwsIm1lcmNoYW50SWQiOm51bGwsInR5cGUiOiJjb3VyaWVyIiwicm9sZXMiOlsxXSwiaWF0IjoxNzA2ODE0NzQzLCJleHAiOjE4MDY4MTY1NDN9.BnUOLRuoV1QgSzbYtiQKZONguDLQyBCmhNnBwB4OPC4',
                },
            },
        });
        return mutation;
    };

    const useQueryGQL = (token, query) => {
        return useQuery(query, {
            fetchPolicy: 'network-only',
            context: {
                headers: {
                    Authorization:
                        ' Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVuTFgzTXZ0UzFZOXJjQjN0WDhKM0d0N1F4IiwiaHViSWQiOm51bGwsIm1lcmNoYW50SWQiOm51bGwsInR5cGUiOiJjb3VyaWVyIiwicm9sZXMiOlsxXSwiaWF0IjoxNzA2ODE0NzQzLCJleHAiOjE4MDY4MTY1NDN9.BnUOLRuoV1QgSzbYtiQKZONguDLQyBCmhNnBwB4OPC4',
                },
            },
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
        fetchIdleOrders,
        fetchRacks,
        fetchItemHistory,
    };
};
export default API;
