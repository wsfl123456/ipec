import * as React from "react";
import { Modal } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { createRef, useRef } from 'react';
import lrz from 'lrz';

import { IUpdateStore } from "@pages/update/interfaces/i-update-store";

interface IImgCropperProps {
  title: string;
  visible: boolean;
  srcCropper: any; // 图片url
  type: number; // 1=> 3：4,  2=> 1:1
  onClose: Function;
  onOpen: Function;
  updateStore: IUpdateStore;
  picName: string;
}

export default class ImgCropper extends React.Component<IImgCropperProps, any> {
  cropper: any;

  constructor(props) {
    super(props);
    this.cropper = createRef();
  }

// 将base64码转化为FILE格式
  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onOK = () => {
    const { onClose, updateStore, type, picName } = this.props;
    let url = this.cropper.getCroppedCanvas().toDataURL();
    /**
     * 压缩 lrz(file,[options])
     *  option: width, height, 最大不超过的宽度，默认原图， quality:压缩质量，默认0.7
     */
    lrz(url, { quality: 0.6, width: 270, height: 270 }).then(result => {
      const file = this.dataURLtoFile(result.base64, picName);
      if (type === 1) {
        updateStore.uploadLeft(file)
      } else if (type === 2) {
        // console.log(result.base64, this.dataURLtoFile(result.base64, ''));
        updateStore.uploadImgProdect(file);
      } else {
        updateStore.uploadImgCooperationCase(file);
      }
      onClose();
    });

  };
  onCancel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, srcCropper, type } = this.props;
    return (
      <div className="imgCropper">
        <Modal title={title} visible={visible} onCancel={this.onCancel} onOk={this.onOK}
               okText="确定" cancelText="取消"
        >
          {srcCropper ? (
            <Cropper
              // ref={cropper => (this.cropper = cropper)}
              ref={this.cropper}
              // ref="cropper"
              style={{ height: 400, width: '100%' }}
              preview=".previewContainer"
              // background={false}
              guides={false}
              aspectRatio={type === 1 ? 3 / 4 : 1}
              src={srcCropper}
              onInitialized={instance => {
                this.cropper = instance;
                console.log(instance);
              }}
            />
          ) : (
            ''
          )}
        </Modal>
      </div>
    );
  }
}
