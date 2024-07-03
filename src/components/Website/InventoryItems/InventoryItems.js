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
import { FaLayerGroup, FaRegClock } from 'react-icons/fa';
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
import Pagination from '../../Pagination.js';
import { NotificationManager } from 'react-notifications';

const { ValueContainer, Placeholder } = components;

const InventoryItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchInventories, useMutationGQL, addInventory, fetchItemsInBox, fetchRacks, importNew, fetchItemHistory, exportItem, importItem, useLazyQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [openInventoryModal, setopenInventoryModal] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [importpayload, setimportpayload] = useState({
        id: '',
        count: '',
        type: '',
    });
    const [importmodal, setimportmodal] = useState({ open: false, type: '' });
    const [chosenitem, setchosenitem] = useState('');
    const [importItemModel, setimportItemModel] = useState(false);
    const [importItemPayload, setimportItemPayload] = useState({
        itemVariantId: 'item.e',
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

    const [fetchItemHistoryQuery, setfetchItemHistoryQuery] = useState({});

    const [filterInventories, setfilterInventories] = useState({
        limit: 5,
        afterCursor: null,
        beforeCursor: null,
    });

    const [addInvrntoryMutation] = useMutationGQL(addInventory(), {
        name: inventoryPayload?.name,
        location: { long: inventoryPayload?.long, lat: inventoryPayload?.lat },
        numberOfRacks: parseInt(inventoryPayload?.numberOfRacks),
        rackLevel: parseInt(inventoryPayload?.rackLevel),
        ballotPerRack: parseInt(inventoryPayload?.ballotPerRack),
        boxPerBallot: parseInt(inventoryPayload?.boxPerBallot),
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

    const { refetch: refetchInventories } = useQueryGQL('', fetchInventories(), filterInventories);

    const handleAddInventory = async () => {
        setbuttonLoading(true);
        try {
            const { data } = await addInvrntoryMutation();
            // setop(false);
            refetchInventories();
            setopenInventoryModal(false);
            // console.log(data); // Handle response
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
            console.error('Error adding Inventory:', error);
        }
        setbuttonLoading(false);
    };
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);
    const [filterItemInBox, setfilterItemInBox] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
        inventoryIds: [1],
    });

    const fetchItemsInBoxQuery = useQueryGQL('', fetchItemsInBox(), filterItemInBox);
    const { refetch: reetchfetchItemsInBox } = useQueryGQL('', fetchItemsInBox(), filterItemInBox);

    // let fetchItemHistoryQuery;
    // let refetchItemHistory;

    const [fetchItemHistorLazyQuery] = useLazyQueryGQL(fetchItemHistory());

    useEffect(() => {
        setpageactive_context('/inventoryitems');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class="col-lg-12 p-0">
                        <div class="row m-0 w-100 d-flex align-items-center">
                            <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start '}>
                                <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'var(--info)' }}>Inventories </span>
                                </p>
                            </div>
                            {isAuth([1, 54, 4]) && (
                                <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-2 px-2 '}>
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + ''}
                                        onClick={() => {
                                            setopenInventoryModal(true);
                                        }}
                                    >
                                        Add Inventory
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="col-lg-12 p-0 ">
                        {fetchinventories?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                        {isAuth([1, 54, 3]) && (
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
                                        <div
                                            onClick={() => {
                                                history.push('/inventorydetails?inventoryId=' + item?.id);
                                            }}
                                            style={{ fontSize: '13px', cursor: 'pointer' }}
                                            class="card p-2 col-lg-2"
                                        >
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-12 p-0 mb-1 " style={{ fontSize: '15px' }}>
                                                    #{item?.id}
                                                </div>
                                                <div class="col-lg-12 p-0">
                                                    <hr class="p-0 m-0" />
                                                </div>
                                                <div class="col-lg-12 p-0 mt-2">
                                                    {/* <span>Name: </span> */}
                                                    <span style={{ fontWeight: 600 }} class="text-capitalize">
                                                        {' '}
                                                        {item?.name}
                                                    </span>
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
                        )}
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 p-2 pt-3 mb-2'}>
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
                                    style={{ height: '35px' }}
                                    class={generalstyles.roundbutton + '  mx-2'}
                                >
                                    View all
                                </span>
                            </p>
                            <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                                <span
                                    onClick={() => {
                                        setimportItemPayload({
                                            itemVariantId: '',
                                            ownedByOneMerchant: true,
                                            ballotId: '',
                                            inventoryId: '',
                                            boxName: '',
                                            count: 0,
                                            minCount: 0,
                                        });
                                        setimportItemModel(true);
                                    }}
                                    style={{ height: '35px' }}
                                    class={generalstyles.roundbutton + '  '}
                                >
                                    Import new item
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class={generalstyles.card + ' row m-0 w-100 my-2 p-2 px-2'}>
                        <div class="col-lg-12 p-0 ">
                            <div class="row m-0 w-100 d-flex align-items-center">
                                <div class="col-lg-10">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={search}
                                            placeholder={'Search by name or SKU'}
                                            onChange={(event) => {
                                                setSearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-2 allcenered">
                                    <button
                                        onClick={() => {
                                            setfilterItemInBox({ ...filterItemInBox, name: search?.length == 0 ? undefined : search });
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
                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        {fetchItemsInBoxQuery?.loading && (
                            <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                            </div>
                        )}
                    </div>
                    {!fetchItemsInBoxQuery?.loading && fetchItemsInBoxQuery?.data?.paginateItemInBox && (
                        <>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchItemsInBoxQuery?.data?.paginateItemInBox?.cursor?.beforeCursor}
                                    afterCursor={fetchItemsInBoxQuery?.data?.paginateItemInBox?.cursor?.afterCursor}
                                    filter={filterItemInBox}
                                    setfilter={setfilterItemInBox}
                                />
                            </div>
                            {fetchItemsInBoxQuery?.data?.paginateItemInBox?.data?.map((element, arrayindex) => {
                                return (
                                    <div style={{ fontSize: '13px' }} class=" col-lg-4 p-2 mb-1">
                                        <div class="row m-0 w-100 card">
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <div class=" mr-2" style={{ width: '50px', height: '50px', borderRadius: '5px' }}>
                                                        <img
                                                            src={
                                                                element?.itemVariant?.imageUrl?.length != 0 && element?.itemVariant?.imageUrl != null
                                                                    ? element?.itemVariant?.imageUrl
                                                                    : 'https://www.shutterstock.com/image-vector/new-label-shopping-icon-vector-260nw-1894227709.jpg'
                                                            }
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                                        />
                                                    </div>
                                                    <div class="col-lg-9 p-0 ">
                                                        <div class="col-lg-12 p-0 " style={{ fontSize: '14px', fontWeight: 600 }}>
                                                            {element?.itemVariant?.item?.name}
                                                        </div>
                                                        <div className="row m-0 w-100">
                                                            <div class="col-lg-8 p-0 " style={{ fontSize: '13px', fontWeight: 500 }}>
                                                                {element?.itemVariant?.name}
                                                            </div>
                                                            <div class="col-lg-4 p-0 d-flex justify-content-end">{element?.count}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-12 p-0 mt-3">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-center">
                                                    <button
                                                        onClick={async () => {
                                                            var { data } = await fetchItemHistorLazyQuery({
                                                                variables: {
                                                                    input: { itemInBoxId: parseInt(element.id), limit: 20 },
                                                                },
                                                            });
                                                            setfetchItemHistoryQuery(data);
                                                            setchosenitem(element);
                                                            setopenModal(true);
                                                        }}
                                                        style={{ height: '25px', minWidth: 'fit-content', marginInlineEnd: '5px' }}
                                                        class={generalstyles.roundbutton + '  allcentered'}
                                                    >
                                                        <FaRegClock />
                                                    </button>

                                                    <button
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
                                                        style={{ height: '25px', width: '40%', marginInlineEnd: '5px' }}
                                                        class={generalstyles.roundbutton + '  allcentered'}
                                                    >
                                                        import
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setchosenitem(element);
                                                            setimportpayload({
                                                                id: '',
                                                                count: '',
                                                                type: '',
                                                            });
                                                            setimportmodal({ open: true, type: 'export' });
                                                        }}
                                                        style={{ height: '25px', width: '40%' }}
                                                        class={generalstyles.roundbutton + '  allcentered bg-danger bg-dangerhover'}
                                                    >
                                                        export
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
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

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1'}
                                disabled={buttonLoading}
                                onClick={() => {
                                    if (inventoryPayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        handleAddInventory();
                                    }
                                }}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>Add item</span>}
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
                                class={generalstyles.roundbutton + '  mb-1 text-capitalize'}
                                disabled={buttonLoading}
                                onClick={async () => {
                                    setbuttonLoading(true);

                                    if (importmodal?.type == 'import') {
                                        try {
                                            const { data } = await importMutation();
                                            setimportmodal({ open: false, type: '' });
                                            reetchfetchItemsInBox();
                                            refetchItemHistory();
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
                                            console.error('Error importing item:', error);
                                        }
                                    } else {
                                        try {
                                            const { data } = await exportMutation();
                                            setimportmodal({ open: false, type: '' });
                                            reetchfetchItemsInBox();
                                            refetchItemHistory();
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
                                            console.error('Error exporting item:', error);
                                        }
                                    }
                                    setbuttonLoading(false);
                                }}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>{importmodal?.type} item</span>}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <ImportNewItem openModal={importItemModel} setopenModal={setimportItemModel} importItemPayload={importItemPayload} setimportItemPayload={setimportItemPayload} />

            <ItemInfo openModal={openModal} setopenModal={setopenModal} item={chosenitem} fetchItemHistoryQuery={fetchItemHistoryQuery} />
            {/* <OrderInfo openModal={openOrderModal} setopenModal={setopenOrderModal} payload={payload} setpayload={setpayload} refetchUsers={fetchusers.refetch} /> */}
        </div>
    );
};
export default InventoryItems;
