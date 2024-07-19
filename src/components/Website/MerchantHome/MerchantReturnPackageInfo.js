import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Modal } from 'react-bootstrap';
import API from '../../../API/API.js';

import { IoMdClose } from 'react-icons/io';
import { MdOutlineInventory2 } from 'react-icons/md';
import Pagination from '../../Pagination.js';
import ReturnsTable from './ReturnsTable.js';

const MerchantReturnPackageInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, chosenOrderContext, dateformatter, setchosenOrderContext, orderTypeContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchPackages, fetchGovernorates, fetchMerchantItemReturns, updateMerchantDomesticShipping, fetchOrdersInInventory, fetchOrderHistory, createInventoryRent } = API();
    const steps = ['Merchant Info', 'Shipping', 'Inventory Settings'];
    const [inventoryModal, setinventoryModal] = useState({ open: false, items: [] });
    const [outOfStock, setoutOfStock] = useState(false);
    const [diffInDays, setdiffInDays] = useState(0);

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assignedToPackage: false,
        merchantId: undefined,
        packageId: parseInt(queryParameters.get('packageId')),
    });

    const fetchMerchantItemReturnsQuery = useQueryGQL('', fetchMerchantItemReturns(), filter);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div className="col-lg-12 p-0" style={{ minHeight: '100vh' }}>
                <div class={' row m-0 w-100 allcentered'}>
                    <div class="col-lg-12 p-0 mb-3">
                        <Pagination
                            beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                            afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
                            filter={filter}
                            setfilter={setfilter}
                        />
                    </div>

                    <ReturnsTable
                        clickable={true}
                        actiononclick={async (item) => {
                            await setchosenOrderContext(item);
                            history.push('/orderinfo?orderId=' + item.id);
                        }}
                        card="col-lg-6 px-1"
                        items={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.data}
                    />
                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                            afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
                            filter={filter}
                            setfilter={setfilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MerchantReturnPackageInfo;
