import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatPanel = ({ conversation }) => {
  return (
    <Card style={{ 
      margin: '20px 0',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      borderRadius: '12px'
    }}>
      <CardContent>
        <Typography variant="h6" style={{ 
          color: '#1976d2',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          Consultation Transcript
        </Typography>
        {conversation.length > 0 ? (
          conversation.map((turn, index) => (
            <div key={index} style={{ 
              margin: '12px 0',
              padding: '12px',
              background: turn.role === 'doctor' ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '8px',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateX(5px)'
              }
            }}>
              <Typography variant="subtitle2" style={{ 
                color: turn.role === 'doctor' ? '#1565c0' : '#757575',
                fontWeight: 600
              }}>
                {turn.role === 'doctor' ? 'Dr. Steve:' : 'Patient:'}
              </Typography>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language="javascript"
                        PreTag="div"
                        {...props}
                      />
                    );
                  }
                }}
              >
                {turn.message}
              </ReactMarkdown>
            </div>
          ))
        ) : (
          <Typography variant="body1" style={{ color: '#757575' }}>
            Consultation transcript will appear here...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
