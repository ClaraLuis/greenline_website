import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
// import API from './API/API';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import API from './API/API';

export const Loggedincontext = React.createContext();

export const Loggedincontext_provider = (props) => {
    const { Checkauth_API } = API();

    // const { fetchuseauthorization } = API();
    const [cookies, setCookie] = useCookies();
    // axios.interceptors.request.use(function (config) {
    //     var defaultheaders = config.headers;
    //     var token = cookies['12312easdasdas32131asdsadsadsaqweasd123!@_#!@3123'];

    //     if (token != undefined) {
    //         // if (token.access != undefined) {
    //         defaultheaders.Authorization = 'Bearer ' + token;
    //         // }
    //     }
    //     config.headers = defaultheaders;
    //     return config;
    // });
    const [loggedincontext, setloggedincontext] = useState(false);

    const [tokencontext, settokencontext] = useState('');
    // const fetchuseauthorizationQueryContext = useQuery(['fetchuseauthorization'], () => fetchuseauthorization(), {
    //     keepPreviousData: true,
    //     staleTime: 500000000000000000,
    // });
    useEffect(() => {
        var token = cookies['12312easdasdas32131asdsadsadsaqweasd123!@_#!@3123'];
        settokencontext(token);
    }, []);
    const getoken = async () => {
        var token = await cookies['12312easdasdas32131asdsadsadsaqweasd123!@_#!@3123'];
        return token;
    };
    const headersContext = async () => {
        const axiosheaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ',
        };
        // var token = cookies['12312easdasdas32131asdsadsadsaqweasd123!@_#!@3123'];
        var tokenasy = await getoken();

        axiosheaders['Authorization'] = 'Bearer ' + tokenasy;

        return axiosheaders;
    };
    const [isloggedincontext, setisloggedincontext] = useState(false);
    const [instbranchescontext, setinstbranchescontext] = useState([]);
    const [userloggedinfobjcontext, setuserloggedinfobjcontext] = useState({
        userinfo: {
            name: '',
            email: '',
            mobile: '',
            type: '',
            useractive: '',
            currentinstactive: '',
        },
        currentinstinfo: {
            instname: '',
            instlogo: '',
        },
    });
    const fetchAuthorizationQueryContext = useQuery(['Checkauth_API'], () => Checkauth_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    return (
        <Loggedincontext.Provider
            value={{
                isloggedincontext,
                setisloggedincontext,
                userloggedinfobjcontext,
                setuserloggedinfobjcontext,
                instbranchescontext,
                setinstbranchescontext,
                fetchAuthorizationQueryContext,
                tokencontext,
                settokencontext,
                headersContext,
                getoken,
                loggedincontext,
                setloggedincontext,
            }}
        >
            {props.children}
        </Loggedincontext.Provider>
    );
};

export const Loggedincontext_consumer = Loggedincontext.Consumer;
