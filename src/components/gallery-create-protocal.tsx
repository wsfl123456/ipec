import * as React from "react";
import "@assets/scss/vip-card-protocol.scss";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";

export default class GalleryCreateProtocal extends React.Component<any> {
  render() {
    const { closeProtocol } = this.props;

    return (
      <div className="vip-card-protocol">
        <div className="vip-card-protocol_area">
          <div className="name">
            <span>图库商业授权协议</span>
            <img
              src={Ic_clear}
              onClick={() => {
                closeProtocol();
              }}
              alt=""
            />
          </div>
          <div className="content">
            <div>
              酷拓文化交流（上海）有限公司（以下简称IP二厂）与您（以下或称客户）双方通过友好协商，就您向IP二厂提供上传编号为_______________的图片素材（以下简称素材），经由IP二厂平台对外进行商业授权，达成以下协议：
            </div>
            <div className="header">一、图片使用范围</div>
            <div>
              1.1 IP二厂可以按照本协议约定在如下授权范围使用您的素材进行宣展示：
              <div>(1)IP二厂平台、广告或宣传印刷品。</div>
              <div>(2)电子网络出版物（网页，电子书，电子杂志）。</div>
              <div>(3)报刊和出版物。</div>
              <div>(4)各类文档（说明书，演示文件）。</div>
              <div>(5)产品包装和外观设计。</div>
              <div>(6)影视，动画，在线视频，游戏。</div>
              <div>(7)展览展示终端及物料。</div>
              <div>(8)电子相册及实体相册的封页及里页、印刷样书。</div>
            </div>

            <div className="header">二、双方的责任和义务</div>
            <div>IP二厂的责任和义务</div>
            <div>
              2.1
              IP二厂承诺对您提供的素材仅限于合同约定的范围内使用，授权程序均经IP二厂平台操作，IP二厂不负责直接或间接向第三方转供素材，不参与授权过程；
            </div>
            <div>
              2.2 IP二厂将在您或您的授权活动牵涉到的第三方提出合理要求时，依法披露后台授权过程数据。
            </div>
            <div>您的责任和义务</div>
            <div>2.3 您允许IP二厂在本合同约定的条件下使用乙方提供的素材；</div>
            <div>
              2.4 您对所提供素材保证不出现版权问题。若在著作权问题上与第三方发生纠纷，责任由您全权承担并负责解决。 
            </div>
            <div className="header">三、费用及结算方式</div>
            <div>
              3.1您通过IP二厂平台进行本素材的对外授权，IP二厂按照单笔授权费用的10%收取平台服务费。
            </div>
            <div>
              3.2IP二厂收取的平台服务费将在您收到的本素材被授权方支付费用中扣除。
            </div>
            <div>
              3.3本素材涉及的授权流程全部结束后，您将收到扣除了平台服务费用的授权费。
            </div>
            <div className="header">四、其他</div>
            <div>
              您承诺如果因您违反本协议或者与经由IP二厂达成的授权协议造成IP二厂损失的，IP二厂有权向你追究法律责任。
            </div>

            <div></div>
          </div>
        </div>
      </div>
    );
  }
}
