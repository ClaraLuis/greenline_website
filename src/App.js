import React, { Suspense, useContext, useEffect, useState } from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, useHistory, Route, Redirect } from 'react-router-dom';
import { Contexthandlerscontext_provider } from './Contexthandlerscontext';
import { Contexthandlerscontext } from './Contexthandlerscontext.js';
import { Loggedincontext } from './Loggedincontext.js';
import { Routedispatcherprovider } from './Routedispatcher';
import './components/Website/Generalfiles/CSS_GENERAL/bootstrap.css';
import './components/Website/Generalfiles/CSS_GENERAL/dropdown.css';
import './trans.css';
import 'rsuite/dist/rsuite.min.css';

import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
// import pepsicologoresp from './components/Website/Generalfiles/images/pepsicologoresp.png';
import axios from 'axios';
import Cookies from 'universal-cookie';
import logo from './components/Website/Generalfiles/images/logo.png';
import { firebaseConfig } from './Auth/firebaseconfig.js';
import { initializeApp } from 'firebase/app';
import AuthRoute from './Auth/AuthRoute.js';
import { getAuth, signOut } from 'firebase/auth';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from, ApolloProvider, gql, Observable } from '@apollo/client';
import { onError } from '@apollo/link-error';
import { setContext } from '@apollo/client/link/context';
import { serverbaselinkGQL } from './Env_Variables.js';

initializeApp(firebaseConfig);
const cookies = new Cookies();

const Websiterouter = React.lazy(() => import('./components/Website/Websiterouter'));
const Login = React.lazy(() => import('./components/Website/Login/Login'));
const PrivacyPolicy = React.lazy(() => import('./components/Website/PrivacyPolicy/PrivacyPolicy.js'));
const OrderInfo = React.lazy(() => import('./components/Website/Orders/TrackActivity.js'));
let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = (newToken) => {
    pendingRequests.map((callback) => callback(newToken));
    pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (err.message === 'jwt malformed') {
                signOut(getAuth());
                cookies.remove('accessToken');
                cookies.remove('userInfo');
                cookies.remove('merchantId');
                window.location.reload();
                // NotificationManager.warning('','')
            }
            if (err.message === 'expired jwt token.') {
                if (!isRefreshing) {
                    isRefreshing = true;

                    cookies.remove('accessToken');
                    cookies.remove('userInfo');
                    cookies.remove('merchantId');

                    refreshAuthToken()
                        .then((newToken) => {
                            isRefreshing = false;
                            resolvePendingRequests(newToken);
                        })
                        .catch((error) => {
                            console.error('Token refresh failed:', error);
                            isRefreshing = false;
                            pendingRequests = [];
                        });
                }

                return new Observable((observer) => {
                    pendingRequests.push((newToken) => {
                        operation.setContext(({ headers = {} }) => ({
                            headers: {
                                ...headers,
                                authorization: `Bearer ${newToken}`,
                            },
                        }));
                        observer.next();
                        observer.complete();
                    });
                }).flatMap(() => forward(operation));
            } else {
                console.log(`[GraphQL error]: ${err.message}`);
            }
        }
    }

    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

console.log('DEV :::', process.env.REACT_APP_DEV_MODE);
console.log('REACT_APP_API_GQL :::', process.env.REACT_APP_API_GQL);
console.log('REACT_APP_API_GQL_LOCAL :::', process.env.REACT_APP_API_GQL_LOCAL);

const httpLink = new HttpLink({
    uri: process.env.REACT_APP_DEV_MODE === 'true' ? process.env.REACT_APP_API_GQL_LOCAL : process.env.REACT_APP_API_GQL,
    // uri: 'https://greenlineco.site/graphql',
});

const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});

async function getAccessToken() {
    const token = cookies.get('accessToken');
    return token ? `${token}` : '';
}

async function refreshAuthToken() {
    try {
        const firebaseToken = await getAuth()?.currentUser?.getIdToken(true); // force refresh token from Firebase
        if (!firebaseToken) throw new Error('No Firebase token available');

        try {
            const { data, errors } = await client.mutate({
                mutation: gql`
                    mutation signIn($input: TokenRequestInput!) {
                        signIn(input: $input) {
                            user {
                                id
                                email
                                phone
                                hubId
                                merchantId
                                inventoryId
                                name
                                type

                                createdAt
                                lastModified
                                deletedAt
                                permissions {
                                    permissionId
                                }
                                merchant {
                                    name
                                }
                                inventory {
                                    name
                                }
                                hub {
                                    name
                                }
                            }
                            accessToken
                        }
                    }
                `,
                variables: {
                    input: {
                        firebaseToken,
                    },
                },
            });
            cookies.remove('accessToken');
            cookies.remove('userInfo');
            cookies.remove('merchantId');
            const newAccessToken = data?.signIn?.accessToken;
            const userInfo = data?.signIn?.user;

            // setUserInfoContext(data?.signIn?.user);

            cookies.set('accessToken', newAccessToken);
            cookies.set('userInfo', JSON.stringify(userInfo));
            if (userInfo?.merchantId?.length != 0 && userInfo?.merchantId != undefined && userInfo?.merchantId != null) {
                cookies.set('merchantId', userInfo?.merchantId);
            }
            if (!newAccessToken) throw new Error('Failed to refresh access token');

            return newAccessToken;
        } catch (e) {
            alert(JSON.stringify(e));
        }
    } catch (error) {
        signOut(getAuth());
        cookies.remove('accessToken');
        cookies.remove('userInfo');
        cookies.remove('merchantId');

        window.location.reload();
        console.error('Token refresh failed:', error);
        throw error;
    }
}

const App = (props) => {
    let history = useHistory();
    const [nointernetconnection, setnointernetconnection] = useState(false);

    const { loggedincontext, loggedincontextLoading, setReady, ready } = useContext(Loggedincontext);
    window.addEventListener('offline', function (e) {
        setnointernetconnection(true);
    });

    window.addEventListener('online', function (e) {
        setnointernetconnection(false);
    });
    useEffect(() => {
        document.title = 'Greenline';
        // alert();
    }, []);

    // if (!ready) {
    //     return (
    //         <div style={{ height: '100vh' }} className="row w-100 allcentered m-0">
    //             <div className="col-lg-12 p-0">
    //                 <div className="row m-0 w-100">
    //                     <div className="col-lg-12 p-0 d-flex allcentered">
    //                         <img style={{ objectFit: 'contain', width: '15vh', height: '15vh' }} src={logo} />
    //                     </div>
    //                     <div className="col-lg-12 p-0 d-flex allcentered mt-3">
    //                         <p className="font-weight-600">Loading...</p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    return (
        <ApolloProvider client={client}>
            <Contexthandlerscontext_provider>
                <Contexthandlerscontext.Consumer>
                    {(value) => {
                        return (
                            <>
                                {/* {value.fetchuseauthorizationQueryContext.isFetching && ( */}

                                {/* )}
                            {/* {!value.fetchuseauthorizationQueryContext.isFetching && value.fetchuseauthorizationQueryContext.isSuccess && ( */}
                                <Router>
                                    <Routedispatcherprovider>
                                        <div style={{ width: '100%' }}>
                                            <Suspense
                                                fallback={
                                                    <div style={{ height: '100vh' }} class="row w-100 allcentered m-0">
                                                        <div class="col-lg-12 p-0">
                                                            <div class="row m-0 w-100">
                                                                <div class="col-lg-12 p-0 d-flex allcentered">
                                                                    <img style={{ objectFit: 'contain', widht: '15vh', height: '15vh' }} src={logo} />
                                                                </div>
                                                                <div class="col-lg-12 p-0 d-flex allcentered mt-3">
                                                                    <p class="font-weight-600">Loading...</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <Route
                                                    exact
                                                    path="/"
                                                    // render={(props) => {
                                                    //     return <Redirect to={'/users'} />;
                                                    // }}
                                                />
                                                {nointernetconnection && (
                                                    <div
                                                        class="w-100 text-center h-100 d-flex mx-auto justify-content-center"
                                                        style={{
                                                            backgroundColor: 'white',
                                                            position: 'fixed',
                                                            height: '100%',
                                                            zIndex: 99999999999,
                                                            color: 'red',
                                                            opacity: 0.5,
                                                            alignContent: 'center',
                                                            justifyContent: 'center',
                                                            verticalAlign: 'center',
                                                            fontSize: '25px',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        <div class="text-center  mt-auto mb-auto m-auto align-items-center d-flex">
                                                            Trying To Connect To The Internet...
                                                            <CircularProgress color="red" width="30px" height="30px" />
                                                        </div>
                                                    </div>
                                                )}
                                                {!loggedincontext && window.location.pathname != '/privacypolicy' && window.location.pathname != '/trackorderactivity' && !loggedincontextLoading && (
                                                    <Login />
                                                )}
                                                <Route exact path="/privacypolicy" component={PrivacyPolicy} />
                                                <Route exact path="/trackorderactivity" component={OrderInfo} />

                                                <AuthRoute>
                                                    {loggedincontext && window.location.pathname != '/privacypolicy' && window.location.pathname != '/trackorderactivity' && (
                                                        <Route exact path="*" component={Websiterouter} />
                                                    )}
                                                </AuthRoute>
                                                {/* <Route exact path="/login" component={Login} /> */}
                                            </Suspense>
                                        </div>
                                    </Routedispatcherprovider>
                                </Router>
                                {/* )} */}
                                <NotificationContainer />
                                <ReactQueryDevtools initialIsOpen />
                            </>
                        );
                    }}
                </Contexthandlerscontext.Consumer>
            </Contexthandlerscontext_provider>
        </ApolloProvider>
    );
};

export default App;
