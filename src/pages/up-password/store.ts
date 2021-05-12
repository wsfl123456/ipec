import { action } from "mobx";
import { onForgetPassWord } from "@utils/api";

class UpPasswordStore {
  @action
  async onForgetPassWord(params) {
    const { userLogin, userPass, code }: any = params;
    const { errorCode, result = {} }: any = await onForgetPassWord({ userLogin, userPass, code });
    if (errorCode === "200" && result.errorCode === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

  @action
  async logout() {

  }

}

export default new UpPasswordStore();
