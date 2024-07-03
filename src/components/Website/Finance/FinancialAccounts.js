import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import API from '../../../API/API.js';
import AccountsTable from './AccountsTable.js';
import TransactionsTable from './TransactionsTable.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';

const { ValueContainer, Placeholder } = components;

const FinancialAccounts = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, financialAccountTypesContext } = useContext(Contexthandlerscontext);
    const { fetchFinancialAccounts, useQueryGQL, fetchUsers, fetchMerchants, useMutationGQL, createFinancialAccount, updateFinancialAccount } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [submit, setsubmit] = useState(false);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const [payload, setpayload] = useState({
        functype: 'add',
        name: '',
        type: '',
        merchantId: undefined,
        balance: 0,
        userId: undefined,
    });
    const [filterobj, setfilterobj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterobj);
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/financialaccounts');
        setfilterobj({
            isAsc: true,
            limit: 20,
            afterCursor: undefined,
            beforeCursor: undefined,
        });
    }, []);
    const [filterUsers, setfilterUsers] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchusers = useQueryGQL('', fetchUsers(), filterUsers);
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);
    const { refetch: refetchFinancialAccountsQuery } = useQueryGQL('', fetchFinancialAccounts(), filterobj);

    const [createFinancialAccountMutation] = useMutationGQL(createFinancialAccount(), {
        name: payload?.name,
        type: payload?.type,
        userId: payload?.userId,
        merchantId: payload?.merchantId,
        balance: payload?.balance,
    });
    const [updateFinancialAccountMutation] = useMutationGQL(updateFinancialAccount(), {
        name: payload?.name,
        id: payload?.id,
    });

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Financial Accounts
                    </p>
                </div>
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-end pb-2 '}>
                    {isAuth([1, 51, 20]) && (
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1 mx-1'}
                            onClick={() => {
                                setopenModal(true);
                            }}
                        >
                            Add Account
                        </button>
                    )}
                </div>
                {isAuth([1, 51, 19]) && (
                    <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchFinancialAccountsQuery?.data?.paginateFinancialAccounts?.cursor?.beforeCursor}
                                afterCursor={fetchFinancialAccountsQuery?.data?.paginateFinancialAccounts?.cursor?.afterCursor}
                                filter={filterobj}
                                setfilter={setfilterobj}
                            />
                        </div>
                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                            <AccountsTable
                                clickable={true}
                                fetchFinancialAccountsQuery={fetchFinancialAccountsQuery}
                                editFunc={(item) => {
                                    setpayload({
                                        functype: 'edit',
                                        name: item?.name,
                                        type: item?.type,
                                        merchantId: item?.merchantId,
                                        balance: item?.balance,
                                        userId: item?.userId,
                                        id: item?.id,
                                    });
                                    setopenModal(true);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div> */}
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
                            <div className="row w-100 m-0 p-0 text-capitalize">{'Account'}</div>
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
                    <div class="row m-0 w-100 py-2">
                        <Form
                            size={'md'}
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={
                                payload?.functype == 'add'
                                    ? [
                                          {
                                              name: 'Name',
                                              attr: 'name',

                                              size: '12',
                                          },
                                          {
                                              name: 'Type',
                                              attr: 'type',
                                              type: 'select',
                                              options: financialAccountTypesContext,
                                              size: '12',
                                          },

                                          {
                                              title: 'User',
                                              filter: filterUsers,
                                              setfilter: setfilterUsers,
                                              options: fetchusers,
                                              optionsAttr: 'paginateUsers',
                                              label: 'name',
                                              value: 'id',
                                              size: '12',
                                              attr: 'userId',
                                              type: 'fetchSelect',
                                          },

                                          {
                                              title: 'Merchant',
                                              filter: filterMerchants,
                                              setfilter: setfilterMerchants,
                                              options: fetchMerchantsQuery,
                                              optionsAttr: 'paginateMerchants',
                                              label: 'name',
                                              value: 'id',
                                              size: '12',
                                              attr: 'merchantId',
                                              type: 'fetchSelect',
                                          },
                                          { name: 'Balance', attr: 'balance', type: 'number', size: '12' },
                                      ]
                                    : [
                                          {
                                              name: 'Name',
                                              attr: 'name',

                                              size: '12',
                                          },
                                      ]
                            }
                            payload={payload}
                            setpayload={setpayload}
                            button1disabled={buttonLoading}
                            button1class={generalstyles.roundbutton + '  mr-2 '}
                            button1placeholder={payload?.functype == 'add' ? 'Create Account' : 'Update Account'}
                            button1onClick={async () => {
                                setbuttonLoading(true);
                                try {
                                    if (payload?.functype == 'add') {
                                        if (payload?.name?.length != 0 && payload?.type?.length != 0) {
                                            const { data } = await createFinancialAccountMutation();
                                            setopenModal(false);
                                            refetchFinancialAccountsQuery();
                                        } else {
                                            NotificationManager.warning('Complete Missing Fields', 'Warning!');
                                        }
                                    } else {
                                        const { data } = await updateFinancialAccountMutation();
                                        setopenModal(false);
                                        refetchFinancialAccountsQuery();
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
                                    // // Log the entire error object for debugging purposes
                                    // console.error('GraphQL Error:', JSON.stringify(error, null, 2));
                                    // // Show the user-friendly error message
                                    // alert();
                                    NotificationManager.warning(errorMessage, 'Warning!');
                                }
                                setbuttonLoading(false);
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default FinancialAccounts;
