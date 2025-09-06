import * as fs from "fs";

export type FileType = {
  name: string;
  isDirectory: boolean;
  path: string;
  size: number;
};

export default class FileExplorer {
  async readDirectory(path: string) {
    const result = await new Promise<fs.Dirent[]>((resolve) => {
      fs.readdir(path, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.warn("Error reading directory", path);
          resolve([]);
        }
        resolve(files);
      });
    });

    return result;
  }

  async getDirectorySize(path: string) {
    const read = async (path: string, size: number = 0) => {
      const result = await this.readDirectory(path);
      for (const file of result) {
        if (file.isSymbolicLink()) {
          continue;
        }

        if (file.isDirectory()) {
          size = await read(`${path}/${file.name}`, size);
        } else {
          size += await fs.statSync(path + "/" + file.name).size;
        }
      }

      return size;
    };

    const size = await read(path);
    return size;
  }

  async getContent(path: string, recursive: boolean = false) {
    const read = async (path: string, files: FileType[] = []) => {
      const result = await this.readDirectory(path);

      for (const file of result) {
        if (file.isSymbolicLink()) {
          continue;
        }

        const size = !file.isDirectory()
          ? await fs.statSync(path + "/" + file.name).size
          : await this.getDirectorySize(`${path}/${file.name}`);

        if (file.isDirectory() && recursive && file.name[0] !== ".") {
          files = await read(`${path}/${file.name}`, files);
        }

        files.push({
          name: file.name,
          size: size,
          isDirectory: file.isDirectory(),
          path: path,
        });
      }

      return files;
    };

    const content = await read(path);
    return content;
  }

  async deleteFile(path: string) {
    const allowedPaths = process.env.FILES_MANAGER_PATHS?.split(",");
    const pathIncluded = allowedPaths?.find((p) => path.includes(p));

    if (!pathIncluded || path.includes("/../")) {
      throw new Error("Error deleting file: Path not allowed");
    }

    return await fs.rmSync(path, { recursive: true, force: true });
  }
}
