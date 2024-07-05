import React, { useRef, useState } from 'react';
import { Table } from 'antd';

export default function TableComponent() {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewAlt, setPreviewAlt] = useState(null);

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
    {
      key: '1',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '2',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/user.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '3',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/BTN_storage.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '4',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/check.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '5',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '6',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '7',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
    {
      key: '8',
      date: <p className="text-[10px] ">2024-04-22 14:00:50</p>,
      image: <ImagePreview src={require('../../images/BTN_detection.png')} alt="Sample Image" />,
      filename: <p className="text-[10px] ">1171321456849793.jpg</p>,
      type: <p className="text-[10px] ">탐지</p>,
      content: <p className="text-[10px] flex ml-1">여성 유방 노출,여성 생식기 노출,배노출</p>
    },
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
              dataSource={dataSource}
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
