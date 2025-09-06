"use client";

import {
  Card,
  FormatByte,
  HStack,
  Progress,
  Spacer,
  Tag,
  Text,
} from "@chakra-ui/react";
import type { NormalizedTorrent } from "@ctrl/shared-torrent";
import { BsPauseFill, BsFillPlayFill } from "react-icons/bs";
import RoundIconButton from "@/components/RoundIconButton";
import { togglePause, togglePriority } from "@/app/server";
import { toaster } from "./ui/toaster";
import { FaTrashAlt } from "react-icons/fa";
import DeleteDialog from "./DeleteDialog";
import { Tooltip } from "./ui/tooltip";
import { FaArrowUp } from "react-icons/fa6";

type TorrentCardProps = {
  torrent: NormalizedTorrent;
};

export default function TorrentCard({ torrent }: TorrentCardProps) {
  const getIconState = () => {
    return torrent.state === "paused" ? <BsFillPlayFill /> : <BsPauseFill />;
  };

  const handlePause = async () => {
    try {
      const res = await togglePause(torrent.id);

      if (!res) {
        throw new Error("Error during adding torrents.");
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error during pause/resume.",
      });
    }
  };

  const setToTopQueue = async (torrentId: string) => {
    try {
      const res = await togglePriority(torrentId);

      if (!res) {
        throw new Error("Error while setting torrent to top of queue.");
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error while setting torrent to top of queue.",
      });
    }
  };

  return (
    <Card.Root key={torrent.id} width="100%" variant={"outline"}>
      <Card.Body gap="2" padding={"13px"}>
        <HStack w={"100%"} justifyContent={"space-between"}>
          <Text fontSize={"sm"} lineClamp={1} flexGrow={1}>
            {torrent.name}
          </Text>
          <Spacer />
          <Tooltip content={"Set to top of queue"} openDelay={0}>
            <RoundIconButton
              onClick={() => setToTopQueue(torrent.id)}
              icon={<FaArrowUp size={"12px"} />}
              alt={"Pause"}
            />
          </Tooltip>
          <RoundIconButton
            onClick={handlePause}
            icon={getIconState()}
            alt={"Pause"}
          />
          <DeleteDialog torrent={torrent}>
            <RoundIconButton
              onClick={() => {}}
              icon={<FaTrashAlt size={"10px"} />}
              alt={"Delete"}
            />
          </DeleteDialog>
        </HStack>

        <Progress.Root
          w={"100%"}
          value={torrent.progress * 100}
          mt={"5px"}
          size={"sm"}
          striped={torrent.state === "paused"}
        >
          <HStack gap="5" w={"100%"}>
            <Progress.Track flexGrow={1}>
              <Progress.Range />
            </Progress.Track>
            <Progress.ValueText>
              {(torrent.progress * 100).toFixed(2)}%
            </Progress.ValueText>
          </HStack>
        </Progress.Root>
        <HStack gap={2} w={"100%"} mt={"5px"} flexWrap={"wrap"}>
          <Tag.Root colorPalette={"red"} flexShrink={0}>
            <Tag.Label>
              Download: <FormatByte value={torrent.downloadSpeed} />
              /s
            </Tag.Label>
          </Tag.Root>
          <Tag.Root colorPalette={"green"} flexShrink={0}>
            <Tag.Label>
              Upload: <FormatByte value={torrent.uploadSpeed} />
              /s
            </Tag.Label>
          </Tag.Root>
          <Tag.Root flexShrink={0}>
            <Tag.Label>
              Size: <FormatByte value={torrent.totalSize} />
            </Tag.Label>
          </Tag.Root>
          <Tag.Root flexShrink={0}>
            <Tag.Label>
              Queue: {torrent.queuePosition}
            </Tag.Label>
          </Tag.Root>
          <Tag.Root flexShrink={0}>
            <Tag.Label>Peers: {torrent.connectedPeers}</Tag.Label>
          </Tag.Root>
          <Tag.Root flexShrink={0}>
            <Tag.Label>Seeds: {torrent.connectedSeeds}</Tag.Label>
          </Tag.Root>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
