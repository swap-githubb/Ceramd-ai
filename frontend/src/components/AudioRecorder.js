import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const AudioRecorder = ({ onUploadSuccess, conversation, endpoint }) => {

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [processing, setProcessing] = useState(false);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.onstop = () => {
          uploadAudio();
        };
        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
        audioChunksRef.current = [];
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else {
      alert("Audio recording not supported in your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const uploadAudio = async () => {
    setProcessing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    // Include the current conversation log as a field
    const conversationStr = conversation
      .map(turn => `${turn.role === 'doctor' ? 'Dr. Steve' : 'Patient'}: ${turn.message}`)
      .join('\n');
    formData.append('conversation', conversationStr);
    try {
      const response = await axios.post(`https://bdocpa.onrender.com/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(response.data);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Card style={{ 
        margin: '20px 0',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
        borderRadius: '12px'
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ 
            color: '#1976d2',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            Welcome to Virtual Consultation
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              variant="contained"
              color={recording ? 'secondary' : 'primary'}
              onClick={recording ? stopRecording : startRecording}
              startIcon={recording ? <StopIcon /> : <MicIcon />}
              style={{
                fontWeight: 600,
                letterSpacing: '0.5px',
                transform: recording ? 'scale(1)' : 'none',
                animation: recording ? `${pulseAnimation} 1.5s infinite` : 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:before': recording ? {
                  content: '""',
                  position: 'absolute',
                  borderRadius: '50%',
                  // animation: `${ripple} 1.5s infinite`,
                } : {}
              }}
            >
              {recording ? 'Stop Recording' : 'Start Consultation'}
            </Button>
            {processing && <CircularProgress size={24} style={{ color: '#1976d2' }} />}
          </div>
          <Typography variant="body2" style={{ 
            marginTop: '16px',
            color: '#607d8b',
            lineHeight: 1.6
          }}>
           Hii this is Dr.Steve!<br/>
           Tell me your name, age, gender, and description of your problem.<br/>
           Further questions will be asked by me, answer them accordingly.<br/>
           If you feel that you have nothing more to share more, just click on Finish Conversation button or when I asks you to do so.<br/>
          </Typography>
        </CardContent>
      </Card>
      {processing && (
        <Card style={{ 
          margin: '20px 0',
          backgroundColor: '#e8f5e9',
          borderLeft: '4px solid #43a047'
        }}>
          <CardContent>
            <Typography variant="body2" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2e7d32'
            }}>
              <span>🔊</span>
              Wait a while and answer the follow-up question asked by doctor once the transcript updates...
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AudioRecorder;

