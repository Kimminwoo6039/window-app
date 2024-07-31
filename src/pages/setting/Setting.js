import React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../components/ui/tabs";
import {Button} from "../../components/ui/button";
import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import {useEffect, useState} from "react";

/**
 * 설정 정보 페이지 (세팅)
 * @param label
 * @param description
 * @param placeholder
 * @param options
 * @param value
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
const SettingOption = ({ label, description, placeholder, options, value, onChange }) => (
    <div className="flex flex-col rounded-lg border p-3 gap-1 h-[111px] justify-center md:w-full items-start bg-[#FFFFFF]">
        <div className="text-[13px] text-[#515151] font-bold">{label}</div>
        <div className="text-[12px] text-[#6D6D6D]">{description}</div>
        <div className="w-[240px] h-[34px]">
            <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
);

const SettingTabContent = ({ tabId, options, toggleAutoLaunch, autoLaunch }) => (
    <TabsContent value={tabId}>
        <main className="flex flex-col justify-start items-start m-3">
            {options.map((option, index) => (
                <React.Fragment key={index}>
                    <div className="m-1"></div>
                    <SettingOption
                        label={option.label}
                        description={option.description}
                        placeholder={option.placeholder}
                        options={option.selectOptions}
                        value={option.currentValue}
                        onChange={option.onChange}
                    />
                </React.Fragment>
            ))}
        </main>
    </TabsContent>
);

export default function Setting() {

    const [autoLaunch, setAutoLaunch] = useState(() => {
        const saved = localStorage.getItem("autoLaunch");
        return saved === "true" || saved === null; // default to true if not set
    });

    // 설정값 전체 가져오기
    const [list,setList] = useState([{}]);

    const fetchData = async () => {

        try {
            // 페이지 번호와 검색어를 포함하여 데이터 요청
            const result = await window.electron.fetchDataSettingFromDB();
            if (result.length > 0) {
                setList(result[0]); // 배열의 첫 번째 요소를 객체로 설정
            }

        } catch (error) {
            console.error('Error fetching data from database:', error);
        } finally {

        }
    };

    const handleOptionChange = (field, value) => {
        setList((prevList) => {
            const updatedList = { ...prevList, [field]: value };
            window.electron.sendUpdateSetting(field, value);
            return updatedList;
        });
    };

    useEffect(() => {
        fetchData()
        if (autoLaunch === null) {
            localStorage.setItem("autoLaunch", "true");
            setAutoLaunch(true);
        }
    }, []);

    const toggleAutoLaunch = (value) => {
        const booleanValue = value === "true";
        setAutoLaunch(booleanValue);
        localStorage.setItem("autoLaunch", value);
        if (window.electron) {
            window.electron.send('update-auto-launch', booleanValue);
        }
    };

    const policyOptions = [
        {
            label: "유해 콘텐츠 탐지 시",
            description: "유해성 콘텐츠가 탐지되는 경우 아래와 같은 조치를 취합니다.",
            placeholder: "콘텐츠 최소화",
            selectOptions: [
                { value: 0, label: "콘텐츠 최소화" },
                { value: 1, label: "콘텐츠 최대화" }
            ],
            currentValue: list.DETECT_ACTION, // Set current value if needed
            onChange: (value) => handleOptionChange('DETECT_ACTION', value)
        },
        {
            label: "탐지정책",
            description: "관리자에서 설정한 탐지 정책이 노출 됩니다. 탐지 정책 관리는 관리자에서만 가능합니다.",
            placeholder: "중학교 정책 템플릿",
            selectOptions: [
                { value: 0, label: "초등학교 정책 템플릿" },
                { value: 1, label: "중학교 정책 템플릿" },
                { value: 2, label: "고등학교 정책 템플릿" }
            ],
            currentValue: list.DETECT_GRADE, // Set current value if needed
            onChange: (value) => handleOptionChange('DETECT_GRADE', value)
        }
    ];

    const etcOptions = [
        {
            label: "실행설정",
            description: "서비스가 실행되는 시점을 설정할 수 있습니다.",
            placeholder: autoLaunch ? "윈도우 시작 시 자동 실행" : "윈도우 시작 시 자동 중지",
            selectOptions: [
                { value: 0, label: "윈도우 시작 시 자동 실행" },
                { value: 1, label: "윈도우 시작 시 자동 중지" }
            ],
            currentValue: list.AUTO_RUN,
            onChange: (value) => {
                handleOptionChange('AUTO_RUN', value);
            }
        },
        {
            label: "알림설정",
            description: "탐지 시 아래와 같은 조건으로 알림이 발송 됩니다.",
            placeholder: "보호자에게 메시지 발송",
            selectOptions: [
                { value: 0, label: "보호자에게 메시지 발송" },
                { value: 1, label: "선생님에게 메시지 발송" }
            ],
            currentValue: list.NOTI_TYPE, // Set current value if needed
            onChange: (value) => handleOptionChange('NOTI_TYPE', value)
        },
        {
            label: "검역소 파일 관리",
            description: "아래 기간 동안 검역소에 파일이 보관 됩니다. (설정 기간이 지나면 오래된 항목 부터 자동으로 삭제 됩니다)",
            placeholder: "30일",
            selectOptions: [
                { value: 30, label: "30일" }
            ],
            currentValue: list.HISTORY_PERIOD, // Set current value if needed
            onChange: (value) => handleOptionChange('HISTORY_PERIOD', value)
        },
        {
            label: "로그파일 관리",
            description: "아래 기간 동안 로그 파일이 보관 됩니다. (설정 기간이 지나면 오래된 항목 부터 자동으로 삭제 됩니다)",
            placeholder: "30일",
            selectOptions: [
                { value: 30, label: "30일" }
            ],
            currentValue: list.LOG_PERIOD, // Set current value if needed
            onChange: (value) => handleOptionChange('LOG_PERIOD', value)
        }
    ];

  return (
      <>
          <Tabs defaultValue="policy" className="w-[740px]">
              <TabsList className="grid w-[400px] grid-cols-3 bg-none">
                  <TabsTrigger value="policy">탐지정책</TabsTrigger>
                  <TabsTrigger value="etc">기타설정</TabsTrigger>
                  <TabsTrigger value="product">제품정보</TabsTrigger>
              </TabsList>
              <hr className="w-[800px]" />

              <SettingTabContent tabId="policy" options={policyOptions} />
              <SettingTabContent tabId="etc" options={etcOptions} toggleAutoLaunch={toggleAutoLaunch} autoLaunch={autoLaunch} />

              <TabsContent value="product">
                  <main className="flex flex-col items-center m-28 ml-12">
                      <img alt="" src={require('../../images/product.png')} />
                      <div className="flex gap-2 text-[19px] mt-6">
                          <p className="text-[#9D1F32] text-[19px] font-bold">MeerCat.ch</p>
                          <p className="text-[#515151]">Beta</p>
                      </div>
                      <div className="text-[12px] text-[#8B8B8B] mt-1">제품버전 : {list.PROD_VER}</div>
                      <div className="text-[12px] text-[#8B8B8B]">엔진버전 : {list.ENGINE_VER}</div>
                      <div className="flex flex-row gap-2 mt-10">
                          <Button className="w-[150px] h-[34px] hover:bg-neutral-400 bg-[#FFFFFF] rounded-sm">
                              <p className="text-[12px] text-[#515151]">사용 약관</p>
                          </Button>
                          <Button className="w-[150px] h-[34px] hover:bg-neutral-400 bg-[#FFFFFF]">
                              <p className="text-[12px] text-[#515151]">오픈소스 라이선스</p>
                          </Button>
                          <Button className="w-[150px] h-[34px] hover:bg-neutral-400 bg-[#FFFFFF]">
                              <p className="text-[12px] text-[#515151]">개인정보처리방침</p>
                          </Button>
                      </div>
                  </main>
              </TabsContent>
          </Tabs>
      </>
  )
}
