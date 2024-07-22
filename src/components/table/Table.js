import React, {useEffect, useState} from 'react';
import {Table} from 'antd';


/**
 * 탐지현황 테이블 리스트
 * handleUpdateEach 함수는 가져온 데이터 기준으로 전처리 후에 값 세팅.
 * 현재 값은 숫자로 들어오고 있습니다.
 * ex ) 2 2 2  -> 여성 성기 , 여성성기 , 여성성기 등으로 변환
 * @param items
 * @returns {JSX.Element}
 * @constructor
 */

export default function TableComponent({items}) {
    const [previewSrc, setPreviewSrc] = useState(null);
    const [previewAlt, setPreviewAlt] = useState(null);
    // const [items, setItems] = useState([]);
    // const {isOnline} = useNetworkStatus()

    useEffect(() => {
        // console.log(isOnline)
        // axios.get('http://localhost:5000/api/items')
        // .then(response => {
        //   setItems(response.data)
        // })
        // .catch(error => {
        //   console.error('Error fetching data:', error);
        // });
    }, []);

    // 각 값들을 순서대로 다른 값으로 변경하는 함수
    const handleUpdateEach = (data) => {

        if (typeof data === 'string') {
            for (let i = 0; i < data.length; i++) {
                // 공백 먼저 값 변경
                let space = data.split(' ');
                const Arrays = space.map((item) => {
                    if (item === '2') {
                        return '둔부';
                    }
                    if (item === '3') {
                        return '여자 가슴';
                    }
                    if (item === '4') {
                        return '여자 성기';
                    }
                    if (item === '6') {
                        return '항문';
                    }
                    if (item === '14') {
                        return '남자 성기';
                    }
                    return item; // 다른 값은 변경하지 않음
                })

                // 문자열을 배열로 변환
                // ,(쉼표) 기준 문자 변환
                const valuesArray = Arrays.toString().split(',');
                const newValuesArray = valuesArray.map(item => {
                    if (item === '2') {
                        return '둔부';
                    }
                    if (item === '3') {
                        return '여자 가슴';
                    }
                    if (item === '4') {
                        return '여자 성기';
                    }
                    if (item === '6') {
                        return '항문';
                    }
                    if (item === '14') {
                        return '남자 성기';
                    }
                    return item; // 다른 값은 변경하지 않음
                });

                // 배열을 다시 문자열로 변환
                return newValuesArray.join(',');
            }
        }
    };


    const ImagePreview = ({src, alt}) => {
        return (
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
    };

    const handleMouseEnter = (src, alt) => {
        setPreviewSrc(src);
        setPreviewAlt(alt);
    };

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
            align: 'center'
        },
        {
            title: '이미지',
            width: 35,
            dataIndex: 'image',
            key: 'image',
            align: 'center'
        },
        {
            title: '파일명',
            width: 80,
            dataIndex: 'filename',
            key: 'filename',
            align: 'center'
        },
        {
            title: '구분',
            width: 30,
            dataIndex: 'type',
            key: 'type',
            align: 'center'
        },
        {
            title: '격리사유',
            width: 200,
            dataIndex: 'content',
            key: 'content',
            align: 'center'
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            console.log('Selected row keys:', selectedRowKeys);
        },
    };

    return (
        <div>
            <div className="scrollView">
                <Table
                    className="p-0"
                    rowSelection={rowSelection}
                    dataSource={
                        items.map(item => (
                            {
                                key: item['HISTORY_SEQ'],
                                date: <p className="text-[10px] ">{item['REG_DATE']}</p>,
                                image: <ImagePreview src={item['EVENT_IMAGE']}
                                                     alt="Sample Image"/>,
                                filename: <p
                                    className="text-[10px] ">1171321456849793.jpg</p>,
                                type: <p className="text-[10px] ">{String(
                                    item['EVENT_OBJ'])}</p>,
                                content: <p
                                    className="text-[10px] flex ml-1">{handleUpdateEach(
                                    item['EVENT_CODE'])}</p>
                            }
                        ))
                    }
                    columns={columns}
                    pagination={false}
                    scroll={{x: 600, y: 300}}
                />
            </div>
            {previewSrc && (
                <div className="preview-container">
                    <img src={previewSrc} alt={previewAlt} className="preview-image"/>
                </div>
            )}
        </div>
    );
}
