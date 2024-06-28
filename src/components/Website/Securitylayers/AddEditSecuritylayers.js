import React, { Component, useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../LanguageContext';
import { useHistory, useParams } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { NotificationManager } from 'react-notifications';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// import Pagepreloader from '../Pagepreloader';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
// import { } from '../../API/SecurityLayers_API';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import API from '../../../API/API';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';

const AddEditSecuritylayers = (props) => {
    const { lang, langdetect } = React.useContext(LanguageContext);
    const { functypeparam, editsecuritygroupidparams } = useParams();
    const { userRolesContext, UserInfoContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, updateUserRoles } = API();

    const [selectedroles, setselectedroles] = useState([]);

    const [rolesarray, setrolesarray] = useState([
        {
            title: 'Inventory',
            included: 'invent',
        },
        {
            title: 'Merchant',
            included: 'merchant',
        },
        {
            title: 'Finance',
            included: 'finance',
        },
        {
            title: 'Courier',
            included: 'courier',
        },
        {
            title: 'Order',
            included: 'order',
        },
        {
            title: 'Request',
            included: 'request',
        },
        {
            title: 'User',
            included: 'user',
        },
    ]);

    const [updateUserRolesMutation] = useMutationGQL(updateUserRoles(), {
        roles: selectedroles,
        id: props?.payload?.id,
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);

    useEffect(() => {
        const roleIds = props?.payload?.userRoles?.map((role) => role.roleId) || [];
        setselectedroles(roleIds);
    }, [props?.payload]);

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
                                                        <p class={generalstyles.cardTitle + '  m-0 p-0 '}>{mainitem.title}:</p>
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
                                                {userRolesContext?.map((userRoleItem, userRoleIndex) => {
                                                    if (userRoleItem?.label?.toLowerCase().includes(mainitem?.included?.toLowerCase())) {
                                                        var selected = false;
                                                        selectedroles.map((role, roleindex) => {
                                                            if (userRoleItem.value == role) {
                                                                selected = true;
                                                            }
                                                        });
                                                        return (
                                                            <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 m-0 mb-1 p-sm-0">
                                                                <div class={' m-0 pt-1 pb-1 pl-2 pr-2 '} style={{ borderRadius: '5px' }}>
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
                                                                                    if (userRoleItem.value == role) {
                                                                                        index = roleindex;
                                                                                    }
                                                                                });
                                                                                if (selected) {
                                                                                    array.splice(index, 1);
                                                                                } else {
                                                                                    array.push(parseInt(userRoleItem.value));
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
                                                                            {userRoleItem?.label}
                                                                        </p>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
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
                                try {
                                    var { data } = await updateUserRolesMutation();
                                    props?.setopenModal(false);
                                    props?.setchangerolesmodal(false);

                                    refetchUsers();
                                } catch (error) {
                                    // console.error('Error in:', error);
                                    NotificationManager.warning(error, 'Warning');
                                }
                            }}
                        >
                            {/* {!CRUDSecurityGroupMutation?.isLoading && <> */}
                            Update
                            {/* </>} */}
                            {/* {CRUDSecurityGroupMutation?.isLoading && (
                                        <>
                                            <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />
                                        </>
                                    )} */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditSecuritylayers;
