import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { sha256 } from 'js-sha256';
import { Trash2 } from 'react-bootstrap-icons';
import { FaChevronDown } from 'react-icons/fa';
import { TbCameraPlus } from 'react-icons/tb';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import SelectComponent from '../../SelectComponent.js';

const AddItem = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setchosenItemContext, chosenItemContext, importedDataContext, isAuth, setpagetitle_context } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationGQL, fetchMerchants, addCompoundItem, updateMerchantItem, findOneItem, useLazyQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const cookies = new Cookies();
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [itemIndex, setitemIndex] = useState(0);
    const [itempayload, setitempayload] = useState({
        functype: 'add',
        merchansku: '',
        name: '',
        color: '',
        description: '',
        size: '',
        itemPrices: [],
        colorsarray: [],
        imageUrl: '',
        imageUrls: [],
        variantNames: [],
        variantOptions: [],
        variantOptionAttributes: [],
    });

    useEffect(() => {
        setpageactive_context('/merchantitems');
        setpagetitle_context('Merchant');
    }, []);
    // const variantsList = [];
    const [variantsList, setvariantsList] = useState([]);
    const [itemVariants, setitemVariants] = useState({});
    const [existWarning, setexistWarning] = useState(false);
    const [findOneItemLazyQuery] = useLazyQueryGQL(findOneItem());

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

    const [updateMerchantItemMutation] = useMutationGQL(updateMerchantItem(), {
        merchantId: 1,
        item: {
            id: parseInt(queryParameters?.get('id')),

            name: itempayload?.name,
            merchantSku: itempayload?.merchansku,
            description: itempayload?.description,
            imageUrl: itempayload?.imageUrl,
            price: itempayload?.price,
            variantNames: itempayload?.variantNames,
            variantOptions: itempayload?.variantOptions,
            variantOptionAttributes: itempayload?.variantOptionAttributes,
        },
    });

    class VariantName {
        constructor(name, variantOptions) {
            this.name = name;
            this.variantOptions = variantOptions !== null && variantOptions !== void 0 ? variantOptions : [];
        }
        addVariantOption(variantOption) {
            var _a;
            if ((_a = this.variantOptions) === null || _a === void 0 ? void 0 : _a.length) {
                this.variantOptions.push(variantOption);
            } else {
                this.variantOptions = [variantOption];
            }
        }
    }

    class VariantOption {
        constructor(value, colorCode) {
            this.value = value;
            this.colorCode = colorCode;
        }
    }
    class ItemVariant {
        constructor(variantOptions) {
            this.variantOptions = variantOptions;
            this.price = variantOptions?.price;
            this.imageUrl = variantOptions?.imageUrl;
            this.merchantSku = variantOptions?.merchantSku;
        }
    }
    function addVariantName(name) {
        if (name?.length) {
            if (variantsList?.length < 3) {
                var variantsListtemp = [...variantsList];
                if (variantsListtemp.find((e) => e.name.toLocaleLowerCase() === name.toLocaleLowerCase())) return false;
                variantsListtemp.push(new VariantName(name));
                setvariantsList([...variantsListtemp]);
                setOptionName('');
                return true;
            } else {
                NotificationManager.warning('Can not add more than three options', 'Warning!');
            }
        } else {
            NotificationManager.warning('Please enter option name first', 'Warning!');
        }
    }
    function addVariantOption(variantName, variantOption) {
        const variantsListtemp = [...variantsList];
        const variantIndex = variantsListtemp.findIndex((e) => e.name.toLocaleLowerCase() === variantName.toLocaleLowerCase());

        if (variantIndex === -1) {
            return false;
        }

        const updatedVariant = new VariantName(
            variantsListtemp[variantIndex].name,
            [...variantsListtemp[variantIndex].variantOptions], // Copy the existing options
        );
        updatedVariant.addVariantOption(variantOption);
        variantsListtemp[variantIndex] = updatedVariant;
        const itemVariantsTemp = createVariantOptions1([], 0, variantsListtemp);
        const itemVariantsObjects = [];
        for (const combination of itemVariantsTemp) {
            itemVariantsObjects.push(new ItemVariant(combination));
        }
        // alert(itemVariantsObjects?.length);
        if (itemVariantsObjects?.length <= 100) {
            setvariantsList(variantsListtemp);
            var valueInputsTemp = { ...valueInputs };
            valueInputsTemp[variantName] = '';
            setValueInputs({ ...valueInputsTemp });
        } else {
            NotificationManager.warning('Variants cannot exceed 100', '');
        }
        return true;
    }
    function createVariantOptions(variantOptions, index) {
        if (!variantsList?.length || !variantsList[index].variantOptions?.length) {
            return [variantOptions];
        } else {
            let variantOptionsList = [];
            if (index === variantsList.length - 1) {
                for (const variantOption of variantsList[index].variantOptions) {
                    variantOptionsList.push([...variantOptions, variantOption]);
                }
            } else {
                for (const variantOption of variantsList[index].variantOptions) {
                    variantOptionsList = [...variantOptionsList, ...createVariantOptions([...variantOptions, variantOption], index + 1)];
                }
            }
            return variantOptionsList;
        }
    }

    function createVariantOptions1(variantOptions, index, variantsList) {
        if (!variantsList?.length || !variantsList[index].variantOptions?.length) {
            return [variantOptions];
        } else {
            let variantOptionsList = [];
            if (index === variantsList.length - 1) {
                for (const variantOption of variantsList[index].variantOptions) {
                    variantOptionsList.push([...variantOptions, variantOption]);
                }
            } else {
                for (const variantOption of variantsList[index].variantOptions) {
                    variantOptionsList = [...variantOptionsList, ...createVariantOptions1([...variantOptions, variantOption], index + 1, variantsList)];
                }
            }
            return variantOptionsList;
        }
    }

    function findSimilar(oldList, item) {
        var similars = [...oldList];
        for (const option of item.variantOptions) {
            if (!similars?.length) return similars;

            similars = similars.filter((e) => e?.variantOptions?.find((e) => e.value == option.value));
        }
        return similars;
    }

    const [options, setOptions] = useState([]);
    const [optionName, setOptionName] = useState('');
    const [valueInputs, setValueInputs] = useState({});
    const [variants, setVariants] = useState([]);

    const deleteOption = (optionIndex) => {
        var updatedOptions = [...variantsList];
        updatedOptions.splice(optionIndex, 1);
        setvariantsList(updatedOptions);
    };

    const deleteValue = (optionIndex, valueIndex) => {
        var updatedOptions = [...variantsList];
        updatedOptions[optionIndex].variantOptions.splice(valueIndex, 1);
        setvariantsList(updatedOptions);
    };

    const editOptionName = (optionIndex, newName) => {
        var updatedOptions = [...variantsList];
        updatedOptions[optionIndex].name = newName;
        setvariantsList(updatedOptions);
    };

    const editValue = (optionIndex, valueIndex, newValue) => {
        var updatedOptions = [...variantsList];
        updatedOptions[optionIndex].variantOptions[valueIndex].value = newValue;
        setvariantsList(updatedOptions);
    };

    const handlePriceChange = (color, variantIndex, event) => {
        const newPrice = event.target.value;
        setitemVariants((prevItemVariants) => {
            const updatedVariants = { ...prevItemVariants };
            const colorVariants = updatedVariants[color]?.variants || [];
            if (colorVariants[variantIndex]) {
                colorVariants[variantIndex].price = newPrice;
            }
            return {
                ...updatedVariants,
                [color]: { ...updatedVariants[color], variants: colorVariants },
            };
        });
    };

    // Handle image URL change
    const handleImageChange = (color, variantIndex, event) => {
        const newImageUrl = event?.target?.files[0];
        setitemVariants((prevItemVariants) => {
            const updatedVariants = { ...prevItemVariants };
            const colorVariants = updatedVariants[color]?.variants || [];
            if (colorVariants[variantIndex]) {
                colorVariants[variantIndex].imageUrl = newImageUrl;
                colorVariants[variantIndex].imageUrlPrev = URL.createObjectURL(event?.target?.files[0]);
            }
            return {
                ...updatedVariants,
                [color]: { ...updatedVariants[color], variants: colorVariants },
            };
        });
    };

    const handleMerchantSkuChange = (color, variantIndex, event) => {
        const newMerchantSku = event.target.value;
        setitemVariants((prevItemVariants) => {
            const updatedVariants = { ...prevItemVariants };
            const colorVariants = updatedVariants[color]?.variants || [];
            if (colorVariants[variantIndex]) {
                colorVariants[variantIndex].merchantSku = newMerchantSku;
            }
            return {
                ...updatedVariants,
                [color]: { ...updatedVariants[color], variants: colorVariants },
            };
        });
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

    const [filteMerchants, setfilteMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filteMerchants);

    useEffect(() => {
        const itemVariantsTemp = createVariantOptions([], 0);
        const itemVariantsObjects = [];
        for (const combination of itemVariantsTemp) {
            itemVariantsObjects.push(new ItemVariant(combination));
        }

        const groupedByFirstValue = itemVariantsObjects
            ?.filter((e) => e.variantOptions?.length > 0)
            .reduce((acc, item) => {
                const firstValue = item.variantOptions[0].value;
                const remainingOptions = item.variantOptions.slice(1);

                if (!acc[firstValue]) {
                    acc[firstValue] = { variants: [] };
                }

                acc[firstValue].variants.push({ variantOptions: remainingOptions });
                return acc;
            }, {});

        setitemVariants((prevItemVariants) => {
            const newKeys = Object.keys(groupedByFirstValue);
            const groupedByFirstValueTemp = groupedByFirstValue;
            for (const key of newKeys) {
                const oldList = prevItemVariants[key]?.variants;
                if (!oldList) continue;

                const newList = groupedByFirstValue[key].variants;
                newList.forEach((item, index) => {
                    const similar = findSimilar(oldList, item);
                    if (similar?.length) {
                        groupedByFirstValueTemp[key].variants[index] = similar[0];
                    }
                });
            }
            console.log('Item Variants112:', groupedByFirstValueTemp); // Debug log

            return groupedByFirstValueTemp;
        });
    }, [variantsList]);

    useEffect(async () => {
        if (queryParameters?.get('import') === 'true') {
            if (!importedDataContext?.length) {
                history.push('/merchantitems');
                return;
            }
            const importedData = importedDataContext[itemIndex] || {};
            console.log('Imported Data:', importedData); // Debug log

            const variantNames = importedData.variantNames || [];
            console.log('Variant Names:', variantNames); // Debug log

            const itemVariants = importedData.variantOptionAttributes?.reduce((acc, attr) => {
                console.log('Processing Attribute:', attr); // Debug log

                const color = attr.variantOptions[0]?.value;
                const remainingOptions = attr.variantOptions.slice(1).map((option) => ({
                    value: option.value,
                    colorCode: option.colorHex || '',
                }));

                if (color) {
                    if (!acc[color]) {
                        acc[color] = { variants: [] };
                    }

                    acc[color].variants.push({
                        variantOptions: remainingOptions,
                        price: attr.price || '', // Ensure price is included
                        imageUrl: attr.imageUrl || '', // Ensure imageUrl is included
                        merchantSku: attr.sku || '', // Ensure merchantSku is included
                    });
                }

                return acc;
            }, {});
            const extractData = (data) => {
                const result = [];

                // Iterate over each key in the data object
                Object.keys(data).forEach((key) => {
                    const variants = data[key].variants;

                    // Process each variant
                    variants.forEach(async (variant) => {
                        const { price, imageUrl, merchantSku } = variant;

                        if (price || imageUrl || merchantSku) {
                            result.push({
                                price,
                                imageUrl,
                                merchantSku,
                            });
                        }
                    });
                });

                return result;
            };

            const updatedVariantOptions = variantNames.map((e) =>
                e.variantOptions.map((option) => ({
                    value: option.value,
                    colorCode: option.colorHex || '',
                })),
            );
            var itemtemp = {
                merchansku: importedData?.productSku,
                name: importedData?.productName,
                description: importedData?.productDescrioption,
                price: importedData?.defaultPrice,
                imageUrl: importedData?.imageUrl,
                variantNames: variantNames.map((e) => e.name) ?? undefined,
                variantOptions: updatedVariantOptions ?? undefined,
                variantOptionAttributes: extractData(itemVariants),
            };
            const { imageUrl, variantOptionAttributes, ...itemWithoutImageUrls } = itemtemp;
            const itemWithoutVariantOptionImageUrls = {
                ...itemWithoutImageUrls,
                variantOptionAttributes: variantOptionAttributes.map(({ imageUrl, ...rest }) => rest),
            };

            let tempproductsarray = [];
            try {
                const importedItemsCookie = cookies.get('ImportedItems') ?? [];
                tempproductsarray = importedItemsCookie;
            } catch (error) {
                console.warn('Error parsing ImportedItems cookie:', error);
                tempproductsarray = [];
            }
            // Hash the item without variant option image URLs
            const itemHash = sha256(JSON.stringify(itemWithoutVariantOptionImageUrls));

            // Check if the hash already exists in the array
            const exist = tempproductsarray.includes(itemHash);
            setexistWarning(exist);

            console.log('Item Variants:', itemVariants); // Debug log

            setitempayload({
                merchansku: importedData?.productSku,
                name: importedData?.productName,
                description: importedData?.productDescrioption,
                price: importedData?.defaultPrice,
                imageUrl: importedData?.imageUrl,
            });

            setitemVariants(itemVariants);

            setvariantsList(variantNames);
        }
    }, [importedDataContext, itemIndex]);
    useEffect(async () => {
        if (window.location.pathname == '/updateitem') {
            if (JSON.stringify(chosenItemContext) == '{}') {
                try {
                    var { data } = await findOneItemLazyQuery({
                        variables: {
                            input: {
                                id: parseInt(queryParameters?.get('id')),
                            },
                        },
                    });
                    if (data?.findOneItem) {
                        setchosenItemContext(data?.findOneItem);
                    }
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
            }
            if (chosenItemContext?.itemVariants) {
                const variantMap = new Map();

                chosenItemContext.itemVariants.forEach((itemVariant) => {
                    itemVariant.selectedOptions.forEach((option) => {
                        const variantName = option.variantName.name;
                        const variantOption = option.variantOption;
                        if (variantMap.has(variantName)) {
                            const existingOptions = variantMap.get(variantName);
                            const optionExists = existingOptions.some((opt) => opt.value === variantOption.value);
                            if (!optionExists) {
                                existingOptions.push(new VariantOption(variantOption.value, variantOption.colorCode));
                                variantMap.set(variantName, existingOptions);
                            }
                        } else {
                            variantMap.set(variantName, [new VariantOption(variantOption.value, variantOption.colorCode)]);
                        }
                    });
                });

                const variantNamesArray = Array.from(variantMap, ([name, variantOptions]) => new VariantName(name, variantOptions));
                setvariantsList(variantNamesArray);

                // Prepare item payload
                var itemtemp = {
                    name: chosenItemContext?.name,
                    description: chosenItemContext?.description,
                    imageUrl: chosenItemContext?.imageUrl,
                    imagepreview: chosenItemContext?.imageUrl,
                    merchantId: chosenItemContext?.merchantId,
                };
                setitempayload(itemtemp);

                // Setting variant price, SKU, and image URL
                const itemVariantsTemp = createVariantOptions1([], 0, variantNamesArray); // Assuming this creates combinations
                const itemVariantsObjects = [];

                for (const combination of itemVariantsTemp) {
                    itemVariantsObjects.push(new ItemVariant(combination));
                }

                // Map prices, SKUs, and image URLs
                chosenItemContext.itemVariants.forEach((itemVariant) => {
                    const { price, sku, imageUrl } = itemVariant;
                    const matchingVariant = itemVariantsObjects.find((iv) => {
                        return iv.variantOptions.every((opt, idx) => opt.value === itemVariant.selectedOptions[idx]?.variantOption.value);
                    });
                    if (matchingVariant) {
                        matchingVariant.price = price;
                        matchingVariant.merchantSku = sku;
                        matchingVariant.imageUrlPrev = imageUrl;
                        matchingVariant.imageUrl = imageUrl;
                    }
                });

                // Group by the first variant option value
                const groupedByFirstValue = itemVariantsObjects
                    ?.filter((e) => e.variantOptions?.length > 0)
                    .reduce((acc, item) => {
                        const firstValue = item.variantOptions[0].value;
                        const remainingOptions = item.variantOptions.slice(1);

                        if (!acc[firstValue]) {
                            acc[firstValue] = { variants: [] };
                        }

                        acc[firstValue].variants.push({ ...item, variantOptions: remainingOptions });
                        return acc;
                    }, {});

                setitemVariants((prevItemVariants) => {
                    const newKeys = Object.keys(groupedByFirstValue);
                    const groupedByFirstValueTemp = groupedByFirstValue;

                    for (const key of newKeys) {
                        const oldList = prevItemVariants[key]?.variants;
                        if (!oldList) continue;

                        const newList = groupedByFirstValue[key].variants;
                        newList.forEach((item, index) => {
                            const similar = findSimilar(oldList, item);
                            if (similar?.length) {
                                groupedByFirstValueTemp[key].variants[index] = similar[0];
                            }
                        });
                    }
                    console.log('Item Variants:', groupedByFirstValueTemp); // Debug log

                    return groupedByFirstValueTemp;
                });
            }
        }
    }, [chosenItemContext]);

    const uploadImage = async (img) => {
        const getoken = async () => {
            var token = await cookies.get('accessToken');
            return token;
        };
        var tokenasy = await getoken();

        const axiosheaders = {
            Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InZrUHp4Y2kwdmNYUkhHNWY4Z2hDQU5XYVZybDIiLCJodWJJZCI6MSwiaW52ZW50b3J5SWQiOm51bGwsIm1lcmNoYW50SWQiOjEsInR5cGUiOiJjb3VyaWVyIiwicm9sZXMiOlsxXSwiaWF0IjoxNzA2ODE0NzQzLCJleHAiOjE4MDY4MTY1NDN9.tc_RflPAJD7CBcjPxKmM3ykOzdt0grVCDpiCTUpITps',
        };
        // axiosheaders['Authorization'] = 'Bearer ' + tokenasy;
        const formData = new FormData();
        formData.append('file', img);
        formData.append('isPublic', true);
        formData.append('merchantId', itempayload?.merchantId);

        try {
            const response = await axios({
                method: 'post',
                url: (process.env.REACT_APP_DEV_MODE === 'true' ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL) + 'aws-bucket/file',
                data: formData,
                headers: axiosheaders,
            });

            console.log('resp:', response?.data?.url);
            return response?.data?.url; // Return the key
        } catch (error) {
            console.log(error);
            NotificationManager.error('', 'Error');
            throw error; // Throw error so you can handle it in the calling function if needed
        }
    };
    return (
        <div class="row m-0 w-100 p-md-2 pt-2 d-flex justify-content-center">
            <div class="col-lg-7 p-0">
                <div class="row m-0 w-100">
                    {queryParameters.get('import') == 'true' && importedDataContext?.length && (
                        <div class={' col-lg-12 p-0 mb-0'} style={{ fontWeight: 700, fontSize: '23px', position: 'sticky', top: 75, zIndex: 100 }}>
                            <div class={generalstyles.card + ' row m-0 w-100 p-2 d-flex justify-content-between'}>
                                <div class="col-lg-12 p-0">
                                    <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                        <span>
                                            Import item{' '}
                                            <span class="mx-1 text-primary" style={{ fontSize: '20px' }}>
                                                {itemIndex + 1}/{importedDataContext?.length}
                                            </span>
                                        </span>
                                        <div>
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
                                                        const itemVariantsTemp = createVariantOptions([], 0);
                                                        const itemVariantsObjects = [];
                                                        for (const combination of itemVariantsTemp) {
                                                            itemVariantsObjects.push(new ItemVariant(combination));
                                                        }

                                                        // alert(JSON.stringify(variantsList));
                                                        const updatedVariantOptions = variantsList.map((e) =>
                                                            e.variantOptions.map((option) => ({
                                                                value: option.value,
                                                                colorCode: option.colorHex || '',
                                                            })),
                                                        );
                                                        var resp = undefined;
                                                        if (itempayload.image) {
                                                            resp = await uploadImage(itempayload.image);
                                                        }
                                                        // alert(resp);
                                                        const extractData = async (data) => {
                                                            const result = [];

                                                            // Iterate over each key in the data object
                                                            await Promise.all(
                                                                Object.keys(data).map(async (key) => {
                                                                    const variants = data[key].variants;

                                                                    // Process each variant
                                                                    await Promise.all(
                                                                        variants.map(async (variant) => {
                                                                            const { price, imageUrl, merchantSku } = variant;
                                                                            let resp1 = undefined;
                                                                            if (imageUrl) {
                                                                                resp1 = await uploadImage(imageUrl);
                                                                            }

                                                                            if (price || merchantSku) {
                                                                                result.push({
                                                                                    price,
                                                                                    imageUrl: resp1,
                                                                                    merchantSku,
                                                                                });
                                                                            }
                                                                        }),
                                                                    );
                                                                }),
                                                            );

                                                            return result;
                                                        };

                                                        await setitempayload({
                                                            ...itempayload,
                                                            imageUrl: resp,
                                                            variantNames: variantsList.map((e) => e.name) ?? undefined,
                                                            variantOptions: updatedVariantOptions ?? undefined,
                                                            variantOptionAttributes: await extractData(itemVariants),
                                                        });

                                                        var itemtemp = {
                                                            ...itempayload,
                                                            variantNames: variantsList.map((e) => e.name) ?? undefined,
                                                            variantOptions: updatedVariantOptions ?? undefined,
                                                            variantOptionAttributes: await extractData(itemVariants),
                                                        };
                                                        const { imageUrl, variantOptionAttributes, ...itemWithoutImageUrls } = itemtemp;
                                                        const itemWithoutVariantOptionImageUrls = {
                                                            ...itemWithoutImageUrls,
                                                            variantOptionAttributes: variantOptionAttributes.map(({ imageUrl, ...rest }) => rest),
                                                        };

                                                        let tempproductsarray = [];
                                                        try {
                                                            const importedItemsCookie = cookies.get('ImportedItems') ?? [];
                                                            tempproductsarray = importedItemsCookie;
                                                        } catch (error) {
                                                            console.warn('Error parsing ImportedItems cookie:', error);
                                                            tempproductsarray = [];
                                                        }

                                                        // Hash the item without variant option image URLs
                                                        const itemHash = sha256(JSON.stringify(itemWithoutVariantOptionImageUrls));

                                                        // Check if the hash already exists in the array
                                                        const exist = tempproductsarray.includes(itemHash);

                                                        if (exist) {
                                                            if (window.confirm('This item was previously added. Are you sure you want to duplicate it?')) {
                                                                try {
                                                                    const { data } = await addItemMutation();

                                                                    NotificationManager.success('Item added successfully!', 'Success!');

                                                                    if (importedDataContext?.length) {
                                                                        // Add the new hash to the array
                                                                        tempproductsarray.push(itemHash);

                                                                        // Update the cookie with the new array of hashes
                                                                        cookies.set('ImportedItems', JSON.stringify(tempproductsarray), {
                                                                            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                                                                            path: '/',
                                                                        });

                                                                        if (itemIndex < importedDataContext.length - 1) {
                                                                            setitemIndex(itemIndex + 1);
                                                                        } else {
                                                                            history.push('/merchantitems');
                                                                        }
                                                                    } else {
                                                                        history.push('/merchantitems');
                                                                    }

                                                                    console.log('Mutation response:', data);
                                                                } catch (error) {
                                                                    handleMutationError(error);
                                                                }
                                                            }
                                                        } else {
                                                            try {
                                                                const { data } = await addItemMutation();

                                                                NotificationManager.success('Item added successfully!', 'Success!');

                                                                if (importedDataContext?.length) {
                                                                    tempproductsarray.push(itemHash);

                                                                    // Update the cookie with the new array of hashes
                                                                    cookies.set('ImportedItems', JSON.stringify(tempproductsarray), {
                                                                        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                                                                        path: '/',
                                                                    });

                                                                    if (itemIndex < importedDataContext.length - 1) {
                                                                        setitemIndex(itemIndex + 1);
                                                                    } else {
                                                                        history.push('/merchantitems');
                                                                    }
                                                                } else {
                                                                    history.push('/merchantitems');
                                                                }

                                                                console.log('Mutation response:', data);
                                                            } catch (error) {
                                                                handleMutationError(error);
                                                            }
                                                        }

                                                        function handleMutationError(error) {
                                                            let errorMessage = 'An unexpected error occurred';
                                                            if (error.graphQLErrors?.length > 0) {
                                                                errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                            } else if (error.networkError) {
                                                                errorMessage = error.networkError.message || errorMessage;
                                                            } else if (error.message) {
                                                                errorMessage = error.message;
                                                            }

                                                            NotificationManager.warning(errorMessage, 'Warning!');
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
                                            {importedDataContext?.length && (
                                                <button
                                                    style={{ height: '35px' }}
                                                    class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                                    onClick={() => {
                                                        setitemIndex(itemIndex + 1);
                                                    }}
                                                >
                                                    Skip
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {window.location.pathname == '/updateitem' && (
                        <div class={' col-lg-12 p-0 mb-0'} style={{ fontWeight: 700, fontSize: '23px', position: 'sticky', top: 75, zIndex: 100 }}>
                            <div class={generalstyles.card + ' row m-0 w-100 p-2 d-flex justify-content-between'}>
                                <div class="col-lg-12 p-0">
                                    <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                        <div>
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
                                                        const itemVariantsTemp = createVariantOptions([], 0);
                                                        const itemVariantsObjects = [];
                                                        for (const combination of itemVariantsTemp) {
                                                            itemVariantsObjects.push(new ItemVariant(combination));
                                                        }

                                                        // alert(JSON.stringify(variantsList));
                                                        const updatedVariantOptions = variantsList.map((e) =>
                                                            e.variantOptions.map((option) => ({
                                                                value: option.value,
                                                                colorCode: option.colorHex || '',
                                                            })),
                                                        );
                                                        var resp = undefined;

                                                        if (itempayload.image) {
                                                            const isHttpLink = /^https?:\/\//i.test(itempayload.image);

                                                            if (!isHttpLink) {
                                                                resp = await uploadImage(itempayload.image);
                                                            } else {
                                                                resp = itempayload.image;
                                                            }
                                                        }
                                                        // alert(resp);
                                                        const extractData = async (data) => {
                                                            const result = [];

                                                            // Iterate over each key in the data object
                                                            await Promise.all(
                                                                Object.keys(data).map(async (key) => {
                                                                    const variants = data[key].variants;

                                                                    // Process each variant
                                                                    await Promise.all(
                                                                        variants.map(async (variant) => {
                                                                            const { price, imageUrl, merchantSku } = variant;
                                                                            let resp1 = undefined;

                                                                            if (imageUrl) {
                                                                                const isHttpLink = /^https?:\/\//i.test(imageUrl);

                                                                                if (!isHttpLink) {
                                                                                    resp1 = await uploadImage(imageUrl);
                                                                                } else {
                                                                                    resp1 = imageUrl;
                                                                                }
                                                                            }
                                                                            if (price || merchantSku) {
                                                                                result.push({
                                                                                    price,
                                                                                    imageUrl: resp1,
                                                                                    merchantSku,
                                                                                });
                                                                            }
                                                                        }),
                                                                    );
                                                                }),
                                                            );

                                                            return result;
                                                        };

                                                        await setitempayload({
                                                            ...itempayload,
                                                            imageUrl: resp,
                                                            variantNames: variantsList.map((e) => e.name) ?? undefined,
                                                            variantOptions: updatedVariantOptions ?? undefined,
                                                            variantOptionAttributes: await extractData(itemVariants),
                                                        });

                                                        // Hash the item without variant option image URLs

                                                        // Check if the hash already exists in the array

                                                        try {
                                                            await updateMerchantItemMutation();

                                                            NotificationManager.success('Item Updated successfully!', 'Success!');

                                                            try {
                                                                var { data } = await findOneItemLazyQuery({
                                                                    variables: {
                                                                        input: {
                                                                            id: parseInt(queryParameters?.get('id')),
                                                                        },
                                                                    },
                                                                });
                                                                if (data?.findOneItem) {
                                                                    setchosenItemContext(data?.findOneItem);
                                                                }
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

                                                            console.log('Mutation response:', data);
                                                        } catch (error) {
                                                            handleMutationError(error);
                                                        }

                                                        function handleMutationError(error) {
                                                            let errorMessage = 'An unexpected error occurred';
                                                            if (error.graphQLErrors?.length > 0) {
                                                                errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                            } else if (error.networkError) {
                                                                errorMessage = error.networkError.message || errorMessage;
                                                            } else if (error.message) {
                                                                errorMessage = error.message;
                                                            }

                                                            NotificationManager.warning(errorMessage, 'Warning!');
                                                            console.error('Mutation error:', error);
                                                        }
                                                    }
                                                    setbuttonLoading(false);
                                                }}
                                                disabled={buttonLoading}
                                            >
                                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                {!buttonLoading && <span>Update item</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {existWarning && <div class="col-lg-12 p-0 mb-3 text-warning">*This product already added</div>}

                    <div class="col-lg-12 p-0 mb-3">
                        <div class={generalstyles.card + ' row m-0 w-100 p-1'}>
                            <div class="col-lg-12 my-3" style={{ fontWeight: 600 }}>
                                Main Info
                            </div>
                            <div class="col-lg-12 mb-3">
                                <div class="row m-0 w-100  ">
                                    <div class={generalstyles.avatar_upload + ' text-center justify-content-center align-items-center m-auto '}>
                                        <div class={generalstyles.avatar_edit}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="updatecompanybanner"
                                                id="updatecompanybanner"
                                                hidden
                                                onChange={(event) => {
                                                    var temp = { ...itempayload };

                                                    temp.imagepreview = URL.createObjectURL(event?.target?.files[0]);
                                                    temp.image = event?.target?.files[0];

                                                    setitempayload({ ...temp });
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                        <label for="updatecompanybanner" class={generalstyles.avatar_preview + ' pointer '}>
                                            <div class={generalstyles.imgpreviewtxt + ' text-capitalize'}>
                                                <i class="">
                                                    <TbCameraPlus size={25} />
                                                </i>
                                                <br />
                                                upload image
                                            </div>
                                            <img
                                                src={itempayload?.imagepreview}
                                                class={itempayload?.imagepreview == '' ? 'd-none' : 'd-block'}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        </label>
                                    </div>
                                    {/* <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label class={formstyles.form__label}>Image URL</label>
                                        <input
                                            type={'text'}
                                            class={formstyles.form__field}
                                            value={itempayload.imageUrl}
                                            onChange={(event) => {
                                                setitempayload({ ...itempayload, imageUrl: event.target.value });
                                            }}
                                        />
                                    </div> */}
                                </div>
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
                            {variantsList.map((option, index) => (
                                <div style={{ border: '1px solid #eee', borderRadius: '0.25rem' }} class="p-2 mb-2 row m-0 w-100 d-flex align-items-center" key={index}>
                                    <div style={{ position: 'relative' }} class={formstyles.form__field + ' col-lg-10'}>
                                        <input type="text" value={option.name} onChange={(event) => editOptionName(index, event.target.value)} />

                                        <Trash2 style={{ position: 'absolute', right: 10, top: '30%' }} onClick={() => deleteOption(index)} class=" text-danger text-dangerhover" />
                                    </div>
                                    {option.variantOptions.map((value, idx) => (
                                        <div class="col-lg-3 p-0 mt-2 mr-1" key={idx}>
                                            <div class="row m-0 w-100 allcentered">
                                                <div style={{ position: 'relative' }} class={formstyles.form__field + ' col-lg-10'}>
                                                    <input style={{ width: '100%' }} type="text" value={value?.value} onChange={(event) => editValue(index, idx, event.target.value)} />
                                                    <Trash2 onClick={() => deleteValue(index, idx)} style={{ position: 'absolute', right: 10, top: '30%' }} class="text-danger text-dangerhover" />
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
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addVariantOption(option.name, new VariantOption(valueInputs[option.name]));
                                                    }
                                                }}
                                                onChange={(event) => handleValueChange(option.name, event)}
                                                placeholder="Enter value"
                                            />
                                            <button
                                                style={{ height: '30px' }}
                                                class={generalstyles.roundbutton + '  my-2 p-0'}
                                                onClick={() => addVariantOption(option.name, new VariantOption(valueInputs[option.name]))}
                                            >
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addVariantName(event?.target.value);
                                        }
                                    }}
                                    onChange={(event) => {
                                        handleOptionChange(optionName, event);
                                    }}
                                    placeholder="Enter option name"
                                />
                                <button
                                    style={{ height: '30px' }}
                                    class={generalstyles.roundbutton + ' p-0'}
                                    onClick={() => {
                                        addVariantName(optionName);
                                    }}
                                >
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
                            {itemVariants?.length != 0 && (
                                <div class="col-lg-12 p-3">
                                    {Object.entries(itemVariants).map(([color, variants], colorIndex) => (
                                        <div key={colorIndex} style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '13px', cursor: 'pointer' }} className="p-3 mb-2">
                                            <div class="col-lg-12 p-0">
                                                <div class="row m-0 w-100">
                                                    <div className="col-lg-10 p-0" onClick={() => handleColorClick(color)}>
                                                        {color}
                                                    </div>
                                                    <div className="col-lg-2 p-0 mb-2" style={{ color: 'grey', fontSize: '12px' }} onClick={() => handleColorClick(color)}>
                                                        {/* {JSON.stringify(variants?.variants)} */}
                                                        {variants?.variants?.length} variants <FaChevronDown className="mx-2" />
                                                    </div>
                                                </div>
                                            </div>
                                            {activeColor === color && (
                                                <div style={{ borderTop: '1px solid #eee' }} className="p-3">
                                                    {variants?.variants.map((variant, variantIdx) => (
                                                        <div key={variantIdx} className="mb-2">
                                                            {variant.variantOptions.map((option, optionIdx) => (
                                                                <span key={optionIdx}>
                                                                    {option?.value}
                                                                    {optionIdx !== variant.variantOptions.length - 1 && '-'}
                                                                </span>
                                                            ))}
                                                            <div class="col-lg-12 mb-3">
                                                                <div class="row m-0 w-100  ">
                                                                    <div class={generalstyles.avatar_upload + ' text-center justify-content-center align-items-center m-auto '}>
                                                                        <div class={generalstyles.avatar_edit}>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                name="updatecompanybanner"
                                                                                id={'updatecompanybanner' + variantIdx}
                                                                                hidden
                                                                                onChange={(event) => handleImageChange(color, variantIdx, event)}
                                                                                style={{ display: 'none' }}
                                                                            />
                                                                        </div>
                                                                        <label for={'updatecompanybanner' + variantIdx} class={generalstyles.avatar_preview + ' pointer '}>
                                                                            <div class={generalstyles.imgpreviewtxt + ' text-capitalize'}>
                                                                                <i class="">
                                                                                    <TbCameraPlus size={25} />
                                                                                </i>
                                                                                <br />
                                                                                upload image
                                                                            </div>
                                                                            <img
                                                                                src={variant.imageUrlPrev}
                                                                                class={variant.imageUrlPrev == '' ? 'd-none' : 'd-block'}
                                                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

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
                </div>
            </div>
        </div>
    );
};
export default AddItem;
