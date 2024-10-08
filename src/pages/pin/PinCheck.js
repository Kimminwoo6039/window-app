import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import PinReset from "./PinReset";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";

/**
 * 핀 확인하는 페이지
 * 핀 체크후 Home 으로 이동하는 페이지
 * @returns {JSX.Element}
 * @constructor
 */
export default function PinCheck() {
    const [pin, setPin] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPin(e.target.value);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const active = localStorage.getItem("activation");
        const loginStatus = localStorage.getItem("loginStatus");
        const expiration = localStorage.getItem("expiry");
        console.log(active)
        console.log(loginStatus)
        console.log(expiration)
        // e.preventDefault();
        console.log("등록");
        localStorage.setItem("loginStatus", "true");
        navigate('/', {replace: true});
    };

    return (
        <div className="flex flex-col">
            <main className="flex flex-col m-auto justify-center items-center h-screen">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        <img src={require('../../images/logo.png')} alt={''}/>
                    </div>
                </div>
                <div className="m-2"></div>
                <div className="text-[30px] w-[500px] h-[35px] flex justify-center">
                    <span className="text-[#9D1F32] text-[30px]">PIN 번호</span>를 입력해 주세요.
                </div>
                <div className="m-2"></div>
                <div className="text-[13px] text-neutral-500 w-[280px]">
                    서비스 접속을 위해서는 PIN 입력이 필요합니다.
                </div>
                <div className="text-[13px] text-neutral-500 w-[280px] h-[30px]">
                    서비스 활성화 시 입력한 PIN 정보를 등록해주세요.
                </div>
                <div className="m-2"></div>
                <form onSubmit={onSubmit}>
                    <Input
                        type="text"
                        placeholder="PIN (4자리 이상 숫자)"
                        value={pin}
                        onChange={handleChange}
                        className="w-[280px] h-[34px] rounded-sm"
                    />
                    <div className="mt-4"></div>
                    <Button
                        type="submit"
                        className="w-[280px] h-[34px]"
                    >
                        <p className="text-[12px]">확인</p>
                    </Button>
                    <div className="m-6"></div>
                    <PinReset/>
                </form>
            </main>
        </div>
    );
}
