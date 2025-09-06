"use client";

import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

type RoundIconButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  alt: string;
  sizeInPx?: number;
};

export default function RoundIconButton({
  onClick,
  icon,
  alt,
  sizeInPx = 25,
}: RoundIconButtonProps) {
  const borderColor = useColorModeValue("#e4e4e7", "#27272a");
  const backgroundColor = useColorModeValue("#f4f4f5", "#18181b");
  const hoverColor = useColorModeValue("#e4e4e7", "#27272a");

  return (
    <Box
      w={`${sizeInPx}px`}
      h={`${sizeInPx}px`}
      title={alt}
      padding={"3px"}
      borderRadius={"999px"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      cursor={"pointer"}
      onClick={onClick}
      border={"1px solid"}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      _hover={{
        backgroundColor: hoverColor,
        transition: "background-color 0.2s",
      }}
    >
      {icon}
    </Box>
  );
}
