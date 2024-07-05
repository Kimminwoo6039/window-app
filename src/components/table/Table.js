import React, {useEffect, useRef, useState} from 'react';
import { Table } from 'antd';
import axios from "axios";

export default function TableComponent() {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewAlt, setPreviewAlt] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
    .then(response => {
      setItems(response.data)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    handleUpdateEach(items)
  }, []);

  // 각 값들을 순서대로 다른 값으로 변경하는 함수
  const handleUpdateEach = (data) => {

    console.log(data);

    return data;
  };

  const ImagePreview = ({ src, alt }) => {
    return (
        <img
            src={src}
            alt={alt}
            className="h-[35px] m-auto"
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

  const dataSource = [
    items.map(item => (
        {
          key: item.HISTORY_SEQ,
          date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
          image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
          filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
          type: <p className="text-[10px] ">탐지</p>,
          content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
        }
      ))
    // {
    //   key: '2',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/user.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // {
    //   key: '3',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/BTN_storage.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // {
    //   key: '4',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/check.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // {
    //   key: '5',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // {
    //   key: '6',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // {
    //   key: '7',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // {
    //   key: '8',
    //   date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
    //   image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
    //   filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
    //   type: <p className="text-[10px] ">탐지</p>,
    //   content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    // },
    // Repeat for other data entries
  ];

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
                      image: <ImagePreview src={item['EVENT_IMAGE']} alt="Sample Image" />,
                      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
                      type: <p className="text-[10px] ">{String(item['EVENT_OBJ'])}</p>,
                      content: <p className="text-[10px] flex ml-1">{handleUpdateEach(item['EVENT_CODE'])}</p>
                    }
                ))
              }
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
