import React, { memo, useCallback, useEffect, useState } from "react";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Input, { Size } from "@jetbrains/ring-ui-built/components/input/input";
import TrashIcon from "@jetbrains/icons/trash";
import AddIcon from "@jetbrains/icons/add";
import Panel from "@jetbrains/ring-ui-built/components/panel/panel";
import { Grid, Row, Col } from "@jetbrains/ring-ui-built/components/grid/grid";
import type { Replacements } from "../../../@types/replacements";
import Checkbox from "@jetbrains/ring-ui-built/components/checkbox/checkbox.js";

// Register widget in YouTrack. To learn more, see https://www.jetbrains.com/help/youtrack/devportal-apps/apps-host-api.html
const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
  const [replacements, setReplacements] = useState<Replacements>([]);
  useEffect(() => {
    host.fetchApp<{ replacements: Replacements }>("backend/globalConfig", {}).then((result) => {
      const replacements = result.replacements;
      // eslint-disable-next-line no-console
      console.log("Replacements:", replacements);
      if (replacements != null && Array.isArray(replacements)) {
        for (const item of replacements) {
          if (item.hasOwnProperty("patternIsRegex") === false) {
            item.patternIsRegex = false;
          }
        }
        setReplacements(replacements);
      }
    });
  }, [host]);

  const storeReplacements = async (replacements: Replacements) => {
    console.log("Storing replacements:", replacements);
    const res = await host.fetchApp("backend/globalConfig", {
      method: "POST",
      body: { replacements: replacements },
    });
    console.log("Store response:", res);
  };

  const handlePatternChange = useCallback((index: number, value: string) => {
    setReplacements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], pattern: value };
      return updated;
    });
  }, []);

  const handlePatternIsRegexChange = useCallback((index: number, value: boolean) => {
    setReplacements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], patternIsRegex: value };
      return updated;
    });
  }, []);

  const handleReplacementChange = useCallback((index: number, value: string) => {
    setReplacements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], replacement: value };
      return updated;
    });
  }, []);

  const handleAddRow = useCallback(() => {
    setReplacements((prev) => [...prev, { pattern: "", patternIsRegex: false, replacement: "" }]);
  }, []);

  const handleDeleteRow = useCallback((index: number) => {
    setReplacements((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="widget">
      <Grid>
        <Row className="header-row">
          <Col xs={2}>Regex</Col>
          <Col xs={5}>Pattern</Col>
          <Col xs={4}>Replacement</Col>
          <Col xs={1}></Col>
        </Row>
        {replacements.map((item, index) => (
          <Row key={index} middle="xs" className="data-row">
            <Col xs={2}>
              <Checkbox
                checked={item.patternIsRegex as boolean}
                onChange={(e) => handlePatternIsRegexChange(index, e.target.checked)}
              />
            </Col>
            <Col xs={5}>
              <Input
                value={item.pattern as string}
                onChange={(e) => handlePatternChange(index, e.target.value)}
                placeholder="Enter pattern"
                size={Size.AUTO}
              />
            </Col>
            <Col xs={4}>
              <Input
                value={item.replacement as string}
                onChange={(e) => handleReplacementChange(index, e.target.value)}
                placeholder="Enter replacement"
                size={Size.AUTO}
              />
            </Col>
            <Col xs={1} className="delete-col">
              <Button onClick={() => handleDeleteRow(index)} title="Delete row" icon={TrashIcon} />
            </Col>
          </Row>
        ))}
        <Row className="add-row">
          <Col xs={12}>
            <Button onClick={handleAddRow} icon={AddIcon}>
              Add Row
            </Button>
          </Col>
        </Row>
      </Grid>
      <Panel>
        <Button primary onClick={() => storeReplacements(replacements)}>
          Save
        </Button>
      </Panel>
    </div>
  );
};

export const App = memo(AppComponent);
