import React, { useContext } from 'react';
// import { fetch_collection_data } from '../../../API/API';

// Icons
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import Inputfield from './Inputfield';
import Select, { components } from 'react-select';
import { defaultstyles, defaultstylesdanger } from './Website/Generalfiles/selectstyles';
import { TbCameraPlus } from 'react-icons/tb';
import formstyles from '../components/Website/Generalfiles/CSS_GENERAL/form.module.css';

import TextareaAutosize from 'react-textarea-autosize';
import { Contexthandlerscontext } from '../Contexthandlerscontext';
import API from '../API/API';
import { useQuery } from 'react-query';
import generalstyles from '../components/Website/Generalfiles/CSS_GENERAL/general.module.css';
import SelectComponent from './SelectComponent';
const Form = (props) => {
    var exist = false;

    return (
        <>
            {props?.attr?.map((item, index) => {
                if (item?.type == undefined) {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <Inputfield
                                disabled={item?.disabled}
                                submit={props?.submit}
                                setsubmit={props?.setsubmit}
                                placeholder={item?.name}
                                value={props?.payload[item.attr]}
                                onChange={(event) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = event.target.value;
                                    props?.setpayload({ ...temp });
                                }}
                                type={'text'}
                            />
                        </div>
                    );
                } else if (item?.type == 'image') {
                    var companylogoimgPreviewer = '';
                    return (
                        <div class={generalstyles.avatar_upload + ' text-center justify-content-center align-items-center m-auto '}>
                            <div class={generalstyles.avatar_edit}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="updatecompanybanner"
                                    id="updatecompanybanner"
                                    hidden
                                    onChange={(event) => {
                                        var temp = { ...props?.payload };
                                        temp[item?.previewerAttr] = URL.createObjectURL(event.target.files[0]);

                                        const file = event.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();

                                            reader.onloadend = () => {
                                                const base64String = reader.result.split(',')[1]; // Get the Base64 string
                                                // setBase64(base64String);
                                                // alert(base64String);

                                                // Assuming temp and item.attr are defined and you want to store the result there:
                                                temp[item?.attr] = base64String;
                                            };

                                            reader.onerror = (error) => {
                                                console.error('Error reading file:', error);
                                                alert('Failed to read file');
                                            };

                                            reader.readAsDataURL(file); // Convert the file to Base64
                                        }
                                        props?.setpayload({ ...temp });
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <label for="updatecompanybanner" class={generalstyles.avatar_preview + ' pointer '}>
                                <div class={generalstyles.imgpreviewtxt + ' text-capitalize'}>
                                    <i class="">
                                        <TbCameraPlus size={25} />
                                    </i>
                                    <br />
                                    upload {item?.name}
                                </div>
                                <img
                                    src={props?.payload[item.previewerAttr]}
                                    class={props?.payload[item.previewerAttr] == '' ? 'd-none' : 'd-block'}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </label>
                        </div>
                    );
                } else if (item?.type == 'date') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <Inputfield
                                disabled={item?.disabled}
                                submit={props?.submit}
                                setsubmit={props?.setsubmit}
                                placeholder={item?.name}
                                value={props?.payload[item.attr]}
                                onChange={(event) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = event.target.value;
                                    props?.setpayload({ ...temp });
                                }}
                                type={'date'}
                            />
                        </div>
                    );
                } else if (item?.type == 'time') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <Inputfield
                                disabled={item?.disabled}
                                submit={props?.submit}
                                setsubmit={props?.setsubmit}
                                placeholder={item?.name}
                                value={props?.payload[item.attr]}
                                onChange={(event) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = event.target.value;
                                    props?.setpayload({ ...temp });
                                }}
                                type={'time'}
                            />
                        </div>
                    );
                } else if (item?.type == 'color') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <Inputfield
                                disabled={item?.disabled}
                                submit={props?.submit}
                                setsubmit={props?.setsubmit}
                                placeholder={item?.name}
                                value={props?.payload[item.attr]}
                                onChange={(event) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = event.target.value;
                                    props?.setpayload({ ...temp });
                                }}
                                type={'color'}
                            />
                        </div>
                    );
                } else if (item?.type == 'textarea') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <div class="row m-0 w-100  ">
                                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                    <label for="name" class={formstyles.form__label}>
                                        {item.name}
                                    </label>
                                    <TextareaAutosize
                                        disabled={item?.disabled}
                                        type={props?.type}
                                        class={formstyles.form__field}
                                        value={props?.payload[item?.attr]}
                                        placeholder={item?.name}
                                        minRows={5}
                                        maxRows={5}
                                        style={{
                                            border: props?.payload[item?.attr]?.length == 0 && props?.submit && item?.name != 'Notes' ? '1px solid var(--danger)' : '',
                                        }}
                                        onChange={(event) => {
                                            props?.setsubmit(false);
                                            var temp = { ...props?.payload };
                                            temp[item?.attr] = event?.target.value;
                                            props?.setpayload({ ...temp });
                                        }}
                                    />
                                    {props?.payload[item?.attr]?.length == 0 && props?.submit && item?.name != 'Notes' && (
                                        <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                            {item.name} is required
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                } else if (item?.type == 'gender') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                ]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                ].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'select') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={item?.options}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                defaultValue={item?.options?.filter((option) =>
                                    item?.optionValue ? option[item?.optionValue] == props?.payload[item?.attr] : option.value == props?.payload[item?.attr],
                                )}
                                getOptionLabel={(option) => (item?.optionLabel ? option[item?.optionLabel] : option.label)}
                                getOptionValue={(option) => (item?.optionValue ? option[item?.optionValue] : option.value)}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = item?.optionValue ? option[item.optionValue] : option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'fetchSelect') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <SelectComponent
                                title={item?.title}
                                filter={item?.filter}
                                setfilter={item?.setfilter}
                                options={item?.options}
                                attr={item?.optionsAttr}
                                label={item?.label}
                                value={item?.value}
                                payload={props?.payload}
                                payloadAttr={item?.attr}
                                onClick={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = item?.value ? option[item.value] : option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                        </div>
                    );
                } else if (item?.type == 'type') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[{ label: 'Finance', value: 'finance' }]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[{ label: 'Finance', value: 'finance' }].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'phaseaction') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[
                                    { label: 'No action', value: null },
                                    { label: 'Add Call', value: 'Add Call' },
                                    { label: 'Add Meeting', value: 'Add Meeting' },
                                    { label: 'Add Follow up', value: 'Add Follow up' },
                                    { label: 'Add Deal', value: 'Add Deal' },
                                ]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[
                                    { label: 'No action', value: null },
                                    { label: 'Add Call', value: 'Add Call' },
                                    { label: 'Add Meeting', value: 'Add Meeting' },
                                    { label: 'Add Follow up', value: 'Add Follow up' },
                                    { label: 'Add Deal', value: 'Add Deal' },
                                ].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'followupstatus') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Done', value: 'done' },
                                ]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Done', value: 'done' },
                                ].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'priority') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[
                                    { label: 'Low', value: 'low' },
                                    { label: 'Medium', value: 'medium' },
                                    { label: 'High', value: 'high' },
                                ]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[
                                    { label: 'Low', value: 'low' },
                                    { label: 'Medium', value: 'medium' },
                                    { label: 'High', value: 'high' },
                                ].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'status') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'No Answer', value: 'noanswer' },
                                    { label: 'User busy', value: 'userbusy' },
                                    { label: 'No Service', value: 'noservice' },
                                ]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'No Answer', value: 'noanswer' },
                                    { label: 'User busy', value: 'userbusy' },
                                    { label: 'No Service', value: 'noservice' },
                                ].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'usertype') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                {item.name}
                            </label>
                            <Select
                                isDisabled={item?.disabled}
                                options={[
                                    { label: 'Company Owner', value: 'companyowner' },
                                    { label: 'User', value: 'user' },
                                ]}
                                styles={props?.payload[item?.attr]?.length == 0 && props?.submit ? defaultstylesdanger : defaultstyles}
                                value={[
                                    { label: 'Company Owner', value: 'companyowner' },
                                    { label: 'User', value: 'user' },
                                ].filter((option) => option.value == props?.payload[item?.attr])}
                                onChange={(option) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = option.value;
                                    props?.setpayload({ ...temp });
                                }}
                            />
                            {props?.payload[item?.attr]?.length == 0 && props?.submit && (
                                <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                    {item?.name} is required
                                </div>
                            )}
                        </div>
                    );
                } else if (item?.type == 'number') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <Inputfield
                                disabled={item?.disabled}
                                submit={props?.submit}
                                setsubmit={props?.setsubmit}
                                placeholder={item?.name}
                                value={props?.payload[item.attr]}
                                onChange={(event) => {
                                    props?.setsubmit(false);
                                    var temp = { ...props?.payload };
                                    temp[item?.attr] = event.target.value;
                                    props?.setpayload({ ...temp });
                                }}
                                type={'number'}
                            />
                        </div>
                    );
                } else if (item?.type == 'checkbox') {
                    return (
                        <div class={item.size == '6' ? 'col-lg-6' : 'col-lg-12'}>
                            <div class={' m-0'}>
                                <label class={`${formstyles.checkbox} ${formstyles.checkbox_sub} ${formstyles.path}` + ' d-flex mb-0 p-1 '}>
                                    <input
                                        type="checkbox"
                                        class="mt-1 mb-1"
                                        checked={props?.payload[item.attr] == 0 ? false : true}
                                        onChange={() => {
                                            var temp = { ...props?.payload };
                                            temp[item?.attr] = temp[item?.attr] == 0 ? 1 : 0;
                                            props?.setpayload({ ...temp });
                                        }}
                                    />
                                    <svg viewBox="0 0 21 21" class="h-100">
                                        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                    </svg>
                                    <p class={`${generalstyles.checkbox_label} ` + ' ml-2 mb-0 text-focus text-capitalize cursor-pointer font_14 ml-2 mr-2 wordbreak '}>{item?.name}</p>
                                </label>
                            </div>
                        </div>
                    );
                }
            })}
            <div class="col-lg-12 p-0">
                <div class="row m-0 w-100 allcentered">
                    <button
                        onClick={() => {
                            if (exist) {
                                props?.setsubmit(true);
                            } else {
                                props?.button1onClick();
                            }
                        }}
                        disabled={props?.button1disabled}
                        class={props?.button1class}
                    >
                        {props?.button1disabled && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                        {!props?.button1disabled && <span>{props?.button1placeholder}</span>}
                    </button>
                    {props?.button2 && (
                        <button
                            onClick={() => {
                                if (exist) {
                                    props?.setsubmit(true);
                                } else {
                                    props?.button2onClick();
                                }
                            }}
                            disabled={props?.button2disabled}
                            class={props?.button2class}
                        >
                            {props?.button2disabled && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                            {!props?.button2disabled && <span>{props?.button2placeholder}</span>}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
export default Form;
