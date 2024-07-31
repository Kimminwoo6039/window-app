import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

/**
 * preload IpcRender 연결 handler
 * /public/preload.js 연결된 상태값들.
 *
 * @returns {null}
 * @constructor
 */
const NavigationHandler = () => {
    const navigate = useNavigate();
    const [fcmToken, setFcmToken] = useState("");

    useEffect(() => {
        const active = localStorage.getItem("activation");

        window.electron?.getFCMToken('getFCMToken', (_, token) => {
            console.log(token);
            setFcmToken(token);
        });

        if (window.electron && window.electron.onLocalStorage) {
            window.electron.onRemoveStr();
            console.log('Setting up navigation handler in React');
            window.electron.onLocalStorage((event, path) => {
                console.log('Navigating to:', path);
                localStorage.removeItem(path);
                navigate('/');
            });
        } else {
            console.log('window.electron or window.electron.onNavigate is not defined in React');
        }

        if (window.electron && window.electron.onNavigate) {
            console.log('Setting up navigation handler in React');
            window.electron.onNavigate((event, path) => {
                console.log('Navigating to:', path);
                if (active) {
                    navigate(path);
                } else {
                    navigate('/');
                }
            });
        } else {
            console.log('window.electron or window.electron.onNavigate is not defined in React');
        }
    }, [navigate]);

    return null;
};

export default NavigationHandler;
