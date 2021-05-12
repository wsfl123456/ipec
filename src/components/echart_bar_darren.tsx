import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/bar_darren.scss";
import { toJS } from "mobx";
import echarts from "echarts";
import _isEmpty from 'lodash/isEmpty';
import NoEchart from '@pages/detail/components/no-echart';

interface IProps {
  container: any,
  data: any,
  title?: string
}

export default class EchartMap extends React.Component<IProps, any> {
  option() {
    const { data, title } = this.props;
    // let _data = {
    //   title:'百度搜索指数Echart_bar_darren',
    //   legend:['喵呜琪琪梦', '柴犬馒头', '疯狂，瑰宝'],
    //   xAxis:['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/6', '3/8', '3/59', '3/10'],
    //   series:[[320, 332, 301, 334, 390, 98, 77, 101, 99, 40],[220, 182, 191, 234, 290, 301, 334, 390, 98, 77],[150, 232, 201, 154, 190, 98, 77, 101, 99, 40]]
    // },
    let _data = {
      title: '',
      legend: [],
      xAxis: [],
      series: []
    };

    let color = ['#6236ff', '#F7B500', '#E02020'],
      bgColor = ['#B09AFF', '#FBDB81', '#EF9090'];
    if (data) _data = toJS(data);
    let _legend = [],
      _series = [];
    _data.legend.forEach((val, index) => {
      _legend.push({
        name: val,
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        },
        // icon: 'circle' // 格式为'image://+icon文件地址'，其中image::后的//不能省略
      });
      _series.push({
        name: val,
        type: 'bar',
        barGap: 0,
        data: _data.series[index],
        itemStyle: {
          color: bgColor[index],
          emphasis: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: color[index] },
              ],
            ),
          },
        },
      });
    });
    return {
      color: ['#6236ff', '#F7B500', '#E02020'],
      title: {
        text: title,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 12,
          color: "#999999",
        },
        // left: 21,
        // top: 80,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          snap: true,
        },
        padding: [5, 10],
      },
      legend: {
        data: _legend,
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
        // y: 140,
        // x: 95,
        left: 0, // '50',
        right: 0,
        bottom: 10,
        containLabel: true, // 溢出容器显示
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#ccc'
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: _data.xAxis,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: "#BFBFBF",
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            },
          },
          splitLine: {
            show: false,
            // lineStyle: {
            //   type: "dashed",
            // },
          },
          axisLine: {
            show: false,
            // lineStyle: {
            //   color: "#BFBFBF",
            // }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#999999",
            },
          },
        }
      ],
      series: _series
    };
  }

  render() {
    // echart_bar_darren
    let { container, data, title } = this.props;
    // let _data = {
    //   title:'百度搜索指数Echart_bar_darren',
    //   legend:['喵呜琪琪梦', '柴犬馒头', '疯狂，瑰宝'],
    //   xAxis:['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/6', '3/8', '3/59', '3/10'],
    //   series:[[320, 332, 301, 334, 390, 98, 77, 101, 99, 40],[220, 182, 191, 234, 290, 301, 334, 390, 98, 77],[150, 232, 201, 154, 190, 98, 77, 101, 99, 40]]
    // },
    let haveData = false;
    if (_isEmpty(data) || data.series.length === 0) {
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
        <div style={{ padding: "0.2rem" }}>
          <NoEchart subtext={title} contianer={container}/>
        </div>
        :
        <div className={container}>
          <div className="redar">
            <ReactEcharts option={this.option()} notMerge={true}/>
          </div>
        </div>
    );
  }
}
