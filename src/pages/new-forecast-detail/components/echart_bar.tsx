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
  subtext?: string,
}

export default class EchartBar extends React.Component<IPEchartBar, any> {
  option() {
    const { data: { xAxis, series, legends, }, subtext } = this.props;
    // let xData = ['猪小弟', '救援宝贝'];
    // let yData = [20, 50];
    // let subtext = '粉丝占比';
    // console.log(subtext)
    if (subtext === '黑粉占比') {
      return {
        title: {
          subtext,
        },
        tooltip: {
          formatter: '{b}：{c}%',
        },
        xAxis: {
          type: 'category',
          data: xAxis,
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
            show: true,
            formatter: '{value}%',
            textStyle: {
              color: "#999",
              fontSize: 12,
            },
          },
        },
        series: [
          {
            type: "bar",
            barMaxWidth: 40,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: "#2853ff" },
                    { offset: 1, color: "#933efe" },
                  ],
                ),
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: "#6248ff" },
                  ],
                ),
              },
            },
            data: series,
          },
        ],
      };

    } else {
      return {
        title: {
          subtext,
        },
        tooltip: {

        },
        xAxis: {
          type: 'category',
          data: xAxis,
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
        series: [
          {
            type: "bar",
            barMaxWidth: 40,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: "#2853ff" },
                    { offset: 1, color: "#933efe" },
                  ],
                ),
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: "#6248ff" },
                  ],
                ),
              },
            },
            data: series,
          },
        ],
      };

    }
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
