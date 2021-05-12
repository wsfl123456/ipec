import * as React from 'react';
import { Link} from 'react-router-dom';

interface INoLoginProps extends IComponentProps {
  id?: number,
  ipTypeNumber?: number;
}
export default class NoLogin extends React.Component <INoLoginProps> {
  render() {
    const { id, ipTypeNumber } = this.props;
    return (
      <div className="no-auth">
        <p>您还未登陆，需查看请先登陆后进行实名认证</p>
        <Link to='/login' className="button"
             onClick={() => {
               localStorage.setItem('historyUrl', `detail/${ipTypeNumber}/${id}`);
             }}>
          <div>立即登陆</div>
        </Link>
      </div>
    );
  }
}
