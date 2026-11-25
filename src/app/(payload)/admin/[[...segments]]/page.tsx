import type { Metadata } from 'next'
import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Props = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const metadata = await generatePageMetadata({ config, params, searchParams })
  return { ...metadata, robots: { index: false, follow: false } }
}
export default function Page({ params, searchParams }: Props) {
  return RootPage({ config, params, searchParams, importMap })
}
