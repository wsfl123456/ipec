import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/pub_case.scss";
import Add from '@assets/images/add.svg';
import { Link } from "react-router-dom";
import { deleteMyCase } from '@utils/api';
import Alert from '@components/alert';
import NoResult from "@components/no_result";
import moment from 'moment';
import { message, Select } from 'antd';
import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import { _throttle } from '@utils/util';

interface ICaseProps extends IComponentProps {
  history?: any;
  realStatus?: number;
}

interface IPubCase {
  postStatus: string;
  currentPage: number;
  message: string;
  isShow: boolean;
  alertShow: boolean;
  alertMessage: string;
  portalPostGuid: string;
  selectedAll: boolean;
  selectedIdArr: any;
}

@inject('user', 'login')
@observer
export default class PublishedIpNeeds extends React.Component <ICaseProps, IPubCase> {
  constructor(props) {
    super(props);
    this.state = {
      postStatus: '',
      currentPage: 1,
      message: '',
      isShow: false,
      alertShow: false,
      alertMessage: '',
      portalPostGuid: '',
      selectedAll: false,
      selectedIdArr: [],
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-发布的IP需求";
    const { user, login } = this.props;
    const { userGuid } = login.userInfo;
    const params = {
      userGuid,
      postType: 4,
    };
    user.changeCaseAndNeed(params);
    await user.getMyCase();
    window.addEventListener("scroll", this.handleScroll);
  }

  async componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { user } = this.props;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      // let currentPage = this.state.currentPage + 1;
      let currentPage = user.caseAndNeedParams.currentPage + 1;
      if (!user.needFlag && user.myNeedList.length >= 20) {

        user.needFlag = true;
        user.changeCaseAndNeed({ postType: 4, type: '', currentPage });
        _throttle(user.getMyCase(), 3000);
      }
    }
  };

  // 选中样式
  toggleSelectClass(portalPostGuid) {
    let { selectedIdArr } = this.state;
    let num: Number = null;
    num = selectedIdArr.find((v) => {
      return v === portalPostGuid;
    });
    return num;
  }

  // 点击选中取消
  toggleSelected(portalPostGuid) {
    let { selectedAll, selectedIdArr } = this.state;
    const { myNeedList } = this.props.user;
    let num: number = null;
    num = selectedIdArr.findIndex((v) => {
      return v === portalPostGuid;
    });
    if (num >= 0) {
      selectedIdArr.splice(num, 1);
      selectedAll = false;
    } else {
      selectedIdArr.push(portalPostGuid);
      if (selectedIdArr.length === myNeedList.length) {
        selectedAll = true;
      }
    }
    this.setState({
      selectedAll,
      selectedIdArr,
    });
  }

  // 选中全部
  checkAll() {
    let { selectedAll, selectedIdArr } = this.state;
    const { myNeedList } = this.props.user;
    selectedAll = !selectedAll;
    if (selectedAll) {
      myNeedList.map(item => {
        selectedIdArr.push(item.portalPostGuid);
      });
    } else {
      selectedIdArr = [];
    }
    this.setState({
      selectedIdArr: _uniqWith(selectedIdArr, _isEqual),
      selectedAll
    });
  }

  // 全选删除
  deleteAllFun() {
    let { selectedIdArr } = this.state;
    if (_isEmpty(selectedIdArr)) {
      message.warning("您还没有选择IP需求");
    } else {
      this.setState({
        alertShow: true,
        alertMessage: '确定要删除此IP需求吗？',
        portalPostGuid: selectedIdArr.join(','),
      });
    }
  }

  async deleteCaseFun() {
    const { user, login } = this.props;
    const { currentPage, portalPostGuid } = this.state;
    const { userGuid } = login.userInfo;
    const params = {
      userGuid,
      portalPostGuids: portalPostGuid,
    };
    const { errorCode, result }: any = await deleteMyCase(params);
    if (errorCode === '200' && result.errorCode === 200) {
      message.success("删除成功");
      const params = {
        userGuid,
        currentPage,
        type: '',
        postType: 4,
      };
      user.changeCaseAndNeed(params);
      await user.getMyCase();
    }
  }

  render() {
    const { isShow, alertShow, alertMessage } = this.state;
    const { user, realStatus } = this.props;
    const { myNeedList } = user;
    return (
      <div className='case-right'>
        <div className='case-top'>
          <div className='top-left'>发布的IP需求</div>
          {
            realStatus === 1 ?
              <Link to="/ip-needs">
                <div className='top-right'>
                  <img src={Add} alt=''/>添加IP需求
                </div>
              </Link>
              :
              <a onClick={() => {
                this.setState({
                  isShow: true,
                  message: "您还未认证，请先认证"
                });
              }}
              >
                <div className='top-right'>
                  <img src={Add} alt=''/>添加IP需求
                </div>
              </a>
          }
        </div>
        <ul className='case-change'>
          <li>
            <input type="text" placeholder="请输入标题" className="u-input"
                   onChange={(e) => {
                     user.changeCaseAndNeed({ postTitle: e.target.value, currentPage: 1 });
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
              placeholder="请选择状态"
              optionFilterProp="children"
              onChange={(value: string) => {
                this.setState({
                  selectedIdArr: [],
                  selectedAll: false
                });

                user.changeCaseAndNeed({ postStatus: value, currentPage: 1 });
              }}
            >
              <option value="">全部</option>
              <option value="10">已发布</option>
              <option value="20">审核中</option>
              <option value="30">未通过审核</option>
            </Select>
            <div className="u-search">
              <i className="icon iconfont icon-search"
                 onClick={async () => {
                   await user.getMyCase();
                 }}/>
            </div>
          </li>
        </ul>
        {
          !_isEmpty(myNeedList) ?
            <div className='case-list'>
              {/*批量删除*/}
              <div className="checked-button">
                <div className="checkbox-text checkbox-text-large"
                     onClick={() => this.deleteAllFun()}>批量删除
                </div>
              </div>
              <table className='table'>
                <thead className='text-center'>
                <tr>
                  <td className={this.state.selectedAll ? "th-selected td-45" : "td-45"}
                      onClick={() => {
                        this.checkAll();
                      }}>
                    <div className="custom-checkbox"/>
                  </td>
                  <td>标题</td>
                  <td>状态</td>
                  <td>发布日期</td>
                  <td className="td-120">备注</td>
                  <td className="td-100">操作</td>
                </tr>
                </thead>
                {
                  myNeedList && myNeedList.map((item, index) => {
                    return (
                      <tbody key={index}>
                      <tr>
                        <td
                          className={(this.toggleSelectClass(item.portalPostGuid) === item.portalPostGuid || this.state.selectedAll) ? "td-selected td-45" : "td-45"}
                          onClick={() => {
                            this.toggleSelected(item.portalPostGuid);
                          }}>
                          <div className="custom-checkbox"/>
                        </td>
                        <td>{item.postTitle}</td>
                        <td>
                          {item.postStatus === 10 && <div className="">已发布</div>}
                          {item.postStatus === 20 && <div className="">审核中</div>}
                          {item.postStatus === 30 && <div className="">审核失败</div>}
                          {item.postStatus === 40 && <div className="">已删除</div>}
                        </td>
                        <td>{moment(item.createDate).format('YYYY-MM-DD')}</td>
                        <td className="td-120">{item.remark}</td>
                        <td className={item.postStatus === 20 ? 'ing td-100' : 'operate td-100'}>
                          {
                            item.postStatus === 20 ? '' :
                              <Link to={`/ip-needs/${item.portalPostGuid}`}
                                    className='case-edit'>
                                编辑
                              </Link>
                          }
                          <a className='case-delete'
                             onClick={async () => {
                               this.setState({
                                 alertShow: true,
                                 alertMessage: '确定要删除此IP需求吗？',
                                 portalPostGuid: item.portalPostGuid,
                               });

                             }}>删除</a>
                        </td>
                      </tr>
                      </tbody>
                    );
                  })
                }
              </table>
            </div>
            :
            <NoResult/>
        }
        {
          isShow && <Alert message={this.state.message}
                           onClose={() => {
                             this.setState({ isShow: false });
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
                 await this.deleteCaseFun();
               }}
        />
        }
      </div>
    );
  }
}
