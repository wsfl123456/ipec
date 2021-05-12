import { Icon, Input, message, Upload } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import ImgCropper from '@pages/update/components/ImgCropper';

interface ICaseProps {
  updateStore: IUpdateStore,
  rightIPCaseShow: boolean
  cooperationCase: any[],
}

interface ICaseState {
  visible: boolean;
  srcCropper: any;
  type: number,
  picName: string,
}

export default class Case extends React.Component<ICaseProps, ICaseState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      srcCropper: '',
      type: 3,
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
    const { cooperationCase, updateStore } = this.props;
    const { visible, srcCropper, type, picName } = this.state;
    return (
      <div className="rightIPCase">
        <ImgCropper title={"图片裁切"} visible={visible} srcCropper={srcCropper} type={type} picName={picName}
                    onClose={this.onClose}
                    onOpen={this.onOpen} updateStore={updateStore}/>
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
          <Upload className="rightIPCaseUpload" accept="image/*"
                  listType="picture" action='' showUploadList={false}
                  beforeUpload={(file, fileList) => {
                    // console.log('file=', file, fileList);
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
            <div className="upload-box">
              <div className="border-box">
                <Icon type="plus"/>
                <div className="upload-box-text">添加图片</div>
              </div>
            </div>
          </Upload>
        </div>
      </div>
    );
  }
};
