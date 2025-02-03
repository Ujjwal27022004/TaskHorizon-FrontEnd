import { useContext, useState, useEffect } from "react";
import axios from 'axios';


import { Image, TabList, Tab } from "@fluentui/react-components";
import "./Welcome.css";
import { EditCode } from "./EditCode";
//import { AzureFunctions } from "./AzureFunctions";
import { CurrentUser } from "./CurrentUser";
// import { useData } from "@microsoft/teamsfx-react";
import { Deploy } from "./Deploy";
import { Publish } from "./Publish";
// import { TeamsFxContext } from "../Context";
import { app } from "@microsoft/teams-js";
import Test from "../Test";

export function Welcome(props) {
  const { showFunction, environment } = {
    showFunction: true,
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  // const { teamsUserCredential } = useContext(TeamsFxContext);
  // const { loading, data, error } = useData(async () => {
  //   if (teamsUserCredential) {
  //     const userInfo = await teamsUserCredential.getUserInfo();
  //     return userInfo;
  //   }
  // });
  const userName = "djhbfjhfsb";

  const [message, setMessage] = useState("")
  const [description, setDescription] = useState("")
  const [issueType, setIssueType] = useState("Bug")
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(issues.length / issuesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const styles = {
    container: {
      maxWidth: "1280px",
      margin: "20px auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: isDarkMode
        ? "0 4px 10px rgba(255, 255, 255, 0.1)"
        : "0 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
      color: isDarkMode ? "#f4f4f4" : "#333",
      transition: "all 0.3s ease-in-out",
    },
    heading: {
      textAlign: "center",
      marginBottom: "30px",
      fontSize: "24px",
      fontWeight: "bold",
      color: isDarkMode ? "#f4f4f4" : "#222",
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "8px",
      overflow: "hidden",
    },
    th: {
      padding: "12px",
      backgroundColor: isDarkMode ? "#03738C" : "#03738C",
      color: "white",
      textAlign: "left",
      fontWeight: "bold",
    },
    td: {
      padding: "15px",
      //border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
      textAlign: "left",
    },
    rowEven: {
      backgroundColor: isDarkMode ? "#3a3a3a" : "#f9f9f9",
    },
    rowHover: {
      backgroundColor: isDarkMode ? "#03738C" : "#03738C",
      transition: "background 0.2s",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "30px",
      gap: "20px",
    },
    button: {
      padding: "8px 15px",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      backgroundColor: isDarkMode ? "#03738C" : "#03738C",
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "background 0.3s",
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };

  useEffect(() => {
    // Fetch issues from API
    const response = axios
      .get("http://localhost:5000/get-jira-issues") // Replace with your actual API URL
      .then((response) => {
        console.log("API response is: ", response.data)
        setLoading(true)
        setIssues(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching issues:", error);
        setLoading(false);
      });

  }, []);

  const sendMessageToTeams = async () => {
    try {
      console.log("Sending message:", message); // Debugging log
      const response = await axios.post("http://localhost:5000/send-message", {
        teamId: "b94dc17d-7a42-45b4-bb8a-8ccf51342e88",
        channelId: "19:309d952cce5745c889faa9ecb705b041@thread.tacv2",
        message: "Issue has been created successfully", // Use dynamic message input
      });

      console.log("Process done");
      console.log(response.data);

      const todoResponse = await axios.post("http://localhost:5000/api/todos", {
        text: message,  // Same as the message
        completed: false
      });

      console.log("Todo added successfully:", todoResponse.data);


    } catch (error) {
      console.log("Error sending the message", error); // Log errors
    }
  };

  const sendMessageAfterCreatingBugOnJira = async (description, issueType) => {
    const obj = {
      description,
      issueType
    };

    const issueData = {
      description: obj.description,
      issueType: obj.issueType
    };

    console.log('Sending to JIRA:', obj);

    console.log("working till here")

    try {
      // Ensure description and issueType are provided
      if (!description || !issueType) {
        throw new Error('Description and issueType are required');
      }

      const JIRA_EMAIL = 'ujjwal2702204@gmail.com';  // Replace with your JIRA email
      const JIRA_API_TOKEN = 'ATATT3xFfGF0aZ9BTIUG978VNsD_Hag6JlYSdef4ttOHwPL3izRMHVuCNv40y8JRmLwhuXVUuvoYQjXKVklb_Mx6vWYllORcR6uYfqGyDGUWbryKKdXAG8yefnUk3M5dRmPFr609VqDwCwZ47KSSeDuq5qLxATqFOVQMP_rdstM2X_8wl9qGRtk=1C9D48C4';  // Replace with your JIRA API token
      // JIRA Issue creation payload (only description and issueType passed in request body)


      // Encode credentials for Basic Authentication
      const authHeader = `Basic ${btoa(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`)}`;

      // Send the request to create the JIRA issue using Basic Auth
      const response = await axios.post("http://localhost:5000/create-jira-issue", issueData, {
        headers: {
          'Authorization': authHeader,  // Basic Authentication
          'Content-Type': 'application/json'
        }
      });

      console.log("Issue has been submitted successfully:", response.data);


    } catch (error) {
      console.log("Error in creating JIRA bug and sending message to Teams channel", error);
    }
  };

  // Assuming you have this function for sending messages to Teams (already implemented in your backend)
  async function sendMessageToChannel(teamId, channelId, message) {
    // Your existing Teams message sending logic here
    console.log(`Sending message to team: ${teamId}, channel: ${channelId}, message: ${message}`);
  }




  // const hubName = useData(async () => {
  //   await app.initialize();
  //   const context = await app.getContext();
  //   return context.app.host.name;
  // })?.data;
  const [selectedValue, setSelectedValue] = useState("local");

  const onTabSelect = (event, data) => {
    setSelectedValue(data.value);
  };
  return (
    <div className="welcome page">
      {/* //   <div className="narrow page-padding">
    //     <Image src="hello.png" />
    //     <h1 className="center">Congratulations{userName ? ", " + userName : ""}!</h1>
    //     <p className="center">Your app is running in your {friendlyEnvironmentName}</p>
    //     {hubName && <p className="center">Your app is running in {hubName}</p>} */}


      {/* <form onSubmit={(e) => {
        e.preventDefault()
        sendMessageAfterCreatingBugOnJira();
      }}
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: isDarkMode
          ? "0 4px 10px rgba(255, 255, 255, 0.1)"
          : "0 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
        color: isDarkMode ? "#f4f4f4" : "#333",
        transition: "all 0.3s ease-in-out",
      }} */}
       {/* Prevent form submission */}
        {/* <h1>This was our to do app implementation</h1>
        <label htmlFor="message"
        style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Enter Your Message to send to MS Teams (or external app)
          </label>
          <input
            type='text'
            value={message}
            placeholder="Enter a Message"
            onChange={(e) => { setMessage(e.target.value) }}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
              backgroundColor: isDarkMode ? "#3a3a3a" : "#fff",
              color: isDarkMode ? "#f4f4f4" : "#333",
            }}
          />
        
        <button onClick={sendMessageToTeams}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          backgroundColor: isDarkMode ? "#007bff" : "#0056b3",
          color: "white",
          fontWeight: "bold",
          transition: "background 0.3s",
        }}
        >
          Click on this button to send message
        </button>
      </form> */}

      <form
       style={{
        maxWidth: "700px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: isDarkMode
          ? "0 4px 10px rgba(255, 255, 255, 0.1)"
          : "0 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
        color: isDarkMode ? "#f4f4f4" : "#333",
        transition: "all 0.3s ease-in-out",
      }}
        onSubmit={(e) => {
          e.preventDefault();  // Prevent form submission and page refresh
          sendMessageAfterCreatingBugOnJira(description, issueType);  // Call the function here
        }}
      >
        <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "22px",
          lineHeight:"30px"
        }}
        >
          Create an Product Backlog using MS Team's integrated Polarion Application
        </h1>
        <label htmlFor="description"
        style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        > 
        Enter Description 
        </label>
          <input
            type='text'
            value={description}
            placeholder="Description"
            onChange={(e) => { setDescription(e.target.value); }}
            style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
            backgroundColor: isDarkMode ? "#3a3a3a" : "#fff",
            color: isDarkMode ? "#f4f4f4" : "#333",
          }}
          />
       

        <label htmlFor="issueType"
        style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Enter Product Backlog Type
            </label>
            <select
            name="issueType"
            value={issueType}
            onChange={(e)=>setIssueType(e.target.value)} 
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
              backgroundColor: isDarkMode ? "#3a3a3a" : "#fff",
              color: isDarkMode ? "#f4f4f4" : "#333",
            }}
            >
              <option value="Bug">Bug</option>
              <option value="Story">Story</option>
              <option value="Task">Task</option>
            </select>
          {/* <input
            type='text'
            value={issueType}
            placeholder="issue type"
            onChange={(e) => { setIssueType(e.target.value); }}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
              backgroundColor: isDarkMode ? "#3a3a3a" : "#fff",
              color: isDarkMode ? "#f4f4f4" : "#333",
            }}
          /> */}

        <button type="submit"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          backgroundColor: isDarkMode ? "#03738C" : "#03738C",
          color: "white",
          fontWeight: "bold",
          transition: "background 0.3s",
        }}
        >
          Create Polarion Product Backlog
        </button>
      </form>
      <div style={styles.container}>
        <h2 style={styles.heading}>Product Backlogs</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Key</th>
                    <th style={styles.th}>Summary</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Backlog Type</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIssues.map((issue, index) => (
                    <tr
                      key={issue.id}
                      style={{
                        ...styles.td,
                        ...(index % 2 === 0 ? styles.rowEven : {}),
                      }}
                    >
                      <td style={styles.td}>{issue.id}</td>
                      <td style={styles.td}>{issue.key}</td>
                      <td style={styles.td}>{issue.summary}</td>
                      <td style={styles.td}>{issue.description || "No description"}</td>
                      <td style={styles.td}>{issue.issueType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={styles.pagination}>
              <button
                style={{ ...styles.button, ...(currentPage === 1 ? styles.buttonDisabled : {}) }}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                ⬅ Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                style={{ ...styles.button, ...(currentPage === totalPages ? styles.buttonDisabled : {}) }}
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next ➡
              </button>
            </div>
          </>
        )}
      </div>




      <div className="tabList">
        {/* <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
          <Tab id="Local" value="local">
            1. Build your app locally
          </Tab>
          <Tab id="Azure" value="azure">
            2. Provision and Deploy to the Cloud
          </Tab>
          <Tab id="Publish" value="publish">
            3. Publish to Teams
          </Tab>
          <Tab id="Test" value="test">
            4. Test Message
          </Tab>
        </TabList> */}
        <div>
          {selectedValue === "local" && (
            <div>
              <EditCode showFunction={showFunction} />
              <CurrentUser userName={userName} />
              {/* //{showFunction && <AzureFunctions />} */}
            </div>
          )}
          {selectedValue === "azure" && (
            <div>
              <Deploy />
            </div>
          )}
          {selectedValue === "publish" && (
            <div>
              <Publish />
            </div>
          )}
          {selectedValue === "test" && (
            <div>
              <Test />
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
