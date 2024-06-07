import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import Dropdown from 'react-bootstrap/Dropdown';
import { components } from 'react-select';

// Icons
import API from '../../../API/API.js';
import { FaEllipsisV } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Form from '../../Form.js';
import { Modal } from 'react-bootstrap';
import user from '../user.png';
const { ValueContainer, Placeholder } = components;

const MerchantHome = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, inventoryRentTypesContext, dateformatter } = useContext(Contexthandlerscontext);
    const { createInventory, useMutationGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [inventoryRentPayload, setinventoryRentPayload] = useState({
        merchantId: 1,
        type: '',
        startDate: '',
        pricePerUnit: '',
        currency: '',
    });
    const [openModal, setopenModal] = useState(false);
    const [submit, setsubmit] = useState(false);

    const [merchants, setmerchants] = useState([
        {
            id: '1',
            name: 'Merchant 1',
        },
        {
            id: '2',
            name: 'Merchant 2',
        },
        {
            id: '3',
            name: 'Merchant 3',
        },
    ]);
    const [merchantDropown, setmerchantDropown] = useState([
        { item: 'Edit Details', path: '' },
        { item: 'Shipping Prices', path: '' },
        { item: 'Inventory Rent', path: '' },
    ]);

    const [payload, setpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: '',
        phone: '',
        email: '',
        birthdate: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    const [addInventoryRent] = useMutationGQL(createInventory(), {
        merchantId: parseInt(inventoryRentPayload?.merchantId),
        type: inventoryRentPayload?.type,
        startDate: inventoryRentPayload?.startDate,
        pricePerUnit: inventoryRentPayload?.pricePerUnit,
        currency: inventoryRentPayload?.currency,
    });
    useEffect(() => {
        setpageactive_context('/merchanthome');
    }, []);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Dashboard
                    </p>
                </div>
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + '  mb-1 mx-2'}
                        onClick={() => {
                            history.push('/bookvisit');
                        }}
                    >
                        Book a visit
                    </button>
                </div>
                <div class={' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Merchants</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px', minHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <div class="row m-0 w-100">
                            {' '}
                            {merchants?.map((item, index) => {
                                return (
                                    <div onClick={() => {}} style={{ fontSize: '13px' }} class=" col-lg-4 p-1 px-2">
                                        <div style={{ backgroundColor: 'white' }} class="row m-0 w-100 p-3 card d-flex align-items-center">
                                            <div class="col-lg-6 p-0 mb-1 " style={{ fontSize: '15px' }}>
                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                    <div style={{ width: '40px', height: '40px', marginInlineEnd: '10px' }}>
                                                        <img src={user} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}> {item?.name}</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 p-0 mb-1 d-flex justify-content-end align-items-center">
                                                <Dropdown>
                                                    <Dropdown.Toggle>
                                                        <div
                                                            style={{
                                                                color: 'var(--primary)',
                                                                borderRadius: '10px',
                                                                transition: 'all 0.4s',
                                                            }}
                                                        >
                                                            <FaEllipsisV />
                                                        </div>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {merchantDropown?.map((dropdownItem, dropdownIndex) => {
                                                            return (
                                                                <Dropdown.Item class="py-2">
                                                                    <p
                                                                        class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}
                                                                        onClick={() => {
                                                                            setopenModal(true);
                                                                        }}
                                                                    >
                                                                        {dropdownItem?.item}
                                                                    </p>
                                                                </Dropdown.Item>
                                                            );
                                                        })}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            {/* <div class="col-lg-12 p-0">
                                                <hr class="p-0 m-0 my-3" />
                                            </div> */}
                                            {/* <div class="col-lg-12 p-0 mt-2">
                                                <span>Name: </span>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <hr class="p-0 m-0" />
                                            </div> */}
                                            <div class="col-lg-12 p-0 mt-3">
                                                <div class="row m-0 w-100">
                                                    <div class="col-lg-4 p-0 allcentered">
                                                        <button style={{ minWidth: '80px', maxWidth: '80px', height: '25px' }} class={generalstyles.roundbutton + ' p-1 px-3 allcentered'}>
                                                            Items
                                                        </button>
                                                    </div>
                                                    <div class="col-lg-4 p-0 allcentered">
                                                        <button style={{ minWidth: '80px', maxWidth: '80px', height: '25px' }} class={generalstyles.roundbutton + ' p-1 px-3 allcentered'}>
                                                            Orders
                                                        </button>
                                                    </div>
                                                    <div class="col-lg-4 p-0 allcentered">
                                                        {' '}
                                                        <button style={{ minWidth: '80px', maxWidth: '80px', height: '25px' }} class={generalstyles.roundbutton + ' p-1 px-3 allcentered'}>
                                                            Finance
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={openModal}
                onHide={() => {
                    setopenModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0">Inventory rent</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <Form
                            submit={submit}
                            setsubmit={setsubmit}
                            size={'md'}
                            attr={[
                                {
                                    name: 'Type',
                                    attr: 'type',
                                    type: 'select',
                                    options: inventoryRentTypesContext,
                                    size: '12',
                                },
                                {
                                    name: 'Start Date',
                                    attr: 'startDate',
                                    type: 'date',
                                    size: '12',
                                },
                                {
                                    name: 'Price Per Unit',
                                    attr: 'pricePerUnit',
                                    type: 'number',
                                    size: '12',
                                },
                                {
                                    name: 'Currency',
                                    attr: 'currency',
                                    type: 'select',
                                    options: [{ label: 'EGP', value: 'EGP' }],
                                    size: '12',
                                },
                            ]}
                            payload={inventoryRentPayload}
                            setpayload={setinventoryRentPayload}
                            // button1disabled={UserMutation.isLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={'Update'}
                            button1onClick={async () => {
                                try {
                                    await addInventoryRent();
                                    setchangestatusmodal(false);
                                } catch {}
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default MerchantHome;
