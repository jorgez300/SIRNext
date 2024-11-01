// LoadingScreen.tsx
"use client";
import React from "react";
import styled from "styled-components";
import { useLoadingStore } from "../Store/loadingStore";


const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingScreen: React.FC = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return <FullScreenOverlay></FullScreenOverlay>;
};

export default LoadingScreen;
