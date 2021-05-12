import * as React from "react";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "./three-swipe.scss";
import { createRef } from "react";

interface ISwiperProps extends IComponentProps {
  slide?: object[],
  options?: object,
}

export default class Swipe extends React.Component<ISwiperProps> {
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
      prevButton: '.swiper-button-prev',
      nextButton: '.swiper-button-next',
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
    return (
      <div className="swiper-area" ref={this.swipe}>
        <div className="swiper-wrapper">
          {slide && slide.map((item, index: number) => {
              return (<div
                  key={index}
                  className="swiper-slide swiper-slide-bg"
                  style={{ backgroundRepeat: "no-repeat", backgroundImage: `url(${item})` }}/>
              );
            }
          )}
        </div>
        <div className="swiper-pagination"/>
        <div className="swiper-button-prev swiper-button-white"/>
        <div className="swiper-button-next swiper-button-white"/>
      </div>
    );
  }
}
