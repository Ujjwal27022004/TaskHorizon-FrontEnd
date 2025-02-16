"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Image } from "@fluentui/react-components"
import {
  Button,
  Input,
  Select,
  Label,
  Spinner,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components"
import {
  Add24Regular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
  Search24Regular,
  ArrowSortDown24Regular,
  ArrowSortUp24Regular,
} from "@fluentui/react-icons"
import "./Welcome.css"

export function Welcome(props) {
  const { environment } = {
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  }

  const [description, setDescription] = useState("")
  const [issueType, setIssueType] = useState("Bug")
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [updatedDescription, setUpdatedDescription] = useState("")
  const [updatedIssueType, setUpdatedIssueType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("key")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterType, setFilterType] = useState("All")

  const issuesPerPage = 10
  const indexOfLastIssue = currentPage * issuesPerPage
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage

  const filteredIssues = issues
    .filter(
      (issue) =>
        (filterType === "All" || issue.issueType === filterType) &&
        (issue.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue)
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage)

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/get-jira-issues")
      setIssues(response.data)
    } catch (error) {
      console.error("Error fetching issues:", error)
    }
    setLoading(false)
  }

  const sendMessageAfterCreatingBugOnJira = async (description, issueType) => {
    try {
      const issueData = { description, issueType }
      const response = await axios.post("http://localhost:5000/create-jira-issue", issueData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("Issue has been submitted successfully:", response.data)
      fetchIssues()
      setDescription("")
      setIssueType("Bug")
    } catch (error) {
      console.log("Error in creating JIRA bug", error)
    }
  }

  const handleOpenModal = (issue) => {
    setSelectedIssue(issue)
    setUpdatedDescription(issue.description || "")
    setUpdatedIssueType(issue.issueType || "Bug")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIssue(null)
  }

  const handleUpdateIssue = async () => {
    if (!updatedDescription || !updatedIssueType) {
      alert("Both fields are required!")
      return
    }

    try {
      const response = await axios.post("http://localhost:5000/updateIssue", {
        verb: "updateIssue",
        data: {
          issueKey: selectedIssue.key,
          updatedIssueType,
          updatedDescription,
        },
      })

      console.log("JIRA issue updated:", response.data)
      alert("Issue updated successfully!")
      fetchIssues()
      handleCloseModal()
    } catch (error) {
      console.error("Error updating issue:", error)
      alert("Failed to update issue. Please try again.")
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="jira-app">
      <header className="app-header">
        <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVS-idYcK2ntCWT_pBtrFUcI7nx5--KC3n-A&s" alt="Jira Logo" className="jira-logo" />
        <h1>Jira Cloud for Microsoft Teams</h1>
      </header>

      <main className="app-main">
        <section className="create-issue-section">
          <h2>Create New Issue</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessageAfterCreatingBugOnJira(description, issueType)
            }}
          >
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter issue description"
            />

            <Label htmlFor="issueType">Issue Type</Label>
            <Select id="issueType" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
              <option value="Bug">Bug</option>
              <option value="Story">Story</option>
              <option value="Task">Task</option>
            </Select>

            <Button appearance="primary" icon={<Add24Regular />} type="submit">
              Create Issue
            </Button>
          </form>
        </section>

        <section className="issues-list-section">
          <h2>Issues List</h2>
          <div className="issues-controls">
            <div className="search-bar">
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                contentBefore={<Search24Regular />}
              />
            </div>
            <div className="filter-dropdown">
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Bug">Bugs</option>
                <option value="Story">Stories</option>
                <option value="Task">Tasks</option>
              </Select>
            </div>
          </div>
          {loading ? (
            <Spinner label="Loading issues..." />
          ) : (
            <>
              <table className="issues-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("key")}>
                      Key{" "}
                      {sortField === "key" &&
                        (sortDirection === "asc" ? <ArrowSortUp24Regular /> : <ArrowSortDown24Regular />)}
                    </th>
                    <th onClick={() => handleSort("summary")}>
                      Summary{" "}
                      {sortField === "summary" &&
                        (sortDirection === "asc" ? <ArrowSortUp24Regular /> : <ArrowSortDown24Regular />)}
                    </th>
                    <th>Description</th>
                    <th onClick={() => handleSort("issueType")}>
                      Type{" "}
                      {sortField === "issueType" &&
                        (sortDirection === "asc" ? <ArrowSortUp24Regular /> : <ArrowSortDown24Regular />)}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIssues.map((issue) => (
                    <tr key={issue.id} className="issue-row">
                      <td>{issue.key}</td>
                      <td>{issue.summary}</td>
                      <td className="issue-description">{issue.description || "No description"}</td>
                      <td>
                        <span className={`issue-type ${issue.issueType.toLowerCase()}`}>{issue.issueType}</span>
                      </td>
                      <td>
                        <span className="issue-status">{issue.status || "Open"}</span>
                      </td>
                      <td>
                        <Button appearance="subtle" onClick={() => handleOpenModal(issue)}>
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <Button
                  icon={<ChevronLeft24Regular />}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  icon={<ChevronRight24Regular />}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </section>
      </main>

      <Dialog open={isModalOpen} onOpenChange={(_, data) => setIsModalOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Update Issue</DialogTitle>
            <DialogContent>
              <Label htmlFor="updatedDescription">Description</Label>
              <Input
                id="updatedDescription"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
              <Label htmlFor="updatedIssueType">Issue Type</Label>
              <Select
                id="updatedIssueType"
                value={updatedIssueType}
                onChange={(e) => setUpdatedIssueType(e.target.value)}
              >
                <option value="Bug">Bug</option>
                <option value="Story">Story</option>
                <option value="Task">Task</option>
              </Select>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={handleUpdateIssue}>
                Save
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}

