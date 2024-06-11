import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaEllipsisV } from 'react-icons/fa';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { IoMdClose } from 'react-icons/io';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import API from '../../../API/API.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import user from '../user.png';
import Cookies from 'universal-cookie';
import Pagination from '../../Pagination.js';

const { ValueContainer, Placeholder } = components;

const Merchants = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setchosenMerchantContext, chosenMerchantContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, addMerchant, fetchMerchants, fetchItemHistory, exportItem, importItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openMerchantModel, setopenMerchantModel] = useState(false);
    const [merchantPayload, setmerchantPayload] = useState({
        functype: 'add',
        name: '',
        includesVat: false,
    });
    const [addMerchantMutation] = useMutationGQL(addMerchant(), {
        name: merchantPayload?.name,
        includesVat: merchantPayload?.includesVat,
    });
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);
    const { refetch: refetchMerchants } = useQueryGQL('', fetchMerchants(), filterMerchants);

    const handleAddMerchant = async () => {
        try {
            const { data } = await addMerchantMutation();
            refetchMerchants();
            setopenMerchantModel(false);
            history.push('/governorates?merchantId=' + data?.createMerchant);
        } catch (error) {
            console.error('Error adding Merchant:', error);
        }
    };
    useEffect(() => {
        setpageactive_context('/merchants');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                {/* <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Merchants
                    </p>
                </div> */}

                <div class={' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start mb-3'}>
                        <p class=" p-0 m-0" style={{ fontSize: '23px' }}>
                            <span style={{ color: 'var(--info)' }}>Merchants </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-3 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                            <span
                                onClick={() => {
                                    // history.push('/hubitems');
                                    setopenMerchantModel(true);
                                }}
                                class={generalstyles.roundbutton}
                                // style={{ textDecoration: 'underline' }}
                            >
                                Add Merchant
                            </span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0 ">
                        {fetchMerchantsQuery?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchMerchantsQuery?.data?.paginateMerchants?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantsQuery?.data?.paginateMerchants?.cursor?.afterCursor}
                                filter={filterMerchants}
                                setfilter={setfilterMerchants}
                            />
                        </div>
                        <div style={{ minHeight: '60vh' }} class="row m-0 w-100 d-flex align-items-start align-content-start">
                            {fetchMerchantsQuery?.data?.paginateMerchants?.data?.map((item, index) => {
                                return (
                                    <div onClick={() => {}} style={{ fontSize: '13px' }} class=" col-lg-4 p-1 px-2 mb-2">
                                        <div
                                            style={{ backgroundColor: 'white', border: chosenMerchantContext?.id == item?.id ? '1px solid var(--success)' : '' }}
                                            class="row m-0 w-100 p-3 card d-flex align-items-center"
                                        >
                                            <div class="col-lg-6 p-0 mb-1 " style={{ fontSize: '15px' }}>
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <div style={{ width: '40px', height: '40px', marginInlineEnd: '10px' }}>
                                                        <img src={user} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                        {' '}
                                                        {item?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 p-0 mb-1 d-flex justify-content-end align-items-center">
                                                <Dropdown>
                                                    <Dropdown.Toggle>
                                                        <div
                                                            style={{
                                                                color: 'var(--primary)',
                                                                borderRadius: '10px',
                                                                transition: 'all 0.4s',
                                                            }}
                                                        >
                                                            <FaEllipsisV />
                                                        </div>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {/* <Dropdown.Item class="py-2">
                                                            <p
                                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                                onClick={() => {
                                                                    setchosenMerchantContext(item);
                                                                }}
                                                            >
                                                                Show Dashboard
                                                            </p>
                                                        </Dropdown.Item> */}
                                                        <Dropdown.Item class="py-2">
                                                            <p
                                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                                onClick={() => {
                                                                    history.push('/governorates?merchanId=' + item.id);
                                                                }}
                                                            >
                                                                Shipping Prices
                                                            </p>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item class="py-2">
                                                            <p
                                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                                onClick={() => {
                                                                    // history.push('/governorates?merchanId=' + item.id);
                                                                }}
                                                            >
                                                                Terminate Merchant
                                                            </p>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item class="py-2">
                                                            <p
                                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                                onClick={() => {
                                                                    setmerchantPayload({ ...item, functype: 'edit' });
                                                                    setopenMerchantModel(true);
                                                                }}
                                                            >
                                                                Edit Merchant
                                                            </p>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            {/* <div class="col-lg-12 p-0">
                                            <hr class="p-0 m-0 my-3" />
                                        </div> */}
                                            {/* <div class="col-lg-12 p-0 mt-2">
                                            <span>Name: </span>
                                        </div>
                                        <div class="col-lg-12 p-0">
                                            <hr class="p-0 m-0" />
                                        </div> */}
                                            <div class="col-lg-12 p-0 mt-3">
                                                <div class="row m-0 w-100 allcentered">
                                                    <button
                                                        onClick={() => {
                                                            // setchosenMerchantContext(item);
                                                            const cookies = new Cookies();
                                                            cookies.set('merchantId', item?.id);
                                                            // window.location.reload();
                                                        }}
                                                        style={{ minWidth: '200px', maxWidth: '200px', height: '35px' }}
                                                        class={generalstyles.roundbutton + ' p-1 px-3 allcentered'}
                                                    >
                                                        View Dashboard
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={openMerchantModel}
                onHide={() => {
                    setopenMerchantModel(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">{merchantPayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Merchant</div>}</div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenMerchantModel(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-12">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Name</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={merchantPayload.name}
                                        onChange={(event) => {
                                            setmerchantPayload({ ...merchantPayload, name: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-12 p-0 d-flex justify-content-start my-2">
                            <div className="row m-0 w-100 d-flex justify-content-start">
                                <label className={`${formstyles.switch} mx-2 my-0`}>
                                    <input
                                        type="checkbox"
                                        checked={merchantPayload?.includesVat}
                                        onChange={() => {
                                            setmerchantPayload({ ...merchantPayload, includesVat: !merchantPayload.includesVat });
                                        }}
                                    />
                                    <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                </label>
                                <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>Includes VAT</p>
                            </div>
                        </div>
                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1'}
                                onClick={() => {
                                    if (merchantPayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        handleAddMerchant();
                                    }
                                }}
                            >
                                Add Merchant
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Merchants;
