import { action, observable } from "mobx";
import { edMyCards, edMyCardsRecord, eqActivationCard } from "@utils/api";
import { BaseStore } from "@stores/base-store";

class UserVipCardStore  {
  @observable userInfo;

  @observable myCardsList: any[] = [];

  @observable selectedRecord: any[] = [];

  @observable selectedCard = {};

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };

  @action setSelectedCard = (params) => {
    this.selectedCard = params;
  };

  @action clearCard = () => {
    this.selectedCard = {};
    this.selectedRecord = [];
  };

  /**
   * 我的卡包
   */
  @action
  edMyCards = async () => {
    const { result: data }: any = await edMyCards({
      userGuid: this.userInfo.userGuid,
      currentPage: 1,
      pageSize: 100,
    });
    this.myCardsList = data;
  };
  /**
   * 消费记录
   */
  @action
  edMyCardsRecord = async (cardNo) => {
    const { result: data }: any = await edMyCardsRecord({
      cardNo,
      currentPage: 1,
      pageSize: 100,
    });
    this.selectedRecord = [...data];
  };
  /**
   * 激活卡
   */
  @action
  eqActivationCard = async (cardNo) => {
    const { result: { errorCode, errorMsg } }: any = await eqActivationCard({
      userGuid: this.userInfo.userGuid,
      cardNo,
    });
    return { errorCode, errorMsg }
  };
}

export default new UserVipCardStore();
