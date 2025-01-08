// lib/poetry-functions.ts
export const analyzePoetry = async (text: string, mode: string): Promise<string> => {
  try {
    // 테스트를 위한 간단한 응답
    switch(mode) {
      case "rhyme":
        return `운율 분석 결과:\n입력하신 시 "${text}"의 운율을 분석해보겠습니다.\n- 음절 수: ${text.length}개\n- 특징: 흐르는 듯한 리듬감이 느껴집니다.`;
        
      case "word":
        return `"${text}"와 관련된 단어들:\n- 유의어: 월광, 달무리, 달빛\n- 반의어: 햇빛, 태양\n- 시적 표현: 은은한 달빛, 달빛 물결`;
        
      case "season":
        const seasonWords = {
          "봄": "벚꽃, 진달래, 새싹, 봄비, 꺾바람",
          "여름": "매미, 장마, 녹음, 달빛, 해바라기",
          "가을": "단풍, 추수, 은행, 감나무, 서리",
          "겨울": "눈송이, 한파, 동장군, 겨울잠, 난로"
        };
        return `"${text}" 계절의 대표적인 말들:\n${seasonWords[text] || "봄/여름/가을/겨울 중에서 선택해주세요."}`;
        
      default:
        return "죄송합니다. '운율:', '단어:', '계절:' 형식으로 입력해주세요.";
    }
  } catch (error) {
    console.error('Poetry analysis error:', error);
    return "죄송합니다. 분석 중 오류가 발생했습니다. 다시 시도해주세요.";
  }
};