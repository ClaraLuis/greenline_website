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
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
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
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const AddItem = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, chosenMerchantContext, isAuth } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationGQL, fetchMerchants, addCompoundItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const cookies = new Cookies();
    const [buttonLoading, setbuttonLoading] = useState(false);

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
    const [filteMerchants, setfilteMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filteMerchants);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2 d-flex justify-content-center">
            <div class="col-lg-7 p-0">
                <div class="row m-0 w-100">
                    <div class="col-lg-12 p-0 mb-3">
                        <div class={generalstyles.card + ' row m-0 w-100 p-1'}>
                            <div class="col-lg-12 my-3" style={{ fontWeight: 600 }}>
                                Main Info
                            </div>
                            {isAuth([1]) && (
                                <div class="col-lg-6">
                                    <SelectComponent
                                        title={'Merchant'}
                                        filter={filteMerchants}
                                        setfilter={setfilteMerchants}
                                        options={fetchMerchantsQuery}
                                        attr={'paginateMerchants'}
                                        label={'name'}
                                        value={'id'}
                                        removeAll={true}
                                        payload={itempayload}
                                        payloadAttr={'merchantId'}
                                        onClick={(option) => {
                                            if (option != undefined) {
                                                setitempayload({ ...itempayload, merchantId: option.id });
                                            } else {
                                                setitempayload({ ...itempayload, merchantId: undefined });
                                            }
                                        }}
                                    />
                                </div>
                            )}
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
                                            type={'number'}
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
                        </div>
                    </div>
                    <div class="col-lg-12 p-0 mb-3">
                        <div class={generalstyles.card + ' row m-0 w-100 p-2'}>
                            <div class="col-lg-12 my-3" style={{ fontWeight: 600 }}>
                                Item Options
                            </div>

                            {options.map((option, index) => (
                                <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="p-2 mb-2 row m-0 w-100 d-flex align-items-center" key={index}>
                                    <div style={{ position: 'relative' }} class={formstyles.form__field + ' col-lg-10'}>
                                        <input type="text" value={option.name} onChange={(event) => editOptionName(option.name, event.target.value)} />

                                        <Trash2 style={{ position: 'absolute', right: 10, top: '30%' }} onClick={() => deleteOption(option.name)} class=" text-danger text-dangerhover" />
                                    </div>
                                    {option.values.map((value, idx) => (
                                        <div class="col-lg-3 p-0 mt-2 mr-1" key={idx}>
                                            <div class="row m-0 w-100 allcentered">
                                                <div style={{ position: 'relative' }} class={formstyles.form__field + ' col-lg-10'}>
                                                    <input style={{ width: '100%' }} type="text" value={value} onChange={(event) => editValue(option.name, idx, event.target.value)} />
                                                    <Trash2
                                                        onClick={() => deleteValue(option.name, idx)}
                                                        style={{ position: 'absolute', right: 10, top: '30%' }}
                                                        class="text-danger text-dangerhover"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div class="col-lg-12">
                                        <div class="row m-0 w-100 d-flex align-items-center">
                                            <input
                                                type="text"
                                                class={formstyles.form__field + ' mt-2'}
                                                value={valueInputs[option.name] || ''}
                                                style={{ width: '50%', marginInlineEnd: '15px' }}
                                                onChange={(event) => handleValueChange(option.name, event)}
                                                placeholder="Enter value"
                                            />
                                            <button style={{ height: '30px' }} class={generalstyles.roundbutton + '  my-2 p-0'} onClick={() => addValue(option.name)}>
                                                Add Value
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div class="row m-0 w-100 d-flex align-items-center mb-3">
                                <input
                                    type="text"
                                    class={formstyles.form__field}
                                    style={{ width: '50%', marginInlineEnd: '15px' }}
                                    value={optionName}
                                    onChange={(event) => handleOptionChange(optionName, event)}
                                    placeholder="Enter option name"
                                />
                                <button style={{ height: '30px' }} class={generalstyles.roundbutton + ' p-0'} onClick={addOption}>
                                    Add Option
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 p-0 mb-3">
                        <div class={generalstyles.card + ' row m-0 w-100 p-1'}>
                            <div class="col-lg-12 my-3" style={{ fontWeight: 600 }}>
                                Item Variants
                            </div>
                            {groupedVariants?.length != 0 && (
                                <div class="col-lg-12 p-3">
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
                            )}
                        </div>
                    </div>

                    <div class="col-lg-12 p-0 allcentered mt-3">
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1'}
                            onClick={async () => {
                                setbuttonLoading(true);
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
                                    await setitempayload({
                                        ...itempayload,
                                        variantNames: tempOptions?.length == 0 ? undefined : tempOptions,
                                        variantOptions: tempValues?.length == 0 ? undefined : tempValues,
                                        variantOptionAttributes: variantsTemp?.length == 0 ? undefined : variantsTemp,
                                    });
                                    // await setitempayload({ ...itempayload, variantNames: tempOptions, variantOptions: tempValues, variantOptionAttributes: variantsTemp });
                                    try {
                                        const { data } = await addItemMutation();
                                        NotificationManager.success('Item added successfully!', 'Success!');
                                        history.push('/merchantitems');
                                        // Handle `data` here
                                        console.log('Mutation response:', data);
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
                                        // Handle error
                                        console.error('Mutation error:', error);
                                    }
                                }
                                setbuttonLoading(false);
                            }}
                            disabled={buttonLoading}
                        >
                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoading && <span>Add item</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddItem;
