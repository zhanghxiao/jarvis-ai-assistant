import os
import json
import base64
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from duckduckgo_search import DDGS
import pyautogui
import webbrowser

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OPENAI_API_KEY")
BASE_URL = os.getenv("OPENAI_BASE_URL")
SPEECH_TO_TEXT_URL = os.getenv("SPEECH_TO_TEXT_URL", "http://localhost:9000/asr")  # 新增的语音识别 URL
client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

FUNCTIONS = [
    {
        "name": "search_duckduckgo",
        "description": "使用DuckDuckGo搜索引擎查询信息。",
        "parameters": {
            "type": "object",
            "properties": {
                "keywords": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "搜索的关键词列表。"
                }
            },
            "required": ["keywords"]
        }
    },
    {
        "name": "open_website",
        "description": "打开指定的网站。",
        "parameters": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "要打开的网站URL。"
                }
            },
            "required": ["url"]
        }
    },
    {
        "name": "take_screenshot",
        "description": "捕获当前屏幕的截图。",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "simulate_keyboard_input",
        "description": "模拟键盘输入。",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "要输入的文本。"
                }
            },
            "required": ["text"]
        }
    },
    {
        "name": "simulate_mouse_click",
        "description": "模拟鼠标点击。",
        "parameters": {
            "type": "object",
            "properties": {
                "x": {
                    "type": "integer",
                    "description": "点击位置的X坐标。"
                },
                "y": {
                    "type": "integer",
                    "description": "点击位置的Y坐标。"
                }
            },
            "required": ["x", "y"]
        }
    }
]

def search_duckduckgo(keywords):
    search_term = " ".join(keywords)
    with DDGS() as ddgs:
        return list(ddgs.text(keywords=search_term, region="cn-zh", safesearch="on", max_results=5))

def open_website(url):
    webbrowser.open(url)
    return f"已打开网站: {url}"

def take_screenshot():
    screenshot = pyautogui.screenshot()
    screenshot.save("screenshot.png")
    return "已保存屏幕截图"

def simulate_keyboard_input(text):
    pyautogui.typewrite(text)
    return f"已模拟键盘输入: {text}"

def simulate_mouse_click(x, y):
    pyautogui.click(x, y)
    return f"已模拟鼠标点击: ({x}, {y})"

def process_function_call(function_name, function_args):
    if function_name == "search_duckduckgo":
        return search_duckduckgo(function_args.get('keywords', []))
    elif function_name == "open_website":
        return open_website(function_args.get('url'))
    elif function_name == "take_screenshot":
        return take_screenshot()
    elif function_name == "simulate_keyboard_input":
        return simulate_keyboard_input(function_args.get('text'))
    elif function_name == "simulate_mouse_click":
        return simulate_mouse_click(function_args.get('x'), function_args.get('y'))
    else:
        return f"未知的函数名称: {function_name}"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            functions=FUNCTIONS,
            function_call="auto"
        )
        
        response_message = response.choices[0].message
        
        if response_message.function_call:
            function_name = response_message.function_call.name
            function_args = json.loads(response_message.function_call.arguments)
            function_response = process_function_call(function_name, function_args)
            
            messages.append(response_message.model_dump())
            messages.append({
                "role": "function",
                "name": function_name,
                "content": json.dumps(function_response)
            })
            
            final_response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            return jsonify(final_response.choices[0].message.content)
        else:
            return jsonify(response_message.content)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/v1/audio/transcriptions', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "Missing audio file"}), 400
    
    audio_file = request.files['file']
    
    try:
        files = {'audio_file': (audio_file.filename, audio_file, 'audio/mpeg')}
        response = requests.post(SPEECH_TO_TEXT_URL, files=files)
        response.raise_for_status()
        text = response.json().get('text', '')
        return jsonify({"text": text})
    except requests.RequestException as e:
        return jsonify({"error": f"Speech recognition service error: {str(e)}"}), 500

@app.route('/v1/audio/speech', methods=['POST'])
def text_to_speech():
    data = request.json
    model = data.get('model', 'en-US-BrianMultilingualNeural')
    input_text = data.get('input', '')
    voice = data.get('voice', 'pitch:0|rate:0')
    
    url = "https://mistpe-edge.hf.space/v1/audio/speech"
    payload = {
        "model": model,
        "input": input_text,
        "voice": voice
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        audio_content = response.content
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        return jsonify({"audio": audio_base64})
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
