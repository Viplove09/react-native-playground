export const htmlSplitter = (htmlDoc) => {
  // HTML will always come wrapped inside a <div></div>
  htmlDoc = htmlDoc.substr(5, htmlDoc.length - 11);
  split = htmlDoc.split("<a offset=");
  const ret = [];
  for (let a in split) {
    let cur = split[a];
    if (cur.length < 1) {
      continue;
    }
    //Start with Offset
    let offsetStart, offsetEnd;
    if (cur[0] === '"') {
      offsetStart = 1;
      offsetEnd = cur.indexOf('"', 1);
    } else {
      offsetStart = 0;
      offsetEnd = cur.match(/\ |\>/).index;
    }
    const Offset = parseInt(cur.substr(offsetStart, offsetEnd - offsetStart));
    // Let's get the Duration now
    const durationregex = new RegExp(`(duration\\=)(\\"|\\'?)(\\d+)(\\"|\\'?)`);
    const durationMatch = cur.match(durationregex);
    let Duration;
    if (durationMatch) {
      Duration = parseInt(durationMatch[durationMatch.length - 2]);
    }
    // make sure offsetEnd points at '>'
    offsetEnd = cur.indexOf(">");
    cur = cur.substr(offsetEnd + 1);

    const closingTag = cur.lastIndexOf("</a>");
    const Word = cur.substr(0, closingTag);
    const ExtraInfo = cur.substr(closingTag + 4);
    ret.push({ Offset, Word, ExtraInfo, Duration });
  }
  return ret;
};

export const htmlKnitter = (jsonArr) => {
  let res = "";
  console.log(jsonArr);
  for (let a in jsonArr) {
    const cur = jsonArr[a];
    res += `<a offset="${cur.Offset}" duration="${cur.Duration}">${cur.Word}</a>${cur.ExtraInfo}`;
  }
  return "<div>" + res + "</div>";
};

export const highlightWord = (htmlDoc, offset, color) => {
  console.log("htmldoc", htmlDoc);
  const queryString = `(offset\\=)(\\"|\\'?)(${offset})(\\"|\\'?)`;
  let regex = new RegExp(queryString);
  const match = htmlDoc.match(regex);
  if (!match) {
    return htmlDoc;
  }
  const index = match[0].length + match.index;
  final =
    htmlDoc.substr(0, index) +
    'style="background-color:' +
    color +
    ';" ' +
    htmlDoc.substr(index);
  return final;
};

export const incrementOffset = (htmlDoc, increment, startWord) => {};
