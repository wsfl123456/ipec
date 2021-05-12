import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Vip extends React.Component {
  render() {
    return (
      <div className="no-auth">
        <Link to="/ip-data" className="words-detail">该数据仅为白银会员以上用户可见，如需查看请先升级,<i>了解数据和收费方式</i></Link>
        <Link to="/user/12" className="button"><div>立即升级</div></Link>
      </div>
    );
  }
}
