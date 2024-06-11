import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { IoMdClose } from 'react-icons/io';
import API from '../../../API/API.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const ImportNewItem = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchInventories, useMutationGQL, addInventory, fetchItemsInBox, fetchRacks, importNew, fetchItemHistory } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [filter, setfilter] = useState({
        limit: 50,
        invetoryIds: [],
    });

    const [filterInventories, setfilterInventories] = useState({
        limit: 10,
        afterCursor: null,
        beforeCursor: null,
    });

    const [importNewMutation] = useMutationGQL(importNew(), {
        itemSku: props?.importItemPayload?.itemSku,
        ownedByOneMerchant: props?.importItemPayload?.ownedByOneMerchant,
        ballotId: props?.importItemPayload?.ballotId,
        inventoryId: props?.importItemPayload?.inventoryId,
        boxName: props?.importItemPayload?.boxName,
        count: parseInt(props?.importItemPayload?.count),
        minCount: parseInt(props?.importItemPayload?.minCount),
    });

    const handleIMportNewItem = async () => {
        try {
            const { data } = await importNewMutation();
            // setop(false);
            // refetchInventories();
            props?.openModals(false);
            // console.log(data); // Handle response
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);
    const fetchRacksQuery = useQueryGQL('', fetchRacks(filter));

    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/inventoryitems');
    }, []);

    return (
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
                        <div className="row w-100 m-0 p-0">Import new item</div>
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
                    <div class="col-lg-6">
                        <div class="row m-0 w-100  ">
                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                <label class={formstyles.form__label}>Box Name</label>
                                <input
                                    type={'text'}
                                    class={formstyles.form__field}
                                    value={props?.importItemPayload.boxName}
                                    onChange={(event) => {
                                        props?.setimportItemPayload({ ...props?.importItemPayload, boxName: event.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>{' '}
                    <div class="col-lg-6">
                        <div class="row m-0 w-100  ">
                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                <label class={formstyles.form__label}>Count</label>
                                <input
                                    type={'number'}
                                    class={formstyles.form__field}
                                    value={props?.importItemPayload.count}
                                    onChange={(event) => {
                                        props?.setimportItemPayload({ ...props?.importItemPayload, count: event.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row m-0 w-100  ">
                            <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                <label class={formstyles.form__label}>Min Count</label>
                                <input
                                    type={'number'}
                                    class={formstyles.form__field}
                                    value={props?.importItemPayload.minCount}
                                    onChange={(event) => {
                                        props?.setimportItemPayload({ ...props?.importItemPayload, minCount: event.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div class={'col-lg-6'} style={{ marginBottom: '15px' }}>
                        <SelectComponent
                            title={'Inventory'}
                            filter={filterInventories}
                            setfilter={setfilterInventories}
                            options={fetchinventories}
                            attr={'paginateInventories'}
                            label={'name'}
                            value={'id'}
                            payload={props?.importItemPayload}
                            payloadAttr={'inventoryId'}
                            onClick={(option) => {
                                props?.setimportItemPayload({ ...props?.importItemPayload, inventoryId: option.id });
                                setfilter({ ...filter, invetoryIds: [option.id] });
                            }}
                        />
                    </div>
                    {props?.importItemPayload?.inventoryId?.length != 0 && (
                        <>
                            {fetchRacksQuery?.data?.paginateRacks?.data?.map((item, index) => {
                                return (
                                    <div class="col-lg-6 mb-2">
                                        <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '15px', fontSize: '12px' }}>
                                            <div class="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                                Rack {item.name}
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <hr class="p-0 m-0" />
                                            </div>
                                            <div class="col-lg-12 p-0 mt-1">
                                                <div class="row m-0 w-100">
                                                    {item?.ballots?.map((ballot, ballotindex) => {
                                                        return (
                                                            <div
                                                                onClick={() => {
                                                                    props?.setimportItemPayload({ ...props?.importItemPayload, ballotId: ballot.id });
                                                                }}
                                                                class={props?.importItemPayload.ballotId == ballot.id ? 'searchpillselected' : 'searchpill'}
                                                            >
                                                                {' '}
                                                                {ballot?.name}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                    <div class="col-lg-12 p-0 mt-2 allcentered">
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1'}
                            onClick={() => {
                                handleIMportNewItem();
                            }}
                        >
                            Import
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default ImportNewItem;
