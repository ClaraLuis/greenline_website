import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BiShow, BiShowAlt } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import reviewsstyles from './reviews.module.css';
import Select, { components } from 'react-select';

// Icons
import API from '../../../API/API.js';
import HubInfo from './HubInfo.js';
import { FiPlus } from 'react-icons/fi';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { MdEmail, MdOutlinePhone } from 'react-icons/md';
import { CiUnlock } from 'react-icons/ci';

const { ValueContainer, Placeholder } = components;

const HubsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);

    const [payload, setpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: '',
        phone: '',
        email: '',
        birthdate: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    // const fetchHubsQuery = [];
    useEffect(() => {
        setpageactive_context('/users');
    }, []);

    return (
        <>
            {props?.fetchHubsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.fetchHubsQuery?.loading && props?.fetchHubsQuery?.data != undefined && (
                <>
                    {props?.fetchHubsQuery?.data?.paginateHubs?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Hubs
                                </div>
                            </div>
                        </div>
                    )}
                    {props?.fetchHubsQuery?.data?.length != 0 && (
                        <div class="row m-0 w-100">
                            {props?.fetchHubsQuery?.data?.paginateHubs?.data?.map((item, index) => {
                                return (
                                    <div className="col-lg-4 p-1">
                                        <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                            <div className="col-lg-6 p-0  text-capitalize mb-2">
                                                <span style={{ fontWeight: 700 }}>{item?.name}</span>
                                            </div>

                                            <div className="col-lg-6 p-0 mb-2 d-flex justify-content-end">
                                                <div
                                                    onClick={() => {
                                                        var temp = { ...item };
                                                        temp.functype = 'edit';
                                                        setpayload({ ...temp });
                                                        setopenModal(true);
                                                    }}
                                                    style={{
                                                        width: '35px',
                                                        height: '35px',
                                                    }}
                                                    className="iconhover allcentered"
                                                >
                                                    <BiShow style={{ transition: 'all 0.4s' }} size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* <Pagespaginatecomponent
                                totaldatacount={FetchUsers?.data?.data?.total}
                                numofitemsperpage={FetchUsers?.data?.data?.per_page}
                                pagenumbparams={FetchUsers?.data?.data?.current_page}
                                nextpagefunction={(nextpage) => {
                                    history.push({
                                        pathname: '/users',
                                        search: '&page=' + nextpage,
                                    });
                                }}
                            /> */}
                </>
            )}
            <HubInfo openModal={openModal} setopenModal={setopenModal} payload={payload} setpayload={setpayload} />
        </>
    );
};
export default HubsTable;
