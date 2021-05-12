import * as React from "react";
import "@assets/scss/intention_exhibitor.scss";
import { getListBoothReservation, } from '@utils/api';
import { Input, Icon } from 'antd';
import default_img_ip from "@assets/images/default/ic_default_shu.png";

interface IIntentionExhibitorState {
  currentPage: number,
  pageSize: number,
  keyword: String,
  reservationList: any,
  canGetData: boolean,
}

export default class IntentionExhibitor extends React.Component<IProps, IIntentionExhibitorState> {
  // 初始化 state
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      keyword: "",
      reservationList: [],
      canGetData: true,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-意向展商";
    // 获取 预定展位展商List
    this.getBoothReservationList();
    window.addEventListener('scroll', this.scrollLoading);
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollLoading);
  }

  scrollLoading = async () => {
    let yScroll: number;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + 1050) >= document.body.scrollHeight) {
      if (!this.state.canGetData) {
        return
      } else {
        await this.activeGetList()
      }
    }
  };

  // 所有methods
  // 获取 预定展位展商List
  async getBoothReservationList() {
    let entity = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      keyword: this.state.keyword,
    };
    const { result }: any = await getListBoothReservation(entity);
    let newReservationList = this.state.reservationList.concat(result.data);
    this.setState({ reservationList: newReservationList })
  }

  async searchCompany(keyword) {
    await this.setState({ currentPage: 1, keyword, reservationList: [], });
    this.getBoothReservationList()
  }

  async activeGetList() {
    this.setState({ currentPage: this.state.currentPage + 1 });
    await this.getBoothReservationList();
    this.setState({ canGetData: true })
  }

  render() {
    const { reservationList } = this.state;
    return (
      <div className="intentionExhibitorBody">
        {/* 大标题 */}
        <div className="topTitle">
          <div className="title1">第十三届中国国际品牌授权展</div>
          <div className="title2">意向展商</div>
        </div>
        {/* 搜索关键字 */}
        <div className="midSearch">
          <Input size="large" placeholder="请输入关键字搜索" suffix={<Icon type="search"/>}
                 onPressEnter={(e) => this.searchCompany(e.currentTarget.value)}/>
        </div>
        {/* 意向展商List */}
        <div className="listBox">
          {reservationList.map((item, index) => {
            return (
              <div className="reservationDemo" key={index}>
                <img className="companyLogo" src={item.companyLogo ? item.companyLogo : default_img_ip} alt=''/>
                <div className="companyName">{item.companyName}</div>
                {/* <div className="company_type">{item.company_type}</div> */}
                <div className="company">参展品牌：{item.exhibitorIps}</div>
                <div className="intentionalArea">意向展位面积：{item.intentionalArea}</div>
                <div className="contacts">联系人：{item.contacts}</div>
                <div className="contactNumber">联系电话：{item.contactNumber}</div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}
