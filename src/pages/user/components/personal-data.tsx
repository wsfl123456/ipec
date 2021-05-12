import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/user_personaldata.scss";
import ic_user from '@assets/images/user.svg';
import gender from '@assets/images/gender.png';
import man from '@assets/images/man.png';
import wuman from '@assets/images/wuman.png';
import close from "assets/images/ic_close.svg";
import { Select } from 'antd';
import Toast from "@components/toast";
import { toJS } from 'mobx';
import { getCountryCode, getProvince, setUserInformation } from '@utils/api';

const { Option } = Select;
import _find from "lodash/find";

interface IPersonalData extends IComponentProps {
  userGuid?: string,
  RealName: any, // 是否已验证
  uploadImg: any, // 上传图片
  isEditDate: boolean, // 是否是修改界面
  childIsEdit: Function, // 设置修改状态
}

interface IPersonalState {
  data?: any,
  message: string,
  email_code: string,
  phone_code: string,
  editCodeType: string,
  emailNumber: string,
  phoneNumber: string,
  showMobox: boolean,
  likedPhone: boolean; // 手机验证码是否发送
  likedEmail: boolean; // 邮箱验证码是否发送
  show: boolean; // 提示框是否显示
  countPhone: number, // 验证码秒数为30秒
  countEmail: number, // 验证码秒数为30秒

  phoneState: boolean;
  emailState: boolean;

  personInfo: any;
}

let countryArr = []; // 国家
let provinceArr = []; // 省份

@inject('user', 'login')
@observer
export default class PersonalData extends React.Component<IPersonalData, IPersonalState> {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      message: "",
      email_code: "",
      phone_code: "",
      editCodeType: '',
      emailNumber: '',
      phoneNumber: '',
      showMobox: false,
      likedPhone: false,
      likedEmail: false,
      show: false,
      countPhone: 60, // 验证码秒数为30秒
      countEmail: 60, // 验证码秒数为30秒

      phoneState: false,
      emailState: false,

      personInfo: {}
    };
  }

  /**
   *  十大类型、 国家、省份 数据
   */
  async componentDidMount() {
    const { user } = this.props;
    await user.getlistMainType();
    const { result: provinceCode }: any = await getProvince();
    const { result: countryCode }: any = await getCountryCode();
    countryArr = countryCode;
    provinceArr = provinceCode;
    this.setState({
      personInfo: user.personInfo,
    });
  }

  // 筛选性别称谓
  singin(value) {
    if (value === null) return '请选择性别';
    value = Number(value);
    switch (value) {
      case 0:
        return '保密';
      case 1:
        return '先生';
      case 2:
        return '女士';
      default:
        return '请选择性别';
    }
  }

  //  验证绑定手机号
  private filterPhoneParams(bolen: boolean) {
    const { phoneNumber } = this.state;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (phoneNumber === "" || phoneNumber === null) {
      this.setState({ message: "请输入手机号", show: true });
      return false;
    }
    if (!mPattern.test(phoneNumber)) {
      this.setState({ message: "请输入正确手机号", show: true });
      return false;
    }
    if (bolen) {
      if (this.state.phone_code === "" || this.state.email_code === null) {
        this.setState({ message: "请输入验证码", show: true });
        return false;
      }
    }
    return true;
  }

  // 筛选邮箱绑定验证
  private filterEmailParams(bolen: boolean) {

    const { emailNumber } = this.state;
    let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    if (!emailNumber) {
      this.setState({ message: "请输入邮箱号", show: true });
      return false;
    }
    if (!mPatternEmail.test(emailNumber)) {
      this.setState({ message: "请输入正确邮箱号", show: true });
      return false;
    }
    if (bolen) {
      if (this.state.email_code === "" || this.state.email_code === null) {
        this.setState({ message: "请输入验证码", show: true });
        return false;
      }
    }
    return true;
  }

  // 修改手机号邮箱 确认发送
  async editPhoneNumber({ type }) {
    const { user, login } = this.props;
    let params = {
      receiverType: 0,
      code: null,
      email: null,
      mobile: null,
      userGuid: login.userInfo.userGuid
    };
    if (type === 'editPhone') {
      params.receiverType = 1;
      params.mobile = this.state.phoneNumber;
      params.code = this.state.phone_code;
    } else if (type === 'editEmail') {
      params.receiverType = 2;
      params.email = this.state.emailNumber;
      params.code = this.state.email_code;
    }
    if (params.code === '') {
      this.setState({ message: "请输入验证码", show: true });
      return false;
    }
    let isSuccess = await user.userInformation(params);
    if (isSuccess.request) {
      let _userinfo = {};
      if (type === 'editPhone') {
        _userinfo = {
          phoneNumber: this.state.phoneNumber
        };
        this.setState({ message: '修改成功', show: true, phone_code: '', phoneState: true });

      } else if (type === 'editEmail') {
        _userinfo = {
          mailbox: this.state.emailNumber
        };
        this.setState({ message: '修改成功', show: true, email_code: '', emailState: true });

      }

      user.setUserinfo(_userinfo);
      this.closeMobox();
    } else {
      this.setState({ message: isSuccess.result.errorMsg, show: true });
    }
  };

  // 获取性别
  handleChange = (value) => {
    this.setState({
      personInfo: {
        ...this.state.personInfo,
        sex: value,
      }
    });
    // this.props.user.setUserinfo({
    //   sex: value,
    // });
  };

  // 获取验证码
  async EditCode({ type }) {
    const { emailNumber, phoneNumber } = this.state;
    /**
     * 获取验证码
     * @param userLogin 登陆名
     * @param receiverType  1手机 2邮箱
     * @param sendType    1注册 2修改密码 3实名认证 4修改绑定
     */
    let param = {
        userLogin: "",
        receiverType: 0,
        sendType: 0
      },
      validation = null;
    if (type === 'editPhone') {
      validation = phoneNumber;
    } else if (type === 'editEmail') {
      validation = emailNumber;
    }
    switch (type) {
      case 'editPhone':
        param.receiverType = 1;
        param.sendType = 4;
        break;
      case 'editEmail':
        param.receiverType = 2;
        param.sendType = 4;
        break;
      case 'editinformation':
        param.receiverType = 2;
        param.sendType = 3;
        break;
      default:
    }
    let isSuccess = await this.props.user.getEditCode({
      userLogin: validation,
      receiverType: param.receiverType,
      sendType: param.sendType
    });
    this.setState({ message: isSuccess.message, show: true });
    // 如果成功 开始倒计时
    if (isSuccess.request) {
      if (type === 'editEmail') {
        let countEmail = this.state.countEmail;
        this.setState({
          likedEmail: true
        });
        const timer = setInterval(() => {
          this.setState({
            countEmail: (countEmail--)
          }, () => {
            if (countEmail === -1) {
              clearInterval(timer);
              this.setState({
                likedEmail: false,
                countEmail: 60
              });
            }
          });
        }, 1000);
      } else if (type === 'editPhone') {
        let count = this.state.countPhone;
        this.setState({
          likedPhone: true
        });
        const timer = setInterval(() => {
          this.setState({
            countPhone: (count--)
          }, () => {
            if (count === -1) {
              clearInterval(timer);
              this.setState({
                likedPhone: false,
                countPhone: 60
              });
            }
          });
        }, 1000);
      }

    }
    this.setState({ message: isSuccess.message, show: true });
  }

  // 个人信息修改提交
  async putData() {
    const { user, login } = this.props;
    const { personInfo } = this.state;
    const { userGuid } = login.userInfo;
    if (!personInfo.userRealName) {
      this.setState({ message: "请输入姓名", show: true });
      return false;
    }
    if (personInfo.sex === null || personInfo.sex === '') {
      this.setState({ message: "请选择性别", show: true });
      return false;
    }
    if (personInfo.mobile === '') {
      this.setState({ message: "请填写手机号", show: true });
      return false;
    }
    if (personInfo.email === '') {
      this.setState({ message: "请填写邮箱", show: true });
      return false;
    }
    if (personInfo.country === "") {
      this.setState({ message: "请填写地址", show: true });
      return false;
    }
    if (personInfo.province === "") {
      this.setState({ message: "请填写地址", show: true });
      return false;
    }
    if (personInfo.address === "") {
      this.setState({ message: "请填写地址", show: true });
      return false;
    }
    if (!personInfo.interestCategory) {
      this.setState({ message: "请选择IP品类", show: true });
      return false;
    }
    if (personInfo.tags.length > 200) {
      this.setState({ message: "您的个人标签不能超过200字", show: true });
      return false;
    }
    const { errorCode, result = {} }: any = await setUserInformation(personInfo);
    if (errorCode === "200") {
      this.setState({ message: result.errorMsg, show: true, phoneNumber: '', phone_code: '' });
      if (result.errorCode === 200) {
        await user.getUserInfo(userGuid);
        this.props.childIsEdit(false);
      }
    }
  }

  // 关闭邀请的弹出框
  closeMobox() {
    this.setState({
      editCodeType: '',
      showMobox: false,
    });
  }

  // 判断是否是空
  isNull(str) {
    if (str) return str;
    return '--';
  }

  // 筛选感兴趣品类
  getCategory(str) {
    let { interestDataList } = this.props.user;
    let arr = str.split(',');
    let st = '';
    interestDataList.map(element => {
      // console.log('arr.indexOf(element.mainTypeGuid)')
      for (let i = 0; i < arr.length; i++) {
        if (element.mainTypeGuid === arr[i]) {
          if (st === '') {
            st += element.typeName;
          } else {
            st = st + ' , ' + element.typeName;
          }

        }
      }

    });
    if (st === '') st = '--';
    return st;
  }

  render() {
    const { showMobox, editCodeType, personInfo } = this.state;
    const {
      user, login, isEditDate,
    } = this.props;
    let {
      personInfo: person,
      interestDataList
    } = user;
    let userinfo = login.userInfo;
    interestDataList = toJS(interestDataList);
    return (
      <div className="personalData">
        {
          showMobox &&
          <div className="mobox">
            <div className="mobox_content">
              <div className="title">
                {editCodeType === 'editEmail' ? "绑定邮箱" : "绑定手机"}
                <img src={close} onClick={async () => {
                  this.closeMobox();
                }} alt=""/>
              </div>
              <div className="center">
                <div className="form-group   flex-column">
                  <label className="input-label">{editCodeType === 'editEmail' ? "邮箱号码" : "手机号码"}<span
                    className="label-dot">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={editCodeType === 'editEmail' ? "请输入邮箱号码" : "请输入手机号码"}
                    onChange={async e => {
                      if (editCodeType === 'editEmail') {
                        this.setState({
                          emailNumber: e.currentTarget.value,
                          personInfo: {
                            ...personInfo,
                            emailNumber: e.currentTarget.value,
                            email: e.currentTarget.value,
                          }
                        });
                        // user.setUserinfo({ email: e.currentTarget.value });
                      }
                      if (editCodeType === 'editPhone') {
                        this.setState({
                          phoneNumber: e.currentTarget.value,
                          personInfo: {
                            ...personInfo,
                            phoneNumber: e.currentTarget.value,
                            mobile: e.currentTarget.value,
                          }
                        });

                        // user.setUserinfo({ mobile: e.currentTarget.value });
                      }
                    }}
                    value={editCodeType === 'editEmail' ? this.state.emailNumber : this.state.phoneNumber}
                  />
                </div>

                <div className="form-group flex-column mb0">
                  <label className="input-label">验证码<span className="label-dot">*</span></label>
                </div>
                <div className="form-group flex-column code-area">
                  <input
                    type="text"
                    className="form-control code-input"
                    // name="user_code"
                    placeholder="请输入验证码"
                    onChange={e => {
                      if (editCodeType === 'editEmail') this.setState({ email_code: e.currentTarget.value });
                      if (editCodeType === 'editPhone') this.setState({ phone_code: e.currentTarget.value });
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    id="getMessage"
                    onClick={
                      async () => {
                        if (editCodeType === 'editEmail' && this.state.likedEmail) return false;
                        if (editCodeType === 'editPhone' && this.state.likedPhone) return false;
                        let isValidate = false;
                        if (editCodeType === 'editEmail') isValidate = this.filterEmailParams(false);
                        if (editCodeType === 'editPhone') isValidate = this.filterPhoneParams(false);
                        if (isValidate) {
                          this.EditCode({ type: editCodeType });
                        }
                      }
                    }
                  >
                    {editCodeType === 'editEmail' ? this.state.likedEmail ? `${this.state.countEmail}秒后重新发送` : "获取验证码" : ''}
                    {editCodeType === 'editPhone' ? this.state.likedPhone ? `${this.state.countPhone}秒后重新发送` : "获取验证码" : ''}
                    {/* {this.state.likedEmail ? `${this.state.countEmail}秒后重新发送` : "获取验证码"} */}
                  </button>
                </div>
              </div>
              <div className="footer">
                <button onClick={async () => {
                  let isValidate = false;
                  if (editCodeType === 'editEmail') isValidate = this.filterEmailParams(true);
                  if (editCodeType === 'editPhone') isValidate = this.filterPhoneParams(true);
                  if (isValidate) {
                    await this.editPhoneNumber({ type: editCodeType });
                  }
                }}>确定
                </button>
                <button className="resolve" onClick={() => {
                  this.closeMobox();
                }}>取消
                </button>
              </div>
            </div>
          </div>
        }
        <div className="title">
          个人资料
        </div>
        <div className="product-box">
          <div className="upload-box">
            <div className="module">
              {person.picUrl === "" ?
                <span className=" add-product">添加头像</span>
                :
                <span className="update-product">修改头像</span>}

              <input type="file" className="product-upload" onChange={async (e) => {
                await this.props.uploadImg(e, 'userPicUrl', 3, "userFile");
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}/>
            </div>
            {person.picUrl === "" && <img src={ic_user} alt=""/>}
            {person.picUrl !== "" && <img src={person.picUrl || userinfo.picUrl} alt=""/>}
          </div>
          {
            !isEditDate &&
            <p>
              <span>{person.userRealName}</span>
              <img src={Number(person.sex) === 1 ? man : Number(person.sex) === 2 ? wuman : gender} alt=""/>
            </p>
          }
        </div>
        {isEditDate ?
          <div>
            <div className="form-group   flex-column">
              <label className="input-label">姓名<span className="label-dot">*</span> </label>
              <div className="input-control-group flex-row">
                <div className="input-with-unit  width400">
                  {
                    userinfo.realStatus === 1 ?
                      <input type="text" className="form-control form-control-disabled"
                             value={personInfo.userRealName}
                             disabled/>
                      :
                      <input type="text" className="form-control" placeholder="请输入姓名或昵称"
                             value={personInfo.userRealName}
                             onChange={async e => {
                               this.setState({
                                 personInfo: {
                                   ...personInfo,
                                   userRealName: e.currentTarget.value
                                 }
                               });
                               // user.setUserinfo({
                               //   userRealName: e.currentTarget.value
                               // });
                             }}/>
                  }

                </div>

                <div className="middle-symbol flex-row justify-content-center align-items-center"/>
                {userinfo.realStatus === 1 ? <div className="input-with-unit width280 lineheight48">
                    <span>{this.singin(personInfo.sex)}</span>
                  </div> :
                  <div className="input-with-unit width280 height36">
                    {
                      userinfo.realStatus === 1 ?
                        <Select value={this.singin(personInfo.sex)} onChange={this.handleChange} disabled/>
                        :
                        <Select value={this.singin(personInfo.sex)} onChange={this.handleChange}>
                          <Option value="0">保密</Option>
                          <Option value="1">先生</Option>
                          <Option value="2">女士</Option>
                        </Select>
                    }

                  </div>
                }
              </div>
            </div>
            <div className="form-group   flex-column">
              <label className="input-label">手机号码<span className="label-dot">*</span> </label>
              {
                (personInfo.mobile || this.state.phoneState) ?
                  <div className="input-control-group flex-row">
                    <div className="input-with-unit  width400 backgroungray">
                      <input type="number" className="form-control" readOnly
                             value={personInfo.mobile || this.state.phoneNumber}/>
                    </div>
                    <div className="input-with-unit">
                      <p>手机号码已认证，如需修改请在账号安全中心进行操作</p>
                    </div>
                  </div>
                  :
                  <div className="input-control-group flex-row">
                                        <span className="bindAccount" onClick={() => {
                                          this.setState({
                                            editCodeType: 'editPhone',
                                            showMobox: true,
                                          });
                                        }}>绑定手机账号</span>
                  </div>
              }
            </div>

            <div className="form-group   flex-column">
              <label className="input-label">电子邮箱<span className="label-dot">*</span> </label>
              {
                (personInfo.email || this.state.emailState) ?
                  <div className="input-control-group flex-row">
                    <div className="input-with-unit  width400 backgroungray">
                      <input type="text" className="form-control" readOnly
                             value={personInfo.email || this.state.emailNumber}/>
                    </div>
                    <div className="input-with-unit">
                      <p>邮箱已绑定，如需修改请在账号安全中心进行操作</p>
                    </div>
                  </div>
                  :
                  <div className="input-control-group flex-row">
                                        <span className="bindAccount" onClick={() => {
                                          this.setState({
                                            editCodeType: 'editEmail',
                                            showMobox: true,
                                          });
                                        }}>绑定邮箱账号</span>
                  </div>
              }
            </div>
            <div className="form-group   flex-column">
              <label className="input-label">联系地址<span className="label-dot">*</span></label>
              <div className="input-control-group">
                <div className="input-with-unit width153 height36">
                  <Select style={{ width: 153 }} placeholder="请选国别"
                          value={personInfo.country}
                          onChange={(value) => {

                            this.setState({
                              personInfo: {
                                ...personInfo,
                                country: value
                              }
                            });
                            // user.setUserinfo({ country: value });
                          }}
                  >
                    {[] && countryArr.map(item => (
                      <Option key={item.id} value={item.fullName}>{item.fullName}</Option>
                    ))}
                  </Select>
                </div>
                <div className="input-with-unit width139 height36">
                  <Select style={{ width: 139 }} placeholder="请选省份"
                          value={personInfo.province}
                          onChange={(value) => {
                            this.setState({
                              personInfo: {
                                ...personInfo,
                                province: value
                              }
                            });
                            // user.setUserinfo({ province: value });
                          }}>
                    {[] && provinceArr.map(city => (
                      <Option key={city.id} value={city.fullName}>{city.fullName}</Option>
                    ))}
                  </Select>
                </div>
                <div className="input-with-unit width482 height36">
                  <input type="text" className="form-control" placeholder="填写具体地址"
                         onChange={async e => {
                           this.setState({
                             personInfo: {
                               ...personInfo,
                               address: e.currentTarget.value
                             }
                           });
                           // user.setUserinfo({
                           //   address: e.currentTarget.value
                           // });
                         }}
                         value={personInfo.address}
                  />
                </div>
              </div>
            </div>

            <div className="form-group flex-column">
              <label className="input-label">感兴趣的IP品类<span className="label-dot">*</span></label>
              <div className="sub-type-area ip-Type-list">
                <div className="sub-type-list flex-fill flex-row flex-wrap">
                  {
                    interestDataList.length > 0 && interestDataList.map(element => {
                      let { interestCategory } = personInfo;
                      let tmp = interestCategory.split(',');
                      let checkboxClicked = !!_find(tmp, val => element.mainTypeGuid === val) ? "sub-item-selected" : "";

                      return (
                        <div
                          onClick={async () => {
                            let { user } = this.props;
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
                              personInfo: {
                                ...personInfo,
                                interestCategory: _interestCategory
                              }
                            });
                            // user.setUserinfo({ interestCategory: _interestCategory });
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
              <label className="input-label">任职企业</label>
              <input
                type="text"
                className="form-control"
                placeholder="填写您所任职的企业"
                maxLength={100}
                onChange={e => {

                  this.setState({
                    personInfo: {
                      ...personInfo,
                      companyName: e.currentTarget.value
                    }
                  });

                  // user.setUserinfo({
                  //   companyName: e.currentTarget.value
                  // });
                }}
                value={personInfo.companyName}
              />
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">任职部门</label>
              <input
                type="text"
                maxLength={100}
                className="form-control"
                placeholder="填写您所任职部门"
                onChange={e => {
                  this.setState({
                    personInfo: {
                      ...personInfo,
                      companyDepartment: e.currentTarget.value
                    }
                  });
                  // user.setUserinfo({ companyDepartment: e.currentTarget.value });
                }}
                value={personInfo.companyDepartment}
              />
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">任职岗位</label>
              <input
                type="text"
                className="form-control"
                maxLength={100}
                placeholder="填写您的职业"
                onChange={e => {
                  this.setState({
                    personInfo: {
                      ...personInfo,
                      occupation: e.currentTarget.value
                    }
                  });
                  // user.setUserinfo({ occupation: e.currentTarget.value });
                }}
                value={personInfo.occupation}
              />
            </div>
            <div className="form-group  flex-column">
              <label className="input-label">获奖奖项</label>
              <input
                type="text"
                className="form-control"
                maxLength={500}
                placeholder="如有多个，请用；号隔开"
                onChange={e => {
                  this.setState({
                    personInfo: {
                      ...personInfo,
                      awards: e.currentTarget.value
                    }
                  });
                  // user.setUserinfo({ awards: e.currentTarget.value });
                }}
                value={personInfo.awards}
              />
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">个人标签</label>
              <input
                type="text"
                className="form-control"
                maxLength={500}
                placeholder="填写您的个人标签或签名（不超过20个汉字或40个字符）"
                onChange={e => {
                  this.setState({
                    personInfo: {
                      ...personInfo,
                      tags: e.currentTarget.value
                    }
                  });
                  // user.setUserinfo({ tags: e.currentTarget.value });
                }}
                value={personInfo.tags}
              />
            </div>

            <div className="form-group  flex-column">
              <label className="input-label">个人简介</label>
              <textarea
                onChange={e => {
                  this.setState({
                    personInfo: {
                      ...personInfo,
                      userDesc: e.currentTarget.value
                    }
                  });
                  // user.setUserinfo(
                  //   { userDesc: e.target.value }
                  // );
                }}
                maxLength={1000}
                value={personInfo.userDesc}
                className="form-control textarea"
                placeholder="请在此处填写IP简介(限1000字)"
                rows={6}/>
            </div>
            <button className="puton" onClick={async () => {
              await this.putData();
            }}>提交
            </button>
          </div>
          :
          <div className="firstShow">
            <p><span className="itemTitle">手机号码</span>{this.isNull(person.mobile)}
              {/*<span className="gray">仅自己可见</span>*/}
            </p>
            <p><span className="itemTitle">电子邮箱</span>{this.isNull(person.email)}
              {/*{personInfo.email ? <span className="gray">所有人可见</span> : ''}*/}
            </p>
            <p>
              <span className="itemTitle">联系地址</span>
              <span>{person.country}{person.province}{this.isNull(person.address)}</span>
            </p>
            <p style={{ display: 'flex' }}>
              <span className="itemTitle">感兴趣的IP品类</span>
              <span className='item-word'>{this.getCategory(person.interestCategory)}</span>
            </p>
            <p><span className="itemTitle">任职公司</span><span>{this.isNull(person.companyName)}</span></p>
            <p><span className="itemTitle">任职部门</span><span>{this.isNull(person.companyDepartment)}</span></p>
            <p><span className="itemTitle">任职岗位</span><span>{this.isNull(person.occupation)}</span></p>
            <p><span className="itemTitle">获得奖项</span><span>{this.isNull(person.awards)}</span></p>
            <div className="boxFlot clearfix">
              <span className="itemTitle">个人标签</span>
              <div className="description">{this.isNull(person.tags)}</div>
            </div>
            <div className="boxFlot clearfix">
              <span className="itemTitle">个人简介</span>
              <div className="description">{this.isNull(person.userDesc)}</div>
            </div>
            <button className="edit-data" onClick={() => {
              this.props.childIsEdit(true);
              this.setState({
                personInfo: { ...person }
              });
            }}>修改资料
            </button>
          </div>
        }
        {this.state.show &&
        <Toast
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
