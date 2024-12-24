import { HfInference } from '@huggingface/inference'

// 더 작고 안정적인 모델들
const MODELS = [
  "paust/pko-t5-base",
  "nlpai-lab/kullm-polyglot-12.8b-v2",
  "maywell/KoGPT-2-Base",
  "kykim/gpt3-kor-small_based_on_gpt2"
];

export const enhancePoem = async (
  text: string, 
  onProgress?: (text: string) => void,
  signal?: AbortSignal
) => {
  try {
    const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

    if (onProgress) {
      onProgress("분석을 시작합니다...");
    }

    for (const model of MODELS) {
      if (signal?.aborted) {
        throw new DOMException("분석이 중단되었습니다.", "AbortError");
      }

      try {
        if (onProgress) {
          onProgress(`${model} 모델로 분석 중...\n\n`);
        }

        const prompt = `시:
${text}

위 시를 다음 관점에서 분석해주세요:
- 주제와 의미
- 감정과 정서
- 시적 표현의 특징
- 개선할 점

분석:`;

        const response = await hf.request({
          model: model,
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2,
            do_sample: true
          }
        });

        if (response && response[0]?.generated_text) {
          const generatedText = response[0].generated_text
            .replace(prompt, '')
            .trim();

          if (generatedText.length > 30) {
            if (onProgress) {
              onProgress(generatedText);
            }
            return generatedText;
          }
        }

      } catch (error) {
        console.error(`${model} 시도 중 오류:`, error);
        if (error.response?.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        continue;
      }
    }

    throw new Error("현재 모든 모델이 응답하지 않습니다. 잠시 후 다시 시도해주세요.");

  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error("AI 분석 오류:", error);
    throw new Error(
      error.message.includes('rate limit') 
        ? "너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요."
        : "AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요."
    );
  }
};