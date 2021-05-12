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
import diyShow from '@utils/util';

const { Option } = Select;

interface ICaseProps extends IComponentProps {
  history?: any;
  realStatus?: number;
}

interface IPubCase {
  currentPage: number,
  message: string;
  isShow: boolean;
  alertShow: boolean;
  alertMessage: string;
  portalPostGuid: string;
  selectedAll: boolean;
  selectedIdArr: any,
}

@inject('user', 'login')
@observer
export default class PubCase extends React.Component <ICaseProps, IPubCase> {
  constructor(props) {
    super(props);
    this.state = {
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
    const { user, login } = this.props;
    const { userGuid } = login.userInfo;
    const params = {
      userGuid,
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
      if (!user.caseFlag && user.myCaseList.length >= 20) {

        this.props.user.caseFlag = true;
        user.changeCaseAndNeed({ currentPage });
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
    const { myCaseList } = this.props.user;
    let num: number = null;
    num = selectedIdArr.findIndex((v) => {
      return v === portalPostGuid;
    });
    if (num >= 0) {
      selectedIdArr.splice(num, 1);
      selectedAll = false;
    } else {
      selectedIdArr.push(portalPostGuid);
      if (selectedIdArr.length === myCaseList.length) {
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
    const { myCaseList } = this.props.user;
    selectedAll = !selectedAll;
    if (selectedAll) {
      myCaseList.map(item => {
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
      message.warning("您还没有选择案例");
    } else {
      this.setState({
        alertShow: true,
        alertMessage: '确定要删除此案例吗？',
        portalPostGuid: selectedIdArr.join(','),
      });
    }
  }

  async deleteCaseFun() {
    const { user, login } = this.props;
    const { portalPostGuid } = this.state;
    const { userGuid } = login.userInfo;
    const params = {
      userGuid,
      portalPostGuids: portalPostGuid
    };
    const { errorCode, result }: any = await deleteMyCase(params);
    if (errorCode === '200' && result.errorCode === 200) {
      message.success("删除成功");
      const params = {
        userGuid,
        currentPage: 1,
      };
      user.changeCaseAndNeed(params);
      await user.getMyCase();
    }
  }

  render() {
    const { isShow, alertShow, alertMessage } = this.state;
    const { user, realStatus } = this.props;
    const { myCaseList } = user;
    return (
      <div className='case-right'>
        <div className='case-top'>
          <div className='top-left'>发布的案例</div>
          {
            realStatus === 1 ?
              <Link to="/add-case">
                <div className='top-right'>
                  <img src={Add} alt=''/>添加案例
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
                  <img src={Add} alt=''/>添加案例
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
              placeholder="请选择类型"
              optionFilterProp="children"
              onChange={(value) => {
                user.changeCaseAndNeed({ type: value, currentPage: 1 });
              }}
            >
              {
                diyShow.IndustryKV && diyShow.IndustryKV.map((item, index) => {
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
          !_isEmpty(myCaseList) ?
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
                  <td className="td-90">类型</td>
                  <td className="td-90">状态</td>
                  <td className="td-105">发布日期</td>
                  <td className="td-120">备注</td>
                  <td className="td-100">操作</td>
                </tr>
                </thead>
                {
                  myCaseList && myCaseList.map((item, index) => {
                    return (
                      <tbody key={index}>
                      <tr>
                        <td
                          className={(this.toggleSelectClass(item.portalPostGuid) === item.portalPostGuid || this.state.selectedAll) ? "td-45 td-selected" : "td-45"}
                          onClick={() => {
                            this.toggleSelected(item.portalPostGuid);
                          }}>
                          <div className="custom-checkbox"/>
                        </td>
                        <td>{item.postTitle}</td>
                        <td className="td-90">
                          {item.postType === 1 && "行业案例"}
                          {item.postType === 2 && "行业动态"}
                          {item.postType === 3 && "人物动态"}
                          {item.postType === 5 && "行业趋势"}
                        </td>
                        <td className="td-90">
                          {item.postStatus === 10 && <div className="">已发布</div>}
                          {item.postStatus === 20 && <div className="">审核中</div>}
                          {item.postStatus === 30 && <div className="">审核失败</div>}
                          {item.postStatus === 40 && <div className="">已删除</div>}
                        </td>
                        <td className="td-105">
                          {item.createDate ? moment(item.createDate).format('YYYY-MM-DD') : ''}
                        </td>
                        <td className="td-120">{item.remark}</td>
                        <td className={item.postStatus === 20 ? 'ing td-100' : 'operate td-100'}>
                          {
                            item.postStatus === 20 ? '' :
                              <Link to={`/add-case/${item.portalPostGuid}`}
                                    className='case-edit'>
                                编辑
                              </Link>
                          }
                          <a className='case-delete'
                             onClick={async () => {
                               this.setState({
                                 alertShow: true,
                                 alertMessage: '确定要删除此案例吗？',
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
          isShow &&
          <Alert message={this.state.message}
                 onClose={() => {
                   this.setState({ isShow: false });
                 }}
                 onSubmit={() => {
                   this.props.history.push('/user/2');
                 }}
          />
        }
        {
          alertShow &&
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
