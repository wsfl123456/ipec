import * as React from "react";
import "@assets/scss/model.scss";
import upload_img from "@assets/images/upload.png";
import icon_close from "@assets/images/ic_close.svg";
import { uploadBusinessData, uploadUploadFile } from "@utils/api";
import Alert from "@components/alert";
import { inject } from 'mobx-react';

interface ImodelProps extends IComponentProps {
  onClose?: Function,
  ipid?: string,
  setipMaterial?: Function,
  callback?: Function,
  fileType?: object,
  setAlert?: Function,
}

interface ImodelState {
  result: any,
  uploadBox: boolean;
  isAlert: boolean;
  message: string;

}

@inject('update')
export default class UploadFileModel extends React.Component<ImodelProps, ImodelState> {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      uploadBox: true,
      isAlert: false,
      message: "",
    };
  }

  async uploadFile(e) {
    const { ipid, setipMaterial, callback, fileType, onClose, setotherInput } = this.props;
    const { userGuid } = JSON.parse(localStorage.getItem("user"));
    let file = e.target.files[0];
    let size = file.size;
    let name = file.name;
    let is50M = size / 1024 / 1024 < 50;
    let is10M = size / 1024 / 1024 < 10;
    let type = '';
    if (!is50M) {
      if (this.props.setAlert) {
        this.props.setAlert('文件格式不对，请重新选择上传');
      } else {
        this.setState({
          isAlert: true,
          message: "文件过大，请重新选择上传"
        });
      }
      return false;
    }
    if (fileType && Number(fileType['type']) === 1) {
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type !== "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/pdf" && file.type !== "application/vnd.openxmlformats-officedocument.presentationml.presentation") {

        if (this.props.setAlert) {
          this.props.setAlert('文件格式不对，请重新选择上传');
        } else {
          this.setState({
            isAlert: true,
            message: "文件格式不对，请重新选择上传"
          });
        }

        return false;
      }
    } else {
      if (!is10M) {
        this.props.setAlert('文件过大，请重新选择上传');
        return false;
      }
      if (file.type !== "application/zip" && file.type !== "application/x-zip" && file.type !== "application/x-zip-compressed") {
        this.props.setAlert('文件格式不对，请重新选择上传');
        return false;
      }
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      this.setState({
        result: [...this.state.result, name]
      });
      let formData = new FormData();
      formData.append("file", file);
      let params,
        _result;
      if (ipid && Number(fileType['type']) === 1) {
        params = { file: formData, userGuid, ipid };
        _result = await uploadBusinessData(params);
        callback({
          businessList: true
        });
        onClose();

      } else {
        params = { file: formData, userGuid, type: fileType['type'] };
        _result = await uploadUploadFile(params);
        if (_result.errorCode === '200' && _result.result.errorCode === 200) {
          this.setState({
            uploadBox: false,
          });
          if (Number(fileType['type']) === 1) {
            let _time = new Date();
            setipMaterial({
              title: name,
              guid: _result.result.data,
              time: _time,
            });
          } else if (Number(fileType['type']) === 2) {
            setotherInput({
              agencyAgreementGuid: {
                guid: _result.result.data,
                name,
              },
            });
            onClose();
          } else if (Number(fileType['type']) === 3) {
            setotherInput({
              copyrightCertificateGuid: {
                guid: _result.result.data,
                name,
              },
            });
            onClose();
          } else if (Number(fileType['type']) === 4 || Number(fileType['type']) === 5) {
            setotherInput({
              ownershipGuid: {
                guid: _result.result.data,
                name,
              },
            });
            onClose();
          }
        } else {
          this.setState({
            uploadBox: true,
            isAlert: true,
            message: _result.result.errorMsg
          });
        }

      }

    };
  }

  render() {
    const { onClose, fileType } = this.props;
    const { uploadBox, isAlert, message, result } = this.state;
    return (
      <div className="model model-upload-file">
        <div className="menban" onClick={() => onClose()}/>
        {isAlert && <Alert
          onClose={() => {
            this.setState({ isAlert: false });
          }}
          onSubmit={() => {
            this.setState({ isAlert: false });
          }}
          message={message}/>
        }
        <div className="model-container">
          <div className="model-header">
            <span className="model-title">{fileType['text']}</span>
            <img src={icon_close} className="close" onClick={() => {
              onClose();
            }} alt=""/>
            <p>{fileType['tip']}</p>
          </div>
          <div className="model-body">
            {uploadBox &&
            <div className="upload-box">
              <input type="file" style={{ opacity: 0 }}
                     accept=".zip,.ppt,.pptx,.pptm,.ppsx,.ppsx,.potx,.xlsx,.xlsm,.xlsm,.xltm,.xlsb,.xlam,.pdf"
                     onChange={async (e) => {
                       await this.uploadFile(e);
                     }}/>

              <div className="upload-container" style={{ backgroundImage: `url(${upload_img})` }}/>
            </div>
            }
            {!uploadBox &&
            <div className="upload-list">
              {
                result && result.map((item, index) => {
                  return (
                    <div className="single-list" key={index}>
                      <img src="" className="file-type-img" alt=""/>
                      <div className="file-content">
                        <p className="file-name" title={item}>{item}</p>
                        <p className="file-state">上传成功！</p>
                      </div>
                      <img src="" className="file-remove-this" alt=""/>
                    </div>
                  );
                })
              }
            </div>
            }
          </div>
          {
            !uploadBox &&
            <div className="model-footer">
              <span className="btn btn-submit">
                继续 上传
                <input className="btn btn-submit" type="file" style={{ opacity: 0 }} onChange={async (e) => {
                  await this.uploadFile(e);
                }}/>
              </span>
              <input type="button" className="btn btn-cancel" value="确定" onClick={() => onClose()}/>
            </div>
          }
        </div>
      </div>
    );
  }
}
