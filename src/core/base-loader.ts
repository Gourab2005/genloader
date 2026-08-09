import type { Document } from "./document.js";

export abstract class BaseLoader {
  abstract load(): Promise<Document[]>;
}