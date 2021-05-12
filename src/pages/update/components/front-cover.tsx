import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import ImgCrop from 'antd-img-crop';
import { Upload} from 'antd';

export default ({ ipLeftPic, updateStore }: { ipLeftPic: string, updateStore: IUpdateStore}) => {
 // 根据官方属性定制化裁剪框大小固定的裁剪组件属性
  const props = {
    modalTitle: "图片裁剪", // 弹窗标题
    modalWidth: 600, // 弹窗宽度
    modalOk: "确定",
    modalCancel: "取消",
    aspect: 0.75,
    zoom: false,
  };
  // modalTitle="图片裁剪"  modalWidth={600} modalOk="确定" modalCancel="取消"
  // zoom={false} aspect={0.75}
  return (
    <div className="update_newLeft">
      <ImgCrop  {...props}>
        <Upload  className="leftUploadInput" listType={'picture'} action=''
              // @ts-ignore
                beforeUpload={ file => {
                  console.log(file);
                  updateStore.uploadLeft(file)
                }}
         >
          <div className="leftUpload">
            <div className="leftUploadIn">上传IP封面</div>
            {ipLeftPic && <img src={ipLeftPic} alt=''/>}
            {/*<input type="file" onChange={(e) => updateStore.uploadLeft(e.target.files[0])} className="leftUploadInput"/>*/}
          </div>
        </Upload>
      </ImgCrop>
      <div className="leftUploadTest">建议图片宽高比为3:4</div>
    </div>
  );
};
