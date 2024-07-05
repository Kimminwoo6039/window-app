import {
  Dialog, DialogClose,
  DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import {Button} from "../../components/ui/button";
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import React from "react";
import {FormEvent} from "react";
import {useNavigate} from "react-router-dom";

export default function LicenceInsert_old() {

  const navigate = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("등록")
    navigate('/pin/register',{replace:false})
  }

  return (
      <>
        <Dialog>
            <DialogTrigger asChild>
              <Button className="w-[280px] h-[34px] rounded-sm"><p className="text-[12px] text-sm ">등록</p></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
              <form onSubmit={onSubmit}>
                <DialogHeader className="bg-neutral-200 h-[40px] flex p-3">
                  <DialogTitle className="text-sm text-neutral-800">학생 정보
                    확인</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center ml-4">
                  <span className="text-lg mb-2">학생 정보 확인</span>
                  <span className="text-sm text-neutral-500">등록할 라이선스의 학생 정보를 확인해주세요.</span>
                  <span className="text-sm text-neutral-500">보호대상의 정보와 일치하는 경우에만 [등록] 버튼을 클릭해주세요.</span>
                </div>
                <div className="m-4"></div>
                <div
                    className="flex  xl:m-0 md:m-auto sm:m-auto  flex-col rounded-md border p-6 xl:w-full md:w-[300px] bg-neutral-200 gap-4">
                  <div className="grid grid-cols-2">
                    <div
                        className="text-lg text-neutral-500 flex justify-center">학년
                      :
                    </div>
                    <div className="flex justify-start text-lg">5 학년</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div
                        className="text-lg text-neutral-500 flex justify-center">반
                      :
                    </div>
                    <div className="flex justify-start text-lg">3 반</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div
                        className="text-lg text-neutral-500 flex justify-center">이름
                      :
                    </div>
                    <div className="flex justify-start text-lg">김 두 *</div>
                  </div>
                </div>
                <div className="m-6"></div>
                <div className="flex flex-row justify-center">
                  <DialogFooter>
                    <Button className="w-[100px]" type="submit">등록</Button>
                    <DialogClose asChild>
                      <Button className="w-[100px]" type="button"
                              variant="secondary">
                        취소
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
                <div className="m-2"></div>
                <p className="text-[10px] flex justify-center mb-6 text-neutral-500">※
                  보호대상의 정보와 일치하지 않는 경우 담임 선생님께 문의해주세요.</p>
              </form>
            </DialogContent>
        </Dialog>
      </>
  )
}