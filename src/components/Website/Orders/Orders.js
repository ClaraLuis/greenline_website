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
import { IoMdClose } from 'react-icons/io';
import { Modal } from 'react-bootstrap';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import OrdersTable from './OrdersTable.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import Cookies from 'universal-cookie';

const { ValueContainer, Placeholder } = components;

const Orders = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, UserInfoContext, isAuth } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, fetchOrdersInInventory } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [merchantModal, setmerchantModal] = useState(false);

    const [filterorders, setfilterorders] = useState({
        limit: 100,
    });
    const fetchOrdersInInventoryQuery = useQueryGQL('', fetchOrdersInInventory(), filterorders);
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);

    useEffect(() => {
        setpageactive_context('/orders');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Orders
                    </p>
                </div>

                {/* <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                            <AccordionItemState>
                                                {(state) => {
                                                    if (state.expanded == true) {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    }
                                                }}
                                            </AccordionItemState>
                                        </div>
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <hr className="mt-2 mb-3" />
                                <div class="row m-0 w-100">
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <label for="name" class={formstyles.form__label}>
                                                From date
                                            </label>
                                            <input type={'date'} class={formstyles.form__field} placeholder={''} />
                                        </div>
                                    </div>
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                            <label for="name" class={formstyles.form__label}>
                                                To date
                                            </label>
                                            <input type={'date'} class={formstyles.form__field} placeholder={''} />
                                        </div>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div> */}
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-2'}>
                    <div class="col-lg-12 p-0 ">
                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                            <input
                                // disabled={props?.disabled}
                                // type={props?.type}
                                class={formstyles.form__field}
                                // value={}
                                placeholder={'Search by order# '}

                                // onChange={}
                            />
                        </div>
                    </div>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.beforeCursor}
                            afterCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.afterCursor}
                            filter={filterorders}
                            setfilter={setfilterorders}
                        />
                    </div>
                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <OrdersTable fetchOrdersQuery={fetchOrdersInInventoryQuery} attr={'paginateOrdersInInventory'} srcFrom="inventory" />
                    </div>
                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.beforeCursor}
                            afterCursor={fetchOrdersInInventoryQuery?.data?.paginateOrdersInInventory?.cursor?.afterCursor}
                            filter={filterorders}
                            setfilter={setfilterorders}
                        />
                    </div>
                </div>
            </div>
            <Modal
                show={merchantModal}
                onHide={() => {
                    setmerchantModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Choose Merchant</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setmerchantModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <SelectComponent
                                title={'Merchant'}
                                filter={filterMerchants}
                                setfilter={setfilterMerchants}
                                options={fetchMerchantsQuery}
                                attr={'paginateMerchants'}
                                label={'name'}
                                value={'id'}
                                onClick={(option) => {
                                    history.push('/addorder?merchantId=' + option.id);
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Orders;
