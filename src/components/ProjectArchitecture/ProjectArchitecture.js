import React from "react";
import styled from "styled-components";
import { Fade } from "react-reveal";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.body};
  width: 80%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 12px;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.highlight};

  /* Glassmorphism support */
  backdrop-filter: ${({ theme }) => theme.backdropFilter || "none"};
  border: ${({ theme }) => theme.border || "1px solid rgba(255,255,255,0.1)"};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  z-index: 1;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.highlight};
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const DiagramContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.imageHighlight};
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  span {
    background: ${({ theme }) => theme.highlight};
    color: ${({ theme }) => theme.text};
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
`;

export default function ProjectArchitecture({ repo, architecture, theme, onClose }) {
    if (!architecture) return null;

    return (
        <Overlay onClick={onClose}>
            <Fade bottom duration={500}>
                <ModalContainer theme={theme} onClick={(e) => e.stopPropagation()}>
                    <CloseButton theme={theme} onClick={onClose}>&times;</CloseButton>
                    <Title theme={theme}>{repo.name} - Architecture</Title>
                    <Description theme={theme}>{architecture.description}</Description>

                    {architecture.diagram && (
                        <DiagramContainer theme={theme}>
                            <img src={architecture.diagram} alt={`${repo.name} Architecture`} />
                        </DiagramContainer>
                    )}

                    <h3 style={{ color: theme.text, marginBottom: '10px' }}>Tech Stack & Design Decisions</h3>
                    <TechStack theme={theme}>
                        {architecture.techStack && architecture.techStack.map((tech, i) => (
                            <span key={i}>{tech}</span>
                        ))}
                    </TechStack>
                </ModalContainer>
            </Fade>
        </Overlay>
    );
}
