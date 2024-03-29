import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import Select, { components } from 'react-select';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import API from '../../../API/API.js';
import ItemInfo from './ItemInfo.js';
import OrderInfo from './OrderInfo.js';
import { IoMdClose } from 'react-icons/io';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { MdArrowBackIos, MdArrowForwardIos, MdOutlineArrowBack, MdOutlineArrowForward } from 'react-icons/md';
import ImportNewItem from './ImportNewItem.js';

const { ValueContainer, Placeholder } = components;

const InventoryItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, inventoryTypesContext, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchInventories, useMutationGQL, addInventory, fetchItemsInBox, fetchRacks, importNew, fetchItemHistory, exportItem, importItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [openInventoryModal, setopenInventoryModal] = useState(false);
    const [importpayload, setimportpayload] = useState({
        id: '',
        count: '',
        type: '',
    });
    const [importmodal, setimportmodal] = useState({ open: false, type: '' });
    const [chosenitem, setchosenitem] = useState('');
    const [importItemModel, setimportItemModel] = useState(false);
    const [importItemPayload, setimportItemPayload] = useState({
        itemSku: 'item.e',
        ownedByOneMerchant: true,
        ballotId: '',
        inventoryId: '',
        boxName: '',
        count: 0,
        minCount: 0,
    });

    const [inventoryPayload, setinventoryPayload] = useState({
        functype: 'add',
        rentType: '',
        location: { long: 0, lat: 0 },
        numberOfRacks: 0,
        rackLevel: 0,
        ballotPerRack: 0,
        boxPerBallot: 0,
        inventoryPrices: [],
    });
    const [inventoryPricePayload, setinventoryPricePayload] = useState({
        currency: '',
        pricePerUnit: '',
        discount: null,
    });

    const [filter, setfilter] = useState({
        limit: 50,
        invetoryIds: [],
    });

    const [filterInventories, setfilterInventories] = useState({
        limit: 5,
        afterCursor: null,
        beforeCursor: null,
    });

    const [addInvrntoryMutation] = useMutationGQL(addInventory(), {
        name: inventoryPayload?.name,
        rentType: inventoryPayload?.rentType,
        location: { long: inventoryPayload?.long, lat: inventoryPayload?.lat },
        numberOfRacks: parseInt(inventoryPayload?.numberOfRacks),
        rackLevel: parseInt(inventoryPayload?.rackLevel),
        ballotPerRack: parseInt(inventoryPayload?.ballotPerRack),
        boxPerBallot: parseInt(inventoryPayload?.boxPerBallot),
        inventoryPrices: inventoryPayload?.inventoryPrices,
    });

    const [importMutation] = useMutationGQL(importItem(), {
        id: chosenitem?.id,
        count: parseInt(importpayload?.count),
    });
    const [exportMutation] = useMutationGQL(exportItem(), {
        id: chosenitem?.id,
        count: parseInt(importpayload?.count),
        type: importpayload?.type,
    });

    const { refetch: refetchInventories } = useQueryGQL('', fetchInventories());

    const handleAddInventory = async () => {
        try {
            const { data } = await addInvrntoryMutation();
            // setop(false);
            refetchInventories();
            setopenInventoryModal(false);
            // console.log(data); // Handle response
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };
    const fetchinventories = useQueryGQL('', fetchInventories(filterInventories));
    const fetchItemsInBoxQuery = useQueryGQL('', fetchItemsInBox());
    const { refetch: reetchfetchItemsInBox } = useQueryGQL('', fetchItemsInBox());

    const fetchRacksQuery = useQueryGQL('', fetchRacks(filter));
    const fetchItemHistoryQuery = useQueryGQL('', fetchItemHistory(parseInt(chosenitem?.id)));

    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/inventoryitems');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Inventories
                    </p>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Inventories </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-2 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                            <span
                                onClick={() => {
                                    // history.push('/hubitems');
                                    setopenInventoryModal(true);
                                }}
                                class="text-primary text-secondaryhover"
                                style={{ textDecoration: 'underline' }}
                            >
                                Add Inventory
                            </span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0 ">
                        {fetchinventories?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        <div style={{ width: '100px', overflowY: 'scroll', flexDirection: 'row', flexWrap: 'nowrap' }} class=" scrollmenuclasssubscrollbar row m-0 w-100">
                            <div class="d-flex align-items-center ">
                                {fetchinventories?.data?.paginateInventories?.cursor?.beforeCursor != null && (
                                    <div
                                        onClick={() => {
                                            setfilterInventories({ ...filterInventories, beforeCursor: fetchinventories?.data?.paginateInventories?.cursor?.beforeCursor, afterCursor: null });
                                        }}
                                        class={'text-secondaryhover'}
                                    >
                                        <MdArrowBackIos />
                                    </div>
                                )}
                            </div>

                            {fetchinventories?.data?.paginateInventories?.data?.map((item, index) => {
                                return (
                                    <div style={{ fontSize: '13px' }} class="card col-lg-2">
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-12 p-0 mb-1 " style={{ fontSize: '15px' }}>
                                                #{item?.id}
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <hr class="p-0 m-0" />
                                            </div>
                                            <div class="col-lg-12 p-0 mt-2">
                                                <span>Name: </span>
                                                <span style={{ fontWeight: 600 }}> {item?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div class="d-flex align-items-center justify-content-end ">
                                {fetchinventories?.data?.paginateInventories?.cursor?.afterCursor != null && (
                                    <div
                                        onClick={() => {
                                            setfilterInventories({ ...filterInventories, afterCursor: fetchinventories?.data?.paginateInventories?.cursor?.afterCursor, beforeCursor: null });
                                        }}
                                        class={'text-secondaryhover'}
                                    >
                                        <MdArrowForwardIos />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 p-2 mb-2'}>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-start mb-2 px-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Items </span>
                        </p>
                    </div>
                    <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-2 px-2 '}>
                        <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                            <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                                <span
                                    onClick={() => {
                                        history.push('/hubitems');
                                    }}
                                    class="text-primary text-secondaryhover mx-2"
                                    style={{ textDecoration: 'underline' }}
                                >
                                    View all
                                </span>
                            </p>
                            <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                                <span
                                    onClick={() => {
                                        setimportItemPayload({
                                            itemSku: 'item.e',
                                            ownedByOneMerchant: true,
                                            ballotId: '',
                                            inventoryId: '',
                                            boxName: '',
                                            count: 0,
                                            minCount: 0,
                                        });
                                        setimportItemModel(true);
                                    }}
                                    class="text-primary text-secondaryhover"
                                    style={{ textDecoration: 'underline' }}
                                >
                                    Import new item
                                </span>
                            </p>
                        </div>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        {fetchItemsInBoxQuery?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                    </div>
                    {fetchItemsInBoxQuery?.data?.paginateItemInBox?.data?.map((element, arrayindex) => {
                        return (
                            <div style={{ fontSize: '13px' }} class=" col-lg-4 p-2 mb-1">
                                <div class="row m-0 w-100 card">
                                    <div class=" mr-2" style={{ width: '50px', height: '50px', borderRadius: '5px' }}>
                                        <img
                                            src={
                                                element?.item?.imageUrl?.length != 0 && element?.item?.imageUrl != null
                                                    ? element?.item?.imageUrl
                                                    : 'https://www.shutterstock.com/image-vector/new-label-shopping-icon-vector-260nw-1894227709.jpg'
                                            }
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    </div>
                                    <div class="col-lg-9 p-0 mb-1 mt-0 " style={{ fontSize: '15px' }}>
                                        <div class="row m-0 w-100">
                                            <div style={{ fontSize: '11px' }} class="col-lg-12 p-0 mt-1 d-flex justify-content-end">
                                                <span
                                                    onClick={() => {
                                                        setchosenitem(element);
                                                        // setopenModal(true);
                                                        setimportpayload({
                                                            id: '',
                                                            count: '',
                                                            type: '',
                                                        });
                                                        setimportmodal({ open: true, type: 'import' });
                                                    }}
                                                    class="text-primary text-secondaryhover mr-2"
                                                    style={{ textDecoration: 'underline' }}
                                                >
                                                    import
                                                </span>
                                                <span
                                                    onClick={() => {
                                                        setchosenitem(element);
                                                        setimportpayload({
                                                            id: '',
                                                            count: '',
                                                            type: '',
                                                        });
                                                        setimportmodal({ open: true, type: 'export' });
                                                    }}
                                                    class="text-danger text-dangerhover"
                                                    style={{ textDecoration: 'underline' }}
                                                >
                                                    export
                                                </span>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                {element?.item?.name} <span style={{ fontSize: '12px', color: 'var(--primary)' }}>({element.itemSku})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-12 mt-2 p-0">
                                        <hr class="p-0 m-0" />
                                    </div>
                                    <div class="col-lg-12 p-0 mt-2">
                                        <span>Inventory: </span>
                                        <span style={{ fontWeight: 600 }}> {element.inventoryId}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Count: </span>
                                        <span style={{ fontWeight: 600 }}> {element.count}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Total Count: </span>
                                        <span style={{ fontWeight: 600 }}> {element.totalCount}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span>Merchant: </span>
                                        <span style={{ fontWeight: 600 }}> {element?.item?.merchantId}</span>
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <span
                                            onClick={() => {
                                                setchosenitem(element);
                                                setopenModal(true);
                                            }}
                                            class="text-primary text-secondaryhover"
                                            style={{ textDecoration: 'underline' }}
                                        >
                                            Show item history
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Modal
                show={openInventoryModal}
                onHide={() => {
                    setopenInventoryModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            {inventoryPayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Item : {inventoryPayload.name}</div>}
                            {inventoryPayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Inventory</div>}
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenInventoryModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Name</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.name}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, name: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class={'col-lg-6'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                Inventory Rent Type
                            </label>
                            <Select
                                options={inventoryTypesContext}
                                styles={defaultstyles}
                                value={inventoryTypesContext?.filter((option) => option.value == inventoryPayload?.rentType)}
                                onChange={(option) => {
                                    var temp = { ...inventoryPayload };
                                    temp.rentType = option.value;
                                    setinventoryPayload({ ...temp });
                                }}
                            />
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Location (long)</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.long}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, long: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Location (lat)</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.lat}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, lat: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Number Of Racks</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.numberOfRacks}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, numberOfRacks: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Rack Level</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.rackLevel}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, rackLevel: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Ballot Per Rack</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.ballotPerRack}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, ballotPerRack: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Box Per Ballot</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.boxPerBallot}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, boxPerBallot: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-2">
                            <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Currency</label>
                                            <input
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={inventoryPricePayload.currency}
                                                onChange={(event) => {
                                                    setinventoryPricePayload({ ...inventoryPricePayload, currency: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>price</label>
                                            <input
                                                type={'number'}
                                                class={formstyles.form__field}
                                                value={inventoryPricePayload.pricePerUnit}
                                                onChange={(event) => {
                                                    setinventoryPricePayload({ ...inventoryPricePayload, pricePerUnit: parseFloat(event.target.value) });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Discount</label>
                                            <input
                                                type={'number'}
                                                class={formstyles.form__field}
                                                value={inventoryPricePayload.discount}
                                                onChange={(event) => {
                                                    setinventoryPricePayload({ ...inventoryPricePayload, discount: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px', fontSize: '12px' }}
                                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                        onClick={() => {
                                            var inventoryPayloadtemp = { ...inventoryPayload };
                                            inventoryPayloadtemp.inventoryPrices.push(inventoryPricePayload);
                                            setinventoryPayload({ ...inventoryPayloadtemp });
                                            setinventoryPricePayload({
                                                currency: '',
                                                pricePerUnit: '',
                                                discount: null,
                                            });
                                        }}
                                    >
                                        Add inventory price
                                    </button>
                                </div>
                            </div>
                        </div>

                        {inventoryPayload.inventoryPrices.map((item, index) => {
                            return (
                                <div class="col-lg-6 mb-2">
                                    <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                        <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                            {item.currency}
                                        </div>
                                        <div class="col-lg-12 p-0">Price: {item.pricePerUnit}</div>
                                        <div class="col-lg-12 p-0">Discount: {item.discount}</div>
                                    </div>
                                </div>
                            );
                        })}

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                onClick={() => {
                                    if (inventoryPayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        if (inventoryPayload?.inventoryPrices?.length < 1) {
                                        } else {
                                            handleAddInventory();
                                        }
                                    }
                                }}
                            >
                                Add item
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={importmodal?.open}
                onHide={() => {
                    setimportmodal({ open: false, type: '' });
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">{importmodal?.type}</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setimportmodal({ open: false, type: '' });
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
                                    <label class={formstyles.form__label}>Count</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={importpayload.count}
                                        onChange={(event) => {
                                            setimportpayload({ ...importpayload, count: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {importmodal?.type == 'export' && (
                            <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                                <label for="name" class={formstyles.form__label}>
                                    Export Type
                                </label>
                                <Select
                                    options={[
                                        { label: 'Export', value: 'export' },
                                        { label: 'Order Export', value: 'orderExport' },
                                    ]}
                                    styles={defaultstyles}
                                    value={[
                                        { label: 'Export', value: 'export' },
                                        { label: 'Order Export', value: 'orderExport' },
                                    ]?.filter((option) => option.value == importpayload?.type)}
                                    onChange={(option) => {
                                        var temp = { ...importpayload };
                                        temp.type = option.value;
                                        setimportpayload({ ...temp });
                                    }}
                                />
                            </div>
                        )}

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1 text-capitalize'}
                                onClick={async () => {
                                    if (importmodal?.type == 'import') {
                                        try {
                                            const { data } = await importMutation();
                                            setimportmodal({ open: false, type: '' });
                                            reetchfetchItemsInBox();
                                        } catch (error) {
                                            console.error('Error importing item:', error);
                                        }
                                    } else {
                                        try {
                                            const { data } = await exportMutation();
                                            setimportmodal({ open: false, type: '' });
                                            reetchfetchItemsInBox();
                                        } catch (error) {
                                            console.error('Error exporting item:', error);
                                        }
                                    }
                                }}
                            >
                                {importmodal?.type} item
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <ImportNewItem openModal={importItemModel} setopenModal={setimportItemModel} importItemPayload={importItemPayload} setimportItemPayload={setimportItemPayload} />

            <ItemInfo openModal={openModal} setopenModal={setopenModal} item={chosenitem} fetchItemHistoryQuery={fetchItemHistoryQuery} />
            {/* <OrderInfo openModal={openOrderModal} setopenModal={setopenOrderModal} leadpayload={leadpayload} setleadpayload={setleadpayload} refetchUsers={fetchusers.refetch} /> */}
        </div>
    );
};
export default InventoryItems;
