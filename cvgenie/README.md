# CVGenie – Resume Based AI Chatbot using Gemini API

## Project Description

CVGenie is a **Resume-Based AI Chatbot** built using **Python** and the **Google Gemini API**. It answers questions about Tusar Goswami's resume — including education, skills, projects, certifications, achievements, and more — by leveraging **Prompt Engineering** and **Context Injection** techniques. The chatbot runs as a simple Python console application.

## Features

- Answers questions about education, skills, projects, training, certifications, and achievements.
- Uses **Google Gemini 2.5 Flash** as the Large Language Model (LLM).
- Employs **Prompt Engineering** to inject resume context into every query.
- Strict guardrails — never hallucinates, guesses, or invents information.
- Simple, beginner-friendly console-based interface.
- Runs continuously until the user types `exit`.

## Technology Stack

| Technology           | Purpose                            |
| -------------------- | ---------------------------------- |
| Python               | Core programming language          |
| Google Gemini API    | LLM for generating AI responses    |
| Prompt Engineering   | Structuring prompts with context   |
| LLM                  | Large Language Model fundamentals  |

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TusarGoswami/cvgenie.git
   cd cvgenie
   ```

2. **Create a virtual environment** (recommended)

   ```bash
   python -m venv venv
   source venv/bin/activate        # Linux/Mac
   venv\Scripts\activate           # Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Add your Gemini API Key**

   Open `app.py` and replace `"YOUR_API_KEY"` with your actual Google Gemini API key:

   ```python
   client = genai.Client(
       api_key="your-actual-api-key-here"
   )
   ```

   > Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

## How to Run

```bash
python app.py
```

## Folder Structure

```
cvgenie/
│
├── app.py               # Main chatbot application
├── requirements.txt     # Python dependencies
├── README.md            # Project documentation
├── .gitignore           # Git ignore rules
└── screenshots/         # Demo screenshots
```

## Example Output

```
CVGenie Started...
Type 'exit' to quit.

You: What is your education?

Bot: Tusar Goswami is currently pursuing a Bachelor of Technology in Computer
Science and Engineering from Lovely Professional University, Punjab, India
(Aug 2023 – Present) with a CGPA of 7.5 / 10.0. He completed his
Intermediate (80.4%) and Matriculation (90.0%) from Mandalkuli Netaji
Vidyapith, Raipur, West Bengal (2021 – 2023).

You: What projects have you worked on?

Bot: Tusar has worked on three major projects:
1. Head-2-Code – A gamified competitive coding platform supporting 50+
   concurrent users with real-time contests and AI-powered debugging.
2. Jarvis – An autonomous AI assistant ecosystem with voice interaction,
   browser automation, and NLP-based command interpretation.
3. Cosmic Voyage – An interactive 3D developer portfolio with procedurally
   generated galaxy navigation using Three.js.

You: What are your skills?

Bot: Tusar's skills include Python, Java, C++, JavaScript, TypeScript, Dart,
React.js, Node.js, Express.js, Flask, MongoDB, MySQL, Git, AWS, and core
concepts like REST APIs, System Design, DSA, and OOP.

You: exit
Bot: Goodbye!
```

## Future Enhancements

- Resume PDF Upload
- LangChain Integration
- RAG (Retrieval-Augmented Generation) Implementation
- Vector Database Integration
- Chat Memory for Multi-Turn Conversations
- Web Interface using Django
