import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Member extends React.Component {
  render() {
    return (
      <div className="no-auth">
        <p>此数据仅为VIP会员可见，如需查看请先开通会员</p>
        <Link to="/register" className="button"><div>立即开通</div></Link>
      </div>
    );
  }
}
