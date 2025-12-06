import Button from "@jetbrains/ring-ui-built/components/button/button";
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
  const [testTextInput, setTestTextInput] = useState<string>("");

  useEffect(() => {
    host
      .fetchApp<{ replacements: Replacements; testInput: string }>(
        "global-backend/globalConfig",
        {}
      )
      .then((result) => {
        const replacements = result.replacements;
        const testInput = result.testInput;
        // eslint-disable-next-line no-console
        console.log("Got replacements:", replacements);
        if (replacements != null && Array.isArray(replacements)) {
          for (let i = 0; i < replacements.length; i++) {
            replacements[i] = initializeReplacement(replacements[i], `Replacement ${i + 1}`);
          }
          setReplacements(replacements);
          setTestTextInput(testInput);
        }
      });
  }, [host]);

  const storeReplacements = async (replacements: Replacements) => {
    console.log("Storing replacements:", replacements);
    const res = await host.fetchApp("global-backend/globalConfig", {
      method: "POST",
      body: { replacements: replacements, testInput: testTextInput },
    });
    console.log("Store response:", res);
  };

  return (
    <div className="widget">
      <div className="config-and-test-panel">
        <ReplacementsInput replacements={replacements} setReplacements={setReplacements} />
        <TestReplacements
          testTextInput={testTextInput}
          setTestTextInput={setTestTextInput}
          replacements={replacements}
        />
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
