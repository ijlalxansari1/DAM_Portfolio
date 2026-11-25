import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonStyles = cva('button', {
  variants: {
    variant: {
      primary: 'button-primary',
      secondary: 'button-secondary',
      inverse: 'button-inverse',
    },
  },
  defaultVariants: { variant: 'primary' },
})

export function Button({
  variant,
  asChild,
  className,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonStyles> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      className={cn(buttonStyles({ variant }), className)}
      {...props}
    />
  )
}
