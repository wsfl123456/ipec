import { action, observable } from "mobx";
import {
  getGalleryList,
  getAuthorize,
  listCountry,
  getCompanytype,
} from "@utils/api";

class GalleryIndexStore {
  @observable userInfo;
  @observable galleryList: any[] = [];
  @observable authorizeList: any[] = [];
  @observable countryList: any[] = [];
  @observable labelRadioList: any[] = [];

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };
  /**
   * 图库列表
   */
  @action
  GalleryList = async (params) => {
    const {
      result: {
        data: { data },
      },
    }: any = await getGalleryList({
      ...{
        userGuid: this.userInfo.userGuid,
        currentPage: 1,
        pageSize: 20,
      },
      ...params,
    });

    this.galleryList = data;
  };
  /**
   * 授权品类
   */
  @action
  getAuthorizeList = async () => {
    const { result }: any = await getAuthorize(4);
    this.authorizeList = [...[{ typeName: "全部", typeGuid: "" }], ...result];
  };
  /**
   * 授权区域
   */
  @action
  getCountryList = async () => {
    const { result }: any = await listCountry();
    const resultMap = result.map((e) => ({
      resourceValue: e.resourceValue,
      id: e.resourceValue,
    }));
    this.countryList = [...[{ resourceValue: "全部", id: "" }], ...resultMap];
  };
  /**
   * 标签
   */
  @action
  getLabelRadio = async () => {
    const { result }: any = await getCompanytype(14);
    const resultMap = result.map((e) => ({
      resourceValue: e.resourceValue,
      id: e.resourceValue,
    }));
    this.labelRadioList = [...[{ resourceValue: "全部", id: "" }], ...resultMap];
  };
}

export default new GalleryIndexStore();
