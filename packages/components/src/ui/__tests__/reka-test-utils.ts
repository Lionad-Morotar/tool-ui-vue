import { flushPromises } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';

// jsdom 未实现 Pointer Capture API,而 reka-ui trigger 的 pointerdown 分支直接调用,
// 不补空实现时打开浮层的交互路径在测试环境抛 TypeError;幂等,可经 beforeAll 重复安装
export function installPointerCaptureShim() {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.releasePointerCapture = () => undefined;
  }
}

// jsdom 未实现 scrollIntoView,而 reka Listbox 挂载即 highlight 首项并调用它,
// 不补空实现时任何挂载 Listbox 的组件树在 nextTick 回调抛 TypeError;幂等
export function installScrollIntoViewShim() {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => undefined;
  }
}

// 浮层开关闭跨 nextTick、Promise(floating-ui 定位)与 setTimeout(Presence 退场)三级调度,
// 单次 flushPromises 等不到最终态
export async function settle() {
  await flushPromises();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await flushPromises();
}

// 完整点击序列:按下后先等浮层挂载(reka 才武装 document 级 once pointerup 监听),
// 随后这次松开用于消耗该监听
// 宿主 wrapper 必须 attachTo document:悬空挂载时 trigger 事件冒泡不到 document,
// 该监听会残留并把后续选项的 pointerup preventDefault,选中静默失效
export async function openSelect(wrapper: VueWrapper) {
  const trigger = wrapper.find('[data-testid="select-trigger"]');
  await trigger.trigger('pointerdown');
  await settle();
  await trigger.trigger('pointerup');
  await settle();
}

// SelectContent 经 Portal 落到 document.body,VTU wrapper 的子树查询够不到浮层
export function querySelectContent() {
  return document.body.querySelector('[data-testid="select-content"]');
}

export function querySelectItems() {
  return Array.from(document.body.querySelectorAll('[data-testid="select-item"]'));
}

// reka NumberField 的增减按钮是 pointerdown 按住连发语义(usePressedHold),
// 且监听经 vueuse useEventListener 以 flush:post 注册——mount 后须先 settle
// 等注册完成再派发,否则事件落在注册前的空窗静默丢失。
// VTU trigger 无法构造带 button 的 pointer 事件(createDOMEvent 对只读 getter 赋值抛错),
// 须原生 dispatchEvent;pointerup 必派——连发计时器不清会跨用例漏。
export function pointerPress(element: Element) {
  element.dispatchEvent(new MouseEvent('pointerdown', { button: 0, bubbles: true }));
  window.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
}
