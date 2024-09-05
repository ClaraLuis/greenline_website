import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { TextareaAutosize } from '@mui/material';
import { BsChevronDown, BsChevronUp, BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import API from '../../../API/API.js';
import ItemsTable from './ItemsTable.js';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';
import MerchantSelect from '../MerchantHome/MerchantSelect.js';
import { Arrow90degDown, ArrowDown, Trash2 } from 'react-bootstrap-icons';
import { BiDownArrow } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import Cookies from 'universal-cookie';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import SkuPrint from './SkuPrint.js';

const { ValueContainer, Placeholder } = components;

const MerchantItems = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, chosenMerchantContext, isAuth } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL, useMutationGQL, addItem, addCompoundItem } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const cookies = new Cookies();
    const [variantModal, setvariantModal] = useState(true);
    const [selectedVariants, setselectedVariants] = useState([]);

    const [payload, setPayload] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: '',
        sku: '',
        merchantId: parseInt(cookies.get('merchantId')),
    });
    const fetchMerchantItemsQuery = useQueryGQL('', fetchMerchantItems(), payload);

    const { refetch: refetchItems } = useQueryGQL('', fetchMerchantItems(), payload);

    useEffect(() => {
        setpageactive_context('/merchantitems');
        refetchItems();
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Merchant Items
                    </p>
                </div>
                {isAuth([1, 52, 13]) && (
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1 mx-2'}
                            onClick={() => {
                                history.push('/additem');
                            }}
                        >
                            Add Single Item
                        </button>
                    </div>
                )}
                {cookies.get('merchantId') == undefined && <MerchantSelect fiter={payload} setFilter={setPayload} />}
                {isAuth([1, 52, 12]) && (
                    <>
                        <div class={generalstyles.card + ' row m-0 w-100 mb-4 p-2 px-2'}>
                            <div class="col-lg-6">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        // disabled={props?.disabled}
                                        // type={props?.type}
                                        class={formstyles.form__field}
                                        value={payload?.name}
                                        placeholder={'Search by name '}
                                        onChange={() => {
                                            setPayload({ ...payload, name: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-6 ">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        // disabled={props?.disabled}
                                        // type={props?.type}
                                        class={formstyles.form__field}
                                        value={payload?.sku}
                                        placeholder={'Search by SKU'}
                                        onChange={() => {
                                            setPayload({ ...payload, sku: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor}
                                    filter={payload}
                                    setfilter={setPayload}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                <ItemsTable
                                    clickable={true}
                                    actiononclick={(item) => {
                                        setvariantModal({ open: true, data: item?.itemVariants });
                                    }}
                                    card="col-lg-3"
                                    items={fetchMerchantItemsQuery?.data?.paginateItems?.data}
                                />
                            </div>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantItemsQuery?.data?.paginateItems?.cursor?.afterCursor}
                                    filter={payload}
                                    setfilter={setPayload}
                                />
                            </div>
                        </div>
                    </>
                )}
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
export default MerchantItems;
