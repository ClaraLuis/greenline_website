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

    const useLazyQueryGQL = (query) => {
        const mutation = useLazyQuery(query, {
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

    const useQueryGQL = (token, query) => {
        return useQuery(query, {
            context: {
                headers: {
                    Authorization:
                        ' Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVuTFgzTXZ0UzFZOXJjQjN0WDhKM0d0N1F4IiwiaHViSWQiOm51bGwsIm1lcmNoYW50SWQiOm51bGwsInR5cGUiOiJjb3VyaWVyIiwicm9sZXMiOlsxXSwiaWF0IjoxNzA2ODE0NzQzLCJleHAiOjE4MDY4MTY1NDN9.BnUOLRuoV1QgSzbYtiQKZONguDLQyBCmhNnBwB4OPC4',
                },
            },
        });
    };

    const Checkauth_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/UserAuthorizationChecker/',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const Login_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/login/',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchCompanies_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/companies/companies',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const CompanyMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/companies/companies',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const CompanyDeleteMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'delete',
            url: serverbaselinkfunc() + '/api/companies/companies',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchLeads_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/leads',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const LeadsMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/leads',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const DeleteLeadsMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'delete',
            url: serverbaselinkfunc() + '/api/leads/leads',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchUsers_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/userprofiles/fetchusers',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const UserMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/userprofiles/adduser',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const DeleteUserMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'delete',
            url: serverbaselinkfunc() + '/api/userprofiles/adduser',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchGroups_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/groups',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const GroupMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/groups',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const DeleteGroupMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'delete',
            url: serverbaselinkfunc() + '/api/leads/groups',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchPhases_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/phases',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const PhaseMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/phases',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const DeletePhaseMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'delete',
            url: serverbaselinkfunc() + '/api/leads/phases',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const AssigntoGroupMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/assignlead_usertogroup',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const AssigntoPhaseMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/assignlead_usertophase',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const AssignUserCompanyMutation_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/userprofiles/assignuser',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchCampaigns_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/meta_campaignsanalysis',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const AddCall_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/calls',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const AddFollowup_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/followup',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchFollowups_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/followup',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const AddMeeting_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/meetings',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchMeetings_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/meetings',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const AddDeal_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'post',
            url: serverbaselinkfunc() + '/api/leads/deals',

            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchDeals_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/deals',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const UserChooseCurrentCompan_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'POST',
            url: serverbaselinkfunc() + '/api/userprofiles/userchoosecurrentcompany',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchCalls_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/calls_f',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchMeta_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/meta_campaigns_analytics',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchMetacampaigns_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/f_campaigns',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchMetaadstes_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/f_adsets',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchMetaads_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/f_ads',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchSecuritylayers_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/userprofiles/sec_permissions',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchAllSecuritylayers_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/userprofiles/securitylayers',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    const Updateleadstatus_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'POST',
            url: serverbaselinkfunc() + '/api/leads/updateleadstatus',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const CRUDSecurityGroup_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'POST',
            url: serverbaselinkfunc() + '/api/userprofiles/securitylayers',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const Changepassword_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'POST',
            url: serverbaselinkfunc() + '/api/userprofiles/changepassword',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const DeleteSecurityGroup_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'Delete',
            url: serverbaselinkfunc() + '/api/userprofiles/securitylayers',
            headers: axiosheaders,
            data: tempaxiosdata,
        });
        return axiosfetch;
    };

    const FetchCampaigninsights_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/campaigns_insights',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchCampaignphasesinsights_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/campaigns_phases_insights',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchCampaignOveralls_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/meta/campaigns_overallinsights',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };
    const FetchUserAnalytics_API = async (axiosdata) => {
        var tempaxiosdata = { ...axiosdata };
        axios.defaults.withCredentials = true;
        const axiosfetch = axios({
            method: 'GET',
            url: serverbaselinkfunc() + '/api/leads/usersanalytics',
            headers: axiosheaders,
            params: tempaxiosdata,
        });
        return axiosfetch;
    };

    return {
        useMutationGQL,
        addUser,
        useQueryGQL,
        fetchUsers,
        FetchUserAnalytics_API,
        FetchCampaignOveralls_API,
        Changepassword_API,
        FetchCampaignphasesinsights_API,
        FetchCampaigninsights_API,
        DeleteSecurityGroup_API,
        CRUDSecurityGroup_API,
        FetchAllSecuritylayers_API,
        FetchSecuritylayers_API,
        FetchMetacampaigns_API,
        FetchMeta_API,
        FetchCalls_API,
        UserChooseCurrentCompan_API,
        Login_API,
        Checkauth_API,
        FetchCompanies_API,
        CompanyMutation_API,
        CompanyDeleteMutation_API,
        FetchLeads_API,
        LeadsMutation_API,
        DeleteLeadsMutation_API,
        FetchUsers_API,
        UserMutation_API,
        DeleteUserMutation_API,
        FetchGroups_API,
        GroupMutation_API,
        DeleteGroupMutation_API,
        AssigntoGroupMutation_API,
        FetchPhases_API,
        PhaseMutation_API,
        DeletePhaseMutation_API,
        AssigntoPhaseMutation_API,
        FetchCampaigns_API,
        AddCall_API,
        AddFollowup_API,
        AddMeeting_API,
        FetchFollowups_API,
        FetchMeetings_API,
        AddDeal_API,
        FetchDeals_API,
        AssignUserCompanyMutation_API,
        Updateleadstatus_API,
        FetchMetaadstes_API,
        FetchMetaads_API,
        isValidEmailMutation,
        useLazyQueryGQL,
        requestLoginResponse,
    };
};
export default API;
