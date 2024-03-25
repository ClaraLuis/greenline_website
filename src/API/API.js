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
    };
};
export default API;
