import React, { FormEvent, useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import TableComponent from '../components/table/Table';
import axios from 'axios';
import { useNetworkStatus } from '../components/NetworkStatus';
import { useNavigate } from 'react-router-dom';
import BlankTable from "../components/BlankTable";

export default function New() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const { isOnline } = useNetworkStatus();
  let navigate = useNavigate();

  useEffect(() => {
    console.log(isOnline);
    fetchDataServer(); // 초기 데이터 로드
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    fetchDataServer(); // 폼 제출 시 데이터 가져오기
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchDataServer(); // 엔터 키 입력 시 데이터 가져오기
    }
  };

  const fetchDataServer = () => {

    window.electron.fetchDataFromDB().then((result) => {
      console.log("ㅋㅋ")
      console.log(result)
      setItems(result);
    }).catch((error) => {
      console.error('Error fetching data from database:', error);
    });

    // 검색 입력값 직접 가져오기
    // const searchInput = document.getElementById('search').value;
    //
    // // axios 요청에 직접 검색어 적용
    // axios
    // .get(`http://localhost:5000/api/items?search=${searchInput}`)
    // .then(response => {
    //   setItems(response.data); // 데이터 설정
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error);
    // });
  };

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
            />
            <form onSubmit={onSubmit}>
              <Button className="w-[80px] h-[34px] text-[12px] rounded-sm">
                검색
              </Button>
            </form>
          </div>
          <div className="mt-6"></div>
          <div className="w-[740px] h-[315px] lg:w-full lg:h-full p-1">
            {items.length === 0 ? <BlankTable />  : <TableComponent items={items} />}
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
