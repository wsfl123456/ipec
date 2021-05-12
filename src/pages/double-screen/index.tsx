import * as React from "react";
import "@assets/scss/double-screen.scss";
import Code from "@assets/images/double-screen/code.jpg";
import Code2 from "@assets/images/double-screen/code-2.jpg";
import Loading from "@assets/images/double-screen/loading.gif";
import Circle from "@assets/images/double-screen/header.png";
import Bg from "@assets/images/double-screen/bg.png";
import Bg2 from "@assets/images/double-screen/bg-2.png";
import { eqRearchRecord } from "../../utils/api";

let intervalList = null;
let intervalRefresh = null;
let firstLoad = true;

export default class DoubleScreen extends React.Component {
  constructor(prop: any) {
    super(prop);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      list: [],
      curIndex: 0, //  页面当前显示数据的索引
      hasResult: null,
      ipPic: "",
      ipName: "",
      arithmaticHotspotPrice: "",
      beatPercentage: "",
      warSong: "",
      lastResult: [], //  存储接口返回结果未满10条的数据，用于拼接list
      isLoading: true,
      loadingPic: "",
    };
  }
  async getList() {
    const { currentPage, pageSize, list, lastResult }: any = this.state;
    const { result }: any = await eqRearchRecord({
      currentPage,
      pageSize,
    });

    if (currentPage === 1) {
      this.setState({
        list: result.data,
      });
    } else {
      //  如果上次掉接口返回的数据小于10，那么先剪切掉上次的数据，再把本次接口返回的数据进行拼接。否则直接拼接
      if (lastResult.length) {
        this.setState({
          list: [
            ...list.slice(0, list.length - lastResult.length),
            ...result.data,
          ],
        });
      } else {
        this.setState({
          list: [...list, ...result.data],
        });
      }
    }

    // 当前页返回的个数大于10才会修改当前页
    if (result.data.length === 10) {
      this.setState({ currentPage: currentPage + 1, lastResult: [] });
    } else this.setState({ lastResult: result.data }); //   如果当前页数据不足10条就存储下来，供下次调取接口时使用，否则就清空

    //  第一次掉接口时初始化数据
    if (firstLoad) {
      this.refresh();
      firstLoad = false;
    }
  }

  refresh() {
    const { list, curIndex }: any = this.state;
    this.setState({
      loadingPic: list[curIndex].ipPic,
    });
    setTimeout(() => {
      this.setState({
        isLoading: false,
        hasResult: list[curIndex].hasResult,
        ipPic: list[curIndex].ipPic,
        ipName: list[curIndex].ipName,
        arithmaticHotspotPrice: list[curIndex].arithmaticHotspotPrice,
        beatPercentage: list[curIndex].beatPercentage,
        warSong: list[curIndex].warSong,
      });
    }, 2000);

    //  播放到最后一条数据后，循环播放
    if (list.length - 1 === curIndex) {
      this.setState({
        curIndex: 0,
      });
    } else {
      this.setState({
        curIndex: curIndex + 1,
      });
    }
  }

  async componentDidMount() {
    this.getList();
    // 掉接口的定时器
    intervalList = setInterval(async () => {
      await this.getList();
    }, 30000);

    //  刷新页面数据的定时器
    intervalRefresh = setInterval(() => {
      this.refresh();
      this.setState({
        isLoading: true,
      });
    }, 10000);
  }

  componentWillUnmount() {
    intervalList = null;
    intervalRefresh = null;
  }

  render() {
    const {
      hasResult,
      loadingPic,
      isLoading,
      ipPic,
      ipName,
      arithmaticHotspotPrice,
      beatPercentage,
      warSong,
    }: any = this.state;
    return (
      <div
        className="double-screen"
        style={{
          backgroundImage: hasResult === 1 ? `url(${Bg})` : `url(${Bg2})`,
        }}
      >
        {/* 有结果 */}
        {hasResult === 1 && (
          <div className="double-screen_area">
            <div className="double-screen_area_header">
              <img
                className="double-screen_area_header_avator"
                src={ipPic}
                alt=""
              />
              <img
                className="double-screen_area_header_circle"
                src={Circle}
                alt=""
              />
              <div className="double-screen_area_header_name">{ipName}</div>
            </div>
            <div>
              <div className="double-screen_area_power-title">战力值</div>
              <div className="double-screen_area_power-val">
                {arithmaticHotspotPrice}
              </div>
              <div className="double-screen_area_power-perc">
                击败<span>{beatPercentage}</span>的同类IP
              </div>
              <div className="double-screen_area_assess-result">
                {!!warSong &&
                  warSong.split(";").map((e) => {
                    return <div>{e}</div>;
                  })}
              </div>
            </div>
          </div>
        )}
        {/* 无结果 */}
        {hasResult === 0 && (
          <div className="double-screen_no">
            <div className="double-screen_no_title">{ipName}</div>
            {/*<div className="double-screen_no_content">{warSong}</div>*/}
            <div className="double-screen_no_content">
              {!!warSong &&
              warSong.split(";").map((e) => {
                return <div>{e}</div>;
              })}
            </div>
            <div className="double-screen_no_code">
              <img src={Code} alt="" />
            </div>
            <div className="double-screen_no_text">录入补全IP信息</div>
            <div className="double-screen_no_text">让我们可以共同成长</div>
          </div>
        )}
        <div className="double-screen_code">
          <img src={Code2} alt="" />
          <div>
            <div>用AI给IP估个值</div>
            <div>扫描识别二维码</div>
          </div>
        </div>
        {/* 加载层 */}
        {isLoading && (
          <div className="double-screen_loading">
            <img className="double-screen_loading_code" src={Loading} alt="" />
            <img
              className="double-screen_loading_pic"
              src={loadingPic}
              alt=""
            />
          </div>
        )}
      </div>
    );
  }
}
