import React, { useEffect } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
  defaultActions,
} from "react-native-pell-rich-editor";
import recording from "./recording";
import { highlightWord, htmlSplitter, htmlKnitter } from "./utils";
import sendIcon from "./assets/send.png";

const App = () => {
  const richText = React.useRef();
  const resetHTML = React.useRef();
  let lastHightlight = 0;
  // let ignoreReset = false;

  function editorInitializedCallback() {
    richText.current?.registerToolbar(function (items) {
      // items contain all the actions that are currently active
      // console.log("Toolbar:", items);
    });
  }

  function handleCustomAction() {
    console.log("what what");
  }

  return (
    <ScrollView style={{ flex: 1, marginTop: 40, backgroundColor: "#F5FCFF" }}>
      <RichToolbar
        // style={{
        //   height: 40,
        //   backgroundColor: "#F5FCFF",
        //   borderWidth: 1,
        // }}
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.insertBulletsList,
          actions.insertOrderedList,
          "customAction",
        ]}
        iconTint="#000"
        iconWidth={40}
        iconGap={30}
        selectedButtonStyle={{
          backgroundColor: "#C6F3F3",
          // width: 30,
          height: 30,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
        unselectedButtonStyle={{
          // width: 30,
          height: 40,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
        iconMap={{
          customAction: sendIcon,
        }}
        customAction={handleCustomAction}
        // renderAction={() => {
        //   return <View></View>;  // custom toolbar code will be here
        // }}
      />
      <Text>Description:</Text>
      <RichEditor
        containerStyle={{
          backgroundColor: "black",
          borderColor: "black",
          borderWidth: 1,
        }}
        style={{ minHeight: 300, flex: 1 }}
        ref={richText}
        autoCapitalize="sentences"
        onChange={(descriptionText) => {
          // if (!ignoreReset) {
          resetHTML.current = descriptionText;
          // console.log(descriptionText);
          // } else {
          // ignoreReset = false;
          /*
            const index = descriptionText.match(/(?:\<a offset\=\")[est]+\"/);
            const mod = descriptionText.substr(0, index.index);
            const off = mod.match(/(?:\<a offset\=\")\d+\"/);
            console.log(mod, off);
            richText.current.setContentHTML(resetHTML.current);*/
          // console.log("here")
          // htmlSplitter(descriptionText);
          // }
        }}
        onKeyDown={(params) => {
          console.log(params);
        }}
        editorInitializedCallback={editorInitializedCallback}
        placeholder="Write message here..."
      />
      <TouchableOpacity
        onPress={() => {
          resetHTML.current =
            '<div><a style="background-color:#2dddff;color:#fff" offset="10" duration="10" onclick="_.sendAction(this.getAttribute(\'offset\'))">Test</a><a offset="20" duration="10" onmouseup="_.sendAction(this.getAttribute(\'offset\'))"> text </a><a offset="30" duration="10">Random </a><a offset="40" duration="1000">Text</a></div>';
          richText.current.setContentHTML(resetHTML.current);
        }}
      >
        <Text>Insert HTML</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // ignoreReset = true;
          let newHtml = highlightWord(
            resetHTML.current,
            lastHightlight,
            "#fff"
          );
          newHtml = highlightWord(newHtml, lastHightlight + 10, "#f0f");
          richText.current.setContentHTML(newHtml);
          lastHightlight += 10;
          // richText.current.insertHTML('<a offset="test">.</a>');
        }}
      >
        <Text>split HTML</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          const jsonA = htmlSplitter(resetHTML.current);
          const html = htmlKnitter(jsonA);
          console.log(html);
          console.log(resetHTML.current);
          richText.current.setContentHTML(html);
        }}
      >
        <Text> regen HTML</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default App;
