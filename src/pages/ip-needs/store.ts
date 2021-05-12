import { action, observable } from 'mobx';
import { addNewCase, getCaseDetail } from '@utils/api';

interface IpNeedVerfication {
  userGuid: string,
  postTitle: string,
  postType: number,
  portalCategoryGuid: string,
  ipPicGuid: string,
  ipName?: string,
  postContent?: string,
  picUrl?: string,
}

class IpNeedsStore {
  @observable needsDetail: any;
  @observable needsData: any;

  /*  needsDetail: IpNeedVerfication = {
      userGuid: '',
      postTitle: '',
      postType: 4,
      portalCategoryGuid: '',
      ipName: '',
      postContent: '',
      ipPicGuid: '',
      picUrl: '',
    };*/

  @action
  setParams(param) {
    this.needsDetail = { ...this.needsDetail, ...param };
  }

  @action
  async getCaseDetail(params) {
    const { errorCode, result }: any = await getCaseDetail(params);
    if (errorCode === '200') {
      this.needsData = result.data;
    }
  }

  /**
   * 提交审核
   */
  @action
  async submitIpNeed(params) {
    const { errorCode, result: { errorMsg, errorCode: eCode }, errorMessage }: any = await addNewCase(params);
    if (errorCode === '200') {
      if (eCode > 0) {
        return { message: errorMsg };
      }
    }
  }
}

export default new IpNeedsStore();
