"use client";

import {
  Button,
  createListCollection,
  DialogBody,
  DialogCloseTrigger,
  HStack,
} from "@chakra-ui/react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { FormEvent, useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "./ui/dialog";
import { toaster } from "./ui/toaster";
import { addTorrents } from "@/app/server";

const TorrentTypes = createListCollection({
  items: [
    { label: "Movie", value: "movies" },
    { label: "TV Show", value: "shows" },
    { label: "Music", value: "musics" },
    { label: "Software", value: "softwares" },
    { label: "Game", value: "games" },
  ],
});

export default function AddTorrentsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTorrent = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData(e.target as HTMLFormElement);
      const files = data.getAll("files") as File[];
      const type = data.get("type") as string;

      if (!files || !type) {
        toaster.create({
          title: "Error",
          description: "Please select a file and type.",
        });
        return;
      }

      const result = await addTorrents(files, type);
      if (!result) {
        throw new Error("Error during adding torrents.");
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error during adding torrents.",
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant={"surface"} size={"xs"}>
            Add a torrent
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add torrents</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <form onSubmit={handleAddTorrent} style={{ width: "100%" }}>
              <FileUploadRoot
                alignItems="stretch"
                maxFiles={10}
                name="files"
                w={"100%"}
              >
                <FileUploadDropzone
                  label="Drag and drop here to upload"
                  description=".torrent files"
                />
                <FileUploadList />
              </FileUploadRoot>
              <SelectRoot
                zIndex={9999}
                collection={TorrentTypes}
                name="type"
                defaultValue={["movies"]}
                mt={2}
              >
                <SelectLabel>File type</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select type" />
                </SelectTrigger>
                <SelectContent zIndex={9999}>
                  {TorrentTypes.items.map((type) => (
                    <SelectItem item={type} key={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              <HStack
                gap={2}
                justifyContent={"center"}
                alignItems={"center"}
                mt={2}
              >
                <Button variant={"surface"} type="submit">
                  Upload
                </Button>
              </HStack>
            </form>
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
}
