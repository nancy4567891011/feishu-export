// main.tsx
// 飞书插件导出项目的主入口文件
// 要求：使用 React + Feishu JS SDK 开发插件，实现多维表格导出功能

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 