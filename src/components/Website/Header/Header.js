import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { LanguageContext } from '../../../LanguageContext';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import headerstyles from './header.module.css';
import { useMutation } from 'react-query';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API';
import Cookies from 'universal-cookie';
import usericon from '../Generalfiles/images/usericon.png';
import { BiChevronDown } from 'react-icons/bi';
import logo from '../Generalfiles/images/logo.png';

const Header = (props) => {
    let history = useHistory();
    const { logout } = API();
    const { lang } = useContext(LanguageContext);
    const { fetchAuthorizationQueryContext, scroll, setScroll, pagetitle_context, hidesidenav_context } = useContext(Contexthandlerscontext);

    const LogoutMutation = useMutation('Logout_API', {
        mutationFn: logout,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.error('', 'Error In Logging out');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                NotificationManager.success('Logged out');
                const cookies = new Cookies();

                cookies.set('12312easdasdas32131asdsadsadsaqweasd123!@_#!@3123', null, { path: '/', secure: true });
                window.location.reload();

                // setVendorsModal(false);
            } else {
                NotificationManager.warning('', data.data.reason);
            }
        },
    });

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setScroll(window.scrollY >= 1);
            // alert('window.scrollY > 50');
        });
    }, []);
    return (
        <div
            style={{
                background: scroll ? (pagetitle_context == 'dashboard' ? '#fcfcfc' : 'white') : 'transparent',
            }}
            class={scroll ? headerstyles.app_headerscroll + ' w-100 pt-md-1 p-sm-0' : headerstyles.app_header + ' w-100 pt-md-1 p-sm-0 '}
        >
            <div class="row m-0 w-100">
                <div class="col-lg-6 col-md-6 d-flex align-items-center">
                    {!hidesidenav_context && (
                        <div
                            style={{
                                maxWidth: 240,
                                height: 50,
                            }}
                        >
                            <img
                                onClick={() => {
                                    history.push('/home');
                                }}
                                style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                                src={logo}
                            />
                        </div>
                    )}
                </div>
                <div class="col-lg-6 col-md-6 d-flex align-items-center justify-content-end ">
                    {!fetchAuthorizationQueryContext?.data?.data?.loggedin && (
                        <button
                            onClick={() => {
                                history.push('/login');
                            }}
                            class="text-primaryhover"
                        >
                            Login | Employee
                        </button>
                    )}
                    {fetchAuthorizationQueryContext?.data?.data?.loggedin && (
                        <button onClick={() => {}} class="text-primaryhover text-capitalize">
                            {fetchAuthorizationQueryContext?.data?.data?.userinfo.username}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
