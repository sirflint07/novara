const ChapterIdPage = async ({params}: {params: Promise<{chapterId: string}>}) => {
  const {chapterId} = await params
    return (
    <div>
      {chapterId}
    </div>
  )
}

export default ChapterIdPage
