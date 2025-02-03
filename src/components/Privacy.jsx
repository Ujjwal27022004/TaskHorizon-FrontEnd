import React from "react";
/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */
class Privacy extends React.Component {
  render() {
    return (
      <div>
      <form>
          <label htmlFor="message">
              <input
              type='text'
              value={message}
              onChange={setMessage(message)}
              />
          </label>
          <button onSubmit={sendMessageToTeams}>
              Click on this button to send message
          </button>
      </form>
    
    </div>
    );
  }
}

export default Privacy;
