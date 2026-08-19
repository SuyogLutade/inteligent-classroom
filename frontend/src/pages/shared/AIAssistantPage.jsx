import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { aiRules, students, rooms, timetableSlots, classrooms } from "../../data/mockData";
import { Send, Bot, User, Zap, RefreshCw } from "lucide-react";
import { cn } from "../../utils/helpers";

const QUICK_PROMPTS = {
  admin: [
    "Which classes currently need attention?",
    "Which rooms are underutilized?",
    "Are there any timetable conflicts?",
    "What is the overall attendance status?",
  ],
  teacher: [
    "Which students need attention in my class?",
    "Why did my class performance decline?",
    "Who has attendance issues?",
    "Which assignments have low completion?",
  ],
  student: [
    "What should I focus on?",
    "How is my attendance?",
    "What are my pending tasks?",
    "Which subject am I weakest in?",
  ],
};

const WELCOME_MESSAGES = {
  admin: "Hello! I'm your SmartClass AI Assistant. I can answer questions about campus attendance, room utilization, timetable conflicts, and classroom health — all based on live institutional data.",
  teacher: "Hello! I'm your AI Classroom Assistant. Ask me about student risk, class performance, attendance patterns, or assignment insights for your classes.",
  student: "Hello! I'm your personal SmartClass Assistant. I can help you understand your performance, attendance, pending tasks, and what to focus on to improve.",
};

// Rule-based AI response engine
function generateResponse(query, user) {
  const q = query.toLowerCase();
  const data = { students, rooms, timetable: timetableSlots, classrooms };

  // Find matching rule
  for (const rule of aiRules.patterns) {
    const roleMatch = rule.role === "all" || rule.role === user?.role;
    const keywordMatch = rule.keywords.some((kw) => q.includes(kw));
    if (roleMatch && keywordMatch) {
      try {
        return rule.response(data, user);
      } catch {
        return "I found relevant data but encountered an issue generating the response. Please try rephrasing.";
      }
    }
  }

  // Generic fallback responses using data
  if (q.includes("hello") || q.includes("hi")) {
    return "Hello! I'm ready to help. You can ask me about attendance, performance, assignments, rooms, or classroom health.";
  }

  if (q.includes("assignment") || q.includes("homework")) {
    return "Current assignment completion rates: CSE-A has 88% completion on the BST assignment, and 76% on SQL Query Optimization. CSE-C's ER Diagram assignment is at only 54% with the deadline passed.";
  }

  if (q.includes("performance") || q.includes("score") || q.includes("marks")) {
    return "CSE-A is performing best with an average of 78%. CSE-B has seen a gradual decline from 72% to 68% over the last 3 assessments. CSE-C is in a critical state at 58% average, declining from 70% over 5 months.";
  }

  if (q.includes("class") || q.includes("section")) {
    return "You have 3 active classes: CSE-A (Healthy, 85/100), CSE-B (Needs Attention, 72/100), and CSE-C (Critical, 58/100). CSE-C requires immediate intervention.";
  }

  return "I don't have a specific answer for that query yet. Try asking about: attendance, risk students, classroom health, timetable conflicts, room utilization, assignments, or performance.";
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: WELCOME_MESSAGES[user?.role] || WELCOME_MESSAGES.admin,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query) return;

    setInput("");
    const userMsg = { id: Date.now(), role: "user", content: query, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const response = generateResponse(query, user);
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: "assistant", content: response, time: new Date() },
    ]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const quickPrompts = QUICK_PROMPTS[user?.role] || QUICK_PROMPTS.admin;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            AI Classroom Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Data-driven insights from your institutional data — not a generic chatbot
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([{ id: 1, role: "assistant", content: WELCOME_MESSAGES[user?.role], time: new Date() }])}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex items-start gap-3", msg.role === "user" && "flex-row-reverse")}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === "assistant" ? "bg-primary/10" : "bg-muted"
                )}>
                  {msg.role === "assistant"
                    ? <Bot className="w-4 h-4 text-primary" />
                    : <User className="w-4 h-4 text-muted-foreground" />
                  }
                </div>

                {/* Bubble */}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-muted text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  {msg.content}
                  <p className={cn(
                    "text-[10px] mt-1.5",
                    msg.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/60"
                  )}>
                    {msg.time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-muted-foreground font-medium">Quick questions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4 flex gap-2 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask anything about your classroom data..."
            className="input flex-1"
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            variant="primary"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
