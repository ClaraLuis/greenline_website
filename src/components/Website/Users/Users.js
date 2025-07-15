import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Select from 'react-select';

// Icons
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import UserInfo from './UserInfo.js';
import UsersTable from './UsersTable.js';
import SelectComponent from '../../SelectComponent.js';
import MultiSelect from '../../MultiSelect.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

const { ValueContainer, Placeholder } = components;

const Users = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth, userTypeContext, employeeTypeContext, useLoadQueryParamsToPayload, updateQueryParamContext } =
        useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchMerchants, fetchHubs } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [search, setSearch] = useState('');

    const [payload, setpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: 'merchant',
        phone: '',
        email: '',
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    useLoadQueryParamsToPayload(setfilterUsers);

    const fetchusers = useQueryGQL('', fetchUsers(), filterUsers);
    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);

    const [filterHubs, setfilterHubs] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('cache-first', fetchHubs(), filterHubs);

    useEffect(() => {
        setpageactive_context('/users');
        setpagetitle_context('Settings');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' row m-0 w-100'}>
                    <div class={' col-lg-12 px-3 '}>
                        {' '}
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Users
                            </p>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'}>
                            <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                                <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                                    <span style={{ color: 'var(--info)' }}> {fetchusers?.data?.paginateUsers?.data?.length} </span>
                                </p>
                            </div>
                            {isAuth([1, 44, 52]) && (
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1'}
                                        onClick={() => {
                                            setpayload({
                                                functype: 'add',
                                                id: 'add',
                                                name: '',
                                                type: 'merchant',
                                                phone: '',
                                                email: '',
                                            });
                                            setopenModal(true);
                                        }}
                                    >
                                        Add User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="col-lg-12 px-3">
                        <div class="row m-0 w-100">
                            <div style={{ borderRadius: '0.25rem', background: 'white' }} class={generalstyles.card + ' col-lg-12'}>
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
                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <div class="row m-0 w-100  ">
                                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                            <label class={formstyles.form__label}>Order by</label>
                                                            <Select
                                                                options={[
                                                                    { label: 'Oldest', value: true },
                                                                    { label: 'Latest', value: false },
                                                                ]}
                                                                styles={defaultstyles}
                                                                value={[
                                                                    { label: 'Oldest', value: true },
                                                                    { label: 'Latest', value: false },
                                                                ].find((option) => option.value === (filterUsers?.isAsc ?? true))}
                                                                onChange={(option) => {
                                                                    setfilterUsers({ ...filterUsers, isAsc: option?.value });
                                                                    updateQueryParamContext('isAsc', option?.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <MerchantSelectComponent
                                                        type="single"
                                                        payload={filterUsers}
                                                        payloadAttr={'merchantId'}
                                                        label={'name'}
                                                        value={'id'}
                                                        onClick={(option) => {
                                                            setfilterUsers({ ...filterUsers, merchantId: option?.id });
                                                            updateQueryParamContext('merchantId', option?.id);
                                                        }}
                                                    />
                                                </div>
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <SelectComponent
                                                        title={'Hub'}
                                                        filter={filterHubs}
                                                        setfilter={setfilterHubs}
                                                        options={fetchHubsQuery}
                                                        attr={'paginateHubs'}
                                                        payload={filterUsers}
                                                        payloadAttr={'hubId'}
                                                        label={'name'}
                                                        value={'id'}
                                                        onClick={(option) => {
                                                            setfilterUsers({ ...filterUsers, hubId: option?.id });
                                                            updateQueryParamContext('hubId', option?.id);
                                                        }}
                                                    />
                                                </div>
                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <MultiSelect
                                                        title="Types"
                                                        options={employeeTypeContext}
                                                        label="label"
                                                        value="value"
                                                        selected={filterUsers?.employeeTypes}
                                                        onClick={(option) => {
                                                            const tempArray = [...(filterUsers?.employeeTypes ?? [])];

                                                            if (option === 'All') {
                                                                setfilterUsers({ ...filterUsers, employeeTypes: undefined });
                                                                updateQueryParamContext('employeeTypes', undefined);
                                                            } else {
                                                                const index = tempArray.indexOf(option?.value);
                                                                if (index === -1) {
                                                                    tempArray.push(option?.value);
                                                                } else {
                                                                    tempArray.splice(index, 1);
                                                                }

                                                                setfilterUsers({ ...filterUsers, employeeTypes: tempArray.length ? tempArray : undefined });
                                                                updateQueryParamContext('employeeTypes', tempArray.length ? tempArray : undefined);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <MultiSelect
                                                        title="Emplyee Type"
                                                        options={userTypeContext}
                                                        label="label"
                                                        value="value"
                                                        selected={filterUsers?.types}
                                                        onClick={(option) => {
                                                            const tempArray = [...(filterUsers?.types ?? [])];

                                                            if (option === 'All') {
                                                                setfilterUsers({ ...filterUsers, types: undefined });
                                                                updateQueryParamContext('types', undefined);
                                                            } else {
                                                                const index = tempArray.indexOf(option?.value);
                                                                if (index === -1) {
                                                                    tempArray.push(option?.value);
                                                                } else {
                                                                    tempArray.splice(index, 1);
                                                                }

                                                                setfilterUsers({ ...filterUsers, types: tempArray.length ? tempArray : undefined });
                                                                updateQueryParamContext('types', tempArray.length ? tempArray : undefined);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                    <div class={' col-lg-12 px-3 '}>
                        <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'}>
                            <div class="col-lg-10">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        // disabled={props?.disabled}
                                        // type={props?.type}
                                        class={formstyles.form__field}
                                        value={search}
                                        placeholder={'Search by name, email, or phone'}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setfilterUsers({ ...filterUsers, name: search?.length == 0 ? undefined : search });
                                            }
                                        }}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-2 allcenered">
                                <button
                                    onClick={() => {
                                        setfilterUsers({ ...filterUsers, name: search?.length == 0 ? undefined : search });
                                    }}
                                    style={{ height: '35px', marginInlineStart: '5px' }}
                                    class={generalstyles.roundbutton + '  allcentered bg-primary-light'}
                                >
                                    search
                                </button>
                            </div>
                        </div>
                    </div>
                    {isAuth([1, 43, 52, 78, 79]) && (
                        <>
                            <div class="col-lg-12 p-0 mb-2">
                                <Pagination
                                    total={fetchusers?.data?.paginateUsers?.totalCount}
                                    beforeCursor={fetchusers?.data?.paginateUsers?.cursor?.beforeCursor}
                                    afterCursor={fetchusers?.data?.paginateUsers?.cursor?.afterCursor}
                                    filter={filterUsers}
                                    setfilter={setfilterUsers}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                <UsersTable
                                    openModal={openModal}
                                    setopenModal={setopenModal}
                                    payload={payload}
                                    setpayload={setpayload}
                                    refetchUsers={refetchUsers}
                                    fetchusers={fetchusers}
                                    card="col-lg-4"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <UserInfo openModal={openModal} setopenModal={setopenModal} payload={payload} setpayload={setpayload} refetchUsers={refetchUsers} />
        </div>
    );
};
export default Users;
