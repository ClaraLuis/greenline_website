import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';

// Icons
import { BiSearch } from 'react-icons/bi';
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import PermissionGroupsTable from './PermissionGroupsTable.js';

const { ValueContainer, Placeholder } = components;

const PermissionGroups = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth, userTypeContext, employeeTypeContext, useLoadQueryParamsToPayload, updateQueryParamContext } =
        useContext(Contexthandlerscontext);
    const { paginatePermissionGroups, useQueryGQL, fetchMerchants, fetchHubs } = API();

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

    const [filterPermissionGroupsQuery, setfilterPermissionGroupsQuery] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    useLoadQueryParamsToPayload(setfilterPermissionGroupsQuery);

    const paginatePermissionGroupsQuery = useQueryGQL('', paginatePermissionGroups(), filterPermissionGroupsQuery);
    const { refetch: refetchUsers } = useQueryGQL('', paginatePermissionGroups(), filterPermissionGroupsQuery);

    useEffect(() => {
        setpageactive_context('/permissiongroups');
        setpagetitle_context('Settings');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' row m-0 w-100'}>
                    <div class={' col-lg-12 px-3 '}>
                        {' '}
                        <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'}>
                            <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                                <p class=" p-0 m-0" style={{ fontSize: '24px' }}>
                                    <span style={{ color: 'var(--info)' }}> {paginatePermissionGroupsQuery?.data?.paginateUsers?.data?.length} </span>
                                </p>
                            </div>
                            {isAuth([1, 44]) && (
                                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1'}
                                        onClick={() => {
                                            history.push('/permissiongroupinfo');
                                        }}
                                    >
                                        Add Permission Group
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div class={' col-lg-12 px-3 '}>
                        <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'}>
                            <div class="col-lg-10 col-md-10">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        // disabled={props?.disabled}
                                        // type={props?.type}
                                        class={formstyles.form__field}
                                        value={search}
                                        placeholder={'Search'}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (paginatePermissionGroupsQuery?.loading) return;
                                                setfilterPermissionGroupsQuery({ ...filterPermissionGroupsQuery, search: search?.length == 0 ? undefined : search });
                                            }
                                        }}
                                        disabled={paginatePermissionGroupsQuery?.loading}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-2  col-md-2 allcenered p-md-0">
                                <button
                                    onClick={() => {
                                        if (paginatePermissionGroupsQuery?.loading) return;
                                        setfilterPermissionGroupsQuery({ ...filterPermissionGroupsQuery, search: search?.length == 0 ? undefined : search });
                                    }}
                                    disabled={paginatePermissionGroupsQuery?.loading}
                                    style={{ height: '35px', marginInlineStart: '5px', minWidth: 'auto' }}
                                    class={generalstyles.roundbutton + '  allcentered bg-primary-light'}
                                >
                                    <div class="d-flex d-md-none">search</div>
                                    <div class="d-none d-md-flex">
                                        <BiSearch />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    {isAuth([1, 43, 78, 79]) && (
                        <>
                            <div class="col-lg-12 p-0 mb-2">
                                <Pagination
                                    total={paginatePermissionGroupsQuery?.data?.paginateUsers?.totalCount}
                                    beforeCursor={paginatePermissionGroupsQuery?.data?.paginateUsers?.cursor?.beforeCursor}
                                    afterCursor={paginatePermissionGroupsQuery?.data?.paginateUsers?.cursor?.afterCursor}
                                    filter={filterPermissionGroupsQuery}
                                    setfilter={setfilterPermissionGroupsQuery}
                                    loading={paginatePermissionGroupsQuery?.loading}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                <PermissionGroupsTable
                                    openModal={openModal}
                                    setopenModal={setopenModal}
                                    payload={payload}
                                    setpayload={setpayload}
                                    refetchUsers={refetchUsers}
                                    paginatePermissionGroupsQuery={paginatePermissionGroupsQuery}
                                    card="col-lg-4"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PermissionGroups;
