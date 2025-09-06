"use client";

import {
  Button,
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "./ui/dialog";
import { deleteFile } from "@/app/server";
import { toaster } from "./ui/toaster";
import { FileType } from "@/class/FileExplorer";

type DeleteFileDialogProps = {
  file: FileType;
  children: React.ReactNode;
  onDelete: () => Promise<boolean>;
};

export default function DeleteFileDialog({
  file,
  children,
  onDelete,
}: DeleteFileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteFile(file.path + "/" + file.name);
      await onDelete();
      if (!res) {
        throw new Error("Error during deleting files.");
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error during file deletion.",
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning, potential data loss</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text>
              Are you sure you want to delete the files ? This action cannot be
              undone.
            </Text>
          </DialogBody>
          <DialogCloseTrigger />
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" size={"sm"}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              colorPalette="red"
              size={"sm"}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
