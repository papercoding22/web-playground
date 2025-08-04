import type { CSSProperties } from "react";
import {
  HOUR_HEIGHT,
  START_HOUR,
  type Appointment,
  type CalendarEvent,
} from "./models";

const getOverlappingGroups = (eventsInDay: CalendarEvent[]) => {
  const groups: CalendarEvent[][] = [];

  eventsInDay.forEach((eventInDay) => {
    const eventInDayEndTime = eventInDay.startTime + eventInDay.duration / 60;

    const foundGroup = groups.find((group) => {
      return group.some((groupEvent) => {
        const groupEventEndTime =
          groupEvent.startTime + groupEvent.duration / 60;
        return (
          (eventInDay.startTime < groupEventEndTime &&
            eventInDayEndTime > groupEvent.startTime) ||
          (groupEvent.startTime < eventInDayEndTime &&
            groupEventEndTime > eventInDay.startTime)
        );
      });
    });

    if (foundGroup) {
      foundGroup.push(eventInDay);
    } else {
      groups.push([eventInDay]);
    }
  });

  let merged = true;

  while (merged) {
    merged = false;
    for (let i = 0; i < groups.length - 1; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const group1 = groups[i];
        const group2 = groups[j];

        // Check if any event in group1 overlaps with any in group2
        const hasOverlap = group1.some((event1) => {
          const event1End = event1.startTime + event1.duration / 60;
          return group2.some((event2) => {
            const event2End = event2.startTime + event2.duration / 60;
            return (
              (event1.startTime < event2End && event1End > event2.startTime) ||
              (event2.startTime < event1End && event2End > event1.startTime)
            );
          });
        });

        if (hasOverlap) {
          groups[i] = [...group1, ...group2];
          groups.splice(j, 1);
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }

  return groups;
};

const getBasicEventStyle = (
  eventsInDay: CalendarEvent[],
  event: CalendarEvent
): React.CSSProperties => {
  const groups = getOverlappingGroups(eventsInDay);

  const group = groups.find((g) => g.some((evt) => evt.id === event.id));

  if (!group || group.length === 1) {
    return {
      position: "absolute",
      top: `${(event.startTime - START_HOUR) * HOUR_HEIGHT}px`,
      height: `${(event.duration / 60) * HOUR_HEIGHT}px`,
      left: "4px",
      right: "4px",
      zIndex: 10,
    };
  }

  const sortedGroup = [...group].sort((a, b) => a.startTime - b.startTime);
  const eventIndex = sortedGroup.findIndex((evt) => evt.id === event.id);
  const totalOverlapping = group.length;
  const width = `calc((100% - 8px) / ${totalOverlapping})`;
  const leftOffset = `calc(4px + ((100% - 8px) / ${totalOverlapping}) * ${eventIndex})`;

  return {
    position: "absolute",
    top: `${(event.startTime - START_HOUR) * HOUR_HEIGHT}px`,
    height: `${(event.duration / 60) * HOUR_HEIGHT}px`,
    left: leftOffset,
    width: width,
    zIndex: 10 + eventIndex,
  };
};

const formatTime = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
};

export { getBasicEventStyle, formatTime };
