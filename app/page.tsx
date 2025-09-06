"use client";

import {
  Avatar,
  Box,
  Button,
  FormatByte,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddTorrentsDialog from "@/components/AddTorrentsDialog";
import { toaster, Toaster } from "@/components/ui/toaster";
import { getTorrents } from "./server";
import type { NormalizedTorrent } from "@ctrl/shared-torrent";
import { signIn, signOut, useSession } from "next-auth/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DateTime } from "luxon";
import TorrentCard from "@/components/TorrentCard";
import { Tooltip } from "@/components/ui/tooltip";
import { SiQbittorrent } from "react-icons/si";
import { MdOutlineFolderCopy } from "react-icons/md";
import FilesManager from "@/components/FilesManager";

export default function Dashboard() {
  const { status, data } = useSession();
  const [torrents, setTorrents] = useState<NormalizedTorrent[]>([]);
  const [freeSpace, setFreeSpace] = useState<number>(0);
  const [view, setView] = useState<"torrents" | "files">("torrents");

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const fetchTorrents = async () => {
      try {
        const data = await getTorrents();
        if (data) {
          data.torrents.torrents.sort((a, b) => {
            const addedA = DateTime.fromISO(a.dateAdded);
            const addedB = DateTime.fromISO(b.dateAdded);
            return addedA > addedB ? -1 : 1;
          });
          console.info(data.torrents.torrents);
          setTorrents(data.torrents.torrents);
          setFreeSpace(data.disk.arguments["size-bytes"]);
        }
      } catch {
        toaster.create({
          id: "error-fetching-torrent",
          title: "Error",
          description: "Failed to fetch torrents",
        });
      }
    };

    fetchTorrents();
    const interval = setInterval(() => {
      if (view === "torrents") {
        fetchTorrents();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, view]);

  const refetch = async () => {
    try {
      const data = await getTorrents();
      if (data) {
        data.torrents.torrents.sort((a, b) => {
          const addedA = DateTime.fromISO(a.dateAdded);
          const addedB = DateTime.fromISO(b.dateAdded);
          return addedA > addedB ? -1 : 1;
        });
        setTorrents(data.torrents.torrents);
        setFreeSpace(data.disk.arguments["size-bytes"]);
      }
    } catch {
      toaster.create({
        id: "error-fetching-torrent",
        title: "Error",
        description: "Failed to fetch torrents",
      });
    }
  };

  return (
    <VStack w={"100%"} h={"100%"} padding={"10px"} overflow={"hidden"}>
      <HStack w={"100%"} justifyContent={"space-between"} mb={"10px"}>
        <IconButton
          onClick={() => setView(view === "torrents" ? "files" : "torrents")}
          variant={"surface"}
          size={"xs"}
        >
          {view === "torrents" ? (
            <SiQbittorrent size={"20px"} />
          ) : (
            <MdOutlineFolderCopy size={"20px"} />
          )}
        </IconButton>
        {view === "torrents" && <AddTorrentsDialog />}
        <Tooltip content={"Free space"} openDelay={0} closeDelay={0}>
          <Button
            as={"div"}
            variant={"surface"}
            size={"xs"}
            opacity={1}
            disabled
          >
            <FormatByte value={freeSpace} />
          </Button>
        </Tooltip>
        <Spacer />
        <ColorModeButton />
        {status === "authenticated" ? (
          <Button variant={"surface"} size={"xs"} onClick={() => signOut()}>
            <Avatar.Root size={"xs"} width={"20px"} height={"20px"}>
              <Avatar.Fallback name={data.user?.name || ""} />
              <Avatar.Image src={data.user?.image || ""} />
            </Avatar.Root>
            Logout
          </Button>
        ) : (
          <Button variant={"surface"} size={"xs"} onClick={() => signIn()}>
            Login
          </Button>
        )}
      </HStack>

      {status === "authenticated" && view === "torrents" && (
        <VStack
          w={"100%"}
          alignItems={"flex-start"}
          gap={"10px"}
          flexGrow={1}
          overflow={"auto"}
        >
          {torrents.map((torrent) => (
            <TorrentCard key={torrent.id} torrent={torrent} />
          ))}
        </VStack>
      )}

      {status === "authenticated" && view === "files" && (
        <Box w={"100%"} flexGrow={1} overflow={"hidden"}>
          <FilesManager onChange={refetch} />
        </Box>
      )}

      {status !== "authenticated" && (
        <VStack
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          flexGrow={1}
        >
          <Text fontSize={"md"} opacity={0.5}>
            You need to login in order to see information.
          </Text>
        </VStack>
      )}

      <Toaster />
    </VStack>
  );
}
