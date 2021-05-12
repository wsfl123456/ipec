import * as React from 'react'
import { inject, observer } from "mobx-react";
import '@assets/scss/confirm.scss'
import banner from "@assets/images/banner-ticket.jpg";
import logo from "@assets/images/logo.jpg";
import bottom from "@assets/images/bottom.jpg";
import left from "@assets/images/left.svg";
import { toJS } from "mobx";
import { Link } from "react-router-dom";

interface IConfirmStatus {
  userGuid: any,
}

@inject('authorize', 'user', 'login')
@observer
export default class Confirm extends React.Component<IProps, IConfirmStatus> {
  constructor(props: any) {
    super(props);
    this.state = {
      userGuid: JSON.parse(localStorage.getItem("user")),
    }
  }

  async componentDidMount() {
    document.title = "IP二厂- 查看门票";
    const { authorize, login, location } = this.props;
    const { userGuid } = login.userInfo;
    const { sn } = this.props.user.personInfo;
    const param = location.search.substr(1).match(/(^|&)sn=([^&]*)(&|$)/);
    if (param) {
      const params = {
        userGuid,
        sn: sn ? sn : param[2],
      };
      await authorize.getConfirm(params);
    }
  }

  render() {
    const { listConfirm } = this.props.authorize;
    const data = toJS(listConfirm);
    let _data = {
      name: '',
      appellation: '',
      sn: '',
      post: '',
      companyName: '',
      barcode: '',
      country: '',
      province: '',
      exhibitionAddress: '',
      organizers: '',
      contacts: '',
      contactsAppellation: '',
      contactNumber: '',
      exhibitionEmail: '',
      website: '',
      registerLocation: '',
      exhibitionTimes: []
    };
    Object.assign(_data, data);
    return (
      <div className='ticket-box'>
        <div className='tic-content'>
          <div className='img-top'>
            <img src={banner} alt=''/>
          </div>
          <div className='tic-title'>预登记确认函</div>
          <div className='letter'>
            <div className='letter-content'>
              <div className='introduce'>
                <div className='name'>尊敬的{_data.name}{_data.appellation}：</div>
                <div className='hi'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好！</div>
                <div
                  className='intro'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您在线预订第十三届中国品牌授权展览会门票，恭喜您已成功预登记，为了保证您到展会现场快捷换取胸卡，请打印此确认函或记录预登记
                  编码：<span>{_data.sn}</span> 到展会现场<span
                    className='place'>{_data.registerLocation}</span><span>“国内预登记买家”</span>柜台换取正式观众胸卡和免费会刊；本会展仅供16岁
                  以上业内人士参观。
                </div>
              </div>
              <div className='code'>
                <div className='code-left'>
                  <div className='top-border'>
                  </div>
                  <img src={logo} alt='' className='title-img'/>
                  <div className='name'>{_data.name}</div>
                  <div className='company'>{_data.post}@{_data.companyName}</div>
                  <div className='region'>{_data.country}&nbsp;&nbsp;&nbsp;&nbsp;{_data.province}</div>
                  <div className='confirm-code'><p>{_data.sn}</p></div>
                  <img src={_data.barcode} alt='' className='bar-code'/>
                  <img src={bottom} alt='' className='bottom'/>
                  <div className='bottom-border'>
                  </div>
                </div>
                <div className='code-right'>
                  <ul className='code-ul'>
                    <li>注：</li>
                    <li>1、本展会仅供16岁以上业内人士参观，观众入场请佩戴胸卡；</li>
                    <li>2、此信息必须真实有效，否则主办机构将视为无效登记；</li>
                    <li>3、您可以通过我们的网站<span style={{ color: '#007bff' }}><a href='http://www.chinalicensingexpo.com'
                                                                          target="_blank"> www.chinalicensingexpo.com </a></span>了解更多信息。
                    </li>
                  </ul>
                </div>
              </div>
              <div className='tips'>
                <div style={{ marginBottom: '0.14rem' }}>
                  <img src={left} alt='' style={{ marginRight: '0.1rem' }}/>
                  如需为您的同事登记，请点击这里<Link to='/register'><span style={{ color: '#007bff' }}>注册</span></Link>
                </div>
                <div>
                  <img src={left} alt='' style={{ marginRight: '0.1rem' }}/>
                  如需了解更多参展IP授权信息，对接更多品牌授权商，请登陆IP二厂查询平台 ，网址： <span style={{ color: '#007bff' }}><a
                  href='https://www.indexip.cn/#/ecosphere'
                  target="_blank">https://www.indexip.cn/#/ecosphere</a></span>
                </div>
                <div className='cont'>中国国际品牌授权展、中国国际玩具及教育设备展览会、中国国际婴童用品展览会、上海国际学前教育及装备展览会，为您带来更多市场商机及合作机会！</div>
                <div className='con-word'>参观时间
                  {
                    _data.exhibitionTimes && _data.exhibitionTimes.map((item, index) => {
                      return (
                        <ul key={index} className='confirm-ul'>
                          <li>{item}</li>
                        </ul>
                      )
                    })
                  }
                </div>
                <div className='con-word'>展览地点
                  <div className='con-place'>{_data.exhibitionAddress}</div>
                </div>
                <div className='con-word'>
                  联系我们
                  <ul className='call-us'>
                    <li>主办单位：<span>{_data.organizers}</span></li>
                    <li>联系人：<span>{_data.contacts}&nbsp;&nbsp;&nbsp;&nbsp;{_data.contactsAppellation}</span></li>
                    <li>联系电话：<span>{_data.contactNumber}</span></li>
                    <li>Email：<span style={{ color: '#007bff' }}>{_data.exhibitionEmail}</span></li>
                    <li>网址：<span style={{ color: '#007bff' }}><a href='http://www.chinalicensingexpo.com'
                                                                 target="_blank">{_data.website}</a></span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
