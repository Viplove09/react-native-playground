import {
  replaceMentionValues,
  mentionRegEx,
} from "react-native-controlled-mentions";
import { COLORS } from "./constants";

export const mentionRegularExp = mentionRegEx;

const getMentionValue = (type, text) => {
  return type === "id"
    ? replaceMentionValues(text, ({ id }) => id)
    : replaceMentionValues(text, ({ name }) => `@${name}`);
};

export const renderMentions = (matchingString, matches) => {
  return getMentionValue("name", matchingString);
};

export const mentionClicked = (text) => {
  console.log(getMentionValue("id", text));
};

export const mentionStyle = {
  color: COLORS.THEME_COLOR,
  fontWeight: "600",
  backgroundColor: COLORS.GRADIENT_PRIMARY_COLOR,
  paddingHorizontal: 4,
  paddingBottom: 2,
  borderRadius: 4,
};
