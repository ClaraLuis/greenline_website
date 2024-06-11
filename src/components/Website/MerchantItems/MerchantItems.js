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
import Pagination from '../../Pagination.js';
import MerchantSelect from '../MerchantHome/MerchantSelect.js';
import { Arrow90degDown, ArrowDown, Trash2 } from 'react-bootstrap-icons';
import { BiDownArrow } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import Cookies from 'universal-cookie';

const { ValueContainer, Placeholder } = components;

const MerchantItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, chosenMerchantContext, isAuth } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationGQL, addItem, addCompoundItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const cookies = new Cookies();

    const [openModal, setopenModal] = useState(false);
    const [openCompounditemsModal, setopenCompounditemsModal] = useState(false);
    const [variantModel, setvariantModel] = useState(true);
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
        variantNames: [],
        variantOptions: [],
        variantOptionAttributes: [],
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
    const [payload, setfilter] = useState({
        limit: 5,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: '',
        sku: '',
        merchantId: parseInt(cookies.get('merchantId')),
    });
    const fetchMerchantItemsQuery = useQueryGQL('', fetchMerchantItems(), payload);

    const [addItemMutation] = useMutationGQL(addCompoundItem(), {
        merchantId: 1,
        items: [
            {
                name: itempayload?.name,
                merchantSku: itempayload?.merchansku,
                description: itempayload?.description,
                imageUrl: itempayload?.imageUrl,
                price: itempayload?.price,
                variantNames: itempayload?.variantNames,
                variantOptions: itempayload?.variantOptions,
                variantOptionAttributes: itempayload?.variantOptionAttributes,
            },
        ],
    });

    const { refetch: refetchItems } = useQueryGQL('', fetchMerchantItems(), payload);

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

    useEffect(() => {
        setfilter({
            limit: 5,
            isAsc: true,
            afterCursor: '',
            beforeCursor: '',
            name: '',
            sku: '',
            merchantId: parseInt(cookies.get('merchantId')),
        });
    }, [chosenMerchantContext]);

    const [options, setOptions] = useState([]);
    const [optionName, setOptionName] = useState('');
    const [valueInput, setValueInput] = useState('');
    const [valueInputs, setValueInputs] = useState({});
    const [variants, setVariants] = useState([]);

    const addOption = () => {
        if (optionName.trim() === '') return;

        const newOption = { name: optionName, values: [] };
        setOptions([...options, newOption]);
        setValueInputs({ ...valueInputs, [optionName]: '' });
        setOptionName('');
    };
    const addValue = (optionName) => {
        if (valueInputs[optionName].trim() === '') return;

        const updatedOptions = [...options];
        const optionIndex = options.findIndex((option) => option.name === optionName);

        if (updatedOptions[optionIndex].values?.length < 3) {
            updatedOptions[optionIndex].values.push(valueInputs[optionName]);
        } else {
            NotificationManager.warning('Values can not be more than 3', '');
            return; // Stop execution if values exceed the limit
        }

        const generateCombinations = (options, index = 0) => {
            if (index === options.length) {
                return [[]];
            }
            const currentOption = options[index];
            const restCombinations = generateCombinations(options, index + 1);
            const combinations = [];
            currentOption.values.forEach((value) => {
                restCombinations.forEach((combination) => {
                    combinations.push([{ [currentOption.name]: value }, ...combination]);
                });
            });
            return combinations;
        };

        const allCombinations = generateCombinations(options);

        if (allCombinations.length > 100) {
            NotificationManager.warning('Variants cannot exceed 100', '');
            return; // Stop execution if variants exceed the limit
        }

        setOptions(updatedOptions);
        setValueInputs({ ...valueInputs, [optionName]: '' });
    };

    const deleteOption = (optionName) => {
        const updatedOptions = options.filter((option) => option.name !== optionName);
        setOptions(updatedOptions);
        const { [optionName]: _, ...updatedValueInputs } = valueInputs;
        setValueInputs(updatedValueInputs);
    };

    const deleteValue = (optionName, valueIndex) => {
        const updatedOptions = [...options];
        const optionIndex = options.findIndex((option) => option.name === optionName);
        updatedOptions[optionIndex].values.splice(valueIndex, 1);
        setOptions(updatedOptions);
    };

    const editOptionName = (oldName, newName) => {
        const updatedOptions = [...options];
        const optionIndex = options.findIndex((option) => option.name === oldName);
        updatedOptions[optionIndex].name = newName;
        setOptions(updatedOptions);
        setValueInputs({ ...valueInputs, [newName]: valueInputs[oldName] });
        const { [oldName]: _, ...updatedValueInputs } = valueInputs;
        setValueInputs(updatedValueInputs);
    };

    const editValue = (optionName, valueIndex, newValue) => {
        const updatedOptions = [...options];
        const optionIndex = options.findIndex((option) => option.name === optionName);
        updatedOptions[optionIndex].values[valueIndex] = newValue;
        setOptions(updatedOptions);
    };

    useEffect(() => {
        const generateCombinations = (options) => {
            if (options.length === 0) return [];
            const [first, ...rest] = options;
            const restCombinations = generateCombinations(rest);
            if (restCombinations.length === 0) {
                return first.values.map((value) => [{ [first.name]: value }]);
            }
            const combinations = [];
            first.values.forEach((value) => {
                restCombinations.forEach((combination) => {
                    combinations.push([{ [first.name]: value }, ...combination]);
                });
            });
            return combinations;
        };

        const allCombinations = generateCombinations(options);
        const generatedVariants = allCombinations.map((combination) => {
            const variant = {
                options: combination,
                price: '',
            };
            return variant;
        });

        setVariants(generatedVariants);
    }, [options]);

    const handlePriceChange = (color, variantIndex, event) => {
        const updatedVariants = [...variants];
        const variantToUpdate = groupedVariants[color][variantIndex];
        const globalIndex = variants.indexOf(variantToUpdate);
        updatedVariants[globalIndex].price = event.target.value;
        setVariants(updatedVariants);
    };

    const handleImageChange = (color, variantIndex, event) => {
        const updatedVariants = [...variants];
        const variantToUpdate = groupedVariants[color][variantIndex];
        const globalIndex = variants.indexOf(variantToUpdate);
        updatedVariants[globalIndex].imageUrl = event.target.value;
        setVariants(updatedVariants);
    };

    const handleMerchantSkuChange = (color, variantIndex, event) => {
        const updatedVariants = [...variants];
        const variantToUpdate = groupedVariants[color][variantIndex];
        const globalIndex = variants.indexOf(variantToUpdate);
        updatedVariants[globalIndex].merchantSku = event.target.value;
        setVariants(updatedVariants);
    };

    const handleOptionChange = (optionName, event) => {
        setOptionName(event.target.value);
        const newInputValues = { ...valueInputs };
        if (!newInputValues.hasOwnProperty(event.target.value)) {
            newInputValues[event.target.value] = '';
            setValueInputs(newInputValues);
        }
    };

    const handleValueChange = (optionName, event) => {
        setValueInputs({ ...valueInputs, [optionName]: event.target.value });
    };
    const [activeColor, setActiveColor] = useState(null);

    const handleColorClick = (color) => {
        setActiveColor(activeColor === color ? null : color);
    };

    // Group variants by color
    const groupedVariants = {};
    variants.forEach((variant) => {
        const color = variant.options.find((option) => Object.keys(option)[0] === options[0]?.name);
        if (color) {
            const colorValue = Object.values(color)[0];
            if (!groupedVariants[colorValue]) {
                groupedVariants[colorValue] = [];
            }
            groupedVariants[colorValue].push(variant);
        }
    });

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Merchant Items
                    </p>
                </div>
                {isAuth([1, 52, 13]) && (
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1 mx-2'}
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
                            class={generalstyles.roundbutton + '  mb-1'}
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
                )}

                <MerchantSelect />
                {isAuth([1, 52, 12]) && (
                    <>
                        <div class={generalstyles.card + ' row m-0 w-100 mb-4 p-2 px-2'}>
                            <div class="col-lg-6">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        // disabled={props?.disabled}
                                        // type={props?.type}
                                        class={formstyles.form__field}
                                        value={payload?.name}
                                        placeholder={'Search by name '}
                                        onChange={() => {
                                            setfilter({ ...payload, name: event.target.value });
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
                                        value={payload?.sku}
                                        placeholder={'Search by SKU'}
                                        onChange={() => {
                                            setfilter({ ...payload, sku: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor}
                                    payload={payload}
                                    setfilter={setfilter}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                <ItemsTable card="col-lg-3" items={fetchMerchantItemsQuery?.data?.paginateItems?.data} />
                            </div>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor}
                                    payload={payload}
                                    setfilter={setfilter}
                                />
                            </div>
                        </div>
                    </>
                )}
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, name: event.target.value });
                                        }}
                                    />
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, size: event.target.value });
                                        }}
                                    />
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, description: event.target.value });
                                        }}
                                    />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px', fontSize: '12px' }}
                                        class={generalstyles.roundbutton + '  mb-1'}
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 p-0 allcentered">
                                    <button
                                        style={{ height: '35px', fontSize: '12px' }}
                                        class={generalstyles.roundbutton + '  mb-1'}
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
                            <button style={{ height: '35px' }} class={generalstyles.roundbutton + '  mb-1'} onClick={() => {}}>
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, merchansku: event.target.value });
                                        }}
                                    />
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, imageUrl: event.target.value });
                                        }}
                                    />
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, name: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label class={formstyles.form__label}>Price</label>
                                    <input
                                        type={'text'}
                                        class={formstyles.form__field}
                                        value={itempayload.price}
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, price: event.target.value });
                                        }}
                                    />
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
                                        onChange={(event) => {
                                            setitempayload({ ...itempayload, description: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="col-lg-12 p-3">
                            <div>
                                <input type="text" class={formstyles.form__field} value={optionName} onChange={(event) => handleOptionChange(optionName, event)} placeholder="Enter option name" />
                                <button style={{ height: '30px' }} class={generalstyles.roundbutton + '  my-2 p-0'} onClick={addOption}>
                                    Add Option
                                </button>
                            </div>
                            {options.map((option, index) => (
                                <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="p-2 mb-2 row m-0 w-100 d-flex align-items-center" key={index}>
                                    <input type="text" class={formstyles.form__field + ' col-lg-10'} value={option.name} onChange={(event) => editOptionName(option.name, event.target.value)} />
                                    <div class="col-lg-2 allcentered">
                                        <Trash2 onClick={() => deleteOption(option.name)} class="text-dangerhover" />
                                    </div>

                                    {option.values.map((value, idx) => (
                                        <div class="col-lg-3 p-0 mt-2 mr-1" key={idx}>
                                            <div class="row m-0 w-100 allcentered">
                                                <input type="text" class={formstyles.form__field + ' col-lg-10'} value={value} onChange={(event) => editValue(option.name, idx, event.target.value)} />
                                                <Trash2 onClick={() => deleteValue(option.name, idx)} class="text-dangerhover" />
                                            </div>
                                        </div>
                                    ))}
                                    <div class="col-lg-12 p-0">
                                        <input
                                            type="text"
                                            class={formstyles.form__field + ' mt-2'}
                                            value={valueInputs[option.name] || ''}
                                            onChange={(event) => handleValueChange(option.name, event)}
                                            placeholder="Enter value"
                                        />
                                        <button style={{ height: '30px' }} class={generalstyles.roundbutton + '  my-2 p-0'} onClick={() => addValue(option.name)}>
                                            Add Value
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {/* <div class="col-lg-12 p-0 allcentered">
                                <button style={{ height: '35px' }} class={generalstyles.roundbutton + '  my-2 p-0 px-4'} onClick={generateVariants}>
                                    Generate Variants
                                </button>
                            </div> */}
                            {Object.entries(groupedVariants).map(([color, variants], colorIndex) => (
                                <div key={colorIndex} style={{ border: '1px solid #eee', borderRadius: '18px', fontSize: '13px', cursor: 'pointer' }} className="p-3 mb-2">
                                    <div className="col-lg-12 p-0" onClick={() => handleColorClick(color)}>
                                        {color}
                                    </div>
                                    <div className="col-lg-12 p-0 mb-2" style={{ color: 'grey', fontSize: '12px' }} onClick={() => handleColorClick(color)}>
                                        {variants?.length} variants <FaChevronDown className="mx-2" />
                                    </div>
                                    {activeColor === color && (
                                        <div style={{ borderTop: '1px solid #eee' }} className="p-3">
                                            {variants.map((variant, variantIdx) => (
                                                <div key={variantIdx} className="mb-2">
                                                    {variant.options.map((option, optionIdx) => (
                                                        <span key={optionIdx}>
                                                            {Object.values(option)[0] == color ? '' : Object.values(option)[0]}
                                                            {Object.values(option)[0] == color ? '' : optionIdx !== variant.options.length - 1 && '-'}
                                                        </span>
                                                    ))}
                                                    <input
                                                        className={formstyles.form__field + ' col-lg-3 mx-1 ml-4'}
                                                        type="text"
                                                        value={variant.price}
                                                        onChange={(event) => handlePriceChange(color, variantIdx, event)}
                                                        placeholder="Enter price"
                                                    />
                                                    <input
                                                        className={formstyles.form__field + ' col-lg-3 mx-1'}
                                                        type="text"
                                                        value={variant.imageUrl}
                                                        onChange={(event) => handleImageChange(color, variantIdx, event)}
                                                        placeholder="Enter ImageUrl"
                                                    />
                                                    <input
                                                        className={formstyles.form__field + ' col-lg-3 mx-1'}
                                                        type="text"
                                                        value={variant.merchantSku}
                                                        onChange={(event) => handleMerchantSkuChange(color, variantIdx, event)}
                                                        placeholder="Enter SKU"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div class="col-lg-12 p-0 allcentered mt-3">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1'}
                                onClick={async () => {
                                    if (itempayload?.name?.length == 0) {
                                        NotificationManager.warning('Name Can not be empty', 'Warning');
                                    } else {
                                        // Assuming this code is inside an async function
                                        var tempOptions = [];
                                        var tempValues = [];
                                        var variantsTemp = [];
                                        options?.map((i, ii) => {
                                            var array = [];
                                            tempOptions.push(i.name);
                                            i?.values.map((m, mm) => {
                                                array.push({ value: m });
                                            });
                                            tempValues.push(array);
                                        });
                                        variants?.map((variant, varianIndex) => {
                                            var temp = {
                                                price: variant.price?.length == 0 ? null : variant.price,
                                                imageUrl: variant.imageUrl,
                                                merchantSku: variant.merchantSku,
                                            };
                                            variantsTemp.push(temp);
                                        });
                                        await setitempayload({ ...itempayload, variantNames: tempOptions, variantOptions: tempValues, variantOptionAttributes: variantsTemp });
                                        try {
                                            const { data } = await addItemMutation();

                                            // Handle `data` here
                                            console.log('Mutation response:', data);
                                        } catch (error) {
                                            // Handle error
                                            console.error('Mutation error:', error);
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
