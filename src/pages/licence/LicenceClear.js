import {
  Dialog,
  DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";
import React, {FormEvent} from "react";
import {useNavigate} from "react-router-dom";

export default function LicenceClear() {

  const navigate = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    const closeButton = document.getElementById('modalClose');
    if (closeButton) {
      closeButton.click();
    }
    localStorage.clear()
    navigate('/',{replace:false})
  }


  return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-sm w-[110px] h-[34px] bg-[#9E1313]"><p className="text-[12px] text-[#FFFFFF]">라이선스 해제</p></Button>
          </DialogTrigger>
          <DialogContent className="w-[400px] h-[250px] bg-[#F1F1F1]">
            <form onSubmit={onSubmit}>
              <DialogHeader className="bg-[#25292E] h-[40px] flex p-3">
                <DialogTitle className="text-[14px] text-[#9D1F32] font-bold">라이선스
                  해제</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col ml-8 mt-5 ">
                <span className="text-[20px] mt-3">라이선스 해제</span>
              </div>
              <div className="flex flex-col ml-8 mt-3">
                <div className="text-[13px] text-[#404040]">등록된 라이선스를 해제
                  하시겠습니까?
                </div>
                <div className="text-[13px] text-[#404040]">라이선스를 해제하시면 더 이상
                  서비스를 이용하실 수 없습니다.
                </div>
              </div>
              <div className="m-6"></div>
              <div className="flex flex-row justify-center">
                <DialogFooter>
                  <Button className="w-[168px] h-[34px] rounded-sm"
                          type="submit"><p
                      className="text-[12px] text-[#FFFFFF]">해제</p></Button>
                  <Button
                      className="w-[168px] h-[34px] rounded-sm bg-[#444444]">
                    <p
                        className="text-[12px] text-[#FFFFFF]">취소</p>
                    <DialogClose id="modalClose"/>
                  </Button>
                </DialogFooter>
              </div>
              {/*<p className="text-[10px] text-red-500 flex justify-center">※ 라이선스 키가 일치하지 않습니다.</p>*/}
              {/*<p className="text-[10px] text-red-500 flex justify-center">※ 새 PIN을 4자리 이상으로 설정해주세요.</p>*/}
              {/*<p className="text-[10px] text-red-500 flex justify-center">※ PIN이 일치하지 않습니다.</p>*/}
            </form>
          </DialogContent>
        </Dialog>
      </>
  )
}