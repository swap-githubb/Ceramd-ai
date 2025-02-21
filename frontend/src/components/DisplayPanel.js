import React from 'react';
import { Card, CardContent, Typography, Divider, Collapse } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownComponent = ({ children }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        return (
          <SyntaxHighlighter
            style={atomDark}
            language="javascript"
            PreTag="div"
            {...props}
          >
            {children}
          </SyntaxHighlighter>
        );
      }
    }}
  >
    {children}
  </ReactMarkdown>
);

const DisplayPanel = ({ soapNote, differentialDiagnosis }) => {
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
          Clinical Documentation
        </Typography>
        
        {/* SOAP Note Section */}
        <Collapse in={true}> {/* Always keep this section expanded */}
          <Divider style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />
          <Typography variant="h6" style={{ 
            color: '#2e7d32',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            SOAP Note
          </Typography>
          {soapNote ? (
            <MarkdownComponent>{soapNote}</MarkdownComponent>
          ) : (
            <Typography variant="body1" style={{ color: '#757575', fontStyle: 'italic' }}>
              SOAP note will be generated after completing the consultation...
            </Typography>
          )}
        </Collapse>

        {/* Differential Diagnosis Section */}
        <Collapse in={true}> {/* Always keep this section expanded */}
          <Divider style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />
          <Typography variant="h6" style={{ 
            color: '#d32f2f',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            Differential Diagnosis
          </Typography>
          {differentialDiagnosis ? (
            <MarkdownComponent>{differentialDiagnosis}</MarkdownComponent>
          ) : (
            <Typography variant="body1" style={{ color: '#757575', fontStyle: 'italic' }}>
              Differential diagnosis will appear here after analysis...
            </Typography>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DisplayPanel;