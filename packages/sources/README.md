# Sources

This package is used to store sources implementations.

## Contributing

If you want to create a new source implementation, check how to sources are structured in the [project](./src/) directory.

The base source that is used across all sources is [BaseSource](./src/types/BaseSource.ts).
You will need to check it to know which methods you will need to override in your implementation.

If the source is multisrc, which means more than one source has the same implementation but with tiny differences, you will need to create a reusable source at [multiSrc](./src/multiSrc/) and then use it on all similar sources. You can check the [Madara](./src/multiSrc/Madara/MadaraSource.ts) source for an example.

> [!WARNING]
> Don't forget to check if there's an open issue or PR for your new source implementation. Open one if it's not already there.
