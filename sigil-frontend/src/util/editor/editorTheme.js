const editorTheme = {
  paragraph: "mb-2 text-parchment/80 font-[Montserrat]",
  ltr: "text-left",
  rtl: "text-right",
  heading: {
    h1: "text-4xl font-[Cinzel] text-main-accent mb-4 mt-2 block",
    h2: "text-2xl font-[Cinzel] text-main-accent/80 mb-3 mt-2 block",
  },
  quote: "border-l-2 border-main-accent/50 pl-4 italic text-parchment/60 my-4",
  list: {
    ul: "list-disc ml-6 mb-4",
    ol: "list-decimal ml-6 mb-4",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold text-main-accent",
    italic: "italic",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
  center: "text-center",
  left: "text-left",
  right: "text-right",
};

export default editorTheme;

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";

export const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
];
