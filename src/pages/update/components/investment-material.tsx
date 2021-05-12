import { delMaterial } from "@utils/api";
import { message } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import moment from "moment";
import { toJS } from 'mobx';

export default ({
                  updateStore,
                  investmentList, ipId,
                  userGuid, type,
                }:
                  {
                    updateStore: IUpdateStore, investmentList: any[], ipId: string,
                    userGuid: string, type: number,
                  }) => {
  return (
    <div className="rightIPInvestment">
      <div className="rightIPInvestmentTitle">招商资料</div>
      <div className="rightIPInvestmentText">注：文件格式支持PPT、Excel、PDF，单个文件大小限制在50M内</div>
      <div className="rightIPInvestmentBtn">上传资料</div>
      <input
        type="file"
        accept=".zip,.ppt,.pptx,.pptm,.ppsx,.ppsx,.potx,.xlsx,.xlsm,.xlsm,.xltm,.xlsb,.xlam,.pdf"
        className="rightIPInvestmentBtnFile"
        onChange={(e) => updateStore.uploadInvestment(e.target.files[0], userGuid, ipId, type)}/>
      <div className="rightIPInvestmentTable">
        <div className="tableTitle">
          <div className="tableTitle1">资料名称</div>
          <div className="tableTitle2">上传时间</div>
          <div className="tableTitle3">操作</div>
        </div>
        {(investmentList || []).map((item, index) => {
          return (
            <div className="tableText" key={index}>
              <div className="tableText1">{item.ipFile}</div>
              <div className="tableText2">
                {item.createDate ? moment(item.createDate).format('Y-M-D h:m:s') : item.createDateStr}
              </div>
              <div className="tableText3">
                {ipId
                  ? <span onClick={async () => {
                    const { errorCode, result }: any = await delMaterial({
                      userGuid,
                      materialGuid: item.ipMaterialGuid
                    });
                    if (errorCode === "200" && result.errorCode === 200) {
                      message.success("商务资料删除成功！");
                    }
                    updateStore.deleteInvestmentList(index);
                  }}>删除</span>
                  : <div>
                    <span
                      onClick={() => {
                        window.open(item.fileAddress);
                      }}>下载</span>
                    <span
                      onClick={async () => {
                        const { errorCode, result }: any = await delMaterial({
                          userGuid,
                          materialGuid: item.ipMaterialGuid
                        });
                        if (errorCode === "200" && result.errorCode === 200) {
                          message.success("商务资料删除成功！");
                        }
                        updateStore.deleteInvestmentList(index);
                      }}>删除</span>
                  </div>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
