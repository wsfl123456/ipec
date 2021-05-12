import { action, observable } from "mobx";
import { eqAddressList, setRemoveAddress, eqListDistrict, setSaveAddress } from "@utils/api";
import { BaseStore } from "@stores/base-store";

interface IAddressParams {
  consignee: string;
  mobile: string;
  address: any[] | string;
  addressDetail: string;
  postcode: string;
  isDefault: boolean | number;
  addressGuid?: string;
}

class UserShippingAddress  {
  @observable userInfo;

  @observable addressList: any[] = [];

  @observable curAddress: any = {};

  @observable listDistrict: any[] = [];

  @observable curPhone: string = '';

  @observable addressParams: IAddressParams = {
    consignee: "",
    mobile: "",
    address: [],
    addressDetail: "",
    postcode: "",
    isDefault: false,
  };

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };
  @action
  changecurPhone = () => {
    this.curPhone = ''
  };

  @action
  changeCurAddress = (params) => {
    this.curAddress = params;
  };

  @action
  changeAddressParams = (params, isChange = false) => {
    this.addressParams = { ...this.addressParams, ...params };
    if (isChange) this.curPhone = this.addressParams.mobile;
    // console.log(this.addressParams.mobile)
    // console.log(isChange)
    // console.log(this.curPhone)
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
   * 地址列表
   */
  @action
  getAddressList = async () => {
    const { result: data }: any = await eqAddressList({
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
   * 删除地址
   */
  @action
  setRemoveAddress = async () => {
    const {
      result: { errorCode: code, errorMsg },
    }: any = await setRemoveAddress({
      userGuid: this.userInfo.userGuid,
      addressGuid: this.curAddress.addressGuid,
    });
    return { code, errorMsg };
  };
}

export default new UserShippingAddress();
