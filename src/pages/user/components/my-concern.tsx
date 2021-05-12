import * as React from 'react';
import "@assets/scss/my_concern.scss";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import default_img from "@assets/images/default/ic_default_shu.png";
import icon_load from "@assets/images/update/timg.gif";
import ic_user from '@assets/images/user.svg';
import { Link } from 'react-router-dom';
import auth from "@assets/images/user/attestation.svg";
import NoResult from '@components/no_result';
import _isEmpty from "lodash/isEmpty";
import { Input, Icon, message, } from 'antd';
import { updateFocus, } from '@utils/api';

const { Search } = Input;

interface IProps extends IComponentProps {
  userGuid?: string,
}

interface IMyConcern {
  tabChange: number,
  currentPage: number,
  pageSize: number,
  type: number,
  myFocusCompany: any,
  myFocusPersonal: any,
  myFocusIp: any,
  focusCompanyGuids: any,
  focusPersonalGuids: any,
  focusIpGuids: any,
  customCheckbox1: boolean,
  customCheckbox2: boolean,
  customCheckbox3: boolean,
  companyName: string,
  userRealName: string,
  ipName: string,
  loading: boolean,
}

@inject('user', 'login')
@observer
export default class MyConcern extends React.Component <IProps, IMyConcern> {
  state = {
    tabChange: 1,
    currentPage: 1,
    pageSize: 10,
    type: 1,
    myFocusCompany: [],
    myFocusPersonal: [],
    myFocusIp: [],
    focusCompanyGuids: [],
    focusPersonalGuids: [],
    focusIpGuids: [],
    customCheckbox1: false,
    customCheckbox2: false,
    customCheckbox3: false,
    companyName: "",
    userRealName: "",
    ipName: "",
    loading: true,
  };

  async componentDidMount() {
    document.title = "IP二厂-个人中心";

    // 获取我的关注信息
    await this.changeMyFollow();
    this.setState({ loading: false });
  }

  // 获取我的关注信息
  async changeMyFollow(key?, value?) {
    const { user, login } = this.props;
    const { userGuid } = login.userInfo;
    let params = {
      userGuid
    };
    if (key && value) {
      params[key] = value;
    }
    await user.getMyFollow(params);
    this.setState({
      myFocusCompany: this.props.user.myFocusCompany,
      myFocusPersonal: this.props.user.myFocusPersonal,
      myFocusIp: this.props.user.myFocusIp,
      focusCompanyGuids: [],
      focusPersonalGuids: [],
      focusIpGuids: [],
      customCheckbox1: false,
      customCheckbox2: false,
      customCheckbox3: false,
    });
  }

  async tabNum(num) {
    await this.changeMyFollow();
    this.setState({ tabChange: num });
  }

  // 点击取消关注
  async unfocus(guid, type) {
    if (!guid) {
      message.warning("请先选择需要取消的关注");
      return;
    } else if (typeof guid === "string") {
      guid = [guid];
    } else if (guid.length === 0) {
      message.warning("请先选择需要取消的关注");
      return;
    }

    const { userGuid } = this.props.login.userInfo;
    const entity = {
      guid,
      isFollow: 2,
      type,
      userGuid
    };
    const result: any = await updateFocus(entity);
    if (result.result.errorCode !== 200) {
      message.error(result.result.errorMsg);
    } else {
      message.success(result.result.errorMsg);
    }
    this.changeMyFollow();
  }

  changeFocusCompanyGuides(guid, type: number, index: number) {
    let { myFocusCompany, focusCompanyGuids } = this.state;
    if (type === 1) {
      focusCompanyGuids.push(guid);
      this.setState({ focusCompanyGuids });
      myFocusCompany[index].showCheckbox = true;
      this.setState({ myFocusCompany });
      if (focusCompanyGuids.length === toJS(myFocusCompany).length) {
        this.setState({ customCheckbox1: true });
      }
    } else if (type === 0) {
      this.removeByValue(focusCompanyGuids, guid);
      this.setState({ focusCompanyGuids });
      myFocusCompany[index].showCheckbox = false;
      this.setState({ myFocusCompany });
      if (focusCompanyGuids.length !== toJS(myFocusCompany).length) {
        this.setState({ customCheckbox1: false });
      }
    }
  }

  // 修改关注的人的guids的List guid是该人的guid type为1表示添加 type为0表示删除 index为数组的第几项
  changeFocusPersonalGuids(guid, type, index) {
    let { focusPersonalGuids, myFocusPersonal } = this.state;
    if (type === 1) {
      focusPersonalGuids.push(guid);
      this.setState({ focusPersonalGuids });
      let myFocusPersonal = this.state.myFocusPersonal;
      myFocusPersonal[index].showCheckbox = true;
      this.setState({ myFocusPersonal });
      if (focusPersonalGuids.length === toJS(myFocusPersonal).length) {
        this.setState({ customCheckbox2: true });
      }
    } else if (type === 0) {
      this.removeByValue(focusPersonalGuids, guid);
      this.setState({ focusPersonalGuids });
      myFocusPersonal[index].showCheckbox = false;
      this.setState({ myFocusPersonal });
      if (focusPersonalGuids.length !== toJS(myFocusPersonal).length) {
        this.setState({ customCheckbox2: false });
      }
    }
  }

  // 修改关注的IP的guids的List guid是该IP的guid type为1表示添加 type为0表示删除 index为数组的第几项
  changeFocusIpGuids(guid, type: number, index: number) {
    let { myFocusIp, focusIpGuids } = this.state;
    if (type === 1) {
      focusIpGuids.push(guid);
      this.setState({ focusIpGuids });
      myFocusIp[index].showCheckbox = true;
      this.setState({ myFocusIp });
      if (focusIpGuids.length === toJS(myFocusIp).length) {
        this.setState({ customCheckbox3: true });
      }
    } else if (type === 0) {
      this.removeByValue(focusIpGuids, guid);
      this.setState({ focusIpGuids });
      myFocusIp[index].showCheckbox = false;
      this.setState({ myFocusIp });
      if (focusIpGuids.length !== toJS(myFocusIp).length) {
        this.setState({ customCheckbox3: false });
      }
    }
  }

  // 修改关注的列表的guids的List的所有值 id为1时修改企业 id为2时修改人 id为3时修改IP type为1表示添加 type为0表示删除
  changeGuidsAll(type: number, id: number) {
    let { myFocusCompany } = this.state;
    if (id === 1) {
      if (type === 1) {
        this.setState({ customCheckbox1: true });
        let focusCompanyGuids = [];
        for (const i in myFocusCompany) {
          if (myFocusCompany.hasOwnProperty(i)) {
            myFocusCompany[i].showCheckbox = true;
            focusCompanyGuids.push(myFocusCompany[i].guid);
          }
        }
        this.setState({ myFocusCompany });
        this.setState({ focusCompanyGuids });
      } else if (type === 0) {
        this.setState({ customCheckbox1: false });
        for (const i in myFocusCompany) {
          if (myFocusCompany.hasOwnProperty(i)) {
            myFocusCompany[i].showCheckbox = false;
          }
        }
        this.setState({ myFocusCompany });
        this.setState({ focusCompanyGuids: [] });
      }
    } else if (id === 2) {
      if (type === 1) {
        this.setState({ customCheckbox2: true });
        let { myFocusPersonal } = this.state;
        let focusPersonalGuids = [];
        for (const i in myFocusPersonal) {
          if (myFocusPersonal.hasOwnProperty(i)) {
            myFocusPersonal[i].showCheckbox = true;
            focusPersonalGuids.push(myFocusPersonal[i].guid);
          }
        }
        this.setState({ myFocusPersonal });
        this.setState({ focusPersonalGuids });
      } else if (type === 0) {
        this.setState({ customCheckbox2: false });
        let { myFocusPersonal } = this.state;
        for (const i in myFocusPersonal) {
          if (myFocusPersonal.hasOwnProperty(i)) {
            myFocusPersonal[i].showCheckbox = false;
          }
        }
        this.setState({ myFocusPersonal });
        this.setState({ focusPersonalGuids: [] });
      }
    } else if (id === 3) {
      if (type === 1) {
        this.setState({ customCheckbox3: true });
        let { myFocusIp } = this.state;
        let focusIpGuids = [];
        for (const i in myFocusIp) {
          if (myFocusIp.hasOwnProperty(i)) {
            myFocusIp[i].showCheckbox = true;
            focusIpGuids.push(myFocusIp[i].guid);
          }
        }
        this.setState({ myFocusIp });
        this.setState({ focusIpGuids });
      } else if (type === 0) {
        this.setState({ customCheckbox3: false });
        let { myFocusIp } = this.state;
        for (const i in myFocusIp) {
          if (myFocusIp.hasOwnProperty(i)) {
            myFocusIp[i].showCheckbox = false;
          }
        }
        this.setState({ myFocusIp });
        this.setState({ focusIpGuids: [] });
      }
    }
  }

  // searchCompany
  searchCompany(value) {
    this.setState({ companyName: value });
    this.changeMyFollow("companyName", value);
  }

  // searchPersonal
  searchPersonal(value) {
    this.setState({ userRealName: value });
    this.changeMyFollow("userRealName", value);
  }

  // searchIP
  searchIP(value) {
    this.setState({ ipName: value });
    this.changeMyFollow("ipName", value);
  }

  // 删除数组指定某项
  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  render() {
    const { tabChange, myFocusCompany, myFocusPersonal, myFocusIp, loading } = this.state;
    return (
      <div className='con-right'>
        {/* change tips */}
        <div className='con-change'>
          <ul className='tab-ul'>
            <li className={tabChange === 1 ? 'active' : ''} onClick={() => this.tabNum(1)}>关注的企业</li>
            <li className={tabChange === 2 ? 'active' : ''} onClick={() => this.tabNum(2)}>关注的人</li>
            <li className={tabChange === 3 ? 'active' : ''} onClick={() => this.tabNum(3)}>关注的IP</li>
          </ul>
        </div>
        {/* 关注的企业 */}
        {
          this.state.tabChange === 1 &&
          <div className="followingEnterprise">
            {/* 批量取消关注 */}
            {(toJS(myFocusCompany).length !== 0 || this.state.companyName) &&
            <div className="unFollowing">
              <div className="checkAll">
                {!this.state.customCheckbox1 ?
                  <div className="custom-checkbox" onClick={() => this.changeGuidsAll(1, 1)}/> :
                  <div className="custom-checkbox-check" onClick={() => this.changeGuidsAll(0, 1)}/>}
                <div className="checkbox-text" onClick={() => this.unfocus(this.state.focusCompanyGuids, 1)}>批量取消关注
                </div>
              </div>
              <div className="onSearchRight">
                <Search className="searchInput" size="large" placeholder="请输入企业名称进行搜索"
                        onSearch={(e) => this.searchCompany(e)}/>
              </div>
            </div>
            }
            {/* 关注列表 */}
            {
              toJS(myFocusCompany) && toJS(myFocusCompany).map((item, index) => {
                return (
                  <div key={index} className="follingListDemo">
                    {!item.showCheckbox ? <div className="demoCheckbox"
                                               onClick={() => this.changeFocusCompanyGuides(item.guid, 1, index)}/> :
                      <div className="demoCheckboxCheck"
                           onClick={() => this.changeFocusCompanyGuides(item.guid, 0, index)}/>}

                    <Link to={`/business-homepage/${item.guid}`}>
                      <img className="picUrl" src={item.picUrl || default_img} alt=''/>
                    </Link>
                    <div className="company">
                      <Link to={`/business-homepage/${item.guid}`}>
                        <div className="companyName">
                          {item.companyName}{item.realStatus === 1 && <span><img src={auth} alt=''/></span>}
                        </div>
                      </Link>
                      <div className="companyCategoryName">{item.companyCategoryName}</div>
                    </div>
                    <div className="deleteFolling" onClick={() => {
                      this.unfocus(item.guid, 1);
                    }}>
                      <Icon type="minus-circle" theme="filled" style={{ color: '#ff6666' }}/><span>取消关注</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        }
        {/* 关注的人 */}
        {
          this.state.tabChange === 2 &&
          <div className="followingPerson">
            {/* 批量取消关注 */}
            {(toJS(myFocusPersonal).length !== 0 || this.state.userRealName) &&
            <div className="unFollowing">
              <div className="checkAll">
                {!this.state.customCheckbox2 ?
                  <div className="custom-checkbox" onClick={() => this.changeGuidsAll(1, 2)}/> :
                  <div className="custom-checkbox-check" onClick={() => this.changeGuidsAll(0, 2)}/>}
                <div className="checkbox-text" onClick={() => this.unfocus(this.state.focusPersonalGuids, 2)}>批量取消关注
                </div>
              </div>
              <div className="onSearchRight">
                <Search className="searchInput" size="large" placeholder="请根据姓名进行搜索"
                        onSearch={(e) => this.searchPersonal(e)}/>
              </div>
            </div>
            }
            {/* 关注列表 */}
            {
              (toJS(myFocusPersonal) || []).map((item, index) => {
                return (
                  <div key={index} className="follingListDemo">
                    {!item.showCheckbox ? <div className="demoCheckbox"
                                               onClick={() => this.changeFocusPersonalGuids(item.guid, 1, index)}/> :
                      <div className="demoCheckboxCheck"
                           onClick={() => this.changeFocusPersonalGuids(item.guid, 0, index)}/>}

                    <Link to={`/personal-homepage/${item.guid}`}>
                      <img className="picUrl picUrlPeople" src={item.picUrl || ic_user} alt=''/>
                    </Link>
                    <div className="company">
                      <Link to={`/personal-homepage/${item.guid}`}>
                        <div className="companyName">
                          {item.userRealName}{item.realStatus === 1 && <span><img src={auth} alt=''/></span>}
                        </div>
                      </Link>
                      <div
                        className="companyCategoryName">{item.occupation ? item.occupation + "@" + item.companyName : "个人"}</div>
                    </div>
                    <div className="deleteFolling" onClick={() => {
                      this.unfocus(item.guid, 2);
                    }}>
                      <Icon type="minus-circle" theme="filled" style={{ color: "#ff6666" }}/><span>取消关注</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        }
        {/* 关注的IP */}
        {
          this.state.tabChange === 3 &&
          <div className="followingIP">
            {/* 批量取消关注 */}
            {(toJS(myFocusIp).length !== 0 || this.state.ipName) &&
            <div className="unFollowing">
              <div className="checkAll">
                {!this.state.customCheckbox3 ?
                  <div className="custom-checkbox" onClick={() => this.changeGuidsAll(1, 3)}/> :
                  <div className="custom-checkbox-check" onClick={() => this.changeGuidsAll(0, 3)}/>}
                <div className="checkbox-text" onClick={() => this.unfocus(this.state.focusIpGuids, 3)}>批量取消关注</div>
              </div>
              <div className="onSearchRight">
                <Search className="searchInput" size="large" placeholder="请根据IP名称进行搜索"
                        onSearch={(e) => this.searchIP(e)}/>
              </div>
            </div>
            }
            {/* IP关注列表 */}
            <div className="follingIPOut">
              {
                (toJS(myFocusIp) || []).map((item, index) => {
                  return (
                    <div key={index} className="follingIPListDemo">
                      <Link to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`}>
                        <img className="picUrl" src={item.picUrl || default_img} alt=''/>
                        <div className='ipName'>{item.ipName}</div>
                      </Link>
                      <div className="unFollowingBox">

                        {!item.showCheckbox ? <div className="unFollowingCheckbox"
                                                   onClick={() => this.changeFocusIpGuids(item.guid, 1, index)}/> :
                          <div className="unFollowingCheckboxCheck"
                               onClick={() => this.changeFocusIpGuids(item.guid, 0, index)}/>}
                        <div className="checkboxText" onClick={() => {
                          this.unfocus(item.guid, 3);
                        }}>取消关注
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        }
        {
          loading && <div className="loading"><img src={icon_load} alt=""/></div>
        }
        {
          !loading && (this.state.tabChange === 3 && _isEmpty(myFocusIp) || (this.state.tabChange === 1 && _isEmpty(myFocusCompany)) || (this.state.tabChange === 2 && _isEmpty(myFocusPersonal))) &&
          <NoResult/>
        }
      </div>
    );
  }
}
