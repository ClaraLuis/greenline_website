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
    const FetchInstitueSecurityLayersQuery = useQuery(['FetchAllSecuritylayers_API'], () => FetchAllSecuritylayers_API(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const FetchTabexSecurityLayersQuery = useQuery(
        ['FetchSecuritylayers_API' + functypeparam + editsecuritygroupidparams],
        () => FetchSecuritylayers_API({ functype: functypeparam, editsecuritygroupid: editsecuritygroupidparams }),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        },
    );
    useEffect(() => {
        setpageactive_context('/securitylayers');
        setpagetitle_context('dashboard');
        document.title = 'Dashboard';
    }, []);
    useEffect(() => {
        if (FetchInstitueSecurityLayersQuery.isSuccess && FetchTabexSecurityLayersQuery?.isSuccess) {
            if (FetchInstitueSecurityLayersQuery.data.data.status) {
                var temppayloadobj = { ...payloadobj };
                temppayloadobj.permissionsarr = [...FetchTabexSecurityLayersQuery.data.data.data];
                var tempselectedusers = [];

                if (temppayloadobj.functype == 'edit') {
                    FetchInstitueSecurityLayersQuery?.data?.data?.data?.map((item, index) => {
                        if (item?.id == editsecuritygroupidparams) {
                            temppayloadobj.name = item.name;
                            temppayloadobj.id = item.id;

                            temppayloadobj.permissionsarr?.map((m, mm) => {
                                item.company_securitylayers_securitylayer?.map((i, ii) => {
                                    if (i?.permission?.id == m.id) {
                                        temppayloadobj.permissionsarr[mm].ischecked = true;
                                        if (m?.name == 'Show Assigned Users Only') {
                                            setshowassignedusers(true);
                                        }
                                    }
                                });
                            });

                            item.security_layer_assignedusers?.map((i, ii) => {
                                tempselectedusers.push(i.user);
                            });
                        }
                    });
                }
                setselectedusers(tempselectedusers);
                setpayloadobj({ ...temppayloadobj });
            }
        }
    }, [FetchTabexSecurityLayersQuery.isSuccess, FetchInstitueSecurityLayersQuery?.isSuccess]);
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchUsers = useQuery(['FetchUsers_API' + JSON.stringify(filterobj)], () => FetchUsers_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    const CRUDSecurityGroupMutation = useMutation('CRUDSecurityGroup_API', {
        mutationFn: CRUDSecurityGroup_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.error('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchInstitueSecurityLayersQuery?.refetch();
                history.push('/securitylayers');

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning('', data.data.reason);
            }
        },
    });
    const DeleteSecurityGroup = useMutation('DeleteSecurityGroup_API', {
        mutationFn: DeleteSecurityGroup_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.error('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                FetchInstitueSecurityLayersQuery?.refetch();

                history.push('/securitylayers');

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning('', data.data.reason);
            }
        },
    });

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Security layers
                    </p>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 p-0">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        {/* {FetchTabexSecurityLayersQuery.isFetching && (
                        <div class="d-flex align-items-center" style={{ height: '40vh' }}>
                            <Pagepreloader />
                        </div>
                    )} */}
                        {!FetchTabexSecurityLayersQuery.isFetching && FetchTabexSecurityLayersQuery.isSuccess && FetchTabexSecurityLayersQuery.data.data.status && (
                            <div class={'row m-0 w-100'}>
                                <div class="row m-0 w-100 d-flex justify-content-start align-items-center">
                                    <div className="col-lg-6 mb-4">
                                        <div class={' w-100 '}>
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-12 flex-column  p-0 p-md-0">
                                                    <p class="font-15 font-weight-500 mb-1"> Security Group Name </p>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        class={'inputfeild'}
                                                        value={payloadobj?.name}
                                                        onChange={(event) => {
                                                            var temppayloadobj = { ...payloadobj };
                                                            temppayloadobj.name = event.target.value;
                                                            setpayloadobj({ ...temppayloadobj });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {functypeparam == 'add' && (
                                        <div class="col-lg-2 d-flex justify-content-start align-items-center p-0">
                                            <button
                                                style={{ height: '35px' }}
                                                class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                                disabled={CRUDSecurityGroupMutation?.isLoading}
                                                onClick={() => {
                                                    if (payloadobj.name.length != 0) {
                                                        var temp = { ...payloadobj };
                                                        var arr = [];
                                                        payloadobj?.permissionsarr?.map((i, ii) => {
                                                            if (i.ischecked == true) {
                                                                arr.push(i.id);
                                                            }
                                                        });
                                                        temp.permissionsarr = arr;
                                                        temp.userids = selectedusers;
                                                        CRUDSecurityGroupMutation.mutate(temp);
                                                    } else {
                                                        NotificationManager.warning('', lang.pleaseaddsecuritygroupname);
                                                    }
                                                }}
                                            >
                                                {!CRUDSecurityGroupMutation?.isLoading && <>Add</>}
                                                {CRUDSecurityGroupMutation?.isLoading && (
                                                    <>
                                                        <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {payloadobj.permissionsarr.map((mainitem, mainindex) => {
                                    if (mainitem.structype == 'Parent') {
                                        return (
                                            <div style={{ border: '1px solid #e4e6ee', borderRadius: '10px' }} class={' mb-3 col-lg-12 p-2'}>
                                                <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                                    <AccordionItem class={`${generalstyles.innercard}` + ' '}>
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                                                        <p class={generalstyles.cardTitle + '  m-0 p-0 '}>{mainitem.name}:</p>
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
                                                                {payloadobj.permissionsarr.map((subitem, subitemindex) => {
                                                                    if (subitem.structype == 'Child' && subitem.ref_parent_id == mainitem.id) {
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
                                                                                            checked={subitem.ischecked}
                                                                                            onChange={() => {
                                                                                                var temppayloadobj = { ...payloadobj };
                                                                                                if (subitem?.name == 'Show Assigned Users Only') {
                                                                                                    setshowassignedusers(!showassignedusers);
                                                                                                }
                                                                                                if (temppayloadobj.permissionsarr[subitemindex].ischecked == true) {
                                                                                                    temppayloadobj.permissionsarr[subitemindex].ischecked = false;
                                                                                                } else {
                                                                                                    temppayloadobj.permissionsarr[subitemindex].ischecked = true;
                                                                                                }
                                                                                                setpayloadobj({ ...temppayloadobj });
                                                                                            }}
                                                                                        />
                                                                                        <svg viewBox="0 0 21 21" class="h-100">
                                                                                            <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                                        </svg>
                                                                                        <p
                                                                                            class={
                                                                                                `${generalstyles.checkbox_label} ` +
                                                                                                ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '
                                                                                            }
                                                                                        >
                                                                                            {subitem.name}
                                                                                        </p>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })}
                                                                {mainitem.name == 'Users' && showassignedusers && FetchUsers?.isSuccess && !FetchUsers?.isFetching && (
                                                                    <div class="col-lg-12 p-0">
                                                                        <div class="row m-0 w-100">
                                                                            <div class="col-lg-12 mt-2">Users:</div>
                                                                            <div class="col-lg-12">
                                                                                <hr class="mt-2" />
                                                                            </div>
                                                                            {FetchUsers?.data?.data?.data.map((subitem, subitemindex) => {
                                                                                var ischecked = false;

                                                                                selectedusers?.map((i, ii) => {
                                                                                    if (subitem?.id == i) {
                                                                                        ischecked = true;
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
                                                                                                    checked={ischecked}
                                                                                                    onChange={() => {
                                                                                                        var temppayloadobj = [...selectedusers];
                                                                                                        var sindex = null;
                                                                                                        selectedusers?.map((i, ii) => {
                                                                                                            if (subitem?.id == i) {
                                                                                                                sindex = ii;
                                                                                                            }
                                                                                                        });

                                                                                                        if (ischecked == true) {
                                                                                                            temppayloadobj.splice(sindex, 1);
                                                                                                        } else {
                                                                                                            temppayloadobj.push(subitem.id);
                                                                                                        }
                                                                                                        setselectedusers(temppayloadobj);
                                                                                                    }}
                                                                                                />
                                                                                                <svg viewBox="0 0 21 21" class="h-100">
                                                                                                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                                                                </svg>
                                                                                                <p
                                                                                                    class={
                                                                                                        `${generalstyles.checkbox_label} ` +
                                                                                                        ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '
                                                                                                    }
                                                                                                >
                                                                                                    {subitem?.user_profile?.fname} {subitem?.user_profile?.lname}
                                                                                                </p>
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </AccordionItemPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                            </div>
                                        );
                                    }
                                })}

                                <div class=" col-lg-12 d-flex align-items-center justify-content-center mt-2 mb-3">
                                    {payloadobj.functype == 'edit' && (
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1'}
                                            disabled={CRUDSecurityGroupMutation?.isLoading}
                                            onClick={() => {
                                                if (payloadobj.name.length != 0) {
                                                    var temp = { ...payloadobj };
                                                    var arr = [];
                                                    payloadobj?.permissionsarr?.map((i, ii) => {
                                                        if (i.ischecked == true) {
                                                            arr.push(i.id);
                                                        }
                                                    });
                                                    temp.permissionsarr = arr;
                                                    temp.userids = selectedusers;
                                                    CRUDSecurityGroupMutation.mutate(temp);
                                                } else {
                                                    NotificationManager.warning('', lang.pleaseaddsecuritygroupname);
                                                }
                                            }}
                                        >
                                            {!CRUDSecurityGroupMutation?.isLoading && <>Edit</>}
                                            {CRUDSecurityGroupMutation?.isLoading && (
                                                <>
                                                    <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {payloadobj.functype == 'edit' && (
                                        <button
                                            style={{ height: '35px' }}
                                            class={generalstyles.roundbutton + ' bg-borderdanger bg-borderdangerhover ml-2 mb-1'}
                                            disabled={DeleteSecurityGroup?.isLoading}
                                            onClick={() => {
                                                if (window.confirm(langdetect == 'en' ? 'Do you want To delete this secruity group?' : 'هل تريد حذف مستوى الحماية؟')) {
                                                    var temppayloadobj = { ...payloadobj };
                                                    temppayloadobj.functype = 'delete';
                                                    DeleteSecurityGroup.mutate(temppayloadobj);
                                                }
                                            }}
                                        >
                                            {!DeleteSecurityGroup?.isLoading && <>Delete</>}
                                            {DeleteSecurityGroup?.isLoading && (
                                                <>
                                                    <CircularProgress color="#fff" width="20px" height="20px" duration="1s" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditSecuritylayers;
