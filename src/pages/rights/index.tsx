import * as React from "react";
import "@assets/scss/rule.scss";
import ScrollTop from "@components/scroll-top";
import { Link } from "react-router-dom";

export default class Rights extends React.Component<IProps> {

  render() {
    return (
      <div className="body contact-container">
        <div className="main clearfix">
          <div className="static-menu">
            <ul>
              {/*<li><Link to="/who_am_i">公司介绍</Link> </li>*/}
              {/*<li><Link to="/contact">联系我们</Link></li>*/}
              {/*<li><Link to="/join">加入我们</Link></li>*/}
              <li><Link to="/rule" className="">法务条款</Link></li>
              <li><Link to="/use">使用条款</Link></li>
              <li><Link to="/rights" className="curr">版权声明</Link></li>
            </ul>
          </div>
          <div className="static-container">
          <h1>版权声明</h1>
            <div className="container-inner">
                {/*<h2>版权声明：</h2>*/}
                <p>
                  本站所有的文章、图片及其他资源，若出处为“IP二厂”，即为本站原创或整理，版权归作者与本站共同所有。若作者有版权声明的或文章从其他网站转载而附带有原所有站的版权声明者，其版权归属以附带声明为准。<br/><br/>

                  本网站文章仅代表作者本人的观点，与本网站立场无关，作者文责自负。<br/><br/>

                  本网站所刊载的文章、图片及其他资料仅供参考使用。本站所刊载的内容，并不代表同意其说法或描述，仅为提供更多信息，也不构成任何学术建议。<br/><br/>

                  除特别注明禁止转载的文章外，欢迎公益性网站转载本站资源，但转载时请务必注明出处为“IP二厂”，如有可能，请做好本站的链接。<br/><br/>

                  本站部分资源来自互联网，我们转载的目的是用于更多同类信息，给网站浏览者提供更多参考，如果您认为我们的转载侵犯了您的权益，请与我们联系，我们将在3个工作日内删除相关内容。<br/><br/>

                  本网站之声明以及其修改权、更新权及最终解释权均属IP二厂网站所有。<br/><br/>

                  任何未尽事宜，请与我们联系：021-5280 9587<br/><br/>

                </p>
            </div>
          </div>
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
