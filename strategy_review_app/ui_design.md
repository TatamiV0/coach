# Strategy Review App - UI Design & User Flow

## UI Design Principles

Based on the user's requirements, the Strategy Review App will feature a pure chat interface modeled on ChatGPT with the following key design elements:

1. **Pure Chat Interface**: No suggestion cards, buttons, or other UI elements that distract from the conversation
2. **ChatGPT-style Welcome**: Simple welcome message that invites users to start chatting naturally
3. **Conversational Input**: Placeholder text that encourages users to just start typing about their work and achievements
4. **Minimal UI**: Clean, distraction-free interface that focuses entirely on the conversation

## User Flow

1. **Initial Welcome**: User is greeted with a simple welcome message that explains the purpose of the app (self-review for strategists)
2. **Role Selection**: AI asks the user about their current role or the role they want to evaluate themselves against
3. **Natural Conversation**: AI guides the conversation through performance review topics based on the selected role's skill framework
4. **Skill Exploration**: AI naturally explores the four skill areas (Strategy, Creativity, Leadership, Culture) through conversation
5. **Reflection Prompting**: AI asks thoughtful questions that help the user reflect on their performance in each skill area
6. **Strengths & Growth Areas**: Through conversation, AI helps identify areas of strength and opportunities for growth
7. **Summary & Next Steps**: AI provides a conversational summary and suggests potential next steps for development

## Conversation Design

The AI will use the following conversation techniques:

1. **Open-ended Questions**: "Tell me about a recent project where you had to compile and organize research."
2. **Reflective Prompts**: "It sounds like you're comfortable with organizing research. How do you typically determine what's important to the brief?"
3. **Skill-based Exploration**: Questions will naturally map to the skills framework without explicitly mentioning the framework
4. **Natural Transitions**: Smooth transitions between skill areas that feel conversational rather than like completing a form
5. **Encouraging Responses**: Positive reinforcement and encouragement to help users reflect honestly

## Visual Design

1. **Chat Bubbles**: Clean, simple chat bubbles with clear visual distinction between user and AI messages
2. **Typography**: Easy-to-read font with appropriate sizing and spacing
3. **Color Scheme**: Minimal color palette with subtle brand elements
4. **Input Area**: Simple, clean input area with encouraging placeholder text
5. **Responsive Design**: Fully responsive layout that works well on all device sizes

## Technical Implementation Notes

1. The UI will be implemented using HTML, CSS, and JavaScript
2. The chat interface will use a React-based implementation for smooth interactions
3. The AI logic will be implemented in JavaScript, using the structured role data to guide conversations
4. No buttons or UI controls beyond the chat input field
5. Conversation history will be maintained in the browser session
