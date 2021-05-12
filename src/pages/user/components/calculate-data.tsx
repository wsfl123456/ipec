/**
 *  预测数据
 *  author:Balance.xue
 */
import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/calculate_data.scss";
import Add from '@assets/images/add.svg';
import { Link } from "react-router-dom";
import Alert from '@components/alert';
import NoResult from "@components/no_result";
import { message } from 'antd';
import Select from 'antd/lib/select';
import _isObject from 'lodash/isObject';
import _isEmpty from 'lodash/isEmpty';
import { _throttle } from '@utils/util';

const { Option } = Select;

interface ICalculateProps extends IComponentProps {
  history?: any;
  realStatus?: number;
}

interface ICalculateState {
  message: string;
  isShow: boolean;
  alertShow: boolean;
  alertMessage: string;
  deleteId: string;
  index: number;
  currentPage: number;
}

let typeName = {
  "5": "电视剧",
  "6": "电影",
  "7": "综艺",
};

@inject('login', 'user', 'calculate_list', 'calculate_result')
@observer
export default class CalculateData extends React.Component <ICalculateProps, ICalculateState> {
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
    document.title = "IP356X- 预测数据";
    const { login, calculate_list } = this.props;
    const { userGuid } = login.userInfo;
    calculate_list.changeParams({
      ipName: '',
      userGuid,
      ipTypeSuperiorNumber: '',
      currentPage: 1,
    });
    await calculate_list.getCalculateData();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount(): void {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { login, calculate_list } = this.props;
    const { userGuid } = login.userInfo;
    const { calculateList, isLoading } = calculate_list;
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

      if (!isLoading && calculateList.length >= 20) {

        calculate_list.isLoading = true;
        this.setState({ currentPage });
        calculate_list.changeParams({
          ipName: '',
          userGuid,
          ipTypeSuperiorNumber: '',
          currentPage,
        });
        _throttle(calculate_list.getCalculateData(), 3000);
      }
    }
  };

  // 删除
  async deleteFun() {
    const { calculate_list } = this.props;
    const { isSuccess }: any = await calculate_list.deleteCalculate(this.state.deleteId);

    if (_isObject(isSuccess) && isSuccess['show']) {
      // message.error(isSuccess['msg']);
    } else {
      // message.success(isSuccess['msg']);
      calculate_list.calculateList.splice(this.state.index, 1);
    }
    await calculate_list.getCalculateData({ currentPage: 1 });
  }

  render() {
    const { isShow, alertShow, alertMessage } = this.state;
    const {
      user, login,
      calculate_list,
      calculate_result,
      realStatus
    } = this.props;
    const { calculateList } = calculate_list;
    const { userGuid } = login.userInfo;

    return (
      <div className='calculate-right'>
        <div className='g-top'>
          <div className='u-left'>预测数据</div>
          {
            realStatus === 1 ?
              <Link to="/add-calculate">
                <div className='u-right'>
                  <img src={Add} alt=''/>添加需求
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
                  <img src={Add} alt=''/>添加需求
                </div>
              </a>
          }
        </div>
        <ul className='g-change'>
          <li>
            <input type="text" placeholder="请输入IP名称" className="u-input"
                   onChange={(e) => {
                     calculate_list.changeParams({ ipName: e.target.value, currentPage: 1 });
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
              placeholder="请选择预测品类"
              optionFilterProp="children"
              onChange={(value) => {
                calculate_list.changeParams({ ipTypeSuperiorNumber: value, currentPage: 1 });
              }}
            >
              <Option value="5">电视剧</Option>
              <Option value="6">电影</Option>
              <Option value="7">综艺</Option>
            </Select>
            <div className="u-search">
              <i className="icon iconfont icon-search"
                 onClick={async () => {
                   calculate_list.changeParams();
                   await calculate_list.getCalculateData();
                 }}/>
            </div>
          </li>
        </ul>
        {
          <div className='g-list'>
            {
              !_isEmpty(calculateList) &&
              <table className='table'>
                <thead className='text-center'>
                <tr>
                  <td className='td-54'>序号</td>
                  <td>IP名称</td>
                  <td className='td-60'>预测品类</td>
                  <td>导演</td>
                  <td>编剧</td>
                  <td className="td-190">主演</td>
                  <td className='td-60'>预测票房</td>
                  <td className='td-60'>预测评分</td>
                  <td className="td-55">操作</td>
                </tr>
                </thead>
                <tbody>
                {
                  calculateList && calculateList.map((i, k) => {
                    return (
                      <tr key={k}>
                        <td className='td-54'>{k + 1}</td>
                        <td>{i.ipName}</td>
                        <td className='td-60 text'
                            style={{ padding: "0.05rem 0.06rem" }}>{typeName[i.ipTypeSuperiorNumber]}</td>
                        <td>
                          <div>
                            {
                              i.directorIpids.split(',') && i.directorIpids.split(',').map((item, index) => {
                                let name = (i.director.split(','))[index];
                                if (Number(item) > 0) {
                                  return <Link to={`/detail/8/${item}`}
                                               key={index}>{name}<i>,</i></Link>;
                                } else {
                                  return <a className="u-disabled" key={index + '_1'}>{name}<i>,</i></a>;
                                }
                              })
                            }
                          </div>
                        </td>
                        <td>
                          <div>
                            {
                              i.scriptwriterIpids.split(',') && i.scriptwriterIpids.split(',').map((item, index) => {
                                let name = (i.scriptwriter.split(','))[index];
                                if (Number(item) > 0) {
                                  return <Link to={`/detail/8/${item}`}
                                               key={index}>{name}<i>,</i></Link>;
                                } else {
                                  return <a key={index + '_1'} className="u-disabled">{name}<i>,</i></a>;
                                }
                              })
                            }
                          </div>
                        </td>
                        <td className="td-190">
                          <div>
                            {
                              i.protagonistIpids.split(',') && i.protagonistIpids.split(',').map((item, index) => {
                                let name = (i.protagonist.split(','))[index];
                                if (Number(item) > 0) {
                                  return <Link to={`/detail/8/${item}`}
                                               key={index}>{name}<i>,</i></Link>;
                                } else {
                                  return <a className="u-disabled" key={index + '_1'}>{name}<i>,</i></a>;
                                }
                              })
                            }
                          </div>
                        </td>
                        <td className='td-60'>{_isEmpty(i.boxOfficeResult) ? '--' : i.boxOfficeResult}</td>
                        <td className='td-60'>{_isEmpty(i.scoreResult) ? '--' : i.scoreResult}</td>
                        <td className='text-center td-55'>
                          <a
                            className='edit' onClick={async () => {
                            user.setCalculateStatus(false);
                            await calculate_result.getCalculateResult({ userGuid, predictGuid: i.predictGuid });
                          }}>
                            查看
                          </a>
                          <a className='delete'
                             onClick={async () => {
                               this.setState({
                                 alertShow: true,
                                 alertMessage: '确定要删除此数据吗？',
                                 deleteId: i.predictGuid,
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
            {
              _isEmpty(calculateList) &&
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
