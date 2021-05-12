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
import "@assets/scss/echart_bar.scss";

interface IProps {
  container: any,
  data: any,
}

export default class EchartBarCategory extends React.Component<IProps, any> {
  constructor(props) {
    super(props);

  }

  // [
  //         {
  //           name: legend[0],
  //           type: 'bar',
  //           barWidth: 80,
  //           stack: '总量',
  //           itemStyle: {
  //             normal: {
  //               color: '#b0a3ff'
  //             }
  //           },
  //           data: series[0], //  [15, 21, 20, 15, 19]
  //         },
  //         {
  //           name: legend[1],
  //           type: 'bar',
  //           stack: '总量',
  //           barWidth: 80,
  //           itemStyle: {
  //             normal: {
  //               color: '#ffadd2'
  //             }
  //           },
  //           data: series[1], //  [22, 12, 11, 34, 20]
  //         },
  //         {
  //           name: legend[2],
  //           type: 'bar',
  //           barWidth: 80,
  //           stack: '总量',
  //           itemStyle: {
  //             normal: {
  //               color: '#ffcaff'
  //             }
  //           },
  //           data: series[2], //  [12, 32, 10, 13, 9]
  //         },
  //         {
  //           name: legend[3],
  //           type: 'bar',
  //           barWidth: 80,
  //           stack: '总量',
  //           itemStyle: {
  //             normal: {
  //               color: '#ffd591'
  //             }
  //           },
  //           data: series[3] // , [32, 30, 31, 34, 30],
  //         },
  //         {
  //           name: legend[4],
  //           type: 'bar',
  //           barWidth: 80,
  //           stack: '总量',
  //           itemStyle: {
  //             normal: {
  //               color: '#7ed321'
  //             }
  //           },
  //           data: series[4] // , [32, 30, 31, 34, 30],
  //         }
  //       ],
  option() {
    const {
      data: {
        xAxis: legend,
        series
      }
    } = this.props;

    let _series = [], colors = ['#b0a3ff', '#ffadd2', '#ffcaff', '#ffd591', '#7ed321'];
    legend && legend.map((item, index) => {
      _series.push({
        name: item,
        type: 'bar',
        barWidth: 80,
        stack: '总量',
        itemStyle: {
          normal: {
            color: colors[index]
          }
        },
        data: series[index] // , [32, 30, 31, 34, 30],
      });

    });

    return {
      title: {
        subtext: "年龄段平均比例对比(%)",
        // subtextStyle: {
        //   verticalAlign: 'top'
        // }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let result = params[0].name + "<br>";
          params.map((item) => {
            result += item.marker + " " + item.seriesName + " : " + item.value + "%</br>";
          });
          return result;
        },
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: legend,
        left: '14%',
        top: '2%',
      },
      grid: {
        top: '20%'
      },
      xAxis: {
        type: "category",
        data: ['70S', '80S', '90S', '00S'],
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
        type: "value",
        // min: 0,
        // max: 100,
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: '{value} %',
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
      },
      series: _series,

    };
  }

  render() {
    const { container } = this.props;

    return (
      <div className={container}>
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
