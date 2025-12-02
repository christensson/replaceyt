import React, { memo, useCallback, useEffect, useState } from "react";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Input, { Size } from "@jetbrains/ring-ui-built/components/input/input";
import TrashIcon from "@jetbrains/icons/trash";
import AddIcon from "@jetbrains/icons/add";
import ChevronDownIcon from "@jetbrains/icons/chevron-down";
import ChevronUpIcon from "@jetbrains/icons/chevron-up";
import WarningIcon from "@jetbrains/icons/warning-empty";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import Panel from "@jetbrains/ring-ui-built/components/panel/panel";
import { Grid, Row, Col } from "@jetbrains/ring-ui-built/components/grid/grid";
import Code from "@jetbrains/ring-ui-built/components/code/code";
import { highlight } from "@jetbrains/ring-ui-built/components/code/code";
import Checkbox from "@jetbrains/ring-ui-built/components/checkbox/checkbox";
import Collapse from "@jetbrains/ring-ui-built/components/collapse/collapse";
import CollapseControl from "@jetbrains/ring-ui-built/components/collapse/collapse-control";
import CollapseContent from "@jetbrains/ring-ui-built/components/collapse/collapse-content";
// @ts-ignore
import langMarkdown from "highlight.js/lib/languages/markdown.js";
import { replaceText } from "../../replace-text";
import type { Replacements, Replacement } from "../../replace-text";
import Icon from "@jetbrains/ring-ui-built/components/icon/icon.js";

highlight.registerLanguage("markdown", langMarkdown);

const defaultReplacement: Replacement = {
  id: "",
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
          for (const item of replacements) {
            for (const [key, value] of Object.entries(defaultReplacement)) {
              if (item.hasOwnProperty(key) === false) {
                // @ts-ignore
                item[key] = value;
              }
            }
            if (item.id == null || item.id === "") {
              item.id = crypto.randomUUID();
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

  const updateReplacementField = (index: number, key: string, value: any) => {
    setReplacements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handlePatternChange = useCallback((index: number, value: string) => {
    updateReplacementField(index, "pattern", value);
  }, []);

  const handleReplacementChange = useCallback((index: number, value: string) => {
    updateReplacementField(index, "replacement", value);
  }, []);

  const handlePatternIsRegexChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "patternIsRegex", value);
  }, []);

  const handleIgnoreCodeBlocksChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "ignoreCodeBlocks", value);
  }, []);

  const handleIgnoreLinksChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "ignoreLinks", value);
  }, []);

  const handleIgnoreInlineCodeChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "ignoreInlineCode", value);
  }, []);

  const handleEnabledChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "enabled", value);
  }, []);

  const handleEnabledForArticlesChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "enabledForArticles", value);
  }, []);

  const handleEnabledForIssuesChange = useCallback((index: number, value: boolean) => {
    updateReplacementField(index, "enabledForIssues", value);
  }, []);

  const handleAddRow = useCallback(() => {
    setReplacements((prev) => [
      ...prev,
      {
        ...defaultReplacement,
        id: crypto.randomUUID(),
      },
    ]);
  }, []);

  const handleDeleteRow = useCallback((index: number) => {
    setReplacements((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
        <div className="config-replacements-panel">
          <Grid>
            {replacements.map((item, index) => (
              <Row key={index} className="data-row">
                <Col xs={11}>
                  <div className="config-pattern-regex-group">
                    <Input
                      label={`${item.patternIsRegex ? "Regex" : "String"} to search and replace`}
                      value={item.pattern}
                      onChange={(e) => handlePatternChange(index, e.target.value)}
                      placeholder="Enter pattern"
                      size={Size.L}
                    />
                    <Button
                      title="Interpret pattern as a regular expression"
                      onClick={() => handlePatternIsRegexChange(index, !item.patternIsRegex)}
                      active={item.patternIsRegex}
                      className="config-regex-toggle"
                    >
                      {".*"}
                    </Button>
                  </div>
                  <Input
                    label="Replacement"
                    value={item.replacement}
                    onChange={(e) => handleReplacementChange(index, e.target.value)}
                    size={Size.L}
                    multiline
                    className="config-input"
                    help={
                      item.patternIsRegex ? "Capture groups are available using $1, $2, etc." : null
                    }
                  />
                  <div className="config-input">
                    <Toggle
                      checked={item.enabled}
                      onChange={(e) => handleEnabledChange(index, e.target.checked)}
                      help="Activates the replacement for ticket and/or article on save events."
                    >
                      Activated
                    </Toggle>
                  </div>
                  <Collapse>
                    <CollapseControl>
                      {(collapsed: boolean) => (
                        <Button icon={collapsed ? ChevronDownIcon : ChevronUpIcon}>
                          {collapsed ? "Show advanced settings" : "Hide advanced settings"}
                        </Button>
                      )}
                    </CollapseControl>
                    <CollapseContent>
                      <div className="config-input">
                        <Checkbox
                          label="Use for Tickets"
                          checked={item.enabledForIssues}
                          onChange={(e) => handleEnabledForIssuesChange(index, e.target.checked)}
                          help="Use replacement for Tickets."
                        />
                      </div>
                      <div className="config-input">
                        <Checkbox
                          label="Use for Articles"
                          checked={item.enabledForArticles}
                          onChange={(e) => handleEnabledForArticlesChange(index, e.target.checked)}
                          help="Use replacement for Knowledge Base Articles."
                        />
                      </div>
                      <div className="config-input">
                        <Checkbox
                          label="Ignore code blocks"
                          checked={item.ignoreCodeBlocks}
                          onChange={(e) => handleIgnoreCodeBlocksChange(index, e.target.checked)}
                        />
                      </div>
                      <div className="config-input">
                        <Checkbox
                          label="Ignore links"
                          checked={item.ignoreLinks}
                          onChange={(e) => handleIgnoreLinksChange(index, e.target.checked)}
                        />
                      </div>
                      <div className="config-input">
                        <Checkbox
                          label="Ignore inline code"
                          checked={item.ignoreInlineCode}
                          onChange={(e) => handleIgnoreInlineCodeChange(index, e.target.checked)}
                        />
                      </div>
                    </CollapseContent>
                  </Collapse>
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => handleDeleteRow(index)}
                    title="Delete replacement"
                    icon={TrashIcon}
                  />
                </Col>
              </Row>
            ))}
            <Row className="add-row">
              <Col>
                <Button onClick={handleAddRow} icon={AddIcon}>
                  Add replacement
                </Button>
              </Col>
            </Row>
          </Grid>
        </div>
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
            <div>
              <Icon glyph={WarningIcon} />
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
