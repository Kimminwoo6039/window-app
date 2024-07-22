import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PinExpiry from "../../pages/pin/PinExpiry";
import PinCheck from "../../pages/pin/PinCheck";


/**
 * 인증 관련 라우트를 관리하는 컴포넌트입니다. 로그인되지 않았지만 활성화된 사용자에게 표시됩니다.
 * @param expiry
 * @returns {JSX.Element}
 * @constructor
 */
const AuthRoutes = ({ expiry }) => {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={expiry ? <PinExpiry /> : <PinCheck />} />
                <Route path='/pin/check' element={<PinCheck />} />
                <Route path='/pin/expiry' element={<PinExpiry />} />
            </Routes>
        </div>
    );
};

export default AuthRoutes;
