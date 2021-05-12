import { action, observable } from "mobx";
import {
  frontendCompanySpaceInfo,
  frontendPersonalVisitor,
  getMyIp,
  getMyPortalPost,
  myStaff,
  updateFocus,
} from '@utils/api';
import { message } from "antd";
import _uniqWith from 'lodash/uniqWith';
import _isEquel from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';

class BusinessStore {
  @observable userCompanyInfo: object = {
    picUrl: '',
    companyAbbreviation: '',
    companyName: '',
    realStatus: 0,
  };
  @observable slides: object[];
  @observable visitorList: object[];
  @observable myIpList: object[];
  @observable myPortalPostData: object[];
  @observable myStaffData: object[];
  @observable isLoading: boolean = true; // loading
  @observable isLoading2: boolean = true;
  @observable isLoading3: boolean = true;

  @observable flag: boolean = true; // 暂无数据
  @observable flag2: boolean = true;
  @observable flag3: boolean = true;
  @observable toVisitId: string; // 企业空间的独立的guid;

  /**
   *  设置企业空间的guid
   * @param param
   */
  @action
  // setToVisitId(param: string, userGuid) {
  //   this.toVisitId = param;
  //   this.getBusinessInfo(userGuid, this.toVisitId);
  // }

  /**
   * 获取将访问的企业
   * @param userGuid 用户 id
   * @param toVisitId 要访问的 id
   */
  @action
  async getBusinessInfo(userGuid: string, toVisitId: string) {
    if (await this.getUserCompanyInfo(userGuid, toVisitId)) {
      await this.getMyIpData(toVisitId, 1);
      await this.getMyPortalPostData(userGuid, toVisitId, 1);
      await this.getMyStaffData(toVisitId, 1);
    }
    await this.getFrontendPersonalVisitor(toVisitId);
  }

  /**
   * 获取 前台获取企业信息1.0
   */
  @action
  async getUserCompanyInfo(userGuid: string, toVisitId: string): Promise<boolean> {
    const { result, errorCode }: any = await frontendCompanySpaceInfo(userGuid, toVisitId);
    if (errorCode === '200' && result.errorCode === 200) {
      this.userCompanyInfo = result.data;
      this.slides = result.data.companyExhibitionList;
    } else {
      result.errorMessage && message.error(result.errorMessage);
      return false;
    }
    return true;
  }

  /**
   * 获取 获取前台最近访客1.0
   */
  @action
  async getFrontendPersonalVisitor(id: string) {
    const { result, errorCode, errorMessage }: any = await frontendPersonalVisitor(id);
    if (errorCode !== '200') {
      message.error(errorMessage);
    } else {
      this.visitorList = result.data;
    }
  }

  @action
  setLoading(param) {
    this.isLoading = param;
  }

  @action
  setLoading2(param) {
    this.isLoading2 = param;
  }

  @action
  setLoading3(param) {
    this.isLoading3 = param;
  }

  /**
   * 获取 前台空间-我的IP1.0
   */
  @action
  async getMyIpData(userGuid, current: number, pageSize = 12) {
    this.setLoading(true);
    const { result: { data }, errorCode, errorMessage }: any = await getMyIp(userGuid, current, pageSize);
    if (errorCode !== '200') {
      message.error(errorMessage);
    } else {
      if (!_isEmpty(data)) {
        this.setLoading(false);
        current === 1 ? this.myIpList = data : this.myIpList = _uniqWith(this.myIpList.concat(data), _isEquel);
        (data.length < pageSize) && (this.flag = false);
      } else {
        this.setLoading(false);
        if (current === 1) {
          this.myIpList = [];
          // this.setLoading(false);
        }
      }
    }
  }

  /**
   * 获取 前台空间-我的案例
   */
  @action
  async getMyPortalPostData(userGuid: string, toVisitId: string, current: number, pageSize = 9) {
    this.setLoading2(true);
    const { result: { data }, errorCode, errorMessage }: any = await getMyPortalPost(userGuid, toVisitId, current, pageSize);
    if (errorCode !== '200') {
      message.error(errorMessage);
    } else {
      if (!_isEmpty(data)) {
        this.setLoading2(false);
        current === 1 ? this.myPortalPostData = data : this.myPortalPostData = _uniqWith(this.myPortalPostData.concat(data), _isEquel);
        (data.length < pageSize) && (this.flag2 = false);
      } else {
        this.setLoading2(false);

        if (current === 1) {
          this.myPortalPostData = [];
          // this.setLoading2(false);
        }
      }
    }
  }

  /**
   * 获取 前台空间-我的职员
   */

  @action
  async getMyStaffData(userGuid, current: number, pageSize: number = 12) {
    this.setLoading3(true);
    const { result: { data }, errorCode, errorMessage }: any = await myStaff(userGuid, current, pageSize);
    if (errorCode !== '200') {
      message.error(errorMessage);
    } else {
      if (!_isEmpty(data)) {
        this.setLoading3(false);
        current === 1 ? this.myStaffData = data : this.myStaffData = _uniqWith(this.myStaffData.concat(data), _isEquel);
        (data.length < pageSize) && (this.flag3 = false);

      } else {
        this.setLoading3(false);
        if (current === 1) {
          this.myStaffData = [];
          // this.setLoading3(false);
        }
      }
    }
  }

  @action
  async doFocus({ guid, isFollow, type, userGuid }: ILikeParams) {
    await updateFocus({ guid, isFollow, type, userGuid });
  }
}

interface ILikeParams {
  guid: object[],
  isFollow: number,
  type: number,
  userGuid: string
}

export default new BusinessStore();
