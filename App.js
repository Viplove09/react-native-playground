import React, { Component, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import AugmentedText from "./augmentedText";
import { COLORS, FONTS } from "./constants";
import recording from "./recording";

const App = () => {
  const [highlightState, setHighlight] = useState(0);
  const counterRunning = useRef(false);
  const interval = useRef();
  console.log(highlightState);
  const countUp = () => {
    setHighlight((state) => state + 0.1);
  };
  return (
    <View style={{ flex: 1, marginTop: 200 }}>
      <Text>Parsed Text TestBench</Text>
      <View
        // style={[styles.regular, styles.messageStyle]}
        style={{ flexDirection: "column", borderWidth: 1 }}
        childrenProps={{ allowFontScaling: false }}
      >
        {/* {recording.Words[0].Word} */}
        {unpacker(recording.Words[0].Word, highlightState)}
      </View>
      <TouchableOpacity
        onPress={() => {
          if (counterRunning.current) {
            clearInterval(interval.current);
            interval.current = null;
          } else {
            interval.current = setInterval(countUp, 50);
          }
          counterRunning.current = !counterRunning.current;
        }}
      >
        <Text>{counterRunning.current ? "Stop" : "Start"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const domBuilder = (recording) => {
  //preprocessing (remove open tags like <br>, replace &nbsp; with space)
  recording = recording.replace("<br>", "");
  recording = recording.replaceAll("&nbsp;", " ");
  const divRegex = new RegExp(/<(\/[a-z]+|[a-z0-9 ;\"=\.:-]+)>/g);
  componentStack = [];
  rootComponent = { children: [] };
  let search = divRegex.exec(recording);
  let count = 0;
  while (search) {
    let currentComponent = search[1];
    let prevComponent = componentStack[componentStack.length - 1];
    if (prevComponent) prevComponent = prevComponent[1];

    if ("/" + prevComponent === currentComponent) {
      const pop = componentStack.pop();

      const startPoint = pop.index + pop[0].length;
      let extractedComponent = {
        data: recording.slice(startPoint, search.index),
        type: pop.type ? pop.type : pop[1],
        style: pop.style,
        children: pop.children,
        closingIndex: search.index + pop[0].length,
        startIndex: pop.startIndex,
        offset: pop.offset,
        duration: pop.duration,
      };

      if (
        extractedComponent.children.length > 0 &&
        extractedComponent.type != "ul" &&
        extractedComponent.type != "ol"
      ) {
        // check if something exists between the closing
        //of last child and closing of this component
        const lastChild =
          extractedComponent.children[extractedComponent.children.length - 1];

        const dat = recording.slice(lastChild.closingIndex + 1, search.index);

        extractedComponent.children.push({
          data: dat && !dat.match(/<.*>/g) ? dat : "",
          children: [],
          type: extractedComponent.type,
          style: extractedComponent.style,
        });
      }

      const parent = componentStack[componentStack.length - 1];
      if (!parent) {
        if (extractedComponent.children.length > 0) {
          extractedComponent.data = "";
        }
        rootComponent.children.push(extractedComponent);
      } else {
        const dummyComp = {
          children: [],
          type: extractedComponent.type,
          style: extractedComponent.style,
        };
        if (parent.type === "ol") {
          if (extractedComponent.children.length > 0) {
            extractedComponent.children = [
              { ...dummyComp, data: `\t${parent.children.length + 1}.  ` },
            ]
              .concat(extractedComponent.children)
              .concat({ ...dummyComp, data: `\n` });
          } else {
            extractedComponent.data = `\t${parent.children.length + 1}.  <h>${
              extractedComponent.data
            }</h>\n`;
          }
        } else if (parent.type === "ul") {
          if (extractedComponent.children.length > 0) {
            extractedComponent.children = [{ ...dummyComp, data: `\t•  ` }]
              .concat(extractedComponent.children)
              .concat({ ...dummyComp, data: `\n` });
          } else {
            extractedComponent.data = `\t•  ${extractedComponent.data}\n`;
          }
        }

        // Extract and add any stray text between child tags
        let stp;
        if (parent.children.length === 0) {
          stp = parent.startIndex;
        } else {
          stp = parent.children[parent.children.length - 1].closingIndex + 1;
        }
        const dat = recording.slice(stp, pop.startIndex - pop[0].length);
        if (dat && !dat.match(/<.*>/g)) {
          parent.children.push({
            data: dat,
            children: [],
            type: parent.type,
            style: parent.style,
          });
        }
        if (extractedComponent.children.length > 0) {
          extractedComponent.data = "";
        }
        if (
          extractedComponent.type === "ul" ||
          extractedComponent.type === "ol"
        ) {
          extractedComponent = extractedComponent.children;
        } else {
          extractedComponent = [extractedComponent];
        }
        parent.children = parent.children.concat(extractedComponent);
      }
    } else {
      if (search[1][0] === "a") {
        const splitTag = search[1].split(" ");
        for (item of splitTag) {
          if (item.indexOf("offset") > -1) {
            search.offset = parseFloat(item.match(/[0-9.]+/)[0]);
          } else if (item.indexOf("duration") > -1) {
            search.duration = parseFloat(item.match(/[0-9.]+/)[0]);
          }
        }
        search[1] = "a";
      } else if (search[1][0] === "b") {
        search[1] = "b";
      }
      search.type = search[1];
      search.children = [];
      search.startIndex = search.index + search[0].length;
      if (search[0].match(/<[b|u|i]>/g)) {
        search.style = search[1];
      }
      componentStack.push(search);
    }
    search = divRegex.exec(recording);
  }
  console.log(JSON.stringify(rootComponent));
  console.log(count);
  return rootComponent;
};

const unpacker = (recording, highlightState) => {
  //   const compTree = domBuilder(recording);
  return componentBuilder(recording, highlightState);
};

const componentBuilder = (compNode, highlightState) => {
  if (compNode.children.length > 0) {
    //recursive call
    return compNode.children.map((el, i) => (
      <AugmentedText
        key={i}
        style={[styles[el.type]]}
        // offset={el.offset}
        // highlightState={highlightState}
      >
        {componentBuilder(el, highlightState)}
      </AugmentedText>
    ));
  } else {
    return (
      <AugmentedText
        style={styles[compNode.style]}
        offset={compNode.offset}
        highlightState={highlightState}
      >
        {compNode.data}
        {compNode.type === "div" ? "\n" : ""}
      </AugmentedText>
    );
  }
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: COLORS.THEME_COLOR,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  messageStyle: {
    color: COLORS.MESSAGE_FONT_COLOR,
    marginTop: 8,
  },
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
  username: {
    color: COLORS.THEME_COLOR,
    fontWeight: "600",
    backgroundColor: COLORS.GRADIENT_PRIMARY_COLOR,
    paddingHorizontal: 4,
    paddingBottom: 2,
    borderRadius: 4,
  },
  sliderStyle: {
    height: 8,
  },
});

export default App;
