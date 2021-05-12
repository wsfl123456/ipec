import { action, observable } from "mobx";
import {
  getPortalPostDetail,
  setPortalPostLike
} from "@utils/api";

class DetailStore {
  @action
  async getDetail({ portalPostGuid, userGuid }) {
    const { errorCode, result = {} }: any = await getPortalPostDetail({ portalPostGuid, userGuid });
    if (errorCode === "200") {
      return { result, request: true };
    } else {
      return { result: result.errorMsg, request: false };
    }
  }

  @action
  async setLike({ portalPostGuid, userGuid }) {
    const { errorCode, result = {} }: any = await setPortalPostLike({portalPostGuid, userGuid});
    if (errorCode === "200" && result.errorCode > 0) {
      return { result, request: true };
    } else {
      return { result: result.errorMsg, request: false };
    }
  }
}

export default new DetailStore();
