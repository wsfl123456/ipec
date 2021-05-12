import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Certification extends React.Component {
  render() {
    return (
      <div className="no-auth">
        <p>该数据仅为实名认证用户可见，如需查看请先认证</p>
        <Link to="/user/2" className="button"><div>立即认证</div></Link>
      </div>
    );
  }
}
