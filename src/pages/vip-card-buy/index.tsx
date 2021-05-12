import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/vip_card_buy.scss";
import { Link } from "react-router-dom";
import Banner from "../../assets/images/vip-card/banner.png";
import {
  getEmailLogo
} from "@utils/api";
@inject("vip_card_buy")
@observer
export default class VipCardBuy extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    const { vip_card_buy, location: { search } } = this.props;
    vip_card_buy.getCommodityList();
    if (search.indexOf('type=') !== -1) {
      console.log(search.split('type=')[1]);
      await getEmailLogo({type: search.split('type=')[1]})
    }
  }

  render() {
    const { commodityList } = this.props.vip_card_buy;
    return (
      <div className="vip-card-buy">
        <img className="banner" src={Banner} alt="" />
        <div className="list">
          {commodityList.map((i, k) => (
            <div className="item" key={k}>
              <img src={i.cardPic} alt="" />
              <div className="name">{i.cardName}</div>
              <div className="operate">
                <div className="price">
                  <span>
                    ¥ <span className="count">{i.paymentAmount}</span>
                  </span>

                  {!!i.discount && <span>折后价 </span>}
                </div>
                <button>
                  <Link to={`/vip-card-buy-detail/${i.cardGuid}`}>
                    立即购买
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
