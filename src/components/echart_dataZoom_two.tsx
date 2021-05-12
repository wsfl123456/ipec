import * as React from "react";
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IPEchartBar {
  container: string,
  date: any,
  data: any,
  subtext: any,
}

export default class EchartDataZoomTwo extends React.Component<IPEchartBar, any> {
  option() {
    const { date, data, subtext } = this.props;
    //  '51': [], // 爱奇艺
    // '62': [], // 优酷
    // '46': [], // 腾讯视频
    // '49': [], //  芒果TV
    // '65': [], // 搜狐
    //  53: 乐视
    let option = {
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100,
        height: 10,
        zoomOnMouseWheel: false,
        bottom: 100,
      }, {
        start: 0,
        end: 10,                  // handleIcon 手柄的 icon 形状，支持路径字符串
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',        //  控制手柄的尺寸，可以是像素大小，也可以是相对于 dataZoom 组件宽度的百分比，默认跟 dataZoom 宽度相同。
        handleStyle: {
          color: '#7b88ff',
          shadowBlur: 3,      // shadowBlur图片阴影模糊值，shadowColor阴影的颜色
          shadowColor: '#6248ff',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ["芒果TV", "腾讯视频", "搜狐视频", "乐视"],
        left: "3%",
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#999999",
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
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

      series: [{
        name: "芒果TV",
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: "#f06000",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#f06000",
          }, {
            offset: 1,
            color: "#fff",
          }]),
        },
        data: data['49'],

      }, {
        name: '腾讯视频',
        type: 'line',
        itemStyle: {
          color: "#2d8ef8",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#2d8ef8",
          }, {
            offset: 1,
            color: "#fff",
          }]),
        },
        data: data['46']
      }, {
        name: '搜狐视频',
        type: 'line',
        itemStyle: {
          color: "#e50013",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#e50013",
          }, {
            offset: 1,
            color: "#fff",
          }]),
        },
        data: data['65']
      }, {
        name: '乐视',
        type: 'line',
        itemStyle: {
          color: "#9254de",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#9254de",
          }, {
            offset: 1,
            color: "#fff",
          }]),
        },
        data: data['53']
      },
      ]
    };

    return option;
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()} lazyUpdate={true}/>
      </div>
    );
  }
}
