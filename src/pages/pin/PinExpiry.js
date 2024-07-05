import {Button} from "../../components/ui/button";
import {Input} from "../../components/ui/input";
import PinReset from "./PinReset";
import React, {FormEvent} from "react";
import {useNavigate} from "react-router-dom";

export default function PinExpiry() {
  let navigator = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    localStorage.removeItem("expiry")
    localStorage.removeItem('loginStatus')
    navigator('/pin/check',{replace:true})
  }

  return (
      <>
        <div className="flex flex-col ">
          <main
              className="flex flex-col m-auto justify-center items-center h-screen ">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <img src={require('../../images/logo.png')} alt={''}
                />
              </div>
            </div>
            <div className="m-4"></div>
            <div className="flex flex-col justify-center items-center">
              <div
                  className="text-[30px] w-[500px] h-[35px] flex justify-center">
                <span className="text-[#9D1F32] text-[30px]">라이선스</span>가 만료되었습니다.
              </div>
              <div className="m-2"></div>
              <div className="text-[13px] text-neutral-500 w-[271px] ">등록된 라이선스가 만료되어 접속할 수 없습니다.
              </div>
              <div
                  className="text-[13px] text-neutral-500 w-[280px] h-[30px]">라이선스를 발급 받아 등록하시기 바랍니다.
              </div>
            </div>
            <div className="m-6"></div>
            <form onSubmit={onSubmit}>
              <div>
                <Input type="text" placeholder="라이선스 키"
                       className="w-[280px] h-[34px] rounded-sm"/>
                <div className="mt-4"></div>
              </div>
              <div className="m-2"></div>
              <div>
                <Button className="w-[280px] h-[34px] rounded-sm"><p
                    className="text-[12px] ">등록</p></Button>
              </div>
              <div className="m-1"></div>
              <div className="m-6"></div>
            </form>
          </main>
        </div>
      </>
  )
}