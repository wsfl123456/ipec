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
}

export default class EchartScatterCard extends React.Component<IProps, any> {

  option() {
    const { data: { seriesData: _data, angleAxisData: hours, radiusAxisData: days } } = this.props;
    let legend = [], data1 = [], series = [];
    let color = [
      "#6248ff", "#ff86ff", "#3681f7", "#7ed321",
      "#ff5623", "#abedd8", "#46cdcf", "#3d84a8",
      "#ffaaa5", "#ffd3b6", "#dcedc1", "#cca8e9",
      "#c3bef0", "#cadefc", "#d4a5a5", "#ffadd2",
      "#ffd591", "#10ddc2", "#c79ecf", "#2f9296",
      "#7e80ff"];
    _data && _data.map((item, index) => {
      legend = [...legend, item[3]];
      data1 = [item[0], item[1], item[2]];
      series.push({
        name: item[3],
        type: 'scatter',
        coordinateSystem: 'polar',
        label: {
          show: true,
          formatter: (params) => {
            return params.seriesName;
          },
          position: 'right',
          color: '#6b7171',
        },
        itemStyle: {
          color: color[index]
        },
        data: [data1]
      });
    });
    return {
      // title: {
      //   subtext: '发展阶段'
      // },
      legend: {
        data: legend && legend,
        align: 'auto'
        //  left: '14%',
        // top: '2%',
      },
      polar: {},
      tooltip: {
        formatter: (params, index) => {
          return params.seriesName
            + '<br/>成长状态：G'
            + params.data[1] + ''
            + '<br/>粉丝量：'
            + params.value.toLocaleString();
        }
      },

      angleAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        splitLine: {
          show: true
        },
        axisLine: {
          show: false
        }
      },
      radiusAxis: {
        type: 'category',
        // data: days,
        axisLine: {
          show: false
        },
        axisTick: { show: false },
        axisLabel: {
          show: false,
          rotate: 15
        }
      },
      series,
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
