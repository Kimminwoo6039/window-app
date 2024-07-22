import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

/**
 * 탐지현황 테이블 리스트
 * 각 값은 숫자로 들어오며, 해당 숫자를 읽을 수 있는 문자열로 변환합니다.
 * @param {Object[]} items - 테이블에 표시할 데이터 배열
 * @returns {JSX.Element}
 * @constructor
 */
export default function TableComponent({ items }) {
    const [previewSrc, setPreviewSrc] = useState(null);
    const [previewAlt, setPreviewAlt] = useState(null);

    // 데이터 값의 숫자를 읽을 수 있는 문자열로 변환합니다.
    const handleUpdateEach = (data: string) => {
        const mapping: { [key: string]: string } = {
            '2': '둔부',
            '3': '여자 가슴',
            '4': '여자 성기',
            '6': '항문',
            '14': '남자 성기',
        };

        return data.split(' ').map(item => mapping[item] || item).join(',');
    };

    // 이미지 미리보기 컴포넌트
    const ImagePreview = ({ src, alt }: { src: string; alt: string }) => (
        <img
            src={src}
            alt={alt}
            style={{
                transition: 'transform 0.1s ease, opacity 0.1s ease',
            }}
            className="h-[35px] w-[50px] m-auto"
            onMouseEnter={() => handleMouseEnter(src, alt)}
            onMouseLeave={handleMouseLeave}
        />
    );

    // 마우스 오버 시 이미지 미리보기 설정
    const handleMouseEnter = (src: string, alt: string) => {
        setPreviewSrc(src);
        setPreviewAlt(alt);
    };

    // 마우스가 이미지에서 벗어나면 미리보기 제거
    const handleMouseLeave = () => {
        setPreviewSrc(null);
        setPreviewAlt(null);
    };

    const columns = [
        {
            title: '날짜',
            width: 100,
            dataIndex: 'date',
            key: 'date',
            align: 'center',
        },
        {
            title: '이미지',
            width: 35,
            dataIndex: 'image',
            key: 'image',
            align: 'center',
        },
        {
            title: '파일명',
            width: 80,
            dataIndex: 'filename',
            key: 'filename',
            align: 'center',
        },
        {
            title: '구분',
            width: 30,
            dataIndex: 'type',
            key: 'type',
            align: 'center',
        },
        {
            title: '격리사유',
            width: 200,
            dataIndex: 'content',
            key: 'content',
            align: 'center',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            console.log('Selected row keys:', selectedRowKeys);
        },
    };

    return (
        <div>
            <div className="scrollView">
                <Table
                    className="p-0"
                    rowSelection={rowSelection}
                    dataSource={items.map(item => ({
                        key: item['HISTORY_SEQ'],
                        date: <p className="text-[10px] ">{item['REG_DATE']}</p>,
                        image: <ImagePreview src={item['EVENT_IMAGE']} alt="Sample Image" />,
                        filename: <p className="text-[10px]">1171321456849793.jpg</p>,
                        type: <p className="text-[10px]">{String(item['EVENT_OBJ'])}</p>,
                        content: <p className="text-[10px] flex ml-1">{handleUpdateEach(item['EVENT_CODE'])}</p>,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: 600, y: 300 }}
                />
            </div>
            {previewSrc && (
                <div className="preview-container">
                    <img src={previewSrc} alt={previewAlt} className="preview-image" />
                </div>
            )}
        </div>
    );
}
