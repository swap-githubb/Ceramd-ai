**How to test the application locally:**

Step 1: Clone from my repository - https://github.com/swap-githubb/Ceramd
ai in vs code editor 

Step 2: In backend folder go to .env file and fill your API keys (Deepgram.com) 
and (together.ai). These are free open source , you can signup and generate 
your API keys. (Deepgram for speech to text) and (together.ai for LLM model) 

Step 3: In backend folder , come to main.py file and at line 17 replace the link 
to – http://localhost:3000 

Step 4: In frontend folder , open App.js file at line 39 replace the link to - 
http://localhost:8000/finalize_conversation 

Step 5: In frontend folder, open AudioRecorder.js file at line 67 replace the link 
to - http://localhost:8000/${endpoint} 

Step 6: open command prompt , navigate to the directory where you have 
cloned your project , then come in the frontend folder in command prompt and 
enter the command “npm install” and wait while dependencies are being 
installed. 

Step 7: open another window of command prompt , navigate to the directory 
where you have cloned your project , then come in the backend folder in 
command prompt and enter the command “venv\Scripts\activate” and this will 
create virtual environment. 

Step 8: when dependencies are installed in frontend command window just 
type “npm start” - will start frontend part. 

Step 9: In backend command window, type “uvicorn app.main:app” – will start 
backend part. 

I am assuming that node and python are already installed in your system. 

Now you are ready with application.
