import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from "../sidebar/SideBar";
import Home from "../../pages/home/Home";
import Detection from "../../pages/detection/Detection";
import Information from "../../pages/infomation/Information";
import Setting from "../../pages/setting/Setting";
import PinCheck from "../../pages/pin/PinCheck";

/**
 * 사이드바와 공통 레이아웃을 포함하는 컴포넌트입니다. 로그인된 사용자에게만 표시됩니다.
 * @param status
 * @param setStatus
 * @returns {JSX.Element}
 * @constructor
 */

const AppLayout = ({ status, setStatus }) => {
    return (
        <div className="App">
            <div className="grid h-screen w-full pl-[126px]">
                <SideBar props={status} setProps={setStatus} />
                <div className="flex flex-col m-4">
                    <Routes>
                        <Route path='/' element={<Home  status={status} />} />
                        <Route path='/detection' element={<Detection />} />
                        <Route path='/information' element={<Information />} />
                        <Route path='/setting' element={<Setting />} />
                        <Route path='/pin/check' element={<PinCheck />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
