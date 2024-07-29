import React, { FormEvent, useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import TableComponent from '../../components/table/Table';
import { useNetworkStatus } from '../../components/network/NetworkStatus';
import { useNavigate } from 'react-router-dom';
import BlankTable from "../../components/table/BlankTable";

/**
 * 검역소
 * IpcRender 를 통해서 localdb 가져오는 로직
 * @returns {JSX.Element}
 * @constructor
 */
export default function Detection() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const { isOnline } = useNetworkStatus();
  let navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    setItems([]); // 검색 시 테이블 비우기
    fetchDataServer(); // 폼 제출 시 데이터 가져오기
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setItems([]); // 엔터 키 입력 시 테이블 비우기
      fetchDataServer(); // 엔터 키 입력 시 데이터 가져오기
    }
  };

  const fetchDataServer = () => {
    window.electron.fetchDataFromDB(search, 1).then((result) => {
      setItems(result);
    }).catch((error) => {
      console.error('Error fetching data from database:', error);
    });
  };

  useEffect(() => {
    fetchDataServer()
  }, []);



  return (
      <>
        <main className="flex flex-col justify-start items-start">
          <p className="text-[25px] text-[#515151]">검역소</p>
          <p className="text-[13px] text-[#6D6D6D]">
            실시간 탐지와 유해성 진단을 통해 검출된 유해 콘텐츠 입니다.
          </p>
          <div className="mt-6"></div>
          <div className="flex flex-row gap-2">
            <Input
                className="w-[280px] h-[34px] rounded-sm"
                id="search"
                placeholder="검색"
                onKeyPress={handleKeyPress}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <form onSubmit={onSubmit}>
              <Button className="w-[80px] h-[34px] text-[12px] rounded-sm">
                검색
              </Button>
            </form>
          </div>
          <div className="mt-6"></div>
          <div className="w-[740px] h-[315px] lg:w-full lg:h-full p-1">
            {items.length === 0 ? <BlankTable /> : <TableComponent search={search} />}
          </div>
        </main>
        <div className="flex flex-row justify-end gap-2 m-10">
          <Button className="w-[80px] h-[34px] bg-[#FFFFFF] rounded-sm text-[#515151] text-[12px]">
            삭제
          </Button>
          <Button className="w-[80px] h-[34px] rounded-sm bg-[#FFFFFF] text-[#515151] text-[12px]">
            오탐신고
          </Button>
        </div>
      </>
  );
}
