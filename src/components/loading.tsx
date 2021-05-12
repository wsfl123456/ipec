import * as React from 'react';
import Load from 'react-loading';
import "@assets/scss/loader.scss";

// interface ILoadProps extends IComponentProps{
//   onClose: Function;
// }

export default class Loading extends React.Component {
  componentDidMount(): void {
    // const { onClose } = this.props;
    // onClose();
  }

  render(): React.ReactNode {
    return (
      <div className="loadEffectParent">
        <Load delay={6000} color={"#8a54be"} height={"12%"} width={"12%"} type={'spinningBubbles'}
              className="loadEffect"/>
      </div>
    );
  }
}
