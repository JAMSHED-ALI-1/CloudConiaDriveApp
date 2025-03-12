const parems=[{


    pageId:0,
    folderId: 0,
    page: 1,
    workspaceId: workspaces || 0,
    deletedOnly: false,
    starredOnly: false,
    recentOnly: false,
    sharedOnly: false,
    per_page: 100,
    orderBy:'updated_at',
    orderDir:'Desc',
    // orderBy: sortingInfo.sortBy,
    // orderDir: sortingInfo.sortDir,
    filters: filter,
}
]

export default parems