import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { FaEllipsisV, FaLayerGroup } from 'react-icons/fa';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import MultiSelect from '../../MultiSelect.js';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Dropdown } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { Modal } from 'react-bootstrap';
import { DateRangePicker } from 'rsuite';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { TbEdit, TbTrash, TbTruckDelivery } from 'react-icons/tb';
import Cookies from 'universal-cookie';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { IoMdClose, IoMdTime } from 'react-icons/io';
import Decimal from 'decimal.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import InventorySelectComponent from '../../selectComponents/InventorySelectComponent.js';

const InventoryRent = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, inventoryRentTypeContext, returnPackageTypeContext, dateformatter, buttonLoadingContext, setbuttonLoadingContext, setchosenPackageContext } =
        useContext(Contexthandlerscontext);
    const {
        useMutationGQL,
        fetchMerchants,
        useLazyQueryGQL,
        paginateInventoryRentTransaction,
        paginateInventoryRents,
        useQueryGQL,
        fetchInventories,
        updateInventoryRent,
        useMutationNoInputGQL,
        removeInventoryRent,
    } = API();
    const { lang, langdetect } = useContext(LanguageContext);
    const [cartItems, setcartItems] = useState([]);
    const [transactionsModal, settransactionsModal] = useState(false);
    const [inventoryModal, setinventoryModal] = useState(false);

    const cookies = new Cookies();
    const [inventorySettings, setinventorySettings] = useState({
        inInventory: '',
        type: '',
        price: '',
        startDate: new Date().toISOString().split('T')[0],
    });

    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        userId: '',
    });
    const [fetchSenttTransactionsQuery, setfetchSenttTransactionsQuery] = useState([]);

    const [filterSentTransactionsObj, setfilterSentTransactionsObj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const [fetchSenttTransactionsLazyQuery] = useLazyQueryGQL(paginateInventoryRentTransaction());

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assigned: undefined,
    });

    const paginateInventoryRentsQuery = useQueryGQL('', paginateInventoryRents(), filter);

    const [updateInventoryRentMutation] = useMutationGQL(updateInventoryRent(), {
        pricePerUnit: inventorySettings?.pricePerUnit,
        currency: inventorySettings?.currency,
        squareMeter: inventorySettings?.sqaureMeter,
        merchantId: inventorySettings?.merchantId,
    });

    const [removeInventoryRentMutation] = useMutationGQL(removeInventoryRent(), {
        id: inventorySettings?.id,
    });
    useEffect(() => {
        setpageactive_context('/inventoryrent');
        setpagetitle_context('Warehouses');
    }, []);
    useEffect(async () => {
        try {
            var { data } = await fetchSenttTransactionsLazyQuery({
                variables: { input: { ...filterSentTransactionsObj } },
            });
            setfetchSenttTransactionsQuery({ data: data });
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
    }, [filterSentTransactionsObj]);

    const formatDate = (isoDate) => {
        return isoDate.split('T')[0];
    };
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-12'}>
                    <div class="row m-0 w-100">
                        <div class={generalstyles.card + ' mb-3 col-lg-12 p-2'}>
                            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                    <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
                                                </div>
                                                <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                    <AccordionItemState>
                                                        {(state) => {
                                                            if (state.expanded == true) {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronUp />
                                                                    </i>
                                                                );
                                                            } else {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronDown />
                                                                    </i>
                                                                );
                                                            }
                                                        }}
                                                    </AccordionItemState>
                                                </div>
                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        <hr className="mt-2 mb-3" />
                                        <div class="row m-0 w-100">
                                            {!cookies.get('userInfo')?.merchantId && (
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <MerchantSelectComponent
                                                        type="multi"
                                                        label={'name'}
                                                        value={'id'}
                                                        selected={filter?.merchantIds}
                                                        onClick={(option) => {
                                                            const tempArray = [...(filter?.merchantIds ?? [])];

                                                            if (option === 'All') {
                                                                setfilter({ ...filter, merchantIds: undefined });
                                                            } else {
                                                                const index = tempArray.indexOf(option?.id);
                                                                if (index === -1) {
                                                                    tempArray.push(option?.id);
                                                                } else {
                                                                    tempArray.splice(index, 1);
                                                                }
                                                                setfilter({ ...filter, merchantIds: tempArray.length ? tempArray : undefined });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {!cookies.get('userInfo')?.inventoryId && (
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <InventorySelectComponent
                                                        type="multi"
                                                        label={'name'}
                                                        value={'id'}
                                                        selected={filter?.inventoryIds}
                                                        onClick={(option) => {
                                                            const tempArray = [...(filter?.inventoryIds ?? [])];

                                                            if (option === 'All') {
                                                                setfilter({ ...filter, inventoryIds: undefined });
                                                            } else {
                                                                const index = tempArray.indexOf(option?.id);
                                                                if (index === -1) {
                                                                    tempArray.push(option?.id);
                                                                } else {
                                                                    tempArray.splice(index, 1);
                                                                }
                                                                setfilter({ ...filter, inventoryIds: tempArray.length ? tempArray : undefined });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={paginateInventoryRentsQuery?.data?.paginateInventoryRents?.cursor?.beforeCursor}
                                afterCursor={paginateInventoryRentsQuery?.data?.paginateInventoryRents?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                        {paginateInventoryRentsQuery?.data?.paginateInventoryRents?.data?.length == 0 && (
                            <div style={{ height: '70vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                                <div class="row m-0 w-100">
                                    <FaLayerGroup size={40} class=" col-lg-12" />
                                    <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                        No Inventory Rents
                                    </div>
                                </div>
                            </div>
                        )}
                        {paginateInventoryRentsQuery?.data?.paginateInventoryRents?.data?.map((item, index) => {
                            var selected = false;
                            packagepayload?.ids?.map((packageitem) => {
                                if (packageitem == item.id) {
                                    selected = true;
                                }
                            });
                            return (
                                <div
                                    onClick={async () => {
                                        try {
                                            var { data } = await fetchSenttTransactionsLazyQuery({
                                                variables: { input: { ...filterSentTransactionsObj, merchantIds: [parseInt(item?.merchantId)] } },
                                            });
                                            setfetchSenttTransactionsQuery({ data: data });
                                            setinventorySettings({ ...item });
                                            settransactionsModal(true);
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
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    className="col-lg-6 "
                                >
                                    <div
                                        style={{ background: selected ? 'var(--secondary)' : 'white', transition: 'all 0.4s', cursor: 'pointer' }}
                                        class={generalstyles.card + ' p-3 row  w-100   d-flex align-items-center'}
                                    >
                                        <div className="col-lg-4 p-0">
                                            <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                # {item?.id}, {item?.merchant?.name}
                                            </span>
                                        </div>
                                        <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                            <div class="row m-0 w-100 d-fex justify-content-end align-items-center">
                                                <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered mx-1 text-capitalize '}>
                                                    {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setinventorySettings({ ...item });
                                                        setinventoryModal(true);
                                                    }}
                                                    style={{ width: '30px', height: '30px' }}
                                                    class="iconhover allcentered"
                                                >
                                                    <TbEdit />
                                                </div>
                                                <div
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await setinventorySettings({ ...item });
                                                        if (window.confirm('Are you sure you want to delete this inventory rent?')) {
                                                            if (buttonLoadingContext) return;
                                                            setbuttonLoadingContext(true);
                                                            try {
                                                                const { data } = await removeInventoryRentMutation();
                                                                if (data?.removeInventoryRent?.success == true) {
                                                                    NotificationManager.success('Success!', '');
                                                                    paginateInventoryRentsQuery.refetch();
                                                                } else {
                                                                    NotificationManager.warning(data?.removeInventoryRent?.message, 'Warning!');
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
                                                                console.error('Error adding Inventory Rent:', error);
                                                            }
                                                            setbuttonLoadingContext(false);
                                                        }
                                                    }}
                                                    style={{ width: '30px', height: '30px' }}
                                                    class="iconhover allcentered text-danger"
                                                >
                                                    <TbTrash />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 p-0 my-2">
                                            <hr className="m-0" />
                                        </div>
                                        <div class="col-lg-12 p-0 mb-2">
                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                {/* <div class="col-lg-12 p-0 d-flex">
                                                    <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                        {dateformatter(item?.startDate)}
                                                    </span>
                                                </div> */}
                                                {!item?.lastBillTransaction && !item?.lastBill && (
                                                    <div class="col-lg-12 p-0 d-flex">
                                                        <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                            {'No bills issued yet.'}
                                                        </span>
                                                    </div>
                                                )}
                                                {item?.lastBill && (
                                                    <div class="col-lg-12 p-0 d-flex">
                                                        <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                            {dateformatter(item?.lastBill)}
                                                        </span>
                                                    </div>
                                                )}
                                                {item?.lastBillTransaction && (
                                                    <div class="col-lg-12 p-0 d-flex">
                                                        <div class="row m-0 w-100 " style={{ border: '1px solid #eee' }}>
                                                            <div className="col-lg-4 p-0">
                                                                <span style={{ fontSize: '12px', color: 'grey' }} class="mr-1">
                                                                    # {item?.lastBillTransaction?.id}
                                                                </span>
                                                            </div>
                                                            <div className="col-lg-8 p-0 d-flex justify-content-end align-items-center">
                                                                <div class="row m-0 w-100 d-fex justify-content-end align-items-center">
                                                                    <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered mx-1 text-capitalize '}>
                                                                        {item?.lastBillTransaction?.status?.split(/(?=[A-Z])/).join(' ')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 p-0 my-2">
                                                                <hr className="m-0" />
                                                            </div>
                                                            <div class="col-lg-12 p-0 mb-2">
                                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                                    <div class="col-lg-6 p-0 d-flex">
                                                                        <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                                            {item?.lastBillTransaction?.amount} {item?.lastBillTransaction?.currency} /{' '}
                                                                        </span>
                                                                    </div>
                                                                    <div class="col-lg-6 p-0 d-flex justify-content-end">
                                                                        <span style={{ fontSize: '12px', color: 'grey' }} class="text-capitalize">
                                                                            {dateformatter(item?.lastBillTransaction?.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div class="col-lg-6 p-0 d-flex">
                                                    <span style={{ fontWeight: 600, fontSize: '13px' }} class="text-capitalize">
                                                        {item?.pricePerUnit} {item?.currency} /{' '}
                                                        {item?.type == 'order'
                                                            ? 'order'
                                                            : item?.type == 'item'
                                                            ? 'import'
                                                            : item?.type == 'box'
                                                            ? 'inventory box'
                                                            : item?.type == 'rack'
                                                            ? 'inventory rack'
                                                            : item?.type == 'pallet'
                                                            ? 'pallet'
                                                            : item?.type == 'inventory'
                                                            ? 'warehouse unit'
                                                            : 'month'}
                                                    </span>
                                                </div>
                                                <div class="col-lg-6 p-0 d-flex justify-content-end">
                                                    <span style={{ fontSize: '12px', color: 'grey' }} class="text-capitalize">
                                                        {dateformatter(item?.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={paginateInventoryRentsQuery?.data?.paginateInventoryRents?.cursor?.beforeCursor}
                                afterCursor={paginateInventoryRentsQuery?.data?.paginateInventoryRents?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                    </div>
                </div>
            </div>
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
                                            value={[
                                                { label: 'EGP', value: 'EGP' },
                                                { label: 'USD', value: 'USD' },
                                            ].filter((option) => option.value == inventorySettings.currency)}
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
                                                const { data } = await updateInventoryRentMutation();
                                                paginateInventoryRentsQuery.refetch();
                                                setinventoryModal(false);
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
                                    {!buttonLoadingContext && <span>{'Edit'}</span>}
                                </button>
                            </div>
                        </div>
                        {/* )} */}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={transactionsModal}
                onHide={() => {
                    settransactionsModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 "></div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    settransactionsModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <>
                            <div class="col-lg-4 mb-md-2">
                                <span>Date Range</span>
                                <div class="mt-1" style={{ width: '100%' }}>
                                    <DateRangePicker
                                        onChange={(event) => {
                                            if (event != null) {
                                                setfilterSentTransactionsObj({
                                                    ...filterSentTransactionsObj,
                                                    startDate: event[0],
                                                    endDate: event[1],
                                                });
                                            }
                                        }}
                                        onClean={() => {
                                            setfilterSentTransactionsObj({
                                                ...filterSentTransactionsObj,
                                                startDate: null,
                                                endDate: null,
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            {fetchSenttTransactionsQuery.data?.paginateInventoryRentTransaction?.data?.length == 0 && (
                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            {props?.srctype == 'expenses' ? 'No Expenses' : 'No Transactions'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {fetchSenttTransactionsQuery.data?.paginateInventoryRentTransaction?.data?.length != 0 && (
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            beforeCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.beforeCursor}
                                            afterCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.afterCursor}
                                            filter={filterSentTransactionsObj}
                                            setfilter={setfilterSentTransactionsObj}
                                        />
                                    </div>
                                    {fetchSenttTransactionsQuery.data?.paginateInventoryRentTransaction?.data?.map((item, index) => {
                                        return (
                                            <div style={{ fontSize: '13px', position: 'relative', padding: 'auto' }} className={'col-lg-6'}>
                                                <div class={generalstyles.card + ' p-2 px-3 row m-0 w-100 allcentered'}>
                                                    <div className="col-lg-3 p-0">
                                                        <span style={{ fontWeight: 700, fontSize: '16px' }} class=" d-flex align-items-center">
                                                            {/* <FaMoneyBill class="mr-1" /> */}
                                                            {new Decimal(item?.quantity ?? 0).times(inventorySettings?.pricePerUnit ?? 0).toFixed(2)}
                                                            {inventorySettings?.currency}
                                                        </span>
                                                    </div>

                                                    <div className="col-lg-9 p-0 d-flex justify-content-end align-items-center">
                                                        <div class="row m-0 w-100 d-flex justify-content-end align-items-center">
                                                            <div style={{ color: 'white' }} className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}>
                                                                {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-12 p-0 mt-2">
                                                        <div class="row m-0 w-100 justify-content-end">
                                                            <div className="col-lg-12 p-0 mb-1 d-flex justify-content-end">
                                                                <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                                                    <IoMdTime class="mr-1" />
                                                                    {dateformatter(item?.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            beforeCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.beforeCursor}
                                            afterCursor={fetchSenttTransactionsQuery?.data?.paginateInventoryRentTransaction?.cursor?.afterCursor}
                                            filter={filterSentTransactionsObj}
                                            setfilter={setfilterSentTransactionsObj}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default InventoryRent;
