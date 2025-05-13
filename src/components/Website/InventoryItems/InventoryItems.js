import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { Modal } from 'react-bootstrap';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaLayerGroup, FaRegClock } from 'react-icons/fa';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';

// Icons
import { CiExport, CiImport, CiTrash } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import MultiSelect from '../../MultiSelect.js';
import Pagination from '../../Pagination.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import SkuPrint from '../MerchantItems/SkuPrint.js';
import ImportNewItem from './ImportNewItem.js';
import ItemInfo from './ItemInfo.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';

const { ValueContainer, Placeholder } = components;

const InventoryItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, dateformatter, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const {
        useMutationNoInputGQL,
        useQueryGQL,
        fetchInventories,
        useMutationGQL,
        addInventory,
        fetchItemsInBox,
        importNew,
        fetchItemHistory,
        exportItem,
        importItem,
        useLazyQueryGQL,
        removeItemInBox,
    } = API();

    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [selectedVariants, setselectedVariants] = useState([]);

    const [openModal, setopenModal] = useState(false);
    const [search, setSearch] = useState('');
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
        itemVariantId: 'item.e',
        ownedByOneMerchant: true,
        palletId: '',
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
        palletPerRack: 0,
        boxPerPallet: 0,
        inventoryPrices: [],
    });

    const [fetchItemHistoryQuery, setfetchItemHistoryQuery] = useState({});

    const [filterInventories, setfilterInventories] = useState({
        limit: 5,
        afterCursor: null,
        beforeCursor: null,
    });

    const [addInvrntoryMutation] = useMutationGQL(addInventory(), {
        name: inventoryPayload?.name,
        location: { long: 0.0, lat: 0.0 },
        numberOfRacks: parseInt(inventoryPayload?.numberOfRacks),
        rackLevel: parseInt(inventoryPayload?.rackLevel),
        palletPerRack: parseInt(inventoryPayload?.palletPerRack),
        boxPerPallet: parseInt(inventoryPayload?.boxPerPallet),
    });

    const [importMutation] = useMutationGQL(importItem(), {
        id: chosenitem?.id,
        count: parseInt(importpayload?.count),
    });
    const [removeItemInBoxMutation] = useMutationNoInputGQL(removeItemInBox(), {
        id: chosenitem?.id,
    });
    const [exportMutation] = useMutationGQL(exportItem(), {
        id: chosenitem?.id,
        count: parseInt(importpayload?.count),
        type: importpayload?.type,
    });
    var fetchinventories = undefined;
    if (cookies.get('userInfo')?.type != 'merchant') {
        fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);
    }

    const handleAddInventory = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
        try {
            const { data } = await addInvrntoryMutation();
            // setop(false);
            fetchinventories.refetch();
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
        setbuttonLoadingContext(false);
    };
    const [filterItemInBox, setfilterItemInBox] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
        inventoryIds: [],
    });

    const fetchItemsInBoxQuery = useQueryGQL('', fetchItemsInBox(), filterItemInBox);
    const { refetch: refetchfetchItemsInBox } = useQueryGQL('', fetchItemsInBox(), filterItemInBox);

    useEffect(() => {
        setpageactive_context('/inventoryitems');
        setpagetitle_context('Warehouses');
    }, []);
    const [barcode, setBarcode] = useState('');
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return; // Don't process barcode scanning when typing in an input field
            }
            if (e.key === 'Enter') {
                setfilterItemInBox({ ...filterItemInBox, name: barcode.length === 0 ? undefined : barcode });
                setSearch(barcode); // Update the search state with the scanned barcode
            } else {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode, filterItemInBox]);

    useEffect(() => {
        refetchfetchItemsInBox();
    }, [filterItemInBox]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                {cookies.get('userInfo')?.type != 'merchant' && (
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                            <div class="col-lg-12 p-0">
                                <div class="row m-0 w-100 d-flex align-items-center">
                                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start '}>
                                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                                            <span style={{ color: 'var(--info)' }}>Warehouses </span>
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
                                                Add Warehouse
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
                                                        setfilterInventories({
                                                            ...filterInventories,
                                                            beforeCursor: fetchinventories?.data?.paginateInventories?.cursor?.beforeCursor,
                                                            afterCursor: null,
                                                        });
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
                                                        setfilterInventories({
                                                            ...filterInventories,
                                                            afterCursor: fetchinventories?.data?.paginateInventories?.cursor?.afterCursor,
                                                            beforeCursor: null,
                                                        });
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
                    </div>
                )}
                {cookies.get('userInfo')?.type != 'merchant' && (
                    <div class="col-lg-12 px-3">
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
                                            <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                <div class="row m-0 w-100  ">
                                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                        <label class={formstyles.form__label}>Order</label>
                                                        <Select
                                                            options={[
                                                                { label: 'Ascending', value: true },
                                                                { label: 'Descending', value: false },
                                                            ]}
                                                            styles={defaultstyles}
                                                            value={[
                                                                { label: 'Ascending', value: true },
                                                                { label: 'Descending', value: false },
                                                            ].find((option) => option.value === (filterItemInBox?.isAsc ?? true))}
                                                            onChange={(option) => {
                                                                setfilterItemInBox({ ...filterItemInBox, isAsc: option?.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <MerchantSelectComponent
                                                    type="multi"
                                                    attr={'paginateMerchants'}
                                                    label={'name'}
                                                    value={'id'}
                                                    selected={filterItemInBox?.merchantIds}
                                                    onClick={(option) => {
                                                        var tempArray = filterItemInBox?.merchantIds ?? [];

                                                        if (option == 'All') {
                                                            tempArray = undefined;
                                                        } else {
                                                            if (!tempArray?.includes(option?.id)) {
                                                                tempArray.push(option?.id);
                                                            } else {
                                                                tempArray.splice(tempArray?.indexOf(option?.id), 1);
                                                            }
                                                        }

                                                        setfilterItemInBox({ ...filterItemInBox, merchantIds: tempArray?.length != 0 ? tempArray : undefined });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                )}
                <div class={' row m-0 w-100 p-0 mb-2'}>
                    {cookies.get('userInfo')?.type != 'merchant' && (
                        <div class="col-lg-12 px-3">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-start mb-2 px-2 '}>
                                    <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                                        <span style={{ color: 'var(--info)' }}>Items </span>
                                    </p>
                                </div>
                                <div class={' col-lg-6 col-md-6 col-sm-12 p-0 d-flex align-items-center justify-content-end mb-2 px-2 '}>
                                    <div className="row m-0 w-100 d-flex align-items-center justify-content-end">
                                        {selectedVariants?.length > 0 && <SkuPrint skus={selectedVariants} />}
                                        {isAuth([1, 54, 81]) && (
                                            <button
                                                onClick={() => {
                                                    setimportItemPayload({
                                                        itemVariantId: '',
                                                        ownedByOneMerchant: true,
                                                        palletId: '',
                                                        inventoryId: '',
                                                        boxName: '',
                                                        count: 0,
                                                        minCount: 0,
                                                    });
                                                    setimportItemModel(true);
                                                }}
                                                style={{ height: '35px' }}
                                                class={generalstyles.roundbutton + ' mx-2 '}
                                            >
                                                Import new item
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isAuth([1, 54, 6]) && (
                        <>
                            <div class="col-lg-12 px-3">
                                <div class={generalstyles.card + ' row m-0 w-100 p-2'}>
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
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setfilterItemInBox({ ...filterItemInBox, name: search?.length == 0 ? undefined : search });
                                                            }
                                                        }}
                                                        onChange={(event) => {
                                                            setBarcode(event.target.value);
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
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                {fetchItemsInBoxQuery?.loading && (
                                    <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                        <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                    </div>
                                )}
                            </div>
                            {!fetchItemsInBoxQuery?.loading && fetchItemsInBoxQuery?.data?.paginateItemInBox && (
                                <>
                                    <div class="col-lg-12 p-0 mb-2">
                                        <Pagination
                                            beforeCursor={fetchItemsInBoxQuery?.data?.paginateItemInBox?.cursor?.beforeCursor}
                                            afterCursor={fetchItemsInBoxQuery?.data?.paginateItemInBox?.cursor?.afterCursor}
                                            filter={filterItemInBox}
                                            setfilter={setfilterItemInBox}
                                        />
                                    </div>
                                    {fetchItemsInBoxQuery?.data?.paginateItemInBox?.data?.length == 0 && (
                                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div class="row m-0 w-100">
                                                <FaLayerGroup size={40} class=" col-lg-12" />
                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No Items
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {fetchItemsInBoxQuery?.data?.paginateItemInBox?.data?.length != 0 && (
                                        <>
                                            {fetchItemsInBoxQuery?.data?.paginateItemInBox?.data?.map((element, arrayindex) => {
                                                var selected = false;
                                                var count = 0;
                                                selectedVariants?.map((i) => {
                                                    if (i.id == element.id) {
                                                        selected = true;
                                                        count = i?.count;
                                                    }
                                                });
                                                return (
                                                    <div style={{ fontSize: '13px' }} class=" col-lg-4 ">
                                                        <div
                                                            onClick={() => {
                                                                var temp = [...selectedVariants];
                                                                var exist = false;
                                                                var chosenindex = null;
                                                                temp.map((i, ii) => {
                                                                    if (i?.id == element?.id) {
                                                                        exist = true;
                                                                        chosenindex = ii;
                                                                    }
                                                                });
                                                                if (!exist) {
                                                                    temp.push({ item: element, id: element.id });
                                                                } else {
                                                                    temp.splice(chosenindex, 1);
                                                                }
                                                                setselectedVariants([...temp]);
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',

                                                                backgroundColor: selected ? 'var(--secondary)' : '',
                                                                transition: 'all 0.4s',
                                                            }}
                                                            class={generalstyles.card + ' row m-0 w-100 '}
                                                        >
                                                            <div style={{ width: '35px', height: '35px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                                <img
                                                                    src={
                                                                        element?.imageUrl
                                                                            ? element?.imageUrl
                                                                            : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                    }
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                />
                                                            </div>
                                                            <div class="col-lg-8 p-0 mb-2">
                                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                                    <div class="col-lg-12 p-0 ">
                                                                        {/* <div class="col-lg-12 p-0 " style={{ fontSize: '14px', fontWeight: 600 }}>
                                                                            {element?.id}
                                                                        </div> */}
                                                                        <div className="col-lg-12 p-0" style={{ fontSize: '14px', fontWeight: 600 }}>
                                                                            {element.stockCount} Pieces
                                                                        </div>
                                                                        <div class="col-lg-12 p-0 " style={{ fontSize: '11px', fontWeight: 600, color: 'grey' }}>
                                                                            {element?.sku}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-2 p-0 mb-2">
                                                                {isAuth([1, 54, 82, 6]) && (
                                                                    <button
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            history.push('/itemhistory?id=' + element?.sku);

                                                                            // var { data } = await fetchItemHistorLazyQuery({
                                                                            //     variables: {
                                                                            //         input: { itemInBoxId: parseInt(element.id), limit: 20 },
                                                                            //     },
                                                                            // });
                                                                            // setfetchItemHistoryQuery(data);
                                                                            // setchosenitem(element);
                                                                            // setopenModal(true);
                                                                        }}
                                                                        style={{ height: '25px', minWidth: 'fit-content', marginInlineEnd: '5px', background: 'grey' }}
                                                                        class={generalstyles.roundbutton + '  allcentered'}
                                                                    >
                                                                        <FaRegClock />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {isAuth([1]) && (
                                                                <>
                                                                    {' '}
                                                                    {element?.blocks?.map((blockitem, blockindex) => {
                                                                        return (
                                                                            <div class="col-lg-12 p-0 mb-2">
                                                                                <div class="row m-0 w-100 d-flex align-items-center p-1 px-2" style={{ background: '#F0F5F9', borderRadius: '0.5rem' }}>
                                                                                    <div class="col-lg-6 p-0" style={{ fontSize: '14px', fontWeight: 600 }}>
                                                                                        {blockitem.count} Pieces
                                                                                    </div>
                                                                                    <div className="col-lg-6 p-0">
                                                                                        <div class="row m-0 w-100">
                                                                                            <div class="col-lg-12 p-0 my-2">
                                                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                                                    {isAuth([1, 77]) && (
                                                                                                        <button
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation();
                                                                                                                setchosenitem(blockitem);
                                                                                                                // setopenModal(true);
                                                                                                                setimportpayload({
                                                                                                                    id: '',
                                                                                                                    count: '',
                                                                                                                    type: '',
                                                                                                                });
                                                                                                                setimportmodal({ open: true, type: 'import' });
                                                                                                            }}
                                                                                                            style={{ minWidth: 'fit-content', marginInlineEnd: '5px' }}
                                                                                                            class={'  allcentered'}
                                                                                                        >
                                                                                                            <CiImport size={18} class="text-success text-successhover" />
                                                                                                        </button>
                                                                                                    )}
                                                                                                    {isAuth([1, 83]) && (
                                                                                                        <button
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation();

                                                                                                                setchosenitem(blockitem);
                                                                                                                setimportpayload({
                                                                                                                    id: '',
                                                                                                                    count: '',
                                                                                                                    type: '',
                                                                                                                });
                                                                                                                setimportmodal({ open: true, type: 'export' });
                                                                                                            }}
                                                                                                            style={{ minWidth: 'fit-content', marginInlineEnd: '5px' }}
                                                                                                            class={'  allcentered'}
                                                                                                        >
                                                                                                            <CiExport size={18} class="text-danger text-dangerhover" />
                                                                                                        </button>
                                                                                                    )}
                                                                                                    {isAuth([1]) && blockitem.count == 0 && (
                                                                                                        <button
                                                                                                            onClick={async (e) => {
                                                                                                                e.stopPropagation();

                                                                                                                setchosenitem(blockitem);
                                                                                                                setimportpayload({
                                                                                                                    id: '',
                                                                                                                    count: '',
                                                                                                                    type: '',
                                                                                                                });
                                                                                                                setimportmodal({ open: true, type: 'delete' });
                                                                                                            }}
                                                                                                            style={{ minWidth: 'fit-content', marginInlineEnd: '5px' }}
                                                                                                            class={'  allcentered'}
                                                                                                        >
                                                                                                            <CiTrash size={18} class="text-danger text-dangerhover" />
                                                                                                        </button>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
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
                                                );
                                            })}
                                        </>
                                    )}
                                </>
                            )}
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
                            {inventoryPayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Warehouse</div>}
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

                        {/* <div class="col-lg-6">
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
                        </div> */}

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
                                    <label class={formstyles.form__label}>Pallet Per Rack</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.palletPerRack}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, palletPerRack: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Box Per Pallet</label>
                                    <input
                                        type={'number'}
                                        class={formstyles.form__field}
                                        value={inventoryPayload.boxPerPallet}
                                        onChange={(event) => {
                                            setinventoryPayload({ ...inventoryPayload, boxPerPallet: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1'}
                                disabled={buttonLoadingContext}
                                onClick={() => {
                                    if (inventoryPayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        handleAddInventory();
                                    }
                                }}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>Add item</span>}
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
                {importmodal.type != 'delete' && (
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
                )}
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        {importmodal.type != 'delete' && (
                            <>
                                {' '}
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
                                                // { label: 'Order Export', value: 'orderExport' },
                                            ]}
                                            styles={defaultstyles}
                                            value={[
                                                { label: 'Export', value: 'export' },
                                                // { label: 'Order Export', value: 'orderExport' },
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
                                        disabled={buttonLoadingContext}
                                        onClick={async () => {
                                            if (buttonLoadingContext) return;
                                            setbuttonLoadingContext(true);

                                            if (importmodal?.type == 'import') {
                                                try {
                                                    const { data } = await importMutation();
                                                    if (data.importItem?.success) {
                                                        setimportmodal({ open: false, type: '' });
                                                        refetchfetchItemsInBox();
                                                        NotificationManager.success('item imported', 'Success!');
                                                    } else {
                                                        NotificationManager.warning(data?.importItem?.message, 'Warning!');
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
                                                    console.error('Error importing item:', error);
                                                }
                                            } else {
                                                try {
                                                    const { data } = await exportMutation();
                                                    if (data.exportItem?.success) {
                                                        setimportmodal({ open: false, type: '' });
                                                        refetchfetchItemsInBox();
                                                        NotificationManager.success('item imported', 'Success!');
                                                    } else {
                                                        NotificationManager.warning(data?.exportItem?.message, 'Warning!');
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
                                                    console.error('Error exporting item:', error);
                                                }
                                            }
                                            setbuttonLoadingContext(false);
                                        }}
                                    >
                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                        {!buttonLoadingContext && <span>{importmodal?.type} item</span>}
                                    </button>
                                </div>
                            </>
                        )}
                        {importmodal.type == 'delete' && (
                            <>
                                <div class="col-lg-12 text-center allcentered my-4 text-danger">Are you sure you want to delete this item</div>

                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1 text-capitalize bg-danger bg-dangerhover'}
                                        disabled={buttonLoadingContext}
                                        onClick={async () => {
                                            if (buttonLoadingContext) return;
                                            setbuttonLoadingContext(true);
                                            try {
                                                const { data } = await removeItemInBoxMutation();
                                                if (data?.removeItemInBox?.success) {
                                                    await refetchfetchItemsInBox();
                                                    NotificationManager.success('item deleted', 'Success!');
                                                } else {
                                                    NotificationManager.warning(data?.removeItemInBox?.message, 'Warning!');
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
                                        }}
                                    >
                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                        {!buttonLoadingContext && <span>Delete</span>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            {cookies.get('userInfo')?.type != 'merchant' && (
                <ImportNewItem
                    openModal={importItemModel}
                    setopenModal={setimportItemModel}
                    importItemPayload={importItemPayload}
                    setimportItemPayload={setimportItemPayload}
                    refetchfetchItemsInBox={refetchfetchItemsInBox}
                />
            )}

            <ItemInfo openModal={openModal} setopenModal={setopenModal} item={chosenitem} fetchItemHistoryQuery={fetchItemHistoryQuery} />
            {/* <OrderInfo openModal={openOrderModal} setopenModal={setopenOrderModal} payload={payload} setpayload={setpayload} refetchUsers={fetchusers.refetch} /> */}
        </div>
    );
};
export default InventoryItems;
