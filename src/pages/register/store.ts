import { action } from "mobx";
import { onCodeReg, onNewRegister } from "@utils/api";

class RegisterStore {
  @action
  async onRegister(params) {
    // const { userLogin, code, userPass }: any = params; 
    const { errorCode, result = {} , errorMessage}: any = await onNewRegister(params); 
    if (errorCode === "200" ) { 
      if (result.errorCode === 200){
        return { message: result.errorMsg , request: true};
      } else {
        return { message: result.errorMsg , request: false};
      }
    } else  { 
      return { message: errorMessage , request: false};
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

export default new RegisterStore();
