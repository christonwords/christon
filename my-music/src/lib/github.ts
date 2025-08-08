export type GitHubRepo = {
  owner: string
  repo: string
  branch?: string
}

export async function upsertFile(params: {
  repo: GitHubRepo
  path: string
  contentBase64: string
  message: string
  token: string
}) {
  const { repo, path, contentBase64, message, token } = params
  const branch = repo.branch ?? 'main'
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${encodeURIComponent(path)}?ref=${branch}`

  // First check if file exists to get SHA
  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })

  let sha: string | undefined
  if (getRes.ok) {
    const data = await getRes.json()
    sha = data.sha
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: contentBase64,
      sha,
      branch,
    }),
  })

  if (!putRes.ok) {
    const text = await putRes.text()
    throw new Error(`GitHub upsert failed: ${putRes.status} ${text}`)
  }

  return putRes.json()
}