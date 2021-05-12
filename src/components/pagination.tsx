import * as React from "react";
import "@assets/scss/page.scss";
import { inject, observer } from "mobx-react";

interface IPaginationState {
  currentPage: number,
}

@inject("ip_list")
@observer
export default class Pagination extends React.Component<any, IPaginationState> {

  state = {
    currentPage: 1,
  };

  render() {
    const { ip_list } = this.props;
    const { page: { numbers, totalCount, lastPage } } = ip_list;
    const { currentPage } = this.state;
    return (
      <div className="main">
        <ul className="page">
          <li>{totalCount}条</li>
          <li className="prev-page" onClick={async () => {
            if (currentPage !== 1) {
              this.setState({ currentPage: currentPage - 1 });
              await ip_list.changeStatus({ currentPage: this.state.currentPage - 1 });
            }

          }}>上一页
          </li>
          {
            numbers.length > 0 && numbers.map((item: string, index: number) => {
              return (
                <li
                  key={index}
                  onClick={async () => {
                    if (item !== "...") {
                      let currentPage = Number(item);
                      this.setState({ currentPage });
                      await ip_list.changeStatus({ currentPage });
                    }
                  }}
                  className={this.state.currentPage === Number(item) ? "active" : ""}>
                  {item}
                </li>
              );
            })
          }
          <li className="next-page" onClick={async () => {
            if (currentPage !== lastPage) {
              this.setState({ currentPage: currentPage + 1 });
              await ip_list.changeStatus({ currentPage: this.state.currentPage + 1 });
            }
          }}>下一页
          </li>
        </ul>
      </div>
    );
  }
}
