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
    const { setpageactive_context, inventoryRentTypeContext, chosenMerchantContext, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, addMerchant, fetchMerchants, fetchItemHistory, exportItem, createInventoryRent, updateInventoryRent } = API();

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
        startDate: new Date().toISOString().split('T')[0],
    });

    const [addMerchantMutation] = useMutationGQL(addMerchant(), {
        name: merchantPayload?.name,
        includesVat: merchantPayload?.includesVat,
    });
    const [createInventoryRentMutation] = useMutationGQL(createInventoryRent(), {
        startDate: inventorySettings?.startDate,
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        type: inventorySettings?.type,
        sqaureMeter: inventorySettings?.sqaureMeter,
        merchantId: inventorySettings?.merchantId,
    });

    const [updateInventoryRentMutation] = useMutationGQL(updateInventoryRent(), {
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        squareMeter: inventorySettings?.sqaureMeter,
        merchantId: inventorySettings?.merchantId,
    });

    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const { refetch: refetchMerchants } = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const [search, setSearch] = useState('');

    const handleAddMerchant = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
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
        setbuttonLoadingContext(false);
    };
    useEffect(() => {
        setpageactive_context('/merchants');
        setpagetitle_context('Merchant');
    }, []);
    const formatDate = (isoDate) => {
        return isoDate.split('T')[0];
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' row m-0 w-100 '}>
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' row m-0 w-100 my-2 p-2 px-2'}>
                            <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start '}>
                                <p class=" p-0 m-0" style={{ fontSize: '23px' }}>
                                    <span style={{ color: 'var(--info)' }}>Merchants </span>
                                </p>
                            </div>
                            <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end  px-2 '}>
                                <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                                    <span
                                        onClick={() => {
                                            if (isAuth([87, 1, 52])) {
                                                history.push('/addmerchant' + '?type=add' + '&step=0');
                                            } else {
                                                NotificationManager.warning('Not Authorized', 'Warning');
                                            }
                                        }}
                                        class={generalstyles.roundbutton}
                                        // style={{ textDecoration: 'underline' }}
                                    >
                                        Add Merchant
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 p-0 ">
                        {fetchMerchantsQuery?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        <div class="col-lg-12 px-3">
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
                                                style={{ height: '35px', marginInlineStart: '5px' }}
                                                class={generalstyles.roundbutton + '  allcentered bg-primary-light'}
                                            >
                                                search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isAuth([1, 52, 91]) && (
                            <>
                                {' '}
                                <div class="col-lg-12 mb-2 p-0">
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
                                            <div onClick={() => {}} style={{ fontSize: '13px' }} class=" col-lg-4">
                                                <div
                                                    style={{ backgroundColor: 'white', border: chosenMerchantContext?.id == item?.id ? '1px solid var(--success)' : '' }}
                                                    class={generalstyles.card + ' row m-0 w-100 p-3  d-flex align-items-center'}
                                                >
                                                    <div class="col-lg-8 p-0 mb-1 ">
                                                        <div class="row m-0 w-100 d-flex align-items-center">
                                                            <div style={{ width: '30px', height: '30px', marginInlineEnd: '10px' }}>
                                                                <img src={user} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                            <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                                {' '}
                                                                {item?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4 p-0 mb-1 d-flex justify-content-end align-items-center">
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
                                                                {isAuth([1, 52, 88]) && (
                                                                    <Dropdown.Item
                                                                        class="py-2"
                                                                        onClick={() => {
                                                                            setinventoryModal(true);
                                                                            setinventorySettings({
                                                                                ...item?.inventoryRent,
                                                                                merchantId: item?.id,
                                                                                functype: item?.inventoryRent == null ? 'add' : 'edit',
                                                                                inInventory: item?.inventoryRent == null ? false : true,
                                                                                startDate: item.inventoryRent == null ? new Date().toISOString().split('T')[0] : item?.inventoryRent?.startDate,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Inventory Rent</p>
                                                                    </Dropdown.Item>
                                                                )}
                                                                {isAuth([1, 52, 84]) && (
                                                                    <Dropdown.Item
                                                                        class="py-2"
                                                                        onClick={() => {
                                                                            history.push('/inventorysettings?merchantId=' + item.id);
                                                                        }}
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>View Inventory</p>
                                                                    </Dropdown.Item>
                                                                )}
                                                                {isAuth([1, 52, 89]) && (
                                                                    <Dropdown.Item
                                                                        class="py-2"
                                                                        onClick={() => {
                                                                            history.push('/updateshipping?merchantId=' + item.id + '&n=' + item?.name);
                                                                        }}
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Shipping Prices</p>
                                                                    </Dropdown.Item>
                                                                )}
                                                                {isAuth([1, 52, 90]) && (
                                                                    <Dropdown.Item
                                                                        class="py-2"
                                                                        onClick={() => {
                                                                            // history.push('/governorates?merchantId=' + item.id);
                                                                        }}
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Terminate Merchant</p>
                                                                    </Dropdown.Item>
                                                                )}
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
                            </>
                        )}
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
                                disabled={buttonLoadingContext}
                                onClick={() => {
                                    if (merchantPayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        handleAddMerchant();
                                    }
                                }}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>Add Merchant</span>}
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
                        {/* <div class="col-lg-12 p-0 mb-2">
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
                        </div> */}
                        {/* {inventorySettings?.inInventory && ( */}
                        <div class={' row m-0 w-100'}>
                            <div class={'col-lg-12 mb-3'}>
                                <label for="name" class={formstyles.form__label}>
                                    Rent Type
                                </label>
                                <Select
                                    isDisabled={inventorySettings?.functype == 'edit'}
                                    options={inventoryRentTypeContext}
                                    styles={defaultstyles}
                                    value={inventoryRentTypeContext.filter((option) => option.value == inventorySettings?.type)}
                                    onChange={(option) => {
                                        setinventorySettings({ ...inventorySettings, type: option.value });
                                    }}
                                />
                            </div>
                            <div class="col-lg-12">
                                <div class="row m-0 w-100  ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label class={formstyles.form__label}>Start Date</label>
                                        <input
                                            disabled={inventorySettings?.functype == 'edit'}
                                            type={'date'}
                                            class={formstyles.form__field}
                                            value={inventorySettings.startDate ? formatDate(inventorySettings.startDate) : ''}
                                            onChange={(event) => {
                                                setinventorySettings({ ...inventorySettings, startDate: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-12">
                                <div class="row m-0 w-100  ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label class={formstyles.form__label}>Currency</label>
                                        <Select
                                            options={[
                                                { label: 'EGP', value: 'EGP' },
                                                { label: 'USD', value: 'USD' },
                                            ]}
                                            styles={defaultstyles}
                                            defaultValue={inventorySettings.currency}
                                            onChange={(option) => {
                                                setinventorySettings({ ...inventorySettings, currency: option.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {inventorySettings?.type == 'meter' && (
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Sqaure Meter</label>
                                            <input
                                                type={'number'}
                                                class={formstyles.form__field}
                                                value={inventorySettings.sqaureMeter}
                                                onChange={(event) => {
                                                    setinventorySettings({ ...inventorySettings, sqaureMeter: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div class="col-lg-12">
                                <div class="row m-0 w-100  ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label class={formstyles.form__label}>
                                            {inventorySettings?.type === 'item'
                                                ? 'Price Per Item'
                                                : inventorySettings?.type == 'order'
                                                ? 'Price Per Order'
                                                : inventorySettings?.type == 'meter'
                                                ? 'Price Per Meter'
                                                : 'Price Per Unit Per Month'}
                                        </label>
                                        <input
                                            type={'number'}
                                            step="any"
                                            class={formstyles.form__field}
                                            value={inventorySettings.pricePerUnit}
                                            onChange={(event) => {
                                                setinventorySettings({ ...inventorySettings, pricePerUnit: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class={'col-lg-12 d-flex justify-content-center mt-5'}>
                                <button
                                    disabled={buttonLoadingContext}
                                    class={generalstyles.roundbutton + ' allcentered'}
                                    onClick={async () => {
                                        if (buttonLoadingContext) return;
                                        setbuttonLoadingContext(true);
                                        try {
                                            if (
                                                inventorySettings?.type &&
                                                inventorySettings?.type?.length != 0 &&
                                                inventorySettings?.startDate &&
                                                inventorySettings?.startDate?.length != 0 &&
                                                inventorySettings?.merchantId &&
                                                inventorySettings?.merchantId?.length != 0 &&
                                                inventorySettings?.currency &&
                                                inventorySettings?.currency?.length != 0 &&
                                                inventorySettings?.pricePerUnit &&
                                                inventorySettings?.pricePerUnit?.length != 0
                                            ) {
                                                if (inventorySettings?.functype == 'add') {
                                                    const { data } = await createInventoryRentMutation();
                                                    refetchMerchants();
                                                    setinventoryModal(false);
                                                } else if (inventorySettings?.functype == 'edit') {
                                                    const { data } = await updateInventoryRentMutation();
                                                    refetchMerchants();
                                                    setinventoryModal(false);
                                                }
                                                NotificationManager.success('', 'Success');
                                            } else {
                                                NotificationManager.warning('Please Complete all fields', 'Warning');
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
                                            console.error('Error adding Merchant:', error);
                                        }
                                        setbuttonLoadingContext(false);
                                    }}
                                    style={{ padding: '0px' }}
                                >
                                    {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                    {!buttonLoadingContext && <span>{inventorySettings?.functype == 'add' ? 'Add' : 'Edit'}</span>}
                                </button>
                            </div>
                        </div>
                        {/* )} */}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Merchants;
