/**
 * 筛选器
 */
import * as React from "react";
import { Redirect, withRouter } from "react-router";
import { sendUserBehavior } from '@utils/util';

export default function ForecastRoute(WrappedComponent) {
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
      let hasForecast = true;
      let user = JSON.parse(localStorage.getItem('user'));
      if (user === null) {
        return <Redirect to="/login"/>;
      }
      //  else {
      //   const forecastArr = [',3,', ',4,'];
      //   const visibleForecast = forecastArr.some((e: string) => user.userJurisdiction.indexOf(e) !== (-1));
      //   if (!visibleForecast) {
      //     localStorage.removeItem('contastList');
      //     localStorage.removeItem('ipTypeSuperiorNumber');
      //     hasForecast = false;
      //   }
      // }

      return !hasForecast ? <Redirect to="/404-page"/> : <WrappedComponent {...this.props}/>;
    }
  });
}
