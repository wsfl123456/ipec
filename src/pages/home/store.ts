import { action, observable } from "mobx";
import { ipPublic, listMainType, reqBannerList, reqModuleList } from "@utils/api";

const moduleKV = {
  1: "coreProduct",
  2: "cooperateIp",
  4: "industryCase",
  5: "cooperatePartner",
};

class HomeStore {

  @observable slides: object[];
  // @observable modules: object[];

  @observable modules: object = {
    coreProduct: [],
    cooperateIp: [],
    industryCase: [],
    cooperatePartner: [],

  };
  @observable publicData: object[];
  @observable typeData: object[];

  @action
  async slideList() {
    let { errorCode, result }: any = await reqBannerList({ playformType: 2 });
    if (errorCode === "200") {
      this.slides = result;
    }
  }

  /*
 * 主页
 * @params
 *  moduleId: 模块ID,1核心产品、2热门IP推荐、4行业案例
 * moduleType:模块类型类型,1网站、2小程序
 */
  async moduleList(params) {
    let { errorCode, result }: any = await reqModuleList(params);
    if (errorCode === "200") {
      this.modules[moduleKV[params.moduleId]] = result;
    }
  }

  async getPublicIP(param) {
    let { errorCode, result }: any = await ipPublic(param);
    if (errorCode === "200") {
      this.publicData = result;
    }
  }

  async mediaType() {
    let { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      this.typeData = result;
    }
  }
}

export default new HomeStore();
