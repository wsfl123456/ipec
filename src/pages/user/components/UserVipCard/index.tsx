import * as React from "react";
import { observer, inject } from "mobx-react";
import CardBanner from "@assets/images/vip-card/card-banner.png";
import "@assets/scss/user_vip_card.scss";
import NosesultBanner from "@assets/images/vip-card/noresult-card-banner.png";
import { Link } from "react-router-dom";
import UserVipCardDetail from "./components/detail";
import Toast from "@components/toast";

interface IState {
  showModal: boolean;
  showToast: boolean;
  toastMsg: string;
}
@inject("user_vip_card", "login")
@observer
export default class UserVipCard extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      showToast: false,
      toastMsg: "",
    };
  }

  async componentDidMount() {
    const { user_vip_card, login } = this.props;
    const { edMyCards } = user_vip_card;
    user_vip_card.changeUserInfo(login.userInfo)
    edMyCards();
  }

  async showModal(card) {
    const { edMyCardsRecord, setSelectedCard } = this.props.user_vip_card;
    await edMyCardsRecord(card.cardNo);
    setSelectedCard(card);
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    const { clearCard } = this.props.user_vip_card;
    clearCard();
    this.setState({
      showModal: false,
    });
  }

  async activationCard(cardNo) {
    const { eqActivationCard, edMyCards } = this.props.user_vip_card;
    const { errorMsg, errorCode } = await eqActivationCard(cardNo);
    this.setState({
      showToast: true,
      toastMsg: errorMsg,
    });
    if (+errorCode === 200) {
      await edMyCards();
    }
  }

  render() {
    const { user_vip_card } = this.props;
    const { myCardsList, selectedRecord, selectedCard } = user_vip_card;
    const { showModal } = this.state;
    return (
      <div className="vip-card user-vip-card">
        <Link to="/vip-card-buy">
          <img className="banner" src={CardBanner} alt="" />
        </Link>
        <div className="content">
          <div className="title">我的会员卡</div>
          {!!myCardsList && !!myCardsList.length && (
            <div className="list">
              {myCardsList.map((i, k) => (
                <div className="item" key={k}>
                  <img
                    src={i.cardPic}
                    className={
                      (+i.status === 2 || +i.status === 3) ? "expired" : ''
                    }
                    alt=""
                  />
                  <div className="name">{i.cardName}</div>
                  <div className="code">
                    <div>卡号：{i.cardNo}</div>
                    {(() => {
                      switch (+i.status) {
                        case 0:
                          return <div className="red">未激活</div>;
                        case 1:
                          return <div>已激活</div>;
                        case 2:
                          return <div>已失效</div>;
                        case 3:
                          return <div>已过期</div>;
                        default:
                          break;
                      }
                    })()}
                  </div>
                  <div className="rest">
                    {(() => {
                      switch (+i.status) {
                        case 0:
                          return (
                            <React.Fragment>
                              <div>
                                卡内剩余金额：<span>¥{i.cardBalance}</span>
                              </div>
                            </React.Fragment>
                          );
                        case 1:
                          return (
                            <React.Fragment>
                              <div>
                                已消费：¥{i.actualAmount - i.cardBalance}
                              </div>
                              <div>
                                卡内剩余金额：<span>¥{i.cardBalance}</span>
                              </div>
                            </React.Fragment>
                          );
                        case 2:
                          return (
                            <React.Fragment>
                              <span>
                                <i className="icon">!</i>卡内金额已消费完
                              </span>
                            </React.Fragment>
                          );
                        case 3:
                          return (
                            <React.Fragment>
                              <span>
                                <i className="icon">!</i>卡已过期
                              </span>
                            </React.Fragment>
                          );
                        default:
                          break;
                      }
                    })()}
                  </div>
                  {!!(+i.status === 0) && (
                    <div
                      className="btn_default_fl"
                      onClick={() => {
                        this.activationCard(i.cardNo);
                      }}
                    >
                      激活该卡
                    </div>
                  )}
                  {!(+i.status === 0) && (
                    <div
                      className="btn_default_fl"
                      onClick={() => {
                        this.showModal(i);
                      }}
                    >
                      消费详情
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {(!myCardsList || !myCardsList.length) && (
            <div className="no-result">
              <img src={NosesultBanner} alt="" />
              <div>很抱歉，您暂未购买VIP数据权限储值卡</div>
            </div>
          )}
        </div>
        {showModal && (
          <UserVipCardDetail
            selectedCard={selectedCard}
            selectedRecord={selectedRecord}
            closeModal={() => {
              this.closeModal();
            }}
          />
        )}
        {this.state.showToast && (
          <Toast
            onClose={() => {
              this.setState({ showToast: false });
            }}
            duration={2}
            message={this.state.toastMsg}
          />
        )}
      </div>
    );
  }
}
