import React from "react";
import "./GithubStats.css";
import { Fade } from "react-reveal";
import { socialMediaLinks } from "../../portfolio";

export default function GithubStats({ theme }) {
    const githubLink = socialMediaLinks.find((link) => link.name === "Github");
    const username = githubLink ? githubLink.link.split("/").pop() : "";

    if (!username) return null;

    return (
        <Fade bottom duration={1000} distance="20px">
            <div className="github-stats-main-div">
                <h1 className="github-stats-header" style={{ color: theme.text }}>
                    Github Integration
                </h1>
                <div className="github-stats-container">
                    <div className="github-stats-card">
                        <img
                            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&locale=en&theme=${theme.name === "dark" || theme.name === "hacker" ? "dark" : "default"
                                }&hide_border=true&bg_color=${theme.name === "glass" ? "00000000" : ""}`}
                            alt="Github Stats"
                            className="github-stats-img"
                            style={{
                                filter: theme.name === "hacker" ? "hue-rotate(90deg)" : "none"
                            }}
                        />
                    </div>
                    <div className="github-streak-card">
                        <img
                            src={`https://github-readme-streak-stats.herokuapp.com?user=${username}&theme=${theme.name === "dark" || theme.name === "hacker" ? "dark" : "default"
                                }&hide_border=true&background=${theme.name === "glass" ? "00000000" : ""}`}
                            alt="Github Streak"
                            className="github-streak-img"
                            style={{
                                filter: theme.name === "hacker" ? "hue-rotate(90deg)" : "none"
                            }}
                        />
                    </div>
                </div>
                <div className="github-charts-container">
                    <h2 className="github-charts-header" style={{ color: theme.secondaryText }}>
                        Contribution Graph
                    </h2>
                    <div className="github-chart-img-container">
                        <img
                            src={`http://ghchart.rshah.org/${theme.name === "hacker" ? "00FF41" : "40c463"}/${username}`}
                            alt="Github Chart"
                            style={{ width: "100%", maxWidth: "800px" }}
                        />
                    </div>
                </div>
            </div>
        </Fade>
    );
}
