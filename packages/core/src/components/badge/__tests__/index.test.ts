import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../index.vue'
import { badgeVariants } from '../variants'

describe('Badge', () => {
  it('renders with default variant classes when no variant prop', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Badge',
      },
    })

    expect(wrapper.classes()).toContain('bg-primary')
    expect(wrapper.classes()).toContain('text-primary-foreground')
    expect(wrapper.classes()).toContain('[a&]:hover:bg-primary/90')
  })

  it('renders secondary variant classes when variant="secondary"', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'secondary',
      },
      slots: {
        default: 'Secondary',
      },
    })

    expect(wrapper.classes()).toContain('bg-secondary')
    expect(wrapper.classes()).toContain('text-secondary-foreground')
    expect(wrapper.classes()).toContain('[a&]:hover:bg-secondary/90')
  })

  it('renders destructive variant classes when variant="destructive"', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'destructive',
      },
      slots: {
        default: 'Destructive',
      },
    })

    expect(wrapper.classes()).toContain('bg-destructive')
    expect(wrapper.classes()).toContain('text-white')
    expect(wrapper.classes()).toContain('[a&]:hover:bg-destructive/90')
  })

  it('renders outline variant classes when variant="outline"', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'outline',
      },
      slots: {
        default: 'Outline',
      },
    })

    expect(wrapper.classes()).toContain('text-foreground')
    expect(wrapper.classes()).toContain('[a&]:hover:bg-accent')
    expect(wrapper.classes()).toContain('[a&]:hover:text-accent-foreground')
  })

  it('renders base classes (inline-flex, rounded-full, text-xs)', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Badge',
      },
    })

    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-xs')
  })

  it('has data-slot="badge" attribute', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Badge',
      },
    })

    expect(wrapper.attributes('data-slot')).toBe('badge')
  })

  it('applies custom className when provided', () => {
    const wrapper = mount(Badge, {
      props: {
        class: 'custom-class',
      },
      slots: {
        default: 'Badge',
      },
    })

    expect(wrapper.classes()).toContain('custom-class')
  })

  it('renders as <span> element', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Badge',
      },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('supports asChild mode (renders child instead of span)', () => {
    const wrapper = mount(Badge, {
      props: {
        asChild: true,
      },
      slots: {
        default: '<a href="/test">Link</a>',
      },
    })

    expect(wrapper.find('span[data-slot="badge"]').exists()).toBe(false)
  })

  it('applies variant classes to child element when asChild=true', () => {
    const wrapper = mount(Badge, {
      props: {
        asChild: true,
        variant: 'destructive',
      },
      slots: {
        default: '<a href="/test">Link</a>',
      },
    })

    expect(wrapper.classes()).toContain('bg-destructive')
    expect(wrapper.classes()).toContain('text-white')
  })

  it('has data-variant attribute matching the variant prop', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'outline',
      },
      slots: {
        default: 'Outline',
      },
    })

    expect(wrapper.attributes('data-variant')).toBe('outline')
  })

  it('badgeVariants helper produces consistent classes', () => {
    const classes = badgeVariants({ variant: 'secondary' })
    expect(classes).toContain('bg-secondary')
    expect(classes).toContain('text-secondary-foreground')
  })
})
