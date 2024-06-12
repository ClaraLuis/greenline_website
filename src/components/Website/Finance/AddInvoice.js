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
import OrdersTable from '../Orders/OrdersTable.js';

const { ValueContainer, Placeholder } = components;

const AddInvoice = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [sheetpayload, setsheetpayload] = useState({
        functype: 'add',
        name: '',
        courier: '',
        orders: [],
    });
    const [tabs, settabs] = useState([
        { name: 'Invoice orders', isChecked: true },
        { name: 'Invoice Info', isChecked: false },
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
        setpageactive_context('/couriersheets');
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
                                            placeholder={'Search by order number'}
                                            onChange={(event) => {
                                                setsearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                {search?.length != 0 && (
                                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                        <OrdersTable
                                            clickable={true}
                                            actiononclick={(item) => {
                                                var temp = { ...sheetpayload };
                                                var exist = false;
                                                var chosenindex = null;
                                                temp.orders.map((i, ii) => {
                                                    if (i.id == item.id) {
                                                        exist = true;
                                                        chosenindex = ii;
                                                    }
                                                });
                                                if (!exist) {
                                                    temp.orders.push(item);
                                                }
                                                setsheetpayload({ ...temp });
                                            }}
                                        />
                                    </div>
                                )}

                                {sheetpayload?.orders?.length != 0 && (
                                    <>
                                        <div class="col-lg-12 pt-4 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                            Orders
                                        </div>
                                        <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-3 '}>
                                            <table className={'table'}>
                                                <thead>
                                                    <th>#</th>
                                                    <th>Items Count</th>
                                                    <th>Merchant</th>
                                                    <th>Remove</th>
                                                </thead>
                                                <tbody>
                                                    {sheetpayload?.orders?.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                                                </td>
                                                                <td>
                                                                    <p className={' m-0 p-0 wordbreak '}>{'6'}</p>
                                                                </td>
                                                                <td>
                                                                    <p className={' m-0 p-0 wordbreak '}> {item?.merchantname}</p>
                                                                </td>

                                                                <td>
                                                                    <BsTrash
                                                                        onClick={() => {
                                                                            var temp = { ...sheetpayload };
                                                                            temp.orders.splice(index, 1);
                                                                            setsheetpayload({ ...temp });
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
                        <div class="col-lg-6 mb-3">
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    // { name: 'Name', attr: 'name', size: '12' },
                                    { name: 'Courier', attr: 'courier', type: 'select', options: [{ label: 'Courier 1', value: '1' }], size: '12' },
                                ]}
                                payload={sheetpayload}
                                setpayload={setsheetpayload}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={sheetpayload?.functype == 'add' ? 'Create' : lang.edit}
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
export default AddInvoice;
