/**
 * Custom error classes for Sentry tracking
 */

export class PostNotFoundError extends Error {
  constructor(
    public slug: string,
    public referer: string,
    public pageType: 'blog_post' | 'retrospection_post'
  ) {
    super(`Post not found: ${slug}`)
    this.name = 'PostNotFoundError'
  }
}
