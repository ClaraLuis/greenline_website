import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { useHistory } from 'react-router-dom';
import API from '../../../API/API.js';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import '../Generalfiles/CSS_GENERAL/Phonenumberinput.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import loginstyles from './login.module.css';

const Termsofuse = () => {
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, LoginmutationContext } = useContext(Contexthandlerscontext);
    useEffect(() => {
        setpagetitle_context('login');
        setpageactive_context('/login');
        document.title = 'Dashboard';
    }, []);

    const [email, setemail] = useState('');

    const [password, setpassword] = useState('');
    useEffect(() => {
        setpageactive_context('/users');
    }, []);

    return (
        <div class="row m-0 w-100 d-flex allcentered mt-md-0 pt-5 p-md-0">
            <div class="col-lg-12 p-0 allcentered mt-5 ">
                <div
                    onClick={() => {
                        history.push('/home');
                    }}
                    style={{ cursor: 'pointer' }}
                    class={loginstyles.logo + ' p-0 '}
                >
                    <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </div>
            <div class="col-lg-7 p-0">
                <div class="row m-0 w-100 p-5 d-flex justify-content-center p-sm-3">
                    <div class="col-lg-9 p-0 ">
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-3">
                                Welcome to Liftup! These Terms of Use ("Terms") govern your access to and use of Liftup (the "Dashboard"). By accessing or using the Dashboard, you agree to comply with
                                and be bound by these Terms. If you do not agree with these Terms, please do not use the Dashboard.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                1.Acceptance of Terms:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">By using the Dashboard, you acknowledge that you have read, understood, and agree to be bound by these Terms.</div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                2.User Eligibility:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                You must be [age] years or older to use the Dashboard. By using the Dashboard, you represent and warrant that you meet this age requirement.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                3.User Accounts:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                You are responsible for maintaining the confidentiality of your account credentials. Any activities that occur under your account are your responsibility. Notify us
                                immediately of any unauthorized use or security breach of your account.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                4.User Responsibilities:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Users must use the Dashboard for lawful purposes only. Prohibited activities include, but are not limited to, unauthorized access, data manipulation, and any form of
                                misuse of the Dashboard.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                5.Privacy Policy:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Your use of the Dashboard is also governed by our Privacy Policy, available at [link to privacy policy]. By using the Dashboard, you consent to the terms of our Privacy
                                Policy.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                6.Intellectual Property:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                All content on the Dashboard, unless otherwise stated, is the property of Liftup. Users retain ownership of their content but grant Liftup a license to use, display,
                                and distribute said content as necessary for the Dashboard's functionality.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                7.Prohibited Activities:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Users are prohibited from engaging in activities that may harm the security, integrity, or availability of the Dashboard, or that violate any applicable laws or
                                regulations.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                8.Content Standards:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Users are expected to adhere to community standards and legal requirements when generating content on the Dashboard. Liftup reserves the right to remove any content
                                that violates these standards.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                9.Security:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Users must not attempt to interfere with the security of the Dashboard or any associated systems. Any suspected security vulnerabilities should be reported to [contact
                                email].
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                10.Termination of Accounts:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">Liftup reserves the right to terminate accounts for violations of these Terms, inactivity, or any other reason deemed necessary.</div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                11.Disclaimer of Warranty:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                The Dashboard is provided "as is" and without any warranties. Liftup makes no warranties regarding the accuracy, completeness, or reliability of the Dashboard.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                12.Limitation of Liability:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Liftup is not liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of the Dashboard.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                13.Updates to Terms:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Liftup may update these Terms from time to time. Users will be notified of any changes, and continued use of the Dashboard after such changes constitutes acceptance of
                                the updated Terms.
                            </div>
                            <div class="col-lg-12 p-0">Thank you for using Liftup!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Termsofuse;
