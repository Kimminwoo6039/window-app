import React, { useEffect, useState } from 'react';
import { Table, Spin, Empty } from 'antd';

/**
 * 탐지현황 테이블 리스트
 * @param {Object[]} items - 테이블에 표시할 데이터 배열
 * @param {string} search - 검색어
 * @returns {JSX.Element}
 */
export default function TableComponent({ search }) {
    const defaultImage = require('../../images/no-image-found.png'); // 기본 이미지 경로
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1); // 현재 페이지를 추적합니다.
    const [previewSrc, setPreviewSrc] = useState(null);
    const [previewAlt, setPreviewAlt] = useState(null);

    const handleUpdateEach = (data) => {
        const mapping = {
            '2': '둔부',
            '3': '여자 가슴',
            '4': '여자 성기',
            '6': '항문',
            '14': '남자 성기',
        };

        return data.split(' ').map(item => mapping[item] || item).join(',');
    };

    const handleOpenImage = (imagePath) => {
        window.electron.openImage(imagePath);
    };

    // 이미지 미리보기 컴포넌트
    const ImagePreview = ({ src, alt }) => (
        <img
            src={src}
            alt={alt}
            style={{
                transition: 'transform 0.1s ease, opacity 0.1s ease',
            }}
            className="h-[35px] w-[50px] m-auto hover:cursor-pointer"
            // onMouseEnter={() => handleMouseEnter(src, alt)}
            // onMouseLeave={handleMouseLeave}
            onClick={() => handleOpenImage(src)}  // 수정: 래퍼 함수로 클릭 이벤트 핸들러 설정
            onError={handleImageError}
        />
    );


    // 이미지 로드 실패 시 호출되는 핸들러
    const handleImageError = (event) => {
        event.target.src = defaultImage;
    };

    // 마우스 오버 시 이미지 미리보기 설정
    const handleMouseEnter = (src, alt) => {
        setPreviewSrc(src);
        setPreviewAlt(alt);
    };

    // 마우스가 이미지에서 벗어나면 미리보기 제거
    const handleMouseLeave = () => {
        setPreviewSrc(null);
        setPreviewAlt(null);
    };

    const fetchData = async (page) => {
        setLoading(true);

        try {
            // 페이지 번호와 검색어를 포함하여 데이터 요청
            const result = await window.electron.fetchDataFromDB(search, page);
            if (result.length === 0) {
                setHasMore(false); // 데이터가 없으면 더 이상 데이터가 없다고 설정
            } else {
                setItems(prevItems => [...prevItems, ...result]); // 기존 데이터와 합치기
            }
        } catch (error) {
            console.error('Error fetching data from database:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setItems([]); // 검색어 변경 시 데이터 초기화
        setPage(1); // 페이지를 1로 리셋
        setHasMore(true); // 더 많은 데이터가 있다고 가정
        fetchData(1); // 처음 마운트될 때 데이터 가져오기
    }, [search]);

    useEffect(() => {
        if (page > 1) {
            fetchData(page); // 페이지가 변경될 때마다 데이터 가져오기
        }
    }, [page]);

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;

        if (scrollHeight - scrollTop <= clientHeight * 1.2 && !loading && hasMore) {
            setPage(prevPage => prevPage + 1); // 페이지를 증가시키고 추가 데이터를 가져옵니다.
        }
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
        // {
        //     title: '파일명',
        //     width: 80,
        //     dataIndex: 'filename',
        //     key: 'filename',
        //     align: 'center',
        // },
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

    return (
        <div className="scrollView" onScroll={handleScroll} style={{ height: '330px', overflowY: 'auto' }}>
            <Table
                className="p-0"
                dataSource={items.map(item => ({
                    key: item['HISTORY_SEQ'],
                    date: <p className="text-[10px]">{item['REG_DATE']}</p>,
                    image: <ImagePreview src={item['EVENT_IMAGE']} alt="Sample Image"  />,
                    // filename: <p className="text-[10px]">{item['FILE_NAME']}</p>,
                    type: <p className="text-[10px]">{String(item['EVENT_OBJ'])}</p>,
                    content: <p className="text-[10px] flex ml-1">{handleUpdateEach(item['EVENT_CODE'])}</p>,
                }))}
                columns={columns}
                pagination={false}
            />
            {previewSrc && (
                <div className="preview-container">
                    <img src={previewSrc} alt={previewAlt} className="preview-image" />
                </div>
            )}
        </div>
    );
}
