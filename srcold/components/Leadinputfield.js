import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import formstyles from './Website/Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from './Website/Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { useQuery } from 'react-query';
import API from '../API/API';
const Leadinputfield = (props) => {
    let history = useHistory();
    const { FetchLeads_API } = API();
    const [StartSearch, setStartSearch] = useState(false);
    const [placeholder, setplaceholder] = useState('');

    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
    const FetchLeads = useQuery(['FetchLeads_API' + JSON.stringify(filterobj)], () => FetchLeads_API({ filter: filterobj }), {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    useEffect(() => {
        if (FetchLeads?.isSuccess && !FetchLeads?.isFetching) {
            FetchLeads?.data?.data?.data?.map((item, index) => {
                if (item?.id == props?.value) {
                    setplaceholder(item?.fname + ' ' + item?.lname);
                }
            });
        }
    }, [FetchLeads.isSuccess, props?.value]);

    useEffect(() => {
        setStartSearch(false);
        const delayDebounceFn = setTimeout(() => {
            if (filterobj?.search?.length != 0) {
                setStartSearch(true);
                // setfilterobj({ ...filterobj, search: event.target.value });
            }
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [filterobj.search]);
    return (
        <>
            <div class={' row m-0 w-100 '}>
                <div class={`${formstyles.form__group} ${formstyles.field}`}>
                    <label class={formstyles.form__label}>{props?.placeholder}</label>
                    <input
                        type="name"
                        id="myInput"
                        disabled={props?.disabled}
                        class={formstyles.form__field}
                        value={placeholder}
                        placeholder={props?.placeholder}
                        onChange={(event) => {
                            props?.setsubmit(false);
                            setplaceholder(event.target.value);
                            setfilterobj({ ...filterobj, search: event.target.value });
                        }}
                        style={{
                            border: props?.value?.length == 0 && props?.submit ? '1px solid var(--danger)' : '',
                        }}
                    />
                    {props?.value?.length == 0 && props?.submit && (
                        <div class="col-lg-12 px-2 pt-2" style={{ color: 'var(--danger)', fontSize: '11px' }}>
                            {props?.placeholder} is required
                        </div>
                    )}
                </div>
            </div>

            <div class={filterobj.search.length == 0 ? generalstyles.searchmenu + ' row m-0 w-100 ' : generalstyles.searchmenushown + ' row m-0 '}>
                <div
                    class="blocker"
                    onClick={(e) => {
                        e.stopPropagation();
                        setfilterobj({ ...filterobj, search: '' });
                    }}
                ></div>
                {FetchLeads.isFetching && (
                    <div class="col-lg-12 allcentered p-2">
                        <div>
                            <CircularProgress color="var(--primary)" width="25px" height="25px" duration="1s" />
                        </div>
                    </div>
                )}
                {!FetchLeads.isFetching && FetchLeads?.data?.data?.data?.length != 0 && (
                    <>
                        {FetchLeads?.data?.data?.data?.map((item, index) => {
                            return (
                                <div class="col-lg-12 p-0">
                                    <div
                                        onClick={() => {
                                            setfilterobj({ ...filterobj, search: '' });
                                            setplaceholder(item?.fname + ' ' + item?.lname);
                                            props?.onClick(item);
                                        }}
                                        class={generalstyles.searchitem}
                                    >
                                        <div class={generalstyles.companyname}>
                                            {item?.fname} {item?.lname}
                                            <br />
                                            {item?.phonenumber}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}{' '}
            </div>
        </>
    );
};

export default Leadinputfield;
