import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import moment from 'moment';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import { upload, getAuthorize } from '@utils/api';
import { Select, DatePicker } from 'antd';
import _find from "lodash/find";
import { bool, string } from "prop-types";
const Option = Select.Option;
const children = [];

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

interface IAvatarProps extends IComponentProps {
  callback: Function;
}

interface IAvatarState {
  ipIsShow: number;

  isOn: boolean;
  isCaseOn: boolean;
  detail: string;
  listAuthorize_1: Array<object>;
  listAuthorize_2: Array<object>;
  listAuthorize_3: Array<object>;
  prodect: Array<object>;
  cooperationCase: Array<object>;
  result: Array<any>,
  timeout: any,
  current: any,
}

@inject('update')
export default class Avatar extends React.Component<IAvatarProps, IAvatarState> {

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      timeout: null,
      current: 0,
      ipIsShow: 1,
      isOn: false,
      isCaseOn: false,
      detail: "",
      listAuthorize_1: null,
      listAuthorize_2: null,
      listAuthorize_3: null,
      prodect: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
      cooperationCase: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
    };
  }

  private timeCallback = (o: any) => {
    const { date = "" } = o;
    this.callback({ showDate: date });
  };

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  async componentDidMount() {
    await this.getAuthorize(1);
    await this.getAuthorize(2);
    await this.getAuthorize(3);
    this.callback({ ipIsShow: this.state.ipIsShow });
    const { update, id } = this.props;
    const { updateList, } = update;
    const { prodect, cooperationCase, detail } = this.state;
  }

  // 根据状态获取对应数据
  async getAuthorize(typeCategory: Number) {
    let { errorCode, result }: any = await getAuthorize(typeCategory)
    if (errorCode == 200) {
      switch (typeCategory) {
        case 1:
          this.setState({
            listAuthorize_1: result
          })
          break;
        case 2:
          this.setState({
            listAuthorize_2: result
          })
          break;
        case 3:
          this.setState({
            listAuthorize_3: result
          })
          break;
        default:
          return
      }

    }

  }

  // 没用 下边的被分离到了 commonParamete组建
   timestampToTime = (timestamp) => {
    let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y + M + D;
  }
  // 日期选择

  datechange = (date, dateString) => {
    this.callback({ authorizedAllottedTime: dateString });
  }

  replaceStr = (oldStr, childStr) => {
    let re = new RegExp(childStr, "g"); // 通过RegExp使用变量
    return oldStr.replace(re, '');
  }

  // 个人信息-授权品类
  authorizedTypeChange = (value: any, obj: any) => {
    // const { update: { updateList } } = this.props;
    // if(!!_find(updateList.authorizedType.split(','),val=>val == value))return;
    this.callback({ authorizedType: value });
  };
  authorizedLocationChange = (value: any, obj: any) => {
    this.callback({ authorizedLocation: value });
  };
  intentAuthorizationChange = (value: any, obj: any) => {
    this.callback({ intentAuthorization: value });
  };
  grantedTypeChange = (value: any, obj: any) => {
    this.callback({ grantedType: value });
  };
  handleChange = (value: any, obj: any) => {
    const { update: { updateList } } = this.props;
  };
  // 获取授权品类
  async getCompanyList() {
    // let isSuccess = await this.state.user.getCompanyList();
    // if (isSuccess) {
    //   isSuccess.forEach((element: any) => {
    //     children.push(<Option key={element.companyGuid}  value={element.companyGuid+`:index${element.id}`}>{element.companyName}</Option>);
    //   });
    // } else {
    //   this.setState({ message: '获取公司列表失败', show: true });
    //   this.props.history.push("/user");
    //   // this.onSubmitResult(code, userLogin);
    // }
  }

 fileterArray(param){
   if ( typeof param == "string"){
      return param.split(',');
   }
   return param
 }

  // 上传图片
  async uploadImg(e, item, index, dataName) {
    // 利用fileReader对象获取file
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("isImage", '1');
      formData.append("isFullPath", '1');
      await upload(formData);
      const { errorCode, result = {} }: any = await upload(formData);
      if (errorCode === '200' && result.errorCode === 200) {
        const { update } = this.props;
        item.pic = result.data;
        if (dataName === 'prodect') {
          const { prodect } = update.updateList;
          this.callback({ prodect });
        } else {
          const { cooperationCase } = update.updateList;
          this.callback({ cooperationCase });

        }
      } else {
        // this._setState(true, result.errorMsg);
      }
    };
  }

  async _changeValue(e, item, dataName) {
    item.title = e.target.value;
    const { update } = this.props;
    if (dataName === 'prodect') {
      const { prodect } = update.updateList;
      this.callback({ prodect: toJS(prodect) });
    } else {
      const { cooperationCase } = update.updateList;
      this.callback({ cooperationCase: toJS(cooperationCase) });
    }
  }

  private process(list: any[]) {
    let { pub: { ipTypeSuperiorNumber } } = this.props;
    if (list && ipTypeSuperiorNumber) {
      let tmp = _find(list, o => !!o[ipTypeSuperiorNumber]);
      return tmp && tmp[ipTypeSuperiorNumber];
    }
  }

  render() {
    const { update, id } = this.props;
    const { isOn, isCaseOn, listAuthorize_1, listAuthorize_2, listAuthorize_3, result} = this.state;
    let { updateList, subTypeList, companyData, locationList } = update;
    subTypeList = toJS(subTypeList);
    subTypeList = this.process(subTypeList);
    locationList = toJS(locationList);
    return (
      <div className="create-right-container flex-column">
        <div className="form-group flex-column">
          {subTypeList && subTypeList.length > 0 && <label className="input-label">IP类型<span className="label-dot">*</span></label>
          }
          {subTypeList && subTypeList.length > 0 && <div className="sub-type-area ip-Type-list">
            <div className="sub-type-list flex-fill flex-row flex-wrap">
              {subTypeList.map((item: any) => {
                if (item.ipTypeNumber !== 0) {
                  let { pub: { ipTypeNumber: tmp}, setPub } = this.props;
                  let checkboxClicked = !!_find(tmp, val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                  // const { updateList: { ipTypeNumber: tmp } } = update;
                  // console.log(!!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)));
                  // let checkboxClicked = !!_find(tmp.split(','), val => item.ipTypeNumber === Number(val)) ? "sub-item-selected" : "";
                  return (
                    <div
                      key={item.ipTypeGuid}
                      onClick={async () => {
                        let { pub } = this.props;
                        await update.setchildType(pub, item, subTypeList, setPub)
                        // let { ipTypeNumber } = pub;
                        // let count =false;
                        // let index_ =0;
                        // // ipTypeName = ipTypeName.split(',');
                        // ipTypeNumber.forEach((val,indx )=> {
                        //   if(val == item.ipTypeNumber){
                        //     index_ = indx;
                        //     count = true
                        //   }
                        // });
                        // if (count) {
                        //   ipTypeNumber.splice(index_,1) ;
                        // } else {
                        //   ipTypeNumber.push(item.ipTypeNumber);
                        // }
                        // setPub({ ...pub, ipTypeNumber })
                        // //匹配中文名字
                        // let ipTypeName = [];
                        // ipTypeNumber.forEach(val => {
                        //   subTypeList.map((item: any) => {
                        //     if(val == item.ipTypeNumber){
                        //       ipTypeName.push(item.ipType)
                        //     }
                        //   })
                        // });
                        // setPub({ ...pub, ipTypeNumber ,ipTypeName})
                        // let _ipTypeNumber = ipTypeNumber.join(',');
                        // let _ipTypeName = ipTypeName.join(',');
                        // var reg = /,{1+}/g;
                        // _ipTypeNumber.replace(reg, ",");
                        // _ipTypeName.replace(reg, ",");
                        // await update.setStatus({ ipTypeNumber:_ipTypeNumber,ipTypeName:_ipTypeName});
                      }}
                      className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                      <div className="limit-custom-checkbox" />
                      <div className="checkbox-text">{item.ipType}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>}

        </div>

        <div className="form-group form-540 mt-12 flex-column">
          <label className="input-label">IP所属国家地区
                      <span className="label-dot">*</span>
            <span className="isCheked">(可多选)</span>
          </label>
          <div className="location-container">
            {
              locationList && locationList.map((item: any) => {
                if (item.ipTypeNumber !== 0) {
                  let {  pub, setPub } = this.props;
                  let { countryTypes, countryNames } = updateList;
                  let checkboxClicked = !!_find(countryTypes.split(','), val => item.resourceKey === val) ? "sub-item-selected" : "";
                  return (
                    <div
                      key={item.resourceKey}
                      onClick={async () => {
                        // 判断是否已经被选中
                        let boole = !!_find(countryTypes.split(','), val => item.resourceKey === val);
                        update.setContry(boole, item, locationList, pub, setPub)
                        // if (boole) {
                        //   countryTypes = this.replaceStr(countryTypes, item.resourceKey)
                        // } else {
                        //   countryTypes = countryTypes + ',' + item.resourceKey;
                        // }
                        // //匹配中文名字
                        // let contryName = [];
                        // countryTypes.split(',').forEach(val => {
                        //   locationList.map((item: any) => {
                        //     if(val == item.resourceKey){
                        //       contryName.push(item.resourceValue)
                        //     }
                        //   })
                        // });
                        // countryNames = contryName.join('/');
                        // setPub({ ...pub, countryTypes, countryNames });
                        // await update.setStatus({ countryTypes, countryNames });

                      }}
                      className={`sub-item flex-row justify-content-center align-items-center  ${checkboxClicked}`}>
                      <div className="limit-custom-checkbox" />
                      <div className="checkbox-text">{item.resourceValue}</div>
                    </div>
                  );
                }
              })
            }
          </div>
        </div>

      </div>
    );
  }
}
