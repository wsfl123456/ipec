import { action, observable } from "mobx";
import _isEmpty from 'lodash/isEmpty';
import { getCalculateData, deleteCalculate } from '@utils/api';

interface ICalculateParams {
  ipName: string,
  ipTypeSuperiorNumber: string,
  currentPage: number,
  pageSize: number,
  userGuid: string,
}

class CalculateStore {
  @observable calculateParam: ICalculateParams = {
    userGuid: '',
    ipName: '',
    ipTypeSuperiorNumber: '',
    currentPage: 1,
    pageSize: 20,
  };
  @observable calculateList: Array<object> = [];
  @observable isLoading: boolean = true;

  @action
  changeParams(params: ICalculateParams) {
    this.calculateParam = { ...this.calculateParam, ...params };
  }

  @action
  async getCalculateData() {
    this.isLoading = true;
    const { userGuid, ipName, ipTypeSuperiorNumber, currentPage, pageSize } = this.calculateParam;
    const { errorCode: code, result: data }: any = await getCalculateData({
      userGuid,
      ipName,
      ipTypeSuperiorNumber,
      currentPage,
      pageSize,
    });
    if (code === '200') {
      currentPage !== 1 ? this.calculateList = [...this.calculateList, ...data] : this.calculateList = data;
      if (data.length < pageSize) {
        this.isLoading = false;
      }
    }
    this.isLoading = (_isEmpty(data));
  }

  @action
  async deleteCalculate(predictGuid) {
    const { errorCode: code, result: { errorMsg, errorCode } }: any = await deleteCalculate({
      predictGuid
    });
    if (code === '200' && errorCode > 0) {
      return { show: true, msg: errorMsg };
    } else {
      return { show: false, msg: errorMsg };
    }
  }
}

export default new CalculateStore();
