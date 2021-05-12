import * as React from "react";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "@assets/scss/react_swiper.scss";
import _isEqual from "lodash/isEqual";
import { createRef } from "react";

interface ISwiperProps {
  slide?: object[],
  options?: object,
}

export default class SwiperB extends React.Component<ISwiperProps> {

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
      // 如果需要前进后退按钮
      prevButton: '.swiper-button-prev',
      nextButton: '.swiper-button-next',
      // loop: true,
      // autoplay: 3000,
      speed: 1000,
      // effect: "fade",
      slidesPerView: 3,
      spaceBetween: 20,
      // 3D
      // effect: 'coverflow',
      // grabCursor: false,
      // centeredSlides: true,
      // slidesPerView: 3,
      // coverflow: {
      //   slideShadows: false,
      //   rotate: 30,
      //   stretch: 0,
      //   depth: 60,
      //   modifier: 6,
      // },
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
    // console.log(slide)
    return (
      <div className="swiper-banner swiper-blance" style={{ height: '3rem ' }} ref={this.swipe}>
        <div className="swiper-wrapper">
          {slide && slide.map((item: { url: string, id: number, image: string }) => {
              return (
                <div key={item.id} className="swiper-slide swiper-slide-bg"
                     style={{ backgroundImage: `url(${item.image})` }}>
                  {/*<img src={item.image} alt=""/>*/}
                </div>
              );
            }
          )}
        </div>
        <div className="swiper-button-prev swiper-button-white"/>
        <div className="swiper-button-next swiper-button-white"/>
      </div>
    );
  }
}
