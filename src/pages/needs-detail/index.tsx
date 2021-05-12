import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/needs_detail.scss";
import ScrollTop from "@components/scroll-top";
import Alert from '@components/alert';
import ic_user from '@assets/images/logo_user2.jpg';
import noip_ipc from '@assets/images/default_img_short.png';

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

@inject('need_detail', 'login')
@observer
export default class NeedDetail extends React.Component<IProps, IDetailState> {
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
    document.title = "IP二厂-IP需求详情页";
    await this.getDetail();
  }

  async getDetail() {
    const { match, login, need_detail } = this.props;
    let param = {
      portalPostGuid: match.params['id'],
      userGuid: login.userInfo && login.userInfo['userGuid'] ? login.userInfo['userGuid'] : null,
    };
    let result = await need_detail.getDetail(param);
    if (result.request === false) {
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

  render() {
    const { show, message, } = this.state;
    const { need_detail, } = this.props;
    const { detailData } = need_detail;

    return (
      <div className="needs-content">
        {
          detailData &&
          <div className="industry_detail clearfix">
            <div className="industry_detail_one">
              <h4 className="word-ellipsis">{detailData.postTitle}</h4>
              <div className="industry_detail_user">
                <div className="industry_detail_user_one">
                  <div className="media">
                    <div className="media-left"
                         onClick={() => {
                           this.props.history.push(`/business-homepage/${detailData.createUserGuid}`);
                         }}>
                      <img className="media-object" src={detailData.userPicUrl || ic_user} alt=""/>
                    </div>
                    <div className="media-body">
                      <p>{detailData.userLogin}</p>
                      <span>{detailData.createDateStr}</span><span className="jubo">{/* 举报 */}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail_img" dangerouslySetInnerHTML={{ __html: detailData.postContent }}>
              </div>
            </div>
            <div className="industry_detail_two">
              {
                (detailData.ipTypeSuperiorNumber || detailData.ipid) &&
                <div className="head_user">
                  <p className="p1">关联IP</p>
                  <div className="ip_relevance">
                    <div className="ip_single">
                      <div className="img_box"
                           onClick={
                             () => this.props.history.push(`/detail/${detailData.ipTypeSuperiorNumber}/${detailData.ipid}`)
                           }>
                        <img src={detailData.ipPicUrl || noip_ipc} alt=""/>
                      </div>
                      <span className="span_name word-ellipsis">{detailData.ipName}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

        }<ScrollTop contrast={false}/>
        {show &&
        <Alert message={message}
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
