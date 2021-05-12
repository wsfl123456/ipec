import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/personal_homepage.scss";
import ScrollTop from "@components/scroll-top";
import default_img_ip from "@assets/images/user.svg";

@inject('ecosphere')
@observer
export default class PersonalHomePage extends React.Component<IProps, any> {

  async componentDidMount() {
    document.title = "IP二厂-个人主页";
    const {  ecosphere } = this.props;
    const { falseData : personalSpaceInfo } = ecosphere ;
  }

  render() {
    const {  ecosphere } = this.props;
    const { falseData : personalSpaceInfo } = ecosphere ;

    return (
      <div className="body">
        <div className="personal-homepage-container">
          {/* 封面及个人信息 */}
          <div className="cover">
            {/* 封面 粉丝 头像 关注 */}
            <div className="coverTop">
              <div className="fans">粉丝<span>{personalSpaceInfo.fansNum || 0}</span></div>
              <div className="Avatar">
                <img src={personalSpaceInfo.picUrl || default_img_ip} alt=''/>
              </div>
              <div className="attention">关注<span>{personalSpaceInfo.fansNum || 0}</span></div>
            </div>
            {/* 姓名 公司 三个Btn */}
            <div className="coverBottom" style={{marginBottom: '160px'}}>
              <div className="name">{personalSpaceInfo.userRealName}</div>
              {personalSpaceInfo.companyName &&
              <div className="job">
                {personalSpaceInfo.occupation}@<span>{personalSpaceInfo.companyName}</span>
              </div>
              }
            </div>
          </div>
        </div>
        <ScrollTop/>

      </div>
    );
  }
}
