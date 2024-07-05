import {
  Dialog,
  DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import {Button} from "../../components/ui/button";
import React, {FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";

export default function PinReset() {

  const navigate = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    const closeButton = document.getElementById('modalClose');
    if (closeButton) {
      closeButton.click();
    }
    navigate('/pin/check')
  }

  return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-[13px] text-[#8B8B8B] mt-4 underline cursor-pointer" >PIN 초기화</p>
          </DialogTrigger>
          <DialogContent className="w-[400px] h-[420px] bg-[#F1F1F1]">
            <form onSubmit={onSubmit}>
              <DialogHeader className="bg-[#25292E] h-[40px] flex p-3">
                <DialogTitle className="text-[14px] text-[#9D1F32]">PIN 번호 초기화</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col ml-8">
                <span className="text-[20px] mt-4">PIN 번호 초기화</span>
              </div>
              <div className="grid w-full items-center p-2">
                <Label htmlFor="key" className="ml-6 mb-1 text-[13px]">라이선스 키를 입력해주세요.</Label>
                <Input type="text" id="key" className="w-[340px] h-[34px] m-auto rounded-sm mb-2" placeholder="라이선스 키"/>
                <span className="text-[9px] text-neutral-500 ml-6">라이선스 키는 회원님 email 로 발송된 라이선스 발급 내의 인증키를 의미하며</span>
                <span className="text-[9px] text-neutral-500 ml-6">초기 서비스 활성화 시 입력하신 것과 동일한 키 입니다. 예) AKJDF-21-ZSDF1L21</span>
              </div>
              <div className="grid w-full items-center p-6 gap-2">
                <Label htmlFor="key" className="ml-2 mb-1 text-[13px]">변경할 PIN 번호를 입력해주세요.</Label>
                <Input type="text" id="key" className="w-[340px] h-[34px] m-auto rounded-sm"  placeholder="새로운 PIN (숫자 4자리 이상)"/>
                <Input type="text" id="key" className="w-[340px] h-[34px] m-auto rounded-sm" placeholder="새로운 PIN 확인"/>
              </div>
              <div className="flex flex-row justify-center">
                <DialogFooter>
                  <Button className="w-[339px] h-[34px]" type="submit"><p className="text-[12px]">PIN 초기화</p></Button>
                  <DialogClose id="modalClose"/>
                </DialogFooter>
              </div>
              <div className="m-2"></div>
              {/*<p className="text-[10px] text-red-500 flex justify-center">※ 라이선스 키가 일치하지 않습니다.</p>*/}
              {/*<p className="text-[10px] text-red-500 flex justify-center">※ 새 PIN을 4자리 이상으로 설정해주세요.</p>*/}
              {/*<p className="text-[10px] text-red-500 flex justify-center">※ PIN이 일치하지 않습니다.</p>*/}
            </form>
          </DialogContent>
        </Dialog>
      </>
  )
}