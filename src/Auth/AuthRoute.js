import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import logo from '../components/Website/Generalfiles/images/logo.png';
import API from '../API/API';

const AuthRoute = (props) => {
    const { useLazyQueryGQL, useMutationGQL, isValidEmailMutation, requestLoginResponse } = API();
    const { children } = props;

    const auth = getAuth();
    // const navigate = useNavigate();
    let history = useHistory();

    const [loading, setLoading] = useState(true);
    const [accessUser, setaccessUser] = useState({});
    const [checkEmail, { isvalidemailloading, error, data }] = useLazyQueryGQL(isValidEmailMutation());
    const [requestLogin, { loadingrequestLogin, errorrequestLogin, requestLoginData }] = useMutationGQL(requestLoginResponse());

    const handleRequestLoginResponse = async (tokenpayload) => {
        try {
            await requestLogin({
                variables: {
                    input: {
                        firebaseToken: tokenpayload?.token,
                        id: tokenpayload?.id,
                    },
                },
            });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setLoading(false);

            console.log('checking');
            if (user) {
                setaccessUser(user);
                try {
                    await checkEmail({
                        variables: {
                            email: user.email,
                        },
                    });
                } catch (error) {
                    console.error('Error adding user:', error);
                }
                // history.push('/users');
            } else {
                console.log('unauthorized: frebase');
                history.push('/login');
            }
        });
        return () => console.log('cleaning');
    }, [auth]);
    useEffect(() => {
        if (error) {
            alert(JSON.stringify(error));
        }
        if (data) {
            if (!data?.isValidEmail?.isValid) {
                history.push('/login');
            } else {
                var temp = {};
                temp.token = accessUser.accessToken;
                temp.id = data?.isValidEmail?.id;
                handleRequestLoginResponse(temp);
            }
        }
    }, [data, error, accessUser]);

    if (loading)
        return (
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
        );

    return <>{children}</>;
};

export default AuthRoute;
