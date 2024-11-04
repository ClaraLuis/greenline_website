import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
import { LanguageContext } from '../../LanguageContext.js';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { NotificationManager } from 'react-notifications';
// import { useMutation } from 'react-query';
import { components } from 'react-select';
import API from '../../API/API.js';
import Inputfield from '../Inputfield.js';
import SubmitButton from '../Form.js';
import Form from '../Form.js';
import { gql, useMutation, useQuery } from '@apollo/client';
import AddEditSecuritylayers from './Securitylayers/AddEditSecuritylayers.js';
import Cookies from 'universal-cookie';
import SelectComponent from '../SelectComponent.js';
import { BiEdit } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import Fileuploader from './Fileuploader.js';

const { ValueContainer, Placeholder } = components;

const FilesPopup = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { userRolesContext, userTypeContext, employeeTypeContext, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchUsers, useMutationGQL, addUser, editUserType, fetchMerchants, fetchInventories, fetchHubs, updateEmployeeInfo } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);
    const [edit, setedit] = useState(false);
    const [changerolesmodal, setchangerolesmodal] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const groupedRoles = _.groupBy(props?.payload?.userRoles, (role) => role.role.type);

    // Transform into desired format
    const userRoles = Object.keys(groupedRoles).map((type) => ({
        type,
        roles: groupedRoles[type],
    }));
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const [filterInventories, setfilterInventories] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);

    const [addUser1] = useMutationGQL(addUser(), {
        name: props?.payload?.name,
        type: cookies.get('merchantId') != undefined ? 'merchant' : props?.payload?.type,
        phone: props?.payload?.phone,
        email: props?.payload?.email,
        birthdate: props?.payload?.birthdate,
        employeeInfo:
            props?.payload?.type == 'employee'
                ? {
                      type: props?.payload?.employeeType,
                      currency: props?.payload?.currency,
                      salary: props?.payload?.salary,
                      commission: props?.payload?.commission,
                  }
                : undefined,
        hubId: parseInt(props?.payload?.hubID),
        inventoryId: props?.payload?.inventoryId,

        merchantId: cookies.get('merchantId') != undefined ? undefined : parseInt(props?.payload?.merchant),
    });
    const [updateEmployeeInfoMutation] = useMutationGQL(updateEmployeeInfo(), {
        type: props?.payload?.employeeType,
        salary: props?.payload?.salary,
        commission: props?.payload?.commission,
        hubId: parseInt(props?.payload?.hubID),
        inventoryId: props?.payload?.inventoryId,
        id: props?.payload?.id,
    });

    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const { refetch: refetchUsers } = useQueryGQL('', fetchUsers(), filterUsers);
    const [filterHubs, setfilterHubs] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('', fetchHubs(), filterHubs);

    return (
        <>
            <Modal
                show={props?.openModal}
                onHide={() => {
                    props?.setopenModal(false);
                    setedit(false);
                }}
                centered
                size={'lg'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-12 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    props?.setopenModal(false);
                                    setedit(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <Fileuploader onChange={props?.onChange} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default FilesPopup;
