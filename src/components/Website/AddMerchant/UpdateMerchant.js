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
import Select from 'react-select';
import API from '../../../API/API.js';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { useQuery } from 'react-query';
import Form from '../../Form.js';
import { BiEdit } from 'react-icons/bi';

const UpdateMerchant = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, inventoryRentTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, fetchGovernorates, createMerchantDomesticShipping, updateMerchantDomesticShipping, fetchMerchants, addMerchant, createInventoryRent, fetchAllCountries } =
        API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [buttonLoading, setbuttonLoading] = useState(false);
    const { lang, langdetect } = useContext(LanguageContext);

    const [addresspayload, setaddresspayload] = useState({
        city: '',
        country: 'Egypt',
        streetAddress: '',
    });
    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());

    const [merchantPayload, setmerchantPayload] = useState({
        functype: 'add',
        name: '',
        includesVat: false,
        currency: 'EGP',
        overShipping: undefined,
        threshold: undefined,
    });
    const fetchAllCountriesQuery = useQuery(['fetchAllCountries'], () => fetchAllCountries(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [submit, setsubmit] = React.useState(false);
    const [edit, setEdit] = React.useState({
        mainInfo: false,
        address: false,
        billingInfo: false,
        ownerInfo: false,
    });

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class={' row m-0 w-100 allcentered'}>
                <div class="col-lg-12 p-0 mb-2 allcentered">
                    <div class="col-lg-6">
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div> Main Info</div>
                                <BiEdit
                                    onClick={() => {
                                        setEdit({ ...edit, mainInfo: true });
                                    }}
                                    class="text-secondaryhover"
                                />
                            </div>
                        </div>
                        {edit?.mainInfo && (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Name</label>
                                            <input
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={merchantPayload.name}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, name: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Currency</label>
                                            <input
                                                disabled={true}
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={merchantPayload.currency}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, currency: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!edit?.mainInfo && (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Name</label>
                                            <div>Merchant 123</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Currency</label>
                                            <div>EGP</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div class="col-lg-12 p-0 mb-2 allcentered">
                    <div class="col-lg-6">
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div>Address</div>
                                <BiEdit
                                    onClick={() => {
                                        setEdit({ ...edit, address: true });
                                    }}
                                    class="text-secondaryhover"
                                />
                            </div>
                        </div>
                        {edit?.address && (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12 p-0">
                                    <div class="row m-0 w-100 ">
                                        <Form
                                            size={'lg'}
                                            submit={submit}
                                            setsubmit={setsubmit}
                                            attr={
                                                addresspayload?.country == 'Egypt'
                                                    ? [
                                                          {
                                                              title: 'Country',
                                                              options: fetchAllCountriesQuery,
                                                              optionsAttr: 'data',
                                                              label: 'country',
                                                              value: 'country',
                                                              size: '6',
                                                              attr: 'country',
                                                              type: 'fetchSelect',
                                                              payload: addresspayload,
                                                          },
                                                          {
                                                              name: 'City',
                                                              attr: 'city',
                                                              type: 'select',
                                                              options: fetchGovernoratesQuery?.data?.findAllDomesticGovernorates,
                                                              size: '6',
                                                              optionValue: 'name',
                                                              optionLabel: 'name',
                                                          },
                                                          { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                          { name: 'Apartment Floor', attr: 'apartmentFloor', size: '6' },
                                                          { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                      ]
                                                    : [
                                                          {
                                                              title: 'Country',
                                                              options: fetchAllCountriesQuery,
                                                              optionsAttr: 'data',
                                                              label: 'country',
                                                              value: 'country',
                                                              size: '6',
                                                              attr: 'country',
                                                              type: 'fetchSelect',
                                                              payload: addresspayload,
                                                          },
                                                          {
                                                              name: 'City',
                                                              attr: 'city',
                                                              type: 'select',
                                                              options: cities,
                                                              size: '6',
                                                          },
                                                          { name: 'Building Number', attr: 'buildingNumber', size: '6' },
                                                          { name: 'Apartment Floor', attr: 'apartmentFloor', size: '6' },
                                                          { name: 'Street Address', attr: 'streetAddress', type: 'textarea', size: '12' },
                                                      ]
                                            }
                                            payload={addresspayload}
                                            setpayload={setaddresspayload}
                                            button1disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {!edit?.address && (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Country</label>
                                            <div>Egypt</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>City</label>
                                            <div>Cairo</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Building Number</label>
                                            <div>22</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Apartment Floor</label>
                                            <div>2</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Street Address</label>
                                            <div>123 street</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div class="col-lg-12 p-0 mb-2 allcentered">
                    <div class="col-lg-6">
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div>Billing Info</div>
                                <BiEdit
                                    onClick={() => {
                                        setEdit({ ...edit, billingInfo: true });
                                    }}
                                    class="text-secondaryhover"
                                />
                            </div>
                        </div>
                        {edit.billingInfo ? (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Bank Name</label>
                                            <input
                                                type="text"
                                                class={formstyles.form__field}
                                                value={merchantPayload.bankName}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, bankName: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Bank Number</label>
                                            <input
                                                type="number"
                                                class={formstyles.form__field}
                                                value={merchantPayload.bankNumber}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, bankNumber: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Tax Id</label>
                                            <input
                                                type="number"
                                                class={formstyles.form__field}
                                                value={merchantPayload.taxId}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, taxId: event.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 pl-0">
                                    <label for="name" class={formstyles.form__label}>
                                        Includes VAT
                                    </label>
                                    <Select
                                        options={[
                                            { label: 'Includes VAT', value: true },
                                            { label: 'Does not include VAT', value: false },
                                        ]}
                                        styles={defaultstyles}
                                        value={[
                                            { label: 'Includes VAT', value: true },
                                            { label: 'Does not include VAT', value: false },
                                        ].filter((option) => option.value == merchantPayload.includesVat)}
                                        onChange={(option) => {
                                            setmerchantPayload({ ...merchantPayload, includesVat: option.value });
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Bank Name</label>
                                            <div>{merchantPayload.bankName}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Bank Number</label>
                                            <div>{merchantPayload.bankNumber}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row m-0 w-100">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Tax Id</label>
                                            <div>{merchantPayload.taxId}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 pl-0">
                                    <label class={formstyles.form__label}>Includes VAT</label>
                                    <div>{merchantPayload.includesVat ? 'Includes VAT' : 'Does not include VAT'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div class="col-lg-12 p-0 mb-2 allcentered">
                    <div class="col-lg-6">
                        <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                            <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                <div>Owner Info</div>
                                <BiEdit
                                    onClick={() => {
                                        setEdit({ ...edit, ownerInfo: true });
                                    }}
                                    class="text-secondaryhover"
                                />
                            </div>
                        </div>
                        {edit.ownerInfo ? (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Name</label>
                                            <input
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={merchantPayload.ownerName}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, ownerName: event.target.value?.length != 0 ? event.target.value : undefined });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Email</label>
                                            <input
                                                type={'text'}
                                                class={formstyles.form__field}
                                                value={merchantPayload.ownerEmail}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, ownerEmail: event.target.value?.length != 0 ? event.target.value : undefined });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Phone</label>
                                            <input
                                                type={'number'}
                                                class={formstyles.form__field}
                                                value={merchantPayload.ownerPhone}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, ownerPhone: event.target.value?.length != 0 ? event.target.value : undefined });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Birthdate</label>
                                            <input
                                                type={'date'}
                                                class={formstyles.form__field}
                                                value={merchantPayload.ownerBirthdate}
                                                onChange={(event) => {
                                                    setmerchantPayload({ ...merchantPayload, ownerBirthdate: event.target.value?.length != 0 ? event.target.value : undefined });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div class={generalstyles.card + ' row m-0 w-100'} style={{ padding: '40px 70px' }}>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Name</label>
                                            <div>{merchantPayload.ownerName}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Email</label>
                                            <div>{merchantPayload.ownerEmail}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Phone</label>
                                            <div>{merchantPayload.ownerPhone}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="row m-0 w-100  ">
                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                            <label class={formstyles.form__label}>Owner Birthdate</label>
                                            <div>{merchantPayload.ownerBirthdate}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>{' '}
            </div>
        </div>
    );
};
export default UpdateMerchant;
