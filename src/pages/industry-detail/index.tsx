import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/industry_detail.scss";
import ScrollTop from "@components/scroll-top";
import Alert from '@components/alert';
import ic_user from '@assets/images/logo_user2.jpg';
import noip_ipc from '@assets/images/default/ic_default_shu.png';
import { Link } from 'react-router-dom';
import { sendUserBehavior } from '@utils/util';

interface IDetailState {
  data: string[],
  show: boolean,
  uploadShow: Boolean,
  modelState: Boolean,
  result: any,
  message: string,
  url: any;
  buttonValue: string,
}

@inject('industry_detail', 'login')
@observer
export default class Detail extends React.Component<IProps, IDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      show: false,
      uploadShow: false,
      modelState: false,
      result: '',
      message: '',
      url: null,
      buttonValue: '',
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-行业案例详情页";
    await this.getdetail();
    const { industry_detail, match: { params } } = this.props;

    // await sendUserBehavior({
    //   pageName: industry_detail && industry_detail.postTitle,
    //   pageUrl: `/industry-detail/${params['ipid']}`,
    //   type: 7,
    //   remark: params['ipid']
    // });

  }

  async getdetail() {
    const { match, login, industry_detail } = this.props;
    let param = {
      portalPostGuid: match.params['ipid'],
      userGuid: login.userInfo && login.userInfo['userGuid'] ? login.userInfo['userGuid'] : null,
    };
    let result = await industry_detail.getDetail(param);
    if (result.request) {
      this.setState({ result: result.result });
    } else {
      this.setState({
        message: result.result.errorMsg,
        show: result.request,
      });
    }
  }

  _state(message, url?: string, buttonValue?: string) {
    this.setState({
      show: true,
      message, // "您还未登陆或者实名认证!",
      url,
      buttonValue,
    });
  }

  /**
   * POST setLike 设置点赞
   * isLike 1表示点赞 0表示取消点赞
   * portalPostGuid url参数
   */
  async setLike() {
    const { match, login, industry_detail } = this.props;
    let param = {
      portalPostGuid: match.params['ipid'],
      userGuid: login.userInfo['userGuid'],
    };
    let isSuccess = await industry_detail.setLike(param);
    if (isSuccess.request) {
      // 重新获取详情数据'
      await this.getdetail();
    } else {
      this.setState({ message: isSuccess.result, show: true });
    }
  }

  sharetip() {
    let url = window.location.href,
      title = 'titleEdit';
    let sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url;
    window.open(sharesinastring, 'newwindow', 'height=500,width=500,top=100,left=100');
  }

  qqShare() {
    let p: any = {
      url: window.location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
      desc: '发送信息给好友',
      title: this.state.result.postTitle, /*分享标题(可选)*/
      summary: '', /*分享摘要(可选)*/
      pics: '', /*分享图片(可选)*/
      flash: '', /*视频地址(可选)*/
      site: window.location.href, /*分享来源(可选) 如：QQ分享*/
      style: '203',
      width: 16,
      height: 16
    };
    let s = [];
    for (let i in p) {
      if (p.hasOwnProperty(i)) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
      }
    }
    let qhref = "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
    window.open(qhref, 'newwindow', 'height=500,width=500,top=100,left=100');
  };

  render() {
    let { login } = this.props;
    const { show, message, result } = this.state;
    const ipid = this.props.match.params['ipid'];
    if (!login.userInfo) {
      localStorage.setItem("historyUrl", `industry-detail/${ipid}`);
    }
    return (
      <div className="industry_body body ">
        <div className="industry_detail clearfix">
          <div className="industry_detail_one">
            <h4>{result.postTitle}</h4>
            <div className="industry_detail_user">
              <div className="industry_detail_user_one">
                <div className="media">
                  <div className="media-left"
                       onClick={() => {
                         this.props.history.push(`/business-homepage/${result.createUserGuid}`);
                       }}>
                    <img className="media-object" src={result.userPicUrl || ic_user} alt=""/>
                  </div>
                  <div className="media-body">
                    <p>{result.userLogin}</p>
                    <span>{result.createDateStr}</span><span className="jubo">{/* 举报 */}</span>
                  </div>
                </div>
              </div>
              <div className="industry_detail_user_two">
                {result.isGiveLike === 1 ? (
                  <i className="icon iconfont iconic_praise active" onClick={() => {
                    if (!localStorage.getItem("user")) {
                      let message = "您还未登陆！",
                        buttonValue = '去登陆',
                        url = '/login';
                      localStorage.setItem('historyUrl', `industry-detail/${ipid}`);
                      this._state(message, url, buttonValue);
                    } else {
                      this.setLike();
                    }
                  }}/>
                ) : (
                  <i className="icon iconfont iconic_praise" onClick={() => {
                    if (!login.userInfo) {
                      let message = "您还未登陆！",
                        buttonValue = '去登陆',
                        url = '/login';
                      localStorage.setItem('historyUrl', `industry-detail/${ipid}`);
                      this._state(message, url, buttonValue);
                    } else {
                      this.setLike();
                    }
                  }}/>
                )}
                <span className="span1">{result.portalPostLikeCount}</span>
                {/* <div className="divimg">
                  <div className="bdsharebuttonbox bdshare-button-style0-32" data-bd-bind="1556087003897">
                     <a href="javascript:;" className="bds_tsina" data-cmd="tsina" title="分享到新浪微博" onClick={() => {
                      this.sharetip();
                    }}/>
                     <a href="javascript:;" className="bds_weixin" data-cmd="weixin" title="分享到微信"/>
                    <a href="javascript:;" className="bds_sqq" data-cmd="sqq" title="分享到QQ好友" onClick={() => {
                      this.qqShare();
                    }}/>
                  </div>
                </div>*/}
              </div>
            </div>
            <div className="detail_img" dangerouslySetInnerHTML={{ __html: result.postContent }}>
            </div>
          </div>
          <div className="industry_detail_two">
            {
              (result.ipTypeSuperiorNumber || result.ipid) &&
              <div className="head_user">
                <p className="p1">关联IP</p>
                {
                  result.ipName &&
                  <p className="p2">
                    <i className="icon iconfont icon-ic_url"/>
                    <span className="span_name">{result.ipName}</span>
                  </p>
                }
                {
                  result.ipid ?
                    <Link to={`/detail/${result.ipTypeSuperiorNumber}/${result.ipid}`} style={{ overflow: "hidden" }}>
                      <div className="people_img">
                        <img src={result.ipPicUrl || noip_ipc} alt=""/>
                      </div>
                    </Link>
                    :
                    <a href="javascript:" style={{ overflow: "hidden" }}>
                      <div className="people_img">
                        <img src={result.ipPicUrl || noip_ipc} alt=""/>
                      </div>
                    </a>
                }
              </div>
            }

            {
              result.portalPostGuidRelate &&
              <div className="list_user">
                <div>
                  <p className="p3">
                    <i className="icon iconfont icon-ic_url"/>
                    <span>相关行业案例</span>
                  </p>
                  <div className="list_user_img">
                    <div className="people_img editHeight"
                         onClick={() => {
                           if (!result.portalPostGuidRelate) return false;
                           this.props.history.push(`/ip-research`);
                           setTimeout(() => {
                             let url: string;
                             Number(result.postTypeRelate) === 4 ? url = 'needs-detail' : url = 'industry-detail';
                             this.props.history.push(`/${url}/${result.portalPostGuidRelate}`);
                           });
                         }}>
                      <img src={result.pcPicUrl || noip_ipc} alt=""/>
                    </div>
                    <p className="p_hover">{result.postTitleRelate}</p>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
        <ScrollTop contrast={false}/>
        {show && <Alert message={message}
                        buttonValue={this.state.buttonValue}
                        onClose={() => {
                          this.setState({ show: false });
                        }}
                        onSubmit={() => {
                          this.props.history.push(this.state.url);
                        }}
        />
        }

      </div>
    );
  }
}
