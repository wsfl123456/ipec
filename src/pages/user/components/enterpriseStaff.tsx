/**
 *  企业员工
 */
import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/enterpriseStaff.scss";
import ic_user from '@assets/images/user.svg';
import close from "assets/images/ic_close.svg";
import Add from '@assets/images/add.svg';
import edit from '@assets/images/user/ic_bj.svg';
import delet from '@assets/images/user/ic_sc.svg';
import refuse from '@assets/images/user/ic_jjue.svg';
import pass from '@assets/images/user/ic_js.svg';
import certificed from '@assets/images/user/ic_yrz.svg';
import certific from '@assets/images/user/ic_wrz.svg';
import joinExhibitionTrue from '@assets/images/user/joinExhibitionTrue.svg';
import { message, } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import Toast from "@components/toast";
import {
  verifyStaff,
  myStaff,
  companyInviteStaff,
  deleteStaff,
  acceptStaff,
  refuseStaff,
  editStaff,
  saveExhibitionStaff,
  deleteExhibitionStaff,
} from '@utils/api';
import Alert from '@components/alert';
import NoResult from "@components/no_result";

interface ICompanyData extends IComponentProps {
  userGuid?: string,
  RealName: any,
  isEditDate: boolean,
  childIsEdit: Function,
}

interface ICompanyState {
  data?: any,
  showMobox: boolean,
  showEdit: boolean,
  showEditItem: {
    name: string,
    companyGuid: string,
    companyDepartment: string,
    companyPosition: string,
    userGuid: string,
  },
  message: string,
  alertMessage: string,
  alertType: {
    interfaceNumber: number,
    id: number,
    type: string,
    str: string,
  },
  showAlert: boolean,
  show: boolean,
  refuse_reason: string, // 删除原因
  StaffName: string,
  StaffTel: string,
  StaffDepart: string,
  StaffJob: string,
  auditEnd: boolean,
  myStaff: any, // 已审核员工
  myStaffCheck: Number, // 已审核员工
  verifyStaff: any, // 待审核员工
  verifyStaffCheck: Number, // 待审核员工
  passDeleteId: Number[],
  awaitDeleteId: Number[],
}

@inject('user', 'login')
@observer
export default class EnterpriseStaff extends React.Component<ICompanyData, ICompanyState> {
  constructor(props) {
    super(props);
    this.state = {
      passDeleteId: [],
      awaitDeleteId: [],
      myStaffCheck: null,
      verifyStaffCheck: null,
      verifyStaff: [],
      myStaff: [],
      refuse_reason: '',
      StaffDepart: '',
      StaffTel: '',
      StaffJob: '',
      StaffName: '',
      alertType: {
        interfaceNumber: null,
        id: null,
        type: '',
        str: '',
      },
      message: '',
      alertMessage: '',
      showAlert: false,
      show: false,
      auditEnd: true,
      showMobox: false,
      showEdit: false,
      showEditItem: {
        name: '',
        companyGuid: '',
        companyDepartment: '',
        companyPosition: '',
        userGuid: '',
      },
    };
  }

  async componentDidMount() {
    const { userGuid } = this.props.login.userInfo;
    await this.getVerify(userGuid);
    await this.getmyStaff(userGuid);
  }

  /**
   * 待审核列表
   */
  async getVerify(userGuid) {
    let { result }: any = await verifyStaff(userGuid);
    this.setState({
      verifyStaff: result,
    });
  }

  /**
   * 企业员工列表
   */
  async getmyStaff(userGuid) {
    let pageSize = 20;
    let currentPage = 1;
    let result2 = await myStaff(userGuid, currentPage, pageSize);
    this.setState({
      myStaff: result2['result']['data'],
    });
  }

  closeMobox() {
    this.setState({
      showMobox: false
    });
  }

  closeshowEdit() {
    this.setState({
      showEdit: false
    });
  }

  netOne() {
    let { interfaceNumber, id, type, str } = this.state.alertType;
    switch (interfaceNumber) {
      case 1:
        this.deleteCheckAll();
        return false;
      case 2:
        this.deleteCheck(id);
        return false;
      case 3:
        this.passCheckAll(type); // 批量接受或拒绝
        return false;
      case 4:
        this.passCheck(id, str);
        return false;
      case 5:
        this.refuseCheck(id);
        return false;
      case 6:
        this.saveExhibitionCheckAll();
        return false;
      case 7:
        this.deleteExhibitionCheckAll();
        return false;
      default:
        break;
    }
  }

  async putCreatStaff() {
    let { StaffName, StaffTel, StaffJob, StaffDepart } = this.state;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!StaffName) {
      this.setState({ message: '请输入员工姓名', show: true });
      return false;
    }
    if (!mPattern.test(StaffTel) && !mPatternEmail.test(StaffTel)) {
      this.setState({ message: '请正确输入员工联系方式', show: true });
      return false;
    }
    if (!StaffDepart) {
      this.setState({ message: '请输入任职部门', show: true });
      return false;
    }
    if (!StaffJob) {
      this.setState({ message: '请输入任职岗位', show: true });
      return false;
    }
    const { userGuid } = this.props.login.userInfo;
    let Params = {
      companyDepartment: StaffDepart,
      companyPosition: StaffJob,
      userRealName: StaffName,
      contactInformation: StaffTel,
      companyGuid: userGuid,
    };
    let result: any = await companyInviteStaff(Params);
    if (result.errorCode === '200') {
      this.setState({ message: result.result.errorMsg, show: true });
      if (result.result.errorCode === 200) {
        await this.getmyStaff(userGuid);
        this.closeMobox();
      }

    } else {
      this.setState({ message: result.errorMessage, show: true });
    }
  }

  async editStaff() {
    let { companyDepartment, companyPosition, companyGuid, userGuid } = this.state.showEditItem;
    if (!companyDepartment) {
      this.setState({ message: '请输入任职部门', show: true });
      return false;
    }
    if (!companyPosition) {
      this.setState({ message: '请输入任职岗位', show: true });
      return false;
    }
    let Params = {
      companyGuid,
      userGuid,
      company_department: companyDepartment,
      company_position: companyPosition,
    };
    let result: any = await editStaff(Params);
    if (result.errorCode === '200') {
      this.setState({ message: result.result.errorMsg, show: true });
      if (result.result.errorCode === 200) {
        await this.getmyStaff(this.props.login.userInfo.userGuid);
        this.closeshowEdit();
      }
    } else {
      this.setState({ message: result.errorMessage, show: true });
    }
  }

  deleteCheckAll = async () => {
    if (this.state.myStaffCheck !== -1 && this.state.passDeleteId.length <= 0) {
      this.setState({ message: '未选择全选', show: true });
      return false;
    }
    let ids = [];
    if (this.state.myStaffCheck === -1) {
      this.state.myStaff.map((item) => {
        ids.push(item.id);
      });
      this.deleteCheck(ids);
      return;
    }
    this.deleteCheck(this.state.passDeleteId);
    return;

  };
  deleteCheck = async (id) => {
    let param = {
      ids: null
    };
    if (id instanceof Array) {
      param.ids = id;
    } else {
      param.ids = [id];
    }
    let result: any = await deleteStaff(param);
    if (result.errorCode === "200" || result.result.errorCode === 200) {
      await this.getmyStaff(this.props.login.userInfo.userGuid);
    } else {
      this.setState({ message: result.errorMessage, show: true });
    }
    this.setState({
      showAlert: false
    });
  };
  passCheckAll = async (type) => {
    if (this.state.verifyStaffCheck !== -1 && this.state.awaitDeleteId.length <= 0) {
      this.setState({ message: '未选择全选', show: true });
      return false;
    }
    let param = {
      ids: [],
      companyGuid: null,
    };
    if (type === 'acceptStaff') {
      param.companyGuid = this.props.login.userInfo.userGuid;
    }
    if (this.state.verifyStaffCheck === -1) {
      this.state.verifyStaff.map((item) => {
        param.ids.push(item.id);
      });
    } else {
      param.ids = this.state.awaitDeleteId;
    }
    if (type === 'acceptStaff') this.passCheck(param.ids, param.companyGuid);
    if (type === 'refuseStaff') this.refuseCheck(param.ids);
  };
  passCheck = async (id, str) => {
    let param = {
      ids: null,
      companyGuid: str
    };
    if (id instanceof Array) {
      param.ids = id;
    } else {
      param.ids = [id];
    }
    let result: any = await acceptStaff(param);
    if (result.errorCode === "200" && result.result.errorCode === 200) {
      const { userGuid } = this.props.login.userInfo;
      await this.getVerify(userGuid);
      await this.getmyStaff(userGuid);
    } else {
      this.setState({ message: result.errorMessage, show: true });
    }
    this.setState({
      showAlert: false
    });
  };
  refuseCheck = async (id) => {
    let param = {
      ids: null,
    };
    if (id instanceof Array) {
      param.ids = id;
    } else {
      param.ids = [id];
    }
    let { errorCode, errorMessage }: any = await refuseStaff(param);
    if (errorCode === "200") {
      await this.getVerify(this.props.login.userInfo.userGuid);
    } else {
      this.setState({ message: errorMessage, show: true });
    }
    this.setState({
      showAlert: false
    });
  };
  saveExhibitionCheckAll = async () => {
    if (this.state.myStaffCheck !== -1 && this.state.passDeleteId.length <= 0) {
      this.setState({ message: '未选择全选', show: true });
      return false;
    }
    let ids = [];
    if (this.state.myStaffCheck === -1) {
      this.state.myStaff.map((item) => {
        ids.push(item.id);
      });
      this.saveExhibitionCheck(ids);
      return;
    }
    this.saveExhibitionCheck(this.state.passDeleteId);
    return;
  };
  saveExhibitionCheck = async (id) => {
    const { userGuid } = this.props.login.userInfo;
    let param = {
      ids: null,
      companyGuid: userGuid
    };
    if (id instanceof Array) {
      param.ids = id;
    } else {
      param.ids = [id];
    }
    let result: any = await saveExhibitionStaff(param);
    if (result.errorCode === '200') {
      if (result.result.errorCode === 200) {
        message.success(result.result.errorMsg);
        await this.getmyStaff(userGuid);
      } else {
        message.error(result.result.errorMsg);
      }
    } else {
      message.error(result.errorMsg);
    }
    this.setState({
      showAlert: false
    });
  };
  deleteExhibitionCheckAll = async () => {
    if (this.state.myStaffCheck !== -1 && this.state.passDeleteId.length <= 0) {
      this.setState({ message: '未选择全选', show: true });
      return false;
    }
    let ids = [];
    if (this.state.myStaffCheck === -1) {
      this.state.myStaff.map((item) => {
        ids.push(item.id);
      });
      this.deleteExhibitionCheck(ids);
      return;
    }
    this.deleteExhibitionCheck(this.state.passDeleteId);
    return;
  };
  deleteExhibitionCheck = async (id) => {
    const { userGuid } = this.props.login.userInfo;
    let param = {
      ids: null,
      companyGuid: userGuid
    };
    if (id instanceof Array) {
      param.ids = id;
    } else {
      param.ids = [id];
    }
    let result: any = await deleteExhibitionStaff(param);
    if (result.errorCode === '200') {
      if (result.result.errorCode === 200) {
        message.success(result.result.errorMsg);
        await this.getmyStaff(userGuid);
      } else {
        message.error(result.result.errorMsg);
      }
    } else {
      message.error(result.errorMsg);
    }
    this.setState({
      showAlert: false
    });
  };

  // 选中全部
  checkAll(type) {
    let { awaitDeleteId, verifyStaff, myStaff, passDeleteId, myStaffCheck, verifyStaffCheck } = this.state;
    if (type === 'pass') {
      passDeleteId = [];
      if (myStaffCheck !== -1) {
        myStaff.map(item => {
          passDeleteId.push(item.id);
        });
        myStaffCheck = -1;
      } else {
        myStaffCheck = null;
      }
    }

    if (type === 'await') {
      awaitDeleteId = [];
      if (verifyStaffCheck !== -1) {
        verifyStaff.map(item => {
          awaitDeleteId.push(item.id);
        });
        verifyStaffCheck = -1;
      } else {
        verifyStaffCheck = null;
      }
    }
    this.setState({
      verifyStaffCheck,
      awaitDeleteId,
      myStaffCheck,
      passDeleteId
    });
  }

  tageDeleteId(id, type) {
    console.log(id, type);
    let { passDeleteId, awaitDeleteId, verifyStaff, myStaff, verifyStaffCheck, myStaffCheck } = this.state;
    let num: number = null;
    if (type === 'pass') {
      num = passDeleteId.findIndex((v) => {
        return v === id;
      });
      if (num >= 0) {
        passDeleteId.splice(num, 1);
        myStaffCheck = null;
      } else {
        passDeleteId.push(id);
        if (passDeleteId.length === myStaff.length) {
          myStaffCheck = -1;
        }
      }
    }
    if (type === 'await') {
      num = awaitDeleteId.findIndex((v) => {
        return v === id;
      });
      if (num >= 0) {
        awaitDeleteId.splice(num, 1);
        verifyStaffCheck = null;
      } else {
        awaitDeleteId.push(id);
        if (awaitDeleteId.length === verifyStaff.length) {
          verifyStaffCheck = -1;
        }
      }
    }
    this.setState({
      verifyStaffCheck,
      awaitDeleteId,
      myStaffCheck,
      passDeleteId
    });
  }

  filterDeleteId(id, type) {
    let { passDeleteId, awaitDeleteId } = this.state;
    let num: Number = null;
    if (type === 'pass') {
      num = passDeleteId.find((v) => {
        return v === id;
      });
    }
    if (type === 'await') {
      num = awaitDeleteId.find((v) => {
        return v === id;
      });
    }
    return num;
  }

  render() {
    const { showMobox, showEdit, auditEnd, myStaff, verifyStaff, verifyStaffCheck, myStaffCheck, showAlert, alertMessage, } = this.state;
    const InfoCompany = this.props.user.companyInfo;
    return (
      <div className="EnterpriseStaff">
        {showAlert &&
        <Alert
          message={alertMessage}
          onClose={() => {
            this.setState({ showAlert: false });
          }}
          onSubmit={() => {
            this.netOne();
          }}/>
        }
        {showMobox &&
        <div className="mobox">
          <div className="mobox_content">
            <div className="title">
              邀请员工
              <img src={close} onClick={async () => {
                this.closeMobox();
              }} alt=""/>
            </div>
            <div className="center">
              <div className="form-group   flex-column">
                <label className="input-label">姓名<span className="label-dot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入姓名"
                  onChange={async e => {
                    this.setState({
                      StaffName: e.target.value
                    });
                  }}
                  value={this.state.StaffName}
                />
              </div>

              <div className="form-group   flex-column">
                <label className="input-label">联系方式<span className="label-dot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入的联系方式"
                  onChange={async e => {
                    this.setState({
                      StaffTel: e.target.value
                    });
                  }}
                  value={this.state.StaffTel}
                />
              </div>

              <div className="form-group   flex-column">
                <label className="input-label">任职部门<span className="label-dot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入任职部门"
                  onChange={async e => {
                    this.setState({
                      StaffDepart: e.target.value
                    });
                  }}
                  value={this.state.StaffDepart}
                />
              </div>

              <div className="form-group   flex-column">
                <label className="input-label">任职岗位<span className="label-dot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入任职岗位"
                  onChange={async e => {
                    this.setState({
                      StaffJob: e.target.value
                    });
                  }}
                  value={this.state.StaffJob}
                />
              </div>

            </div>
            <div className="footer">
              <button onClick={() => {
                this.putCreatStaff();
              }}>确认邀请
              </button>
              <button className="resolve" onClick={() => {
                this.closeMobox();
              }}>取消
              </button>
            </div>
          </div>
        </div>
        }
        {/* 拒绝原因 */}
        {
          showEdit && <div className="mobox">
            <div className="mobox_content">
              <div className="title">
                修改员工信息
                <img src={close} onClick={async () => {
                  this.closeshowEdit();
                }} alt=""/>
              </div>

              <div className="center">
                <div className="form-group   flex-column">
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    value={this.state.showEditItem.name}
                  />
                </div>
                <div className="form-group   flex-column">
                  <label className="input-label">任职部门<span className="label-dot">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="请输入任职部门"
                    onChange={async e => {
                      let EditItem = this.state.showEditItem;
                      EditItem.companyDepartment = e.target.value;
                      this.setState({
                        showEditItem: EditItem
                      });
                    }}
                    value={this.state.showEditItem.companyDepartment}
                  />
                </div>

                <div className="form-group   flex-column">
                  <label className="input-label">任职岗位<span className="label-dot">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="请输入任职岗位"
                    onChange={async e => {
                      let EditItem = this.state.showEditItem;
                      EditItem.companyPosition = e.target.value;
                      this.setState({
                        showEditItem: EditItem
                      });
                    }}
                    value={this.state.showEditItem.companyPosition}
                  />
                </div>
              </div>
              <div className="footer">
                <button onClick={() => {
                  this.editStaff();
                }}>确认修改
                </button>
                <button className="resolve" onClick={() => {
                  this.closeshowEdit();
                }}>取消
                </button>
              </div>
            </div>
          </div>
        }
        <div className="title">
                    <span className={auditEnd ? 'active' : ''} onClick={() => {
                      this.setState({
                        auditEnd: true
                      });
                    }}>企业员工</span>
          <span className={auditEnd ? '' : 'active'} onClick={() => {
            this.setState({
              auditEnd: false
            });
          }}>待审核员工</span>
          <span className="zhiyuan" onClick={() => {
            this.setState({
              showMobox: true,
              StaffName: '',
              StaffTel: '',
              StaffDepart: '',
              StaffJob: '',
            });
          }}>邀请员工</span>
          <img src={Add} alt="" className="add" onClick={() => {
            this.setState({
              showMobox: true,
              StaffName: '',
              StaffTel: '',
              StaffDepart: '',
              StaffJob: '',
            });
          }}/>
        </div>
        {auditEnd && !_isEmpty(myStaff) &&
        <div className="checkAll">
          <div
            onClick={async () => {
            }}
            className={`sub-item flex-row justify-content-center align-items-center  ${myStaffCheck === -1 ? "sub-item-selected" : ""}`}>
            <div className="custom-checkbox" onClick={() => {
              this.checkAll('pass');
            }}/>
            <div className="checkbox-text" onClick={() => {
              let alertType = this.state.alertType;
              alertType.interfaceNumber = 1;
              this.setState({ alertMessage: '确定要批量删除么？', showAlert: true, alertType });
            }}> 批量删除
            </div>
            {/*展会已结束或者已经下架：isExpireExhibition：true,exhibitionGuid：""。*/}
            {
              InfoCompany.isExhibitor === 1 && (InfoCompany.exhibitionGuid !== "" || !InfoCompany.isExpireExhibition)
                ?
                <div style={{ display: 'flex' }}>
                  <div className="checkbox-text checkbox-text-large" onClick={() => {
                    let alertType = this.state.alertType;
                    alertType.interfaceNumber = 6;
                    this.setState({ alertMessage: '确定要批量添加参展人员么？', showAlert: true, alertType });
                  }}>添加参展人员
                  </div>
                  <div className="checkbox-text checkbox-text-large" onClick={() => {
                    let alertType = this.state.alertType;
                    alertType.interfaceNumber = 7;
                    this.setState({ alertMessage: '确定要批量取消参展人员么？', showAlert: true, alertType });
                  }}>取消参展人员
                  </div>
                </div>
                : ''
            }
          </div>
        </div>
        }
        {
          !_isEmpty(verifyStaff) && !auditEnd &&
          <div className="checkAll">
            <div onClick={async () => {
            }}
                 className={`sub-item flex-row justify-content-center align-items-center  ${verifyStaffCheck === -1 ? "sub-item-selected" : ""}`}>
              <div className="custom-checkbox" onClick={() => {
                this.checkAll('await');
              }}/>
              <div className="checkbox-text" onClick={() => {
                let alertType = this.state.alertType;
                alertType.type = 'acceptStaff';
                alertType.interfaceNumber = 3;
                this.setState({ alertMessage: '确定要批量接受么？', showAlert: true, alertType });
              }}> 批量接受
              </div>
            </div>
            <div
              onClick={async () => {
              }}
              className={`sub-item flex-row justify-content-center align-items-center  `}>
              <div className="checkbox-text" onClick={() => {
                let alertType = this.state.alertType;
                alertType.type = 'refuseStaff';
                alertType.interfaceNumber = 3;
                this.setState({ alertMessage: '确定要批量拒绝么？', showAlert: true, alertType });
              }}> 批量拒绝
              </div>
            </div>
          </div>
        }
        <div className="StaffContent">
          {
            // 企业员工
            auditEnd && myStaff && myStaff.length > 0 && myStaff.map(el => {
              return (
                <div className="StaffContentli" key={el.id}>
                  <div
                    onClick={async () => {
                      this.tageDeleteId(el.id, 'pass');
                    }}
                    className={`sub-item flex-row justify-content-center align-items-center ${this.filterDeleteId(el.id, 'pass') === el.id || myStaffCheck === -1 ? "sub-item-selected" : ""}`}>
                    <div className="custom-checkbox"/>
                  </div>
                  <div className="userImag">
                    {el.picUrl ? <img src={el.picUrl} alt=""/> : <img src={ic_user} alt=""/>}
                  </div>
                  <div className="Job">
                    <h3>
                      {el.userRealName}
                      {el.realStatus === 1 ? <img src={certificed} alt=""/> : <img src={certific} alt=""/>}
                      {el.isJoinExhibition && <img src={joinExhibitionTrue}/>}
                      {el.isJoinExhibition && <span className="joinExhibitionSpan">参展人员</span>}
                    </h3>
                    <p><span>任职部门：</span>{el.companyDepartment}</p>
                    <p><span>任职岗位：</span>{el.companyPosition}</p>
                  </div>
                  <div className="editData">
                    <ul>
                      <li onClick={() => {
                        let alertType = this.state.alertType;
                        alertType.id = el.id;
                        alertType.interfaceNumber = 2;
                        this.setState({ alertMessage: '确定要删除么？', showAlert: true, alertType });
                      }}><img src={delet} alt=""/>删除
                      </li>
                      <li onClick={() => {
                        this.setState({
                          showEditItem: {
                            companyGuid: el.companyGuid,
                            name: el.userRealName,
                            companyDepartment: el.companyDepartment,
                            companyPosition: el.companyPosition,
                            userGuid: el.userGuid,
                          },
                          showEdit: true,
                        });
                      }}><img src={edit} alt=""/>编辑
                      </li>
                    </ul>
                  </div>
                  {/* <Pagination defaultCurrent={1} total={50} onChange={this.mySatffChange}/> */}
                </div>
              );
            })
          }
          {
            _isEmpty(myStaff) && auditEnd && <NoResult/>
          }

          {
            // 待审核员工
            !auditEnd && verifyStaff && verifyStaff.length > 0 && verifyStaff.map((el, index) => {
              return (
                <div className="StaffContentli" key={el.id}>
                  <div
                    onClick={async () => {
                      this.tageDeleteId(el.id, 'await');
                    }}
                    className={`sub-item flex-row justify-content-center align-items-center  ${this.filterDeleteId(el.id, 'await') === el.id || verifyStaffCheck === -1 ? "sub-item-selected" : ""}`}>
                    <div className="custom-checkbox"/>
                  </div>
                  <div className="userImag">
                    {el.picUrl ? <img src={el.picUrl} alt=""/> : <img src={ic_user} alt=""/>}
                  </div>
                  <div className="Job">
                    <h3>{el.userRealName} {el.realStatus === 1 ? <img src={certificed} alt=""/> :
                      <img src={certific} alt=""/>} </h3>
                    <p><span>任职部门：</span>{el.companyDepartment}</p>
                    <p><span>任职岗位：</span>{el.companyPosition}</p>
                  </div>
                  <div className="editData">
                    <ul>
                      <li onClick={() => {
                        let alertType = this.state.alertType;
                        alertType.id = el.id;
                        alertType.interfaceNumber = 5;
                        this.setState({ alertMessage: '确定拒绝么？', showAlert: true, alertType });
                      }}><img src={refuse} alt=""/>拒绝
                      </li>
                      <li onClick={() => {
                        let alertType = this.state.alertType;
                        alertType.id = el.id;
                        alertType.str = el.companyGuid;
                        alertType.interfaceNumber = 4;
                        this.setState({ alertMessage: '确定接受么？', showAlert: true, alertType });
                      }}><img src={pass} alt=""/>接受
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })
          }
          {
            _isEmpty(verifyStaff) && !auditEnd && <NoResult/>
          }

        </div>
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
