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
import _isEmpty from 'lodash/isEmpty';
import NoResult from '@pages/detail/components/no-result';

interface IProps {
  container?: any,
  data?: any,
}

export default class EchartBarRadiusNew extends React.Component<IProps, any> {

  option() {
    const { data: { age } } = this.props;
    const { legend, xAxis, series } = age;

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
        }
      },

// '喵呜琪琪的梦1', '柴犬馒头', '疯了，桂宝',
//       legend: {
//       data: ['年龄占比1', '年龄占比2', '年龄占比3', '\n', 'TGI值1', 'TGI值2', 'TGI值3'],
      // },
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
          name: "年龄占比",
          min: 0,
          max: 100,
          interval: 20,
          nameTextStyle: {
            color: "#999",
            align: "right",
          },
          axisLabel: {
            formatter: '{value} %',
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
          name: 'TGI值',
          min: 0,
          max: 500,
          interval: 100,
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
      series,
      /*[
      {
        name: '年龄占比1',
        type: 'bar',
        barMaxWidth: 30,
        data: [2.0, 4.9, 7.0, 23.2],
      },
      {
        name: '年龄占比2',
        type: 'bar',
        barMaxWidth: 30,
        data: [135.6, 162.2, 32.6, 20.0],
      }, {
        name: '年龄占比3',
        type: 'bar',
        barMaxWidth: 30,
        data: [32.6, 20.0, 6.4, 3.3],
      }, {
        name: 'TGI值1',
        type: 'line',
        data: [2.0, 2.2, 3.3, 4.5],
        yAxisIndex:'1',
      },
      {
        name: 'TGI值2',
        type: 'line',
        data: [6.3, 10.2, 20.3, 23.4],
        yAxisIndex:'1',
      },

      {
        name: 'TGI值3',
        type: 'line',
        data: [23.0, 16.5, 12.0, 6.2],
        yAxisIndex:'1',
      }
    ]*/
    };
  }

  option2() {
    const { data: { gender } } = this.props;
    const { legend, xAxis, series } = gender;

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
        }
      },
      color: ['#644AFF', '#3681F7', '#FA9493'],
      xAxis: [
        {
          type: 'category',
          data: xAxis,
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
          name: "年龄占比",
          min: 0,
          max: 100,
          interval: 20,
          nameTextStyle: {
            color: "#999",
            align: "right",
          },
          axisLabel: {
            formatter: '{value} %',
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
          name: 'TGI值',
          min: 0,
          max: 500,
          interval: 100,
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
      series,
    };
  }

  render() {
    const { data } = this.props;
    if (!_isEmpty(data.gender) && !_isEmpty(data.age)) {
      return (
        <div className="echarts-container">
          <div className="echarts-parent">
            <p className="head-title">年龄分布</p>
            <div className="icon-parents justify-content-around">
              {
                data.age.legend && data.age.legend.map((item, index) => {
                  return (
                    <div className={`icons icons_${index}`} key={index}>
                      <span>{item}</span>
                      <span className="bar">年龄占比</span>
                      <span className="line">年龄TGI值</span>
                    </div>
                  );
                })
              }
            </div>
            <ReactEcharts option={this.option()} className="echarts-age"/>
          </div>
          <div className="middle-line"/>
          <div className="echarts-parent">
            <p className="head-title">性别分布</p>
            <div className="icon-parents justify-content-around">
              {
                data.gender.legend && data.gender.legend.map((item, index) => {
                  return (
                    <div className={`icons icons_${index}`} key={index}>
                      <span>{item}</span>
                      <span className="bar">年龄占比</span>
                      <span className="line">年龄TGI值</span>
                    </div>
                  );
                })
              }
            </div>
            <ReactEcharts option={this.option2()} className="echarts-sex"/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="echarts-container">
          <NoResult/>
        </div>
      );
    }
  }
}
