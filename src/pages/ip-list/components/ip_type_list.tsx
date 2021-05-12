import * as React from "react";
import authenticate from "@assets/images/renzheng.png";
import icon_load from "@assets/images/update/timg.gif";
import { toJS } from 'mobx';
import ic_default from "@assets/images/contrast/ic_default_page.png";
import ic_result_iveness from "@assets/images/contrast/ic_result_iveness.png";
import _ from 'lodash';
import test from '../ip_type_list_render';
import { setContact, deletContact } from "@utils/util";
import Alert from '@components/alert';
import _isEmpty from 'lodash/isEmpty';

interface IpTypeListProps {
  data: any,
  totalCount: number,
  pageSize: number,
  history?: any,
  topTypeSuperiorNumber: boolean,
  ip_list: any,
  contastList?: any,
  callbackcontastList: Function,
}

interface IpTypeListState {
  current: any,
  special: boolean,
  show: boolean,
  loginShow: boolean,
  message: string,
  buttonValue: string,
  url: string,
  isloading: boolean,
}

export default class IpTypeList extends React.Component<IpTypeListProps, IpTypeListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isloading: false,
      current: "",
      special: false,
      message: '',
      show: false,
      loginShow: false,
      buttonValue: '去登陆',
      url: '',
    };
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * 判断是否加入对比
   */
  _findipids = (item) => {
    // const { contastList } = this.props;
    let contastList = JSON.parse(localStorage.getItem('contastList'));

    let istrue = false;
    if (!!contastList) {
      contastList.map(val => {
        if (Number(val.ipids) === Number(item.ipGuid)) {
          istrue = true;
        }
      });
    }
    return istrue;
  };

  // 截流分页加载
  throttle(func, interval) {
    let timeout;
    let startTime: any = new Date();
    return () => {
      clearTimeout(timeout);
      let curTime: any = new Date();
      if (curTime - startTime <= interval) {
        // 小于规定时间间隔时，用setTimeout在指定时间后再执行
        timeout = setTimeout(() => {
          func();
        }, curTime - startTime);
      } else {
        // 重新计时并执行函数
        startTime = curTime;
      }
    };
  }

  handleScroll = () => {
    const { ip_list, data } = this.props;
    const { isloading, isNoResult, customStatus: { currentPage } } = ip_list;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      if (!isloading && !_isEmpty(data) && data.length >= 24 && !isNoResult) {
        ip_list.setloadingType(true);
        this.throttle(ip_list.changeStatus({ currentPage: currentPage + 1 }), 3000);
      }
    }
  };

  _start(item: any) {
    const doRender = test[item.ipTypeSuperiorNumber];
    return _.isFunction(doRender) && doRender(item);
  }

  render() {
    const {
      data, totalCount, topTypeSuperiorNumber, contastList, callbackcontastList,
      ip_list: {
        page: { currentPage, lastPage },
        isloading,
        isNoResult,
        openLoading
      }
    } = this.props;
    let user: any, memberLevel: number;
    user = JSON.parse(localStorage.getItem('user'));
    if (!_isEmpty(user)) {
      memberLevel = user.memberLevel;
    }

    let contrastList = JSON.parse(localStorage.getItem('contastList'));
    let _ipNumber = JSON.parse(localStorage.getItem('ipTypeSuperiorNumber'));

    const contrastArr = [',3,', ',6,'];
    const visibleContrastArr = !_isEmpty(user) && contrastArr.some((e: string) => user.userJurisdiction.indexOf(e) !== (-1));

    return (
      <div>
        <div className="content-container flex-column justify-content-center ">
          {/*<div className="top-div justify-content-between ">
             <div className="search-result">查询结果: <p>搜索到<i>{totalCount}</i>条内容</p></div>

            <div className="button-group flex ">
            <div className="add-ip-button  "><img src={add_ip} alt=""/>添加新的ip</div>
            <div className="queue_download " onClick={() => {
            this.props.history.push("/download");
            }}>
            <img src={add_cart} alt=""/>批量下载队列
            <div className="queue_download_list">+0</div>
            </div>
            </div>
          </div>*/}
          <div className="ip-t flex-row  flex-wrap   align-items-center" id="getPagex">
            {
              data && data.map((item, index) => {
                return (
                  <div key={index} className="ip-type-list-parent"
                       onClick={() => {
                         window.open(`#/detail/${item.ipTypeSuperiorNumber}/${item.ipGuid}`);
                       }}
                       onMouseEnter={
                         (e) => {
                           this.setState({
                             current: index
                           });
                           let clientWidth = document.documentElement.clientWidth;
                           let whiteSpace = (clientWidth - 1140) / 2;
                           let offsetLeft = e.currentTarget.offsetLeft - whiteSpace;
                           if (offsetLeft > 950 || clientWidth - offsetLeft < 635) {
                             this.setState({
                               special: true
                             });
                           }
                         }
                       }
                       onMouseLeave={
                         () => {
                           this.setState({
                             current: "",
                             special: false
                           });
                         }
                       }>
                    <div
                      className={`ip-type-list  ${this.state.current === index ? 'hover-class' : ''}  ${this.state.special ? 'hover-class-special' : ''}`}
                    >
                      <div className="ip-type-item">
                        <img src={item.ipPicUrl} alt="" className="ip-type-img"/>
                      </div>
                      {item.ipIsAuthenticated === 3 && <img className="certification" src={authenticate} alt=""/>}
                      <div className="ip-type-item-text justify-content-around">
                        <div className="item-name">{item.ipName}</div>
                        <div className="item-dou text-right "/>
                      </div>
                      <div className="hover-show ">
                        {/* item.ipIsAuthenticated === 3 为已认证 */}
                        {item.ipIsAuthenticated === 3 &&
                        <img className="hover-certification" src={authenticate} alt=""/>}
                        <div className="hover-content">
                          <div className="left-content">
                            <div className="hover-type-name name">{item.ipName}</div>
                            {this._start(item)}
                            {
                              this._findipids(item) ?
                                <span className="ip-care-status ip-compare-status active hover-addContrast"
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                        await deletContact(item.ipGuid);
                                        callbackcontastList(contrastList);
                                      }}>
                                  <i className="iconfont vs iconvs_pr"/>已加入对比</span>
                                :
                                <span className="ip-care-status ip-compare-status hover-addContrast"
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                        // 判断是否登陆
                                       /* if (user === null) {
                                          localStorage.setItem('historyUrl', `ip-list`);
                                          this.setState({
                                            message: '请登陆后再添加对比',
                                            url: '/login',
                                            loginShow: true,
                                          });
                                          return false;
                                        }*/
                                        let _nowIpNumber = item.ipTypeSuperiorNumber;
                                        // if (!visibleContrastArr) {
                                        //   this.setState({
                                        //     loginShow: true,
                                        //     url: '/user/12',
                                        //     buttonValue: '去升级',
                                        //     message: '该数据仅为钻石VIP会员用户可见，如需查看请先升级',
                                        //   });
                                        //   return false;
                                        // }
                                        if (_ipNumber === _nowIpNumber || _ipNumber === null) {
                                          if (contrastList !== null && contrastList.length >= 3) {
                                            this.setState({
                                              show: true,
                                              message: '同时最多添加三种对比',
                                            });
                                          } else {
                                            setContact({
                                              name: item.ipName,
                                              ipids: Number(item.ipGuid),
                                            }, _nowIpNumber);
                                            callbackcontastList(contrastList);
                                          }

                                        } else {
                                          this.setState({
                                            show: true,
                                            message: '类别不一样，不能进行对比',
                                          });
                                        }
                                      }}
                                ><i className="iconfont vs iconvs_pr"/>加入对比</span>
                            }
                            {/* <div className="hover-type">
                                {
                                  item.ipTypeNumberNames && item.ipTypeNumberNames.map((i, k) => {
                                    return (
                                      <span key={k}>{i}</span>
                                    );
                                  })
                                }
                              </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
          {
            openLoading && !isloading &&
            <p className="ofTheBottom">
              下拉查看更多
            </p>
          }
          {
            isloading && <p className="ofTheBottom"><img className="loading" src={icon_load} alt=""/></p>
          }
          {
            isNoResult && !isloading && data.length > 0 &&
            < p className="ofTheBottom"><span>没有更多内容</span></p>
          }
        </div>
        {/* {
          Number(totalCount) > 20 &&
          (<Pagination/>)
        } */}
        {this.state.show &&
        <Alert message={this.state.message}
               onClose={() => {
                 this.setState({ show: false });
               }}/>
        }
        {this.state.loginShow &&
        <Alert message={this.state.message}
               buttonValue={this.state.buttonValue}
               onClose={() => {
                 this.setState({ loginShow: false });
               }}
               onSubmit={() => {
                 this.props.history.push(this.state.url);
               }}
        />
        }
        {
          !topTypeSuperiorNumber && toJS(this.props.data).length === 0 && !this.props.ip_list.isloading && (
            <div className="font-size12">
              <img src={ic_result_iveness} alt=""/>
              <p>暂无数据！</p>
            </div>
          )
        }
        {
          topTypeSuperiorNumber && <div className="font-size12">
            <img src={ic_default} alt=""/>
            <p>此模块正披星戴月开发中， 敬请期待！</p>
          </div>
        }
      </div>
    );
  }
}
