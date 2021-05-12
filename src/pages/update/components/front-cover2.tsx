import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import { message, Upload } from 'antd';
import ImgCropper from '@pages/update/components/ImgCropper';

interface ILeftProps {
  updateStore: IUpdateStore,
  ipLeftPic: string,
}

interface ILeftState {
  visible: boolean;
  srcCropper: any;
  type: number,
  picName: string,
}

export default class FrontCover extends React.Component <ILeftProps, ILeftState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      srcCropper: '',
      type: 1,
      picName: '',
    };
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  onOpen = () => {
    this.setState({
      visible: true
    });
  };

  render() {
    const { ipLeftPic, updateStore } = this.props;
    const { visible, srcCropper, type, picName } = this.state;
    return (
      <div className="update_newLeft">
        <ImgCropper title={"图片裁切"} visible={visible} srcCropper={srcCropper} type={type} picName={picName}
                    onClose={this.onClose}
                    onOpen={this.onOpen} updateStore={updateStore}/>
        <Upload className="leftUploadInput"
                accept="image/*" listType="picture" action=""
                showUploadList={false}
                beforeUpload={file => {
                  // console.log(file);
                  // updateStore.uploadLeft(file)
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    // 添加文件限制
                    message.error({ content: '文件大小不能超过5M' });
                    return false;
                  }
                  const reader = new FileReader();
                  reader.readAsDataURL(file); // 开始读取文件
                  // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
                  reader.onload = e => {
                    this.setState({
                      visible: true,
                      srcCropper: e.target.result,
                      picName: file.name
                    });
                  };
                  return false;
                }}
        >
          <div className="leftUpload">
            <div className="leftUploadIn">上传IP封面</div>
            {ipLeftPic && <img src={ipLeftPic} alt=''/>}
          </div>
        </Upload>
        <div className="leftUploadTest">建议图片宽高比为3:4</div>
      </div>
    );
  }
}
