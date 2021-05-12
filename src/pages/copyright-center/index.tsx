// 版权中心 卖家
import * as React from 'react';
import 'assets/scss/copyright.scss';
import icon_look from '@assets/images/copyright-center/icon_look.png';
import _isEmpty from 'lodash/isEmpty';
import {
  AddressModal,
  Aside, CollectionModal, LookBigImg, RefuseModal,
} from './components/index';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import copyrightCenter from '@pages/copyright-center/store';
import NoResult from '@components/no_result';
import btnGroupsFun from '../copyright-center/paystatus_btn_render';
import _ from 'lodash';
import moment from 'moment';
import { _throttle } from '@utils/util';

interface IOderState {
  tabs: any[],
  tabIndex: number | string,
}

@inject('copyrightCenter', 'login')
@observer
export default class Copyright extends React.Component<any, IOderState> {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { idx: '', name: '全部' },
        { idx: 0, name: '待买家支付' },
        { idx: 3, name: '待监修产品图' },
        { idx: 5, name: '待监修样品' },
        { idx: 7, name: '交易成功' },
        { idx: -1, name: '交易关闭' },
      ],
      tabIndex: '',
    };
  }

  async componentDidMount() {
    const { copyrightCenter, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    // await copyrightCenter.getOrderList({ userGuid, payStatue: 1, type: 2 })
    // await copyrightCenter.getOrderList({ userGuid, currentPage: 1, pageSize: 10, type: 2 });
    await copyrightCenter.changeListParams({ userGuid, payStatue: '', type: 2, currentPage: 1 });
    window.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll);
  }

  // 订单状态Top
  topTitle(item) {
    const { payStatue, againAudit } = item;
    if (payStatue || payStatue === 2 && !againAudit) {
      return (<span className="state">待买家提交设计图</span>);
    } else if (payStatue === 2 && againAudit) {
      return (<span className="warning">产品设计图监修未通过，待买方再次提交监修</span>);
    } else if (payStatue === 4 && !againAudit) {
      return (<span className="state">待买家邮寄样品</span>);
    } else if (payStatue === 5) {
      return (<span className="express">{item.logisticsInfo}</span>);
    } else if (payStatue === 4 && againAudit) {
      return (<span className="warning">样品监修未通过，待买家再次邮寄样品</span>);
    } else if (payStatue === 6 || payStatue === 7) {
      return (<span className="state">交易完成，待平台打款</span>);
    }
  }

  // 订单状态
  orderState(item) {
    const { payStatue } = item;
    if (payStatue === 0) {
      return (<span>待买家支付</span>);
    } else if (payStatue === 1 || payStatue === 2 || payStatue === 3) {
      return (<span>待监修设计图</span>);
    } else if (payStatue === 4 || payStatue === 5) {
      return (<span>待监修样品</span>);
    } else if (payStatue === 6 || payStatue === 7) {
      return (<span>授权交易成功</span>);
    } else if (payStatue < 0) {
      return (<span>交易关闭</span>);
    }
  }

  picUrl(i) {
    const { copyrightCenter } = this.props;
    let sampleUrlArr = [];
    let designUrlArr = [];
    if (i.ipGalleryOrderSample && i.ipGalleryOrderSample.samplePicUrl) {
      sampleUrlArr = i.ipGalleryOrderSample.samplePicUrl.split(',');
      return (
        <div className="num flex-column align-items-center justify-content-center"
             onClick={() => {
               copyrightCenter.bigImgList = sampleUrlArr;
               copyrightCenter.changeImgShow(true);
             }}>
          <img src={icon_look} alt=""/>
          <span>数量({sampleUrlArr.length})</span>
        </div>
      );
    }
    if (i.ipGalleryOrderDesigns && i.ipGalleryOrderDesigns.fileUrl) {
      designUrlArr = i.ipGalleryOrderDesigns.fileUrl.split(',');
      console.log('designUrl', designUrlArr);
      return (
        <div className="num flex-column align-items-center justify-content-center"
             onClick={() => {
               copyrightCenter.bigImgList = designUrlArr;
               copyrightCenter.changeImgShow(true);
             }}>
          <img src={icon_look} alt=""/>
          <span>数量({designUrlArr.length})</span>
        </div>
      );
    }
  }

  scroll = () => {
    const { copyrightCenter } = this.props;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight + 300) >= document.body.scrollHeight) {
      let currentPage = copyrightCenter.listParams.currentPage + 1;
      if (!copyrightCenter.isLoading && copyrightCenter.orderList.length >= copyrightCenter.listParams.pageSize) {
        copyrightCenter.isLoading = true;
        _throttle(copyrightCenter.changeListParams({ currentPage }), 3000);
      }

    }
  };

  render() {
    const { tabs, tabIndex } = this.state;
    const { copyrightCenter, login } = this.props;
    const { orderList, noMore, seeMore, bigImgList, detailList} = copyrightCenter;
    const { userGuid } = login.userInfo || { userGuid: '' };
    const orderSn: string = copyrightCenter.orderSn || '';
    console.log(orderList);
    return (
      <div className="copyright-center">
        <div className="copyright-main">
          <Aside path='/copyright'/>

          {/*  right*/}
          <div className="copyright-right">

            <div className="right-main">
              <p className="title-purple">图库授权交易订单</p>
              <div className="order-list">

                {/* tab*/}
                <div className="order-list-tabs">
                  {
                    tabs && tabs.map(i => {
                      return <span
                        className={`order-list-tabs__item ${tabIndex === i.idx ? "order-list-tabs__item_active " : ""}`}
                        onClick={async () => {
                          this.setState({
                            tabIndex: i.idx
                          });
                          await copyrightCenter.changeListParams({ payStatue: i.idx, currentPage: 1 });
                        }}
                        key={i.idx}>{i.name}</span>;
                    })
                  }
                </div>
                {/* tab-content*/}
                <div className="order-list-content">
                  {
                    orderList.length > 0 && orderList.map((i, idx) => {
                      return (
                        <div className="item-row" key={idx}>
                          <div className="item-row_title align-items-center">
                            <span className="num">订单号：{i.orderSn}</span>
                            {this.topTitle(i.payStatue)}
                          </div>
                          <div className="item-row_table">
                            <img src={i.ipGalleryVO && i.ipGalleryVO.picUrl} alt=""/>
                            <div className="ip-data">
                              <p className="name">{i.ipGalleryVO && i.ipGalleryVO.title}</p>
                              <p className="align-items-center">授权品类： <span
                                className="word-ellipsis">{i.ipGalleryPriceVO && i.ipGalleryPriceVO.authorizeType}</span>
                              </p>
                              <p className="align-items-center">授权期限： <span
                                className="word-ellipsis">{i.ipGalleryPriceVO && i.ipGalleryPriceVO.duration}</span></p>
                              <p className="align-items-center">生产数量： <span
                                className="word-ellipsis">{i.ipGalleryPriceVO && i.ipGalleryPriceVO.productionQuantityMin}-{i.ipGalleryPriceVO && i.ipGalleryPriceVO.productionQuantityMax}</span>
                              </p>
                              <p className="align-items-center">买&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;家：<span
                                className="word-ellipsis">{i.buyerCompanyName}</span></p>
                              <p className="align-items-center">创建时间：<span
                                className="word-ellipsis">{moment(i.createDate).format('YYYY-MM-DD HH:mm:ss')}  </span>
                              </p>
                            </div>
                            <p className="price">￥{i.payAmount}</p>
                            <div className="status flex-column ">
                              {this.orderState(i)}
                              {
                                i.payStatue > -1 &&
                                <Link className="u-link" to={`/copyright-detail/${i.orderSn}`}>订单详情</Link>
                              }
                              {/*设计图、样品物流凭证*/}
                              {this.picUrl(i)}
                            </div>
                            {btnGroupsFun(i, copyrightCenter, userGuid)}
                          </div>
                        </div>
                      );
                    })
                  }
                  {
                    seeMore &&
                    <p className="ofTheBottom">下拉查看更多</p>
                  }
                  {
                    noMore &&
                    <p className="ofTheBottom">没有更多内容</p>
                  }
                  {_isEmpty(orderList) && <NoResult/>}

                </div>

              </div>
            </div>

            {/*  查看大图组件*/}
            <LookBigImg arr={bigImgList}/>

            {/* 监修不通过弹窗*/}
            <RefuseModal type={detailList.payStatue}/>

            {/*产品图监修通过 填写修改地址*/}
            <AddressModal/>

            {/*无账户信息-申请收款  */}
            <CollectionModal/>

          </div>

        </div>

      </div>
    );
  }
}
