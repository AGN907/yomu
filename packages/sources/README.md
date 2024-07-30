# Sources

This package is used to store sources implementations.

## Contributing

If you want to create a new source implementation, check the table below to learn how the sources are sturctured.

| Name                                    | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| [BaseSource](./src/types/BaseSource.ts) | The base source that is used across all sources.             |
| [multiSrc](./src/multiSrc/)             | Where a base source for similar sources are stored.          |
| [sources](./src/sources/)               | All sources implementations lives here. Grouped by language. |

The `BaseSource` is an abstract class that you will need to extend and override it's methods.

If the source is multisrc, which means more than one source has the same implementation but with tiny differences, you will need to create a reusable source at [multiSrc](./src/multiSrc/) and then use it on all similar sources. You can check the [Madara](./src/multiSrc/Madara/MadaraSource.ts) source for an example.

> [!WARNING]
> Don't forget to check if there's an open issue or PR for your new source implementation. Open one if it's not already there.
