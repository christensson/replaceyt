import AddIcon from "@jetbrains/icons/add";
import ChevronDownIcon from "@jetbrains/icons/chevron-down";
import ChevronUpIcon from "@jetbrains/icons/chevron-up";
import TrashIcon from "@jetbrains/icons/trash";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Checkbox from "@jetbrains/ring-ui-built/components/checkbox/checkbox";
import Collapse from "@jetbrains/ring-ui-built/components/collapse/collapse";
import CollapseContent from "@jetbrains/ring-ui-built/components/collapse/collapse-content";
import CollapseControl from "@jetbrains/ring-ui-built/components/collapse/collapse-control";
import Input, { Size } from "@jetbrains/ring-ui-built/components/input/input";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import React, { useCallback } from "react";
import type { Replacements } from "../replace-text";
import { initializeReplacement } from "../widgets/global/replacement";

interface ReplacementsInputProps {
  replacements: Replacements;
  setReplacements: React.Dispatch<React.SetStateAction<Replacements>>;
}

const ReplacementsInput: React.FunctionComponent<ReplacementsInputProps> = ({
  replacements,
  setReplacements,
}) => {
  const updateReplacementField = (index: number, key: string, value: any) => {
    setReplacements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleNameChange = useCallback((index: number, value: string) => {
    updateReplacementField(index, "name", value);
  }, []);

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

  const handleDelete = useCallback((index: number) => {
    setReplacements((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddRow = useCallback(() => {
    setReplacements((prev) => [
      ...prev,
      initializeReplacement({}, `Replacement ${prev.length + 1}`),
    ]);
  }, []);

  return (
    <div className="config-replacements-panel">
      {replacements.map((item, index) => (
        <div className="config-replacement-input-panel">
          <div className="config-replacement-input">
            <Input
              label="Name"
              value={item.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              size={Size.L}
            />
            <div className="config-pattern-regex-group">
              <Input
                label={`${item.patternIsRegex ? "Regex" : "String"} to find`}
                value={item.pattern}
                onChange={(e) => handlePatternChange(index, e.target.value)}
                placeholder={item.patternIsRegex ? "Enter regex pattern" : "Enter string"}
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
              label="Replace with"
              value={item.replacement}
              onChange={(e) => handleReplacementChange(index, e.target.value)}
              size={Size.L}
              multiline
              className="config-input"
              help={item.patternIsRegex ? "Capture groups are available using $1, $2, etc." : null}
            />
            <div className="config-input">
              <Toggle
                checked={item.enabled}
                onChange={(e) => handleEnabledChange(index, e.target.checked)}
                help="Activates the replacement for ticket and/or article on save events."
              >
                Active
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
          </div>
          <div className="config-replacement-input-controls">
            <Button
              onClick={() => handleDelete(index)}
              title="Delete replacement"
              icon={TrashIcon}
            />
          </div>
        </div>
      ))}
      <div className="config-replacement-add-panel">
        <Button onClick={handleAddRow} icon={AddIcon}>
          Add replacement
        </Button>
      </div>
    </div>
  );
};

export default ReplacementsInput;
