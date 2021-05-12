import { Icon, Input, Upload } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import ImgCropper from '@pages/update/components/ImgCropper';
import { message } from 'antd';

interface IMaterialProps {
  updateStore: IUpdateStore,
  rightIPImageShow: boolean
  prodect: any[],
}

interface IMaterialState {
  visible: boolean;
  srcCropper: any;
  type: number,
  picName: string,
}

export default class Material extends React.Component<IMaterialProps, IMaterialState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      srcCropper: '',
      type: 2,
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
    const { prodect, updateStore, rightIPImageShow } = this.props;
    const { visible, srcCropper, type, picName } = this.state;
    return (
      <div className="rightIPImage">
        <ImgCropper title={"图片裁切"} visible={visible} srcCropper={srcCropper} type={type} picName={picName}
                    onClose={this.onClose}
                    onOpen={this.onOpen} updateStore={updateStore}/>
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

          <Upload className="rightIPImageUpload" accept="image/*"
                  listType="picture" action='' showUploadList={false}
                  beforeUpload={(file, fileList) => {
                    // console.log('upload+file=', file, fileList);
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
}
