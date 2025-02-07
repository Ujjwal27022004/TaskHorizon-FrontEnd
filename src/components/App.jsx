// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
import Test from "./Test";
import TestBot from "./TestBot";
import CustomTab from "./CustomTab";
import DevTab from "./DevTab";
import ChannelList from "./ChannelList";
import CreateIssue from "./CreateIssue";
import UpdateIssue from "./UpdateIssue";
import GetIssues from "./GetIssues";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint,
    clientId: config.clientId,
  });
  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : {
                ...teamsLightTheme,
                colorNeutralBackground3: "#eeeeee",
              }
        }
        //style={{ background: tokens.colorNeutralBackground3 }}
      >
        <Router>
          {loading ? (
            <Spinner style={{ margin: 100 }} />
          ) : (
            <Routes>
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/termsofuse" element={<TermsOfUse />} />
              <Route path="/tab" element={<Tab />} />
              <Route path="/test" element={<Test />} />
              <Route path="/test-bot" element={<TestBot />} />
              <Route path="/custom-tab" element={<CustomTab />} />
              <Route path="/dev-tab" element={<DevTab />} />
              <Route path="/channel-tab" element={<ChannelList />} />
              <Route path="/create-issue" component={CreateIssue} />
              <Route path="/update-issue" component={UpdateIssue} />
              <Route path="/get-issues" component={GetIssues} />
              <Route path="*" element={<Navigate to={"/tab"} />}></Route>
             
            </Routes>
          )}
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
