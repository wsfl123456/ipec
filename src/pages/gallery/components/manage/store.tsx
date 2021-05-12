import { action, observable } from "mobx";
import {  getMyGallery, offonShelt, delGallery } from "@utils/api";

class GalleryManage {
  @observable userInfo;

  @observable auditStatus = "";

  @observable auditStatusList = [
    {
      id: "",
      name: "全部",
    },
    {
      id: 0,
      name: "待审核",
    },
    {
      id: 3,
      name: "审核通过（已上架）",
    },
    {
      id: 2,
      name: "未通过审核",
    },
    {
      id: 4,
      name: "已下架",
    },
  ];

  @observable myGallery = [];

  @action changeauditStatus = (auditStatus) => {
    this.auditStatus = auditStatus
  }

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };

  @action getMyGallery = async () => {
    const {
      result: { data },
    }: any = await getMyGallery({
      userGuid: this.userInfo.userGuid,
      auditStatus: this.auditStatus
    });
    this.myGallery = data;
  };

  @action offonShelt = async (galleryGuids, type) => {
    const {
      result: { errorMsg, errorCode },
    }: any = await offonShelt({
      galleryGuids,
      type
    });
    return {errorCode, errorMsg}
  };

  @action delGallery = async (galleryGuids) => {
    const {
      result: { errorMsg, errorCode },
    }: any = await delGallery({
      galleryGuids,
    });
    return {errorCode, errorMsg}
  };

  
}

export default new GalleryManage();
