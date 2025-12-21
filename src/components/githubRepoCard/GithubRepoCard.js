import React from "react";
import ProjectLanguages from "../../components/projectLanguages/ProjectLanguages";
import "./GithubRepoCard.css";
import { Fade } from "react-reveal";
import { projectArchitectures } from "../../portfolio";
import ProjectArchitecture from "../../components/ProjectArchitecture/ProjectArchitecture";
import { useState } from "react";

export default function GithubRepoCard({ repo, theme }) {
  function openRepoinNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
  }

  const [showArchitecture, setShowArchitecture] = useState(false);
  const architecture = projectArchitectures[repo.name];

  return (
    <div
      className="repo-card-div"
      style={{
        backgroundColor: theme.highlight,
        backdropFilter: theme.backdropFilter,
        boxShadow: theme.boxShadow || "rgba(0, 0, 0, 0.2) 0px 10px 30px -15px",
        border: theme.border,
      }}
    >
      <Fade bottom duration={2000} distance="40px">
        <div key={repo.id}>
          {/* Modal Render */}
          {showArchitecture && (
            <ProjectArchitecture
              repo={repo}
              architecture={architecture}
              theme={theme}
              onClose={() => setShowArchitecture(false)}
            />
          )}

          <div onClick={() => openRepoinNewTab(repo.url)}>
            <div className="repo-name-div">
              <svg
                aria-hidden="true"
                className="octicon repo-svg"
                height="16"
                role="img"
                viewBox="0 0 12 16"
                width="12"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"
                ></path>
              </svg>
              <p className="repo-name" style={{ color: theme.text }}>
                {repo.name}
              </p>
            </div>
            <p className="repo-description" style={{ color: theme.text }}>
              {repo.description}
            </p>
            <div className="repo-details">
              <p
                className="repo-creation-date subTitle"
                style={{ color: theme.secondaryText }}
              >
                Created on {repo.createdAt.split("T")[0]}
              </p>
              <ProjectLanguages
                className="repo-languages"
                logos={repo.languages}
              />
            </div>
          </div>

          {/* Architecture Button */}
          {architecture && (
            <button
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                background: theme.text,
                color: theme.body,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                width: "100%",
                transition: "transform 0.2s"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowArchitecture(true);
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              View Architecture
            </button>
          )}
        </div>
      </Fade>
    </div>
  );
}
