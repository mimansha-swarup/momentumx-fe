import { baseFetch } from "@/utils/network";
import {
  GenerateTitleResponse,
  GenerateDescriptionResponse,
  GenerateThumbnailResponse,
  GenerateHooksResponse,
  GenerateShortsResponse,
  SavePackagingResponse,
  GetPackagingResponse,
  IHooks,
  ITimestampedSegment,
} from "@/types/feature/packaging";

const URLS = {
  generateTitle: "/v1/packaging/generate-title",
  generateDescription: "/v1/packaging/generate-description",
  generateThumbnail: "/v1/packaging/generate-thumbnail",
  generateHooks: "/v1/packaging/generate-hooks",
  generateShorts: "/v1/packaging/generate-shorts",
  save: "/v1/packaging/save",
  get: "/v1/packaging/{{packagingId}}",
};

class PackagingService {
  private urls;

  constructor() {
    this.urls = URLS;
  }

  async generateTitle(script: string): Promise<GenerateTitleResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.post(this.urls.generateTitle, { script });
    // return response.data;

    // Simulated response for development
    await this.simulateDelay();
    return {
      title: "10 Productivity Hacks That Will Transform Your Morning Routine",
      characterCount: 62,
    };
  }

  async generateDescription(
    script: string,
    title?: string
  ): Promise<GenerateDescriptionResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.post(this.urls.generateDescription, { script, title });
    // return response.data;

    await this.simulateDelay();
    return {
      description: `In this episode, we dive deep into the science-backed strategies that successful people use to supercharge their mornings. From the power of cold showers to the magic of time-blocking, discover actionable tips you can implement today.

What you'll learn:
• The 5-minute rule that eliminates procrastination
• Why your phone is sabotaging your productivity
• The breakfast myth that's holding you back
• How to create an evening routine that sets up tomorrow's success

Whether you're a night owl trying to become an early bird or just looking to optimize your existing routine, this episode is packed with practical wisdom from top performers across industries.

Don't forget to subscribe and hit the notification bell for more productivity content!

#productivity #morningroutine #selfimprovement #podcast`,
      characterCount: 847,
    };
  }

  async generateThumbnail(
    script: string,
    title?: string
  ): Promise<GenerateThumbnailResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.post(this.urls.generateThumbnail, { script, title });
    // return response.data;

    await this.simulateDelay();
    return {
      thumbnailDescription: `Design a bold thumbnail with:
- Split composition: left side dark (night/tired), right side bright (energetic morning)
- Large text overlay: "MORNING HACKS" in bold yellow/orange gradient
- Subtitle: "10 Tips" in white
- Host photo with energetic expression, arms raised
- Clock icon showing 5:00 AM
- Color palette: Deep purple background transitioning to sunrise orange
- Add subtle productivity icons (coffee, checklist, sun)`,
      characterCount: 412,
    };
  }

  async generateHooks(script: string): Promise<GenerateHooksResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.post(this.urls.generateHooks, { script });
    // return response.data;

    await this.simulateDelay();
    return {
      openingLine:
        "What if I told you that the first 30 minutes of your day determines the next 23 and a half hours?",
      patternInterrupt:
        "Now, forget everything you've heard about waking up at 5 AM. Here's what actually matters...",
      ctaHook:
        "If you're tired of feeling tired, smash that subscribe button and let's fix your mornings together.",
    };
  }

  async generateShorts(
    script: string,
    variant: number = 0,
    maxDuration: number = 60
  ): Promise<GenerateShortsResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.post(this.urls.generateShorts, { script, maxDuration, variant });
    // return response.data;

    await this.simulateDelay();

    // Different variations for demo purposes
    const variations = [
      {
        segments: [
          { startTime: "0:00", endTime: "0:05", content: "Stop scrolling and listen. Your morning routine is broken.", type: "hook" as const },
          { startTime: "0:05", endTime: "0:20", content: "The biggest productivity mistake? Checking your phone first thing. Instead, do this: spend 5 minutes writing down your top 3 priorities for the day.", type: "point" as const },
          { startTime: "0:20", endTime: "0:40", content: "Here's the game-changer: the 2-minute rule. If something takes less than 2 minutes, do it immediately. This alone cleared 80% of my mental clutter.", type: "point" as const },
          { startTime: "0:40", endTime: "0:55", content: "And the secret sauce? A glass of water before coffee. Sounds simple, but it boosts your energy by 30%.", type: "transition" as const },
          { startTime: "0:55", endTime: "1:00", content: "Follow for more productivity hacks that actually work.", type: "cta" as const },
        ],
        totalDuration: "1:00",
      },
      {
        segments: [
          { startTime: "0:00", endTime: "0:08", content: "I wasted 10 years of mornings. Here's what finally worked.", type: "hook" as const },
          { startTime: "0:08", endTime: "0:25", content: "Rule #1: No decisions before breakfast. Lay out your clothes, prep your meals, plan your day the night before.", type: "point" as const },
          { startTime: "0:25", endTime: "0:45", content: "Rule #2: Move your body within 10 minutes of waking. Even 5 jumping jacks rewires your brain for energy.", type: "point" as const },
          { startTime: "0:45", endTime: "0:55", content: "Rule #3: Protect your first hour. No emails, no social media, no news.", type: "transition" as const },
          { startTime: "0:55", endTime: "1:00", content: "Save this and thank me later.", type: "cta" as const },
        ],
        totalDuration: "1:00",
      },
      {
        segments: [
          { startTime: "0:00", endTime: "0:06", content: "CEOs don't have more time than you. They have better mornings.", type: "hook" as const },
          { startTime: "0:06", endTime: "0:22", content: "The secret? Time-blocking. Every minute of your morning should have a purpose. Wake up, hydrate, move, think, then work.", type: "point" as const },
          { startTime: "0:22", endTime: "0:40", content: "Most people check their phone and react to other people's priorities. Winners create their own agenda first.", type: "point" as const },
          { startTime: "0:40", endTime: "0:52", content: "Start tomorrow: set one non-negotiable morning goal. Just one.", type: "transition" as const },
          { startTime: "0:52", endTime: "1:00", content: "Follow for the complete morning CEO playbook.", type: "cta" as const },
        ],
        totalDuration: "1:00",
      },
      {
        segments: [
          { startTime: "0:00", endTime: "0:07", content: "Your morning coffee is lying to you. Here's why.", type: "hook" as const },
          { startTime: "0:07", endTime: "0:25", content: "Cortisol peaks naturally 30 minutes after waking. Drinking coffee immediately actually blocks this natural energy boost.", type: "point" as const },
          { startTime: "0:25", endTime: "0:42", content: "Wait 90 minutes before your first cup. Use that time for deep work when your brain is naturally sharpest.", type: "point" as const },
          { startTime: "0:42", endTime: "0:53", content: "I tried this for 30 days. My focus increased by 40% and I stopped crashing at 2pm.", type: "transition" as const },
          { startTime: "0:53", endTime: "1:00", content: "Try it tomorrow. Comment your results below.", type: "cta" as const },
        ],
        totalDuration: "1:00",
      },
      {
        segments: [
          { startTime: "0:00", endTime: "0:05", content: "The 5-4-3-2-1 method changed my life.", type: "hook" as const },
          { startTime: "0:05", endTime: "0:20", content: "When your alarm goes off, count backwards: 5, 4, 3, 2, 1, and launch yourself out of bed. No negotiating with your brain.", type: "point" as const },
          { startTime: "0:20", endTime: "0:38", content: "Your brain will always choose comfort. The countdown interrupts the habit loop and activates your prefrontal cortex.", type: "point" as const },
          { startTime: "0:38", endTime: "0:52", content: "Combine this with putting your phone across the room. You'll never hit snooze again.", type: "transition" as const },
          { startTime: "0:52", endTime: "1:00", content: "Share this with someone who needs it.", type: "cta" as const },
        ],
        totalDuration: "1:00",
      },
    ];

    return variations[variant % variations.length];
  }

  async savePackaging(data: {
    script: string;
    title: string;
    description: string;
    thumbnailDescription: string;
    hooks: IHooks;
    shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
  }): Promise<SavePackagingResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.post(this.urls.save, data);
    // return response.data;

    await this.simulateDelay();
    return {
      packagingId: `pkg_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
  }

  async getPackaging(packagingId: string): Promise<GetPackagingResponse> {
    // TODO: Implement API call when backend is ready
    // const response = await baseFetch.get(this.urls.get.replace("{{packagingId}}", packagingId));
    // return response.data;

    await this.simulateDelay();
    throw new Error("Not implemented");
  }

  private simulateDelay(ms: number = 1500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const packagingService = new PackagingService();
