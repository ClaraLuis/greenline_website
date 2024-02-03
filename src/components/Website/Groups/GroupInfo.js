import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import { components } from 'react-select';
import API from '../../../API/API.js';
import Inputfield from '../../Inputfield.js';
import SubmitButton from '../../Form.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { FaTrashAlt } from 'react-icons/fa';

const { ValueContainer, Placeholder } = components;

const GroupInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { GroupMutation_API, DeleteGroupMutation_API } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [fieldsarray, setfieldsarray] = useState([]);
    const [deletemodal, setdeletemodal] = useState(false);
    const [ValueInput, setValueInput] = useState({ name: '', value: '' });

    const GroupMutation = useMutation('GroupMutation_API', {
        mutationFn: GroupMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchGroups.refetch();
                props?.setopenModal(false);
                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    const DeleteGroupMutation = useMutation('DeleteGroupMutation_API', {
        mutationFn: DeleteGroupMutation_API,
        onMutate: (variables) => {},
        onError: (error, variables, context) => {
            NotificationManager.warning('', 'Error');
        },
        onSuccess: (data, variables, context) => {
            if (data.data.status) {
                props?.FetchGroups.refetch();
                props?.setopenModal(false);

                NotificationManager.success('', 'Success');
            } else {
                NotificationManager.warning(data.data.reason, 'Warning');
            }
        },
    });

    return (
        <>
            {!deletemodal && (
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
                            <div class="col-lg-6 pt-3 ">
                                {props?.grouppayload.functype == 'edit' && <div className="row w-100 m-0 p-0">Group ID: {props?.grouppayload.id}</div>}
                                {props?.grouppayload.functype == 'add' && <div className="row w-100 m-0 p-0">Add group</div>}
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
                    <Modal.Body>
                        <div class="row m-0 w-100 py-2 allcentered">
                            <div class={'col-lg-12'}>
                                <Inputfield
                                    // disabled={item?.disabled}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    placeholder={'Group Name'}
                                    value={props?.grouppayload?.name}
                                    onChange={(event) => {
                                        setsubmit(false);
                                        var temp = { ...props?.grouppayload };
                                        temp.name = event.target.value;
                                        props?.setgrouppayload({ ...temp });
                                    }}
                                    type={'text'}
                                />
                            </div>
                            <div class="col-lg-12 text-capitalize mb-2" style={{ fontSize: '16px' }}>
                                automated segmentation fields
                            </div>
                            <div class="col-lg-5 col-md-12 col-sm-12 mb-0 p-sm-0">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label className={`${formstyles.form__label}` + ' m-0 p-0 '}>{'Column Name'}</label>
                                    <input
                                        type="text"
                                        className={`${formstyles.form__field}`}
                                        value={ValueInput.name}
                                        onChange={(event) => {
                                            setValueInput({ ...ValueInput, name: event.target.value });
                                        }}
                                        placeholder={lang.pressentertosubmitvalues}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                if (ValueInput.name.length != 0 && ValueInput.value.length != 0) {
                                                    setValueInput({ name: '', value: '' });
                                                    var tempOptionPayloadobj = { ...props.grouppayload };
                                                    tempOptionPayloadobj.automated_segmentationfields.push({ name: ValueInput.name, value: ValueInput.value });

                                                    props.setgrouppayload({ ...tempOptionPayloadobj });
                                                } else {
                                                    NotificationManager.warning('', ' please add column name and value');
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-12 col-sm-12 mb-0 p-sm-0">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label className={`${formstyles.form__label}` + ' m-0 p-0 '}>{'Value'}</label>
                                    <input
                                        type="text"
                                        className={`${formstyles.form__field}`}
                                        value={ValueInput.value}
                                        onChange={(event) => {
                                            setValueInput({ ...ValueInput, value: event.target.value });
                                        }}
                                        placeholder={lang.pressentertosubmitvalues}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                if (ValueInput.name.length != 0 && ValueInput.value.length != 0) {
                                                    setValueInput({ name: '', value: '' });
                                                    var tempOptionPayloadobj = { ...props.grouppayload };
                                                    tempOptionPayloadobj.automated_segmentationfields.push({ name: ValueInput.name, value: ValueInput.value });

                                                    props.setgrouppayload({ ...tempOptionPayloadobj });
                                                } else {
                                                    NotificationManager.warning('', ' please add column name and value');
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="col-lg-2 allcentered">
                                <button
                                    onClick={() => {
                                        if (ValueInput.name.length != 0 && ValueInput.value.length != 0) {
                                            setValueInput({ name: '', value: '' });
                                            var tempOptionPayloadobj = { ...props.grouppayload };
                                            tempOptionPayloadobj.automated_segmentationfields.push({ name: ValueInput.name, value: ValueInput.value });

                                            props.setgrouppayload({ ...tempOptionPayloadobj });
                                        } else {
                                            NotificationManager.warning('', ' please add column name and value');
                                        }
                                    }}
                                    class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 mt-0 p-1 '}
                                >
                                    <span>{'Add field'}</span>
                                </button>
                            </div>

                            <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                <div class="row m-0 w-100">
                                    <table style={{}} className={'table'}>
                                        <thead>
                                            <th>Column Name</th>
                                            <th>Value</th>
                                            <th></th>
                                        </thead>
                                        <tbody>
                                            {props?.grouppayload?.automated_segmentationfields?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item.name}</p>
                                                        </td>

                                                        <td>
                                                            <p className={' m-0 p-0 wordbreak '}>{item?.value}</p>
                                                        </td>
                                                        <td
                                                            onClick={() => {
                                                                var tempOptionPayloadobj = { ...props.grouppayload };
                                                                tempOptionPayloadobj.automated_segmentationfields.splice(index, 1);

                                                                props.setgrouppayload({ ...tempOptionPayloadobj });
                                                            }}
                                                            class="text-danger"
                                                        >
                                                            <FaTrashAlt />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="col-lg-12 p-0">
                                <div class="row m-0 w-100 allcentered">
                                    <button
                                        onClick={() => {
                                            if (props?.grouppayload?.name?.length == 0) {
                                                setsubmit(true);
                                            } else {
                                                GroupMutation.mutate(props?.grouppayload);
                                            }
                                        }}
                                        disabled={GroupMutation.isLoading}
                                        class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                    >
                                        {GroupMutation.isLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                        {!GroupMutation.isLoading && <span>{props?.grouppayload?.functype == 'add' ? lang.add : lang.edit}</span>}
                                    </button>
                                    {props?.grouppayload?.functype == 'add'
                                        ? false
                                        : true && (
                                              <button
                                                  onClick={() => {
                                                      setdeletemodal(true);
                                                  }}
                                                  disabled={DeleteGroupMutation?.isLoading}
                                                  class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                              >
                                                  {DeleteGroupMutation.isLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                                  {!DeleteGroupMutation.isLoading && <span>{lang.delete}</span>}
                                              </button>
                                          )}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}{' '}
            <Modal
                show={deletemodal}
                onHide={() => {
                    setdeletemodal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">{/* <div className="row w-100 m-0 p-0"></div> */}</div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setdeletemodal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2 allcentered">
                        <span class=" mb-3" style={{ fontSize: '17px' }}>
                            Are you sure you want to delete<span style={{ color: 'var(--danger)' }}> {props?.grouppayload?.name}</span>
                        </span>

                        <div class="col-lg-12 p-0">
                            <div class="row m-0 w-100 allcentered">
                                <button
                                    onClick={() => {
                                        if (props?.grouppayload?.name?.length == 0) {
                                            setsubmit(true);
                                        } else {
                                            DeleteGroupMutation.mutate(props?.grouppayload);
                                        }
                                    }}
                                    disabled={DeleteGroupMutation?.isLoading}
                                    class={generalstyles.roundbutton + '  bg-danger bg-dangerhover mr-2 '}
                                >
                                    {DeleteGroupMutation.isLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                    {!DeleteGroupMutation.isLoading && <span>{lang.delete}</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default GroupInfo;
