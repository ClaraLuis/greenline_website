import React, { Component, useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../LanguageContext';
import { useHistory, useParams } from 'react-router-dom';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// import Pagepreloader from '../Pagepreloader';
// import { FetchAllSecuritylayers_API } from '../../API/SecurityLayers_API';
import API from '../../../API/API.js';

import { FaUserLock } from 'react-icons/fa';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';

const Securitylayers = () => {
    const { lang, langdetect } = React.useContext(LanguageContext);
    const history = useHistory();
    const queryClient = useQueryClient();
    const { FetchAllSecuritylayers_API } = API();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);

    const FetchInstitueSecurityLayersQuery = useQuery(['FetchAllSecuritylayers_API'], () => FetchAllSecuritylayers_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    useEffect(() => {
        setpageactive_context('/securitylayers');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Security layers
                    </p>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                            <span style={{ color: 'var(--info)' }}> {FetchInstitueSecurityLayersQuery?.data?.data?.data?.length} </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                            onClick={() => {
                                history.push('/addsecuritylayers/add/0');
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <div class="col-lg-12 p-0">
                        <hr class="mt-1" />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 p-0 table_responsive  scrollmenuclasssubscrollbar'}>
                        {FetchInstitueSecurityLayersQuery.isFetching && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {!FetchInstitueSecurityLayersQuery.isFetching && FetchInstitueSecurityLayersQuery.isSuccess && FetchInstitueSecurityLayersQuery.data.data.status && (
                            <div class="col-lg-12 p-0 w-100 row m-0 h-100">
                                {FetchInstitueSecurityLayersQuery.data.data.data.length == 0 && (
                                    <div class={' row w-100 m-0 p-0 text-center d-flex align-items-center w-100 text-light '} style={{ height: '70vh' }}>
                                        <div class="col-lg-12 text-center mb-3">
                                            <p class="m-0 p-0">
                                                <FaUserLock size={30} />
                                            </p>
                                            <p style={{ fontSize: '18px' }} class="m-0 p-0 text-capitalize">
                                                No security layers
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {FetchInstitueSecurityLayersQuery.data.data.data.map((item, index) => {
                                    return (
                                        <div class="col-lg-4 p-sm-0">
                                            <div class="w-100 row m-0">
                                                <div class="col-xl-12 col-lg-12 mb-3 pl-sm-1 pr-sm-1">
                                                    <div class={`${generalstyles.card} `} style={{ minHeight: '0px', boxShadow: '0px 1px 22px -12px #607D8B' }}>
                                                        <div class="row m-0 w-100">
                                                            <div class={'col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start'}>
                                                                <p class={' mb-0 text-overflow text-capitalize text-primary font-weight-600'} style={{ fontSize: '17px' }}>
                                                                    {item.name}
                                                                </p>
                                                            </div>
                                                            <div
                                                                style={{ fontSize: '12px' }}
                                                                class={'col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0 d-flex d-sm-none align-items-center justify-content-start'}
                                                            >
                                                                <p class={'mb-0 text-overflow text-capitalize text-light font-weight-500 font_13'}>
                                                                    <i class="fa fa-clock opacity-6"></i> {dateformatter(item.created_at)}
                                                                </p>
                                                            </div>
                                                            {/* <div class={'col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start'}>
                                                                <p class={'text-light text-overflow mb-0 font_15'}>
                                                                    <span>{lang.totalusers}:</span> <span class="font-weight-600">{item.userscount}</span>
                                                                </p>
                                                            </div> */}
                                                            {/* <div class={'col-sm-12 p-0 d-none d-sm-flex align-items-center justify-content-start'}>
                                                                <p class={'mb-0 text-overflow text-capitalize text-light font-weight-500 font_13'}>
                                                                    <i class="fa fa-clock opacity-6"></i> {lang.createdon}: {item.timestamp}
                                                                </p>
                                                            </div> */}
                                                            <div class="col-lg-12 col-md-12 col-sm-12 d-flex mt-3 align-items-center justify-content-center p-0">
                                                                <button
                                                                    style={{ height: '35px' }}
                                                                    class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                                                    onClick={() => {
                                                                        history.push('/addsecuritylayers/edit/' + item.id);
                                                                    }}
                                                                >
                                                                    {lang.edit}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Securitylayers;
