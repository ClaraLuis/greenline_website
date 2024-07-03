import React, { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { NotificationManager } from 'react-notifications';
import { useParams } from 'react-router-dom';
import { LanguageContext } from '../../../LanguageContext';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// import Pagepreloader from '../Pagepreloader';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
// import { } from '../../API/SecurityLayers_API';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';

const AddEditSecuritylayers = (props) => {
    const { lang, langdetect } = React.useContext(LanguageContext);
    const { functypeparam, editsecuritygroupidparams } = useParams();
    const { userRolesContext, UserInfoContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, updateUserRoles, findRoles } = API();

    const [selectedroles, setselectedroles] = useState([]);

    const [rolesarray, setrolesarray] = useState([]);
    const [buttonLoading, setbuttonLoading] = useState(false);
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
            var rolestemp = _.map(roles, (roles, type) => {
                return { type: type, roles: roles };
            });
            setrolesarray(rolestemp);
        }
    }, [findRolesQuery?.data?.findRoles]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-0">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={'row m-0 w-100'}>
                    {rolesarray.map((mainitem, mainindex) => {
                        return (
                            <div style={{ border: '1px solid #e4e6ee', borderRadius: '10px' }} class={' mb-3 col-lg-12 p-2'}>
                                <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                    <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div class="row m-0 w-100">
                                                    <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                        <p class={generalstyles.cardTitle + '  m-0 p-0 '}>{mainitem.type}:</p>
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
                                            <div className={' row p-0 w-100  mb-3 m-auto '}>
                                                {mainitem?.roles?.map((userRoleItem, userRoleIndex) => {
                                                    var selected = false;
                                                    selectedroles.map((role, roleindex) => {
                                                        if (userRoleItem.id == role) {
                                                            selected = true;
                                                        }
                                                    });

                                                    return (
                                                        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 m-0 mb-1 p-sm-0">
                                                            <div class={' m-0 pt-1 pb-1 pl-2 pr-2 '} style={{ borderRadius: '5px' }}>
                                                                {!props?.edit && (
                                                                    <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>
                                                                        {userRoleItem?.label}
                                                                    </p>
                                                                )}
                                                                {props?.edit && (
                                                                    <label
                                                                        class={
                                                                            langdetect == 'en'
                                                                                ? `${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 '
                                                                                : `${formstyles.checkbox} ${formstyles.checkboxtranslated} ${formstyles.path}` + ' d-flex mb-0 '
                                                                        }
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            class="mt-auto mb-auto"
                                                                            checked={selected}
                                                                            onChange={() => {
                                                                                var array = [...selectedroles];
                                                                                var index = 0;
                                                                                selectedroles.map((role, roleindex) => {
                                                                                    if (userRoleItem.id == role) {
                                                                                        index = roleindex;
                                                                                    }
                                                                                });
                                                                                if (selected) {
                                                                                    array.splice(index, 1);
                                                                                } else {
                                                                                    array.push(parseInt(userRoleItem.id));
                                                                                }
                                                                                setselectedroles([...array]);
                                                                            }}
                                                                        />
                                                                        <svg viewBox="0 0 21 21" class="h-100">
                                                                            <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                        </svg>
                                                                        <p
                                                                            class={
                                                                                `${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '
                                                                            }
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
                        );
                    })}

                    <div class=" col-lg-12 d-flex align-items-center justify-content-center mt-2 mb-3">
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1'}
                            // disabled={CRUDSecurityGroupMutation?.isLoading}
                            onClick={async () => {
                                setbuttonLoading(true);
                                try {
                                    var { data } = await updateUserRolesMutation();
                                    props?.setopenModal(false);
                                    props?.setchangerolesmodal(false);

                                    refetchUsers();
                                } catch (error) {
                                    let errorMessage = 'An unexpected error occurred';
                                    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                        errorMessage = error.graphQLErrors[0].message || errorMessage;
                                    } else if (error.networkError) {
                                        errorMessage = error.networkError.message || errorMessage;
                                    } else if (error.message) {
                                        errorMessage = error.message;
                                    }

                                    NotificationManager.warning(errorMessage, 'Warning!');
                                }
                                setbuttonLoading(false);
                            }}
                        >
                            {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!buttonLoading && <span>Update</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditSecuritylayers;
