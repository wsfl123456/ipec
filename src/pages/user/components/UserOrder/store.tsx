import { action, observable } from "mobx";
import {
  eqMyOrder,
  eqOrderDetail,
  setInitiatePayment,
  eqPayStatus,
  eqCommodityDetail,
  reminderShipment,
  confirmReceipt,
  delOrder
} from "@utils/api";
import { BaseStore } from "@stores/base-store";

class UserOrderStore {
  @observable userInfo: any = {}

  @observable readonly tabsList: any = [
    {
      val: "",
      label: "所有订单",
    },
    {
      val: 0,
      label: "待支付",
    },
    {
      val: 1,
      label: "待发货",
    },
    {
      val: 2,
      label: "待收货",
    },
    {
      val: 3,
      label: "已完成",
    },
  ];

  @observable payStatue: any = "";

  @observable orderDetail: any = {};

  @observable orderList: any = [];

  @observable weChatPay: string = "";
  @observable alipay: string = "";
  @observable commodityDetail: any = {};
  @observable sn: string = "";

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };
  @action
  changePayStatue = (payStatue: any) => {
    this.payStatue = payStatue;
  };
  @action
  changePayCode = () => {
    this.weChatPay = "";
    this.alipay = "";
    this.commodityDetail = "";
    this.sn = ''
  };

  @action
  changeOrderDetail = () => {
    this.orderDetail = {};
  };
  @action
  setOrderCode = (sn) => {
    this.sn = sn
  };
  /**
   * 订单列表
   */
  @action
  eqMyOrder = async () => {
    const { result: data }: any = await eqMyOrder({
      userGuid: this.userInfo.userGuid,
      payStatue: this.payStatue,
      currentPage: 1,
      pageSize: 999,
    });
    this.orderList = data;
  };
  /**
   * 商品详情
   */
  @action
  getCommodityDetail = async (cardGuid) => {
    const { result: data }: any = await eqCommodityDetail({
      cardGuid,
    });
    this.commodityDetail = data.data;
  };
  /**
   * 订单详情
   */
  @action
  eqOrderDetail = async (sn) => {
    const {
      result: { data, errorCode },
    }: any = await eqOrderDetail({
      userGuid: this.userInfo.userGuid,
      sn,
    });
    this.orderDetail = data;
    return { errorCode };
  };
  /**
   * 获取支付二维码
   */
  @action
  getPayCode = async (obj) => {
    const params = {
      ...{
        userGuid: this.userInfo.userGuid,
      },
      ...obj,
    };
    const { result: data }: any = await setInitiatePayment(params);
    if (obj.payMethod === 2) this.weChatPay = data.data;
    if (obj.payMethod === 7) this.alipay = data.data;
  };
  /**
   * 获取支付状态
   */
  @action
  getPayStatus = async () => {
    const params = {
      userGuid: this.userInfo.userGuid,
      sn: this.sn,
    };
    const { result: data }: any = await eqPayStatus(
      params
    );
    return { code: data.errorCode, errorMessage: data.errorMsg };
  };
  /**
   * 提醒发货
   */
  @action
  reminderShipment = async (sn) => {
    const params = {
      userGuid: this.userInfo.userGuid,
      sn: sn || this.sn
    };
    const { result: {errorCode, errorMsg} }: any = await reminderShipment(
      params
    );
    return { code: errorCode, errorMsg };
  };
  /**
   * 确认收货
   */
  @action
  confirmReceipt = async (sn) => {
    const params = {
      userGuid: this.userInfo.userGuid,
      sn: sn || this.sn
    };
    const { result: {errorCode, errorMsg} }: any = await confirmReceipt(
      params
    );
    return { code: errorCode, errorMsg };
  };
  /**
   * 删除订单
   */
  @action
  delOrder = async () => {
    const params = {
      userGuid: this.userInfo.userGuid,
      sn: this.sn
    };
    const { result: {errorCode, errorMsg} }: any = await delOrder(
      params
    );
    return { code: errorCode, errorMsg };
  };
}

export default new UserOrderStore();
