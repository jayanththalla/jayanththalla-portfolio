import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openSource = {
  githubConvertedToken: process.env.GITHUB_TOKEN,
  githubUserName: process.env.GITHUB_USERNAME,
};

const query_pr = {
  query: `
	query {
	  user(login: "${openSource.githubUserName}"){
	    pullRequests(last: 100, orderBy: {field: CREATED_AT, direction: DESC}){
      totalCount
      nodes{
        id
        title
        url
        state
	      mergedBy {
	          avatarUrl
	          url
	          login
	      }
	      createdAt
	      number
        changedFiles
	      additions
	      deletions
        baseRepository {
	          name
	          url
	          owner {
	            avatarUrl
	            login
	            url
	          }
	        }
      }
    }
	}
}
	`,
};

const query_issue = {
  query: `query{

		user(login: "${openSource.githubUserName}") {
    issues(last: 100, orderBy: {field:CREATED_AT, direction: DESC}){
      totalCount
      nodes{
      	id
        closed
        title
        createdAt
        url
        number
        assignees(first:100){
          nodes{
            avatarUrl
            name
            url
          }
        }
        repository{
          name
          url
          owner{
            login
            avatarUrl
            url
          }
        }
      }
    }
  }

	}`,
};

const query_org = {
  query: `query{
	user(login: "${openSource.githubUserName}") {
	    repositoriesContributedTo(last: 100){
	      totalCount
	      nodes{
	        owner{
	          login
	          avatarUrl
	          __typename
	        }
	      }
	    }
	  }
	}`,
};

const query_pinned_projects = {
  query: `
	query { 
	  user(login: "${openSource.githubUserName}") { 
	    pinnedItems(first: 6, types: REPOSITORY) {
	      totalCount
	      nodes{
	        ... on Repository{
	          id
	          name
	          createdAt
	          url
	          description
	          isFork
	          languages(first:10){
	            nodes{
	              name
	            }
	          }
	        }
	      }
		  }
	  }
	}
	`,
};

const baseUrl = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${openSource.githubConvertedToken}`,
};

const languages_icons = {
  Python: "logos-python",
  "Jupyter Notebook": "logos-jupyter",
  HTML: "logos-html-5",
  CSS: "logos-css-3",
  JavaScript: "logos-javascript",
  "C#": "logos-c-sharp",
  Java: "logos-java",
  Shell: "simple-icons:shell",
  Ruby: "logos:ruby",
  PHP: "logos-php",
  Dockerfile: "simple-icons:docker",
  Rust: "logos-rust",
};

function assertConfig() {
  const missing = [];

  if (!openSource.githubConvertedToken) {
    missing.push("GITHUB_TOKEN");
  }

  if (!openSource.githubUserName) {
    missing.push("GITHUB_USERNAME");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

function formatError(error) {
  if (!error) {
    return "Unknown error";
  }

  if (error instanceof Error) {
    return error.stack || error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch (serializationError) {
    return String(error);
  }
}

async function fetchGraphQL(payload, label) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(
      `${label}: GitHub returned a non-JSON response (status ${response.status}). Body: ${text}`
    );
  }

  if (!response.ok) {
    const details =
      parsed.message ||
      (Array.isArray(parsed.errors) ? parsed.errors.map((entry) => entry.message).join("; ") : "") ||
      text;

    throw new Error(`${label}: GitHub API request failed with ${response.status} ${response.statusText}. ${details}`);
  }

  if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
    throw new Error(`${label}: GraphQL error. ${parsed.errors.map((entry) => entry.message).join("; ")}`);
  }

  return parsed.data;
}

function writeJson(outputPath, data, label) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, JSON.stringify(data), function (err) {
      if (err) {
        reject(new Error(`${label}: Failed to write ${outputPath}. ${err.message}`));
        return;
      }

      resolve();
    });
  });
}

async function fetchPullRequests() {
  const data = await fetchGraphQL(query_pr, "pull requests");
  const nodes = data.user.pullRequests.nodes;
  const cropped = { data: nodes };

  let open = 0;
  let closed = 0;
  let merged = 0;

  for (let i = 0; i < cropped.data.length; i++) {
    if (cropped.data[i].state === "OPEN") open++;
    else if (cropped.data[i].state === "MERGED") merged++;
    else closed++;
  }

  cropped.open = open;
  cropped.closed = closed;
  cropped.merged = merged;
  cropped.totalCount = cropped.data.length;

  console.log("Fetching the Pull Request Data.");
  await writeJson("./src/shared/opensource/pull_requests.json", cropped, "pull requests");
}

async function fetchIssues() {
  const data = await fetchGraphQL(query_issue, "issues");
  const nodes = data.user.issues.nodes;
  const cropped = { data: nodes };

  let open = 0;
  let closed = 0;

  for (let i = 0; i < cropped.data.length; i++) {
    if (cropped.data[i].closed === false) open++;
    else closed++;
  }

  cropped.open = open;
  cropped.closed = closed;
  cropped.totalCount = cropped.data.length;

  console.log("Fetching the Issues Data.");
  await writeJson("./src/shared/opensource/issues.json", cropped, "issues");
}

async function fetchOrganizations() {
  const data = await fetchGraphQL(query_org, "organizations");
  const orgs = data.user.repositoriesContributedTo.nodes;
  const newOrgs = { data: [] };

  for (let i = 0; i < orgs.length; i++) {
    if (!orgs[i] || !orgs[i].owner) {
      continue;
    }

    const obj = orgs[i].owner;

    if (obj.__typename === "Organization") {
      let flag = 0;

      for (let j = 0; j < newOrgs.data.length; j++) {
        if (JSON.stringify(obj) === JSON.stringify(newOrgs.data[j])) {
          flag = 1;
          break;
        }
      }

      if (flag === 0) {
        newOrgs.data.push(obj);
      }
    }
  }

  console.log("Fetching the Contributed Organization Data.");
  await writeJson("./src/shared/opensource/organizations.json", newOrgs, "organizations");
}

async function fetchPinnedProjects() {
  const data = await fetchGraphQL(query_pinned_projects, "pinned projects");
  const projects = data.user.pinnedItems.nodes;
  const newProjects = { data: [] };

  for (let i = 0; i < projects.length; i++) {
    const obj = projects[i];
    const langobjs = obj.languages.nodes;
    const newLangobjs = [];

    for (let j = 0; j < langobjs.length; j++) {
      if (langobjs[j].name in languages_icons) {
        newLangobjs.push({
          name: langobjs[j].name,
          iconifyClass: languages_icons[langobjs[j].name],
        });
      }
    }

    obj.languages = newLangobjs;
    newProjects.data.push(obj);
  }

  console.log("Fetching the Pinned Projects Data.");
  await writeJson("./src/shared/opensource/projects.json", newProjects, "pinned projects");
}

async function main() {
  assertConfig();

  const tasks = [
    fetchPullRequests(),
    fetchIssues(),
    fetchOrganizations(),
    fetchPinnedProjects(),
  ];

  const results = await Promise.allSettled(tasks);
  let hasFailure = false;

  for (const result of results) {
    if (result.status === "rejected") {
      hasFailure = true;
      console.error(formatError(result.reason));
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(formatError(error));
  process.exitCode = 1;
});
