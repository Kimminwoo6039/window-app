import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import {Button} from "../../components/ui/button";
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import React, {FormEvent} from "react";

export default function PinClear() {

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    const closeButton = document.getElementById('modalClose');
    if (closeButton) {
      closeButton.click();
    }
  }

  return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-sm w-[80px] h-[34px] bg-[#FFFFFF] border hover:bg-neutral-300 "><p className="text-[#515151] text-[12px]">PIN 변경</p></Button>
          </DialogTrigger>
          <DialogContent className="w-[400px] h-[420px] bg-[#F1F1F1]">
            <form onSubmit={onSubmit}>
              <DialogHeader className="bg-[#25292E] h-[40px] flex p-3">
                <DialogTitle className="text-[14px] text-[#9D1F32] font-bold">PIN
                  번호
                  변경</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col ml-8 mt-3">
                <span className="text-[20px] mt-3">PIN 번호 변경</span>
              </div>
              <div className="grid w-full items-center p-2 mt-2">
                <Label htmlFor="key"
                       className="ml-6 mb-1 text-[13px] text-[#404040]">현재 PIN
                  번호를 입력해주세요.</Label>
                <Input type="text" id="key"
                       className="w-[340px] h-[34px] m-auto rounded-sm mb-2"
                       placeholder="현재 PIN"/>
              </div>
              <div className="grid w-full items-center p-6 gap-2">
                <Label htmlFor="key" className="ml-2 mb-1 text-[13px]">등록할 PIN
                  번호를 입력해주세요.</Label>
                <Input type="text" id="key"
                       className="w-[340px] h-[34px] m-auto rounded-sm"
                       placeholder="새로운 PIN (숫자 4자리 이상)"/>
                <Input type="text" id="key"
                       className="w-[340px] h-[34px] m-auto rounded-sm"
                       placeholder="새로운 PIN 확인"/>
              </div>
              <div className="flex flex-row justify-center">
                <DialogFooter>
                  <Button className="w-[339px] h-[34px]" type="submit"><p
                      className="text-[12px]">PIN 초기화</p></Button>
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