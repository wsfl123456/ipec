import * as React from "react";
import { Redirect, withRouter } from "react-router";
import { sendUserBehavior } from '@utils/util';

export default function privateRoute(WrappedComponent) {
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
      let hasLogin = true;
      const now = new Date().getTime();
      const waytime = 1000 * 60 * 60 * 24 * 30;
      const storage = window.localStorage;
      let user = JSON.parse(storage.getItem('user'));
      if (!localStorage.getItem("user")) {
        // 咩有会话登陆
        if (user === null || (now - user.time) > waytime) {
          localStorage.removeItem('contastList');
          localStorage.removeItem('ipTypeSuperiorNumber');
          hasLogin = false
        }
      }
      return !hasLogin ? (
        <Redirect to="/login"/>
      ) : <WrappedComponent {...this.props}/>;
    }
  });
}
