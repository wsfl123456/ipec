import * as React from 'react';
import { Link } from 'react-router-dom';
import 'assets/scss/download.scss';

export default class extends React.Component<IProps, IStatus> {

  async componentDidMount() {

  }

  render() {

    return (
      <div>
        <div className="download-content">
          <div className="download-controls-wrap flex justify-content-between ">
            <h4>批量下载队列（<span>0</span>）</h4>
            <div className="pull-right">
              <Link to="" className="go-back">返回</Link>
              <div className="download"><a href="javascript:void(0)">下载Excel表格</a></div>
            </div>
          </div>
          <div className="download-lists">
            <div className="download-list-wrap">
              <div className="download-list-top flex justify-content-between">
                <div className="pull-left">
                  <i className="checkbox iconfont iconfuxuankuangweixuanzhong"/>电影
                </div>
                <a href="javascript:void(0)" className="clear"><i
                  className=" iconfont iconlajitong "/>清空记录</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
