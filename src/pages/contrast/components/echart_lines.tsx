import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "../../../assets/scss/bar_darren.scss";
import NoEchart from '@pages/detail/components/no-echart';

interface IProps {
  container: any,
  data: any,
  title?: any,
  special?: any,
}

export default class EchartLines extends React.Component<IProps, any> {
  // "datas":[
  // {"ip_name":"麻将","values":[]},
  // {"ip_name":"乘风破浪","values":[]},
  // {"ip_name":"唐人街探案",
  // "values":[{"data_number":"210000"},
  // {"data_number":"12840000"},
  // {"data_number":"31670000"},
  // {"data_number":"51200000"},
  // {"data_number":"90730000"},
  // {"data_number":"209400000"},
  // {"data_number":"398550000"},
  // {"data_number":"28260000"}]}]

  option() {
    let { data, title, } = this.props;
    let _series = [],
      color = ['#6236ff', '#F7B500', '#E02020'],
      bgColor = ['#B09AFF', '#FBDB81', '#EF9090']
    ;
    if (title === "院线票房数（万）") {
      data && data.legend && data.legend.forEach((el, index) => {
        _series.push({
          name: el,
          data: data.series[index],
          type: "line",
          itemStyle: {
            color: color[index],
          },
          lineStyle: {
            width: 2,
            shadowColor: bgColor[index],
            shadowBlur: 5,
            shadowOffsetY: 2
          },
          areaStyle: {
            color: bgColor[index],
          },
        });
      });
    }
    data && data.legend && data.legend.forEach((el, index) => {
      _series.push({
        name: el,
        data: data.series[index],
        type: "line",
        itemStyle: {
          color: color[index],
        },
        lineStyle: {
          width: 2,
          shadowColor: bgColor[index],
          shadowBlur: 5,
          shadowOffsetY: 2
        },
        areaStyle: {
          color: bgColor[index],
        },
      });
    });

    return {
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
        trigger: 'axis'
      },
      legend: {
        left: 'center',
        top: 28,
        bottom: 10,
        data: data.legend, //  ["蔡依林", "林俊杰", " 苏有朋"]
      },
      grid: {
        // x: 95,
        // y: 140,
        left: 0, // '50',
        right: 0,
        bottom: 10,
        containLabel: true, // 溢出容器显示
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#ccc'
      },
      xAxis: {
        type: "category",
        data: data.xAxis || data.xAxisData, //  ["3/4", "3/5", "3/6", "3/7", "3/8"],
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
          show: false,
        },
        axisLine: { show: false },
        axisTick: {
          show: true,
          lineStyle: {
            color: "#999999",
          },
        },
        axisLabel: {
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
    const { data, container, title } = this.props;
    let haveData = false;
    if (data && data.series && data.series.length > 0) {
      data.series.forEach((el) => {
        if (el.length > 0) {
          el.forEach(element => {
            element !== null ? haveData = true : '';
          });
        }
      });
    }
    // echart_bar_darren
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
