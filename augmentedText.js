import React from "react";
import { StyleSheet } from "react-native";
import ParsedText from "react-native-parsed-text";
import { FONTS } from "./constants";
import {
  mentionClicked,
  mentionRegularExp,
  renderMentions,
} from "./mentionproperties";

class AugmentedText extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._listeners = null;
  }
  componentDidMount() {}
  componentWillUnmount() {
    // this._listeners.forEach((listener) => listener.remove());
  }
  render() {
    let renderText = this.props.children;
    if (this.props.children.length === 2) {
      if (this.props.children[1] === "") {
        renderText = this.props.children[0];
      }
    }
    return (
      <ParsedText
        {...this.props}
        style={[
          this.props.highlightState > this.props.offset ? styles.h : {},
          this.props.style,
        ]}
        parse={[
          {
            pattern: mentionRegularExp,
            style: styles.username,
            renderText: renderMentions,
            onPress: mentionClicked,
          },
          {
            pattern: /<b>(\n|.)*?<\/b>/g,
            renderText: (a, b) => {
              return a.slice(3, a.length - 4);
            },
            style: styles.b,
          },
          {
            pattern: /<i>(\n|.)*?<\/i>/g,
            renderText: (a, b) => {
              return a.slice(3, a.length - 4);
            },
            style: styles.i,
          },
          {
            pattern: /<u>(\n|.)*?<\/u>/g,
            renderText: (a, b) => {
              return a.slice(3, a.length - 4);
            },
            style: styles.u,
          },
          {
            pattern: /<h>(\n|.)*?<\/h>/g,
            renderText: (a, b) => {
              return a.slice(3, a.length - 4);
            },
            style: styles.h,
          },
        ]}
      >
        {renderText}
      </ParsedText>
    );
  }
}

// const AugmentedText = (props) => {
//   let renderText = props.children;
//   if (props.children.length === 2) {
//     if (props.children[1] === "") {
//       renderText = props.children[0];
//     }
//   }
//   return (
//     <ParsedText
//       {...props}
//       parse={[
//         {
//           pattern: mentionRegularExp,
//           style: styles.username,
//           renderText: renderMentions,
//           onPress: mentionClicked,
//         },
//         {
//           pattern: /<b>(\n|.)*?<\/b>/g,
//           renderText: (a, b) => {
//             return a.slice(3, a.length - 4);
//           },
//           style: styles.b,
//         },
//         {
//           pattern: /<i>(\n|.)*?<\/i>/g,
//           renderText: (a, b) => {
//             return a.slice(3, a.length - 4);
//           },
//           style: styles.i,
//         },
//         {
//           pattern: /<u>(\n|.)*?<\/u>/g,
//           renderText: (a, b) => {
//             return a.slice(3, a.length - 4);
//           },
//           style: styles.u,
//         },
//         {
//           pattern: /<h>(\n|.)*?<\/h>/g,
//           renderText: (a, b) => {
//             return a.slice(3, a.length - 4);
//           },
//           style: styles.h,
//         },
//       ]}
//     >
//       {renderText}
//     </ParsedText>
//   );
// };

const styles = StyleSheet.create({
  regular: {
    fontFamily: FONTS.PRIMARY_FONT_REGULAR,
  },
  b: {
    fontFamily: FONTS.PRIMARY_FONT_REGULAR,
    fontWeight: "bold",
  },
  i: {
    fontStyle: "italic",
  },
  u: {
    textDecorationLine: "underline",
  },
  h: {
    backgroundColor: "#C9E9EF",
  },
});

export default AugmentedText;
