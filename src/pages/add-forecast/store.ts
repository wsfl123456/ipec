import { action, observable } from 'mobx';
import { addForecast, getCity, getFilterData } from '@utils/api';

class AddForecastStore {
  @observable addForecastData: any = {};
  @observable cityData: Array<object>;
  @observable showDetailData: any = {};

  @action
  changeParams(params: any) {
    this.addForecastData = { ...this.addForecastData, ...params };
  }

  // 地区
  @action
  async getCityData() {
    const { result: data, errorCode }: any = await getCity();
    if (errorCode === "200" && data) {
      let arr = [];
      data.forEach((i) => {
        arr.push(i.districtName);
      });
      // arr.unshift("全国");
      this.cityData = arr;
    }
  }

  // 添加
  @action
  async getForecastData(params) {
    const { result, errorCode, errorMessage }: any = await addForecast(params);
    if (errorCode === "200") {
      return { show: true, message: errorMessage };
    }
  }

  // 展示-添加的预测数据
  @action
  async getFilter(clientDemandGuid) {
    const { result, errorCode, errorMessage }: any = await getFilterData({
      clientDemandGuid
    });
    if (errorCode === "200") {
      this.addForecastData = result;
    }
  }
}

export default new AddForecastStore();
