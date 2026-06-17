import { config } from '../config.js';
import type { Platform, TopicResult } from '../types.js';

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

const PLATFORM_LABELS: Record<Platform, string> = {
  douyin: '抖音',
  xiaohongshu: '小红书',
  kuaishou: '快手',
  bilibili: '哔哩哔哩',
};

const STYLE_TAGS = [
  '悬念式', '痛点式', '反差式', '热点借势',
  '情感共鸣', '数据震撼', '干货前置', '挑战互动',
  '人设代入', '反直觉',
];

function buildPrompt(platform: Platform, userTopic?: string): string {
  const label = PLATFORM_LABELS[platform];
  const topicInstruction = userTopic
    ? `所有主题围绕"${userTopic}"这个方向展开`
    : '主题要覆盖当前热门方向，方向不限';

  return `你是一个爆款短视频主题策划专家。请为${label}平台生成10个爆款视频主题。

要求：
- 每个主题包含：标题文案(title)、风格标签(style_tag)、点击欲评分(score)、推荐理由(reason)
- 10个主题必须覆盖不同的风格
- 风格标签从以下列表中选用：${STYLE_TAGS.join('、')}
- 标题要符合${label}平台的内容调性和用户偏好
- 评分1-10，要有区分度，避免全是高分
- ${topicInstruction}
- 风格标签只从列表中选择，不要自创新词

请严格按以下JSON格式返回，不要包含其他文字：
{"topics": [{"title": "...", "style_tag": "...", "score": 7, "reason": "..."}]}`;
}

export async function generateTopics(
  platform: Platform,
  userPrompt?: string
): Promise<TopicResult[]> {
  if (!config.deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY 未配置');
  }

  const response = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.deepseekApiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一个专业的爆款短视频内容策划专家。请严格按照JSON格式输出。' },
        { role: 'user', content: buildPrompt(platform, userPrompt) },
      ],
      temperature: 1.0,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`DeepSeek API 错误 (${response.status}): ${errText}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('DeepSeek 返回内容为空');
  }

  // Extract JSON from response (handle potential markdown fences)
  const jsonStr = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(jsonStr);

  if (!parsed.topics || !Array.isArray(parsed.topics) || parsed.topics.length !== 10) {
    throw new Error('AI 响应格式异常：主题数量不为10');
  }

  // Validate each topic
  for (const t of parsed.topics) {
    if (!t.title || !t.style_tag || typeof t.score !== 'number' || !t.reason) {
      throw new Error('AI 响应格式异常：主题字段不完整');
    }
  }

  return parsed.topics as TopicResult[];
}
