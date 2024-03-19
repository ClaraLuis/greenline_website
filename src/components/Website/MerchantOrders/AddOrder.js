import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup, FaPlus, FaWindowMinimize } from 'react-icons/fa';
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
    const [selecteduser, setselecteduser] = useState('');
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

    const fetchusers = useQueryGQL('', fetchUsers());

    useEffect(() => {
        setpageactive_context('/merchantorders');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
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
                    <div className={' col-lg-8 p-0 '}>
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-3 ">
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
                                card="col-lg-4"
                            />

                            {orderpayload?.items?.length != 0 && (
                                <>
                                    <div class="col-lg-12 py-4 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Items
                                    </div>
                                    {orderpayload?.items?.map((item, index) => {
                                        return (
                                            <div class={' col-lg-4'}>
                                                <div class={generalstyles.card + ' p-3 row m-0 w-100'}>
                                                    <div class="col-lg-12 p-0">
                                                        <div style={{ width: '100%', height: '200px' }}>
                                                            <img
                                                                src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7 p-0 mt-2 wordbreak" style={{ fontWeight: 700, fontSize: '16px' }}>
                                                        {item?.item?.name}
                                                    </div>

                                                    <div class="col-lg-5 d-flex justify-content-end mt-2 p-0">
                                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                            <FaWindowMinimize
                                                                onClick={() => {
                                                                    if (orderpayload.items[index].count > 0) {
                                                                        var temp = { ...orderpayload };
                                                                        temp.items[index].count -= 1;
                                                                        setorderpayload({ ...temp });
                                                                    } else {
                                                                        var temp = { ...orderpayload };
                                                                        temp.items.splice(index, 1);
                                                                        setorderpayload({ ...temp });
                                                                    }
                                                                }}
                                                                class=" mb-2 text-danger text-dangerhover"
                                                            />

                                                            <input
                                                                // disabled={props?.disabled}
                                                                type={'number'}
                                                                class={formstyles.form__field + ' mx-2 p-1'}
                                                                style={{ height: '25px', width: '52%' }}
                                                                value={item?.count}
                                                                placeholder={'Search by name or SKU'}
                                                                onChange={(event) => {
                                                                    var temp = { ...orderpayload };
                                                                    temp.items[index].count = event.target.value;
                                                                    setorderpayload({ ...temp });
                                                                }}
                                                            />
                                                            <FaPlus
                                                                onClick={() => {
                                                                    var temp = { ...orderpayload };
                                                                    temp.items[index].count += 1;
                                                                    setorderpayload({ ...temp });
                                                                }}
                                                                class=" text-secondaryhover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px', color: 'lightgray' }}>
                                                        {item?.item?.sku}
                                                    </div>
                                                    <div class="col-lg-12 p-0 mt-2" style={{ fontWeight: 700, fontSize: '15px' }}>
                                                        300 EGP
                                                    </div>
                                                    <div class="col-lg-12 p-0 mt-1">
                                                        <div class="row m-0 w-100">
                                                            {item?.item?.colors?.map((color, colorindex) => {
                                                                return <div style={{ width: '18px', height: '18px', borderRadius: '100%', backgroundColor: color, marginInlineEnd: '5px' }}></div>;
                                                            })}
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
                )}
                {tabs[1]?.isChecked && (
                    <div className={' col-lg-8 p-0 '}>
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 p-0 mb-2 ">
                                <div class={'col-lg-6'} style={{ marginBottom: '15px' }}>
                                    <label class={formstyles.form__label}>Select user</label>
                                    <Select
                                        // isDisabled={item?.disabled}
                                        options={fetchusers?.data?.paginateUsers?.data}
                                        styles={defaultstyles}
                                        getOptionLabel={(option) => option.name + ' ' + option.phone}
                                        getOptionValue={(option) => option.id}
                                        // value={fetchusers?.data?.paginateUsers?.data?.filter((option) => option.value == props?.payload[item?.attr])}
                                        onChange={(option) => {
                                            setselecteduser({ ...option });
                                        }}
                                    />
                                </div>
                            </div>
                            {selecteduser?.length != 0 && selecteduser != undefined && (
                                <div class="col-lg-12">
                                    <div class="col-lg-6">
                                        <div class={generalstyles.card + ' row m-0 p-2 w-100'}>
                                            <div class="col-lg-12 mb-1">
                                                <span style={{ fontWeight: 600 }}> User: </span>
                                            </div>
                                            <div class="col-lg-12">
                                                Name: <span style={{ fontWeight: 600 }}>{selecteduser?.name}</span>
                                            </div>
                                            <div class="col-lg-12">
                                                Email: <span style={{ fontWeight: 600 }}>{selecteduser?.email}</span>
                                            </div>
                                            <div class="col-lg-12">
                                                Phone Number: <span style={{ fontWeight: 600 }}>{selecteduser?.phonenumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selecteduser?.length != 0 && selecteduser != undefined && (
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
                <div class="col-lg-4 mb-3">
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
            </div>
            <AddressInfo openModal={openModal} setopenModal={setopenModal} addresspayload={addresspayload} setaddresspayload={setaddresspayload} />
        </div>
    );
};
export default AddOrder;
