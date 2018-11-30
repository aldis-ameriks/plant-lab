import React from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import styled from 'styled-components';

const Overlay = posed.div({
  zoomedOut: {
    applyAtEnd: { display: 'none' },
    opacity: 0
  },
  zoomedIn: {
    applyAtStart: { display: 'block' },
    opacity: 1
  }
});

const transition = {
  duration: 400,
  ease: [0.08, 0.69, 0.2, 0.99]
};

const ChartBoxStyled = styled(
  posed.div({
    zoomedOut: {
      position: 'relative',
      width: 'auto',
      height: 'auto',
      transition,
      flip: true
    },
    zoomedIn: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transition,
      flip: true
    }
  })
)`
  position: relative;
  ${props => (props.pose === 'zoomedIn' ? 'z-index: 9000' : '')};
`;

const ZoomIcon = ({ toggleZoom, isZoomed }) => (
  <span
    className="icon"
    style={{ top: '10px', right: '10px', cursor: 'pointer', position: 'absolute' }}
    onClick={toggleZoom}
  >
    <i className={`fas ${isZoomed ? 'fa-search-minus' : 'fa-search-plus'}`} />
  </span>
);

ZoomIcon.propTypes = {
  toggleZoom: PropTypes.func.isRequired,
  isZoomed: PropTypes.bool.isRequired
};

class ChartBox extends React.Component {
  state = { isZoomed: false };

  zoomIn() {
    this.setState({ isZoomed: true });
  }

  zoomOut = () => {
    this.setState({ isZoomed: false });
  };

  toggleZoom = () => (this.state.isZoomed ? this.zoomOut() : this.zoomIn());

  render() {
    const { isZoomed } = this.state;
    const { children } = this.props;
    const pose = isZoomed ? 'zoomedIn' : 'zoomedOut';

    return (
      <div>
        <Overlay pose={pose} className="overlay" style={{ zIndex: 8999 }} />
        <ChartBoxStyled className="box" pose={isZoomed ? 'zoomedIn' : 'zoomedOut'}>
          <ZoomIcon toggleZoom={this.toggleZoom} isZoomed={isZoomed} />
          {children}
        </ChartBoxStyled>
      </div>
    );
  }
}

ChartBox.propTypes = {
  children: PropTypes.node.isRequired
};

export default ChartBox;
