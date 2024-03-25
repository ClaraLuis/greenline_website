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

const { ValueContainer, Placeholder } = components;

const InventoryItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, inventoryTypesContext, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchInventories, useMutationGQL, addInventory, fetchItemsInBox, fetchRacks, importNew, fetchItemHistory } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [openInventoryModal, setopenInventoryModal] = useState(false);
    const [openOrderModal, setopenOrderModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
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

    const [itemsarrayhistory, setitemsarrayhistory] = useState([
        { sku: '123', name: 'item 1', type: 'import', count: 15, inventory: 'inv 1' },
        { sku: '123', name: 'item 1', type: 'export', count: 30, inventory: 'inv 1' },
        { sku: '123', name: 'item 1', type: 'import', count: 15, inventory: 'inv 3' },
        { sku: '123', name: 'item 1', type: 'export', count: 30, inventory: 'inv 3' },
        { sku: '123', name: 'item 1', type: 'export', count: 30, inventory: 'inv 3' },
    ]);
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

    const [importNewMutation] = useMutationGQL(importNew(), {
        itemSku: importItemPayload?.itemSku,
        ownedByOneMerchant: importItemPayload?.ownedByOneMerchant,
        ballotId: importItemPayload?.ballotId,
        inventoryId: importItemPayload?.inventoryId,
        boxName: importItemPayload?.boxName,
        count: parseInt(importItemPayload?.count),
        minCount: parseInt(importItemPayload?.minCount),
    });

    const { refetch: refetchInventories } = useQueryGQL('', fetchInventories());

    const handleIMportNewItem = async () => {
        try {
            const { data } = await importNewMutation();
            // setop(false);
            // refetchInventories();
            setimportItemModel(false);
            // console.log(data); // Handle response
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

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
    const fetchinventories = useQueryGQL('', fetchInventories());
    const fetchItemsInBoxQuery = useQueryGQL('', fetchItemsInBox());
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
                                    <div class="col-lg-12 p-0 mb-1 mt-2 " style={{ fontSize: '15px' }}>
                                        {element?.item?.name} <span style={{ fontSize: '12px', color: 'var(--primary)' }}>({element.itemSku})</span>
                                    </div>
                                    <div class="col-lg-12 p-0">
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
                show={importItemModel}
                onHide={() => {
                    setimportItemModel(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Import new item</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setimportItemModel(false);
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
                                    <label class={formstyles.form__label}>Box Name</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={importItemPayload.boxName}
                                        onChange={(event) => {
                                            setimportItemPayload({ ...importItemPayload, boxName: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>{' '}
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Count</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={importItemPayload.count}
                                        onChange={(event) => {
                                            setimportItemPayload({ ...importItemPayload, count: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Min Count</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={importItemPayload.minCount}
                                        onChange={(event) => {
                                            setimportItemPayload({ ...importItemPayload, minCount: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class={'col-lg-6'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                Inventory
                            </label>
                            <Select
                                options={fetchinventories?.data?.paginateInventories?.data}
                                styles={defaultstyles}
                                value={fetchinventories?.data?.paginateInventories?.data?.filter((option) => option.value == importItemPayload?.inventoryId)}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                onChange={(option) => {
                                    setimportItemPayload({ ...importItemPayload, inventoryId: option.id });
                                    setfilter({ ...filter, invetoryIds: [option.id] });
                                }}
                            />
                        </div>
                        {importItemPayload?.inventoryId?.length != 0 && (
                            <>
                                {fetchRacksQuery?.data?.paginateRacks?.data?.map((item, index) => {
                                    return (
                                        <div class="col-lg-6 mb-2">
                                            <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                                <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                                    Rack {item.name}
                                                </div>
                                                <div class="col-lg-12 p-0">
                                                    <hr class="p-0 m-0" />
                                                </div>
                                                <div class="col-lg-12 p-0 mt-1">
                                                    <div class="row m-0 w-100">
                                                        {item?.ballots?.map((ballot, ballotindex) => {
                                                            return (
                                                                <div
                                                                    onClick={() => {
                                                                        setimportItemPayload({ ...importItemPayload, ballotId: ballot.id });
                                                                    }}
                                                                    class={importItemPayload.ballotId == ballot.id ? 'searchpillselected' : 'searchpill'}
                                                                >
                                                                    {' '}
                                                                    {ballot?.name}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                        <div class="col-lg-12 p-0 mt-2 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                onClick={() => {
                                    handleIMportNewItem();
                                }}
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <ItemInfo openModal={openModal} setopenModal={setopenModal} item={chosenitem} fetchItemHistoryQuery={fetchItemHistoryQuery} />
            {/* <OrderInfo openModal={openOrderModal} setopenModal={setopenOrderModal} leadpayload={leadpayload} setleadpayload={setleadpayload} refetchUsers={fetchusers.refetch} /> */}
        </div>
    );
};
export default InventoryItems;
