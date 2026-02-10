import { revalidatePath as nextRevalidatePath, revalidateTag as nextRevalidateTag } from "next/cache";

/**
 * Revalidate a path with dev-mode logging.
 * Use this instead of importing revalidatePath directly.
 */
export function revalidatePathWithLog(path: string, context: string) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info(`[cache:revalidate] path="${path}" trigger="${context}"`);
  }
  nextRevalidatePath(path);
}

/**
 * Revalidate a tag with dev-mode logging.
 * Use this instead of importing revalidateTag directly.
 */
export function revalidateTagWithLog(tag: string, context: string, profile = "default") {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info(`[cache:revalidateTag] tag="${tag}" trigger="${context}"`);
  }
  nextRevalidateTag(tag, profile);
}
