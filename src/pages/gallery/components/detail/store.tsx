import { action, observable } from "mobx";
import { getGalleryList, galleryDetail, galleryDetailFilter } from "@utils/api";

class GalleryDetail {
  @observable userInfo;

  @observable galleryGuid;

  @observable galleryDetail: any = {};

  @observable galleryFilterParams = {
    authorizeType: "",
    duration: "",
    productionQuantityMin: "",
    productionQuantityMax: "",
  };

  @observable galleryFilter: any = {
    authorizeTypeList: [],
    durationList: [],
    productionQuantityList: [],
    prices: "",
  };

  @action refreshData = () => {
    this.galleryDetail = {};

    this.galleryFilterParams = {
      authorizeType: "",
      duration: "",
      productionQuantityMin: "",
      productionQuantityMax: "",
    };

    this.galleryFilter = {
      authorizeTypeList: [],
      durationList: [],
      productionQuantityList: [],
      prices: "",
    };
  };

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };
  @action
  changegalleryGuid = (galleryGuid) => {
    this.galleryGuid = galleryGuid;
  };

  @action
  changegalleryFilterParams = (prop, val) => {
    switch (prop) {
      case "productionQuantity":
        const [productionQuantityMin, productionQuantityMax] = val.split("-");
        if (
          this.galleryFilterParams.productionQuantityMax ===
            productionQuantityMax &&
          this.galleryFilterParams.productionQuantityMin ===
            productionQuantityMin
        ) {
          this.galleryFilterParams.productionQuantityMax = "";
          this.galleryFilterParams.productionQuantityMin = "";
        } else {
          this.galleryFilterParams.productionQuantityMax = productionQuantityMax;
          this.galleryFilterParams.productionQuantityMin = productionQuantityMin;
        }

        break;
      default:
        if (this.galleryFilterParams[prop] === val) {
          this.galleryFilterParams[prop] = "";
        } else {
          this.galleryFilterParams[prop] = val;
        }

        break;
    }
    this.galleryDetailFilter();
  };
  /**
   * 图库详情
   */
  @action
  async getGalleryDetail() {
    const {
      result: { data },
    }: any = await galleryDetail({
      galleryGuid: this.galleryGuid,
    });
    this.galleryDetail = data;
  }
  /**
   * 图库详情筛选
   */
  @action
  async galleryDetailFilter() {
    const {
      result: { data },
    }: any = await galleryDetailFilter({
      ...{ galleryGuid: this.galleryGuid },
      ...this.galleryFilterParams,
    });
    this.galleryFilter = data;
  }
}

export default new GalleryDetail();
