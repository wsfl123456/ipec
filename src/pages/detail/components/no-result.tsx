import * as React from 'react';
import { Link } from 'react-router-dom';

export default class NoResult extends React.Component {
  render() {
    return (
      <div className="no-auth">
        <p>暂无数据</p>
      </div>
    );
  }
}
