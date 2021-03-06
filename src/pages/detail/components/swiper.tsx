import * as React from "react";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import _isEqual from "lodash/isEqual";
import { createRef } from "react";

interface ISwipeProps {
  options?: object,
  style?: object,
  name?: string,
}

export default class Swipers extends React.Component<ISwipeProps> {

  currentSwipe: any;
  cooperation: any;

  constructor(props: any) {
    super(props);
    this.currentSwipe = null;
    this.cooperation = createRef();
  }

  shouldComponentUpdate(nextProps: Readonly<ISwipeProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return !_isEqual(this.props, nextProps);
  }

  componentDidMount(): void {
    this.updateSwiper();
  }

  componentDidUpdate(prevProps: Readonly<ISwipeProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.updateSwiper();
  }

  private updateSwiper() {
    const swiperInstance = this.getSwiper();
    if (swiperInstance) {
      this.clearSwiper();
    }
    const { options = {}, } = this.props;
    // onSlideNextStart
    this.currentSwipe = new Swiper(this.cooperation.current, {
      pagination: ".swiper-pagination",
      // uniqueNavElements: true,
      // swipeNext: true,
      // swipePrev: true,
      // prevButton: ".swiper-button-prev",
      // nextButton: ".swiper-button-next",
      paginationClickable: true,
      loop: true,
      autoplay: 5000,
      speed: 1000,
      effect: "fade",
      ...options
    });
  }

  private getSwiper() {
    return this.currentSwipe;
  }

  private clearSwiper() {
    if (this.currentSwipe) {
      this.currentSwipe.destroy();
      this.currentSwipe = null;
    }
  }

  render() {
    // @ts-ignore
    const { style = {}, name = "swiper-container" , options: { nextButton, prevButton } } = this.props;
    return (
      <div className={name} style={{ ...style }} ref={this.cooperation}>
        <div className="swiper-wrapper">
          {this.props.children}
        </div>
        <div className="swiper-button-prev swiper-button-white" style={{ display: prevButton ? 'block' : 'none'}}/>
        <div className="swiper-button-next swiper-button-white" style={{ display: nextButton ? 'block' : 'none'}}/>
      </div>
    );
  }
}
