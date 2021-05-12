import { action, observable } from "mobx";
import { buyerOrderDetail, eqAddressList } from "@utils/api";

class OrderDetailStore {
  @observable userInfo: any = {};
  @observable orderDetail: any = {}
  @observable orderSn = "";

  @observable payStatue = "";

  @observable defaultAddress:any = {}

  @action changepayStatue = (status) => {
    this.payStatue = status
  }

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };
  @action
  changeOrderDetail = (orderSn) => {
    this.orderSn = orderSn;
  };

  @action buyerOrderDetail = async () => {
    const {
      result: {data}
    }: any = await buyerOrderDetail({
      userGuid: this.userInfo.userGuid,
      orderSn: this.orderSn,
    });
    this.orderDetail = data
    this.changepayStatue(data.payStatue)
  };
}

export default new OrderDetailStore();
