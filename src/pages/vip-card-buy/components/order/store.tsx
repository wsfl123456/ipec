import { action, observable } from "mobx";
import {
  eqCommodityList,
  eqCommodityDetail,
  eqAddressList,
  setSaveAddress,
  setUpdateAddress,
  eqListDistrict,
  eqConfirmOrder,
  setCreateOrder,
  setInitiatePayment,
  eqPayStatus
} from "@utils/api";
import _isEmpty from "lodash/isEmpty";
import { BaseStore } from "@stores/base-store";

interface ICommodityDetail {
  cardName: string;
  paymentAmount: number;
  actualAmount: number;
  cardPic: string;
}

interface IAddressParams {
  consignee: string;
  mobile: string;
  address: any[] | string;
  addressDetail: string;
  postcode: string;
  isDefault: boolean | number;
  addressGuid?: string;
}

class VipCardBuyOrderStore  {
  @observable userInfo;

  @observable commodityDetail: ICommodityDetail = {
    cardName: "",
    paymentAmount: 0,
    actualAmount: 0,
    cardPic: "",
  };

  @observable addressList: any[] = [];

  @observable listDistrict: any[] = [];

  @observable addressParams: IAddressParams = {
    consignee: "",
    mobile: "",
    address: [],
    addressDetail: "",
    postcode: "",
    isDefault: false,
  };

  @observable orderParams = {
    selectedId: 0,
  };

  @observable confirmOrderInfo: any[] = [];
  @observable curPhone: string = '';

  @observable weChatPay = "";
  @observable alipay = "";
  @observable orderCode = "";

  @action
  changecurPhone = () => {
    this.curPhone = ''
  };

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };
  /**
   *
   */
  @action
  changeAddressParams = (params, isChange= false) => {
    this.addressParams = { ...this.addressParams, ...params };
    if (isChange) this.curPhone = this.addressParams.mobile;
    console.log(this.curPhone)
    console.log(this.addressParams.mobile)
    console.log(this.addressParams.addressGuid)

  };
  /**
   *
   */
  @action
  changeOrderParams = (params) => {
    this.orderParams = { ...this.orderParams, ...params };
  };

  @action
  changePayCode = () => {
    this.weChatPay = '';
    this.alipay = '';
    this.orderCode = '';
  };

  @action
  setOrderCode = (params) => {
    this.orderCode = params.orderCode
  };
  /**
   * ????????????
   */
  @action
  async getCommodityDetail(cardGuid) {
    const {
      result: data,
    }: any = await eqCommodityDetail({
      cardGuid,
    });
    this.commodityDetail = data.data;
  }
  /**
   * ????????????
   */
  @action
  getAddressList = async () => {
    const { errorCode, result: data, errorMessage }: any = await eqAddressList({
      userGuid: this.userInfo.userGuid,
      currentPage: 1,
      pageSize: 100,
    });
    const index = data.data.findIndex((i) => i.isDefault === 1);
    if (index !== -1) {
      const item = data.data.splice(index, 1);
      data.data.unshift(item[0]);
    }
    this.addressList = data.data;
    this.changeOrderParams({ selectedId: this.addressList[0].addressGuid });
  };
  /**
   * ???????????????
   */
  @action
  async getListDistrict() {
    const { errorCode, result: data, errorMessage }: any = await eqListDistrict(
      {}
    );
    this.listDistrict = data.data;
  }
  /**
   * ????????????
   */
  @action
  ConfirmOrder = async (cardGuid) => {
    const { errorCode, result: data, errorMessage }: any = await eqConfirmOrder(
      {
        userGuid: this.userInfo.userGuid,
        cardGuid,
      }
    );
    this.commodityDetail = data.data;
    this.confirmOrderInfo = [
      { title: "????????????", val: data.data.cardName, img: data.data.cardPic },
      { title: "??????", val: `??${data.data.actualAmount}` },
      { title: "??????", val: 1 },
      {
        title: "????????????",
        val: `??????${data.data.discount * 10}???`,
        discount: `-??${data.data.actualAmount - data.data.paymentAmount}`,
      },
      { title: "??????", val: `??${data.data.paymentAmount}` },
    ];
  }
  /**
   * ????????????
   */
  @action
  createOrder = async (obj) => {
    const params = {
      ...{
        userGuid: this.userInfo.userGuid,
        addressGuid: this.orderParams.selectedId,
        payPlatform: 1,
      },
      ...obj,
    };
    const { errorCode, result: data, errorMessage }: any = await setCreateOrder(
      params
    );
    return { errorCode, errorMessage: errorMessage || data.errorMsg, data };
  };
  /**
   * ?????????????????????
   */
  @action
  getPayCode = async (obj) => {
    const params = {
      ...{
        userGuid: this.userInfo.userGuid,
      },
      ...obj,
    };
    const {
      result: data,
    }: any = await setInitiatePayment(params);
    if (obj.payMethod === 2) this.weChatPay = data.data;
    if (obj.payMethod === 7) this.alipay = data.data;
  };
  /**
   * ??????????????????
   */
  @action
  getPayStatus = async () => {
    const params = {
        userGuid: this.userInfo.userGuid,
        sn: this.orderCode
    };
    const {
      errorCode,
      result: data,
    }: any = await eqPayStatus(params);
    return { code: data.errorCode, errorMessage: data.errorMsg }
  };
  /**
   * ??????????????????
   */
  @action
  saveAddress = async () => {
    const params = {
      ...this.addressParams,
      userGuid: this.userInfo.userGuid,
    };

    if (!!params.isDefault) params.isDefault = 1;
    else params.isDefault = 0;

    if (Array.isArray(params.address)) params.address = params.address.join();

    const { errorCode, result: data, errorMessage }: any = await setSaveAddress(
      params
    );

    return { errorCode, errorMessage: errorMessage || data.errorMsg };
  };
  /**
   * ??????????????????
   */
  @action
  updateAddress = async () => {
    const params = {
      ...this.addressParams,
      userGuid: this.userInfo.userGuid,
    };

    if (!!params.isDefault) params.isDefault = 1;
    else params.isDefault = 0;

    if (Array.isArray(params.address)) params.address = params.address.join();

    const {
      errorCode,
      result: data,
      errorMessage,
    }: any = await setUpdateAddress(params);

    return { errorCode, errorMessage: errorMessage || data.errorMsg };
  };
}

export default new VipCardBuyOrderStore();
