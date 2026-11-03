import assert from "node:assert/strict";
import { test, mock } from "node:test";
import { ensureGalleryStorage } from "./gallery-storage.server.ts";

type Storage = Awaited<ReturnType<Parameters<typeof ensureGalleryStorage>[1]>>;
const bucket = { id: "gallery-previews", name: "gallery-previews", public: true };
const missing = Object.assign(new Error("Bucket not found"), { status: 400, code: "NoSuchBucket" });

function fakeStorage(
  responses: Array<{ data: unknown; error: unknown }>,
  createError: unknown = null,
) {
  const getBucket = mock.fn(async () => responses.shift()!);
  const createBucket = mock.fn(async () => ({
    data: createError ? null : { name: bucket.name },
    error: createError,
  }));
  const storage = { getBucket, createBucket } as unknown as Storage;
  return { storage, getBucket, createBucket };
}

test("a non-admin cannot even initialize privileged storage", async () => {
  const getStorage = mock.fn(async (): Promise<Storage> => {
    throw new Error("Must not run");
  });
  await assert.rejects(
    ensureGalleryStorage(async () => false, getStorage),
    /permissão/,
  );
  assert.equal(getStorage.mock.callCount(), 0);
});

test("an authorization lookup failure also prevents privileged access", async () => {
  const getStorage = mock.fn(async (): Promise<Storage> => {
    throw new Error("Must not run");
  });
  await assert.rejects(
    ensureGalleryStorage(async () => {
      throw new Error("Auth unavailable");
    }, getStorage),
    /Auth unavailable/,
  );
  assert.equal(getStorage.mock.callCount(), 0);
});

test("an existing public bucket is left unchanged", async () => {
  const { storage, getBucket, createBucket } = fakeStorage([{ data: bucket, error: null }]);
  await ensureGalleryStorage(
    async () => true,
    async () => storage,
  );
  assert.deepEqual(getBucket.mock.calls[0].arguments, ["gallery-previews"]);
  assert.equal(createBucket.mock.callCount(), 0);
});

test("the observed NoSuchBucket response creates the exact preview bucket", async () => {
  const { storage, createBucket } = fakeStorage([{ data: null, error: missing }]);
  await ensureGalleryStorage(
    async () => true,
    async () => storage,
  );
  assert.deepEqual(createBucket.mock.calls[0].arguments, [
    "gallery-previews",
    {
      public: true,
      fileSizeLimit: 2097152,
      allowedMimeTypes: ["image/jpeg"],
    },
  ]);
});

test("a concurrent first upload may create the bucket without causing a false failure", async () => {
  const { storage } = fakeStorage(
    [
      { data: null, error: missing },
      { data: bucket, error: null },
    ],
    new Error("Already exists"),
  );
  await ensureGalleryStorage(
    async () => true,
    async () => storage,
  );
});

test("creation failures reach the admin instead of being swallowed", async () => {
  const { storage } = fakeStorage(
    [
      { data: null, error: missing },
      { data: null, error: missing },
    ],
    new Error("Storage unavailable"),
  );
  await assert.rejects(
    ensureGalleryStorage(
      async () => true,
      async () => storage,
    ),
    /Storage unavailable/,
  );
});

test("network and permission errors do not trigger bucket creation", async () => {
  for (const error of [
    new Error("Network unavailable"),
    Object.assign(new Error("Permission denied"), { status: 403 }),
  ]) {
    const { storage, createBucket } = fakeStorage([{ data: null, error }]);
    await assert.rejects(
      ensureGalleryStorage(
        async () => true,
        async () => storage,
      ),
      error,
    );
    assert.equal(createBucket.mock.callCount(), 0);
  }
});

test("an existing private bucket is never made public implicitly", async () => {
  const { storage, createBucket } = fakeStorage([
    { data: { ...bucket, public: false }, error: null },
  ]);
  await assert.rejects(
    ensureGalleryStorage(
      async () => true,
      async () => storage,
    ),
    /privado/,
  );
  assert.equal(createBucket.mock.callCount(), 0);
});
