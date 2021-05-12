import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_redar.scss";
import echarts from "echarts";

interface IProps {
  container?: any,
  data?: any,
}

export default class EchartsLineAndBar extends React.Component<IProps, any> {

  option() {
    const { data: { xAxis, praisedDatas, commentDatas } } = this.props;
    // const { legend, xAxis, series } = age;

    return {
      title: {
        // subtext: "test",
        subtextStyle: {
          color: "#4a4a4a",
          fontSize: 16,
          verticalAlign: "top",
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        formatter: (params) => {
          let htmlStr = '<div>';
          // 添加一个汉字，这里你可以格式你的数字或者自定义文本内容
          htmlStr += `${params[0].axisValue}</br>
                     ${params[0].data.name}</br> 
                     ${params[0].seriesName}:${params[0].data.value}</br>
                     ${params[1].seriesName}:${params[1].data.value}</br>  `;
          htmlStr += '</div>';
          return htmlStr;
        }
      },

      legend: {},
      color: ['#644AFF', '#3681F7', '#FA9493'],
      xAxis: [
        {
          type: 'category',
          data: xAxis, // ['>=19', '20-29', '30-39', '40-49', '>=50'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: "#999",
              fontSize: 12,
            }
          },
          axisLine: {       // y轴
            lineStyle: {
              color: "#999",
            }
          },
          // x 轴 刻度线居中
          axisTick: {
            alignWithLabel: true,
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: "点赞数",
          // min: 0,
          // max: 100,
          // interval: 20,
          nameTextStyle: {
            color: "#999",
            align: "right",
          },
          axisLabel: {
            formatter: '{value}',
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            }
          },
          axisLine: {       // y轴
            show: false
          },
          axisTick: {       // y轴刻度线
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },

        {
          type: 'value',
          name: '评论量',
          // min: 0,
          // max: 500,
          // interval: 100,
          nameTextStyle: {
            color: "#999",
            align: "left",
          },
          axisLabel: {
            formatter: '{value} ',
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            },
          },
          axisLine: {       // y轴
            show: false
          },
          axisTick: {       // y轴刻度线
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },

      ],
      series: [
        {
          name: '点赞量',
          type: 'bar',
          barMaxWidth: 30,
          // data: [12000, 49000, 7000, 23200],
          data: praisedDatas,
          // [
          //   { name: '12', value: 12000 },
          //   { name: '13', value: 49000 },
          //   { name: '14', value: 7000 },
          //   { name: '15', value: 22000 },
          // ],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "#9333fe",
            }, {
              offset: 1,
              color: '#2853ff'
            }]),
          },
        },
        {
          name: '评论数',
          type: 'line',
          // data: [8000, 82200, 3300, 50000],
          data: commentDatas,
          //   [
          //   { name: '12', value: 9000 },
          //   { name: '13', value: 4000 },
          //   { name: '14', value: 3000 },
          //   { name: '15', value: 5000 },
          // ],
          yAxisIndex: '1',
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
      ]
    };
  }

  render() {
    return (
      <div className="echarts">
        <ReactEcharts option={this.option()} className="echarts-line-bar"/>
      </div>
    );
  }
}
