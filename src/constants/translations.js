export const TRANSLATIONS = {
    en: {
        nav_home: 'Home',
        nav_planner: 'Planner',
        nav_shopping: 'Shopping',
        nav_recipes: 'Recipes',
        nav_settings: 'Settings',

        settings_title: 'App Settings',
        settings_theme: 'Theme Selection',
        settings_theme_desc: 'Choose the look and feel of your meal planner.',

        home_greeting: 'Good Morning!',
        home_summary: "Here's your summary for {day}.",
        home_todays_menu: "Today's Menu",
        home_edit_plan: 'Edit Plan',
        home_ingredients_title: "Today's Ingredients",
        home_no_ingredients: "No ingredients needed for today.",
        home_shopping_status: 'Shopping Status',
        home_keep_stocked: 'Keep your fridge stocked!',
        home_items_needed: 'Items Needed',
        home_view_list: 'View Shopping List',
        home_not_planned: 'Not planned',
        home_no_recipe: 'No recipe available.',
        home_no_meal: 'No meal planned',

        shopping_title: 'Shopping List',
        shopping_clear: 'Clear Purchased',

        recipes_title: 'Recipe Book',
        recipes_add: 'Add Recipe',
        recipes_new_title: 'New Recipe',
        recipes_name_placeholder: 'Recipe Name (e.g., Kimchi Stew)',
        recipes_ingredients_placeholder: 'Ingredients (comma separated)',
        recipes_instructions_placeholder: 'Cooking Instructions...',
        recipes_cancel: 'Cancel',
        recipes_save: 'Save Recipe',
        recipes_empty: 'No recipes yet. Add your favorites!',

        // Days
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
        Sunday: 'Sunday',

        // Meal Types
        Breakfast: 'Breakfast',
        Lunch: 'Lunch',
        Dinner: 'Dinner'
    },
    ko: {
        nav_home: '홈',
        nav_planner: '식단표',
        nav_shopping: '장보기',
        nav_recipes: '레시피',
        nav_settings: '설정',

        settings_title: '앱 설정',
        settings_theme: '테마 선택',
        settings_theme_desc: '나만의 스타일로 식단표를 꾸며보세요.',

        home_greeting: '좋은 아침입니다!',
        home_summary: "{day} 요약입니다.",
        home_todays_menu: "오늘의 식단",
        home_edit_plan: '식단 수정',
        home_ingredients_title: "오늘의 재료",
        home_no_ingredients: "오늘은 필요한 재료가 없습니다.",
        home_shopping_status: '장보기 현황',
        home_keep_stocked: '냉장고를 채워보세요!',
        home_items_needed: '구매할 품목',
        home_view_list: '장보기 목록 확인',
        home_not_planned: '계획 없음',
        home_no_recipe: '조리법이 없습니다.',
        home_no_meal: '식단 없음',

        shopping_title: '장보기 목록',
        shopping_clear: '구매 완료 항목 삭제',

        recipes_title: '나만의 레시피',
        recipes_add: '레시피 추가',
        recipes_new_title: '새 레시피',
        recipes_name_placeholder: '레시피 이름 (예: 김치찌개)',
        recipes_ingredients_placeholder: '재료 (쉼표로 구분)',
        recipes_instructions_placeholder: '조리법을 입력하세요...',
        recipes_cancel: '취소',
        recipes_save: '저장',
        recipes_empty: '아직 레시피가 없습니다. 좋아하는 레시피를 추가해보세요!',

        // Days
        Monday: '월요일',
        Tuesday: '화요일',
        Wednesday: '수요일',
        Thursday: '목요일',
        Friday: '금요일',
        Saturday: '토요일',
        Sunday: '일요일',

        // Meal Types
        Breakfast: '아침',
        Lunch: '점심',
        Dinner: '저녁'
    }
};

export const t = (key, language = 'en', params = {}) => {
    let text = TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;

    // Replace params like {day}
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
};
