import * as React from "react";
import { Link } from "react-router-dom";
import default_img_ip from "@assets/images/default/ic_default_shu.png";
import renzheng from "@assets/images/renzheng.png";
import { sendUserBehavior } from '@utils/util';

interface IpListItemProps {
  data: any,
  ip_list: any,
  selected: any
}

export default class IpListItem extends React.Component<IpListItemProps> {
  async getUserBehavior(pageName, pageUrl, type, remark) {
    const params = {
      pageName,
      pageUrl,
      type,
      remark
    };
    await sendUserBehavior(params);
  }

  render() {
    const { data: item, ip_list } = this.props;
    let { isInRoute } = ip_list;

    return (
      <div
        className="content-container flex-column ">
        <div className="ip-s flex-row justify-content-between flex-wrap">
          <div className="ip-item-type">
            <img src={item.ipTypePicUrl || default_img_ip} alt=""/>
            <span className="ip-item-type-text">{item.ipType}</span>
            <a onClick={async () => {
              await this.getUserBehavior(item.type, '/ip-list', 4, '');
              if (!isInRoute) ip_list.setInRout();
              await ip_list.ipTypeNav(item.ipType);
              window.scrollTo(0, 0);
            }}>查看全部</a>
          </div>
          {
            item.sublist && item.sublist.map((val: any) => {
              // const { ipTags }: { ipTags: string } = val;
              const { ipTypeName }: { ipTypeName: string } = val;
              let sub_type = ipTypeName && ipTypeName.split(",");
              return (
                <Link to={`/detail/${val.ipTypeSuperiorNumber}/${val.ipid}`} key={val.id}
                      target="_blank"
                      onClick={() => {
                        ga('set', 'page', `/detail/${val.ipTypeSuperiorNumber}/${val.ipid}`);
                        ga('send', 'pageview');
                      }}
                      className="ip-item flex-column align-items-center ip-item-relative">
                  <div className="ip-item-imgOut">
                    <img className="ip-item-img" src={val.ipPic || default_img_ip} alt=""/>
                  </div>
                  {val.ipIsAuthenticated === 3 && <img src={renzheng} className="ip-item-certification" alt=""/>}
                  <span>{`${val.ipName}`}</span>
                  {/* <div className="ip-item-sub-type justify-content-around align-items-center flex-wrap">
                    {sub_type && sub_type.map((sub: string, idx: number) =>
                      <span className="ip-item-sub-type-span" key={idx}>{`${sub}`}</span>)}
                  </div> */}
                </Link>
              );
            })
          }
        </div>
      </div>
    );
  }
}
