import type { CSSProperties } from "react";
import { HOUR_HEIGHT, START_HOUR, type Appointment } from "./models";

const getOverlappingGroups = (appointmentsInDay: Appointment[]) => {
  const groups: Appointment[][] = [];

  appointmentsInDay.forEach((aptInDay) => {
    const aptInDayEndTime = aptInDay.startTime + aptInDay.duration / 60;

    const foundGroup = groups.find((group) => {
      return group.some((groupApt) => {
        const groupAptEndTime = groupApt.startTime + groupApt.duration / 60;
        return (
          (aptInDay.startTime < groupAptEndTime &&
            aptInDayEndTime > groupApt.startTime) ||
          (groupApt.startTime < aptInDayEndTime &&
            groupAptEndTime > aptInDay.startTime)
        );
      });
    });

    if (foundGroup) {
      foundGroup.push(aptInDay);
    } else {
      groups.push([aptInDay]);
    }
  });

  let merged = true;

  while (merged) {
    merged = false;
    for (let i = 0; i < groups.length - 1; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const group1 = groups[i];
        const group2 = groups[j];

        // Check if any appointment in group1 overlaps with any in group2
        const hasOverlap = group1.some((apt1) => {
          const apt1End = apt1.startTime + apt1.duration / 60;
          return group2.some((apt2) => {
            const apt2End = apt2.startTime + apt2.duration / 60;
            return (
              (apt1.startTime < apt2End && apt1End > apt2.startTime) ||
              (apt2.startTime < apt1End && apt2End > apt1.startTime)
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

const getBasicAppointmentStyle = (
  appointmentsInDay: Appointment[],
  appointment: Appointment
): CSSProperties => {
  const groups = getOverlappingGroups(appointmentsInDay);

  const group = groups.find((g) => g.some((apt) => apt.id === appointment.id));

  if (!group || group.length === 1) {
    return {
      position: "absolute",
      top: `${(appointment.startTime - START_HOUR) * HOUR_HEIGHT}px`,
      height: `${(appointment.duration / 60) * HOUR_HEIGHT}px`,
      left: "4px",
      right: "4px",
      zIndex: 10,
    };
  }

  const sortedGroup = [...group].sort((a, b) => a.startTime - b.startTime);
  const appointmentIndex = sortedGroup.findIndex(
    (apt) => apt.id === appointment.id
  );
  const totalOverlapping = group.length;
  const width = `calc((100% - 8px) / ${totalOverlapping})`;
  const leftOffset = `calc(4px + ((100% - 8px) / ${totalOverlapping}) * ${appointmentIndex})`;

  return {
    position: "absolute",
    top: `${(appointment.startTime - START_HOUR) * HOUR_HEIGHT}px`,
    height: `${(appointment.duration / 60) * HOUR_HEIGHT}px`,
    left: leftOffset,
    width: width,
    zIndex: 10 + appointmentIndex,
  };
};

const formatTime = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
};

export { getBasicAppointmentStyle, formatTime };
