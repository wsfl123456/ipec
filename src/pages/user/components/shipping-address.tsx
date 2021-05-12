import * as React from 'react';
import { withRouter } from 'react-router-dom';
import '@assets/scss/shipping-address.scss';

class ShippingAddress extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
  }

  render() {
    return (
      <div className="address-content">
        <p className="content-title">收货地址</p>
        <div className="content-box">
          <div className="content-box-header align-items-center">
            <span className="header-button">新增收货地址</span>
            <p>您已创建了<i>0</i>个收货地址,最多可创建<i>5</i>个</p>
          </div>
          <div className="content-box-frame">
            <p className="align-items-center">薛琦 <span>默认地址</span></p>
            <p>联系方式: <span>177****8990</span></p>
            <p>所在地区: <span>上海浦东</span></p>
            <p>详细地址: <span>乳山二村100号</span></p>
            <div className="align-items-center">邮政编码: <span>201900</span>
              <div className="frame-operation ">
                <span>设为默认地址</span>
                <span>修改</span>
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ShippingAddress);
