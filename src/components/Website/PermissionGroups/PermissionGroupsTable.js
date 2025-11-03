import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import shimmerstyles from '../Generalfiles/CSS_GENERAL/shimmer.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV, FaLayerGroup } from 'react-icons/fa';

import { components } from 'react-select';
// Icons

const { ValueContainer, Placeholder } = components;

const PermissionGroupsTable = (props) => {
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);
    const handleSelect = (item) => {
        let updatedArray;
        if (props?.selectedpermissions.includes(item.id)) {
            updatedArray = props?.selectedpermissions.filter((id) => id !== item.id);
        } else {
            updatedArray = [...props?.selectedpermissions, item.id];
        }
        props?.setselectedpermissions(updatedArray);
        if (props?.setselectedpermissions) {
            props?.setselectedpermissions(updatedArray);
        }
    };
    return (
        <>
            {props?.paginatePermissionGroupsQuery?.loading && (
                <div style={{ minHeight: '70vh' }} className="row m-0 w-100 d-flex align-content-start align-items-start justify-content-start">
                    {[1, 2, 3, 4].map((item, index) => (
                        <div key={index} className={props?.card}>
                            <div className={`${generalstyles.card} p-3 row m-0 w-100 d-flex align-items-center`}>
                                <div className="col-lg-8 col-md-8 p-0 mb-2">
                                    <div className={shimmerstyles.shimmer} style={{ height: '20px', width: '60%' }}></div>
                                </div>
                                <div className="col-lg-4 col-md-4 p-0 mb-2 d-flex justify-content-end">
                                    <div className={shimmerstyles.shimmer} style={{ height: '28px', width: '28px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="col-lg-12 p-0 mb-1">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '80%' }}></div>
                                </div>
                                <div className="col-lg-6 p-0 mb-1">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '70%' }}></div>
                                </div>
                                <div className="col-lg-6 p-0 mb-1">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '60%' }}></div>
                                </div>
                                <div className="col-lg-6 p-0 mb-1">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '65%' }}></div>
                                </div>
                                <div className="col-lg-12 p-0">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!props?.paginatePermissionGroupsQuery?.loading && props?.paginatePermissionGroupsQuery?.data != undefined && (
                <>
                    {props?.paginatePermissionGroupsQuery?.data?.paginatePermissionGroups?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Permission Groups
                                </div>
                            </div>
                        </div>
                    )}
                    {props?.paginatePermissionGroupsQuery?.data?.length != 0 && (
                        <div style={{ minHeight: '70vh' }} class="row m-0 w-100 d-flex align-content-start align-items-start justify-content-start">
                            {props?.paginatePermissionGroupsQuery?.data?.paginatePermissionGroups?.data?.map((item, index) => {
                                var selected = props?.selectedpermissions?.includes(item.id);
                                return (
                                    <div className={props?.card}>
                                        <div
                                            style={{
                                                cursor: props?.select ? 'pointer' : '',
                                                background: selected ? 'var(--secondary)' : '',
                                                transition: 'all 0.4s',
                                                border: '1px solid #eee',
                                            }}
                                            onClick={() => props?.select && handleSelect(item)}
                                            class={generalstyles.card + ' p-3 row m-0 w-100 d-flex align-items-center '}
                                        >
                                            <div className="col-lg-8 col-md-8 p-0  text-capitalize mb-2">
                                                <span style={{ fontWeight: 700 }}>{item?.name}</span>
                                            </div>
                                            {!props?.select && (
                                                <div className="col-lg-4 col-md-4 p-0 mb-2 d-flex justify-content-end">
                                                    {item?.id?.length != 7 && (
                                                        <Dropdown>
                                                            <Dropdown.Toggle>
                                                                <div
                                                                    class="iconhover allcentered ml-1"
                                                                    style={{
                                                                        color: 'var(--primary)',
                                                                        // borderRadius: '10px',
                                                                        width: '28px',
                                                                        height: '28px',
                                                                        transition: 'all 0.4s',
                                                                    }}
                                                                >
                                                                    <FaEllipsisV />
                                                                </div>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu style={{ minWidth: '170px', fontSize: '12px' }}>
                                                                {isAuth([1, 46, 52]) && (
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            history.push('/permissiongroupinfo?id=' + item?.id);
                                                                        }}
                                                                        class="py-2"
                                                                    >
                                                                        <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Update Permissions</p>
                                                                    </Dropdown.Item>
                                                                )}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    )}
                                                </div>
                                            )}

                                            <div className="col-lg-6 p-0 mb-1">
                                                <span style={{ fontWeight: 600 }} class="d-flex align-items-center text-capitalize">
                                                    {item?.permissions?.length} permissions
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </>
    );
};
export default PermissionGroupsTable;
