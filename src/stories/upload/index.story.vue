<script setup lang="ts">
import { Upload } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import type { UploadedFile } from '@lionad/vtu-components';

const textTitle = useStoryLocale({ zh: '上传附件', en: 'Attachments' })
const cardTitle = useStoryLocale({ zh: '上传图片', en: 'Images' })

// 演示用传输:延迟模拟网络;文件名带 fail 固定拒绝,便于点出错误与重试路径
async function mockUpload(file: File): Promise<UploadedFile> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  if (/fail/i.test(file.name)) {
    throw new Error(currentFailMessage())
  }
  return { name: file.name, size: file.size, url: URL.createObjectURL(file) }
}

function currentFailMessage(): string {
  return /zh/i.test(navigator.language) ? '模拟的上传失败' : 'Simulated upload failure'
}
</script>

<template>
  <Story title="Upload">
    <Variant title="文本形态 / Text">
      <p class="mb-3 text-xs text-muted-foreground">文件名含 "fail" 时模拟失败（可观察错误与重试）/ Files named "fail" simulate errors (retry path)</p>
      <div class="w-full max-w-md">
        <upload
          id="upload-text"
          :title="textTitle"
          :upload="mockUpload"
          :accept="['.pdf', '.doc', '.docx', '.png', '.jpg']"
          :max-size="5"
          :limit="3"
          multiple
        />
      </div>
    </Variant>

    <Variant title="卡片形态 / Picture Card">
      <div class="w-full max-w-md">
        <upload
          id="upload-card"
          :title="cardTitle"
          variant="picture-card"
          :upload="mockUpload"
          :accept="['.png', '.jpg', '.jpeg', '.webp']"
          :max-size="5"
          :limit="4"
          multiple
        />
      </div>
    </Variant>
  </Story>
</template>
