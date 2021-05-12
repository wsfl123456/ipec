/**
 * 钻石会员
 */
import * as React from "react";
import { Redirect, withRouter } from "react-router";
import { sendUserBehavior } from '@utils/util';

export default function DiamondsRoute(WrappedComponent) {
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
      let hasDiamonds = true;
      let user = JSON.parse(localStorage.getItem('user'));
      if (user === null) {
        return <Redirect to="/login"/>;
      } else {
        const memberLevel = Number(user.memberLevel);
        if (memberLevel < 3) {
          localStorage.removeItem('contastList');
          localStorage.removeItem('ipTypeSuperiorNumber');
          hasDiamonds = false;
        }
      }

      return !hasDiamonds ? <Redirect to="/404-page"/> : <WrappedComponent {...this.props}/>;
    }
  });
}
