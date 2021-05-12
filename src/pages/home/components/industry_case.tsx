import * as React from "react";
import { Link } from "react-router-dom";
import default_img_shu from "@assets/images/default/ic_default_shu.png";

interface IndustryCaseProps {
  data: any;
}

export default class IndustryCase extends React.Component<IndustryCaseProps> {
  render() {
    const { data } = this.props;
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        <span className="span-title">行业案例</span>
        <div className="industry-case flex-row justify-content-between flex-wrap">
          {
            data && data.map((item: any, index: number) => {
              return (
                <Link to={`/industry-detail/${item.dataGuid}`} key={index}>
                  <div className="case-area flex-column align-items-center">
                    <img className="case-img" src={item.dataPicUrl || default_img_shu} alt=""/>
                    <div className="case-text align-items-center justify-content-between ">
                      <div className="case-small-img"><img src={item.ipidPicUrl || default_img_shu}
                                                           alt=""/></div>
                      <div className="case-word">
                        <div className="title">{item.dataName}</div>
                        <div className="bottom-title flex justify-content-between ">
                          <span
                            className={`count attention_num icon iconfont iconic_praise`}>{item.portalPostLikeCount}</span>
                          {!!item.createDateStr &&
                          <span className="span-two">{item.createDateStr}</span>}
                        </div>
                      </div>
                      {/*<div className="flex-row justify-content-between align-items-center case-first-line">*/}
                      {/*<span className="first-line-span">{`${item.dataName}`}</span>*/}
                      {/*<i>{`${item.dataType}`}</i>*/}
                      {/*</div>*/}
                      {/*<span className="copyright-text">{`${item.dataDesc}`}</span>*/}
                    </div>
                  </div>
                </Link>
              );
            })
          }
        </div>
      </div>
    );
  }
}
