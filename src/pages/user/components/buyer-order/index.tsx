// 买方-购买订单列表
import * as React from 'react';
import 'assets/scss/buyer_order.scss';
import icon_look from '@assets/images/copyright-center/icon_look.png';
import _isEmpty from 'lodash/isEmpty';
import btnGroupsFun from './paystatus_btn_render';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  CancelModal,
  CodeModal,
  LogisticsModal,
  PostAddress, UploadModal
} from '@pages/user/components/buyer-order/components/index';
import NoResult from '@components/no_result';
import { LookBigImg } from '@pages/copyright-center/components';
import moment from 'moment';
import { _throttle } from '@utils/util';
import GalleryPay from "./components/pay"
interface IOderState {
  tabs: any[],
  tabIndex: number | string,
}

@inject('buyerOrder', 'login', 'copyrightCenter')
@observer
export default class BuyerOrder extends React.Component<any, IOderState> {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { idx: '', name: '全部' },
        { idx: 0, name: '待支付' },
        { idx: 3, name: '待监修产品图' },
        { idx: 5, name: '待监修样品' },
        { idx: 7, name: '交易成功' },
      ],
      tabIndex: '',
    };
  }

  async componentDidMount() {
    const { buyerOrder, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    await buyerOrder.changeListParams({ userGuid, payStatue: '', type: 1, currentPage: 1 });
    window.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll);
  }

  // 订单状态Top
  topTitle(item) {
    const { payStatue, againAudit, orderSn } = item;
    if (payStatue || payStatue === 2 && !againAudit) {
      return (<span className="state">待您提交设计图</span>);
    } else if (payStatue === 3) {
      return (<span className="state">待卖家监修设计图</span>);
    } else if (payStatue === 2 && againAudit) {
      return (<span className="warning">产品图监修未通过，待您再次提交监修，<Link
        to={`/buyer-order-detail/${orderSn}`}>查看详情</Link></span>);
    } else if (payStatue === 4 && !againAudit) {
      return (<span className="state">待您邮寄样品</span>);
    } else if (payStatue === 5) {
      return (
        <div>
          <span className="express">{item.logisticsInfo}</span>
          <span className="state">待卖家监修样品</span>
        </div>
      );
    } else if (payStatue === 4 && againAudit) {
      return (<span className="warning">样品监修未通过，待买家再次邮寄样品，<Link
        to={`/buyer-order-detail/${orderSn}`}>查看详情</Link></span>);
    } else if (payStatue === 6) {
      return (<span className="state">待平台邮寄防伪码</span>);
    } else if (payStatue === 7) {
      return (
        <div>
          <span className="express">{item.logisticsInfo}</span>
          <span className="warning">防伪码已寄出 ，请注意查收！</span>
        </div>
      );
    }
  }

  // 订单状态
  orderState(item) {
    const { payStatue } = item;
    if (payStatue === 0) {
      return (<span>待支付</span>);
    } else if (payStatue === 1 || payStatue === 2 || payStatue === 3) {
      return (<span>待监修设计图</span>);
    } else if (payStatue === 4 || payStatue === 5) {
      return (<span>待监修样品</span>);
    } else if (payStatue === 6 || payStatue === 7) {
      return (<span>授权交易成功</span>);
    }
  }

  picUrl(i) {
    const { buyerOrder, copyrightCenter } = this.props;
    let sampleUrlArr = [];
    let designUrlArr = [];
    if (i.ipGalleryOrderSample && i.ipGalleryOrderSample.samplePicUrl) {
      sampleUrlArr = i.ipGalleryOrderSample.samplePicUrl.split(',');
      return (
        <div className="num flex-column align-items-center justify-content-center"
             onClick={() => {
               buyerOrder.bigImgList = sampleUrlArr;
               copyrightCenter.changeImgShow(true);
             }}>
          <img src={icon_look} alt=""/>
          <span>数量({sampleUrlArr.length})</span>
        </div>
      );
    }
    if (i.ipGalleryOrderDesigns && i.ipGalleryOrderDesigns.fileUrl) {
      designUrlArr = i.ipGalleryOrderDesigns.fileUrl.split(',');
      return (
        <div className="num flex-column align-items-center justify-content-center"
             onClick={() => {
               buyerOrder.bigImgList = designUrlArr;
               copyrightCenter.changeImgShow(true);
             }}>
          <img src={icon_look} alt=""/>
          <span>数量({designUrlArr.length})</span>
        </div>
      );
    }
  }

  scroll = () => {
    const { buyerOrder } = this.props;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    // console.log(yScroll + document.body.clientHeight, "scroll:" + document.body.scrollHeight);
    if ((yScroll + document.body.clientHeight + 300) >= document.body.scrollHeight) {
      let currentPage = buyerOrder.listParams.currentPage + 1;
      if (!buyerOrder.isLoading && buyerOrder.orderList.length >= buyerOrder.listParams.pageSize) {
        buyerOrder.isLoading = true;
        _throttle(buyerOrder.changeListParams({ currentPage }), 3000);
      }

    }
  };

  render() {
    const { tabs, tabIndex } = this.state;
    const { buyerOrder, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    const { orderList, orderSn, bigImgList, seeMore, noMore, weChatPay, alipay, curOrder, detailList } = buyerOrder;
    // const orderSn: string = buyerOrder && buyerOrder.orderSn || '';
    return (
      <div className="right-main">
        <p className="title-purple">授权购买订单</p>
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
                    await buyerOrder.changeListParams({ payStatue: i.idx, currentPage: 1 });
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
                          className="word-ellipsis">{i.ipGalleryPriceVO && i.ipGalleryPriceVO.authorizeType}</span></p>
                        <p className="align-items-center">授权期限： <span
                          className="word-ellipsis">{i.ipGalleryPriceVO && i.ipGalleryPriceVO.duration}</span></p>
                        <p className="align-items-center">生产数量： <span
                          className="word-ellipsis">{i.ipGalleryPriceVO && i.ipGalleryPriceVO.productionQuantityMin}-{i.ipGalleryPriceVO && i.ipGalleryPriceVO.productionQuantityMax}</span>
                        </p>
                        <p className="align-items-center">卖&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;家：<span
                          className="word-ellipsis">{i.sellerCompanyName}</span></p>
                        <p className="align-items-center">创建时间：<span
                          className="word-ellipsis">{moment(i.createDate).format('YYYY-MM-DD HH:mm:ss')} </span>
                        </p>
                      </div>
                      <p className="price">￥{i.payAmount}</p>
                      <div className="status flex-column ">
                        {/* 订单状态*/}
                        {this.orderState(i)}
                        <Link className="u-link" to={`/buyer-order-detail/${i.orderSn}`}>订单详情</Link>
                        {/*设计图、样品物流凭证*/}
                        {this.picUrl(i)}
                      </div>
                      {/*操作按钮*/}
                      {btnGroupsFun(i, buyerOrder, userGuid)}
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
        {/*  查看大图组件*/}
        <LookBigImg arr={bigImgList}/>

        {/* 取消订单原因弹窗*/}
        <CancelModal orderSn={orderSn}/>

        {/* 获取防伪码提示弹窗*/}
        <CodeModal/>

        {/* 查看邮寄地址弹窗*/}
        <PostAddress/>

        {/* 物流单号弹窗*/}
        <LogisticsModal />

        {/* 上传弹窗*/}
        <UploadModal orderSn={orderSn}/>

        {alipay && weChatPay && (
          <GalleryPay
            alipay={alipay}
            weChatPay={weChatPay}
          />
          // <GalleryPay
          //   galleryInfo={galleryInfo}
          //   galleryDetail={galleryDetail}
          //   orderParams={orderParams}
          //   getPayStatus={getPayStatus}
          //   alipay={alipay}
          //   weChatPay={weChatPay}
          //   closeModal={changePayCode}
          //   downloadGallery={downloadGallery}
          //   changepaySuccess={this.changepaySuccess}
          // />
        )}
      </div>
    );
  }
}
