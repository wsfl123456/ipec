import * as React from 'react';
import '@assets/scss/basic-example.scss';
import basic1 from '@assets/images/example-vip/basic1@3x.png';
import basic2 from '@assets/images/example-vip/basic2@3x.png';
import basic3 from '@assets/images/example-vip/basic3@3x.png';
import basicBanner from '@assets/images/example-vip/basic-banner.png';
import appraise1 from '@assets/images/example-vip/appraise1@3x.png';
import appraise2 from '@assets/images/example-vip/appraise2@3x.png';
import appraise3 from '@assets/images/example-vip/appraise3@3x.png';
import appraiseBanner from '@assets/images/example-vip/appraise-banner.png';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

interface IBasicState {
  detailObj: object;
}

interface IBasicProps extends IComponentProps {
  type: string;
  userGuid: string;
}

class BasicExample extends React.Component<IBasicProps, IBasicState> {
  constructor(props) {
    super(props);
    this.state = {
      detailObj: {
        'basic': {
          title: 'IP基础数据',
          detail: [
            { img: basic1, words: ' 聚合全网数据，让你一站式掌握IP关键指数，节约你的时间成本；' },
            { img: basic2, words: '主流平台数据对比，让你对IP市场行情一目了然，帮你快速判断IP产品化可行性；' },
            { img: basic3, words: 'IP粉丝趋势展现，帮你看透每一个IP需求，让你轻松把控IP市场定位；' },
          ],
          banner: basicBanner,
          desc1: '1秒开启专家级IP数据看板',
          desc2: '开通白银会员即可查看海量IP基础数据资源',
        },
        'appraise': {
          title: 'IP评估数据',
          detail: [
            { img: appraise1, words: ' 大数据呈现IP用户画像，帮你可视化读懂IP消费者，让你的IP推广更具针对性、更具效果；' },
            { img: appraise2, words: '智能分析IP在市场内分布情况，让你提前解锁IP卖点，帮你的IP营销更优化更具精准性，更大限度实现IP变现；' },
            { img: appraise3, words: '提供IP关键词云研究，帮你把脉IP受众需求 让你全面掌握市场卖点。' },
          ],
          banner: appraiseBanner,
          desc1: '先人一步看清谁为IP买单',
          desc2: '开通黄金会员即可查看海量IP评估数据源，一手掌握IP市场潜力',
        },
      },
    };
  }

  goVip() {
    if (this.props.userGuid) {
      this.props.history.push('/user/12');
    } else {
      message.info('您还未登陆，请先登陆后进行操作');
      // setTimeout(() => {
      // this.props.history.push('/login');
      // }, 1000);
    }
  }

  render() {
    const { type } = this.props;
    const { detailObj } = this.state;
    let data = detailObj[type];
    return (
      <div className="example-content basic-example">
        <div className="example-top-body">
          <div className="example-top">
            <p className="top-title">{data.title}
              <span className="title-color">对您的帮助:</span>
            </p>
            {
              data.detail && data.detail.map((item, index) => {
                return (
                  <div className="top-detail" key={index}>
                    <img className="top-detail__img" src={item.img} alt=""/>
                    <div className="top-detail__words">{item.words}</div>
                  </div>
                );
              })
            }
          </div>
          <div className="example-body">
            <p className="body-title">示例：</p>
            <img className={type === 'basic' ? "body-banner" : "body-banner-appraise "} src={data.banner} alt=""/>
          </div>
        </div>
        <div className="example-bottom">
          <p className="bottom-underline">{data.desc1}</p>
          <p className="bottom-text">{data.desc2}</p>
          <button className="bottom-button" onClick={() => this.goVip()}>立即开通</button>
        </div>
      </div>
    );
  }
}
export default withRouter(BasicExample);
