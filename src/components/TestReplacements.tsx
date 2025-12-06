import WarningIcon from "@jetbrains/icons/warning-empty";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Code, { highlight } from "@jetbrains/ring-ui-built/components/code/code";
import Icon from "@jetbrains/ring-ui-built/components/icon/icon.js";
import Input, { Size } from "@jetbrains/ring-ui-built/components/input/input";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import React, { useCallback, useState } from "react";
import type { Replacements } from "../replace-text";
import { replaceText } from "../replace-text";
// @ts-ignore
import langMarkdown from "highlight.js/lib/languages/markdown.js";
highlight.registerLanguage("markdown", langMarkdown);

interface TestReplacementsProps {
  testTextInput: string;
  setTestTextInput: React.Dispatch<React.SetStateAction<string>>;
  replacements: Replacements;
}

const TestReplacements: React.FunctionComponent<TestReplacementsProps> = ({
  testTextInput,
  setTestTextInput,
  replacements,
}) => {
  const [testTextOutput, setTestTextOutput] = useState<string>("");
  const [showRecursiveReplacementWarning, setRecursiveReplacementWarning] =
    useState<boolean>(false);

  const testReplacements = useCallback(
    (inputText: string) => {
      const outputText = replaceText(inputText, replacements, false, "any");
      const outputText2 = replaceText(outputText, replacements, false, "any");
      setTestTextOutput(outputText);

      const noChangeIfAppliedTwice = outputText === outputText2;
      setRecursiveReplacementWarning(!noChangeIfAppliedTwice);
    },
    [replacements]
  );

  return (
    <div className="config-test-panel">
      <Text size={Text.Size.M} info>
        Test configured replacements
      </Text>
      <Input
        label="Input text"
        onChange={(e) => {
          console.log("input changed");
          setTestTextInput(e.target.value);
        }}
        defaultValue={testTextInput}
        size={Size.L}
        multiline
      />
      <Button
        onClick={() => {
          testReplacements(testTextInput);
        }}
      >
        Test replacements
      </Button>
      {showRecursiveReplacementWarning && (
        <div className="config-recursive-replacement-warning">
          <Icon glyph={WarningIcon} className="warning-color" />
          <Text size={Text.Size.M}>
            Warning! Applying the replacements multiple times produces different results. This may
            lead to unexpected behavior.
          </Text>
        </div>
      )}
      {testTextOutput && <Code language="markdown" code={testTextOutput} />}
    </div>
  );
};

export default TestReplacements;
