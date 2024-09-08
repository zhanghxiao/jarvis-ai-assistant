import React, { useState, useEffect, useRef } from 'react';
import { Mic, Settings, Camera, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const JarvisUI = () => {
  const [currentAnimation, setCurrentAnimation] = useState('loading');
  const [isListening, setIsListening] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [voicePitch, setVoicePitch] = useState(0);
  const [voiceRate, setVoiceRate] = useState(0);
  
  const conversationEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setCurrentAnimation('idle'), 3000);
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleMicClick = () => {
    setIsListening(!isListening);
    // TODO: Implement start/stop speech recognition logic
  };

  const handleCameraClick = () => {
    setIsCameraOn(!isCameraOn);
    // TODO: Implement start/stop camera logic
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setConversation([...conversation, { role: 'user', content: inputText }]);
      // TODO: Send message to backend and handle response
      setInputText('');
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto bg-white rounded-xl shadow-xl overflow-hidden w-96">
        <div className="p-6">
          <div className="w-64 h-64 mx-auto mb-4">
            <img 
              src={currentAnimation === 'loading' ? "/loading.gif" : "/QjoV.gif"} 
              alt="Jarvis Animation" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="h-40 overflow-y-auto bg-gray-50 p-4 rounded">
              {conversation.map((message, index) => (
                <p key={index} className={`mb-2 ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                  {message.content}
                </p>
              ))}
              <div ref={conversationEndRef} />
            </div>
            <div className="flex space-x-2">
              <Input 
                type="text" 
                value={inputText} 
                onChange={handleInputChange} 
                placeholder="Type your message..." 
                className="flex-grow"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between">
              <Button 
                onClick={handleMicClick}
                variant={isListening ? "destructive" : "default"}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleCameraClick}
                variant={isCameraOn ? "default" : "secondary"}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSettingsClick}
                variant="outline"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {isSettingsOpen && (
          <Card className="absolute bottom-full left-0 w-full mb-2">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <Button variant="ghost" onClick={handleSettingsClick}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Language</label>
                  <select 
                    value={language} 
                    onChange={handleLanguageChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="EN">English</option>
                    <option value="ZH">Chinese</option>
                    <option value="JA">Japanese</option>
                    <option value="KO">Korean</option>
                    <option value="FR">French</option>
                    <option value="DE">German</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Voice Pitch</label>
                  <Slider
                    value={[voicePitch]}
                    onValueChange={(values) => setVoicePitch(values[0])}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <label className="block mb-2">Voice Rate</label>
                  <Slider
                    value={[voiceRate]}
                    onValueChange={(values) => setVoiceRate(values[0])}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JarvisUI;
