export interface IMealCount {
    totalMeal: number;
    upcoming?: number;
    delivered?: number;
    deliveredLunch?: number;
    deliveredDinner?: number;
    cancelled?: number;
}