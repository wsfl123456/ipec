import * as React from "react";
import { observer } from "mobx-react";
import { Trade } from '@pages/authorized-exhibition/components/index';
import ScrollTop from "@components/scroll-top";

@observer
export default class Matchmaking extends React.Component<IProps, {}> {
  render() {
    const pathname = this.props.location.pathname;
    const pathnameIndex = pathname.lastIndexOf("/matchmaking/");
    const pathnameText = pathname.substring(pathnameIndex + 13);
    return (
      <div className="body">
        <Trade exhibitionGuid={pathnameText} history={this.props.history}/>
        <ScrollTop contrast={false}/>
      </div>
    );
  }
}
