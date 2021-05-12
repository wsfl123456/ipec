import { action } from "mobx";
import { onCodeReg, onForgetPassWordNext } from "@utils/api";

class AuthenticationStore {
  @action
  async onForgetPassWordNext(params) {
    const { userLogin, code }: any = params;
    const { errorCode, result = {} }: any = await onForgetPassWordNext({ userLogin, code });
    if (errorCode === "200" && result.errorCode === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }

  }

  @action
  async onCodeReg(params) {
    const { userLogin, receiverType, sendType }: any = params;
    const { errorCode, result = {} }: any = await onCodeReg({ userLogin, receiverType, sendType });
    if (errorCode === "200" && result.errorCode === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

}

export default new AuthenticationStore();
