import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { TextareaAutosize } from '@mui/material';
import { BsChevronDown, BsChevronUp, BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import API from '../../../API/API.js';
import ItemsTable from './ItemsTable.js';
import { NotificationManager } from 'react-notifications';

const { ValueContainer, Placeholder } = components;

const MerchantItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationGQL, addItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [openCompounditemsModal, setopenCompounditemsModal] = useState(false);
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const [itempayload, setitempayload] = useState({
        functype: 'add',
        merchansku: '',
        name: '',
        color: '',
        colorHEX: '',
        description: '',
        size: '',
        itemPrices: [],
        colorsarray: [],
        colorHEXarray: [],
        imageUrl: '',
        imageUrls: [],
    });
    const [itemprice, setitemprice] = useState({
        currency: '',
        price: '',
        discount: null,
        startDiscount: null,
        endDiscount: null,
    });
    const [colorpayload, setcolorpayload] = useState({
        color: '',
        colorHEX: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const [filter, setfiter] = useState({
        limit: 10,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: '',
        sku: '',
    });
    const fetchMerchantItemsQuery = useQueryGQL('', fetchMerchantItems(filter));

    const [addItemMutation] = useMutationGQL(addItem(), [
        {
            priceReference: 0,
            name: itempayload?.name,
            merchantSku: itempayload?.merchansku,
            color: itempayload?.color,
            colorHex: itempayload?.colorHEX,
            description: itempayload?.description,
            size: itempayload?.size,
            imageUrl: itempayload?.imageUrl,
            itemPrices: itempayload?.itemPrices,
        },
    ]);
    const { refetch: refetchItems } = useQueryGQL('', fetchMerchantItems(filter));

    const handleAddItem = async () => {
        try {
            const { data } = await addItemMutation();
            // setop(false);
            refetchItems();

            // console.log(data); // Handle response
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // const fetchusers = useQueryGQL('', fetchUsers());
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/merchantitems');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Merchant Items
                    </p>
                </div>
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1 mx-2'}
                        onClick={() => {
                            setitempayload({
                                functype: 'add',
                                merchansku: '',
                                name: '',
                                color: '',
                                colorHEX: '',
                                description: '',
                                size: '',
                                itemPrices: [],
                                colorsarray: [],
                                colorHEXarray: [],
                            });
                            setitemprice({
                                currency: '',
                                price: '',
                                discount: null,
                                startDiscount: null,
                                endDiscount: null,
                            });
                            setopenModal(true);
                        }}
                    >
                        Add Single Item
                    </button>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                        onClick={() => {
                            setitempayload({
                                functype: 'add',
                                merchansku: '',
                                name: '',
                                color: '',
                                colorHEX: '',
                                description: '',
                                size: '',
                                itemPrices: [],
                                colorsarray: [],
                                colorHEXarray: [],
                            });
                            setitemprice({
                                currency: '',
                                price: '',
                                discount: null,
                                startDiscount: null,
                                endDiscount: null,
                            });
                            setopenCompounditemsModal(true);
                        }}
                    >
                        Add Compound Item
                    </button>
                </div>
                {/* <div class={generalstyles.card + ' row m-0 w-100 mb-4 p-2 px-2'}>
                    <div class={' col-lg-12 p-0'}>
                        <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                            <AccordionItem class={`${generalstyles.innercard}` + ' '}>
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
                                                                    <BsChevronDown />
                                                                </i>
                                                            );
                                                        } else {
                                                            return (
                                                                <i class="h-100 d-flex align-items-center justify-content-center">
                                                                    <BsChevronUp />
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
                                        <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                            <label for="name" class={formstyles.form__label}>
                                                Inventories
                                            </label>
                                            <Select
                                                options={[
                                                    { label: 'Inv 1', value: '1' },
                                                    { label: 'Inv 2', value: '2' },
                                                ]}
                                                styles={defaultstyles}
                                                value={
                                                    [
                                                        { label: 'Inv 1', value: '1' },
                                                        { label: 'Inv 2', value: '2' },
                                                    ]
                                                    // .filter((option) => option.value == props?.payload[item?.attr])
                                                }
                                                onChange={(option) => {
                                                    // props?.setsubmit(false);
                                                    // var temp = { ...props?.payload };
                                                    // temp[item?.attr] = option.value;
                                                    // props?.setpayload({ ...temp });
                                                }}
                                            />
                                        </div>
                                        <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                            <label for="name" class={formstyles.form__label}>
                                                Merchant
                                            </label>
                                            <Select
                                                options={[
                                                    { label: 'Merch 1', value: '1' },
                                                    { label: 'Merch 2', value: '2' },
                                                ]}
                                                styles={defaultstyles}
                                                value={
                                                    [
                                                        { label: 'Merch 1', value: '1' },
                                                        { label: 'Merch 2', value: '2' },
                                                    ]
                                                    // .filter((option) => option.value == props?.payload[item?.attr])
                                                }
                                                onChange={(option) => {
                                                    // props?.setsubmit(false);
                                                    // var temp = { ...props?.payload };
                                                    // temp[item?.attr] = option.value;
                                                    // props?.setpayload({ ...temp });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div> */}
                <div class={generalstyles.card + ' row m-0 w-100 mb-4 p-2 px-2'}>
                    <div class="col-lg-6">
                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                            <input
                                // disabled={props?.disabled}
                                // type={props?.type}
                                class={formstyles.form__field}
                                value={filter?.name}
                                placeholder={'Search by name '}
                                onChange={() => {
                                    setfiter({ ...filter, name: event.target.value });
                                }}
                            />
                        </div>
                    </div>
                    <div class="col-lg-6 ">
                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                            <input
                                // disabled={props?.disabled}
                                // type={props?.type}
                                class={formstyles.form__field}
                                value={filter?.sku}
                                placeholder={'Search by SKU'}
                                onChange={() => {
                                    setfiter({ ...filter, sku: event.target.value });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <ItemsTable card="col-lg-3" fetchMerchantItemsQuery={fetchMerchantItemsQuery} />
                    </div>
                    <div class="col-lg-6  d-flex align-items-center ">
                        {fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor != null && (
                            <div
                                onClick={() => {
                                    setfiter({ ...filter, beforeCursor: fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor, afterCursor: null });
                                }}
                                class={'text-secondaryhover'}
                            >
                                Previous
                            </div>
                        )}
                    </div>
                    <div class="col-lg-6  d-flex align-items-center justify-content-end ">
                        {fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor != null && (
                            <div
                                onClick={() => {
                                    setfiter({ ...filter, afterCursor: fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor, beforeCursor: null });
                                }}
                                class={'text-secondaryhover'}
                            >
                                Next
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                show={openCompounditemsModal}
                onHide={() => {
                    setopenCompounditemsModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            {itempayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Item : {itempayload.name}</div>}
                            {itempayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Compound Item</div>}
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenCompounditemsModal(false);
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
                                        value={itempayload.name}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, name: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Size</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.size}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, size: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>description</label>
                                    <TextareaAutosize
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.description}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, description: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12 mb-2">
                            <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px' }}>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>color</label>
                                            <input
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={colorpayload.color}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setcolorpayload({ ...colorpayload, color: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>color HEX</label>
                                            <input
                                                type={'color'}
                                                class={formstyles.form__field}
                                                value={colorpayload.colorHEX}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setcolorpayload({ ...colorpayload, colorHEX: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px', fontSize: '12px' }}
                                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                        onClick={() => {
                                            if (colorpayload.color.length != 0 && colorpayload.colorHEX.length != 0) {
                                                var itempayloadtemp = { ...itempayload };
                                                itempayloadtemp.colorsarray.push(colorpayload.color);
                                                itempayloadtemp.colorHEXarray.push(colorpayload.colorHEX);
                                                setitempayload({ ...itempayloadtemp });
                                                setcolorpayload({
                                                    color: '',
                                                    colorHEX: '',
                                                });
                                            }
                                        }}
                                    >
                                        Add item color
                                    </button>
                                </div>
                            </div>
                        </div>
                        {itempayload.colorsarray.map((item, index) => {
                            return (
                                <div class="col-lg-6 mb-2">
                                    <div class="row m-0 w-100 p-3" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                        <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                            {item}
                                        </div>
                                        <div class="col-lg-12 p-0">HEX: {itempayload.colorHEXarray[index]}</div>
                                    </div>
                                    <div style={{ position: 'absolute', top: '10px', right: '30px' }}>
                                        <BsTrash
                                            class="text-danger text-dangerhover"
                                            size={15}
                                            onClick={() => {
                                                var itempayloadtemp = { ...itempayload };
                                                itempayloadtemp.colorsarray.splice(index, 1);
                                                itempayloadtemp.colorHEXarray.splice(index, 1);
                                                setitempayload({ ...itempayloadtemp });
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div class="col-lg-12 mb-2">
                            <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Currency</label>
                                            <input
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={itemprice.currency}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, currency: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
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
                                                value={itemprice.price}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, price: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
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
                                                value={itemprice.discount}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, discount: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Discount Start Date</label>
                                            <input
                                                type={'date'}
                                                class={formstyles.form__field}
                                                value={itemprice.startDiscount}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, startDiscount: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Discount End Date</label>
                                            <input
                                                type={'date'}
                                                class={formstyles.form__field}
                                                value={itemprice.endDiscount}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, endDiscount: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px', fontSize: '12px' }}
                                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                        onClick={() => {
                                            var itempayloadtemp = { ...itempayload };
                                            itempayloadtemp.itemPrices.push(itemprice);
                                            setitempayload({ ...itempayloadtemp });
                                            setitemprice({
                                                currency: '',
                                                price: '',
                                                discount: null,
                                                startDiscount: null,
                                                endDiscount: null,
                                            });
                                        }}
                                    >
                                        Add item price
                                    </button>
                                </div>
                            </div>
                        </div>
                        {itempayload.itemPrices.map((item, index) => {
                            return (
                                <div class="col-lg-6 mb-2">
                                    <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                        <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                            {item.currency}
                                        </div>
                                        <div class="col-lg-12 p-0">Price: {item.price}</div>
                                        <div class="col-lg-12 p-0">Discount: {item.discount}</div>
                                        <div class="col-lg-12 p-0">Discount start date: {item.startDiscount}</div>
                                        <div class="col-lg-12 p-0">Discount end date: {item.endDiscount}</div>
                                    </div>
                                    <div style={{ position: 'absolute', top: '10px', right: '30px' }}>
                                        <BsTrash
                                            class="text-danger text-dangerhover"
                                            size={15}
                                            onClick={() => {
                                                var itempayloadtemp = { ...itempayload };
                                                itempayloadtemp.itemPrices.splice(index, 1);
                                                setitempayload({ ...itempayloadtemp });
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div class="col-lg-12 p-0 allcentered">
                            <button style={{ height: '35px' }} class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'} onClick={() => {}}>
                                Add item
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={openModal}
                onHide={() => {
                    setopenModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            {itempayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Item : {itempayload.name}</div>}
                            {itempayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Item</div>}
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenModal(false);
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
                                    <label class={formstyles.form__label}>SKU</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.merchansku}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, merchansku: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Image URL</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.imageUrl}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, imageUrl: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Name</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.name}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, name: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>color</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.color}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, color: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>color HEX</label>
                                    <input
                                        type={'color'}
                                        class={formstyles.form__field}
                                        value={itempayload.colorHEX}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, colorHEX: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Size</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.size}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, size: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>description</label>
                                    <TextareaAutosize
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.description}
                                        style={
                                            {
                                                // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                            }
                                        }
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, description: event.target.value });
                                        }}
                                    />
                                    {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
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
                                                value={itemprice.currency}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, currency: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
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
                                                value={itemprice.price}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, price: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
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
                                                value={itemprice.discount}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, discount: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Discount Start Date</label>
                                            <input
                                                type={'date'}
                                                class={formstyles.form__field}
                                                value={itemprice.startDiscount}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, startDiscount: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Discount End Date</label>
                                            <input
                                                type={'date'}
                                                class={formstyles.form__field}
                                                value={itemprice.endDiscount}
                                                style={
                                                    {
                                                        // border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                                                    }
                                                }
                                                onChange={(event) => {
                                                    setitemprice({ ...itemprice, endDiscount: event.target.value });
                                                }}
                                            />
                                            {/* {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )} */}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px', fontSize: '12px' }}
                                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                        onClick={() => {
                                            var itempayloadtemp = { ...itempayload };
                                            itempayloadtemp.itemPrices.push(itemprice);
                                            setitempayload({ ...itempayloadtemp });
                                            setitemprice({
                                                currency: '',
                                                price: '',
                                                discount: null,
                                                startDiscount: null,
                                                endDiscount: null,
                                            });
                                        }}
                                    >
                                        Add item price
                                    </button>
                                </div>
                            </div>
                        </div>
                        {itempayload.itemPrices.map((item, index) => {
                            return (
                                <div class="col-lg-6 mb-2">
                                    <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                        <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                            {item.currency}
                                        </div>
                                        <div class="col-lg-12 p-0">Price: {item.price}</div>
                                        <div class="col-lg-12 p-0">Discount: {item.discount}</div>
                                        <div class="col-lg-12 p-0">Discount start date: {item.startDiscount}</div>
                                        <div class="col-lg-12 p-0">Discount end date: {item.endDiscount}</div>
                                    </div>
                                </div>
                            );
                        })}

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                onClick={() => {
                                    if (itempayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        if (itempayload?.itemPrices?.length < 1) {
                                        } else {
                                            handleAddItem();
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
        </div>
    );
};
export default MerchantItems;
