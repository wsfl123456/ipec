import { Icon, Input, Upload } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import ImgCrop from 'antd-img-crop';

export default ({
                  updateStore,
                  rightIPCaseShow,
                  cooperationCase,
                }:
                  {
                    updateStore: IUpdateStore,
                    rightIPCaseShow: boolean
                    cooperationCase: any[],
                  }) => {
  const props = {
    modalTitle: "图片裁剪", // 弹窗标题
    modalWidth: 600, // 弹窗宽度
    modalOk: "确定",
    modalCancel: "取消",
    aspect: 1,
    zoom: false,
  };
  return (
    <div className="rightIPCase">
      <div className="rightIPCaseTop">
        <div className="leftTitle">已授权衍生品图
          <span className="notice">(注：建议图片宽高比为1:1)</span>
        </div>
      </div>
      <div className="rightIPCaseBtm">
        {
          cooperationCase && cooperationCase.map((item, index: number) => {
            return (
              <div key={index} className="rightIPCaseUpload">
                <div className="upload-box"
                     onClick={() => {
                       updateStore.unUploadImgCooperationCase(index);
                     }}
                >
                  <div className="border-box">
                    <Icon type="delete"/>
                    <img src={item || item.pic} alt=''/>
                  </div>
                </div>
              </div>
            );
          })
        }

        <ImgCrop {...props}>
          <Upload className="rightIPCaseUpload"
                  listType="picture" action=''
            // fileList={prodect}

            // @ts-ignore
                  beforeUpload={(file, fileList) => {
                    console.log('file=', file, fileList);
                    updateStore.uploadImgCooperationCase(file);
                  }}
          >
            <div className="upload-box">
              <div className="border-box">
                <Icon type="plus"/>
                <div className="upload-box-text">添加图片</div>
              </div>
            </div>
          </Upload>
        </ImgCrop>
      </div>
    </div>
  );
};
