import { action, observable } from "mobx";
import {
  eqCommodityList,
} from "@utils/api";

class VipCardBuyStore {
  @observable commodityList: any[] = [];

  /**
   * 商品列表
   */
  @action
  async getCommodityList() {
    const {
      errorCode,
      result: data,
      errorMessage,
    }: any = await eqCommodityList({
      currentPage: 1,
      pageSize: 20,
    });
    this.commodityList = data;
  }
}

export default new VipCardBuyStore();
