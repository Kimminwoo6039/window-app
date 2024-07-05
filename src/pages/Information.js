import {Button} from "../components/ui/button";
import LicenceClear from "./licence/LicenceClear";
import PinClear from "./pin/PinClear";

export default function Information() {
  return (
      <>
        <main className="flex flex-col justify-start items-start">
          <div className="text-[25px] text-[#515151]">계정정보</div>
          <div className="text-[13px] text-[#6D6D6D]">라이선스가 등록된 계정정보가 노출 됩니다.
          </div>
          <div className="m-4"></div>
          <div
              className="flex flex-col rounded-lg border p-4 gap-1 xl:w-1/4 h-[60px] justify-center md:w-full items-start bg-[#FFFFFF]">
            <div className="text-[13px] text-[#515151] font-bold">아이디 (사용자)
            </div>
            <div className="text-[12px] text-[#6D6D6D]">gksrkdls (한가인)</div>
          </div>
          <div className="m-2"></div>
          <div
              className="flex flex-col rounded-lg border p-4 gap-1 xl:w-1/4 h-[60px] justify-center md:w-full items-start bg-[#FFFFFF]">
            <div className="text-[13px] text-[#515151] font-bold">보호대상
            </div>
            <div className="text-[12px] text-[#6D6D6D]">제주고등학교 / 1학년 1반 / 12번
            </div>
          </div>
          <div className="m-2"></div>
          <div
              className="flex flex-col rounded-lg border p-3 gap-1 xl:w-1/4 h-[110px] justify-center md:w-full items-start bg-[#FFFFFF]">
            <div className="text-[13px] text-[#515151] font-bold">라이선스
            </div>
            <div className="text-[13px] text-[#6D6D6D]">10203010230102KASL1
            </div>
            <LicenceClear />
          </div>
          <div className="m-2"></div>
          <div
              className="flex flex-col rounded-lg border p-3 gap-1 xl:w-1/4 h-[110px] justify-center md:w-full items-start bg-[#FFFFFF]">
            <div className="text-[13px] text-[#515151] font-bold">단말기 정보
            </div>
            <div className="text-[13px] text-[#6D6D6D]">DESK-120 (K3-22-QE-EE-12-AC)
            </div>
            <PinClear />
          </div>
        </main>
      </>
  )
}