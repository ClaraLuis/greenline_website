import { Tab, Tabs } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import API from '../../../API/API';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import sidenavstyles from './sidenav.module.css';
import logo from '../Generalfiles/images/logo.png';
import Cookies from 'universal-cookie';

const Sidenav = (props) => {
    let history = useHistory();
    const { logout, login_API, UserChooseCurrentCompan_API } = API();
    const { pagesarray_context, setpageactive_context, pageactive_context, hidesidenav_context, chosenMerchantContext, value, setValue } = React.useContext(Contexthandlerscontext);
    const containerRef = useRef(null);
    const cookies = new Cookies();

    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const handleScroll = () => {
                setIsScrolling(true);
                var scrollTimeout = 4000;

                // Debounce the scroll event to prevent constant re-rendering
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    setIsScrolling(false);
                }, 4000);
            };

            containerRef.current.addEventListener('mousewheel', handleScroll);

            return () => {
                containerRef.current.removeEventListener('mousewheel', handleScroll);
            };
        }
    }, []);
    useEffect(() => {
        {
            pagesarray_context.map((item, index) => {
                if (item.isselected) {
                    setValue(index * 100);
                }
            });
        }
    }, [pageactive_context]);

    return (
        <div class={hidesidenav_context ? 'w-100 pt-0 mt-3' : 'w-100 pt-0'}>
            <div id="sidenavContainer">
                <div class="row m-0 w-100 ">
                    {!hidesidenav_context && (
                        <div class={`${sidenavstyles.sidenav__logo}` + ' cursor-pointer '}>
                            <img src={logo} />
                        </div>
                    )}

                    <div class="col-lg-12 p-0">
                        <div class="row m-0 d-flex w-100">
                            {/* <div
                                ref={containerRef}
                                style={{ height: '100vh', paddingBottom: '100px', overflow: isScrolling ? '' : 'hidden' }}
                                className={sidenavstyles.sidenavscroll + ' row m-0 w-100 '}
                            > */}
                            <SimpleBar style={{ maxHeight: '100vh', width: '100%', transition: 'all 0.4s' }}>
                                <ul
                                    style={{
                                        paddingBottom: '200px',
                                    }}
                                    class={hidesidenav_context ? sidenavstyles.vertical_nav_menu + ' w-100 p-0' : sidenavstyles.vertical_nav_menu + ' w-100'}
                                >
                                    {pagesarray_context.map((item, index) => {
                                        return (
                                            <div>
                                                {!hidesidenav_context && (
                                                    <li
                                                        onClick={() => {
                                                            if (item?.path) {
                                                                history.push(item?.path);
                                                            }
                                                        }}
                                                        style={{
                                                            cursor: item?.path ? 'pointer' : '',
                                                        }}
                                                        class={sidenavstyles.app_sidebar__heading + ' mt-1 '}
                                                    >
                                                        {item.maintitle} {item?.maintitle?.toLowerCase() == 'merchant' && chosenMerchantContext?.name ? `(${chosenMerchantContext?.name})` : ''}
                                                    </li>
                                                )}

                                                <div class="row m-0 w-100">
                                                    {item?.subitems?.map((subitem, index) => {
                                                        {
                                                            var activeclass = '';
                                                            if (subitem.isselected) {
                                                                activeclass = sidenavstyles.sidenav_active;
                                                            }
                                                            var show = true;
                                                            // alert(JSON.stringify(chosenMerchantContext?.length));
                                                            const cookies = new Cookies();
                                                            var merchantId = cookies.get('userInfo')?.merchantId ?? cookies.get('merchantId');
                                                            // alert(merchantId);
                                                            if (merchantId == 'null' && item?.maintitle?.toLowerCase() == 'merchant') {
                                                                show = false;
                                                            }
                                                            if (subitem?.show && show) {
                                                                return (
                                                                    <div class={'col-lg-12 col-md-12 col-sm-12 mb-1 pr-0'}>
                                                                        <a
                                                                            style={{ cursor: 'pointer' }}
                                                                            to={subitem.path}
                                                                            onClick={() => {
                                                                                history.push(subitem.path);
                                                                                setpageactive_context(subitem.path);
                                                                            }}
                                                                        >
                                                                            <li class={`${sidenavstyles.sidebar_item} ${activeclass}` + ' d-flex justify-content-start '}>
                                                                                {subitem?.icon?.length != 0 && (
                                                                                    <p
                                                                                        class={
                                                                                            hidesidenav_context
                                                                                                ? sidenavstyles.sidenav_icon_cont + ' m-0 p-0 mr-0 '
                                                                                                : sidenavstyles.sidenav_icon_cont + ' m-0 p-0 mr-3 '
                                                                                        }
                                                                                    >
                                                                                        {subitem.icon}
                                                                                    </p>
                                                                                )}
                                                                                {!hidesidenav_context && <p class={sidenavstyles.sidenav_page_name + ' p-0 m-0 '}>{subitem.name}</p>}
                                                                            </li>
                                                                        </a>
                                                                    </div>
                                                                );
                                                            }
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* <div class="col-lg-12">
                                        {' '}
                                        <div
                                            class=" pt-3 w-100 d-flex flex-row align-items-center text-danger text-secondaryhover"
                                            onClick={() => {
                                                const cookies = new Cookies();
                                                cookies.set('coas8866612efaasasdscjckkkkas32131asdsadsassjjscjjjeasd123!@_#!@3123', null);
                                                history.push('/login');
                                                fetchAuthorizationQueryContext.refetch();
                                            }}
                                            style={{ fontSize: '12.5px' }}
                                        >
                                            {!hidesidenav_context && 'Logout'}
                                        </div>
                                    </div> */}
                                </ul>
                            </SimpleBar>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row m-0 w-100 d-none d-md-flex">
                <div class={' col-lg-12 mb-3 p-0 '}>
                    <div class={'  '} style={{ overflow: 'hidden', width: '70%' }}>
                        <Tabs
                            sx={{
                                '& button': {
                                    fontFamily: 'Poppins',
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                    transition: '.3s',
                                },
                            }}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs example"
                        >
                            {pagesarray_context.map((item, index) => {
                                var activeclass = '';
                                if (item.isselected) {
                                    activeclass = sidenavstyles.sidenav_active;
                                }

                                return (
                                    <Tab
                                        icon={item.icon}
                                        label={item.name}
                                        onClick={() => {
                                            history.push(item.path);
                                            setpageactive_context(item.path);
                                        }}
                                    />
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidenav;
