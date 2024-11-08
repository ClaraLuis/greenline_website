import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { VscCheck, VscEye, VscEyeClosed } from 'react-icons/vsc';
import copy from 'copy-to-clipboard';

// Icons
import API from '../../../API/API.js';
import Cookies from 'universal-cookie';
import { NotificationManager } from 'react-notifications';
import { BsCopy } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';

const { ValueContainer, Placeholder } = components;

const WebToken = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, useLazyQueryGQL, findOneMerchant, useMutationNoInputGQL, createMerchantToken } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [merchantPayload, setmerchantPayload] = useState({});

    const [copied, setcopied] = useState(false);
    const [show, setshow] = useState(false);

    useEffect(() => {
        setpageactive_context('/webtoken');
        setpagetitle_context('Merchant');
    }, []);
    const [findOneMerchantQuery] = useLazyQueryGQL(findOneMerchant());
    const fetchMerchatFun = async () => {
        try {
            var { data } = await findOneMerchantQuery({
                variables: {
                    id: parseInt(cookies.get('merchantId')),
                },
            });
            if (data?.findOneMerchant) {
                setmerchantPayload({
                    ...data?.findOneMerchant,
                });
            }
        } catch (e) {
            let errorMessage = 'An unexpected error occurred';
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                errorMessage = e.graphQLErrors[0].message || errorMessage;
            } else if (e.networkError) {
                errorMessage = e.networkError.message || errorMessage;
            } else if (e.message) {
                errorMessage = e.message;
            }
            NotificationManager.warning(errorMessage, 'Warning!');
        }
    };
    useEffect(async () => {
        fetchMerchatFun();
    }, []);
    const [createMerchantTokenMutation] = useMutationNoInputGQL(createMerchantToken(), { merchantId: parseInt(cookies.get('merchantId')) });

    const calculateDaysLeft = (expirationDate) => {
        const currentDate = new Date();
        const expiration = new Date(expirationDate);
        const timeDiff = expiration - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert from milliseconds to days
        return daysDiff;
    };
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-center mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-8 p-0 ">
                    <div class={' row m-0 w-100'}>
                        <div class={' col-lg-12 p-0 px-1 '}>
                            <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'}>
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                                    <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                                        <span style={{ color: 'var(--info)' }}> WebToken </span>
                                    </p>
                                </div>
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + ' d-flex align-items-center bg-info bg-infohover'}
                                        onClick={async () => {
                                            // history.push('/docs');
                                            window.open('/docs' + '_self');
                                        }}
                                    >
                                        <IoDocumentTextOutline class="mr-1" />
                                        Documentation
                                    </button>
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mx-1'}
                                        onClick={async () => {
                                            if (!buttonLoadingContext) {
                                                if (buttonLoadingContext) return;
                                                setbuttonLoadingContext(true);
                                                try {
                                                    const { data } = await createMerchantTokenMutation();

                                                    if (data?.createMerchantToken?.token) {
                                                        await fetchMerchatFun();

                                                        NotificationManager.success('', 'Success');
                                                    } else {
                                                        NotificationManager.warning(data?.createMerchantToken?.message, 'Warning!');
                                                    }
                                                } catch (error) {
                                                    let errorMessage = 'An unexpected error occurred';
                                                    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                        errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                    } else if (error.networkError) {
                                                        errorMessage = error.networkError.message || errorMessage;
                                                    } else if (error.message) {
                                                        errorMessage = error.message;
                                                    }
                                                    NotificationManager.warning(errorMessage, 'Warning!');
                                                }
                                                setbuttonLoadingContext(false);
                                            }
                                        }}
                                        disabled={buttonLoadingContext}
                                    >
                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}

                                        {!buttonLoadingContext && <span> {merchantPayload?.webToken ? 'Regenerate Token' : 'Generate Token'}</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class={' col-lg-12 p-0 px-1 '}>
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div style={{ background: '#f6f8fa', padding: '1rem' }} class="col-lg-12 d-flex justify-content-between wordbreak  ">
                                    <div class="row m-0 w-100 d-flex justify-content-between">
                                        <div className="wordbreak wordbreak1" style={{ overflow: 'hidden', width: '85%', lineHeight: 3 }}>
                                            {merchantPayload?.webToken ? (show ? merchantPayload?.webToken : '*'.repeat(merchantPayload.webToken.length)) : 'No token'}
                                        </div>

                                        {merchantPayload?.webToken && (
                                            <div class=" p-0">
                                                <div class="row m-0">
                                                    <div
                                                        onClick={() => {
                                                            copy(merchantPayload?.webToken);
                                                            setcopied(true);
                                                            setTimeout(() => {
                                                                setcopied(false);
                                                            }, 2500);
                                                        }}
                                                        style={{ width: '40px', height: '40px' }}
                                                        class="iconhover allcentered"
                                                    >
                                                        {!copied && <BsCopy size={20} />}
                                                        {copied && <VscCheck size={20} />}
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setshow(!show);
                                                        }}
                                                        style={{ width: '40px', height: '40px' }}
                                                        class="iconhover allcentered"
                                                    >
                                                        {!show && <VscEye size={20} />}
                                                        {show && <VscEyeClosed size={20} />}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {merchantPayload?.webTokenExpiration && (
                                    <>
                                        <div className="col-lg-12 d-flex justify-content-end mt-2">Expires in {calculateDaysLeft(merchantPayload?.webTokenExpiration)} Days</div>

                                        <div className="col-lg-12 d-flex justify-content-end mt-1" style={{ color: 'grey', fontSize: '12px' }}>
                                            {dateformatter(merchantPayload?.webTokenExpiration)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default WebToken;
