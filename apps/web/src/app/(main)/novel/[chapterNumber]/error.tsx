'use client'

function ChapterErrorPage({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="container flex h-screen flex-col items-center md:justify-center">
      <h1 className="text-2xl">{error.message}</h1>
      <p>
        Please try again, and if the problem persists, create an{' '}
        <a
          href="https://github.com/AGN907/yomu/issues/new"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          issue
        </a>
      </p>
    </div>
  )
}

export default ChapterErrorPage
