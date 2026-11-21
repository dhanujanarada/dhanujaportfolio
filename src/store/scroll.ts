import { createStore } from "zustand/vanilla";

export type SectionMetrics = {
  id: string;
  top: number;
  height: number;
  progress: number;
};

export type ScrollSnapshot = {
  global: number;
  activeIndex: number;
  sections: SectionMetrics[];
};

const EMPTY: ScrollSnapshot = { global: 0, activeIndex: 0, sections: [] };

/**
 * Vanilla store written by the scroll engine, outside React. Nothing on the
 * frame path subscribes reactively: `useFrame` and the debug overlay read it
 * with `getState()`. Only `InvalidateOnScroll` subscribes, to wake the
 * demand-driven canvas.
 */
export const scrollStore = createStore<ScrollSnapshot>()(() => EMPTY);

export function setSectionMetrics(metrics: Omit<SectionMetrics, "progress">[]) {
  scrollStore.setState({
    sections: metrics.map((metric) => ({ ...metric, progress: 0 })),
  });
}

export function updateScroll(scrollTop: number, viewportHeight: number) {
  const { sections } = scrollStore.getState();
  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  const global = maxScroll > 0 ? clamp01(scrollTop / maxScroll) : 0;

  let activeIndex = 0;
  const next = sections.map((section, index) => {
    if (section.top <= scrollTop + viewportHeight * 0.5) activeIndex = index;
    const progress =
      section.height > 0 ? clamp01((scrollTop - section.top) / section.height) : 0;
    return { ...section, progress };
  });

  scrollStore.setState({ global, activeIndex, sections: next });
}

export function resetScroll() {
  scrollStore.setState(EMPTY);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
