# jarvis-ai-assistant
# Jarvis AI 助手安装和使用指南

## 项目结构

```
jarvis-ai-assistant/
│
├── src/
│   ├── components/
│   │   └── JarvisUI.jsx
│   ├── App.jsx
│   └── index.js
│
├── public/
│   ├── index.html
│   ├── loading.gif
│   └── QjoV.gif
│
├── backend/
│   ├── app.py
│   └── wake_word_detection.py
│
├── electron/
│   └── main.js
│
├── config.json
├── package.json
├── requirements.txt
└── README.md
```

## 前置条件

- Python 3.8+
- Node.js 14+
- npm 6+
- 有效的 OpenAI API 密钥

## 安装步骤

1. 克隆仓库：
   ```
   git clone https://github.com/your-username/jarvis-ai-assistant.git
   cd jarvis-ai-assistant
   ```

2. 安装 Python 依赖：
   ```
   pip install -r requirements.txt
   ```

3. 安装 Node.js 依赖：
   ```
   npm install
   ```

4. 设置 OpenAI API 密钥：
   - 复制 `config.json.example` 为 `config.json`
   - 用你的实际 OpenAI API 密钥替换 `YOUR_OPENAI_API_KEY`

5. 准备语音唤醒音效：
   - 将你想要的唤醒音效文件（WAV 格式）命名为 `activation_sound.wav`，放在项目根目录下

## 运行应用

1. 启动 Python 后端：
   ```
   python backend/app.py
   ```

2. 在新的终端中，启动 Electron 应用：
   ```
   npm start
   ```

## 使用说明

1. 应用启动后，你将看到 Jarvis UI。
2. 说 "Hi Jarvis" 来激活语音识别。
3. 激活后，你可以开始说出你的命令或问题。
4. 你也可以在文本输入框中输入查询。
5. 使用摄像头按钮来启用/禁用视觉输入。
6. 点击齿轮图标访问设置。

## 故障排除

- 如果遇到语音识别问题，请确保你的麦克风正确连接和配置。
- 对于视觉输入问题，检查你的摄像头权限和连接。
- 如果 AI 响应似乎不正确，请再次检查配置文件中的 OpenAI API 密钥。
- 如果后端无法启动，请检查是否所有必需的 Python 包都已正确安装。

## 已知问题和限制

- 目前，语音唤醒功能可能在嘈杂环境中不太稳定。
- 系统控制功能（如打开应用程序、文件操作等）目前功能有限。
- 视觉输入处理目前仅支持基本的图像描述，不支持复杂的图像分析任务。

## 下一步开发计划

- 改进语音唤醒的准确性。
- 扩展系统控制功能，包括更多的文件和应用程序操作。
- 增强视觉输入处理能力，支持更复杂的图像分析任务。
- 实现用户认证和权限管理系统。
- 添加更多的单元测试和集成测试。

## 贡献

我们欢迎贡献！请查看我们的 CONTRIBUTING.md 文件，了解如何提交拉取请求。

## 许可证

本项目采用 MIT 许可证。详情请见 LICENSE 文件。
