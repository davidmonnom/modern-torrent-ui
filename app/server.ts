"use server";

import { Transmission } from "@ctrl/transmission";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import FileExplorer, { FileType } from "@/class/FileExplorer";

const client = new Transmission({
  baseUrl: process.env.TRANSMISSION_HOST,
  username: process.env.TRANSMISSION_USERNAME,
  password: process.env.TRANSMISSION_PASSWORD,
});

export async function getTorrents() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  try {
    const data = await client.getAllData();
    const disk = await client.freeSpace(process.env.TRANSMISSION_DOWNLOAD_PATH);

    for (const torrent of data.torrents) {
      if (!torrent.isCompleted) {
        continue;
      }

      await client.removeTorrent(torrent.id, false);
    }

    return { torrents: data, disk: disk };
  } catch (error) {
    console.error("Error fetching torrent data:", error);
  }
}

export async function addTorrents(files: File[], type: string) {
  const session = await getServerSession(authOptions);
  if (!files || !type || !session) {
    return false;
  }

  try {
    for (const file of files) {
      file.arrayBuffer().then(async (buff) => {
        const x = new Uint8Array(buff);
        await client.addTorrent(x, {
          "download-dir": process.env.TRANSMISSION_DOWNLOAD_PATH + type,
        });
      });
    }

    return true;
  } catch (error) {
    console.error("Error adding torrent:", error);
    return false;
  }
}

export async function togglePause(torrentId: string) {
  const session = await getServerSession(authOptions);
  if (!torrentId || !session) {
    return false;
  }

  try {
    const torrent = await client.getTorrent(torrentId);

    if (torrent.state === "paused") {
      await client.resumeTorrent(torrentId);
    } else {
      await client.pauseTorrent(torrentId);
    }
    return true;
  } catch (error) {
    console.error("Error pausing torrent:", error);
    return false;
  }
}

export async function deleteTorrent(
  torrentId: string,
  removeData: boolean = false
) {
  const session = await getServerSession(authOptions);
  if (!torrentId || !session) {
    return false;
  }

  try {
    await client.removeTorrent(torrentId, removeData);
    return true;
  } catch (error) {
    console.error("Error deleting torrent:", error);
    return false;
  }
}

export async function getFiles(): Promise<FileType[]> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return [];
  }

  const path = process.env.FILES_MANAGER_PATHS as string;
  const entries = path.split(",");
  try {
    const fileManager = new FileExplorer();
    const results = [] as FileType[];

    for (const entry of entries) {
      const files = await fileManager.getContent(entry);
      results.push(...files);
    }

    return results;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export async function deleteFile(path: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }

  try {
    const fileManager = new FileExplorer();
    await fileManager.deleteFile(path);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

export async function togglePriority(torrentId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }

  try {
    await client.queueTop(torrentId);
    return true;
  } catch (error) {
    console.error("Error deleting torrent:", error);
    return false;
  }
}
