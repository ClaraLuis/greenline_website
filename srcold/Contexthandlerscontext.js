import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaRegBuilding, FaRegHandshake, FaUserLock } from 'react-icons/fa';
import { FiPhoneCall, FiUsers } from 'react-icons/fi';

import { MdOutlineMeetingRoom, MdOutlinePersonSearch } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';

import { BsFillMegaphoneFill, BsGraphUp, BsShare } from 'react-icons/bs';
import { HiOutlineArrowsRightLeft } from 'react-icons/hi2';
import { useMutation, useQuery } from 'react-query';
import API from './API/API';

import { useHistory } from 'react-router-dom';
import { LiaUsersSolid } from 'react-icons/lia';
import { IoChatbubblesOutline } from 'react-icons/io5';

import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import { BiHomeAlt } from 'react-icons/bi';
export const Contexthandlerscontext = React.createContext();
export const Contexthandlerscontext_provider = (props) => {
    let history = useHistory();
    const { fetchuseauthorization, Checkauth_API, Login_API, FetchPhases_API } = API();
    const [hidesidenav_context, sethidesidenav_context] = useState(false);
    const [scroll, setScroll] = useState(false);
    const cookies = new Cookies();
    const [openloginmodalcontext, setopenloginmodalcontext] = useState(true);
    const [allcachedproductscontext, setallcachedproductscontext] = useState([]);
    const fetchAuthorizationQueryContext = useQuery(['Checkauth_API'], () => Checkauth_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchPhases = useQuery(['FetchPhases_API' + JSON.stringify(filterobj)], () => FetchPhases_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const LoginmutationContext = useMutation('Login_API', {
        mutationFn: Login_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                NotificationManager.success('Login Success', 'Success');
                cookies.set('coas8866612efaasasdscjckkkkas32131asdsadsassjjscjjjeasd123!@_#!@3123', data.data.access);
                fetchAuthorizationQueryContext.refetch();
                window.open(window.location.origin + '/leads', '_self');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    const [pagesarray_context, setpagesarray_context] = useState([]);
    const [chosencompany, setchosencompany] = useState(false);

    const [pagetitle_context, setpagetitle_context] = useState('');
    const [value, setValue] = useState(0);

    const [filterLeadscontext, setfilterLeadscontext] = useState({
        page: 1,
        search: '',
        phase_id: 'all',
        group_id: 'all',
        platform: 'all',
        meta_campaign_id: 'all',
        meta_adset_id: 'all',
        meta_ad_id: 'all',
        company_id: 'all',
        from_date: 'all',
        to_date: 'all',
    });
    const setpageactive_context = (route) => {
        var temparr = [...pagesarray_context];
        temparr?.forEach((sideelement, index) => {
            sideelement?.subitems?.forEach((subsideelement, index) => {
                if (subsideelement?.path == route) {
                    subsideelement['isselected'] = true;
                } else {
                    subsideelement['isselected'] = false;
                }
            });
        });
        setpagesarray_context([...temparr]);
    };
    const dateformatter = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', hour12: true };
        return new Date(date).toLocaleDateString(undefined, options);
    };
    const isshowuserpage = (page) => {
        var show = false;
        if (
            fetchAuthorizationQueryContext?.data?.data?.currentcompanyusertype == 'companyowner' ||
            fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'adminuser' ||
            fetchAuthorizationQueryContext?.data?.data?.userinfo?.user_profile?.usertype == 'liftupadmin'
        ) {
            show = true;
        } else {
            fetchAuthorizationQueryContext?.data?.data?.permissions?.map((item, index) => {
                if (item?.permission?.permissiontype == 'Page') {
                    if (item?.permission?.name == page) {
                        show = true;
                    }
                }
            });
        }
        return show;
    };
    useEffect(() => {
        if (FetchPhases?.isSuccess && !FetchPhases?.isFetching) {
            var pagesarr = [
                {
                    maintitle: 'Dashboard',
                    subitems: [
                        // {
                        //     name: 'Home',
                        //     isselected: false,
                        //     icon: (
                        //         <i class={'allcentered'}>
                        //             <BiHomeAlt size={18} />
                        //         </i>
                        //     ),
                        //     path: '/home',
                        //     // permissionpage: 'Show Leads Page',
                        //     show: true,
                        // },
                        {
                            name: 'Leads',
                            isselected: true,
                            icon: (
                                <i class={'allcentered'}>
                                    <MdOutlinePersonSearch size={18} />
                                </i>
                            ),
                            path: '/leads',
                            permissionpage: 'Show Leads Page',

                            show: isshowuserpage('Show Leads Page'),
                        },
                    ],
                },

                {
                    maintitle: 'Reports',
                    subitems: [
                        {
                            name: 'Campaign Analytics',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BsGraphUp size={18} />
                                </i>
                            ),
                            path: '/analytics',
                            permissionpage: 'Show Analyitcs Page',

                            show: isshowuserpage('Show Analyitcs Page'),
                        },
                        {
                            name: 'Phases Analytics',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <HiOutlineArrowsRightLeft size={18} />
                                </i>
                            ),
                            path: '/phasesanalytics',
                            permissionpage: 'Show Analyitcs Page',

                            show: isshowuserpage('Show Analyitcs Page'),
                        },
                        {
                            name: 'Sales Analytics',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <FaMoneyBillWave size={18} />
                                </i>
                            ),
                            path: '/salesanalytics',
                            permissionpage: 'Show Analyitcs Page',

                            show: isshowuserpage('Show Analyitcs Page'),
                        },
                        {
                            name: 'Users Analytics',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <LiaUsersSolid size={22} />
                                </i>
                            ),
                            path: '/useranalytics',
                            permissionpage: 'Show Analyitcs Page',

                            show: isshowuserpage('Show Analyitcs Page'),
                        },
                    ],
                },
                {
                    maintitle: 'Actions',
                    subitems: [
                        {
                            name: 'Campaigns',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BsFillMegaphoneFill size={18} />
                                </i>
                            ),
                            path: '/campaigns',
                            permissionpage: 'Show Campaigns Page',
                            show: isshowuserpage('Show Campaigns Page'),
                        },
                        {
                            name: 'Calls',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <FiPhoneCall size={18} />
                                </i>
                            ),
                            path: '/calls',
                            permissionpage: 'Calls Page',

                            show: isshowuserpage('Calls Page'),
                        },
                        {
                            name: 'Meetings',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <MdOutlineMeetingRoom size={18} />
                                </i>
                            ),
                            path: '/encounters?type=meeting',
                            permissionpage: 'Meetings Page',
                            show: isshowuserpage('Meetings Page'),
                        },
                        {
                            name: 'Followups',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <IoChatbubblesOutline size={18} />
                                </i>
                            ),
                            path: '/encounters?type=followup',
                            permissionpage: 'Follow-up Page',
                            show: isshowuserpage('Follow-up Page'),
                        },
                        {
                            name: 'Deals',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <FaRegHandshake size={18} />
                                </i>
                            ),
                            path: '/deals',
                            permissionpage: 'Deals Page',
                            show: isshowuserpage('Deals Page'),
                        },
                    ],
                },
                {
                    maintitle: 'Settings',
                    subitems: [
                        {
                            name: 'Phases',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <BsShare size={18} />
                                </i>
                            ),
                            path: '/phases',
                            permissionpage: 'Show Phases Page',
                            show: isshowuserpage('Show Phases Page'),
                        },
                        {
                            name: 'Leads Groups',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <HiOutlineUserGroup size={18} />
                                </i>
                            ),
                            path: '/groups',
                            permissionpage: 'Groups page',
                            show: isshowuserpage('Groups page'),
                        },
                        {
                            name: 'Companies',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <FaRegBuilding size={18} />
                                </i>
                            ),
                            path: '/companies',
                            permissionpage: 'Show Companies Page',
                            show: isshowuserpage('Show Companies Page'),
                        },

                        {
                            name: 'Users',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <FiUsers size={18} />
                                </i>
                            ),
                            path: '/users',
                            permissionpage: 'Show Users Page',
                            show: isshowuserpage('Show Users Page'),
                        },
                        {
                            name: 'Security Layers',
                            isselected: false,
                            icon: (
                                <i class={'allcentered'}>
                                    <FaUserLock size={18} />
                                </i>
                            ),
                            path: '/securitylayers',
                            permissionpage: 'Show Security Layers Page',
                            show: isshowuserpage('Show Security Layers Page'),
                        },
                    ],
                },
            ];
            // FetchPhases?.data?.data?.data?.map((item, index) => {
            //     pagesarr[0].subitems.push({
            //         name: (
            //             <span class=" text-capitalize d-flex align-items-center">
            //                 <span
            //                     class="mx-2 px-1"
            //                     style={{
            //                         background: 'var(--primary)',
            //                         color: 'white',
            //                         borderRadius: '3px',
            //                         fontSize: '9px',
            //                         opacity: parseInt(filterLeadscontext.phase_id) == parseInt(item.id) ? '1' : '0.75',
            //                         transition: 'all 0.4s',
            //                     }}
            //                 >
            //                     {item?.leads_count}
            //                 </span>
            //                 {item?.name}{' '}
            //             </span>
            //         ),
            //         isselected: parseInt(filterLeadscontext.phase_id) == parseInt(item.id) ? true : false,
            //         icon: '',
            //         path: '/leads?phaseid=' + item?.id,
            //         show: isshowuserpage('Show Leads Page'),
            //     });
            // });
            var temp = [];
            pagesarr?.map((i, ii) => {
                var exist = false;
                i.subitems?.map((item, index) => {
                    if (item?.show) {
                        exist = true;
                    }
                });
                if (exist) {
                    temp.push(i);
                }
            });

            setpagesarray_context([...temp]);
        }
    }, [fetchAuthorizationQueryContext?.isSuccess, fetchAuthorizationQueryContext?.data, FetchPhases?.isSuccess, FetchPhases?.data, filterLeadscontext]);

    return (
        <Contexthandlerscontext.Provider
            value={{
                filterLeadscontext,
                setfilterLeadscontext,
                chosencompany,
                setchosencompany,
                pagesarray_context,
                setpagesarray_context,
                pagetitle_context,
                setpagetitle_context,
                setpageactive_context,
                hidesidenav_context,
                sethidesidenav_context,
                openloginmodalcontext,
                setopenloginmodalcontext,
                fetchAuthorizationQueryContext,
                allcachedproductscontext,
                setallcachedproductscontext,
                scroll,
                setScroll,
                dateformatter,
                LoginmutationContext,
                value,
                setValue,
            }}
        >
            {props.children}
        </Contexthandlerscontext.Provider>
    );
};
