# **Smart Meal Planner PRD (product Requirements Document)**

## **React Final Version (v1.0)**

## **1. 개요**

**Smart Meal Planner**는 사용자 친화적인 인터페이스와 AI 기술을 결합한 지능형 식단 관리 웹 애플리케이션입니다. 별도의 백엔드 서버 없이 React와 LocalStorage를 활용하여 데이터를 관리하며, Google Gemini AI와 Unsplash API를 통해 풍부한 시각적 경험과 지능형 서비스를 제공합니다.

### **핵심 가치 제안**

*   **편의성**: 드래그 앤 드롭으로 손쉽게 식단을 계획하고 수정할 수 있습니다.
*   **시각화**: AI가 메뉴에 어울리는 이미지를 자동으로 찾아주어 식단표를 보기 즐겁게 만듭니다.
*   **지능형 장보기**: 식단에 등록된 재료를 자동으로 합산하고 정리하여 스마트한 장보기 목록을 생성합니다.
*   **AI 코칭**: 작성된 식단을 AI 영양사가 분석하여 실용적인 조언을 제공합니다.

## **2. 타겟 사용자**

### **주 사용자**

*   **효율을 중시하는 1인 가구**: 장보기 목록 작성 시간을 줄이고 싶은 사람.
*   **비주얼을 중요하게 생각하는 사용자**: 텍스트만 있는 딱딱한 식단표보다 예쁜 앱을 선호하는 사람.
*   **건강 관리에 관심 있는 사람**: 자신의 식단 영양 상태를 간편하게 확인하고 싶은 사람.

### **페인포인트**

*   식단을 짜도 장보기 목록을 다시 적는 것이 번거로움.
*   내 식단의 영양 밸런스가 맞는지 모름.
*   복잡한 회원가입이나 서버 연동 없이 가볍게 쓰고 싶음.

## **3. 핵심 기능 (Features)**

### **P0 - 필수 기능 (MVP 범위 + 안정화)**

| 기능 | 설명 | 기술적 포인트 | 구현 난이도 |
| :---- | :---- | :---- | :---- |
| **식단 캘린더** | 7일(월~일) 아침/점심/저녁 메뉴 CRUD | State Array, Context API | ⭐⭐ |
| **스마트 장보기 목록** | 식단에 등록된 재료 자동 합산, 중복 제거, 구매 체크 및 숨김, 대체 재료 필터링 | useMemo, Regex Cleaning | ⭐⭐⭐⭐⭐ |
| **데이터 영속성** | 새로고침 해도 데이터 유지 (LocalStorage) | custom hook (useLocalStorage) | ⭐ |
| **AI 메뉴 자동 완성** | 메뉴명 입력 시 재료, 레시피, 영양 정보 자동 생성 | Gemini API (JSON Response) | ⭐⭐⭐ |

### **P1 - 고도화 기능 (현재 구현 완료)**

| 기능 | 설명 | 기술적 포인트 | 구현 난이도 |
| :---- | :---- | :---- | :---- |
| **드래그 앤 드롭** | 식단 카드를 자유롭게 이동 (요일/시간 변경) | @dnd-kit/core | ⭐⭐⭐⭐ |
| **AI 이미지 생성** | 메뉴에 어울리는 고화질 음식 이미지 자동 검색 및 캐싱 | Unsplash API, LocalStorage | ⭐⭐⭐ |
| **AI 영양 분석** | 주간 식단을 분석하여 영양 평가 및 조언 제공 | Gemini API (Prompt Engineering) | ⭐⭐ |
| **개인화 설정** | 다크 모드 등 테마 변경, 다국어(한/영) 지원 | CSS Variables, i18n | ⭐⭐ |

## **4. 기술 스택 (Tech Stack)**

### **프론트엔드 프레임워크**

*   **React 18+**: 함수형 컴포넌트 및 Hooks 위주 (Context API 활용)
*   **Vite**: 빠른 빌드 및 HMR 지원
*   **Tailwind CSS**: Glassmorphism 디자인 시스템 적용, 반응형 UI

### **상태 관리 및 로직**

*   **React Context API**: 전역 상태(식단, 설정, 장보기) 관리
*   **Hooks**: `useMemo`(성능 최적화), `useLocalStorage`(데이터 저장), `useEffect`(사이드 이펙트)

### **외부 라이브러리 & API**

| 라이브러리 | 용도 |
| :---- | :---- |
| **Google Gemini API** | 메뉴 정보 생성, 식단 영양 분석 |
| **Unsplash API** | 고화질 음식 이미지 검색 |
| **@dnd-kit** | 식단 카드 드래그 앤 드롭 구현 |
| **Lucide React** | 모던한 UI 아이콘 |
| **uuid** | 고유 ID 생성 |

### **데이터 저장**

*   **LocalStorage**: 브라우저 내부에 JSON 형태로 식단, 설정, 이미지 캐시 영구 저장

## **5. 프로젝트 구조 (Component Based)**

```
smart-meal-planner/
├── src/
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── MealSlot.jsx        # 개별 식사 카드 (드래그, AI 생성, 이미지)
│   │   ├── WeekView.jsx        # 주간 달력 컨테이너
│   │   ├── AISuggestion.jsx    # AI 영양 분석 모달
│   │   └── Layout.jsx          # 전체 레이아웃 (네비게이션 포함)
│   ├── context/          # 전역 상태 관리
│   │   └── MealContext.jsx     # 식단, 장보기, 설정 로직 통합
│   ├── hooks/            # 커스텀 훅
│   │   └── useLocalStorage.js  # 데이터 저장 훅
│   ├── pages/            # 라우트 페이지
│   │   ├── Home.jsx            #대시보드 (오늘의 메뉴, 요약)
│   │   ├── Planner.jsx         # 식단표 (드래그 앤 드롭)
│   │   ├── Shopping.jsx        # 장보기 목록
│   │   └── Settings.jsx        # 설정 (테마, 언어)
│   ├── utils/            # 유틸리티 함수
│   │   ├── api.js              # Gemini API 호출 및 프롬프트 관리
│   │   └── image.js            # Unsplash API 호출
│   └── App.jsx           # 라우팅 설정
```

## **6. API 통합 전략**

### **Gemini API (AI Intelligence)**
*   **메뉴 생성**: 사용자가 "김치볶음밥" 입력 -> 재료(김치, 밥...), 레시피, 영양소, 영문 키워드("Kimchi Fried Rice") 반환.
*   **영양 분석**: 주간 식단 리스트 전송 -> 영양학적 총평 및 개선 팁 반환.
*   **재료 정제**: (필요 시) 복잡한 재료 목록을 정규화하여 깔끔한 리스트로 변환.

### **Unsplash API (Visuals)**
*   **이미지 검색**: Gemini가 생성한 영문 키워드를 사용해 정확도 높은 음식 사진 검색.
*   **캐싱 전략**: 과도한 API 호출 방지를 위해 가져온 이미지 URL을 식단 데이터에 저장(캐싱).

## **7. 데이터 모델 (Client-Side)**

### **Meal Object**
```json
{
  "id": "uuid-v4",
  "day": "Monday",
  "type": "Lunch",
  "menuName": "Kimchi Fried Rice",
  "ingredients": ["Kimchi", "Rice", "Spam"],
  "recipe": "1. Fry Kimchi...",
  "nutrition": {
      "calories": "500kcal",
      "carbs": "60g",
      "protein": "20g"
  },
  "imageUrl": "https://images.unsplash.com/...",
  "imageKeywords": "Kimchi Fried Rice"
}
```

### **Derived State (Aggregated Ingredients)**
*   `MealContext`에서 실시간으로 계산되며, 중복 제거/합산 및 필터링(숨김/체크) 로직 적용.

## **8. 사용자 스토리 (User Stories)**

### **US-001: 식단 계획 및 관리**
*   **As a** 사용자
*   **I want to** 주간 식단표에서 원하는 요일에 메뉴를 드래그하여 옮기고
*   **So that** 급하게 일정이 바뀔 때 식단을 유연하게 수정할 수 있다.

### **US-002: 스마트 장보기**
*   **As a** 사용자
*   **I want to** 식단에 있는 재료들 중 '소금', '후추' 같은 기본 양념이나 '선택사항'은 자동으로 제외되고
*   **So that** 정말 사야 할 핵심 식재료만 깔끔하게 보고 싶다.

### **US-003: AI 시각화 및 분석**
*   **As a** 사용자
*   **I want to** 메뉴 이름만 적어도 사진과 영양 정보가 자동으로 뜨고, 내 식단 점수를 알고 싶어서
*   **So that** 더 즐겁고 건강하게 식단을 관리할 수 있다.

## **9. 향후 로드맵 (Roadmap)**

1.  **Phase 1 (완료)**: 기본 식단 관리, AI 연동(메뉴/이미지), 장보기 목록, 테마/다국어.
2.  **Phase 2 (예정)**: PWA(앱 설치), 소셜 공유 기능, 데이터 백업/복원.