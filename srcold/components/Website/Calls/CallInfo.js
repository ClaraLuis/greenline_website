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

const CallInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { AddCall_API, FetchPhases_API, FetchGroups_API, AssigntoGroupMutation_API, AssigntoPhaseMutation_API, AddMeeting_API, AddFollowup_API, AddDeal_API, Updateleadstatus_API } = API();

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

    const AddDeal = useMutation('AddDeal_API', {
        mutationFn: AddDeal_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
                props?.setdealspayload({
                    functype: 'add',
                    id: 'add',
                    notes: '',
                    value: '',
                    quantity: '',
                    totalvalue: '',
                    lead_id: '',
                });
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const AddCall = useMutation('AddCall_API', {
        mutationFn: AddCall_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
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
                props?.setopenModal(false);

                NotificationManager.success('', 'Success');

                props?.setmeetingfolowuppayload({
                    functype: 'add',
                    id: 'add',
                    notes: '',
                    date: '',
                    time: '',
                    followupstatus: '',
                    meetingstatus: '',
                    priority: '',
                    lead_id: '',
                });
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
                props?.setopenModal(false);

                NotificationManager.success('', 'Success');
                props?.setmeetingfolowuppayload({
                    functype: 'add',
                    id: 'add',
                    notes: '',
                    date: '',
                    time: '',
                    followupstatus: '',
                    meetingstatus: '',
                    priority: '',
                    lead_id: '',
                });
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    const AssigntoPhaseMutation = useMutation('AssigntoPhaseMutation_API', {
        mutationFn: AssigntoPhaseMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });
    const Updateleadstatus = useMutation('Updateleadstatus_API', {
        mutationFn: Updateleadstatus_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const AssigntoGroupMutation = useMutation('AssigntoGroupMutation_API', {
        mutationFn: AssigntoGroupMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchLeads.refetch();

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    return (
        <Modal
            show={props?.openModal}
            onHide={() => {
                props?.setopenModal(false);
            }}
            centered
            size={'lg'}
        >
            <Modal.Header style={{ display: props?.dealsmodal || props?.meetingfolowupmodal?.open ? 'none' : '' }}>
                <div className="row w-100 m-0 p-0">
                    <div class="col-lg-6 pt-3 ">
                        {/* {props?.callpayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Call ID: {props?.callpayload.id}</div>} */}
                        {/* {props?.callpayload.functype == 'add' && */}
                        <div className="row w-100 m-0 p-0">Actions</div>
                        {/* } */}
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
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body style={{ display: props?.dealsmodal || props?.meetingfolowupmodal?.open ? 'none' : '' }}>
                <div class="row m-0 w-100 py-2 ">
                    <div class="col-lg-12 mb-4">
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
                    <div style={{ borderInlineEnd: '1px solid rgba(0, 0, 0, 0.1)' }} class="col-lg-6">
                        {FetchPhases?.isSuccess && !FetchPhases?.isFetching && (
                            <div class="row m-0 w-100">
                                <div class="col-lg-12 p-0 mb-2" style={{ fontSize: '12px' }}>
                                    Change Phase
                                </div>
                                <div class="col-lg-12 p-0 mb-3">
                                    <div style={{ width: '400px' }}>
                                        <Select
                                            options={[{ name: 'Remove phase', id: null }, ...FetchPhases?.data?.data?.data]}
                                            value={FetchPhases?.data?.data?.data?.filter((option) => option.id == props?.callpayload?.phase_id)}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            styles={tabledefaultstyles}
                                            onChange={(option) => {
                                                props?.setcallpayload({ ...props?.callpayload, phase_id: option.id, phaseaction: option.phaseaction });

                                                var temp = {};
                                                temp.assigntype = 'lead';
                                                temp.leadidarr = [props?.callpayload?.lead_id];
                                                temp.phase_id = option?.id;
                                                AssigntoPhaseMutation?.mutate(temp);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <div class="col-lg-6 p-0 ">
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 mb-2" style={{ fontSize: '12px' }}>
                                Change Group
                            </div>

                            <div class="col-lg-12 mb-3">
                                <div style={{ width: '400px' }}>
                                    <Select
                                        options={FetchGroups?.data?.data?.data}
                                        value={FetchGroups?.data?.data?.data?.filter((option) => option.id == props?.callpayload?.group_id)}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        styles={tabledefaultstyles}
                                        onChange={(option) => {
                                            props?.setcallpayload({ ...props?.callpayload, group_id: option.id });
                                            var temp = {};
                                            temp.assigntype = 'lead';
                                            temp.leadid = props?.callpayload?.lead_id;
                                            temp.group_id = option?.id;
                                            AssigntoGroupMutation?.mutate(temp);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div class="col-lg-6 p-0 ">
                        <div class="row m-0 w-100">
                            <div class="col-lg-12 mb-2" style={{ fontSize: '12px' }}>
                                Lead Status
                            </div>

                            <div class="col-lg-12 mb-3">
                                <div style={{ width: '400px' }}>
                                    <Select
                                        options={[
                                            { label: 'No status', value: null },
                                            { label: 'Qualified, Interested', value: 'Qualified, Interested' },
                                            { label: 'Qualified, Potential Lead', value: 'Qualified, Potential Lead' },
                                            { label: 'No Answer', value: 'No Answer' },
                                            { label: 'Unqualified', value: 'Unqualified' },
                                        ]}
                                        styles={tabledefaultstyles}
                                        value={[
                                            { label: 'No status', value: null },
                                            { label: 'Qualified, Interested', value: 'Qualified, Interested' },
                                            { label: 'Qualified, Potential Lead', value: 'Qualified, Potential Lead' },
                                            { label: 'No Answer', value: 'No Answer' },
                                            { label: 'Unqualified', value: 'Unqualified' },
                                        ].filter((option) => option.value == props?.callpayload?.leadstatus)}
                                        onChange={(option) => {
                                            props?.setcallpayload({ ...props?.callpayload, leadstatus: option.value });
                                            var temp = {};
                                            temp.leadid_arr = [props?.callpayload?.lead_id];
                                            temp.lead_status = option?.value;
                                            Updateleadstatus?.mutate(temp);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 p-0">
                        <hr class="mt-0" />
                    </div>
                    {(props?.callpayload?.phaseaction == 'Add Meeting' || props?.callpayload?.phaseaction == 'Add Follow up') && (
                        <Form
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={
                                props?.callpayload?.phaseaction == 'Add Follow up'
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
                            payload={props?.meetingfolowuppayload}
                            setpayload={props?.setmeetingfolowuppayload}
                            button1disabled={props?.callpayload?.phaseaction == 'Add Follow up' ? AddFollowup.isLoading : AddMeeting?.isLoading}
                            button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                            button1placeholder={props?.meetingfolowuppayload?.functype == 'add' ? lang.add : lang.edit}
                            button1onClick={() => {
                                if (props?.callpayload?.phaseaction == 'Add Follow up') {
                                    var temp = props?.meetingfolowuppayload;
                                    temp.lead_id = props?.callpayload?.lead_id;
                                    AddFollowup.mutate(temp);
                                } else {
                                    var temp = props?.meetingfolowuppayload;
                                    temp.lead_id = props?.callpayload?.lead_id;
                                    AddMeeting.mutate(temp);
                                }
                            }}
                            button2={props?.meetingfolowuppayload?.functype == 'add' ? false : true}
                            button2disabled={props?.callpayload?.phaseaction == 'Add Follow up' ? AddFollowup.isLoading : AddMeeting?.isLoading}
                            button2class={generalstyles.roundbutton + ' bg-danger bg-dangerhover '}
                            button2placeholder={lang.delete}
                            button2onClick={() => {
                                if (props?.callpayload?.phaseaction == 'Add Follow up') {
                                    var temp = { ...props?.meetingfolowuppayload };
                                    temp.functype = 'delete';
                                    temp.lead_id = props?.callpayload?.lead_id;

                                    // temp.lead_id = temp?.lead;

                                    AddFollowup.mutate(temp);
                                } else {
                                    var temp = { ...props?.meetingfolowuppayload };
                                    temp.functype = 'delete';
                                    temp.lead_id = props?.callpayload?.lead_id;

                                    // temp.lead_id = temp?.lead;

                                    AddMeeting.mutate(temp);
                                }
                            }}
                        />
                    )}
                    {props?.callpayload?.phaseaction == 'Add Call' && (
                        <Form
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={[
                                { name: 'Duration', attr: 'duration', type: 'number', size: '6' },
                                { name: 'Call status', attr: 'status', type: 'status', size: '6' },
                                { name: 'Notes', attr: 'notes', type: 'textarea', size: '12' },
                                // { name: 'Last Name', attr: 'lname' },
                                // { name: 'Email', attr: 'email' },
                                // { name: 'Lead', attr: 'lead_id', type: 'leadid' },
                            ]}
                            payload={props?.callpayload}
                            setpayload={props?.setcallpayload}
                            button1disabled={AddCall.isLoading}
                            button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                            button1placeholder={props?.callpayload?.functype == 'add' ? lang.add : lang.edit}
                            button1onClick={() => {
                                AddCall.mutate(props?.callpayload);
                            }}
                            button2={false}
                        />
                    )}

                    {props?.callpayload?.phaseaction == 'Add Deal' && (
                        <Form
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={[
                                // { name: 'Lead', attr: 'lead_id', type: 'leadid' },
                                { name: 'Value', attr: 'value', type: 'number', size: '6' },
                                { name: 'Quantity', attr: 'quantity', type: 'number', size: '6' },
                                { name: 'Notes', attr: 'notes', type: 'textarea', size: '12' },
                                { name: 'Total Value', attr: 'totalvalue', type: 'number', size: '12', disabled: true },
                            ]}
                            payload={props?.dealspayload}
                            setpayload={props?.setdealspayload}
                            button1disabled={AddDeal.isLoading}
                            button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                            button1placeholder={props?.dealspayload?.functype == 'add' ? lang.add : lang.edit}
                            button1onClick={() => {
                                var temp = { ...props?.dealspayload };
                                temp.lead_id = props?.callpayload?.lead_id;
                                AddDeal.mutate(temp);
                            }}
                            button2={props?.dealspayload?.functype == 'add' ? false : true}
                            button2disabled={AddDeal.isLoading}
                            button2class={generalstyles.roundbutton + ' bg-danger bg-danger mr-2 '}
                            button2placeholder={lang.delete}
                            button2onClick={() => {
                                var temp = { ...props?.dealspayload };
                                temp.lead_id = props?.callpayload?.lead_id;
                                temp.functype = 'delete';
                                AddDeal.mutate(temp);
                            }}
                        />
                    )}
                    <div class="col-lg-12 p-0">
                        <hr class="mt-4" />
                    </div>

                    <div class="col-lg-12 p-0 my-4 ">
                        <div style={{ fontSize: '14px' }} class="row m-0 w-100">
                            <div class="col-lg-4 allcentered p-0">
                                <button
                                    onClick={() => {
                                        var temp = { ...props?.dealspayload };
                                        temp.functype = 'add';
                                        temp.lead_id = props?.callpayload?.lead_id;
                                        temp.value = '';
                                        temp.notes = '';
                                        temp.quantity = '';
                                        temp.totalvalue = '';
                                        temp.lead_feilds = props?.callpayload?.lead_feilds;

                                        props?.setdealspayload({ ...temp });
                                        props?.setdealsmodal(true);
                                    }}
                                    class={generalstyles.roundbutton + ' bg-blackhover '}
                                    style={{ border: '1px solid black', width: '180px', height: '40px', backgroundColor: 'transparent', color: 'black' }}
                                >
                                    Add Deal
                                </button>
                            </div>
                            <div class="col-lg-4 allcentered p-0">
                                <button
                                    onClick={() => {
                                        var temp = { ...props?.meetingfolowuppayload };
                                        temp.functype = 'add';
                                        temp.lead_id = props?.callpayload?.lead_id;
                                        temp.time = '';
                                        temp.notes = '';
                                        temp.date = '';

                                        temp.lead_feilds = props?.callpayload?.lead_feilds;

                                        props?.setmeetingfolowuppayload({ ...temp });
                                        props?.setmeetingfolowupmodal({ open: true, type: 'meeting' });
                                    }}
                                    class={generalstyles.roundbutton + ' bg-blackhover '}
                                    style={{ border: '1px solid black', width: '180px', height: '40px', backgroundColor: 'transparent', color: 'black' }}
                                >
                                    Add Meeting
                                </button>
                            </div>
                            <div class="col-lg-4 allcentered p-0">
                                <button
                                    onClick={() => {
                                        var temp = { ...props?.meetingfolowuppayload };
                                        temp.functype = 'add';
                                        temp.lead_id = props?.callpayload?.lead_id;
                                        temp.time = '';
                                        temp.notes = '';
                                        temp.date = '';
                                        temp.followupstatus = '';
                                        temp.priority = '';
                                        temp.lead_feilds = props?.callpayload?.lead_feilds;

                                        props?.setmeetingfolowuppayload({ ...temp });
                                        props?.setmeetingfolowupmodal({ open: true, type: 'followup' });
                                    }}
                                    class={generalstyles.roundbutton + ' bg-blackhover '}
                                    style={{ border: '1px solid black', width: '180px', height: '40px', backgroundColor: 'transparent', color: 'black' }}
                                >
                                    Add Followup
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* {props?.callpayload?.functype == 'edit' && (
          <>
            
             
          </>
      )} */}
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default CallInfo;
