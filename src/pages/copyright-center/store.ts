import { action, observable } from "mobx";
import {
  buyerOrderList,
  eqAddressList,
  eqListDistrict,
  reviewDesign,
  reviewSample,
  makeCollections,
  buyerOrderDetail
} from "@utils/api";
import _isEmpty from "lodash/isEmpty";
import { message } from 'antd';
import OrderDetailStore from "./components/detail/store"


interface IListParamState {
  userGuid: string;
  payStatue: string | number;
  type: number;
  currentPage: number;
  pageSize: number;
}

class CopyrightCenterStore {
  @observable imgShow: boolean = false;
  @observable refuseModal: boolean = false;
  @observable isPrompt: boolean = false;
  @observable collectionModal: boolean = false;
  @observable isNOCollection: boolean = true; //  授权交易完成-有无账户信息的状态

  @observable addressModal: boolean = false;

  @observable detailList: any = {}

  @observable orderList: any[] = [];
  @observable orderSn: string = "";

  @observable defaultAddress: any = {}; // 默认收货地址

  @observable listDistrict: any[]; // 省市区

  @observable feedback: ""; //审核拒绝理由

  @observable bigImgList: any[] = []; // 查看大图
  @observable listParams: IListParamState = {
    userGuid: "",
    payStatue: "",
    type: 2,
    currentPage: 1,
    pageSize: 10,
  };
  @observable isLoading: boolean = true;
  @observable seeMore = false;
  @observable noMore = false;

  @observable userGuid: string = "";

  @observable collectionParams = {
    cardholder: "",
    bankName: "",
    bankCardNo: "",
    cardholderPhone: "",
  };

  @action changecollectionParams = (params) => {
    this.collectionParams = {
      ...this.collectionParams,
      ...params,
    };
  }

  @action changeUserGuid = (userGuid) => {
    this.userGuid = userGuid;
  };

  @action
  changeOrderDetail = (orderSn) => {
    this.orderSn = orderSn;
  };

  // 订单详情
  @action
  async getOrderDetail(params) {
    const { errorCode, result }: any = await buyerOrderDetail(params);
    if (+errorCode === 200) {
      this.detailList = result.data;
      console.log("订单详情", result.data);
    }
  }

  // 大图弹窗是否显示
  @action
  changeImgShow(bole) {
    this.imgShow = bole;
  }

  // 监修不通过弹窗
  @action
  changeRefuseModal(bole) {
    this.refuseModal = bole;
    this.changeFeedback("");
    this.getOrderList()
  }

  // 样品通过-收款开票
  @action
  changeIsPrompt(bole) {
    this.isPrompt = bole;
  }

  // 无账户信息-申请开票 - 银行信息
  @action
  changeCollectionModal = (bole) => {
    this.collectionModal = bole;
  };

  // 填写地址
  @action
  changeAddressModal(bole) {
    this.getAddressList();
    this.addressModal = bole;
  }

  @action
  changeDefaultAddress = (params) => {
    this.defaultAddress = {
      ...this.defaultAddress,
      ...params,
    };
  };

  @action
  changeFeedback = (feedback) => {
    this.feedback = feedback;
  };

  // 订单列表
  @action
  async changeListParams(params) {
    this.listParams = { ...this.listParams, ...params };
    await this.getOrderList();
  }

  @action
  async getOrderList() {
    const {
      userGuid,
      payStatue,
      type,
      currentPage,
      pageSize,
    } = this.listParams;
    this.isLoading = true;
    const { errorCode, result }: any = await buyerOrderList({
      userGuid,
      payStatue,
      type,
      currentPage,
      pageSize,
    });
    if (+errorCode === 200) {
      currentPage === 1
        ? (this.orderList = result.data)
        : (this.orderList = [...this.orderList, ...result.data]);
      this.isLoading = _isEmpty(result.data);
      if (!_isEmpty(this.orderList)) {
        this.seeMore = true;
        this.noMore = false;
        if (result.data.length < pageSize) {
          this.isLoading = false;
          this.seeMore = false;
          this.noMore = true;
        }
      } else {
        this.seeMore = false;
        this.noMore = false;
      }
      // this.orderList.push(result.data[0]);
    }
  }

  /**
   * 获取省市区
   */
  @action
  getListDistrict = async () => {
    const { errorCode, result: data, errorMessage }: any = await eqListDistrict(
      {}
    );
    this.listDistrict = data.data;
  };

  /**
   * 地址列表
   */
  @action
  getAddressList = async () => {
    const { errorCode, result: data, errorMessage }: any = await eqAddressList({
      userGuid: this.userGuid,
      currentPage: 1,
      pageSize: 100,
    });
    this.defaultAddress = data.data.find((i) => i.isDefault === 1);
    this.getListDistrict();
  };
  /**
   * 审核设计稿
   */
  @action
  reviewDesign = async (params) => {
    const {
      result: { errorMsg, errorCode },
      errorMessage,
    }: any = await reviewDesign({
      ...{
        orderSn: this.orderSn,
        addressGuid: this.defaultAddress.addressGuid,
        consignee: this.defaultAddress.consignee,
        mobile: this.defaultAddress.mobile,
        address: this.defaultAddress.address,
        addressDetail: this.defaultAddress.addressDetail,
      },
      ...params,
    });
    if (+errorCode === 200) {
      this.addressModal = false;
      this.refuseModal = false;
      this.feedback = "";
      this.getOrderList()
      OrderDetailStore.buyerOrderDetail()
    }
    message.success(errorMsg)
    return { errorCode, errorMsg };
  };
  /**
   * 审核样品
   */
  @action
  reviewSample = async (params) => {
    const {
      result: { errorMsg, errorCode },
      errorMessage,
    }: any = await reviewSample({
      ...{
        orderSn: this.orderSn,
      },
      ...params,
    });
    if (+errorCode === 200) {
      this.refuseModal = false;
      this.feedback = "";
      this.getOrderList()
      OrderDetailStore.buyerOrderDetail()
    }
    message.success(errorMsg)
    return { errorCode, errorMsg };
  };
  /**
   * 申请开票
   */
  @action
  makeCollections = async (params) => {
    const {
      result: { errorMsg, errorCode },
      errorMessage,
    }: any = await makeCollections({
      ...{ orderSn: this.orderSn },
      ...this.collectionParams,
      ...params
    });
    if (+errorCode === 200) {
      this.collectionModal = false;
      this.collectionParams = {
        cardholder: "",
        bankName: "",
        bankCardNo: "",
        cardholderPhone: "",
      };
      this.getOrderList()
      OrderDetailStore.buyerOrderDetail()
    }
    message.success(errorMsg)
    return { errorCode, errorMsg };
  };
}

export default new CopyrightCenterStore();
