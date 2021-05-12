/**
 *  预测数据(后改名IP筛选器）
 *  author:Blance.xue
 */
import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/forecast_data.scss";
import Add from '@assets/images/add.svg';
import { Link } from "react-router-dom";
import Alert from '@components/alert';
import NoResult from "@components/no_result";
import { Pagination, message } from 'antd';
import Select from 'antd/lib/select';
import _isObject from 'lodash/isObject';
import _isEmpty from 'lodash/isEmpty';
import { _throttle, sendUserBehavior, thousandSeparator } from '@utils/util';

const { Option } = Select;

interface IForecastProps extends IComponentProps {
  history?: any;
  realStatus?: number;
}

interface IForecastState {
  message: string;
  isShow: boolean;
  alertShow: boolean;
  alertMessage: string;
  deleteId: string;
  index: number,
  currentPage: number;
}

@inject('login', 'forecast_list', 'filter_forecast')
@observer
export default class ForecastData extends React.Component <IForecastProps, IForecastState> {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      alertShow: false,
      alertMessage: '',
      deleteId: '',
      index: 0,
      currentPage: 1,
    };
  }

  async componentDidMount() {
    document.title = "IP356X- IP筛选器";
    const { login, forecast_list } = this.props;
    const { userGuid } = login.userInfo;
    forecast_list.changeParams({
      clientName: '',
      userGuid,
      projectName: '',
      demandPurpose: '',
      currentPage: 1,
    });
    await forecast_list.getForecastData();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { login, forecast_list } = this.props;
    const { userGuid } = login.userInfo;
    const { forecastList, isLoading } = forecast_list;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      let currentPage = this.state.currentPage + 1;

      if (!isLoading && forecastList.length >= 20) {
        forecast_list.setLoading(true);
        this.setState({ currentPage });
        forecast_list.changeParams({
          clientName: '',
          userGuid,
          projectName: '',
          demandPurpose: '',
          currentPage,
        });
        _throttle(forecast_list.getForecastData(), 3000);
      }
    }
  };

  async deleteFun() {
    const { forecast_list } = this.props;
    const { isSuccess }: any = await forecast_list.deleteForecast(this.state.deleteId);

    if (_isObject(isSuccess) && isSuccess['show']) {
      // message.error(isSuccess['msg']);
    } else {
      // message.success(isSuccess['msg']);
      forecast_list.forecastList.splice(this.state.index, 1);
    }
    await forecast_list.getForecastData({ currentPage: 1 });
  }

  render() {
    const { isShow, alertShow, alertMessage } = this.state;
    const { forecast_list, filter_forecast, realStatus } = this.props;
    const { forecastList } = forecast_list;
    return (
      <div className='forecast-right'>
        <div className='g-top'>
          <div className='u-left'>IP筛选器</div>
          {
            realStatus === 1 ?
              <Link to="/add-forecast">
                <div className='u-right'>
                  <img src={Add} alt=''/>新设项目需求
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
                <div className='u-right'>
                  <img src={Add} alt=''/>添加新需求
                </div>
              </a>
          }
        </div>
        <ul className='g-change'>
          <li>
            <input type="text" placeholder="请输入客户名称" className="u-input"
                   onChange={(e) => {
                     forecast_list.changeParams({ clientName: e.target.value, currentPage: 1 });
                   }}
            />
          </li>
          <li>
            <input type="text" placeholder="请输入项目名称" className="u-input"
                   onChange={(e) => {
                     forecast_list.changeParams({ projectName: e.target.value, currentPage: 1 });
                   }}
            />
          </li>
          <li>
            <Select
              style={{
                width: 255,
                display: "inline-block",
                height: 48,
                verticalAlign: "top",
                borderRadius: "4px 4px 0 0 ",
              }}
              placeholder="请选择需求目的"
              optionFilterProp="children"
              onChange={(value) => {
                forecast_list.changeParams({ demandPurpose: value, currentPage: 1 });
              }}
            >
              <Option value="1">品牌上市</Option>
              <Option value="2">新品上市</Option>
              <Option value="3">旧品促销</Option>
            </Select>
            <div className="u-search">
              <i className="icon iconfont icon-search"
                 onClick={async () => {
                   forecast_list.changeParams();
                   await forecast_list.getForecastData();
                 }}/>
            </div>
          </li>
        </ul>
        {
          <div className='g-list'>
            {!_isEmpty(forecastList) &&
            <table className='table'>
              <thead className="text-center">
              <tr>
                <td>序号</td>
                <td>客户名称</td>
                <td>项目名称</td>
                <td>项目背景</td>
                <td className="td-100">项目目的</td>
                <td>项目预算</td>
                <td className="text-center td-190">操作</td>
              </tr>
              </thead>
              <tbody>
              {
                forecastList && forecastList.map((i, k) => {
                  return (
                    <tr key={k}>
                      <td>{k + 1}</td>
                      <td>{i.clientName}</td>
                      <td>{i.projectName}</td>
                      <td className="word-ellipsis" title={i.projectBackground}>
                        {i.projectBackground ? i.projectBackground : '-- '}
                      </td>
                      <td className="td-100">
                        {i.demandPurpose === 1 && '品牌上市'}
                        {i.demandPurpose === 2 && '新品上市'}
                        {i.demandPurpose === 3 && '旧品促销'}
                      </td>
                      <td className='text-right'>
                        {
                          !_isEmpty(i.projectBudget) ?
                            (isNaN(i.projectBudget) ? i.projectBudget : thousandSeparator(i.projectBudget))
                            : '--'
                        }
                      </td>
                      <td className='text-center td-300'>
                        <a
                          className='edit' onClick={async () => {
                          // filter_forecast.changeParams({ clientDemandGuid: i.clientDemandGuid });

                          filter_forecast.selected = "卡通动漫";
                          filter_forecast.clearIpData();
                          filter_forecast.changeSelectedChild({
                            nav: '',
                          });
                          await sendUserBehavior({
                            pageName: `${i.clientName}-${i.projectName}`,
                            pageUrl: `/filter-forecast/${i.clientDemandGuid}`,
                            type: 9,
                            remark: ''
                          });
                          this.props.history.push(`/filter-forecast/${i.clientDemandGuid}`);
                        }}>
                          查看
                        </a>
                        <a className='edit' onClick={() => {
                          this.props.history.push(`/add-forecast/${i.clientDemandGuid}`);
                        }}>
                          项目需求单
                        </a>
                        <a className='delete'
                           onClick={async () => {
                             this.setState({
                               alertShow: true,
                               alertMessage: '确定要删除此数据吗？',
                               deleteId: i.id,
                               index: k,
                             });
                           }}>删除</a>
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
            }
            {/*  <Pagination
              simple
              className='page'
              hideOnSinglePage={true}
              current={this.state.testNum}
              total={this.props.user.total}
              onChange={async (page, pageSize) => {
                const { user } = this.props;
                const { postStatus } = this.state;
                const currentPage = page;
                const { userGuid } = JSON.parse(localStorage.getItem('user'));
                const params = {
                  postStatus,
                  postType: 1,
                  userGuid,
                  currentPage,
                  pageSize
                };
                this.setState({
                  testNum: page
                });
                await user.getMyCase(params);
              }}
            />*/}

            {
              _isEmpty(forecastList) &&
              <NoResult/>
            }
          </div>
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
                 await this.deleteFun();
               }}
        />
        }
      </div>
    );
  }
}
