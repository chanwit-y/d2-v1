"use client";

import { ChatHistoryExample } from "@/_components/container/chat/ChatHistoryExample";
import { Box, Container, Heading, Text, Flex } from "@radix-ui/themes";

export default function DemoPage() {
  return (
    <Container size="4" className="py-8">
      <Box className="mb-8">
        <Heading size="8" className="mb-4">
          ChatHistory Component Demo
        </Heading>
        <Text size="3" className="text-zinc-600 mb-6">
          This demo showcases the ChatHistory component with mock data to demonstrate its functionality and features.
        </Text>
        
        <Box className="mb-6">
          <Heading size="4" className="mb-3">Features Demonstrated:</Heading>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li>Session organization by date groups (Today, Yesterday, Previous 7 days, etc.)</li>
            <li>Interactive session selection with visual feedback</li>
            <li>Session deletion with confirmation</li>
            <li>New chat creation functionality</li>
            <li>Message count and timestamp display</li>
            <li>Responsive design with proper truncation</li>
            <li>Hover effects and smooth transitions</li>
          </ul>
        </Box>
      </Box>

      <Box className="border border-zinc-300 rounded-lg overflow-hidden shadow-lg">
        <Flex direction="row" height="600px">
          {/* ChatHistory Demo */}
          <Box width="350px" className="border-r border-zinc-300">
            <ChatHistoryExample width="100%" height="100%" />
          </Box>
          
          {/* Instructions Panel */}
          <Box className="flex-1 p-6 bg-zinc-50">
            <Heading size="5" className="mb-4">
              How to Use
            </Heading>
            <Box className="space-y-4">
              <Box>
                <Text weight="bold" className="block mb-2">🆕 Create New Chat</Text>
                <Text className="text-zinc-600">
                  Click the "New Chat" button to create a new conversation session.
                </Text>
              </Box>
              
              <Box>
                <Text weight="bold" className="block mb-2">💬 Select Session</Text>
                <Text className="text-zinc-600">
                  Click on any chat session to switch to it. The current session is highlighted in blue.
                </Text>
              </Box>
              
              <Box>
                <Text weight="bold" className="block mb-2">🗑️ Delete Session</Text>
                <Text className="text-zinc-600">
                  Hover over a session and click the trash icon to delete it. The delete button appears on hover.
                </Text>
              </Box>
              
              <Box>
                <Text weight="bold" className="block mb-2">📅 Date Organization</Text>
                <Text className="text-zinc-600">
                  Sessions are automatically grouped by date for easy navigation and organization.
                </Text>
              </Box>
              
              <Box className="mt-6 p-4 bg-blue-50 rounded-lg">
                <Text weight="bold" className="block mb-2 text-blue-800">💡 Integration Notes</Text>
                <Text className="text-blue-700 text-sm">
                  In a real application, clicking on a session would load the actual conversation history. 
                  The component is designed to work with your existing ChatContext for seamless integration.
                </Text>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
      
      <Box className="mt-8 p-4 bg-zinc-100 rounded-lg">
        <Text size="2" className="text-zinc-600">
          <strong>Implementation Path:</strong> The ChatHistory component is located at{" "}
          <code className="bg-zinc-200 px-1 rounded">
            packages/client/src/_components/container/chat/ChatHistory.tsx
          </code>{" "}
          and has been integrated into your main page layout.
        </Text>
      </Box>
    </Container>
  );
} 