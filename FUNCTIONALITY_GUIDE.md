# SamvadGPT - Functional Buttons & Features Documentation

## Header Component (`/src/components/layout/header.tsx`)

### Functional Buttons:
1. **Sidebar Toggle** (Mobile only)
   - Toggles sidebar visibility on mobile devices
   - Fully functional with proper mobile overlay

2. **Theme Toggle**
   - Switches between light and dark modes
   - Updates global theme state and applies CSS classes
   - Visual feedback with sun/moon icons

3. **New Chat Button**
   - Creates a new conversation
   - Automatically sets it as the current conversation
   - Clears the chat interface

4. **User Menu Dropdown**
   - Toggle with dropdown arrow
   - Contains: Theme toggle, New chat, Profile, Sign out
   - Click outside to close functionality
   - Proper z-index layering

## Sidebar Component (`/src/components/layout/sidebar.tsx`)

### Functional Buttons:
1. **New Chat Button**
   - Creates new conversation with "New Chat" title
   - Sets as current conversation
   - Closes sidebar on mobile after creation

2. **Search Chats**
   - Toggles search input field
   - Real-time filtering of conversations by title and content
   - Shows count of filtered results
   - Clears search when toggled off

3. **Individual Conversation Buttons**
   - Select conversation (sets as current)
   - Hover to show delete button
   - Delete with confirmation dialog
   - Proper selection styling

4. **Clear All Chats**
   - Small trash icon next to "Chats" header
   - Confirmation dialog before clearing
   - Only shows when conversations exist

5. **Library Button**
   - Shows placeholder alert (ready for implementation)
   - Proper hover states and icons

6. **Settings Button**
   - Shows placeholder alert (ready for implementation)
   - Consistent styling with other buttons

7. **Help & FAQ Button**
   - Shows placeholder alert (ready for implementation)
   - Accessible with proper titles

8. **Upgrade Plan Button**
   - Full-width button with gradient icon
   - Shows placeholder alert (ready for implementation)
   - Premium styling with gradient background

## Message Input Component (`/src/components/chat/message-input.tsx`)

### Functional Buttons:
1. **File Attachment Button**
   - Opens file picker for documents (.txt, .doc, .pdf, etc.)
   - Multiple file selection support
   - File preview chips with remove functionality
   - Files included in message when sent

2. **Image Upload Button**
   - Opens file picker for images
   - Multiple image selection support
   - Shared file preview system
   - Proper file type filtering

3. **Voice Recording Button**
   - Microphone permission request
   - Visual feedback (red pulsing when recording)
   - 3-second demo recording
   - Automatic transcription placeholder
   - Proper error handling for permissions

4. **Send Button**
   - Disabled when no message/files
   - Loading spinner when processing
   - Validates message content and attachments
   - Clears input after sending

### Additional Features:
- **Auto-resizing textarea** (up to 200px max height)
- **Enter to send** (Shift+Enter for new line)
- **File preview chips** with individual remove buttons
- **Character count** (when typing)
- **Proper disabled states** during loading

## Welcome Screen Component (`/src/components/chat/welcome-screen.tsx`)

### Functional Buttons:
1. **Suggestion Cards** (4 cards)
   - "Help me write a professional email to a client"
   - "Write code for a simple calculator app"
   - "Create a plan for a weekend trip to the mountains"
   - "Explain concepts like machine learning basics"
   - Each sends the full prompt when clicked
   - Hover effects and proper styling

## Chat Interface Features

### Error Handling:
- **API Key Errors**: Detailed setup instructions
- **Rate Limiting**: User-friendly messages
- **Network Errors**: Proper error display
- **Streaming Errors**: Graceful fallback

### State Management:
- **Conversation Persistence**: LocalStorage with proper hydration
- **Theme Persistence**: Survives page refresh
- **Search State**: Temporary, resets on toggle
- **Loading States**: Global and component-level

### Accessibility:
- **Proper ARIA labels** on all interactive elements
- **Keyboard navigation** support
- **Focus management** for modals and dropdowns
- **Screen reader friendly** text and labels
- **Tooltips** on all icon buttons

### Mobile Responsiveness:
- **Sidebar overlay** on mobile devices
- **Touch-friendly** button sizes
- **Proper z-index** layering
- **Responsive** grid layouts for suggestion cards

## Implementation Status:

✅ **Fully Functional:**
- Theme toggle
- New chat creation
- Conversation selection/deletion
- Search functionality
- File attachments
- Voice recording (demo)
- Message sending
- Error handling
- Mobile responsive design

🔄 **Placeholder Implementation (Ready for Extension):**
- Library functionality
- Settings panel
- Help & FAQ modal
- Upgrade plan process
- User profile management
- Authentication/Sign out

## Technical Notes:

- All buttons have proper **loading states**
- **Error boundaries** prevent crashes
- **Optimistic updates** for better UX
- **Debounced search** for performance
- **Memory cleanup** for file uploads and audio streams
- **TypeScript** type safety throughout
- **Consistent styling** with Tailwind classes
- **Proper event handling** and cleanup
