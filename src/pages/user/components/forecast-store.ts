import { action, observable } from "mobx";
import { forecastDelete, getForecastList } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';

interface IForecastParams {
  clientName: string,
  projectName: string,
  demandPurpose: string,
  currentPage: number,
  pageSize: number,
  userGuid: string,
}

class ForecastStore {
  @observable isLoading: boolean = true;
  @observable forecastParam: IForecastParams = {
    userGuid: '',
    clientName: '',
    projectName: '',
    demandPurpose: '',
    currentPage: 1,
    pageSize: 20,
  };
  @observable forecastList: Array<object> = [];

  @action
  setLoading(val) {
    this.isLoading = val;
  }

  @action
  changeParams(params: IForecastParams) {
    this.forecastParam = { ...this.forecastParam, ...params };
  }

  @action
  async getForecastData() {
    this.setLoading(true);
    const { userGuid, clientName, projectName, demandPurpose, currentPage, pageSize } = this.forecastParam;
    const { errorCode: code, result: data }: any = await getForecastList({
      userGuid,
      clientName,
      projectName,
      demandPurpose,
      currentPage,
      pageSize,
    });
    if (code === '200') {
      currentPage !== 1 ? this.forecastList = [...this.forecastList, ...data] : this.forecastList = data;
      if (data.length < pageSize) {
        this.setLoading(false);
      }
      this.setLoading(_isEmpty(data));
      // console.log(currentPage, this.isLoading);
    }

  }

  @action
  async deleteForecast(id) {
    const { errorCode: code, result: { errorMsg, errorCode } }: any = await forecastDelete({
      id
    });
    if (code === '200' && errorCode > 0) {
      return { show: true, msg: errorMsg };
    } else {
      return { show: false, msg: errorMsg };
    }
  }
}

export default new ForecastStore();
