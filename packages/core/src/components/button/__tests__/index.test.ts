import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../index.vue'
import { buttonVariants } from '../variants'

describe('Button', () => {
  it('renders with default variant classes when no variant prop', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.classes()).toContain('bg-primary')
    expect(wrapper.classes()).toContain('text-primary-foreground')
    expect(wrapper.classes()).toContain('hover:bg-primary/90')
  })

  it('renders destructive classes when variant="destructive"', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'destructive',
      },
      slots: {
        default: 'Delete',
      },
    })

    expect(wrapper.classes()).toContain('bg-destructive')
    expect(wrapper.classes()).toContain('text-white')
  })

  it('renders outline classes when variant="outline"', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'outline',
      },
      slots: {
        default: 'Outline',
      },
    })

    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('bg-background')
    expect(wrapper.classes()).toContain('hover:bg-accent')
  })

  it('renders secondary classes when variant="secondary"', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary',
      },
      slots: {
        default: 'Secondary',
      },
    })

    expect(wrapper.classes()).toContain('bg-secondary')
    expect(wrapper.classes()).toContain('text-secondary-foreground')
  })

  it('renders ghost classes when variant="ghost"', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'ghost',
      },
      slots: {
        default: 'Ghost',
      },
    })

    expect(wrapper.classes()).toContain('hover:bg-accent')
    expect(wrapper.classes()).toContain('hover:text-accent-foreground')
  })

  it('renders link classes when variant="link"', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'link',
      },
      slots: {
        default: 'Link',
      },
    })

    expect(wrapper.classes()).toContain('text-primary')
    expect(wrapper.classes()).toContain('underline-offset-4')
    expect(wrapper.classes()).toContain('hover:underline')
  })

  it('renders correct size classes when size="lg"', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'lg',
      },
      slots: {
        default: 'Large',
      },
    })

    expect(wrapper.classes()).toContain('h-10')
    expect(wrapper.classes()).toContain('px-6')
  })

  it('renders correct size classes when size="sm"', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'sm',
      },
      slots: {
        default: 'Small',
      },
    })

    expect(wrapper.classes()).toContain('h-8')
    expect(wrapper.classes()).toContain('px-3')
  })

  it('renders correct size classes when size="icon"', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'icon',
      },
      slots: {
        default: 'Icon',
      },
    })

    expect(wrapper.classes()).toContain('size-9')
  })

  it('renders correct size classes when size="icon-sm"', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'icon-sm',
      },
      slots: {
        default: 'Icon Small',
      },
    })

    expect(wrapper.classes()).toContain('size-8')
  })

  it('renders correct size classes when size="icon-lg"', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'icon-lg',
      },
      slots: {
        default: 'Icon Large',
      },
    })

    expect(wrapper.classes()).toContain('size-10')
  })

  it('does NOT render button element when asChild=true', () => {
    const wrapper = mount(Button, {
      props: {
        asChild: true,
      },
      slots: {
        default: '<a href="/test">Link</a>',
      },
    })

    expect(wrapper.element.tagName).not.toBe('BUTTON')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('applies variant classes to child element when asChild=true', () => {
    const wrapper = mount(Button, {
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

  it('renders button element when asChild=false (default)', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('applies custom className when provided', () => {
    const wrapper = mount(Button, {
      props: {
        class: 'custom-class',
      },
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.classes()).toContain('custom-class')
  })

  it('has correct data attributes for testing', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'destructive',
        size: 'lg',
      },
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.attributes('data-slot')).toBe('button')
    expect(wrapper.attributes('data-variant')).toBe('destructive')
    expect(wrapper.attributes('data-size')).toBe('lg')
  })
})
