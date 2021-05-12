import * as React from 'react';
import ic_clear from '@assets/images/ic_clear.png';
import success_icon from '@assets/images/success-icon.png';
import { inject, observer } from 'mobx-react';

@inject('copyrightCenter')
@observer
export default class Prompt extends React.Component<any, any> {

  render() {
    const { copyrightCenter } = this.props;
    return (
      <div className={`promptPerfectModal ${ copyrightCenter.isPrompt ? "show" : "hide"}`}>
        <div className="area">
          <img className="clear"
            onClick={() => copyrightCenter.changeIsPrompt(false)}
               alt="" src={ic_clear}
          />
          <div className="head">
            <img src={success_icon} alt=""/>
            <p className="head-title">样品审核通过！</p>
          </div>
          <div className="body">
            <p className="body-title">
              实物样品已通过审核，买家将进入商品量产阶段，线上授权交易已完成；
            </p>
            <p className="body-title">
              该笔订单授权费（根据授权协议，平台将扣除10%的服务费）平台将在收到发票后7个工作日内打到您指定银行账户 。
            </p>
            <div className="body-content">
              <p className="body-content__title">发票信息</p>
              <p className="body-content__line">
                <span>发票类型： </span>增值税专用发票
              </p>
              <p className="body-content__line">
                <span>发票抬头： </span>酷拓文化交流（上海）有限公司
              </p>
              <p className="body-content__line">
                <span>纳税识别号： </span>91310118MA1JL55KXL
              </p>
              <p className="body-content__line">
                <span>开户银行： </span>中国建设银行天山支行
              </p>
              <p className="body-content__line">
                <span>银行账户： </span>6217 0038 1002 6896 707
              </p>
              <p className="body-content__line">
                <span>地址/电话 ： </span>上海市长宁区天山路1900号910 /Kelly(收）/13814678960
              </p>

            </div>

          </div>
          <div className="foot">
            <div onClick={() => {
              // this.setState({ showTips: true });
            }}>开票收款
            </div>
          </div>
        </div>
      </div>
    );
  }
}
