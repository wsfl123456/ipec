import * as React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import Alert from '@components/alert';
import { sendUserBehavior } from '@utils/util';

interface ICoreProduct extends IComponentProps {
  data: any;
  history: any;
  message: string,
}

interface ICoreProductState {
  message: string,
  isAlert: boolean,
  url: string,
}

@inject("authorize", "user", 'login', 'ip_list')
@observer
export default class CoreProduct extends React.Component<ICoreProduct, ICoreProductState> {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isAlert: false,
      url: '/',
    };
  }

  render() {
    const { data, login, ip_list } = this.props;
    const Info = toJS(this.props.user.personInfo);
    const InfoCompany = toJS(this.props.user.companyInfo);
    const exhibitionGuid = Info.exhibitionGuid ? Info.exhibitionGuid : InfoCompany.exhibitionGuid;
    const { url } = this.state;
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        {this.state.isAlert &&
        <Alert
          message={this.state.message}
          onClose={() => {
            this.setState({ isAlert: false });
          }}
          onSubmit={() => {
            this.props.history.push(url);
          }}
        />
        }
        <span className="span-title">{data.moduleName || "核心产品"}</span>
        <ul className="product-case flex-row justify-content-between flex-wrap">
          {
            data.map((item: any, index: number) => {
              let { dataName: name, } = item;

              return (
                <li
                  key={index}
                  className="flex-column align-items-center justify-content-center"
                  style={{ width: data.length > 3 ? '2.58rem' : '3.66rem' }}
                  onClick={() => {

                    if (item.remark !== '/ip-data') {
                      sendUserBehavior({
                        pageName: name,
                        pageUrl: item.remark,
                        type: 2,
                        remark: ''
                      });
                    }

                    if (!login.userInfo && (item.remark === "/matchmaking" || item.remark === "/ecosphere")) {
                      this.setState({
                        message: '请登陆后进行操作', isAlert: true, url: '/login',
                      });
                    } else if (login.userInfo && exhibitionGuid && item.remark === "/matchmaking") {
                      this.props.history.push(`${item.remark}/${exhibitionGuid}`);
                    } else if (login.userInfo && !exhibitionGuid && item.remark === "/matchmaking") {
                      this.setState({
                        message: '当前展会已下架 敬请期待下一次展会', isAlert: true, url: '/',
                      });
                    } else {
                      if (item.remark === "/ip-list") {
                        ip_list.customStatus.selected = '';
                      }
                      this.props.history.push(`${item.remark}`);

                    }
                  }}
                >
                  <img src={item.dataPicUrl} alt=""/>
                  <span className='title'> {name}</span>
                  <span style={{ textAlign: data.length > 3 ? 'left' : 'center' }}> {item.dataDesc}</span>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}
