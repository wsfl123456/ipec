import * as React from 'react';
import '@assets/scss/diamonds-example.scss';
import compare1 from '@assets/images/example-vip/compare1@3x.png';
import compare2 from '@assets/images/example-vip/compare2@3x.png';
import compareBanner from '@assets/images/example-vip/compare-banner.png';
import filter1 from '@assets/images/example-vip/filter1@3x.png';
import filter2 from '@assets/images/example-vip/filter2@3x.png';
import filterBanner from '@assets/images/example-vip/filter-banner.png';
import { message } from 'antd';
import {withRouter} from 'react-router-dom';
interface IDiamondsState {
  detailObj: object;
}

interface IDiamondsProps extends IComponentProps {
  type: string;
  userGuid: string;
  history?: any;
}

class DiamondsExample extends React.Component<IDiamondsProps, IDiamondsState> {
  constructor(props) {
    super(props);
    this.state = {
      detailObj: {
        'compare': {
          title: 'IP对比数据',
          detail: [
            { img: compare1, words: ' 重数据，综合对比，全方位反应市场行业动向，帮你快速看清相似IP关键信息概况；' },
            { img: compare2, words: '明确IP优势指数，多维度比较多款竞品IP重点指数表现，让你直观看清多款同类型竞品IP谁市场表现更突出。' },
          ],
          banner: compareBanner,
          desc1: '甩开对手先对比差距',
          desc2: '开通钻石会员即可查看IP对比数据，助力洞察先机',
        },
        'filter': {
          title: 'IP筛选器',
          detail: [
            { img: filter1, words: ' 根据你的需求进行快速IP过滤，帮你在海量IP库内大浪淘金，让你的IP投资又快又准。' },
            { img: filter2, words: '多维度大数据推荐，数万IP滚动匹配，在你的需求范围内更多一些选择，让你的IP投资更具理性、更具高投资回报比。' },
          ],
          banner: filterBanner,
          desc1: 'IP只买对的不买贵的',
          desc2: '开通钻石会员即可体验完整版IP筛选器帮你精准选IP',
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
        {
          type === 'filter' &&
          <p className="filter-title">采购IP实现联名变现，是一种趋势，也是一项具有风险的投资，<span>IP二厂“筛选器”通过定性+定量相结合的模式为您解决数据分析问题。</span></p>
        }
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
            <p className="body-title">{data.title}示例：</p>
            <img className={type === 'compare' ? "body-banner" : "body-banner-filter "} src={data.banner} alt=""/>
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
export default withRouter(DiamondsExample);
