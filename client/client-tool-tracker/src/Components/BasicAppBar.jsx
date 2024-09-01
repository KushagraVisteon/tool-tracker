import React from "react";
import { Box, Flex, IconButton, Heading } from "@chakra-ui/react";
import LoginIcon from "@mui/icons-material/Login";
export default function MyAppBar() {
  return (
    <Box bg="#ff4500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Leftmost part - Text as h1 */}
        <Heading as="h1" fontSize="xl" className="heading_header">
          Tool Tracker
        </Heading>

        {/* Rightmost part - Login Icon */}
        <IconButton
          size="lg"
          icon={<LoginIcon />}
          aria-label="Login"
          color="white"
        />
      </Flex>
    </Box>
  );
}
