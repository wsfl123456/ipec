import * as React from 'react';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import NoResult from '@components/no_result';
import Alert from '@components/alert';
import _isObject from 'lodash/isObject';
import Add from '@assets/images/add.svg';
import { Checkbox, message, Select } from 'antd';
import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';
import icon_load from "@assets/images/update/timg.gif";
import { _throttle } from '@utils/util';
import diyShow from '@utils/util';

const { Option } = Select;

interface IIpProps extends IComponentProps {
  userGuid?: string;
  realStatus: number;
  history: any;
  exhibitionGuid: string;
  isExhibitor: number;
  params?: any;
}

interface IIpState {
  btnNum: number;
  checkStatus: string;
  show: boolean;
  message: string;
  alertShow: boolean;
  alertMessage: string;
  selectedIdArr: any;
  selectedAll: boolean;
  currentPage: number;
  index: number;
  ipid: string;
  type: string;
  approvalGuid: string;
}

@inject('user', 'login', 'update_store')
@observer
export default class PublishedIP extends React.Component <IIpProps, IIpState> {

  constructor(props) {
    super(props);
    this.state = {
      btnNum: 1,
      checkStatus: '',
      message: '',
      show: false,
      alertShow: false,
      alertMessage: '',
      selectedIdArr: [],
      selectedAll: false,
      currentPage: 1,
      index: 0, // 数据下标值
      ipid: '',
      type: '',
      approvalGuid: '',
    };
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    const { user, login } = this.props;
    const { userGuid } = login.userInfo;
    user.changeReleaseParams({ userGuid });
    await user.myRelease();
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async setMenuNum(num: number) {
    const { user, login } = this.props;
    const { userGuid } = login.userInfo;
    this.setState({
      btnNum: num,
      checkStatus: '',
      currentPage: 1,
    });
    if (num === 1) {
      user.changeReleaseParams({
        userGuid,
        ipName: '',
        ipTypeSuperiorNumber: '',
        ipCheckStatus: '',
        currentPage: 1,
        pageSize: 20
      });
      await user.myRelease();
    } else if (num === 2) {

      this.props.user.setMyUpdateFlag(true);
      user.changeUpdateParams({
        userGuid,
        ipName: '',
        ipTypeSuperiorNumber: '',
        checkStatus: '',
        currentPage: 1,
        pageSize: 20
      });
      await user.getUpdate();
    }
  };

  // 全选删除
  deleteAllFun() {
    let { selectedIdArr } = this.state;
    if (_isEmpty(selectedIdArr)) {
      message.warning("您还没有选择IP");
    } else {
      this.setState({
        alertShow: true,
        alertMessage: '确定要删除此IP吗？',
        ipid: selectedIdArr.join(','),
        type: 'myReleaseList'
      });
    }
  }

  /**
   * 删除IP
   */
  async deleteIpFun() {
    const { userGuid, user } = this.props;
    const { myReleaseList, myUpdateList } = user;
    const { index, type, approvalGuid, ipid, } = this.state;
    // 发布的IP
    if (type === 'myReleaseList') {
      // console.log(selectedIdArr, ipid);
      const params = {
        userGuid,
        ipids: ipid,
      };
      const isSuccess: any = await user.deleteMyRelease(params);
      if (_isObject(isSuccess) && isSuccess['show']) {
        message.error(isSuccess['msg']);
      } else {
        this.setState({
          selectedIdArr: [],
          selectedAll: false,
        });
        message.success(isSuccess['msg']);
        // myReleaseList.splice(index, 1);
        user.changeReleaseParams({ currentPage: 1 });
        await user.myRelease();

      }
    } else {
      // 修改中的IP
      const params = {
        userGuid,
        approvalGuid
      };
      const isSuccess: any = await user.deleteMyUpdate(params);
      if (_isObject(isSuccess) && isSuccess['show']) {
        message.error(isSuccess['msg']);
      } else {
        message.success(isSuccess['msg']);
        myUpdateList.splice(index, 1);
      }
    }
  }

  // 选中全部
  checkAll() {
    let { selectedAll, selectedIdArr } = this.state;
    const { myReleaseList } = this.props.user;
    selectedAll = !selectedAll;
    if (selectedAll) {
      myReleaseList.map(item => {
        selectedIdArr.push(item.ipid);
      });
    } else {
      selectedIdArr = [];
    }
    this.setState({
      selectedIdArr: _uniqWith(selectedIdArr, _isEqual),
      selectedAll
    });
  }

  // 点击选中取消
  toggleSelected(ipid) {
    let { selectedAll, selectedIdArr } = this.state;
    const { myReleaseList } = this.props.user;
    let num: number = null;
    num = selectedIdArr.findIndex((v) => {
      return v === ipid;
    });
    if (num >= 0) {
      selectedIdArr.splice(num, 1);
      selectedAll = false;
    } else {
      selectedIdArr.push(ipid);
      if (selectedIdArr.length === myReleaseList.length) {
        selectedAll = true;
      }
    }
    this.setState({
      selectedAll,
      selectedIdArr,
    });
  }

  // 选中样式
  toggleSelectClass(ipid) {
    let { selectedIdArr } = this.state;
    let num: Number = null;
    num = selectedIdArr.find((v) => {
      return v === ipid;
    });
    return num;
  }

  /**
   * 添加参展IP
   * ipids： 15315，15316
   */
  addExhibition = async (type, ipid) => {
    const { user, userGuid, exhibitionGuid } = this.props;
    const { selectedIdArr } = this.state;
    const ipids = selectedIdArr.join(',');
    let params: object;
    if (type === 'multiple') {
      params = {
        userGuid,
        exhibitionGuid,
        ipids,
      };
    } else {
      params = {
        userGuid,
        exhibitionGuid,
        ipids: ipid,
      };
    }

    const isObject = await user.addExhibitionIPs(params);
    if (isObject) {
      isObject['isShow'] ? message.success(isObject['message']) : message.error(isObject['message']);
    }
  };

  /**
   * 删除参展IP
   * ipids： 15315，15316
   */
  deleteExhibition = async (type, ipid) => {
    const { user, userGuid, exhibitionGuid } = this.props;
    const { selectedIdArr } = this.state;
    const ipids = selectedIdArr.join(',');
    let params: object;
    if (type === 'multiple') {
      params = {
        userGuid,
        exhibitionGuid,
        ipids,
      };
    } else {
      params = {
        userGuid,
        exhibitionGuid,
        ipids: ipid,
      };
    }
    const isObject = await user.deleteExhibitionIPs(params);
    if (isObject) {
      isObject['isShow'] ? message.success(isObject['message']) : message.error(isObject['message']);
    }
  };

  handleScroll = () => {
    const { user } = this.props;
    const { btnNum } = this.state;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      let currentPage = user.releaseParams.currentPage + 1;
      if (btnNum === 1 && !user.releaseFlag && !user.release_noMore && user.myReleaseList.length >= 20) {
        this.setState({
          currentPage,
        });
        user.setMyReleaseFlag(true);
        user.changeReleaseParams({ currentPage });
        _throttle(user.myRelease(), 3000);
      } else if (btnNum === 2 && !user.updateFlag && !user.update_noMore && user.myUpdateList.length >= 20) {
        this.setState({
          currentPage,
        });

        user.setMyUpdateFlag(true);
        user.changeUpdateParams({ currentPage });
        _throttle(user.getUpdate(), 3000);
      }

    }
  };

  render() {
    const { btnNum, checkStatus, show, message, alertShow, alertMessage, ipid } = this.state;
    const { user, realStatus, isExhibitor, login, update_store } = this.props;
    const { myUpdateList, myReleaseList } = user;
    return (
      < div className="single-module">
        <div className="top-right">
          <ul className="top-ul">
            <li className={btnNum === 1 ? "borders" : "border-display"}
                onClick={async () => await this.setMenuNum(1)}><a>发布的IP</a></li>
            <li className={btnNum === 2 ? "borders-two" : "border-display"}
                onClick={async () => await this.setMenuNum(2)}><a>修改的IP</a></li>
          </ul>
          {
            realStatus === 1 ?
              <Link to="/update" className="add-ip" onClick={() => update_store.reset()}>

                <div>
                  <img src={Add} alt=''/>上传IP
                </div>
              </Link>
              :
              <div className="add-ip"
                   onClick={() => {
                     this.setState({
                       show: true,
                       message: "您还未认证，请先认证"
                     });
                   }}
              >
                <div>
                  <img src={Add} alt=''/>上传IP
                </div>
              </div>
          }

        </div>
        <div className="top-change">
          {
            this.state.btnNum === 1 &&
            <ul>
              <li>
                <input type="text" placeholder="请输入IP名称" className="u-input"
                       onChange={(e) => {
                         user.changeReleaseParams({ ipName: e.target.value, currentPage: 1 });
                       }}
                />
              </li>
              <li>
                <Select
                  style={{
                    width: 228,
                    display: "inline-block",
                    height: 48,
                    verticalAlign: "top",
                    borderRadius: "4px 4px 0 0 ",
                  }}
                  placeholder="请选择IP类型"
                  optionFilterProp="children"
                  onChange={(value) => {
                    user.changeReleaseParams({ ipTypeSuperiorNumber: value, currentPage: 1 });
                  }}
                >
                  {
                    diyShow.TypeNumberKV && diyShow.TypeNumberKV.map((item, index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>;
                    })
                  }
                </Select>
              </li>
              <li>
                <Select
                  style={{
                    width: 228,
                    display: "inline-block",
                    height: 48,
                    verticalAlign: "top",
                    borderRadius: "4px 4px 0 0 ",
                  }}
                  placeholder="请选择状态"
                  optionFilterProp="children"
                  onChange={(value: string) => {
                    this.setState({
                      selectedIdArr: [],
                      selectedAll: false
                    });

                    user.setMyReleaseFlag(true);
                    user.changeReleaseParams({ ipCheckStatus: value, currentPage: 1 });
                  }}
                >
                  <option value="">全部</option>
                  <option value="1">已发布</option>
                  <option value="3">审核中</option>
                  <option value="2">未通过审核</option>
                </Select>
                <div className="u-search">
                  <i className="icon iconfont icon-search"
                     onClick={async () => {
                       await user.myRelease();
                     }}/>
                </div>
              </li>
            </ul>
          }
          {
            this.state.btnNum === 2 &&
            <ul>
              <li>
                <input type="text" placeholder="请输入IP名称" className="u-input"
                       onChange={(e) => {
                         user.setMyUpdateFlag(true);
                         user.changeUpdateParams({ ipName: e.target.value, currentPage: 1 });
                       }}
                />
              </li>
              <li>
                <Select
                  style={{
                    width: 228,
                    display: "inline-block",
                    height: 48,
                    verticalAlign: "top",
                    borderRadius: "4px 4px 0 0 ",
                  }}
                  placeholder="请选择IP类型"
                  optionFilterProp="children"
                  onChange={(value) => {
                    user.changeUpdateParams({ ipTypeSuperiorNumber: value, currentPage: 1 });
                  }}
                >
                  {
                    diyShow.TypeNumberKV && diyShow.TypeNumberKV.map((item, index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>;
                    })
                  }
                </Select>
              </li>
              <li>
                <Select
                  style={{
                    width: 228,
                    display: "inline-block",
                    height: 48,
                    verticalAlign: "top",
                    borderRadius: "4px 4px 0 0 ",
                  }}
                  placeholder="请选择状态"
                  optionFilterProp="children"
                  onChange={(value: string) => {
                    user.changeUpdateParams({ checkStatus: value, currentPage: 1 });
                  }}
                >
                  <option value="">全部</option>
                  <option value="1">已发布</option>
                  <option value="3">审核中</option>
                  <option value="2">审核失败</option>
                </Select>
                <div className="u-search">
                  <i className="icon iconfont icon-search"
                     onClick={async () => {
                       await user.getUpdate();
                     }}/>
                </div>
              </li>
            </ul>
          }
        </div>
        <div className={this.state.btnNum === 1 ? "table-btnNum" : "table-display"}>
          <div className="right-table">
            {/*展会已下架或者过期  isExpireExhibition : true || exhibitionGuid:""*/}
            {
              checkStatus === '1' && isExhibitor !== 0 && !_isEmpty(myReleaseList) &&
              (login.userInfo.isExpireExhibition === false || login.userInfo.exhibitionGuid !== "") &&
              <div className="checked-button">
                <div className="checkbox-text checkbox-text-large" onClick={async () => {
                  await this.addExhibition('multiple', '');
                  this.setState({
                    selectedAll: false,
                    selectedIdArr: [],
                  });
                  user.changeReleaseParams({ ipCheckStatus: 1, currentPage: 1 });
                  await user.myRelease();
                }}>批量参展
                </div>
                <div className="checkbox-text checkbox-text-large" onClick={async () => {
                  await this.deleteExhibition('multiple', '');
                  this.setState({
                    selectedAll: false,
                    selectedIdArr: [],
                  });
                  user.changeReleaseParams({ ipCheckStatus: 1, currentPage: 1 });
                  await user.myRelease();
                }}>批量取消参展
                </div>
              </div>
            }
            {/*批量删除*/}
            {
              checkStatus !== '3' && !_isEmpty(myReleaseList) &&
              <div className="checked-button">
                <div className="checkbox-text checkbox-text-large"
                     onClick={() => this.deleteAllFun()}>批量删除
                </div>
              </div>
            }

            <div className="table-list">
              <table className="table table-striped table-bordered tab le-hover publish-table">
                <thead className='text-center'>
                {
                  !_isEmpty(myReleaseList) &&
                  <tr>
                    {
                      checkStatus !== '3' && isExhibitor !== 0 ?
                        <th className={this.state.selectedAll ? "th-selected" : ""}
                            onClick={() => {
                              // 全部时不可全选
                              if (checkStatus) {
                                this.checkAll();
                              }
                            }}>
                          <div className="custom-checkbox">
                            <Checkbox disabled={checkStatus === ''} style={{ opacity: 0 }}/>
                          </div>
                        </th>
                        : <th>序号</th>
                    }
                    <th>IP名称</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>发布日期</th>
                    {/* <th>是否参展</th> */}
                    <th>操作</th>
                  </tr>
                }
                </thead>
                <tbody>
                {
                  myReleaseList && myReleaseList.map((i, index) => {
                    return (
                      <tr key={index}>
                        {
                          (checkStatus !== '3' && isExhibitor !== 0) ?
                            <td
                              className={(this.toggleSelectClass(i.ipid) === i.ipid || this.state.selectedAll) ? "td-selected" : ""}
                              onClick={() => {
                                if (i.ipCheckStatus !== 3) {
                                  this.toggleSelected(i.ipid);
                                }
                              }}>
                              <div className="custom-checkbox">
                                <Checkbox disabled={i.ipCheckStatus === 3} style={{ opacity: 0 }}/>
                              </div>
                            </td>
                            :
                            <td>{index + 1}</td>
                        }
                        <td>
                          <div className="publish-table-td with-width-100">
                            {i.ipName}
                          </div>
                        </td>
                        <td>
                          {
                            <div className="publish-table-td">
                              {i.ipTypeSuperiorNumberName}
                            </div>
                          }
                        </td>

                        <td>
                          {
                            i.ipCheckStatus === 1 && <div className="publish-table-td">审核通过</div>
                          }
                          {
                            i.ipCheckStatus === 2 && <div className="publish-table-td">审核不通过</div>
                          }
                          {
                            i.ipCheckStatus === 3 && <div className="publish-table-td">审核中</div>
                          }
                        </td>
                        <td>{i.createDate ? moment(i.createDate).format('YYYY-MM-DD') : "--"}</td>
                        {/* <td>
                          <div className="publish-table-td">
                            <span className={i.isExhibitors === true ? 'isExhibitor' : 'noExhibitor'}>
                            {i.isExhibitors === true ? "已参展" : "未参展"}
                            </span>
                          </div>
                        </td> */}
                        <td className={checkStatus === '1' ? 'td-201' : ''}>
                          <div className="publish-table-td">
                            {
                              i.ipCheckStatus !== 3 &&
                              <Link to={`/update/${i.ipTypeSuperiorNumber}/${i.ipid}`}
                                    className="re-upload-a-btn">编辑</Link>
                            }
                            {
                              i.isExhibitors === false &&
                              (i.ipCheckStatus === 1 || i.ipCheckStatus === 2) &&
                              <a className="delete-a-btn"
                                 onClick={() => {
                                   this.setState({
                                     alertShow: true,
                                     alertMessage: '确定要删除此IP吗？',
                                     ipid: i.ipid,
                                     index,
                                     type: 'myReleaseList'
                                   });
                                 }}
                              >删除</a>
                            }
                            {
                              checkStatus === '1' && isExhibitor !== 0 && i.isExhibitors === false &&
                              (login.userInfo.isExpireExhibition === false || login.userInfo.exhibitionGuid !== "") &&
                              <a onClick={async () => {
                                await this.addExhibition('single', i.ipid);
                                user.changeReleaseParams({ ipCheckStatus: 1, currentPage: 1 });
                                await user.myRelease();
                              }}>
                                参展
                              </a>
                            }
                            {
                              checkStatus === '1' && isExhibitor !== 0 && i.isExhibitors === true &&
                              (login.userInfo.isExpireExhibition === false || login.userInfo.exhibitionGuid !== "") &&
                              <a className="delete-a-btn"
                                 onClick={async () => {
                                   await this.deleteExhibition('single', i.ipid);
                                   user.changeReleaseParams({ ipCheckStatus: 1, currentPage: 1 });
                                   await user.myRelease();
                                 }}>
                                取消参展
                              </a>
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
          {/*  {
            this.props.user.releaseFlag &&
            <div className="loading"><img src={icon_load} alt=""/></div>
          }*/}
          {
            // !this.props.user.releaseFlag &&
            _isEmpty(myReleaseList) && <NoResult/>
          }
        </div>
        <div className={btnNum === 2 ? "table-btnNum" : "table-display"}>
          <div className="right-table">
            <div className="table-list">
              <table className="table table-striped table-bordered table-hover publish-table">
                <thead className='text-center'>
                {
                  !_isEmpty(myUpdateList) &&
                  <tr>
                    <th>序号</th>
                    <th>IP名称</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>发布日期</th>
                    <th>备注</th>
                    <th>操作</th>
                  </tr>
                }
                </thead>
                <tbody>
                {
                  myUpdateList && myUpdateList.map((i, k) => {
                    return (
                      <tr key={k}>
                        <td>{k + 1}</td>
                        <td>
                          <div className="publish-table-td with-width-100">
                            {i.ipName}
                          </div>
                        </td>
                        <td>
                          <div className="publish-table-td">
                            {i.ipTypeSuperiorNumberName}
                          </div>
                        </td>
                        <td>
                          {
                            i.checkStatus === 3 && <div className="publish-table-td">审核中</div>
                          }
                          {
                            i.checkStatus === 1 && <div className="publish-table-td">审核通过</div>
                          }
                          {
                            i.checkStatus === 2 && <div className="publish-table-td">审核不通过</div>
                          }
                        </td>
                        <td>{i.createDate ? moment(i.createDate).format('YYYY-MM-DD') : "--"}</td>
                        <td>
                          <div className="publish-table-td">
                            {i.remark}
                          </div>
                        </td>
                        <td>
                          <div className="publish-table-td">
                            {/*{
                              i.checkStatus !== 3 &&
                              <Link to={`/update/${i.ipTypeSuperiorNumber}/${i.ipid}`}
                                    className="re-upload-a-btn">编辑</Link>
                            }*/}
                            {
                              // i.checkStatus !== 3 &&
                              <a className="delete-a-btn"
                                 onClick={() => {
                                   this.setState({
                                     alertShow: true,
                                     alertMessage: '确定要删除此IP吗？',
                                     approvalGuid: i.approvalGuid,
                                     index: k,
                                     type: 'myUpdateList'
                                   });
                                   // await this.deleteIpFun(i.ipid, myUpdateList);
                                   // myUpdateList.splice(k, 1);
                                 }}
                              >删除</a>
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
          {/* {
            this.props.user.updateFlag &&
            <div className="loading"><img src={icon_load} alt=""/></div>
          }*/}
          {
            // !this.props.user.updateFlag &&
            _isEmpty(myUpdateList) && <NoResult/>
          }
        </div>
        {show &&
        <Alert message={message}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 this.props.history.push('/user/2');
               }}
        />
        }
        {alertShow &&
        <Alert message={alertMessage}
               onClose={() => {
                 this.setState({ alertShow: false });
               }}
               onSubmit={async () => {
                 await this.deleteIpFun();
               }}
        />
        }
      </div>
    );
  }
}
