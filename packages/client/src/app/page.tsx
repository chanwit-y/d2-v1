import { ChatBox } from "@/_components/container/chat/ChatBox";
import { Box, Flex } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="row" className="h-[calc(100vh-3rem)] p-4">
      <Box width={{ sm: '0%', md: '30%' }} height="100%" className="bg-zinc-900 sm:hidden mr-2">

      </Box>
      <Box width={{ sm: '100%', md: '70%' }} height="100%">
        <ChatBox width="100%" height="100%" />
      </Box>
    </Flex>
  );
}
