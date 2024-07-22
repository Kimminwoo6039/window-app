import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

/**
 * 라이선스 해제 하는 페이지
 * 계정정보/라이선스 해제
 * @returns {JSX.Element}
 * @constructor
 */

export default function LicenceClear() {
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("등록");
    localStorage.clear();
    navigate('/', { replace: false });
  };

  return (
      <>
        <ConfirmationDialog
            triggerText="라이선스 해제"
            title="라이선스 해제"
            description="등록된 라이선스를 해제하시겠습니까? 라이선스를 해제하시면 더 이상 서비스를 이용하실 수 없습니다."
            onConfirm={onSubmit}
        />
      </>
  );
}
