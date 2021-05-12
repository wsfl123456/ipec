import * as React from "react";
import ScrollTop from '@components/scroll-top';
import source from '@assets/images/source/source2.png';
import '@assets/scss/source.scss';

export default class Source extends React.Component<IProps, any> {
  async componentDidMount() {
    document.title = "IP二厂溯源链";
  }

  render() {
    return (
      <div className="main-container">
        <div className="source-container">
          <img src={source} alt=""/>
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
