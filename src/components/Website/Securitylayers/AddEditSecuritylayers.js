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
    const { useQueryGQL, fetchUsers, useMutationGQL, updateUserRoles, findRoles } = API();
    const { buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const [selectedroles, setselectedroles] = useState([]);
    const [rolesarray, setrolesarray] = useState([]);
    const [updateUserRolesMutation] = useMutationGQL(updateUserRoles(), {
        roles: selectedroles,
        id: props?.payload?.id,
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);
    const findRolesQuery = useQueryGQL('', findRoles());

    useEffect(() => {
        const roleIds = props?.payload?.userRoles?.map((role) => role.roleId) || [];
        setselectedroles(roleIds);
    }, [props?.payload]);

    useEffect(() => {
        if (findRolesQuery?.data?.findRoles) {
            const roles = _.groupBy(findRolesQuery?.data?.findRoles, 'type');
            const rolestemp = _.map(roles, (roles, type) => {
                // Filter out 'editOrderStatus' from the 'roles' array under 'order' type
                if (type === 'order' && cookies.get('merchantId')) {
                    roles = roles.filter((role) => role.name !== 'editOrderStatus');
                }
                return { type, roles };
            });

            if (cookies.get('merchantId')) {
                setrolesarray(rolestemp?.filter((e) => e.type == 'merchant' || e.type == 'order'));
            } else {
                setrolesarray(rolestemp);
            }
        }
    }, [findRolesQuery?.data?.findRoles]);

    const handleRoleChange = (userRoleItem, type) => {
        let newSelectedRoles = [...selectedroles];

        const sectionRoles = rolesarray.find((item) => item.type === type).roles.map((role) => role.id);

        if (newSelectedRoles.includes(1)) {
            if (userRoleItem?.id == 1) {
                if (newSelectedRoles.includes(userRoleItem.id)) {
                    newSelectedRoles = newSelectedRoles.filter((roleId) => roleId !== userRoleItem.id);
                } else {
                    newSelectedRoles = [1];
                }
            }
        } else {
            if (userRoleItem?.id == 1) {
                if (newSelectedRoles.includes(userRoleItem.id)) {
                    newSelectedRoles = newSelectedRoles.filter((roleId) => roleId !== userRoleItem.id);
                } else {
                    newSelectedRoles = [1];
                }
            } else {
                if (userRoleItem.name.includes('Admin')) {
                    if (newSelectedRoles.includes(userRoleItem.id)) {
                        newSelectedRoles = newSelectedRoles.filter((roleId) => roleId !== userRoleItem.id);
                    } else {
                        newSelectedRoles = newSelectedRoles.filter((roleId) => !sectionRoles.includes(roleId));
                        newSelectedRoles.push(userRoleItem.id);
                    }
                } else {
                    if (newSelectedRoles.includes(userRoleItem.id)) {
                        newSelectedRoles = newSelectedRoles.filter((roleId) => roleId !== userRoleItem.id);
                    } else {
                        const adminRole = rolesarray.find((item) => item.type === type)?.roles.find((role) => role.name.includes('Admin'));
                        if (!newSelectedRoles.includes(adminRole?.id)) {
                            newSelectedRoles.push(userRoleItem.id);
                        }
                    }
                }
            }
        }

        // alert(JSON.stringify(newSelectedRoles));
        setselectedroles([...newSelectedRoles]);
    };

    const isRoleSelected = (roleId) => selectedroles.includes(roleId);

    const isSectionAdminSelected = (type) => {
        const sectionRoles = rolesarray.find((item) => item.type === type)?.roles || [];
        return sectionRoles.some((role) => role.name.includes('Admin') && isRoleSelected(role.id));
    };

    return (
        <div className="row m-0 w-100 p-md-2 pt-0">
            <div className="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className="row m-0 w-100">
                    {rolesarray.map((mainitem, mainindex) => (
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
                                            {mainitem?.roles?.map((userRoleItem, userRoleIndex) => {
                                                const selected = isRoleSelected(userRoleItem.id);
                                                const adminSelected = isSectionAdminSelected(mainitem.type);

                                                return (
                                                    <div key={userRoleIndex} className="col-xl-4 col-lg-4 col-md-12 col-sm-12 m-0 mb-1 p-sm-0">
                                                        <div className="m-0 pt-1 pb-1 pl-2 pr-2" style={{ borderRadius: '5px' }}>
                                                            {!props?.edit && (
                                                                <p className={`${generalstyles.checkbox_label} ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak`}>
                                                                    {userRoleItem?.label}
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
                                                                            (adminSelected && !userRoleItem.name.includes('Admin')) || (selectedroles?.includes(1) && parseInt(userRoleItem?.id) != 1)
                                                                        }
                                                                        onChange={() => handleRoleChange(userRoleItem, mainitem.type)}
                                                                    />
                                                                    <svg viewBox="0 0 21 21" className="h-100">
                                                                        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                    </svg>
                                                                    <p
                                                                        style={{
                                                                            color:
                                                                                (adminSelected && !userRoleItem.name.includes('Admin')) ||
                                                                                (selectedroles?.includes(1) && parseInt(userRoleItem?.id) != 1)
                                                                                    ? 'grey'
                                                                                    : '',
                                                                        }}
                                                                        className={`${generalstyles.checkbox_label} ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak`}
                                                                    >
                                                                        {userRoleItem?.name.split(/(?=[A-Z])/).join(' ')}
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
                                    const { data } = await updateUserRolesMutation();
                                    if (props?.setopenModal) {
                                        props?.setopenModal(false);
                                    }
                                    if (props?.setchangerolesmodal) {
                                        props?.setchangerolesmodal(false);
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
