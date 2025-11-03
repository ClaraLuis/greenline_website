import { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import { LanguageContext } from '../../../LanguageContext';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import Inputfield from '../../Inputfield';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

const PermissionGroupInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);

    const cookies = new Cookies();
    const { langdetect } = useContext(LanguageContext);
    const { useQueryGQL, useMutationGQL, createPermissionGroup, findPermissions, findOnePermissionGroup, useLazyQueryGQL, updatePermissionGroup } = API();
    const { buttonLoadingContext, setbuttonLoadingContext, useLoadQueryParamsToPayload, setpageactive_context, setpagetitle_context } = useContext(Contexthandlerscontext);

    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [chooseMerchant, setChooseMerchant] = useState(false);
    const [edit, setedit] = useState(false);
    const [payload, setPayload] = useState({ merchantId: undefined, merchantVisible: false, name: '' });

    const findPermissionsQuery = useQueryGQL('', findPermissions());
    useLoadQueryParamsToPayload(setPayload);

    // preload permissions from props
    useEffect(() => {
        const permissionIds = props?.payload?.userPermissions?.map((p) => p.permissionId) || [];
        setSelectedPermissions(permissionIds);
    }, [props?.payload]);
    useEffect(() => {
        setpageactive_context('/permissiongroups');
        setpagetitle_context('Settings');
    }, []);

    // process permission list
    useEffect(() => {
        if (findPermissionsQuery?.data?.findPermissions) {
            const grouped = _.groupBy(findPermissionsQuery.data.findPermissions, 'type');
            const formatted = _.map(grouped, (permissions, type) => {
                if (type === 'order' && cookies.get('merchantId')) {
                    permissions = permissions.filter((p) => p.name !== 'editOrderStatus');
                }
                return { type, permissions };
            });
            setPermissionsArray(formatted);
        }
    }, [findPermissionsQuery?.data?.findPermissions]);

    const handlePermissionChange = (perm, type) => {
        let updated = [...selectedPermissions];
        const sectionIds = permissionsArray.find((item) => item.type === type)?.permissions.map((p) => p.id) || [];

        if (updated.includes(1)) {
            // handle global admin (id=1)
            updated = perm.id === 1 ? [] : updated;
        } else if (perm.id === 1) {
            updated = [1];
        } else if (perm.name.includes('Admin')) {
            // handle section admin
            if (updated.includes(perm.id)) {
                updated = updated.filter((id) => id !== perm.id);
            } else {
                updated = updated.filter((id) => !sectionIds.includes(id));
                updated.push(perm.id);
            }
        } else {
            // handle normal permission
            if (updated.includes(perm.id)) {
                updated = updated.filter((id) => id !== perm.id);
            } else {
                const adminPerm = permissionsArray.find((item) => item.type === type)?.permissions.find((p) => p.name.includes('Admin'));
                if (!updated.includes(adminPerm?.id)) {
                    updated.push(perm.id);
                }
            }
        }

        setSelectedPermissions([...updated]);
    };

    const isPermissionSelected = (id) => selectedPermissions.includes(id);
    const isSectionAdminSelected = (type) => {
        const section = permissionsArray.find((item) => item.type === type);
        return section?.permissions.some((p) => p.name.includes('Admin') && isPermissionSelected(p.id));
    };

    const [createPermissionGroupMutation] = useMutationGQL(createPermissionGroup(), {
        permissionIds: selectedPermissions,
        merchantId: payload?.merchantId,
        merchantVisible: payload?.merchantVisible,
        name: payload?.name,
    });

    const [updatePermissionGroupMutation] = useMutationGQL(updatePermissionGroup(), {
        permissionIds: selectedPermissions,
        name: payload?.name,
        id: parseInt(queryParameters?.get('id')),
    });

    const handleNextClick = () => {
        if (selectedPermissions.length === 0) {
            NotificationManager.warning('Please select at least one permission before proceeding.', 'Warning!');
            return;
        }
        setChooseMerchant(true);
    };

    const handleCreateClick = async () => {
        if (buttonLoadingContext) return;
        if (!payload.name?.trim()) {
            NotificationManager.warning('Please provide a group name.', 'Warning!');
            return;
        }

        setbuttonLoadingContext(true);
        try {
            if (queryParameters.get('id')) {
                const { data } = await updatePermissionGroupMutation();
                if (data?.updatePermissionGroup?.success) {
                    NotificationManager.success(data.updatePermissionGroup.message, 'Success!');
                    window.location.reload();
                } else {
                    NotificationManager.warning(data?.updatePermissionGroup?.message || 'Something went wrong.', 'Warning!');
                }
            } else {
                const { data } = await createPermissionGroupMutation();
                if (data?.createPermissionGroup?.success) {
                    NotificationManager.success(data.createPermissionGroup.message, 'Success!');
                    history.back();
                } else {
                    NotificationManager.warning(data?.createPermissionGroup?.message || 'Something went wrong.', 'Warning!');
                }
            }
        } catch (error) {
            const msg = error?.graphQLErrors?.[0]?.message || error?.networkError?.message || error?.message || 'An unexpected error occurred.';
            NotificationManager.warning(msg, 'Warning!');
        } finally {
            setbuttonLoadingContext(false);
        }
    };

    const [findOnePermissionGroupQuery] = useLazyQueryGQL(findOnePermissionGroup());

    const fetchPermissionGroupInfo = async () => {
        try {
            var { data } = await findOnePermissionGroupQuery({
                variables: {
                    id: parseInt(queryParameters?.get('id')),
                },
            });
            if (data?.findOnePermissionGroup) {
                setPayload({
                    name: data?.findOnePermissionGroup?.name || '',
                    merchantVisible: data?.findOnePermissionGroup?.merchantVisible ?? false,
                    permissionIds: data?.findOnePermissionGroup?.permissions?.map((p) => p.id) || [],
                });
                setSelectedPermissions(data?.findOnePermissionGroup?.permissions?.map((p) => p.id) || []);
            }
        } catch (e) {
            let errorMessage = 'An unexpected error occurred';
            if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                errorMessage = e.graphQLErrors[0].message || errorMessage;
            } else if (e.networkError) {
                errorMessage = e.networkError.message || errorMessage;
            } else if (e.message) {
                errorMessage = e.message;
            }
            NotificationManager.warning(errorMessage, 'Warning!');
        }
    };
    useEffect(() => {
        if (queryParameters?.get('id')) {
            fetchPermissionGroupInfo();
        }
    }, [queryParameters?.get('id')]);

    return (
        <div className="row m-0 w-100 p-md-2 pt-2">
            <div className="col-12 px-3">
                <div class="row m-0 w-10 mb-4">
                    <div class="col-lg-6 col-md-6 p-0">
                        <div className="row m-0 w-100">
                            <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '24px' }}>
                                {queryParameters?.get('id') && edit ? 'Edit' : ''} {queryParameters?.get('id') ? payload.name : 'Create Permission Group'}
                            </div>
                        </div>
                    </div>
                    {!edit && queryParameters?.get('id') && (
                        <div class="col-lg-6 col-md-6 d-flex justify-content-end py-0">
                            <div
                                onClick={() => {
                                    setedit(true);
                                }}
                                class={generalstyles.roundbutton + ' allcentered'}
                                // style={{ textDecoration: 'underline', fontSize: '12px' }}
                            >
                                Edit
                            </div>
                        </div>
                    )}
                </div>
                {edit && (
                    <div className={`${generalstyles.card} row m-0 w-100`}>
                        {permissionsArray.map((section, index) => (
                            <div key={index} className="mb-3 col-lg-12 p-2 border rounded">
                                <Accordion allowMultipleExpanded allowZeroExpanded>
                                    <AccordionItem className={`${generalstyles.innercard} p-2`}>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div className="row">
                                                    <div className="col-8 d-flex align-items-center">
                                                        <p className={`${generalstyles.cardTitle} m-0`}>{section.type}:</p>
                                                    </div>
                                                    <div className="col-4 d-flex justify-content-end">
                                                        <AccordionItemState>{(state) => (state.expanded ? <BsChevronUp /> : <BsChevronDown />)}</AccordionItemState>
                                                    </div>
                                                </div>
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            <hr className="mt-2 mb-3" />
                                            <div className="row m-auto">
                                                {section.permissions.map((perm, i) => {
                                                    const selected = isPermissionSelected(perm.id);
                                                    const adminSelected = isSectionAdminSelected(section.type);
                                                    const disabled = (adminSelected && !perm.name.includes('Admin')) || (selectedPermissions.includes(1) && perm.id !== 1);

                                                    return (
                                                        <div key={i} className={`card col-xl-4 col-lg-4 col-md-6 mb-1 p-3`}>
                                                            <label
                                                                className={`${langdetect === 'en' ? formstyles.checkbox : formstyles.checkboxtranslated} ${formstyles.checkbox_sub} ${
                                                                    formstyles.path
                                                                } d-flex mb-0`}
                                                            >
                                                                <input type="checkbox" checked={selected} disabled={disabled} onChange={() => handlePermissionChange(perm, section.type)} />
                                                                <svg viewBox="0 0 21 21" className="h-100">
                                                                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333,1.4333 18.0333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,8"></path>
                                                                </svg>
                                                                <p style={{ color: disabled ? 'grey' : '' }} className={`${generalstyles.checkbox_label} ml-2 mb-0 text-capitalize`}>
                                                                    <div class="row m-0 w-100">
                                                                        <div class="col-lg-12 p-0 ">{perm.name.split(/(?=[A-Z])/).join(' ')}</div>
                                                                        <div class="col-lg-12 p-0 " style={{ color: 'grey' }}>
                                                                            {perm.description.split(/(?=[A-Z])/).join(' ')}
                                                                        </div>
                                                                    </div>
                                                                </p>
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        ))}

                        <div className="col-12 d-flex justify-content-center mt-3">
                            <button style={{ height: '35px' }} className={`${generalstyles.roundbutton}`} onClick={handleNextClick}>
                                {buttonLoadingContext ? <CircularProgress color="white" width="15px" height="15px" duration="1s" /> : 'Next'}
                            </button>
                        </div>
                    </div>
                )}
                {!edit && (
                    <div className={`${generalstyles.card} row m-0 w-100`}>
                        {permissionsArray.map((section, index) => {
                            // check if at least one permission in this section is selected
                            const hasSelected = section.permissions.some((perm) => isPermissionSelected(perm.id));

                            if (!hasSelected) return null; // skip rendering this section

                            return (
                                <div key={index} className="mb-3 col-lg-12 p-2 border rounded">
                                    <div className="row">
                                        <div className="col-8 d-flex align-items-center">
                                            <p className={`${generalstyles.cardTitle} m-0`}>{section.type}:</p>
                                        </div>
                                        <div className="col-4 d-flex justify-content-end">
                                            <AccordionItemState>{(state) => (state.expanded ? <BsChevronUp /> : <BsChevronDown />)}</AccordionItemState>
                                        </div>
                                    </div>
                                    <hr className="mt-2 mb-3" />
                                    <div className="row m-auto">
                                        {section.permissions.map((perm, i) => {
                                            const selected = isPermissionSelected(perm.id);
                                            const adminSelected = isSectionAdminSelected(section.type);
                                            const disabled = (adminSelected && !perm.name.includes('Admin')) || (selectedPermissions.includes(1) && perm.id !== 1);

                                            if (!selected) return null;

                                            return (
                                                <div key={i} className="card col-xl-4 col-lg-4 col-md-6 mb-1 p-3">
                                                    <div className="row m-0 w-100 text-capitalize">
                                                        <div className="col-lg-12 p-0">{perm.name.split(/(?=[A-Z])/).join(' ')}</div>
                                                        <div className="col-lg-12 p-0" style={{ color: 'grey' }}>
                                                            {perm.description.split(/(?=[A-Z])/).join(' ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* MODAL */}
            <Modal show={chooseMerchant} onHide={() => setChooseMerchant(false)} centered size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Choose Merchant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="px-4 pt-0 pb-4">
                        <Inputfield placeholder="Name" value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} type="text" />

                        <div className="mt-2">
                            <label className={`${langdetect === 'en' ? formstyles.checkbox : formstyles.checkboxtranslated} ${formstyles.checkbox_sub} ${formstyles.path} d-flex mb-0`}>
                                <input
                                    type="checkbox"
                                    checked={payload.merchantVisible}
                                    disabled={parseInt(queryParameters?.get('id')) ? true : false}
                                    onChange={() => setPayload({ ...payload, merchantVisible: !payload.merchantVisible })}
                                />
                                <svg viewBox="0 0 21 21" className="h-100">
                                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333,1.4333 18.0333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,8"></path>
                                </svg>
                                <p className={`${generalstyles.checkbox_label} ml-2 mb-0 text-capitalize`}>Visible to Merchant</p>
                            </label>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <button style={{ height: '35px' }} className={`${generalstyles.roundbutton}`} onClick={handleCreateClick}>
                                {buttonLoadingContext ? <CircularProgress color="white" width="15px" height="15px" duration="1s" /> : queryParameters?.get('id') ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PermissionGroupInfo;
