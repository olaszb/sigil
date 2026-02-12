import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const EditorRenderer = ({ jsonContent }) => {
  const initialConfig = {
    namespace: "EditorRenderer",
    theme: {
      text: {
        bold: "font-bold text-main-accent",
        italic: "italic",
        underline: "underline",
      },
    },
    editable: false,
    editorState: jsonContent,
    onError: (error) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none font-[Montserrat] leading-loose text-parchment/80" />}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};

export default EditorRenderer;