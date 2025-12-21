import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { greeting } from "../../portfolio";
import { chosenTheme, hackerTheme, glassTheme } from "../../theme";
import { Fade } from "react-reveal";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15vh;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  background: ${({ theme }) => theme.body};
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.highlight};
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 20px;
  font-size: 1.2rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.secondaryText};
  background: transparent;
  color: ${({ theme }) => theme.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.secondaryText};
    opacity: 0.7;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: ${({ active, theme }) => (active ? theme.highlight : "transparent")};
  color: ${({ theme }) => theme.text};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.imageHighlight};
    color: #fff;
  }
`;

const Shortcut = styled.span`
  font-size: 0.8rem;
  background: ${({ theme }) => theme.secondaryText};
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
`;

export default function CommandPalette({ theme, setTheme }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const history = useHistory();

    // Define commands
    const commands = [
        {
            id: "home",
            label: "Go Home",
            action: () => history.push("/home"),
            category: "Navigation",
        },
        {
            id: "projects",
            label: "Go to Projects",
            action: () => history.push("/projects"),
            category: "Navigation",
        },
        {
            id: "experience",
            label: "Go to Experience",
            action: () => history.push("/experience"),
            category: "Navigation",
        },
        {
            id: "resume",
            label: "View Resume",
            action: () => window.open(greeting.resumeLink, "_blank"),
            category: "Action",
        },
        {
            id: "hacker-mode",
            label: "Enable Hacker Mode",
            action: () => setTheme(hackerTheme),
            category: "Theme",
        },
        {
            id: "glass-mode",
            label: "Enable Glass Mode",
            action: () => setTheme(glassTheme),
            category: "Theme",
        },
        {
            id: "normal-mode",
            label: "Disable Hacker/Glass Mode",
            action: () => setTheme(chosenTheme),
            category: "Theme",
        },
        {
            id: "github",
            label: "Visit Github",
            action: () => window.open(greeting.githubProfile, "_blank"),
            category: "Social",
        }
    ];

    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        setQuery("");
        setSelectedIndex(0);
    }, [isOpen]);

    const handleSelect = (index) => {
        const command = filteredCommands[index];
        if (command) {
            command.action();
            setIsOpen(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev - 1 < 0 ? filteredCommands.length - 1 : prev - 1
            );
        } else if (e.key === "Enter") {
            handleSelect(selectedIndex);
        }
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={() => setIsOpen(false)}>
            <Fade top duration={300}>
                <Container theme={theme} onClick={(e) => e.stopPropagation()}>
                    <Input
                        ref={inputRef}
                        theme={theme}
                        placeholder="Type a command..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={onKeyDown}
                    />
                    <List>
                        {filteredCommands.map((cmd, index) => (
                            <ListItem
                                key={cmd.id}
                                theme={theme}
                                active={index === selectedIndex}
                                onClick={() => handleSelect(index)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <span>{cmd.label}</span>
                                <Shortcut theme={theme}>{cmd.category}</Shortcut>
                            </ListItem>
                        ))}
                        {filteredCommands.length === 0 && (
                            <ListItem theme={theme}>No results found.</ListItem>
                        )}
                    </List>
                </Container>
            </Fade>
        </Overlay>
    );
}
