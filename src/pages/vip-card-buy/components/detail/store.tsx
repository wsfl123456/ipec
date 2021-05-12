import { action, observable } from "mobx";
import {
  eqCommodityDetail,
  setCreateOrder,
  setInitiatePayment,
  eqPayStatus
} from "@utils/api";
import { BaseStore } from "@stores/base-store";

interface ICommodityDetail {
  cardName: string;
  paymentAmount: number;
  actualAmount: number;
  cardPic: string;
}

class VipCardBuyDetailStore  {
  @observable userInfo;

  @observable commodityDetail: ICommodityDetail = {
    cardName: "",
    paymentAmount: 0,
    actualAmount: 0,
    cardPic: "",
  };

  @observable weChatPay = "";
  @observable alipay = "";
  @observable orderCode = "";

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };

  @action
  changePayCode = () => {
    this.weChatPay = '';
    this.alipay = '';
    this.orderCode = '';
  };

  @action
  setOrderCode = ({ orderCode = "" } = {}) => {
    this.orderCode = orderCode;
  };
  /**
   * 商品详情
   */
  @action
  async getCommodityDetail(cardGuid) {
    const {
      errorCode,
      result: data,
      errorMessage,
    }: any = await eqCommodityDetail({
      cardGuid,
    });
    this.commodityDetail = data.data;
  }
  /**
   * 提交订单
   */
  @action
  async createOrder({ cardGuid = "" } = {})  {
    const params = {
      userGuid: this.userInfo.userGuid,
      cardGuid,
      payPlatform: 1,
      addressGuid: "",
      isNeedPhysicalCard: 0,
    };
    const {
      result: { errorCode, data },
    }: any = await setCreateOrder(params);
    if (+errorCode === 200) {
      this.setOrderCode({ orderCode: data });
      this.getPayCode({ payMethod: 2 });
      this.getPayCode({ payMethod: 7 });
    }
  };
  /**
   * 获取支付二维码
   */
  @action
  async getPayCode({ payMethod = 0 } = {}) {
    const params = {
      userGuid: this.userInfo.userGuid,
      sn: this.orderCode,
      payMethod,
    };
    const {
      result: { data },
    }: any = await setInitiatePayment(params);
    if (payMethod === 2) this.weChatPay = data;
    if (payMethod === 7) this.alipay = data;
  };
  /**
   * 获取支付状态
   */
  @action
  getPayStatus = async () => {
    const params = {
        userGuid: this.userInfo.userGuid,
        sn: this.orderCode
    };
    const {
      result: data,
    }: any = await eqPayStatus(params);
    return { code: data.errorCode, errorMessage: data.errorMsg }
  };
}

export default new VipCardBuyDetailStore();
