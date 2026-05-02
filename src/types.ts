
export type HealthCondition = 'Dengue' | 'Malaria' | 'Typhoid' | 'Common Cold' | 'Flu' | 'Other';

export interface MedicineAnalysis {
  isCounterfeit: boolean;
  confidence: number;
  reasoning: string;
  drugName?: string;
  batchInfo?: string;
  warnings?: string[];
}

export interface DiagnosisResult {
  condition: HealthCondition;
  summary: string;
  recommendations: string[];
  severity: 'Low' | 'Medium' | 'High';
}

export interface MealPlan {
  condition: string;
  foodsToInclude: string[];
  foodsToAvoid: string[];
  sampleMealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
}
