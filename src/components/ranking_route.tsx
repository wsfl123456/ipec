/**
 * 筛选器
 */
import * as React from "react";
import { Redirect, withRouter } from "react-router";
import { sendUserBehavior } from '@utils/util';

export default function RankingRoute(WrappedComponent) {
  if (!WrappedComponent) {
    throw new Error("missing component");
  }

  return withRouter(class extends React.Component<any> {
    constructor(props) {
      super(props);
    }
    async componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any){
      if (prevProps.location.pathname !== this.props.location.pathname) {
        await sendUserBehavior({
          pageName: '',
          pageUrl: this.props.location.pathname,
          type: 11,
          remark: ''
        });
      }
    }

    async componentDidMount() {
      await sendUserBehavior({
        pageName: '',
        pageUrl: this.props.location.pathname,
        type: 11,
        remark: ''
      });
    }
    render() {
      let hasRanking = true;
      let user = JSON.parse(localStorage.getItem('user'));
      if (user === null) {
        return <Redirect to="/login"/>;
      } else {
        // const rankingArr = [',3,', ',5,'];
        // const visibleRanking = rankingArr.some((e: string) => user.userJurisdiction.indexOf(e) !== (-1));
        // if (!visibleRanking) {
        //   localStorage.removeItem('contastList');
        //   localStorage.removeItem('ipTypeSuperiorNumber');
          // hasRanking = false;
        // }
      }

      // return !hasRanking ? <Redirect to="/404-page"/> : <WrappedComponent {...this.props}/>;
      return <WrappedComponent {...this.props}/>
    }
  });
}
