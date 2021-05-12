/**
 *  预测数据结果页
 *  author:Balance.xue
 */
import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/calculate_result.scss";
import { Link } from "react-router-dom";
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

interface ICalculateResultProps extends IComponentProps {
  history?: any;
  realStatus?: number;
}

interface ICalculateResultState {
  message: string;
}

let typeName = {
  "5": "电视剧",
  "6": "电影",
  "7": "综艺",
};
@inject('login', 'user', 'calculate_result', 'add_calculate')
@observer
export default class CalculateResult extends React.Component <ICalculateResultProps, ICalculateResultState> {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  async componentDidMount() {
    document.title = "IP356X- 预测数据结果";
    const { login, calculate_result } = this.props;
    const { userGuid } = login.userInfo;
    // await calculate_result.getCalculateResult()
  }

  render() {
    const { user, calculate_result, add_calculate } = this.props;
    const { calculateResult } = calculate_result;
    let title = !_isEmpty(calculateResult) && calculateResult[0].ipName;
    let ipTypeSuperiorNumber = !_isEmpty(calculateResult) && calculateResult[0].ipTypeSuperiorNumber;

    return (
      <div className='calculate-result-right'>
        <div className='g-top'>
          <div className='u-left'>预测数据</div>
        </div>
        <p className="headline text-center">{title}预测结果</p>
        <div className="g-list">
          {
            calculateResult && calculateResult.map((i, k) => {
              return (
                <div className="m-box" key={k}>
                  <div className="m-left">
                    <div className="p-line">
                      <div className="pull-left">预测类型 :</div>
                      <div>{typeName[i.ipTypeSuperiorNumber]}</div>
                    </div>
                    <div className="p-line">
                      <div className="pull-left"> 导<span className="letter-space">演 :</span></div>
                      <div className="flex-wrap">
                        {
                          i.directorIpids.split(',') && i.directorIpids.split(',').map((item, index) => {
                            let name = (i.director.split(','))[index];

                            if (Number(item) > 0) {
                              return <Link to={`/detail/8/${item}`}
                                           key={index}>{name}<i>,</i></Link>;
                            } else {
                              return <a className='u-disabled' key={index + '_1'}>{name}<i>,</i></a>;
                            }
                          })
                        }
                      </div>
                    </div>
                    <div className="p-line">
                     <div className="pull-left">编<span className="letter-space">剧 :</span></div>
                      <div className="flex-wrap">
                         {
                           i.scriptwriterIpids.split(',') && i.scriptwriterIpids.split(',').map((item, index) => {
                             let name = (i.scriptwriter.split(','))[index];

                             if (Number(item) > 0) {
                               return <Link to={`/detail/8/${item}`}
                                            key={index}>{name}<i>,</i> </Link>;
                             } else {
                               return <a className="u-disabled" key={index + '_1'}>{name}<i>,</i></a>;
                             }
                           })
                         }
                      </div>
                    </div>
                    <div className="p-line">
                      <div className="pull-left">主<span className="letter-space">演 :</span></div>
                      <div className="flex-wrap">
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
                    </div>
                    <div className="p-line">
                      <div className="pull-left"> 类<span className="letter-space">型 :</span></div>
                      <div>{i.type}</div>
                    </div>
                    <div className="p-line">
                      <div className="pull-left">出品公司 :</div>
                      <div>
                        {i.companyCp ? i.companyCp : "--"}
                      </div>
                    </div>
                    <div className="p-line">
                      <div className="pull-left">宣发公司 :</div>
                      <div>{i.companyXf ? i.companyXf : "--"}</div>
                    </div>
                    <div className="p-line">
                      原<span className="letter-space">著 :</span>
                      <span>{i.original ? i.original : "--"}</span>
                    </div>
                    <div className="p-line">
                      语<span className="letter-space">言 :</span>
                      <span>{i.language ? i.language : "--"}</span>
                    </div>
                    <div className="p-line">
                      <span>国家地区 :</span>
                      <span>{i.country ? i.country : "--"}</span>
                    </div>
                    <div className="p-line">
                      <span>发行时间 :</span>
                      <span>{i.sendingTime ? moment(i.sendingTime).format("YYYY-MM-DD") : ''}</span>
                    </div>
                    {/*电视剧/综艺*/}
                    {
                      Number(i.ipTypeSuperiorNumber) !== 6 &&
                      <div className="p-line">
                        集<span className="letter-space">数 :</span>
                        <span>{i.episodes}</span>
                      </div>
                    }
                    {
                      Number(i.ipTypeSuperiorNumber) !== 6 &&
                      <div className="p-line">
                        <span>单集片长 :</span>
                        <span>{i.singleFilmLength}</span>
                      </div>
                    }
                  </div>

                  {/*电视剧/综艺*/}
                  {
                    Number(i.ipTypeSuperiorNumber) !== 6 ?
                      <div className="m-right text-center ">
                        <div className="box-office">
                          <p>预测评分（万元）</p>
                          <p>{i.scoreResult ? i.scoreResult : "--"}</p>
                        </div>
                      </div>
                      :
                      <div className="m-right text-center ">
                        <div className="film">
                          <p>预测票房（万元）</p>
                          <p>{i.boxOfficeResult ? i.boxOfficeResult : "--"}</p>
                        </div>
                        <div>
                          <p>预测评分（万元）</p>
                          <p>{i.scoreResult ? i.scoreResult : "--"}</p>
                        </div>
                      </div>
                  }
                </div>

              );
            })
          }
          {
            calculateResult &&
            <div className="g-btn">
              <button className="u-confirm-btn"
                      onClick={() => {
                        this.props.history.push(`/add-calculate/${ipTypeSuperiorNumber}`);
                        localStorage.setItem("ipName", title);
                        add_calculate.changeParams({ ipName: title, ipTypeSuperiorNumber });
                      }}
              >继续添加预测
              </button>
              <button className="u-go-back-btn"
                      onClick={() => user.setCalculateStatus(true)}>返回
              </button>
            </div>
          }
        </div>

      </div>
    );
  }
}
