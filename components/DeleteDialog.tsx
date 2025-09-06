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
import { deleteTorrent } from "@/app/server";
import { toaster } from "./ui/toaster";
import type { NormalizedTorrent } from "@ctrl/shared-torrent";

type DeleteDialogProps = {
  torrent: NormalizedTorrent;
  children: React.ReactNode;
};

export default function DeleteDialog({ torrent, children }: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (deleteData: boolean) => {
    try {
      const res = await deleteTorrent(torrent.id, deleteData);

      if (!res) {
        throw new Error("Error during adding torrents.");
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error during torrent deletion.",
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
              Are you sure you want to delete the torrent ? You can choose to
              remove the downloaded data as well.
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
              variant="outline"
              size={"sm"}
              onClick={() => handleDelete(false)}
            >
              Remove
            </Button>
            <Button
              colorPalette="red"
              size={"sm"}
              onClick={() => handleDelete(true)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
