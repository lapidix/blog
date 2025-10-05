import type { MDXComponents } from 'mdx/types'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Pre from 'pliny/ui/Pre'
import TOCInline from 'pliny/ui/TOCInline'

import Image from '../../common/atoms/Image'
import CustomLink from '../../common/atoms/Link'
import {
  ErrorCallout,
  InfoCallout,
  NoteCallout,
  TipCallout,
  WarningCallout,
} from '../atoms/Callout'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm,
  Tip: TipCallout,
  Note: NoteCallout,
  Warning: WarningCallout,
  Error: ErrorCallout,
  Info: InfoCallout,
}
