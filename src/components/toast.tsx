import * as React from "react";
import "@assets/scss/toast.scss";

interface IToastProps {
  message: string;
  duration: number;
  onClose: Function;
}

export default class Toast extends React.Component<IToastProps> {
  timeId = 0;

  componentDidMount(): void {
    const { onClose, duration } = this.props;
    this.timeId = setTimeout(() => {
      onClose();
    }, duration * 1000);
  }

  componentWillUnmount(): void {
    clearTimeout(this.timeId);
  }

  render() {
    const { message = "", duration } = this.props;
    return (
      <div className="toast-it" style={{ animationDuration: duration + "s" }}>
        {message}
      </div>
    );
  }
}
