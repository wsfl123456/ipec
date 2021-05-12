import * as React from "react";
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/bar_darren.scss";
import { toJS } from "mobx";

interface IProps {
  container: any,
  data: any
}

export default class EchartLine extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  _moreCharts(xHot, yHot, container) {
    let myChart = echarts.init(document.querySelector("." + container) as HTMLDivElement);
  }

  option() {
    const { data } = this.props; // 替换雷达图分类的值
    // let _data = {
    //   title:"微博超话帖子数",
    //   name:['喵呜琪琪梦 echats—line-darren', '柴犬馒头','疯了, 瑰宝'],
    //   xAxis : ['周一','周二','周三','周四','周五','周六','周日'],
    //   series:[[27500000000, 27600000000, 27600000000, 27600000000, 27700000000, 27700000000, 27800000000],
    //   [4200000000, 4200000000, 4200000000, 4200000000, 4200000000, 4200000000, 4200000000, 4200000000]]
    //   // [60, 32, 101, 234, 190, 430, 40]],
    // };
    let _data = toJS(data);
    let _series = [],
      color = ['#6236ff', '#F7B500', '#E02020'],
      bgColor = ['#B09AFF', '#FBDB81', '#EF9090']
    ;
    _data && _data.name && _data.name.forEach((el, index) => {
      _series.push({
        name: el,
        data: _data.series[index],
        type: "line",
        itemStyle: {
          color: color[index],
        },
        lineStyle: {
          width: 2,
          shadowColor: bgColor[index],
          shadowBlur: 5,
          shadowOffsetY: 2
        },
        areaStyle: {
          color: bgColor[index],
        },
        smooth: true,
      });
    });
    return {
      title: {
        left: 21,
        top: 80,
        // text: '微博超话帖子数',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 12,
          color: "#999999",
        },
      },
      legend: {
        data: _data ? _data.name : [],
        top: 30,
        left: 'center',
        textStyle: {
          color: "#6B7177",
          fontWeight: 'normal',
          fontSize: 14,
          lineHeight: 14,
        }
      },
      grid: {
        y: 110,
        x: 95,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#ccc'
      },
      tooltip: {
        padding: [5, 10],
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#BFBFBF",
          }
        },
        data: _data ? _data.xAxis : [],
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
      },
      series: _series ? _series : [],
    };
  }

  render() {
    let { container, data } = this.props;
    // let _data = {
    //   name:['喵呜琪琪梦 echats—line-darren', '柴犬馒头','疯了, 瑰宝'],
    //   xAxis : ['周一','周二','周三','周四','周五','周六','周日'],
    //   series:[[120, 132, 101, 134, 90, 230, 210],[20, 132, 301, 34, 90, 130, 410],[60, 32, 101, 234, 190, 430, 40]],
    // },
    data = toJS(data);
    let haveData = false;
    if (data === null || data.series.length === 0) {
      data = {
        xAxis: [],
        name: [],
        series: [[]],
      };
    }
    if (data.series && data.series.length > 0) {
      data.series.forEach((el) => {
        el.length !== 0 ? haveData = true : '';
      });
    }
    return (
      !haveData ?
        <div className="line_darren">暂无数据</div> :
        <div className={container}>
          <div className="redar">
            <ReactEcharts option={this.option()}/>
          </div>
        </div>
    );
  }
}
