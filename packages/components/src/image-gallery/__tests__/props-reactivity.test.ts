import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import ImageGallery from '../index.vue';

// props 响应式契约：images 以新引用增长时网格必须跟随重渲染。
// context 若在 setup 同步作用域以 ref(值) 固化首帧数组，网格会停在初始张数。

function makeImages(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    src: `https://example.com/${i + 1}.jpg`,
    alt: `Image ${i + 1}`,
    width: 400,
    height: 400,
  }));
}

describe('ImageGallery props 响应式', () => {
  test('images 以新引用增长时网格项跟随更新', async () => {
    const wrapper = mount(ImageGallery, {
      props: { id: 'ig-reactive', images: makeImages(1) },
    });
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(1);

    await wrapper.setProps({ images: makeImages(2) });
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(2);

    await wrapper.setProps({ images: makeImages(3) });
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(3);
  });
});
