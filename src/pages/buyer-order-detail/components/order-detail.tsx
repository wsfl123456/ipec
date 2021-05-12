import * as React from "react";
import moment from 'moment';

export default (
  {
    isPay,
    buyerOrder,
  }
    :
    {
      isPay: boolean,
      buyerOrder: any,
    }) => {
  console.log(isPay);

  const { detailList: i } = buyerOrder;
  return (
    <div className="detail">
      <p className="title">订单详情</p>

      <div className="detail-content">
        <div className="msg">
          <p>卖家(IP图库版权/代理方)信息</p>
          <div className="msg-div">企业名称：
            <span>{i.sellerCompanyName}</span>
          </div>
          <div className="msg-div">经营范围：
            <span>{i.sellerCompanyDesc}</span>
          </div>

        </div>
        <div className="msg order-msg">
          <p>订单信息</p>
          <div className="msg-div">订单号：<span>{i.orderSn}</span></div>
          <div className="msg-div">创建时间：<span>{moment(i.createDate).format('YYYY-MM-DD HH:MM:SS')}</span></div>
          {
           isPay && <div className="msg-div">付款时间： <span>{moment(i.paymentDate).format('YYYY-MM-DD HH:MM:SS')}</span></div>
          }
          {isPay &&
          <div
            className="msg-div">收货信息： <span>{i.businessConsignee}（收）/{i.businessMobile}/{i.businessAddress } {i.businessAddressDetail } </span>
          </div>}
          {/*{isPay && <div className="msg-div">发票类型： <span>未开具发票</span></div>}*/}
          <table className="table-detail">
            <tr>
              <td>图库商品</td>
              <td>授权品类</td>
              <td>授权期限</td>
              <td>授权生产数量（个）</td>
              <td>买家预估生产量(个)</td>
              <td>授权金额</td>
              <td>防伪码价格</td>
              <td>应付金额</td>
            </tr>
            <tr>
              <td>
                <div className="pic">
                  <img src={i.picUrl} alt=""/>
                  <div className="pic-desc">
                    <p className="word-ellipsis">{i.ipGallery && i.ipGallery.title}</p>
                    <p>尺寸、分辨率：{i.ipGallery.ipGalleryFileVO.imageWide} *{i.ipGallery.ipGalleryFileVO.imageHigh}像素/{i.resolvingPower} </p>
                    <p>文件大小：{i.ipGallery && i.ipGallery.fileSize}</p>
                    <p>文件格式：{i.ipGallery.ipGalleryFileVO.colorFormat}</p>
                  </div>
                </div>
              </td>
              <td>{i.authorizeType}</td>
              <td>{i.duration}个月</td>
              <td>{i.productionQuantityMin}-{i.productionQuantityMax}</td>
              <td>
                <div className="num">
                  {i.productionQuantity}
                  <span>买家已同意从平台采购防伪码便于后续版权方方位溯源</span>
                </div>
              </td>
              <td>¥{i.price - i.securityCodeUnitprice * i.productionQuantity}</td>
              <td>{i.securityCodeUnitprice * i.productionQuantity}</td>
              <td>￥{i.price}</td>
            </tr>
          </table>
          <div className="table-price">
            {
              isPay ?
                <p>实付金额： <span>¥{i.price}</span></p>
                :
                <p>应付金额： <span>¥{i.price}</span></p>
            }
          </div>
        </div>
      </div>

    </div>
  );
}
