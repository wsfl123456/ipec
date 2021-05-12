import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/certific.scss";
import { Select } from "antd";
import Toast from "@components/toast";
import {
  savePic,
  personalNewVrified,
  companyNewVrified,
  personEnterPrise,
  userPrejudgment
} from "@utils/api";
import _isEmpty from "lodash/isEmpty";

const { Option } = Select;
let companyTypeArr = [],
  companyTypeArr2 = [],
  idType = [];
let idTypeKV = {
  1: "身份证",
  2: "护照",
  3: "其他",
};
let c_disabled = false;
let p_disabled = false;

interface ICertificData extends IComponentProps {
  userGuid?: string;
  RealName: any;
  userAttribute: any;
  realStatus: any;
  personInfo: any;
  companyInfo: any;
}

interface ICertificState {
  data?: any;
  alertShow: boolean;
  certiMessage: string; // 提交信息验证提示
  imgArr: any; // 存储上传的图片信息
  uploadArr: any;
  companytype: any; // 记录当前页面公司的状态分类
  accountType: number | null; // 账户性质
  isUpgrade: boolean; // 判断是升级操作
  canChangeType: boolean; // 判断账号性质是否可选
  isRising: boolean; // 判断当前认证是否在升级审核中
  auditReason: string; // 审核拒绝理由
  userAttribute: any;
  realStatus: any;
  companyRealStatus: any;
}

@inject("user")
@observer
export default class Certific extends React.Component<
  ICertificData,
  ICertificState
> {
  constructor(props) {
    super(props);
    this.state = {
      alertShow: false,
      certiMessage: "",
      companytype: "",
      imgArr: [],
      uploadArr: [],
      accountType: null,
      isUpgrade: false,
      canChangeType: true,
      isRising: false,
      auditReason: "",
      userAttribute: null,
      realStatus: null,
      companyRealStatus: null,
    };
  }

  async componentDidMount() {
    const {
      user,
      userGuid,
    } = this.props;

    const {result: {data: { userAttribute, realStatus, companyRealStatus, personalTurnEnterprise, realResult  }}}: any = await userPrejudgment(userGuid);
    this.setState({
      userAttribute,
      realStatus,
      companyRealStatus,
      accountType: userAttribute,
      isRising: personalTurnEnterprise,
      auditReason: realResult,
    })

    if (userAttribute) {
      this.setState({
        canChangeType: false,
      });
    }

    const getPersonInfo = async () => {
      await user.getPersonalVerification(userGuid);
      // 证件类型getCompanyType
      await user.getCompanyType({ type: 6 });
      idType = user.companyType.map((item) => (
        <Option key={item.resourceKey}>{item.resourceValue}</Option>
      ));
    };
    const getCompanyInfo = async () => {
      await user.getCompanyVerification(userGuid);
      // 企业类型
      await user.getCompanyType({ type: 5 });
      user.companyType &&
        user.companyType.map((item, index) => {
          companyTypeArr2.push(item.resourceValue);
          companyTypeArr.push(
            <Option key={item.createUserGuid + index} value={item.resourceKey}>
              {item.resourceValue}
            </Option>
          );
        });
    };
    const { isRising } = this.state;
    // 认证数据展示
    if (userAttribute === 1) {
      if (isRising) {
        getCompanyInfo();
      } else {
        getPersonInfo();
      }
    } else if (userAttribute === 2) {
      getCompanyInfo();
    } else {
      if (realStatus === 3) {
        getPersonInfo();
      } else if (companyRealStatus === 3) {
        getCompanyInfo();
      } else {
        // 证件类型getCompanyType
        await user.getCompanyType({ type: 6 });
        idType = user.companyType.map((item) => (
          <Option key={item.resourceKey}>{item.resourceValue}</Option>
        ));
      }
    }

    // 证件照链接
    if (!_isEmpty(user.verification.papersPic)) {
      let imgArr = user.verification.papersPic;
      this.setState({
        imgArr,
      });
    } else {
      this.setState({
        imgArr: [],
      });
    }

    user.getlistMainType();
  }

  signIn(value) {
    const tmp = ["保密", "先生", "女士"];
    return tmp[Number(value)];
  }

  // 验证提交数据
  putCertificate = async () => {
    const { user, userGuid } = this.props;
    const { accountType, userAttribute } = this.state;
    const { verification } = user;
    let pictureMaterial = [];
    if (accountType === 1) {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 身份证
      let reg2 = /^[a-zA-Z0-9]{5,17}$/; // 护照

      // 新增加的图片guid
      let arr2 = this.state.uploadArr.map((item) => item.result);
      // 证件的guid
      const picGuid = verification.pictureMaterial
        ? verification.pictureMaterial.split(",")
        : [];
      pictureMaterial = [...picGuid, ...arr2];

      if (!verification.userRealName) {
        this.setState({ certiMessage: "请输入真实姓名", alertShow: true });
        return false;
      }
      if (verification.sex === "" || verification.sex === null) {
        this.setState({ certiMessage: "请选择性别", alertShow: true });
        return false;
      }
      if (!verification.paperworkType) {
        this.setState({ certiMessage: "请选择证件类型", alertShow: true });
        return false;
      }
      if (verification.paperworkType === "1") {
        if (!reg.test(verification.paperworkNumber)) {
          this.setState({
            certiMessage: "请输入正确的证件号",
            alertShow: true,
          });
          return false;
        }
      } else if (verification.paperworkType === "2") {
        if (!reg2.test(verification.paperworkNumber)) {
          this.setState({
            certiMessage: "请输入正确的证件号",
            alertShow: true,
          });
          return false;
        }
      } else {
        if (!verification.paperworkNumber) {
          this.setState({ certiMessage: "请填写证件号", alertShow: true });
          return false;
        }
      }

      if (pictureMaterial.length <= 0) {
        this.setState({ certiMessage: "请上传证件照片", alertShow: true });
        return false;
      }
      let param = {
        sex: verification.sex,
        paperworkNumber: verification.paperworkNumber,
        paperworkType: verification.paperworkType,
        pictureMaterial: pictureMaterial.join(","),
        userGuid,
        userRealName: verification.userRealName,
      };
      // console.log(param);
      const {
        errorCode,
        result: { errorCode: eCode, errorMsg },
      }: any = await personalNewVrified(param);

      p_disabled = true;
      if (errorCode === "200" && eCode === 200) {
        // user.setUserinfo({ realStatus: 3 });
        this.setState({ certiMessage: errorMsg, alertShow: true, realStatus: 3, auditReason: "" });
        await user.getPersonalVerification(userGuid);
      } else {
        this.setState({ certiMessage: errorMsg, alertShow: true });
      }
    }

    if (accountType === 2) {
      // let reg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
      const reg = /^[a-zA-Z0-9]{10,20}$/;

      // 证件照
      let arr2 = this.state.uploadArr.map((item) => item.result);
      const picGuid = verification.pictureMaterial.split(",");
      pictureMaterial = [...picGuid, ...arr2];

      if (!verification.companyName) {
        this.setState({ certiMessage: "请输入企业全称", alertShow: true });
        return false;
      }
      // if (!verification.companyAbbreviation) {
      //   this.setState({ certiMessage: "请输入企业英文/简称", alertShow: true });
      //   return false;
      // }
      // if (!verification.companyNature) {
      //   this.setState({ certiMessage: "请选择企业性质", alertShow: true });
      //   return false;
      // }
      // if (!reg.test(companyInfo.businessLicenseNum)) {
      if (
        verification.businessLicenseNum.length > 20 ||
        verification.businessLicenseNum.length < 10
      ) {
        this.setState({
          certiMessage: "请输入正确的营业执照号码",
          alertShow: true,
        });
        return false;
      }
      if (_isEmpty(verification.businessLicenseNum)) {
        this.setState({ certiMessage: "请输入营业执照号码", alertShow: true });
        return false;
      }
      // if (this.state.imgArr.length <= 0) {
      //   this.setState({ certiMessage: '请上传证件照片', alertShow: true });
      //   return false;
      // }
      let param = {
        companyName: verification.companyName,
        businessLicenseNum: verification.businessLicenseNum,
        companyNature: verification.companyNature,
        pictureMaterial: pictureMaterial.join(","),
        userGuid,
        companyAbbreviation: verification.companyAbbreviation,
      };
      const {
        errorCode,
        result: { errorCode: eCode, errorMsg },
      }: any = await companyNewVrified(param);
      c_disabled = true;
      if (errorCode === "200" && eCode === 200) {
        await user.getCompanyVerification(userGuid);
        // user.setCompanyinfo({ isRising: true });
        this.setState({
          certiMessage: errorMsg,
          alertShow: true,
          isUpgrade: false,
          isRising: true,
          auditReason: ""
        });
      } else {
        this.setState({ certiMessage: errorMsg, alertShow: true });
      }
    }
    return false;
  };

  // 上传图片
  uploadImg = (field, picType, el, e) => {
    e.stopPropagation();
    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 10;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, picType };
      if (file.size > max_size) {
        this.setState({
          certiMessage: "图片过大,请重新上传！",
          alertShow: true,
        });
      } else {
        const result: any = await savePic(params);
        let { uploadArr } = this.state;
        if (result.errorCode === "200" && result.result.errorCode === 200) {
          const { target }: { target: any } = e;
          uploadArr.push({ result: result.result.data, img: target.result });
          this.setState({
            uploadArr,
          });
        } else {
          this.setState({
            certiMessage: result.result.errorMsg,
            alertShow: true,
          });
        }
      }
    };
  };

  // 获取性别
  handleChange = (value) => {
    const { user } = this.props;
    const { verification } = user;
    verification.sex = value;
    user.changeVerification(verification);
  };

  // 筛选身份证类型
  paperChange = (value) => {
    const { user } = this.props;
    const { verification } = user;
    verification.paperworkType = value;
    user.changeVerification(verification);
  };

  // 设置企业性质
  companyChange = (val) => {
    const { user } = this.props;
    console.log(val);
    user.changeVerification({ companyNature: val });
  };

  render() {
    const {  user } = this.props;
    const { verification } = user;
    let { pictureMaterial } = verification;
    let verificationImages = pictureMaterial.split(",") || [];
    const {
      imgArr,
      uploadArr,
      accountType,
      isUpgrade,
      canChangeType,
      isRising,
      auditReason,
      realStatus,
      userAttribute,
      companyRealStatus
    } = this.state;
    return (
      <div className="row-right-info certificScss">
        <div className="title">
          <span>账号认证</span>
        </div>
        {auditReason && (
          <p style={{ color: "#F56C6C", padding: "10px 0", fontSize: "14px" }}>
            审核不通过：{auditReason}
          </p>
        )}
        {/* 企业审核中或已认证 */}
        {(companyRealStatus === 1 || companyRealStatus === 3 || !!isRising) &&
          !isUpgrade &&
          verification && (
            <div>
              <div className="right-head realname-detail">
                <div className="firstShow">
                  <p>
                    <span className="itemTitle">账户性质</span>企业账户
                  </p>
                  <p>
                    <span className="itemTitle">企业全称</span>
                    {verification.companyName}
                  </p>
                  {/*<p><span className="itemTitle">企业英文/简称</span>{verification.companyAbbreviation}</p>*/}
                  {/*<p><span className="itemTitle">企业性质</span>{companyTypeArr2[Number(verification.companyNature) - 1]}</p>*/}
                  <p>
                    <span className="itemTitle">营业执照号码</span>
                    {verification.businessLicenseNum}
                  </p>
                  <div className="vrifiedIamge">
                    <span className="itemTitle">证件照片</span>
                    <div>
                      {verification.papersPic &&
                        verification.papersPic.map((item, index) => {
                          return <img src={item} key={index} alt="" />;
                        })}
                    </div>
                  </div>
                  {(companyRealStatus === 3 || !!isRising) && (
                    <div className="text-center">
                      <button
                        className="btn-submit"
                        disabled
                        style={{ opacity: "0.25" }}
                      >
                        认证审核中
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        {/* 个人审核中或已认证 */}
        {(realStatus === 1 || realStatus === 3) &&
          !isUpgrade &&
          !isRising &&
          verification && (
            <div>
              <div className="right-head realname-detail">
                <div className="firstShow">
                  <p>
                    <span className="itemTitle">账户性质</span>个人账户
                  </p>
                  <p>
                    <span className="itemTitle">真实姓名</span>
                    {verification.userRealName}
                  </p>
                  <p>
                    <span className="itemTitle">称谓</span>
                    {this.signIn(verification.sex)}
                  </p>
                  <p>
                    <span className="itemTitle">证件类型</span>
                    {idTypeKV[verification.paperworkType]}
                  </p>
                  <p>
                    <span className="itemTitle">证件号码</span>
                    {verification.paperworkNumber}
                  </p>
                  <div className="vrifiedIamge">
                    <span className="itemTitle">证件照片</span>
                    <div>
                      {verification.papersPic &&
                        verification.papersPic.map((item, index) => {
                          return <img src={item} key={index} alt="" />;
                        })}
                    </div>
                  </div>
                  {realStatus === 3 && (
                    <div className="text-center">
                      <button
                        className="btn-submit"
                        disabled
                        style={{ opacity: "0.25" }}
                      >
                        认证审核中
                      </button>
                    </div>
                  )}
                  {realStatus === 1 && (
                    <div className="text-center">
                      <button
                        className="btn-submit"
                        onClick={() => {
                          this.setState({ isUpgrade: true, accountType: 2, uploadArr: [], imgArr: [] });
                          verification.pictureMaterial = ""
                        }}
                      >
                        升级为企业账户
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        {/* 暂未进行认证 */}
        {(isUpgrade ||
          (companyRealStatus !== 1 &&
            companyRealStatus !== 3 &&
            realStatus !== 1 &&
            realStatus !== 3)) &&
          !isRising &&
          verification && (
            <div className="">
              <div className="right-head realname-detail">
                <div className="form-group form-detail">
                  <label className="input-label">
                    账户性质 <span className="label-dot">*</span>
                  </label>
                  <div className="input-control-group  radio-group flex-wrap flex-row">
                    <div
                      className={`ip-radio flex-row align-items-center ${
                        accountType === 2 && "radio-selected"
                      }`}
                      onClick={() => {
                        if (canChangeType) {
                          this.setState({
                            accountType: 2,
                          });
                        }
                      }}
                    >
                      <div className="limit-custom-radio" />
                      <span className="radio-text">企业账户</span>
                    </div>
                    <div
                      className={`ip-radio flex-row align-items-center ${
                        accountType === 1 && "radio-selected"
                      }`}
                      onClick={() => {
                        if (canChangeType) {
                          this.setState({
                            accountType: 1,
                          });
                        }
                      }}
                    >
                      <div className="limit-custom-radio" />
                      <span className="radio-text">个人账户</span>
                    </div>
                  </div>
                </div>
                {accountType === 1 && (
                  <div>
                    <div className="form-group form-detail">
                      <label>
                        真实姓名<span className="label-dot">*</span>
                      </label>
                      <div className="input-control-group flex-row">
                        <div className="input-with-unit  width400">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="请输入姓名或昵称"
                            onChange={(e) => {
                              user.changeVerification({
                                userRealName: e.currentTarget.value,
                              });
                            }}
                            value={verification.userRealName}
                          />
                        </div>
                        <div className="middle-symbol flex-row justify-content-center align-items-center">
                          —
                        </div>
                        <div className="input-with-unit width392">
                          {verification.sex !== null &&
                          verification.sex !== "" ? (
                            <Select
                              value={this.signIn(verification.sex)}
                              onChange={this.handleChange}
                            >
                              <Option value="0">保密</Option>
                              <Option value="1">先生</Option>
                              <Option value="2">女士</Option>
                            </Select>
                          ) : (
                            <Select
                              placeholder="请选择性别"
                              onChange={this.handleChange}
                            >
                              <Option value="0">保密</Option>
                              <Option value="1">先生</Option>
                              <Option value="2">女士</Option>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group form-detail">
                      <label>
                        证件类型<span className="label-dot">*</span>
                      </label>
                      <div className="input-control-group flex-row">
                        <div className="input-with-unit widthSelect400">
                          {verification.paperworkType ? (
                            <Select
                              value={idTypeKV[verification.paperworkType]}
                              onChange={this.paperChange}
                            >
                              {idType}
                            </Select>
                          ) : (
                            <Select
                              placeholder="请选择证件类型"
                              onChange={this.paperChange}
                            >
                              {idType}
                            </Select>
                          )}
                        </div>
                        <div className="middle-symbol flex-row justify-content-center align-items-center">
                          —
                        </div>
                        <div className="input-with-unit width392">
                          <input
                            type="text"
                            className="form-control width392 "
                            placeholder="请输入证件号码"
                            value={verification.paperworkNumber}
                            onChange={async (e) => {
                              user.changeVerification({
                                paperworkNumber: e.currentTarget.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        证件照片上传<i className="span_imp">*</i>
                        <span>
                          (请上传证件的正反面，图片清晰可见，每张图片不超过10m，格式为：bmp,jpg,png)
                        </span>
                      </label>
                      <div className="upload personalImg">
                        {uploadArr.map((item, index) => {
                          return (
                            <div
                              className="load"
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item) {
                                  console.log("delete1");
                                  uploadArr.splice(index, 1);
                                  this.setState({
                                    uploadArr,
                                  });
                                }
                              }}
                            >
                              <img src={item.img} alt="" />
                              <span className="hoverShow">点击可删除</span>
                              {!item && (
                                <input
                                  type="file"
                                  className="btn_file"
                                  name="image_file"
                                  accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                  }}
                                  title="请选择文件"
                                  onChange={this.uploadImg.bind(
                                    this,
                                    "papersPositivePicGuid",
                                    5,
                                    "cardFile"
                                  )}
                                />
                              )}
                              <p>证件照片</p>
                            </div>
                          );
                        })}
                        {imgArr.map((item, index) => {
                          return (
                            <div
                              className="load"
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                let { imgArr }: { imgArr: any[] } = this.state;
                                let picGuid = verification.pictureMaterial.split(
                                  ","
                                );
                                if (item) {
                                  console.log("delete2");
                                  uploadArr.splice(index, 1);
                                  imgArr.splice(index, 1);
                                  picGuid.splice(index, 1);
                                  verification.pictureMaterial = picGuid.join(
                                    ","
                                  );
                                  console.log(verification.pictureMaterial);
                                  this.setState({
                                    imgArr: [...imgArr],
                                  });
                                }
                              }}
                            >
                              <img src={item} alt="" />
                              {item ? (
                                <span className="hoverShow">点击可删除</span>
                              ) : (
                                <span>点击上传</span>
                              )}
                              {!item && (
                                <input
                                  type="file"
                                  className="btn_file"
                                  name="image_file"
                                  accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                  }}
                                  title="请选择文件"
                                  onChange={this.uploadImg.bind(
                                    this,
                                    "papersPositivePicGuid",
                                    5,
                                    "cardFile"
                                  )}
                                />
                              )}
                              <p>证件照片</p>
                            </div>
                          );
                        })}
                        <div className="load">
                          <span>点击上传</span>
                          <input
                            type="file"
                            className="btn_file"
                            name="image_file"
                            title="请选择文件"
                            style={{
                              width: "100%",
                              height: "100%",
                              opacity: 0,
                            }}
                            accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                            onClick={(e) => {
                              e.currentTarget.value = "";
                            }}
                            onChange={this.uploadImg.bind(
                              this,
                              "papersPositivePicGuid",
                              5,
                              "cardFile"
                            )}
                          />
                          <p>证件照片</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {accountType === 2 && (
                  <div>
                    <div className="form-group form-detail">
                      <label>
                        企业全称<span className="label-dot">*</span>
                      </label>
                      <div className="input-control-group flex-row">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="请填写企业全称"
                            value={verification.companyName}
                            onChange={(e) => {
                              verification.companyName = e.currentTarget.value;
                              user.changeVerification(verification);
                              // user.changeVerification({ companyName: e.currentTarget.value });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="form-group form-detail">
              <label>企业英文/简称<span className="label-dot">*</span></label>
              <div className="input-control-group flex-row">
                <div className="input-with-unit  width400">
                  <input type="text" className="form-control" placeholder="请填写企业英文/简称"
                         value={verification.companyAbbreviation}
                         onChange={e => {
                           user.changeVerification({ companyAbbreviation: e.currentTarget.value });
                         }}/>
                </div>
              </div>
            </div>*/}
                    {/*<div className="form-group form-detail">
              <label>企业性质<span className="label-dot">*</span></label>
              <div className="input-control-group flex-row">
                <div className="input-with-unit widthSelect400">
                  {verification.companyNature ?
                    <Select value={companyTypeArr2[Number(verification.companyNature) - 1]}
                            onChange={this.companyChange}>
                      {companyTypeArr}
                    </Select>
                    :
                    <Select placeholder="请选择企业性质" onChange={this.companyChange}>
                      {companyTypeArr}
                    </Select>
                  }

                </div>
              </div>
            </div>*/}
                    <div className="form-group form-detail">
                      <label>
                        营业执照号码<span className="label-dot">*</span>
                      </label>
                      <div className="input-control-group flex-row">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="请输入营业执照号码"
                            value={verification.businessLicenseNum}
                            onChange={(e) => {
                              user.changeVerification({
                                businessLicenseNum: e.currentTarget.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        营业执照上传
                        <span>
                          (请上传企业营业执照，图片清晰可见，每张图片不超过10m，格式为：bmp,jpg,png)
                        </span>
                      </label>
                      {/*<div className="upload personalImg">
                {this.state.imgArr.length > 0 && this.state.imgArr.map((item, index) => {
                  return (
                    <div key={item.result} className="load backroundnone" title="点击可删除">
                      <span className="hoverShow">点击可删除</span>
                      <img src={item.img} alt="" title="点击可删除" onClick={() => {
                        let arr = this.state.imgArr.splice(index, 1);
                        this.state.imgArr.splice(index, 1);
                        this.setState({
                          imgArr: this.state.imgArr
                        });
                      }}/>
                    </div>
                  );
                })}
                <div className="load">
                  <img src={RealName.cardFile} alt=""/>
                  <span>点击上传</span>
                  <input type="file" className="btn_file" name="image_file"
                         accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                         style={{ width: "100%", height: "100%", opacity: 0 }}
                         title="请选择文件"
                         onChange={async (e) => {
                           await this.uploadImg(e, 'papersPositivePicGuid', 5, 'cardFile');
                         }}/>
                  <p>证件照片</p>
                </div>
              </div>*/}

                      <div className="upload personalImg">
                        {uploadArr &&
                          uploadArr.map((item, index) => {
                            return (
                              <div
                                className="load"
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item) {
                                    uploadArr.splice(index, 1);
                                    this.setState({
                                      uploadArr,
                                    });
                                  }
                                }}
                              >
                                <img src={item.img} alt="" />
                                <span className="hoverShow">点击可删除</span>
                              </div>
                            );
                          })}
                        {uploadArr &&
                          imgArr.map((item, index) => {
                            return (
                              <div
                                className="load"
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  let {
                                    imgArr,
                                  }: { imgArr: any[] } = this.state;
                                  let picGuid = verification.pictureMaterial.split(
                                    ","
                                  );
                                  if (item) {
                                    imgArr.splice(index, 1);
                                    picGuid.splice(index, 1);
                                    verification.pictureMaterial = picGuid.join(
                                      ","
                                    );
                                    this.setState({
                                      imgArr: [...imgArr],
                                    });
                                  }
                                }}
                              >
                                <img src={item} alt="" />
                                <span className="hoverShow">点击可删除</span>
                              </div>
                            );
                          })}
                        <div className="load">
                          <span>点击上传</span>
                          <input
                            type="file"
                            className="btn_file"
                            name="image_file"
                            title="请选择文件"
                            style={{
                              width: "100%",
                              height: "100%",
                              opacity: 0,
                            }}
                            accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                            onClick={(e) => {
                              e.currentTarget.value = "";
                            }}
                            onChange={this.uploadImg.bind(
                              this,
                              "papersPositivePicGuid",
                              5,
                              "cardFile"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <div className="user_btn_primary ">
                  <button
                    className="btn btn-primary putdate"
                    disabled={p_disabled}
                    onClick={async () => {
                      await this.putCertificate();
                    }}
                  >
                    提交审核
                  </button>
                </div>
              </div>
            </div>
          )}

        {this.state.alertShow && (
          <Toast
            onClose={() => {
              this.setState({ alertShow: false });
            }}
            duration={2}
            message={this.state.certiMessage}
          />
        )}
      </div>
    );
  }
}
