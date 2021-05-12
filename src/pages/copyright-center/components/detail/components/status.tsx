// 订单状态
import * as React from 'react';

export default () => {
  return(
    <div className="state-content">
      <div className="icon icon-132"/>
      <p>当前订单状态：买家已付款获得IP图库授权，进入产品设计图设计阶段 </p>
      <div className="desc"> <span className="red">拒绝原因</span>若产品图一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确认产品图是否可以生产。</div>
      <div className="img-group">
        <img src="" alt=""/>
        <img src="" alt=""/>
      </div>
      <div className="btn-group">
        <button className="btn-info">提醒买家上传产品图</button>
        <button className="btn-info small">监修通过</button>
        <button className="btn-info small bg-white">监修不通过</button>
      </div>
      <div className="no-success">
        <p>当前订单状态：买家已付款获得IP图库授权，进入产品设计图设计阶段 </p>
        <div className="desc"> <span className="red">拒绝原因</span>若产品图一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确认产品图是否可以生产。</div>
        <div className="img-group">
          <img src="" alt=""/>
          <img src="" alt=""/>
        </div>
      </div>
    </div>
  )
};
