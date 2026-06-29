export interface Job {
  id: string;
  titleFr: string;
  titleEn: string;
  type: "full-time" | "part-time" | "contract" | "intern";
  location: string;
  descriptionFr: string;
  descriptionEn: string;
}

// Editable list — currently empty (pre-launch)
// Add jobs here and they'll automatically appear on the Careers page
export const jobs: Job[] = [];
