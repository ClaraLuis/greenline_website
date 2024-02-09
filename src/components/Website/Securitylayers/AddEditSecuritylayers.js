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

const AddEditSecuritylayers = () => {
    const { lang, langdetect } = React.useContext(LanguageContext);
    const { functypeparam, editsecuritygroupidparams } = useParams();
    const history = useHistory();
    const queryClient = useQueryClient();
    const { FetchSecuritylayers_API, CRUDSecurityGroup_API, FetchAllSecuritylayers_API, DeleteSecurityGroup_API, FetchUsers_API } = API();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const [selectedusers, setselectedusers] = useState([]);
    const [showassignedusers, setshowassignedusers] = useState(false);

    const [payloadobj, setpayloadobj] = useState({
        functype: functypeparam,
        name: '',
        permissionsarr: [],
        id: 'add',
    });
    const [initialrolesarray, setinitialrolesarray] = useState(['accessInventory', 'accessMerchant', 'viewMerchantDashboard', 'editInventories']);
    const [selectedroles, setselectedroles] = useState([]);

    const [rolesarray, setrolesarray] = useState([
        {
            title: 'Inventory',
            items: [
                { name: 'Access Inventory', role: 'accessInventory' },
                { name: 'View Inventories', role: 'viewInventories' },
                { name: 'Add Inventories', role: 'addInventories' },
                { name: 'Edit Inventories', role: 'editInventories' },
            ],
        },
        {
            title: 'Merchant',
            items: [
                { name: 'Access Merchant', role: 'accessMerchant' },
                { name: 'View Merchant Dashboard', role: 'viewMerchantDashboard' },
                { name: 'View Merchant Account', role: 'viewMerchantAccount' },
                { name: 'View Merchant Items', role: 'viewMerchantItems' },
            ],
        },
    ]);

    useEffect(() => {
        setselectedroles([...initialrolesarray]);
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-0">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={'row m-0 w-100'}>
                    {rolesarray.map((mainitem, mainindex) => {
                        return (
                            <div style={{ border: '1px solid #e4e6ee', borderRadius: '10px' }} class={' mb-3 col-lg-12 p-2'}>
                                <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                    <AccordionItem class={`${generalstyles.innercard}` + ' '}>
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
                                                                            <BsChevronDown />
                                                                        </i>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <i class="h-100 d-flex align-items-center justify-content-center">
                                                                            <BsChevronUp />
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
                                                {mainitem.items.map((subitem, subitemindex) => {
                                                    var selected = false;
                                                    selectedroles.map((role, roleindex) => {
                                                        if (subitem.role == role) {
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
                                                                                if (subitem.role == role) {
                                                                                    index = roleindex;
                                                                                }
                                                                            });
                                                                            if (selected) {
                                                                                array.splice(index, 1);
                                                                            } else {
                                                                                array.push(subitem.role);
                                                                            }
                                                                            setselectedroles([...array]);
                                                                        }}
                                                                    />
                                                                    <svg viewBox="0 0 21 21" class="h-100">
                                                                        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                    </svg>
                                                                    <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>
                                                                        {subitem.name}
                                                                    </p>
                                                                </label>
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
                            class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                            // disabled={CRUDSecurityGroupMutation?.isLoading}
                            onClick={() => {
                                var rolesToBeDeleted = [];
                                var rolesToBeAdded = [];
                                initialrolesarray.map((i, ii) => {
                                    var exist = false;
                                    selectedroles.map((m, mm) => {
                                        if (i == m) {
                                            exist = true;
                                        }
                                    });
                                    if (!exist) {
                                        rolesToBeDeleted.push(i);
                                    }
                                });
                                selectedroles.map((i, ii) => {
                                    var exist = false;
                                    initialrolesarray.map((m, mm) => {
                                        if (i == m) {
                                            exist = true;
                                        }
                                    });
                                    if (!exist) {
                                        rolesToBeAdded.push(i);
                                    }
                                });
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
