import * as React from 'react';
import ic_user from '@assets/images/user.svg';
import 'assets/scss/aside.scss';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

interface IAsideProps extends IComponentProps {
  path: string;  // 路径-当前路径的选中状态
}

@inject("user_information", "login")
@observer
export default class Aside extends React.Component<IAsideProps, any> {

  async componentDidMount() {
    const { user_information, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };

    await user_information.getCompanyInfo(userGuid);
  }

  render() {
    const { path, user_information } = this.props;
    const { companyInfo } = user_information;
    return (
      <div className="copyright-aside">
        <div className="user-head">
          <img className="head-img" src={companyInfo.picUrl || ic_user} alt=""/>
          <div className="head-desc">
            <p className="word-ellipsis" title={companyInfo.companyName}>
              {companyInfo.companyName}
            </p>
          </div>
        </div>
        <div className="aside-routes">
          <div className="route-item guid">
            <span>版权方操作指南</span>
            <div className="route-item_child"> + 图库授权流程</div>
            <div className="route-item_child"> + 图库授权合同</div>
          </div>
          <div className="route-item copyright">
            <span>版权管理</span>
            <div className="route-item_child"> + IP管理</div>
            <Link to="/gallery/manage">
              <div className={`route-item_child ${path === '/gallery/manage' ? 'active' : ''}`}> + IP图库管理</div>
            </Link>
          </div>
          <Link to="/copyright">
            <div className={`route-item order ${path === '/copyright' ? 'active' : ''}`}>
              图库授权交易订单
            </div>
          </Link>

        </div>
      </div>
    );
  }
}
