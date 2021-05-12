import * as React from "react";
import "@assets/scss/model.scss";
import ic_close from "assets/images/ic_close.svg";
import moment from 'moment';
import { inject } from 'mobx-react';

interface IModelProps extends IComponentProps {
  title: string,
  message?: string,
  data?: any,
  // ipid: number,
  onClose: Function,
  // onSubmit: Function,
  // onModel: Function,
}

@inject('update')
export default class Model extends React.Component<IModelProps> {
  render() {
    const {
      title,
      data,
      onClose,
      // onSubmit, onModel
    } = this.props;

    return (
      <div className="model model-download">
        <div className="model-container">
          <div className="model-header">
            <span className="model-title">{title}</span>
            <i className="close_model" onClick={() => {
              onClose();
            }}><img src={ic_close} alt=""/></i>
          </div>
          <div className="model-body">
            <div className="business-table">
              <table className="table  table-hover business-info">
                <thead>
                <tr>
                  <th style={{ width: '55%' }}>资料名称</th>
                  <th>上传时间</th>
                  {/*<th>状态</th>*/}
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                  data && data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.ipFile}</td>
                        <td>{moment(item.createDate).format('YYYY-MM-DD hh:mm:ss')}</td>
                        {/*{*/}
                        {/*item.fileStatus === 2 && <td>审核中</td>*/}
                        {/*}*/}
                        {/*{*/}
                        {/*item.fileStatus === 3 && <td>审核通过</td>*/}
                        {/*}*/}
                        {/*{*/}
                        {/*item.fileStatus === 4 && <td>审核拒绝</td>*/}
                        {/*}*/}
                        <td>
                          <a href={item.fileAddress} download>下载</a>
                        </td>
                      </tr>
                    )
                      ;
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
          <div className="model-footer">
            <input type="button" className="btn btn-submit" value="确定"
                   onClick={() => {
                     onClose();
                   }}/>
            <input type="button" className="btn btn-cancel" value="取消"
                   onClick={() => {
                     onClose();
                   }}/>
          </div>
        </div>
      </div>
    );
  }
};
