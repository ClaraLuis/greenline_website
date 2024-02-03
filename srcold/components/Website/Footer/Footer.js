import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../../LanguageContext';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

import { Link } from 'react-router-dom';
import footerstyles from './footer.module.css';
import logo from '../Generalfiles/images/logo.png';
const Footer = (props) => {
    const [footer, setfooter] = useState([
        { title: 'Users/Jobseekers', innerpages: ['Companies', 'Reviews', 'Salaries', 'Interviews', 'Salary Calculator', 'Rewards', 'Campus Placements', 'Practice Test', 'Compare Companies'] },
        { title: 'Employers', innerpages: ['Create a new company', 'Update company information', 'Respond to reviews', 'Invite employees to review', 'Employer Branding Kit'] },
        {
            title: 'CorridorTalks Awards',
            innerpages: ['CorridorTalks Best Places to Work 2024', 'CorridorTalks Best Places to Work 2022', 'CorridorTalks Best Places to Work 2021', 'Invite employees to rate'],
        },
        { title: 'CorridorTalks', innerpages: ['About Us', 'Email Us', 'Blog', 'FAQ'] },
        { title: 'Support', innerpages: ['Privacy', 'Grievances', 'Terms of Use', 'Summons/Notices', 'Community Guidelines', 'Give Feedback'] },
    ]);
    const [buttons, setbuttons] = useState([{ title: 'Contribute', button: ['Write Company Review', 'Write Interview Advice'] }]);

    return (
        <div id="footer" class={' row m-0 w-100 justify-content-center  justify-content-md-start '}>
            <div id="footer" class={footerstyles.footercontainer + ' row m-0 w-100 justify-content-center justify-content-md-start pl-md-3 pr-md-3 pt-md-5 p-sm-0 '}>
                <div class="col-lg-12 p-0 mb-4">
                    <div class="row m-0 w-100">
                        <div class="col-lg-9 col-md-12 p-0" style={{ borderInlineEnd: '1px solid lightgrey' }}>
                            <div class="row m-0 w-100 pl-5 p-md-0">
                                <div class="col-lg-6 col-md-6 col-sm-12 pl-4 pt-0 ">
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-12 p-0 mb-3">
                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                <img src={'https://static.ambitionbox.com/static/logo.svg'} style={{ width: '30px', height: '30px' }} class="mr-2" />
                                                <p style={{ fontSize: '20px', fontWeight: 600 }} class="p-0 m-0">
                                                    CorridorTalks
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0 mb-3">
                                            <div>Helping over 85 Lakh job seekers every month in choosing their right fit company</div>
                                        </div>
                                        <div class="col-lg-12 p-0">
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-3 col-sm-3  p-0">
                                                    <div style={{ fontWeight: 600 }}>48 Lakh+</div>
                                                    <div style={{ fontSize: '14px' }}>Reviews</div>
                                                </div>
                                                <div class="col-lg-3 col-sm-3 p-0">
                                                    <div style={{ fontWeight: 600 }}>2 Crore+</div>
                                                    <div style={{ fontSize: '14px' }}>Salaries</div>
                                                </div>
                                                <div class="col-lg-3 col-sm-3 p-0">
                                                    <div style={{ fontWeight: 600 }}>5 Lakh+</div>
                                                    <div style={{ fontSize: '14px' }}>Interviews</div>
                                                </div>
                                                <div class="col-lg-3 col-sm-3 p-0">
                                                    <div style={{ fontWeight: 600 }}>85 Lakh+</div>
                                                    <div style={{ fontSize: '14px' }}>Users/Month</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-12 pl-3">
                            {buttons.map((item, index) => {
                                return (
                                    <div
                                        class=" col-md-12 col-sm-12 m-sm-0 p-sm-0 d-flex align-items-start align-items-sm-center mb-md-2 "
                                        style={{ width: 'max-content', flexDirection: 'column', paddingInline: '1.5vw' }}
                                    >
                                        <div class=" m-0 d-flex align-items-start " style={{ flexDirection: 'column' }}>
                                            <div class=" p-0 d-flex justify-content-start">
                                                <p class={footerstyles.footertilte + '  p-0 d-flex align-items-start  '}>{item.title}</p>
                                            </div>
                                            <div class=" d-md-none">
                                                {item.button.map((button, buttonindex) => {
                                                    return (
                                                        <div class=" p-0 d-flex justify-content-start">
                                                            <button
                                                                class={generalstyles.roundbutton + ' mb-2 text-secondaryhover '}
                                                                style={{ backgroundColor: 'transparent', color: 'var(--primary)' }}
                                                            >
                                                                {button}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div class="d-none d-md-flex row w-100 ">
                                                {item.button.map((button, buttonindex) => {
                                                    return (
                                                        <div class=" p-0 d-flex justify-content-start">
                                                            <button class={generalstyles.roundbutton + ' mb-2 '} style={{ backgroundColor: 'transparent', color: 'var(--primary)' }}>
                                                                {button}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {footer.map((item, index) => {
                    return (
                        <div class=" col-md-6 col-sm-12 m-sm-0 d-flex align-items-start align-items-sm-start  " style={{ width: 'max-content', flexDirection: 'column', paddingInline: '1.5vw' }}>
                            <div class=" m-0 d-flex align-items-start " style={{ flexDirection: 'column' }}>
                                <div class=" p-0 d-flex justify-content-start">
                                    <p class={footerstyles.footertilte + '  p-0 d-flex align-items-start  '}>{item.title}</p>
                                </div>
                                {item.innerpages.map((innerpage, innerpageindex) => {
                                    return (
                                        <div class=" p-0 d-flex justify-content-start">
                                            <p class={footerstyles.footertxt + '  p-0 d-flex align-items-start  '}>{innerpage}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            {index == footer.length - 1 && (
                                <>
                                    <div class=" p-0 d-flex justify-content-start">
                                        <p class={footerstyles.footertilte + '   '}>{' Get CorridorTalks app'}</p>
                                    </div>
                                    <div class=" p-0 d-flex justify-content-start">
                                        <div style={{ width: '121px', height: '36px', cursor: 'pointer' }}>
                                            <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={'	https://static.ambitionbox.com/static/app-play-icon.png'} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Footer;
