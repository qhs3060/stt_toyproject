// frontend/src/index.tsx

// React 18 이후의 새로운 방식으로 애플리케이션을 렌더링
import React from 'react';
import { createRoot } from 'react-dom/client'; // React 18의 createRoot
import App from './App';

// 기존의 ReactDOM.render를 사용한 렌더링 방식
// import ReactDOM from 'react-dom/client'; // React 18 이전의 렌더링 방식

const container = document.getElementById('root');

// React 18 이후의 새로운 렌더링 방식
if (container) {
  const root = createRoot(container); // createRoot 사용
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}

/*
// React 18 이전의 기존 렌더링 방식
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // 기존 방식
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
  */