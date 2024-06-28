import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import API from '../../../API/API.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';

const { ValueContainer, Placeholder } = components;

const Shipping = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, inventoryTypesContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, createMerchantDomesticShipping, updateMerchantDomesticShipping } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [governoratesItems, setgovernoratesItems] = useState([
        {
            name: 'Cairo',
            shipping: 50,
            base: 20,
            vat: 0.14,
        },
    ]);
    const [governoratesItemsList, setgovernoratesItemsList] = useState([]);
    const [inventorySettings, setinventorySettings] = useState({
        inInventory: '',
        type: '',
        price: '',
    });

    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());
    const [createMerchantDomesticShippingMutation] = useMutationGQL(createMerchantDomesticShipping(), {
        merchantId: parseInt(queryParameters.get('merchantId')),
        list: governoratesItemsList,
    });
    const [updateMerchantDomesticShippingMutation] = useMutationGQL(updateMerchantDomesticShipping(), {
        merchantId: parseInt(queryParameters.get('merchantId')),
        list: governoratesItemsList,
    });

    useEffect(() => {
        setpageactive_context('/governorates');
        if (fetchGovernoratesQuery?.data) {
            var temp = [];
            fetchGovernoratesQuery?.data?.findAllDomesticGovernorates?.map((item, index) => {
                temp.push({
                    name: item.name,
                    id: item.id,
                    shipping: 50,
                    base: 20,
                    vat: 0.14,
                });
            });
            setgovernoratesItems([...temp]);
        }
    }, [fetchGovernoratesQuery?.data]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '20px' }}>
                        Governorates
                    </p>
                </div>
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    {/* <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + '  mb-1 mx-2'}
                        onClick={() => {
                            history.push('/addorder');
                        }}
                    >
                        Add Order
                    </button> */}
                </div>

                {!fetchGovernoratesQuery?.loading && (
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <table style={{}} className={'table'}>
                                <thead>
                                    <th>Governorate</th>
                                    <th>Shipping</th>
                                    <th>VAT (14%)</th>
                                    <th>Base</th>
                                    <th>Extra</th>
                                </thead>
                                <tbody>
                                    {governoratesItems?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <p className={' m-0 p-0 wordbreak '}>{item.name}</p>
                                                </td>
                                                <td>
                                                    <input
                                                        type={'text'}
                                                        class={formstyles.form__field}
                                                        value={item.shipping}
                                                        onChange={(event) => {
                                                            var governoratesItemsTemp = [...governoratesItems];
                                                            governoratesItemsTemp[index].shipping = event.target.value;
                                                            setgovernoratesItems([...governoratesItemsTemp]);
                                                        }}
                                                    />
                                                </td>

                                                <td>
                                                    <div class="row m-0 w-100 d-flex align-items-center">
                                                        <input
                                                            style={{ width: '50%' }}
                                                            type={'text'}
                                                            disabled={true}
                                                            class={formstyles.form__field}
                                                            value={item.vat}
                                                            onChange={(event) => {
                                                                var governoratesItemsTemp = [...governoratesItems];

                                                                governoratesItemsTemp[index].vat = event.target.value;

                                                                setgovernoratesItems([...governoratesItemsTemp]);
                                                            }}
                                                        />
                                                        <p style={{ width: '45%' }} className={' m-0 p-0 mx-1 h-100 d-flex align-items-center '}>
                                                            {(parseFloat(item.shipping) * parseFloat(item.vat)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        type={'text'}
                                                        class={formstyles.form__field}
                                                        value={item.base}
                                                        onChange={(event) => {
                                                            var governoratesItemsTemp = [...governoratesItems];
                                                            if (event.target.value.length == 0) {
                                                                governoratesItemsTemp[index].base = 0;
                                                            } else {
                                                                governoratesItemsTemp[index].base = event.target.value;
                                                            }
                                                            setgovernoratesItems([...governoratesItemsTemp]);
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <p className={' m-0 p-0  h-100 d-flex align-items-center '}>
                                                        {parseFloat(item.shipping) - (parseFloat(item.base) + parseFloat(item.shipping) * 0.14)}
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ position: 'fixed', bottom: '2%', right: '2%' }}>
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                onClick={async () => {
                                    var temp = [];
                                    await governoratesItems?.map((item, index) => {
                                        temp.push({
                                            govId: item.id,
                                            total: item.shipping,
                                            vatDecimal: item.vat,
                                            base: item.base,
                                            extra: parseFloat(item.shipping) - (parseFloat(item.base) + parseFloat(item.shipping) * 0.14),
                                        });
                                    });
                                    await setgovernoratesItemsList([...temp]);
                                    if (queryParameters?.get('type') == 'add') {
                                        var { data } = await createMerchantDomesticShippingMutation();
                                        if (data?.createMerchantDomesticShipping?.success) {
                                            NotificationManager.success('', 'Success!');
                                        } else {
                                            NotificationManager.warning(data?.createMerchantDomesticShipping?.message, 'Warning!');
                                        }
                                    } else {
                                        var { data } = await updateMerchantDomesticShippingMutation();
                                        if (data?.updateMerchantDomesticShipping?.success) {
                                            NotificationManager.success('', 'Success!');
                                        } else {
                                            NotificationManager.warning(data?.updateMerchantDomesticShipping?.message, 'Warning!');
                                        }
                                    }
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Shipping;
