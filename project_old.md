# **Smart Meal Planner PRD (Product Requirements Document)**

## **React MVP Version**

## **1\. 개요**

**Smart Meal Planner**는 별도의 백엔드 서버 없이 React의 상태 관리 능력만으로 동작하는 식단 관리 및 자동 장보기 리스트 생성 웹 애플리케이션입니다.

### **핵심 가치 제안**

* **문제**: 매번 무엇을 먹을지 고민하고, 식단에 따른 재료를 일일이 정리하기 귀찮음.  
* **해결책**: 식단만 입력하면 React 로직이 실시간으로 재료를 분석해 쇼핑 목록을 자동 생성.  
* **학습 목표**: Serverless 환경에서 React Hooks(useState, useMemo)와 LocalStorage를 활용한 고급 상태 관리 및 최적화 구현.

## **2\. 타겟 사용자**

### **주 사용자**

* 자취생 및 1인 가구 (효율적인 장보기 필요) 

### **페인포인트**

* 식단을 짜도 장보기 목록을 다시 적는 것이 번거로움.  
* 내 식단의 영양 밸런스가 맞는지 모름.  
* 복잡한 회원가입이나 서버 연동 없이 가볍게 쓰고 싶음.

## **3\. 핵심 기능 (MVP)**

### **P0 \- 필수 기능 (MVP 범위)**

| 기능 | 설명 | 기술적 포인트 | 구현 난이도 |
| :---- | :---- | :---- | :---- |
| 식단 캘린더 | 7일(월\~일) 아침/점심/저녁 메뉴 CRUD | State Array 관리 | ⭐⭐ |
| **재료 자동 집계** | **Gemini API를 활용해서 입력된 식단의 필요한 재료 자동 도출**생성된 재료를 실시간 합산 및 중복 제거 | useMemo, reduce | ⭐⭐⭐⭐⭐ |
| 데이터 영속성 | 새로고침 해도 데이터 유지 (LocalStorage) | useEffect | ⭐ |
| 장보기 체크 | 생성된 재료 목록의 구매 여부 토글 | State Update | ⭐ |

### **P1 \- 주요 기능 (추가 개발)**

| 기능 | 설명 | 기술적 포인트 | 구현 난이도 |
| :---- | :---- | :---- | :---- |
| AI 영양 코칭 | 현재 식단 데이터를 분석해 영양 조언 제공 | Gemini API (Async) | ⭐⭐ |
| 식단 초기화 | 이번 주 식단 및 재료 목록 전체 삭제 | State Reset | ⭐ |

## **4\. 기술 스택**

### **프론트엔드 프레임워크**

* **React 18+**: 함수형 컴포넌트 및 Hooks 위주  
* **Vite**: 빠른 빌드 및 HMR 지원  
* **Tailwind CSS**: 유틸리티 클래스로 빠른 스타일링

### **상태 관리 및 로직**

* **React Hooks**:  
  * useState: 식단 및 재료 데이터 관리  
  * useMemo: 재료 집계 연산 최적화 (핵심)  
  * useEffect: LocalStorage 동기화

### **외부 라이브러리 & API**

| 라이브러리 | 용도 |
| :---- | :---- |
| axios | Gemini API 비동기 통신 |
| lucide-react | UI 아이콘 (식사, 체크박스 등) |
| uuid | 각 메뉴 항목의 고유 ID 생성 |

### **데이터 저장**

* **LocalStorage**: 브라우저 내부에 JSON 형태로 식단 데이터 영구 저장

## **5\. 프로젝트 구조 (Component Based)**

smart-meal-planner/  
├── src/  
│   ├── components/  
│   │   ├── WeekView.jsx        \# 주간 달력 컨테이너  
│   │   ├── DayColumn.jsx       \# 요일별 컬럼  
│   │   ├── MealSlot.jsx        \# 개별 식사 카드 (아침/점심/저녁)  
│   │   ├── IngredientList.jsx  \# 자동 집계된 재료 목록 표시  
│   │   └── AISuggestion.jsx    \# AI 조언 표시 컴포넌트  
│   ├── hooks/  
│   │   └── useLocalStorage.js  \# 데이터 저장 커스텀 훅  
│   ├── utils/  
│   │   └── api.js              \# Gemini API 호출 로직  
│   └── App.jsx

## **6\. Gemini API 통합 전략 (P1)**

### **API 역할**

사용자가 입력한 일주일치 식단 데이터를 JSON 문자열로 받아, 영양학적 관점에서 부족한 점과 보완 팁을 제공.

### **프롬프트 설계 (System Prompt)**

* **역할**: 전문 영양사  
* **입력**: 주간 식단 메뉴 리스트 (JSON)  
* **출력**: 100자 이내의 간결한 텍스트. (예: "탄수화물 비중이 높습니다. 저녁에는 두부나 닭가슴살 샐러드를 추가해보세요.")

## **7\. 데이터 모델 (Client-Side)**

DB 없이 프론트엔드에서 관리할 데이터 구조입니다.

### **Main State (Meals)**

\[  
  {  
    "id": "uuid-1",  
    "day": "Monday",  
    "type": "Lunch",  
    "menuName": "김치볶음밥",  
    "ingredients": \["김치", "밥", "햄", "대파"\]  
  },  
  {  
    "id": "uuid-2",  
    "day": "Monday",  
    "type": "Dinner",  
    "menuName": "된장찌개",  
    "ingredients": \["된장", "두부", "애호박", "대파"\]  
  }  
\]

### **Derived State (Ingredients \- 자동 계산됨)**

*위 Main State가 변경될 때마다 useMemo로 자동 생성되는 읽기 전용 데이터*

\[  
  { "name": "김치", "count": 1, "checked": false },  
  { "name": "대파", "count": 2, "checked": false }, // 중복 합산됨  
  { "name": "두부", "count": 1, "checked": true }  
\]

## **8\. 사용자 스토리 (MVP 기준)**

### **US-001: 식단 추가 및 재료 입력**

* **As a** 사용자  
* **I want to** 월요일 점심 슬롯을 클릭하여 메뉴와 재료를 입력하고  
* **So that** 나의 식사 계획을 세울 수 있다.  
* **Acceptance Criteria**:  
  * \[ \] 빈 슬롯 클릭 시 입력 폼 활성화 (모달 또는 인라인).  
  * \[ \] 메뉴명과 재료(쉼표로 구분) 입력 가능.  
  * \[ \] 저장 시 화면에 즉시 반영 및 LocalStorage 업데이트.

### **US-002: 실시간 장보기 목록 확인**

* **As a** 사용자  
* **I want to** 식단을 추가하자마자 화면 하단에서 필요한 재료 목록을 보고  
* **So that** 별도로 메모할 필요 없이 장을 볼 수 있다.  
* **Acceptance Criteria**:  
  * \[ \] 메뉴 추가/수정 시 하단 장보기 목록이 즉시 갱신되어야 함.  
  * \[ \] 같은 재료(예: '대파')는 하나로 합쳐지고 수량이 표시되어야 함.

### **US-003: AI 영양 분석 요청 (P1)**

* **As a** 사용자  
* **I want to** 'AI 영양 분석' 버튼을 눌러 내 식단에 대한 조언을 듣고  
* **So that** 더 건강한 식단을 구성할 수 있다.  
* **Acceptance Criteria**:  
  * \[ \] 버튼 클릭 시 로딩 표시.  
  * \[ \] 분석 결과가 텍스트 형태로 사용자에게 표시.

## **9\. 로드맵 (개발 순서)**

1. **Week 1 (UI & State)**  
   * 프로젝트 세팅 (Vite, Tailwind).  
   * 레이아웃 잡기 (Calendar Grid, Sidebar).  
   * 기본 CRUD 로직 구현 (State에 메뉴 추가/삭제).  
2. **Week 2 (Logic & Storage)**  
   * useMemo를 활용한 재료 중복 제거 알고리즘 구현.  
   * useEffect를 활용한 LocalStorage 연동.  
   * 장보기 목록 체크박스 기능.  
3. **Week 3 (Async & Polish)**  
   * Gemini API 연동 및 비동기 처리.  
   * UI 디자인 다듬기 및 버그 수정.
