import * as React from "react";
import { withRouter, Redirect } from "react-router";
import { sendUserBehavior } from '@utils/util';

export default function trackRoute(WrappedComponent) {
  if (!WrappedComponent) {
    throw new Error('missing component');
  }
  return withRouter(class extends React.Component<any> {
    constructor(props) {
      super(props);
    }

    async componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any) {
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
      let sUserAgent = navigator.userAgent;
      let mobileAgents = ['Android', 'iPhone', 'Symbian', 'WindowsPhone', 'iPod', 'BlackBerry', 'Windows CE'];
      let goUrl = 0;
      for (let i = 0; i < mobileAgents.length; i++) {
        if (sUserAgent.indexOf(mobileAgents[i]) > -1) {
          goUrl = 1;
          break;
        }
      }
      let pathname = this.props.location.pathname.split('/')[1];
      let guid = this.props.location.pathname.split('/')[2];
      let guid2 = this.props.location.pathname.split('/')[3];
      console.log(pathname, guid);
      let urlObjKV = {
        '': 'pages/index/index',
        'index': 'pages/index/index',
        'ip-list': 'pages/ip-list/ip-list',
        'ranking': 'pages/ip-ranking-list/ip-ranking-list',
        'ecosphere': 'pages/ecosphere/ecosphere',
        'ip-research': 'pages/ip-research/ip-research',
        'filter-forecast': 'pages/ip-sizer/ip-sizer',
        'user/0': 'pages/user/user',
        'industry-detail': `/pages/case-detail/case-detail?guid=${guid}`,
        'ip-detail':`pagesSub/charts/pages/ip-detail/ip-detail?ipTypeSuperiorNumber=${guid}&ipGuid=${guid2}`,

      };

      if (goUrl === 1) {
        window.location.href = `https://mobile.indexip.cn/#/${urlObjKV[pathname]} `;
      }
    }

    render() {
      ga('set', 'page', this.props.location.pathname);
      ga('send', 'pageview');
      return (
        this.props.computedMatch.isExact ? <WrappedComponent {...this.props}/> : <Redirect to='/404-page'/>
      );
    }

  });
}
