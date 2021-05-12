import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/user_vip_card.scss";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import { Timeline } from "antd";
import moment from 'moment';

@observer
export default class UserVipCardDetail extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {}

  render() {
    const { selectedRecord, selectedCard } = this.props;
    return (
      <div className="user-vip-card-detail">
        <div className="area">
          <div className="title">
            <span>消费详情</span>
            <img
              src={Ic_clear}
              onClick={() => {
                this.props.closeModal();
              }}
              alt=""
            />
          </div>
          <div className="content">
            {!!selectedRecord && !!selectedRecord.length && (
              <Timeline>
                {selectedRecord.map((i, k) => (
                  <Timeline.Item key={k} color="#6236FF">
                    <div className="item">
                      {/* <div className="time">{moment(i.createDate).format('YYYY-MM-DD HH:mm:ss')}</div> */}
                      <div className="time">{i.createDateStr}</div>
                      <div className="desc">
                        <div>{i.consumptionDesc}</div>
                        <div>-{i.price}元</div>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
            {
                (!selectedRecord || !selectedRecord.length) && <div className='no-result'>该卡暂无消费记录</div>
            }
          </div>
          <div className="footer">
            <div>
              已消费金额：
              <span>
                {+selectedCard.actualAmount - +selectedCard.cardBalance}元
              </span>
            </div>
            <div>
              卡内剩余金额：<span>{selectedCard.cardBalance}元</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
