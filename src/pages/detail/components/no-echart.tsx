import * as React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import '@assets/scss/echart_bar.scss';
import moment from 'moment';

let thirty = [];
interface IProps {
  subtext: string,
  container: string,
}
export default class NoEchart extends React.Component<any, IProps> {

  thirtyDays() {
    let thirtyMonth = [], timer, day;
    for (let i = 0; i < 30; i++) {
      day = new Date();
      timer = new Date().getDate();
      // new Date(day.setDate(timer - i)).toLocaleDateString();
      // new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString()
      thirtyMonth.unshift(moment(new Date(day.setDate(timer - i)).toLocaleDateString()).format('MM/DD'));
    }
    thirty = thirtyMonth;
  }

  componentDidMount() {

    this.thirtyDays();

  }

  options() {
    const { subtext} = this.props;
    return {
      title: {
        subtext,
      },
      tooltip: {},
      grid: {
        left: 0,
        right: 0,
        bottom: 10,
        containLabel: true, // 溢出容器显示
      },
      xAxis: {
        type: "category",
        data: thirty || [],
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
        type: "category",
        data: [10000, 20000, 30000, 40000, 50000, 60000, 70000],
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: { show: false },
        axisTick: {
          show: false,
          alignWithLabel: true,
          lineStyle: {
            color: "#999",
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
      series: [],
    };
  }

  render() {
    const {container} = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.options()}/>
      </div>
    );
  }
}
