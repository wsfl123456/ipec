import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/user_personaldata.scss";
import { Select, Input } from 'antd';
import Toast from "@components/toast";
import { toJS } from 'mobx';
import {
  setCompanyInformation,
  savePic,
  getCompanytype,
  listCountry,
  getAreaCode,
  getCountryCode,
} from '@utils/api';
import { DatePicker } from 'antd';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';

const { Option } = Select;
import _find from "lodash/find";

let companyTypeArr = []; // 公司类型

let companySize = []; // 公司大小

let companyIndustry = []; // 所属行业

let companyCountry = []; // 国家

let faxNumberContry = []; // 传真国家

let faxNumberLand = []; // 传真区号
let companyKV = {}; // 企业国别
let companyTypeKV = {}; // 企业性质
let industryKV = {}; // 所属行业
interface ICompanyData extends IComponentProps {
  userGuid?: string,
  RealName: any,
  isEditDate: boolean,
  childIsEdit: Function,
}

interface ICompanyState {
  data?: any,
  message: string,
  phoneNumber: any, // 手机号
  emailNumber: any,  // 邮箱号
  showMobox: boolean, // 是否显示弹窗
  likedPhone: boolean;
  likedEmail: boolean;
  show: boolean;
  companyCategory: any;  // 企业类别
  companyProduct: any; // 企业经营的业务产品
  countPhone: number; // 验证码秒数为30秒
  countEmail: number; // 验证码秒数为30秒
  logoImgObj: { // 企业LOGO
    result: any,
    imgUrl: any,
  };
  imgObj: { // 企业风采图
    result: any,
    imgUrl: any,
  };
  ExhibitionArr: any; // 风采
  faxNumber_1: any; // 传真国家
  faxNumber_2: any; // 传真区号
  faxNumber_3: number; // 传真号码
  companyTelephone_1: any; // 座机国家号
  companyTelephone_2: any; // 座机地区
  companyTelephone_3: any; // 座机号码
  companyTelephone_4: number; // 座机分机号

  companyInfo: any,
}

@inject('user', 'login')
@observer
export default class CompanyData extends React.Component<ICompanyData, ICompanyState> {
  constructor(props) {
    super(props);
    this.state = {
      faxNumber_1: null,
      faxNumber_2: null,
      faxNumber_3: null,
      companyTelephone_1: null,
      companyTelephone_2: null,
      companyTelephone_3: null,
      companyTelephone_4: null,
      ExhibitionArr: [],
      companyCategory: [],
      companyProduct: [],
      message: '',
      phoneNumber: null,
      emailNumber: null,
      countPhone: 30, // 验证码秒数为30秒
      countEmail: 30, // 验证码秒数为30秒
      show: false,
      likedPhone: false,
      likedEmail: false,
      showMobox: false,
      logoImgObj: {
        result: '',
        imgUrl: '',
      },
      imgObj: {
        result: '',
        imgUrl: '',
      },
      companyInfo: {}
    };

  }

  async componentDidMount() {
    companyTypeArr = [];
    companySize = [];
    companyIndustry = [];
    companyCountry = [];
    faxNumberContry = [];
    faxNumberLand = [];
    const { login, user } = this.props;
    await user.getCompanyInfo(login.userInfo.userGuid);
    this.setState({
      companyInfo: user.companyInfo
    });
    // 感兴趣的品类
    await user.getlistMainType();
    if (!_isEmpty(user.companyInfo.exhibitionUrl) && !_isEmpty(user.companyInfo.companyExhibition)) {
      let Exbition: any = user.companyInfo.companyExhibition;
      let eximg: any = user.companyInfo.exhibitionUrl;
      const arr = Exbition.split(',') || [];
      const arrUrl = eximg.split(',') || [];
      this.setState({
        imgObj: {
          result: arr,
          imgUrl: arrUrl
        },
      });
    }
    if (user.companyInfo.picUrl) {
      let logoImgObjNew = this.state.logoImgObj;
      logoImgObjNew.imgUrl = user.companyInfo.picUrl;
      this.setState({ logoImgObj: logoImgObjNew });
    }
    // 1企业类别、2企业经营业务、3所属行业、4企业规模、5企业性质、6证件类型
    this.getCompanyOther(1);
    this.getCompanyOther(2);
    this.getCompanyOther(3);
    this.getCompanyOther(4);
    this.getCompanyOther(5);
    let { result }: any = await listCountry();
    result && result.map((item, index) => {
      companyCountry.push(<Option key={item.createUserGuid + index}
                                  value={item.resourceKey}>{item.resourceValue}</Option>);
      companyKV[item.resourceKey] = item.resourceValue;
    });

    let { result: countryResult }: any = await getCountryCode();
    let { result: areaResult }: any = await getAreaCode();
    countryResult && countryResult.map((item) => {
      faxNumberContry.push(<Option key={item.id} value={item.countryNumber}>{item.countryNameNumber}</Option>);
    });
    areaResult && areaResult.map((item) => {
      faxNumberLand.push(<Option key={item.id} value={item.countryNameNumber}>{item.countryNameNumber}</Option>);
    });
    const companyInfo = this.props.user.companyInfo;

    let TelephoneArr = companyInfo.companyTelephone.split('-');
    let faxNumberArr = companyInfo.faxNumber.split('-');
    this.setState({
      companyTelephone_1: TelephoneArr[0],
      companyTelephone_2: companyInfo.telephoneArea,
      companyTelephone_3: TelephoneArr[2],
      companyTelephone_4: TelephoneArr[3],
      faxNumber_1: faxNumberArr[0],
      faxNumber_2: companyInfo.faxArea,
      faxNumber_3: faxNumberArr[2],
    });
  }

  // 获取企业信息中的下拉框选项
  async getCompanyOther(type) {
    let { result }: any = await getCompanytype(type);
    switch (type) {
      case 3:
        result && result.map((item, index) => {
          companyIndustry.push(<Option key={item.createUserGuid + index}
                                       value={item.resourceKey}>{item.resourceValue}</Option>);
          industryKV[item.resourceKey] = item.resourceValue;
        });
        break;
      case 4:
        result && result.map((item, index) => {
          companySize.push(<Option key={item.createUserGuid + index}
                                   value={item.resourceKey}>{item.resourceValue}</Option>);
        });
        break;
      case 5:
        result && result.map((item, index) => {
          companyTypeArr.push(<Option key={item.createUserGuid + index}
                                      value={item.resourceKey}>{item.resourceValue}</Option>);
          companyTypeKV[item.resourceKey] = item.resourceValue;
        });
        break;
      case 1:
        this.setState({
          companyCategory: result
        });
        break;
      case 2:
        this.setState({
          companyProduct: result
        });
        break;
      default :
        break;
    }
  }

  // 获取国家
  countryChange = async (value) => {

    this.setState({
      companyInfo: {
        ...this.state.companyInfo,
        companyCountries: value,
      }
    });
    // this.setCompanyinfo({
    //   companyCountries: value,
    // });
  };

  async putData() {
    const { user, login } = this.props;
    const { companyInfo } = this.state;

    companyInfo.companyNature = user.companyInfo.companyNature || companyInfo.companyNature;

    if (!companyInfo.companyName) {
      this.setState({ message: "请输入企业全称", show: true });
      return false;
    }
    if (companyInfo.companyNature === null || companyInfo.companyNature === '') {
      this.setState({ message: "请选择企业性质", show: true });
      return false;
    }
    if (!companyInfo.companyCountries) {
      this.setState({ message: "请选择企业国别", show: true });
      return false;
    }
    if (!companyInfo.companyCategory) {
      this.setState({ message: "请选择企业类别", show: true });
      return false;
    }
    if (!companyInfo.interestCategory) {
      this.setState({ message: "请选择感兴趣的IP品类", show: true });
      return false;
    }
    if (companyInfo.email) {
      let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
      // let mPatternEmail = /^([a-z0-9A-Z]+[_|.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
      if (!mPatternEmail.test(companyInfo.email)) {
        this.setState({ message: "请输入正确的邮箱", show: true });
        return false;
      }
    }
    if (companyInfo.companyWebsite) {

      // let strRegex1 = /^([hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      // let strRegex2 = /^([hH][tT]{2}[pP]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      // let strRegex = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/;
      let strRegex = /(www.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      if (!strRegex.test(companyInfo.companyWebsite)) {
        this.setState({ message: "请输入正确且完整的企业网址", show: true });
        return false;
      }
    }
    let { logoImgObj, faxNumber_1, faxNumber_2, faxNumber_3, companyTelephone_1, companyTelephone_2, companyTelephone_3, companyTelephone_4 } = this.state;

    if (logoImgObj.result) {
      companyInfo.ipPicGuid = logoImgObj.result;
    }
    // if (ExhibitionArr.length > 0) {
    //   ExhibitionArr.map((item) => {
    //     if (companyInfo.companyExhibition === '') {
    //       companyInfo.companyExhibition = item.result;
    //     } else {
    //       companyInfo.companyExhibition = companyInfo.companyExhibition + ',' + item.result;
    //     }
    //   });
    // }
    if (this.state.imgObj.result.length > 0) {
      let arr = this.state.imgObj.result;
      companyInfo.companyExhibition = arr.join(',');
    }
    if (faxNumber_1 || faxNumber_2 || faxNumber_3) {
      if (!faxNumber_1) {
        this.setState({ message: "请填写传真号-国家号", show: true });
        return false;
      }
      if (!faxNumber_2) {
        this.setState({ message: "请填写传真号-地区号", show: true });
        return false;
      }
      if (!faxNumber_3) {
        this.setState({ message: "请填写传真号-传真号码", show: true });
        return false;
      }
      companyInfo.faxNumber = faxNumber_1 + '-' + faxNumber_2.split('-')[0] + '-' + faxNumber_3;
      companyInfo.faxArea = faxNumber_2;
    }
    if (companyTelephone_1 || companyTelephone_2 || companyTelephone_3 || companyTelephone_4) {
      if (!companyTelephone_1) {
        this.setState({ message: "请填写座机号码-国家号", show: true });
        return false;
      }
      if (!companyTelephone_2) {
        this.setState({ message: "请填写座机号码-地区号", show: true });
        return false;
      }
      if (!companyTelephone_3) {
        this.setState({ message: "请填写座机号码-电话号码", show: true });
        return false;
      }
      companyTelephone_3 = companyTelephone_3 + '';
      if (companyTelephone_3.length > 8 || companyTelephone_3.length < 7) {
        this.setState({ message: "请正确填写座机号码-电话号码", show: true });
        return false;
      }
      companyInfo.companyTelephone = companyTelephone_1 + '-' + companyTelephone_2.split('-')[0] + '-' + companyTelephone_3;
      if (companyTelephone_4) companyInfo.companyTelephone += '-' + companyTelephone_4;
      companyInfo.telephoneArea = companyTelephone_2;
    }
    const { errorCode, result = {} }: any = await setCompanyInformation(companyInfo);
    if (errorCode === "200") {
      this.setState({ message: result.errorMsg, show: true, phoneNumber: '' });
      if (result.errorCode === 200) {
        await user.getCompanyInfo(login.userInfo.userGuid);
        this.props.childIsEdit(false);
        let userNew = login.userInfo;
        userNew.picUrl = result.data.picUrl;
        window.localStorage.setItem("user", JSON.stringify(userNew));

        login.updateUser(userNew);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    }

  }

  async setCompanyinfo(param) {
    const { user } = this.props;
    // 每一个编辑的信息 可以在这里另为保存备份
    await user.setCompanyinfo(param);
  }

  filterSize(val) {
    val = Number(val);
    switch (val) {
      case 1 :
        return "少于50人";
      case 2 :
        return "50-150人";
      case 3 :
        return "150-500人";
      case 4 :
        return "500-1000人";
      case 5 :
        return "1000-5000人";
      case 6 :
        return "5000-10000人";
      case 7 :
        return "10000人以上";
      default:
        return '';
    }
  }

  uploadImg = async (e, field, picType, el) => {
    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 10;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, picType };
      if (file.size > max_size) {
        this.setState({ message: '图片过大,请重新上传！', show: true });
        return;
      } else {
        const result = await savePic(params);
        if (result['errorCode'] === "200" && result['result'].errorCode === 200) {
          if (el === 'ExhibitionArr') {
            let imgar = this.state.ExhibitionArr;
            imgar.push({ "result": result['result'].data, "img": e.target['result'] });
            this.setState({
              ExhibitionArr: imgar,
              imgObj: {
                result: [...this.state.imgObj.result, result['result'].data],
                imgUrl: [...this.state.imgObj.imgUrl, e.target['result']],
              }
            });
          } else {
            this.setState({
              logoImgObj: {
                result: result['result'].data,
                imgUrl: e.target['result']
              }
            });
          }
        } else {
          this.setState({ message: result['result'].errorMsg, show: true });
        }
      }

    };
  };

  filtercompany(val) {
    if (val) {
      return val;
    } else {
      return '请选择企业性质';
    }
  }

  companyChange = (val) => {
    // this.setCompanyinfo({
    //   companyNature: val
    // });
    this.setState({
      companyInfo: { ...this.state.companyInfo, companyNature: val }
    });
  };

  IndustryChange = (val) => {
    this.setState({
      companyInfo: { ...this.state.companyInfo, companyIndustry: val }
    });
    // this.setCompanyinfo({
    //   companyIndustry: val
    // });
  };
  SizeChange = (val) => {
    // this.setCompanyinfo({
    //   companySize: val
    // });
    this.setState({
      companyInfo: { ...this.state.companyInfo, companySize: val }
    });
  };

  // 多选
  baseSelectCheck(companyCategory, element) {
    companyCategory = companyCategory ? companyCategory.split(',') : [];
    let count = false;
    let index_ = 0;
    companyCategory.forEach((val, indx) => {
      if (val === element.resourceKey) {
        index_ = indx;
        count = true;
      }
    });
    if (count) {
      companyCategory.splice(index_, 1);
    } else {
      companyCategory.push(element.resourceKey);
    }
    let _companyCategory = companyCategory.join(',');
    let reg = /,{1+}/g;
    _companyCategory.replace(reg, ",");
    return _companyCategory;
  }

  //  单选
  baseCheck(companyCategory, element) {
    companyCategory = element.resourceKey;
    return companyCategory;
  }

  // 日期插件
  DateChange = (date, dateString) => {
    // this.setCompanyinfo({
    //   companyDateStr: dateString,
    //   companyDate: new Date(dateString).getTime(),
    // });
    this.setState({
      companyInfo: {
        ...this.state.companyInfo,
        companyDateStr: dateString,
        companyDate: new Date(dateString).getTime(),
      }
    });
  };
  setStateAsync = (state) => {
    this.setState(state);
  };

  render() {
    const { companyInfo } = this.state;
    const { user, isEditDate } = this.props;
    let {
      companyInfo: company,
      interestDataList
    } = user;
    interestDataList = toJS(interestDataList);
    let eximg: any = company.exhibitionUrl;
    eximg = eximg.split(',');

    return (
      <div className="personalData hascompany">
        <div className="title">
          企业信息
        </div>
        {isEditDate ?
          <div className="product-box">
            <div className="form-group  flex-column">
              <label className="input-label">企业LOGO<span style={{ color: '#ff6666', fontSize: '0.14rem' }}>（尺寸为：200 * 200）</span></label>
              <div className="upload companyUpload">
                <div className="load">
                  <img src={this.state.logoImgObj.imgUrl || companyInfo.picUrl} alt=""/>
                  <span>点击上传LOGO</span>
                  <input type="file" className="btn_file" name="image_file"
                         accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                         style={{ width: "100%", height: "100%", opacity: 0 }}
                         title="请选择文件"
                         onChange={async (e) => {
                           await this.uploadImg(e, 'userPicUrl', 3, "userFile");
                         }}/>
                </div>
              </div>
            </div>
            <div className="form-group   flex-column">
              <label className="input-label">企业全称<span className="label-dot">*</span> </label>
              <div className="input-control-group flex-row">
                <div className="input-with-unit  width400">
                  <input type="text"
                         className={companyInfo.realStatus === 1 ? "form-control readonly" : "form-control"}
                         placeholder="请输入姓名或昵称"
                         value={companyInfo.companyName || ''}
                         readOnly={companyInfo.realStatus === 1}
                         onChange={async e => {
                           this.setState({
                             companyInfo: {
                               ...companyInfo,
                               companyName: e.currentTarget.value
                             }
                           });
                         }}/>
                </div>
              </div>
            </div>
            <div className="form-group   flex-column">
              <label className="input-label">企业英文/简称 </label>
              <div className="input-control-group flex-row">
                <div className="input-with-unit  width400">
                  <input type="text" className="form-control" placeholder="请输入姓名或昵称"
                         value={companyInfo.companyAbbreviation || ''}
                         onChange={async e => {
                           this.setState({
                             companyInfo: {
                               ...companyInfo,
                               companyAbbreviation: e.currentTarget.value
                             }
                           });
                           // this.setCompanyinfo({
                           //   companyAbbreviation: e.currentTarget.value
                           // });

                         }}/>
                </div>
              </div>
            </div>

            <div className="form-group   flex-column">
              <label className="input-label">企业性质<span className="label-dot">*</span> </label>
              <div className="input-with-unit width280">
                {
                  (company.companyNature && company.memberLevel > 0) ?
                    <Select defaultValue={this.filtercompany(companyTypeKV[companyInfo.companyNature])}
                            disabled>
                      {companyTypeArr}
                    </Select> :
                    <Select placeholder="请选择企业性质"
                            onChange={this.companyChange}>
                      {companyTypeArr}
                    </Select>
                }
              </div>
            </div>

            <div className="form-group   flex-column">
              <label className="input-label">企业国别<span className="label-dot">*</span> </label>
              <div className="input-with-unit width280">
                {
                  companyInfo.companyCountries ?
                    <Select defaultValue={companyKV[companyInfo.companyCountries]} onChange={this.countryChange}>
                      {companyCountry}
                    </Select> : <Select placeholder="请选择企业所属国别" onChange={this.countryChange}>
                      {companyCountry}
                    </Select>
                }
              </div>
            </div>

            <div className="form-group flex-column">
              <label className="input-label">企业类别<span className="label-dot">*</span></label>
              <div className="sub-type-area ip-Type-list">
                <div className="sub-type-list flex-fill flex-row flex-wrap">
                  {
                    this.state.companyCategory.length > 0 && this.state.companyCategory.map((element) => {
                      // let { companyCategory } = user.companyInfo;
                      let { companyCategory } = companyInfo;
                      let tmp = companyCategory.split(',')[0];
                      let checkboxClicked = tmp === element.resourceKey ? "sub-item-selected" : "";
                      return (
                        <div
                          onClick={async () => {
                            let _companyCategory = this.baseCheck(tmp, element);

                            this.setState({
                              companyInfo: {
                                ...companyInfo,
                                companyCategory: _companyCategory
                              }
                            });
                            // this.setCompanyinfo({ companyCategory: _companyCategory });
                          }}
                          key={element.resourceKey}
                          className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                          <div className="limit-custom-radio"/>
                          <div className="checkbox-text">{element.resourceValue}</div>
                        </div>
                      );

                    })
                  }

                </div>
              </div>

            </div>

            <div className="form-group mar_t-12 flex-column">
              <label className="input-label">企业经营的业务/产品</label>
              <div className="sub-type-area ip-Type-list">
                <div className="sub-type-list flex-fill flex-row flex-wrap">
                  {
                    this.state.companyProduct.length > 0 && this.state.companyProduct.map((element) => {
                      let { companyProduct } = companyInfo;
                      let tmp = companyProduct.split(',');
                      let checkboxClicked = !!_find(tmp, val => element.resourceKey === val) ? "sub-item-selected" : "";
                      return (
                        <div
                          onClick={async () => {
                            let _companyProduct = this.baseSelectCheck(companyProduct, element);
                            this.setState({
                              companyInfo: {
                                ...companyInfo,
                                companyProduct: _companyProduct
                              }
                            });
                            // this.setCompanyinfo({ companyProduct: _companyProduct });
                          }}
                          key={element.resourceKey}
                          className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                          <div className="limit-custom-checkbox"/>
                          <div className="checkbox-text">{element.resourceValue}</div>
                        </div>
                      );

                    })
                  }

                </div>
              </div>
            </div>

            <div className="form-group mar_t-12 flex-column">
              <label className="input-label">感兴趣的IP品类<span className="label-dot">*</span></label>
              <div className="sub-type-area ip-Type-list">
                <div className="sub-type-list flex-fill flex-row flex-wrap">
                  {
                    interestDataList.length > 0 && interestDataList.map(element => {
                      let { interestCategory } = companyInfo;
                      let tmp = interestCategory.split(',');
                      let checkboxClicked = !!_find(tmp, val => element.mainTypeGuid === val) ? "sub-item-selected" : "";

                      return (
                        <div
                          onClick={async () => {
                            interestCategory = interestCategory ? interestCategory.split(',') : [];
                            let count = false;
                            let index_ = 0;
                            interestCategory.forEach((val, indx) => {
                              if (val === element.mainTypeGuid) {
                                index_ = indx;
                                count = true;
                              }
                            });
                            if (count) {
                              interestCategory.splice(index_, 1);
                            } else {
                              interestCategory.push(element.mainTypeGuid);
                            }
                            let _interestCategory = interestCategory.join(',');
                            let reg = /,{1+}/g;
                            _interestCategory.replace(reg, ",");

                            this.setState({
                              companyInfo: {
                                ...companyInfo,
                                interestCategory: _interestCategory
                              }
                            });

                            // this.setCompanyinfo({ interestCategory: _interestCategory });
                          }}
                          key={element.mainTypeGuid}
                          className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                          <div className="limit-custom-checkbox"/>
                          <div className="checkbox-text">{element.typeName}</div>
                        </div>
                      );

                    })
                  }

                </div>
              </div>

            </div>

            <div className="form-group mt_12  flex-column">
              <label className="input-label">企业邮箱</label>
              {
                company.email ?
                  <Input type="text" className="form-control" disabled value={company.email || ''}/>
                  :
                  < input
                    type="text"
                    className="form-control"
                    placeholder="填写企业邮箱"
                    onChange={async e => {
                      this.setState({
                        companyInfo: {
                          ...companyInfo,
                          email: e.currentTarget.value
                        }
                      });

                    }}
                    value={companyInfo.email || ''}
                  />
              }
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">企业地址</label>
              <input
                type="text"
                className="form-control"
                placeholder="请填写企业地址"
                onChange={async e => {
                  this.setState({
                    companyInfo: { ...companyInfo, companyAddress: e.currentTarget.value }
                  });
                  // this.setCompanyinfo({ companyAddress: e.currentTarget.value });
                }}
                value={companyInfo.companyAddress || ''}
                maxLength={200}
              />
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">企业介绍</label>
              <textarea
                onChange={async e => {
                  this.setState({
                    companyInfo: { ...companyInfo, companyDesc: e.currentTarget.value }
                  });
                  // this.setCompanyinfo(
                  //   { companyDesc: e.target.value }
                  // );
                }}
                maxLength={1000}
                value={companyInfo.companyDesc || ''}
                className="form-control textarea"
                placeholder="请在此处填写企业介绍(限1000字)"
                rows={6}>
          </textarea>
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">企业风采</label>
              <div className="upload companyUpload">
                {
                  this.state.imgObj.imgUrl && this.state.imgObj.imgUrl.map((item, index) => {
                    return (
                      <div key={index} className="load backroundnone" title="点击可删除" onClick={() => {
                        this.state.imgObj.result.splice(index, 1);
                        this.state.imgObj.imgUrl.splice(index, 1);

                        this.setState({
                          companyInfo: {
                            ...companyInfo,
                            companyExhibition: this.state.imgObj.result.join(','),
                            exhibitionUrl: this.state.imgObj.imgUrl.join(','),
                          }
                        });

                        // this.setCompanyinfo({
                        //   companyExhibition: this.state.imgObj.result.join(','),
                        //   exhibitionUrl: this.state.imgObj.imgUrl.join(','),
                        // });

                      }}>
                        {item ? <span className="hoverShow">点击可删除</span> : <span>添加企业风采</span>}
                        <img src={item} alt="" title="点击可删除"/>
                        {!item && <input
                          type="file" className="btn_file" name="image_file"
                          accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                          style={{ width: "100%", height: "100%", opacity: 0 }}
                          title="请选择文件"
                          onChange={this.uploadImg.bind(this, 'papersPositivePicGuid', 5, 'cardFile')}
                        />
                        }
                      </div>
                    );
                  })
                }

                {
                  this.state.imgObj.result.length < 6 &&
                  <div className="load">
                    <span>添加企业风采</span>
                    <input type="file" className="btn_file" name="image_file"
                           accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                           style={{ width: "100%", height: "100%", opacity: 0 }}
                           title="请选择文件"
                           onClick={e => {
                             e.currentTarget.value = '';
                           }}
                           onChange={async (e) => {
                             await this.uploadImg(e, 'userPicUrl', 3, "ExhibitionArr");
                           }}/>
                  </div>
                }
              </div>
            </div>
            <div className="form-group  flex-column">
              <label className="input-label">成立时间</label>
              {
                companyInfo.companyDateStr ?
                  <DatePicker
                    defaultValue={moment(companyInfo.companyDateStr)}
                    onChange={this.DateChange}
                  /> :
                  <DatePicker placeholder="请选择日期" onChange={this.DateChange}/>
              }
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">所属行业 </label>
              <div className="input-with-unit width280">
                {companyInfo.companyIndustry ?
                  <Select defaultValue={industryKV[companyInfo.companyIndustry]} onChange={this.IndustryChange}>
                    {companyIndustry}
                  </Select> : <Select onChange={this.IndustryChange} placeholder="请选择企业所属行业">
                    {companyIndustry}
                  </Select>
                }
              </div>
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">企业规模 </label>
              <div className="input-with-unit width280">
                {companyInfo.companySize
                  ? <Select value={this.filterSize(companyInfo.companySize)} placeholder="请选择企业规模"
                            onChange={this.SizeChange}>
                    {companySize}
                  </Select>
                  : <Select placeholder="请选择企业规模" onChange={this.SizeChange}>
                    {companySize}
                  </Select>}
              </div>
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">企业网址</label>
              <input
                type="text"
                className="form-control"
                placeholder="请填写企业网址"
                onChange={async e => {
                  this.setState({
                    companyInfo: {
                      ...companyInfo,
                      companyWebsite: e.currentTarget.value
                    }
                  });
                  // this.setCompanyinfo({ companyWebsite: e.currentTarget.value });
                }}
                value={companyInfo.companyWebsite || ''}
              />
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">座机号码</label>
              <div className="telphone">
                {this.state.companyTelephone_1 ?
                  <Select value={this.state.companyTelephone_1 || ''} className="w148" placeholder="请选择国家号"
                          onChange={(str) => {
                            this.setState({
                              "companyTelephone_1": str
                            });
                          }}>
                    {faxNumberContry}
                  </Select>
                  :
                  <Select placeholder="请选择国家号" className="w148" onChange={(str) => {
                    this.setState({
                      "companyTelephone_1": str
                    });
                  }}>
                    {faxNumberContry}
                  </Select>
                }

                {this.state.companyTelephone_2 ?
                  <Select showSearch value={this.state.companyTelephone_2 || ''} className="w148" placeholder="请选择地区号"
                          onChange={(str) => {
                            this.setState({
                              companyTelephone_2: str
                            });
                          }}>
                    {faxNumberLand}
                  </Select>
                  :
                  <Select showSearch placeholder="请选择地区号" className="w148" onChange={(str) => {
                    this.setState({
                      companyTelephone_2: str
                    });
                  }}>
                    {faxNumberLand}
                  </Select>
                }
                <input
                  type="number"
                  className="form-control w240"
                  placeholder="电话号码"
                  onChange={async e => {
                    this.setState({
                      companyTelephone_3: Number(e.currentTarget.value)
                    });
                  }}
                  value={this.state.companyTelephone_3 || ''}
                />
                <input
                  type="number"
                  className="form-control w240"
                  placeholder="分机号"
                  onChange={async e => {
                    this.setState({
                      companyTelephone_4: Number(e.currentTarget.value)
                    });
                  }}
                  value={this.state.companyTelephone_4 || ''}
                />
              </div>
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">传真号</label>
              <div className="telphone">
                {this.state.faxNumber_1 ?
                  <Select value={this.state.faxNumber_1 || ''} className="w148" placeholder="请选择国家号" onChange={str => {
                    this.setState({
                      faxNumber_1: str
                    });
                  }}>
                    {faxNumberContry}
                  </Select>
                  :
                  <Select placeholder="请选择国家号" className="w148" onChange={str => {
                    this.setState({
                      faxNumber_1: str
                    });
                  }}>
                    {faxNumberContry}
                  </Select>
                }

                {this.state.faxNumber_2 ?
                  <Select showSearch value={this.state.faxNumber_2 || ''} className="w148" placeholder="请选择地区号"
                          onChange={str => {
                            this.setState({
                              faxNumber_2: str
                            });
                          }}>
                    {faxNumberLand}
                  </Select>
                  :
                  <Select showSearch placeholder="请选择地区号" className="w148" onChange={str => {
                    this.setState({
                      faxNumber_2: str
                    });
                  }}>
                    {faxNumberLand}
                  </Select>
                }
                <input
                  type="number"
                  className="form-control w240"
                  placeholder="传真号码"
                  onChange={async e => {
                    this.setStateAsync({
                      faxNumber_3: Number(e.target.value)
                    });
                  }}
                  value={this.state.faxNumber_3 || ''}
                />
              </div>
            </div>

            <button className="puton" onClick={() => {
              this.putData();
            }}>提交
            </button>

          </div>
          :
          <div className="firstShow">
            <p className=" companyLogo"><span className="itemTitle">企业LOGO</span><img src={company.picUrl} alt=""/>
            </p>
            <p><span className="itemTitle">企业全称</span>{company.companyName || '--'}</p>
            <p><span className="itemTitle">企业英文/简称</span>{company.companyAbbreviation || '--'}</p>
            <p><span className="itemTitle">企业性质</span>{company.companyNatureStr || '--'}</p>
            <div className="boxFlot clearfix"><span className="itemTitle">企业类别</span>
              <div>{company.companyCategoryStr || '--'}</div>
            </div>
            <p><span className="itemTitle">企业国别</span>{company.companyCountriesStr || '--'}</p>
            <div className="boxFlot clearfix"><span className="itemTitle">企业经营的业务/产品</span>
              <div>{company.companyProductStr || '--'}</div>
            </div>
            <div className="boxFlot clearfix"><span className="itemTitle">感兴趣的IP品类</span>
              <div className="description">{company.interestCategoryStr || '--'}</div>
            </div>
            <p className=" emaile">
              <span className="itemTitle">企业邮箱</span>
              <span>{company.email || '--'}</span>
            </p>
            <p><span className="itemTitle">企业地址</span>
              <span>{company.companyAddress || '--'}</span>
            </p>
            <div className="boxFlot clearfix"><span className="itemTitle">企业介绍</span>
              <div className="description">{company.companyDesc || '--'}</div>
            </div>
            <div className="boxFlot clearfix"><span className="itemTitle">企业风采</span>
              <div className="companyImg">{
                companyInfo.companyExhibition ? eximg.map((item, index) => {
                  return (
                    <img src={item} key={index} alt=""/>
                  );
                }) : '--'
              }
              </div>
            </div>
            <p><span
              className="itemTitle">成立时间</span> {company.companyDateStr || '--'}
            </p>
            <p><span className="itemTitle">所属行业</span> {company.companyIndustryStr || '--'}  </p>
            <p><span className="itemTitle">企业规模</span> {company.companySizeStr} </p>
            <p><span className="itemTitle">企业网站</span>
              {company.companyWebsite ? company.companyWebsite : ' --'}
            </p>
            <p><span className="itemTitle">座机号码</span> {company.companyTelephone || '--'} </p>
            <p><span className="itemTitle">传真号码</span> {company.faxNumber || '--'} </p>
            <button className="edit-data" onClick={() => {
              this.props.childIsEdit(true);
              this.setState({
                companyInfo: { ...company }
              });
            }}>修改资料
            </button>
          </div>
        }
        {this.state.show && <Toast
          onClose={() => {
            this.setState({ show: false });
          }}
          duration={2}
          message={this.state.message}
        />}
      </div>
    );
  }
}
