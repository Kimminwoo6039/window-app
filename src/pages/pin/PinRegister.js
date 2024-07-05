import {Button} from "../../components/ui/button";
import React, {FormEvent} from "react";
import {Input} from "../../components/ui/input";
import {useNavigate} from "react-router-dom";

export default function PinRegister() {
  let navigator = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    localStorage.setItem("activation",true)
    navigator('/pin/check',{replace:false})
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
                <span className="text-[#9D1F32] text-[30px]">PIN 번호</span>를 등록해 해주세요.
              </div>
              <div className="m-2"></div>
              <div className="text-[13px] text-neutral-500 w-[271px] ">암호 대신 사용할 PIN 번호를 등록해주세요.
              </div>
              <div
                  className="text-[13px] text-neutral-500 w-[271px] h-[30px]">PIN 번호는 향후 서비스 관리 시 사용됩니다.
              </div>
            </div>
            <div className="m-2"></div>
            <form onSubmit={onSubmit}>
              <div>
                <Input type="text" placeholder="PIN (4자리 이상 숫자)"
                       className="w-[280px] h-[34px] rounded-sm"/>
                <div className="m-2"></div>
                <Input type="text" placeholder="PIN 확인"
                       className="w-[280px] h-[34px] rounded-sm"/>
                <div className="mt-4"></div>
              </div>
              <div className="m-2"></div>
              <div>
                <Button className="w-[280px] h-[34px]"><p
                    className="text-[12px] ">PIN 설정</p></Button>
              </div>
              <div className="m-1"></div>
              <div className="m-2"></div>
              <div className="mb-8"></div>
            </form>
          </main>
        </div>
      </>
  )
}