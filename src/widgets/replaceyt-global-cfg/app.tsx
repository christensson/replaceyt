import React, { memo, useCallback, useEffect, useState } from "react";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Input, { Size } from "@jetbrains/ring-ui-built/components/input/input";
import WarningIcon from "@jetbrains/icons/warning-empty";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import Panel from "@jetbrains/ring-ui-built/components/panel/panel";
import Code from "@jetbrains/ring-ui-built/components/code/code";
import { highlight } from "@jetbrains/ring-ui-built/components/code/code";
// @ts-ignore
import langMarkdown from "highlight.js/lib/languages/markdown.js";
import { replaceText } from "../../replace-text";
import type { Replacements, Replacement } from "../../replace-text";
import Icon from "@jetbrains/ring-ui-built/components/icon/icon.js";
import ReplacementsInput from "../../components/ReplacementsInput";

highlight.registerLanguage("markdown", langMarkdown);

const defaultReplacement: Replacement = {
  id: "",
  name: "",
  pattern: "",
  replacement: "",
  patternIsRegex: false,
  ignoreCodeBlocks: true,
  ignoreLinks: true,
  ignoreInlineCode: false,
  enabled: false,
  enabledForArticles: true,
  enabledForIssues: true,
};

// Register widget in YouTrack. To learn more, see https://www.jetbrains.com/help/youtrack/devportal-apps/apps-host-api.html
const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
  const [replacements, setReplacements] = useState<Replacements>([]);
  const [testTextInput, setTestTextInput] = useState<string>("");
  const [testTextOutput, setTestTextOutput] = useState<string>("");
  const [showRecursiveReplacementWarning, setRecursiveReplacementWarning] =
    useState<boolean>(false);

  useEffect(() => {
    host
      .fetchApp<{ replacements: Replacements; testInput: string }>("backend/globalConfig", {})
      .then((result) => {
        const replacements = result.replacements;
        const testInput = result.testInput;
        // eslint-disable-next-line no-console
        console.log("Got replacements:", replacements);
        if (replacements != null && Array.isArray(replacements)) {
          for (let i = 0; i < replacements.length; i++) {
            const item = replacements[i];
            for (const [key, value] of Object.entries(defaultReplacement)) {
              if (item.hasOwnProperty(key) === false) {
                // @ts-ignore
                item[key] = value;
              }
            }
            if (item.id == null || item.id === "") {
              item.id = crypto.randomUUID();
            }
            if (item.name == null || item.name === "") {
              item.name = `Replacement ${i + 1}`;
            }
          }
          setReplacements(replacements);
          setTestTextInput(testInput);
        }
      });
  }, [host]);

  const storeReplacements = async (replacements: Replacements) => {
    console.log("Storing replacements:", replacements);
    const res = await host.fetchApp("backend/globalConfig", {
      method: "POST",
      body: { replacements: replacements, testInput: testTextInput },
    });
    console.log("Store response:", res);
  };

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
    <div className="widget">
      <div className="config-and-test-panel">
        <ReplacementsInput
          replacements={replacements}
          setReplacements={setReplacements}
          defaultReplacement={defaultReplacement}
        />
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
                Warning! Applying the replacements multiple times produces different results. This
                may lead to unexpected behavior.
              </Text>
            </div>
          )}
          {testTextOutput && <Code language="markdown" code={testTextOutput} />}
        </div>
      </div>
      <Panel>
        <Button primary onClick={() => storeReplacements(replacements)}>
          Save
        </Button>
      </Panel>
    </div>
  );
};

export const App = memo(AppComponent);
