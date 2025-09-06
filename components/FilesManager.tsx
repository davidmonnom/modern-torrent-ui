"use client";

import { getFiles } from "@/app/server";
import { Box, Spinner, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FileCard from "./FileCard";
import { FileType } from "@/class/FileExplorer";

type FilesManagerProps = {
  onChange: () => void;
};

export default function FilesManager({ onChange }: FilesManagerProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const files = await getFiles();
      files.sort((a, b) => (a.size > b.size ? -1 : 1));
      setFiles(files);
      setLoading(false);
    };

    fetch();
  }, []);

  const refetch = async () => {
    const files = await getFiles();
    files.sort((a, b) => (a.size > b.size ? -1 : 1));
    setFiles(files);
    await onChange();
    return true;
  };

  return (
    <Box w={"100%"} h={"100%"} overflow={"auto"}>
      {loading ? (
        <VStack h={"100%"} w={"100%"} justify={"center"} align={"center"}>
          <Spinner />
        </VStack>
      ) : (
        <VStack w={"100%"} h={"100%"} gap={2}>
          {files.map((file, index) => (
            <FileCard
              key={index}
              file={file}
              path={file.path}
              onDelete={refetch}
            />
          ))}
          {files.length === 0 && (
            <VStack mt={"30px"} opacity={0.5} w={"100%"}>
              <Box>No files found</Box>
            </VStack>
          )}
        </VStack>
      )}
    </Box>
  );
}
