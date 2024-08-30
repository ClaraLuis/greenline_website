import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import API from '../../../API/API';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext';
import { Loggedincontext } from '../../../Loggedincontext.js';
import '../Generalfiles/CSS_GENERAL/Phonenumberinput.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import loginstyles from './login.module.css';
import { BiEdit } from 'react-icons/bi';
const Login = () => {
    const auth = getAuth();
    const { isValidEmailMutation, useMutationGQL, useQueryGQL, useLazyQueryGQL } = API();
    let history = useHistory();
    const [otp, setOtp] = useState('');
    const [buttonLoading, setbuttonLoading] = useState(false);
    const queryParameters = new URLSearchParams(window.location.search);
    const { loggedincontext, setloggedincontext } = useContext(Loggedincontext);
    const { setpageactive_context, setpagetitle_context, setUserInfoContext } = useContext(Contexthandlerscontext);
    useEffect(() => {
        setpagetitle_context('login');
        setpageactive_context('/login');
        document.title = 'Greenline';
    }, []);
    const { lang, langdetect } = useContext(LanguageContext);

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

    const [checkEmail, { loading, error, data }] = useLazyQueryGQL(isValidEmailMutation(), 'cache-first');
    // 0 = not valid
    // 1 = signup
    // 2 = login
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [email, password, confirmpassword, isValid, inFirebase]);

    const handleSubmit = async () => {
        setbuttonLoading(true);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email != undefined && email?.length != 0 && regex.test(email)) {
            if (!isValid) {
                if (!isValid) {
                    try {
                        const result = await fetchSignInMethodsForEmail(auth, email);
                        if (result.length > 0) {
                            setinFirebase(true);
                        }
                        setisValid(true); // Set isValid to true after validating the email
                    } catch (e) {
                        handleError(e);
                    }

                    try {
                        await checkEmail({ variables: { email } });
                    } catch (error) {
                        handleError(error);
                    }
                }
            } else {
                setbuttonLoading(true);

                if (!inFirebase) {
                    if (password === confirmpassword) {
                        createUserWithEmailAndPassword(auth, email, password)
                            .then((response) => {
                                if (response) {
                                    var temp = { ...payload };
                                    temp.token = response.user.accessToken;
                                    // handleRequestLoginResponse(temp);
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
                                // handleRequestLoginResponse(temp);
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
                setbuttonLoading(false);
            }
        } else {
            NotificationManager.warning('Please enter a valid email', 'Warning');
        }

        setbuttonLoading(false);
    };

    const handleError = (error) => {
        let errorMessage = 'An unexpected error occurred';
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            errorMessage = error.graphQLErrors[0].message || errorMessage;
        } else if (error.networkError) {
            errorMessage = error.networkError.message || errorMessage;
        } else if (error.message) {
            errorMessage = error.message;
        }

        NotificationManager.warning(errorMessage, 'Warning!');
        console.error('Error:', error);
    };

    useEffect(() => {
        if (error) {
            alert(JSON.stringify(error));
        }
        if (data) {
            if (data?.userState == 0) {
                NotificationManager.warning('Email is not Valid', 'Warning');
            } else if (data?.userState == 1) {
                setisValid(true);
            } else if (data?.userState == 2) {
                setisValid(true);
                setinFirebase(true);
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
                                                style={{ position: 'relative' }}
                                                disabled={isValid}
                                                name="email"
                                                type="email"
                                                class={'inputfeild'}
                                                value={email}
                                                onChange={(event) => {
                                                    setemail(event.target.value);
                                                    setisValid(false); // Reset isValid when the email changes
                                                    setinFirebase(false); // Also reset inFirebase
                                                    setpassword(''); // Clear the password field
                                                    setconfirmpassword(''); // Clear the confirm password field
                                                }}
                                            />

                                            {isValid && (
                                                <BiEdit
                                                    style={{ position: 'absolute', right: 10, zIndex: 10, top: '55%' }}
                                                    size={20}
                                                    class="text-secondaryhover"
                                                    onClick={() => {
                                                        setisValid(false);
                                                        setinFirebase(false);
                                                        setpassword('');
                                                        setconfirmpassword('');
                                                    }}
                                                />
                                            )}
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
                                                onClick={handleSubmit}
                                                class={`${generalstyles.btn} ${generalstyles.btn_primary}` + ' font-15 allcentered '}
                                                style={{
                                                    width: '100%',
                                                    height: 48,
                                                }}
                                                disabled={buttonLoading}
                                            >
                                                {buttonLoading && <CircularProgress color="white" width="20px" height="20px" duration="1s" />}
                                                {!isValid && <>{!buttonLoading && <span>{isNew ? 'Signup' : 'Login'} </span>}</>}
                                                {!inFirebase && isValid && <>{!buttonLoading && <span>{'Signup'} </span>}</>}
                                                {inFirebase && isValid && <>{!buttonLoading && <span>{'Login'} </span>}</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Login;
