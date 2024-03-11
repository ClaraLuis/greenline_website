import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp, BsTrash } from 'react-icons/bs';
import API from '../../../API/API.js';
import ItemsTable from '../MerchantItems/ItemsTable.js';
import Users from '../Users/Users.js';
import AddressInfo from '../Users/AddressInfo.js';
import Form from '../../Form.js';

const { ValueContainer, Placeholder } = components;

const AddOrder = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [orderpayload, setorderpayload] = useState({
        functype: 'add',
        items: [],
        user: '',
        address: '',
        ordertype: '',
        paymenttype: '',
        shippingprice: '',
        canbeoppened: 0,
        fragile: 0,
        partialdelivery: 0,
        includevat: 0,
    });
    const [tabs, settabs] = useState([
        { name: 'Order Items', isChecked: true },
        { name: 'User Info', isChecked: false },
        { name: 'Other', isChecked: false },
    ]);
    const [userAddresses, setuserAddresses] = useState([
        { id: '1', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
        { id: '2', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
        { id: '3', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
        { id: '4', country_id: 'Egypt', city_id: 'city 1', details: '28 kk street' },
    ]);
    const [search, setsearch] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [addresspayload, setaddresspayload] = useState({
        functype: 'add',
        country: '',
        city: '',
        details: '',
    });

    useEffect(() => {
        setpageactive_context('/merchantorders');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={generalstyles.card + ' row m-0 p-0 w-100'}>
                    <div class="col-lg-12 p-0">
                        <div class="row m-0 w-100">
                            {tabs?.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            var tabstemp = [...tabs];
                                            tabstemp.map((i, ii) => {
                                                if (i.name == item.name) {
                                                    tabstemp[ii].isChecked = true;
                                                } else {
                                                    tabstemp[ii].isChecked = false;
                                                }
                                            });
                                            settabs([...tabstemp]);
                                        }}
                                        class={!item.isChecked ? generalstyles.tab : `${generalstyles.tab} ${generalstyles.tab_active}`}
                                    >
                                        {item.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {tabs[0]?.isChecked && (
                        <div className={' col-lg-12 p-2 '}>
                            <div class="row m-0 w-100">
                                <div class="col-lg-12 p-0 ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={search}
                                            placeholder={'Search by name or SKU'}
                                            onChange={(event) => {
                                                setsearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                {search?.length != 0 && (
                                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                        <ItemsTable
                                            clickable={true}
                                            actiononclick={(item) => {
                                                var temp = { ...orderpayload };
                                                var exist = false;
                                                var chosenindex = null;
                                                temp.items.map((i, ii) => {
                                                    if (i.item.sku == item.sku) {
                                                        exist = true;
                                                        chosenindex = ii;
                                                    }
                                                });
                                                if (!exist) {
                                                    temp.items.push({ item: item, count: 1 });
                                                } else {
                                                    temp.items[chosenindex].count = parseInt(temp.items[chosenindex].count) + 1;
                                                }
                                                setorderpayload({ ...temp });
                                            }}
                                        />
                                    </div>
                                )}

                                {orderpayload?.items?.length != 0 && (
                                    <>
                                        <div class="col-lg-12 pt-4 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                            Items
                                        </div>
                                        <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-3 '}>
                                            <table className={'table'}>
                                                <thead>
                                                    <th>SKU</th>
                                                    <th>Name</th>
                                                    <th>Count</th>
                                                    <th>Remove</th>
                                                </thead>
                                                <tbody>
                                                    {orderpayload?.items?.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <p className={' m-0 p-0 wordbreak '}>{item?.item?.sku}</p>
                                                                </td>
                                                                <td>
                                                                    <p className={' m-0 p-0 wordbreak '}>{item?.item?.name}</p>
                                                                </td>

                                                                <td>
                                                                    <div class="col-lg-12 p-0 ">
                                                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                                                            <input
                                                                                // disabled={props?.disabled}
                                                                                type={'number'}
                                                                                class={formstyles.form__field}
                                                                                value={item?.count}
                                                                                placeholder={'Search by name or SKU'}
                                                                                onChange={(event) => {
                                                                                    var temp = { ...orderpayload };
                                                                                    temp.items[index].count = event.target.value;
                                                                                    setorderpayload({ ...temp });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <BsTrash
                                                                        onClick={() => {
                                                                            var temp = { ...orderpayload };
                                                                            temp.items.splice(index, 1);
                                                                            setorderpayload({ ...temp });
                                                                        }}
                                                                        class="text-danger text-dangerhover"
                                                                        // size={20}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {tabs[1]?.isChecked && (
                        <div className={' col-lg-12 p-2 '}>
                            <div class="row m-0 w-100">
                                <div class="col-lg-12 p-0 mb-2 ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={search}
                                            placeholder={'Search by phonenumber'}
                                            onChange={(event) => {
                                                setsearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                {search?.length != 0 && <Users />}

                                {userAddresses?.length != 0 && (
                                    <>
                                        <div class="col-lg-6 p-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                            Addresses
                                        </div>
                                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                                            <button
                                                style={{ height: '35px' }}
                                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                                onClick={() => {
                                                    // setaddresspayload({
                                                    //     functype: 'add',
                                                    //     id: 'add',
                                                    //     name: '',
                                                    //     type: '',
                                                    //     phone: '',
                                                    //     email: '',
                                                    //     birthdate: '',
                                                    // });
                                                    setopenModal(true);
                                                }}
                                            >
                                                Add Address
                                            </button>
                                        </div>
                                        {userAddresses?.map((item, index) => {
                                            return (
                                                <div class="col-lg-4 ">
                                                    <div
                                                        onClick={() => {
                                                            setorderpayload({ ...orderpayload, address: item.id });
                                                        }}
                                                        style={{ cursor: 'pointer', transition: 'all 0.4s', border: orderpayload?.address == item.id ? '1px solid var(--primary)' : '' }}
                                                        class={generalstyles.card + ' row m-0 p-2 w-100'}
                                                    >
                                                        <div class="col-lg-12">
                                                            Country: <span style={{ fontWeight: 600 }}>{item?.country_id}</span>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            City: <span style={{ fontWeight: 600 }}>{item?.city_id}</span>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            Details: <span style={{ fontWeight: 600 }}>{item?.details}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {tabs[2]?.isChecked && (
                        <div class="col-lg-6 mb-3">
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    { name: 'Order type', attr: 'ordertype', type: 'select', options: [{ label: 'Delivery', value: 'delivery' }], size: '12' },
                                    { name: 'Payment type', attr: 'paymenttype', type: 'select', options: [{ label: 'Cash', value: 'cash' }], size: '12' },
                                    { name: 'Shipping price', attr: 'shippingprice', type: 'number', size: '12' },
                                    { name: 'Can be oppened', attr: 'canbeoppened', type: 'checkbox', size: '12' },
                                    { name: 'Fragile', attr: 'fragile', type: 'checkbox', size: '12' },
                                    { name: 'Partial delivery', attr: 'partialdelivery', type: 'checkbox', size: '12' },
                                ]}
                                payload={orderpayload}
                                setpayload={setorderpayload}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                button1placeholder={orderpayload?.functype == 'add' ? 'Add Order' : lang.edit}
                                // button1onClick={() => {
                                //     //    handleAddUser();
                                // }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <AddressInfo openModal={openModal} setopenModal={setopenModal} addresspayload={addresspayload} setaddresspayload={setaddresspayload} />
        </div>
    );
};
export default AddOrder;
