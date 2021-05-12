import * as React from "react";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "@assets/scss/react_swiper.scss";
import { createRef } from "react";
import { inject, observer } from 'mobx-react';
import { message } from 'antd';
import { sendUserBehavior } from '@utils/util';

interface ISwiperProps extends IComponentProps {
  slide?: object[],
  options?: object,
}

@inject('user')
@observer
export default class ReactSwiper extends React.Component<ISwiperProps> {

  currentSwiper: any;
  swipe: any;

  constructor(props: any) {
    super(props);
    this.currentSwiper = null;
    this.swipe = createRef();
  }

  componentDidMount(): void {
    this.updateSwiper();
  }

  componentDidUpdate(prevProps: Readonly<ISwiperProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.updateSwiper();
  }

  private updateSwiper() {
    const swiperInstance = this.getSwiper();
    if (swiperInstance) {
      this.clearSwiper();
    }
    const { options } = this.props;
    this.currentSwiper = new Swiper(this.swipe.current, {
      pagination: ".swiper-pagination",
      // 如果需要前进后退按钮
      paginationClickable: true,
      loop: true,
      autoplay: 5000,
      speed: 1000,
      effect: "fade",
      ...options,
    });
  }

  private getSwiper() {
    return this.currentSwiper;
  }

  private clearSwiper() {
    if (this.currentSwiper) {
      this.currentSwiper.destroy();
      this.currentSwiper = null;
    }
  }

  render() {
    const { slide = [] } = this.props;
    const Info = this.props.user.personInfo;
    const InfoCompany = this.props.user.companyInfo;
    const exhibitionGuid = Info.exhibitionGuid ? Info.exhibitionGuid : InfoCompany.exhibitionGuid;
    return (
      <div className="swiper-banner" ref={this.swipe}>
        <div className="swiper-wrapper">
          {slide && slide.map((item: { url: string, id: number, image: string, title: string, slideGuid: string, flag: number }, index) => {
              return (
                <div key={item.id} className="swiper-slide swiper-slide-bg"
                     style={{ backgroundImage: `url(${item.image})`, backgroundSize: "cover" }}
                     onClick={async () => {
                       const params = {
                         pageName: item.title,
                         pageUrl: item.url,
                         type: 1,
                         remark: item.slideGuid,
                       };
                       await sendUserBehavior(params);

                       if (item.url === "matchmaking") {
                         if (localStorage.getItem("user")) {
                           this.props.history.push(`/matchmaking/${exhibitionGuid}`);
                         } else {
                           message.warning("您还未登陆请先登陆后进行操作");
                           this.props.history.push(`/login`);
                         }
                       } else {

                         (item.flag === 1) ? window.open(item.url) : this.props.history.push("/" + item.url);
                       }
                     }}/>
              );
            }
          )}
        </div>
        <div className="swiper-pagination"/>
      </div>
    );
  }
}
