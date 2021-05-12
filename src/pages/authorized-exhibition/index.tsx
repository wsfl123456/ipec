import * as React from 'react';
import { observer } from "mobx-react";
import { Confirm, Home, Ticket, Trade } from './components/index';
import ScrollTop from "@components/scroll-top";
import '@assets/scss/authorized_exhibition.scss';

interface IAuthorizedState {
  data?: any,
}

@observer
export default class AuthorizedExhibition extends React.Component<IProps, IAuthorizedState> {
  setTradeGuid = async (guid) => {
    this.props.history.push(`/authorized-exhibition/${guid}`)
  };

  // 授权展页面type类型不同跳转不同[教导主任在线解说]
  typeRender(type: string) {
    if (type && type !== 'confirm' && type !== 'ticket') {
      type = 'other';
    } else if (!type) {
      type = '_default';
    }
    const { history, match, location } = this.props;
    const tmp = {
      ticket: <Ticket history={history}/>,
      confirm: <Confirm history={history} match={match} location={location}/>,
      other: <Trade exhibitionGuid={type} history={history}/>,
      _default: <Home setTradeGuid={this.setTradeGuid} history={history}/>,
    };
    return tmp[type];
  }

  render() {
    return (
      <div id="autherized">
        {this.typeRender((this.props.match.params as any).type)}
        <ScrollTop contrast={false}/>
      </div>
    )
  }
}
