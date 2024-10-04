import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import { BiCheck, BiEdit } from 'react-icons/bi';
import { Check } from 'react-bootstrap-icons';
import Decimal from 'decimal.js';
import { FaRegUser } from 'react-icons/fa';
import { TbEdit } from 'react-icons/tb';

const UpdateShipping = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, findMerchantDomesticShippings, updateMerchantDomesticShipping, useLazyQueryGQL, addMerchant, createInventoryRent, fetchAllCountries } =
        API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [buttonLoading, setbuttonLoading] = useState(false);
    const { lang, langdetect } = useContext(LanguageContext);
    const [governoratesItems, setgovernoratesItems] = useState([
        {
            name: 'Cairo',
            shipping: 50,
            base: 20,
            vat: 0.14,
        },
    ]);
    const [merchantId, setmerchantId] = useState(undefined);
    const [governoratesItemsList, setgovernoratesItemsList] = useState([]);

    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());
    const [findMerchantDomesticShippingsLazyQuey] = useLazyQueryGQL(findMerchantDomesticShippings());

    const [updateMerchantDomesticShippingMutation] = useMutationGQL(updateMerchantDomesticShipping());

    const [orderTypes, setOrderTypes] = useState([
        { label: 'Delivery', value: 'delivery' },
        { label: 'Exchange', value: 'exchange' },
        { label: 'Return', value: 'return' },
    ]);
    useEffect(async () => {
        if (queryParameters.get('merchantId')) {
            var { data } = await findMerchantDomesticShippingsLazyQuey({
                variables: {
                    merchantId: parseInt(queryParameters.get('merchantId')),
                },
            });
            if (data?.findMerchantDomesticShippings) {
                var temp = [];
                data?.findMerchantDomesticShippings?.map((item, index) => {
                    temp.push({
                        rowId: item?.id,
                        name: item?.domesticShipping?.name,
                        id: item?.domesticShipping?.id,
                        shipping: item?.domesticShipping?.total,
                        base: item?.domesticShipping?.base,
                        vat: item?.domesticShipping?.vat,
                        post: item?.domesticShipping?.post,
                        orderType: item?.orderType,
                        edit: false,
                    });
                });
                setgovernoratesItems([...temp]);
            }
        }
    }, [queryParameters.get('merchantId')]);

    const tableRow = (item, index) => {
        if (item?.edit) {
            return (
                <tr>
                    <td class="d-flex align-items-center " style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                        <p className={' m-0 p-0 wordbreak d-flex align-items-center '}>
                            <span style={{ color: 'grey', fontSize: '14px' }} class="text-capitalize">
                                {item?.orderType}
                            </span>
                        </p>
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
                                {new Decimal(item?.shipping ?? 0).sub(new Decimal(item?.shipping ?? 0).div(1.14)).toFixed(2)}
                            </p>
                        </div>
                    </td>
                    <td>
                        <div class="row m-0 w-100 d-flex align-items-center">
                            <input
                                style={{ width: '50%' }}
                                type={'text'}
                                disabled={true}
                                class={formstyles.form__field}
                                value={item.post}
                                onChange={(event) => {
                                    var governoratesItemsTemp = [...governoratesItems];

                                    governoratesItemsTemp[index].post = event.target.value;

                                    setgovernoratesItems([...governoratesItemsTemp]);
                                }}
                            />
                            <p style={{ width: '45%' }} className={' m-0 p-0 mx-1 h-100 d-flex align-items-center '}>
                                {new Decimal(0.1).mul(new Decimal(item?.base ?? 0)).toFixed(2)}
                            </p>
                        </div>
                    </td>
                    <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                        <input
                            type={'text'}
                            class={formstyles.form__field}
                            value={item?.base}
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
                    <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                        <p className={' m-0 p-0  h-100 d-flex align-items-center '}>
                            {new Decimal(item?.shipping ?? 0)
                                .div(1.14)
                                .minus(new Decimal(item?.base ?? 0))
                                .toFixed(2)}
                        </p>
                    </td>
                    <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                        <input
                            type={'text'}
                            class={formstyles.form__field}
                            value={item?.shipping}
                            onChange={(event) => {
                                var governoratesItemsTemp = [...governoratesItems];
                                if (event.target.value.length == 0) {
                                    governoratesItemsTemp[index].shipping = 0;
                                } else {
                                    governoratesItemsTemp[index].shipping = event.target.value;
                                }
                                setgovernoratesItems([...governoratesItemsTemp]);
                            }}
                        />
                    </td>
                    <td class="allcentered" style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                        <BiCheck
                            size={20}
                            onClick={async () => {
                                var { data } = await updateMerchantDomesticShippingMutation({
                                    variables: {
                                        input: {
                                            id: item?.rowId,
                                            total: item?.shipping,
                                            vatDecimal: item?.vat,
                                            postDecimal: item?.post,
                                            base: item?.base,
                                        },
                                    },
                                });
                                if (data?.updateMerchantDomesticShipping?.success) {
                                    NotificationManager.success('', 'Success!');
                                } else {
                                    NotificationManager.warning(data?.updateMerchantDomesticShipping?.message, 'Warning!');
                                }
                                var temp = [...governoratesItems];
                                temp[index].edit = false;
                                setgovernoratesItems([...temp]);
                            }}
                            class="text-secondaryhover"
                        />
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                        <p className={' m-0 p-0 wordbreak '}>
                            <span style={{ color: 'grey', fontSize: '14px' }} class="text-capitalize">
                                {item?.orderType}
                            </span>
                        </p>
                    </td>

                    <td>
                        <p className={' m-0 p-0  h-100 d-flex align-items-center '}>{item?.vat}</p>
                    </td>
                    <td>
                        <p className={' m-0 p-0  h-100 d-flex align-items-center '}>{item?.post}</p>
                    </td>
                    <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                        <p className={' m-0 p-0  h-100 d-flex align-items-center '}>{item?.base}</p>
                    </td>

                    <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                        <p className={' m-0 p-0  h-100 d-flex align-items-center '}>{new Decimal(item?.shipping).div(1.14).minus(new Decimal(item?.base)).toFixed(2)}</p>
                    </td>
                    <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                        <p className={' m-0 p-0  h-100 d-flex align-items-center '}>{item?.shipping}</p>
                    </td>
                    <td class="allcentered" style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                        <TbEdit
                            onClick={() => {
                                var temp = [...governoratesItems];
                                temp[index].edit = true;
                                setgovernoratesItems([...temp]);
                            }}
                            class="text-secondaryhover"
                        />
                    </td>
                </tr>
            );
        }
    };
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="col-lg-12 p-0">
                <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'} style={{ fontWeight: 600 }}>
                    <FaRegUser class="mr-2" /> {queryParameters.get('n')}
                </div>
            </div>
            {!fetchGovernoratesQuery?.loading && (
                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        <table style={{}} className={'table'}>
                            <thead>
                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}></th>
                                <th>VAT (14%)</th>
                                <th>Post (10%)</th>
                                <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Base</th>
                                <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Extra</th>
                                <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Total</th>
                            </thead>
                            <tbody>
                                {governoratesItems?.map((item, index) => {
                                    if (index % 3 == 0) {
                                        return (
                                            <>
                                                <div style={{ border: '1px solid #eee', borderRadius: '5px', background: '#eee' }} class="col-lg-12 py-2">
                                                    {item?.name}
                                                </div>

                                                {tableRow(item, index)}
                                            </>
                                        );
                                    } else {
                                        return <>{tableRow(item, index)}</>;
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UpdateShipping;
