import * as React from "react";
import "@assets/scss/about.scss";
import ScrollTop from "@components/scroll-top";

interface IIntroduceState {
  type: number;
  url: string;
}

export default class Introduce extends React.Component<IProps, IIntroduceState> {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      url: 'https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/pc_00.jpg'
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-出道吧";
    let type = Number(this.props.match.params['type']);
    console.log(type);
    let obj = {
      1: 'https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/pc_00.jpg',
      2: 'https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/pc_01.jpg',
      3: 'https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/pc_02.jpg',
      4: 'https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/pc_03.jpg',
      5: 'https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_pic/pc_04.jpg',
    };
    this.setState({
      url: obj[type],
      type,
    });
  }

  render() {
    const { url, type } = this.state;
    console.log(url);
    return (
      <div className="body">
        <div
          style={{ width: '11.4rem', margin: '0 auto', position: 'relative', }}>
          <img style={{ width: '100%', height: '100%' }} src={url} alt=""/>
          {
            (type === 3 || type === 5) &&
            <a
              href='https://html.ecqun.com/kf/sdk/openwin.html?corpid=13158054&cstype=rand&mode=0&cskey=qhazuBRab5zfY4Jp91&scheme=0&source=100'
              target='_blank'
              style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '1.9rem',
                width: '4.32rem', height: '1.3rem', display: 'block',
              }}
            />
          }
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
