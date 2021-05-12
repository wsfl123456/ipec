import * as React from "react";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "@assets/scss/react_swiper.scss";
import banner1 from 'assets/images/matchmaking/banner1.jpg';
import banner2 from 'assets/images/matchmaking/banner.png';
import _isEqual from "lodash/isEqual";
import { createRef } from "react";

interface ISwiperProps {
  slide?: object[],
  options?: object,
}

export default class SwiperBanner extends React.Component<ISwiperProps> {

  currentSwiper: any;
  swipe: any;

  constructor(props: any) {
    super(props);
    this.currentSwiper = null;
    this.swipe = createRef();
  }

  shouldComponentUpdate(nextProps: Readonly<ISwiperProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return !_isEqual(this.props, nextProps);
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
      autoplay: 3000,
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
    return (
      <div className="swiper-banner swiper-top-banner" style={{ width: '2.56rem' }} ref={this.swipe}>
        <div className="swiper-wrapper">
          {/* {slide && slide.map((item: { url: string, id: number, image: string }) => {
              return (
                <div key={item.id} className="swiper-slide swiper-slide-bg"
                     style={{ backgroundImage: `url(${item.image})` }}>
                </div>
              );
            }
          )}*/}
          <div className="swiper-slide swiper-slide-bg"
               style={{ backgroundImage: `url(${banner2})`, cursor: 'pointer' }}
               onClick={() => {
                 location.href = '/#/explain';
               }}
          />
          <div className="swiper-slide swiper-slide-bg" style={{ backgroundImage: `url(${banner1})` }}/>
        </div>
        <div className="swiper-pagination"/>
      </div>
    );
  }
}
