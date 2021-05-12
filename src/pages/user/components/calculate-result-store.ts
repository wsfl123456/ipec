import { action, observable } from "mobx";
import _isEmpty from 'lodash/isEmpty';
import { getCalculateResult } from '@utils/api';

class CalculateResultStore {
  @observable calculateResult = [];

  @action
  async getCalculateResult(params) {
    const { errorCode, result: { data } }: any = await getCalculateResult(params);
    if (errorCode === "200") {
      this.calculateResult = data;
    }
  }

}

export default new CalculateResultStore();
