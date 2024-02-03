import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
import { useMutation, useQuery } from 'react-query';
import { components } from 'react-select';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import SubmitButton from '../../Form.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles, defaultstylesdanger, tabledefaultstyles } from '../Generalfiles/selectstyles.js';
import Select from 'react-select';

const { ValueContainer, Placeholder } = components;

const MeetingandFollowup = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { AddFollowup_API, FetchPhases_API, FetchGroups_API, AddMeeting_API, AssigntoPhaseMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);

    const [filterphaseobj, setfilterphaseobj] = useState({
        page: 1,
        search: '',
    });
    const FetchPhases = useQuery(['FetchPhases_API' + JSON.stringify(filterphaseobj)], () => FetchPhases_API({ filter: filterphaseobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const [filtergroupobj, setfiltergroupobj] = useState({
        page: 1,
        search: '',
    });
    const FetchGroups = useQuery(['FetchGroups_API' + JSON.stringify(filtergroupobj)], () => FetchGroups_API({ filter: filtergroupobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const AddFollowup = useMutation('AddFollowup_API', {
        mutationFn: AddFollowup_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();
                props?.setopenModal({ open: false, type: '' });
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const AddMeeting = useMutation('AddMeeting_API', {
        mutationFn: AddMeeting_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();
                props?.setopenModal({ open: false, type: '' });
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    return (
        <Modal
            show={props?.openModal?.open}
            onHide={() => {
                props?.setopenModal({ open: false, type: '' });
            }}
            centered
            size={'lg'}
        >
            <Modal.Header>
                <div className="row w-100 m-0 p-0">
                    <div class="col-lg-6 pt-3 ">
                        {/* {props?.callpayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Call ID: {props?.callpayload.id}</div>} */}
                        {/* {props?.callpayload.functype == 'add' && */}
                        <div className="row w-100 m-0 p-0">{props?.openModal?.type == 'meeting' ? 'Add meeting' : 'Add Follow up'}</div>
                        {/* } */}
                    </div>
                    <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                        <div
                            class={'close-modal-container'}
                            onClick={() => {
                                props?.setopenModal({ open: false, type: '' });
                            }}
                        >
                            <IoMdClose />
                        </div>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div class="row m-0 w-100 py-2 ">
                    <div class="col-lg-12 mb-2">
                        <div
                            style={{ border: '1px solid #cecece', borderRadius: '10px', maxHeight: '150px', overflow: 'scroll' }}
                            class="row m-0 d-flex scrollmenuclasssubscrollbar justify-content-between p-3 w-100"
                        >
                            {props?.callpayload?.lead_feilds?.map((key, keyindex) => {
                                return (
                                    <div style={{ fontSize: '14px' }} class=" d-flex justify-content-start ">
                                        <div class="row m-0 d-flex justify-content-start ">
                                            <div class=" d-flex justify-content-start text-capitalize mr-2">{key?.name}: </div>
                                            <span style={{ fontWeight: 500 }}>{key?.value}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Form
                        submit={submit}
                        setsubmit={setsubmit}
                        attr={
                            props?.openModal?.type == 'followup'
                                ? [
                                      { name: 'Followup Status', attr: 'followupstatus', type: 'followupstatus', size: '6' },
                                      { name: 'Priority', attr: 'priority', type: 'priority', size: '6' },
                                      { name: 'Date', attr: 'date', type: 'date', size: '6' },
                                      { name: 'Time', attr: 'time', type: 'time', size: '6' },
                                      { name: 'Notes', attr: 'notes', type: 'textarea', size: '12' },
                                  ]
                                : [
                                      { name: 'Meeting Status', attr: 'meetingstatus', type: 'followupstatus', size: '6' },
                                      { name: 'Date', attr: 'date', type: 'date', size: '6' },
                                      { name: 'Time', attr: 'time', type: 'time', size: '6' },
                                      { name: 'Notes', attr: 'notes', type: 'textarea', size: '12' },
                                  ]
                        }
                        payload={props?.callpayload}
                        setpayload={props?.setcallpayload}
                        button1disabled={props?.openModal?.type == 'followup' ? AddFollowup.isLoading : AddMeeting?.isLoading}
                        button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                        button1placeholder={props?.callpayload?.functype == 'add' ? lang.add : lang.edit}
                        button1onClick={() => {
                            if (props?.openModal?.type == 'followup') {
                                AddFollowup.mutate(props?.callpayload);
                            } else {
                                AddMeeting.mutate(props?.callpayload);
                            }
                        }}
                        button2={props?.callpayload?.functype == 'add' ? false : true}
                        button2disabled={props?.openModal?.type == 'followup' ? AddFollowup.isLoading : AddMeeting?.isLoading}
                        button2class={generalstyles.roundbutton + ' bg-danger bg-dangerhover '}
                        button2placeholder={lang.delete}
                        button2onClick={() => {
                            if (props?.openModal?.type == 'followup') {
                                var temp = { ...props?.callpayload };
                                temp.functype = 'delete';
                                temp.lead_id = temp?.lead;

                                AddFollowup.mutate(temp);
                            } else {
                                var temp = { ...props?.callpayload };
                                temp.functype = 'delete';
                                temp.lead_id = temp?.lead;

                                AddMeeting.mutate(temp);
                            }
                        }}
                    />
                    {/* {props?.callpayload?.functype == 'edit' && (
                        <>
                          
                           
                        </>
                    )} */}
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default MeetingandFollowup;
