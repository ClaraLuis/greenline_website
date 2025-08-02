import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
// import { useMutation } from 'react-query';
import { components } from 'react-select';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import SubmitButton from '../../Form.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import AddEditSecuritylayers from '../Securitylayers/AddEditSecuritylayers.js';

const { ValueContainer, Placeholder } = components;

const HubInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { userPermissionsContext, userTypeContext, employeeTypeContext, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, createHub, editUserType, fetchMerchants, fetchInventories, fetchGovernorates } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [changepermissionsmodal, setchangepermissionsmodal] = useState(false);

    const [createHubMutation] = useMutationGQL(createHub(), {
        name: props?.payload?.name,
        governorateId: props?.payload?.governorateId,
        location: { long: 0.0, lat: 0.0 },
    });

    const fetchGovernoratesQuery = useQueryGQL('', fetchGovernorates());

    const handlecreateHub = async () => {
        if (props?.payload?.name?.length) {
            if (props?.payload?.governorateId) {
                if (buttonLoadingContext) return;
                setbuttonLoadingContext(true);

                try {
                    var { data } = await createHubMutation();
                    if (data?.createHub?.success) {
                        props?.setopenModal(false);
                        props?.refetchHubs();
                    } else {
                        NotificationManager.warning(data?.createHub?.message, 'Warning!');
                    }
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
                    console.error('Error adding user:', error);
                }
                setbuttonLoadingContext(false);
            } else {
                NotificationManager.warning('Choose Governorate', 'Warning!');
            }
        } else {
            NotificationManager.warning('Enter a hub name', 'Warning!');
        }
    };

    return (
        <>
            <Modal
                show={props?.openModal}
                onHide={() => {
                    props?.setopenModal(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 col-md-10 pt-3 ">
                            {props?.payload.functype == 'edit' && <div className="row w-100 m-0 p-0">Hub : {props?.payload.name}</div>}
                            {props?.payload.functype == 'add' && <div className="row w-100 m-0 p-0">Add Hub</div>}
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    props?.setopenModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        {props?.payload?.functype == 'add' && (
                            <Form
                                size={'lg'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
                                    { name: 'Name', attr: 'name', size: '6' },
                                    {
                                        name: 'City',
                                        attr: 'governorateId',
                                        type: 'select',
                                        options: fetchGovernoratesQuery?.data?.findAllDomesticGovernorates,
                                        size: '6',
                                        optionValue: 'id',
                                        optionLabel: 'name',
                                    },
                                    // { name: 'Longitude', attr: 'longitude', size: '6', type: 'number' },
                                    // { name: 'Latitude', attr: 'latitude', size: '6', type: 'number' },
                                ]}
                                payload={props?.payload}
                                setpayload={props?.setpayload}
                                button1disabled={buttonLoadingContext}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={props?.payload?.functype == 'add' ? lang.add : lang.edit}
                                button1onClick={() => {
                                    handlecreateHub();
                                }}
                                // button2={props?.payload?.functype == 'add' ? false : true}
                                // // button2disabled={DeleteUserMutation.isLoading}
                                // button2class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                // button2placeholder={lang.delete}
                                // button2onClick={() => {
                                //     // DeleteUserMutation.mutate(props?.payload);
                                // }}
                            />
                        )}
                        {props?.payload?.functype == 'edit' && (
                            <div class="col-lg-12 p-0">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-6 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Name
                                                </label>
                                                <div>{props?.payload?.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Governorate ID
                                                </label>
                                                <div>{props?.payload?.governorateId}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6 mb-3">
                                        <div class="row m-0 w-100">
                                            <div class="form__group field">
                                                <label class="form__label" style={{ marginBottom: 0, fontSize: '13px', color: 'grey' }}>
                                                    Location (Longitude, Latitude)
                                                </label>
                                                <div>
                                                    {'{'} {props?.payload?.location?.long}, {props?.payload?.location?.lat} {'}'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default HubInfo;
