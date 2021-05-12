/**
 *  使用指南
 */
import * as React from "react";
import "@assets/scss/explain.scss";
import ScrollTop from "@components/scroll-top";
import explain_business from '@assets/images/explain/explain_business.png';
import explain_company from '@assets/images/explain/explain_company.png';
import explain_people from '@assets/images/explain/explain_people.png';

import { Menu } from 'antd';

const { SubMenu } = Menu;

interface IExplainState {
  tab: number,
  show: boolean,
  openKeys: any,
}

export default class Explain extends React.Component<IProps, IExplainState> {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      show: false,
      openKeys: ['sub1'],
    };
  }

  rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];

  async componentDidMount() {
    document.title = "IP二厂-使用指南";
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (openKeys.length === 0) {
      this.setState({
        openKeys: this.state.openKeys
      });
    } else {
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }

  };

  render() {
    const { openKeys } = this.state;
    return (
      <div className="body contact-container">
        <div className="main explain">
          <div className="explain-menu">
            <div className='title'>
              如何使用商贸配对系统
            </div>
            <Menu mode="inline" openKeys={this.state.openKeys}
                  style={{ width: 220, border: "none", borderRadius: "0 0 6px 6px" }}
                  className="blance-menu"
                  onOpenChange={this.onOpenChange}>
              <SubMenu key="sub1" className="blance-sub-menu"
                       title={
                         <span style={{ color: openKeys[0] === "sub1" ? "#6248ff" : "#495057" }}>CLE参展企业</span>
                       }
              >
                <Menu.Item key="1">注册企业账号</Menu.Item>
                <Menu.Item key="2">完善企业信息</Menu.Item>
                <Menu.Item key="3">上传授权IP</Menu.Item>
                <Menu.Item key="4">添加企业员工</Menu.Item>
                <Menu.Item key="5">设置参展人员</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                style={{ color: openKeys[0] === "sub2" ? "#6248ff" : "#495057" }}
                title={
                  <span>展商负责人</span>
                }
              >
                <Menu.Item key="5">注册个人账号</Menu.Item>
                <Menu.Item key="6">完善个人信息</Menu.Item>
                <Menu.Item key="7">申请加入企业</Menu.Item>
                <Menu.Item key="8">成为展商负责人</Menu.Item>
                <Menu.Item key="9">设置日程</Menu.Item>
                <Menu.Item key="10">处理收到的邀约</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                style={{ color: openKeys[0] === "sub3" ? "#6248ff" : "#495057" }}
                title={
                  <span>参展观众</span>
                }
              >
                <Menu.Item key="11">注册个人账号</Menu.Item>
                <Menu.Item key="12">完善个人信息</Menu.Item>
                <Menu.Item key="13">预登记观展</Menu.Item>
                <Menu.Item key="14">邀约展商负责人会面</Menu.Item>
                <Menu.Item key="15">处理发出的邀约</Menu.Item>
              </SubMenu>
            </Menu>
          </div>
          <div className="static-container" style={{ display: openKeys[0] === "sub1" ? 'block' : 'none' }}>
            <div className='explain-img'>
              <img src={explain_company} alt=''/>
            </div>
          </div>
          <div className="static-container" style={{ display: openKeys[0] === "sub2" ? 'block' : 'none' }}>
            <div className='explain-img'>
              <img src={explain_business} alt=''/>
            </div>
          </div>
          <div className="static-container" style={{ display: openKeys[0] === "sub3" ? 'block' : 'none' }}>
            <div className='explain-img'>
              <img src={explain_people} alt=''/>
            </div>
          </div>
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
