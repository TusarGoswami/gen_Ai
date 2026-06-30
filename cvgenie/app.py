# ----- Import Gemini Library -----
import os
from dotenv import load_dotenv
from google import genai

# ----- Load Environment Variables -----
load_dotenv()

# ----- Create Gemini Client -----
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ----- Store Resume Information -----
my_data = """
Name: Tusar Goswami
Email: tusargoswami0027@gmail.com
Mobile: +91 6295419713
LinkedIn: linkedin.com/in/tusar027
GitHub: github.com/TusarGoswami

Education:
- Lovely Professional University, Punjab, India
  Bachelor of Technology – Computer Science and Engineering | CGPA: 7.5 / 10.0 | Aug 2023 – Present
- Mandalkuli Netaji Vidyapith, Raipur, West Bengal
  Intermediate: 80.4% | Matriculation: 90.0% | 2021 – 2023

Skills:
- Languages: Python, Java, C++, JavaScript (ES6+), TypeScript, Dart
- Frontend: React.js, Redux, Three.js, React Three Fiber, Tailwind CSS, Flutter
- Backend: Node.js, Express.js, Flask, Socket.IO
- Databases: MongoDB, MySQL, SQLite
- Tools & Platforms: Git, AWS (EC2), Vercel, Postman, Figma, Selenium, Judge0 API
- Core Concepts: REST APIs, System Design, DSA, OOP, Multithreading, DBMS, OS, Computer Networks
- Soft Skills: Problem-Solving, Teamwork, Leadership, Adaptability

Projects:
1. Head-2-Code – Gamified Competitive Coding Platform | Oct 2025 – Mar 2026
   GitHub: Available | Live: Available
   - Architected a real-time competitive coding platform supporting 50+ concurrent users with friend challenges, custom contests, and daily problems via Socket.IO, achieving sub-300 ms end-to-end latency.
   - Integrated Judge0 API and Monaco Editor to deliver multi-language code execution across 10+ languages, with an average verdict response time of ~250 ms.
   - Deployed an AI-powered debugging assistant via Gemini API for complexity analysis and code review on a horizontally scalable Node.js/MongoDB backend on AWS EC2.
   Tech Stack: React.js, Node.js, Express.js, MongoDB, Socket.IO, Judge0 API, Monaco Editor, AWS EC2, Gemini API

2. Jarvis – Autonomous AI Assistant Ecosystem | Sep 2025 – Mar 2026
   GitHub: Available
   - Engineered a modular AI assistant with voice interaction, browser automation via Selenium, and intelligent task execution, streamlining manual workflows by ~40%.
   - Implemented an NLP-based command interpretation module powered by Gemini API to translate natural language instructions into executable system actions, enabling real-time workflow automation.
   - Designed a multi-threaded architecture with hotword detection and system-level task execution, achieving sub-second AI response latency across concurrent interaction threads.
   Tech Stack: Python, Google Gemini API, Selenium, SQLite, NLP, Multithreading

3. Cosmic Voyage – Interactive 3D Developer Portfolio | Dec 2025 – Feb 2026
   GitHub: Available | Live: Available
   - Built an immersive 3D developer portfolio with a procedurally generated galaxy featuring planet-based navigation using Three.js and React Three Fiber.
   - Optimized a real-time 3D rendering pipeline with dynamic particle systems and smooth camera controls, achieving a consistent 60 FPS across all device categories and viewport sizes.
   - Crafted a fully responsive glassmorphism UI in TypeScript with animated transitions and cross-browser compatibility, deployed via Vercel CI/CD pipeline.
   Tech Stack: React.js, Three.js, React Three Fiber, TypeScript, Tailwind CSS, Vercel

Training:
- Mobile Application Development Using Flutter | Lovely Professional University | Certificate | Jun 2025 – Jul 2025
  - Developed a full-featured university management app in Flutter/Dart covering attendance, results, timetable, and assignments with high-fidelity Material Design components.
  - Architected a multi-layer modular routing system with responsive layouts and stable state management, supporting seamless navigation across 8+ screens.
  - Implemented reusable widget components following DRY and separation-of-concerns principles, reducing code duplication by ~30% and enabling rapid feature iteration.
  Tech Stack: Flutter, Dart, Material UI, URL Launcher

Certifications:
- ChatGPT-4 Prompt Engineering: Generative AI & LLM — Infosys Springboard | Aug 2025
- Cloud Computing — NPTEL IIT Kharagpur | Apr 2025
- Computer Communications — University of Colorado Boulder, USA | Dec 2024

Achievements:
- Achieved Global Rank 746 among 34,000+ participants in LeetCode Biweekly Contest 176.
- Solved 300+ algorithmic problems on LeetCode (Top 19%), CodeChef, and GeeksforGeeks, demonstrating advanced DSA proficiency.
- Earned 5-star ratings in Java and C++ on HackerRank, validating expertise in OOP and systems-level development.
"""

# ----- Display Startup Message -----
print("CVGenie Started...")
print("Type 'exit' to quit.\n")

# ----- Infinite Loop -----
while True:
  try:
    # ----- Take User Question -----
    question = input("You: ")

    # ----- Exit Condition -----
    if question.lower() == "exit":
        print("Bot: Goodbye!")
        break

    # ----- Prompt Engineering -----
    prompt = f"""
You are Tusar's Personal AI Assistant.

Rules:
1. If the question is about Tusar's education, skills, projects,
   internships, certifications, achievements, or experience,
   use the information provided below.
2. If the answer is not present in Tusar's information,
   answer using your general knowledge.
3. Be concise and helpful.

Tusar's Information:
{my_data}

Question:
{question}
"""

    # ----- Generate Response -----
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    # ----- Display Response -----
    print("\nBot:", response.text)

    # ----- Save Chat History -----
    with open("chat_history.txt", "a", encoding="utf-8") as file:
      file.write(f"You: {question}\n")
      file.write(f"Bot: {response.text}\n\n")
      file.write("-" * 50 + "\n")

  except Exception as e:
    print("\nError:", e)
