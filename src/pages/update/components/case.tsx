import { Icon, Input } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";

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
  return (
    <div className="rightIPCase">
      <div className="rightIPCaseTop">
        <div className="leftTitle">案例</div>
        <div
          className="rightTitle"
          onClick={() => updateStore.setRightIPCaseShow(!rightIPCaseShow)}>
          {rightIPCaseShow ? '收起' : '展开'}
          <Icon type={rightIPCaseShow ? 'up' : 'down'}/>
        </div>
      </div>
      {rightIPCaseShow &&
      <div className="rightIPCaseBtm">
        <div className="notice">注：建议图片尺寸：230*180px</div>
        <div className="rightIPCaseUploadBox">
          {
            cooperationCase && cooperationCase.map((item, index: number) => {
              return (
                <div key={index} className="rightIPCaseUpload">
                  <div className="upload-box">
                    {!item.pic ? <div className="upload-box-text">添加产品</div> :
                      <div
                        className="upload-box-text"
                        onClick={() => {
                          updateStore.unUploadImgCooperationCase(index);
                        }}>删除</div>}
                    <Icon type={!item.pic ? 'plus' : 'minus'}/>
                    {item.pic && <img
                      src={item.pic}
                      alt=''/>}
                    {!item.pic &&
                    <input
                      type="file"
                      onChange={(e) => updateStore.uploadImgCooperationCase(e.target.files[0], index)}
                      className="upload-box-file"/>}
                  </div>
                  <Input
                    className="upload-Input" placeholder="输入产品描述最多12字"
                    value={item.title} onChange={(e) => {
                    updateStore.setCooperationCaseTitle(e.currentTarget.value, index);
                  }} maxLength={12}/>
                </div>
              );
            })
          }
        </div>
      </div>
      }
    </div>
  );
};
