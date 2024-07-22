import React from 'react';
import {Button} from "../../components/ui/button";
import LicenceClear from "../licence/LicenceClear";
import PinClear from "../pin/PinClear";

/**
 * 계정 정보 페이지
 *
 */

interface InfoCardProps {
    title: string;
    content: string;
    action?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({title, content, action}) => (
    <div className="flex flex-col rounded-lg border p-4 gap-1 xl:w-1/4 md:w-full bg-white items-start">
        <div className="text-[13px] text-[#515151] font-bold">{title}</div>
        <div className="text-[12px] text-[#6D6D6D]">{content}</div>
        {action && <div className="mt-2">{action}</div>}
    </div>
);

export default function Information() {
    return (
        <main className="flex flex-col ">
            <div className="flex flex-col items-start">
                <h1 className="text-[25px] text-[#515151]">계정정보</h1>
                <p className="text-[13px] text-[#6D6D6D]">
                    라이선스가 등록된 계정정보가 노출 됩니다.
                </p>
            </div>
            <div className="space-y-2 mt-4">
                <InfoCard
                    title="아이디 (사용자)"
                    content="gksrkdls (한가인)"
                />
                <InfoCard
                    title="보호대상"
                    content="제주고등학교 / 1학년 1반 / 12번"
                />
                <InfoCard
                    title="라이선스"
                    content="10203010230102KASL1"
                    action={<LicenceClear/>}
                />
                <InfoCard
                    title="단말기 정보"
                    content="DESK-120 (K3-22-QE-EE-12-AC)"
                    action={<PinClear/>}
                />
            </div>
        </main>
    );
}
