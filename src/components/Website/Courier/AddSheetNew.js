import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { Modal } from 'react-bootstrap';
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
import { FiCheckCircle } from 'react-icons/fi';
import { NotificationManager } from 'react-notifications';
import { MdOutlineLocationOn } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const AddSheetNew = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, user, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchOrders, addCourierSheet, useMutationGQL, fetchCouriers } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [sheetpayload, setsheetpayload] = useState({
        functype: 'add',
        name: '',
        courier: '',
        orders: [],
        orderIds: [],
    });

    const [search, setsearch] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [assignOpenModal, setassignOpenModal] = useState(false);
    const [addresspayload, setaddresspayload] = useState({
        functype: 'add',
        country: '',
        city: '',
        details: '',
    });

    const [filterorders, setfilterorders] = useState({
        statuses: [], //arrivedToHub
        limit: 20,
        orderIds: undefined,
    });
    const fetchOrdersQuery = useQueryGQL('', fetchOrders(), filterorders); //network only
    const [filterCouriers, setfilterCouriers] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchCouriersQuery = useQueryGQL('', fetchCouriers(), filterCouriers);

    const [addCourierSheetMutation] = useMutationGQL(addCourierSheet(), {
        userId: sheetpayload?.courier,
        orderIds: sheetpayload?.orderIds,
    });

    const handleAddCourierSheet = async () => {
        setbuttonLoading(true);
        try {
            const { data } = await addCourierSheetMutation();
            if (data?.createCourierSheet?.success == true) {
                history.push('/couriersheets');
            } else {
                NotificationManager.warning(data?.createCourierSheet?.message, 'Warning!');
            }
        } catch (error) {
            // alert(JSON.stringify(error));
            let errorMessage = 'An unexpected error occurred';
            // // Check for GraphQL errors
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                errorMessage = error.graphQLErrors[0].message || errorMessage;
            } else if (error.networkError) {
                errorMessage = error.networkError.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            NotificationManager.warning(errorMessage, 'Warning!');
            if (errorMessage == 'Courier has an open sheet') {
                setassignOpenModal(true);
            }
        }
        setbuttonLoading(false);
    };
    useEffect(() => {
        setpageactive_context('/addsheet');
    }, []);

    const [barcode, setBarcode] = useState('');
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }

            if (e.key === 'Enter') {
                var temp = { ...sheetpayload };
                var exist = false;
                temp.orderIds.map((i, ii) => {
                    if (i == barcode) {
                        exist = true;
                    }
                });
                if (!exist) {
                    if (barcode?.length != 0 && !isNaN(parseInt(barcode))) {
                        temp.orderIds.push(parseInt(barcode));
                    } else {
                        NotificationManager.warning('Order has to be numbers', 'Warning!');
                    }
                } else {
                    NotificationManager.warning('Order already added', 'Warning!');
                }
                setsheetpayload({ ...temp });

                // setsearch(barcode); // Update the search state with the scanned barcode
                setBarcode('');
                setsearch(''); // Clear the barcode state
            } else {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode]);

    return (
        <div style={{ minHeight: '100vh' }} class="row m-0 w-100 p-md-2 pt-2 d-flex align-items-start">
            <div className={' col-lg-12 p-1 py-0 '}>
                <div style={{}} class="row m-0 w-100">
                    <div class="col-lg-12 mb-3 px-1">
                        <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3 '} style={{}}>
                            <div class={'col-lg-3'}>
                                <SelectComponent
                                    title={'Courier'}
                                    filter={filterCouriers}
                                    setfilter={setfilterCouriers}
                                    options={fetchCouriersQuery}
                                    attr={'paginateCouriers'}
                                    payload={sheetpayload}
                                    payloadAttr={'courier'}
                                    label={'name'}
                                    value={'id'}
                                    onClick={(option) => {
                                        setsheetpayload({ ...sheetpayload, courier: option.id });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-10 p-0 ">
                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                            <input
                                type="number"
                                class={formstyles.form__field}
                                value={search}
                                placeholder={'Search by order ID'}
                                onChange={(event) => {
                                    setsearch(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div class="col-lg-2 p-0 allcentered">
                        <button
                            style={{ height: '30px', minWidth: '80%' }}
                            class={generalstyles.roundbutton + ' allcentered p-0'}
                            onClick={() => {
                                var temp = { ...sheetpayload };
                                var exist = false;
                                temp.orderIds.map((i, ii) => {
                                    if (i == search) {
                                        exist = true;
                                    }
                                });
                                if (!exist) {
                                    if (search?.length != 0 && !isNaN(parseInt(search))) {
                                        temp.orderIds.push(parseInt(search));
                                    } else {
                                        NotificationManager.warning('Order has to be numbers', 'Warning!');
                                    }
                                } else {
                                    NotificationManager.warning('Order already added', 'Warning!');
                                }
                                setsheetpayload({ ...temp });
                                setsearch('');
                            }}
                        >
                            Add order
                        </button>
                    </div>
                    {/* TODO */}
                    {/* {isAuth([1,53,  ])} */}
                    <div class="col-lg-12 mt-3 p-0">
                        <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3 scrollmenuclasssubscrollbar'} style={{ overflow: 'scroll' }}>
                            <div class="col-lg-12">
                                <>
                                    <div class="col-lg-12 pb-2 px-0 " style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Orders ({sheetpayload?.orderIds?.length})
                                    </div>
                                    {sheetpayload?.orderIds?.length != 0 && (
                                        <div class="col-lg-12 p-0">
                                            <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                                {sheetpayload?.orderIds?.map((item, index) => {
                                                    return (
                                                        <div class={' col-lg-3 '}>
                                                            <div class={generalstyles.filter_container + ' p-2 row m-0 mb-3 w-100 allcentered'}>
                                                                <div style={{ fontWeight: 700 }} class="col-lg-10 p-0 mb-2">
                                                                    # {item}
                                                                </div>
                                                                <div class="col-lg-2 p-0 allcentered">
                                                                    <BsTrash
                                                                        onClick={() => {
                                                                            var temp = { ...sheetpayload };
                                                                            temp.orderIds.splice(index, 1);
                                                                            setsheetpayload({ ...temp });
                                                                        }}
                                                                        class="text-danger text-dangerhover"
                                                                        // size={20}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'fixed', bottom: 0, width: '77%' }} class=" mb-3 px-1">
                        <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3 d-flex justify-content-end '}>
                            <div class="col-lg-2 p-0 allcentered">
                                <button
                                    // style={{ height: '30px', minWidth: '80%' }}
                                    class={generalstyles.roundbutton + ' allcentered p-0'}
                                    onClick={() => {
                                        if (sheetpayload?.courier?.length == 0 || sheetpayload?.courier == undefined) {
                                            NotificationManager.warning('Choose Courier first', 'Warning!');
                                        }
                                        if (sheetpayload?.orderIds?.length == 0 || sheetpayload?.orderIds == undefined) {
                                            NotificationManager.warning('Choose Orders first', 'Warning!');
                                        } else {
                                            handleAddCourierSheet();
                                        }
                                    }}
                                    disabled={buttonLoading}
                                >
                                    Add Manifest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddSheetNew;
