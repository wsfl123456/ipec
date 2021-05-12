import * as React from 'react';
import 'assets/scss/satisfaction_survey.scss';
import ic_header from '@assets/images/satisfaction/ic_header.png';
import Rate from 'rc-rate';
import 'assets/scss/rc_rate.scss';
import { eqSatisfactionSurvey } from '@utils/api';
import { message } from 'antd';
import { inject, observer } from 'mobx-react';
import Alert from '@components/alert';

interface ISatisfactionProps extends IComponentProps {
  onClose: Function,
}

interface ISatisfactionState {
  message: string;
  isShow: boolean;
  rating: number;
  overallScore: number, // 网站整体满意度
  speedScore: number, // 网站打开速度
  customerServiceScore: number, // 客服响应速度
  informationUtilityScore: number, // 网站实用性
  informationTimelinessScore: number, // 网站信息及时性
  remark: string,
}

@inject('login')
@observer
export default class SatisfactionSurvey extends React.Component<ISatisfactionProps, ISatisfactionState> {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      rating: 0,
      overallScore: 0,
      speedScore: 0,
      customerServiceScore: 0,
      informationTimelinessScore: 0,
      informationUtilityScore: 0,
      remark: ''
    };
  }

  submitFun = async () => {
    const { onClose, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    const {
      overallScore,
      speedScore,
      customerServiceScore,
      informationTimelinessScore,
      informationUtilityScore,
      remark,
    } = this.state;
    if (!userGuid) {
      // this.setState({
      //   isShow: true,
      //   message: "您还未登陆请先登陆后进行操作"
      // });
      message.warning("您还未登陆请先登陆后进行操作");
      return false;
    }
    if (overallScore === 0) {
      // this.setState({
      //   isShow:true,
      //   message: "您还未登陆请先登陆后进行操作"
      // });
      message.warning("请您为网站整体满意度打分");
      return false;
    }
    const { errorCode, result }: any = await eqSatisfactionSurvey({
      overallScore: overallScore * 2,
      speedScore: speedScore * 2,
      customerServiceScore: customerServiceScore * 2,
      informationTimelinessScore: informationTimelinessScore * 2,
      informationUtilityScore: informationUtilityScore * 2,
      remark,
      userGuid: login.userInfo.userGuid,
    });
    if (errorCode === '200') {
      message.success("提交成功！");
      console.log(result);
      onClose();
    }
  };

  render() {
    const { onClose } = this.props;
    const {
      overallScore,
      speedScore,
      customerServiceScore,
      informationTimelinessScore,
      informationUtilityScore,
      remark,

    } = this.state;
    return (
      <div className="satisfaction_model"
           onClick={() => {
             onClose();
           }}>
        {/* {
          this.state.isShow &&
          <Alert message={this.state.message} onClose={() => {
            this.setState({
              isShow: false
            });
          }}/>
        }*/}
        <div className="s_box" onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}>
          <div className="m-header">
            <img src={ic_header} alt=""/>
          </div>
          <div className="m-body">
            <p className="u-title"><span>*</span>网站整体满意度</p>
            <div className="five-star">
              <Rate
                defaultValue={0}
                value={overallScore}
                onChange={(v) => {
                  this.setState({
                    overallScore: v
                  });
                }}
                style={{ fontSize: 24.5, margin: '0 auto' }}
                allowHalf
                character={<i className="anticon anticon-star"/>}
              />
            </div>
            <div className="g-single">
              <div className="single">
                <p>网站打开速度</p>
                <Rate
                  value={speedScore}
                  onChange={(v) => {
                    this.setState({
                      speedScore: v
                    });
                  }}
                  style={{ fontSize: 17.5, margin: '0 auto' }}
                  allowHalf
                  character={<i className="anticon anticon-star"/>}
                />
              </div>
              <div className="single">
                <p>客服响应速度</p>
                <Rate
                  value={customerServiceScore}
                  onChange={(v) => {
                    this.setState({
                      customerServiceScore: v
                    });
                  }}
                  style={{ fontSize: 17.5, margin: '0 auto' }}
                  allowHalf
                  character={<i className="anticon anticon-star"/>}
                />
              </div>
              <div className="single">
                <p>网站信息实用性</p>
                <Rate
                  value={informationUtilityScore}
                  onChange={(v) => {
                    this.setState({
                      informationUtilityScore: v
                    });
                  }}
                  style={{ fontSize: 17.5, margin: '0 auto' }}
                  allowHalf
                  character={<i className="anticon anticon-star"/>}
                />
              </div>
              <div className="single">
                <p>网站信息及时性</p>
                <Rate
                  value={informationTimelinessScore}
                  onChange={(v) => {
                    this.setState({
                      informationTimelinessScore: v
                    });
                  }}
                  style={{ fontSize: 17.5, margin: '0 auto' }}
                  allowHalf
                  character={<i className="anticon anticon-star"/>}
                />
              </div>
              <div className="single single-textarea">
                <textarea placeholder="您是否还有其他建议或意见"
                          value={remark}
                          maxLength={255}
                          onChange={(e) => {
                            this.setState({
                              remark: e.target.value
                            });
                          }}/>
              </div>
            </div>
          </div>
          <div className="m-footer text-center">
            <button className='btn'
                    onClick={() => {
                      this.setState({
                        overallScore: 0,
                        speedScore: 0,
                        customerServiceScore: 0,
                        informationTimelinessScore: 0,
                        informationUtilityScore: 0,
                        remark: ''
                      });
                    }}
            >
              重置
            </button>
            <button className='btn btn-submit'
                    onClick={async () => {
                      await this.submitFun();
                    }}
            >
              确定
            </button>
          </div>
        </div>
      </div>
    );
  }
}
