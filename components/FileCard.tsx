"use client";

import {
  Box,
  Button,
  Card,
  FormatByte,
  HStack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { MdOutlineFolderCopy } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { FileType } from "@/class/FileExplorer";
import DeleteFileDialog from "./DeleteFileDialog";

type FileCardProps = {
  file: FileType;
  path: string;
  onDelete: () => Promise<boolean>;
};

export default function FileCard({ file, path, onDelete }: FileCardProps) {
  return (
    <Card.Root width="100%" variant={"outline"} size={"sm"}>
      <Card.Body gap="2" padding={"13px"} w={"100%"} overflow={"hidden"}>
        <HStack alignItems={"center"} gap={"2px"} w={"100%"}>
          {file.isDirectory ? (
            <MdOutlineFolderCopy size={"13px"} />
          ) : (
            <FaRegFileLines size={"13px"} />
          )}
          <Text fontSize={"sm"} lineClamp={1}>
            {file.name}
          </Text>
        </HStack>
        <HStack w={"100%"} overflow={"hidden"}>
          <Tag.Root>
            <Tag.Label>{path.split("/")[path.split("/").length - 1]}</Tag.Label>
          </Tag.Root>
          <Tag.Root>
            <Tag.Label>
              <FormatByte value={file.size} />
            </Tag.Label>
          </Tag.Root>
        </HStack>

        <Box mt={"20px"}>
          <DeleteFileDialog file={file} onDelete={onDelete}>
            <Button variant={"surface"} size={"xs"} w={"100%"}>
              Delete this file
            </Button>
          </DeleteFileDialog>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
