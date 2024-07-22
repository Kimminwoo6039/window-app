


/**
 * 탐지현황 데이터 없을시 보여주는 테이블 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */

export default function BlankTable() {
    return (
        <>
            <div className="flex flex-col justify-center bg-[#FFFFFF] w-[730px] h-[315px]">
                <p className="text-[#000000] text-[21px] font-bold">탐지된 유해 콘텐츠가 없습니다.</p>
                <p className="text-[#000000] text-[14px]">안전한 콘텐츠 사용을 위해 주기적으로 유해성 진단을 해주시면 좋습니다.</p>
            </div>
        </>
    )
}
