# Jarvis AI 助手项目

## 项目结构

```
jarvis-ai-assistant/
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── loading.gif
│   │   └── QjoV.gif
│   ├── src/
│   │   ├── components/
│   │   │   └── JarvisUI.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   └── server.py
│
├── main.js
├── package.json
└── README.md
```

## 安装说明

1. 确保您的系统已安装 Node.js (版本 14 或更高) 和 Python (版本 3.7 或更高)。

2. 克隆项目仓库:
   ```
   git clone https://github.com/your-username/jarvis-ai-assistant.git
   cd jarvis-ai-assistant
   ```

3. 安装主项目依赖:
   ```
   npm install
   ```

4. 安装前端依赖:
   ```
   cd frontend
   npm install
   cd ..
   ```

5. 安装后端依赖:
   ```
   pip install flask flask-cors openai duckduckgo-search pyautogui SpeechRecognition
   ```

6. 设置环境变量:
   - 在项目根目录创建一个 `.env` 文件
   - 添加以下内容 (替换为您的实际 API 密钥):
     ```
     OPENAI_API_KEY=your_openai_api_key
     OPENAI_BASE_URL=https://api.openai.com/v1
     ```

## 运行说明

1. 启动后端服务器:
   ```
   python backend/server.py
   ```

2. 在新的终端窗口中,启动 Electron 应用:
   ```
   npm start
   ```

现在,Jarvis AI 助手应该已经启动并运行在一个 Electron 窗口中。

## 注意事项

- 确保您有足够的权限运行系统命令和访问麦克风/摄像头。
- 请遵守 OpenAI 的使用政策和条款。
- 定期检查并更新依赖以确保安全性和兼容性。
