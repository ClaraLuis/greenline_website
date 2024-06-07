import React from 'react';
import formstyles from '../components/Website/Generalfiles/CSS_GENERAL/form.module.css';
// import { fetch_collection_data } from '../../../API/API';

// Icons
import { components } from 'react-select';

const Inputfield = (props) => {
    return (
        <div class="row m-0 w-100  ">
            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                {!props?.hideLabel && (
                    <label for="name" class={formstyles.form__label}>
                        {props?.placeholder}
                    </label>
                )}

                <input
                    disabled={props?.disabled}
                    type={props?.type}
                    class={formstyles.form__field}
                    value={props?.value}
                    placeholder={props?.placeholder}
                    style={{
                        border: props?.value?.length == 0 && props?.submit && props?.type != 'time' ? '1px solid var(--danger)' : '',
                    }}
                    onChange={props?.onChange}
                />
                {props?.value?.length == 0 && props?.submit && props?.type != 'time' && (
                    <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                        {props?.placeholder} is required
                    </div>
                )}
            </div>
        </div>
    );
};
export default Inputfield;
