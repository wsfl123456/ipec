import * as React from "react";

import { Link } from "react-router-dom";
import { Swipe } from "@pages/home/components";
import _chunk from "lodash/chunk";
import _isArray from "lodash/isArray";
import default_img from "@assets/images/default/ic_default_shu.png";

interface ICooperateIpProps {
  data: any;
}

export default class CooperateIp extends React.Component<ICooperateIpProps> {
  render() {
    // const { data: { sublist: tmp } } = this.props;
    const { data: tmp } = this.props;
    let options: object = { effect: "slide", pagination: null, loop: false, autoplay: false };
    let sublist: any[] = [];
    if (_isArray(tmp)) {
      sublist = _chunk(tmp, 4);
      if (sublist.length > 1) {
        options = { effect: "slide", loop: true, pagination: null, autoplay: false };
      }
    }
    return (
      <div className="content-container flex-column justify-content-center align-items-center special-container">
        <span className="span-title">热门IP推荐</span>
        <Swipe options={{ ...options }}>
          {
            sublist && sublist.map((arr: any, index: number) => (
              <div key={index}
                   className="swiper-slide flex-row justify-content-between swipe-slide-area special-slide-area">
                {arr && arr.map((item: any, idx: number) => (
                  <Link to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`} key={idx}
                        onClick={() => {
                          ga('set', 'page', `/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`);
                          ga('send', 'pageview');
                        }}
                        target="_blank"
                        className="special-slide-custom">
                    <div className="swipe-slide-custom flex-column">
                      <img src={item.dataPicUrl || default_img} alt=""/>
                      <div className="cooperate-ip-last-line justify-content-between align-items-center">
                        <span className="cooperate-ip-text">{item.dataName}</span>
                        {
                          item.dataType &&
                          <i>{item.dataType}</i>
                        }
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))
          }
        </Swipe>
      </div>
    );
  }
}
