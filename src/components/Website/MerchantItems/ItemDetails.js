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

const ItemDetails = (props) => {
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
    const [chosenvariant, setchosenvariant] = useState(undefined);
    const [findOneItemLazyQuery] = useLazyQueryGQL(findOneItem());

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

    return (
        <div class="row m-0 w-100 p-md-2 pt-2 d-flex justify-content-center">
            <div class="col-lg-12  p-4">
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
                                    <img src={chosenvariant?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </div>
                            <div class="col-lg-12 p-0">
                                <div class="row m-0 w-100">
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
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7 pl-3">
                        <div class="row m-0 w-100">
                            <div class="col-lg-12">
                                <span style={{ fontSize: '14px', color: 'var(--primary)' }}>{chosenvariant?.merchantSku}</span>
                            </div>
                            <div class="col-lg-12 mb-3 mt-1">
                                <span style={{ fontSize: '18px', fontWeight: 700 }}>{chosenItemContext?.name}</span>
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
                            {chosenvariant?.selectedOptions?.map((item, index) => {
                                return (
                                    <div class="col-lg-12 mb-3 ">
                                        <span style={{ fontWeight: 700 }}>{item?.variantName?.name}: </span>
                                        <span>{item?.variantOption?.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ItemDetails;
