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
import axios from 'axios';
import { serverbaselink } from '../../../Env_Variables';

const Signup = () => {
    const { Login_API } = API();
    const cookies = new Cookies();
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, fetchAuthorizationQueryContext } = useContext(Contexthandlerscontext);
    const [otp, setOtp] = useState('');
    const [value, setValue] = useState('');
    const [signupobj, setsignupobj] = useState({
        name: '',
        lastname: '',
        phonenumber: '',
        emp_companyname: '',
        email: '',
        emp_companywebsite: '',
        supportingdocuments: null,
        password: '',
        confirmpassword: '',
        emp_positiontitle: '',
    });
    const [importFileInput, setImportFileInput] = useState(null);
    const [addeditbtndisabled, setaddeditbtndisabled] = useState(false);

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
    const [step, setstep] = useState(0);

    const Signupmutation = (files) => {
        setaddeditbtndisabled(true);
        const axiosheaders = {
            'Content-Type': 'multipart/form-data',
        };
        const formData = new FormData();

        formData.append('fname', signupobj.name);
        formData.append('lname', signupobj.lastname);
        formData.append('emp_positiontitle', signupobj.emp_positiontitle);
        formData.append('phonenumber', signupobj.phonenumber);
        formData.append('email', signupobj.email.toLocaleLowerCase());
        // formData.append('password', signupobj.password);
        formData.append('emp_companywebsite', signupobj.emp_companywebsite);
        formData.append('emp_companyname', signupobj.emp_companyname);
        formData.append('supportingdocuments', importFileInput);

        axios({
            method: 'post',
            url: serverbaselink + '/api/employersignup/',
            data: formData,
            headers: axiosheaders,
        })
            .then((response) => {
                console.log(response.data);
                if (response?.data?.status) {
                    cookies.set('coas12312efaasasdafasdas32131asdsadsadsaqweasdkjenfjenfk kern123!@_#!@3123', response.data.token);
                    fetchAuthorizationQueryContext.refetch();
                } else {
                    setaddeditbtndisabled(false);
                    NotificationManager.warning('', response?.data?.reason);
                }
            })
            .catch((error) => {
                setaddeditbtndisabled(false);
                NotificationManager.error('Error', 'Error');
            });
    };

    const [password, setpassword] = useState('');
    useEffect(() => {
        setpageactive_context('/users');
    }, []);

    return (
        <div class="row m-0 w-100 pt-3 pl-5 pr-5 pb-0 d-flex justify-content-center p-sm-3">
            <div class="col-lg-10 p-0 mt-5 ">
                <div class="row m-0 w-100">
                    <div class="col-lg-6 flex-column mb-4 pl-0 pr-2 p-md-0">
                        <p class="font-15 font-weight-500 mb-1">First Name </p>
                        <input
                            name="name"
                            type="name"
                            class={'inputfeild'}
                            value={signupobj.name}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, name: event.target.value });
                            }}
                        />
                    </div>
                    <div class="col-lg-6 flex-column mb-4 pl-0 pr-2 p-md-0">
                        <p class="font-15 font-weight-500 mb-1">Last Name </p>
                        <input
                            name="lname"
                            type="name"
                            class={'inputfeild'}
                            value={signupobj.lastname}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, lastname: event.target.value });
                            }}
                        />
                    </div>
                    {/* <div class="col-lg-12 flex-column mb-4 pl-0 pr-2 p-md-0">
                        <p class="font-15 font-weight-500 mb-1">Position Title </p>
                        <input
                            name="emp_positiontitle"
                            type="name"
                            class={'inputfeild'}
                            value={signupobj.emp_positiontitle}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, emp_positiontitle: event.target.value });
                            }}
                        />
                    </div> */}
                    <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                        <p class="font-15 font-weight-500 mb-1">Email</p>
                        <input
                            name="email"
                            type="email"
                            class={'inputfeild'}
                            value={signupobj.email}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, email: event.target.value });
                            }}
                        />
                    </div>
                    <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                        <p class="font-15 font-weight-500 mb-1">Company Name</p>
                        <input
                            name="name"
                            type="name"
                            class={'inputfeild'}
                            value={signupobj.emp_companyname}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, emp_companyname: event.target.value });
                            }}
                        />
                    </div>
                    <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                        <p class="font-15 font-weight-500 mb-1">Company Website</p>
                        <input
                            name="link"
                            type="link"
                            class={'inputfeild'}
                            value={signupobj.emp_companywebsite}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, emp_companywebsite: event.target.value });
                            }}
                        />
                    </div>
                    <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                        <p class="font-15 font-weight-500 mb-1"> Mobile </p>
                        <PhoneInput
                            defaultCountry="eg"
                            country={'eg'}
                            direction="ltr"
                            placeholder=""
                            enableSearch={true}
                            disableSearchIcon={true}
                            // id={index}
                            value={signupobj.phonenumber}
                            onChange={(value) => {
                                setsignupobj({ ...signupobj, phonenumber: value });
                            }}
                        />
                    </div>
                    {/* <div class="col-lg-12 p-0 pl-sm-2 pr-sm-2">
                        <p class="font-15 font-weight-500 mb-1">
                            Supporting document:{' '}
                            <span
                                style={{
                                    color: 'gray',
                                    fontSize: '11px',
                                }}
                            >
                                (tax ID card OR company registration OR business card)
                            </span>
                        </p>
                        <input
                            type="file"
                            accept="img"
                            style={{
                                maxHeight: '55px',
                            }}
                            class={'inputfeild mb-3 pb-3'}
                            onChange={(event) => {
                                setImportFileInput(event.target.files[0]);
                            }}
                            id="importinput"
                        />
                    </div> */}
                    {/* <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                        <p class="font-15 font-weight-500 mb-1"> Password </p>
                        <input
                            name="password"
                            type="password"
                            class={'inputfeild'}
                            value={signupobj.password}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, password: event.target.value });
                            }}
                        />
                    </div>
                    <div class="col-lg-12 flex-column mb-4 p-0 p-md-0">
                        <p class="font-15 font-weight-500 mb-1"> Confirm Password </p>
                        <input
                            name="confirmpassword"
                            type="password"
                            class={'inputfeild'}
                            value={signupobj.confirmpassword}
                            onChange={(event) => {
                                setsignupobj({ ...signupobj, confirmpassword: event.target.value });
                            }}
                        />
                    </div> */}

                    <div class="col-lg-12 p-0 flex-column mt-5 mt-0 p-md-0">
                        <button
                            onClick={() => {
                                var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

                                if (
                                    signupobj?.email?.length != 0 &&
                                    signupobj?.emp_companyname?.length != 0 &&
                                    signupobj?.emp_companywebsite?.length != 0 &&
                                    // signupobj.emp_positiontitle?.length != 0 &&
                                    signupobj?.lastname?.length != 0 &&
                                    signupobj?.name?.length != 0 &&
                                    // signupobj?.password?.length != 0 &&
                                    signupobj?.phonenumber?.length != 0
                                    // signupobj?.supportingdocuments?.length != 0
                                    // signupobj?.confirmpassword?.length != 0
                                ) {
                                    if (signupobj?.email.match(validRegex)) {
                                        if (signupobj.password != signupobj.confirmpassword) {
                                            NotificationManager.warning('', "Passwords Don't match");
                                        } else {
                                            Signupmutation();
                                        }
                                    } else {
                                        NotificationManager.warning('', 'Invalid email address!');
                                    }
                                } else {
                                    NotificationManager.warning('', 'Complete all missing fields');
                                }
                            }}
                            class={`${generalstyles.btn} ${generalstyles.btn_primary}` + ' font-15 allcentered '}
                            style={{
                                width: '100%',
                                height: 48,
                            }}
                            disabled={addeditbtndisabled}
                        >
                            {addeditbtndisabled && <CircularProgress color="white" width="20px" height="20px" duration="1s" />}
                            {!addeditbtndisabled && <span>Submit</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Signup;
