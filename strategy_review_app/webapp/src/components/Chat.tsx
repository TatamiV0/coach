import { useState, useRef, useEffect } from 'react';
import { rolesData, Skill } from '../data/roles_data';
import '../styles/Chat.css';

// Message type definition
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Conversation state type
interface ConversationState {
  currentRole: string | null;
  currentSkill: string | null;
  stage: 'welcome' | 'role_selection' | 'conversation' | 'summary';
  questionsAsked: string[];
  userStrengths: string[];
  userGrowthAreas: string[];
}

const Chat: React.FC = () => {
  // State for messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  // State for user input
  const [input, setInput] = useState('');
  
  // State for conversation tracking
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentRole: null,
    currentSkill: null,
    stage: 'welcome',
    questionsAsked: [],
    userStrengths: [],
    userGrowthAreas: []
  });
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Welcome to your Strategy Performance Review. I'm here to help you reflect on your work and skills. Let's have a conversation about your role and performance. What role are you currently in?",
      sender: 'ai' as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setConversationState(prev => ({ ...prev, stage: 'role_selection' }));
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Process user message and generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text, conversationState);
      setMessages(prev => [...prev, aiResponse]);
      
      // Update conversation state based on the response
      updateConversationState(userMessage.text, aiResponse.text);
    }, 500);
  };
  
  // Generate AI response based on user input and conversation state
  const generateAIResponse = (userInput: string, state: ConversationState): Message => {
    let responseText = '';
    
    // Role selection stage
    if (state.stage === 'role_selection') {
      const detectedRole = detectRole(userInput);
      
      if (detectedRole) {
        responseText = `Great! I see you're in the ${detectedRole} role. Let's talk about your work in this role. Could you tell me about a recent project you worked on?`;
        
        // Update state with detected role
        setConversationState(prev => ({
          ...prev,
          currentRole: detectedRole,
          stage: 'conversation',
          currentSkill: 'strategy' // Start with strategy skill
        }));
      } else {
        responseText = "I'm not sure I understood your role. Are you an Intern, Junior Strategist, Strategist, Senior Strategist, Associate Strategy Director, Strategy Director, Senior Strategy Director, Executive Strategy Director, or Principal?";
      }
    }
    // Conversation stage
    else if (state.stage === 'conversation') {
      // Get the current role data
      const roleData = rolesData.roles.find(r => r.title === state.currentRole);
      
      if (roleData && state.currentSkill) {
        const skillData = roleData.skills[state.currentSkill.toLowerCase()];
        
        // Generate a question based on the current skill
        responseText = generateSkillQuestion(state.currentSkill, skillData, state.questionsAsked);
        
        // Add question to asked questions
        setConversationState(prev => ({
          ...prev,
          questionsAsked: [...prev.questionsAsked, responseText]
        }));
        
        // Check if we should move to next skill
        if (state.questionsAsked.length > 0 && state.questionsAsked.length % 3 === 0) {
          const nextSkill = getNextSkill(state.currentSkill);
          
          if (nextSkill) {
            setConversationState(prev => ({
              ...prev,
              currentSkill: nextSkill
            }));
          } else {
            // If no next skill, move to summary
            setConversationState(prev => ({
              ...prev,
              stage: 'summary'
            }));
            
            responseText += "\n\nWe've covered quite a bit about your work and skills. Let me summarize what I've learned about your strengths and areas for growth.";
          }
        }
      } else {
        responseText = "I'd like to understand more about your work. Could you tell me about a specific project or challenge you've faced recently?";
      }
    }
    // Summary stage
    else if (state.stage === 'summary') {
      responseText = generateSummary(state);
    }
    
    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'ai',
      timestamp: new Date()
    };
  };
  
  // Detect role from user input
  const detectRole = (input: string): string | null => {
    const normalizedInput = input.toLowerCase();
    
    for (const role of rolesData.roles) {
      if (normalizedInput.includes(role.title.toLowerCase())) {
        return role.title;
      }
    }
    
    // Handle approximate matches
    if (normalizedInput.includes('intern')) return 'Intern';
    if (normalizedInput.includes('junior')) return 'Junior Strategist';
    if (normalizedInput.includes('senior') && normalizedInput.includes('director')) return 'Senior Strategy Director';
    if (normalizedInput.includes('executive')) return 'Executive Strategy Director';
    if (normalizedInput.includes('associate')) return 'Associate Strategy Director';
    if (normalizedInput.includes('director')) return 'Strategy Director';
    if (normalizedInput.includes('senior')) return 'Senior Strategist';
    if (normalizedInput.includes('principal')) return 'Principal';
    if (normalizedInput.includes('strategist')) return 'Strategist';
    
    return null;
  };
  
  // Generate a question based on skill
  const generateSkillQuestion = (skillName: string, skillData: Skill, askedQuestions: string[]): string => {
    const whatIDo = skillData.what_i_do;
    const howIDoIt = skillData.how_i_do_it;
    
    // Generate different questions based on the skill
    const questions = [
      `In your role, ${whatIDo}. How do you approach this aspect of your work?`,
      `One key aspect of your role is that ${whatIDo}. Can you share an example of how you've done this recently?`,
      `Let's talk about how ${whatIDo}. What strategies have you found effective in this area?`,
      `Regarding ${howIDoIt[0].toLowerCase()}, how confident do you feel about this skill?`,
      `Do you find it challenging to ${howIDoIt[1].toLowerCase()}? What helps you succeed in this area?`,
      `How have you developed your ability to ${howIDoIt[2] ? howIDoIt[2].toLowerCase() : howIDoIt[0].toLowerCase()}?`
    ];
    
    // Filter out questions that are too similar to already asked ones
    const filteredQuestions = questions.filter(q => 
      !askedQuestions.some(asked => similarity(q, asked) > 0.7)
    );
    
    // If all questions are too similar, generate a generic one
    if (filteredQuestions.length === 0) {
      return `Let's continue discussing your ${skillName} skills. What other aspects of this area would you like to reflect on?`;
    }
    
    return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
  };
  
  // Get next skill in the sequence
  const getNextSkill = (currentSkill: string): string | null => {
    const skills = ['strategy', 'creativity', 'leadership', 'culture'];
    const currentIndex = skills.indexOf(currentSkill.toLowerCase());
    
    if (currentIndex < skills.length - 1) {
      return skills[currentIndex + 1];
    }
    
    return null;
  };
  
  // Generate summary based on conversation
  const generateSummary = (state: ConversationState): string => {
    const roleData = rolesData.roles.find(r => r.title === state.currentRole);
    
    if (!roleData) return "Thank you for sharing your experiences. I hope this conversation has helped you reflect on your work.";
    
    return `Based on our conversation, I can see that as a ${state.currentRole}, you have several strengths:

1. You seem to have a good grasp of your strategic responsibilities
2. You're thoughtful about how you approach your work
3. You're reflective about your skills and contributions

Some areas you might want to focus on for growth:

1. Continue developing your skills in ${Object.keys(roleData.skills)[Math.floor(Math.random() * 4)]}
2. Seek opportunities to practice ${roleData.skills.leadership.how_i_do_it[0].toLowerCase()}
3. Consider how you might further enhance your ability to ${roleData.skills.creativity.how_i_do_it[1].toLowerCase()}

Thank you for taking the time to reflect on your performance. Regular self-review is a valuable practice for continued growth.`;
  };
  
  // Update conversation state based on user input and AI response
  const updateConversationState = (_userInput: string, _aiResponse: string) => {
    // This would contain logic to update the conversation state based on the content
    // For now, we're handling most state updates in the generateAIResponse function
  };
  
  // Simple string similarity function (for avoiding repetitive questions)
  const similarity = (str1: string, str2: string): number => {
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts about your work and achievements..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
