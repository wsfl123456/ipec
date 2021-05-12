/**
 * 散点图
 */
import * as React from "react";
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
  xAxisName: string,
}

export default class EchartScatter extends React.Component<IProps, any> {
  constructor(props) {
    super(props);

  }

  option() {
    const { data: { legend, series }, xAxisName } = this.props;
    let color = [
      "#6248ff", "#ff86ff", "#3681f7", "#7ed321",
      "#ff5623", "#abedd8", "#46cdcf", "#3d84a8",
      "#ffaaa5", "#ffd3b6", "#dcedc1", "#cca8e9",
      "#c3bef0", "#cadefc", "#d4a5a5", "#ffadd2",
      "#ffd591", "#10ddc2", "#c79ecf", "#2f9296",
      "#7e80ff"];
    let _series = [];
    legend && legend.forEach((item, index) => {
      _series.push({
        name: item,
        type: 'scatter',
        data: [series[index]],
        label: {
          show: true,
          formatter: (params) => {
            // console.log(params);
            return params.data[2];
          },
          position: 'right',
          color: '#6b7171',
        },
        itemStyle: {
          color: color[index]
        },
      });
    });

    return {
      title: {
        subtext: "热度",
      },
      legend: {
        data: legend,
        left: '14%',
        top: '2%',
      },
      grid: {
        top: '20%'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          let htmlStr = '<div>';
          // 添加一个汉字，这里你可以格式你的数字或者自定义文本内容
          htmlStr += params.data[2] + '</br>' +
            xAxisName + ':' + params.data[0] + '</br>' +
            '热度:' + params.data[1];
          htmlStr += '</div>';
          return htmlStr;
        }
      },
      xAxis: {
        name: xAxisName, //  "知名度",
        type: "value",
        scale: true,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
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
            symbol: ['none', 'arrow']
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: {
          lineStyle: {
            type: "dashed",
            symbol: ['none', 'arrow']
          },
        },
        axisLine: {
          lineStyle: {
            color: "#999999",
            symbol: ['none', 'arrow']
          },
        },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
      },
      series: _series,
      // [{
      //   type: 'scatter',
      //   data: series,
      label: {
        show: true,
        formatter: (params) => {
          // console.log(params);
          return params.data[2];
        },
        position: 'right',
        color: '#6b7171',
      },
      //   itemStyle: {
      //     color: (param) => {
      //       return color[param.dataIndex];
      //     }
      //   },
      //
      // }],
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
