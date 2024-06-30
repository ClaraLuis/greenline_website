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

const { ValueContainer, Placeholder } = components;
var _ = require('lodash');
const InventoryDetails = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetcOneInventory } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [inventoryId, setinventoryId] = useState('');

    const [chosenBallotBoxes, setchosenBallotBoxes] = useState([]);
    const fetcOneInventoryQuery = useQueryGQL('', fetcOneInventory(parseInt(inventoryId)));
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/inventorydetails');
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

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Inventory Details
                    </p>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 p-2'}>
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
                            {fetcOneInventoryQuery?.data?.findOneInventory?.racks?.map((item, index) => {
                                const levels1 = _.groupBy(item?.ballots, 'level');
                                var levels = _.map(levels1, (ballots, level) => {
                                    return { level: level, ballots: ballots };
                                });

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
                                                    {levels?.map((level, levelindex) => {
                                                        return (
                                                            <div class="col-lg-12 p-0">
                                                                <div class="row m-0 w-100 d-flex align-items-center">
                                                                    Level {level?.level}:
                                                                    {level?.ballots?.map((ballot, ballotindex) => {
                                                                        return (
                                                                            <div
                                                                                class={'searchpill'}
                                                                                onClick={() => {
                                                                                    setchosenBallotBoxes(ballot.boxes);
                                                                                    setopenModal(true);
                                                                                }}
                                                                            >
                                                                                {' '}
                                                                                {ballot?.name}
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
            </div>
        </div>
    );
};
export default InventoryDetails;
