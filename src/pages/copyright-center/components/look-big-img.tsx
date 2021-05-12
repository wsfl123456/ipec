/**
 * 图片查看弹窗合集
 */
import * as React from 'react';
import 'assets/scss/copyright-modal.scss';
import close from '@assets/images/copyright-center/circle-close.png';
import arrow_left from '@assets/images/copyright-center/circle-arrow-left.png';
import arrow_right from '@assets/images/copyright-center/circle-arrow-right.png';
import { inject, observer } from 'mobx-react';
import { Carousel } from 'antd';
import { createRef } from 'react';

interface ILookBigImgProps extends IComponentProps {
  arr?: any[];
}

@inject('copyrightCenter')
@observer
export default class LookBigImg extends React.Component<ILookBigImgProps, any> {
  swipe: any;
  slider: any;

  constructor(props) {
    super(props);
    this.swipe = createRef();
    this.state = {
      index: 1,
      zIndex: 0,
    };
  }

  render() {
    const { copyrightCenter, arr } = this.props;
    const { index, zIndex, } = this.state;
    return (
      <div className={`copyright-modal big-img-modal ${copyrightCenter.imgShow ? "show" : "hide"}`}>
        <div className="img-content">
          <div className="img-box">
            <Carousel dots={false} ref={el => (this.slider = el)}>
              {
                arr && arr.map((i, idx) => {
                  return (
                    <div className="img-group" key={idx}>
                      <img src={i} alt="" className="big-img"/>
                      <p className="img-index"><span>{idx + 1}</span>/{arr && arr.length}</p>
                    </div>
                  );
                })
              }
            </Carousel>
            <div className="btn-box">
              <img src={arrow_left} alt="" className="arrow-left" onClick={() => {
                this.slider.slick.slickNext();
              }}/>
              <img src={close} alt="" className="arrow-close"
                   onClick={() => copyrightCenter.changeImgShow(false)}/>
              <img src={arrow_right} alt="" className="arrow-right"
                   onClick={() => {
                     this.slider.slick.slickPrev();
                   }}
              />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
