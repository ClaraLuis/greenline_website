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
import logo1 from '../Generalfiles/images/logo1.png';
import Cookies from 'universal-cookie';

const Sidenav = (props) => {
    let history = useHistory();
    const { logout, login_API, UserChooseCurrentCompan_API } = API();
    const {
        pagesarray_context,
        setpageactive_context,
        pageactive_context,
        hidesidenav_context,
        sethidesidenav_context,
        chosenMerchantContext,
        value,
        setValue,
        setpagetitle_context,
        pagetitle_context,
    } = React.useContext(Contexthandlerscontext);
    const containerRef = useRef(null);
    const cookies = new Cookies();

    const [isScrolling, setIsScrolling] = useState(false);
    function useWindowWidth() {
        const [width, setWidth] = useState(window.innerWidth);
        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
        return width;
    }
    const width = useWindowWidth();
    const isSmallScreen = width < 768;
    useEffect(() => {
        if (containerRef.current) {
            const handleScroll = () => {
                setIsScrolling(true);
                var scrollTimeout = 4000;

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
            <ul
                // style={{
                //     paddingBottom: '200px',
                // }}
                class={hidesidenav_context ? sidenavstyles.vertical_nav_menu + ' w-100 p-0' : sidenavstyles.vertical_nav_menu + '  w-100'}
            >
                <div class="col-lg-12 p-0">
                    <div style={{ minHeight: '100vh' }} class="row m-0 w-100">
                        <div
                            class={hidesidenav_context ? 'col-lg-12 h-100' : 'col-lg-3 col-md-3 h-100'}
                            style={{ borderInlineEnd: hidesidenav_context ? '' : '1px solid rgba(40, 146, 253, .2)', minHeight: '100vh', transition: 'width 0.4s ease' }}
                        >
                            <div class="row m-0 w-100">
                                <div
                                    onClick={() => {
                                        if (isSmallScreen) {
                                            sethidesidenav_context(true);
                                        }
                                    }}
                                    class="col-lg-12 allcentered py-2 px-0 "
                                >
                                    <div
                                        style={{
                                            width: hidesidenav_context ? '50px' : '50px',
                                            transition: 'width 0.4s ease',
                                        }}
                                    >
                                        <img
                                            src={logo1}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                transition: 'all 0.4s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                                {pagesarray_context.map((item, index) => {
                                    {
                                        var activeclass = '';
                                        if (pagetitle_context == item.maintitle) {
                                            activeclass = sidenavstyles.sidenav_active;
                                        }

                                        return (
                                            <div class={'col-lg-12 col-md-12 col-sm-12 mb-1 allcentered p-0'}>
                                                <a
                                                    style={{ cursor: 'pointer' }}
                                                    to={item.path}
                                                    onClick={() => {
                                                        sethidesidenav_context(false);
                                                        setpagetitle_context(item.maintitle);
                                                    }}
                                                >
                                                    <li class={`${sidenavstyles.sidebar_item} ${activeclass}` + ' d-flex justify-content-start '}>
                                                        {item?.icon?.length != 0 && (
                                                            <p
                                                                class={
                                                                    hidesidenav_context
                                                                        ? sidenavstyles.sidenav_icon_cont + ' m-0 p-0 mr-0 text-primary  '
                                                                        : sidenavstyles.sidenav_icon_cont + ' m-0 p-0 mr-0 text-primary '
                                                                }
                                                            >
                                                                {item.icon}
                                                            </p>
                                                        )}
                                                    </li>
                                                </a>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                        <div class="col-lg-9 col-md-9 pt-3">
                            <div class="row m-0 w-100">
                                <div
                                    class="col-lg-12 mb-2 "
                                    style={{
                                        color: '#6c757d',
                                        fontSize: '11px',
                                        padding: '7px',
                                    }}
                                >
                                    {pagetitle_context}
                                </div>
                                {pagesarray_context
                                    ?.filter((e) => e.maintitle == pagetitle_context)[0]
                                    ?.subitems?.map((subitem, index) => {
                                        {
                                            var activeclass = '';
                                            if (subitem.isselected) {
                                                activeclass = sidenavstyles.sidenav_active;
                                            }
                                            var show = true;
                                            const cookies = new Cookies();
                                            var merchantId = cookies.get('userInfo')?.merchantId ?? cookies.get('merchantId');
                                            if (merchantId == 'null' && item?.maintitle?.toLowerCase() == 'merchant') {
                                                show = false;
                                            }
                                            if (subitem?.show && show) {
                                                return (
                                                    <div class={'col-lg-12 col-md-12 col-sm-12 mb-1 p-0'}>
                                                        <a
                                                            style={{ cursor: 'pointer' }}
                                                            to={subitem.path}
                                                            onClick={() => {
                                                                if (isSmallScreen) {
                                                                    sethidesidenav_context(true);
                                                                }
                                                                history.push(subitem.path);
                                                                setpageactive_context(subitem.path);
                                                            }}
                                                        >
                                                            <li class={`${sidenavstyles.sidebar_item} ${activeclass} ` + ' d-flex justify-content-start '}>
                                                                {!hidesidenav_context && <p class={sidenavstyles.sidenav_page_name + ' p-2 m-0 text-primary '}>{subitem.name}</p>}
                                                            </li>
                                                        </a>
                                                    </div>
                                                );
                                            }
                                        }
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </ul>
        </div>
    );
};

export default Sidenav;
