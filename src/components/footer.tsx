import * as React from "react";
import { Link } from "react-router-dom";
import "@assets/scss/footer.scss";
import { inject, observer } from 'mobx-react';

interface IFooterProps extends IComponentProps {
  style?: object;
}

@inject('nav_store')
@observer
export default class Footer extends React.Component<IFooterProps> {
  render() {
    const { style = {}, nav_store } = this.props;
    const { footerNav: data } = nav_store;
    return (
      <div style={{ ...style }} className="footer-container flex-column flex-fill">
        <div className="operation flex-row flex-fill">
          <div className="flex-fill flex-row justify-content-between column-container">
            {data && data.map((item, index) => {
              return (
                <ul key={index} className=" operation-column flex-column">
                  <li><span>{item.navName || ""}</span></li>
                  {
                    item.sublist && item.sublist.map((sub: any, i: number) => {
                      let idx = i + "sublist";
                      if (sub.navName === '联系客服') {
                        let url = 'https://html.ecqun.com/kf/sdk/openwin.html?corpid=13158054&cstype=rand&mode=0&cskey=qhazuBRab5zfY4Jp91&scheme=0&source=100';
                        return (
                          <li key={idx}>
                            <a href={url} target="_blank">{sub.navName}</a>
                          </li>
                        );
                      } else {
                        return (
                          <li key={idx}>
                            <Link to={sub.navUrl}>{sub.navName}</Link>
                          </li>
                        );
                      }

                    })
                  }
                </ul>
              );
            })}
            {/*<ul className="operation-column  flex-column">*/}
            {/*<li className="justify-content-end">*/}
            {/*<ul className="pull-right">*/}
            {/*<span className="special">商务合作</span>*/}
            {/*<li>021-5280 9679(周一到周五 8：00-18：00)</li>*/}
            {/*<span className="special">版权方合作</span>*/}
            {/*<li>business@cooltour.fun</li>*/}
            {/*<span className="special">品牌主合作</span>*/}
            {/*<li>微信号：cooltour_ipec</li>*/}
            {/*</ul>*/}
            {/*<ul className="clearfix"></ul>*/}
            {/*</li>*/}
            {/*</ul>*/}
          </div>
        </div>
        <div className="footer-bottom">
          <div>Copyright &copy; 2019 沪ICP备18022525号. All rights reserved.
          </div>
        </div>
      </div>
    );
  }
}
