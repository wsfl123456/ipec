import * as React from "react";
import "@assets/scss/scrollTop.scss";
import houde from "@assets/images/contrast/houd.png";
import backtop from "@assets/images/backtop.png";
import iconKefu2 from "@assets/images/icon-kefu2.png";
import Alert from "@components/alert";
import _isEqual from "lodash/isEqual";
import _uniqWith from "lodash/uniqWith";
import _isEmpty from "lodash/isEmpty";
import SatisfactionSurvey from "@components/satisfaction_survey";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Reminder from "@assets/images/vip-card/reminder.png";
import {
  getIsDeduction
} from '@utils/api';
interface IAvatarProps extends IComponentProps {
  contrast?: boolean;
  history?: any;
}

interface ITimeInputState {
  isShow: any;
  show: boolean;
  useShow: boolean;
  message: string;
  user: any;
  satisfactionState: boolean;
  showDeduction: boolean;
}

export default class Toast extends React.Component<
  IAvatarProps,
  ITimeInputState
> {
  timeId = 0;

  constructor(props: any) {
    super(props);
    this.state = {
      isShow: false,
      show: false,
      useShow: false,
      message: "",
      user: JSON.parse(localStorage.getItem("user")),
      satisfactionState: false,
      showDeduction: false,
    };
  }

  ScrollTop = (number = 0, time) => {
    if (!time) {
      document.body.scrollTop = document.documentElement.scrollTop = number;
      return number;
    }
    const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
    let spacingIndex = time / spacingTime; // 计算循环的次数
    let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
    let everTop = (number - nowTop) / spacingIndex; // 计算每次滑动的距离
    let scrollTimer = setInterval(() => {
      if (spacingIndex > 0) {
        spacingIndex--;
        this.ScrollTop((nowTop += everTop), null);
      } else {
        clearInterval(scrollTimer); // 清除计时器
      }
    }, spacingTime);
  };

  sureDeduction() {
    const { filter_forecast } = this.props;
    let { ipidArr } = filter_forecast;
    let ipids = escape(ipidArr.join(","));
    // 埋点

    filter_forecast.selected = "卡通动漫";
    filter_forecast.clearIpData();
    filter_forecast.selectedChild = {
      nav: "",
      nav_number: "",
    };
    this.props.history.push(`/new-forecast-detail/${ipids}`);
  }

  render() {
    const { contrast, deletContast } = this.props;
    const { isShow, show, message, user, useShow } = this.state;
    let contrastAuthority: boolean = false;
    const authorityArr = [",3,", ",6,"];

    if (!_isEmpty(user)) {
      contrastAuthority = authorityArr.some(
        (e: string) => user.userJurisdiction.indexOf(e) !== -1
      );
    }
    let data = JSON.parse(localStorage.getItem("contastList"));
    return (
      <ul className="industry_ul">
        {show && (
          <Alert
            message={message}
            onClose={() => {
              this.setState({ show: false });
            }}
            onSubmit={() => {}}
          />
        )}
        {useShow && (
          <Alert
            message={message}
            onClose={() => {
              this.setState({ useShow: false });
            }}
            buttonValue={"去升级"}
            onSubmit={() => {
              this.props.history.push("/user/12");
            }}
          />
        )}
        {this.state.showDeduction && (
          <div className="show-deduction">
            <div className="area">
              <div className="clear">
                <img
                  src={Ic_clear}
                  onClick={() => {
                    this.setState({ showDeduction: false });
                    localStorage.removeItem("curIndex");
                  }}
                  alt=""
                />
              </div>
              <div className="content">
                <img src={Reminder} alt="" />
                <div className="msg">扣费提醒</div>
                <div className="tip">
                  该数据属于会员权限数据，本次查看将从您的vip储值卡中扣除150元
                  是否继续查看？
                </div>
              </div>
              <div className="btn-group">
                <div
                  className="btn_default_fl"
                  onClick={() => {
                    this.setState({ showDeduction: false });
                    localStorage.removeItem("curIndex");
                  }}
                >
                  取消
                </div>
                <div
                  className="btn_primary_fl"
                  onClick={() => {
                    this.props.history.push("/contrast");
                  }}
                >
                  确认查看
                </div>
              </div>
            </div>
          </div>
        )}
        {contrast && !isShow ? (
          <li
            className="contrast"
            onClick={() => {
              this.setState({
                isShow: true,
              });
            }}
          >
            已 添 加 对 比
            <img src={houde} alt="" />
          </li>
        ) : contrast ? (
          <div className="contrastBox">
            <div
              className="left"
              onClick={() => {
                this.setState({
                  isShow: false,
                });
              }}
            >
              已 添 加 对 比
              <img src={houde} alt="" />
            </div>
            <div className="right">
              {contrast &&
                _uniqWith(data, _isEqual).map((element) => {
                  return (
                    <p key={element.ipids}>
                      {element.name}
                      <span
                        className="icon iconfont icon_delete"
                        onClick={() => {
                          deletContast(element.ipids);
                        }}
                      />
                    </p>
                  );
                })}

              {contrast && data && (
                // user &&contrastAuthority &&
                <button
                  className="see"
                  onClick={async () => {
                    if (_uniqWith(data, _isEqual).length >= 2) {
                      const userInfo = JSON.parse(localStorage.getItem('user'));
                      const ipids = data.map(i => i.ipids).join(',');
                      const { result: { errorCode, errorMsg, data: retData } }: any = await getIsDeduction({type: '3', ipids, userGuid: userInfo && userInfo.userGuid});
                      switch (retData) {
                        case 0:
                        case 1:
                          this.props.history.push("/contrast")
                          break;
                        case 2:
                          this.setState({showDeduction: true});
                          break;
                        default:
                        break;
                      }
                    } else {
                      this.setState({
                        show: true,
                        message: "需要至少两个对比IP",
                      });
                    }
                  }}
                >
                  查看对比
                </button>
              )}
              {/* {
                    !contrastAuthority &&
                    <button className="see" onClick={() => {
                      this.setState({
                        useShow: true,
                        message: '该数据仅为钻石VIP会员用户可见，如需查看请先升级会员'
                      });

                    }}>
                      查看对比
                    </button>
                  }*/}
            </div>
          </div>
        ) : (
          ""
        )}
        <li
          className="satisfaction_survey"
          onClick={() => {
            this.setState({ satisfactionState: true });
          }}
        >
          满意度调查
        </li>
        {this.state.satisfactionState && (
          <SatisfactionSurvey
            onClose={() => {
              this.setState({ satisfactionState: false });
            }}
          />
        )}

        <li
          className="top_iconlist"
          onClick={() => {
            this.ScrollTop(0, 200);
          }}
        >
          <i>
            <img src={backtop} alt="" />
          </i>
        </li>
        <div className="clearfix" />
      </ul>
    );
  }
}
