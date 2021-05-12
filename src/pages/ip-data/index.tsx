import * as React from "react";
import { inject, observer } from 'mobx-react';
import ScrollTop from '@components/scroll-top';
import arrow from '@assets/images/ip_data/left.svg';
import art from '@assets/images/ip_data/art_data.png';
import movie from '@assets/images/ip_data/movie_data.png';
import tv from '@assets/images/ip_data/tv_data.png';
import star from '@assets/images/ip_data/star_data.png';
import search from '@assets/images/ip_data/search_data.png';
import interact from '@assets/images/ip_data/interact_data.png';
import media from '@assets/images/ip_data/media_data.png';
import fans from '@assets/images/ip_data/fans_data.png';
import play from '@assets/images/ip_data/play_data.png';
import platform from '@assets/images/ip_data/platform_data.png';
import boxOffic from '@assets/images/ip_data/boxOffic_data.png';
import word from '@assets/images/ip_data/word_data.png';
import portrait from '@assets/images/ip_data/portrait_data.png';
import region from '@assets/images/ip_data/region_data.png';
import business from '@assets/images/ip_data/business_data.png';
import crux from '@assets/images/ip_data/crux_data.png';
import baseIp from '@assets/images/ip_data/baseIp.png';
import assess from '@assets/images/ip_data/assess.png';
import step from '@assets/images/ip_data/step.jpg';
import person from '@assets/images/ip_data/ic_yonghu.svg';
import auth from '@assets/images/ip_data/attestation1.svg';
// import gold from '@assets/images/ip_data/golden_membership1.svg';
// import diamond from '@assets/images/ip_data/diamond_membership1.svg';
import service from '@assets/images/ip_data/service.jpg';
import discount95 from '@assets/images/ip_data/discount95.jpg';
import discount92 from '@assets/images/ip_data/discount92.jpg';
import redTriangel from '@assets/images/ip_data/red_triangel.jpg';
import power from '@assets/images/ip_data/power.jpg';
import characteristic from '@assets/images/ip_data/characteristic.jpg';
import hand from '@assets/images/ip_data/hand.svg';
import ic_gytk from '@assets/images/ip_data/ic_gytk.svg';
import ic_gyfp from '@assets/images/ip_data/ic_gyfp.svg';
import ic_gysj from '@assets/images/ip_data/ic_gysj.svg';
import ic_xqbz from '@assets/images/ip_data/ic_xqbz.svg';
import ic_yjfk from '@assets/images/ip_data/ic_yjfk.svg';
import zn from '@assets/images/ip_data/zhinengqushu.svg';
import kx from '@assets/images/ip_data/kexuepinggu.svg';
import kg from '@assets/images/ip_data/keguanfenxi.svg';
import one from '@assets/images/ip_data/one.png';
import two from '@assets/images/ip_data/two.png';
import three from '@assets/images/ip_data/three.png';
import icon_fans_sex from '@assets/images/ip_data/icon_fans_sex.png';
import icon_fans_age from '@assets/images/ip_data/icon_fans_age.png';
import icon_growth from '@assets/images/ip_data/icon_growth.png';
import icon_wave from '@assets/images/ip_data/icon_wave.png';
import icon_famous_heat from '@assets/images/ip_data/icon_famous_heat.png';
import icon_match_heat from '@assets/images/ip_data/icon_match_heat.png';
import icon_heat from '@assets/images/ip_data/icon_heat.png';
import icon_filter_ip from '@assets/images/ip_data/icon_filter_ip.png';
import icon_add_need1 from '@assets/images/ip_data/icon_add_need1.png';
import icon_add_need2 from '@assets/images/ip_data/icon_add_need2.png';
import step1 from '@assets/images/ip_data/step-1.png';
import step2 from '@assets/images/ip_data/step-2.png';
import step3 from '@assets/images/ip_data/step-3.png';
import stepArrow from '@assets/images/ip_data/step-arrow.png';
import silver from '@assets/images/user/vip/silver.png';
import gold from '@assets/images/user/vip/gold.png';
import diamond from '@assets/images/user/vip/diamond.png';
import customize from '@assets/images/user/vip/customize.png';

import '@assets/scss/ip_data.scss';
import Item from "antd/lib/list/Item";

interface IIpDataState {
  tab: number,
  category: number,
  type: number,
}

@inject('user')
@observer
export default class Source extends React.Component<IProps, IIpDataState> {
  state = {
    tab: 1,
    category: 1,
    type: 1,
  };

  async componentDidMount() {
    document.title = "IP二厂-IP数据";
    const { user } = this.props;
    await user.getGradeData();
  }

  UpTab(num) {
    this.setState({
      tab: num,
      category: 1,
      type: 1,
    });
  }

  UpdateData(num) {
    this.setState({
      category: num,
    });
    if (num !== 2) {
      this.setState({
        type: 1,
      });
    }
  }

  setType(num) {
    this.setState({
      type: num,
    });
  }

  render() {
    const { tab, category, type } = this.state;
    const { gradeData } = this.props.user;
    let url = 'https://html.ecqun.com/kf/sdk/openwin.html?corpid=13158054&cstype=rand&mode=0&cskey=qhazuBRab5zfY4Jp91&scheme=0&source=100';

    return (
      <div className="ip-data-container">
        <div className='tab'>
          <div className={tab === 1 ? 'tab-border' : 'top-tab'}>
            <span
              className={tab === 1 ? 'active' : ''}
              onClick={() => this.UpTab(1)}
            >IP数据产品</span>
            <span
              className={tab === 2 ? 'active' : ''}
              onClick={() => this.UpTab(2)}
            >IP筛选产品</span>
          </div>
        </div>
        <div className="second-type" style={{ display: tab === 1 ? 'block' : 'none' }}>
          <div className='tab-bottom'>
            <li>类别:</li>
            <li
              className={category === 1 ? 'active' : ''}
              onClick={() => this.UpdateData(1)}
            >IP数据产品介绍
            </li>
            <li
              className={category === 2 ? 'active' : ''}
              onClick={() => this.UpdateData(2)}
            >数据类型介绍
            </li>
           {/* <li
              className={category === 3 ? 'active' : ''}
              onClick={() => this.UpdateData(3)}
            >会员数据权限
            </li>*/}
            <li
              className={category === 4 ? 'active' : ''}
              onClick={() => this.UpdateData(4)}
            >常见问题
            </li>
          </div>
          <div className='tab-bottom' style={{ display: category === 2 ? 'flex' : 'none' }}>
            <li>类型:</li>
            <li
              className={type === 1 ? 'active' : ''}
              onClick={async () => {
                this.setType(1);
              }}
            >基础数据
            </li>
            <li
              className={type === 2 ? 'active' : ''}
              onClick={async () => {
                this.setType(2);
              }}
            >评估数据
            </li>
            <li
              className={type === 3 ? 'active' : ''}
              onClick={async () => {
                this.setType(3);
              }}
            >对比数据
            </li>
            <li
              className={type === 4 ? 'active' : ''}
              onClick={async () => {
                this.setType(4);
              }}
            >测评数据
            </li>
          </div>
        </div>

        <div className="content" style={{ display: tab === 1 ? 'block' : 'none' }}>
          <div className="source-container" style={{ display: category === 1 ? 'block' : 'none' }}>
            <div className='source-title'>IP数据产品介绍</div>
            <div className='ip-introduce'>
              <p className='ip-title'>理性客观的选择IP</p>
              <p
                className='ip-word'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IP二厂平台汇聚海量IP资源，覆盖卡通动漫、影视娱乐、名人明星、文化艺术等十大IP类型。</p>
              <p
                className='ip-word'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;依托酷拓COOLTOUR在IP行业的丰富经验、大数据数据分析与行业洞察能力，向行业提供提供IP数据服务，包括基础数据、评估数据、对比数据和测评数据，包含了IP基础数据追踪、IP热度追踪、IP舆情监测、IP粉丝画像、IP商业价值研究等多维度数据服务，通过研究关键词搜索趋势、洞察TA需求变化、监测媒体舆情趋势、定位TA特征等。</p>
              <div
                className='ip-word'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;让版权方更快速了解市场动向和发展趋势，同时帮助被授权方、投资方等更好地选择适合的IP。
                <div className='img-text'>
                  <div className='img-textOne'>
                    <img src={zn} alt=''/>
                    <p className='text-top'>智能取数</p>
                    <p className='text-bottom'>AI智能获取，省时省力</p>
                  </div>
                  <div className='img-textOne'>
                    <img src={kx} alt=''/>
                    <p className='text-top'>科学评估</p>
                    <p className='text-bottom'>大数据算法评估，定量定性</p>
                  </div>
                  <div className='img-textOne'>
                    <img src={kg} alt=''/>
                    <p className='text-top'>客观分析</p>
                    <p className='text-bottom'>IP多维度数据对比，全面客观</p>
                  </div>
                </div>
                <p
                  className='ip-word'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IP数据以全方位精准数据支撑、多角度用户洞察为依据，打造优质数据使用体验，提供自动化的智能数据服务。</p>
              </div>
            </div>
          </div>
          <div className='data-introduce' style={{ display: category === 2 ? 'block' : 'none' }}>
            <div className='data-container' style={{ display: type === 1 ? 'block' : 'none' }}>
              <div className='data-title'>基础数据介绍</div>
              <div className='data-overview'>
                <div className='over-sum'>1、数据总览</div>
                <div className='over-title'>
                  <img src={arrow} alt=''/>卡通动漫/文化艺术/生活方式/企业品牌/体育运动/非盈利机构/网络游戏/网文图书
                </div>
                <div className='over-amount'>
                  <div>
                    <span>总览数据包含：</span>
                    <span className='over-line'>全网热度指数、媒体指数、搜索指数、官网粉丝数</span>
                  </div>
                  <div>
                    <span>来源：</span>
                    <span className='over-line'>大数据算法、官网粉丝数来源于新浪微博</span>
                  </div>
                </div>
                <div className='over-img'><img src={art} alt=''/></div>
                <div className='over-title'>
                  <img src={arrow} alt=''/>影视娱乐
                </div>
                <div className='over-movie'>
                  <div className='circle'>
                  </div>
                  <span>电影</span>
                </div>
                <div className='over-amount'>
                  <div><span>总览数据包含：</span>
                    <span className='over-line'>上映天数、票房累计、首映日票房、首周票房</span>
                  </div>
                  <div><span>来源：</span>
                    <span className='over-line'>基于全网搜索指数加权计算、部分数据来源于猫眼电影</span>
                  </div>
                </div>
                <div className='over-img'><img src={movie} alt=''/></div>
                <div className='over-movie'>
                  <div className='circle2'>
                  </div>
                  <span>电视剧/综艺</span>
                </div>
                <div className='over-amount'>
                  <div><span>总览数据包含：</span>
                    <span className='over-line'>上线天数、累计播放量、昨日播放量、今日播放量</span>
                  </div>
                  <div><span>来源：</span>
                    <span className='over-line'>基于全网搜索指数加权计算</span>
                  </div>
                </div>
                <div className='over-img'><img src={tv} alt=''/></div>
                <div className='over-title'>
                  <img src={arrow} alt=''/>名人明星
                </div>
                <div className='over-amount'>
                  <div>
                    <span>总览数据包含：</span>
                    <span className='over-line'>全网热度值、媒体指数、合作品牌数、微博粉丝数</span>
                  </div>
                  <div>
                    <span>来源：</span>
                    <span className='over-line'>基于全网搜索指数加权计算</span>
                  </div>
                </div>
                <div className='over-img'><img src={star} alt=''/></div>
                <div className='data-overview'>
                  <div className='over-sum'>2、搜索基础数据（全类别）</div>
                  <div className='over-amount'>
                    <div><span>搜索数据包含：</span>
                      <span className='over-line'>百度搜索指数、搜狗搜索指数</span>
                    </div>
                    <div><span>来源：</span>
                      <span className='over-line'>百度指数、搜狗指数</span>
                    </div>
                  </div>
                  <div className='over-search'><img src={search} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>3、互动基础数据（全类别）</div>
                  <div className='over-amount'>
                    <div><span>互动基础数据包含：</span>
                      <span className='over-line'>微博超话帖子数、微博超话阅读数、微博话题阅读数、微博话题帖子数</span>
                    </div>
                    <div><span>来源：</span>
                      <span className='over-line'>新浪微博</span>
                    </div>
                  </div>
                  <div className='over-search'><img src={interact} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>4、媒体关注基础数（全类别）</div>
                  <div className='over-amount'>
                    <div><span>媒体关注数据包含：</span>
                      <span className='over-line'>百度资讯指数、微信公众号文章数、微信热度指数</span>
                    </div>
                    <div><span>来源：</span>
                      <span className='over-line'>百度指数、搜狗指数</span>
                    </div>
                  </div>
                  <div className='over-search'><img src={media} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>5、粉丝趋势（全类别）</div>
                  <div className='over-amount'>
                    <div><span>粉丝趋势数据包含：</span>
                      <span className='over-line'>微博粉丝数、贴吧粉丝数</span>
                    </div>
                    <div><span>来源：</span>
                      <span className='over-line'>新浪微博、百度贴吧</span>
                    </div>
                  </div>
                  <div className='over-search'><img src={fans} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>6、播放趋势（影视娱乐：电影/电视剧/综艺）</div>
                  <div className='over-amount'>
                    <div><span>播放趋势包含：</span>
                      <span className='over-line'>平台播放趋势、平台热度趋势</span>
                    </div>
                    <div><span>来源：</span>
                      <span className='over-line'>腾讯、芒果、乐视、优酷、搜狐、爱奇艺</span>
                    </div>
                  </div>
                  <div className='over-play'><img src={play} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>7、播放平台（影视娱乐：电视剧/综艺）</div>
                  <div className='over-amount'>
                    <div><span>来源：</span>
                      <span className='over-line'>腾讯、芒果、乐视、优酷、搜狐、爱奇艺</span>
                    </div>
                  </div>
                  <div className='over-search'><img src={platform} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>8、院线票房趋势（影视娱乐：电影）</div>
                  <div className='over-amount'>
                    <div><span>来源：</span>
                      <span className='over-line'>中国票房</span>
                    </div>
                  </div>
                  <div className='over-box'><img src={boxOffic} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-sum'>9、口碑信息（影视娱乐：电影/电视剧/综艺）</div>
                  <div className='over-amount'>
                    <div><span>来源：</span>
                      <span className='over-line'>腾讯、芒果、乐视、优酷、搜狐、爱奇艺</span>
                    </div>
                  </div>
                  <div className='over-word'><img src={word} alt=''/></div>
                </div>
              </div>
            </div>
            <div className='data-container' style={{ display: type === 2 ? 'block' : 'none' }}>
              <div className='data-title'>评估数据介绍</div>
              <div className='assess-word'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全方位认知IP价值，基于海量第三方数据经过智能算法计算评估，从粉丝、热度、商业价值等全方位进行统计及解读IP，准确定位用户群体，进行针对性的运营和推广，瞄准用户，读懂用户，并不断迭代，实现精准营销，带来可持续增长。
              </div>
              <p className='assess-intro'>评估数据包含以下几个方面：</p>
              <div className='assess-side'>
                <div className='over-sum'>1、受众画像</div>
                <div className='assess-portrait'>
                  <img src={portrait} alt=''/>
                </div>
              </div>
              <div className='assess-side'>
                <div className='over-sum'>2、地区分布</div>
                <div className='assess-region'>
                  <img src={region} alt=''/>
                </div>
              </div>
              <div className='assess-side'>
                <div className='over-sum'>3、商业价值评估模型</div>
                <div className='assess-portrait'>
                  <img src={business} alt=''/>
                </div>
              </div>
              <div className='assess-side'>
                <div className='over-sum'>4、关键词云</div>
                <div className='assess-crux'>
                  <img src={crux} alt=''/>
                </div>
              </div>
            </div>
            <div className='data-container' style={{ display: type === 3 ? 'block' : 'none' }}>
              <div className='data-title'>对比数据介绍</div>
              <div className='assess-word'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对比数据是指用户可以将感兴趣的同类型IP加入对比（最多可选择3个IP），
                即对IP基础数据、评估数据进行对比，快速查看相关联或竞品的相关信息概况，全方位了解市场行业动向。
              </div>
              <p className='contrast-li'>例：</p>
              <div className='contrast-ip'>
                <div className='ip-left'>
                  <p className='base-ip'>多个IP的基础数据对比</p>
                  <img src={baseIp} alt=''/>
                </div>
                <div className='ip-right'>
                  <p className='base-ip'>多个IP的基础数据对比</p>
                  <img src={assess} alt=''/>
                </div>
              </div>
            </div>
            <div className='data-container' style={{ display: type === 4 ? 'block' : 'none' }}>
              <div className='data-title'>测评数据介绍</div>
              <div className='assess-word'>
                预测数据即定制化报告，根据具体需求，从多角度多平台多层次进行专业分析。
              </div>
              <div className='step-img'>
                <img src={step} alt=''/>
              </div>
              <div className='step-contain'>
                <p>报告内容：</p>
                <p className='step-word'>基于行业整体发展概况与趋势，对IP产业各端核心企业、用户行为、品牌行为进行多维度分析与预测，深度挖掘IP潜力，智能评估商业价值。</p>
                <p
                  className='step-word2'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用全面精准的数据解读与深入多维的用户研究相结合的方式，为IP品牌从定位到传播提供全方位品牌与营销管理及专业的智囊服务，深度链接IP运营、内容营销等垂直场景，为IP产业增值赋能。
                </p>
                <p className='step-word'>为潜力IP提供融资曝光机会，为代理方提供动态行研分析与优质IP项目的追踪，优先抢占商机，实现共赢。
                </p>
              </div>
            </div>
          </div>
          <div className="source-container" style={{ display: category === 3 ? 'block' : 'none' }}>
            <div className='source-title'>会员数据权限</div>
            <div className='member-table'>
              <table className='table'>
                <thead>
                <tr>
                  <td className='table-one'>购买套餐</td>
                  <td>
                    <img src={person} alt=''/>
                    <p className='tab-title'>普通用户</p>
                    <p className='tab-ip'>免费查看海量IP</p>
                    <p className='tab-data'>基本资料及IP榜单</p>
                  </td>
                  <td>
                    <img src={silver} alt=''/>
                    <p className='tab-title'>白银会员</p>
                    <p className='tab-ip'>免费查看海量IP</p>
                    <p className='tab-data'>基础数据</p>
                  </td>
                  <td>
                    <img src={gold} alt=''/>
                    <p className='tab-title'>黄金会员</p>
                    <p className='tab-ip'>免费查看海量IP</p>
                    <p className='tab-data'>基础数据/评估数据</p>
                  </td>
                  <td>
                    <img src={diamond} alt=''/>
                    <p className='tab-title'>钻石会员</p>
                    <p className='tab-ip'>免费查看海量IP</p>
                    <p className='tab-data'>基础数据/评估数据/对比数据</p>
                  </td>
                  <td>
                    <img src={customize} alt=''/>
                    <p className='tab-title'>定制服务</p>
                    <p className='tab-data'>评测数据定制服务</p>
                  </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>月卡</td>
                  <td>/</td>
                  <td>

                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 1 && e.discount)) &&
                      <img src={redTriangel} alt=''/>
                    }
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 1 && e.discount)) &&
                      <div className='discount'>
                        {gradeData && gradeData.find(e => e.type === 1).discount * 10}折
                      </div>
                    }
                    {/* <div className='discount'>折</div> */}
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 1 && item.memberLevel === 1 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/月</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 1 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 1).actualAmount}
                      </p>
                    }
                  </td>
                  <td>
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 2 && e.discount)) &&
                      <img src={redTriangel} alt=''/>
                    }
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 2 && e.discount)) &&
                      <div className='discount'>
                        {gradeData && gradeData.find(e => e.id === 1).discount * 10}折
                      </div>
                    }
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 1 && item.memberLevel === 2 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/月</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 2 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 1).actualAmount}
                      </p>
                    }
                  </td>
                  <td>
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 3 && e.discount)) &&
                      <img src={redTriangel} alt=''/>
                    }
                    {
                      (gradeData && gradeData.find(e => e.type === 1 && e.memberLevel === 3 && e.discount)) &&
                      <div className='discount'>
                        {gradeData && gradeData.find(e => e.type === 1).discount * 10}折
                      </div>
                    }
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 1 && item.memberLevel === 3 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/月</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.id === 4 && e.actualAmount)) && <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.id === 4).actualAmount}
                      </p>
                    }
                  </td>
                  <td rowSpan={3}><img src={characteristic} alt=''/>
                    {gradeData && gradeData.map((item, v) => {
                      return (
                        <div key={v}>
                          {item.id === 7 && item.paymentAmount}
                        </div>
                      );
                    })}
                    <span>元起/定制服务</span>
                  </td>
                </tr>
                <tr>
                  <td>半年卡</td>
                  <td>/</td>
                  <td>
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 1 && e.discount)) &&
                      <img src={redTriangel} alt=''/>
                    }
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 1 && e.discount)) &&
                      <div className='discount'>
                        {gradeData && gradeData.find(e => e.type === 2).discount * 10}折
                      </div>
                    }
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 2 && item.memberLevel === 1 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/6个月</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 1 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 2).actualAmount}
                      </p>
                    }
                  </td>
                  <td>
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 2 && e.discount)) &&
                      <img src={redTriangel} alt=''/>
                    }
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 2 && e.discount)) &&
                      <div className='discount'>
                        {gradeData && gradeData.find(e => e.type === 2).discount * 10}折
                      </div>
                    }
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 2 && item.memberLevel === 2 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/6个月</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 2 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 2).actualAmount}
                      </p>
                    }
                  </td>
                  <td>
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 3 && e.discount)) &&
                      <img src={redTriangel} alt=''/>
                    }
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 3 && e.discount)) &&
                      <div className='discount'>
                        {gradeData && gradeData.find(e => e.type === 2).discount * 10}折
                      </div>
                    }
                    <div>{gradeData && gradeData.map((item, v) => {
                      return (
                        <div key={v}>
                          {item.type === 2 && item.memberLevel === 3 && item.paymentAmount}
                        </div>
                      );
                    })}
                      <span>元/6个月</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 3 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 2 && e.memberLevel === 3).actualAmount}
                      </p>
                    }
                  </td>
                </tr>
                <tr>
                  <td>年卡</td>
                  <td>/</td>
                  <td>
                    <img src={power} alt=''/>
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 3 && item.memberLevel === 1 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/年</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 3 && e.memberLevel === 1 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 3 && e.memberLevel === 1).actualAmount}
                      </p>
                    }
                  </td>
                  <td>
                    <img src={power} alt=''/>
                    <div>
                      {gradeData && gradeData.map((item, v) => {
                        return (
                          <div key={v}>
                            {item.type === 3 && item.memberLevel === 2 && item.paymentAmount}
                          </div>
                        );
                      })}
                      <span>元/年</span>
                    </div>
                    {
                      (gradeData && gradeData.find(e => e.type === 3 && e.memberLevel === 2 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 3 && e.memberLevel === 2).actualAmount}
                      </p>
                    }
                  </td>
                  <td>
                    <img src={power} alt=''/>
                    <div>{gradeData && gradeData.map((item, v) => {
                      return (
                        <div key={v}>
                          {item.type === 3 && item.memberLevel === 3 && item.paymentAmount}
                        </div>
                      );
                    })}
                      <span>元/年</span>
                    </div>

                    {
                      (gradeData && gradeData.find(e => e.type === 3 && e.memberLevel === 3 && e.actualAmount)) &&
                      <p className='old'>
                        ¥{gradeData && gradeData.find(e => e.type === 3 && e.memberLevel === 3).actualAmount}
                      </p>
                    }
                  </td>
                </tr>
                <tr>
                  <td>操作</td>
                  <td onClick={() => {
                    this.props.history.push('/register');
                  }}>
                    <span className='push-other'>立即注册</span>
                  </td>
                  <td
                    onClick={() => {
                      this.props.history.push('user/12');
                    }}
                  >
                    <span className='push-other'>立即购买</span>
                  </td>
                  <td
                    onClick={() => {
                      this.props.history.push('user/12');
                    }}
                  >
                    <span className='push-other'>立即购买</span>
                  </td>
                  <td
                    onClick={() => {
                      this.props.history.push('user/12');
                    }}
                  >
                    <span className='push-other'>立即购买</span>
                  </td>
                  <td onClick={() => {
                  }}>
                    <a className='push-other' href={url} target="_blank">联系客服</a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="source-container" style={{ display: category === 4 ? 'block' : 'none' }}>
            <div className='source-title'>常见问题</div>
            <div className='question'>
              <div className='item-ques'>
                <div className='title-ques'><img src={ic_gytk} alt=''/>关于退款</div>
                <p className='explain-ques'>数据服务不支持退款支付成功后不能撤回如有其他问题请与我们联系，感谢您对IP数据的关注和支持。</p>
              </div>
              <div className='item-ques'>
                <div className='title-ques'><img src={ic_gyfp} alt=''/>关于发票</div>
                <p className='explain-ques'>每月最后一天统一开票，开具当月已到账金额(含税)的发票；可开发票种类：增值税普通发票；发票内容：咨询服务费 ，税率3%。</p>
              </div>
              <div className='item-ques'>
                <div className='title-ques'><img src={ic_gysj} alt=''/>关于空数据</div>
                <p className='explain-ques'>IP的搜索指数太低或者部分平台无此IP的信息，暂不能计算该词的相关指数。</p>
              </div>
              <div className='item-ques'>
                <div className='title-ques'><img src={ic_xqbz} alt=''/>寻求帮助</div>
                <p className='explain-ques'>您可以点击右下方客服按钮，或发邮件至<span>operation@cooltour.fun</span>，我们均有专业的工作人员为您解答疑问。</p>
              </div>
              <div className='item-ques'>
                <div className='title-ques'><img src={ic_yjfk} alt=''/>反馈意见</div>
                <p className='explain-ques'>我们欢迎用户朋友积极反馈，可发邮件至<span>operation@cooltour.fun</span>，您的建议是我们不断优化，提升用户体验的不竭动力！
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content" style={{ display: tab === 2 ? 'block' : 'none' }}>

          <div className="data-introduce">
            <div className='data-container'>
              <div className='data-title'>IP筛选器产品介绍</div>
              <p className='word'>
                确认过眼神，就选中对的IP。以先进的智能算法在庞大IP库内大浪淘金，通过热度&知名度、商业价值、匹配度、风险评估等多维定位，精准对齐选推需求。让品牌方、投资方更轻松筛选适合的IP，让版权方更快速了解市场需求发展趋势。
              </p>
              <div className='step'>
                <div className='step-title'>操作步骤：</div>
                <div className='step-content'>
                  <div className='step-content-icon'>
                    <img src={step1} alt=""/>
                    <img src={stepArrow} alt=""/>
                    <img src={step2} alt=""/>
                    <img src={stepArrow} alt=""/>
                    <img src={step3} alt=""/>
                  </div>
                  <div className='step-content-text'>
                    <div>
                      <span>
                      筛选器
                      </span>
                    </div>
                    <div>
                      <span>查看分析数据</span>
                    </div>
                    <div>
                      <span>保存历史筛选</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='data-container'>
              <div className='data-title'>IP筛选器产品介绍</div>
              <p className="word">
                全方位认知IP价值，基于海量第三方数据经过智能算法计算评估，从粉丝、热度、商业价值等全
                方位进行统计及解读IP，准确定位用户群体，进行针对性的运营和推广，瞄准用户，读懂用户，
                并不断迭代，实现精准营销，带来可持续增长。
              </p>

              <p className="gray-step">操作步骤:</p>
              <p className="bold-title">
                <img src={one} alt=""/>
                添加项目需求单
              </p>
              <div className="step-img-box">
                <div className="one">
                  <p className="text-center">项目信息</p>
                  <img src={icon_add_need1} alt=""/>
                </div>
                <div className="two">
                  <p className="text-center">受众群体</p>
                  <img src={icon_add_need2} alt=""/>
                </div>
              </div>

              <p className="bold-title">
                <img src={one} alt=""/>
                筛选IP：根据项目设置的受众群体、微博粉丝量及特征关键词等筛选出符合条件的IP，
                用户可选择5个IP进行数据趋势对比
              </p>
              <div className="step-img-box single">
                <img src={icon_filter_ip} alt=""/>
              </div>

              <p className="bold-title">
                <img src={one} alt=""/>
                查看分析数据：用户可通过TGI数据、发展周期、四象限图、热度趋势图四项维度对所选IP进行
                全面对比分析。
              </p>
              <div style={{ paddingLeft: '0.45rem' }}>
                <div className='data-overview'>
                  <p className='over-sum'>1、TGI数据</p>
                  <p className='over-title'>
                    <img src={arrow} alt=''/>粉丝性别对比: 对比展示IP粉丝中男女占比，百分制表示
                  </p>
                  <div className='over-box'><img src={icon_fans_sex} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <div className='over-title'>
                    <img src={arrow} alt=''/>
                    粉丝年龄段平均比例对比: IP个体在某年龄段（70后、80后、90后、00后）粉丝画像（年龄段占比）
                    与全网该IP类别 用户画像的差值，正数代表IP个体高于全网平均水平即在该年龄段受欢迎，百分制表示。
                  </div>
                  <div className='over-box'><img src={icon_fans_age} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <p className='over-sum'>2、发展周期</p>
                  <p className='over-title'>
                    <img src={arrow} alt=''/>
                    发展阶段：根据IP某段时间内热度波动情况及IP粉丝量定义 IP所处的成长阶段，
                    G0到G7为平缓到高速成长的八个阶段，依次递增。
                  </p>
                  <div className='over-box'><img src={icon_growth} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <p className='over-title'>
                    <img src={arrow} alt=''/>
                    波动轨迹: IP在某段时间内热度的波动状况
                  </p>
                  <div className='over-box'><img src={icon_wave} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <p className='over-sum'>3、四象限图</p>
                  <p className='over-title'>
                    <img src={arrow} alt=''/>
                    知名度VS热度：知名度指IP知名度为基础数据；热度是指此IP热度指数
                    ，对全网社交平台，用户的讨论数、讨论热度，经过大 数据计算。
                  </p>
                  <div className='over-box'><img src={icon_famous_heat} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <p className='over-title'>
                    <img src={arrow} alt=''/>
                    匹配度VS热度：匹配度是指TGI为目标群体指数。 算法说明：基于全网搜索数据，对此IP用户聚类分析，
                    展示用户性别年龄分布， TGI是指定年龄（性别）中此IP用户所占比例/总体年龄（全部性别）中此IP
                    用户所占比例；热度是指此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大 数据计算。
                  </p>
                  <div className='over-box'><img src={icon_match_heat} alt=''/></div>
                </div>
                <div className='data-overview'>
                  <p className='over-sum'>4、热度趋势：基于全网社交平台如百度、微博、微信等热度指数加权计算。</p>
                  <div className='over-box'><img src={icon_heat} alt=''/></div>
                </div>
              </div>
            </div> */}

          </div>

        </div>

        <ScrollTop/>
      </div>
    );
  }
}
