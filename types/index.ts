export type IssueCategory = 
  | 'graffiti'
  | 'pothole'
  | 'encampment'
  | 'drug_use'
  | 'trash'
  | 'broken_streetlight'
  | 'abandoned_vehicle'
  | 'other'
  | 'infrastructure' // From flow 01
  | 'illegal_dumping'; // From flow 02

// Data Schema Model: User Profile
export interface UserProfile {
  id: string; // uuid_v4
  handle: string;
  trust_score: number; // float 0.0 - 1.0
  impact_credits: number; // integer
  linked_channels: string[]; // ["311_API", "NEXTDOOR_OAUTH", etc]
}

// Data Schema Model: Incident Report
export interface IncidentReport {
  id: string; // uuid_v4
  media_assets: {
    url: string;
    type: 'image' | 'video';
    ai_tags: string[]; // ["asphalt", "hole", "hazard"]
  }[];
  ai_analysis: {
    primary_category: IssueCategory;
    confidence_score: number;
    suggested_severity: 'low' | 'medium' | 'high' | 'urgent';
    auto_description: string;
  };
  location: {
    lat: number;
    long: number;
    geohash: string;
    jurisdiction_id: string;
    address?: string; // Optional helper
  };
  status_lifecycle: {
    current: 'draft' | 'dispatched' | 'verified' | 'resolved';
    dispatch_log: {
      channel: string; // "311", "Nextdoor"
      external_id: string;
      status: string; // "received", "posted"
    }[];
  };
  gamification: {
    base_iss: number; // Impact Severity Score
    community_multiplier: number;
    total_impact_yield: number;
  };
  timestamp: number; // For sorting
}

// Keeping legacy types for compatibility during migration if needed, 
// or aliasing them to new types
export type Report = IncidentReport; 
