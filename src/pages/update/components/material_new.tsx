import { Icon, Input, Upload } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import ImgCrop from 'antd-img-crop';
import _isEmpty from 'lodash/isEmpty';

export default ({
                  updateStore,
                  rightIPImageShow,
                  prodect,
                }:
                  {
                    updateStore: IUpdateStore,
                    rightIPImageShow: boolean
                    prodect: any[],
                  }) => {
  const props = {
    modalTitle: "图片裁剪", // 弹窗标题
    modalWidth: 600, // 弹窗宽度
    modalOk: "确定",
    modalCancel: "取消",
    aspect: 1,
    zoom: true,
  };
  return (
    <div className="rightIPImage">

      <div className="rightIPImageTop">
        <div className="leftTitle">IP素材图库
          <span className="notice">(注：建议图片宽高比为1:1)</span>
        </div>
      </div>

      <div className="rightIPImageBtm">
        {
          prodect && prodect.map((item, index) => {
            return (
              <div className="rightIPImageUpload" key={index}>
                <div className="upload-box"
                     onClick={() => updateStore.unUploadImgProdect(index)}
                >
                  <div className="border-box">
                    <Icon type="delete" className="icon-detail"/>
                    <img src={item || item.pic} alt=""/>
                  </div>
                </div>
              </div>
            );
          })
        }

        <ImgCrop {...props}>
          <Upload className="rightIPImageUpload"
                  listType="picture" action=''
            // fileList={prodect}

            // @ts-ignore
                  beforeUpload={(file, fileList) => {
                    console.log('file=', file, fileList);
                    updateStore.uploadImgProdect(file);
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
