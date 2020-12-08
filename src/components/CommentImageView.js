import React, { Component } from 'react';
import { Dimensions, Image, View } from 'react-native';
import ImageView from 'react-native-image-view';

export default class CommentImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageObj: null
    };
  }

  componentWillMount() {
    const screenWidth = Dimensions.get('window').height;
    const screenHeight = Dimensions.get('window').width;

    Image.getSize(
      this.props.imageURL,
      (imageWidth, imageHeight) => {
        if (imageHeight > imageWidth) {
          this.setState({
            imageObj: { source: { uri: this.props.imageURL }, width: screenWidth, height: (screenWidth * imageHeight) / imageWidth }
          });
        } else {
          this.setState({
            imageObj: { source: { uri: this.props.imageURL }, height: screenHeight, width: (screenHeight * imageWidth) / imageHeight }
          });
        }
      },
      error => console.log(error)
    );
  }

  render() {
    if (!this.state.imageObj) {
      return <View></View>;
    }

    return <ImageView images={[this.state.imageObj]} imageIndex={0} isVisible={true} onClose={this.props.callback} />;
  }
}
