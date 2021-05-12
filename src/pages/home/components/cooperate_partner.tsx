import * as React from "react";
import { Swipe } from "@pages/home/components";
import _chunk from "lodash/chunk";
import _isArray from "lodash/isArray";

interface ICooperatePartnerProps {
  data: any;
}

export default class CooperatePartner extends React.Component<ICooperatePartnerProps> {
  render() {
    const { data: tmp } = this.props;
    let options: object = { effect: "slide", pagination: null, loop: false, autoplay: false };
    let sublist: any[] = [];
    if (_isArray(tmp)) {
      sublist = _chunk(tmp, 4);
      if (sublist.length > 1) {
        options = { effect: "slide", loop: true, autoplay: false, pagination: null };
      }
    }
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        <span className="span-title">合作伙伴</span>
        {/*    <Swipe name="swipe-banner" options={{ ...options }}>
          {
            sublist && sublist.map((arr: any, index: number) => (
              <div key={index} className="swiper-slide flex-row justify-content-around swipe-slide-area">
                {arr && arr.map((item: any, idx: number) => (
                  <div key={idx} className="swipe-slide-custom flex-column ">
                    <img className="swipe-item-img" src={item.dataPicUrl} alt=""/>
                  </div>
                ))}
              </div>
            ))
          }
        </Swipe>*/}
        <div className="swipe-banner" >
        {
          sublist && sublist.map((arr: any, index: number) => (
            <div key={index} className=" flex-row justify-content-between swipe-slide-area">
              {arr && arr.map((item: any, idx: number) => (
                <div key={idx} className="swipe-slide-custom flex-column ">
                  <img className="swipe-item-img" src={item.dataPicUrl} alt=""/>
                </div>
              ))}
            </div>
          ))
        }
      </div>
      </div>
    );
  }
}
