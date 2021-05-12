import { action, observable } from "mobx";
import { frontendPersonalSpaceInfo, frontendPersonalVisitor } from "@utils/api";
import { message } from "antd";

class PersonalStore {
  @observable personalInfo: object = {};
  @observable visitorList: object[] = [];

  @action
  async getPersonalInfo(id: string) {
    const { userGuid } = JSON.parse(localStorage.getItem("user")) || { userGuid: '' };
    const { result, errorCode, errorMessage }: any = await frontendPersonalSpaceInfo(userGuid, id);
    if (errorCode !== '200') {
      message.error(errorMessage);
    } else if (result.errorCode === 200) {
      this.personalInfo = result.data;
    }
  }

  /**
   * 获取 获取前台最近访客1.0
   */
  @action
  async getPersonalVisitor(id: string) {
    const { result, errorCode, errorMessage }: any = await frontendPersonalVisitor(id);
    if (errorCode !== '200') {
      console.log('test');
      message.error(errorMessage);
    } else {
      this.visitorList = result.data;
    }
  }
}

export default new PersonalStore();
