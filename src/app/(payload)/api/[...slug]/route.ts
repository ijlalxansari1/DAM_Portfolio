import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
} from '@payloadcms/next/routes'
export const GET = REST_GET(config)
const handlePost = REST_POST(config)
export const POST: typeof handlePost = async (request, context) => {
  const { slug } = await context.params
  if (process.env.VERCEL) {
    const endpoint = slug?.join('/')
    if (endpoint === 'users/first-register') {
      return new Response('Administrator provisioning is closed.', {
        status: 403,
      })
    }
    if (endpoint === 'users/forgot-password') {
      return new Response('Email recovery is currently unavailable.', {
        status: 503,
      })
    }
  }
  return handlePost(request, context)
}
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
