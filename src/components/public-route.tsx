import * as React from "react";
import { withRouter } from "react-router";

export default function publicRoute(WrappedComponent) {
  if (!WrappedComponent) {
    throw new Error("missing component");
  }

  return withRouter(class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { location: { pathname } }: any = this.props;
      return /login/.test(pathname) || /register/.test(pathname) ||
      /login-other/.test(pathname) || /authentication/.test(pathname) ||
      /update-password/.test(pathname) || /404-page/.test(pathname) || /double-screen/.test(pathname)
        ? <div style={{ display: 'none' }}/>
        : <WrappedComponent {...this.props}/>;
    }
  });
}
