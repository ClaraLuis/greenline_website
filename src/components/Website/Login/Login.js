import React, { useEffect, useContext, useState } from 'react';
import { LanguageContext } from '../../../LanguageContext';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import logo from '../Generalfiles/images/logo.png';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import loginstyles from './login.module.css';
import OtpInput from 'react-otp-input';
import PhoneInput from 'react-phone-input-2';
import '../Generalfiles/CSS_GENERAL/Phonenumberinput.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import Signup from '../Signup/Signup.js';
import { MdArrowBackIosNew } from 'react-icons/md';
import { Loggedincontext } from '../../../Loggedincontext.js';
import { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, fetchProviders, EmailAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../../Auth/firebaseconfig.js';
const Login = () => {
    const auth = getAuth();
    const { isValidEmailMutation, useMutationGQL, useQueryGQL, useLazyQueryGQL, requestLoginResponse } = API();
    let history = useHistory();
    const [otp, setOtp] = useState('');
    const [value, setValue] = useState('');
    const queryParameters = new URLSearchParams(window.location.search);
    const { loggedincontext, setloggedincontext } = useContext(Loggedincontext);
    const { setpageactive_context, setpagetitle_context, setUserInfoContext } = useContext(Contexthandlerscontext);
    useEffect(() => {
        setpagetitle_context('login');
        setpageactive_context('/login');
        document.title = 'Dashboard';
    }, []);
    const { lang, langdetect } = useContext(LanguageContext);
    const [assets, setassets] = useState([
        { img: 'https://employer.ambitionbox.com/static/media/speak.d3e3e7b8ca6310dac40f564ec123879d.svg', title: 'Tell your story' },
        { img: 'https://employer.ambitionbox.com/static/media/reviews.2704131c4656f93df4de179fd51101a3.svg', title: 'Manage reviews' },
        { img: 'https://employer.ambitionbox.com/static/media/reports.1296dcbbd0b6151688f870710a713831.svg', title: 'Get reports and alerts' },
        { img: 'https://employer.ambitionbox.com/static/media/promote.c7379ecbc98676e62d6158ba2765a2a1.svg', title: 'Promote your brand' },
    ]);

    const [openModal, setopenModal] = useState(false);
    const [email, setemail] = useState('');
    const [email1, setemail1] = useState('');
    const [step, setstep] = useState(0);
    const [inFirebase, setinFirebase] = useState(false);
    const [isValid, setisValid] = useState(false);
    const [isNew, setisNew] = useState(false);

    const [password, setpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [payload, setpayload] = useState({ id: null, token: null });

    const [checkEmail, { loading, error, data }] = useLazyQueryGQL(isValidEmailMutation());

    const handleSubmit = async () => {
        try {
            const result = await fetchSignInMethodsForEmail(auth, email);
            if (result.length > 0) {
                setinFirebase(true);
            } else {
            }
        } catch (e) {
            // alert(JSON.stringify(e));
        }
        try {
            await checkEmail({
                variables: {
                    email: email,
                },
            });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const [requestLogin, { loadingrequestLogin, errorrequestLogin, requestLoginData }] = useMutationGQL(requestLoginResponse());

    const handleRequestLoginResponse = async (tokenpayload) => {
        try {
            const requestLoginData = await requestLogin({
                variables: {
                    input: {
                        firebaseToken: tokenpayload?.token,
                        id: tokenpayload?.id,
                    },
                },
            });
            if (requestLoginData != null) {
                // alert(JSON.stringify(requestLoginData?.data?.requestToken?.user));
                setUserInfoContext(requestLoginData?.data?.requestToken);
                history.push('/users');
                // TODO store user data
            }

            // history.push()
        } catch (error) {
            alert(JSON.stringify(error));
            // NotificationManager.warning(error?.message, '');
        }
    };

    useEffect(() => {
        if (error) {
            alert(JSON.stringify(error));
        }
        if (data) {
            if (!data?.isValidEmail?.isValid) {
                NotificationManager.warning('Email is not Valid', 'Warning');
            } else {
                setisValid(true);
                setpayload({ ...payload, id: data?.isValidEmail?.id });
            }
            // alert(JSON.stringify(data?.isValidEmail?.isValid));
        }
    }, [data, error]);
    useEffect(() => {
        if (queryParameters.get('signup') == undefined) {
        } else {
            if (queryParameters.get('signup') == 'true') {
                setstep(1);
            }
        }
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', background: '#eef2f6' }} class="row m-0 w-100 d-flex allcentered mt-md-0  p-md-0">
            <div class={loginstyles.rightcontainer + ' col-lg-4 pb-3'}>
                <div class="row m-0 w-100">
                    <div class="col-lg-12 p-0 allcentered  ">
                        <div style={{ cursor: 'pointer' }} class={loginstyles.logo + ' p-0 '}>
                            <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    </div>
                    <div class="col-lg-12 allcentered mt-3 mb-1" style={{ color: '#20674c', fontSize: '22px', fontWeight: 700 }}>
                        Hi, Welcome Back
                    </div>
                    <div class="col-lg-12 allcentered" style={{ color: 'grey', fontSize: '14px' }}>
                        Enter your credentials to continue
                    </div>
                    {step == 0 && (
                        <div class="col-lg-12 p-0">
                            <div class="row m-0 w-100  px-2 d-flex justify-content-center p-sm-3">
                                <div class="col-lg-12 p-0 ">
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                                            <p class="font-15 font-weight-500 mb-1"> Email </p>
                                            <input
                                                disabled={isValid}
                                                name="email"
                                                type="email"
                                                class={'inputfeild'}
                                                value={email}
                                                onChange={(event) => {
                                                    setemail(event.target.value);
                                                }}
                                            />
                                        </div>
                                        {isValid && (
                                            <>
                                                <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                                                    <p class="font-15 font-weight-500 mb-1"> Password </p>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        class={'inputfeild'}
                                                        value={password}
                                                        onChange={(event) => {
                                                            setpassword(event.target.value);
                                                        }}
                                                    />
                                                </div>
                                                {!inFirebase && (
                                                    <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                                                        <p class="font-15 font-weight-500 mb-1">Confirm Password </p>
                                                        <input
                                                            name="password"
                                                            type="password"
                                                            class={'inputfeild'}
                                                            value={confirmpassword}
                                                            onChange={(event) => {
                                                                setconfirmpassword(event.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        <div class="col-lg-12 p-0 flex-column mt-0 p-md-0">
                                            <button
                                                onClick={() => {
                                                    // if (verified) {
                                                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                                    if (email != undefined && email?.length != 0 && regex.test(email)) {
                                                        if (!isValid) {
                                                            handleSubmit();
                                                        } else {
                                                            if (!inFirebase) {
                                                                if (password === confirmpassword) {
                                                                    createUserWithEmailAndPassword(auth, email, password)
                                                                        .then((response) => {
                                                                            if (response) {
                                                                                var temp = { ...payload };
                                                                                temp.token = response.user.accessToken;
                                                                                handleRequestLoginResponse(temp);
                                                                            }
                                                                        })
                                                                        .catch((error) => {
                                                                            console.log(error);
                                                                            alert('error' + JSON.stringify(error));
                                                                        });
                                                                } else {
                                                                    NotificationManager.warning("Passwords don't match", 'Warning');
                                                                }
                                                            } else {
                                                                signInWithEmailAndPassword(auth, email, password)
                                                                    .then((response) => {
                                                                        if (response) {
                                                                            var temp = { ...payload };
                                                                            temp.token = response.user.accessToken;
                                                                            handleRequestLoginResponse(temp);
                                                                        }
                                                                    })
                                                                    .catch((error) => {
                                                                        if (error?.code == 'auth/missing-password') {
                                                                            NotificationManager.warning('Please Enter Your Password', 'Warning');
                                                                        } else if (error?.code == 'auth/wrong-password') {
                                                                            NotificationManager.warning('Wrong Password', 'Warning');
                                                                        }
                                                                    });
                                                            }
                                                        }
                                                    } else {
                                                        NotificationManager.warning('Please enter a valid email', 'Warning');
                                                    }
                                                }}
                                                class={`${generalstyles.btn} ${generalstyles.btn_primary}` + ' font-15 allcentered '}
                                                style={{
                                                    width: '100%',
                                                    height: 48,
                                                }}
                                                disabled={loading}
                                            >
                                                {loading && <CircularProgress color="white" width="20px" height="20px" duration="1s" />}
                                                {!loading && <span>{isNew ? 'Signup' : 'Login'} </span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step == 1 && (
                        <div class="col-lg-7 p-0">
                            <Signup />
                            <div class={generalstyles.orrow}>
                                <span>{'or'}</span>
                            </div>
                            <div class="col-lg-12 p-0 d-flex allcentered flex-column mt-0 p-md-0 pb-5">
                                <span
                                    onClick={() => {
                                        setstep(0);
                                    }}
                                    class="text-primary text-primaryhover"
                                >
                                    Login
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Login;
