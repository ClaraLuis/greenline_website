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

const Privacy = () => {
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
                                Welcome to Liftup! Protecting your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when
                                you use our dashboard. By using Liftup, you consent to the practices described in this Privacy Policy.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                1.Information We Collect:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                We collect both personally identifiable information (PII) and non-personally identifiable information (Non-PII) when you use our dashboard. This may include, but is not
                                limited to, your name, email address, IP address, and usage data.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                2.How We Use Your Information:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                We use the information we collect for various purposes, including providing and improving the dashboard, communicating with you, customizing content, and ensuring the
                                security of our services. We may also use your information for analytics and research to enhance user experience.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                3.Information Sharing and Disclosure:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. However, we may share your information with trusted third
                                parties who assist us in operating our dashboard, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                4.Cookies and Similar Technologies:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                We use cookies and similar technologies to enhance your experience on our dashboard. You can choose to disable cookies through your browser settings, but this may
                                affect the functionality of the dashboard.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                5.Security:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                We implement security measures to protect your information. However, please be aware that no method of transmission over the internet or electronic storage is entirely
                                secure. We cannot guarantee absolute security.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                6.Children's Privacy:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Our dashboard is not intended for individuals under the age of [age]. We do not knowingly collect personal information from children. If you are a parent or guardian
                                and believe that your child has provided us with personal information, please contact us, and we will take steps to remove that information from our systems.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                7.Links to Third-Party Websites:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                Our dashboard may contain links to third-party websites. We are not responsible for the privacy practices or the content of such websites. We encourage you to review
                                the privacy policies of these third-party sites.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                8.Changes to this Privacy Policy:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">
                                We reserve the right to update this Privacy Policy periodically. Any changes will be posted on this page, and the effective date will be revised accordingly. Continued
                                use of the dashboard after the effective date constitutes acceptance of the updated Privacy Policy.
                            </div>
                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                9.Contact Information:
                            </div>
                            <div class="col-lg-12 p-0 mb-2">If you have any questions or concerns about this Privacy Policy, please contact us at [contact email].</div>

                            <div class="col-lg-12 p-0">
                                Thank you for trusting Liftup with your information. We are committed to protecting your privacy and providing you with a secure and reliable experience.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Privacy;
