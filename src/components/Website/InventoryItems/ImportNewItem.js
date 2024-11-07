import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { components } from 'react-select';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { BiPlus } from 'react-icons/bi';
import { IoIosArrowBack, IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import ItemsTable from '../MerchantItems/ItemsTable.js';

const { ValueContainer, Placeholder } = components;

const ImportNewItem = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchMerchants, useQueryGQL, fetchInventories, useMutationGQL, useLazyQueryGQL, fetchMerchantItemVariants, fetchRacks, importNew, fetchItemHistory } = API();
    const [search, setsearch] = useState('');

    const { lang, langdetect } = useContext(LanguageContext);
    const [fetchRacksQuery, setfetchRacksQuery] = useState(null);
    const [filter, setfilter] = useState({
        limit: 50,
        invetoryIds: [],
    });
    const [step, setstep] = useState(0);
    const [itemChosen, setitemChosen] = useState({});
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [filterInventories, setfilterInventories] = useState({
        limit: 10,
        afterCursor: null,
        beforeCursor: null,
    });
    const [filteMerchants, setfilteMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filteMerchants);

    const [importNewMutation] = useMutationGQL(importNew(), {
        itemVariantId: props?.importItemPayload?.itemVariantId,
        ownedByOneMerchant: props?.importItemPayload?.ownedByOneMerchant,
        ballotId: props?.importItemPayload?.ballotId?.length == 0 ? undefined : props?.importItemPayload?.ballotId,
        inventoryId: props?.importItemPayload?.inventoryId,
        boxName: props?.importItemPayload?.boxName,
        ballotName: props?.importItemPayload?.ballotName,
        ballotLevel: parseInt(props?.importItemPayload?.ballotLevel),
        rackId: props?.importItemPayload?.rackId,
        boxId: props?.importItemPayload?.boxId,
        count: parseInt(props?.importItemPayload?.count),
        minCount: parseInt(props?.importItemPayload?.minCount),
    });

    const handleIMportNewItem = async () => {
        if (buttonLoading) return;
        setbuttonLoading(true);
        try {
            const { data } = await importNewMutation();
            // setop(false);
            // refetchInventories();
            props?.setimportItemPayload({
                itemVariantId: undefined,
                ownedByOneMerchant: true,
                ballotId: undefined,
                inventoryId: undefined,
                boxName: undefined,
                count: 0,
                minCount: 0,
            });
            props?.setopenModal(false);
            // console.log(data); // Handle response
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
        setbuttonLoading(false);
    };
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);
    // const fetchRacksQuery = useQueryGQL('', fetchRacks(filter));

    const [merchantFilter, setmerchantFilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        name: undefined,
        // merchantId: parseInt(cookies.get('merchantId')),
    });

    const fetchMerchantItemVariantsQuery = useQueryGQL('', fetchMerchantItemVariants(), merchantFilter);

    const [fetchRacksLazyQuery] = useLazyQueryGQL(fetchRacks());

    return (
        <Modal
            show={props?.openModal}
            onHide={() => {
                props?.setopenModal(false);
                props?.setimportItemPayload({
                    itemVariantId: undefined,
                    ownedByOneMerchant: true,
                    ballotId: undefined,
                    inventoryId: undefined,
                    boxName: undefined,
                    count: 0,
                    minCount: 0,
                });
                setstep(0);
                setfetchRacksQuery(null);
            }}
            centered
            size={'lg'}
        >
            <Modal.Header>
                <div className="row w-100 m-0 p-0">
                    <div class="col-lg-6 pt-3 ">
                        <div className="row w-100 m-0 p-0 d-flex align-items-center">
                            {step != 0 && (
                                <IoIosArrowBack
                                    class="mr-1 text-secondaryhover"
                                    size={14}
                                    onClick={() => {
                                        setstep(step - 1);
                                        props?.setimportItemPayload({
                                            ...props?.importItemPayload,
                                            ballotName: undefined,
                                            ballotId: undefined,
                                            boxId: undefined,
                                            rackId: undefined,
                                            boxName: undefined,
                                        });
                                    }}
                                />
                            )}
                            Import new item
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                        <div
                            class={'close-modal-container'}
                            onClick={() => {
                                props?.setopenModal(false);
                                props?.setimportItemPayload({
                                    itemVariantId: undefined,
                                    ownedByOneMerchant: true,
                                    ballotId: undefined,
                                    inventoryId: undefined,
                                    boxName: undefined,
                                    count: 0,
                                    minCount: 0,
                                });
                                setstep(0);
                                setfetchRacksQuery(null);
                            }}
                        >
                            <IoMdClose />
                        </div>
                    </div>{' '}
                </div>
            </Modal.Header>
            <Modal.Body>
                {step == 0 && (
                    <div class="row m-0 w-100 py-2 pb-3">
                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                            <SelectComponent
                                title={'Merchant'}
                                filter={filteMerchants}
                                setfilter={setfilteMerchants}
                                options={fetchMerchantsQuery}
                                attr={'paginateMerchants'}
                                label={'name'}
                                value={'id'}
                                payload={merchantFilter}
                                payloadAttr={'merchantId'}
                                onClick={(option) => {
                                    // setfilterobj({ ...filterobj, merchantIds: temp });
                                    setmerchantFilter({ ...merchantFilter, merchantId: option?.id });
                                }}
                            />
                        </div>
                        <div class="col-lg-12 p-0 my-3 ">
                            <div class="row m-0 w-100 d-flex align-items-center">
                                <div class="col-lg-10 p-0">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={search}
                                            placeholder={'Search by name, SKU '}
                                            onChange={(event) => {
                                                setsearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-2 p-1">
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + ' p-0 allcentered bg-primary-light'}
                                        onClick={() => {
                                            if (search.length == 0) {
                                                setmerchantFilter({ ...merchantFilter, name: undefined });
                                            } else {
                                                setmerchantFilter({ ...merchantFilter, name: search });
                                            }
                                        }}
                                    >
                                        search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                filter={merchantFilter}
                                setfilter={setmerchantFilter}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                            <ItemsTable
                                card="col-lg-3"
                                clickable={true}
                                items={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.data}
                                actiononclick={(item) => {
                                    props?.setimportItemPayload({ ...props?.importItemPayload, itemVariantId: item?.id });
                                    setitemChosen({ ...item });
                                    setstep(step + 1);
                                }}
                            />
                        </div>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemVariantsQuery?.data?.paginateItemVariants?.cursor?.afterCursor}
                                filter={merchantFilter}
                                setfilter={setmerchantFilter}
                            />
                        </div>
                    </div>
                )}
                {step != 0 && (
                    <div class="row m-0 w-100">
                        <div class="co-lg-12 mb-3">
                            <div class="row m-0 w-100 d-flex align-items-center">
                                <div style={{ width: '55px', height: '50px', border: '1px solid #eee', borderRadius: '10px' }}>
                                    <img src={itemChosen?.imageUrl} style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
                                </div>
                                <div class="ml-2">
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px' }}>
                                        {itemChosen?.name}
                                    </div>
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 500, fontSize: '13px', color: 'lightgray' }}>
                                        {itemChosen?.sku}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {step == 1 && (
                    <div class="row m-0 w-100">
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
                                onClick={async (option) => {
                                    var { data } = await fetchRacksLazyQuery({
                                        variables: {
                                            input: {
                                                limit: 50,
                                                invetoryIds: [option?.id],
                                            },
                                        },
                                    });
                                    setfetchRacksQuery(data);
                                    // alert(JSON.stringify(fetchRacksQuery));
                                    props?.setimportItemPayload({ ...props?.importItemPayload, inventoryId: option?.id });
                                    setfilter({ ...filter, invetoryIds: [option?.id] });
                                }}
                            />
                        </div>
                        <div class="col-lg-12 p-0">
                            {fetchRacksQuery?.loading && (
                                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                                </div>
                            )}
                            {fetchRacksQuery?.paginateRacks != undefined && (
                                <>
                                    {fetchRacksQuery?.paginateRacks?.data?.length == 0 && (
                                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                            <div class="row m-0 w-100">
                                                <FaLayerGroup size={40} class=" col-lg-12" />
                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                    No Racks
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div class="row w-100 allcentered m-0">
                                        {fetchRacksQuery?.paginateRacks?.data?.map((item, index) => {
                                            // var levels = [];
                                            // var exist = false;
                                            // var chosenballot = {};
                                            // var chosenlevelindex = null;
                                            const levels1 = _.groupBy(item?.ballots, 'level');
                                            var levels = _.map(levels1, (ballots, level) => {
                                                return { level: level, ballots: ballots };
                                            });
                                            // item?.ballots?.map((ballot, ballotindex) => {
                                            //     chosenballot = ballot;
                                            //     levels?.map((level, levelindex) => {
                                            //         if (level?.level == ballot?.level) {
                                            //             exist = true;
                                            //             chosenlevelindex = levelindex;
                                            //         }
                                            //     });
                                            //     if (exist) {
                                            //         levels[chosenlevelindex].boxes.push(chosenballot);
                                            //     } else {
                                            //         levels.push({ level: chosenballot?.level, ballots: [chosenballot] });
                                            //     }
                                            // });

                                            return (
                                                <div class="col-lg-6 mb-2">
                                                    <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '12px' }}>
                                                        <div class="col-lg-12 p-0">
                                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                                <div class="col-lg-6 p-0" style={{ fontWeight: 700 }}>
                                                                    Rack {item.name}
                                                                </div>
                                                                <div class="col-lg-6 p-0 d-flex justify-content-end">
                                                                    <div
                                                                        onClick={() => {
                                                                            props?.setimportItemPayload({ ...props?.importItemPayload, rackId: item.id });
                                                                            setstep(step + 1);
                                                                        }}
                                                                        class={'searchpill allcentered'}
                                                                        style={{ width: '25px', height: '25px' }}
                                                                    >
                                                                        <BiPlus />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-12 p-0">
                                                            <hr class="p-0 m-0" />
                                                        </div>
                                                        <div class="col-lg-12 p-0 mt-1">
                                                            <div class="row m-0 w-100">
                                                                {levels?.map((level, levelindex) => {
                                                                    return (
                                                                        <div class="col-lg-12 p-0">
                                                                            <div class="row m-0 w-100 d-flex align-items-center">
                                                                                Level {level?.level}:
                                                                                {level?.ballots?.map((ballot, ballotindex) => {
                                                                                    return (
                                                                                        <div class="col-lg-12 p-0 mt-1">
                                                                                            <div
                                                                                                style={{ border: '1px solid #eee', borderRadius: '8px' }}
                                                                                                class="row m-0 p-1 w-100 d-flex align-items-center"
                                                                                            >
                                                                                                <div class="col-lg-6 p-0" style={{ fontWeight: 700 }}>
                                                                                                    {ballot?.name}
                                                                                                </div>
                                                                                                <div class="col-lg-6 p-0 d-flex justify-content-end">
                                                                                                    <div
                                                                                                        onClick={() => {
                                                                                                            props?.setimportItemPayload({ ...props?.importItemPayload, ballotId: ballot.id });
                                                                                                            setstep(step + 1);
                                                                                                        }}
                                                                                                        class={'searchpill allcentered'}
                                                                                                        style={{ width: '25px', height: '25px' }}
                                                                                                    >
                                                                                                        <BiPlus />
                                                                                                    </div>
                                                                                                </div>
                                                                                                {ballot?.boxes?.map((box, boxIndex) => {
                                                                                                    return (
                                                                                                        <div
                                                                                                            onClick={() => {
                                                                                                                props?.setimportItemPayload({ ...props?.importItemPayload, boxId: box.id });
                                                                                                                setstep(step + 1);
                                                                                                            }}
                                                                                                            class={'searchpill'}
                                                                                                        >
                                                                                                            {box?.name} <BiPlus class="ml-2" />
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {step == 2 && (
                    <div class="row m-0 w-100 py-2">
                        {props?.importItemPayload?.rackId && (
                            <div class="col-lg-6">
                                <div class="row m-0 w-100  ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label class={formstyles.form__label}>Ballot Name</label>
                                        <input
                                            type={'text'}
                                            class={formstyles.form__field}
                                            value={props?.importItemPayload.ballotName}
                                            onChange={(event) => {
                                                props?.setimportItemPayload({ ...props?.importItemPayload, ballotName: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(props?.importItemPayload?.ballotId || props?.importItemPayload?.rackId) && (
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
                            </div>
                        )}
                        {props?.importItemPayload?.rackId && (
                            <div class="col-lg-6">
                                <div class="row m-0 w-100  ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                        <label class={formstyles.form__label}>Level</label>
                                        <input
                                            type={'number'}
                                            class={formstyles.form__field}
                                            value={props?.importItemPayload.ballotLevel}
                                            onChange={(event) => {
                                                props?.setimportItemPayload({ ...props?.importItemPayload, ballotLevel: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

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
                                    props?.setimportItemPayload({ ...props?.importItemPayload, inventoryId: option?.id });
                                    setfilter({ ...filter, invetoryIds: [option?.id] });
                                }}
                            />
                        </div>
                        {props?.importItemPayload?.inventoryId?.length != 0 && (
                            <>
                                {fetchRacksQuery?.data?.paginateRacks?.data?.map((item, index) => {
                                    return (
                                        <div class="col-lg-6 mb-2">
                                            <div class="row m-0 w-100 p-2" style={{ border: '1px solid #eee', borderRadius: '0.25rem', fontSize: '12px' }}>
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
                                disabled={buttonLoading}
                            >
                                {buttonLoading && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoading && <span>Import</span>}
                            </button>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};
export default ImportNewItem;
