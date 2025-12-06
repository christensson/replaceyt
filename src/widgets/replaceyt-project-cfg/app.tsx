import Button from "@jetbrains/ring-ui-built/components/button/button";
import ChevronDownIcon from "@jetbrains/icons/chevron-down";
import ChevronUpIcon from "@jetbrains/icons/chevron-up";
import Collapse from "@jetbrains/ring-ui-built/components/collapse/collapse";
import CollapseContent from "@jetbrains/ring-ui-built/components/collapse/collapse-content";
import CollapseControl from "@jetbrains/ring-ui-built/components/collapse/collapse-control";
import Panel from "@jetbrains/ring-ui-built/components/panel/panel";
import React, { memo, useEffect, useState } from "react";
import ReplacementsInput from "../../components/ReplacementsInput";
import TestReplacements from "../../components/TestReplacements";
import type { Replacements } from "../../replace-text";
import { initializeReplacement } from "../global/replacement";

// Register widget in YouTrack. To learn more, see https://www.jetbrains.com/help/youtrack/devportal-apps/apps-host-api.html
const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
  const [replacements, setReplacements] = useState<Replacements>([]);
  const [globalReplacements, setGlobalReplacements] = useState<Replacements>([]);
  const [testTextInput, setTestTextInput] = useState<string>("");

  useEffect(() => {
    host
      .fetchApp<{
        replacements: Replacements;
        globalReplacements: Replacements;
        testInput: string;
      }>("backend/projectConfig", {
        scope: true,
      })
      .then((result) => {
        const replacements = result.replacements;
        const globalReplacements = result.globalReplacements;
        const testInput = result.testInput;
        // eslint-disable-next-line no-console
        console.log("Got replacements:", replacements);
        if (replacements != null && Array.isArray(replacements)) {
          for (let i = 0; i < replacements.length; i++) {
            replacements[i] = initializeReplacement(replacements[i], `Replacement ${i + 1}`);
          }
          setReplacements(replacements);
          setGlobalReplacements(globalReplacements);
          setTestTextInput(testInput);
        }
      });
  }, [host]);

  const storeReplacements = async (replacements: Replacements) => {
    console.log("Storing replacements:", replacements);
    const res = await host.fetchApp("backend/projectConfig", {
      scope: true,
      method: "POST",
      body: { replacements: replacements, testInput: testTextInput },
    });
    console.log("Store response:", res);
  };

  return (
    <div className="widget">
      <div className="config-and-test-panel">
        <div className="config-left-panel">
          <ReplacementsInput replacements={replacements} setReplacements={setReplacements} />
          <Collapse>
            <CollapseControl>
              {(collapsed: boolean) => (
                <Button icon={collapsed ? ChevronDownIcon : ChevronUpIcon}>
                  {collapsed
                    ? "Show replacements configured globally"
                    : "Hide replacements configured globally"}
                </Button>
              )}
            </CollapseControl>
            <CollapseContent>
              <ReplacementsInput
                replacements={globalReplacements}
                setReplacements={setGlobalReplacements}
                readonly
                hideInactive
              />
            </CollapseContent>
          </Collapse>
        </div>
        <div className="config-right-panel">
          <TestReplacements
            testTextInput={testTextInput}
            setTestTextInput={setTestTextInput}
            replacements={[...globalReplacements, ...replacements]}
          />
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
