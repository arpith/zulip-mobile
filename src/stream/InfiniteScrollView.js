/* eslint-disable */
import React from 'react';
import AnchoredScrollView from '../native/AnchoredScrollView';

const DEFAULT_START_REACHED_THRESHOLD = 500;
const DEFAULT_END_REACHED_THRESHOLD = 500;
const DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;

class InfiniteScrollView extends React.Component {
  componentDidMount() {
    this._scrollOffset = 0;
  }

  _onContentSizeChanged(contentWidth, contentHeight) {
    const oldContentHeight = this._contentHeight;
    this._contentHeight = contentHeight;
  }

  _onScrollViewLayout(e) {
    this._scrollViewHeight = e.nativeEvent.layout.height;
  }

  _maybeCallOnStartReached(distFromStart) {
    if (this.props.onStartReached &&
        this._contentHeight &&
        distFromStart <= this.props.onStartReachedThreshold &&
        this._sentStartForContentHeight !== this._contentHeight) {
      this._sentStartForContentHeight = this._contentHeight;
      this.props.onStartReached();
    }
  }

  _maybeCallOnEndReached(distFromEnd) {
    if (this.props.onEndReached &&
        this._contentHeight &&
        distFromEnd <= this.props.onEndReachedThreshold &&
        this._sentEndForContentHeight !== this._contentHeight) {
      this._sentEndForContentHeight = this._contentHeight;
      this.props.onEndReached();
    }
  }

  _onScroll(e) {
    this._scrollOffset = e.nativeEvent.contentOffset['y'];
    const distFromStart = this._scrollOffset;
    const distFromEnd = this._contentHeight - this._scrollViewHeight - this._scrollOffset;

    this._maybeCallOnStartReached(distFromStart);
    if (this.props.onStartReached &&
        distFromStart > this.props.onStartReachedThreshold) {
      this._sentStartForContentHeight = null;
    }

    this._maybeCallOnEndReached(distFromEnd);
    if (this.props.onEndReached &&
        distFromEnd > this.props.onEndReachedThreshold) {
      this._sentEndForContentHeight = null;
    }
  }

  render() {
    return (
      <AnchoredScrollView
        style={this.props.style}
        automaticallyAdjustContentInset={false}
        scrollsToTop
        onContentSizeChange={this._onContentSizeChanged.bind(this)}
        onLayout={this._onScrollViewLayout.bind(this)}
        onScroll={this._onScroll.bind(this)}
        scrollEventThrottle={DEFAULT_SCROLL_CALLBACK_THROTTLE}
        stickyHeaderIndices={this.props.stickyHeaderIndices}
        anchorMode
        autoScrollToBottom={this.props.autoScrollToBottom}
      >
        {this.props.children}
      </AnchoredScrollView>
    );
  }
}

InfiniteScrollView.defaultProps = {
  onStartReachedThreshold: DEFAULT_START_REACHED_THRESHOLD,
  onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
};

export default InfiniteScrollView;
