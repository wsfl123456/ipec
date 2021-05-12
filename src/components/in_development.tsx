import * as React from "react";
import "@assets/scss/in_development.scss";
import qr_code from '@assets/images/ip_detail/ic_default_page.png';

export default class InDevelopment extends React.Component {
  render() {
    return (
      <div className="in-development">
        <img src={qr_code} alt=""/>
        <p>该模块正在内测中，请点击右侧在线咨询，联系客服</p>
      </div>
    );
  }
};
