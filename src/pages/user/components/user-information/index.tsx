// 用户信息
import * as React from 'react';
import 'assets/scss/user_information.scss';
import icon_warn from '@assets/images/user/information/icon_warning@2x.png';
import icon_add from '@assets/images/add.svg';
import { message, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { savePic } from '@utils/api';
import _find from 'lodash/find';
import {Link} from 'react-router-dom';
import { get } from 'mobx';
import icon_red_close from '@assets/images/update/ic_red_close.png';
import _isEmpty from 'lodash/isEmpty';
import BasicInfo from '@pages/user/components/user-information/components/basic-info';
const { Option } = Select;

interface IUserInfoState {
  showToast: boolean;
  accountType: number;
  imgObj: { // 企业风采图
    result: any,
    imgUrl: any,
  };
  logoImgObj: { // 企业LOGO
    result: any,
    imgUrl: any,
  };
  ExhibitionArr: any; // 风采
  isEdit: boolean;
}
@inject('user_information', 'login', 'user')
@observer
export default class UserInformation extends React.Component<any, IUserInfoState>{
 constructor(props: any) {
   super(props);
   this.state = {
     showToast: false,
     accountType: 2,
     imgObj: {
       result: '',
       imgUrl: '',
     },
     logoImgObj: {
       result: '',
       imgUrl: '',
     },
     ExhibitionArr: [],
     isEdit: true,
   };
 }

 async componentDidMount(){
   document.title = '用户信息';
   const { user_information,  login } = this.props;
   const {userAttribute, promptPerfectInformation, userGuid } = login.userInfo || { userAttribute: '', promptPerfectInformation: '', userGuid: '' };
   // userAttribute: 1=个人， 2=企业, promptPerfectInformation： true=提示，false 不提示。
   if (userAttribute) {
     this.setState({
       accountType: userAttribute
     });
   }
   if (promptPerfectInformation ) {
     this.setState({
       isEdit: true
     });
   } else {
     this.setState({
       isEdit: false
     });
   }

   if (userAttribute && !promptPerfectInformation){
     await user_information.getCompanyInfo(userGuid);
     await user_information.getUserInfo(userGuid);
   }
   // 提交状态清空值
   if (this.state.isEdit) {
     user_information.clearCompanyParams();
     user_information.clearPersonParams();
   }
   await user_information.getCompanyType({ type: 3});
   await user_information.getCompanyType({ type: 11});
   await user_information.getCompanyType({ type: 12});
   await user_information.getListMainType();
   await user_information.getAuthorize(3);
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
        message.warning('图片过大,请重新上传！');
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
          message.warning( `${result['result'].errorMsg}`);
        }
      }

    };
  };

   // checkbox 多选
  baseSelectCheck( param, element) {
    param = param ? param.split(',') : [];
    let count = false;
    let index_ = 0;
    param.forEach((val, index) => {
      if (val === element) {
        index_ = index;
        count = true;
        console.log(val, element);
      }
    });
    if (count) {
      param.splice(index_, 1);
    } else {
      param.push(element);
    }
    let _params = param.join(',');
    let reg = /,{1+}/g;
    _params.replace(reg, ",");
    return _params;
  }

  // change isEdit
  changeIsEdit = (flag) => {
    this.setState({
      isEdit: flag
    });
  };
  // submit
  submitFun = async () => {
    const { accountType } = this.state;
    const { user_information, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    if (accountType === 1) {
      const { status, data } = await user_information.personSubmit(userGuid);
      if (status) {
        await user_information.getUserInfo(userGuid);
        this.changeIsEdit(false);
      } else {
        data && message.error(data.errorMsg);
      }
    } else {
      const { status, data } = await user_information.companySubmit(userGuid);
      if (status) {
        await user_information.getCompanyInfo(userGuid);
        this.changeIsEdit(false);
      } else {
        data && message.error(data.errorMsg);
      }
    }
  };

  // edit
  editFun = async () => {
    const { accountType } = this.state;
    const { user_information, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };

    if (accountType === 1) {
      const { status, data } = await user_information.personEdit(userGuid);
      if (status) {
        await user_information.getUserInfo(userGuid);
        this.changeIsEdit(false);
      } else {
        data && message.error(data.errorMsg);
      }
    } else {
      const { status, data } = await user_information.companyEdit(userGuid);
      if (status) {
        await user_information.getCompanyInfo(userGuid);
        this.changeIsEdit(false);
      } else {
        data && message.error(data.errorMsg);
      }
    }
  };

  render(){
    const { user_information, login } = this.props;
    const {userAttribute, promptPerfectInformation } = login.userInfo || { userAttribute: '' , promptPerfectInformation: ''};
    const { accountType, imgObj, isEdit } = this.state;
    const { userGuid } = login.userInfo || { userGuid: '' };
    const {
      platformPurposeList, ipCaseList, interestDataList, intentAuthorizationList,
      designTypeList, areasOfExpertiseList, industryList, companyInfo, personInfo,
      worksUrlList,
    } = user_information;
    const company = accountType === 2 ;
    const person = accountType === 1;
    const common = accountType > 0;
   // promptPerfectInformation
    const companyParams = get(user_information, 'companyParams');
    const personParams = get(user_information, 'personParams');
    const cooperativeContacts = get(companyParams, 'cooperativeContacts'); // 合作联系人
    const haveIp = company ? get(companyParams, 'haveIp') : get(personParams, 'haveIp'); // 代理的IP
    const purposeIp = company ? get(companyParams, 'purposeIp') :  get(personParams, 'purposeIp'); // 意向IP

    const  interestCategory = company ? get(companyParams, 'interestCategory') : get(personParams, 'interestCategory'); // 感兴趣
    const  designType = company ? get(companyParams, 'designType') : get(personParams, 'designType'); // 设计类型
    const adept = company ? get(companyParams, 'adept') :  get(personParams, 'adept'); // 擅长领域
    const hasCooperate = company ? get(companyParams, 'hasCooperate') :  get(personParams, 'hasCooperate'); // 是否已有IP合作案例
    const worksWebsite = company ? get(companyParams, 'worksWebsite') :  get(personParams, 'worksWebsite'); //
    const purpose = company ? get(companyParams, 'purpose') :  get(personParams, 'purpose'); //
    const worksUrl = company ?  get(companyParams, 'worksUrl') :  get(personParams, 'worksUrl');

    return (
      <div className="user-info-content">
        <p className="title">用户信息</p>
        {
          isEdit ?
            <div className="content">
              <div className="warning-text">
                <img src={icon_warn} alt=""/>
                用户信息越完善，用户星级越高，越容易成为优质用户，获得更多特权和露出推广合作机会。
              </div>
              <div className="form-group">
                <label className="input-label">账号号码</label>
                <div className="input-control-group  account-group">
                  <input type="text" disabled value={'17796544516'}/>
                  <span className="text-desc">账号已认证，如需修改请在账号安全中心进行</span>
                </div>
              </div>
              {
                !userAttribute ?
                  <div className="form-group">
                    <label className="input-label">账户性质 <span className="label-dot">*</span></label>
                    <div className="input-control-group  radio-group flex-wrap flex-row">
                      <div className={`ip-radio flex-row align-items-center ${accountType === 2 && "radio-selected"}`}>
                        <div className="limit-custom-radio" onClick={() => {
                          this.setState({
                            accountType: 2,
                          });
                          user_information.changePlatformPurposeTab(1);
                          user_information.clearPersonParams();
                        }}/>
                        <span className="radio-text">企业账户</span>
                      </div>
                      <div className={`ip-radio flex-row align-items-center ${accountType === 1 && 'radio-selected'}`}>
                        <div className="limit-custom-radio" onClick={() => {
                          this.setState({
                            accountType: 1,
                          });
                          user_information.changePlatformPurposeTab(1);
                          user_information.clearCompanyParams();
                        }}/>
                        <span className="radio-text">个人账户</span>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="form-group">
                    <label className="input-label">账户性质</label>
                    <div className="input-control-group  account-group">
                      <input type="text" disabled value={`${ accountType === 2 ? '企业账户' : '个人账户'}`}/>
                      { accountType === 1 && <span className="text-desc" >个人用户如需升级为企业用户，须对企业资质进行的认证，立即前往 <Link className='text-decoration'
                                                                                       to=''> 企业认证</Link></span>}
                    </div>
                  </div>
              }

              {
                //  企业账户信息（未填）
                common &&
                <div>
                  <div className={company ? 'show' : 'hide'}>
                    <div className="form-group ">
                      <label className="input-label">企业全称<span className="label-dot">*</span> </label>
                      <div className="input-control-group flex-row">
                        <input type="text"
                               className="form-control"
                               placeholder="请输入企业全称"
                               value={get(companyParams, 'companyName')}
                               onChange={e => user_information.changeCompanyParams({ companyName: e.currentTarget.value })}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="input-label">行业分类 <span className="label-dot">*</span> </label>
                      <div className="input-control-group">
                        <Select className="custom-antSelect" style={{ width: '100%', height: 48 }}
                                value={get(companyParams, 'companyIndustry')}
                                onChange={value => user_information.changeCompanyParams({ 'companyIndustry': value })}
                                placeholder="请选择企业所属行业">
                          {
                            industryList && industryList.map((i, idx) =>
                              <Option value={i.resourceValue} key={idx}>{i.resourceValue}</Option>
                            )
                          }
                        </Select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="input-label">企业经营的业务/产品 <span className="label-dot">*</span></label>
                      <textarea className="textarea147"
                                value={get(companyParams, 'companyProduct ')}
                                onChange={e => user_information.changeCompanyParams({ companyProduct: e.currentTarget.value })}
                                placeholder="请输入企业经营的业务或产品"/>
                    </div>
                  </div>
                  <div className={person ? 'show' : 'hide'}>
                    <div className="form-group">
                      <label className="input-label">姓名<span className="label-dot">*</span> </label>
                      <div className="input-control-group">
                        <input type="text"
                               className="form-control"
                               placeholder="请输入姓名"
                               value={get(personParams, 'userRealName')}
                               onChange={e => user_information.changePersonParams({ userRealName: e.currentTarget.value })}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="input-label">联系方式
                        <span className="label-dot">*</span>
                        <span className="label-desc">（手机号、邮箱、微信、QQ不限）</span>
                      </label>
                      <div className="input-control-group">
                        <input type="text"
                               className="form-control"
                               placeholder="请输入联系方式"
                               value={get(personParams, 'contactInfo')}
                               onChange={e => user_information.changePersonParams({ contactInfo: e.currentTarget.value })}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="input-label">所属企业</label>
                      <div className="input-control-group">
                        <input type="text"
                               className="form-control"
                               placeholder="请输入所属企业名称 "
                               value={get(personParams, 'companyName')}
                               onChange={e => user_information.changePersonParams({ companyName: e.currentTarget.value })}/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="input-label">来平台目的<span className="label-dot">*</span></label>
                    <div className="input-control-group  radio-group flex-wrap flex-row">
                      {
                        platformPurposeList && platformPurposeList.map((i, idx) => {
                          return (
                            <div
                              className={`ip-radio flex-row align-items-center ${purpose === i.value && "radio-selected"}`}
                              key={idx}
                              onClick={() => {
                                user_information.changePlatformPurposeTab(i.value);
                              }}
                            >
                              <div className="limit-custom-radio"/>
                              <span className="radio-text">{i.label}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  {
                    company &&
                    <div className="form-group">
                      <div className="label-box">
                        <label className="input-label">合作联系人<span className="label-dot">*</span></label>
                        <div className="add-btn"
                             onClick={() => {
                               let obj = { name: '', position: '', contactInfo: '' };
                               user_information.editCooperativeContacts([...cooperativeContacts, obj])
                             }}
                        >
                          <img src={icon_add} alt=""/> 添加合作联系人
                        </div>
                      </div>
                      {
                        cooperativeContacts && cooperativeContacts.map((item, idx) => {
                          return (
                            <div className="input-control-group contact-person flex-wrap flex-row" key={idx}>
                              <input type="text" className="form-control input504"
                                     value={item.name}
                                     onChange={e => {
                                       let arr = cooperativeContacts;
                                       arr[idx].name = e.currentTarget.value;
                                       user_information.editCooperativeContacts(arr);
                                     }}
                                     placeholder="请输入合作联系人的姓名"/>
                              <input type="text" className="form-control input312"
                                     value={item.position}
                                     onChange={e => {
                                       let arr = cooperativeContacts;
                                       arr[idx].position = e.currentTarget.value;
                                       user_information.editCooperativeContacts(arr);
                                     }}
                                     placeholder="请输入合作联系人职位"/>
                              <input type="text" className="form-control input"
                                     value={item.contactInfo}
                                     onChange={e => {
                                       let arr = cooperativeContacts;
                                       arr[idx].contactInfo = e.currentTarget.value;
                                       user_information.editCooperativeContacts(arr);
                                     }}
                                     placeholder="请输入联系方式(手机、邮箱、微信、QQ都可"/>
                              {
                                idx > 0 &&
                                <img className="u-close"
                                     onClick={() => {
                                       let arr = cooperativeContacts;
                                       arr.splice(idx, 1);
                                       user_information.editCooperativeContacts(arr);
                                     }}
                                     src={icon_red_close} alt=""/>
                              }
                            </div>
                          );
                        })
                      }
                    </div>
                  }
                  { // 版权方
                    user_information.platformPurposeTab === 1 &&
                    <div className="form-group">
                      <div className="label-box">
                        <label className="input-label">拥有/代理的IP名称
                          <span className="label-dot">*</span>
                          <span className="label-desc">（你可以上传该IP，以便获得更多的曝光量及授权的合作机会）</span>
                        </label>
                        <div className="add-btn"
                             onClick={() => {
                               let obj = { name: '', ipType: '', authorizeType: '' };
                               user_information.editHaveIp([...haveIp, obj]);
                             }}
                        >
                          <img src={icon_add} alt=""/> 添加IP名称
                        </div>
                      </div>
                      {
                        haveIp && haveIp.map((i, idx) => {
                          return (
                            <div className="input-control-group contact-person flex-wrap flex-row" key={idx}>
                              <input type="text" className="form-control input504"
                                     value={i.name}
                                     onChange={e => {
                                       let arr = haveIp;
                                       arr[idx].name = e.currentTarget.value;
                                       user_information.editHaveIp(arr);
                                     }}
                                     placeholder="请输入IP名称"/>
                              <Select className="input312" style={{ width: 312, height: 48 }}
                                      value={i.ipType}
                                      onChange={value => {
                                        let arr = haveIp;
                                        arr[idx].ipType = value;
                                        user_information.editHaveIp(arr);
                                      }}
                                      placeholder="请选择IP类型 ">
                                {
                                  interestDataList && interestDataList.map(item =>
                                    <Option key={item.typeName}>{item.typeName}</Option>
                                  )
                                }
                              </Select>
                              <Select
                                className="custom-antdInput"
                                mode="multiple"
                                allowClear
                                style={{ width: '100%', height: 48 }}
                                placeholder="请选择该IP意向授权的品类"
                                size="large" showArrow={true} notFoundContent={null} filterOption={false}
                                value={!_isEmpty(i.authorizeType) ? i.authorizeType.split(',') : []}
                                onChange={value => {
                                  let arr = haveIp;
                                  arr[idx].authorizeType = value && value.join(',');
                                  user_information.editHaveIp(arr);
                                }}
                              >
                                {(intentAuthorizationList || []).map((item, index) => {
                                  return (
                                    <Option key={index} value={item.typeName}>{item.typeName}</Option>
                                  );
                                })}
                              </Select>
                              {
                                idx > 0 &&
                                <img className="u-close"
                                     onClick={() => {
                                       let arr = haveIp;
                                       arr.splice(idx, 1);
                                       user_information.editHaveIp(arr);
                                     }}
                                     src={icon_red_close} alt=""/>
                              }
                            </div>
                          )
                        })
                      }

                    </div>
                  }
                  { // 需求方
                    user_information.platformPurposeTab === 2 &&
                    <div>
                      <div className="form-group">
                        <label className="input-label">感兴趣的IP品类
                          <span className="label-dot">*</span>
                        </label>
                        <div className="input-control-group checkbox-group">
                          <div className="sub-type-list flex-fill flex-row flex-wrap">
                            {
                              interestDataList && interestDataList.map(element => {
                                let tmp = interestCategory && interestCategory.split(',');
                                let checkboxClicked = !!_find(tmp, val => element.typeName === val) ? "sub-item-selected" : "";
                                return (
                                  <div
                                    onClick={async () => {
                                      const _param = this.baseSelectCheck(interestCategory, element.typeName);
                                      accountType === 1 ?
                                        user_information.changeCompanyParams({ interestCategory: _param })
                                        :
                                        user_information.changePersonParams({ interestCategory: _param });
                                    }}
                                    key={element.mainTypeGuid}
                                    className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                                    <div className="custom-checkbox"/>
                                    <div className="checkbox-text">{element.typeName}</div>
                                  </div>
                                );

                              })
                            }

                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="label-box">
                          <label className="input-label">意向IP</label>
                          <div className="add-btn"
                               onClick={() => {
                                 user_information.editPurposeIp([...purposeIp, ''])
                               }}
                          ><img src={icon_add} alt=""/> 添加意向IP
                          </div>
                        </div>
                        {
                          purposeIp && purposeIp.map((item, idx) => {
                            return (
                              <div className="input-control-group contact-person" key={idx}>
                                <input type="text" className="form-control"
                                       value={item}
                                       onChange={e => {
                                         let arr = purposeIp;
                                         // const arr2 = e.currentTarget.value.split(',');
                                         arr[idx] = e.currentTarget.value;
                                         user_information.editPurposeIp(arr);
                                       }}
                                       placeholder="是否有意向合作的ip,如有请填写ip名称"/>
                                {
                                  idx > 0 &&
                                  <img className="u-close"
                                       onClick={() => {
                                         let arr = purposeIp;
                                         arr.splice(idx, 1);
                                         user_information.editPurposeIp(arr);
                                       }}
                                       src={icon_red_close} alt=""/>
                                }
                              </div>
                            )
                          })
                        }
                      </div>

                    </div>
                  }
                  {
                    // 设计接单
                    user_information.platformPurposeTab === 3 &&
                    <div>
                      <div className="form-group">
                        <label className="input-label">证明{company ? "企业" : "自己"}实力的作品链接<span
                          className="label-dot">*</span></label>
                        <input type="text" className="form-control"
                               value={worksWebsite}
                               onChange={e => {
                                 company ?
                                   user_information.changeCompanyParams({ worksWebsite: e.currentTarget.value })
                                   :
                                   user_information.changePersonParams({ worksWebsite: e.currentTarget.value });
                               }}
                               placeholder={`请填写证明${company ? "企业" : "自己"}的作品链接，Behance/站酷/dribbble等主页地址或其他存放作品的地址`}/>
                      </div>
                      <div className="form-group">
                        <label className="input-label">设计作品
                          <span className="label-dot">*</span>
                        </label>
                        <div className="input-control-group design-product-group">
                          <div className="no-upload">
                            <div className="upload-files">
                              <span>点击上传</span>
                              <input type="file" className="btn-file" name="image_file"
                                     accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                                     style={{ width: "100%", height: "100%", opacity: 0 }}
                                     title="请选择文件"
                                     onChange={ async e => await user_information.uploadDesign(e, 1, accountType, true)}
                              />
                            </div>
                            <p className="design__warning">
                              *为了尽可能完整真实地说明您的设计能力，请您上传至少1-2个具有代表性的已完成的商业作品案例，最多不超过5个，
                              如需展示更多案例，您可以整合在同一个PDF中上传，同时您可以上传您的团队介绍，以便让我们更好的了解您。
                              平台支持PDF、JPG、JPEG、PNG、GIF、PPT、PPTX格式 ，暂不支持视频格式；每个作品文件请保持在 20Mb 以内。
                            </p>
                          </div>
                          <div className="upload-list">
                            {
                              worksUrl && worksUrl.map((i, idx) => {
                                return (
                                  <div className="list-item" key={idx}>{i.name}
                                     <div className="list-item__right">
                                        <span onClick={() => {
                                           window.open(i.url);
                                        }}>预览</span>
                                       <span onClick={() => {
                                         let arr  = worksUrlList;
                                         arr.splice(idx, 1);
                                         user_information.editWorksUrlList(arr, accountType);
                                       }}>删除</span>
                                     </div>
                                  </div>
                                  )
                              })
                            }
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="input-label">承接设计类型
                          <span className="label-dot">*</span>
                        </label>
                        <div className="input-control-group checkbox-group">
                          <div className="sub-type-list flex-fill flex-row flex-wrap">
                            {
                              designTypeList && designTypeList.map((element, idx) => {
                                let tmp = designType && designType.split(',');
                                let checkboxClicked = !!_find(tmp, val => element.resourceValue === val) ? "sub-item-selected" : "";
                                return (
                                  <div
                                    onClick={async () => {
                                      const _param = this.baseSelectCheck(designType, element.resourceValue);
                                      company ?
                                        user_information.changeCompanyParams({ designType: _param })
                                        :
                                        user_information.changePersonParams({ designType: _param });
                                    }}
                                    key={idx}
                                    className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                                    <div className="custom-checkbox"/>
                                    <div className="checkbox-text">{element.resourceValue}</div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="input-label">擅长领域
                          <span className="label-dot">*</span>
                        </label>
                        <div className="input-control-group checkbox-group">
                          <div className="sub-type-list flex-fill flex-row flex-wrap">
                            {
                              areasOfExpertiseList && areasOfExpertiseList.map((element, idx) => {
                                let tmp = adept && adept.split(',');
                                let checkboxClicked = !!_find(tmp, val => element.resourceValue === val) ? "sub-item-selected" : "";
                                return (
                                  <div
                                    onClick={async () => {
                                      const _adept = this.baseSelectCheck(adept, element.resourceValue);
                                      company ?
                                      user_information.changeCompanyParams({ adept: _adept })
                                      :
                                      user_information.changePersonParams({ adept: _adept });
                                    }}
                                    key={idx}
                                    className={`sub-item flex-row justify-content-center align-items-center ${checkboxClicked}`}>
                                    <div className="custom-checkbox"/>
                                    <div className="checkbox-text">{element.resourceValue}</div>
                                  </div>
                                );

                              })
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {
                    company && user_information.platformPurposeTab !== 3 &&
                    <div className="form-group">
                      <label className="input-label">是否已有IP合作案例<span className="label-dot">*</span></label>
                      <div className="input-control-group  radio-group flex-wrap flex-row">
                        {
                          ipCaseList && ipCaseList.map((i, idx) => {
                            return (
                              <div className={`ip-radio flex-row align-items-center ${ hasCooperate === i.value && "radio-selected"}`}
                                key={idx}
                                onClick={() => user_information.changeIpCaseTab(i.value)}
                              >
                                <div className="limit-custom-radio"/>
                                <span className="radio-text">{i.label}</span>
                              </div>
                            );
                          })
                        }
                      </div>
                      <p className="form-group__warning"><span className="label-dot">注：</span>添加已合作的IP案例可以帮您增强企业及IP在平台的影响力，获得更多的推送和合作机会，请在案例管理里上传相关案例
                      </p>
                    </div>
                  }
                  <div className={company ? 'show' : 'hide'}>
                    <div className="form-group">
                      <label className="input-label">企业地址<span className="label-dot">*</span></label>
                      <input type="text" className="form-control"
                             value={get(companyParams, 'companyAddress ')}
                             onChange={e => user_information.changeCompanyParams({ companyAddress: e.currentTarget.value })}
                             placeholder="请输入企业地址"/>
                    </div>
                    <div className="form-group">
                      <label className="input-label">企业简介<span className="label-dot">*</span></label>
                      <textarea className="textarea100" maxLength={5000}
                                value={get(companyParams, 'companyDesc ')}
                                onChange={e => user_information.changeCompanyParams({ companyDesc: e.currentTarget.value })}
                                placeholder="填写您的企业介绍，不超过5000字"/>
                    </div>
                    <div className="form-group">
                      <label className="input-label">企业风采</label>
                      <div className="upload company-upload">
                        {
                          imgObj.imgUrl && imgObj.imgUrl.map((item, index) => {
                            return (
                              <div key={index} className="load background-none" title="点击可删除" onClick={() => {
                                imgObj.result.splice(index, 1);
                                imgObj.imgUrl.splice(index, 1);
                                user_information.changeCompanyParams({
                                  companyExhibition: imgObj.result.join(','),
                                  exhibitionUrl: imgObj.imgUrl.join(','),
                                });

                              }}>
                                {item ? <span className="hoverShow">点击可删除</span> : <span>添加企业风采</span>}
                                <img src={item} alt="" title="点击可删除"/>
                                {
                                  !item &&
                                  <input type="file" className="btn_file" name="image_file"
                                         accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                                         style={{ width: "100%", height: "100%", opacity: 0 }}
                                         title="请选择文件"
                                         onChange={
                                           this.uploadImg.bind(this, 'papersPositivePicGuid', 5, 'cardFile')
                                         }/>
                                }
                              </div>
                            );
                          })
                        }

                        {
                          imgObj.result.length < 6 &&
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
                  </div>
                  {
                    person &&
                    <div className="form-group">
                      <label className="input-label">个人简介</label>
                      <textarea className="textarea100"
                                value={get(personParams,  'userDesc')}
                                onChange={e => user_information.changePersonParams({ userDesc: e.currentTarget.value })}
                                placeholder="填写您的个人介绍，不超过2000字" maxLength={2000}/>
                    </div>
                  }

                </div>
              }
              <div className="form-group btn-group">
                {
                   promptPerfectInformation ?
                    <button className={`btn-submit ${!common ? 'disabled' : ''}`}
                            onClick={this.submitFun}>提交
                    </button>
                    :
                    <button className={`btn-submit ${!common ? 'disabled' : ''}`}
                            onClick={this.editFun}>更新
                    </button>
                }

              </div>
            </div>
          :
            <BasicInfo company={companyInfo} person={personInfo}
                       changeIsEdit={this.changeIsEdit}
                       accountType={accountType}/>
        }
      </div>
    )
  }
}
