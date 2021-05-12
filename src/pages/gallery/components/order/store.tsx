import { action, observable } from "mobx";
import {
  galleryDetail,
  getAuthorize,
  listCountry,
  getCompanytype,
  eqAddressList,
  eqListDistrict,
  setSaveAddress,
  setUpdateAddress,
  newOrder,
  getPayCode,
  eqGalleryPayStatus,
  downloadGallery,
} from "@utils/api";

interface IAddressParams {
  consignee: string;
  mobile: string;
  address: any[] | string;
  addressDetail: string;
  postcode: string;
  isDefault: boolean | number;
  addressGuid?: string;
}

class GalleryOrderStore {
  @observable userInfo;

  @observable galleryGuid = "";

  @observable galleryDetail = {};

  @observable addressList: any[] = [];

  @observable listDistrict = [];

  @observable orderParams = {
    addressGuid: "",
    productionQuantity: "",
    // securityCodePrice: ""
  };

  @observable curPhone: string = "";

  @observable addressParams: IAddressParams = {
    consignee: "",
    mobile: "",
    address: [],
    addressDetail: "",
    postcode: "",
    isDefault: false,
    addressGuid: "",
  };

  @observable sn = "";
  @observable weChatPay = "";
  @observable alipay = "";

  @action refreshData = () => {
    this.galleryGuid = "";
  };

  @action
  changegalleryGuid = (galleryGuid) => {
    this.galleryGuid = galleryGuid;
    this.galleryDetail = {};
    this.addressList = [];
    this.listDistrict = [];
    this.orderParams = {
      addressGuid: "",
      productionQuantity: "",
    };
    this.curPhone = "";
    this.addressParams = {
      consignee: "",
      mobile: "",
      address: [],
      addressDetail: "",
      postcode: "",
      isDefault: false,
      addressGuid: "",
    };
    this.sn = "";
    this.weChatPay = "";
    this.alipay = "";
  };

  @action
  changecurPhone = () => {
    this.curPhone = "";
  };

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };

  @action
  changeOrderParams = (params) => {
    this.orderParams = { ...this.orderParams, ...params };
    console.log(this.orderParams);
  };

  @action
  changeAddressParams = (params, isChange = false) => {
    this.addressParams = { ...this.addressParams, ...params };
    if (isChange) this.curPhone = this.addressParams.mobile;
  };

  @action
  changePayCode = () => {
    this.weChatPay = "";
    this.alipay = "";
    this.sn = "";
  };
  /**
   * 图库详情
   */
  @action
  getGalleryDetail = async () => {
    const {
      result: { data },
    }: any = await galleryDetail({
      galleryGuid: this.galleryGuid,
    });
    this.galleryDetail = data;
  };
  /**
   * 地址列表
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
    this.changeOrderParams({ addressGuid: this.addressList[0].addressGuid });
  };
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
   * 添加收货地址
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
   * 修改收货地址
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
  /**
   * 创建订单
   */
  @action
  newOrder = async (params) => {
    const {
      result: { data, errorMsg, errorCode },
    }: any = await newOrder(params);
    this.sn = data.orderSn;
    return {
      errorCode,
      data,
      errorMsg,
    };
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
    const { result: data }: any = await getPayCode(params);
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
    const { errorCode, result: data }: any = await eqGalleryPayStatus(params);
    return { code: data.errorCode, errorMessage: data.errorMsg };
  };
  /**
   * 下载源文件
   */
  @action
  downloadGallery = async () => {
    const params = {
      userGuid: this.userInfo.userGuid,
      galleryGuid: this.galleryGuid,
    };
    const {
      result: { data, errorCode, errorMsg },
    }: any = await downloadGallery(params);
    return { data, errorCode, errorMsg };
  };
}

export default new GalleryOrderStore();
