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

const AddEditSecuritylayers = (props) => {
    const cookies = new Cookies();
    const { lang, langdetect } = useContext(LanguageContext);
    const { useQueryGQL, fetchUsers, useMutationGQL, updateUserPermissions, findPermissions } = API();
    const { buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const [selectedpermissions, setselectedpermissions] = useState([]);
    const [permissionsarray, setpermissionsarray] = useState([]);
    const [updateUserPermissionsMutation] = useMutationGQL(updateUserPermissions(), {
        permissions: selectedpermissions,
        id: props?.payload?.id,
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);
    const findPermissionsQuery = useQueryGQL('', findPermissions());

    useEffect(() => {
        const permissionIds = props?.payload?.userPermissions?.map((permission) => permission.permissionId) || [];
        setselectedpermissions(permissionIds);
    }, [props?.payload]);

    useEffect(() => {
        if (findPermissionsQuery?.data?.findPermissions) {
            const permissions = _.groupBy(findPermissionsQuery?.data?.findPermissions, 'type');
            const permissionstemp = _.map(permissions, (permissions, type) => {
                // Filter out 'editOrderStatus' from the 'permissions' array under 'order' type
                if (type === 'order' && cookies.get('merchantId')) {
                    permissions = permissions.filter((permission) => permission.name !== 'editOrderStatus');
                }
                return { type, permissions };
            });

            // if (cookies.get('merchantId')) {
            //     setpermissionsarray(permissionstemp?.filter((e) => e.type == 'merchant' || e.type == 'order'));
            // } else {
            setpermissionsarray(permissionstemp);
            // }
        }
    }, [findPermissionsQuery?.data?.findPermissions]);

    const handlePermissionChange = (userPermissionItem, type) => {
        let newSelectedPermissions = [...selectedpermissions];

        const sectionPermissions = permissionsarray.find((item) => item.type === type).permissions.map((permission) => permission.id);

        if (newSelectedPermissions.includes(1)) {
            if (userPermissionItem?.id == 1) {
                if (newSelectedPermissions.includes(userPermissionItem.id)) {
                    newSelectedPermissions = newSelectedPermissions.filter((permissionId) => permissionId !== userPermissionItem.id);
                } else {
                    newSelectedPermissions = [1];
                }
            }
        } else {
            if (userPermissionItem?.id == 1) {
                if (newSelectedPermissions.includes(userPermissionItem.id)) {
                    newSelectedPermissions = newSelectedPermissions.filter((permissionId) => permissionId !== userPermissionItem.id);
                } else {
                    newSelectedPermissions = [1];
                }
            } else {
                if (userPermissionItem.name.includes('Admin')) {
                    if (newSelectedPermissions.includes(userPermissionItem.id)) {
                        newSelectedPermissions = newSelectedPermissions.filter((permissionId) => permissionId !== userPermissionItem.id);
                    } else {
                        newSelectedPermissions = newSelectedPermissions.filter((permissionId) => !sectionPermissions.includes(permissionId));
                        newSelectedPermissions.push(userPermissionItem.id);
                    }
                } else {
                    if (newSelectedPermissions.includes(userPermissionItem.id)) {
                        newSelectedPermissions = newSelectedPermissions.filter((permissionId) => permissionId !== userPermissionItem.id);
                    } else {
                        const adminPermission = permissionsarray.find((item) => item.type === type)?.permissions.find((permission) => permission.name.includes('Admin'));
                        if (!newSelectedPermissions.includes(adminPermission?.id)) {
                            newSelectedPermissions.push(userPermissionItem.id);
                        }
                    }
                }
            }
        }

        // alert(JSON.stringify(newSelectedPermissions));
        setselectedpermissions([...newSelectedPermissions]);
    };

    const isPermissionSelected = (permissionId) => selectedpermissions.includes(permissionId);

    const isSectionAdminSelected = (type) => {
        const sectionPermissions = permissionsarray.find((item) => item.type === type)?.permissions || [];
        return sectionPermissions.some((permission) => permission.name.includes('Admin') && isPermissionSelected(permission.id));
    };

    return (
        <div className="row m-0 w-100 p-md-2 pt-0">
            <div className="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className="row m-0 w-100">
                    {permissionsarray.map((mainitem, mainindex) => (
                        <div key={mainindex} style={{ border: '1px solid #e4e6ee', borderRadius: '10px' }} className="mb-3 col-lg-12 p-2">
                            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                <AccordionItem className={`${generalstyles.innercard} p-2`}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            <div className="row m-0 w-100">
                                                <div className="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                    <p className={`${generalstyles.cardTitle} m-0 p-0`}>{mainitem.type}:</p>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                                    <AccordionItemState>
                                                        {(state) => <i className="h-100 d-flex align-items-center justify-content-center">{state.expanded ? <BsChevronUp /> : <BsChevronDown />}</i>}
                                                    </AccordionItemState>
                                                </div>
                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        <hr className="mt-2 mb-3" />
                                        <div className="row p-0 w-100 mb-3 m-auto">
                                            {mainitem?.permissions?.map((userPermissionItem, userPermissionIndex) => {
                                                const selected = isPermissionSelected(userPermissionItem.id);
                                                const adminSelected = isSectionAdminSelected(mainitem.type);

                                                return (
                                                    <div key={userPermissionIndex} className="col-xl-4 col-lg-4 col-md-12 col-sm-12 m-0 mb-1 p-sm-0">
                                                        <div className="m-0 pt-1 pb-1 pl-2 pr-2" style={{ borderRadius: '5px' }}>
                                                            {!props?.edit && (
                                                                <p className={`${generalstyles.checkbox_label} ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak`}>
                                                                    {userPermissionItem?.label}
                                                                </p>
                                                            )}
                                                            {props?.edit && (
                                                                <label
                                                                    className={`${langdetect === 'en' ? formstyles.checkbox : formstyles.checkboxtranslated} ${formstyles.checkbox_sub} ${
                                                                        formstyles.path
                                                                    } d-flex mb-0`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mt-auto mb-auto"
                                                                        checked={selected}
                                                                        disabled={
                                                                            (adminSelected && !userPermissionItem.name.includes('Admin')) ||
                                                                            (selectedpermissions?.includes(1) && parseInt(userPermissionItem?.id) != 1)
                                                                        }
                                                                        onChange={() => handlePermissionChange(userPermissionItem, mainitem.type)}
                                                                    />
                                                                    <svg viewBox="0 0 21 21" className="h-100">
                                                                        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                    </svg>
                                                                    <p
                                                                        style={{
                                                                            color:
                                                                                (adminSelected && !userPermissionItem.name.includes('Admin')) ||
                                                                                (selectedpermissions?.includes(1) && parseInt(userPermissionItem?.id) != 1)
                                                                                    ? 'grey'
                                                                                    : '',
                                                                        }}
                                                                        className={`${generalstyles.checkbox_label} ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak text-capitalize`}
                                                                    >
                                                                        {userPermissionItem?.name.split(/(?=[A-Z])/).join(' ')}
                                                                    </p>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}

                    <div className="col-lg-12 d-flex align-items-center justify-content-center mt-2 mb-3">
                        <button
                            style={{ height: '35px' }}
                            className={`${generalstyles.roundbutton} mb-1`}
                            onClick={async () => {
                                if (buttonLoadingContext) return;
                                setbuttonLoadingContext(true);
                                try {
                                    const { data } = await updateUserPermissionsMutation();
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
