import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import Article from '../index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-article',
    type: 'md',
    content: '# 标题\n\n正文',
    ...overrides,
  };
}

/** jsdom 无布局,scrollHeight 恒 0;直接打桩模拟内容自然高度 */
function stubScrollHeight(wrapper: ReturnType<typeof mount>, value: number) {
  const body = wrapper.find('[data-slot="article-body"]').element.parentElement!;
  Object.defineProperty(body, 'scrollHeight', { configurable: true, value });
}

async function triggerMeasure() {
  window.dispatchEvent(new Event('resize'));
  await nextTick();
}

describe('Article 展开按钮溢出门控', () => {
  test('无 maxHeight → 无展开按钮', () => {
    const wrapper = mount(Article, { props: createProps() });
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(false);
  });

  test('内容未超上限 → 不戴帽且无按钮(宿主注入默认值不致短文章挂死钮)', async () => {
    const wrapper = mount(Article, { props: createProps({ maxHeight: '300px' }) });
    await nextTick();
    stubScrollHeight(wrapper, 120);
    await triggerMeasure();
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(false);
    const body = wrapper.find('[data-slot="article-body"]').element.parentElement!;
    expect((body as HTMLElement).style.maxHeight).toBe('');
  });

  test('内容超上限 → 戴帽且出现展开按钮', async () => {
    const wrapper = mount(Article, { props: createProps({ maxHeight: '300px' }) });
    await nextTick();
    stubScrollHeight(wrapper, 1000);
    await triggerMeasure();
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(true);
    const body = wrapper.find('[data-slot="article-body"]').element.parentElement!;
    expect((body as HTMLElement).style.maxHeight).toBe('300px');
  });

  test('展开后移除戴帽且保留按钮(折叠出口不丢)', async () => {
    const wrapper = mount(Article, { props: createProps({ maxHeight: '300px' }) });
    await nextTick();
    stubScrollHeight(wrapper, 1000);
    await triggerMeasure();
    await wrapper.find('[data-slot="expand-button"]').trigger('click');
    const body = wrapper.find('[data-slot="article-body"]').element.parentElement!;
    expect((body as HTMLElement).style.maxHeight).toBe('');
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(true);
  });

  test('vh 上限按视口换算(40vh × 1000px 视口 = 400px)', async () => {
    const wrapper = mount(Article, { props: createProps({ maxHeight: '40vh' }) });
    await nextTick();
    // jsdom innerHeight 默认 768,40vh ≈ 307px;桩 120 < 307 → 不戴帽
    stubScrollHeight(wrapper, 120);
    await triggerMeasure();
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(false);
    stubScrollHeight(wrapper, 1000);
    await triggerMeasure();
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(true);
  });

  test('未知单位(%)→ 回退恒戴帽旧行为', async () => {
    const wrapper = mount(Article, { props: createProps({ maxHeight: '50%' }) });
    await nextTick();
    await triggerMeasure();
    expect(wrapper.find('[data-slot="expand-button"]').exists()).toBe(true);
    const body = wrapper.find('[data-slot="article-body"]').element.parentElement!;
    expect((body as HTMLElement).style.maxHeight).toBe('50%');
  });
});
