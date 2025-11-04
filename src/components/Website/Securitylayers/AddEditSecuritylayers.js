import React, { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { NotificationManager } from 'react-notifications';
import { useParams } from 'react-router-dom';
import { LanguageContext } from '../../../LanguageContext';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import Cookies from 'universal-cookie';
import Pagination from '../../Pagination';
import PermissionGroupsTable from '../PermissionGroups/PermissionGroupsTable';

const AddEditSecuritylayers = (props) => {
    const cookies = new Cookies();
    const { lang, langdetect } = useContext(LanguageContext);
    const { useQueryGQL, fetchUsers, useMutationGQL, updateUserPermissionGroups, findPermissions, paginatePermissionGroups } = API();
    const { buttonLoadingContext, setbuttonLoadingContext, useLoadQueryParamsToPayload, isAuth } = useContext(Contexthandlerscontext);
    const [selectedpermissions, setselectedpermissions] = useState([]);
    // const [selectedpermission, setpermissionsarray] = useState([]);
    const [updateUserPermissionGroupsMutation] = useMutationGQL(updateUserPermissionGroups(), {
        permissionGroupIds: selectedpermissions,
        userId: props?.payload?.id,
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);

    useEffect(() => {
        const permissionIds = props?.payload?.permissionGroups?.map((permission) => permission.id) || [];
        setselectedpermissions(permissionIds);
    }, [props?.payload]);

    const [filterPermissionGroupsQuery, setfilterPermissionGroupsQuery] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    useLoadQueryParamsToPayload(setfilterPermissionGroupsQuery);

    const { id, ...filteredQuery } = filterPermissionGroupsQuery || {};
    const paginatePermissionGroupsQuery = useQueryGQL('', paginatePermissionGroups(), filteredQuery);

    return (
        <div className="row m-0 w-100 p-md-2 pt-0">
            <div className="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className="row m-0 w-100">
                    {isAuth([1, 43, 131]) && (
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
                                    select={true}
                                    selectedpermissions={selectedpermissions}
                                    setselectedpermissions={setselectedpermissions}
                                    refetchUsers={refetchUsers}
                                    paginatePermissionGroupsQuery={paginatePermissionGroupsQuery}
                                    card="col-lg-4"
                                />
                            </div>
                        </>
                    )}

                    <div className="col-lg-12 d-flex align-items-center justify-content-center mt-2 mb-3">
                        <button
                            style={{ height: '35px' }}
                            className={`${generalstyles.roundbutton} mb-1`}
                            onClick={async () => {
                                if (buttonLoadingContext) return;
                                setbuttonLoadingContext(true);
                                try {
                                    const { data } = await updateUserPermissionGroupsMutation();
                                    if (data?.updateUserPermissionGroups?.success == true) {
                                        NotificationManager.success('Orders status updated successfully', 'Success');
                                        if (props?.setopenModal) {
                                            props?.setopenModal(false);
                                        }
                                        if (props?.setchangepermissionsmodal) {
                                            props?.setchangepermissionsmodal(false);
                                        }
                                        if (props?.fetchUserInfo) {
                                            props?.fetchUserInfo();
                                        }
                                        refetchUsers();
                                    } else {
                                        NotificationManager.warning(data?.updateUserPermissionGroups?.message, 'Warning!');
                                    }
                                } catch (error) {
                                    const errorMessage = error.graphQLErrors?.[0]?.message || error.networkError?.message || error.message || 'An unexpected error occurred';
                                    NotificationManager.warning(errorMessage, 'Warning!');
                                }
                                setbuttonLoadingContext(false);
                            }}
                        >
                            {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoadingContext && <span>Update</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditSecuritylayers;
