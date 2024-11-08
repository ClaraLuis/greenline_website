import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BiShowAlt } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import Pagespaginatecomponent from '../../../Pagespaginatecomponent.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import { useMutation } from 'react-query';
import reviewsstyles from './reviews.module.css';
import Select, { components } from 'react-select';

// Icons
import API from '../../../API/API.js';
import { FiPlus } from 'react-icons/fi';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { TbSquareCheck, TbSquare, TbPlus, TbEdit } from 'react-icons/tb';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import SelectComponent from '../../SelectComponent.js';
import Inputfield from '../../Inputfield.js';
const { ValueContainer, Placeholder } = components;
var _ = require('lodash');
const InventoryDetails = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const {
        fetchMerchants,
        useQueryGQL,
        fetcOneInventory,
        assignMerchantToInventory,
        useMutationGQL,
        removeMerchantAssignmentFromInventory,
        updateRackName,
        updateBallotName,
        updateBoxName,
        addRackLevels,
    } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [merchantModal, setmerchantModal] = useState({ open: false, type: '' });

    const [openModal, setopenModal] = useState(false);
    const [inventoryId, setinventoryId] = useState('');

    const [chosenBallotBoxes, setchosenBallotBoxes] = useState([]);
    const [racks, setracks] = useState([]);
    const [ballots, setballots] = useState([]);
    const [boxes, setboxes] = useState([]);
    const fetcOneInventoryQuery = useQueryGQL('', fetcOneInventory(parseInt(inventoryId)));
    const { refetch: refetcOneInventory } = useQueryGQL('', fetcOneInventory(parseInt(inventoryId)));

    const [assignMerchantToInventoryMutation] = useMutationGQL(assignMerchantToInventory(), {
        merchantId: merchantModal?.merchantId,
        rackIds: racks?.length == 0 ? undefined : racks,
        ballotIds: ballots?.length == 0 ? undefined : ballots,
        boxIds: boxes?.length == 0 ? undefined : boxes,
    });
    const [updateRackNameMutation] = useMutationGQL(updateRackName(), {
        id: merchantModal?.id,
        name: merchantModal?.name,
    });
    const [updateBallotNameMutation] = useMutationGQL(updateBallotName(), {
        id: merchantModal?.id,
        name: merchantModal?.name,
    });
    const [updateBoxNameMutation] = useMutationGQL(updateBoxName(), {
        id: merchantModal?.id,
        name: merchantModal?.name,
    });
    const [addRackLevelsMutation] = useMutationGQL(addRackLevels(), {
        id: merchantModal?.id,
        levels: parseInt(merchantModal?.levels),
    });
    const [removeMerchantAssignmentFromInventoryMutation] = useMutationGQL(removeMerchantAssignmentFromInventory(), {
        rackIds: racks?.length == 0 ? undefined : racks,
        ballotIds: ballots?.length == 0 ? undefined : ballots,
        boxIds: boxes?.length == 0 ? undefined : boxes,
    });

    // const fetchusers = [];
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    useEffect(() => {
        setpageactive_context('/inventorydetails');
        setpagetitle_context('Hubs');
    }, []);

    useEffect(() => {
        if (queryParameters.get('inventoryId') == undefined) {
            setinventoryId('');
        } else {
            var newarray = queryParameters.get('inventoryId');
            newarray = JSON.parse(newarray);
            setinventoryId(newarray);
        }
    }, []);
    const middlePadding = '15px';
    const innerPadding = '15px';

    const middleBorderRadius = '0.25rem';
    const innerBorderRadius = '0.25rem';

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100 d-flex align-items-center'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Inventory Details
                            </p>
                        </div>
                        <div class="col-lg-6 d-flex justify-content-end ">
                            {(racks?.length != 0 || ballots?.length != 0 || boxes?.length != 0) && (
                                <div class="row m-0 w-100 d-flex justify-content-end">
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mx-2'}
                                        onClick={() => {
                                            setmerchantModal({ open: true, type: 1, modalType: 'assign' });
                                        }}
                                    >
                                        Assign to merchant
                                    </button>
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  bg-danger bg-dangerhover'}
                                        onClick={() => {
                                            setmerchantModal({ open: true, type: 2, modalType: 'deassign' });
                                        }}
                                    >
                                        Deassign to merchant
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div class={' row m-0 w-100'}>
                    {fetcOneInventoryQuery?.loading && (
                        <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                            <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                        </div>
                    )}
                    {!fetcOneInventoryQuery?.loading && fetcOneInventoryQuery?.data != undefined && (
                        <>
                            {fetcOneInventoryQuery?.data?.findOneInventory?.racks?.length == 0 && (
                                <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                    <div class="row m-0 w-100">
                                        <FaLayerGroup size={40} class=" col-lg-12" />
                                        <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                            No Racks
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div class={'col-lg-12 px-3'}>
                                <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                    {fetcOneInventoryQuery?.data?.findOneInventory?.racks?.map((item, index) => {
                                        // var ballotsCount = 0;
                                        const levels1 = _.groupBy(item?.ballots, 'level');
                                        let ballotsCount = 0;

                                        const levels = _.map(_.range(1, item.levels + 1), (level) => {
                                            const ballots = levels1[level] || []; // Get the ballots for the level, or an empty array if none exist
                                            ballotsCount += ballots.length;

                                            return { level: level, ballots: ballots };
                                        });

                                        return (
                                            <AccordionItem class={`${generalstyles.card}` + ' w-100'}>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                        <div className="col-lg-12 p-0" style={{ fontWeight: 700 }}>
                                                            <div className="row m-0 w-100 justify-content-between align-items-center">
                                                                <div className="row m-0 d-flex align-items-center">
                                                                    Rack {item.name}
                                                                    <TbEdit
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setmerchantModal({ open: true, type: 'edit', id: item?.id, name: item?.name, editType: 'rack' });
                                                                        }}
                                                                        class="ml-1 text-secondaryhover"
                                                                    />
                                                                </div>
                                                                <div class="row m-0 d-flex align-items-center">
                                                                    <div
                                                                        onClick={() => {
                                                                            setmerchantModal({ open: true, id: item?.id, levels: 0, type: 'addlevels', initialLevels: levels?.length });
                                                                        }}
                                                                        style={{ color: 'white' }}
                                                                        className={' mx-1 wordbreak bg-primary bg-secondaryhover rounded-pill  allcentered d-flex align-items-center '}
                                                                    >
                                                                        {item?.levels} Levels <TbPlus class=" mx-1" />
                                                                    </div>
                                                                    <div
                                                                        // onClick={() => {
                                                                        //     setchangestatusmodal(true);
                                                                        // }}
                                                                        style={{ color: 'white' }}
                                                                        className={'  wordbreak text-success bg-light-success rounded-pill font-weight-600 '}
                                                                    >
                                                                        {ballotsCount} Ballots
                                                                    </div>
                                                                    {item?.merchant && (
                                                                        <span style={{ color: 'white' }} className={' mx-1 wordbreak text-success bg-light-success rounded-pill font-weight-600 '}>
                                                                            {' '}
                                                                            {item?.merchant?.name}
                                                                        </span>
                                                                    )}
                                                                    <div
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setracks((prevRacks) => {
                                                                                if (prevRacks.includes(item?.id)) {
                                                                                    // If the rack is already selected, remove it and all associated ballots and boxes
                                                                                    const filteredRacks = prevRacks.filter((id) => id !== item?.id);

                                                                                    return filteredRacks;
                                                                                } else {
                                                                                    // If the rack is not selected, add it to the selected racks
                                                                                    const updatedBallots = ballots.filter((ballotId) => {
                                                                                        const ballot = item.ballots.find((b) => b.id === ballotId);
                                                                                        return !ballot;
                                                                                    });
                                                                                    const updatedBoxes = boxes.filter((boxId) => {
                                                                                        const box = item.ballots.flatMap((b) => b.boxes).find((box) => box.id === boxId);
                                                                                        return !box;
                                                                                    });
                                                                                    setballots(updatedBallots);
                                                                                    setboxes(updatedBoxes);
                                                                                    return [...prevRacks, item?.id];
                                                                                }
                                                                            });
                                                                        }}
                                                                        className="iconhover allcentered"
                                                                        style={{ width: '35px', height: '35px' }}
                                                                    >
                                                                        {racks.includes(item?.id) ? <TbSquareCheck size={18} color={'var(--success)'} /> : <TbSquare size={18} color={''} />}
                                                                    </div>
                                                                    <AccordionItemState>
                                                                        {(state) => {
                                                                            if (state.expanded == true) {
                                                                                return (
                                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                                        <BsChevronUp />
                                                                                    </i>
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                                        <BsChevronDown />
                                                                                    </i>
                                                                                );
                                                                            }
                                                                        }}
                                                                    </AccordionItemState>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    {/* <hr className="mt-2 mb-3" /> */}
                                                    <div className="row m-0 w-100">
                                                        <div className="col-lg-12 p-0">
                                                            <hr className="p-0 m-0" />
                                                        </div>
                                                        <div className="col-lg-12 p-0 mt-2">
                                                            <div className="row m-0 w-100">
                                                                {levels?.map((level, levelindex) => (
                                                                    <div className="col-lg-12 p-0" key={level.level}>
                                                                        <div className="row m-0 w-100 d-flex align-items-center">
                                                                            <div className="col-lg-12">
                                                                                <div className="row m-0 w-100 d-flex justify-content-between align-items-center">
                                                                                    <span style={{ fontWeight: 700 }}>Level {level?.level}</span>
                                                                                    {level?.ballots?.length != 0 && (
                                                                                        <div
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (!level?.ballots?.every((ballot) => ballots.includes(ballot.id))) {
                                                                                                    // Add all ballots of this level to the ballots array
                                                                                                    const updatedBallots = [...ballots, ...level.ballots.map((ballot) => ballot.id)];

                                                                                                    // Remove all boxes associated with this level's ballots from the boxes array
                                                                                                    const updatedBoxes = boxes.filter(
                                                                                                        (boxId) => !level.ballots.flatMap((b) => b.boxes).some((box) => box.id === boxId),
                                                                                                    );

                                                                                                    setballots(updatedBallots);
                                                                                                    setboxes(updatedBoxes);

                                                                                                    // Mark the level's rack as selected
                                                                                                    // setracks([...racks, item?.id]);
                                                                                                } else {
                                                                                                    const updatedBallots = ballots.filter(
                                                                                                        (ballotId) => !level.ballots.some((ballot) => ballot.id === ballotId),
                                                                                                    );
                                                                                                    const updatedBoxes = boxes.filter(
                                                                                                        (boxId) => !level.ballots.flatMap((b) => b.boxes).some((box) => box.id === boxId),
                                                                                                    );

                                                                                                    setballots(updatedBallots);
                                                                                                    setboxes(updatedBoxes);
                                                                                                }
                                                                                            }}
                                                                                            className={`iconhover allcentered`}
                                                                                            style={{
                                                                                                width: '35px',
                                                                                                height: '35px',
                                                                                                // pointerEvents: level?.ballots?.every((ballot) => ballots.includes(ballot.id)) ? 'none' : 'auto',
                                                                                            }}
                                                                                        >
                                                                                            {level?.ballots?.every((ballot) => ballots.includes(ballot.id)) ? (
                                                                                                <TbSquareCheck size={18} color={'var(--success)'} />
                                                                                            ) : (
                                                                                                <TbSquare size={18} color={''} />
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-lg-12 mb-3 mt-2 p-0">
                                                                                <div
                                                                                    className="row m-0 w-100 scrollmenuclasssubscrollbar"
                                                                                    style={{
                                                                                        border: '1px solid #eee',
                                                                                        borderRadius: middleBorderRadius,
                                                                                        padding: middlePadding,
                                                                                        fontSize: '12px',
                                                                                        overflowX: 'scroll',
                                                                                        flexWrap: 'nowrap',
                                                                                        background: '#EBF0F4',
                                                                                    }}
                                                                                >
                                                                                    {level?.ballots?.length == 0 && <div class="text-danger">Empty</div>}

                                                                                    {level?.ballots?.map((ballot, ballotindex) => (
                                                                                        <div className="col-lg-9 p-0" key={ballot.id}>
                                                                                            <div
                                                                                                style={{
                                                                                                    border: '1px solid #eee',
                                                                                                    borderRadius: middleBorderRadius,
                                                                                                    padding: middlePadding,
                                                                                                    background: 'white',
                                                                                                    boxShadow: '#919eab4d 0 0 2px, #919eab1f 0 12px 24px -4px',
                                                                                                }}
                                                                                                className="row m-0 w-100 d-flex align-items-center"
                                                                                            >
                                                                                                <div className="row m-0 w-100 justify-content-between align-items-center">
                                                                                                    <div className="row m-0 d-flex align-items-center">
                                                                                                        {ballot?.name}

                                                                                                        <TbEdit
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation();
                                                                                                                setmerchantModal({
                                                                                                                    open: true,
                                                                                                                    type: 'edit',
                                                                                                                    id: ballot?.id,
                                                                                                                    name: ballot?.name,
                                                                                                                    editType: 'ballot',
                                                                                                                });
                                                                                                            }}
                                                                                                            class="ml-1 text-secondaryhover"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div class="row m-0 d-flex align-items-center">
                                                                                                        {ballot?.merchant && (
                                                                                                            <span
                                                                                                                style={{ color: 'white' }}
                                                                                                                className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 '}
                                                                                                            >
                                                                                                                {' '}
                                                                                                                {ballot?.merchant?.name}
                                                                                                            </span>
                                                                                                        )}
                                                                                                        <div
                                                                                                            onClick={() => {
                                                                                                                if (!racks?.includes(ballot?.rackId)) {
                                                                                                                    setballots((prevBallots) => {
                                                                                                                        if (prevBallots.includes(ballot?.id)) {
                                                                                                                            // If the ballot is already selected, remove it and all associated boxes
                                                                                                                            const filteredBallots = prevBallots.filter((id) => id !== ballot?.id);

                                                                                                                            const updatedBoxes = boxes.filter((boxId) => {
                                                                                                                                const box = ballot.boxes.find((b) => b.id === boxId);
                                                                                                                                return !box;
                                                                                                                            });

                                                                                                                            setboxes(updatedBoxes);
                                                                                                                            return filteredBallots;
                                                                                                                        } else {
                                                                                                                            return [...prevBallots, ballot?.id];
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            }}
                                                                                                            className="iconhover allcentered"
                                                                                                            style={{ width: '35px', height: '35px' }}
                                                                                                        >
                                                                                                            {ballots.includes(ballot?.id) ? (
                                                                                                                <TbSquareCheck size={16} color={'var(--success)'} />
                                                                                                            ) : (
                                                                                                                <TbSquare size={16} color={''} />
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-lg-12 mb-3 mt-2 p-0">
                                                                                                    <div
                                                                                                        className="row m-0 w-100 scrollmenuclasssubscrollbar "
                                                                                                        style={{
                                                                                                            border: '1px solid #eee',
                                                                                                            borderRadius: innerBorderRadius,
                                                                                                            padding: innerPadding,
                                                                                                            fontSize: '12px',
                                                                                                            overflowX: 'scroll',
                                                                                                            flexWrap: 'nowrap',
                                                                                                            background: '#EBF0F4',
                                                                                                        }}
                                                                                                    >
                                                                                                        {ballot?.boxes?.map((box, boxindex) => {
                                                                                                            if (boxindex % 2 === 0) {
                                                                                                                return (
                                                                                                                    <div
                                                                                                                        key={boxindex}
                                                                                                                        className="d-flex flex-column col-lg-5 p-0"
                                                                                                                        style={{
                                                                                                                            marginRight: '10px',
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <div
                                                                                                                            className="box-container"
                                                                                                                            style={{
                                                                                                                                border: '1px solid #eee',
                                                                                                                                borderRadius: innerBorderRadius,
                                                                                                                                padding: innerPadding,
                                                                                                                                marginBottom: '10px',
                                                                                                                                background: 'white',
                                                                                                                                boxShadow: '#919eab4d 0 0 2px, #919eab1f 0 12px 24px -4px',
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            <div className="col-lg-12 p-0">
                                                                                                                                <div className="row m-0 w-100 justify-content-between align-items-center">
                                                                                                                                    <div className="row m-0 d-flex align-items-center">
                                                                                                                                        {box?.name}

                                                                                                                                        <TbEdit
                                                                                                                                            onClick={(e) => {
                                                                                                                                                e.stopPropagation();
                                                                                                                                                setmerchantModal({
                                                                                                                                                    open: true,
                                                                                                                                                    type: 'edit',
                                                                                                                                                    id: box?.id,
                                                                                                                                                    name: box?.name,
                                                                                                                                                    editType: 'box',
                                                                                                                                                });
                                                                                                                                            }}
                                                                                                                                            class="ml-1 text-secondaryhover"
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                    <div class="row m-0 d-flex align-items-center">
                                                                                                                                        {box?.merchant && (
                                                                                                                                            <span
                                                                                                                                                style={{ color: 'white' }}
                                                                                                                                                className={
                                                                                                                                                    ' wordbreak text-success bg-light-success rounded-pill font-weight-600 '
                                                                                                                                                }
                                                                                                                                            >
                                                                                                                                                {' '}
                                                                                                                                                {box?.merchant?.name}
                                                                                                                                            </span>
                                                                                                                                        )}
                                                                                                                                        <div
                                                                                                                                            onClick={() => {
                                                                                                                                                if (
                                                                                                                                                    !racks?.includes(box?.ballot?.rackId) &&
                                                                                                                                                    !ballots?.includes(box?.ballotId)
                                                                                                                                                ) {
                                                                                                                                                    setboxes((prevBoxes) => {
                                                                                                                                                        if (prevBoxes.includes(box?.id)) {
                                                                                                                                                            return prevBoxes.filter(
                                                                                                                                                                (id) => id !== box?.id,
                                                                                                                                                            );
                                                                                                                                                        } else {
                                                                                                                                                            return [...prevBoxes, box?.id];
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            }}
                                                                                                                                            className="iconhover allcentered"
                                                                                                                                            style={{ width: '35px', height: '35px' }}
                                                                                                                                        >
                                                                                                                                            {boxes.includes(box?.id) ? (
                                                                                                                                                <TbSquareCheck size={14} color={'var(--success)'} />
                                                                                                                                            ) : (
                                                                                                                                                <TbSquare size={14} color={''} />
                                                                                                                                            )}
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        {ballot?.boxes[boxindex + 1] && (
                                                                                                                            <div
                                                                                                                                className="box-container"
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #eee',
                                                                                                                                    borderRadius: innerBorderRadius,
                                                                                                                                    padding: innerPadding,
                                                                                                                                    background: 'white',
                                                                                                                                    boxShadow: '#919eab4d 0 0 2px, #919eab1f 0 12px 24px -4px',
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <div className="row m-0 w-100 justify-content-between align-items-center">
                                                                                                                                    <div className="row m-0 d-flex align-items-center">
                                                                                                                                        {ballot?.boxes[boxindex + 1]?.name}

                                                                                                                                        <TbEdit
                                                                                                                                            onClick={(e) => {
                                                                                                                                                e.stopPropagation();
                                                                                                                                                setmerchantModal({
                                                                                                                                                    open: true,
                                                                                                                                                    type: 'edit',
                                                                                                                                                    id: ballot?.boxes[boxindex + 1]?.id,
                                                                                                                                                    name: ballot?.boxes[boxindex + 1]?.name,
                                                                                                                                                    editType: 'box',
                                                                                                                                                });
                                                                                                                                            }}
                                                                                                                                            class="ml-1 text-secondaryhover"
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                    <div class="row m-0 d-flex align-items-center">
                                                                                                                                        {ballot?.boxes[boxindex + 1]?.merchant && (
                                                                                                                                            <span
                                                                                                                                                style={{ color: 'white' }}
                                                                                                                                                className={
                                                                                                                                                    ' wordbreak text-success bg-light-success rounded-pill font-weight-600 '
                                                                                                                                                }
                                                                                                                                            >
                                                                                                                                                {' '}
                                                                                                                                                {ballot?.boxes[boxindex + 1]?.merchant?.name}
                                                                                                                                            </span>
                                                                                                                                        )}
                                                                                                                                        <div
                                                                                                                                            onClick={() => {
                                                                                                                                                if (
                                                                                                                                                    !racks?.includes(
                                                                                                                                                        ballot?.boxes[boxindex + 1]?.ballot?.rackId,
                                                                                                                                                    ) &&
                                                                                                                                                    !ballots?.includes(
                                                                                                                                                        ballot?.boxes[boxindex + 1]?.ballotId,
                                                                                                                                                    )
                                                                                                                                                ) {
                                                                                                                                                    setboxes((prevBoxes) => {
                                                                                                                                                        if (
                                                                                                                                                            prevBoxes.includes(
                                                                                                                                                                ballot?.boxes[boxindex + 1]?.id,
                                                                                                                                                            )
                                                                                                                                                        ) {
                                                                                                                                                            return prevBoxes.filter(
                                                                                                                                                                (id) =>
                                                                                                                                                                    id !==
                                                                                                                                                                    ballot?.boxes[boxindex + 1]?.id,
                                                                                                                                                            );
                                                                                                                                                        } else {
                                                                                                                                                            return [
                                                                                                                                                                ...prevBoxes,
                                                                                                                                                                ballot?.boxes[boxindex + 1]?.id,
                                                                                                                                                            ];
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            }}
                                                                                                                                            className="iconhover allcentered"
                                                                                                                                            style={{ width: '35px', height: '35px' }}
                                                                                                                                        >
                                                                                                                                            {boxes.includes(ballot?.boxes[boxindex + 1]?.id) ? (
                                                                                                                                                <TbSquareCheck size={14} color={'var(--success)'} />
                                                                                                                                            ) : (
                                                                                                                                                <TbSquare size={14} color={''} />
                                                                                                                                            )}
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                );
                                                                                                            }
                                                                                                            return null;
                                                                                                        })}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </div>
                        </>
                    )}
                </div>

                <Modal
                    show={openModal}
                    onHide={() => {
                        setopenModal(false);
                    }}
                    centered
                    size={'md'}
                >
                    <Modal.Header>
                        <div className="row w-100 m-0 p-0">
                            <div class="col-lg-6 pt-3 ">
                                <div className="row w-100 m-0 p-0">Boxes</div>
                            </div>
                            <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                                <div
                                    class={'close-modal-container'}
                                    onClick={() => {
                                        setopenModal(false);
                                    }}
                                >
                                    <IoMdClose />
                                </div>
                            </div>{' '}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row m-0 w-100 pb-3">
                            {chosenBallotBoxes?.map((ballotBoxItem, ballotBoxIndex) => {
                                return <div class={'searchpill'}> {ballotBoxItem?.name}</div>;
                            })}
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={merchantModal?.open}
                    onHide={() => {
                        setmerchantModal({ open: false, type: '' });
                    }}
                    centered
                    size={'md'}
                >
                    <Modal.Header>
                        <div className="row w-100 m-0 p-0">
                            <div class="col-lg-6 pt-3 ">
                                <div className="row w-100 m-0 p-0">{merchantModal?.type == 'edit' ? 'Edit' : merchantModal?.type == 'addlevels' ? 'Add Levels' : 'Choose Merchant'}</div>
                            </div>
                            <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                                <div
                                    class={'close-modal-container'}
                                    onClick={() => {
                                        setmerchantModal({ open: false, type: '' });
                                    }}
                                >
                                    <IoMdClose />
                                </div>
                            </div>{' '}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        {merchantModal?.type == 1 && (
                            <div class="row m-0 w-100 py-2">
                                <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                                    <SelectComponent
                                        title={'Merchant'}
                                        filter={filterMerchants}
                                        setfilter={setfilterMerchants}
                                        options={fetchMerchantsQuery}
                                        attr={'paginateMerchants'}
                                        label={'name'}
                                        value={'id'}
                                        onClick={(option) => {
                                            // history.push('/addorder?merchantId=' + option?.id);
                                            setmerchantModal({ ...merchantModal, type: 2, merchantId: option.id });
                                        }}
                                        removeAll={true}
                                    />
                                </div>
                            </div>
                        )}
                        {merchantModal?.type == 2 && (
                            <div class="row m-0 w-100 py-2">
                                <div class="col-lg-12 text-center allcentered">Are you sure you want to {merchantModal?.modalType} selected to merchant</div>
                                <div class="col-lg-12 text-center allcentered my-3">
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                        disabled={buttonLoadingContext}
                                        onClick={async () => {
                                            if (buttonLoadingContext) return;
                                            setbuttonLoadingContext(true);
                                            try {
                                                if (merchantModal?.modalType == 'assign') {
                                                    const { data } = await assignMerchantToInventoryMutation();
                                                    if (data?.assignMerchantToInventory?.success == true) {
                                                        // history.push('/couriersheets');
                                                        await refetcOneInventory();
                                                        setracks([]);
                                                        setballots([]);
                                                        setboxes([]);
                                                        setmerchantModal({ open: false });
                                                        NotificationManager.success('', 'Success');
                                                    } else {
                                                        NotificationManager.warning(data?.assignMerchantToInventory?.message, 'Warning!');
                                                    }
                                                } else {
                                                    const { data } = await removeMerchantAssignmentFromInventoryMutation();
                                                    if (data?.removeMerchantAssignmentFromInventory?.success == true) {
                                                        // history.push('/couriersheets');
                                                        await refetcOneInventory();
                                                        setracks([]);
                                                        setballots([]);
                                                        setboxes([]);
                                                        setmerchantModal({ open: false });
                                                        NotificationManager.success('', 'Success');
                                                    } else {
                                                        NotificationManager.warning(data?.removeMerchantAssignmentFromInventory?.message, 'Warning!');
                                                    }
                                                }
                                            } catch (error) {
                                                // alert(JSON.stringify(error));
                                                let errorMessage = 'An unexpected error occurred';
                                                // // Check for GraphQL errors
                                                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                } else if (error.networkError) {
                                                    errorMessage = error.networkError.message || errorMessage;
                                                } else if (error.message) {
                                                    errorMessage = error.message;
                                                }
                                                NotificationManager.warning(errorMessage, 'Warning!');
                                            }
                                            setbuttonLoadingContext(false);
                                        }}
                                    >
                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                        {!buttonLoadingContext && <>{merchantModal?.modalType == 'assign' ? 'Assign' : 'Remove assigned'}</>}
                                    </button>
                                </div>
                            </div>
                        )}
                        {merchantModal?.type == 'edit' && (
                            <div class="row m-0 w-100 py-2">
                                <div class="col-lg-12 p-0">
                                    <Inputfield
                                        placeholder={'Name'}
                                        value={merchantModal?.name}
                                        onChange={(event) => {
                                            setmerchantModal({ ...merchantModal, name: event.target.value });
                                        }}
                                        // type={'date'}
                                    />
                                </div>
                                <div class="col-lg-12 text-center allcentered my-3">
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                        disabled={buttonLoadingContext}
                                        onClick={async () => {
                                            if (buttonLoadingContext) return;
                                            setbuttonLoadingContext(true);
                                            try {
                                                if (merchantModal?.editType == 'rack') {
                                                    const { data } = await updateRackNameMutation();
                                                    if (data?.updateRackName?.success == true) {
                                                        await refetcOneInventory();

                                                        setmerchantModal({ open: false });
                                                        NotificationManager.success('', 'Success');
                                                    } else {
                                                        NotificationManager.warning(data?.updateRackName?.message, 'Warning!');
                                                    }
                                                } else if (merchantModal?.editType == 'ballot') {
                                                    const { data } = await updateBallotNameMutation();
                                                    if (data?.updateBallotName?.success == true) {
                                                        await refetcOneInventory();

                                                        setmerchantModal({ open: false });
                                                        NotificationManager.success('', 'Success');
                                                    } else {
                                                        NotificationManager.warning(data?.updateBallotName?.message, 'Warning!');
                                                    }
                                                } else if (merchantModal?.editType == 'box') {
                                                    const { data } = await updateBoxNameMutation();
                                                    if (data?.updateBoxName?.success == true) {
                                                        await refetcOneInventory();

                                                        setmerchantModal({ open: false });
                                                        NotificationManager.success('', 'Success');
                                                    } else {
                                                        NotificationManager.warning(data?.updateBoxName?.message, 'Warning!');
                                                    }
                                                }
                                            } catch (error) {
                                                // alert(JSON.stringify(error));
                                                let errorMessage = 'An unexpected error occurred';
                                                // // Check for GraphQL errors
                                                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                } else if (error.networkError) {
                                                    errorMessage = error.networkError.message || errorMessage;
                                                } else if (error.message) {
                                                    errorMessage = error.message;
                                                }
                                                NotificationManager.warning(errorMessage, 'Warning!');
                                            }
                                            setbuttonLoadingContext(false);
                                        }}
                                    >
                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                        {!buttonLoadingContext && <>{'Edit Name'}</>}
                                    </button>
                                </div>
                            </div>
                        )}
                        {merchantModal?.type == 'addlevels' && (
                            <div class="row m-0 w-100 py-2">
                                <div class="col-lg-12 p-0">
                                    <Inputfield
                                        placeholder={'Number of levels to be added'}
                                        value={merchantModal?.levels}
                                        onChange={(event) => {
                                            setmerchantModal({ ...merchantModal, levels: event.target.value });
                                        }}
                                        type={'number'}
                                    />
                                </div>
                                <div class="col-lg-12 p-0" style={{ fontSize: '15px' }}>
                                    Total <span style={{ fontWeight: 600 }}>{parseInt(merchantModal?.initialLevels) + parseInt(merchantModal?.levels?.length != 0 ? merchantModal?.levels : 0)}</span>
                                </div>
                                <div class="col-lg-12 text-center allcentered my-3">
                                    <button
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  mb-1 mx-2'}
                                        disabled={buttonLoadingContext}
                                        onClick={async () => {
                                            if (buttonLoadingContext) return;
                                            setbuttonLoadingContext(true);
                                            try {
                                                const { data } = await addRackLevelsMutation();
                                                if (data?.addRackLevels?.success == true) {
                                                    await refetcOneInventory();
                                                    setmerchantModal({ open: false });
                                                    NotificationManager.success('', 'Success');
                                                } else {
                                                    NotificationManager.warning(data?.addRackLevels?.message, 'Warning!');
                                                }
                                            } catch (error) {
                                                // alert(JSON.stringify(error));
                                                let errorMessage = 'An unexpected error occurred';
                                                // // Check for GraphQL errors
                                                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                } else if (error.networkError) {
                                                    errorMessage = error.networkError.message || errorMessage;
                                                } else if (error.message) {
                                                    errorMessage = error.message;
                                                }
                                                NotificationManager.warning(errorMessage, 'Warning!');
                                            }
                                            setbuttonLoadingContext(false);
                                        }}
                                    >
                                        {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                        {!buttonLoadingContext && <>{'Add levels'}</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};
export default InventoryDetails;
