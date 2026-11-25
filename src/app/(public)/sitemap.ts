import type { MetadataRoute } from 'next'
import { catalogue, documents } from '@/lib/content'
import { indexing } from '@/lib/metadata'
import { absolute } from '@/lib/site'

export const revalidate = 3600
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!(await indexing())) return []
  const [projects, posts] = await Promise.all([
    catalogue('projects', '-publishedAt'),
    catalogue('posts', '-publishedAt'),
  ])
  const indexablePosts = posts.filter(
    (post) =>
      !post.noIndex &&
      (!post.canonicalURL ||
        absolute(post.canonicalURL) === absolute('/insights/' + post.slug)),
  )
  const categories = [
    ...new Set(
      indexablePosts.flatMap((post) =>
        documents(post.categories).map((category) => category.slug),
      ),
    ),
  ]
  return [
    ...['/', '/projects', '/insights', '/lab', '/privacy'].map((path) => ({
      url: absolute(path),
    })),
    ...projects
      .filter(
        (project) =>
          !project.noIndex &&
          (!project.canonicalURL ||
            absolute(project.canonicalURL) ===
              absolute('/projects/' + project.slug)),
      )
      .map((project) => ({
        url: absolute('/projects/' + project.slug),
        lastModified: project.revisedAt || project.publishedAt || undefined,
      })),
    ...indexablePosts.map((post) => ({
      url: absolute('/insights/' + post.slug),
      lastModified: post.revisedAt || post.publishedAt || undefined,
    })),
    ...categories.map((slug) => ({
      url: absolute('/insights/category/' + slug),
    })),
  ]
}
