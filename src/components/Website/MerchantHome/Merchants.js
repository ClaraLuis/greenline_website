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
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';

const { ValueContainer, Placeholder } = components;

const Merchants = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, inventoryRentTypeContext, chosenMerchantContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, addMerchant, fetchMerchants, fetchItemHistory, exportItem, importItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openMerchantModel, setopenMerchantModel] = useState(false);
    const [inventoryModal, setinventoryModal] = useState(false);
    const [submit, setsubmit] = useState(false);
    const [merchantPayload, setmerchantPayload] = useState({
        functype: 'add',
        name: '',
        includesVat: false,
    });
    const [inventorySettings, setinventorySettings] = useState({
        inInventory: '',
        type: '',
        price: '',
    });

    const [addMerchantMutation] = useMutationGQL(addMerchant(), {
        name: merchantPayload?.name,
        includesVat: merchantPayload?.includesVat,
    });
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);
    const { refetch: refetchMerchants } = useQueryGQL('', fetchMerchants(), filterMerchants);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [search, setSearch] = useState('');

    const handleAddMerchant = async () => {
        setbuttonLoading(true);
        try {
            const { data } = await addMerchantMutation();
            refetchMerchants();
            setopenMerchantModel(false);
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
            console.error('Error adding Merchant:', error);
        }
        setbuttonLoading(false);
    };
    useEffect(() => {
        setpageactive_context('/merchants');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
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
                                    // setopenMerchantModel(true);
                                    history.push('/addmerchant' + '?type=add' + '&step=0');
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
                        <div class={generalstyles.card + ' row m-0 w-100 my-2 p-2 px-2'}>
                            <div class="col-lg-12 p-0 ">
                                <div class="row m-0 w-100 d-flex align-items-center">
                                    <div class="col-lg-10">
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <input
                                                class={formstyles.form__field}
                                                value={search}
                                                placeholder={'Search by name'}
                                                onChange={(event) => {
                                                    setSearch(event.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-lg-2 allcenered">
                                        <button
                                            onClick={() => {
                                                setfilterMerchants({ ...filterMerchants, name: search?.length == 0 ? undefined : search });
                                            }}
                                            style={{ height: '25px', minWidth: 'fit-content', marginInlineStart: '5px' }}
                                            class={generalstyles.roundbutton + '  allcentered'}
                                        >
                                            search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                            <div class="col-lg-6 p-0 mb-1 ">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <div style={{ width: '30px', height: '30px', marginInlineEnd: '10px' }}>
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
                                                        <Dropdown.Item
                                                            class="py-2"
                                                            onClick={() => {
                                                                setinventoryModal(true);
                                                            }}
                                                        >
                                                            <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Inventory Settings</p>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            class="py-2"
                                                            onClick={() => {
                                                                history.push('/updateshipping?merchantId=' + item.id);
                                                            }}
                                                        >
                                                            <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Shipping Prices</p>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            class="py-2"
                                                            onClick={() => {
                                                                // history.push('/governorates?merchantId=' + item.id);
                                                            }}
                                                        >
                                                            <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Terminate Merchant</p>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <div class="col-lg-12 p-0 mt-3">
                                                <div class="row m-0 w-100 allcentered">
                                                    <button
                                                        onClick={() => {
                                                            // setchosenMerchantContext(item);
                                                            // const cookies = new Cookies();
                                                            // cookies.set('merchantId', item?.id);
                                                            // window.location.reload();
                                                            history.push('/updatemerchant?merchantId=' + item.id);
                                                        }}
                                                        style={{ minWidth: '200px', maxWidth: '200px', height: '35px' }}
                                                        class={generalstyles.roundbutton + ' p-1 px-3 allcentered'}
                                                    >
                                                        View
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
                                disabled={buttonLoading}
                                onClick={() => {
                                    if (merchantPayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        handleAddMerchant();
                                    }
                                }}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>Add Merchant</span>}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={inventoryModal}
                onHide={() => {
                    setinventoryModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 "></div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setinventoryModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-12 p-0 mb-2">
                            <div class="row m-0 w-100">
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                                    <p class=" p-0 m-0" style={{ fontSize: '20px' }}>
                                        Inventory Settings
                                    </p>
                                </div>
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}>
                                    <div className="row m-0  d-flex justify-content-start">
                                        <label className={`${formstyles.switch} mx-2 my-0`}>
                                            <input
                                                type="checkbox"
                                                checked={inventorySettings?.inInventory}
                                                onChange={() => {
                                                    setinventorySettings({ ...inventorySettings, inInventory: !inventorySettings.inInventory });
                                                }}
                                            />
                                            <span className={`${formstyles.slider} ${formstyles.round}`}></span>
                                        </label>
                                        <p className={`${generalstyles.checkbox_label} mb-0 text-focus text-capitalize cursor-pointer font_14 ml-1 mr-1 wordbreak`}>In Inventory</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {inventorySettings?.inInventory && (
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    { name: 'Inventory Type', attr: 'type', type: 'select', options: inventoryRentTypeContext, size: '12' },
                                    { name: 'Price', attr: 'price', type: 'number', size: '12' },
                                ]}
                                payload={inventorySettings}
                                setpayload={setinventorySettings}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={'Save'}
                                button1onClick={() => {
                                    // handleAddCourierSheet();
                                }}
                            />
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Merchants;
