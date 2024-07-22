import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import FormButton from "../../components/common/FormButton";
import FormInput from "../../components/common/FormInput";
import { Label } from "../../components/ui/label";

export default function PinReset() {
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior
    console.log("등록");
    navigate('/pin/check', { replace: true });
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          <p className="text-[13px] text-[#8B8B8B] mt-4 underline cursor-pointer">PIN 초기화</p>
        </DialogTrigger>
        <DialogContent className="w-[400px] h-[420px] bg-[#F1F1F1]">
          <form onSubmit={onSubmit}>
            <DialogHeader className="bg-[#25292E] h-[40px] flex p-3">
              <DialogTitle className="text-[14px] text-[#9D1F32]">PIN 번호 초기화</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col ml-8 mt-4">
              <span className="text-[20px]">PIN 번호 초기화</span>
            </div>
            <div className="grid w-full items-center p-2 mt-2">
              <Label htmlFor="licenseKey" className="ml-6 mb-1 text-[13px]">라이선스 키를 입력해주세요.</Label>
              <FormInput
                  type="text"
                  id="licenseKey"
                  placeholder="라이선스 키"
                  className="w-[340px] h-[34px] m-auto rounded-sm mb-2"
              />
              <span className="text-[9px] text-neutral-500 ml-6">라이선스 키는 회원님 email로 발송된 라이선스 발급 내의 인증키를 의미하며</span>
              <span className="text-[9px] text-neutral-500 ml-6">초기 서비스 활성화 시 입력하신 것과 동일한 키입니다. 예) AKJDF-21-ZSDF1L21</span>
            </div>
            <div className="grid w-full items-center p-6 gap-2">
              <Label htmlFor="newPin" className="ml-2 mb-1 text-[13px]">변경할 PIN 번호를 입력해주세요.</Label>
              <FormInput
                  type="text"
                  id="newPin"
                  placeholder="새로운 PIN (숫자 4자리 이상)"
                  className="w-[340px] h-[34px] m-auto rounded-sm"
              />
              <FormInput
                  type="text"
                  id="confirmPin"
                  placeholder="새로운 PIN 확인"
                  className="w-[340px] h-[34px] m-auto rounded-sm"
              />
            </div>
            <DialogFooter className="flex flex-row justify-center">
              <FormButton className="w-[339px] h-[34px] m-auto"  type="submit">
                <p className="text-[12px]">PIN 초기화</p>
              </FormButton>
              <DialogClose />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
