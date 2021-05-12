import { action } from "mobx";
import { reqLogin } from "@utils/api";
import { setTimeLoginSetion } from "@utils/util";
import { BaseStore } from "@stores/base-store";

class LoginStore extends BaseStore {
  @action
  async doLogin(params) {
    const { remember }: any = params;
    const { errorCode, result = {}, errorMessage }: any = await reqLogin(params);
    // const { errorCode, result = {}, errorMessage }: any = await reqLogin({params});
    if (errorCode === "200") {
      if (result.errorCode === 200) {
        if (remember) {
          await setTimeLoginSetion(JSON.stringify(result.data));
        }
        localStorage.setItem("user", JSON.stringify(result.data));
        this.updateUser(result.data);
        return { message: result.errorMsg, request: true };
      } else {
        return { message: result.errorMsg, request: false };
      }
    } else if (result.errorCode < 0) {
      return { message: errorMessage, request: false };
    }
  }

  @action
  async logout() {
    localStorage.clear();
    localStorage.clear();
    this.userInfo = null;
  }

  @action
  updateUser(data) {
    this.userInfo = data;
  }

  @action
  setStorage(key, value) {
    let curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ data: value, time: curTime }));
  }

  @action
  getStorage(key, exp) {
    let data = localStorage.getItem(key);
    let dataObj = JSON.parse(data);
    if (new Date().getTime() - dataObj.time > exp) {
      console.log('信息已过期');
    } else {
      return JSON.parse(dataObj.data);
    }
  }
}

export default new LoginStore();
