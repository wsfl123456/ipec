import * as React from "react";

import ic_authorized from "@assets/images/ic_authorized.svg";
import ic_ip_inquiry from "@assets/images/ic_ip_inquiry.svg";
import ic_marketing from "@assets/images/ic_marketing.svg";
import ic_hyal from "@assets/images/ic_hyal.svg";
import ic_ipk from "@assets/images/ic_ipk.svg";
import ic_kfpt from "@assets/images/ic_kfpt.svg";
import { observable, toJS } from "mobx";
import _isEmpty from "lodash/isEmpty";
import { Link } from 'react-router-dom';

interface ITenTypeProps extends IComponentProps {
  data: any;
  ip_list: any;
}

export default class IpTenType extends React.Component<ITenTypeProps> {
  render() {
    let { data, ip_list } = this.props;
    let { head_list_top } = ip_list;
    const { subTypeList_top, typeSecond_top } = head_list_top;
    data = toJS(data);
    return (
      <div className="content-container flex-column justify-content-center align-items-center">
        {!_isEmpty(data) && <span className="span-title">IP库</span>}
        <ul className="ten-type flex-row  flex-wrap">
          {
            data && data.map((val: any, index: number) => {
              let { typeName, picUrl, childTypeList } = val;
              return <li key={index}>
                <Link to="/ip-list" className="flex-column align-items-center justify-content-center"
                      onClick={async () => {
                        // await ip_list.setInRout();
                        ip_list.ipTypeNav(typeName);
                      }}>
                  <img src={picUrl || ic_kfpt} alt=""/>
                  <span>{typeName}</span>
                </Link>
              </li>;
            })
          }
        </ul>
      </div>
    );
  }

  private icon(name: string): string {
    let iconObj = {
      "授权合作": ic_authorized,
      "IP查询": ic_ip_inquiry,
      "营销方案": ic_marketing,
      "开放平台": ic_kfpt,
      "IP库": ic_ipk,
      "IP行业案例": ic_hyal
    };
    return iconObj[name];
  }
}
