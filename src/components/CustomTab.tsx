import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const CustomTab = () => {
    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <iframe 
                src="https://html.duckduckgo.com/html" 
                title="DuckDuckGo Search Engine"
                style={{ width: "100%", height: "100%", border: "none" }} 
            />
        </div>
    );
};

export default CustomTab;
