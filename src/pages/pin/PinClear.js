import React, { useState, FormEvent } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";



/**
 * pin 번호 초기화 하는 다이어로그
 * @returns {JSX.Element}
 * @constructor
 */
export default function PinClear() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleCurrentPinChange = (e) => setCurrentPin(e.target.value);
  const handleNewPinChange = (e) => setNewPin(e.target.value);
  const handleConfirmPinChange = (e) => setConfirmPin(e.target.value);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPin !== confirmPin) {
      console.error("새로운 PIN과 확인 PIN이 일치하지 않습니다.");
      return;
    }

    console.log("PIN 변경 처리");
    // PIN 변경 로직 추가
    const closeButton = document.getElementById('modalClose');
    if (closeButton) {
      closeButton.click();
    }
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-sm w-[80px] h-[34px] bg-[#FFFFFF] border hover:bg-neutral-300">
            <p className="text-[#515151] text-[12px]">PIN 변경</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px] h-[420px] bg-[#F1F1F1]">
          <form onSubmit={onSubmit}>
            <DialogHeader className="bg-[#25292E] h-[40px] flex p-3">
              <DialogTitle className="text-[14px] text-[#9D1F32] font-bold">PIN 번호 변경</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col ml-8 mt-3">
              <span className="text-[20px] mt-3">PIN 번호 변경</span>
            </div>
            <div className="grid w-full items-center p-2 mt-2">
              <Label htmlFor="currentPin" className="ml-6 mb-1 text-[13px] text-[#404040]">
                현재 PIN 번호를 입력해주세요.
              </Label>
              <Input
                  type="text"
                  id="currentPin"
                  placeholder="현재 PIN"
                  className="w-[340px] h-[34px] m-auto rounded-sm mb-2"
                  value={currentPin}
                  onChange={handleCurrentPinChange}
              />
            </div>
            <div className="grid w-full items-center p-6 gap-2">
              <Label htmlFor="newPin" className="ml-2 mb-1 text-[13px]">
                등록할 PIN 번호를 입력해주세요.
              </Label>
              <Input
                  type="text"
                  id="newPin"
                  placeholder="새로운 PIN (숫자 4자리 이상)"
                  className="w-[340px] h-[34px] m-auto rounded-sm"
                  value={newPin}
                  onChange={handleNewPinChange}
              />
              <Input
                  type="text"
                  id="confirmPin"
                  placeholder="새로운 PIN 확인"
                  className="w-[340px] h-[34px] m-auto rounded-sm"
                  value={confirmPin}
                  onChange={handleConfirmPinChange}
              />
            </div>
            <div className="flex flex-row justify-center">
              <DialogFooter>
                <Button
                    type="submit"
                    className="w-[339px] h-[34px]"
                >
                  <p className="text-[12px]">PIN 초기화</p>
                </Button>
                <DialogClose id="modalClose" />
              </DialogFooter>
            </div>
            <div className="m-2"></div>
          </form>
        </DialogContent>
      </Dialog>
  );
}
