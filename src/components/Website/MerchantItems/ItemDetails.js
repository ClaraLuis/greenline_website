import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { Modal } from 'react-bootstrap';
import SkuPrint from './SkuPrint.js';

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
import { IoMdClose } from 'react-icons/io';
import ItemsTable from './ItemsTable.js';

const ItemDetails = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setchosenItemContext, chosenItemContext, importedDataContext, isAuth, setpagetitle_context } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationGQL, fetchMerchants, addCompoundItem, updateMerchantItem, findOneItem, useLazyQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const cookies = new Cookies();
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
    const [variantModal, setvariantModal] = useState(true);

    useEffect(() => {
        setpageactive_context('/merchantitems');
        setpagetitle_context('Merchant');
    }, []);
    // const variantsList = [];
    const [variantsList, setvariantsList] = useState([]);
    const [itemVariants, setitemVariants] = useState({});
    const [chosenvariant, setchosenvariant] = useState(undefined);
    const [selectedVariants, setselectedVariants] = useState([]);

    const [findOneItemLazyQuery] = useLazyQueryGQL(findOneItem());
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
    useEffect(async () => {
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

        if (chosenItemContext?.itemVariants?.length) {
            setchosenvariant(chosenItemContext?.itemVariants[0]);
        } else {
            setchosenvariant(undefined);
        }
    }, [chosenItemContext]);
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
    useEffect(async () => {
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
    }, [chosenItemContext]);
    // Generalized function to find the matching variant index
    const findMatchingVariantIndex = (chosenarr) => {
        // Iterate over all the keys (like "red", "green") in the itemvariants object
        for (const key in itemVariants) {
            const variants = itemVariants[key]?.variants || [];

            // Iterate through each variant for the current color/key (e.g., "red")
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                const options = variant.variantOptions;

                // Check if all chosen options match the variant's options
                const isMatch = chosenarr.map((chosen) => {
                    // Look for a matching variant option based on the chosen option and value
                    const matchedOption = options.map((option) => {
                        alert(JSON.stringify(option));

                        if (option.value === chosen.value) {
                            alert(JSON.stringify(option));
                        }
                    });
                    return matchedOption;
                });

                // If all options match, return the variant index and other details
                if (isMatch) {
                    return { index: i, colorKey: key, variant };
                }
            }
        }

        // Return null if no match is found
        return null;
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2 d-flex justify-content-center">
            <div class="col-lg-12 px-4">
                <div class={generalstyles.card + ' row m-0 w-100 d-flex justify-content-end'}>
                    <button
                        onClick={() => {
                            setselectedVariants([]);

                            setvariantModal({ open: true, data: chosenItemContext?.itemVariants });
                        }}
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + '   mx-2'}
                    >
                        Print SKUS
                    </button>
                    <button
                        onClick={() => {
                            history.push(`/updateitem?id=` + chosenItemContext.id);
                        }}
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + '  '}
                    >
                        Edit
                    </button>
                </div>
            </div>
            <div class="col-lg-12  px-4">
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div className="col-lg-5">
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-3">
                                <div
                                    style={{
                                        height: '600px',
                                        width: '100%',
                                    }}
                                >
                                    <img src={chosenvariant?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                            </div>
                            <div class="col-lg-12 p-0 position-relative">
                                {/* Left arrow */}
                                <button
                                    class="scroll-arrow-left"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '0',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                    }}
                                    onClick={() => {
                                        document.getElementById('scrollableRow').scrollLeft -= 100;
                                    }}
                                >
                                    ←
                                </button>

                                {/* Scrollable row */}
                                <div class="row m-0 w-100" id="scrollableRow" style={{ flexWrap: 'nowrap', overflow: 'scroll', scrollBehavior: 'smooth' }}>
                                    {chosenItemContext?.itemVariants?.map((item, index) => {
                                        var selected = false;
                                        if (chosenvariant?.id == item?.id) {
                                            selected = true;
                                        }
                                        return (
                                            <div class="col-lg-3 mb-3">
                                                <div
                                                    onClick={() => {
                                                        setchosenvariant(item);
                                                    }}
                                                    style={{ height: '75px', width: '100%', background: selected ? 'grey' : '', cursor: 'pointer', transition: 'all 0.4s' }}
                                                >
                                                    <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={item?.imageUrl} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Right arrow */}
                                <button
                                    class="scroll-arrow-right"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '0',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                    }}
                                    onClick={() => {
                                        document.getElementById('scrollableRow').scrollLeft += 100;
                                    }}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7 pl-3">
                        <div class="row m-0 w-100">
                            <div class="col-lg-12">
                                <span style={{ fontSize: '14px', color: 'var(--primary)' }}>{chosenvariant?.merchantSku}</span>
                            </div>
                            <div class="col-lg-12 mb-3 mt-1">
                                <span style={{ fontSize: '18px', fontWeight: 700 }}>
                                    {chosenItemContext?.name} - {chosenvariant?.name}
                                </span>
                            </div>
                            <div class="col-lg-12 mb-3 ">
                                <span style={{ fontSize: '18px', fontWeight: 700 }}>{'Price: '}</span>
                                <span style={{ fontSize: '18px', fontWeight: 700 }}>{chosenvariant?.price} EGP</span>
                            </div>
                            <div class="col-lg-12 mb-3">
                                {chosenvariant?.stockCount <= 0 && <div className={'mr-1 wordbreak text-danger bg-light-danger rounded-pill font-weight-600 '}>Out Of Stock</div>}
                                {chosenvariant?.stockCount > 0 && <div className={'mr-1 wordbreak text-success bg-light-success rounded-pill font-weight-600 '}>InStock</div>}
                            </div>
                            <div class="col-lg-12 mb-3 ">
                                <span style={{ fontSize: '15px', color: '#98a6ad' }}>{chosenItemContext?.description}</span>
                            </div>
                            {variantsList?.map((item, index) => {
                                return (
                                    <>
                                        <div class="col-lg-12 mb-2">
                                            <span style={{ fontSize: '15px', fontWeight: 700 }}>{item?.name}</span>
                                        </div>
                                        <div class="col-lg-12 mb-3">
                                            <div class="row m-0 w-100">
                                                {item?.variantOptions?.map((optionItem, optionIned) => {
                                                    var chosen = false;
                                                    chosenvariant?.selectedOptions?.map((i, ii) => {
                                                        if (item.name == i.variantName?.name && optionItem.value == i.variantOption?.value) {
                                                            chosen = true;
                                                        }
                                                    });

                                                    return (
                                                        <div
                                                            style={{
                                                                background: chosen ? '#e6fffa' : 'grey',
                                                                color: chosen ? '#00ae8e' : 'white',
                                                                transition: 'all 0.4s',
                                                                cursor: chosen ? 'default' : 'pointer',
                                                            }}
                                                            className={'mr-1 wordbreak rounded-pill font-weight-600 '}
                                                            onClick={() => {
                                                                if (!chosen) {
                                                                    console.log('vvv' + JSON.stringify(itemVariants));
                                                                    console.log('vvvv' + JSON.stringify(chosenvariant));
                                                                    var chosenarr = [{ option: item.name, value: optionItem.value }];

                                                                    chosenvariant?.selectedOptions.map((it, ittt) => {
                                                                        if (it.variantName.name != item.name) {
                                                                            chosenarr.push({ option: it.variantName.name, value: it?.variantOption?.value });
                                                                        }
                                                                    });
                                                                    alert(findMatchingVariantIndex(chosenarr)?.index);
                                                                    // item?.variantOptions?.map((m, mm) => {
                                                                    //     m?.selectedOptions?.map((i, ii) => {
                                                                    //         if (item.name == i.variantName?.name && optionItem.value == i.variantOption?.value) {
                                                                    //             setchosenvariant(m);
                                                                    //             return;
                                                                    //         }
                                                                    //     });
                                                                    // });
                                                                }
                                                            }}
                                                        >
                                                            {optionItem.value}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>{' '}
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={variantModal?.open}
                onHide={() => {
                    setvariantModal({ open: false, data: [] });
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Item Variants</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setvariantModal({ open: false, data: [] });
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class="col-lg-12 d-flex justify-content-end">{selectedVariants?.length > 0 && <SkuPrint skus={selectedVariants} />}</div>
                        <ItemsTable
                            clickable={true}
                            selectBackground={true}
                            selectedItems={selectedVariants}
                            actiononclick={(item) => {
                                var temp = [...selectedVariants];
                                var exist = false;
                                var chosenindex = null;
                                temp.map((i, ii) => {
                                    if (i?.item?.sku == item?.sku) {
                                        exist = true;
                                        chosenindex = ii;
                                    }
                                });
                                if (!exist) {
                                    temp.push({ item: item });
                                } else {
                                    temp.splice(chosenindex, 1);
                                }
                                // alert(JSON.stringify(temp));
                                setselectedVariants([...temp]);
                            }}
                            card="col-lg-3"
                            items={variantModal.data}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default ItemDetails;
