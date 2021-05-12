import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/vip_card_buy.scss";
import Toast from "@components/toast";
import { Link } from "react-router-dom";
import VipCardBuyPay from "../pay/pay";
import Address from "@assets/images/vip-card/address.png";
import Basedata from "@assets/images/vip-card/basedata.png";
import Assess from "@assets/images/vip-card/assess.png";
import Filter from "@assets/images/vip-card/filter.png";
import Compared from "@assets/images/vip-card/compared.png";
import BasedataEffect from "@assets/images/vip-card/basedata_effect.png";
import AssessEffect from "@assets/images/vip-card/assess_effect.png";
import FilterEffect from "@assets/images/vip-card/filter_effect.png";
import ComparedEffect from "@assets/images/vip-card/compared_effect.png";

import FilterEffect1 from "@assets/images/vip-card/filter_effect_1.png";
import FilterEffect2 from "@assets/images/vip-card/filter_effect_2.png";
import ComparedEffect1 from "@assets/images/vip-card/compared_effect_1.png";
import ComparedEffect2 from "@assets/images/vip-card/compared_effect_2.png";
import AssessEffect1 from "@assets/images/vip-card/assess_effect_1.png";
import AssessEffect2 from "@assets/images/vip-card/assess_effect_2.png";
import AssessEffect3 from "@assets/images/vip-card/assess_effect_3.png";
import BasedataEffect1 from "@assets/images/vip-card/basedata_effect_1.png";
import BasedataEffect2 from "@assets/images/vip-card/basedata_effect_2.png";
import BasedataEffect3 from "@assets/images/vip-card/basedata_effect_3.png";
import vip_card_buy_detail from '@pages/vip-card-buy/components/detail/store';

interface IVipCardBuyDetailState {
  privilegeList: any[];
  effectList: any[];
  showAddressModal: boolean;
  showToast: boolean;
  toastMsg: string;
}
@inject("vip_card_buy_detail", "login")
@observer
export default class VipCardBuyDetail extends React.Component<
  IProps,
  IVipCardBuyDetailState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      privilegeList: [
        {
          icon: Filter,
          name: "IP筛选器",
          intro:
            "根据项目设置的受众群体、微博粉丝量及关键词，查看推荐多个IP的匹配度、风险评估、热度&知名度、商业价值、推荐指数等 ",
          price: "IP筛选器查询300元/次",
        },
        {
          icon: Compared,
          name: "IP对比数据  ",
          intro: "多个同类型IP的基础数据和评估数据的对比 ",
          price: "IP对比数据查询150元/次",
        },
        {
          icon: Assess,
          name: "IP评估数据  ",
          intro:
            "受众画像（粉丝年龄比例、性别比例）/地区分布/商业价值/关键词云  ",
          price: "IP评估数据查询50元/次",
        },
        {
          icon: Basedata,
          name: "IP基础数据  ",
          intro:
            "数据总览/播放趋势/口碑信息互动指数/粉丝趋势/院线票房发布平台/搜索指数/媒体关注度 ",
          price: "IP基础数据查询5元/次",
        },
      ],
      effectList: [
        {
          url: FilterEffect,
          name: "IP筛选器作用:",
          list: [
            {
              icon: FilterEffect1,
              text:
                "根据你的需求进行快速IP过滤，帮你在海量IP库内大浪淘金，让你的IP投资又快又准。",
            },
            {
              icon: FilterEffect2,
              text:
                "多维度大数据推荐，数万IP滚动匹配，在你的需求范围内更多一些选择，让你的IP投资更具理性、更具高投资回报比。",
            },
          ],
        },
        {
          url: ComparedEffect,
          name: "IP对比数据作用:",
          list: [
            {
              icon: ComparedEffect1,
              text:
                "多重数据，综合对比，全方位反应市场行业动向，帮你快速看清相似IP关键信息概况；",
            },
            {
              icon: ComparedEffect2,
              text:
                "明确IP优势指数，多维度比较多款竞品IP重点指数表现，让你直观看清多款同类型竞品IP谁市场表现更突出。",
            },
          ],
        },
        {
          url: AssessEffect,
          name: "IP评估数据作用:",
          list: [
            {
              icon: AssessEffect1,
              text:
                "大数据呈现IP用户画像，可视化读懂IP消费者，让你的IP推广更具针对性、更具效果；",
            },
            {
              icon: AssessEffect2,
              text:
                "智能分析IP在市场内分布情况，让你提前解锁IP卖点，帮你的IP营销更优化更具精准性，更大限度实现IP变现；",
            },
            {
              icon: AssessEffect3,
              text:
                "提供IP关键词云研究，帮你把脉IP受众需求，让你全面掌握市场卖点。",
            },
          ],
        },
        {
          url: BasedataEffect,
          name: "IP基础数据作用:",
          list: [
            {
              icon: BasedataEffect1,
              text:
                "聚合全网数据，让你一站式掌握IP关键指数，节约你的时间成本；",
            },
            {
              icon: BasedataEffect2,
              text:
                "主流平台数据对比，让你对IP市场行情一目了然，帮你快速判断IP产品化可行性；",
            },
            {
              icon: BasedataEffect3,
              text:
                "IP粉丝趋势展现，帮你看透每一个IP需求，让你轻松把控IP市场定位。",
            },
          ],
        },
      ],
      showAddressModal: false,
      showToast: false,
      toastMsg: "",
    };
  }

  visibleAddressModal(bol) {
    this.setState({
      showAddressModal: bol,
    });
  }

  createOrder(cardGuid) {
    this.visibleAddressModal(false);
    this.props.vip_card_buy_detail.createOrder({ cardGuid });
  }

  async componentDidMount() {
    const {
      vip_card_buy_detail,
      login,
      match: { params },
    } = this.props;
    vip_card_buy_detail.changeUserInfo(login.userInfo);
    await vip_card_buy_detail.getCommodityDetail(unescape(params["cardId"]));

    this.props.vip_card_buy_detail.changePayCode();
  }

  render() {
    const {
      vip_card_buy_detail,
      match: { params },
    } = this.props;
    const {
      commodityDetail,
      weChatPay,
      alipay,
      getPayStatus,
      changePayCode,
      userInfo
    } = vip_card_buy_detail;
    const cardId = unescape(params["cardId"]);
    return (
      <div className="vip-card vip-card-buy-detail">
        <div className="detail">
          <img src={commodityDetail.cardPic} alt="" />
          <div>
            <div className="name">
              {!!commodityDetail && commodityDetail.cardName}
            </div>
            <div className="address">
              <span className="label">发货</span>
              <span className="icon">
                <img src={Address} alt="" />
                上海
              </span>
              <span>快递：快递包邮</span>
            </div>
            <div className="service">
              <span className="label">服务</span>
              <span>付款后5天内发货，本商品不支持退换</span>
            </div>
            <div className="price">
              <span>
                限时优惠价：
                <span className="new">
                  ¥ <span>{commodityDetail.paymentAmount}</span>
                </span>
              </span>
              {!!commodityDetail.actualAmount && (
                <span>
                  原价：
                  <del className="old">¥ {commodityDetail.actualAmount}</del>
                </span>
              )}
            </div>
            <button
              className="btn_primary_fl"
              onClick={() => this.visibleAddressModal(true)}
            >
              立即购买
            </button>
          </div>
        </div>

        <div className="intro">
          <div className="title">商品使用说明</div>
          <div className="content">
            <div>
              IP二厂数据权限储值卡，仅限「IP二厂」官网、小程序、APP平台客户端客户查询4大VIP数据（IP基础数据、IP评估数据、IP对比数据、IP筛选器）使用；
              <span className="red">
                每次查询数据，系统将从储值卡中自动扣取不同数据相对应金额
              </span>
              ；卡内金额须在购买后<span className="red">1年内</span>消费完毕。
            </div>
            <div className="privilege">
              <div>使用特权及扣费基准：</div>
              <div className="list">
                {this.state.privilegeList.map((i, k) => (
                  <div className="item" key={k}>
                    <img src={i.icon} alt="" />
                    <div className="name">{i.name}</div>
                    <div className="text">{i.intro}</div>
                    <div className="price">{i.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="effect">
              {this.state.effectList.map((i, k) => (
                <div className="item" key={k}>
                  <img
                    className={k !== 3 ? "border-bottom-dashed" : ""}
                    src={i.url}
                    alt=""
                  />
                  <div>
                    <div className="name">{i.name}</div>
                    <div className="text">
                      {i.list.map((child, childK) => (
                        <div key={childK}>
                          <img src={child.icon} alt="" />
                          <div>{child.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {this.state.showAddressModal && (
          <div className="vip-card-buy-detail-modal">
            <div className="area">
              <div className="banner"></div>
              <div className="title">是否需要邮寄邮寄实体卡？</div>
              <div className="text">
                <div>购买后，储值卡里金额将自动与登录账号绑定</div>
                <div>
                  每次查看VIP数据，系统将自动扣取不同数据权限相对应的金额；
                </div>
                <div>实体卡仅保留纪念意义。</div>
              </div>
              <div className="bth-group">
                <div
                  className="btn_primary_fl"
                  onClick={() => this.createOrder(unescape(params["cardId"]))}
                >

                  不需要
                </div>
                <div className="btn_default_fl">
                  <Link to={`/vip-card-buy-order/${cardId}`}>需要</Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.showToast && (
          <Toast
            onClose={() => {
              this.setState({ showToast: false });
            }}
            duration={2}
            message={this.state.toastMsg}
          />
        )}
        {!!weChatPay && !!alipay && (
          <VipCardBuyPay
            weChatPay={weChatPay}
            alipay={alipay}
            getPayStatus={getPayStatus}
            commodityDetail={commodityDetail}
            closeModal={changePayCode}
            history={this.props.history}
            vm={this}
          />
        )}
      </div>
    );
  }
}
