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

export default class EchartDoubleLine extends React.Component<IProps, any> {
  constructor(props) {
    super(props);

  }

  option() {
    const { data: { legend, male, female } } = this.props;
    return {
      title: {
        subtext: "粉丝占比(%)",
      },
      legend: {
        data: ['男', '女'],
        textStyle: {
          color: '#6b7171',
        }
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
      xAxis: {
        type: "category",
        data: legend, // ["蔡依林", "林俊杰", " 苏有朋", "赵丽颖", "林更新"],
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
        min: 0,
        max: 100,
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
      series: [
        {
          name: "男",
          type: "line",
          data: male, // [24, 14, 18, 32, 50],
          itemStyle: {
            color: "#6248ff",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "#6248ff",
            }, {
              offset: 1,
              color: "#fff",
            }]),
          },
        },
        {
          name: "女",
          type: "line",
          data: female, // [54, 24, 8, 12, 50],
          itemStyle: {
            color: "#ffcaff",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "#ffcaff",
            }, {
              offset: 1,
              color: "#fff",
            }]),
          },
        }

      ],
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
