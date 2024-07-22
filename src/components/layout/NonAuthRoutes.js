import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LicenceRegister from "../../pages/licence/LicenceRegister";
import PinRegister from "../../pages/pin/PinRegister";
import PinCheck from "../../pages/pin/PinCheck";
import PinExpiry from "../../pages/pin/PinExpiry";

/**
 * 인증되지 않은 사용자를 위한 라우트를 관리하는 컴포넌트입니다.
 * @returns {JSX.Element}
 * @constructor
 */
const NonAuthRoutes = () => {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<LicenceRegister />} />
                <Route path='/pin/register' element={<PinRegister />} />
                <Route path='/pin/check' element={<PinCheck />} />
                <Route path='/pin/expiry' element={<PinExpiry />} />
            </Routes>
        </div>
    );
};

export default NonAuthRoutes;
