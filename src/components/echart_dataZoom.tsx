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
  data: any,
  date: any,
  subtext: any,
}

export default class EchartDataZoom extends React.Component<IPEchartBar, any> {
  private date: any;
  //  '51': [], // 爱奇艺
  // '62': [], // 优酷
  option() {
    const { data, date, subtext } = this.props;
    let option = {
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100,
        zoomOnMouseWheel: false,
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#7b88ff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ["爱奇艺"],
        left: "3%",
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
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
        name: '爱奇艺',
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: "#79a12e",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#79a12e",
          }, {
            offset: 1,
            color: "#fff",
          }]),
        },
        data: data['51'],

      }
     // , {
     //    name: '优酷',
     //    type: 'line',
     //    itemStyle: {
     //      color: "#e71728",
     //    },
     //    areaStyle: {
     //      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
     //        offset: 0,
     //        color: "#e71728",
     //      }, {
     //        offset: 1,
     //        color: "#fff",
     //      }]),
     //    },
     //    data: data['62']
     //  }
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
