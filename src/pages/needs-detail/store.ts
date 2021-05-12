import { action, observable } from "mobx";
import {
  getPortalPostDetail,
} from "@utils/api";

class NeedDetailStore {
  @observable detailData: object;

  @action
  async getDetail({ portalPostGuid, userGuid }) {
    const { errorCode, result }: any = await getPortalPostDetail({ portalPostGuid, userGuid });
    if (errorCode === "200") {
      this.detailData = result;
      return { request: true };
    } else {
      return { result: result.errorMsg, request: false };
    }
  }

}

export default new NeedDetailStore();
