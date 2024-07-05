import React from 'react';
import {Input} from "../components/ui/input";
import {Button} from "../components/ui/button";
import TableComponent from "../components/table/Table";

export default function New() {
  const data = require('../components/table/tasks.json')
  return (
      <>
        {/*<button onClick={event => localStorage.clear()}>버튼</button>*/}
        <main className="flex flex-col justify-start items-start">
          <p className="text-[25px] text-[#515151]">검역소</p>
          <p className="text-[13px] text-[#6D6D6D]">실시간 탐지와 유해성 진단을 통해 검출된 유해
            콘텐츠 입니다.</p>
          <div className="mt-6"></div>
          <div className="flex flex-row gap-2">
            <Input className="w-[280px] h-[34px] rounded-sm" placeholder="검색"/>
            <Button
                className="w-[80px] h-[34px] text-[12px] rounded-sm">검색</Button>
          </div>
          <div className="mt-6"></div>
          <div className="w-[758px] h-[315px] lg:w-full lg:h-full p-1">
            <TableComponent/>
          </div>
        </main>
        <div className="flex flex-row justify-end gap-2 m-10">
          <Button className="w-[80px] h-[34px] bg-[#FFFFFF] rounded-sm text-[#515151] text-[12px]">삭제</Button>
          <Button className="w-[80px] h-[34px] rounded-sm bg-[#FFFFFF] text-[#515151] text-[12px]">오탐신고</Button>
        </div>
      </>
  )
}