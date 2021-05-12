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
  title?: any,
}

export default class EchartLines extends React.Component<IProps, any> {
  constructor(props) {
    super(props);

  }

  option() {
    const { data: { legends, xAxis, series }, title } = this.props;
    let _series = [],
      color = [
        "#6248ff", "#ff86ff", "#3681f7", "#7ed321",
        "#ff5623", "#abedd8", "#46cdcf", "#3d84a8",
        "#ffaaa5", "#ffd3b6", "#dcedc1", "#cca8e9",
        "#c3bef0", "#cadefc", "#d4a5a5", "#ffadd2",
        "#ffd591", "#10ddc2", "#c79ecf", "#2f9296",
        "#7e80ff"];
    series && series.forEach((item, index) => {
      _series.push({
        ...item,
        itemStyle: {
          color: color[index]
        },
      });
    });
    return {
      title: {
        subtext: title,
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legends, //  ["蔡依林", "林俊杰", " 苏有朋", "赵丽颖", "林更新"]
        left: '8%',
        top: '3%',
        textStyle: {
          color: '#6b7171',
        }
      },
      grid: {
        top: '20%'
      },
      xAxis: {
        type: "category",
        data: xAxis, //  ["3/4", "3/5", "3/6", "3/7", "3/8"],
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
      series: _series,
      /*   [
           {
             name: "蔡依林",
             data: [24, 14, 18, 32, 50],
             type: "line",
             itemStyle: {
               color: "#6248ff",
             },
           },
           {
             name: "林俊杰",
             data: [4, 14, 28, 21, 15],
             type: "line",
             itemStyle: {
               color: "#ff89ff",
             },
           },
           {
             name: "苏有朋",
             data: [14, 10, 8, 20, 15],
             type: "line",
             itemStyle: {
               color: "#3681f7",
             },
           },
           {
             name: "赵丽颖",
             data: [24, 10, 8, 12, 15],
             type: "line",
             itemStyle: {
               color: "#7ed321",
             },
           },
           {
             name: "林更新",
             data: [41, 11, 18, 20, 50],
             type: "line",
             itemStyle: {
               color: "#f5a623",
             },
           },
         ],*/
    };
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()}
                      notMerge={false}

        />
      </div>
    );
  }
}
