import React, { useState } from 'react';
import Header from './components/Header';
import AudioRecorder from './components/AudioRecorder';
import ChatPanel from './components/ChatPanel';
import DisplayPanel from './components/DisplayPanel';
import { Container, Button, Card, CardContent, Typography, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { theme, globalStyles } from './styles/globalStyles';

function App() {
  
    //Array to store conversation turns: each object has role and message.
  const [conversation, setConversation] = useState([]);
  const [soapNote, setSoapNote] = useState('');
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState('');
  const [process1, setprocess1] = useState(false);
  const cleanOutput = (text) => {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  };

  // This callback is invoked when an audio turn is successfully processed.
  const handleTurnUploadSuccess = (data) => {
    // Append patient turn and doctor's follow-up turn to conversation.
    setConversation((prev) => [
      ...prev,
      { role: 'patient', message: data.transcript },
      { role: 'doctor', message: cleanOutput(data.doctor_response) }
    ]);
  };

  // Finalize conversation to generate SOAP note and differential diagnosis.
  const finalizeConversation = async () => {
    // Join the conversation array into a single string.
    const conversationStr = conversation
      .map(turn => `${turn.role === 'doctor' ? 'Dr. Steve' : 'Patient'}: ${turn.message}`)
      .join('\n');
      setprocess1(true);
    try {
      const response = await axios.post('http://localhost:8000/finalize_conversation', {
        conversation: conversationStr
      });
      setprocess1(false);
      setSoapNote(cleanOutput(response.data.soap_note));
      setDifferentialDiagnosis(cleanOutput(response.data.differential_diagnosis));
    } catch (error) {
      console.error("Finalization error:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{globalStyles}</style>
      <div>  
        <Header />
        <Container maxWidth="md" style={{ marginTop: '20px', position: 'relative' }}>
          <div className="fade-in">
            <AudioRecorder
              onUploadSuccess={handleTurnUploadSuccess}
              conversation={conversation}
              endpoint="conversation_turn"
            />
            <ChatPanel conversation={conversation} />
            <Button
              variant="contained"
              color="primary"
              onClick={finalizeConversation}
              style={{ 
                margin: '20px 0',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
              disabled={conversation.length === 0}
            >
              Finish Conversation
            </Button>
            {process1 && (
              <Card style={{ 
                margin: '20px 0',
                backgroundColor: '#e3f2fd',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)'
              }}>
                <CardContent>
                  <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>⏳</span>
                    Have patience! Generating clinical documentation...
                  </Typography>
                </CardContent>
              </Card>
            )}
            <DisplayPanel
              soapNote={soapNote}
              differentialDiagnosis={differentialDiagnosis}
            />
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
