import { action, observable, toJS } from 'mobx';
import { addCalculate, getPeopleList, getType, listCompany } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';

interface ICompanyState {
  companyName: string;
  companyType: number;
  currentPage: number;
}

interface IPeopleState {
  type: number;
  ipName: string;
}

class AddCalculateStore {
  @observable addCalculateData: any = {};
  @observable showDetailData: any = {};
  @observable director = [];
  @observable screenWriter = [];
  @observable actor = [];
  @observable companyCp = [];
  @observable loadingCp: boolean = true;
  @observable companyXf = [];
  @observable loadingXf: boolean = true;

  @observable peopleData: IPeopleState = {
    type: 1,
    ipName: '',
  };

  @observable company: ICompanyState = {
    companyName: '',
    companyType: 1,
    currentPage: 1,
  };
  @observable typeList = [];

  @action
  changeParams(params: any) {
    this.addCalculateData = { ...this.addCalculateData, ...params };
  }

  // 预测数据-ip类型
  @action
  async ipTypeList(param) {
    const { errorCode, result }: any = await getType(param);
    if (errorCode > 0) {
      this.typeList = result;
    }
  }

  // 预测数据-导演，编剧，主演列表
  @action
  async changePeopleType(params) {
    this.peopleData = { ...this.peopleData, ...params };
    await this.getPeopleType();
  }

  @action
  async getPeopleType() {
    const { type, ipName } = this.peopleData;
    const { errorCode, result: { data } }: any = await getPeopleList({ type, ipName });
    if (errorCode === "200") {
      if (type === 1) {
        this.director = data;
      }
      if (type === 2) {
        this.screenWriter = data;
      }
      if (type === 3) {
        this.actor = data;
      }
    }
  }

  @action
  async companyParams(params: any) {
    this.company = { ...this.company, ...params };
    await this.getCompany();
  }

// 公司列表 1出品公司,6宣发公司
  @action
  async getCompany() {
    const { companyName, companyType, currentPage } = this.company;
    const { errorCode, result }: any = await listCompany({
      companyName,
      companyType,
      currentPage
    });
    if (errorCode === "200") {
      if (companyType === 1) {
        this.companyCp = result;
        // this.companyCp = [...this.companyCp, ...result];
        if (result.length < 30) {
          this.loadingCp = false;
        }
      }
      if (companyType === 6) {
        this.companyXf = result;
        // this.companyXf = [...this.companyXf, ...result];
        if (result.length < 30) {
          this.loadingXf = false;
        }
      }
    }
  }

  // 添加
  @action
  async getCalculateData(params) {
    const { result, errorCode, errorMessage }: any = await addCalculate(params);
    if (errorCode === "200") {
      return { show: true, message: errorMessage };
    }else {
      return { show: false, message: errorMessage };
    }
  }

}

export default new AddCalculateStore();
