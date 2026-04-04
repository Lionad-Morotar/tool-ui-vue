import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyButton from '../index.vue'
import { buttonVariants } from '../../button/variants'

// Mock navigator.clipboard
const mockWriteText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  vi.useFakeTimers()
  Object.assign(navigator, {
    clipboard: {
      writeText: mockWriteText,
    },
  })
  mockWriteText.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CopyButton', () => {
  it('renders as a button element with data-slot="copy-button"', () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'test text' },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('data-slot')).toBe('copy-button')
  })

  it('calls navigator.clipboard.writeText with the value prop when clicked', async () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'hello world' },
    })

    await wrapper.trigger('click')

    expect(mockWriteText).toHaveBeenCalledWith('hello world')
  })

  it('shows "copy" state by default (isCopied = false)', () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
    })

    expect(wrapper.text()).toContain('Copy')
    expect(wrapper.attributes('aria-label')).toBe('Copy to clipboard')
  })

  it('transitions to "check" state after successful copy (isCopied = true)', async () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
    })

    await wrapper.trigger('click')
    await vi.advanceTimersByTimeAsync(0)

    expect(wrapper.text()).toContain('Copied!')
    expect(wrapper.attributes('aria-label')).toBe('Copied')
  })

  it('reverts to "copy" state after 2000ms timeout', async () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
    })

    await wrapper.trigger('click')
    await vi.advanceTimersByTimeAsync(0)

    expect(wrapper.text()).toContain('Copied!')

    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Copy')
    expect(wrapper.attributes('aria-label')).toBe('Copy to clipboard')
  })

  it('emits "copied" event after successful copy', async () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
    })

    await wrapper.trigger('click')
    await vi.advanceTimersByTimeAsync(0)

    expect(wrapper.emitted('copied')).toBeTruthy()
    expect(wrapper.emitted('copied')!.length).toBe(1)
  })

  it('applies correct variant and size classes (uses buttonVariants)', () => {
    const wrapper = mount(CopyButton, {
      props: {
        value: 'test',
        variant: 'ghost',
        size: 'icon-sm',
      },
    })

    const expectedClasses = buttonVariants({ variant: 'ghost', size: 'icon-sm' })
    const expectedClassList = expectedClasses.split(' ').filter(Boolean)
    for (const cls of expectedClassList) {
      expect(wrapper.classes()).toContain(cls)
    }
  })

  it('applies custom variant classes when variant="outline"', () => {
    const wrapper = mount(CopyButton, {
      props: {
        value: 'test',
        variant: 'outline',
      },
    })

    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('bg-background')
  })

  it('does not throw when clipboard API fails', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Clipboard denied'))

    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
    })

    await wrapper.trigger('click')
    await vi.advanceTimersByTimeAsync(0)

    // Should not throw, should not emit copied
    expect(wrapper.emitted('copied')).toBeFalsy()
    expect(wrapper.text()).toContain('Copy')
  })

  it('applies custom className when provided', () => {
    const wrapper = mount(CopyButton, {
      props: {
        value: 'test',
        class: 'my-custom-class',
      },
    })

    expect(wrapper.classes()).toContain('my-custom-class')
  })

  it('has type="button" attribute for accessibility', () => {
    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
    })

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('provides isCopied via scoped slot', async () => {
    let capturedIsCopied: boolean | undefined

    const wrapper = mount(CopyButton, {
      props: { value: 'test' },
      slots: {
        default: (scope: { isCopied: boolean }) => {
          capturedIsCopied = scope.isCopied
          return scope.isCopied ? 'yes' : 'no'
        },
      },
    })

    expect(capturedIsCopied).toBe(false)
    expect(wrapper.text()).toContain('no')

    await wrapper.trigger('click')
    await vi.advanceTimersByTimeAsync(0)

    expect(capturedIsCopied).toBe(true)
    expect(wrapper.text()).toContain('yes')
  })
})
