import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import logo from '../components/Website/Generalfiles/images/logo.png';
import API from '../API/API';
import { NotificationManager } from 'react-notifications';
import { Loggedincontext } from '../Loggedincontext';
import { Contexthandlerscontext } from '../Contexthandlerscontext';
import Cookies from 'universal-cookie';

const AuthRoute = (props) => {
    const { useLazyQueryGQL, useMutationGQL, requestLoginResponse } = API();
    const { children } = props;
    const { loggedincontext, setloggedincontext } = useContext(Loggedincontext);
    const { setUserInfoContext, UserInfoContext } = useContext(Contexthandlerscontext);
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');

    const auth = getAuth();
    // const navigate = useNavigate();
    let history = useHistory();

    const [loading, setLoading] = useState(true);
    const [accessUser, setaccessUser] = useState({});
    const [requestLogin, { loadingrequestLogin, errorrequestLogin, requestLoginData }] = useMutationGQL(requestLoginResponse());
    //TODO
    // auth.currentUser.accessToken
    const handleRequestLoginResponse = async (tokenpayload) => {
        if (cookies.get('accessToken')) {
            setloggedincontext(true);
            return;
        }
        try {
            const firebaseToken = await auth.currentUser.getIdToken();
            const requestLoginData = await requestLogin({
                variables: {
                    input: {
                        firebaseToken,
                        // id: tokenpayload?.id,
                    },
                },
            });
            // alert('12');
            // alert(requestLoginData?.data?.requestToken)
            setUserInfoContext(requestLoginData?.data?.signIn);
            cookies.set('accessToken', requestLoginData?.data?.signIn?.accessToken);
            cookies.set('userInfo', requestLoginData?.data?.signIn?.user);
            setloggedincontext(true);
            if (window.location.pathname == '/login') {
                history.push('/users');
            }
        } catch (error) {
            signOut(getAuth());
            const cookies = new Cookies();
            cookies.set('accessToken', null);
            cookies.set('merchantId', null);
            // window.open('/login', '_self');
        }
    };

    useEffect(() => {
        // alert('1');
        // if (accessToken == 'null' || accessToken == undefined) {
        onAuthStateChanged(auth, async (user) => {
            setLoading(false);
            if (user) {
                try {
                    var temp = {};
                    temp.token = user.accessToken;
                    handleRequestLoginResponse(temp);
                } catch (error) {
                    console.error('Error adding user:', error);
                }
            } else {
                console.log('unauthorized: frebase');
                history.push('/login');
            }
        });
    }, [auth]);

    if (loading)
        return (
            <div style={{ height: '100vh' }} className="row w-100 allcentered m-0">
                <div className="col-lg-12 p-0">
                    <div className="row m-0 w-100">
                        <div className="col-lg-12 p-0 d-flex allcentered">
                            <img style={{ objectFit: 'contain', widht: '15vh', height: '15vh' }} src={logo} />
                        </div>
                        <div className="col-lg-12 p-0 d-flex allcentered mt-3">
                            <p className="font-weight-600">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );

    return <>{children}</>;
};

export default AuthRoute;
