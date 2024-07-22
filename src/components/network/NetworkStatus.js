import React, {createContext, useState, useEffect, useContext} from 'react';

const NetworkStatusContext = createContext();


/**
 * 현재 접속한 컴퓨터의 인터넷 연결 여부 확인 컴포넌트
 * true = 인터넷 연결상태 , false = 인터넷 연결안된상태
 * @returns {unknown}
 */

export const useNetworkStatus = () => {
    return useContext(NetworkStatusContext);
};

export const NetworkStatusProvider = ({children}) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <NetworkStatusContext.Provider value={{isOnline}}>
            {children}
        </NetworkStatusContext.Provider>
    );
};
